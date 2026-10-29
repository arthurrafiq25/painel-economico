from comum import fetch_json, salvar

# BCB SGS - série 432: Selic meta anualizada (% a.a.)
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"

dados = fetch_json(URL)
ultimo = dados[-1]

resultado = {
    "valor": float(ultimo["valor"]),
    "data": ultimo["data"],
}
salvar("selic.json", resultado)