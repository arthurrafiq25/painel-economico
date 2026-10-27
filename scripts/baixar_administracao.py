from comum import baixar_sidra, salvar

adm = baixar_sidra(tabela=5938, variavel=525, periodo=2021)
salvar("administracao-uf.json", adm)