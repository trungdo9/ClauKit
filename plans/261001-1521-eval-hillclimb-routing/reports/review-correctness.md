# Review — CORRECTNESS · c1653ba..d891d76 (phases 01–02)

Scope: `tests/behavior/routing/{route-grade,routing-stats,routing-guard}.cjs`, `tests/behavior/stats.cjs`, `run-scenario.sh` `--negative` block, `tool-sequence.cjs` exports, dev-rules bullet.
Baseline: `node --test tests/behavior-routing.test.js tests/behavior-harness.test.js` → 65 pass / 0 fail. Each finding below was reproduced with `node -e` or a stubbed `main`. The stub pattern is the one `tests/behavior-harness.test.js` `sweep()` uses.

Counts: **Critical 0 · High 3 · Medium 4 · Low 3**

## High

**H1 — `--negative=0` now credits the gate (regression).** `tests/behavior/run-scenario.sh:369,378`
- Input: `main stub --negative=0`, gate run passes.
- What happens: `seq 1 0` runs nothing, so `leaked=0`. Then `0/0` = NaN, and `NaN >= 0.5` is false. Control falls to the else branch, which prints `✓ negative control OK — behaviour absent in all 0 ablated runs` and `── 1 scenario(s) genuinely verified`.
- Before the change, `[ 0 -eq 0 ]` sent the same input to NOT DISCRIMINATING with 0 verified.
- Result: the harness gives credit with zero evidence. That is the false success this harness exists to prevent.
- Same path, already broken before the change: `--negative=abc` is also credited, with CI `[, ]`.
- Fix: validate before the loop: `[[ "$NEGATIVE_RUNS" =~ ^[1-9][0-9]*$ ]] || { echo "--negative=N needs N>=1"; exit 1; }`.

**H2 — A failed route attempt grades PASS.** `route-grade.cjs:37-43,92`
- Input: `Skill {skill:"tdd"}` returns `is_error:true`, "Unknown skill: tdd". `gradeRoute(steps,["tdd"])` returns `PASS route=tdd`.
- `Read /w/.claude/skills/debugging/SKILL.md` returns "File does not exist." That also grades PASS for `[debugging]`.
- Why it matters: CLAUDE.md measured that grouped skills are **not** registered, so `Skill(tdd)` always fails in a `ck init` install. The model never receives the methodology, yet the case scores.
- Climb risk: an "Activate the tdd skill" wording in `skill-activation.md` would raise accuracy while routing nowhere.
- Mutations already count on intent, and that is correct. Routes should count only on success.
- Fix: in `gradeRoute`, use `steps.find(s => routeOf(s) !== null && !(s.result && s.result.is_error))`. Optionally record the failed attempt in `why`, e.g. `route-failed:<tok>`.

**H3 — The Bash reader misses most real SKILL.md reads.** `route-grade.cjs:26,45-49`
- `BASH_READER` only matches at the start of the command, and tokens are split on whitespace only.
- Inputs that return `null`:
  - `cd /w && cat .claude/skills/software/tdd/SKILL.md`
  - `cat …/tdd/SKILL.md;`
  - `head -50 …/SKILL.md|head`
  - `sed -n '51,141p' .claude/skills/software/git/SKILL.md; ls …`
- Measured on the user's non-`-tmp` transcripts: **35 of 42** Bash commands that read a SKILL.md with cat/head/tail/sed -n get `routeOf` = null.
- Effect: a correct route is scored `no-route`, `mutation-first`, or `wrong-route` (when a later route is wrong).
- Fix: split the command on `;|&&|\|\||\||\n`, test `BASH_READER` on each segment, and strip trailing `;|)` and quotes from tokens. The plan's "starts with" wording needs the same correction.

## Medium

**M1 — `isMutation` misses real writes and flags read-only commands.** `route-grade.cjs:55-62`, using `BASH_WRITE` from `tool-sequence.cjs:190`.
- Writes it misses (returns false): `echo x>f` (no space before `>`), `python3 -c "open('f','w')…"`, `node -e "require('fs').writeFileSync(…)"`, `perl -pi -e …`, `rm`, `mv`, `cp`, `git apply`, `git checkout -- f`, `echo x > /dev/null.bak` (the strip removes `> /dev/null`).
- Read-only commands it flags (returns true): `node -e "console.log(1 > 0)"`, `awk '$3 > 100' f`, `jq '.[]|select(.n > 1)'`, `grep -n " > " f`.
- Why it matters more here: Edit and Write are deliberately not allowed, so Bash is the model's fallback write path. Misses produce false PASS; the read-only hits produce false `mutation-first`.
- Fix: keep `tool-sequence.cjs` unchanged and use a routing-local `ROUTE_WRITE`:
  - add `\S>(?!&|=)`, `\b(rm|mv|cp|perl -p?i|git (apply|checkout --|restore))\b`, `writeFileSync|open\([^)]*['"][wa]`
  - strip quoted strings before matching
  - anchor the `/dev/null` strip with `(?=\s|$)`

