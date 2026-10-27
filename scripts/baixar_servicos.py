import json
import urllib.request

# SIDRA 5938 - Serviços (exceto administração pública)
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/6575?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

servicos = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    servicos[uf_id] = int(valor) if valor != "..." else None

with open("public/servicos-uf.json", "w", encoding="utf-8") as f:
    json.dump(servicos, f, ensure_ascii=False)

print(f"Gerado public/servicos-uf.json com {len(servicos)} UFs")