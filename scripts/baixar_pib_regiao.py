import json
import urllib.request
import os
from comum import RAIZ

# SIDRA 5938 - PIB a preços correntes por Grande Região (N2)
URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/37?localidades=N2[all]"

with urllib.request.urlopen(URL) as r:
    dados = json.load(r)

series = dados[0]["resultados"][0]["series"]

pib_regiao = {}
for s in series:
    reg_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    pib_regiao[reg_id] = int(valor) if valor != "..." else None

with open(os.path.join(RAIZ, "public", "pib-regiao.json"), "w", encoding="utf-8") as f:
             json.dump(pib_regiao, f, ensure_ascii=False)

print(f"Gerado public/pib-regiao.json com {len(pib_regiao)} regiões")