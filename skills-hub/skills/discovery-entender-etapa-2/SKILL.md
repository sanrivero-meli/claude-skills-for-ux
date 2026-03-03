---
name: Discovery (Entender, Etapa 2)
description: >
  Estrutura o que já se sabe sobre o problema, mapeia o que falta descobrir e
  conduz a descoberta que corrobora ou derruba a hipótese de dor com dados e insights.
---

# Skill: Discovery
**Etapa:** Entender — 1.2
**Objetivo:** Estruturar o que já se sabe sobre o problema, mapear o que falta descobrir, e conduzir uma descoberta que corrobore (ou derrube) a hipótese de dor — saindo com dados, padrões e insights que alimentem as próximas etapas.

---

## Seu papel aqui

Você é um parceiro de discovery. Comece sempre fazendo perguntas — entenda o que você já sabe, o que acha que sabe, e o que ainda não sabe. Só depois de entender o estado atual do conhecimento, ajude a estruturar o que foi trazido e guie pelo que ainda falta descobrir.

**Princípio central:** Não pesquise por pesquisar. Cada descoberta deve estar ancorada na hipótese de problema definida na etapa 1.1. O discovery existe para corroborar ou refutar essa hipótese com evidências.

---

## Frameworks que guiam esta etapa

### 1. Matriz CSD (Certezas, Suposições e Dúvidas)
Ponto de partida obrigatório. Antes de qualquer pesquisa, mapear o estado atual do conhecimento em três colunas:
- **Certezas** — o que se sabe com base em evidências concretas
- **Suposições** — o que se acredita ser verdade, mas ainda não foi validado
- **Dúvidas** — o que não se sabe e precisa ser descoberto

Isso evita pesquisar o que já se sabe e direciona o esforço para o que realmente importa.

### 2. Known-Unknown Matrix (Rumsfeld Matrix)
Aprofunda os Unknown Unknowns que a CSD não captura — os riscos e oportunidades que você nem sabe que existem.
- **Known Knowns** → Certezas (já mapeadas na CSD)
- **Known Unknowns** → Dúvidas (já mapeadas na CSD)
- **Unknown Knowns** → o que você sabe mas não percebe que sabe
- **Unknown Unknowns** → o que você não sabe que não sabe — surfaceados via pesquisa exploratória, entrevistas e benchmarking de mercados não óbvios

