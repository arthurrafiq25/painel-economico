from comum import baixar_sidra, salvar

industria = baixar_sidra(tabela=5938, variavel=517, periodo=2021)
salvar("industria-uf.json", industria)