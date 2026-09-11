---
description: BA product definition — PRD + EPIC breakdown, or roadmap over the existing EPICs
argument-hint: [prd|roadmap] [<project-slug>]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

ACTION: $1 (default: prd)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased)

## Workflow

Read the `prd` skill file ([.claude/skills/ba/prd/SKILL.md](../../skills/ba/prd/SKILL.md)) — the
methodology for product definition.

Before writing any id, read the `traceability` skill file
([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)).

### Actions

- **`prd`** (default) — interview or scaffold from `plans/ba-context.md` → write
  `PRD-001.md` + one `EPIC-###.md` per user-visible capability → run
  `node .claude/scripts/ba/traceability.cjs validate plans/ba/<project-slug>`, and **refuse to
  report success while it exits 1**. A generator that writes invalid entities is worse than one
  that writes none, because `/ba:spec` inherits them.
- **`roadmap`** — read the existing `EPIC-*` entity set, order it Now / Next / Later, write
  § 7 of `PRD-001.md`. Creates no entities; re-running replaces § 7 only.

## Output

`plans/ba/<project-slug>/entities/PRD-001.md` + `EPIC-001.md … EPIC-NNN.md`. `roadmap` writes
only `PRD-001.md` § 7 — no new files, no re-index required.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- Every EPIC carries `out_of_scope`; `validate` rejects an EPIC without it.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/prd/SKILL.md`.

## Examples

```
prd acme-refund
roadmap acme-refund
```
