# Phase 03 scrub fix

Defect: client terms replaced first -> `https://<CLIENT>.no/..` escaped URL_RE (excludes `<`); same for emails. 6+ digit ids leaked. `UTF-8` -> `PROJ-123`.

## Changes
- tests/behavior/routing/scrub-pii.cjs:61-71 `scrub()` order: URL -> email -> /tmp/claude-N -> secrets -> B64 -> home -> client terms -> IP -> ticket -> `\b\d{6,}\b` (`NUM_RE`, :44).
- `TMP_RE` (:48) -> `<TMP>`; runs BEFORE secrets: dir run like `-Users-bob-acmeapp` has mixed case+digits-free but B64 grabbed it (found by test, `<SECRET>` instead of `<TMP>`).
- `NOT_TICKET` allowlist (:46): UTF ISO SHA RFC TLS HTTP X; `ticket()` :58.
- Header comment updated to new order.
- New tests/behavior-routing-scrub.test.js (42 lines; data test file at 197, left untouched). 6 tests; RED first (5 fail; client-prose guard test passed as regression).

## Gate
- `node --test` data + scrub: tests 20, pass 20, fail 0
- `npm test`: tests 449, pass 448, fail 0, skipped 1
- wc -l: scrub-pii.cjs 103, scrub test 42, data test 197 (all < 200)

## Unresolved
- `\d{6,}` also hits 6+ digit numbers that are not PII (timestamps, byte counts); accepted over-scrub.
- Ticket allowlist is small; other acronyms (e.g. `MD-5`, `UTF`-like `IPV-6`) still become PROJ-123.
- Not rerun on real data (forbidden); orchestrator should re-run scrub CLI.
