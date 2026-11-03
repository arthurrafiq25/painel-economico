import urllib.request
import csv
import io
import os
import json
from comum import RAIZ

# URL do arquivo de preços da ANP (Semanal)
URL = "https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/shpc/dsas/ca/ca-2024-11.csv"

def fetch_csv(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            # A ANP usa Latin-1 ou UTF-8 dependendo do arquivo, vamos tentar UTF-8 com fallback
            try:
                return r.read().decode("utf-8")
            except:
                return r.read().decode("latin-1")
    except Exception as e:
        print(f"Erro ao baixar ANP: {e}")
        return None

csv_data = fetch_csv(URL)
if csv_data:
    # Usamos o csv.reader com delimitador ';' (padrão ANP)
    leitor = csv.DictReader(io.StringIO(csv_data), delimiter=";")
    
    # Como o arquivo é grande, vamos extrair a média nacional da gasolina para simplificar
    # (Ou podemos extrair por estado se preferir)
    precos_gasolina = []
    
    for linha in leitor:
        # A ANP muda os nomes das colunas dependendo do ano, mas "Produto" e "Valor de Venda" são comuns
        produto = linha.get("Produto", "")
        valor = linha.get("Valor de Venda", "")
        
        if "GASOLINA" in produto.upper() and valor:
            try:
                # A ANP usa vírgula no decimal (ex: 5,89)
                valor_float = float(valor.replace(",", "."))
                precos_gasolina.append(valor_float)
            except:
                pass
                
    if precos_gasolina:
        media = sum(precos_gasolina) / len(precos_gasolina)
        resultado = {"valor": round(media, 2)}
        
        with open(os.path.join(RAIZ, "public", "combustivel.json"), "w", encoding="utf-8") as f:
            json.dump(resultado, f, ensure_ascii=False)
            
        print(f"Gerado public/combustivel.json. Preço médio da gasolina: R$ {media:.2f}")
    else:
        print("Nenhum preço de gasolina encontrado no arquivo.")