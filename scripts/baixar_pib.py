from comum import baixar_sidra, salvar

pib = baixar_sidra(tabela=5938, variavel=37, periodo=2021)
salvar("pib-uf.json", pib)