# Review package — c1653ba...d891d76 (merge-base diff)

## Commits
```
d891d76 test(behavior): report Wilson CI on negative controls, flag non-discriminating at rate
e0b55f4 test(behavior): add offline routing grader, Wilson stats and leak guard
52ad80f docs(plans): add eval-hillclimb-routing plan and brainstorm report
```

## Stat
```
.claude/workflows/development-rules.md             |   1 +
 .../phase-01-grader-stats-guard.md                 |  62 +++++++
 .../phase-02-negative-control-hygiene.md           |  29 +++
 .../phase-03-dataset-mine-scrub-label.md           |  32 ++++
 .../phase-04-routing-eval-runner.md                |  25 +++
 .../phase-05-baseline-headroom-gate.md             |  23 +++
 .../phase-06-hillclimb-rounds.md                   |  30 ++++
 .../phase-07-docs-close-out.md                     |  18 ++
 plans/261001-1521-eval-hillclimb-routing/plan.md   |  89 +++++++++
 .../reports/phase-01-impl.md                       |  63 +++++++
 .../reports/phase-02-impl.md                       |  25 +++
 .../reports/plan-verification-cli-data.md          |  27 +++
 .../reports/plan-verification-docs.md              |  27 +++
 .../reports/plan-verification-harness.md           |  22 +++
 .../reports/plan-verification.md                   |  31 ++++
 .../brainstorm-261001-1429-eval-hillclimb.md       |  86 +++++++++
 tests/behavior-harness.test.js                     |  31 +++-
 tests/behavior-routing.test.js                     | 199 +++++++++++++++++++++
 tests/behavior/routing/route-grade.cjs             | 121 +++++++++++++
 tests/behavior/routing/routing-guard.cjs           |  58 ++++++
 tests/behavior/routing/routing-stats.cjs           |  80 +++++++++
 tests/behavior/run-scenario.sh                     |  18 +-
 tests/behavior/stats.cjs                           |  34 ++++
 tests/behavior/tool-sequence.cjs                   |   2 +-
 24 files changed, 1125 insertions(+), 8 deletions(-)
```

