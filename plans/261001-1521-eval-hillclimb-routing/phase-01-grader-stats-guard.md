# Phase 01 — Grader, stats, guard (offline + unit tests)

**Goal**: every deterministic piece of the routing eval exists and is pinned in `npm test` before any `claude -p` money is spent.

## **Interfaces**

**Consumes**: `tests/behavior/tool-sequence.cjs` → `parse(lines) → { steps, prose }`; step = `{ idx, turn, tool, target, raw, input, result }`.

**Produces**:
```js
// tests/behavior/stats.cjs
wilson(k, n, z = 1.96) → { p, lo, hi }        // n = 0 → { p: 0, lo: 0, hi: 1 }
// CLI: node tests/behavior/stats.cjs wilson <k> <n>  → prints "p=0.33 lo=0.06 hi=0.79"

// tests/behavior/routing/route-grade.cjs
routeOf(step, aliases) → string | null        // "cook" | "ck:fix" | null (neutral)
isMutation(step) → boolean
commandAliases(commandsDir) → Map<"ck:<x>", Set<skillName>>
gradeRoute(steps, expected: string[], aliases) →
  { verdict: "PASS"|"FAIL", route: string|null, routeIdx: number|null,
    mutationIdx: number|null, why: string }
// CLI: node route-grade.cjs <events.jsonl> --expected cook,tdd [--commands <dir>] → prints JSON, exit 0 PASS / 1 FAIL

// tests/behavior/routing/routing-stats.cjs
aggregate(rows, split?) → { n, k, acc, lo, hi, replicateAcc: number[], noise, errors, costUsd, byGate: {[g]: {n,k,acc}} , flaky: number }
decide(base, cand) → { verdict: "ACCEPT"|"REVERT", why, trainDelta, testDelta }   // cand/base = aggregate per split

// tests/behavior/routing/routing-guard.cjs
shingles(text, n = 6) → Set<string>
leak(surfaceText, prompts: string[]) → string[]       // offending shingles, [] = clean
surfaceBytes(files: string[]) → number
// CLI: node routing-guard.cjs leak <cases.jsonl> <surface.md>   → exit 0 clean / 1 leak (prints shingles count only, never text)
//      node routing-guard.cjs bytes <file>...                   → prints total bytes
```
Row shape (shared with phases 04–06): `{ case, split, run, verdict, route, why, costUsd, model, surfaceSha }`.

## Tasks

1. `tests/behavior/tool-sequence.cjs`: append `MUTATORS, BASH_WRITE` to `module.exports`. No other change.
2. `tests/behavior/stats.cjs` (~40 lines): `wilson` + CLI.
3. `tests/behavior/routing/route-grade.cjs` (~150 lines):
   - `routeOf`: `Read` whose `file_path`, or `Bash` whose command starts with `cat|head|tail|sed -n|less|bat` and names a path, matching `/skills/(?:[^/]+/)*([^/]+)/SKILL\.md$` → capture group (dir name). `Skill` tool → `input.skill`. Read of `.claude/commands/<ns>/<x>.md` → `<ns>:<x>`. Everything else (registry, workflows, `references/*.md`, CLAUDE.md) → `null`.
   - `isMutation`: `MUTATORS.has(tool)` (any outcome, incl. permission-denied) or `Bash` with `BASH_WRITE`.
   - `commandAliases`: for each `<dir>/<ns>/<x>.md`, collect skill names from link targets matching the `routeOf` SKILL.md regex.
   - `gradeRoute`: first step with non-null route. PASS iff route ∈ expected, **or** route is a command whose alias set intersects expected; **and** `routeIdx < mutationIdx` (or no mutation). FAIL `why` ∈ `no-route` · `wrong-route:<tok>` · `mutation-first@<idx>`.
4. `tests/behavior/routing/routing-stats.cjs` (~120 lines): `aggregate` (ERROR rows excluded from n, counted in `errors`; `replicateAcc[r]` = acc over rows with `run === r`; `noise = max − min`; `byGate` keyed by case's `expected[0]`, read from a `cases` map arg; `flaky` = cases with 0 < per-case pass < runs) and `decide` per the plan's Accept rule (size/leak checked by caller, passed as booleans `sizeOk`, `leakOk`).
5. `tests/behavior/routing/routing-guard.cjs` (~80 lines): shingle = 6 consecutive `[a-z0-9]+` tokens after lower-casing.
6. `tests/behavior-routing.test.js` — synthetic streams built with the same `asst/use/res` helpers idiom as `tests/behavior-harness.test.js`. Cases (each a `test(...)`):
   - Read `cook/SKILL.md` then Edit → PASS; Edit then Read → FAIL `mutation-first`.
   - First route `debugging` with expected `[tdd]` → FAIL `wrong-route:debugging`.
   - `Bash cat .claude/skills/software/tdd/SKILL.md` counts as route `tdd`.
   - `Skill {skill:"ck:fix"}` with alias `ck:fix→{tdd}` and expected `[tdd]` → PASS.
   - Registry Read then cook Read → route `cook` (registry neutral).
   - Denied Write (`is_error: true`) still counts as mutation.
   - Bash `echo x > f` counts as mutation; `cat f` does not.
   - No route, no mutation → FAIL `no-route`.
   - `wilson(0,3).hi` ≈ 0.5615 (±0.001); `wilson(3,3).lo` ≈ 0.4385; `wilson(0,0)` = `{0,0,1}`.
   - `aggregate`: ERROR rows excluded; `noise` from replicate spread.
   - `decide`: train Δ ≤ noise → REVERT; train ok + test Δ = 0 → REVERT; train ok + test Δ > 0 + size/leak ok → ACCEPT; `sizeOk:false` → REVERT.
   - `leak`: surface containing a 6-word run from a prompt → non-empty; 5-word run → `[]`.

**Exit gate:** `node --test tests/behavior-routing.test.js` → all pass, 0 fail · `npm test` → 0 fail (no regression in `tests/behavior-harness.test.js`) · `wc -l tests/behavior/stats.cjs tests/behavior/routing/*.cjs` → every file < 200.
