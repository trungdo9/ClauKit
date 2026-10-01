# Verify F5: routing-stats `decide` float tie -> ACCEPT

Verdict: CONFIRMED (High).

Plan Global Constraints "Accept rule": ACCEPT iff train delta > train noise floor (strict). A tie must REVERT.

Repro (real aggregate() + decide(), 28 train cases x 3 runs, n=84; integer counts):
- base per-run passes [0,0,0] -> acc 0, noise 0
- cand per-run passes [3,4,8] -> acc 15/84, noise (8-3)/28 = 5/28
- 15/84 == 5/28 exactly (tie)
- computed: trainDelta 0.17857142857142858, floor 0.17857142857142855 -> ACCEPT (should REVERT)
- (test split 5/10 -> 6/10 passed, so test>0 true)

Reachability: exhaustive at 28 cases, sorted triples: 45839 exact-tie configs, 11104 ACCEPT by float error. Real accuracies (k/n, noise = max-min of k/(n/3)) reach ties routinely.
Mirror example from claim: 0.8-0.7 = 0.10000000000000009 > 0.7-0.6 = 0.09999999999999998.

Test gap: existing `train delta within noise` test (0.6-0.5 = 0.0999..98 vs 0.1) passes only because float lands below; a `>=` mutant also passes it. No test exercises a float-above tie.

Impact: real. Accepts a change whose gain equals the noise the same surface shows against itself; ratchets prompt edits on noise (the plan's guard against exactly this).

Minimal fix (verified: example then REVERTs): compare with tolerance in decide():
  const EPS = 1e-9;
  if (!(trainDelta > floor + EPS)) return out('REVERT', ...);
Better: compare integer counts (cand.k/n differences scaled to common denominator). Add test with base [0,0,0]/cand [3,4,8] at 28 cases built through aggregate() -> REVERT; add a float-above tie via agg(0.8,..) vs agg(0.7,0.7-0.6... ) i.e. decide({train:{acc:0.7,noise:0.7-0.6}}, {train:{acc:0.8,noise:0}}) -> REVERT.

Unresolved: none. Reviewer's "224 of 1066" not re-derived (different tie enumeration); magnitude differs but defect is certain.
