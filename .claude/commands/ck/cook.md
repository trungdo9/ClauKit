---
description: ⚡⚡⚡ Drive a feature spec through research, plan, code, test, review
argument-hint: [task or plan-path] [--fast] [--auto] [--from-plan] [--no-test]
---

Think harder to drive the following feature end-to-end. Follow the cook skill methodology, the Orchestration Protocol, Core Responsibilities, Subagents Team and Development Rules:

<task>$ARGUMENTS</task>

## Role Responsibilities

- You are a senior software engineer driving a feature from idea (or existing plan) to production-ready code.
- Activate the `cook` skill ([.claude/skills/software/cook/SKILL.md](../../skills/software/cook/SKILL.md)) — the **single source of truth** for the gated lifecycle (Gate → Plan → Code → Test → Review → Docs → Deploy), the Exact-Requirements Gate, gating rules, and anti-patterns. Don't redefine methodology here; delegate to the skill.
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

**Loop caps (all modes):** the per-gate cap, the per-feature cap, the breaker at the 3rd failed cycle and the `retro` halt all live in the [`cook` skill](../../skills/software/cook/SKILL.md) § Loop cap + breaker — one home, because a cap stated in two places drifts, and this pair already had: the command carried a feature-level cap the skill did not, so every other consumer of that skill ran without it.

## Dispatch Tiers (Rule 0 — every dispatch names a model)

An omitted `model` inherits the session's tier and silently defeats tiering; a dispatch without one **is a review finding**. Source of truth: [model-tiering.md](../../skills/software/context-engineering/references/model-tiering.md).

| Stage | Agent | `model` |
|---|---|---|
| Research | `researcher` · `scout` | `sonnet` · `haiku` |
| Plan | `planner` | `opus` |
| Verify-Plan | `debugger` ×N (read-only, one per claim group) | `sonnet` |
| Implement | `backend-developer` / `frontend-developer` | `haiku` when the brief carries complete code; else `sonnet` |
| Implement (bookkeeping) | `project-manager` | `haiku` |
| Test | `tester` | `sonnet` |
| Review (per cycle) | `code-reviewer` | `sonnet` |
| Review (**final whole-branch**, or diff >200 lines / >3 files / auth·payments·migrations) | `code-reviewer` | `opus` |
| Adversarial verify | `debugger` | `sonnet` |
| Docs | `docs-manager` | `haiku` |
| Deploy / commits | `git-manager` | `haiku` |

**Tier the loop, not the dispatch.** Review is the only multiplicative gate — `cycles × (1 reviewer + N findings + 1 test re-run)` — so these three agents (`code-reviewer`, `debugger`, `tester`) set the run's cost, not `planner`. Escalate on a **verdict** (`UNVERIFIABLE` Critical, or a root cause that survived one sonnet pass), never on the schedule. Batch adversarial verify **by file**, not by finding.

