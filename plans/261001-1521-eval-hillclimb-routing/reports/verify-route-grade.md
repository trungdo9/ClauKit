# Adversarial verify: route-grade.cjs (phase 01 task 3)
Repro: scratch scripts in session scratchpad; synthetic streams via parse() + gradeRoute(). Real-transcript counts only, no text printed.

## F2 failed route attempt grades PASS -- CONFIRMED (High)
- `Skill{skill:"tdd"}` + tool_result is_error "Unknown skill: tdd", then Edit -> `{"verdict":"PASS","route":"tdd","routeIdx":1,"mutationIdx":2,"why":"ok"}`
- Read of nonexistent .../tdd/SKILL.md (is_error) then Edit -> same PASS.
- Inverse also: failed `Skill{ck:nonexistent}` then valid Read of tdd SKILL.md -> FAIL `wrong-route:ck:nonexistent` (recovery punished).
- Load-bearing: CLAUDE.md measured table: grouped skills (depth>1) are NOT registered, so bare `Skill("tdd")` always errors in a real install. Only `ck:*`/`ba:*` command names register. A prompt wording "Activate the tdd skill" makes the model call Skill("tdd") -> error -> graded PASS with zero methodology read. The climb would reward exactly the wording CLAUDE.md says is wrong. Real transcripts: 8 Skill calls, 1 is_error (small n, but mechanism is real).
- Spec (phase-01 line ~46) says "`Skill` tool -> input.skill" with no outcome check, so code matches spec; spec is unsound.
- Fix: in routeOf, `if (step.result && step.result.is_error) return null;` for Skill/Read/Bash route (failed attempt = neutral; mutation check unchanged). Add 2 tests. Optional: for Skill, require name to contain ':' or be in aliases keys.

## F3 Bash reader prefix-only -- CONFIRMED in part (High); one sub-claim REFUTED
- MISS: `cd x && cat .claude/skills/software/tdd/SKILL.md` -> no-route. `cat <path>;` -> no-route (token `<path>;` fails `$` anchor). `grep -n x <path>` -> no-route (correct, not a read).
- REFUTED sub-claim: `cat "<path>"` (quoted) PASSES -- quotes are stripped per token. Also `cat p | head`, `cat p 2>&1`, `sed -n '1,50p' p` pass.
- Recount over ~/.claude/projects/*/*.jsonl (68 files): Bash commands with a reader word applied to a SKILL.md: 46; routeOf hits 7, misses 39 (85%; claim was 35/42 = 83%, same direction/magnitude, my regex slightly looser). Of the 39 misses, 27 start with `cd`, 12 other (`f=...;` assignments, `for`, `set`, `;`-terminated, etc).
- Caveat: those are interactive sessions with varying cwd; headless eval runs in a fixture dir may cd less. Still, miss -> FAIL no-route (false negative) or, worse, misattributes the first route to a later one.
- Spec says "starts with" so matches spec; spec is brittle.
- Fix: drop the start-anchor; tokenise with /[\s;&|()<>]+/ and strip quotes; require a reader word earlier in same pipeline segment: split command on /&&|\|\||;|\n/ then test BASH_READER per segment, then tokens per segment.

## F4 CLI untested -- CONFIRMED (High-ish; Medium in practice)
- `grep -rn route-grade tests/` -> only `tests/behavior-routing.test.js:14` (a require of 4 functions). No spawnSync/execFile of the CLI anywhere. `main`, `process.exit(PASS?0:1)`, `--expected` parsing, `--commands` default dir are unexercised.
- Manual: PASS -> exit 0, wrong expected -> exit 1; command-alias via `--commands <dir>` -> exit 0, without it (default dir) -> exit 1. So behaviour is currently right, but mutants "always exit 0" and "ignore --commands (use default)" would survive the suite.
- Fix: 3 spawnSync tests in behavior-routing.test.js using a tmp events.jsonl: expected hit -> status 0; miss -> status 1 and JSON verdict FAIL; alias hit only with `--commands tmpdir`; no args -> status 2.

## M-a Skill("code-review") vs kit skill -- judged: REAL but Medium-Low
- Skill("code-review") passes with expected [code-review]. The harness built-in `code-review` (listed in the session skill list) shares the name with kit `skills/software/code-review` (grouped, unregistered). So a call lands on the harness skill, not the kit's methodology; the grader cannot tell. For an eval of kit routing that is a false PASS, same family as F2 (route token with no proof the kit file was read).
- Fix: ignore `Skill` tokens lacking a ':' unless alias-map contains them (the F2 optional fix covers this); or add a collision list. Only matters for cases whose expected includes `code-review` or other harness-colliding names (`simplify`, `security-review`, `init`).

## Unresolved
- Do phases 04-06 cases expect bare skill names via Skill tool, or only via Read/command? If only Read/command, F2 Skill part narrows to the is_error check.
