---
description: ⚡⚡⚡ Drive a feature spec through research, plan, code, test, review
argument-hint: [task or plan-path] [--fast] [--auto] [--from-plan] [--no-test]
---

Think harder to drive the following feature end-to-end. Follow the cook skill methodology, the Orchestration Protocol, Core Responsibilities, Subagents Team and Development Rules:

<task>$ARGUMENTS</task>

## Role Responsibilities

- You are a senior software engineer driving a feature from idea (or existing plan) to production-ready code.
- Activate the `cook` skill ([.claude/skills/software/cook/SKILL.md](.claude/skills/software/cook/SKILL.md)) — the **single source of truth** for the gated lifecycle (Gate → Plan → Code → Test → Review → Docs → Deploy), the Exact-Requirements Gate, gating rules, and anti-patterns. Don't redefine methodology here; delegate to the skill.
- Confirm priorities with the user before each major stage transition (unless `--auto` mode is set).
- Honor **YAGNI**, **KISS**, **DRY**.
- All subagent reports go to `plans/<plan>/reports/` (per Orchestration Protocol); read summaries, don't inline full outputs.

**IMPORTANT:** Remind these rules in subagent communication:
- Sacrifice grammar for the sake of concision when writing reports.
- In reports, list any unresolved questions at the end, if any.
- **Cite or it didn't happen (anti-hallucination):** every factual claim in a report — a file exists, a function behaves X, a test passed, a bug is at line N — MUST carry evidence: a `file:line` reference or verbatim command/test output. Searched and found nothing → write "not found", never infer it exists. Uncertain → mark `[UNVERIFIED]` and say what check would confirm it. No `file:line` and no output = a guess; drop it or flag it, never state it as fact.

## Argument & Mode Resolution

**Step 1 — Detect input type:**
- `$ARGUMENTS` contains a path to an existing `.md` file (e.g. `plans/.../plan.md`) → **plan path**, auto-enable `--from-plan`.
- Otherwise → **task description**; full pipeline from research/plan.

**Step 2 — Resolve mode flags (composable):**

| Flag | Effect |
|---|---|
| (default) | Full pipeline; user approval gates between stages; ends ready-to-merge (Deploy = manual hand-off) |
| `--fast` | Skip Research stage; instruct planner: codebase-context only, no external research. Gate + plan + test + review kept |
| `--auto` | Skip user approval gates; gate fields filled best-effort with `[ASSUMED]` logging; review auto-approves if `Critical = 0 AND High = 0`; only mode that runs Deploy |
| `--from-plan` | Skip Research + Plan stages; extract the 5 gate items from the plan file, `[ASSUMED]`-log any missing (auto-set when arg is a plan path) |
| `--no-test` | Skip Test stage; **log waiver** per cook skill gating rule |

**Guard:** `--auto` + `--no-test` cannot combine — auto-approval relies on tests; a test waiver requires human sign-off. Fall back to interactive approval and tell the user why.

**Loop cap (all modes):** max **3 fix cycles per gate** (Test, Review). On the 3rd failure: halt, run the `retro` skill ([.claude/skills/software/retro/SKILL.md](.claude/skills/software/retro/SKILL.md)) on spec/scope, ask the user.

## Workflow

Stages are named; numbering lives in the cook skill (source of truth).

### Gate — Exact-Requirements Gate