## Diff (-U10)
```diff
diff --git a/.claude/workflows/development-rules.md b/.claude/workflows/development-rules.md
index 10255c1..5f3b194 100644
--- a/.claude/workflows/development-rules.md
+++ b/.claude/workflows/development-rules.md
@@ -74,19 +74,20 @@ Context size × turns is the cost driver. On the same workspace one session ran
 - Baseline for "is this failure pre-existing?" = the suite run on the untouched tree **before the first edit**, recorded in `STATE.md`. Already dirty ⇒ park your own WIP on a scratch branch by explicit paths (untracked included, never `-A`/`-am`), check out the base, and **verify `git status --porcelain` is empty before running** — the `tdd` skill § Baseline has the 4 steps. Foreign dirty files ⇒ do not park, stop. **Never `git stash`** (silently no-ops).
 
 ## Cross-Service Changes
 - A caller must not ship before the dependency endpoint is deployed — **state the required deploy order in the commit/PR description** (which side ships first, and why it is safe in between).
 - Migrations run behind a feature flag with the legacy path preserved until cutover; removal of the legacy path is its own, later change.
 - Contract changes (payload shapes, status codes) are verified against the consumer's actual parsing (`scout` per repo, shapes reported), not against the producer's intent.
 
 ## Behavioural-Skill Governance
 - A change to a **behavioural** skill (`tdd`, `verify-plan`, `run-state`, `code-review`, `debugging`, `cook`) requires running the project's behavioural-eval scenario for that gate before and after the change. Reference skills — the ones that document capability rather than shape behaviour — are exempt. *(ClauKit's own harness lives in `tests/behavior/`, which is repo-internal and not shipped by any kit; a consuming project supplies its own.)*
 - **A green scenario is not evidence by itself.** It counts as evidence about your rule only under a control: the behaviour vanishes in *every* ablated run (`--negative`), or removing one claimed-load-bearing line flips a failing case and reproduces (`--positive`). Both are causal; the one-line version isolates more tightly, because full ablation differs by a directory plus dozens of lines.
+- **Ablated pass rate ≥ 50 % ⇒ the scenario is non-discriminating and never credited.** Report the Wilson interval (`tests/behavior/`), not a bare count; 0/3 cannot exclude 50 %, so claim it with ≥ 5 runs.
 - **Where neither control is reachable, record that and ship — do not block, and do not call the gate demonstrated.** A rule the current model already follows unprompted is not a wrong rule; it is an invisible one, and the two are easy to confuse in the direction that gets working rules deleted.
 - **A rule that names an intent instead of a mechanism can be obeyed and still not happen.** `fan-out-concurrency` failed twice — the second time against a deliberately imperative rewrite with an explicit self-check — because every dispatch carried `run_in_background: false`, which blocks the orchestrator regardless of wording. Naming the field made it pass, and removing that one line flips it back. Before rewriting a rule for emphasis, check whether the behaviour has a mechanism the text has not mentioned.
 - **Chasing invisibility with harder fixtures does not work, and that is measured, not assumed.** `tdd-red-first` lost its behaviour in 5 of 13 ablated runs across two fixtures — the second built specifically to make test-first expensive (symptom two hops from cause, nothing naming a function or a value, a one-character fix against a test that must be invented). The investigation got two to three times deeper and the model still went red-first unprompted. That conclusion cost four live runs; do not re-buy it.
 
 | scenario | what running it proves today |
 |---|---|
 | `verify-plan-fires` · `scope-lock` · `fan-out-concurrency` | **load-bearing** — positive-controlled, so a regression here is a real regression |
 | `tdd-red-first` · `iron-law` · `resume-from-ledger` | **regression-only** — green means the kit still works, not that the rule caused it |
 | `guard-tier-b` | little: the hook itself is covered by 24 cases in `tests/guard-destructive.test.js`, and the scenario showed the model never reaches for the broad stage the hook guards |
\ No newline at end of file
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-01-grader-stats-guard.md b/plans/261001-1521-eval-hillclimb-routing/phase-01-grader-stats-guard.md
new file mode 100644
index 0000000..180bc09
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-01-grader-stats-guard.md
@@ -0,0 +1,62 @@
+# Phase 01 — Grader, stats, guard (offline + unit tests)
+
+**Goal**: every deterministic piece of the routing eval exists and is pinned in `npm test` before any `claude -p` money is spent.
+
+## **Interfaces**
+
+**Consumes**: `tests/behavior/tool-sequence.cjs` → `parse(lines) → { steps, prose }`; step = `{ idx, turn, tool, target, raw, input, result }`.
+
+**Produces**:
+```js
+// tests/behavior/stats.cjs
+wilson(k, n, z = 1.96) → { p, lo, hi }        // n = 0 → { p: 0, lo: 0, hi: 1 }
+// CLI: node tests/behavior/stats.cjs wilson <k> <n>  → prints "p=0.33 lo=0.06 hi=0.79"
+
+// tests/behavior/routing/route-grade.cjs
+routeOf(step, aliases) → string | null        // "cook" | "ck:fix" | null (neutral)
+isMutation(step) → boolean
+commandAliases(commandsDir) → Map<"ck:<x>", Set<skillName>>
+gradeRoute(steps, expected: string[], aliases) →
+  { verdict: "PASS"|"FAIL", route: string|null, routeIdx: number|null,
+    mutationIdx: number|null, why: string }
+// CLI: node route-grade.cjs <events.jsonl> --expected cook,tdd [--commands <dir>] → prints JSON, exit 0 PASS / 1 FAIL
+
+// tests/behavior/routing/routing-stats.cjs
+aggregate(rows, split?) → { n, k, acc, lo, hi, replicateAcc: number[], noise, errors, costUsd, byGate: {[g]: {n,k,acc}} , flaky: number }
+decide(base, cand) → { verdict: "ACCEPT"|"REVERT", why, trainDelta, testDelta }   // cand/base = aggregate per split
+
+// tests/behavior/routing/routing-guard.cjs
+shingles(text, n = 6) → Set<string>
+leak(surfaceText, prompts: string[]) → string[]       // offending shingles, [] = clean
+surfaceBytes(files: string[]) → number
+// CLI: node routing-guard.cjs leak <cases.jsonl> <surface.md>   → exit 0 clean / 1 leak (prints shingles count only, never text)
+//      node routing-guard.cjs bytes <file>...                   → prints total bytes
+```
+Row shape (shared with phases 04–06): `{ case, split, run, verdict, route, why, costUsd, model, surfaceSha }`.
+
+## Tasks
+
+1. `tests/behavior/tool-sequence.cjs`: append `MUTATORS, BASH_WRITE` to `module.exports`. No other change.
+2. `tests/behavior/stats.cjs` (~40 lines): `wilson` + CLI.
+3. `tests/behavior/routing/route-grade.cjs` (~150 lines):
+   - `routeOf`: `Read` whose `file_path`, or `Bash` whose command starts with `cat|head|tail|sed -n|less|bat` and names a path, matching `/skills/(?:[^/]+/)*([^/]+)/SKILL\.md$` → capture group (dir name). `Skill` tool → `input.skill`. Read of `.claude/commands/<ns>/<x>.md` → `<ns>:<x>`. Everything else (registry, workflows, `references/*.md`, CLAUDE.md) → `null`.
+   - `isMutation`: `MUTATORS.has(tool)` (any outcome, incl. permission-denied) or `Bash` with `BASH_WRITE`.
+   - `commandAliases`: for each `<dir>/<ns>/<x>.md`, collect skill names from link targets matching the `routeOf` SKILL.md regex.
+   - `gradeRoute`: first step with non-null route. PASS iff route ∈ expected, **or** route is a command whose alias set intersects expected; **and** `routeIdx < mutationIdx` (or no mutation). FAIL `why` ∈ `no-route` · `wrong-route:<tok>` · `mutation-first@<idx>`.
+4. `tests/behavior/routing/routing-stats.cjs` (~120 lines): `aggregate` (ERROR rows excluded from n, counted in `errors`; `replicateAcc[r]` = acc over rows with `run === r`; `noise = max − min`; `byGate` keyed by case's `expected[0]`, read from a `cases` map arg; `flaky` = cases with 0 < per-case pass < runs) and `decide` per the plan's Accept rule (size/leak checked by caller, passed as booleans `sizeOk`, `leakOk`).
+5. `tests/behavior/routing/routing-guard.cjs` (~80 lines): shingle = 6 consecutive `[a-z0-9]+` tokens after lower-casing.
+6. `tests/behavior-routing.test.js` — synthetic streams built with the same `asst/use/res` helpers idiom as `tests/behavior-harness.test.js`. Cases (each a `test(...)`):
+   - Read `cook/SKILL.md` then Edit → PASS; Edit then Read → FAIL `mutation-first`.
+   - First route `debugging` with expected `[tdd]` → FAIL `wrong-route:debugging`.
+   - `Bash cat .claude/skills/software/tdd/SKILL.md` counts as route `tdd`.
+   - `Skill {skill:"ck:fix"}` with alias `ck:fix→{tdd}` and expected `[tdd]` → PASS.
+   - Registry Read then cook Read → route `cook` (registry neutral).
+   - Denied Write (`is_error: true`) still counts as mutation.
+   - Bash `echo x > f` counts as mutation; `cat f` does not.
+   - No route, no mutation → FAIL `no-route`.
+   - `wilson(0,3).hi` ≈ 0.5615 (±0.001); `wilson(3,3).lo` ≈ 0.4385; `wilson(0,0)` = `{0,0,1}`.
+   - `aggregate`: ERROR rows excluded; `noise` from replicate spread.
+   - `decide`: train Δ ≤ noise → REVERT; train ok + test Δ = 0 → REVERT; train ok + test Δ > 0 + size/leak ok → ACCEPT; `sizeOk:false` → REVERT.
+   - `leak`: surface containing a 6-word run from a prompt → non-empty; 5-word run → `[]`.
+
+**Exit gate:** `node --test tests/behavior-routing.test.js` → all pass, 0 fail · `npm test` → 0 fail (no regression in `tests/behavior-harness.test.js`) · `wc -l tests/behavior/stats.cjs tests/behavior/routing/*.cjs` → every file < 200.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-02-negative-control-hygiene.md b/plans/261001-1521-eval-hillclimb-routing/phase-02-negative-control-hygiene.md
new file mode 100644
index 0000000..cba5cf4
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-02-negative-control-hygiene.md
@@ -0,0 +1,29 @@
+# Phase 02 — D: negative-control hygiene (Wilson CI + non-discriminating rule)
+
+**Goal**: `run-scenario.sh --negative` reports an interval, and a scenario whose behaviour survives ablation at ≥ `NONDISC_RATE` is labelled non-discriminating and never credited. Done **before** the phase-05 baseline so the `development-rules.md` byte count is final.
+
+## **Interfaces**
+
+**Consumes**: `tests/behavior/stats.cjs` CLI `node tests/behavior/stats.cjs wilson <k> <n>` → `p=<..> lo=<..> hi=<..>` (phase 01).
+**Produces**: runner output lines (asserted by tests):
+- `   ablated pass rate <leaked>/<N>, Wilson 95% CI [<lo>, <hi>]` — printed after every `--negative` loop.
+- `✗ <s> NOT DISCRIMINATING — …` when `leaked / N ≥ NONDISC_RATE` (was: only when `leaked == N`).
+- `   ⚠ N=<N> cannot exclude an ablated pass rate ≥ <NONDISC_RATE> (upper bound <hi>); use --negative=5 or more` when `leaked == 0` and `hi ≥ NONDISC_RATE` (informational; still credited).
+- Env `NONDISC_RATE` default `0.5`.
+
+## Tasks
+
+1. `tests/behavior/run-scenario.sh` `main()`, in the `--negative` block after the `for _n` loop:
+   - compute CI: `ci=$(node "$HARNESS_DIR/stats.cjs" wilson "$leaked" "$NEGATIVE_RUNS")`, print the CI line.
+   - replace `elif [ $leaked -eq $NEGATIVE_RUNS ]` with a rate test: `node -e 'process.exit(+process.argv[1]/+process.argv[2] >= +process.argv[3] ? 0 : 1)' "$leaked" "$NEGATIVE_RUNS" "$NONDISC_RATE"`. Message: keep "measures the model, not the gate", add "(ablated pass rate ≥ $NONDISC_RATE)".
+   - `0 < rate < NONDISC_RATE` keeps the existing "SUPPORTED, NOT DEMONSTRATED" branch unchanged.
+   - `leaked == 0`: existing OK line, plus the ⚠ line when `hi ≥ NONDISC_RATE`.
+   - Usage text: document `NONDISC_RATE`.
+2. `tests/behavior-harness.test.js` — add to the existing `sweep`/`sweepSummary` stub tests:
+   - `[1,1,0]` (2/3 leaked) → `/NOT DISCRIMINATING/`, `doesNotMatch /SUPPORTED/` (new rule).
+   - `[0,1,0]` → still `/SUPPORTED, NOT DEMONSTRATED/` (existing test must pass unchanged).
+   - `[0,0,0]` → `/Wilson 95% CI \[0\.00, 0\.56\]/` and the ⚠ `--negative=5` line; still `/── 1 scenario\(s\) genuinely verified/`.
+   - `NONDISC_RATE=0.3` with `[0,1,0]` → `/NOT DISCRIMINATING/`.
+3. `.claude/workflows/development-rules.md` § Behavioural-Skill Governance: **one** bullet, ≤ 2 lines: ablated pass rate ≥ 50 % ⇒ the scenario is non-discriminating and is never credited; report the Wilson interval, not a bare count; 0/3 cannot exclude 50 % — use ≥ 5 runs to claim it. Prose path `tests/behavior/` in backticks only, no link (repo-internal, not shipped).
+
+**Exit gate:** `node --test tests/behavior-harness.test.js` → 0 fail (all existing + 4 new) · `bash -n tests/behavior/run-scenario.sh` → exit 0 · `node --test tests/installer-packaging.test.js` → 0 fail.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-03-dataset-mine-scrub-label.md b/plans/261001-1521-eval-hillclimb-routing/phase-03-dataset-mine-scrub-label.md
new file mode 100644
index 0000000..a178c93
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-03-dataset-mine-scrub-label.md
@@ -0,0 +1,32 @@
+# Phase 03 — Dataset: mine, scrub, label, split
+
+**Goal**: `tests/behavior/routing/data/cases.jsonl` — ≥ 40 transcript-sourced, scrubbed, double-labelled cases with a frozen train/test split. **Local only.**
+
+Pool measured 2026-10-01: 62 transcript files across 25 project dirs, 3,147 non-meta string user messages (most are follow-ups), 32 slash-command invocations. Several project dirs are client work (`<client>-*`) ⇒ PII is expected, not hypothetical.
+
+## **Interfaces**
+
+**Consumes**: `routing-guard.cjs` `shingles` (dedupe), registry `docs/clauKit-registry.md`, `.claude/commands/ck/*.md` (phase 01 `commandAliases`).
+**Produces**:
+- `data/candidates.jsonl` row: `{ id: sha1(text).slice(0,10), projectHash: sha1(dir).slice(0,8), sourceCmd: "ck:fix"|null, text }`
+- `data/cases.jsonl` row: `{ id, prompt, expected: string[], labels: { a: string[], b: string[] }, source: "transcript"|"transcript-cmd"|"registry", split: "train"|"test" }`
+- `scrub-pii.cjs` export `scrub(text, terms: string[]) → string`
+- `split-cases.cjs` export `split(cases, { seed = 1729, testFrac = 0.3 }) → cases` (pure, deterministic)
+
+## Tasks
+
+1. `.gitignore`: add `/tests/behavior/routing/data/` (with a one-line comment: client prompts, never commit). Verify before writing any data.
+2. `tests/behavior/routing/mine-prompts.cjs` (~120 lines): walk `~/.claude/projects/*/*.jsonl`; skip dirs matching `^-tmp`; take `type:"user"`, `isMeta` falsy, string `message.content`. Slash commands: extract `<command-name>` + `<command-args>`, keep args as `text`, set `sourceCmd`; drop if args < 6 words. Plain prompts: drop if starting with `<`, < 6 words, or > 1,500 chars. Dedupe by normalised text. Write `data/candidates.jsonl`; print counts only.
+3. `tests/behavior/routing/scrub-pii.cjs` (~90 lines): replace emails → `<EMAIL>`, URLs → `<URL>`, IPv4 → `<IP>`, secrets (`sk-…`, `ghp_…`, `AKIA…`, `xox[bp]-…`, 32+ hex/base64 runs) → `<SECRET>`, ticket keys `[A-Z]{2,6}-\d+` → `PROJ-123`, absolute home paths → `~/project/…`, every term in `data/scrub-terms.local.txt` (case-insensitive, one per line: client/product/person names, written by the user) → `<CLIENT>`. Unit tests in `tests/behavior-routing.test.js` with synthetic strings only.
+4. **Select** 60–90 candidates by hand from the scrubbed pool: task-shaped (asks for work), diverse across gates (aim ≥ 8 each for `cook`-scope, `tdd`/fix, `verify-plan`, `run-state`, plus planning/brainstorm/git/review/docs), not a pure follow-up. **Human review**: the user reads the selected list once for residual PII and either approves or adds terms to `scrub-terms.local.txt` and re-runs task 3.
+5. **Label** — two independent labellers, neither sees the other:
+   - A: implementing session, with `skill-activation.md` rule-5 table + registry one-liners.
+   - B: a fresh subagent given only the prompt and the list of skill dir names + `ck:` commands with their one-line descriptions (no rule-5 table, no A labels).
+   - Each emits 1–3 tokens (skill dir name or `ck:<cmd>`) a correct session would Read/invoke first. Keep iff `a ∩ b ≠ ∅`; `expected = a ∪ b`. Drop disagreements; record the drop count.
+6. Optional registry-derived synthetic cases (paraphrase a skill's "Triggers on" into a user-style request): `source:"registry"`, train only, ≤ 20 % of train.
+7. `tests/behavior/routing/split-cases.cjs` (~60 lines): mulberry32(1729), stratify by `expected[0]`, 30 % test, force `registry` → train. Freeze: write `split` into `cases.jsonl`; never re-split after phase 05 starts. Unit-test determinism (same input → same split) in `tests/behavior-routing.test.js`.
+8. Record in `plans/261001-1521-eval-hillclimb-routing/reports/dataset-summary.md` (committed): counts per source/split/gate, drop count, agreement rate. **No prompt text.**
+
+Decision point: transcript-sourced cases < 40 ⇒ phases 04–05 still run (measure-only); phase 06 is skipped and recorded as such.
+
+**Exit gate:** `git check-ignore tests/behavior/routing/data/cases.jsonl` → prints the path (exit 0) · `node -e 'const r=require("fs").readFileSync("tests/behavior/routing/data/cases.jsonl","utf8").trim().split("\n").map(JSON.parse);const t=r.filter(c=>c.source!=="registry");console.log(t.length>=40&&r.every(c=>c.expected.length&&c.split), t.length)'` → `true <n≥40>` (or `false` ⇒ measure-only, recorded) · `git status --porcelain tests/behavior/routing/data` → empty · `node --test tests/behavior-routing.test.js` → 0 fail.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-04-routing-eval-runner.md b/plans/261001-1521-eval-hillclimb-routing/phase-04-routing-eval-runner.md
new file mode 100644
index 0000000..4cd81b5
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-04-routing-eval-runner.md
@@ -0,0 +1,25 @@
+# Phase 04 — Routing eval runner + CLI probe
+
+**Goal**: one command runs a split × N runs within a hard budget and writes graded rows; ERROR never masquerades as FAIL.
+
+## **Interfaces**
+
+**Consumes**: `route-grade.cjs` (`gradeRoute`, `commandAliases`, CLI), `tool-sequence.cjs --render`, `run-scenario.sh` `infra_failure_reason` (sourced; `main` does not run when sourced), `data/cases.jsonl` (phase 03).
+**Produces**:
+- `tests/behavior/routing/run-routing-eval.sh --split train|test|all --label <name> [--runs 3] [--only <id,id>]`
+  - env: `ROUND_BUDGET_USD` (required), `PER_RUN_USD` (default 0.50), `JOBS` (default 3), `CK_BEHAVIOR_MODEL` (optional)
+  - **appends** to `data/results/<label>.jsonl` (rows per phase 01 shape; an existing label is extended, so a second split or re-run of missing rows lands in the same label) + `data/results/<label>.meta.json` `{ model, surfaceSha, surfaceBytes, cliVersion, startedAt, budgetUsd, complete: bool }`
+  - keeps each run's `events.jsonl` under `data/results/<label>/<case>-r<run>/`
+  - exit 0 complete · 3 INCOMPLETE (budget hit or ERROR) · 1 usage
+- `tests/behavior/routing/routing-report.cjs <label> [--vs <baseLabel>] [--size-ok] [--leak-ok]` → prints per-split `acc [lo, hi] n= noise= errors= cost=$`, per-gate table, flaky count; with `--vs` compares split by split and prints `ACCEPT|REVERT|PENDING-TEST — <why>` (`PENDING-TEST` = train passes, label has no test rows yet); exit 0 ACCEPT · 1 REVERT · 2 incomplete input · 4 PENDING-TEST.
+
+## Tasks
+
+1. **CLI probe** (one run each, ~$0.05): confirm on CLI 2.1.286 that (a) `--max-budget-usd` stops the run and what the stream shows when it does, (b) a denied `Edit` emits a `tool_use` + `is_error` result under `--permission-mode default` with Edit absent from `--allowedTools`, (c) whether `--max-turns` exists (not in `--help`). Record findings in `reports/cli-probe.md`. If (b) fails (tool hidden instead of denied) switch to allowing Edit/Write in the throwaway workdir — the grader is order-based, so the verdict is unchanged; update Global Constraints run flags accordingly.
+2. **Template install** once per sweep: `mktemp -d` → `git init` → `node bin/ck.js init --kit engineer` → generic fixture (`package.json` with `"test": "node --test"`, `src/index.js`, `test/index.test.js`, `README.md`) → commit. Per run: `cp -a template work`.
+3. **Run loop**: cases filtered by split/`--only`, each × `--runs`, `JOBS` in parallel via `xargs -P`. Each job: exact Global Constraints run flags, prompt from `cases.jsonl`, `cd work`. After: render with `tool-sequence.cjs --render`; zero tool calls or `infra_failure_reason` ⇒ row `verdict:"ERROR"` and create `data/results/<label>/STOP`; else `route-grade.cjs --expected <csv> --commands work/.claude/commands` ⇒ PASS/FAIL row. Cost = `total_cost_usd` of the `result` event (0 if absent, flagged in `why`).
+4. **Budget**: before launching each job, sum `costUsd` in the results file; if ≥ `ROUND_BUDGET_USD` or `STOP` exists, launch nothing more; meta `complete:false`; exit 3. Overshoot bounded by `JOBS × PER_RUN_USD` — document it in the usage text.
+5. `routing-report.cjs` (~120 lines): thin CLI over `routing-stats.cjs`; refuses (exit 2) when either meta has `complete:false` or models differ.
+6. **Smoke**: `ROUND_BUDGET_USD=1 run-routing-eval.sh --split train --label smoke --runs 1 --only <2 ids>`.
+
+**Exit gate:** `bash -n tests/behavior/routing/run-routing-eval.sh` → exit 0 · `test -f plans/261001-1521-eval-hillclimb-routing/reports/cli-probe.md` → exit 0 · `ROUND_BUDGET_USD=1 bash tests/behavior/routing/run-routing-eval.sh --split train --label smoke --runs 1 --only <id1>,<id2>` → exit 0 and `wc -l < tests/behavior/routing/data/results/smoke.jsonl` → `2` · `node tests/behavior/routing/routing-report.cjs smoke` → exit 0, prints one `train` line · `bash tests/behavior/routing/run-routing-eval.sh --split train --label x` (no budget env) → exit 1 with a message naming `ROUND_BUDGET_USD`.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-05-baseline-headroom-gate.md b/plans/261001-1521-eval-hillclimb-routing/phase-05-baseline-headroom-gate.md
new file mode 100644
index 0000000..13f915b
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-05-baseline-headroom-gate.md
@@ -0,0 +1,23 @@
+# Phase 05 — Baseline + headroom gate (STOP POINT)
+
+**Goal**: an honest number for implicit routing on the current surface, with its interval and noise floor; decide whether climbing is worth anything.
+
+## **Interfaces**
+
+**Consumes**: `run-routing-eval.sh`, `routing-report.cjs` (phase 04); `routing-guard.cjs bytes` (phase 01); frozen `cases.jsonl` (phase 03); phase 02 already merged (byte count final).
+**Produces**: results labels `baseline` (both splits, 3 runs); `reports/baseline.md` (committed, ids + numbers only) with: model id, surface sha256, `SIZE_BASELINE` = bytes of `skill-activation.md` + `development-rules.md`, per-split `acc [lo, hi]`, noise floor per split, per-gate slice, flaky count, ERROR count, total cost, and the decision line `DECISION: CLIMB | STOP-HEADROOM | STOP-DATASET`.
+
+## Tasks
+
+1. Pre-flight: `git status --porcelain .claude/workflows` empty; record `git rev-parse HEAD`.
+2. `ROUND_BUDGET_USD=<agreed> run-routing-eval.sh --split all --runs 3 --label baseline`. Exit 3 ⇒ no verdict; resolve the cause (budget, 429) and re-run the **missing** rows only via `--only` into the same label — never mix models.
+3. `routing-report.cjs baseline` → copy numbers into `reports/baseline.md`.
+4. `node tests/behavior/routing/routing-guard.cjs bytes .claude/workflows/skill-activation.md .claude/workflows/development-rules.md` → record `SIZE_BASELINE`.
+5. Look at the per-gate slice for the scope-lock shape (`expected[0] == "cook"`): record its pass rate separately (brainstorm success metric: ≥ 2/3 → 3/3).
+6. **Decide**:
+   - overall accuracy ≥ 0.90 ⇒ `STOP-HEADROOM`: phase 06 skipped; the result is that routing is already reliable on this model — report it, do not climb.
+   - transcript cases < 40 (phase 03) ⇒ `STOP-DATASET`.
+   - else `CLIMB`.
+   - Also note if `noise ≥ 0.10` on train: climbing is still allowed but only gains > noise are claimable; say so.
+
+**Exit gate:** `grep -cE '^DECISION: (CLIMB|STOP-HEADROOM|STOP-DATASET)$' plans/261001-1521-eval-hillclimb-routing/reports/baseline.md` → `1` · `node tests/behavior/routing/routing-report.cjs baseline` → exit 0 (meta `complete:true`) · `grep -c 'SIZE_BASELINE=' plans/261001-1521-eval-hillclimb-routing/reports/baseline.md` → `1`.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-06-hillclimb-rounds.md b/plans/261001-1521-eval-hillclimb-routing/phase-06-hillclimb-rounds.md
new file mode 100644
index 0000000..812cc08
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-06-hillclimb-rounds.md
@@ -0,0 +1,30 @@
+# Phase 06 — Hillclimb rounds on the surface
+
+**Run only if** `reports/baseline.md` says `DECISION: CLIMB`. Otherwise mark skipped in `STATE.md` and go to phase 07.
+
+**Goal**: ≤ 5 attributable, one-change rounds on `.claude/workflows/skill-activation.md`; keep only changes that move held-out test accuracy without growing the always-loaded files.
+
+## **Interfaces**
+
+**Consumes**: `run-routing-eval.sh`, `routing-report.cjs --vs` (phase 04); `routing-guard.cjs leak|bytes` (phase 01); `baseline` label + `SIZE_BASELINE` (phase 05).
+**Produces**: one results label `r<N>` per round (train rows, then test rows appended); `BEST` = label of the current comparison base (starts as `baseline`); `reports/climb-log.md` (committed) one row per round: `| round | hypothesis (one line, no case text) | diff stat | train Δ | noise | test Δ | bytes | verdict |`; accepted rounds as separate commits on branch `feat/routing-eval-hillclimb`.
+
+## Round procedure (repeat, max 5 test evaluations)
+
+1. **Diagnose from TRAIN only**: read FAIL transcripts of `BEST`'s train rows (`data/results/<label>/<case>-r*/`). Never open test transcripts or test prompts. Cluster failures by `why` (`no-route` · `wrong-route:<tok>` · `mutation-first`).
+2. **One hypothesis, one change** to `skill-activation.md` — a mechanism, not emphasis (development-rules: "a rule that names an intent instead of a mechanism can be obeyed and still not happen"). Candidate shapes: a row in the rule-5 table, a sharper trigger column, deleting a rationalization row that costs bytes, moving rule 5 above rule 1. Links stay `../skills/software/<name>/SKILL.md`.
+3. **Guards** (no spend if either fails):
+   - `node tests/behavior/routing/routing-guard.cjs leak tests/behavior/routing/data/cases.jsonl .claude/workflows/skill-activation.md` → exit 0.
+   - `routing-guard.cjs bytes …` ≤ `SIZE_BASELINE`.
+4. Train sweep: `run-routing-eval.sh --split train --runs 3 --label r<N>`. `routing-report.cjs r<N> --vs $BEST` → exit 1 REVERT now (train Δ ≤ train noise; no test spend, does **not** count toward the 5) or exit 4 PENDING-TEST.
+5. Test sweep: `run-routing-eval.sh --split test --runs 3 --label r<N>`; `routing-report.cjs r<N> --vs $BEST --size-ok --leak-ok` ⇒ exit 0 ACCEPT / 1 REVERT per plan Accept rule. Counts toward the 5.
+6. ACCEPT ⇒ commit `feat(workflows): <one-line mechanism>`; `BEST=r<N>`. REVERT ⇒ `git checkout -- .claude/workflows/skill-activation.md`.
+7. Append the climb-log row. Stop early when two consecutive train sweeps show no gain > noise.
+
+## Close-out of the climb
+
+- If any round was accepted: run load-bearing scenarios once each — `bash tests/behavior/run-scenario.sh scope-lock`, `… verify-plan-fires`, `… fan-out-concurrency` → `✓ <name> PASS` each (Behavioural-Skill Governance; the surface feeds `scope-lock`). FAIL ⇒ revert the last accepted round and re-check.
+- `npm test` (includes `installer-packaging.test.js` link guard).
+- Claim of improvement in `climb-log.md` only if cumulative test Δ > test noise floor; otherwise state "no claimable gain".
+
+**Exit gate:** `grep -cE '^\| r[0-9]+ ' plans/261001-1521-eval-hillclimb-routing/reports/climb-log.md` → ≥ 1 and ≤ number of rounds run · `node tests/behavior/routing/routing-guard.cjs leak tests/behavior/routing/data/cases.jsonl .claude/workflows/skill-activation.md` → exit 0 · `npm test` → 0 fail · (if a round was accepted) `bash tests/behavior/run-scenario.sh scope-lock` → `✓ scope-lock PASS`.
diff --git a/plans/261001-1521-eval-hillclimb-routing/phase-07-docs-close-out.md b/plans/261001-1521-eval-hillclimb-routing/phase-07-docs-close-out.md
new file mode 100644
index 0000000..6a303fe
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/phase-07-docs-close-out.md
@@ -0,0 +1,18 @@
+# Phase 07 — Docs + close-out
+
+**Goal**: the routing eval is discoverable and its rules (privacy, hygiene, accept rule, model pinning) are written where the next person running it will look.
+
+## **Interfaces**
+
+**Consumes**: `reports/baseline.md`, `reports/climb-log.md` (if phase 06 ran), `reports/dataset-summary.md`, phase 02 runner output format.
+**Produces**: doc sections only — no code.
+
+## Tasks
+
+1. `tests/behavior/README.md` — new section `## Routing eval (implicit skill routing, 2026-10)` (≤ 60 lines): what is graded (first SKILL.md Read / `ck:` invoke before first mutation), the commands (`run-routing-eval.sh`, `routing-report.cjs`, `routing-guard.cjs`), data is local + git-ignored + scrubbed, labelling rule (two labellers, keep on intersection, expected = union), split frozen (seed 1729), accept rule verbatim, max 5 test evaluations, re-baseline on model change, baseline numbers + decision with a link to `reports/baseline.md` (relative link from `tests/behavior/README.md`: `../../plans/261001-1521-eval-hillclimb-routing/reports/baseline.md`).
+2. `tests/behavior/README.md` § "The negative control": add the Wilson interval + `NONDISC_RATE` rule (phase 02) and the 0/3 ⇒ upper bound 0.56 fact.
+3. `docs/codebase-summary.md`: one line under the tests area naming `tests/behavior/routing/` and that its data dir is git-ignored.
+4. `STATE.md` in the plan dir: final line with decision, accepted rounds, test Δ, cost.
+5. Do **not** edit `development-rules.md` here (frozen after phase 02; byte metric).
+
+**Exit gate:** `grep -c '^## Routing eval' tests/behavior/README.md` → `1` · `grep -c 'NONDISC_RATE' tests/behavior/README.md` → ≥ 1 · `npm test` → 0 fail · `git status --porcelain tests/behavior/routing/data` → empty · `node .claude/scripts/ck/plan-lint.cjs plans/261001-1521-eval-hillclimb-routing` → `✓ plan-lint PASS`.
diff --git a/plans/261001-1521-eval-hillclimb-routing/plan.md b/plans/261001-1521-eval-hillclimb-routing/plan.md
new file mode 100644
index 0000000..ee85e01
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/plan.md
@@ -0,0 +1,89 @@
+# Plan — Eval hillclimb: implicit skill routing (A') + harness hygiene (D)
+
+**Created**: 2026-10-01 · **Type**: repo-internal test tooling + one shipped workflow doc · **Version impact**: patch (only if a climb round is accepted)
+**Source**: [brainstorm-261001-1429-eval-hillclimb.md](../reports/brainstorm-261001-1429-eval-hillclimb.md) — user approved **A' + D**.
+
+## Problem
+
+`tests/behavior/README.md` credits no gate by negative control alone; `scope-lock` failed because sessions never Read `cook/SKILL.md` — a **routing** failure, not a gate failure. Routing (which grouped `SKILL.md` a session Reads before acting) runs on *every* task and is steered by the two files every run loads (`.claude/workflows/skill-activation.md`, `.claude/workflows/development-rules.md`). Nothing measures it. Separately, `--negative` verdicts flip on 3 runs with no interval reported (D).
+
+## Done state (working backwards)
+
+1. `npm test` pins the grader, stats, scrubber, guard, and the new negative-control rule — no model in the loop.
+2. A local, git-ignored dataset of ≥ 40 scrubbed real prompts, double-labelled, split 70/30.
+3. A baseline: accuracy per split, Wilson 95% CI, noise floor, per-gate slice, cost.
+4. **Either** headroom gate stops the work (baseline ≥ 0.90, honest result) **or** ≤ 5 climb rounds on `skill-activation.md`, each accepted only by the rule below, held-out test untouched by authoring.
+5. README + development-rules document the routing eval and the non-discriminating rule.
+
+## Phases
+
+| # | Phase | Est. | Depends | Stop point |
+|---|---|---|---|---|
+| 01 | [Grader, stats, guard — offline + unit tests](phase-01-grader-stats-guard.md) | 0.5d | — | |
+| 02 | [D: negative-control hygiene (Wilson CI + non-discriminating rule)](phase-02-negative-control-hygiene.md) | 0.25d | 01 | ships independently |
+| 03 | [Dataset: mine, scrub, label, split](phase-03-dataset-mine-scrub-label.md) | 0.75d | 01 | < 40 cases ⇒ measure-only |
+| 04 | [Routing eval runner + CLI probe](phase-04-routing-eval-runner.md) | 0.5d | 01, 03 | |
+| 05 | [Baseline + headroom gate](phase-05-baseline-headroom-gate.md) | 0.25d + ~3h compute | 02, 04 | **≥ 0.90 ⇒ skip 06** |
+| 06 | [Hillclimb rounds on the surface](phase-06-hillclimb-rounds.md) | 1–1.5d | 05 | ≤ 5 test evaluations |
+| 07 | [Docs + close-out](phase-07-docs-close-out.md) | 0.25d | 05 (and 06 if run) | |
+
+Total ≈ 3.5–4 person-days, of which ~1d is unattended compute.
+
+## Global Constraints
+
+- **Language/idiom**: Node CommonJS `.cjs` (no deps), `node:test` + `node:assert`, bash with `set -u`. Every **new** file < 200 lines. `tests/behavior/tool-sequence.cjs` change limited to its `module.exports` line (export `MUTATORS`, `BASH_WRITE`).
+- **New file locations**: `tests/behavior/stats.cjs`; `tests/behavior/routing/{route-grade.cjs,routing-stats.cjs,routing-guard.cjs,mine-prompts.cjs,scrub-pii.cjs,split-cases.cjs,routing-report.cjs,run-routing-eval.sh}`; test file `tests/behavior-routing.test.js`.
+- **Private data dir**: `tests/behavior/routing/data/` — git-ignored via `.gitignore` line `/tests/behavior/routing/data/`. Holds `candidates.jsonl`, `cases.jsonl`, `scrub-terms.local.txt`, `results/*.jsonl`, transcripts. **Never committed. Committed reports (`plans/261001-1521-eval-hillclimb-routing/reports/*.md`) carry case ids + numbers only, never prompt text.**
+- **Transcript source**: `~/.claude/projects/*/*.jsonl`; exclude project dirs matching `^-tmp` (harness/scratch runs). Eval runs use `--no-session-persistence` so they never re-enter the pool.
+- **Climb surface**: `.claude/workflows/skill-activation.md` **only**. `development-rules.md` is edited only in phase 02 (before baseline) and frozen afterward.
+- **Hygiene rule**: no 6-word shingle (lower-cased, whitespace-normalised) of any case prompt may appear in the surface — enforced by `routing-guard.cjs leak`.
+- **Size rule**: `wc -c` of `skill-activation.md` + `development-rules.md` must not exceed the baseline value recorded in phase 05.
+- **Run flags** (every `claude -p` in the routing eval): `--output-format stream-json --verbose --no-session-persistence --max-budget-usd ${PER_RUN_USD:-0.50} --permission-mode default --allowedTools "Read,Grep,Glob,Bash,Skill"` (Edit/Write/NotebookEdit deliberately not allowed — an attempt still appears as a `tool_use` and counts as a mutation), `timeout 300`, `--model "$CK_BEHAVIOR_MODEL"` when set.
+- **Budget**: `ROUND_BUDGET_USD` **must be set explicitly** (runner refuses without it). Sum of `total_cost_usd` ≥ budget ⇒ stop, exit 3, sweep = INCOMPLETE (no verdict).
+- **Outcome classes** reuse the harness: PASS / FAIL / ERROR; ERROR = `infra_failure_reason` from `tests/behavior/run-scenario.sh` (sourced) or zero tool calls. ERROR stops the sweep (exit 3).
+- **Stats**: Wilson score, z = 1.96. RUNS = 3 per case. Noise floor = max − min of the 3 replicate accuracies on that split.
+- **Split**: seeded PRNG (mulberry32, seed `1729`), 70/30 stratified by `expected[0]`; `source:"registry"` cases forced to train, ≤ 20 % of train.
+- **Thresholds**: dataset ≥ 40 transcript-sourced cases to climb · headroom stop at baseline accuracy ≥ 0.90 · max 5 test-split evaluations · non-discriminating at ablated pass rate ≥ `NONDISC_RATE` = 0.5.
+- **Accept rule (climb)**: ACCEPT iff train Δ > train noise floor **and** test Δ > 0 **and** size rule holds **and** leak guard clean; else revert (`git checkout -- .claude/workflows/skill-activation.md`).
+- **Model pinning**: every results file records model id + surface sha256; a baseline is invalid for another model.
+- **Shipped-doc links** (CLAUDE.md): link targets relative to the containing file (`skill-activation.md` → `../skills/software/<name>/SKILL.md`); `tests/installer-packaging.test.js` must stay green.
+
+## Scope options
+
+| Option | Touches | Conventions | Verdict |
+|---|---|---|---|
+| (A) minimal | `tests/` + `.gitignore` + `skill-activation.md` (climb) + one bullet in `development-rules.md` + README | follows harness idiom; dataset local-only | **picked** — brainstorm A' + D |
+| (B) thorough | (A) + migrate harness to `claude plugin eval`, ship `/ck:eval` | duplicates `/claude-api build-eval`; whole-plugin ablation ≠ per-gate | rejected (out of scope, decided) |
+
+## Key risks
+
+| Risk | Mitigation |
+|---|---|
+| Client PII in transcripts (<client>/* projects present) | scrub + human review + git-ignored data dir; prompts only sent to the same API that already saw them |
+| Answer leakage / overfit to phrasing | registry cases train-only; leak guard; authoring reads train FAIL transcripts only |
+| Absent client codebase changes routing | generic fixture repo (phase 04); routing should precede exploration per rule 1 |
+| Spend limit 429 / cost blow-up | explicit `ROUND_BUDGET_USD`, per-run cap, ERROR stops sweep |
+| Adaptive overfit to test split | ≤ 5 test evaluations; test transcripts never opened |
+| Model drift | model id pinned in results; re-baseline on model change |
+| Small n ⇒ wide CI | report CI, never a bare %; claim only Δ > noise floor |
+
+## Out of scope (decided)
+
+No `/ck:eval` command · no migration to `claude plugin eval` · no hillclimb of `/ck:find` · no climbing `development-rules.md`.
+
+## Plan Completeness
+
+- [x] spec coverage — every requirement maps to a phase
+- [x] placeholder scan clean
+- [x] Interfaces blocks consistent across phases
+- [x] every phase gate is a runnable command with a stated expected result
+- [x] Global Constraints values verbatim, not referenced
+- [x] scope option recorded (A minimal / B thorough) — or N/A, single layer
+
+## Unresolved questions
+
+1. `ROUND_BUDGET_USD` value per sweep (estimate: 60 cases × 3 runs ≈ $20–35 on the default model)?
+2. Second labeller: user, or an independent fresh subagent (default in phase 03)?
+3. `NONDISC_RATE` 0.5 OK? Stricter variant (credit only if Wilson upper bound < 0.5) needs `--negative=5`.
+4. Which model is "the" eval model (default CLI model vs `CK_BEHAVIOR_MODEL`)?
+5. Transcripts pruned by `cleanupPeriodDays`? Other machines/users to sample from?
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/phase-01-impl.md b/plans/261001-1521-eval-hillclimb-routing/reports/phase-01-impl.md
new file mode 100644
index 0000000..6aa25d6
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/phase-01-impl.md
@@ -0,0 +1,63 @@
+# Phase 01 impl report
+
+Status: DONE
+
+## Files
+- M tests/behavior/tool-sequence.cjs:405-406 — exports + `MUTATORS, BASH_WRITE` only (git diff --stat: 1 line)
+- A tests/behavior/stats.cjs (34 lines)
+- A tests/behavior/routing/route-grade.cjs (117), routing-stats.cjs (80), routing-guard.cjs (58)
+- A tests/behavior-routing.test.js (196; 21 tests; written first, red on missing modules, then implemented)
+
+## Gate (verbatim tails)
+`node --test tests/behavior-routing.test.js`: tests 21 · pass 21 · fail 0 · cancelled 0 · skipped 0
+`npm test`: tests 403 · pass 402 · fail 0 · skipped 1  (baseline 381/0/1; +21 new tests)
+`wc -l`: 34 stats.cjs · 117 route-grade.cjs · 58 routing-guard.cjs · 80 routing-stats.cjs · (test file 196) — all < 200
+CLI smoke: `stats.cjs wilson 1 3` -> `p=0.33 lo=0.06 hi=0.79`; `route-grade.cjs` on Skill ck:cook stream -> PASS, exit 0.
+
+## Deviations / decisions (brief silent)
+1. `aggregate(rows, split, cases)` — cases arg is 3rd; accepts object or Map; unknown case -> gate `unknown`. Extra output field: none beyond brief + `lo/hi` already listed.
+2. `decide(base, cand, {sizeOk, leakOk})` — base/cand = `{train, test}` aggregates. Train floor = max(base.train.noise, cand.train.noise) (brief: "train noise floor", ambiguous). Unset flag = not ok (REVERT).
+3. `flaky` computed over scored (non-ERROR) rows per case.
+4. gradeRoute with a mutation but no route -> `no-route` (not mutation-first). Wrong route checked before mutation order.
+5. Bash route only for reader commands (cat|head|tail|sed -n|less|bat) and only SKILL.md paths (not command files), per brief; `echo <path>` is neutral (tested).
+6. `routeOf` ignores `aliases` arg (kept for interface); alias resolution is in gradeRoute.
+7. Extra exports: `skillOfPath` (route-grade). Leak CLI reads `.prompt` from each cases.jsonl line (field name assumed; phase 03 must match).
+8. Pre-existing: BASH_WRITE matches `> /dev/null` redirects as mutations (tool-sequence.cjs:~398); not changed (file frozen).
+
+## Unresolved
+- cases.jsonl prompt field name: `prompt` assumed (phase 03).
+- Should `> /dev/null` count as mutation? Currently yes; may cause false mutation-first in phase 04 runs.
+
+## fix-1: /dev/null and fd-dup redirects are not mutations
+
+route-grade.cjs only: `isMutation` strips `\d*>>?\s*/dev/null` and `\d*>&\d+` before BASH_WRITE (tool-sequence.cjs untouched). Test replaced/merged (Bash redirect test) to stay <200 lines; tests written first (red: 1 fail), then fix. Deviation 8 above is resolved; open question 2 closed.
+
+```
+$ node --test tests/behavior-routing.test.js
+1..21
+# tests 21
+# suites 0
+# pass 21
+# fail 0
+# cancelled 0
+# skipped 0
+# todo 0
+# duration_ms 71.062337
+$ npm test
+1..403
+# tests 403
+# suites 0
+# pass 402
+# fail 0
+# cancelled 0
+# skipped 1
+# todo 0
+# duration_ms 45773.609444
+$ wc -l ...
+   34 tests/behavior/stats.cjs
+  121 tests/behavior/routing/route-grade.cjs
+   58 tests/behavior/routing/routing-guard.cjs
+   80 tests/behavior/routing/routing-stats.cjs
+  199 tests/behavior-routing.test.js
+  492 total
+```
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/phase-02-impl.md b/plans/261001-1521-eval-hillclimb-routing/reports/phase-02-impl.md
new file mode 100644
index 0000000..491f0ea
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/phase-02-impl.md
@@ -0,0 +1,25 @@
+# Phase 02 impl — negative-control hygiene
+
+Status: DONE
+
+## Files changed
+- tests/behavior/run-scenario.sh — NONDISC_RATE default 0.5 (after NEGATIVE_RUNS); usage text; `--negative` block: infra-stop first, then Wilson CI line (via stats.cjs), rate test via `node -e` replaces `leaked -eq N`, ⚠ line on leaked==0 && hi >= rate. SUPPORTED branch unchanged.
+- tests/behavior-harness.test.js — `sweep()` gains `env` param; 4 new tests (TDD: all 4 failed first, `# fail 4`).
+- .claude/workflows/development-rules.md — one bullet (2 lines) in § Behavioural-Skill Governance, before the "Where neither control" bullet.
+
+## Gate output (tails)
+- `node --test tests/behavior-harness.test.js` → `# tests 44 / # pass 44 / # fail 0`
+- `bash -n tests/behavior/run-scenario.sh` → exit 0
+- `node --test tests/installer-packaging.test.js` → `# tests 23 / # pass 23 / # fail 0`
+- `npm test` → `# tests 407 / # pass 406 / # fail 0 / # skipped 1` (baseline 402/1 + 4)
+
+## Deviations
+- Fixed-width ≥ char used in messages/tests (brief's literal). Existing `[0,1,0]` SUPPORTED test unchanged and green.
+- NOT DISCRIMINATING message reworded to "survived $leaked of N ablated runs (ablated pass rate ≥ $NONDISC_RATE)"; "measures the model, not the gate" kept.
+- Added 4th-plus test is exactly 4 new: [1,1,0]; [0,0,0] CI+warn; NONDISC_RATE=0.3; plus `--negative=5` [0,0,0,0,0] CI [0.00, 0.43] no warning.
+
+## development-rules.md size
+12277 -> 12489 bytes (+212).
+
+## Unresolved
+- None.
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-cli-data.md b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-cli-data.md
new file mode 100644
index 0000000..1a7da6f
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-cli-data.md
@@ -0,0 +1,27 @@
+# Plan verification: CLI + data claims (K1-K7)
+
+Date 2026-10-01. CLI `claude --version` -> `2.1.286 (Claude Code)`. No `claude -p` with a prompt was run (parse-only probes with `</dev/null`, all exit 1 at "Input must be provided", zero API spend).
+
+| claim | verdict | evidence |
+|---|---|---|
+| K1 flags in `claude --help` | **REFUTED (partial)**: 6/7 listed; `default` NOT a listed `--permission-mode` value | `--allowedTools, --allowed-tools <tools...>` (help L23) · `--max-budget-usd <amount>  Maximum dollar amount to spend on API calls (only works with --print)` (L136) · `--model <model>  Model for the current session.` (L140) · `--no-session-persistence  Disable session persistence` (L148) · `--output-format <format>  Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming) (choices: "text", "json", "stream-json")` (L151-155) · `--permission-mode <mode> ... (choices: "acceptEdits", "auto", "bypassPermissions", "manual", "dontAsk", "plan")` (L156-158; no `default`) · `--verbose  Override verbose mode setting from config` (L265). Probe: `claude -p --permission-mode default </dev/null` -> `Error: Input must be provided...` (value ACCEPTED, hidden alias); `--permission-mode bogusx` -> `Allowed choices are acceptEdits, auto, bypassPermissions, manual, dontAsk, plan.` (a bogus value is rejected, so `default` is valid but undocumented; same probe with `manual` passes). Plan flag `--permission-mode default` works but is not in help; consider `manual` or `acceptEdits` if help-listed values are wanted. |
+| K2 `--max-turns` absent from help | **CONFIRMED** (with caveat) | `grep -n 'max-turns' help.txt` -> no output, exit 1. Caveat: `claude -p --max-turns 3 </dev/null` is accepted by the parser (hidden flag, same "Input must be provided" error, not "unknown option"). So absent from help but usable; do not treat as nonexistent. |
+| K3 `ck init --kit engineer` non-interactive in fresh git temp dir | **CONFIRMED** | `git init -q && node bin/ck.js init --kit engineer </dev/null` in mktemp dir under scratchpad: `exit=0`. Tail: `CLAUDE.md created — 7 workflow(s) wired in.` / `.claude/.gitignore created — 4 runtime-state path(s) ignored.` / `created .gitignore with 3 regenerable-artifact rule(s)` / `Kit 'engineer' installed! 19 paths copied · 0 skipped`. `ls -d .claude/commands/ck .claude/workflows/skill-activation.md` -> both exist. Root has CLAUDE.md (1457 B), .gitignore (309 B), .claude/{agents,commands,hooks,mcp.json,metadata.json,scripts,settings.json,skills,statusline.*,workflows}. Temp dir deleted. |
+| K4 transcript pool | **CONFIRMED (counts differ)** | Top-level `~/.claude/projects/*/*.jsonl` = **65** (not 62); project dirs = **25** (matches); dirs starting `-tmp` = **7**; dirs containing `<client>` = **18**. Extra: only 15 of 25 dirs hold a top-level jsonl; `find . -name '*.jsonl'` incl. nested (subagent) = 108. Gotcha: dir names start with `-`, so shell globs/grep need `--` (ugrep errored on `-m=e-trung...`). |
+| K5 user-message shape | **REFUTED (partial)**: `message.content` is mostly an ARRAY, not string | Over 65 files, 3523 `type:"user"` lines. Top-level keys: `type`, `message` (3523), `isMeta` (129 true; optional - present only when true), `uuid`, `timestamp`, `sessionId`, `cwd`, `isSidechain`, `promptId`, `toolUseResult` (3121), etc. `message` keys: `role`, `content` (3523). `content` string = **352**, array = **3171** (blocks: tool_result 3122, text 52, image 13). So tool results are `type:"user"` with array content; plain prompts are string (usually). Filter prompts by `typeof content==="string"` (or text blocks, 52) and `!isMeta` and no `toolUseResult`. Slash commands: `<command-name>` in string content = **35**, `<command-args>` = **32**; in array text blocks = 0; none of those are isMeta. Claim of command tags inside string content: CONFIRMED. |
+| K6 stream-json `result` carries `total_cost_usd` | **UNVERIFIABLE without spend** | No repo evidence: `grep -rn total_cost_usd tests bin .claude skills docs` -> 0 hits; only `plans/261001-1521-eval-hillclimb-routing/plan.md:42` asserts it. `tests/behavior/tool-sequence.cjs:181` reads `ev.type === "result"` and `ev.result` only (no cost field). `run-scenario.sh:234` writes `$EVENTS` via `--output-format stream-json --verbose`, but no events.jsonl fixture exists on disk (`find tests -name '*.jsonl'` empty; none in /tmp). `tests/behavior-harness.test.js:320` contains a string `cost: 0.00529` (synthetic, not a field name). Local transcripts: `cost-state` entries have `totalCostUSD` (different shape, not a result event); 2 transcript files mention `total_cost_usd` as text (this plan's discussion), no `"type":"result"` lines. Settle with: one cheap `claude -p "say ok" --output-format stream-json --verbose --max-budget-usd 0.05 --model haiku | tail -1 | jq 'keys'` (~$0.01), or `claude plugin eval`/SDK docs. Note: SDK docs (public) list `total_cost_usd` on the result message, but not verified here. |
+| K7 `tests/behavior/routing/data/` not ignored, dir absent | **CONFIRMED** | `git check-ignore -v tests/behavior/routing/data/x` -> no output, exit 1. `ls -d tests/behavior/routing` -> `No such file or directory`. `tests/behavior/` holds only README.md, run-scenario.sh, scenarios, tool-sequence.cjs. |
+
+## Counts
+CONFIRMED 4 (K2, K3, K4, K7) · REFUTED partial 2 (K1, K5) · UNVERIFIABLE 1 (K6).
+
+## Plan fixes implied
+- K1: `--permission-mode default` is accepted but unlisted; either keep (works on 2.1.286, may drift) or use a listed value (`acceptEdits` is what `run-scenario.sh:234` already uses).
+- K2: `--max-turns` works as hidden flag; plan may use it but should note it is undocumented.
+- K4: pool is 65 top-level (108 incl. nested subagent files); decide whether nested are in scope.
+- K5: filter on string content; tool_result user lines are noise (3121 of 3523).
+
+## Unresolved questions
+- Does the plan want nested/subagent jsonl (43 extra) in the prompt pool?
+- Is a ~$0.01 haiku probe authorised to settle K6?
+- Will `default` remain a valid hidden alias in later CLI versions (pin CLI version in runner?).
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-docs.md b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-docs.md
new file mode 100644
index 0000000..fe93211
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-docs.md
@@ -0,0 +1,27 @@
+# Plan verification: docs/links/math claims (D1-D9)
+
+Plan: plans/261001-1521-eval-hillclimb-routing/. Read-only; no repo files edited. Date 2026-10-01.
+
+| claim | verdict | evidence |
+|---|---|---|
+| D1 section exists, range, bullets, wc -c | CONFIRMED | `.claude/workflows/development-rules.md:81` `## Behavioural-Skill Governance`; file is 92 lines by `awk END{print NR}` (`wc -l`=91: no trailing newline), section = L81-92 (to EOF). Content: 5 bullets (L82-86), blank L87, table header L88, separator L89, 3 data rows L90-92 (`verify-plan-fires`/`scope-lock`/`fan-out-concurrency`; `tdd-red-first`/`iron-law`/`resume-from-ledger`; `guard-tier-b`) -> 5 bullets, 3 table data rows. `wc -c`: development-rules.md = **12277**, skill-activation.md = **3686** (total 15963). |
+| D2 rule 5 table, links `../skills/software/<name>/SKILL.md` | CONFIRMED | `skill-activation.md:11` rule 5 "Some task shapes force a specific gate"; table L13-18 (header + 4 rows): cook L15, verify-plan L16, tdd L17, run-state L18. Links verbatim `../skills/software/cook/SKILL.md`, `.../verify-plan/...`, `.../tdd/...`, `.../run-state/...`. All 4 targets exist (`ls skills/software/{cook,verify-plan,tdd,run-state}/SKILL.md` ok). |
+| D3 commands link skills via regex; alias map buildable | CONFIRMED (with caveats) | Node scan of markdown link targets `](...)` with `/skills/(?:[^/]+/)*([^/]+)/SKILL\.md$`, namespaces: **ck 19 with / 8 none** (of 27); **ba 6 with / 0 none** (of 6); **mk 0 with / 12 none** (of 12). 0 dangling targets. Examples: `ck/fix.md:146` `../../skills/software/tdd/SKILL.md` -> `tdd`; `ck/cook.md` -> `cook,tdd,verify-plan,code-review`; `ck/plan.md` -> `planning,verify-plan`; `ck/sepay.md` -> `payment-integration`; `ck/tickets.md` -> `to-tickets,planning`; `ba/spec.md` -> `spec,traceability,scenario`. Caveats: (a) mapping is one-to-many (cook=4, review=3, security=3) - not a clean command->skill alias; "primary" skill needs a rule. (b) Command name != skill name sometimes (`tickets`->`to-tickets`, `sepay`->`payment-integration`, `find`->`find-skills`, `debug`->`debugging`). (c) 8 ck commands no link: claude-md, docs, health, journal, scout, test, use-mcp, watzup. (d) mk uses prose paths, not links: `mk/plan.md:19` `.claude/skills/marketing/product-marketing/SKILL.md`, `mk/seo.md:19,21` (`seo`, `seo-writing`) in parens/backticks, no `](..)` -> link-regex gives 0 for mk; raw-path grep hits 3 mk files (content, plan, seo; content only cross-refs). (e) ba last-dir names (`context`, `prd`...) differ from frontmatter `name: ba-context` (`skills/ba/context/SKILL.md:2`). (f) ck/debug and ba/spec link `scenario` (shared `software/scenario`). |
+| D4 depth + last-dir collisions | CONFIRMED | `find skills -name SKILL.md` = 124 files; depth (dirs between `skills/` and file): 105 at 2 levels (`skills/<group>/<name>/`), 19 at 3 levels (e.g. `skills/software/ai/ai-artist/SKILL.md`, `.../design/ui-ux-pro-max/SKILL.md`, `.../development/bootstrap/SKILL.md`). None deeper. Duplicate last-dir awk: **no collisions** (empty output; 124 unique names). Count 124 matches docs/codebase-summary.md:256. |
+| D5 scripts exist, plan-lint output | CONFIRMED | `-rw-rw-r-- 2366 .claude/scripts/ck/plan-lint.cjs`, `-rw-rw-r-- 3315 .claude/scripts/ck/phase-brief.cjs`. Run output verbatim (exit 0): `✓ plan-lint PASS — 7 phase(s), all blocks present` / `  attested-only (not machine-checked): spec coverage · cross-phase type agreement`. |
+| D6 Wilson numbers | CONFIRMED | node (z=1.96): `w(0,3) { lo: 0, hi: 0.5615060804490177 }`; `w(3,3) { lo: 0.4384939195509822, hi: 1 }`. hi 0.5615 and lo 0.4385 match. |
+| D7 link-guard test exists; tests/behavior/README.md not shipped | CONFIRMED | Test at `tests/installer-packaging.test.js:246` `test('no shipped doc links to a file the install does not have'`. Walks only `path.join(p,'.claude')` of a fresh install per kit (L274-281), `.md` only. `tests/behavior/README.md` exists (682 lines, git-tracked) but: `grep -rn 'tests/' .claude/kits/*.json` -> no hits (count 0 in all 4 manifests: engineer, marketing, both, ba); `package.json` `files` = bin/, .claude/, skills/, .opencode/, docs/, AGENTS.md, CLAUDE.md, README.md, CHANGELOG.md, LICENSE - no `tests/`. So not installed, not walked; a link into `plans/` cannot break this test. Extra: `plans/**/*` is git-ignored (`.gitignore:59`) but README.md already mentions `plans/...` twice in prose (L59, L152), no link syntax. A link into gitignored `plans/` would dangle for other clones (not a test failure). |
+| D8 docs/codebase-summary.md tests-area line | CONFIRMED (with nuance) | Best-fit line: **`docs/codebase-summary.md:257`** `- Test files: \`tests/ba-spine.test.js\` (13 tests) · ... · plus 15 engineer-kit test files` under `## File Statistics` (L248). Project Structure tree (L13-51) has NO `tests/` entry; alternative insertion: after `├── scripts/` block (L41-44) before `skills/marketing/README.md` L45 region. `grep 'tests/behavior' docs/codebase-summary.md` -> no match (only docs/clauKit-registry.md:665,727 and docs/project-roadmap.md:83 mention it). |
+| D9 branch policy conflict | REFUTED (as worded: conflict is real, quote location differs) | Policy confirmed: `skills/software/git/SKILL.md:76` `## Branch Policy in a Shared Tree (canonical)`; L78 verbatim: "**Do not create or switch a branch during implementation. Work on the branch you were invoked on.** Auto-creating a feature branch is allowed in **`--auto` only** ... Everywhere else it needs an explicit ask."; L86 enforced by `branch-guard` PreToolUse hook (`checkout -b`/`switch -c` DENY unless `--auto`). Plan quote confirmed: `phase-06-hillclimb-rounds.md:10` (the Produces line, 4th `;`-clause) "... accepted rounds as separate commits on branch `feat/routing-eval-hillclimb`." Conflict real: no ask/--auto in plan creates the branch (`grep -rn 'checkout -b\|switch -c\|--auto\|worktree' plans/261001-.../` -> none). REFUTED part: claim says "phase-06 says accepted rounds commit 'on branch feat/routing-eval-hillclimb'" - literal phrase is "commits on branch `feat/...`" (backticked) in the Produces line, not in the numbered steps; step 6 (L21) says only "ACCEPT => commit `feat(workflows): ...`" with no branch. Also branch name is not stated elsewhere in the plan (only phase-06:10). Net: conflict CONFIRMED in substance; I flag REFUTED only on quote-location precision. Reclassify as CONFIRMED if only substance matters. |
+
+## Counts
+CONFIRMED 8 (D1-D8, D3 & D8 with caveats) · REFUTED 1 (D9, precision only; substance confirmed) · UNVERIFIABLE 0.
+
+## Fix suggestions for the plan
+- D9: drop the branch from phase-06 Produces line, or require explicit user ask / `--auto`; else `branch-guard` blocks `git checkout -b`. (`git branch <new>` is ALLOW+advisory but does not move HEAD, so commits would not land on it anyway.)
+- D3: alias map must pick a primary skill per command or accept multi-valued map; mk namespace needs prose-path parsing or is out of scope.
+
+## Unresolved questions
+- Is the eval scope ck-only, or ba/mk too? mk has zero link-form skill refs.
+- Does the plan want a single "primary" skill per command (rule needed for cook, review, security)?
+- Is the user the operator who passes `--auto`/explicit ask for the branch in D9, or should phase-06 commit on the current branch?
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-harness.md b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-harness.md
new file mode 100644
index 0000000..7a60654
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification-harness.md
@@ -0,0 +1,22 @@
+# Plan verification: harness claims (phase-01 / phase-02)
+
+Read-only. Repo HEAD c1653ba. `node --test tests/behavior-harness.test.js` -> 40 tests, 40 pass, 0 fail (node v20.19.5).
+
+| claim | verdict | evidence |
+|---|---|---|
+| H1 parse -> {steps, prose}; step fields | CONFIRMED | `tests/behavior/tool-sequence.cjs:138` `function parse(lines)`; `:185` `return { steps, prose }`; `:166-167` step = `{ idx, turn, tool, target, raw, input, result: null }`. `result` later set (`:175-177`) to `{ is_error, text, tool, command }`. |
+| H2 MUTATORS/BASH_WRITE internal, not exported; export is one-line append | CONFIRMED (nuance) | Defined `:188` `const MUTATORS = new Set(["Write","Edit","NotebookEdit"])`, `:190` `const BASH_WRITE = /(^|\s)(>\|>>\|sed -i\|tee\s\|patch\s)/`. `:405-406` `module.exports = { parse, outcomeOf, targetOf, rawTargetOf, tddOrder, evidenceBefore, sameTurn,\n concurrentDispatch };` - neither exported. NUANCE: single statement but wraps 2 physical lines; appending is still a one-token edit on line 406. |
+| H3 `--render` and `--tdd-order` modes | CONFIRMED | Header doc `:19` `--render`, `:28` `--tdd-order <re>`; impl `:331` `flags.indexOf("--tdd-order")`, `:383` `flags.includes("--render")`. Also `--prose`, plus two more modes (`:344`, `:355`, `:368` - concurrent/same-turn/evidence). |
+| H4 denied tool_result carries is_error -> testable from parse output | CONFIRMED at parse level; real-CLI denial shape UNVERIFIABLE | `:175` `is_error: !!b.is_error` copied verbatim into `step.result`. Existing synthetic precedent: `tests/behavior-harness.test.js:186` `res('b','weird output', true)` -> `outcomeOf` = `fail:tool-error`. So a synthetic `res('w','denied', true)` after `use('w','Write',..)` is testable. Mutation detection keys on `s.tool` only (`:213`, `:216`, `:258`), never on result, so a denied Write already counts as mutation in tddOrder/evidenceBefore. NOT shown anywhere in repo: that the real CLI emits `is_error:true` for permission denial (no fixture; grep for denied/permission in tests/ finds none relevant). phase-04 line 18 itself lists this as CLI probe (b). Settle with that probe (real `claude -p` stream with Edit not in --allowedTools). |
+| H5 helpers asst/use/res | CONFIRMED | `tests/behavior-harness.test.js:31` `const asst = (...blocks) => JSON.stringify({type:'assistant', message:{content:blocks}})`; `:32` `const res = (id, content, isError) => JSON.stringify({type:'user', message:{content:[{type:'tool_result', tool_use_id:id, content, is_error:!!isError}]}})`; `:35` `const use = (id, name, input) => ({type:'tool_use', id, name, input})` (returns block, not JSON string). Also `:38` `stepsOf = (lines) => parse(lines).steps`. |
+| H6 sweep/sweepSummary stubs; [0,1,0] -> SUPPORTED; "1 scenario(s) genuinely verified" | CONFIRMED | `sweepSummary` `:333`, `sweep` `:429`. `:350` `nogateRcs: [0, 1, 0]` -> `:351` `/SUPPORTED, NOT DEMONSTRATED/` (and `:353` asserts `── 0 scenario(s) genuinely verified`); `:447` same case via `sweep`, `:448` same match. `:360`, `:365`, `:463` assert `/── 1 scenario\(s\) genuinely verified/`. Injection mechanism: `bash -c` script does `source tests/behavior/run-scenario.sh`, then redefines `run_one()` : `$2 = gate` -> `return ${gateRc}`; (sweep only: `noline` -> `return ${nolineRc}`); otherwise (the `nogate` ablated run) `_i=$((_i+1)); set -- ${nogateRcs.join(' ')}; return ${!_i}` i.e. i-th ablated call returns i-th rc via indirect positional expansion. rc semantics: 1 = behaviour present (counted as leak), 0 = absent, 2 = infra error. Then `ALL_SET="stub"; FAST_SET="stub"` and `main stub --negative=<len(nogateRcs)> 2>&1 \| tail -20`; sweep also supports `--positive`. No `claude -p` spent. |
+| H7 --negative block shape | CONFIRMED | `tests/behavior/run-scenario.sh:320` `NEGATIVE_RUNS=${NEGATIVE_RUNS:-3}`; `:324-325` parse `--negative[=N]`; `:365` `leaked=0; nerr=0`; `:366` `for _n in $(seq 1 "$NEGATIVE_RUNS")`; `:368` `[ $nrc -eq 1 ] && leaked=$((leaked + 1))`; `:373` `elif [ $leaked -eq $NEGATIVE_RUNS ]` -> `:375` "NOT DISCRIMINATING", `:376` "this scenario measures the model, not the gate."; `:377` `elif [ $leaked -gt 0 ]` -> `:379` "SUPPORTED, NOT DEMONSTRATED"; `:385` else "negative control OK". Order matters: the -gt 0 branch is only reached when leaked < N, so it is exactly 0<leaked<N. All inside `main()` (opens `:307`, closes before the guard at `:396`). |
+| H8 infra_failure_reason, HARNESS_DIR, sourceable | CONFIRMED | `:30` `infra_failure_reason() {`; `:19` `HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"` (top level, set at source time); `:396` `[ "${BASH_SOURCE[0]}" = "${0}" ] && main "$@"` (POSIX `[ = ]` form, not `[[ == ]]`, same semantics). Sourcing demonstrated by the 40 passing tests above. File has `set -u` (`:17`), no `set -e`; note the last line returns 1 when sourced (harmless without `set -e`). |
+| H9 `npm test` picks up new tests/behavior-routing.test.js | CONFIRMED | `package.json:11` `"test": "node --test tests/"`. Empirical (node v20.19.5, scratch copy in scratchpad): `tests/behavior-routing.test.js` with one test + non-test `tests/notatest.js` + `tests/behavior/helper.cjs` -> `node --test tests/` ran exactly the test file's test (`# tests 1`, `ok 1 - a`), helper/non-test files not run. Top-level `tests/*.test.js` is the existing convention (e.g. `tests/behavior-harness.test.js`). |
+
+## Counts
+CONFIRMED 9 (H2 with line-wrap nuance; H4 confirmed at parse level only), REFUTED 0, UNVERIFIABLE 0 as primary verdicts. One sub-claim UNVERIFIABLE: real-CLI permission-denial emits `is_error:true` (H4).
+
+## Unresolved questions
+- Does the real Claude CLI (2.1.286 per phase-04) emit `tool_use` + `is_error:true` result for a denied Edit/Write, or hide the tool? Settled by phase-04 probe (b); until then phase-01 tests must use synthetic `res(id, text, true)`.
+- Whether phase-01 prefers a literal one-line export edit: current export wraps 2 lines; append `MUTATORS, BASH_WRITE` after `concurrentDispatch` on line 406 (or reflow).
diff --git a/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification.md b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification.md
new file mode 100644
index 0000000..7345e58
--- /dev/null
+++ b/plans/261001-1521-eval-hillclimb-routing/reports/plan-verification.md
@@ -0,0 +1,31 @@
+# Plan verification — merged (3 groups)
+
+Sources: [harness](plan-verification-harness.md) · [cli-data](plan-verification-cli-data.md) · [docs](plan-verification-docs.md)
+
+| Group | Confirmed | Refuted | Unverifiable |
+|---|---|---|---|
+| harness H1–H9 | 9 | 0 | 0 (H4 sub-claim: real CLI `is_error` on deny → phase-04 probe) |
+| cli-data K1–K7 | 4 | 2 (K1, K5 — partial) | 1 (K6) |
+| docs D1–D9 | 8 | 1 (D9 — wording) | 0 |
+
+## Refuted / unverifiable — load-bearing?
+
+| Claim | Finding | Load-bearing | Resolution |
+|---|---|---|---|
+| K1 `--permission-mode default` | not a listed value (`acceptEdits auto bypassPermissions manual dontAsk plan`); accepted as hidden alias | phase 04 only | phase-04 probe picks a listed mode (`dontAsk` candidate); update Global Constraints run flags |
+| K5 user `message.content` string | string in 352/3523 user lines; array in 3171 (mostly tool_result). command tags in string content (35/32) | phase 03 only | `mine-prompts.cjs` also reads `{type:"text"}` blocks of array content, skips `tool_result` |
+| K6 `total_cost_usd` on `result` | no local evidence | phase 04 only | phase-04 probe (~$0.01) |
+| D9 branch | conflict real: `skills/software/git/SKILL.md:78` vs phase-06:10 "commits on branch `feat/routing-eval-hillclimb`" | phase 06 only | user decision |
+| H4 sub | real CLI deny ⇒ `is_error` unproven | phase 04 | existing probe (b) |
+
+## Notes for implementers
+
+- `tool-sequence.cjs:405-406` — `module.exports` spans 2 lines; append `MUTATORS, BASH_WRITE`.
+- harness `--negative` stub: redefines `run_one` after sourcing; `nogateRcs` return 1 = leaked.
+- `npm test` = `node --test tests/` → new `tests/behavior-routing.test.js` auto-picked.
+- D3: command may link several skills (`cook` links 4) → alias = Set (plan already). `mk` commands have 0 skill links → empty alias.
+- D4: 124 SKILL.md, no last-dir name collisions.
+- Byte sizes now: `development-rules.md` 12277 · `skill-activation.md` 3686.
+- D8: `docs/codebase-summary.md:257` "Test files" line.
+
+**Verdict:** no REFUTED claim is load-bearing for phases 01–02. Phases 03/04/06 carry the corrections above.
diff --git a/plans/reports/brainstorm-261001-1429-eval-hillclimb.md b/plans/reports/brainstorm-261001-1429-eval-hillclimb.md
new file mode 100644
index 0000000..7a00ef4
--- /dev/null
+++ b/plans/reports/brainstorm-261001-1429-eval-hillclimb.md
@@ -0,0 +1,86 @@
+# Brainstorm — Eval design + hillclimbing cho ClauKit
+
+Nguồn: https://claude.dev/blog/automating-eval-design-and-hillclimbing/ · Ngày: 2026-10-01 · Trạng thái: chờ user xác nhận A' trước khi handoff planner
+
+## 1. Problem statement
+
+- ClauKit claim nhiều gate/routing nhưng `tests/behavior/README.md` tự kết luận "No gate is currently credited" — 4/6 scenario không phân biệt (model làm sẵn), verdict ablation lật OK→FAIL trên 3 run.
+- Blog cung cấp khung: production-sampled tasks · headroom · low variance · grader checkable-claims · hillclimb cheap+attributable surface · train/test split · transcript hygiene.
+- Câu hỏi user: áp vào ClauKit có phải cải tiến tích cực không?
+
+## 2. Evidence đã kiểm
+
+| Fact | Nguồn |
+|---|---|
+| Harness 12 scenario, runner 396 dòng, `--negative` 3 run, GATE_PATTERN ablation | `tests/behavior/` |
+| `claude plugin eval` có sẵn: init interview, ablation with-without, runs=3, max-cost, HTML report, judge haiku | `claude plugin eval --help`, CLI 2.1.286 |
+| `/claude-api build-eval` + `hillclimb` đã ship | blog (chưa tự chạy kiểm) |
+| `/ck:find` đọc registry 93KB (~23k token) mỗi lần | `docs/clauKit-registry.md` |
+| **Usage thật, 61 transcript local:** `/ck:fix` 10 · `/ck:tickets` 4 · `/ck:git` 2 · còn lại 1 · **`/ck:find` 0** | `~/.claude/projects/*/*.jsonl` |
+| scope-lock fail vì session không load `cook/SKILL.md` — lỗi routing ngầm, không phải lỗi gate | README behavior §scope-lock |
+
+## 3. Evaluated approaches
+
+| | Approach | Verdict |
+|---|---|---|
+| A | Hillclimb `/ck:find` | ❌ hạ cấp — 0 lần dùng thật; tối ưu thứ không ai gọi |
+| **A'** | **Hillclimb router ngầm**: task thật → skill/gate nào được Read trước Edit đầu tiên. Surface = `skill-activation.md` (+ `development-rules.md`), luôn load mọi run | ✅ chọn — chạy trên *mọi* task, lỗi đã đo (scope-lock), grader programmatic từ tool-sequence |
+| B | Migrate harness → `claude plugin eval` | ⏸ hoãn — ablation whole-plugin ≠ per-gate; chưa plugin parity |
+| C | Ship skill `/ck:eval` cho user | ❌ duplicate claude-api + plugin eval (DRY) |
+| D | Harness hygiene: CI/noise floor, headroom rule, prompt lấy từ transcript | ✅ kèm A' — nhỏ, sửa đúng chỗ verdict lật |
+
+## 4. Đánh giá khách quan: có tích cực không?
+
+**Có — có điều kiện. Là cải tiến về độ tin cậy/quy trình, không phải feature user thấy.**
+
+Tích cực:
+- Blog formalize đúng bài học ClauKit tự trả giá (headroom = "rule chỉ đo được khi chống default của model"; variance = verdict coin-flip). Văn hoá eval đã có → chi phí adopt thấp.
+- Biến claim không kiểm chứng thành con số; cho phép đo chi phí token của file luôn-load.
+- A' nhắm đúng lỗi đã đo: gate tồn tại nhưng không được load.
+
+Tiêu cực / giới hạn:
+- **Cost thật** — mỗi case = session `claude -p`; memory ghi org spend limit 429 đã giết run giữa chừng. Cần `--max-cost`/budget cứng.
+- **Model drift** — mỗi model mới đổi baseline; climb prose trên 1 model = khắc "failure fingerprint" của model đó (blog cảnh báo). Phải re-run khi đổi model.
+- **Dataset nhỏ** — 61 transcript, ~22 lệnh /ck:; nếu <40 case sạch thì split train/test vô nghĩa → chỉ đo, không climb.
+- **Không cứu được 4 gate không phân biệt** — đó là giới hạn phương pháp, không phải thiếu tooling.
+- Opportunity cost vs plugin parity roadmap.
+
+Điều kiện để đáng làm: time-box; baseline trước; headroom <90% mới climb; held-out test giữ kín.
+
+## 5. Recommended solution (A' + D)
+
+1. Mine transcripts → 40–80 prompt thật (scrub PII, git-ignored), gán expected skill/gate set; bỏ case 2 người gán khác nhau.
+2. Grader: `tool-sequence.cjs` — first `SKILL.md` Read ∈ expected set, trước Edit/Write đầu tiên. Cap turns, deny Edit → rẻ.
+3. Baseline 3 run/case, báo CI + noise floor. Headroom check.
+4. Hillclimb: 1 thay đổi/vòng trên `skill-activation.md`; train↑ test phẳng → revert; cấm dán text case vào surface.
+5. Metric phụ: token của file luôn-load (giảm mà acc giữ = thắng).
+6. D: Wilson CI cho số lần ablation; rule "ablated pass ≥ X% → non-discriminating, không credit".
+
+## 6. Risks
+
+| Risk | Mitigation |
+|---|---|
+| Answer leakage (case từ "Triggers on" text) | case registry-derived chỉ ở train |
+| Overfit vào cụm từ case | transcript hygiene + held-out test |
+| Ground truth mơ hồ (fix vs debug) | expected = set; drop case bất đồng |
+| PII khách hàng trong transcript | local-only, gitignore, scrub |
+| Spend limit 429 | budget cứng, ERROR class đã có |
+
+## 7. Success metrics
+
+- Baseline đo được, CI hẹp hơn noise floor.
+- Held-out test: routing acc tăng > noise floor; scope-lock-shaped prompt load `cook` ≥ 2/3 → 3/3.
+- Token file luôn-load không tăng.
+- Dừng sạch nếu baseline ≥ 90% (kết quả trung thực, không phải thất bại).
+
+## 8. Next steps
+
+- User xác nhận A' (thay A) → handoff `planner` với report này.
+- Touch: `tests/behavior/` (tool-sequence, runner, new dataset dir), `.claude/workflows/skill-activation.md`, `development-rules.md` § Behavioural-Skill Governance.
+
+## Unresolved questions
+
+- Transcript local có bị prune (cleanupPeriodDays)? 61 file có đại diện usage thật của team không, hay chỉ máy này?
+- Có user ClauKit khác ngoài máy này để lấy mẫu không?
+- Budget token chấp nhận được mỗi vòng climb?
+- Có script grader trong `claude plugin eval` không (chưa kiểm) — quyết định B sau này.
diff --git a/tests/behavior-harness.test.js b/tests/behavior-harness.test.js
index 22f6bfd..e88f6d1 100644
--- a/tests/behavior-harness.test.js
+++ b/tests/behavior-harness.test.js
@@ -419,51 +419,78 @@ test('a bash-written mutation counts as a mutation, not just Edit/Write', () =>
   ]), EVI, MUT);
   assert.ok(!v.ok, 'editing through a shell must not launder the ordering');
   assert.match(v.why, /BEFORE the cited claim/);
 });
 
 // --- verdict classes and the positive control -------------------------------
 // Three outcomes, because two conflated the only two gates with real evidence
 // into the same bucket as the ones with none: a rule that shifts behaviour
 // without deciding it is not a rule that does nothing.
 
