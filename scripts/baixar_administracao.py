import json
import urllib.request

# SIDRA 5938 - Administração, defesa, educação e saúde públicas e seguridade social
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/525?localidades=N3[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

adm = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    adm[uf_id] = int(valor) if valor != "..." else None

with open("public/administracao-uf.json", "w", encoding="utf-8") as f:
    json.dump(adm, f, ensure_ascii=False)

print(f"Gerado public/administracao-uf.json com {len(adm)} UFs")