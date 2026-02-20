---
name: use-case-mapper
description: >
  Maps any product feature or flow into a comprehensive set of use cases
  (happy path, error/bad path, and border/edge cases) and renders them
  as an interactive diagram directly into FigJam via the Figma MCP
  generate_diagram tool. Trigger words include "map use cases", "use case diagram",
  "cases for feature", "FigJam use cases", "happy path", "error cases", "edge cases".
argument-hint: [feature-name] [optional context]
---

# Use Case Mapper — FigJam

Given a feature name and optional context, this skill:

1. Reasons deeply about all possible use cases across three categories
2. Structures them with rich scenario detail (user state, system response, edge conditions)
3. Renders them into a FigJam diagram via the Figma MCP `generate_diagram` tool

---

## When to Use This Skill

Trigger this skill when the user says things like:
- "Map the use cases for [feature]"
- "Create a use case diagram for [flow]"
- "What are all the cases for [feature]?"
- "Generate a FigJam for [feature or flow]"

---

## Step 1 — Gather Input

Parse `$ARGUMENTS` for:

1. **Feature or flow name** (required) — e.g. "Loan Simulation", "Onboarding", "Card Activation"
2. **Brief description** (optional) — what the feature does, who uses it, key constraints
3. **Domain context** (optional) — product type, user types, relevant rules (e.g. "credit product, users must be verified")

If the user provides a minimal prompt (just a feature name), proceed with reasonable assumptions and note them clearly.

---

## Step 2 — Reason About Use Cases

Think systematically across three categories. For each use case, define all fields:

### Use Case Fields (Rich Format)

| Field | Description |
|---|---|
| `id` | Short slug, e.g. `HP-01`, `ERR-03`, `EDGE-02` |
| `title` | Short, clear title |
| `user_state` | Who the user is and what state they're in before this case |
| `trigger` | What action or event initiates this case |
| `system_response` | What the system does |
| `outcome` | The end state or result for the user |
| `edge_condition` | Any boundary, constraint, or exception specific to this case (use "—" if none) |

---

### Category A — Happy Path (HP)

These are the flows where everything works as intended.

Think about:
- Primary success flow (most common case)
- Variations of success (different valid inputs, different user profiles)
- Return/repeat users
- Optional steps that succeed
- Different devices or contexts (mobile, desktop, low connectivity)

Aim for **4–8 happy path cases**.

---

### Category B — Error / Bad Path (ERR)

These are flows where something goes wrong — user error, system failure, or policy rejection.

Think about:
- Invalid input (format errors, out-of-range values)
- Failed validations (identity, credit check, eligibility)
- System errors (timeouts, API failures, unavailable services)
- Session issues (expired session, duplicate submission)
- Policy blocks (already has a loan, exceeded limits)
- Third-party failures (payment provider, identity service)

Aim for **5–10 error cases**. Financial/credit products tend to have more.

---

### Category C — Border / Edge Cases (EDGE)

These are the boundary conditions that are technically valid but unusual or risky.

Think about:
- Minimum and maximum allowed values (e.g. min/max loan amount)
- Zero-value inputs
- Simultaneous or concurrent requests
- Users at exact eligibility thresholds
- Locale/timezone effects
- Users with partial or incomplete profiles
- Rate limits and throttling
- First-time vs. returning users at exact state transitions

Aim for **4–7 edge cases**.

---

## Step 3 — Structure the Mermaid Diagram

Map the use cases into a **Mermaid flowchart** grouped by category using subgraphs.

### Diagram Architecture

```
flowchart TD
  Feature["Feature: NAME"]

  subgraph HP ["Happy Path"]
    HP01["..."]
    HP02["..."]
  end

  subgraph ERR ["Error / Bad Path"]
    ERR01["..."]
  end

  subgraph EDGE ["Border / Edge Cases"]
    EDGE01["..."]
  end

  Feature --> HP
  Feature --> ERR
  Feature --> EDGE
```

### Node Label Format

Each node should contain a compact but rich label:

```
HP01["HP-01: Title\nUser: [user state]\nTrigger: [trigger]\nOutcome: [outcome]"]
```

For edge/error nodes, also include the failure point:
```
ERR01["ERR-01: Title\nUser: [user state]\nFailure: [what fails]\nOutcome: [outcome]"]
```

Keep labels scannable — 3–4 lines max per node. Full detail lives in the written output (Step 5).

### Connections

If cases connect logically (e.g. a happy path can transition to an error), add connector arrows:

```
HP01 -->|"timeout"| ERR04
```

Use connectors sparingly — only when the relationship is meaningful and non-obvious.

---

