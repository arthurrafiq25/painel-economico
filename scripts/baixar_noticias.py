import xml.etree.ElementTree as ET
import urllib.request
import json
import os
import re
from comum import RAIZ

URL = "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml"

def fetch_xml(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

xml_data = fetch_xml(URL)
root = ET.fromstring(xml_data)

# Lista dos 27 estados (nome por extenso e sigla)
ESTADOS = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
}

noticias_por_estado = {sigla: [] for sigla in ESTADOS.values()}
noticias_por_estado["BR"] = [] # Notícias gerais (Brasil)

# O RSS usa a estrutura channel -> item
for item in root.findall(".//item")[:50]: # Pega as 50 primeiras notícias
    titulo = item.find("title").text if item.find("title") is not None else ""
    link = item.find("link").text if item.find("link") is not None else ""
    data = item.find("pubDate").text if item.find("pubDate") is not None else ""
    
    # Pega a descrição e limpa as tags HTML
    descricao_raw = item.find("description").text if item.find("description") is not None else ""
    descricao_limpa = re.sub(r'<[^>]+>', '', descricao_raw)
    descricao_limpa = " ".join(descricao_limpa.split())
    
    # Cria o dicionário da notícia com o texto completo
    noticia = {
        "titulo": titulo, 
        "link": link, 
        "data": data,
        "texto": descricao_limpa
    }
    
    # Adiciona sempre na lista geral do Brasil
    noticias_por_estado["BR"].append(noticia)
    
    # Verifica se o nome de algum estado aparece no título ou descrição
    texto_busca = titulo + " " + descricao_limpa
    for nome_estado, sigla in ESTADOS.items():
        if nome_estado in texto_busca:
            noticias_por_estado[sigla].append(noticia)

with open(os.path.join(RAIZ, "public", "noticias.json"), "w", encoding="utf-8") as f:
    json.dump(noticias_por_estado, f, ensure_ascii=False)

print(f"Gerado public/noticias.json com notícias para {len(noticias_por_estado)} estados + Brasil")