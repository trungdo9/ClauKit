---
description: Workforce planning & analytics — strategic workforce plan, forecast, scenarios, people analytics, KPIs, people budget, scheduling
argument-hint: plan|forecast|scenario|analytics|kpi|budget|schedule <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: plan)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-workforce-analytics` skill file** ([.claude/skills/hr/workforce-analytics/SKILL.md](../../skills/hr/workforce-analytics/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`plan`** — strategic workforce plan (supply, demand, gap, actions)
- **`forecast`** — headcount / attrition forecast
- **`scenario`** — workforce scenarios and triggers
- **`analytics`** — people-analytics question → data → method → decision
- **`kpi`** — HR KPI set with formulas
- **`budget`** — people budget and headcount plan
- **`schedule`** — shift scheduling, time & attendance controls

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
/hr:workforce plan fy2027 "double the engineering org"
/hr:workforce kpi quarterly-dashboard
```
