from comum import baixar_sidra, salvar

impostos = baixar_sidra(tabela=5938, variavel=543, periodo=2021)
salvar("impostos-uf.json", impostos)