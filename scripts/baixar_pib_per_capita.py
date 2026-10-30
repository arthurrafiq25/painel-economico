import json
import os
from comum import salvar, RAIZ

with open(os.path.join(RAIZ, "public", "pib-uf.json"), encoding="utf-8") as f:
    pib = json.load(f)

with open(os.path.join(RAIZ, "public", "populacao-uf.json"), encoding="utf-8") as f:
    pop = json.load(f)

per_capita = {}
for uf_id, valor_pib in pib.items():
    if uf_id in pop and pop[uf_id] and valor_pib:
        per_capita[uf_id] = round((valor_pib * 1000) / pop[uf_id], 2)

salvar("pib-per-capita-uf.json", per_capita)