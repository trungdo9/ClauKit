---
description: Performance & talent — goals, reviews, PIPs, calibration, succession, career paths, coaching
argument-hint: goals|review|pip|calibrate|succession|career|coach <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: review)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-performance` skill file** ([.claude/skills/hr/performance/SKILL.md](../../skills/hr/performance/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`goals`** — goal / OKR setting and cascade
- **`review`** — review cycle design, review template, manager guidance, 360
- **`pip`** — performance improvement plan (ends with the counsel-review line)
- **`calibrate`** — calibration session with bias and distribution checks
- **`succession`** — critical roles, readiness, talent review, 9-box
- **`career`** — career paths, competency frameworks
- **`coach`** — coaching / mentoring programme, manager effectiveness

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
/hr:perform review annual-2026
/hr:perform pip employee-a "missed deliverables for two quarters"
```
