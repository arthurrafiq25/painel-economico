# Ideias futuras — Painel Brasil

## 1. Notícias por estado no mapa
Links/cards flutuantes sobre cada UF com notícias relevantes daquele estado.
Fontes: RSS oficiais (Agência Brasil, IBGE Notícias) filtrados por UF.
Cuidado: só fontes oficiais, com link direto (imparcialidade).

## 2. Painel nacional em tempo real
Cards fixos no site com panorama do país:
- Dólar (BCB, várias vezes ao dia)
- Selic (BCB)
- IPCA (IBGE, mensal)
- PIB (IBGE, trimestral)
- Desemprego, etc.

## 3. Outros indicadores por UF (além do PIB)
- PIB per capita
- População
- Desemprego (PNAD)
- Caged (emprego formal)
- Exportações/importações (Comex Stat)
- IDH, Gini

## 4. Atualização automática
GitHub Actions rodando os scripts de madrugada, regravando os JSONs.
Projeto se auto-alimenta das fontes primárias sem intervenção manual.

## 5. Publicação
Vercel (grátis). Domínio próprio opcional (~R$40/ano).

## 6. Panorama histórico com calendário no topo
Mini calendário no topo do site (design Windows XP).
Usuário escolhe ano/década/século/período total.
O mapa se adapta ao período escolhido.

Limitações reais (para respeitar):
- PIB por UF: 1939+ (reconstrução), oficial 2002+
- PIB nacional: 1947+ (oficial), 1900+ (reconstrução acadêmica)
- População: 1872+ (Censos)
- Câmbio/inflação/dívida: 1940-1950+
- Fronteiras dos estados mudaram (Acre 1962, MT dividido 1977, etc.)
  → mapas antigos precisam usar a malha da época, não a atual.

Modos de visualização: anual, década, século, todo o período.

## 7. Painel guia (substitui "Sobre este painel")
O bloco abaixo do mapa deixa de ser estático e vira painel informativo.
Ao escolher um período no calendário, este painel descreve:
- contexto histórico
- geografia/fronteiras da época
- principais indicadores econômicos
- curiosidades e marcos
Mantém o minimalismo visual e o charme anos 90/2000.


## 8. Ranking de estados
Página (ou seção) com rankings por indicador:
- Estados mais populosos
- Maiores em área (km²)
- Maior PIB, PIB per capita
- Maior/menor desemprego
- etc.