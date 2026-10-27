import json

with open("public/pib-uf.json", encoding="utf-8") as f:
    pib = json.load(f)

with open("public/populacao-uf.json", encoding="utf-8") as f:
    pop = json.load(f)

per_capita = {}
for uf_id, valor_pib in pib.items():
    if uf_id in pop and pop[uf_id] and valor_pib:
        # PIB em mil reais; população em pessoas. Resultado em reais.
        per_capita[uf_id] = round((valor_pib * 1000) / pop[uf_id], 2)

with open("public/pib-per-capita-uf.json", "w", encoding="utf-8") as f:
    json.dump(per_capita, f, ensure_ascii=False)

print(f"Gerado public/pib-per-capita-uf.json com {len(per_capita)} UFs")