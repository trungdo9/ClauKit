---
description: HR context — bootstrap or update plans/hr-context.md (organisation, jurisdictions, workforce, systems, approvers, data rules)
argument-hint: [full|fast]
---

## Pre-flight

**None.** This command CREATES the HR context hub, so it is the one `/hr:` command that does not
require it. Every other `/hr:` command hard-fails without `plans/hr-context.md` — see
`.claude/workflows/hr-rules.md` § 8.

## Variables

ACTION: $1 (default: full)

## Workflow

**Read the `hr-context` skill file** ([.claude/skills/hr/context/SKILL.md](../../skills/hr/context/SKILL.md)) —
it holds the interview, the `fast` scaffold rules and the merge semantics.

### Actions

- **`full`** (default) — 9-question interview, one question at a time.
- **`fast`** — scaffold from files on disk; every field `confidence: low` + `[UNVERIFIED]`; jurisdictions never guessed.

## Output

`plans/hr-context.md` · and `plans/hr/` created empty, ready for the domain commands.

## Notes

- Roles and counts only — no employee personal data in the hub (hr-rules § 3).
- Re-running merges; a human-edited field is never silently overwritten.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/hr-rules.md`, `.claude/skills/hr/README.md`.

## Examples

```
/hr:plan
/hr:plan fast
```