-function sweep({ negative = false, positive = false, gateRc = 0, nolineRc = 0, nogateRcs = [] } = {}) {
+function sweep({ negative = false, positive = false, gateRc = 0, nolineRc = 0, nogateRcs = [], env = {} } = {}) {
   const script = `
     source tests/behavior/run-scenario.sh
     _i=0
     run_one() {
       case "$2" in
         gate)   return ${gateRc} ;;
         noline) return ${nolineRc} ;;
       esac
       _i=$((_i + 1)); set -- ${nogateRcs.join(' ') || '0'}; return \${!_i}
     }
     ALL_SET="stub"; FAST_SET="stub"
     main stub ${positive ? '--positive' : ''} ${negative ? '--negative=' + nogateRcs.length : ''} 2>&1 | tail -20
   `;
-  return execFileSync('bash', ['-c', script], { encoding: 'utf8' });
+  return execFileSync('bash', ['-c', script], { encoding: 'utf8', env: { ...process.env, ...env } });
 }
 
 test('a partial ablation separation reads as SUPPORTED, not as nothing', () => {
   const out = sweep({ negative: true, nogateRcs: [0, 1, 0] });
   assert.match(out, /SUPPORTED, NOT DEMONSTRATED/);
   assert.match(out, /absent in 2 of/);
   assert.match(out, /--positive/, 'and it must point at the test that can settle it');
   assert.doesNotMatch(out, /NOT DISCRIMINATING/);
 });
 
 test('behaviour surviving every ablated run reads as NOT DISCRIMINATING', () => {
   const out = sweep({ negative: true, nogateRcs: [1, 1, 1] });
   assert.match(out, /NOT DISCRIMINATING/);
   assert.match(out, /measures the model, not the gate/);
 });
 
+test('a majority-leaking ablation (2 of 3) is NOT DISCRIMINATING, not merely supported', () => {
+  const out = sweep({ negative: true, nogateRcs: [1, 1, 0] });
+  assert.match(out, /NOT DISCRIMINATING/);
+  assert.match(out, /ablated pass rate 2\/3, Wilson 95% CI \[/);
+  assert.doesNotMatch(out, /SUPPORTED/);
+});
+
+test('0 of 3 leaked prints the Wilson interval and warns N=3 cannot exclude 50%', () => {
+  const out = sweep({ negative: true, nogateRcs: [0, 0, 0] });
+  assert.match(out, /Wilson 95% CI \[0\.00, 0\.56\]/);
+  assert.match(out, /N=3 cannot exclude an ablated pass rate ≥ 0\.5 \(upper bound 0\.56\); use --negative=5 or more/);
+  assert.match(out, /── 1 scenario\(s\) genuinely verified/, 'still credited');
+});
+
+test('NONDISC_RATE=0.3 turns a 1-of-3 leak into NOT DISCRIMINATING', () => {
+  const out = sweep({ negative: true, nogateRcs: [0, 1, 0], env: { NONDISC_RATE: '0.3' } });
+  assert.match(out, /NOT DISCRIMINATING/);
+  assert.match(out, /ablated pass rate ≥ 0\.3/);
+  assert.doesNotMatch(out, /SUPPORTED/);
+});
+
+test('--negative=5 with 0 leaks excludes 50% and carries no warning', () => {
+  const out = sweep({ negative: true, nogateRcs: [0, 0, 0, 0, 0] });
+  assert.match(out, /Wilson 95% CI \[0\.00, 0\.43\]/);
+  assert.doesNotMatch(out, /cannot exclude/);
+});
+
 test('a positive control credits a rule that fails without it and passes with it', () => {
   const out = sweep({ positive: true, nolineRc: 0, gateRc: 0 });
   assert.match(out, /positive control OK/);
   assert.match(out, /── 1 scenario\(s\) genuinely verified/);
 });
 
 test('a case that passes without the rule cannot credit the rule', () => {
   // nolineRc 1 = the assertion still held with the rule removed.
   const out = sweep({ positive: true, nolineRc: 1, gateRc: 0 });
   assert.match(out, /── 0 scenario\(s\) genuinely verified/);
diff --git a/tests/behavior-routing.test.js b/tests/behavior-routing.test.js
new file mode 100644
index 0000000..93d5b10
--- /dev/null
+++ b/tests/behavior-routing.test.js
@@ -0,0 +1,199 @@
+/**
+ * Tests for the routing eval's deterministic pieces (tests/behavior/routing/*,
+ * tests/behavior/stats.cjs): the grader, the interval maths, the accept rule and
+ * the leak guard. No model in the loop — the eval spends money, these must not.
+ */
+
+const { test } = require('node:test');
+const assert = require('node:assert');
+const fs = require('node:fs');
+const os = require('node:os');
+const path = require('node:path');
+const { parse } = require('./behavior/tool-sequence.cjs');
+const { wilson } = require('./behavior/stats.cjs');
+const { routeOf, isMutation, commandAliases, gradeRoute } = require('./behavior/routing/route-grade.cjs');
+const { aggregate, decide } = require('./behavior/routing/routing-stats.cjs');
+const { leak, surfaceBytes } = require('./behavior/routing/routing-guard.cjs');
+
+const asst = (...blocks) => JSON.stringify({ type: 'assistant', message: { content: blocks } });
+const res = (id, content, isError) => JSON.stringify({
+  type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: !!isError }] },
+});
+const use = (id, name, input) => ({ type: 'tool_use', id, name, input });
+
+/** A tool call plus its result, as two stream lines. */
+const call = (id, name, input, out = 'ok', isError = false) => [asst(use(id, name, input)), res(id, out, isError)];
+const stepsOf = (...calls) => parse(calls.flat()).steps;
+const skillPath = (n) => `.claude/skills/software/${n}/SKILL.md`;
+const readSkill = (id, n) => call(id, 'Read', { file_path: skillPath(n) });
+const near = (a, b, eps = 0.001) => assert.ok(Math.abs(a - b) <= eps, `${a} !~ ${b}`);
+
+test('Read cook/SKILL.md then Edit -> PASS', () => {
+  const g = gradeRoute(stepsOf(readSkill('r', 'cook'), call('e', 'Edit', { file_path: 'a.js' })), ['cook']);
+  assert.strictEqual(g.verdict, 'PASS');
+  assert.strictEqual(g.route, 'cook');
+  assert.strictEqual(g.routeIdx, 1);
+  assert.strictEqual(g.mutationIdx, 2);
+});
+
+test('Edit then Read cook -> FAIL mutation-first', () => {
+  const g = gradeRoute(stepsOf(call('e', 'Edit', { file_path: 'a.js' }), readSkill('r', 'cook')), ['cook']);
+  assert.strictEqual(g.verdict, 'FAIL');
+  assert.strictEqual(g.why, 'mutation-first@1');
+});
+
+test('first route debugging with expected [tdd] -> FAIL wrong-route:debugging', () => {
+  const g = gradeRoute(stepsOf(readSkill('a', 'debugging'), readSkill('b', 'tdd')), ['tdd']);
+  assert.strictEqual(g.verdict, 'FAIL');
+  assert.strictEqual(g.why, 'wrong-route:debugging');
+});
+
+test('Bash cat of a SKILL.md counts as a route', () => {
+  const s = stepsOf(call('b', 'Bash', { command: `cat ${skillPath('tdd')}` }));
+  assert.strictEqual(routeOf(s[0]), 'tdd');
+  assert.strictEqual(gradeRoute(s, ['tdd']).verdict, 'PASS');
+  assert.strictEqual(routeOf(stepsOf(call('b', 'Bash', { command: `echo ${skillPath('tdd')}` }))[0]), null);
+});
+
+
+test('Skill ck:fix with alias ck:fix -> {tdd} satisfies expected [tdd]', () => {
+  const aliases = new Map([['ck:fix', new Set(['tdd'])]]);
+  const s = stepsOf(call('s', 'Skill', { skill: 'ck:fix' }));
+  assert.strictEqual(routeOf(s[0], aliases), 'ck:fix');
+  assert.strictEqual(gradeRoute(s, ['tdd'], aliases).verdict, 'PASS');
+  const bare = gradeRoute(s, ['tdd'], new Map());
+  assert.strictEqual(bare.why, 'wrong-route:ck:fix');
+});
+
+test('Read of a command file routes as <ns>:<x>', () => {
+  const s = stepsOf(call('r', 'Read', { file_path: '/p/.claude/commands/ck/fix.md' }));
+  assert.strictEqual(routeOf(s[0]), 'ck:fix');
+});
+
+test('registry / workflow / references reads are neutral; first real route wins', () => {
+  const calls = [
+    call('a', 'Read', { file_path: 'docs/clauKit-registry.md' }),
+    call('b', 'Read', { file_path: '.claude/workflows/development-rules.md' }),
+    call('c', 'Read', { file_path: '.claude/skills/software/cook/references/x.md' }),
+    call('d', 'Read', { file_path: 'CLAUDE.md' }),
+    readSkill('e', 'cook'),
+  ];
+  const s = stepsOf(...calls);
+  assert.deepStrictEqual(s.slice(0, 4).map((x) => routeOf(x)), [null, null, null, null]);
+  const g = gradeRoute(s, ['cook']);
+  assert.strictEqual(g.route, 'cook');
+  assert.strictEqual(g.routeIdx, 5);
+  assert.strictEqual(g.verdict, 'PASS');
+});
+
+test('a denied Write still counts as a mutation', () => {
+  const denied = call('w', 'Write', { file_path: 'a.js' }, 'permission denied', true);
+  assert.ok(isMutation(stepsOf(denied)[0]));
+  assert.strictEqual(gradeRoute(stepsOf(denied, readSkill('r', 'cook')), ['cook']).why, 'mutation-first@1');
+});
+
+test('Bash: redirect to a file is a mutation; cat and /dev/null or fd-dup redirects are not', () => {
+  const mut = (command) => isMutation(stepsOf(call('b', 'Bash', { command }))[0]);
+  assert.ok(mut('echo x > f'));
+  assert.ok(mut('echo x > f 2>/dev/null'));
+  assert.ok(!mut('cat f'));
+  assert.ok(!mut('ls x > /dev/null 2>&1'));
+  assert.ok(!mut('cat a 2>/dev/null'));
+});
+
+test('no route, no mutation -> FAIL no-route', () => {
+  const g = gradeRoute(stepsOf(call('g', 'Grep', { pattern: 'x' })), ['cook']);
+  assert.deepStrictEqual([g.verdict, g.why, g.route, g.routeIdx, g.mutationIdx], ['FAIL', 'no-route', null, null, null]);
+});
+
+test('commandAliases collects every linked skill; commands without links get an empty set', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-alias-'));
+  fs.mkdirSync(path.join(dir, 'ck'));
+  fs.mkdirSync(path.join(dir, 'mk'));
+  fs.writeFileSync(path.join(dir, 'ck', 'cook.md'),
+    'Read [a](../../skills/software/cook/SKILL.md) and [b](../../skills/software/tdd/SKILL.md#base) not [c](x.md)');
+  fs.writeFileSync(path.join(dir, 'mk', 'seo.md'), 'no links');
+  const m = commandAliases(dir);
+  assert.deepStrictEqual([...m.get('ck:cook')].sort(), ['cook', 'tdd']);
+  assert.strictEqual(m.get('mk:seo').size, 0);
+});
+
+test('commandAliases on the real commands dir: ck:cook links cook', () => {
+  const m = commandAliases(path.join(__dirname, '..', '.claude', 'commands'));
+  assert.ok(m.get('ck:cook').has('cook'));
+});
+
+test('wilson matches known values', () => {
+  near(wilson(0, 3).hi, 0.5615);
+  near(wilson(3, 3).lo, 0.4385);
+  assert.deepStrictEqual(wilson(0, 0), { p: 0, lo: 0, hi: 1 });
+  near(wilson(1, 3).p, 1 / 3);
+});
+
+const row = (c, run, verdict, extra = {}) => ({ case: c, split: 'train', run, verdict, costUsd: 0.1, ...extra });
+const CASES = { a: { expected: ['cook'] }, b: { expected: ['tdd'] } };
+
+test('aggregate excludes ERROR rows from n and derives noise from replicate spread', () => {
+  const rows = [
+    row('a', 1, 'PASS'), row('b', 1, 'PASS'),
+    row('a', 2, 'PASS'), row('b', 2, 'FAIL'),
+    row('a', 3, 'FAIL'), row('b', 3, 'ERROR'),
+    row('a', 1, 'PASS', { split: 'test' }),
+  ];
+  const g = aggregate(rows, 'train', CASES);
+  assert.deepStrictEqual([g.n, g.k, g.errors], [5, 3, 1]);
+  assert.deepStrictEqual(g.replicateAcc, [1, 0.5, 0]);
+  assert.strictEqual(g.noise, 1);
+  near(g.costUsd, 0.6);
+  assert.deepStrictEqual(g.byGate.cook, { n: 3, k: 2, acc: 2 / 3 });
+  assert.strictEqual(g.byGate.tdd.n, 2);
+  assert.strictEqual(g.flaky, 2); // a: 2/3 pass, b: 1/2 pass
+  assert.ok(g.lo <= g.acc && g.acc <= g.hi);
+});
+
+test('aggregate without a split takes every row; empty input is all zeros', () => {
+  assert.strictEqual(aggregate([row('a', 1, 'PASS'), row('a', 1, 'PASS', { split: 'test' })], undefined, CASES).n, 2);
+  assert.strictEqual(aggregate([], 'train', CASES).noise, 0);
+});
+
+const agg = (acc, noise) => ({ acc, noise });
+const OK = { sizeOk: true, leakOk: true };
+
+test('decide: train delta within noise -> REVERT', () => {
+  const d = decide({ train: agg(0.5, 0.1), test: agg(0.5, 0) }, { train: agg(0.6, 0.1), test: agg(0.7, 0) }, OK);
+  assert.strictEqual(d.verdict, 'REVERT');
+  near(d.trainDelta, 0.1);
+});
+
+test('decide: train ok but test delta 0 -> REVERT', () => {
+  const d = decide({ train: agg(0.5, 0.05), test: agg(0.5, 0) }, { train: agg(0.7, 0.05), test: agg(0.5, 0) }, OK);
+  assert.strictEqual(d.verdict, 'REVERT');
+  assert.strictEqual(d.testDelta, 0);
+});
+
+test('decide: train ok, test up, size and leak ok -> ACCEPT', () => {
+  const d = decide({ train: agg(0.5, 0.05), test: agg(0.5, 0) }, { train: agg(0.7, 0.05), test: agg(0.6, 0) }, OK);
+  assert.strictEqual(d.verdict, 'ACCEPT');
+});
+
+test('decide: sizeOk false or leakOk false -> REVERT even when the numbers pass', () => {
+  const b = { train: agg(0.5, 0.05), test: agg(0.5, 0) };
+  const c = { train: agg(0.7, 0.05), test: agg(0.6, 0) };
+  assert.strictEqual(decide(b, c, { sizeOk: false, leakOk: true }).verdict, 'REVERT');
+  assert.strictEqual(decide(b, c, { sizeOk: true, leakOk: false }).verdict, 'REVERT');
+  assert.strictEqual(decide(b, c, {}).verdict, 'REVERT'); // unchecked is not ok
+});
+
+test('leak: a 6-word run from a prompt in the surface is flagged; 5 words is clean', () => {
+  const prompt = 'Please add retry handling to the upload worker today';
+  const six = 'Rule: add RETRY handling   to the upload\nworker.';
+  const five = 'Rule: retry handling to the upload, then stop.';
+  assert.ok(leak(six, [prompt]).length > 0);
+  assert.deepStrictEqual(leak(five, [prompt]), []);
+});
+
+test('surfaceBytes sums file sizes', () => {
+  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ck-bytes-')), 'x.md');
+  fs.writeFileSync(f, 'héllo');
+  assert.strictEqual(surfaceBytes([f, f]), 12);
+});
diff --git a/tests/behavior/routing/route-grade.cjs b/tests/behavior/routing/route-grade.cjs
new file mode 100644
index 0000000..d8d05e2
--- /dev/null
+++ b/tests/behavior/routing/route-grade.cjs
@@ -0,0 +1,121 @@
+#!/usr/bin/env node
+/**
+ * Route grader: did the model reach for the right skill BEFORE it started editing?
+ *
+ * A "route" is the first thing the model does that commits it to a methodology:
+ * reading a skill's SKILL.md (by Read or by cat), invoking the Skill tool, or
+ * reading a slash command's file. Everything else — the registry, workflows,
+ * references/*.md, CLAUDE.md — is orientation and stays neutral, so reading the
+ * registry first does not cost a case.
+ *
+ * Commands link their skills, so a run that opens `ck:fix` has routed to whatever
+ * `fix.md` delegates to; `commandAliases` maps command -> skills it links.
+ *
+ *   node route-grade.cjs <events.jsonl> --expected cook,tdd [--commands <dir>]
+ *     prints the verdict JSON; exit 0 PASS, 1 FAIL
+ */
+
+const fs = require('node:fs');
+const path = require('node:path');
+const { parse, MUTATORS, BASH_WRITE } = require('../tool-sequence.cjs');
+
+/** `.../skills/<group>/<name>/SKILL.md` -> name (the directory, not the group). */
+const SKILL_MD = /skills\/(?:[^/]+\/)*([^/]+)\/SKILL\.md$/;
+const COMMAND_MD = /(?:^|\/)\.claude\/commands\/([^/]+)\/([^/]+)\.md$/;
+/** Shell readers that count as "opening" a file, as opposed to writing or listing it. */
+const BASH_READER = /^\s*(cat|head|tail|sed -n|less|bat)\b/;
+
+/** The skill name a path points at, or null. A `#anchor` does not change the file. */
+function skillOfPath(p) {
+  const m = SKILL_MD.exec(String(p).split('#')[0]);
+  return m ? m[1] : null;
+}
+
+/** Route token for one step: "cook" | "ck:fix" | null (neutral). */
+function routeOf(step, aliases) {
+  const input = step.input || {};
+  if (step.tool === 'Skill') return input.skill ? String(input.skill) : null;
+  if (step.tool === 'Read') {
+    const file = String(input.file_path || '');
+    const skill = skillOfPath(file);
+    if (skill) return skill;
+    const cmd = COMMAND_MD.exec(file);
+    return cmd ? `${cmd[1]}:${cmd[2]}` : null;
+  }
+  if (step.tool === 'Bash' && BASH_READER.test(input.command || '')) {
+    for (const tok of String(input.command).split(/\s+/)) {
+      const skill = skillOfPath(tok.replace(/^["']|["']$/g, ''));
+      if (skill) return skill;
+    }
+  }
+  return null;
+}
+
+/** Redirects that discard output or duplicate an fd write no file; BASH_WRITE cannot tell. */
+const NOISE_REDIRECT = /\d*>>?\s*\/dev\/null|\d*>&\d+/g;
+
+/** An attempt counts, whatever its outcome: a denied Write is still the wrong order. */
+function isMutation(step) {
+  if (MUTATORS.has(step.tool)) return true;
+  const cmd = (step.input && step.input.command) || '';
+  return step.tool === 'Bash' && BASH_WRITE.test(cmd.replace(NOISE_REDIRECT, ' '));
+}
+
+/** Map "<ns>:<x>" -> Set of skill names the command file links to. */
+function commandAliases(commandsDir) {
+  const out = new Map();
+  for (const ns of fs.readdirSync(commandsDir, { withFileTypes: true })) {
+    if (!ns.isDirectory()) continue;
+    for (const f of fs.readdirSync(path.join(commandsDir, ns.name))) {
+      if (!f.endsWith('.md')) continue;
+      const body = fs.readFileSync(path.join(commandsDir, ns.name, f), 'utf-8');
+      const skills = new Set();
+      for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
+        const s = skillOfPath(m[1]);
+        if (s) skills.add(s);
+      }
+      out.set(`${ns.name}:${f.slice(0, -3)}`, skills);
+    }
+  }
+  return out;
+}
+
+/** Does the route satisfy `expected`, directly or through a command's linked skills? */
+function routeMatches(route, expected, aliases) {
+  if (expected.includes(route)) return true;
+  const linked = aliases && aliases.get(route);
+  return !!linked && expected.some((e) => linked.has(e));
+}
+
+/** PASS iff the first route is expected and no mutation came before it. */
+function gradeRoute(steps, expected, aliases = new Map()) {
+  const first = steps.find((s) => routeOf(s, aliases) !== null);
+  const mut = steps.find(isMutation);
+  const route = first ? routeOf(first, aliases) : null;
+  const routeIdx = first ? first.idx : null;
+  const mutationIdx = mut ? mut.idx : null;
+  const verdict = (ok, why) => ({ verdict: ok ? 'PASS' : 'FAIL', route, routeIdx, mutationIdx, why });
+  if (!first) return verdict(false, 'no-route');
+  if (!routeMatches(route, expected, aliases)) return verdict(false, `wrong-route:${route}`);
+  if (mutationIdx !== null && mutationIdx < routeIdx) return verdict(false, `mutation-first@${mutationIdx}`);
+  return verdict(true, 'ok');
+}
+
+function main() {
+  const argv = process.argv.slice(2);
+  const flag = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);
+  const file = argv.find((a) => !a.startsWith('--') && a !== flag('--expected') && a !== flag('--commands'));
+  const expected = (flag('--expected') || '').split(',').filter(Boolean);
+  if (!file || !expected.length) {
+    console.error('usage: route-grade.cjs <events.jsonl> --expected a,b [--commands <dir>]');
+    process.exit(2);
+  }
+  const dir = flag('--commands') || path.join(__dirname, '..', '..', '..', '.claude', 'commands');
+  const { steps } = parse(fs.readFileSync(file, 'utf-8').split('\n'));
+  const g = gradeRoute(steps, expected, commandAliases(dir));
+  console.log(JSON.stringify(g));
+  process.exit(g.verdict === 'PASS' ? 0 : 1);
+}
+
+if (require.main === module) main();
+module.exports = { routeOf, isMutation, commandAliases, gradeRoute, skillOfPath };
diff --git a/tests/behavior/routing/routing-guard.cjs b/tests/behavior/routing/routing-guard.cjs
new file mode 100644
index 0000000..aab7e29
--- /dev/null
+++ b/tests/behavior/routing/routing-guard.cjs
@@ -0,0 +1,58 @@
+#!/usr/bin/env node
+/**
+ * Overfit guards for the climb surface.
+ *
+ * `leak`: the surface (skill-activation.md) must not quote an eval prompt. A rule
+ * that contains a case's own sentence passes that case by recall, not routing, and
+ * the gain would vanish on any new prompt. Six consecutive words is long enough
+ * that a shared run is a copy, not a coincidence of vocabulary.
+ * `bytes`: the size rule — the surface may not grow past its baseline.
+ *
+ *   node routing-guard.cjs leak <cases.jsonl> <surface.md>   exit 0 clean, 1 leak
+ *   node routing-guard.cjs bytes <file>...                   prints total bytes
+ *
+ * The leak CLI prints a count only: the offending text is prompt text, and the
+ * output lands in committed reports.
+ */
+
+const fs = require('node:fs');
+
+/** All n-word windows over lower-cased [a-z0-9]+ tokens (whitespace/punctuation-insensitive). */
+function shingles(text, n = 6) {
+  const words = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
+  const out = new Set();
+  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(' '));
+  return out;
+}
+
+/** Shingles of the surface that also occur in any prompt; [] = clean. */
+function leak(surfaceText, prompts) {
+  const surface = shingles(surfaceText);
+  const hits = new Set();
+  for (const p of prompts) for (const s of shingles(p)) if (surface.has(s)) hits.add(s);
+  return [...hits];
+}
+
+function surfaceBytes(files) {
+  return files.reduce((sum, f) => sum + fs.statSync(f).size, 0);
+}
+
+function main() {
+  const [cmd, ...args] = process.argv.slice(2);
+  if (cmd === 'leak' && args.length === 2) {
+    const prompts = fs.readFileSync(args[0], 'utf-8').split('\n').filter(Boolean)
+      .map((l) => JSON.parse(l).prompt).filter((p) => typeof p === 'string');
+    const hits = leak(fs.readFileSync(args[1], 'utf-8'), prompts);
+    console.log(hits.length ? `LEAK: ${hits.length} shingle(s)` : 'clean');
+    process.exit(hits.length ? 1 : 0);
+  }
+  if (cmd === 'bytes' && args.length) {
+    console.log(surfaceBytes(args));
+    return;
+  }
+  console.error('usage: routing-guard.cjs leak <cases.jsonl> <surface.md> | bytes <file>...');
+  process.exit(2);
+}
+
+if (require.main === module) main();
+module.exports = { shingles, leak, surfaceBytes };
diff --git a/tests/behavior/routing/routing-stats.cjs b/tests/behavior/routing/routing-stats.cjs
new file mode 100644
index 0000000..1fb853e
--- /dev/null
+++ b/tests/behavior/routing/routing-stats.cjs
@@ -0,0 +1,80 @@
+/**
+ * Aggregation and the accept rule for the routing eval.
+ *
+ * Row shape (one per case x run): { case, split, run, verdict, route, why,
+ * costUsd, model, surfaceSha }. verdict is PASS | FAIL | ERROR; ERROR is infra
+ * (spend limit, auth, zero tool calls) and says nothing about routing, so it is
+ * counted but kept out of n — scoring it as FAIL would punish the surface for an
+ * outage.
+ */
+
+const { wilson } = require('../stats.cjs');
+
+/** Gate of a case = its first expected route; `cases` is an object or Map keyed by case id. */
+function gateOf(cases, id) {
+  const c = cases instanceof Map ? cases.get(id) : cases && cases[id];
+  return (c && c.expected && c.expected[0]) || 'unknown';
+}
+
+/**
+ * Roll rows up for one split (all rows when `split` is omitted).
+ * noise = max - min of the per-run accuracies: the spread the same surface shows
+ * against itself, i.e. the smallest delta that could be real.
+ * flaky = cases that neither always pass nor always fail across their scored runs.
+ */
+function aggregate(rows, split, cases) {
+  const mine = rows.filter((r) => !split || r.split === split);
+  const scored = mine.filter((r) => r.verdict !== 'ERROR');
+  const k = scored.filter((r) => r.verdict === 'PASS').length;
+  const w = wilson(k, scored.length);
+
+  const runs = [...new Set(scored.map((r) => r.run))].sort((a, b) => a - b);
+  const replicateAcc = runs.map((run) => {
+    const rr = scored.filter((r) => r.run === run);
+    return rr.filter((r) => r.verdict === 'PASS').length / rr.length;
+  });
+  const noise = replicateAcc.length ? Math.max(...replicateAcc) - Math.min(...replicateAcc) : 0;
+
+  const byGate = {};
+  const perCase = new Map();
+  for (const r of scored) {
+    const g = (byGate[gateOf(cases, r.case)] ||= { n: 0, k: 0, acc: 0 });
+    const pc = perCase.get(r.case) || { n: 0, k: 0 };
+    g.n++;
+    pc.n++;
+    if (r.verdict === 'PASS') { g.k++; pc.k++; }
+    perCase.set(r.case, pc);
+  }
+  for (const g of Object.values(byGate)) g.acc = g.k / g.n;
+
+  return {
+    n: scored.length, k, acc: w.p, lo: w.lo, hi: w.hi, replicateAcc, noise,
+    errors: mine.length - scored.length,
+    costUsd: mine.reduce((s, r) => s + (r.costUsd || 0), 0),
+    byGate,
+    flaky: [...perCase.values()].filter((c) => c.k > 0 && c.k < c.n).length,
+  };
+}
+
+/**
+ * Accept rule. base/cand = { train, test } aggregates; flags are the caller's
+ * checks (byte size, leak guard) — an unchecked flag is not ok.
+ *
+ * Train must beat the larger of the two noise floors (a candidate that is merely
+ * noisier must not buy itself a lower bar); test must move up by any amount —
+ * it is the held-out guard against fitting the train prompts, and is spent
+ * sparingly, so it is a sign check rather than a second noise test.
+ */
+function decide(base, cand, { sizeOk, leakOk } = {}) {
+  const trainDelta = cand.train.acc - base.train.acc;
+  const testDelta = cand.test.acc - base.test.acc;
+  const floor = Math.max(base.train.noise || 0, cand.train.noise || 0);
+  const out = (verdict, why) => ({ verdict, why, trainDelta, testDelta });
+  if (!(trainDelta > floor)) return out('REVERT', `train delta ${trainDelta.toFixed(3)} <= noise ${floor.toFixed(3)}`);
+  if (!(testDelta > 0)) return out('REVERT', `test delta ${testDelta.toFixed(3)} <= 0`);
+  if (sizeOk !== true) return out('REVERT', 'size rule');
+  if (leakOk !== true) return out('REVERT', 'leak guard');
+  return out('ACCEPT', 'train > noise, test > 0, size and leak ok');
+}
+
+module.exports = { aggregate, decide };
diff --git a/tests/behavior/run-scenario.sh b/tests/behavior/run-scenario.sh
index 7a570f4..88a01c7 100755
--- a/tests/behavior/run-scenario.sh
+++ b/tests/behavior/run-scenario.sh
@@ -311,35 +311,38 @@ POSITIVE=0
 # How many times the ablated run must fail before the gate is credited.
 #
 # n=1 is a coin flip and it produced two wrong verdicts in one session:
 # `scope-lock`'s negative control came back OK, then FAIL on an identical setup,
 # and `verify-plan-fires` went OK → FAIL → FAIL. Both times the ablated tree was
 # checked and the rule really was gone; the model simply asks the scoping question
 # about half the time on its own. "Removing the gate removes the behaviour" is a
 # claim about reliability, so one sample cannot support it — the gate is credited
 # only when EVERY ablated run fails.
 NEGATIVE_RUNS=${NEGATIVE_RUNS:-3}
