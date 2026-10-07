---
description: Recruiting — intake, job description, sourcing, interview kit, assessment, offer, employer brand, recruiting ops, executive search, tech-role hiring
argument-hint: intake|jd|source|interview|assess|offer|brand|ops|exec|tech <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: intake)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-recruiting` skill file** ([.claude/skills/hr/recruiting/SKILL.md](../../skills/hr/recruiting/SKILL.md)) for every action except `tech`. For `tech`, **read the `hr-tech-hiring` skill file** ([.claude/skills/hr/tech-hiring/SKILL.md](../../skills/hr/tech-hiring/SKILL.md)) and use `hr-recruiting` for the generic steps it defers to.

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`intake`** — hiring-manager intake: role outcomes, must-have vs nice-to-have criteria, process, timeline
- **`jd`** — job analysis → inclusive job description / ad
- **`source`** — sourcing strategy, talent/market mapping, passive outreach
- **`interview`** — structured interview kit + scorecard
- **`assess`** — assessment design, debrief, decision
- **`offer`** — offer construction, approval, negotiation, references
- **`brand`** — employer brand + recruitment marketing
- **`ops`** — funnel metrics, process, talent CRM, contingent workforce
- **`exec`** — executive / retained search and executive assessment
- **`tech`** — tech-role primer, screening cues, tech interview loop (`hr-tech-hiring`)

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
/hr:recruit intake senior-backend "replace leaver, start Q1"
/hr:recruit interview senior-backend
/hr:recruit tech data-engineer "first data hire, no data team yet"
```
