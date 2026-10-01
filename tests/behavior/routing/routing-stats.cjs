/**
 * Aggregation and the accept rule for the routing eval.
 *
 * Row shape (one per case x run): { case, split, run, verdict, route, why,
 * costUsd, model, surfaceSha }. verdict is PASS | FAIL | ERROR; ERROR is infra
 * (spend limit, auth, zero tool calls) and says nothing about routing, so it is
 * counted but kept out of n — scoring it as FAIL would punish the surface for an
 * outage.
 */

const { wilson } = require('../stats.cjs');

/** Gate of a case = its first expected route; `cases` is an object or Map keyed by case id. */
function gateOf(cases, id) {
  const c = cases instanceof Map ? cases.get(id) : cases && cases[id];
  return (c && c.expected && c.expected[0]) || 'unknown';
}

/**
 * Roll rows up for one split (all rows when `split` is omitted).
 * noise = max - min of the per-run accuracies: the spread the same surface shows
 * against itself, i.e. the smallest delta that could be real.
 * flaky = cases that neither always pass nor always fail across their scored runs.
 */
function aggregate(rows, split, cases) {
  const mine = rows.filter((r) => !split || r.split === split);
  const scored = mine.filter((r) => r.verdict !== 'ERROR');
  const k = scored.filter((r) => r.verdict === 'PASS').length;
  const w = wilson(k, scored.length);

  const runs = [...new Set(scored.map((r) => r.run))].sort((a, b) => a - b);
  const replicateAcc = runs.map((run) => {
    const rr = scored.filter((r) => r.run === run);
    return rr.filter((r) => r.verdict === 'PASS').length / rr.length;
  });
  const noise = replicateAcc.length ? Math.max(...replicateAcc) - Math.min(...replicateAcc) : 0;

  const byGate = {};
  const perCase = new Map();
  for (const r of scored) {
    const g = (byGate[gateOf(cases, r.case)] ||= { n: 0, k: 0, acc: 0 });
    const pc = perCase.get(r.case) || { n: 0, k: 0 };
    g.n++;
    pc.n++;
    if (r.verdict === 'PASS') { g.k++; pc.k++; }
    perCase.set(r.case, pc);
  }
  for (const g of Object.values(byGate)) g.acc = g.k / g.n;

  return {
    n: scored.length, k, acc: w.p, lo: w.lo, hi: w.hi, replicateAcc, noise,
    errors: mine.length - scored.length,
    costUsd: mine.reduce((s, r) => s + (r.costUsd || 0), 0),
    byGate,
    flaky: [...perCase.values()].filter((c) => c.k > 0 && c.k < c.n).length,
  };
}

/**
 * Accept rule. base/cand = { train, test } aggregates; flags are the caller's
 * checks (byte size, leak guard) — an unchecked flag is not ok.
 *
 * Train must beat the larger of the two noise floors (a candidate that is merely
 * noisier must not buy itself a lower bar); test must move up by any amount —
 * it is the held-out guard against fitting the train prompts, and is spent
 * sparingly, so it is a sign check rather than a second noise test.
 */
function decide(base, cand, { sizeOk, leakOk } = {}) {
  const trainDelta = cand.train.acc - base.train.acc;
  const testDelta = cand.test.acc - base.test.acc;
  const floor = Math.max(base.train.noise || 0, cand.train.noise || 0);
  const out = (verdict, why) => ({ verdict, why, trainDelta, testDelta });
  if (!(trainDelta > floor)) return out('REVERT', `train delta ${trainDelta.toFixed(3)} <= noise ${floor.toFixed(3)}`);
  if (!(testDelta > 0)) return out('REVERT', `test delta ${testDelta.toFixed(3)} <= 0`);
  if (sizeOk !== true) return out('REVERT', 'size rule');
  if (leakOk !== true) return out('REVERT', 'leak guard');
  return out('ACCEPT', 'train > noise, test > 0, size and leak ok');
}

module.exports = { aggregate, decide };
