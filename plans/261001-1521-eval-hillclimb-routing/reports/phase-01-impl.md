# Phase 01 impl report

Status: DONE

## Files
- M tests/behavior/tool-sequence.cjs:405-406 — exports + `MUTATORS, BASH_WRITE` only (git diff --stat: 1 line)
- A tests/behavior/stats.cjs (34 lines)
- A tests/behavior/routing/route-grade.cjs (117), routing-stats.cjs (80), routing-guard.cjs (58)
- A tests/behavior-routing.test.js (196; 21 tests; written first, red on missing modules, then implemented)

## Gate (verbatim tails)
`node --test tests/behavior-routing.test.js`: tests 21 · pass 21 · fail 0 · cancelled 0 · skipped 0
`npm test`: tests 403 · pass 402 · fail 0 · skipped 1  (baseline 381/0/1; +21 new tests)
`wc -l`: 34 stats.cjs · 117 route-grade.cjs · 58 routing-guard.cjs · 80 routing-stats.cjs · (test file 196) — all < 200
CLI smoke: `stats.cjs wilson 1 3` -> `p=0.33 lo=0.06 hi=0.79`; `route-grade.cjs` on Skill ck:cook stream -> PASS, exit 0.

## Deviations / decisions (brief silent)
1. `aggregate(rows, split, cases)` — cases arg is 3rd; accepts object or Map; unknown case -> gate `unknown`. Extra output field: none beyond brief + `lo/hi` already listed.
2. `decide(base, cand, {sizeOk, leakOk})` — base/cand = `{train, test}` aggregates. Train floor = max(base.train.noise, cand.train.noise) (brief: "train noise floor", ambiguous). Unset flag = not ok (REVERT).
3. `flaky` computed over scored (non-ERROR) rows per case.
4. gradeRoute with a mutation but no route -> `no-route` (not mutation-first). Wrong route checked before mutation order.
5. Bash route only for reader commands (cat|head|tail|sed -n|less|bat) and only SKILL.md paths (not command files), per brief; `echo <path>` is neutral (tested).
6. `routeOf` ignores `aliases` arg (kept for interface); alias resolution is in gradeRoute.
7. Extra exports: `skillOfPath` (route-grade). Leak CLI reads `.prompt` from each cases.jsonl line (field name assumed; phase 03 must match).
8. Pre-existing: BASH_WRITE matches `> /dev/null` redirects as mutations (tool-sequence.cjs:~398); not changed (file frozen).

## Unresolved
- cases.jsonl prompt field name: `prompt` assumed (phase 03).
- Should `> /dev/null` count as mutation? Currently yes; may cause false mutation-first in phase 04 runs.

## fix-1: /dev/null and fd-dup redirects are not mutations

route-grade.cjs only: `isMutation` strips `\d*>>?\s*/dev/null` and `\d*>&\d+` before BASH_WRITE (tool-sequence.cjs untouched). Test replaced/merged (Bash redirect test) to stay <200 lines; tests written first (red: 1 fail), then fix. Deviation 8 above is resolved; open question 2 closed.

```
$ node --test tests/behavior-routing.test.js
1..21
# tests 21
# suites 0
# pass 21
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 71.062337
$ npm test
1..403
# tests 403
# suites 0
# pass 402
# fail 0
# cancelled 0
# skipped 1
# todo 0
# duration_ms 45773.609444
$ wc -l ...
   34 tests/behavior/stats.cjs
  121 tests/behavior/routing/route-grade.cjs
   58 tests/behavior/routing/routing-guard.cjs
   80 tests/behavior/routing/routing-stats.cjs
  199 tests/behavior-routing.test.js
  492 total
```
