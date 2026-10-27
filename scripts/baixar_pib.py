import json
import urllib.request

URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/37?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

pib_por_uf = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    pib_por_uf[uf_id] = int(valor) if valor != "..." else None

with open("public/pib-uf.json", "w", encoding="utf-8") as f:
    json.dump(pib_por_uf, f, ensure_ascii=False)

print(f"Gerado public/pib-uf.json com {len(pib_por_uf)} UFs")