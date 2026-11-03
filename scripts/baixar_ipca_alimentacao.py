from comum import fetch_json, salvar

# BCB SGS - Série 1635: IPCA - Alimentação e bebidas (Variação acumulada em 12 meses)
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1635/dados/ultimos/1?formato=json"

dados = fetch_json(URL)
ultimo = dados[-1]

resultado = {
    "valor": float(ultimo["valor"]),
    "data": ultimo["data"],
}
salvar("ipca-alimentacao.json", resultado)