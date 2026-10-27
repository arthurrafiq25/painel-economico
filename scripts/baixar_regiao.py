import gzip
import json
import urllib.request

def fetch_json(url):
    req = urllib.request.Request(url, headers={"Accept-Encoding": "identity"})
    with urllib.request.urlopen(req) as r:
        data = r.read()
        if r.headers.get("Content-Encoding") == "gzip" or (len(data) > 2 and data[:2] == b"\x1f\x8b"):
            data = gzip.decompress(data)
        return json.loads(data.decode("utf-8"))

def baixar(var):
    url = f"https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2021/variaveis/{var}?localidades=N2[all]"
    dados = fetch_json(url)
    series = dados[0]["resultados"][0]["series"]
    out = {}
    for s in series:
        rid = s["localidade"]["id"]
        v = s["serie"]["2021"]
        out[rid] = int(v) if v != "..." else None
    return out

dados = {
    "pib": baixar(37),
    "agro": baixar(513),
    "industria": baixar(517),
    "servicos": baixar(6575),
    "administracao": baixar(525),
    "impostos": baixar(543),
}

URL_POP = "https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2021/variaveis/9324?localidades=N2[all]"
d = fetch_json(URL_POP)
series = d[0]["resultados"][0]["series"]
populacao = {}
for s in series:
    rid = s["localidade"]["id"]
    v = s["serie"]["2021"]
    populacao[rid] = int(v) if v != "..." else None

dados["populacao"] = populacao
dados["perCapita"] = {}
for rid, pib in dados["pib"].items():
    if rid in populacao and populacao[rid] and pib:
        dados["perCapita"][rid] = round((pib * 1000) / populacao[rid], 2)

with open("public/dados-regiao.json", "w", encoding="utf-8") as f:
    json.dump(dados, f, ensure_ascii=False)

print("Gerado public/dados-regiao.json")
print("Regiões:", list(dados["pib"].keys()))