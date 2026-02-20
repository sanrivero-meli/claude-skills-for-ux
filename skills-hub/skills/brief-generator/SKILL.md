---
name: brief-generator
description: >
  Generates a complete, session-ready UX/product design brief from raw input —
  especially voice notes and transcripts. Use this skill whenever someone says
  "draft a brief for", "generá el brief de", pastes a transcript, or describes
  a feature verbally. All sections of the brief are always required and must be
  filled. Outputs the team's standard template: contexto, objetivos, value prop,
  KPIs, tono, and narrative — ready to be reviewed together as a team.
---

# Brief Generator

Transforms raw, unstructured input — especially voice notes and verbal transcripts — into a complete, session-ready design brief.

**Primary input type:** spoken language. Transcripts are non-linear, repetitive, and incomplete. The skill's job is to extract the signal, resolve contradictions, and reconstruct a coherent brief — not to clean up formatting.

**Output standard:** every section must be filled. The brief goes into a team alignment session, so it needs to be complete enough to provoke discussion — not a skeleton waiting to be finished. If a section can't be fully inferred, make the best reasoned attempt and mark it `🔍 Revisar en sesión` so the team knows to pressure-test it, not skip it.

---

## Input

Primary: voice note transcripts or verbal descriptions.
Also accepted: meeting notes, Slack threads, PM tickets — but always treat the input as potentially incomplete and unstructured.

### How to read a transcript

Spoken input has specific patterns to handle:

- **Non-linearity** — the speaker jumps between topics. Reconstruct logical order, don't follow the transcript order.
- **Repetition** — the same idea said multiple ways. Consolidate into the clearest version.
- **Hedging language** — "algo así como", "no sé bien pero", "creo que". Extract the intent behind the uncertainty.
- **Implicit assumptions** — things the speaker didn't say because they seemed obvious. Surface them explicitly in the brief.
- **Contradictions** — if two statements conflict, flag both with `🔍 Revisar en sesión`.

---

## Output — Brief Template

Always output in this exact structure. Use Spanish throughout.

**Every section is required.** Never omit a section. If something can't be fully inferred, write the best reasoned version and mark it `🔍 Revisar en sesión` — this signals the team to discuss it, not skip it.

Omit the **Equipo** section entirely — the skill cannot know this.

---

```
# [Nombre del proyecto o feature]
Diseño de experiencia

**Mercado:** [MLB / MLA / MLM — infer from context]

---

## Contexto / Problema

[2–4 sentences. Current situation — specific user pain — business consequence.
Be concrete: who is affected, what they experience today, why it matters now.
Synthesized from the transcript — not quoted from it.]

### Target

[Precise segment. Include: PJ/PF, market, lifecycle stage (inicio/madurez/declive),
company size if relevant. Pull every detail the transcript mentions.]

### Pain points

- [Pain 1 — user-facing, specific, grounded in the transcript]
- [Pain 2]
- [Pain 3]

---

## Objetivos y value props

| Negocio | Experiencia |
|---|---|
| [What the company gains — competitive position, revenue, risk reduction, portfolio goal] | [What the user gains — what they can now do, feel, or avoid] |

### Value prop

[One sentence. Formula: "Accedé a [beneficio concreto] desde [canal] sin [fricción específica], con [diferenciador o respaldo]."]
[Adjust conjugation to market: vos (AR), tú (MX/CO), você (BR)]

### KPIs

- [KPI 1 with target and timeframe if mentioned]
- [KPI 2]
- [KPI 3]
- DVC alineado a metas de portfolio

---

## ¿Qué vamos a hacer?

[Paragraph: what flows or surfaces are being designed, what's in MVP scope,
what's explicitly out of scope. Synthesize from transcript — don't list, narrate.]

### Scope y fechas

- [Milestone 1 — e.g. "Experiencia MVP lista en Q1-2026"]
- [Add others if mentioned]

### Impactos

- [Impact area 1 — e.g. "Nuevo flujo de contratación"]
- [Impact area 2]
- [Impact area 3]

---

## ¿Qué queremos contar?

### Ideas a comunicar

1. [Key message 1 — what the user can now do]
2. [Key message 2 — how it works or what makes it trustworthy]
3. [Key message 3 — the differentiating benefit]

### Moods y tono

[Always required. Infer from: what the user is going through, objections mentioned
in the transcript, the emotional weight of the problem. If not explicit, reason from context.]

| ¿Qué siente el usuario? | ¿Cuál es su pensamiento? | ¿Qué queremos transmitir? |
|---|---|---|
| [Emoción 1] | "[Thought in first person — their internal voice]" | [Desired emotional response] |
| [Emoción 2] | "[Thought]" | [Response] |
| [Emoción 3] | "[Thought]" | [Response] |

### Enfoques / Puntos de vista

[2–3 communication angles to explore in design.
E.g. "Sistémico: mostramos campos de simulación y elegibilidad de forma clara."
E.g. "Promocional: enfatizamos los beneficios económicos y la facilidad."
Always required — infer from what aspects of the product were emphasized in the transcript.]

---

## Historia a contar

[3–5 sentences. The user's narrative: where they are now — what changes — how they feel after.
Write in second person, present tense. Human voice, not corporate.
This is the north star for the design team — make it feel real.]

---

## 🔍 Para revisar en sesión

[Everything the team should explicitly align on before starting design.
Be specific: what the uncertainty is and why it matters for design decisions.
This section is always present — even a well-sourced brief has open questions.]

- [ ] [Item 1 — e.g. "¿El target incluye PF o solo PJ? Impacta el flujo de elegibilidad"]
- [ ] [Item 2]
```

