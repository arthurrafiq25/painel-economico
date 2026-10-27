from comum import baixar_sidra, salvar

pop = baixar_sidra(tabela=6579, variavel=9324, periodo=2021)
salvar("populacao-uf.json", pop)