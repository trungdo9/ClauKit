/**
 * Frozen train/test split for the routing dataset.
 *
 * mulberry32 PRNG (seed 1729), stratified by expected[0], testFrac of each
 * stratum to test (rounded; a stratum of one stays train). `registry`
 * (synthetic) cases are always train. Strata are visited in sorted order and
 * members sorted by id before shuffling, so the result depends only on the
 * set of cases, not on input order.
 *
 * CLI: node split-cases.cjs [--file data/cases.jsonl] [--seed N] [--force]
 *   Rewrites `split` in place. Exit 2 if rows are already split and no
 *   --force: the split is frozen once phase 05 starts.
 */

const fs = require('node:fs');
const path = require('node:path');

function mulberry32(a) {
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @returns {object[]} new array, same order, each case with `split` set */
function split(cases, { seed = 1729, testFrac = 0.3 } = {}) {
  const rand = mulberry32(seed);
  const test = new Set();
  const strata = new Map();
  for (const c of cases) {
    if (c.source === 'registry') continue;
    const g = (c.expected && c.expected[0]) || '';
    if (!strata.has(g)) strata.set(g, []);
    strata.get(g).push(c.id);
  }
  for (const g of [...strata.keys()].sort()) {
    const ids = strata.get(g).sort();
    for (let i = ids.length - 1; i > 0; i--) {           // Fisher-Yates
      const j = Math.floor(rand() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    ids.slice(0, Math.round(ids.length * testFrac)).forEach(id => test.add(id));
  }
  return cases.map(c => ({ ...c, split: test.has(c.id) ? 'test' : 'train' }));
}

function arg(argv, name, dflt) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
}

function main(argv) {
  const file = arg(argv, '--file', path.join(__dirname, 'data', 'cases.jsonl'));
  const seed = Number(arg(argv, '--seed', 1729));
  let rows;
  try {
    rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  } catch (e) {
    console.error(`cannot read cases: ${e.code || 'parse error'}`);
    return 2;
  }
  if (rows.some(r => r.split) && !argv.includes('--force')) {
    console.error('already split; the split is frozen once phase 05 starts (use --force to redo)');
    return 2;
  }
  const out = split(rows, { seed });
  fs.writeFileSync(file, out.map(r => JSON.stringify(r)).join('\n') + '\n');
  const n = s => out.filter(r => r.split === s).length;
  const reg = out.filter(r => r.source === 'registry').length;
  console.log(`cases=${out.length} train=${n('train')} test=${n('test')} registry=${reg}`);
  if (n('train') && reg / n('train') > 0.2) console.log('warning: registry cases exceed 20% of train');
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { split, mulberry32 };
