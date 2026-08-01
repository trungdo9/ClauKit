---
description: ⚡⚡ Analyze and fix issues (variants ci logs test tdd types ui · combinable --auto --review --quick --parallel --flow)
argument-hint: [issues] [ci|logs|test|tdd|types|ui] [--auto] [--review] [--quick] [--parallel] [--flow]
---

## Variables

ARGS: `$ARGUMENTS` (full input)
VARIANT: `$1` if it matches one of `ci`, `logs`, `test`, `tdd`, `types`, `ui`; else absent
MODIFIERS: any `--auto`, `--review`, `--quick`, `--parallel`, `--flow` flags (combinable)
ISSUES: ARGS minus VARIANT and MODIFIERS

If there is an existing markdown implementation plan, use `/ck:cook <path-to-plan>` to implement it.

## Dispatch

1. Inspect ARGS. If VARIANT present → dispatch to **Variant Workflows** below (each has its own pipeline shape and input source).
2. Otherwise → run **Default Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) on ISSUES with MODIFIERS.

## Default Pipeline (no variant)

### Mission
<issues>{ISSUES}</issues>

### Modifier flags (combinable — parse ARGS and apply ALL matching)

| Flag | Effect |
|---|---|
| *(none)* | **default** — full pipeline: diagnose → plan → implement → verify → post-impl docs/roadmap update. No review. Sequential. |
| `--auto` | **auto-detect** — inspect the issue and automatically enable other flags (e.g. add `--review` for risky/security changes, `--parallel` for independent issues, `--quick` for trivial). Report which flags were chosen and why before running. **Never auto-enables `--flow`** — orchestration is explicit opt-in only. |
| `--review` | **+ review** — add Stage [7] `code-reviewer` subagent. Critical findings loop back to implement + retest. |
| `--quick` | **minimal** — skip planning (Stage [4]) and post-impl docs/roadmap update. Use `debugger` only at diagnose (no `researcher`). Combine with `--review` to add review back. |
| `--parallel` | **parallel subagents** — at Stage [3] run `debugger` + `researcher` in parallel; spawn multiple researchers/testers concurrently where independent. |
| `--flow` | **orchestrated** — run the Scout Gate + Root-Cause Gate as discrete inspectable agent stages with structured handoff to `plans/<plan>/reports/`, plus an adversarial-verify stage on the root cause **before** implement. Activates the `dynamic-workflow` skill; cost preview shown. Combinable with any flag above. See `### --flow` below. |

### `--flow` (orchestrated execution)

Turns the two prose gates into **discrete, inspectable agent stages** ([2.5] Scout, [3.5] Root-Cause) with structured handoff to `plans/<plan>/reports/`, and adds a **[3.7] adversarial-verify** stage on the root cause before implement. Activates the `dynamic-workflow` skill ([.claude/skills/software/dynamic-workflow/SKILL.md](../../skills/software/dynamic-workflow/SKILL.md)) — source of truth for the pattern; this is just the trigger. **Complements** the canonical pipeline; does not replace it.

- **Full stage shape + 4-axis inheritance:** see [fix-pipeline.md → *Orchestrated Execution*](../../workflows/fix-pipeline.md).
- **Persona routing:** scout → `scout`; diagnose → variant specialist (`debugger`/`tester`/`frontend-developer`); skeptics → independent agent instances; implement → main agent.
- **Cost preview** shown before the run (per `/ck:flow`); orchestrator can inspect/abort between phases.
- **Explicit opt-in only** — `--auto` never turns this on.

### Pipeline (stages from `fix-pipeline.md`)

| Stage | Default | `--quick` | `--review` | `--parallel` |
|---|---|---|---|---|
| [2] Multimodal (screenshots/videos → `ai-multimodal`) | ✓ | ✓ | ✓ | ✓ |
| **[2.5] Scout Gate** (5 items — MANDATORY, blocks Diagnose) | ✓ | ✓ | ✓ | ✓ |
| [3] Diagnose (`debugger` + `researcher`) | `debugger` + `researcher`, sequential | `debugger` only | unchanged | run subagents in parallel |
| **[3.5] Root-Cause Gate** (6 questions — MANDATORY, blocks Implement) | ✓ | ✓ | ✓ | ✓ |
| [4] Plan (`planner` writes implementation plan) | ✓ | **SKIP** | unchanged | — |
| [5] Implement (main agent) | ✓ | ✓ | ✓ | ✓ |
| [6] Verify (`tester`) | ✓ | ✓ | ✓ | spawn multiple `tester`s if independent suites |
| [7] Review (`code-reviewer`) | **SKIP** | **SKIP** | **+ enabled** | unchanged |
| Post-impl: `project-manager` + `docs-manager` parallel → plan progress · docs · `./docs/project-roadmap.md` | ✓ | **SKIP** | unchanged | ✓ |
| Final: summary → ask commit/push → `git-manager` | ✓ | ✓ | ✓ | ✓ |