+# Ablated pass rate at or above this = the behaviour does not depend on the gate.
+NONDISC_RATE=${NONDISC_RATE:-0.5}
 ARGS=()
 for a in "$@"; do
   case "$a" in
     --negative=*) NEGATIVE=1; NEGATIVE_RUNS="${a#*=}" ;;
     --negative) NEGATIVE=1 ;;
     --positive) POSITIVE=1 ;;
     *) ARGS+=("$a") ;;
   esac
 done
 
 case "${ARGS[0]:-}" in
   --fast) SET="$FAST_SET" ;;
   --all)  SET="$ALL_SET" ;;
   "")     echo "usage: run-scenario.sh <scenario>|--fast|--all [--negative[=N]]"
-          echo "  --negative[=N]  ablate the whole gate; require the behaviour to disappear in all N runs (default 3)"
+          echo "  --negative[=N]  ablate the whole gate; require the behaviour to disappear in all N runs (default 3); prints a Wilson 95% CI"
+          echo "                  env NONDISC_RATE (default 0.5): ablated pass rate >= this = NOT DISCRIMINATING"
           echo "  --positive      remove only POSITIVE_PATTERN (one rule); require FAIL without it and PASS with it"
           echo "scenarios: $ALL_SET"; exit 1 ;;
   *)      SET="${ARGS[0]}" ;;
 esac
 
 # --negative doubles the number of claude -p runs, so it is opt-in.
 fail=0; errored=0; ran=0
 for s in $SET; do
   # Positive control first: it is one run, and a rule that cannot flip its own
   # case is not worth spending three ablated runs on.
