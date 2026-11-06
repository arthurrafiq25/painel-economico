from comum import fetch_json, salvar

# API do Tesouro Transparente - Dívida Pública Federal (Série Histórica)
# Vamos buscar a Dívida Bruta do Governo Geral (DBGG) - % do PIB
# Série 4649 do SGS do Banco Central (usada como proxy do Tesouro)
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13762/dados/ultimos/1?formato=json"

try:
    dados = fetch_json(URL)
    ultimo = dados[-1]

    resultado = {
        "valor": float(ultimo["valor"]),
        "data": ultimo["data"],
    }
    salvar("divida-publica.json", resultado)
except Exception as e:
    print(f"Erro ao baixar dívida pública: {e}")