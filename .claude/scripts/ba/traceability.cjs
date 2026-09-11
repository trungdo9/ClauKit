#!/usr/bin/env node

/**
 * traceability.cjs — CLI over the BA traceability spine (index / gap / validate).
 *
 * Usage: node .claude/scripts/ba/traceability.cjs <action> <project-dir> [--json]
 * Exit:  0 = clean · 1 = findings · 2 = usage error / project dir missing
 *
 * Why a script and not a prompt (`plan-lint.cjs`'s idiom): a model-generated
 * index does not round-trip byte-stably and cannot be gated by exit code —
 * the same reason `plan-lint` replaced the planning skill's self-attested
 * checklist with a mechanical one.
 *
 * Does not `require('../ck/lib/common.cjs')`: `ba` ships no `.claude/scripts/ck/`,
 * so that require resolves only in this repo and crashes in every `ba` install.
 */

const fs = require('fs');
const path = require('path');
const spine = require('./lib/spine-index.cjs');
const { buildIndex, findGaps, validate, writeIndex } = spine;

function die(msg, code) {
  console.error(`✗ ${msg}`);
  process.exit(code);
}

function main() {
  const [action, projectDir, ...rest] = process.argv.slice(2);
  const json = rest.includes('--json');
  const USAGE = 'usage: traceability.cjs <index|gap|validate> <project-dir> [--json]';

  if (!['index', 'gap', 'validate'].includes(action)) die(USAGE, 2);
  if (!projectDir || !fs.existsSync(projectDir)) die(`project dir not found: ${projectDir}`, 2);
  if (!fs.existsSync(path.join(projectDir, 'entities'))) {
    die(`no entities/ under ${projectDir} — expected <project-dir>/entities/*.md`, 2);
  }

  const { index, errors } = buildIndex(projectDir);

  if (action === 'index') {
    const gaps = findGaps(index);
    index.orphans = gaps.orphans;
    index.unsourced = gaps.unsourced;
    const out = writeIndex(projectDir, index);
    if (json) console.log(JSON.stringify(index));
    else console.log(`✓ indexed ${index.nodes.length} node(s), ${index.edges.length} edge(s), ${gaps.orphans.length} orphan(s) → ${path.basename(out)}`);
    return;
  }

  if (action === 'gap') {
    const { orphans, unsourced } = findGaps(index);
    if (json) {
      console.log(JSON.stringify({ orphans, unsourced }));
    } else if (!orphans.length && !unsourced.length) {
      console.log(`✓ no gaps — ${index.nodes.length} node(s) reachable`);
    } else {
      for (const o of orphans) console.log(`${o.id}  ${o.reason}  ${o.detail}`);
      for (const id of unsourced) console.log(`${id}  unsourced`);
    }
    process.exit(orphans.length || unsourced.length ? 1 : 0);
  }

  if (action === 'validate') {
    const violations = validate(index, errors);
    if (json) console.log(JSON.stringify(violations));
    else if (!violations.length) console.log('✓ validate clean');
    else for (const v of violations) console.log(`[${v.check}] ${v.file} — ${v.msg}`);
    process.exit(violations.length ? 1 : 0);
  }
}

if (require.main === module) main();

module.exports = { main, ...spine };