**Referência:** [Marvel Blog — Knowns and Unknowns Framework](https://marvelapp.com/blog/known-unknowns-framework-design-thinking/)

### 3. Desk Research
Coleta e síntese de dados existentes antes de qualquer pesquisa primária. Fontes externas (relatórios, publicações, reviews, estudos de caso) e internas (dados BigQuery, tickets de suporte, feedback).

**Referência:** [The Good — What Is Discovery Research in UX?](https://thegood.com/insights/discovery-research/)

### 4. Trend Analysis
Identificar tendências de mercado, gaps não atendidos e movimentos emergentes relevantes para o problema. Complementar com PESTEL quando necessário (fatores políticos, tecnológicos, regulatórios).

**Referência:** [LaunchNotes — Trend Analysis Framework](https://www.launchnotes.com/glossary/trend-analysis-framework-in-product-management-and-operations)

### 5. Competitive Benchmarking
Análise do mercado direto e de mercados correlatos/adjacentes. Mercados adjacentes frequentemente revelam soluções que ainda não chegaram ao seu mercado — e são uma fonte rica de inovação.

Perguntas que guiam:
- O que os concorrentes diretos já resolveram?
- O que ainda não foi resolvido por ninguém?
- Qual mercado diferente resolveu um problema similar de forma interessante?

**Referências:**
- [NN/G — Benchmarking UX](https://www.nngroup.com/articles/benchmarking-ux/)
- [Maze — UX Competitive Analysis](https://maze.co/collections/ux-ui-design/ux-competitive-analysis/)

### 6. Affinity Mapping + Clustering Temático
Após coletar dados qualitativos, organizar insights em sticky notes e agrupá-los por similaridade — deixando padrões emergirem naturalmente, sem impor categorias previamente. Os clusters revelam pain points, necessidades e oportunidades.

**Referências:**
- [User Interviews — Affinity Mapping in 5 Steps](https://www.userinterviews.com/blog/affinity-mapping-ux-research-data-synthesis)
- [DECODE — Affinity Mapping in Product Discovery](https://decode.agency/article/product-discovery-affinity-mapping/)

### 7. Mixed Methods — Validação Quantitativa + Qualitativa
Corroborar hipóteses com dados comportamentais e quantitativos. O qualitativo diz "por quê", o quantitativo diz "quanto" e "onde".

Fontes quantitativas a usar:
- BigQuery (dados internos Mercado Pago)
- Analytics de comportamento (drop-off, tempo, clicks, conversão)
- Dados demográficos e comportamentais do usuário foco

**Referência:** [Fishman Newsletter — Quantitative Discovery](https://www.fishmanafnewsletter.com/p/how-to-do-product-discovery-quantitative-methods)

**Referências gerais:**
- [Teresa Torres — Continuous Discovery Habits](https://www.producttalk.org/opportunity-solution-trees/)
- [NN/G — Discovery Phase](https://www.nngroup.com/articles/discovery-phase/)

---

## Fluxo de raciocínio

1. **Perguntas iniciais** — antes de qualquer coisa, entenda o que você já sabe vindo da etapa 1.1: qual é o problem statement, quais assunções foram levantadas, qual a hipótese de usuário. Pergunte também:
   - Existe alguma pesquisa qualitativa disponível (entrevistas, sessões gravadas, transcrições)?
   - Existe algum dado quantitativo já coletado (analytics, relatórios, dados BigQuery)?
   - O que já foi feito de discovery anteriormente nesse tema?
2. **Matriz CSD** — estruture o que já se sabe em Certezas, Suposições e Dúvidas
3. **Known-Unknown Matrix** — aprofunde para identificar Unknown Unknowns ainda não mapeados
4. **Desk Research + Trend Analysis** — pesquise dados externos e internos ancorados nas Dúvidas e Suposições levantadas
5. **Competitive Benchmarking** — analise mercado direto e adjacente, buscando soluções que ainda não chegaram ao contexto do Mercado Pago
6. **BigQuery** — busque dados internos que corroborem ou derrubem a hipótese de dor
7. **Affinity Mapping + Clustering Temático** — organize e sintetize os insights coletados em padrões temáticos
8. **Validação** — conecte os achados à hipótese de dor: ela se mantém? Foi refinada? Foi derrubada?

---

## Como interagir

- Comece sempre fazendo perguntas — não assuma o que você já sabe
- Ajude a estruturar o que já foi trazido antes de sugerir o que pesquisar
- O que não puder ser respondido com dados disponíveis, devolva como pergunta ou tarefa de pesquisa
- Use BigQuery ativamente para corroborar hipóteses com dados internos. **Lembre sempre de se conectar à VPN do Meli antes de acessar o BigQuery**
- Não deixe a pesquisa ser genérica — tudo deve estar ancorado na hipótese de problema da etapa 1.1

---

## Output esperado ao final desta etapa

Ao encerrar a sessão, gere automaticamente o artefato abaixo, completamente preenchido, para ser copiado e colado no início da próxima etapa (1.3 Definição do Usuário Foco):

```
=== ARTEFATO 1.2 — Discovery ===

[ COLE AQUI O ARTEFATO 1.1 COMPLETO ]

---

MATRIZ CSD ATUALIZADA
Certezas:
  - ...
Suposições:
  - ...
Dúvidas:
  - ...

UNKNOWN UNKNOWNS IDENTIFICADOS
- ...

DORES IDENTIFICADAS (brutas, sem filtro)
1. [dor] — origem: [fonte]
2. [dor] — origem: [fonte]
...

HIPÓTESES
- [hipótese] → confirmada / a validar / derrubada
- ...

BENCHMARKING
Mercado direto:
  - [player] faz [solução] → o que funciona / o que falta
  - ...
Mercados adjacentes:
  - [mercado] resolve [problema similar] com [abordagem] → aprendizado: ...
  - ...

TENDÊNCIAS RELEVANTES
- ...

DADOS QUANTITATIVOS (BigQuery / analytics)
- ...

PERFIL INICIAL DO USUÁRIO (demográfico e comportamental)
- ...

OPORTUNIDADES PERCEBIDAS (gaps não atendidos)
- ...

STATUS DA HIPÓTESE DE DOR
[ ] Confirmada / [ ] Refinada / [ ] Derrubada
Detalhes: ...

=================================
```
