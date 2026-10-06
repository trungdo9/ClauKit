---
name: ba-diagramming
description: Draw BA diagrams in mermaid — sequence, flow, state, erd — derived from the entity spine first, free text second, and ship every one compiled or labelled [UNRENDERED], never a third state. Use when a PRD/SRS needs a picture of who-calls-whom, a decision flow, an entity's lifecycle, or the data model, or before /ba:spec compose embeds one. With --html, also redraws it (or a context/dfd/journey/class/swimlane/story-map view) as a gated stakeholder HTML through software/diagram-design.
license: MIT
---

# Diagramming

One command (`/ba:diagram`), four mermaid types, one render gate. Wave 0 — D-10 cut
D2/PlantUML/BPMN/DBML and the other mermaid diagram kinds; `context`/`dfd`/`journey`/`class` (plus
`swimlane`/`story-map`) now ship as HTML-only types behind `--html` — see "Presentation layer" below.

## The four types, and what each is for

| type | answers | draws from |
|---|---|---|
| `sequence` | who calls whom, in order | an `FR`'s `Actor:` line + its `UC` children's steps |
| `flow` | activity/decision; `subgraph` blocks stand in for swimlanes | a `UC`'s numbered steps |
| `state` | one entity's lifecycle | the `FR`/`AC` pair that names a transition (`HOLD → BOOKED` is FR-011/FR-012's shape) |
| `erd` | the data model | the nouns the spine implies, not the spine's own node kinds |

A type that does not answer a question the spec is already asking should not be drawn — a `state`
diagram for an entity that never changes state is decoration, not documentation.

## Input is the spine first, free text second

Given `FR-012`, read the entity and its `UC`/`US` children — read the `ba-traceability` skill file
first (link below) — and draw from them, so the diagram and the spec cannot disagree. Free text is
the fallback for a whiteboard moment before an FR exists, and what it produces carries
`confidence: low` like anything else unsourced (rule 2) — a diagram is a claim about the system
the same as any entity, and an unsourced claim is labelled, never presented as settled.

## Why mermaid only

Claude Artifacts render mermaid natively with no binary; GitHub renders it inline in markdown; and
this machine has no renderer installed for anything else (`d2`, `plantuml`, `dot` all absent,
alongside `mmdc`). One notation that always displays beats five that display sometimes. Other
notations arrive when a real project asks (YAGNI, D-10 made it explicit) — capability map row 2
(`erd` in D2/dbdiagram) is filed, not built.

## The render gate (rule 4), and how it degrades — the whole of its teeth

Try `npx -y @mermaid-js/mermaid-cli` (`mmdc`) first. Two outcomes, and only two:

- **Renderer reachable, block compiles** — ship the compiled artifact; no `[UNRENDERED]` label
  anywhere in the file. A block that fails to compile is fixed before it ships, not shipped with
  an apology.
- **Renderer unreachable** (this machine, today — `mmdc` not found, and it may be offline besides)
  — syntax-check what can be checked locally, ship the mermaid source, and open the file with the
  `[UNRENDERED]` header block (`references/mermaid-patterns.md`) verbatim. Never present an
  unverified diagram as verified — the same posture `seo-drift` takes with `[NO BASELINE]` rather
  than inventing one.

No third state. A file that is neither compiled nor labelled fails the exit gate — that third
state is exactly what rule 4 exists to forbid.

## Presentation layer — `--html` (diagram-design)

Mermaid answers "what does the spec say"; a stakeholder deck, a sign-off pack or a UAT walkthrough
needs a picture people read without a renderer. `--html` redraws through the engineer kit's
`diagram-design` skill (shipped with `ba` via `requires.shared`) and unlocks the four types this
skill deferred — `context`, `dfd`, `journey`, `class` — plus `swimlane` and `story-map`, all as
HTML-only types (mapping in `/ba:diagram`). Two invariants carry over unchanged:

- **Spine first.** The HTML draws from the same entities; it never introduces a node the spine
  does not name. A redraw of a mermaid type starts from the mermaid file, so the two cannot drift.
- **Rule 4, two states.** HTML is "compiled" when `self_check.py` and `verify_geometry.py` both
  pass; with no `python3` no HTML is written at all (reported `HTML skipped`) — an unverified
  stakeholder page is not shipped with a label nobody sees.

## Anti-patterns (auto-reject)

- A 40-node `flow` nobody can read — split it, or state in prose what the picture cannot carry.
- A `sequence` diagram with no actor from `plans/ba-context.md` § 2 — an unnamed stick figure is a
  placeholder, not a diagram.
- Re-drawing in mermaid exactly what the composed SRS already says in prose — a diagram earns its
  place by answering a question prose answers badly (order, branching, state), not by repeating it.

## Reading order

- `references/mermaid-patterns.md` — one minimal known-good block per type, the diacritic-quoting
  rule, and the `[UNRENDERED]` header block verbatim.

## Cross-references

- **Read the `ba-traceability` skill file** ([.claude/skills/ba/traceability/SKILL.md](../traceability/SKILL.md)) — the entity contract this skill reads before drawing anything.
- **Read the `business-analysis-rules` workflow** ([.claude/workflows/business-analysis-rules.md](../../../workflows/business-analysis-rules.md)) — rule 2 (confidence, for free-text input), rule 4 (the render gate this skill implements), rule 6 (hard-fail pre-flight), rule 7 (output language).
- **Read the `diagram-design` skill file** ([.claude/skills/software/diagram-design/SKILL.md](../../software/diagram-design/SKILL.md)) — only for `--html`: type grammar, style-guide gate, taste gate, Mermaid import.
- `.claude/commands/ba/diagram.md` ([../../commands/ba/diagram.md](../../../commands/ba/diagram.md)) — the four actions this skill backs.
