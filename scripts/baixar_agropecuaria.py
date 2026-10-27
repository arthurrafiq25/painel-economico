import json
import urllib.request

# SIDRA 5938 - Valor adicionado bruto da agropecuária, a preços correntes
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/513?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

agro = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    agro[uf_id] = int(valor) if valor != "..." else None

with open("public/agropecuaria-uf.json", "w", encoding="utf-8") as f:
    json.dump(agro, f, ensure_ascii=False)

print(f"Gerado public/agropecuaria-uf.json com {len(agro)} UFs")
