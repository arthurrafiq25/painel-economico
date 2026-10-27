from comum import baixar_sidra, salvar

agro = baixar_sidra(tabela=5938, variavel=513, periodo=2021)
salvar("agropecuaria-uf.json", agro)