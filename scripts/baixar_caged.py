from comum import fetch_json, salvar
import json
import os
from comum import RAIZ

# SIDRA 7462 - Saldo de empregos formais (Caged) - N3 (UF) - Variável 4090
URL = "https://apisidra.ibge.gov.br/values/t/7462/n3/all/v/4090/p/last%201"

try:
    dados = fetch_json(URL)
    linhas = dados[1:]  # Pula o cabeçalho
    
    caged = {}
    for linha in linhas:
        uf_id = linha.get("D1C")
        valor = linha.get("V")
        if uf_id and valor and valor != "...":
            # Remove pontos de milhar, se houver
            valor_limpo = valor.replace(".", "").replace(",", ".")
            try:
                caged[uf_id] = int(float(valor_limpo))
            except ValueError:
                caged[uf_id] = 0
                
    with open(os.path.join(RAIZ, "public", "caged-uf.json"), "w", encoding="utf-8") as f:
        json.dump(caged, f, ensure_ascii=False)
    
    print(f"Gerado public/caged-uf.json com {len(caged)} UFs")
except Exception as e:
    print(f"Erro: {e}")