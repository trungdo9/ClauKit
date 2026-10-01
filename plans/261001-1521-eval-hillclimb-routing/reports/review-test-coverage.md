# Review — TEST-COVERAGE axis — c1653ba..d891d76

Scope: `tests/behavior-routing.test.js` (21 tests), `tests/behavior-harness.test.js` (4 new), against phase-01 task 6 + phase-02 task 2.
Baseline: `node --test tests/behavior-routing.test.js` → pass 21 fail 0 · `node --test tests/behavior-harness.test.js` → pass 44 fail 0.
Method: 34 single-line mutants applied to a scratch copy (`$SCRATCH/mut`, repo untouched), relevant test file re-run per mutant. **10 killed, 24 survived.**

## Required-case checklist

| Phase | Required case | Present | Kills its mutant? |
|---|---|---|---|
| 01 | Read cook → Edit PASS; Edit → Read FAIL mutation-first | yes (:31, :39) | partial — single mutation only (M1) |
| 01 | wrong-route:debugging | yes (:45) | yes |
| 01 | Bash cat SKILL.md = route | yes (:51) | partial (M6) |
| 01 | Skill ck:fix + alias → PASS | yes (:59) | partial (M4) |
| 01 | registry neutral | yes (:73) | yes (last-route mutant killed) |
| 01 | denied Write = mutation | yes (:89) | yes |
| 01 | `echo x > f` mutation, `cat f` not | yes (:95) | yes |
| 01 | no-route | yes (:104) | yes |
| 01 | wilson values | yes (:126) | yes (clamp mutant killed) |
| 01 | aggregate ERROR excluded, noise | yes (:136) | partial (M7) |
| 01 | decide ×4 | yes (:162–185) | **boundary vacuous (H1, M3)** |
| 01 | leak 6 vs 5 words | yes (:187) | yes (lower-case mutant killed) |
| 02 | [1,1,0] NOT DISCRIMINATING, no SUPPORTED | yes (harness :460) | yes |
| 02 | [0,1,0] unchanged | yes (:447, unchanged) | yes |
| 02 | [0,0,0] CI + warning + credited | yes | yes |
| 02 | NONDISC_RATE=0.3 | yes | yes (env-ignored mutant killed) |

All 16 required cases exist and none is fully vacuous. The gaps are at boundaries and in the CLIs, which is what phases 04–06 actually call.

Mutation output (survivors marked):
```
SURVIVED [R] routeIdx==mutationIdx tie        SURVIVED [S] train > vs >=
SURVIVED [R] BASH_READER only cat             SURVIVED [S] floor base only
SURVIVED [R] BASH_READER unanchored           SURVIVED [S] floor cand only
SURVIVED [R] quote strip                      SURVIVED [S] noise first-last
SURVIVED [R] drop NotebookEdit                SURVIVED [S] runs incl ERROR-only
SURVIVED [R] last mutation                    SURVIVED [S] unknown gate / Map cases
SURVIVED [R] CLI exit always 0                SURVIVED [S] flaky incl always-fail
SURVIVED [R] CLI ignore --commands            SURVIVED [G] CLI prints prompt text
SURVIVED [R] only expected[0]                 SURVIVED [G] leak CLI exit 0
SURVIVED [R] alias every vs some              SURVIVED [G] CLI wrong field -> fail open
SURVIVED [R] commandAliases dir filter        SURVIVED [W] CLI k>n allowed
SURVIVED [H] rate >= vs >                     SURVIVED [H] warn >= vs >
killed: /dev/null exemption, anchor strip, last route, denied-Write(is_error), test >=,
        cost excl ERROR, no lowercase, no clamp, NONDISC_RATE env ignored
```

## Critical
None.

## High

**H1 — `decide` ACCEPTs when train Δ equals noise exactly. The test at the boundary passes for the wrong reason.** `tests/behavior/routing/routing-stats.cjs:194`, test `tests/behavior-routing.test.js:162`.
The test computes 0.6−0.5 = 0.09999…, which is below 0.1. So the `>=` mutant survives, and the rule that matters ("Δ ≤ noise ⇒ REVERT") is never exercised. Here is a real input that gets through:
```
decide({train:{acc:0.7,noise:0.7-0.6},test:{acc:0.5}}, {train:{acc:0.8,noise:0.7-0.6},test:{acc:0.6}}, OK)
→ {"verdict":"ACCEPT","trainDelta":0.10000000000000009, ...}
```
Accuracies are k/n, so on n=10 a Δ of 0.1 against a noise of 0.1 is the common case. Phase 06 would accept a round that sits exactly at the noise floor. Fix: compare with a tolerance, `trainDelta - floor > 1e-9` (or compare integer k counts), and add this exact input as a test.

**H2 — `--negative=0` now credits a scenario with zero evidence. This is a regression and no test covers it.** `tests/behavior/run-scenario.sh:369-392`.
```
HEAD:     ablated pass rate 0/0 … ✓ stub negative control OK … ── 1 scenario(s) genuinely verified
c1653ba:  ✗ stub NOT DISCRIMINATING … ── 0 scenario(s) genuinely verified
```
`0/0` gives NaN, so the `>=` test fails, `leaked==0` holds, and the scenario is credited. That breaks phase-02's goal of "never credited". Fix: reject `NEGATIVE_RUNS < 1` at argument parse (exit 1), and add a harness test for `--negative=0`.

