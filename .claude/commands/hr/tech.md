---
description: HR technology — HRIS requirements and selection, integration, automation, AI-in-HR governance, HR chatbots, HR data
argument-hint: hris|select|ai|automation|chatbot|data <slug> [goal]
---

## Pre-flight (HARD FAIL)

**If `plans/hr-context.md` is missing, emit `❌ HR context not found at plans/hr-context.md`, direct the user to `/hr:plan`, and exit.** See `.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: hris)
REST: $2..$n — `<slug>` (`^[a-z0-9][a-z0-9-]*$`; a slash, `..` or whitespace ⇒ refuse) + free-text goal

## Workflow

**Read the `hr-technology` skill file** ([.claude/skills/hr/technology/SKILL.md](../../skills/hr/technology/SKILL.md)).

These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. Read `plans/hr-context.md` first — jurisdiction, headcount, systems and approvers shape every answer.

### Actions

- **`hris`** — HRIS requirements and implementation / integration plan
- **`select`** — vendor selection scorecard
- **`ai`** — AI-in-HR use-case risk tiering, bias evaluation, human review (hr-rules § 6)
- **`automation`** — HR process automation triage
- **`chatbot`** — HR chatbot scope, escalation, knowledge base
- **`data`** — HR data governance, data model, access

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
/hr:tech select hris-2027 "replace spreadsheets, 300 staff, 3 countries"
/hr:tech ai cv-screening "vendor proposes AI ranking"
```
