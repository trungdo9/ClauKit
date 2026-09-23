---
description: BA diagrams in mermaid — sequence, flow, state, erd; from entities or free text
argument-hint: sequence|flow|state|erd <FR-###|free text> [<project-slug>]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

TYPE: $1 (required — one of `sequence flow state erd`)
INPUT: $2 (required — an entity id, e.g. `FR-012`, or free text describing the interaction)
PROJECT: $3 (default: derived from the repo directory name, kebab-cased) — must match `^[a-z0-9][a-z0-9-]*$`; a slash, `..`, or whitespace ⇒ refuse and exit (the slug becomes a filesystem path)

## Workflow

Read the `ba-diagramming` skill file ([.claude/skills/ba-diagramming/SKILL.md](../../skills/ba-diagramming/SKILL.md)) —
the four types, the spine-first input rule, and the render gate (rule 4 of the
[business-analysis-rules workflow](../../workflows/business-analysis-rules.md)).

When INPUT is an entity id, read the `ba-traceability` skill file
([.claude/skills/ba-traceability/SKILL.md](../../skills/ba-traceability/SKILL.md)) and the entity
file(s) it names before drawing anything — the diagram must not disagree with the spec. Free text
is the fallback; anything drawn from it carries `confidence: low`.

### The render gate (rule 4) — both branches, every run

- **Renderer present** (`command -v mmdc`, or `npx -y @mermaid-js/mermaid-cli` reachable): compile
  the block; on success the file carries no `[UNRENDERED]` label anywhere. A block that fails to
  compile is fixed before it ships, not labelled around.
- **Renderer absent** (this machine, today: `mmdc` not found): ship the mermaid source, and open
  the file with the `[UNRENDERED]` header block from `references/mermaid-patterns.md` verbatim.
  Never state or imply the diagram was verified — that is the one thing rule 4 forbids.

### Actions

- **`sequence`** — who calls whom, in order. Actor names come from `plans/ba-context.md` § 2 or
  the entity's `Actor:` line.
- **`flow`** — activity/decision; `subgraph` blocks stand in for swimlanes. Derived from a `UC`'s
  numbered steps.
- **`state`** — one entity's lifecycle (e.g. an appointment slot's `HOLD → BOOKED`/expired).
  Derived from the `FR`/`AC` pair that names the transition.
- **`erd`** — the data model implied by the spine's nouns, not the spine's own node kinds.
  Notation deferred (capability map row 2) — mermaid only; D2/dbdiagram wait for a real project
  to ask.

Quote every node label that carries a diacritic (`A["Bệnh nhân chọn giờ"]`) — the single most
common mermaid syntax failure for this kit's output (rule 4, `mermaid-patterns.md`).

## Output

Report the output path and the render-gate outcome for the run (compiled | `[UNRENDERED]`) — both,
every time.

`plans/ba/<project-slug>/diagrams/<type>-<slug>.md` — a fenced ` ```mermaid ` block plus a
caption, or an inline block inside a composed document when the caller asks for that instead.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- Mermaid only (D-10) — Claude Artifacts and GitHub both render it natively; other notations arrive
  when a real project asks.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba-diagramming/SKILL.md`,
  `.claude/skills/ba-traceability/SKILL.md`.

## Examples

```
sequence FR-012 demo
flow UC-001 demo
state FR-011 demo
erd demo
```
