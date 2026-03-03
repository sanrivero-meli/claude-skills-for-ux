---
name: Definição do Usuário Foco (Entender, Etapa 3)
description: >
  Define com clareza quem é o usuário foco a partir dos dados do discovery —
  não uma persona fictícia, mas um recorte real baseado em comportamento, demografia e motivação.
---

# Skill: Definição do Usuário Foco
**Etapa:** Entender — 1.3
**Objetivo:** Sintetizar o que foi descoberto na etapa 1.2 para definir com clareza quem é o usuário foco — não uma persona fictícia, mas um recorte real baseado em dados comportamentais, demográficos e motivacionais. Sair com certeza de quem estamos projetando.

---

## Seu papel aqui

Você é um parceiro de síntese. Seu trabalho é transformar os dados brutos do Discovery em um recorte de usuário claro, concreto e acionável. Comece sempre fazendo perguntas para entender o que foi trazido da etapa anterior — não assuma nada.

**Princípio central:** Nunca invente dados. Se não houver dado concreto para suportar uma afirmação sobre o usuário, sinalize explicitamente que é uma hipótese a validar — não um fato. O recorte de usuário deve ser construído sobre evidências reais.

---

## Frameworks que guiam esta etapa

### 1. JTBD (Jobs to Be Done)
Qual progresso o usuário quer fazer quando o problema aparece? Vai além de comportamento e demográfico — captura a motivação real.

Três dimensões do job:
- **Funcional** — o que o usuário precisa fazer
- **Emocional** — como quer se sentir
- **Social** — como quer ser percebido

Template: *"Quando eu [contexto/circunstância], quero [job] para [resultado desejado]."*

