---
description: BA quality control — gap analysis over the traceability spine
argument-hint: [gap] [<project-slug>]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

ACTION: $1 (default: gap)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased)

## Workflow

Read the `traceability` skill file ([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)) —
the spine contract: what an orphan is (`unparented` / `dangling`), what `unsourced` means, and why the
index is derived.

### Actions

- **`gap`** (default, the only wave-0 action) — run
  `node .claude/scripts/ba/traceability.cjs gap plans/ba/<project-slug>` and render the result for a
  human: orphans grouped by reason with each `detail` line, then the `unsourced` ids, then **the exit
  code on its own line, verbatim** — a clean run says so and a dirty run does not bury it in prose:
  - exit `0` → `✓ sạch — sẵn sàng bàn giao (gap = 0)` — this is the handover gate (rule 9).
  - exit `1` → `✗ <N> orphan(s), <M> unsourced — không bàn giao` — fix the entities, re-run.
  - exit `2` → usage error or `plans/ba/<project-slug>/entities/` missing — run `/ba:prd` first.
  Never rewrite an entity from here; `gap` reports, `/ba:spec` edits.
- **Not in wave 0** — typing one of these prints the redirect and exits, nothing else:
  - `drift`, `cr` → wave 2 of `/ba:qc` (drift: `compose(entities) == committed deliverable`; cr: reverse reachability from a change request).
  - `dashboard` → the `plans-kanban` skill (engineer kit).
  - `kg` → the `gkg` skill (engineer kit).

## Output

No files. `gap` re-reads `plans/ba/<project-slug>/entities/*.md`, prints the report and exits with the
helper's code. Run `/ba:spec compose` after a clean `gap`, not before.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- `gap` exit 0 is the handover gate of the standard chain — `.claude/workflows/business-analysis-rules.md` § 9.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/traceability/SKILL.md`, `.claude/scripts/ba/traceability.cjs`.

## Examples

```
gap acme-refund
gap
```
