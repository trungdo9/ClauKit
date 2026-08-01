---
description: CLAUDE.md lifecycle dispatcher (init · verify · analyze · refactor)
argument-hint: init [path] | verify [path] | analyze [path] | refactor [path]
---

## Variables

ACTION: $1 (one of `init`, `verify`, `analyze`, `refactor`; `optimize` = alias for `analyze` + offer `refactor`)
TARGET: $2 (path to a CLAUDE.md — default `./CLAUDE.md`; supports nested ones, e.g. `packages/api/CLAUDE.md`)

## Activation

Activate the `claude-md` skill — it is the single source of truth for methodology (structure standard, verify checklist, refactor gates). Use `docs-manager` agent persona for the work. This command only documents dispatch + variant deltas.

## Workflow

Dispatch to the matching operation on {TARGET} per the `claude-md` skill.

### `init` — create CLAUDE.md from scratch (⚡⚡)
- **Gate**: {TARGET} must NOT exist — if it does, stop and suggest `verify` or `refactor`. Exception: an installer stub (carries `<!-- ck:workflows -->`, no other section) is expanded in place, §Workflows kept verbatim.
- Gather ground truth (README, manifests, docs/, .claude/) → draft per Structure Standard → ≤ 60 lines target.
- Never invent commands or paths; verify each against disk/manifest before writing.
- Emit the **5 project-specific fill-in blocks** per the skill: Git & PR · DB changes · Verification before claiming done · Cross-service · **Delivery tail (optional, shipped commented-out and inert — the only place vendor names may appear)**.

### `verify` — read-only audit (⚡)
- Run the 9-point checklist from the skill; **no file writes**.
- Output: findings table (severity Critical/High/Medium/Low, evidence + line no., suggested fix) + `PASS`/`FAIL` verdict (PASS = 0 Critical + 0 High).

### `analyze` — per-section token-cost profile (⚡)
- Read-only; **no file writes**. Measure per-`##`-section lines/chars/est. tokens (chars÷4) using the skill's snippet.
- Output: cost table ranked costliest-first (Section · Lines · ~Tokens · % · Class · Recommendation · Est. saving) + current-vs-budget summary + projected total after optimization.
- Never proposes dropping/weakening a directive — flags it to the user.
- Alias `optimize`: run `analyze`, then offer to continue into `refactor` to apply.

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
- `/ck:claude-md analyze` — profile token cost per section, get a ranked optimization plan (no writes).
- `/ck:claude-md refactor` — slim down a bloated CLAUDE.md, gated + diff-reviewed.
