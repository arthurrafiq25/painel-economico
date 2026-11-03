import xml.etree.ElementTree as ET
import urllib.request
import json
import os
import re
from comum import RAIZ

# Dicionário de siglas para os feeds do Sebrae
SIGLAS_UF = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]

ESTADOS = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
}

def fetch_xml(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read()
    except Exception as e:
        print(f"Erro ao baixar {url}: {e}")
        return None

def processar_feed(xml_data, sigla_origem=None):
    noticias = []
    if not xml_data: return noticias
    try:
        root = ET.fromstring(xml_data)
        for item in root.findall(".//item")[:15]:
            titulo = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            data = item.find("pubDate").text if item.find("pubDate") is not None else ""
            descricao_raw = item.find("description").text if item.find("description") is not None else ""
            
            descricao_limpa = re.sub(r'<[^>]+>', '', descricao_raw)
            descricao_limpa = " ".join(descricao_limpa.split())
            
            noticias.append({
                "titulo": titulo,
                "link": link,
                "data": data,
                "texto": descricao_limpa,
                "origem": "Agência Brasil" if not sigla_origem else "Sebrae"
            })
    except Exception as e:
        print(f"Erro ao processar XML: {e}")
    return noticias

# 1. Baixa Agência Brasil (Nacional)
print("Baixando Agência Brasil...")
xml_brasil = fetch_xml("https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml")
noticias_brasil = processar_feed(xml_brasil)

# 2. Baixa Sebrae (Por Estado)
noticias_por_estado = {sigla: [] for sigla in ESTADOS.values()}
noticias_por_estado["BR"] = noticias_brasil

for sigla in SIGLAS_UF:
    print(f"Baixando Sebrae {sigla}...")
    url = f"https://agenciasebrae.com.br/feed/?uf={sigla.lower()}"
    xml_estado = fetch_xml(url)
    noticias_estado = processar_feed(xml_estado, sigla_origem=sigla)
    
    # Adiciona as notícias do Sebrae à lista do estado
    noticias_por_estado[sigla].extend(noticias_estado)
    
    # Verifica se o nome do estado aparece nas notícias nacionais e adiciona lá também
    for nome_estado, s in ESTADOS.items():
        if s == sigla:
            for noticia in noticias_brasil:
                if nome_estado in (noticia["titulo"] + noticia["texto"]):
                    # Evita duplicar
                    if not any(n["link"] == noticia["link"] for n in noticias_por_estado[sigla]):
                        noticias_por_estado[sigla].append(noticia)

with open(os.path.join(RAIZ, "public", "noticias.json"), "w", encoding="utf-8") as f:
    json.dump(noticias_por_estado, f, ensure_ascii=False)

print(f"Concluído! Notícias geradas para 28 chaves (Brasil + 27 estados).")