@@ -361,35 +364,40 @@ for s in $SET; do
   # directly beneath "NOT SENSITIVE" and "never ran" — the exact false-success
   # report this harness exists to catch.
   if [ $rc -eq 0 ] && [ $NEGATIVE -eq 0 ]; then ran=$((ran + 1)); fi
   if [ $NEGATIVE -eq 1 ] && [ $rc -eq 0 ]; then
     leaked=0; nerr=0
     for _n in $(seq 1 "$NEGATIVE_RUNS"); do
       run_one "$s" nogate; nrc=$?
       [ $nrc -eq 1 ] && leaked=$((leaked + 1))
       [ $nrc -eq 2 ] && { nerr=1; break; }
     done
-    if [ $nerr -eq 1 ]; then
-      errored=1; echo "   stopping: infrastructure failure"; break
-    elif [ $leaked -eq $NEGATIVE_RUNS ]; then
+    if [ $nerr -eq 1 ]; then errored=1; echo "   stopping: infrastructure failure"; break; fi
+    ci=$(node "$HARNESS_DIR/stats.cjs" wilson "$leaked" "$NEGATIVE_RUNS")
+    lo=${ci#*lo=}; lo=${lo%% *}; hi=${ci##*hi=}
+    echo "   ablated pass rate $leaked/$NEGATIVE_RUNS, Wilson 95% CI [$lo, $hi]"
+    if node -e 'process.exit(+process.argv[1]/+process.argv[2] >= +process.argv[3] ? 0 : 1)' "$leaked" "$NEGATIVE_RUNS" "$NONDISC_RATE"; then
       fail=1
-      echo "✗ $s NOT DISCRIMINATING — the behaviour survived every one of $NEGATIVE_RUNS ablated runs."
+      echo "✗ $s NOT DISCRIMINATING — the behaviour survived $leaked of $NEGATIVE_RUNS ablated runs (ablated pass rate ≥ $NONDISC_RATE)."
       echo "   The model produces it unaided; this scenario measures the model, not the gate."
     elif [ $leaked -gt 0 ]; then
       fail=1
       echo "✗ $s SUPPORTED, NOT DEMONSTRATED — behaviour absent in $((NEGATIVE_RUNS - leaked)) of"
       echo "   $NEGATIVE_RUNS ablated runs, present in $leaked. Removing the rule shifts the outcome"
       echo "   but does not decide it, so unanimity is unreachable here. Use --positive: it asks"
       echo "   whether one rule flips a case that fails without it, which this separation suggests."
     else
       ran=$((ran + 1))
       echo "✓ $s negative control OK — behaviour absent in all $NEGATIVE_RUNS ablated runs"
+      if node -e 'process.exit(+process.argv[1] >= +process.argv[2] ? 0 : 1)' "$hi" "$NONDISC_RATE"; then
+        echo "   ⚠ N=$NEGATIVE_RUNS cannot exclude an ablated pass rate ≥ $NONDISC_RATE (upper bound $hi); use --negative=5 or more"
+      fi
     fi
   fi
 done
 
 echo "── $ran scenario(s) genuinely verified$([ $NEGATIVE -eq 1 ] && echo ' (with negative control)')"
 [ $errored -eq 1 ] && { echo "⚠ run incomplete — infrastructure, not gates. Re-run when resolved."; exit 3; }
 exit $fail
 }
 
 # Run only when executed, not when sourced for testing.
