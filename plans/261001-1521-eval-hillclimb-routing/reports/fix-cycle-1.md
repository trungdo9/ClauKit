# Fix cycle 1 — phases 01-02 (not committed)

| Finding | Fixed | Where | Test |
|---|---|---|---|
| F1 NEGATIVE_RUNS 0/non-int | yes | tests/behavior/run-scenario.sh:~325 (after arg loop; also env + empty) | harness: `--negative=0/abc/""/-1/2.5 is a usage error…`, `NEGATIVE_RUNS=0 from the environment is rejected too` |
| F2 failed route neutral | yes | route-grade.cjs routeOf first line (`result.is_error` -> null) | cli: `a failed Skill call is neutral…`, `a failed route attempt with no recovery is no-route…`, `a failed Bash cat…` |
| F3 Bash segments | yes | route-grade.cjs BASH_SEGMENTS + routeOf Bash branch | cli: `Bash route reader sees past cd/&&/\|\|/;/\| …`, `…still ignores non-readers…` |
| M-a bare Skill name | yes | route-grade.cjs routeOf Skill branch (':' or aliased) | cli: `Skill with a bare name is not a route unless aliased…` |
| F4 grader CLI | yes | main try/catch -> exit 2; header documents 0/1/2 | cli: `route-grade CLI: PASS exits 0, FAIL exits 1…`, `--commands supplies the aliases…`, `usage error, missing events file, bad --commands dir -> exit 2` |
| F5 float tie | yes | routing-stats.cjs EPS=1e-9 on train (floor+EPS) and test | cli: `exact integer tie (base [0,0,0] vs cand [3,4,8]…)`, `float-above tie…`, `test delta float dust` |
| F6 leak CLI | yes | routing-guard.cjs main: 0 rows / non-string prompt -> 2; try/catch prints code/name only | cli: `clean exits 0, … exits 1 with a count only`, `fails closed (exit 2) on empty/wrong key/row w/o prompt`, `malformed row exits 2 and never echoes`, `missing input files exit 2 without a stack` |

TDD: new tests run first: 6 harness fails; 12/16 cli fails; then fixes. F5 tests re-verified failing with EPS removed.
Note: the "test delta float dust" test does not fail without the test-side EPS (only train-side is mutation-covered).
Note: M-a rule means alias-map keys that are bare (none exist; keys are ns:name) are the only bare route.

## Gate
`node --test tests/behavior-routing.test.js tests/behavior-routing-cli.test.js tests/behavior-harness.test.js` tail:
```
1..87
# tests 87
# suites 0
# pass 87
# fail 0
# cancelled 0
# skipped 0
# todo 0
```
`bash -n tests/behavior/run-scenario.sh` -> ok (no output).
`npm test` tail:
```
1..429
# tests 429
# pass 428
# fail 0
# cancelled 0
# skipped 1
```
`wc -l`:
```
  146 tests/behavior/routing/route-grade.cjs
   72 tests/behavior/routing/routing-guard.cjs
   86 tests/behavior/routing/routing-stats.cjs
  180 tests/behavior-routing-cli.test.js
  199 tests/behavior-routing.test.js
```
tool-sequence.cjs untouched.

## Unresolved
- F1 validates NEGATIVE_RUNS always (even without --negative); a junk env value now blocks all runs. Intended?
- Do phase 04-06 cases expect bare skill names via Skill tool? Now graded as no-route.
