from comum import fetch_json, salvar

# BCB PTAX - série 1: dólar comercial (venda)
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json"

dados = fetch_json(URL)
ultimo = dados[-1]

resultado = {
    "valor": float(ultimo["valor"]),
    "data": ultimo["data"],
}
salvar("cambio.json", resultado)