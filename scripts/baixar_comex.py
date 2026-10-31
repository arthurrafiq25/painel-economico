import json
import urllib.request
import os
from comum import RAIZ

# API do Comex Stat (MDIC) - Exportações por UF no ano de 2023
URL = "https://api.comexstat.mdic.gov.br/general?flow=export&year=2023&type=NCM&filter=state"

try:
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        dados = json.load(r)
    
    # O Comex devolve uma lista com os dados. Vamos extrair por estado.
    # O código do estado no Comex é o mesmo do IBGE (ex: 35 para SP)
    exportacoes = {}
    
    # Na API do Comex, os dados vêm dentro de uma chave "data" ou similar
    # Vamos salvar o JSON bruto primeiro para conferir o formato
    with open(os.path.join(RAIZ, "public", "comex-debug.json"), "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    
    print("Gerado public/comex-debug.json. Abra para ver o formato.")
except Exception as e:
    print(f"Erro: {e}")