# verify: F6 routing-guard `leak` CLI

Verdict: **CONFIRMED (High, part)**; Medium REFUTED as stated, but a new related defect found.

Repro (scratch in session scratchpad; surface = "alpha bravo charlie delta echo foxtrot golf hotel"):
| input | observed |
|---|---|
| empty cases.jsonl | `clean`, exit 0 (FAILS OPEN) |
| rows keyed `text` not `prompt` | `clean`, exit 0 (FAILS OPEN; `.filter(typeof string)` silently drops all) |
| rows with no `prompt` | same, exit 0 |
| missing cases file | uncaught ENOENT stack, exit 1 (fails CLOSED, not open as claimed) |
| missing surface file | ENOENT, exit 1 (closed) |
| malformed JSON row | SyntaxError, exit 1 (closed) BUT stderr echoes the raw row text (prompt text) |
| valid row w/ 7-word overlap | `LEAK: 2 shingle(s)`, exit 1 (works) |

Tests: tests/behavior-routing.test.js only unit-tests `leak()` (l.187-192); no CLI spawn, no exit-code or count-only test.

Medium (crash exit 1 = LEAK): fail-closed, acceptable for the gate, but crash and LEAK are indistinguishable, and the malformed-row crash violates "count only, never text" (stack prints the offending line; output lands in committed reports per file header). Real data/cases.jsonl does not exist yet, so key drift is untested.

Minimal fix (routing-guard.cjs main, `leak` branch):
- wrap in try/catch -> print `error: <err.code||err.name>` only (no message/stack), exit 2
- after parse: `if (prompts.length === 0) { console.error('error: 0 prompts read'); process.exit(2); }`
- count rows vs prompts: if any row lacks string `prompt` -> exit 2
- tests: spawnSync CLI for empty file, wrong key, missing file, malformed row (assert stderr/stdout contain no prompt text, status 2), leak (status 1, matches /^LEAK: \d+/), clean (0)
- phase-06 should treat exit !=0 as REVERT/stop (already true).
