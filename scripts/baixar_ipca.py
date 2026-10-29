from comum import fetch_json, salvar

# BCB SGS - série 13522: IPCA acumulado em 12 meses (%)
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json"

dados = fetch_json(URL)
ultimo = dados[-1]

resultado = {
    "valor": float(ultimo["valor"]),
    "data": ultimo["data"],
}
salvar("ipca.json", resultado)