from comum import fetch_json, salvar

URL = "https://apisidra.ibge.gov.br/values/t/6381/n1/all/v/4099/p/last%201"
dados = fetch_json(URL)

if not dados:
    print("Desemprego: Nenhuma alteração.")
else:
    linha = dados[1]
    resultado = {
        "valor": float(linha["V"].replace(",", ".")),
        "periodo": linha["D3N"],
    }
    salvar("desemprego.json", resultado)