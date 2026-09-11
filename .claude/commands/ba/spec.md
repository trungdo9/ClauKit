---
description: BA specification — FR/NFR/UC/US/AC/TC entities, and compose to a signed SRS
argument-hint: fr|nfr|uc|us|ac|tc|cr|compose [<project-slug>]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

ACTION: $1 (required — one of `fr nfr uc us ac tc cr compose`)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased)

## Workflow

Read the `spec` skill file ([.claude/skills/ba/spec/SKILL.md](../../skills/ba/spec/SKILL.md)) —
the derivation chain and the methodology behind every action below.

Before writing any id, read the `traceability` skill file
([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)).

Every writing action follows the same four steps: **read the `spec` skill file → read the
`traceability` skill file → write the entity file(s) → run `validate`, and refuse to report
success while it exits 1.** A generator that writes an invalid entity is worse than one that
writes none, because `compose` (and, later, `/ck:tickets`) inherits it.

### Actions

- **`fr`** — one `FR-###.md` per functional requirement, `parents: [EPIC-###]`. Refuse when the
  project has no `EPIC-*` entities yet; direct to `/ba:prd`.
- **`nfr`** — one `NFR-###.md` per non-functional requirement, `parents` naming `PRD-001` or an
  `EPIC-###`.
- **`uc`** — one `UC-###.md` per use case, `parents: [FR-###]`. Refuse when the named FR does not
  exist; direct to `fr` first.
- **`us`** — one `US-###.md` per user story, `parents` naming an `EPIC`, `FR`, or `UC`. Refuse
  against a project with no `FR-*` entities at all — a `us` written from imagination, not derived
  from a decision on record.
- **`ac`** — one `AC-###.#.md` per acceptance criterion, `parents` naming a `US` or `FR`. The
  numeric prefix **must** equal its parent's; assign the id only once the parent exists.
- **`tc`** — one `TC-###.md` per test case, `parents: [AC-###.#]` (or `FR`/`NFR` when a scenario
  has no single AC). Read the `scenario` skill file
  ([.claude/skills/software/scenario/SKILL.md](../../skills/software/scenario/SKILL.md)) for the
  design method; this action reuses it rather than restating it.
- **`cr`** — one `CR-###.md` per change request, `parents` naming the entities the change touches
  (one or more of `EPIC`, `FR`, `NFR`, `UC`, `US`). Read the `spec` skill file for the Change
  Request form and validation rules; a CR derives from an existing entity and never creates one.
  The command writes `status: proposed`; approval is recorded by editing the entity, because
  `status: approved` gates billing in phase 08.2.
- **`compose`** — runs `index` first (so the document and the graph are rendered from one read),
  then `node .claude/scripts/ba/traceability.cjs compose plans/ba/<project-slug>`. That script runs
  `validate` internally: violations ⇒ it prints them and exits 1, writing nothing; clean ⇒ it
  writes both `deliverables/PRD-001.md` and `deliverables/SRS-001.md` and exits 0. This command
  never hand-renders the deliverable — an LLM re-render cannot satisfy the byte-stability gate a
  committed deliverable (D-11) depends on.

Every non-`compose` action ends by running
`node .claude/scripts/ba/traceability.cjs validate plans/ba/<project-slug>` and refusing to report
success while it exits 1.

## Output

`plans/ba/<project-slug>/entities/{FR,NFR,UC,US,AC,TC}-*.md` — one file per entity. `compose`
additionally writes `plans/ba/<project-slug>/deliverables/PRD-001.md` and `SRS-001.md`, both
**committed** (D-11) — see the `spec` skill file's anti-patterns for why they are never hand-edited.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md`
  § 7.
- `compose` is byte-stable over an unchanged entity tree; re-running it with no entity edits
  produces no diff.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/spec/SKILL.md`,
  `.claude/skills/ba/traceability/SKILL.md`.

## Examples

```
fr acme-refund
ac acme-refund
compose acme-refund
```