**Failure loop (circuit breaker):** verification failure → back to [3] (re-diagnose). Max **3 attempts** — on 3rd fail, STOP and escalate to user (suspected architecture issue). Review failure → back to [5] (re-implement + retest).

**Ledger (run-state skill):** append one line to `plans/<plan>/STATE.md` after the Root-Cause Gate ([3.5], the diagnosis + evidence) and after Verify ([6], suite output) — a killed fix run resumes from the ledger, not from recollection. After [3.5], the root cause is itself a falsifiable claim: when it asserts existing behaviour ("X currently does Y"), run the `verify-plan` skill's evidence check on it before implementing.

### Thinking budget by flag combo

| Combo | Budget |
|---|---|
| `--quick` (alone or with `--parallel`) | **Think hard** |
| default / `--review` / `--parallel` | **Think harder** |
| `--auto` (router) | **Ultrathink** the routing decision, then think at the budget of the chosen combo |
| `--quick --review` (most-everything-on minimal) | **Think harder** |

### Companion skills
- `problem-solving` — activates during diagnose for root-cause synthesis.
- `sequential-thinking` — break complex problems into steps (default + `--review`).
- `ai-multimodal` — Stage [2], plus visual-asset generation if needed.

## Variant Workflows (distinct inputs / pipeline shapes)

Each variant follows the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) with the differences listed.

### `logs` — log-driven (⚡)

**Input:** local `./logs.txt`
<issue>{ISSUES}</issue>

- **Stage [1]** (input): read `./logs.txt`. If missing → reproduce issue first and pipe output to `./logs.txt`.
- **Stage [2.5]** (scout): scout 5 mandatory items (project type, symptom file + callers, related tests, 20 commits, conventions).
- **Stage [3]** (diagnose): `debugger` subagent reads `./logs.txt` → find root causes.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [3.5]** (root-cause gate): answer 6 questions; if "why now" unknown → investigate further.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout). Max 3 attempts → escalate to user.

**Distinct:** input = local log file. Adds `scout` subagent to bridge logs → code location.

### `ci` — CI-failure-driven (⚡)

**Input:** GitHub Actions URL
<url>{ISSUES}</url>

- **Stage [1]** (input): `debugger` subagent reads GitHub Actions logs via `gh` command.
- **Stage [2.5]** (scout): scout 5 mandatory items (project type, symptom file + callers, related tests, 20 commits, conventions).
- **Stage [3]** (diagnose): `debugger` finds root causes from CI logs.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [3.5]** (root-cause gate): answer 6 questions; if "why now" unknown → investigate further.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout). Max 3 attempts → escalate to user.
- If `gh` not available → instruct user to install + authorize GitHub CLI first.

**Distinct:** input = GitHub Actions URL (remote, fetched via `gh`). Like `logs` but for remote CI runs.

### `test` — test-first (⚡⚡)

**Input:** running test suite
<issues>{ISSUES}</issues>

