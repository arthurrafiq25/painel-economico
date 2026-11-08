from comum import fetch_json, salvar

URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json"

dados = fetch_json(URL)

# Se vier vazio (erro 304), não faz nada
if not dados:
    print("IPCA: Nenhuma alteração detectada.")
else:
    ultimo = dados[-1]
    resultado = {
        "valor": float(ultimo["valor"]),
        "data": ultimo["data"],
    }
    salvar("ipca.json", resultado)