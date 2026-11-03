
# scripts/etl_anp.py

import json
import re
import unicodedata
from pathlib import Path

import pandas as pd
import requests
from bs4 import BeautifulSoup


# ==========================================
# CONFIGURAÇÕES
# ==========================================

URL_PAGINA = (
    "https://www.gov.br/anp/pt-br/assuntos/"
    "precos-e-defesa-da-concorrencia/precos/"
    "levantamento-de-precos-de-combustiveis-"
    "ultimas-semanas-pesquisadas"
)

SAIDA = Path("public/combustiveis.json")

HEADERS = {
    "User-Agent": "PainelNacional/1.0"
}

# Códigos oficiais IBGE das UFs
UF_IBGE = {
    "ACRE": "12",
    "ALAGOAS": "27",
    "AMAPA": "16",
    "AMAZONAS": "13",
    "BAHIA": "29",
    "CEARA": "23",
    "DISTRITO FEDERAL": "53",
    "ESPIRITO SANTO": "32",
    "GOIAS": "52",
    "MARANHAO": "21",
    "MATO GROSSO": "51",
    "MATO GROSSO DO SUL": "50",
    "MINAS GERAIS": "31",
    "PARA": "15",
    "PARAIBA": "25",
    "PARANA": "41",
    "PERNAMBUCO": "26",
    "PIAUI": "22",
    "RIO DE JANEIRO": "33",
    "RIO GRANDE DO NORTE": "24",
    "RIO GRANDE DO SUL": "43",
    "RONDONIA": "11",
    "RORAIMA": "14",
    "SANTA CATARINA": "42",
    "SAO PAULO": "35",
    "SERGIPE": "28",
    "TOCANTINS": "17",
}


def normalizar(texto):
    texto = str(texto).strip().upper()

    texto = unicodedata.normalize(
        "NFKD", texto
    ).encode("ASCII", "ignore").decode("ASCII")

    return re.sub(r"\s+", " ", texto)


# ==========================================
# DESCOBRIR XLSX MAIS RECENTE
# ==========================================

def encontrar_planilha():
    print("Consultando página oficial da ANP...")

    response = requests.get(
        URL_PAGINA,
        headers=HEADERS,
        timeout=40
    )
    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    arquivos = []

    for link in soup.find_all("a", href=True):
        href = link["href"]

        if (
            "arquivos-lpc/" in href
            and "resumo_semanal_lpc_" in href.lower()
            and href.lower().endswith((".xlsx", ".xlsx/view"))
        ):
            match = re.search(
                r"resumo_semanal_lpc_(\d{4})-(\d{2})-(\d{2})"
                r"[_-](\d{4})-(\d{2})-(\d{2})",
                href,
                re.I
            )

            if match:
                data_final = (
                    match.group(4)
                    + match.group(5)
                    + match.group(6)
                )

                # Remove /view quando existir
                url = href.split("/view")[0]

                if url.startswith("/"):
                    url = "https://www.gov.br" + url

                arquivos.append((data_final, url))

    if not arquivos:
        raise RuntimeError(
            "Não foi possível localizar o XLSX semanal da ANP."
        )

    arquivos.sort(reverse=True)

    return arquivos[0][1]


# ==========================================
# IDENTIFICAR ABA E CABEÇALHO
# ==========================================

def encontrar_tabela_estados(excel):
    for aba in excel.sheet_names:
        nome_aba = normalizar(aba)
        if nome_aba != "ESTADOS":
            continue

        # Lemos direto a partir da linha 9, que é onde o cabeçalho realmente começa
        df = pd.read_excel(excel, sheet_name=aba, header=9)
        
        colunas = {
            normalizar(c): c
            for c in df.columns
        }

        # Busca pelas colunas considerando as variações de nome
        estado = next(
            (v for k, v in colunas.items() if k in ("ESTADO", "ESTADOS", "UF")),
            None
        )
        produto = next(
            (v for k, v in colunas.items() if "PRODUTO" in k),
            None
        )
        preco = next(
            (v for k, v in colunas.items() if "PRECO MEDIO REVENDA" in k or "PRECO MEDIO" in k),
            None
        )

        if estado and produto and preco:
            return df, estado, produto, preco

    raise RuntimeError("Não encontrei as colunas necessárias na aba ESTADOS.")


# ==========================================
# PROCESSAMENTO
# ==========================================

def main():

    url = encontrar_planilha()

    print("Planilha encontrada:")
    print(url)

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=120
    )
    response.raise_for_status()

    # Abre o Excel em memória
    from io import BytesIO

    excel = pd.ExcelFile(
        BytesIO(response.content),
        engine="openpyxl"
    )

    df, col_estado, col_produto, col_preco = (
        encontrar_tabela_estados(excel)
    )

    # Filtrar gasolina comum
    df["_produto"] = df[col_produto].apply(normalizar)

    df = df[
        df["_produto"].str.contains(
            "GASOLINA COMUM",
            na=False
        )
    ].copy()

    resultado = {}

    for _, row in df.iterrows():

        estado = normalizar(row[col_estado])

        codigo = UF_IBGE.get(estado)

        if not codigo:
            continue

        preco = pd.to_numeric(
            row[col_preco],
            errors="coerce"
        )

        if pd.notna(preco) and preco > 0:
            resultado[codigo] = round(float(preco), 3)

    if len(resultado) < 20:
        raise RuntimeError(
            f"Poucos estados encontrados: {len(resultado)}. "
            "Verifique o leiaute da planilha."
        )

    SAIDA.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(SAIDA, "w", encoding="utf-8") as f:
        json.dump(
            resultado,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"\nANP: {len(resultado)} UFs processadas.")
    print("Arquivo gerado:", SAIDA)


if __name__ == "__main__":
    main()
