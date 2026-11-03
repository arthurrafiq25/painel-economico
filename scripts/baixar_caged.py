
# scripts/etl_caged.py

import json
import re
import shutil
from pathlib import Path
from ftplib import FTP
from collections import defaultdict

import pandas as pd
import py7zr


# ==========================================
# CONFIGURAÇÕES
# ==========================================

FTP_HOST = "ftp.mtps.gov.br"

FTP_DIR = "/pdet/microdados/NOVO CAGED"

PASTA = Path("dados/caged")

PASTA_DOWNLOAD = PASTA / "downloads"
PASTA_EXTRAIDA = PASTA / "extraidos"

SAIDA = Path("public/emprego.json")

CHUNK_SIZE = 250_000

HEADERS = {
    "12": "AC",
    "27": "AL",
    "16": "AP",
    "13": "AM",
    "29": "BA",
    "23": "CE",
    "53": "DF",
    "32": "ES",
    "52": "GO",
    "21": "MA",
    "51": "MT",
    "50": "MS",
    "31": "MG",
    "15": "PA",
    "25": "PB",
    "41": "PR",
    "26": "PE",
    "22": "PI",
    "33": "RJ",
    "24": "RN",
    "43": "RS",
    "11": "RO",
    "14": "RR",
    "42": "SC",
    "35": "SP",
    "28": "SE",
    "17": "TO",
}


# ==========================================
# CONEXÃO E DESCOBERTA
# ==========================================

def conectar_ftp():

    ftp = FTP(FTP_HOST, timeout=60, encoding="latin-1")
    ftp.login()
    ftp.set_pasv(True)

    return ftp


def listar_competencias(ftp):

    competencias = []

    ftp.cwd(FTP_DIR)

    anos = ftp.nlst()

    for ano in anos:

        ano = ano.rstrip("/")

        if not re.fullmatch(r"\d{4}", ano):
            continue

        try:
            ftp.cwd(f"{FTP_DIR}/{ano}")
            meses = ftp.nlst()

            for mes in meses:

                mes = mes.rstrip("/")

                if not re.fullmatch(r"\d{6}", mes):
                    continue

                if not mes.startswith(ano):
                    continue

                try:
                    ftp.cwd(
                        f"{FTP_DIR}/{ano}/{mes}"
                    )

                    arquivos = ftp.nlst()

                    nome_mov = f"CAGEDMOV{mes}.7z"

                    if nome_mov in [
                        x.split("/")[-1]
                        for x in arquivos
                    ]:
                        competencias.append(mes)

                except Exception:
                    continue

        except Exception:
            continue

    if not competencias:
        raise RuntimeError(
            "Nenhuma competência MOV encontrada no FTP."
        )

    return sorted(set(competencias))


# ==========================================
# DOWNLOAD
# ==========================================

def baixar_arquivo(ftp, competencia, tipo):

    ano = competencia[:4]

    nome = f"CAGED{tipo}{competencia}.7z"

    diretorio = f"{FTP_DIR}/{ano}/{competencia}"

    ftp.cwd(diretorio)

    arquivos = [
        x.split("/")[-1]
        for x in ftp.nlst()
    ]

    if nome not in arquivos:
        print(f"Arquivo não disponível: {nome}")
        return None

    destino = PASTA_DOWNLOAD / nome

    if destino.exists() and destino.stat().st_size > 0:
        print(f"Já baixado: {nome}")
        return destino

    print(f"Baixando: {nome}")

    with destino.open("wb") as arquivo:

        ftp.retrbinary(
            f"RETR {nome}",
            arquivo.write,
            blocksize=1024 * 1024
        )

    return destino


# ==========================================
# EXTRAÇÃO 7Z
# ==========================================