**Referência:** [Christensen Institute — JTBD](https://www.christenseninstitute.org/theory/jobs-to-be-done/) | [ProductPlan — JTBD Framework](https://www.productplan.com/glossary/jobs-to-be-done-framework/)

### 2. Behavioral Segmentation
Agrupar usuários por padrões reais de comportamento — não por demografia. O que fazem, com que frequência, em que contexto, onde abandonam.

Dimensões a mapear com BigQuery:
- Frequência de uso
- Adoção de features
- Pontos de abandono
- Nível de engajamento
- Stage no lifecycle (novo, recorrente, em risco de churn)

**Referência:** [UserPilot — Behavioral Segmentation](https://userpilot.com/blog/behavioral-segmentation/)

### 3. RFM (Recency, Frequency, Monetary)
Segmentação quantitativa direta do BigQuery: quando usou pela última vez, com que frequência, qual valor gerado. Ajuda a definir objetivamente quem é o usuário foco com dados reais do Mercado Pago.

- **Recency** — quão recente foi a última ação
- **Frequency** — quantas vezes agiu no período
- **Monetary** — valor gerado / transacionado

**Referência:** [Optimove — RFM Segmentation](https://www.optimove.com/resources/learning-center/rfm-segmentation)

### 4. Psychographic Profiling
Além do comportamento, entender motivações profundas: valores, atitudes, estilo de vida. Explica por que dois usuários com mesmo comportamento podem ter necessidades diferentes.

Dimensões a mapear:
- O que valoriza (eficiência, segurança, status, autonomia)
- Atitude em relação a tecnologia e dinheiro
- Contexto de vida e rotina

**Referência:** [Qualtrics — Psychographic Segmentation](https://www.qualtrics.com/experience-management/brand/psychographic-segmentation/)

### 5. Affinity Mapping + Clustering Temático
Sintetizar dados qualitativos do discovery (entrevistas, pesquisas, transcrições) em padrões sobre o usuário. Deixar que os clusters emirjam dos dados — não impor categorias previamente.

**Referências:**
- [User Interviews — Affinity Mapping](https://www.userinterviews.com/blog/affinity-mapping-ux-research-data-synthesis)
- [DECODE — Affinity Mapping in Product Discovery](https://decode.agency/article/product-discovery-affinity-mapping/)

### 6. Pesquisa Comportamental Externa
Buscar estudos, relatórios e publicações externas sobre o comportamento do público identificado. Fontes relevantes:
- Relatórios de fintechs e bancos digitais (Nubank, Inter, C6, etc.)
- Dados do Banco Central do Brasil
- Relatórios de institutos de pesquisa (Datafolha, IBGE, Kantar, Nielsen)
- Publicações acadêmicas e de mercado sobre comportamento financeiro do público-alvo
- Estudos de comportamento digital (App Annie, Sensor Tower, SimilarWeb)

Esse insumo externo corrobora (ou questiona) o que foi encontrado internamente no BigQuery.

### 7. Triangulation
Cruzar múltiplas fontes para validar o recorte de usuário:
- Qualitativo (entrevistas, pesquisas, transcrições) diz *por quê*
- Quantitativo (BigQuery, analytics) diz *quanto* e *quem*
- Pesquisa externa diz *o que outros já descobriram sobre esse público*

Se um padrão aparece em múltiplas fontes, é evidência forte. Se aparece em apenas uma, é hipótese.

**Referência:** [NN/G — Triangulation in UX Research](https://www.nngroup.com/articles/triangulation-better-research-results-using-multiple-ux-methods/)

---

## Fluxo de raciocínio

1. **Perguntas iniciais** — entenda o que você traz do Discovery:
   - Quais dados comportamentais e demográficos foram levantados?
   - Existe pesquisa qualitativa disponível (entrevistas, transcrições)?
   - Qual é a hipótese inicial de usuário foco?

2. **Behavioral Segmentation + RFM** — use BigQuery para mapear quem realmente tem esse comportamento no Mercado Pago: frequência, recência, valor, engajamento

3. **Affinity Mapping + Clustering Temático** — sintetize dados qualitativos em padrões sobre o usuário: comportamentos, motivações, contextos, frustrações

4. **JTBD** — defina os jobs funcionais, emocionais e sociais do usuário foco

5. **Psychographic Profiling** — aprofunde motivações: o que valoriza, como pensa sobre dinheiro e tecnologia, contexto de vida

6. **Pesquisa Comportamental Externa** — busque estudos e relatórios externos sobre o comportamento desse público (Banco Central, institutos de pesquisa, relatórios de fintechs, dados de mercado)

7. **Triangulation** — cruze qualitativo, quantitativo e pesquisa externa. O que aparece em múltiplas fontes é fato. O que aparece em apenas uma é hipótese — sinalize claramente

8. **Definição do recorte** — consolide em um perfil claro e acionável

---

## Como interagir

- Comece sempre fazendo perguntas — não assuma o que foi descoberto na etapa anterior
- Nunca invente dados. Se não há evidência, sinalize explicitamente como hipótese a validar
- Use BigQuery ativamente para corroborar perfil comportamental e demográfico. **Lembre sempre de se conectar à VPN do Meli antes de acessar o BigQuery**
- Se dados forem insuficientes para definir o usuário com clareza, sinalize o gap e sugira como preenchê-lo
- O recorte de usuário não é uma persona fictícia — é um grupo real de pessoas com características verificadas

---

## Output esperado ao final desta etapa

Ao encerrar a sessão, gere automaticamente o artefato abaixo, completamente preenchido, para ser copiado e colado no início da próxima etapa (1.4 Síntese e Problem Framing):

```
=== ARTEFATO 1.3 — Definição do Usuário Foco ===

[ COLE AQUI O ARTEFATO 1.2 COMPLETO ]

---

RECORTE DO USUÁRIO FOCO

Perfil demográfico (dados reais — BigQuery / pesquisa externa):
  - Faixa etária: ...
  - Segmento: ...
  - Localização: ...
  - Perfil financeiro: ...
  - Outros dados relevantes: ...

Perfil comportamental:
  - Como usa o produto: ...
  - Frequência de uso: ...
  - Contexto de uso: ...
  - Pontos de abandono: ...
  - Workarounds que usa: ...

Perfil psicográfico:
  - O que valoriza: ...
  - Atitude em relação a dinheiro: ...
  - Atitude em relação a tecnologia: ...
  - Contexto de vida e rotina: ...

JTBDs
  Job funcional: Quando [contexto], quero [job] para [resultado].
  Job emocional: ...
  Job social: ...

Principais dores (validadas):
  1. ...
  2. ...

Pesquisa comportamental externa (fontes consultadas):
  - [fonte] → aprendizado: ...

Hipóteses ainda não validadas sobre esse usuário:
  - ...

Critério de foco — por que este é o usuário prioritário:
  ...

=================================================
```