diff --git a/tests/behavior/stats.cjs b/tests/behavior/stats.cjs
new file mode 100644
index 0000000..00254e6
--- /dev/null
+++ b/tests/behavior/stats.cjs
@@ -0,0 +1,34 @@
+#!/usr/bin/env node
+/**
+ * Wilson score interval — the routing eval's only statistics.
+ *
+ * Accuracy over a few dozen cases is a coarse number; a bare percentage invites
+ * reading a one-case swing as a win. Wilson (not the normal approximation) because
+ * it stays inside [0, 1] and is honest at k = 0 and k = n, which small suites hit.
+ *
+ *   node tests/behavior/stats.cjs wilson <k> <n>   ->  p=0.33 lo=0.06 hi=0.79
+ */
+
+/** 95 % interval by default (z = 1.96). n = 0 knows nothing: [0, 1]. */
+function wilson(k, n, z = 1.96) {
+  if (!n) return { p: 0, lo: 0, hi: 1 };
+  const p = k / n;
+  const z2 = z * z;
+  const denom = 1 + z2 / n;
+  const centre = (p + z2 / (2 * n)) / denom;
+  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
+  return { p, lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
+}
+
+function main() {
+  const [cmd, k, n] = process.argv.slice(2);
+  if (cmd !== 'wilson' || !Number.isInteger(+k) || !Number.isInteger(+n) || +k < 0 || +k > +n) {
+    console.error('usage: stats.cjs wilson <k> <n>   (0 <= k <= n)');
+    process.exit(2);
+  }
+  const w = wilson(+k, +n);
+  console.log(`p=${w.p.toFixed(2)} lo=${w.lo.toFixed(2)} hi=${w.hi.toFixed(2)}`);
+}
+
+if (require.main === module) main();
+module.exports = { wilson };
diff --git a/tests/behavior/tool-sequence.cjs b/tests/behavior/tool-sequence.cjs
index ab067d9..dea785a 100644
--- a/tests/behavior/tool-sequence.cjs
+++ b/tests/behavior/tool-sequence.cjs
@@ -396,11 +396,11 @@ function main() {
   for (const s of steps) {
     flush(s.idx - 1);
     console.log(`[tool ${s.idx}: ${s.tool}] ${s.target}`);
     if (s.result) console.log(`[result ${s.idx}: ${outcomeOf(s.result)}] ${s.result.text.slice(0, 2000)}`);
   }
   flush(Infinity);
 }
 
 if (require.main === module) main();
 module.exports = { parse, outcomeOf, targetOf, rawTargetOf, tddOrder, evidenceBefore, sameTurn,
-                   concurrentDispatch };
+                   concurrentDispatch, MUTATORS, BASH_WRITE };
```
