# Re-review fix cycle 1 (uncommitted tree vs d891d76)
Gate re-run: `node --test behavior-routing + behavior-routing-cli + behavior-harness` -> 87 pass / 0 fail.

## Closure
| Finding | Status | Evidence |
|---|---|---|
| F1 --negative=0 | CLOSED for 0/abc/""/-1/2.5/" 3"/env=0/env=abc (exit 1, "needs integer N>=1"). Residual `00`, see L1 | run-scenario.sh:335 |
| F2 failed route neutral | CLOSED | route-grade.cjs:48; tests 37-54 |
| F3 Bash segments | CLOSED for cd/&&/\|\|/;/\|/trailing `;`/quoted path; `cat a.txt \| grep x SKILL.md` -> null (correct). New false-route M1 |
| M-a bare Skill | CLOSED | route-grade.cjs:52 (`code-review`,`tdd` -> null; `ck:fix` ok; aliased bare ok) |
| F4 grader CLI | CLOSED | exit 0/1/2 tests; try/catch :133-140 |
| F5 float tie | CLOSED train side (EPS removal -> tests 7,8 fail). Test-side EPS unprotected, L2 | routing-stats.cjs:79-80 |
| F6 leak CLI | CLOSED | routing-guard.cjs:48-59; empty/wrong-key/mixed/malformed/missing -> 2, no prompt text echoed |

## New findings
### Medium
**M1 quoted separator splits inside a string -> false route (regression; HEAD returned null).** route-grade.cjs:30,62. Segments split on `|`/`;`/`&&` without quote awareness, so a reader word inside a quoted grep pattern/echo becomes a "segment start":
- `grep -E "head|cat" .claude/skills/software/tdd/SKILL.md` -> `"tdd"` (HEAD: null)
- `grep -n "a|cat" <SKILL.md>` -> `"tdd"`
- `echo "now; cat <SKILL.md>"` -> `"tdd"`; `echo 'x && head <SKILL.md>'` -> `"tdd"`
A grep over a skill file (not a methodology read) credits a route -> false PASS/misattribution. Inverse: `cat "a;b" <SKILL.md>` -> null.
Fix: strip quoted spans before splitting (`cmd.replace(/"[^"]*"|'[^']*'/g, m => m.replace(/[;&|\n]/g,' '))`), keep original tokens for path match; or tokenise with a quote-aware splitter. Add the 3 cases above as tests (current tests have none with separators inside quotes).

### Low
**L1 `--negative=00` (and `000`) bypasses F1.** run-scenario.sh:335 pattern rejects only literal `0`. `seq 1 00` -> 0 lines. Repro (stub run_one=0): `main stub --negative=00` -> "ablated pass rate 0/00 ... negative control OK — behaviour absent in all 00 ablated runs ... 1 scenario(s) genuinely verified", exit 0 = same false success. Fix: `''|*[!0-9]*|0*)` -> reject leading zero, or `[ "$((10#$N))" -ge 1 ]`.
**L2 "test delta float dust" test is vacuous.** behavior-routing-cli.test.js:109-113: `0.7-(0.7-0.6+0.6)` == 0 exactly (node: `0`), so REVERT regardless of EPS. Mutating routing-stats.cjs:80 `> EPS` -> `> 0` leaves 16/16 pass (verified, restored). Implementer noted it. Use a delta that is positive dust, e.g. test base 0.3, cand 0.1+0.2 (5.5e-17).
**L3 Bash failure neutralises a successful read.** route-grade.cjs:48 applies is_error to Bash. A compound whose later command fails (exit!=0 -> is_error true, output still contains the file) is skipped: `cat <SKILL.md> && test -f nope` with is_error -> null. Real instance in ~/.claude transcripts: `...; sed -n 1,80p .claude/skills/norskmat/azure-pipelines/SKILL.md; ls ...` -> "Exit code 2\n---\nname: azure-pipelines..." (file content returned, graded neutral). Direction is conservative (no-route/FAIL) but can also shift the first route to a later one. Consider exempting Bash from the is_error rule, or only for single-reader commands.
**L4 residual Bash prefixes still miss:** `for f in a; do cat <P>; done`, `if ..; then cat <P>`, `(cat <P>)`, `$(cat <P>)`, `X=1 cat <P>`, `timeout 5 cat <P>` -> null (all verified). Same family as F3 (false no-route); loop var paths (`f=...; sed -n 1,5p $f`) unfixable lexically. Acceptable if documented; reader regex could skip `do|then|else|\(|\{|\w+=\S*` prefixes.

## Test non-vacuity
- Harness F1 tests: pre-fix 6 fail (implementer); the doesNotMatch(/negative control OK/) assertions are meaningful.
- F5 exact-tie + float-above-tie: fail with EPS=0 (verified: tests 7,8 not ok). Non-vacuous.
- F2/F3/M-a, CLI exit-code tests: assert distinct statuses/outputs; non-vacuous. `||` token in BASH_SEGMENTS is redundant with `[;|\n]` (`||` splits into empty segments anyway); harmless.
- L2 above is the only vacuous one.

## Exit contracts
grader 0 PASS/1 FAIL/2 usage|ENOENT|bad --commands: tested. guard 0 clean/1 leak/2 error: tested. No stack/prompt text on stderr.

## Unresolved
- Does phase 04+ ever expect bare Skill names (now no-route unless aliased)? Implementer also asked; still open.
- Should junk NEGATIVE_RUNS env block runs that never use --negative? Currently yes (validated unconditionally); fail-fast is defensible.
