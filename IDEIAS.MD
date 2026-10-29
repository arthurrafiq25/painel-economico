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


## 9. Comparação individual de estados (anti-briga regional)
Mostrar no painel de cada estado:
- Posição do estado no ranking nacional daquele indicador (ex.: "PIB: 3º de 27")
- Posição da região no ranking das 5 regiões (ex.: "Sudeste: 1ª de 5")
Objetivo: dar contexto comparativo individual, sem incentivar rivalidade regional.


## 10. Regra geral: link e fonte em TODA informação
Toda informação no site (automatizada ou manual) deve exibir:
- link para a fonte oficial
- data da última atualização
- (quando manual) a data da última verificação legislativa

## 11. Parâmetros para MEI / Simples Nacional (manual)
Dados que mudam por lei, não por API. Curadoria manual.
- Teto de faturamento do MEI (atual: R$ 81.000/ano)
- Valor do DAS mensal do MEI
- Teto do Simples Nacional (R$ 4,8 milhões/ano)
- Faixas e alíquotas do Simples
- Salário mínimo (afeta o DAS do MEI)
Fontes: Portal do Empreendedor (gov.br), Receita Federal, LC 123/2006.

## 12. Página "Fontes"
Seção fixa (rodapé ou página própria) com links para as fontes oficiais:
- IBGE (SIDRA, Cidades)
- Banco Central (SGS, Focus)
- Tesouro Nacional
- Comex Stat
- ANP (combustíveis)
- Portal do Empreendedor
- Receita Federal
- DIEESE
- IPEADATA
Cada link com uma linha do tipo "o que você encontra lá".

## 13. Custo de vida / poder de compra
- IPCA geral e IPCA Alimentação (IBGE, mensal)
- Preço médio de combustíveis (ANP, semanal)
- Renda média real (PNAD Contínua, trimestral)
- Salário mínimo real
- Cesta básica (DIEESE)


## 14. Câmbio em tempo real + calculadora
- Cotação de moedas (BCB PTAX e/ou exchangerate.host)
- Atualização a cada poucas horas (não segundo a segundo — indisponível grátis)
- Cada card exibe horário da última cotação
- Calculadora de conversão entre moedas (valor + moeda origem + moeda destino)

## 15. Conteúdo institucional (manual, com link para fonte oficial)
- Constituição Federal (link para o texto no Planalto)
- Temas constitucionais organizados:
  - Direitos e Garantias Fundamentais (Art. 5º)
  - Educação (Art. 205-208) e Lei 8.080 (SUS)
  - Previdência Social
  - Direitos Trabalhistas (férias, 13º, licenças, FGTS)
  - Organização do Estado (União/Estados/Municípios + três poderes)
- Sistema Tributário: tipos de tributos, quem cobra, Reforma Tributária (CBS/IBS/IS)
- Estrutura do Executivo: ministérios
- Estrutura do Legislativo: 513 deputados federais, 81 senadores, assembleias estaduais

## 16. Informações geográficas por estado (manual)
- Bioma predominante
- Relevo principal
- Clima predominante
- Área territorial (km²)
- Fronteiras/divisas (estados vizinhos e fronteira internacional)

## 17. Notícias (embeds oficiais)
- Nacionais: Agência Brasil, IBGE Notícias, BCB (RSS)
- Por estado: RSS oficial filtrado por UF (se disponível)
- Apenas fontes oficiais, com link e data
- Nunca agregadores comerciais (direitos autorais + risco de viés)

## 18. Calendário histórico
Calendário no site (design XP). Cada dia é clicável e abre um modal com:
- Feriados nacionais
- Datas comemorativas nacionais
- Eventos históricos relevantes ocorridos naquela data
- Seção "abre e fecha" com estados em ordem alfabética; ao clicar, exibe feriados/datas estaduais daquele estado
Objetivo: visão nacional + estadual sem poluir a tela.
Fontes: manuais com link oficial (Planalto, governos estaduais).