---
description: People operations — onboarding, offboarding and exit, employee lifecycle, HR service delivery and shared services
argument-hint: onboard|offboard|lifecycle|service <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: onboard)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-people-ops` skill file** ([.claude/skills/hr/people-ops/SKILL.md](../../skills/hr/people-ops/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`onboard`** — pre-boarding → day 1 → 30/60/90 plan, buddy, checklist
- **`offboard`** — offboarding checklist, access revocation, knowledge transfer, exit interview
- **`lifecycle`** — lifecycle map and HR touchpoints (hire → move → leave)
- **`service`** — HR operating model, service delivery tiers, self-service, vendors

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
/hr:people onboard remote-engineers "first fully remote cohort"
/hr:people offboard sales-leaver
```
