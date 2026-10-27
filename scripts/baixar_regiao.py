from comum import baixar_sidra, salvar

dados = {
    "pib": baixar_sidra(tabela=5938, variavel=37, periodo=2021, nivel="n2"),
    "agro": baixar_sidra(tabela=5938, variavel=513, periodo=2021, nivel="n2"),
    "industria": baixar_sidra(tabela=5938, variavel=517, periodo=2021, nivel="n2"),
    "servicos": baixar_sidra(tabela=5938, variavel=6575, periodo=2021, nivel="n2"),
    "administracao": baixar_sidra(tabela=5938, variavel=525, periodo=2021, nivel="n2"),
    "impostos": baixar_sidra(tabela=5938, variavel=543, periodo=2021, nivel="n2"),
    "populacao": baixar_sidra(tabela=6579, variavel=9324, periodo=2021, nivel="n2"),
}

dados["perCapita"] = {}
for rid, pib in dados["pib"].items():
    pop = dados["populacao"].get(rid)
    if pop and pib:
        dados["perCapita"][rid] = round((pib * 1000) / pop, 2)

salvar("dados-regiao.json", dados)