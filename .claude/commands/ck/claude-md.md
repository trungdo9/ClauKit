---
description: CLAUDE.md lifecycle dispatcher (init · verify · refactor)
argument-hint: init [path] | verify [path] | refactor [path]
---

## Variables

ACTION: $1 (one of `init`, `verify`, `refactor`)
TARGET: $2 (path to a CLAUDE.md — default `./CLAUDE.md`; supports nested ones, e.g. `packages/api/CLAUDE.md`)

## Activation

Activate the `claude-md` skill — it is the single source of truth for methodology (structure standard, verify checklist, refactor gates). Use `docs-manager` agent persona for the work. This command only documents dispatch + variant deltas.

## Workflow

Dispatch to the matching operation on {TARGET} per the `claude-md` skill.

### `init` — create CLAUDE.md from scratch (⚡⚡)
- **Gate**: {TARGET} must NOT exist — if it does, stop and suggest `verify` or `refactor`.
- Gather ground truth (README, manifests, docs/, .claude/) → draft per Structure Standard → ≤ 60 lines target.
- Never invent commands or paths; verify each against disk/manifest before writing.

### `verify` — read-only audit (⚡)
- Run the 9-point checklist from the skill; **no file writes**.
- Output: findings table (severity Critical/High/Medium/Low, evidence + line no., suggested fix) + `PASS`/`FAIL` verdict (PASS = 0 Critical + 0 High).

### `refactor` — behavior-preserving slim-down (⚡⚡)
- **Pre-flight gate (BLOCK)**: {TARGET} clean in git (one-step revert); run `verify` first — Criticals must be fixed before restructuring.
- Directive inventory must survive 1:1 — flag any proposed drop, never decide alone.
- Extract long prose → `.claude/workflows/` / `docs/` + pointer; dedupe against canonical docs; reorder to Structure Standard.
- Present before/after line + token counts and directive checklist to user **before** writing.

## Notes
- If {ACTION} is missing or invalid, print usage and exit.
- Distinct from `/ck:docs` — that manages `./docs/*` content; this manages the instruction file itself.
- Concise grammar in reports. List unresolved questions at end.

## Examples
- `/ck:claude-md init` — bootstrap `./CLAUDE.md` for a project that has none.
- `/ck:claude-md verify` — audit root CLAUDE.md, report PASS/FAIL.
- `/ck:claude-md verify packages/api/CLAUDE.md` — audit a nested CLAUDE.md.
- `/ck:claude-md refactor` — slim down a bloated CLAUDE.md, gated + diff-reviewed.
