import json
import time
import urllib.request

def fetch_json(url, tentativas=5, timeout=60):
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={"Accept-Encoding": "identity"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                data = r.read()
                return json.loads(data.decode("utf-8"))
        except Exception as e:
            print(f"Tentativa {i+1} falhou: {e}")
            if i == tentativas - 1:
                raise
            time.sleep(5)

def baixar_sidra(tabela, variavel, periodo, nivel="n3"):
    """
    Consulta a API do SIDRA (apisidra) e devolve um dicionário
    {codigo_localidade: valor_inteiro}.
    """
    url = f"https://apisidra.ibge.gov.br/values/t/{tabela}/{nivel}/all/v/{variavel}/p/{periodo}"
    dados = fetch_json(url)
    # Primeira linha é o cabeçalho, não dado
    linhas = dados[1:]
    resultado = {}
    for linha in linhas:
        loc = linha.get("D1C")  # código da localidade
        valor = linha.get("V")
        if loc and valor and valor != "...":
            try:
                resultado[loc] = int(valor)
            except ValueError:
                resultado[loc] = None
    return resultado

def salvar(nome_arquivo, dados):
    with open(f"public/{nome_arquivo}", "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False)
    print(f"Gerado public/{nome_arquivo} com {len(dados)} registros")