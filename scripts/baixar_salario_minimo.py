from comum import fetch_json, salvar

URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1619/dados/ultimos/1?formato=json"
dados = fetch_json(URL)

if not dados:
    print("Salário Mínimo: Nenhuma alteração.")
else:
    ultimo = dados[-1]
    resultado = {"valor": float(ultimo["valor"]), "data": ultimo["data"]}
    salvar("salario-minimo.json", resultado)