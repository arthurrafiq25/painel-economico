from comum import fetch_json, salvar

# API SIDRA - Tabela 6381: Taxa de desocupação (PNAD Contínua), Brasil
URL = "https://apisidra.ibge.gov.br/values/t/6381/n1/all/v/4099/p/last%201"

dados = fetch_json(URL)
linha = dados[1]  # primeira linha é cabeçalho

resultado = {
    "valor": float(linha["V"].replace(",", ".")),
    "periodo": linha["D3N"],  # ex: "nov-dez-jan 2025"
}
salvar("desemprego.json", resultado)