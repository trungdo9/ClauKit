# Plan — Eval hillclimb: implicit skill routing (A') + harness hygiene (D)

**Created**: 2026-10-01 · **Type**: repo-internal test tooling + one shipped workflow doc · **Version impact**: patch (only if a climb round is accepted)
**Source**: [brainstorm-261001-1429-eval-hillclimb.md](../reports/brainstorm-261001-1429-eval-hillclimb.md) — user approved **A' + D**.

## Problem

`tests/behavior/README.md` credits no gate by negative control alone; `scope-lock` failed because sessions never Read `cook/SKILL.md` — a **routing** failure, not a gate failure. Routing (which grouped `SKILL.md` a session Reads before acting) runs on *every* task and is steered by the two files every run loads (`.claude/workflows/skill-activation.md`, `.claude/workflows/development-rules.md`). Nothing measures it. Separately, `--negative` verdicts flip on 3 runs with no interval reported (D).

## Done state (working backwards)

1. `npm test` pins the grader, stats, scrubber, guard, and the new negative-control rule — no model in the loop.
2. A local, git-ignored dataset of ≥ 40 scrubbed real prompts, double-labelled, split 70/30.
3. A baseline: accuracy per split, Wilson 95% CI, noise floor, per-gate slice, cost.
4. **Either** headroom gate stops the work (baseline ≥ 0.90, honest result) **or** ≤ 5 climb rounds on `skill-activation.md`, each accepted only by the rule below, held-out test untouched by authoring.
5. README + development-rules document the routing eval and the non-discriminating rule.

## Phases

| # | Phase | Est. | Depends | Stop point |
|---|---|---|---|---|
| 01 | [Grader, stats, guard — offline + unit tests](phase-01-grader-stats-guard.md) | 0.5d | — | |
| 02 | [D: negative-control hygiene (Wilson CI + non-discriminating rule)](phase-02-negative-control-hygiene.md) | 0.25d | 01 | ships independently |
| 03 | [Dataset: mine, scrub, label, split](phase-03-dataset-mine-scrub-label.md) | 0.75d | 01 | < 40 cases ⇒ measure-only |
| 04 | [Routing eval runner + CLI probe](phase-04-routing-eval-runner.md) | 0.5d | 01, 03 | |
| 05 | [Baseline + headroom gate](phase-05-baseline-headroom-gate.md) | 0.25d + ~3h compute | 02, 04 | **≥ 0.90 ⇒ skip 06** |
| 06 | [Hillclimb rounds on the surface](phase-06-hillclimb-rounds.md) | 1–1.5d | 05 | ≤ 5 test evaluations |
| 07 | [Docs + close-out](phase-07-docs-close-out.md) | 0.25d | 05 (and 06 if run) | |

Total ≈ 3.5–4 person-days, of which ~1d is unattended compute.

## Global Constraints

