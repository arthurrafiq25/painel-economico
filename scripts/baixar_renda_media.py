from comum import baixar_sidra, salvar

print("Baixando renda média real (PNAD)...")
renda = baixar_sidra(tabela=6469, variavel=5935, periodo="last%201", nivel="n3")
salvar("renda-media-uf.json", renda)