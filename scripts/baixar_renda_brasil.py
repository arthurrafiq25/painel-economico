from comum import baixar_sidra, salvar

print("Baixando renda média real do Brasil (PNAD)...")
# Tabela 6469, Variável 5935, Nível N1 (Brasil)
renda = baixar_sidra(tabela=6469, variavel=5935, periodo="last%201", nivel="n1")
salvar("renda-brasil.json", renda)