**Fan-out mechanics.** *Which* agents may fan out is the skill's ruling, not this file's — [`cook` skill](../../skills/software/cook/SKILL.md) § Implement: agents that write only reports (Research, Verify-Plan, Review), never two implementers on one tree. What is mechanical lives here, and it is one mechanism, not an attitude: a stage is concurrent only if each dispatch leaves before the previous one has been waited on — see "Two routes" below for the two ways to get that and the one field that prevents both. Path-disjoint parallel *implementation* is `/ck:team`'s job, not cook's (`team` skill § Shared-Tree Protocol — *partition, don't isolate*; overlap ⇒ serialize). Two invariants for every fan-out:

- each agent writes **its own** report path — never a shared file, or the last writer wins;
- **only the main session appends to `STATE.md`** — N agents appending to one ledger drops lines, and the ledger is what a killed run resumes from.

Cap concurrency at ~4 and prefer fewer, larger groups: N dispatches over the same file re-read that file N times.

**Two routes, and one field that defeats both.** Either send the whole batch in one message, **or** leave each agent in the background — the `Agent` tool's own default — and collect the reports afterwards. What actually kills the concurrency is passing **`run_in_background: false`**: that makes the orchestrator block on the agent it just sent, so the next dispatch cannot leave until the previous one is finished, and no amount of "in parallel" in the prose changes it. This is measured, not theorised: across two full runs in ClauKit's own behavioural harness (repo-internal, not shipped with any kit) the claim grouping was correct every time and **8 of 8 dispatches carried `run_in_background: false`**, so both runs queued; a third run that only left them in the background passed. Set it to `false` only when the very next step needs that agent's verdict — and when a group genuinely depends on another group's verdict, serialize on purpose and write the dependency in `STATE.md`.

## Environment Pre-flight (before the first edit)

Planning and verification are read-only — the check belongs before the **first edit**, not the first thought.
1. **Detect (free, at start):** `node .claude/hooks/file-claims.cjs list` → any `FOREIGN` claim means another live session is editing this tree. A dirty `git status --porcelain` containing work you didn't author counts too.
2. **Baseline (before the first edit):** run the suite on the untouched tree and append `baseline: <X/Y> (<sha7>)` to `plans/<plan>/STATE.md` (run-state skill). This is what makes "is this failure pre-existing?" answerable later. **Red where green is expected, or a runner that cannot run ⇒ stop before the first edit** and report — see the [`tdd` skill](../../skills/software/tdd/SKILL.md) § Baseline.
3. **On overlap, coordinate — don't isolate:** do not edit a file another live session claims. Confine edits to unclaimed paths; if the task cannot avoid a claimed file, **stop and report which session owns it** instead of racing. `guard-destructive` Tier B declines whole-tree staging while a foreign claim is live.

## Workflow

Stages are named; numbering lives in the cook skill (source of truth).

### Gate — Exact-Requirements Gate

* Activate the `cook` skill; run its Stage 0 gate: derive the 5 items (expected output, acceptance criteria, scope boundary, constraints, touchpoints). Missing item → STOP, ask the user ONE question at a time. Mode behavior (`--auto` assumes + logs; `--from-plan` extracts from plan) is defined in the skill.
* The gate is **UNSKIPPABLE**. `--fast` and `--auto` never bypass it; `--from-plan` satisfies it from the plan file.
* **Scope lock (item 3, defended):** when the task *could* span >1 repo/layer, emit the skill's A/B minimal-vs-thorough table (repos/layers touched + conventions followed/broken per option) and **halt for the pick** before planning. `--auto`: pick A, `[ASSUMED]`-log. Never create unrequested artifacts in a PR-bound branch.
* Analyze the skills catalog via `/ck:find` (don't read the full registry); activate what's needed (e.g. `planning`, `research`, `code-review`, `scenario`, `test-automation`).
* If `--from-plan`: read the plan end-to-end, map dependencies, list ambiguities, then run **Verify-Plan** before **Implement**.

### Verify-Plan (Stage 0.5)

**Mandatory when `--from-plan`; elsewhere run iff the plan asserts ≥1 falsifiable claim about existing behaviour.** Activate the `verify-plan` skill ([.claude/skills/software/verify-plan/SKILL.md](../../skills/software/verify-plan/SKILL.md)): extract every factual claim, prove/disprove each with git evidence + read-only queries + file reads, write the table to `plans/<plan>/reports/plan-verification.md`. **No code until the table is approved**; any REFUTED load-bearing claim → back to `planner`. Append the gate result to `STATE.md`.

* **Fan out by claim group (≥4 claims spanning ≥2 subsystems).** Extract the claim list in the main session — that stays cheap — group the claims by the file/subsystem they are *about* so no two dispatches re-read the same file, then **send every group's dispatch without waiting for the previous one** — N `debugger` calls in one message, or N background dispatches, never `run_in_background: false` on a group (see § Dispatch Tiers "Two routes"). Dispatching group 1, reading its verdict, then dispatching group 2 costs the sum of the groups instead of the slowest one. Each writes `reports/plan-verification-<group>.md`; the **main session merges them into the one `plan-verification.md` table** and appends the single gate line. Fewer claims, or all of them about one file → one dispatch; the fan-out is latency relief, not ceremony.
* A group that comes back `UNVERIFIABLE` is not a pass — it re-dispatches or escalates a tier, same as any other verdict. Merging must not launder a missing verdict into a filled table.

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
* **Fresh implementer subagent per phase** (cook skill "Implement" section is the contract): main session keeps only the loop, gates, and ledger. Dispatch = 1 line of context + **brief file path** (`node .claude/scripts/ck/phase-brief.cjs <plan> <N>`) + cross-phase interfaces + known ambiguity resolutions + report path. **Never paste session history; keep dispatches <2k chars.** Statuses: `DONE`/`DONE_WITH_CONCERNS`/`NEEDS_CONTEXT`/`BLOCKED`.
* Frontend (UI, components, pages, styling/design) → `frontend-developer` (activates `aesthetic` + `frontend-design` skills for design work; `ai-multimodal` skill to generate + verify image assets).
* Backend (APIs, database, server) → `backend-developer`.
* Never two implementers in parallel on the same tree — dispatch editing phases sequentially.
* `project-manager` updates phase progress in the plan file between phases.
* After each phase: type-check + compile; resolve syntax errors before continuing. **Verify the agent produced a diff** (`git diff --stat`) before recording the phase complete — a dead agent reports nothing and changes nothing; append `phase N: agent died (no diff) — redispatch` to `STATE.md` and redispatch.
* **Commit every phase** — `git` skill § **Per-Phase Commits** is the contract:
  1. before dispatch: `git rev-parse --short HEAD` → append `phase <N>: started (base <sha7>)`;
  2. exit gate green → scoped commit via `git-manager` (`model: haiku`; manifest from the claim registry, never `-A`) **on the current branch** (§ Branch Policy — no `checkout -b`);
  3. then append `phase <N>: complete (commits <a7>..<b7>, tests <X/Y>, …)`.

  Not optional bookkeeping: `run-state` resume re-derives state from `git log <base>..HEAD`, and Review's BASE is the phase's recorded `started (base <sha7>)` — with nothing committed a killed run re-implements finished work and `review-package.cjs` has no range to package. The user's approval gates **push** and **PR**, not these local checkpoints.

### Test

**Skip if `--no-test` (waiver logged in plan file).**

* Real tests: happy path + negative + recovery. **No mocks-to-pass, no fake data.**
* `tester` (`model: sonnet`) runs the suite. On failure: `debugger` (`sonnet`) finds root cause → implementer fixes → re-run. 100% pass required; loop cap applies (3 per gate, 5 per feature). A failure that survives one sonnet pass escalates one tier — a second identical dispatch does not.

### Review

Follow the `code-review` skill ([.claude/skills/software/code-review/SKILL.md](../../skills/software/code-review/SKILL.md)) — single source of truth for the review protocol (SHAs, dispatch fields, edge-case scouting, verification gates).

* Optional for complex changes: `/ck:scout edge cases for <feature>` → hand report to reviewer.
* **BASE comes from the ledger, never `HEAD~1`:** use the first implemented phase's recorded `started (base <sha7>)` (Implement step 1) → `node .claude/scripts/ck/review-package.cjs <BASE> HEAD --plan <plan-dir>`, hand the reviewer the **file path**. `HEAD~1` silently truncates a multi-commit phase.
* Dispatch `code-reviewer` per the skill's "Requesting Review" protocol; it emits Critical / High / Medium / Low. **Tier:** `sonnet` per fix cycle; `opus` for the **final whole-branch review** and for a high-risk diff (>200 lines, >3 files, or auth/payments/migrations/cross-service).
* **Dimension fan-out — only above that same high-risk threshold.** A diff that already earns `opus` also earns a split find pass: concurrent `code-reviewer` dispatches by dimension (correctness · security · performance · test-coverage), one message, each handed the same diff-**file** path plus its own report path; the main session dedupes by `file:line` before adversarial verify. Below the threshold, **one reviewer** — Review is the multiplicative gate (§ Dispatch Tiers), so 4 reviewers is 4× the per-cycle cost, and a 50-line diff does not carry four dimensions of risk. Unlike the read-only fan-outs above, this one buys coverage with tokens, not just wall-clock; the threshold is what keeps it honest.
* **Adversarial verify (before any fix):** each Critical/High finding must survive an independent skeptic before it enters the fix loop. Dispatch the `debugger` agent (`model: sonnet`; NOT the reviewer that raised it — `debugger` owns reproduction), **batched by file and sent concurrently** — several findings in one file are one dispatch, since N dispatches re-read the same file N times, and **all file-batches go out in one message**: disjoint files, read-only agents, so the concurrency costs zero extra tokens and shrinks the gate's wall-clock from the sum of the files to the slowest one — prompted to *refute* the finding — reproduce it at the cited `file:line`, confirm the failing input→output, check it isn't already handled. Verdict `CONFIRMED` (with repro evidence) → proceed to fix. `REFUTED` / can't-reproduce → drop the finding, log why. Default-to-refuted when the `debugger` is uncertain. This is the adversarial-verify pattern; a fix loop is expensive (loop cap = 3), so never spend a cycle on a phantom bug.
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

* **Acceptance-criteria checklist (mandatory):** run the [`cook` skill](../../skills/software/cook/SKILL.md) § Closing gate — every Stage-0 criterion answered with the test output or command result that settles it. No completion claim without it.
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
