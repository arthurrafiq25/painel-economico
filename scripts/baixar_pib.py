import json
import time
import urllib.request

URL = "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/37?localidades=N3[all]"

def fetch(url, tentativas=5, timeout=60):
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

dados = fetch(URL)
series = dados[0]["resultados"][0]["series"]

pib_por_uf = {}
for s in series:
    uf_id = s["localidade"]["id"]
    valor = s["serie"]["2021"]
    pib_por_uf[uf_id] = int(valor) if valor != "..." else None

with open("public/pib-uf.json", "w", encoding="utf-8") as f:
    json.dump(pib_por_uf, f, ensure_ascii=False)

print(f"Gerado public/pib-uf.json com {len(pib_por_uf)} UFs")