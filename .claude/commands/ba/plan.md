---
description: BA context — bootstrap or update plans/ba-context.md (scope, actors, glossary, sources)
argument-hint: [fast|full] [<project-slug>]
---

## Pre-flight

**None.** This command CREATES the BA context hub, so it is the one `/ba:` command that does not
require it. Every other `/ba:` command hard-fails without `plans/ba-context.md` — see
`.claude/workflows/business-analysis-rules.md` § 6.

## Variables

ACTION: $1 (default: full)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased) — must match `^[a-z0-9][a-z0-9-]*$`; a slash, `..`, or whitespace ⇒ refuse and exit (the slug becomes a filesystem path)

## Workflow

Read the `ba-context` skill file ([.claude/skills/ba/context/SKILL.md](../../skills/ba/context/SKILL.md)) —
the hub for BA project context.

Before writing any requirement id anywhere, read the `ba-traceability` skill file
([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)).

### Actions

- **`full`** (default) — 8-question interview, one question at a time. See the `ba-context` skill
  file for the questions, why each is asked, and what a good answer looks like.
- **`fast`** — scaffold from README/docs/ on disk. Every scaffolded field ships `confidence: low`
  and `[UNVERIFIED]` until confirmed.

## Output

`plans/ba-context.md` · and `plans/ba/<project-slug>/` created empty, ready for wave-1 generators.
No `-o html` — rendering is /ba:export's job in wave 4, not this command's.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- Re-running merges; a human-edited field is never silently overwritten.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/README.md`.

## Examples

```
full acme-refund
fast
```
