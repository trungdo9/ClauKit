---
description: BA diagrams in mermaid — sequence, flow, state, erd; from entities or free text (--html adds a stakeholder-grade redraw)
argument-hint: sequence|flow|state|erd|context|dfd|journey|class|swimlane|story-map <FR-###|free text> [<project-slug>] [--html]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

Parse `$ARGUMENTS` yourself, not `$1`/`$2`/`$3` — those are filled before the flag is removed, so
`journey "…" --html` would hand `--html` to PROJECT. Tokens are shell-style (a quoted string is one
token).

HTML: true when any token is exactly `--html`; every other token starting with `--` ⇒ refuse, naming it
TYPE: 1st non-flag token (required — mermaid: `sequence flow state erd`; HTML-only: `context dfd journey class swimlane story-map`, which need `--html` — without it, refuse in one line naming the flag)
INPUT: 2nd non-flag token (required — an entity id, e.g. `FR-012`, or free text describing the interaction)
PROJECT: 3rd non-flag token (default: derived from the repo directory name, kebab-cased) — must match `^[a-z0-9][a-z0-9-]*$`; a slash, `..`, or whitespace ⇒ refuse and exit (the slug becomes a filesystem path)

## Workflow

Read the `ba-diagramming` skill file ([.claude/skills/ba/diagramming/SKILL.md](../../skills/ba/diagramming/SKILL.md)) —
the four types, the spine-first input rule, and the render gate (rule 4 of the
[business-analysis-rules workflow](../../workflows/business-analysis-rules.md)).

When INPUT is an entity id, read the `ba-traceability` skill file
([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)) and the entity
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

### `--html` — presentation redraw (diagram-design)

Read the `diagram-design` skill file ([.claude/skills/software/diagram-design/SKILL.md](../../skills/software/diagram-design/SKILL.md)) — shipped with `ba` via `requires.shared`, the same way `scenario` is. Mermaid stays the spec's source of truth; the HTML is a copy for stakeholders, decks and sign-off packs.

- **Mermaid types + `--html`** — produce the mermaid file first (render gate above, unchanged), then redraw it through the skill's Mermaid import (`references/import-mermaid.md`, `--detail=balanced --audience=mixed` unless asked). Never edit the HTML and leave the mermaid stale — a change goes into the mermaid, then re-run.
- **HTML-only types** — no mermaid counterpart in this kit (`context`/`dfd`/`journey`/`class` are capability map rows 30–33), drawn straight from the spine:

  | TYPE | diagram-design type | draws from |
  |---|---|---|
  | `context` | Architecture (system in the middle, actors + external systems around) | `plans/ba-context.md` § 2 actors + integrations named in FRs |
  | `dfd` | Data flow | a `UC`'s steps + the data nouns each step reads/writes |
  | `journey` | User journey | one actor's `US` set in order, with the pain points the PRD names |
  | `class` | UML class | the nouns + relations `erd` would draw, with operations from FRs |
  | `swimlane` | Swimlane | a `UC` whose steps cross ≥2 actors |
  | `story-map` | Story map | `EPIC → US`, release cut line from `/ba:prd roadmap` if present |

- Spine first, free text second (same rule as mermaid); free-text input ⇒ `confidence: low` in the caption.
- **Render gate, HTML branch** — `python3 .claude/skills/software/diagram-design/scripts/self_check.py <file>` **and** `…/scripts/verify_geometry.py <file>` both pass ⇒ ship as compiled. Either fails ⇒ fix, re-run; never ship a failing file.
- **`python3` absent ⇒ no HTML.** The extractor and both gates are Python, so nothing can be imported or checked. Write no `.html`, ship the mermaid (if any) through its own gate, and report `HTML skipped — python3 not found`. An HTML stakeholder copy is either verified or not produced; there is no `[UNRENDERED]` HTML, because a comment in a page is invisible to the people the label protects.
- Skin: the skill's §0 style-guide gate runs once per project. Manage client profiles with `/ck:diagram profile` (shipped with `ba`); a `.diagram-design` marker in the project selects one.

## Output

Report every file written with its own render-gate outcome — `.md`: compiled | `[UNRENDERED]`;
`.html`: compiled (both gates passed) | `HTML skipped — <reason>`. One line per file, every time; a
mermaid file that is `[UNRENDERED]` next to a compiled HTML is two outcomes, not one.

`plans/ba/<project-slug>/diagrams/<type>-<slug>.md` — a fenced ` ```mermaid ` block plus a
caption, or an inline block inside a composed document when the caller asks for that instead.
With `--html`: also `plans/ba/<project-slug>/diagrams/<type>-<slug>.html` (HTML-only types: the
`.html` alone), whose `<desc>` names the entity ids it was drawn from.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- Mermaid is the spec notation (D-10) — Claude Artifacts and GitHub both render it natively. `--html`
  is a presentation layer on top, not a second notation for the spec.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/diagramming/SKILL.md`,
  `.claude/skills/ba/traceability/SKILL.md`.

## Examples

```
sequence FR-012 demo
flow UC-001 demo
state FR-011 demo
erd demo
flow UC-001 demo --html
journey "bệnh nhân đặt lịch khám" demo --html
story-map EPIC-001 demo --html
```
