from comum import fetch_json, salvar

URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"

dados = fetch_json(URL)

if not dados:
    print("Selic: Nenhuma alteração detectada.")
else:
    ultimo = dados[-1]
    resultado = {
        "valor": float(ultimo["valor"]),
        "data": ultimo["data"],
    }
    salvar("selic.json", resultado)