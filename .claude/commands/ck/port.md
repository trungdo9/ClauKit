---
description: ⚡⚡⚡ Port & refactor a feature from a public GitHub repo into the local codebase
argument-hint: <github-url> [feature] [--improve|--compare]
---

## Your mission

Port a feature from an external public GitHub repository into the current codebase, refactored to match local conventions.

<input>$ARGUMENTS</input>

## Variables

- `REPO_URL` — first positional arg, MUST be `https://github.com/<owner>/<name>`. If missing/invalid → stop and ask user.
- `FEATURE` — second positional arg, free-text hint (optional). If absent, ask user which feature/module to port.
- `MODE` — `--improve` (default — port + refactor) or `--compare` (analyze only, no file changes).

## Methodology

**Read the `port` skill file** ([.claude/skills/software/port/SKILL.md](../../skills/software/port/SKILL.md)) and follow its 5-phase workflow strictly:
1. Fetch & inspect (license check FIRST)
2. Compare with local codebase
3. Port (only `--improve` mode)
4. Refactor for fit (only `--improve` mode)
5. Verify

The `port` skill is the single source of truth for port-and-refactor methodology, including:
- License compatibility rules (refuse GPL/AGPL unless local also is)
- Provenance header requirement (`// Adapted from <repo_url>@<sha>:<path> (<license>)`)
- Phase outputs (`port-<repo>-{inspect,compare,port}.md`)
- Guardrails (no drive-by deps · no silent secrets · trust local conventions)

## Mode-Specific Behavior

| Mode | What happens |
|---|---|
| `--compare` | Stop after Phase 2. Report only — do NOT modify any local file. |
| `--improve` (default) | Run all 5 phases. Phase 3 ports files; Phase 4 refactors; Phase 5 verifies. |

## Pre-flight User Confirmation

Before Phase 3 (any file write), confirm with user:
- License of source repo (especially GPL/AGPL/non-permissive)
- Estimated files to be added/modified
- New dependencies to be introduced

**Skip confirmation only** if user passed `--improve` AND license is permissive (MIT, Apache-2.0, BSD, ISC, MPL-2.0).

## Report Locations

Save to `plans/<plan-name>/reports/port-<repo>-{inspect,compare,port}.md`. If no active plan → `plans/port-adhoc-<YYMMDD-HHmm>/reports/`. Use `bash -c 'date +%y%m%d-%H%M'` for the date (6-digit, matching every other plan dir).

## Important

- All methodology rules + guardrails → `port` skill (skill enforces license-first, provenance headers, no-drive-by-deps).
- Port is not "done" until `/ck:test` (or `tester` agent) passes — surface this to user explicitly.
- Concise grammar in reports. List unresolved questions at end.

**Related:** `scout` agent (locate source files), `code-reviewer` agent (Phase 4), `tester` agent / `/test` (Phase 5), `git-manager` agent (commit port).