- **Language/idiom**: Node CommonJS `.cjs` (no deps), `node:test` + `node:assert`, bash with `set -u`. Every **new** file < 200 lines. `tests/behavior/tool-sequence.cjs` change limited to its `module.exports` line (export `MUTATORS`, `BASH_WRITE`).
- **New file locations**: `tests/behavior/stats.cjs`; `tests/behavior/routing/{route-grade.cjs,routing-stats.cjs,routing-guard.cjs,mine-prompts.cjs,scrub-pii.cjs,split-cases.cjs,routing-report.cjs,run-routing-eval.sh}`; test file `tests/behavior-routing.test.js`.
- **Private data dir**: `tests/behavior/routing/data/` — git-ignored via `.gitignore` line `/tests/behavior/routing/data/`. Holds `candidates.jsonl`, `cases.jsonl`, `scrub-terms.local.txt`, `results/*.jsonl`, transcripts. **Never committed. Committed reports (`plans/261001-1521-eval-hillclimb-routing/reports/*.md`) carry case ids + numbers only, never prompt text.**
- **Transcript source**: `~/.claude/projects/*/*.jsonl`; exclude project dirs matching `^-tmp` (harness/scratch runs). Eval runs use `--no-session-persistence` so they never re-enter the pool.
- **Climb surface**: `.claude/workflows/skill-activation.md` **only**. `development-rules.md` is edited only in phase 02 (before baseline) and frozen afterward.
- **Hygiene rule**: no 6-word shingle (lower-cased, whitespace-normalised) of any case prompt may appear in the surface — enforced by `routing-guard.cjs leak`.
- **Size rule**: `wc -c` of `skill-activation.md` + `development-rules.md` must not exceed the baseline value recorded in phase 05.
- **Run flags** (every `claude -p` in the routing eval): `--output-format stream-json --verbose --no-session-persistence --max-budget-usd ${PER_RUN_USD:-0.50} --permission-mode default --allowedTools "Read,Grep,Glob,Bash,Skill"` (Edit/Write/NotebookEdit deliberately not allowed — an attempt still appears as a `tool_use` and counts as a mutation), `timeout 300`, `--model "$CK_BEHAVIOR_MODEL"` when set.
- **Budget**: `ROUND_BUDGET_USD` **must be set explicitly** (runner refuses without it). Sum of `total_cost_usd` ≥ budget ⇒ stop, exit 3, sweep = INCOMPLETE (no verdict).
- **Outcome classes** reuse the harness: PASS / FAIL / ERROR; ERROR = `infra_failure_reason` from `tests/behavior/run-scenario.sh` (sourced) or zero tool calls. ERROR stops the sweep (exit 3).
- **Stats**: Wilson score, z = 1.96. RUNS = 3 per case. Noise floor = max − min of the 3 replicate accuracies on that split.
- **Split**: seeded PRNG (mulberry32, seed `1729`), 70/30 stratified by `expected[0]`; `source:"registry"` cases forced to train, ≤ 20 % of train.
- **Thresholds**: dataset ≥ 40 transcript-sourced cases to climb · headroom stop at baseline accuracy ≥ 0.90 · max 5 test-split evaluations · non-discriminating at ablated pass rate ≥ `NONDISC_RATE` = 0.5.
- **Accept rule (climb)**: ACCEPT iff train Δ > train noise floor **and** test Δ > 0 **and** size rule holds **and** leak guard clean; else revert (`git checkout -- .claude/workflows/skill-activation.md`).
- **Model pinning**: every results file records model id + surface sha256; a baseline is invalid for another model.
- **Shipped-doc links** (CLAUDE.md): link targets relative to the containing file (`skill-activation.md` → `../skills/software/<name>/SKILL.md`); `tests/installer-packaging.test.js` must stay green.

## Scope options

| Option | Touches | Conventions | Verdict |
|---|---|---|---|
| (A) minimal | `tests/` + `.gitignore` + `skill-activation.md` (climb) + one bullet in `development-rules.md` + README | follows harness idiom; dataset local-only | **picked** — brainstorm A' + D |
| (B) thorough | (A) + migrate harness to `claude plugin eval`, ship `/ck:eval` | duplicates `/claude-api build-eval`; whole-plugin ablation ≠ per-gate | rejected (out of scope, decided) |

## Key risks

| Risk | Mitigation |
|---|---|
| Client PII in transcripts (<client>/* projects present) | scrub + human review + git-ignored data dir; prompts only sent to the same API that already saw them |
| Answer leakage / overfit to phrasing | registry cases train-only; leak guard; authoring reads train FAIL transcripts only |
| Absent client codebase changes routing | generic fixture repo (phase 04); routing should precede exploration per rule 1 |
| Spend limit 429 / cost blow-up | explicit `ROUND_BUDGET_USD`, per-run cap, ERROR stops sweep |
| Adaptive overfit to test split | ≤ 5 test evaluations; test transcripts never opened |
| Model drift | model id pinned in results; re-baseline on model change |
| Small n ⇒ wide CI | report CI, never a bare %; claim only Δ > noise floor |

## Out of scope (decided)

No `/ck:eval` command · no migration to `claude plugin eval` · no hillclimb of `/ck:find` · no climbing `development-rules.md`.

## Plan Completeness

- [x] spec coverage — every requirement maps to a phase
- [x] placeholder scan clean
- [x] Interfaces blocks consistent across phases
- [x] every phase gate is a runnable command with a stated expected result
- [x] Global Constraints values verbatim, not referenced
- [x] scope option recorded (A minimal / B thorough) — or N/A, single layer

## Unresolved questions

1. `ROUND_BUDGET_USD` value per sweep (estimate: 60 cases × 3 runs ≈ $20–35 on the default model)?
2. Second labeller: user, or an independent fresh subagent (default in phase 03)?
3. `NONDISC_RATE` 0.5 OK? Stricter variant (credit only if Wilson upper bound < 0.5) needs `--negative=5`.
4. Which model is "the" eval model (default CLI model vs `CK_BEHAVIOR_MODEL`)?
5. Transcripts pruned by `cleanupPeriodDays`? Other machines/users to sample from?