def extrair_arquivo(arquivo):

    destino = PASTA_EXTRAIDA / arquivo.stem

    if destino.exists():
        shutil.rmtree(destino)

    destino.mkdir(
        parents=True,
        exist_ok=True
    )

    print(f"Extraindo: {arquivo.name}")

    with py7zr.SevenZipFile(
        arquivo,
        mode="r"
    ) as z:

        z.extractall(path=destino)

    txt_files = list(destino.rglob("*.txt"))

    if not txt_files:
        raise RuntimeError(
            f"Nenhum TXT encontrado em {arquivo.name}"
        )

    return txt_files[0]


# ==========================================
# PROCESSAMENTO DOS REGISTROS
# ==========================================

def processar_txt(
    caminho,
    competencia_alvo,
    tipo,
    saldos
):

    print(f"Processando {tipo}: {caminho.name}")

    total = 0

    for df in pd.read_csv(
        caminho,
        sep=";",
        encoding="utf-8",
        dtype=str,
        chunksize=CHUNK_SIZE,
        low_memory=False
    ):

        # Normalizar nomes das colunas (tirar espaços, mas manter acentos)
        df.columns = [str(c).strip().lower() for c in df.columns]

        # Nomes exatos das colunas no arquivo do Caged
        col_uf = "uf"
        col_comp = "competênciamov"
        col_saldo = "saldomovimentação"

        obrigatorias = {col_uf, col_comp, col_saldo}
        faltantes = obrigatorias - set(df.columns)

        if faltantes:
            raise RuntimeError(f"Colunas ausentes: {faltantes}")

        # Filtrar competência
        df[col_comp] = df[col_comp].str.strip()
        df = df[df[col_comp] == competencia_alvo]

        if df.empty:
            continue

        df[col_uf] = df[col_uf].str.strip().str.zfill(2)

        df[col_saldo] = pd.to_numeric(df[col_saldo], errors="coerce")
        df = df.dropna(subset=[col_saldo])

        # Exclusões anulam o movimento original.
        if tipo == "EXC":
            df[col_saldo] *= -1

        agrupado = df.groupby(col_uf)[col_saldo].sum()

        for uf, saldo in agrupado.items():
            if uf in saldos:
                saldos[uf] += int(saldo)

        total += len(df)

    print(f"Registros da competência encontrados: {total}")


# ==========================================
# ETL PRINCIPAL
# ==========================================

def main():

    PASTA_DOWNLOAD.mkdir(
        parents=True,
        exist_ok=True
    )

    PASTA_EXTRAIDA.mkdir(
        parents=True,
        exist_ok=True
    )

    # Inicializa todas as UFs
    saldos = {
        uf: 0
        for uf in HEADERS
    }

    ftp = conectar_ftp()

    try:

        competencias = listar_competencias(ftp)

        competencia = competencias[-1]

        print("\nCompetência mais recente:", competencia)

        arquivos = {}

        # Baixa os três tipos de arquivos
        for tipo in ("MOV", "FOR", "EXC"):

            arquivos[tipo] = baixar_arquivo(
                ftp,
                competencia,
                tipo
            )

    finally:
        ftp.quit()

    # MOV é obrigatório
    if arquivos["MOV"] is None:
        raise RuntimeError(
            "Arquivo MOV obrigatório não encontrado."
        )

    # Processar MOV, FOR e EXC
    for tipo in ("MOV", "FOR", "EXC"):

        arquivo = arquivos[tipo]

        if arquivo is None:
            continue

        txt = extrair_arquivo(arquivo)

        processar_txt(
            caminho=txt,
            competencia_alvo=competencia,
            tipo=tipo,
            saldos=saldos
        )

    # Converter resultados para inteiros
    resultado = {
        uf: int(saldo)
        for uf, saldo in saldos.items()
    }

    SAIDA.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        SAIDA,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            resultado,
            f,
            ensure_ascii=False,
            indent=2
        )

    print("\nCAGED PROCESSADO")
    print("Competência:", competencia)
    print("Estados:", len(resultado))
    print("Saldo nacional:", sum(resultado.values()))
    print("Arquivo:", SAIDA)


if __name__ == "__main__":
    main()
