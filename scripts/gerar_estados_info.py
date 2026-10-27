import json

estados = {
  "11": {"capital": "Porto Velho", "regiao": "Norte", "fuso": "UTC−4"},
  "12": {"capital": "Rio Branco", "regiao": "Norte", "fuso": "UTC−5"},
  "13": {"capital": "Manaus", "regiao": "Norte", "fuso": "UTC−4"},
  "14": {"capital": "Boa Vista", "regiao": "Norte", "fuso": "UTC−4"},
  "15": {"capital": "Belém", "regiao": "Norte", "fuso": "UTC−3"},
  "16": {"capital": "Macapá", "regiao": "Norte", "fuso": "UTC−3"},
  "17": {"capital": "Palmas", "regiao": "Norte", "fuso": "UTC−3"},
  "21": {"capital": "São Luís", "regiao": "Nordeste", "fuso": "UTC−3"},
  "22": {"capital": "Teresina", "regiao": "Nordeste", "fuso": "UTC−3"},
  "23": {"capital": "Fortaleza", "regiao": "Nordeste", "fuso": "UTC−3"},
  "24": {"capital": "Natal", "regiao": "Nordeste", "fuso": "UTC−3"},
  "25": {"capital": "João Pessoa", "regiao": "Nordeste", "fuso": "UTC−3"},
  "26": {"capital": "Recife", "regiao": "Nordeste", "fuso": "UTC−3"},
  "27": {"capital": "Maceió", "regiao": "Nordeste", "fuso": "UTC−3"},
  "28": {"capital": "Aracaju", "regiao": "Nordeste", "fuso": "UTC−3"},
  "29": {"capital": "Salvador", "regiao": "Nordeste", "fuso": "UTC−3"},
  "31": {"capital": "Belo Horizonte", "regiao": "Sudeste", "fuso": "UTC−3"},
  "32": {"capital": "Vitória", "regiao": "Sudeste", "fuso": "UTC−3"},
  "33": {"capital": "Rio de Janeiro", "regiao": "Sudeste", "fuso": "UTC−3"},
  "35": {"capital": "São Paulo", "regiao": "Sudeste", "fuso": "UTC−3"},
  "41": {"capital": "Curitiba", "regiao": "Sul", "fuso": "UTC−3"},
  "42": {"capital": "Florianópolis", "regiao": "Sul", "fuso": "UTC−3"},
  "43": {"capital": "Porto Alegre", "regiao": "Sul", "fuso": "UTC−3"},
  "50": {"capital": "Campo Grande", "regiao": "Centro-Oeste", "fuso": "UTC−4"},
  "51": {"capital": "Cuiabá", "regiao": "Centro-Oeste", "fuso": "UTC−4"},
  "52": {"capital": "Goiânia", "regiao": "Centro-Oeste", "fuso": "UTC−3"},
  "53": {"capital": "Brasília", "regiao": "Centro-Oeste", "fuso": "UTC−3"},
}

with open("public/estados-info.json", "w", encoding="utf-8") as f:
    json.dump(estados, f, ensure_ascii=False, indent=2)

print(f"Gerado public/estados-info.json com {len(estados)} UFs")