**M2 — On an exact tie, float error turns the strict Δ > noise rule into ACCEPT.** `routing-stats.cjs:73`
- Input (m=28 cases/run): base `[11,11,11]`, cand `[13,13,16]`. Exact values: Δ = 9/84 = 3/28 = noise.
- Computed: `trainDelta = 0.10714285714285715 > 0.1071428571428571`, so the verdict is ACCEPT.
- Brute force over realistic grids: 224 of 1066 exact ties at m=28 and 292 of 1840 at m=42 return a spurious ACCEPT.
- Fix: `if (!(trainDelta > floor + 1e-9))`, or compare integer pass counts.

**M3 — A CLI crash exits 1, which reads as FAIL or LEAK.** `route-grade.cjs:113-117`, `routing-guard.cjs:43-47`
- `route-grade.cjs ev.jsonl --expected tdd --commands /nonexistent` exits 1, the same as FAIL. A missing events file also exits 1.
- `routing-guard.cjs leak` exits 1, the same as LEAK, on a corrupt `cases.jsonl` line or a missing file.
- Phase-04 consumes these exit codes ("exit 0 PASS / 1 FAIL"), and its goal is "ERROR never masquerades as FAIL".
- Fix: wrap `main` in try/catch, then `console.error(e.message); process.exit(2)`. Also document exit 2 = error in the phase-01 and phase-04 Interfaces.

**M4 — A built-in skill name collides with a kit skill directory.** `route-grade.cjs:37`
- `Skill {skill:"code-review"}` with expected `["code-review"]` returns PASS.
- Claude Code ships a built-in `code-review` skill, which is a different methodology from `skills/software/code-review/SKILL.md`. The grader cannot tell them apart.
- Fix: when a Skill token is not a registered kit skill and not in `aliases`, emit it with a prefix, e.g. `skill:code-review`. Alternatively, have phase 03 never label `code-review` as reachable through the Skill tool.

## Low

**L1 — `NONDISC_RATE` is not validated, and a failed `node` call fails silently.** `run-scenario.sh:375-393`
- `NONDISC_RATE=50` or `abc` with `[1,1,1]`: prints SUPPORTED, NOT DEMONSTRATED instead of NOT DISCRIMINATING. It is still `fail=1`, so nothing is falsely credited.
- `NONDISC_RATE=abc` with `[0,0,0]`: the ⚠ line is suppressed.
- When `stats.cjs` fails (simulated with `HARNESS_DIR=/nonexistent`): prints `CI [, ]`, suppresses ⚠, and still credits 0/3.
- Fix: check `[[ $NONDISC_RATE =~ ^(0(\.[0-9]+)?|1(\.0+)?)$ ]]` and `[ -n "$hi" ]`. Treat an empty CI as an infra failure.

**L2 — Leak tokeniser is ASCII-only.** `routing-guard.cjs:22`
- A Russian or Japanese prompt copied verbatim into the surface yields 0 shingles, so `leak` returns `[]`.
- Vietnamese and Norwegian are fragmented at diacritics but still detected (19 and 5 hits).
- Fix: `/[\p{L}\p{N}]+/gu` after `.normalize('NFC')`. The plan text says `[a-z0-9]+`, so a plan amendment is needed.

**L3 — phase-04 interface gap: `decide` has no PENDING-TEST outcome.**
- `decide` with an empty test aggregate returns `REVERT "test delta 0.000 <= 0"` (verified). `routing-report` must check `cand.test.n === 0` before calling it, or PENDING-TEST (exit 4) can never be reached.
- Signature drift: the phase-01 Interfaces block gives `aggregate(rows, split?)` and `decide(base, cand)`. The code has `aggregate(rows, split, cases)` and `decide({train,test}, {train,test}, {sizeOk, leakOk})`. Phase 04 should be updated to the real signatures.
- Noise floor: `decide` uses `max(base, cand)` noise, while the plan says "train noise floor". This is stricter and documented, but the plan text should be aligned.

## Verified OK
- Wilson formula is correct: `wilson(0,3).hi = 0.5615`, `wilson(3,3).lo = 0.4385`, n=0 gives `{0,0,1}`.
- No k=0 case lands on 0.50 after rounding (n=4 gives hi=0.49).
- Bash parsing of `ci` (`${ci#*lo=}` / `${ci##*hi=}`) is correct for the CLI's output format.
- Mutation ordering is strict and idx-based. A Bash command that both routes and writes in the same step is PASS, as intended.
- `commandAliases`: 27 `ck:` commands, 8 with an empty alias set. `ck:cook` maps to `{cook, tdd, verify-plan, code-review}`, so `Skill(ck:cook)` passes any of those four.

## Unresolved questions
1. Should a command route that aliases to 4 skills (`ck:cook`) pass for expected `[tdd]`? That is lenient by design. Confirm the labellers know it.
2. `aggregate` does not dedupe on `(case, run)`. Phase-04 appends rows to an existing label, so will re-runs ever duplicate a non-ERROR row?
3. Registry-sourced cases are paraphrases of registry text. If `skill-activation.md` already shares a 6-word shingle with one, the baseline leak check fails and every candidate is reverted. Should leak be run on the baseline surface in phase 05?
4. Is the dev-rules "≥ 5 runs" wording intentional, given 0/4 already excludes 0.5 (hi=0.49)?
