import json
import urllib.request

# SIDRA 5938 - Impostos, líquidos de subsídios, sobre produtos
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/543?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

impostos = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    impostos[uf_id] = int(valor) if valor != "..." else None

with open("public/impostos-uf.json", "w", encoding="utf-8") as f:
    json.dump(impostos, f, ensure_ascii=False)

print(f"Gerado public/impostos-uf.json com {len(impostos)} UFs")