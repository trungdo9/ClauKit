#!/usr/bin/env node

/**
 * traceability.cjs — CLI over the BA traceability spine (index / gap / validate / compose).
 *
 * Usage: node .claude/scripts/ba/traceability.cjs <action> <project-dir> [--json]
 * Exit:  0 = clean · 1 = findings · 2 = usage error / project dir missing
 *
 * `compose` (ruling R7) renders the two committed deliverables (D-11) — see
 * `./lib/spine-compose.cjs`. It is a script, not an LLM re-render, because a
 * committed deliverable must be byte-stable over an unchanged entity tree.
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
  const force = rest.includes('--force');
  const USAGE = 'usage: traceability.cjs <index|gap|validate|compose|changelog|deliver> <project-dir> [--json] [--force]';

  if (!['index', 'gap', 'validate', 'compose', 'changelog', 'deliver'].includes(action)) die(USAGE, 2);
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

  if (action === 'compose') {
    const { compose } = require('./lib/spine-compose.cjs');
    const result = compose(projectDir);
    if (!result.ok) {
      if (json) console.log(JSON.stringify(result.violations));
      else for (const v of result.violations) console.log(`[${v.check}] ${v.file} — ${v.msg}`);
      process.exit(1);
    }
    if (json) console.log(JSON.stringify({ files: result.files.map((f) => path.basename(f)) }));
    else console.log(`✓ composed ${result.files.map((f) => path.basename(f)).join(', ')}`);

    // Warn about git-ignored deliverables
    const deliverables = ['SRS-001.md', 'PRD-001.md'];
    for (const d of result.files) {
      const dname = path.basename(d);
      if (deliverables.includes(dname)) {
        const ignoreResult = require('child_process').spawnSync('git', ['check-ignore', '-q', d], { cwd: projectDir });
        if (ignoreResult.status === 0) {
          console.warn(`⚠ ${d} is git-ignored in this project — add \`!plans/**/deliverables/*.md\` to .gitignore or the signed document will not be committed (D-11)`);
        }
      }
    }
    return;
  }

  if (action === 'changelog') {
    const { changelog } = spine;
    const rows = changelog(index);
    if (json) {
      console.log(JSON.stringify(rows));
    } else if (!rows.length) {
      console.log('✓ no change requests');
    } else {
      const maxIdLen = Math.max(...rows.map((r) => r.id.length));
      const maxStatusLen = Math.max(...rows.map((r) => r.status.length));
      for (const r of rows) {
        const id = r.id.padEnd(maxIdLen);
        const status = r.status.padEnd(maxStatusLen);
        const parents = r.parents.join(', ');
        console.log(`${id}  ${status}  ${parents}  ${r.impact}`);
      }
    }
    process.exit(0);
  }

  if (action === 'deliver') {
    const { deliver, DELIVERABLES } = require('./lib/spine-deliver.cjs');
    const what = rest[0];
    if (!what || !DELIVERABLES[what] && what !== 'all') {
      die('usage: traceability.cjs deliver <project-dir> [scope|uat|acceptance|release-notes|golive|handover|all] [--force] [--json]', 2);
    }
    const result = deliver(projectDir, what, { force, json });
    if (!result.ok) {
      if (!result.violations || result.violations.length === 0) {
        for (const s of result.skipped || []) console.error(`⊘ ${s} exists (class: owned) — pass --force to re-seed`);
      } else {
        for (const v of result.violations) console.error(`[${v.check}] ${v.file} — ${v.msg}`);
      }
      process.exit(1);
    }
    if (json) {
      console.log(JSON.stringify({ files: (result.files || []).map((f) => path.basename(f)) }));
    } else {
      if (result.files && result.files.length > 0) console.log(`✓ delivered ${result.files.map((f) => path.basename(f)).join(', ')}`);
      if (result.skipped && result.skipped.length > 0) {
        console.error(`⊘ skipped ${result.skipped.map((f) => path.basename(f)).join(', ')}`);
      }
    }
    process.exit(result.ok && (!result.skipped || result.skipped.length === 0) ? 0 : 1);
  }
}

if (require.main === module) main();

module.exports = { main, ...spine };
