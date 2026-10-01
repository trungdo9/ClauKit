#!/usr/bin/env node
/**
 * Wilson score interval — the routing eval's only statistics.
 *
 * Accuracy over a few dozen cases is a coarse number; a bare percentage invites
 * reading a one-case swing as a win. Wilson (not the normal approximation) because
 * it stays inside [0, 1] and is honest at k = 0 and k = n, which small suites hit.
 *
 *   node tests/behavior/stats.cjs wilson <k> <n>   ->  p=0.33 lo=0.06 hi=0.79
 */

/** 95 % interval by default (z = 1.96). n = 0 knows nothing: [0, 1]. */
function wilson(k, n, z = 1.96) {
  if (!n) return { p: 0, lo: 0, hi: 1 };
  const p = k / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { p, lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

function main() {
  const [cmd, k, n] = process.argv.slice(2);
  if (cmd !== 'wilson' || !Number.isInteger(+k) || !Number.isInteger(+n) || +k < 0 || +k > +n) {
    console.error('usage: stats.cjs wilson <k> <n>   (0 <= k <= n)');
    process.exit(2);
  }
  const w = wilson(+k, +n);
  console.log(`p=${w.p.toFixed(2)} lo=${w.lo.toFixed(2)} hi=${w.hi.toFixed(2)}`);
}

if (require.main === module) main();
module.exports = { wilson };
