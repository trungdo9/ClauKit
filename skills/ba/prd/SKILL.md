---
name: ba-prd
description: Write the product-definition entity pair — PRD-001 plus one EPIC per user-visible capability — from plans/ba-context.md, then order the existing EPIC set into a Now/Next/Later roadmap without inventing new entities. Use when a project has a context hub but no PRD yet, before /ba:spec derives FRs from EPICs, or to re-sequence an existing roadmap.
license: MIT
---

# PRD

The first command that produces a BA artifact — everything before it (`plan`, the spine, the
rules) is scaffolding. A PRD is also the document a `/ba:spec fr` downstream depends on: an FR's
`parents` must name an EPIC that exists, so this skill is what makes `/ba:spec` possible.

## What a PRD answers, in order

Four questions, and a section that answers none of them does not belong:

1. **The problem** — who has it, how it hurts them, what evidence shows it (§1).
2. **Who has it** — the actors, matched to `ba-context` § 2 (§2).
3. **What changes for them** — a measured outcome, not a feature list (§3).
4. **What is explicitly out** — a two-column in/out table, not a paragraph (§4).

§5 (EPIC table) and §6 (assumptions/risks) exist to decompose and de-risk the four answers above,
not to add a fifth question. §7 (roadmap) is a separate action — see below.

## Where the content comes from

`plans/ba-context.md` § 1 (scope), § 2 (actors), § 4 (sources), § 6 (glossary). **Rule 1 applies
from the first line:** every claim about the current state carries a `source:` or ships
`[UNVERIFIED]`. A PRD is the document most likely to be written from the BA's head — that is
exactly why it needs the discipline, not an exemption from it.

## EPIC decomposition

One EPIC per user-visible capability, sized so its FRs fit on one page. Anti-patterns:

- An EPIC per team — that is an org chart, not a capability.
- An EPIC per screen — that is a UI inventory, not a capability.
- An EPIC that is one FR wearing a hat — if it has one requirement, it is an FR; don't wrap it.

## `out_of_scope` is mandatory on every EPIC

It becomes `/ck:cook` Stage-0 item 3 (scope boundary) for every ticket sliced from that EPIC's
FRs. A BA who writes "TBD" there has moved the scope argument downstream to a developer who has
less context to settle it. `traceability.cjs validate` rejects an EPIC without it — this is not a
style preference, it is a hard gate.

## The `roadmap` action

Reads the existing EPIC set and orders it Now / Next / Later into `PRD-001.md` § 7. **It creates
no entities** — say this explicitly, because the word "roadmap" invites inventing work. Re-running
replaces § 7; it never appends a second one.

## Confidence discipline

A PRD written before any interview is `confidence: low` throughout, and that is a legitimate
state, not a failure. It becomes `med`/`high` as sources land — never inflate it to look more
finished than the evidence supports.

## Reading order

`references/prd-structure.md` — the `PRD-001` section shape, a worked `EPIC-001.md`, and the
roadmap table shape.

## Cross-references

- **Read the `ba-traceability` skill file** ([.claude/skills/ba-traceability/SKILL.md](../ba-traceability/SKILL.md)) — the id scheme and entity contract every `PRD-001.md`/`EPIC-*.md` must satisfy.
- **Read the `ba-context` skill file** ([.claude/skills/ba-context/SKILL.md](../ba-context/SKILL.md)) — the hub this skill reads before writing anything.
- **Read the `business-analysis-rules` workflow** ([.claude/workflows/business-analysis-rules.md](../../workflows/business-analysis-rules.md)) — rule 1 (sourcing), rule 6 (hard-fail pre-flight), rule 7 (output language).
