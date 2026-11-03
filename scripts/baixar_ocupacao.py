from comum import fetch_json, salvar
import json
import os
from comum import RAIZ

# SIDRA 6463 - Pessoas de 14 anos ou mais de idade, ocupadas, por UF (N3)
# Variável 1641 = Pessoas de 14 anos ou mais (Precisamos filtrar a categoria "Ocupada")
# Mas o SIDRA tem a tabela específica para isso. Vamos testar a 6463 primeiro.
URL = "https://apisidra.ibge.gov.br/values/t/6463/n3/all/v/1641/p/last%201/c629/32387"

try:
    dados = fetch_json(URL)
    linhas = dados[1:]  # Pula o cabeçalho
    
    ocupacao = {}
    for linha in linhas:
        uf_id = linha.get("D1C")
        valor = linha.get("V")
        if uf_id and valor and valor != "...":
            # O valor vem em "Mil pessoas". Vamos converter para número absoluto (ex: 1000 = 1 milhão)
            valor_limpo = valor.replace(".", "").replace(",", ".")
            try:
                ocupacao[uf_id] = int(float(valor_limpo) * 1000)
            except ValueError:
                ocupacao[uf_id] = 0
                
    with open(os.path.join(RAIZ, "public", "ocupacao-uf.json"), "w", encoding="utf-8") as f:
        json.dump(ocupacao, f, ensure_ascii=False)
    
    print(f"Gerado public/ocupacao-uf.json com {len(ocupacao)} UFs")
except Exception as e:
    print(f"Erro: {e}")