from comum import fetch_json, salvar

URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13762/dados/ultimos/1?formato=json"
dados = fetch_json(URL)

if not dados:
    print("Dívida Pública: Nenhuma alteração.")
else:
    ultimo = dados[-1]
    resultado = {"valor": float(ultimo["valor"]), "data": ultimo["data"]}
    salvar("divida-publica.json", resultado)