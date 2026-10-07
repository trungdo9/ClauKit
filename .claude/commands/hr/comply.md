---
description: Employee relations & compliance — policies, investigations, discipline, risk, audit, labour relations, payroll, accommodation, immigration, redundancy/exit, multi-country and country addenda
argument-hint: policy|investigate|discipline|risk|audit|labor|payroll|accommodate|immigration|exit|global|country <slug-or-cc> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: policy)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-employee-relations` skill file** ([.claude/skills/hr/employee-relations/SKILL.md](../../skills/hr/employee-relations/SKILL.md)) for every action except `global` and `country`. For those, **read the `hr-global` skill file** ([.claude/skills/hr/global/SKILL.md](../../skills/hr/global/SKILL.md)) — `country vn` reads its Vietnam reference.

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`policy`** — policy draft / review lifecycle
- **`investigate`** — investigation process plan (the report itself stays in the case system)
- **`discipline`** — progressive discipline, warnings
- **`risk`** — HR risk register
- **`audit`** — HR compliance audit
- **`labor`** — union / works-council engagement
- **`payroll`** — payroll controls and compliance checks
- **`accommodate`** — accommodation interactive process
- **`immigration`** — work-permit / visa case tracking
- **`exit`** — redundancy / RIF / non-disciplinary termination: selection, consultation, terms, communication
- **`global`** — multi-country baseline + addenda, entity vs EOR vs contractor
- **`country <cc>`** — country addendum (`vn` = Vietnam reference)

Every legal-exposure output ends with: *review with qualified employment counsel (or the relevant authority) before acting.* (hr-rules § 2).

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
/hr:comply policy remote-work
/hr:comply investigate case-2026-07 "harassment complaint, interim measures needed"
/hr:comply country vn "first hires in Ho Chi Minh City"
```
