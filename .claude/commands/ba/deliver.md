---
description: BA delivery documents — scope, UAT, acceptance, release notes, go-live, handover
argument-hint: [scope|uat|acceptance|release-notes|golive|handover|all] [<project-slug>] [--force]
---

## Pre-flight (HARD FAIL)

No `plans/ba-context.md` ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. Rule 6 — `/ba:plan` is the only exception, and this is not it.

## Variables

ACTION: $1 (required — one of `scope uat acceptance release-notes golive handover all`)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased)

## Workflow

Read the `deliver` skill file ([.claude/skills/ba/deliver/SKILL.md](../../skills/ba/deliver/SKILL.md)) —
the six deliverable actions and what each document is for in a fixed-price delivery.

Run `node .claude/scripts/ba/traceability.cjs deliver plans/ba/<project-slug> <action> [--force]`.
This script validates first: violations ⇒ prints them, exits 1, writes nothing. Clean ⇒ renders and
writes under `deliverables/` and exits 0. An `owned` deliverable that already exists ⇒ prints a skip
message and exits 1; pass `--force` to overwrite and re-seed it.

This command never hand-renders a deliverable — an LLM re-render cannot satisfy the byte-stability
gate a committed document depends on (ruling R7), and the never-overwrite rule for `owned` files is
unreachable by a prompt.

Surface the exit code to the user: report success only if the script exits 0, and on skip, name the
file and explain that `--force` discards filled-in content.

## Output

`plans/ba/<project-slug>/deliverables/{SCOPE-001.md, RELEASE-NOTES-001.md, UAT-001.md, ACCEPTANCE-001.md, GOLIVE-001.md, HANDOVER-001.md}`.

Class `derived` (scope, release-notes) — overwritten freely, byte-stable, never hand-edited.
Class `owned` (uat, acceptance, golive, handover) — seeded once, human-owned after that, generator
refuses to overwrite without `--force`.

Both classes **committed** — see the `deliver` skill file for why.

## Notes

- Vietnamese prose, English artifact keywords — see `.claude/workflows/business-analysis-rules.md` § 7.
- Every deliverable declares its class in its header; `qc drift` uses this to know which files must
  remain byte-stable (derived) and which the human owns (owned).
- Hand-editing a `derived` file, using `--force` over filled-in content in an `owned` file, and
  typing coverage numbers by hand are anti-patterns — see the `deliver` skill file.
- The `handover` deliverable's **content** is the `docs-manager` agent's job (engineer kit, installed in the same project); this template supplies
  only the shape.
- A `golive` file's **technical half** (deploy steps, rollback procedure, cut-over runbook) belongs
  in the project's deployment guide — run `/ck:docs` to create one if absent.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/deliver/SKILL.md`.

## Examples

```
deliver scope acme-refund
deliver uat acme-refund
deliver acceptance acme-refund --force
deliver all acme-refund
```