- **Stage [1]** (input): `tester` subagent compiles code + fixes syntax errors first.
- **Stage [2.5]** (scout): scout 5 mandatory items (project type, symptom file + callers, related tests, 20 commits, conventions).
- **Stage [3]** (diagnose): `tester` runs test suite → failures handed to `debugger` for root-cause.
- **Stage [3.5]** (root-cause gate): answer 6 questions; if "why now" unknown → investigate further.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` re-runs tests.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3] (re-diagnose). Max 3 attempts → escalate to user.

**Distinct:** input = running test suite. `tester` runs BEFORE `debugger` (inverse of other variants). For a **production symptom** with no red suite yet, use `tdd` instead.

### `tdd` — production-symptom red-green (⚡⚡)

**Input:** a production symptom (bug report, incident, wrong output) — NOT an already-failing suite (that's `test`).

<issues>{ISSUES}</issues>

→ **The loop is canonical in the [`tdd` skill](../../skills/software/tdd/SKILL.md)**: toolchain proof → red test with pasted failure → baseline → green sweep → prove. Iron Law: no production code without a failing test first. The **baseline rule** (base commit in a separate worktree, never `git stash`, because a stash-based baseline silently no-ops) is stated there once — this command does not restate it.

Command-only: run the baseline worktree with `node scripts/ck/wt-new.js baseline --base <sha>`, append `gate tdd → PASS (evidence: <suite output>)` to `plans/<plan>/STATE.md`, and **escalate only** on a data change needing approval or an unrepairable env blocker.

**Distinct from `test`:** different inputs — `test` starts from a red suite; `tdd` starts from a production symptom and *creates* the red test. Both stay.

### `types` — typecheck-driven, minimal (⚡)

- **Stage [1]** (input): run `bun run typecheck` OR `tsc` OR `npx tsc`.
- **Stages [3]–[5]** collapsed: direct fix loop — read errors, apply fix, re-run typecheck.
- **No agents** — main agent works directly.
- **Loop** until typecheck shows zero errors.

**Hard rules:**
- Fix **all** type errors. Repeat until clean.
- **Do NOT use `any`** just to pass the typecheck — fix at the source.

**Distinct:** simplest variant — no subagents, no planner, no reviewer. Tight feedback loop directly against `tsc`/`bun typecheck`.

### `ui` — UI-specialist pipeline (⚡⚡)

`frontend-developer` subagent (with `aesthetic` + `frontend-design` skills) reads `./docs/design-guidelines.md` then fixes:
<issue>{ISSUES}</issue>

- **Stage [2]** (multimodal): if screenshots/videos → `ai-multimodal` skill for detailed issue description.
- **Stage [2.5]** (scout): scout 5 mandatory items (project type, symptom component + callers, related tests, 20 commits, design conventions).
- **Stage [3]** (diagnose): `frontend-developer` subagent (NOT `debugger`).
- **Stage [3.5]** (root-cause gate): answer 6 questions including "why now" (recent design change? dep upgrade? layout regression?).
- **Stage [4]** (plan): SKIP — go directly to implement.
- **Stage [5]** (implement): `frontend-developer` applies fix step by step.
- **Stage [6]** (verify): two-layer check:
  - Screenshot exact parent container + `ai-multimodal` analysis (also `video-analysis` / `document-extraction` as needed) → verify design-guideline match.
  - `chrome-devtools` skill → verify implementation match.
  - `tester` agent → compile + ensure no regressions.
  - If issues remain → loop back to [5]. Max 3 attempts → escalate to user.
- **Post-impl (user approves):** `project-manager` + `docs-manager` subagents in parallel → update plan progress · `./docs/*` · `./docs/project-roadmap.md`.
- **Post-impl (user rejects):** ask reasons, loop the pipeline.
- **Final:** summary + ask about commit/push → `git-manager`.

**Companion skills:** `ai-multimodal` (generate + verify visual assets, image edits — bg removal, crop, resize), `chrome-devtools` (browser verification).

**Distinct:** specialist agent = `frontend-developer` (not `debugger`). Multi-layer visual verification (screenshot + AI analysis + chrome-devtools). Post-impl docs update + commit flow (like `/fix --review`).

## Examples
- `/ck:fix payment webhook 500s` — default full pipeline.
- `/ck:fix --quick typo in login button label` — minimal pipeline.
- `/ck:fix --review session token leak in middleware` — full pipeline + code-reviewer.
- `/ck:fix --auto refactor 3 unrelated services` — auto picks flags.
- `/ck:fix --quick --review --parallel hot patches across 5 modules` — minimal stages but reviewed, run in parallel.
- `/ck:fix logs` — log-driven from `./logs.txt`.
- `/ck:fix ci https://github.com/org/repo/actions/runs/123` — CI-failure-driven.
- `/ck:fix test` — test-first.
- `/ck:fix types` — typecheck-driven minimal.
- `/ck:fix ui "card spacing on /pricing is off"` — UI specialist pipeline.
- `/ck:fix --flow auth token race` — orchestrated: gates as agent stages + adversarial-verify root cause before implement.
- `/ck:fix logs --flow` — log-driven variant, orchestrated with structured handoff + verify.
