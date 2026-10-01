# Plan verification — merged (3 groups)

Sources: [harness](plan-verification-harness.md) · [cli-data](plan-verification-cli-data.md) · [docs](plan-verification-docs.md)

| Group | Confirmed | Refuted | Unverifiable |
|---|---|---|---|
| harness H1–H9 | 9 | 0 | 0 (H4 sub-claim: real CLI `is_error` on deny → phase-04 probe) |
| cli-data K1–K7 | 4 | 2 (K1, K5 — partial) | 1 (K6) |
| docs D1–D9 | 8 | 1 (D9 — wording) | 0 |

## Refuted / unverifiable — load-bearing?

| Claim | Finding | Load-bearing | Resolution |
|---|---|---|---|
| K1 `--permission-mode default` | not a listed value (`acceptEdits auto bypassPermissions manual dontAsk plan`); accepted as hidden alias | phase 04 only | phase-04 probe picks a listed mode (`dontAsk` candidate); update Global Constraints run flags |
| K5 user `message.content` string | string in 352/3523 user lines; array in 3171 (mostly tool_result). command tags in string content (35/32) | phase 03 only | `mine-prompts.cjs` also reads `{type:"text"}` blocks of array content, skips `tool_result` |
| K6 `total_cost_usd` on `result` | no local evidence | phase 04 only | phase-04 probe (~$0.01) |
| D9 branch | conflict real: `skills/software/git/SKILL.md:78` vs phase-06:10 "commits on branch `feat/routing-eval-hillclimb`" | phase 06 only | user decision |
| H4 sub | real CLI deny ⇒ `is_error` unproven | phase 04 | existing probe (b) |

## Notes for implementers

- `tool-sequence.cjs:405-406` — `module.exports` spans 2 lines; append `MUTATORS, BASH_WRITE`.
- harness `--negative` stub: redefines `run_one` after sourcing; `nogateRcs` return 1 = leaked.
- `npm test` = `node --test tests/` → new `tests/behavior-routing.test.js` auto-picked.
- D3: command may link several skills (`cook` links 4) → alias = Set (plan already). `mk` commands have 0 skill links → empty alias.
- D4: 124 SKILL.md, no last-dir name collisions.
- Byte sizes now: `development-rules.md` 12277 · `skill-activation.md` 3686.
- D8: `docs/codebase-summary.md:257` "Test files" line.

**Verdict:** no REFUTED claim is load-bearing for phases 01–02. Phases 03/04/06 carry the corrections above.
