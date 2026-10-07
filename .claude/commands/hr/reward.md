---
description: Total rewards — pay structures and levels, benchmarking, benefits, recognition, pay equity
argument-hint: structure|benchmark|benefits|recognition|equity <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: structure)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-rewards` skill file** ([.claude/skills/hr/rewards/SKILL.md](../../skills/hr/rewards/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`structure`** — job architecture, levels, pay ranges
- **`benchmark`** — market pricing method (survey matching, aging, blending)
- **`benefits`** — benefits and retirement design (jurisdiction-specific → `[VERIFY]`)
- **`recognition`** — recognition programme, total rewards statement
- **`equity`** — pay-equity analysis and remediation plan

## Output

`plans/hr/<slug>/<artifact>.md` — the skill's § Output names each artifact.

## Notes

- Jurisdiction first; no statutory figures from memory — cite or `[VERIFY: <law>]` (hr-rules § 1–2).
- Roles or pseudonyms only — no employee names, IDs, salaries of identifiable people, health data (hr-rules § 3).
- No invented benchmarks — cite or `[NEEDS DATA]` (hr-rules § 4).
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/hr-rules.md`, `.claude/skills/hr/README.md`.

## Examples

```
/hr:reward structure eng-levels "move from ad-hoc titles to levels"
/hr:reward equity 2026-review
```
