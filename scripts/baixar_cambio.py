from comum import fetch_json, salvar

URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json"

dados = fetch_json(URL)

if not dados:
    print("Câmbio: Nenhuma alteração detectada.")
else:
    ultimo = dados[-1]
    resultado = {
        "valor": float(ultimo["valor"]),
        "data": ultimo["data"],
    }
    salvar("cambio.json", resultado)