---

## Reasoning Guide (how to fill each section)

### Contexto / Problema
Reconstruct from whatever the speaker emphasized most. In transcripts, the problem is often stated early then revisited with more detail later — combine both passes.

### Target
Extract every qualifier mentioned. PJ/PF distinction is critical for financial products — if not mentioned, flag it in "Para revisar en sesión."

### Objetivos
Always two distinct lenses. If the speaker only talked about one, infer the other from context.
- **Negocio** — competitive gap, portfolio target, risk reduction, revenue
- **Experiencia** — what the user can do, avoid, or feel that they couldn't before

Never collapse into one. Never duplicate across columns.

### Value prop
Formula: `"[Verbo conjugado] [beneficio concreto] desde [canal/surface] sin [fricción específica], con [diferenciador o respaldo]."`

Conjugation by market:
- MLB/MLA — vos ("Accedé", "Obtené")
- MLM/MCO — tú ("Accede", "Obtén")
- MLB Brazil — você ("Acesse", "Obtenha") — or adapt to Portuguese

### KPIs
Use numbers if mentioned. If not, describe the metric type:
- "Portfolio: objetivo a definir con producto"
- "Conversión en flujo de contratación: pendiente baseline"
Never invent numbers.

### Moods y tono
This is always required. Reasoning path when not explicit in the transcript:
1. What problem is the user solving? — What emotion does that problem generate?
2. What objections might they have? — What thought does that create?
3. What do we want them to feel after? — What's the opposite of their current state?

Reference the FGBS pattern: Frustración/Ansiedad/Desconfianza — Confianza/Tranquilidad/Seguridad. Financial products almost always follow this arc — adapt the specifics.

### Enfoques / Puntos de vista
Infer from what aspects the speaker emphasized:
- If they talked about mechanics/process — Sistémico
- If they talked about benefits/savings — Promocional
- If they talked about trust/regulation — Institucional

### Historia a contar
Write last, after all other sections. It should feel like a natural conclusion of everything above. Second person, present tense, human voice. 3–5 sentences: situation — change — feeling.

---

## Behavior Notes

- **Output immediately.** Don't ask clarifying questions first. Generate the complete brief, then surface open questions at the end.
- **Don't quote the transcript.** Synthesize and reconstruct — the output should read as if written, not transcribed.
- **Don't summarize.** Jump straight to the structured brief.
- **Match the domain language.** MercadoPago/MercadoLibre context uses specific terms — PJ/PF, portfolio, DVC, contratación, garantía, Maxwell, EOG. Use them naturally when context supports it.
- **The "Para revisar en sesión" section is always present.** Even a well-sourced brief has things the team needs to align on. Minimum 2 items. Frame each as a question with a consequence: "¿X? Impacta Y."
