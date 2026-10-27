import json
import urllib.request

# SIDRA 6579 - População residente estimada, por UF
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2021/variaveis/9324?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

populacao = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    populacao[uf_id] = int(valor) if valor != "..." else None

with open("public/populacao-uf.json", "w", encoding="utf-8") as f:
    json.dump(populacao, f, ensure_ascii=False)

print(f"Gerado public/populacao-uf.json com {len(populacao)} UFs")