## Step 4 — Generate the Diagram via Figma MCP

Call the Figma MCP `generate_diagram` tool with the Mermaid string.

**Critical rules:**
- Only use supported types: `flowchart`, `gantt`, `stateDiagram`, `sequenceDiagram`
- Use `flowchart TD` (top-down) for use case maps
- Do NOT use: `mindmap`, `erDiagram`, `pie` — these are unsupported
- Put all shape and edge text in quotes
- Do NOT use emojis in the Mermaid syntax
- Do NOT use `\n` to represent newlines
- Use LR direction by default for graph/flowchart, but TD is preferred for use case maps
- If the diagram is very large (20+ nodes), split into two calls: one for Happy Path, one for Error+Edge
- Always confirm to the user that the diagram was sent and provide the link
- Set a clear, descriptive `name` for the diagram

---

## Step 5 — Deliver Written Summary

After sending to FigJam, output a clean markdown summary with the full use case table:

```markdown
## Use Case Map: [Feature Name]

**Assumptions:** [list any assumptions made if user input was minimal]

---

### Happy Path

| ID | Title | User State | Trigger | System Response | Outcome | Edge Condition |
|----|-------|------------|---------|-----------------|---------|----------------|
| HP-01 | ... | ... | ... | ... | ... | — |

---

### Error / Bad Path

| ID | Title | User State | Trigger | System Response | Outcome | Edge Condition |
|----|-------|------------|---------|-----------------|---------|----------------|
| ERR-01 | ... | ... | ... | ... | ... | ... |

---

### Border / Edge Cases

| ID | Title | User State | Trigger | System Response | Outcome | Edge Condition |
|----|-------|------------|---------|-----------------|---------|----------------|
| EDGE-01 | ... | ... | ... | ... | ... | ... |
```

---

## Quality Checklist

Before finalizing, verify:

- [ ] Each category has the target number of cases (HP: 4–8, ERR: 5–10, EDGE: 4–7)
- [ ] No two cases are duplicates or near-duplicates
- [ ] Every error case has a clear failure point
- [ ] Every edge case has a specific boundary condition
- [ ] Mermaid syntax is valid (no unclosed brackets, proper quoting)
- [ ] Node labels are readable at a glance (not overstuffed)
- [ ] FigJam diagram groups are clearly separated by category
- [ ] Written summary table is complete

---

## Domain Priming: Financial / Credit Products

When working with financial or credit features, apply these domain-specific lenses automatically:

**Regulatory & policy cases to always consider:**
- User not eligible (age, score, region)
- Product already active for this user
- Daily/monthly limit reached
- KYC/identity not verified
- Offer expired between viewing and submitting

**Data edge cases:**
- Missing income data
- Income in foreign currency
- Self-employed vs. salaried (if relevant)

**UX error patterns common in credit:**
- Simulated amount exceeds approved limit
- Interest rate changes between simulation and confirmation
- Terms & conditions not accepted

Add these proactively when the domain is financial/credit, even if not explicitly mentioned.

---

## Example: Loan Simulation

**Input:** "Map use cases for loan simulation"

**Assumptions:** Web/mobile product, authenticated user, simulation does not commit the user, requires basic income info.

### Sample Happy Path (abbreviated):

- **HP-01** — Successful simulation with valid inputs — User sees monthly payment breakdown
- **HP-02** — User adjusts term slider — Simulation recalculates in real-time
- **HP-03** — User with pre-approved offer — Simulation uses personalized rate
- **HP-04** — User saves simulation — Returns to review before applying
- **HP-05** — Mobile user on low bandwidth — Loads progressively

### Sample Error Cases (abbreviated):

- **ERR-01** — Requested amount below minimum — Inline error, corrective prompt
- **ERR-02** — Requested amount above approved limit — Soft rejection, show max
- **ERR-03** — Session expires mid-simulation — Prompt to re-authenticate, state preserved
- **ERR-04** — Credit scoring API timeout — Fallback to range estimate
- **ERR-05** — User not KYC verified — Gate with verification CTA

### Sample Edge Cases (abbreviated):

- **EDGE-01** — User requests exactly the minimum amount — System accepts
- **EDGE-02** — Two simultaneous simulations — Only latest processed
- **EDGE-03** — User at exact credit score threshold — Conditional offer
- **EDGE-04** — Offer expires between load and submission — Graceful expiry message

---

## Notes

- Works best when the user provides at least a sentence of context
- For complex flows (multi-step wizards, multi-actor systems), break into sub-flows and map each separately
- The Markdown summary is the deliverable; the FigJam diagram is the collaboration artifact
- Encourage the user to review in FigJam and add reactions/comments for async team review
