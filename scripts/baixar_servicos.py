from comum import baixar_sidra, salvar

servicos = baixar_sidra(tabela=5938, variavel=6575, periodo=2021)
salvar("servicos-uf.json", servicos)