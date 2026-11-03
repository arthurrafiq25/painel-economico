import json
import os
import ssl
import urllib.request
import csv
import io
from comum import RAIZ

# Ignora a verificação de certificado (o site do governo tem certificado inválido)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

URL_EXP = "https://balanca.mdic.gov.br/balanca/bd/comexstat-bd/ncm/EXP_2026.csv"
URL_IMP = "https://balanca.mdic.gov.br/balanca/bd/comexstat-bd/ncm/IMP_2026.csv"

def baixar_e_somar(url, nome_arquivo):
    print(f"Baixando {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
            # Lê o CSV direto do fluxo da internet
            # O arquivo usa ';' como separador e latin-1 (padrão antigo do governo)
            texto = io.TextIOWrapper(r, encoding="latin-1")
            leitor = csv.DictReader(texto, delimiter=";")
            
            # Descobre os nomes exatos das colunas
            headers = leitor.fieldnames
            
            # Mapeamento de Sigla para Código IBGE
            UF_IBGE = {
                "AC": "12", "AL": "27", "AP": "16", "AM": "13", "BA": "29", "CE": "23",
                "DF": "53", "ES": "32", "GO": "52", "MA": "21", "MT": "51", "MS": "50",
                "MG": "31", "PA": "15", "PB": "25", "PR": "41", "PE": "26", "PI": "22",
                "RJ": "33", "RN": "24", "RS": "43", "RO": "11", "RR": "14", "SC": "42",
                "SP": "35", "SE": "28", "TO": "17"
            }
            
            totais = {}
            for linha in leitor:
                uf = linha.get("SG_UF_NCM")
                valor = linha.get("VL_FOB")
                
                if uf and valor:
                    if uf not in totais:
                        totais[uf] = 0
                    try:
                        totais[uf] += float(valor)
                    except ValueError:
                        pass
            
            # Converte siglas para código IBGE
            resultado = {}
            for sigla, total in totais.items():
                if sigla in UF_IBGE:
                    resultado[UF_IBGE[sigla]] = int(total)
            
            with open(os.path.join(RAIZ, "public", nome_arquivo), "w", encoding="utf-8") as f:
                json.dump(resultado, f, ensure_ascii=False)
                
            print(f"Gerado public/{nome_arquivo} com {len(resultado)} UFs")
            
    except Exception as e:
        print(f"Erro ao baixar {url}: {e}")

baixar_e_somar(URL_EXP, "exportacoes.json")
baixar_e_somar(URL_IMP, "importacoes.json")