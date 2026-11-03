import xml.etree.ElementTree as ET
import urllib.request
import json
import os
import re
from urllib.parse import quote
from comum import RAIZ

# Lista de estados com nome e sigla
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

def processar_feed(xml_data, fonte_nome):
    noticias = []
    if not xml_data: return noticias
    try:
        root = ET.fromstring(xml_data)
        for item in root.findall(".//item")[:10]:
            titulo = item.find("title").text if item.find("title") is not None else ""
            link = item.find("link").text if item.find("link") is not None else ""
            data = item.find("pubDate").text if item.find("pubDate") is not None else ""
            descricao_raw = item.find("description").text if item.find("description") is not None else ""
            
            # No Google News, a fonte original vem dentro da tag <source>
            source_tag = item.find("source")
            origem_real = source_tag.text if source_tag is not None else fonte_nome
            
            descricao_limpa = re.sub(r'<[^>]+>', '', descricao_raw)
            descricao_limpa = " ".join(descricao_limpa.split())
            
            noticias.append({
                "titulo": titulo,
                "link": link,
                "data": data,
                "resumo": descricao_limpa,
                "fonte": origem_real
            })
    except Exception as e:
        print(f"Erro ao processar XML: {e}")
    return noticias

# 1. Agência Brasil (Nacional)
print("Baixando Agência Brasil...")
xml_brasil = fetch_xml("https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml")
noticias_brasil = processar_feed(xml_brasil, "Agência Brasil")

noticias_por_estado = {"BR": noticias_brasil}

# 2. Google News + Sebrae (Por Estado)
for nome, sigla in ESTADOS.items():
    print(f"Baixando notícias para {nome} ({sigla})...")
    lista_estado = []
    
    # Google News
    termo_busca = quote(f'"{nome}" noticias')
    url_google = f"https://news.google.com/rss/search?q={termo_busca}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    xml_google = fetch_xml(url_google)
    lista_estado.extend(processar_feed(xml_google, "Google News"))
    
    # Sebrae
    url_sebrae = f"https://agenciasebrae.com.br/feed/?uf={sigla.lower()}"
    xml_sebrae = fetch_xml(url_sebrae)
    lista_estado.extend(processar_feed(xml_sebrae, "Sebrae"))
    
    # Agência Brasil (Filtro por nome do estado)
    for noticia in noticias_brasil:
        if nome in (noticia["titulo"] + noticia["resumo"]):
            lista_estado.append(noticia)
            
    # Remove duplicatas pelo link
    lista_unica = []
    links_vistos = set()
    for n in lista_estado:
        if n["link"] not in links_vistos:
            lista_unica.append(n)
            links_vistos.add(n["link"])
            
    noticias_por_estado[sigla] = lista_unica

with open(os.path.join(RAIZ, "public", "noticias.json"), "w", encoding="utf-8") as f:
    json.dump(noticias_por_estado, f, ensure_ascii=False)

print("Concluído! Notícias atualizadas para Brasil + 27 estados.")