**H3 — the `routing-guard.cjs leak` CLI has no test and fails open.** `tests/behavior/routing/routing-guard.cjs:243-248`.
The mutants "exit 0", "print shingle text" and "read `.text` not `.prompt`" all survive. At HEAD:
```
cases with key "text" (no prompt) → clean exit=0
empty cases.jsonl                 → clean exit=0
```
Phase 06 step 3 depends on this exit code alone. The "count only, never text" privacy contract is also not tested. Fix: run the CLI via `execFileSync` and assert exit 1 plus `/^LEAK: \d+ shingle\(s\)$/`, check that the output does not contain the prompt words, and assert exit ≠ 0 (or an error) when zero prompts are parsed.

**H4 — the `route-grade.cjs` CLI has no test.** `tests/behavior/routing/route-grade.cjs:104-118`.
The mutants "exit always 0" and "ignore `--commands`" survive. Phase 04 task 3 grades every row through this CLI using its `--commands work/.claude/commands` option and its stated exit codes 0/1/2. An always-PASS grader would corrupt every row in phases 04–06 without any test going red. Fix: one test that writes an events file to a temp directory, then asserts exit 0/1/2 and the JSON output, with `--commands` pointing at a temp directory that changes the verdict.

## Medium

- **M1** `route-grade.cjs:93`: nothing tests a run that mutates, routes, then mutates again. The `[...steps].reverse().find(isMutation)` mutant survives. Input: `Edit a`, `Read cook/SKILL.md`, `Edit b`. Correct result is FAIL `mutation-first@1`; under the mutant it is PASS. Add this as a test.
- **M2** `route-grade.cjs:100`: when the route and the mutation are the same step, the result is PASS. The spec says PASS requires `routeIdx < mutationIdx`. Input: `cat .claude/skills/software/cook/SKILL.md > notes.md` gives `{"verdict":"PASS","routeIdx":1,"mutationIdx":1}`. The code and spec disagree here and no test covers it, so a `<=` mutant survives. Decide which behaviour is intended and pin it with a test.
- **M3** `routing-stats.cjs:192`: the floor is `max(base, cand)` noise, but every decide test uses equal noises, so the base-only and cand-only mutants both survive. Input: base noise 0.05, cand noise 0.3, Δ 0.2 should REVERT.
- **M4** `route-grade.cjs:85-87`: no case has more than one expected token. The `expected[0]===route` and alias `every` mutants survive. Phase 03 builds `expected = a ∪ b`, so cases will have several tokens. Input: route `tdd`, expected `[debugging, tdd]`, should PASS.
- **M5** `run-scenario.sh:378`: the boundary rate of exactly `NONDISC_RATE` is not tested. The `>` mutant survives. Input: `--negative=4`, `[1,1,0,0]`. Correct output today is NOT DISCRIMINATING; under the mutant it would be SUPPORTED.
- **M6** `route-grade.cjs:26,47`: a quoted path (`cat ".../SKILL.md"`) and the `head`/`tail`/`sed -n` readers are not tested. Removing the quote strip, or keeping only `cat`, both survive, and the result becomes a false `no-route`. Models often quote paths.
- **M7** `routing-stats.cjs:152,157`: the noise metric is tested only with `[1,0.5,0]`, which is monotone, so a first-minus-last mutant survives. A replicate made up only of ERROR rows is not tested either. Use a non-monotone input such as `[0.5,1,0.5]`.

## Low

- **L1** `run-scenario.sh:321`: `NONDISC_RATE` is not validated. With `abc` and 3/3 leaked, the output reads "SUPPORTED … absent in 0 of 3". The scenario is not credited, but the label is wrong.
- **L2** `NotebookEdit` as a mutator is not tested; the mutant that drops it survives.
- **L3** `stats.cjs:284`: CLI validation (k>n, non-integer input) is not tested. The harness only covers the happy path.
- **L4** `aggregate`: a case missing from `cases` (the `'unknown'` gate), a `Map` passed as `cases`, and a case that always fails (not flaky) are all untested.
- **L5** The `BASH_READER` `^` anchor is untested (input: `git log -- skills/x/SKILL.md | head`). `commandAliases` with a non-directory entry at the top level is untested.

## Positive
- Every case from the phase files is present. Tests use real `parse()` streams, not mocks.
- The `/dev/null` and fd-dup exemptions, `#anchor` stripping, the `is_error` path for a denied Write, and ERROR-inclusive cost each kill their mutant.
- The phase-02 harness tests go through the real `run-scenario.sh` and `stats.cjs` CLI end to end.
- All source files are under 200 lines (34, 121, 58, 80).

## Unresolved questions
1. When the route and the mutation are the same step (`cat SKILL.md > f`), should that PASS (the code) or FAIL (the spec's `routeIdx < mutationIdx`)?
2. `ck:cook` aliases to `{cook, tdd, verify-plan, code-review}`, so invoking `ck:cook` satisfies any case that expects `tdd`. At HEAD, `--expected tdd` gives PASS. Is the command meant to act as a wildcard like this?
3. Should `--negative=0` be a usage error (my suggestion) or keep the old not-credited result?
