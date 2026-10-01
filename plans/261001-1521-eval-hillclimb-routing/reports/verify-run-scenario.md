# Verify F1 — run-scenario.sh --negative=0

Verdict: CONFIRMED (High). Regression from d891d76.

Parse: `--negative=*) NEGATIVE_RUNS="${a#*=}"` (line 326) — no validation; 0 accepted.
`seq 1 0` -> no ablated runs; leaked=0. `stats.cjs wilson 0 0` -> `p=0.00 lo=0.00 hi=1.00` exit 0.
HEAD line 378: node `0/0 >= 0.5` = NaN>=0 false -> exit 1 -> not NONDISC; leaked=0 -> "OK" branch.

Repro (stub run_one=0, `main stub --negative=0`):
c1653ba:
  ✗ stub NOT DISCRIMINATING — the behaviour survived every one of 0 ablated runs.
  ── 0 scenario(s) genuinely verified (with negative control)   main-exit=1
HEAD:
     ablated pass rate 0/0, Wilson 95% CI [0.00, 1.00]
  ✓ stub negative control OK — behaviour absent in all 0 ablated runs
  ── 1 scenario(s) genuinely verified (with negative control)   main-exit=0

Old result was accidentally right (0 -eq 0), still not intended; HEAD is a false success.
Also affects NEGATIVE_RUNS env var and non-numeric N (seq errors, N=abc -> same path).

Minimal fix: after arg loop in main (before `case "${ARGS[0]}"`):
  case "$NEGATIVE_RUNS" in ''|*[!0-9]*|0) echo "--negative=N needs integer N>=1" >&2; exit 1;; esac
(Also catches `--negative=` empty and env NEGATIVE_RUNS.)
