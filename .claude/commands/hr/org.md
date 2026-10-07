---
description: Organisation & change — org design, change management, M&A integration, OD, transformation
argument-hint: design|change|ma|od|transform <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: change)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-org-change` skill file** ([.claude/skills/hr/org-change/SKILL.md](../../skills/hr/org-change/SKILL.md)). Restructuring that removes roles also needs `hr-employee-relations` ([.claude/skills/hr/employee-relations/SKILL.md](../../skills/hr/employee-relations/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`design`** — org design options, spans and layers
- **`change`** — change plan, impact assessment, change comms
- **`ma`** — M&A HR due diligence, Day-1 and 100-day integration
- **`od`** — organisational effectiveness diagnosis, HR strategic plan
- **`transform`** — workforce / HR transformation programme, crisis response

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
/hr:org change new-hris-rollout
/hr:org ma acquisition-2026 "integrate 60-person team in another country"
```