* Activate the `cook` skill; run its Stage 0 gate: derive the 5 items (expected output, acceptance criteria, scope boundary, constraints, touchpoints). Missing item → STOP, ask the user ONE question at a time. Mode behavior (`--auto` assumes + logs; `--from-plan` extracts from plan) is defined in the skill.
* The gate is **UNSKIPPABLE**. `--fast` and `--auto` never bypass it; `--from-plan` satisfies it from the plan file.
* Analyze the skills catalog via `/ck:find` (don't read the full registry); activate what's needed (e.g. `planning`, `research`, `code-review`, `scenario`, `test-automation`).
* If `--from-plan`: read the plan end-to-end, map dependencies, list ambiguities, then jump to **Implement**.

### Research

**Skip if `--fast` or `--from-plan`.** Command-level extension — not a numbered stage in the cook skill; feeds the skill's Stage 1 (Plan).

* Spawn `researcher` agent(s) + `scout` agent in parallel; reports → `plans/<plan>/reports/`. Consolidate findings.

### Plan

**Skip if `--from-plan`.**

* Delegate to `planner` agent → plan in `./plans/<YYMMDD-HHMM>-<slug>/plan.md` (timestamp via `bash -c 'date +%y%m%d-%H%M'`). Plan must cite impact diff, files to change, risks.
* **Gate**: user reviews the plan before coding (skip prompt in `--auto`).
* On approval, offer the context-reset path: user runs `/clear` then `/ck:cook <plan-path>` to implement with a fresh context (framework default: "Plan once, `/clear`, cook"). Continuing in-session is fine for small features. In `--auto`: skip the offer, continue in-session.

### Implement

* Read the plan general overview only; implement phases one by one — do **not** load all phases at once.
* Frontend (UI, components, pages, styling/design) → `frontend-developer` (activates `aesthetic` + `frontend-design` skills for design work; `ai-multimodal` skill to generate + verify image assets).
* Backend (APIs, database, server) → `backend-developer`.
* `project-manager` updates phase progress in the plan file between phases.
* After each phase: type-check + compile; resolve syntax errors before continuing.

### Test

**Skip if `--no-test` (waiver logged in plan file).**

* Real tests: happy path + negative + recovery. **No mocks-to-pass, no fake data.**
* `tester` runs the suite. On failure: `debugger` finds root cause → implementer fixes → re-run. 100% pass required; loop cap applies.

### Review

Follow the `code-review` skill ([.claude/skills/software/code-review/SKILL.md](.claude/skills/software/code-review/SKILL.md)) — single source of truth for the review protocol (SHAs, dispatch fields, edge-case scouting, verification gates).

* Optional for complex changes: `/ck:scout edge cases for <feature>` → hand report to reviewer.
* Dispatch `code-reviewer` per the skill's "Requesting Review" protocol; it emits Critical / High / Medium / Low.
* **Adversarial verify (before any fix):** each Critical/High finding must survive an independent skeptic before it enters the fix loop. Dispatch the `debugger` agent (NOT the reviewer that raised it — `debugger` owns reproduction) prompted to *refute* the finding — reproduce it at the cited `file:line`, confirm the failing input→output, check it isn't already handled. Verdict `CONFIRMED` (with repro evidence) → proceed to fix. `REFUTED` / can't-reproduce → drop the finding, log why. Default-to-refuted when the `debugger` is uncertain. This is the [Adversarial verify quality pattern](../../../README.md); a fix loop is expensive (loop cap = 3), so never spend a cycle on a phantom bug.
* **Gate decision:** `--auto` passes if `Critical = 0 AND High = 0` (counting CONFIRMED findings only), else falls back to user approval. Default / `--fast`: always user approval.
* Confirmed Critical/High findings: fix → re-run Test → re-review until clean (loop cap applies). Apply the skill's Verification Gates before claiming "fixed".

### Docs

**On approval (or auto-approve):** `project-manager` (plan progress + `./docs/project-roadmap.md`) and `docs-manager` (`./docs/*` if affected) in parallel.
**On rejection:** clarify issues with user → fix → loop back to Test.

### Deploy

**Runs only in `--auto` mode.** Default / `--fast`: end at ready-to-merge; list manual deploy steps in the Report instead.

* Per cook skill Stage 6: commit + push via `git-manager`, then run the project's **documented** release/deploy process (deploy script, CI release workflow, or `./docs/deployment-guide.md`).
* No documented deploy path found → skip, **log waiver**, surface manual steps in the Report. Never guess a deploy procedure.
* Post-deploy: smoke check + document rollback path. Smoke fails → execute rollback first, then debug (loop cap applies).

### Report

* **Acceptance-criteria checklist (mandatory):** table of each Gate criterion → verification evidence (test output, command result). No completion claim without it (code-review skill Iron Law).
* Instruct user how to use the feature (env vars, keys, config). Default: one question at a time; in `--auto`, bundle everything into the report — never block.
* Summarize changes; suggest next steps. Offer commit + push → `git-manager` (already done if Deploy ran). If Deploy was skipped (non-auto): list the manual deploy steps.
* List unresolved questions at the end.

## Mode Quick Reference

```
/ck:cook "add user profile"                → full pipeline, interactive gates
/ck:cook "add OAuth login" --auto          → autonomous; auto-approve if clean review
/ck:cook plans/260517-1430-auth/plan.md    → auto --from-plan; jump to implement
```

## Relationship to Other Commands

- `/ck:plan` — creates plan only; pair with `/ck:cook plan.md` to execute.
- `/ck:team` — parallel multi-session fan-out (vs cook's sequential gated pipeline).
- `/ck:brainstorm` — architectural decisions before planning.
