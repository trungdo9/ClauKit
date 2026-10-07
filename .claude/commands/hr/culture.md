---
description: Culture & experience — engagement, listening and surveys, DEI, wellbeing, internal comms, employee journey
argument-hint: engage|survey|dei|wellbeing|comms|journey <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: engage)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-culture` skill file** ([.claude/skills/hr/culture/SKILL.md](../../skills/hr/culture/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`engage`** — engagement diagnosis and action plan
- **`survey`** — survey / listening programme design (anonymity threshold, action loop)
- **`dei`** — inclusion strategy and measures (lawful-basis check on data)
- **`wellbeing`** — wellbeing programme (not clinical advice)
- **`comms`** — internal communications plan
- **`journey`** — employee journey map and moments that matter

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
/hr:culture survey pulse-2026q4
/hr:culture journey new-joiners
```
