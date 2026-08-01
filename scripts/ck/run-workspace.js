#!/usr/bin/env node

/**
 * run-workspace.js — resolve/create the git-ignored per-plan artifact dir (T3.2).
 *
 * Usage: node scripts/ck/run-workspace.js <plan-dir-or-plan.md>
 *
 * Prints the absolute path of `plans/<plan>/reports/` (creating it if needed).
 * Subagent briefs, review packages, and reports go here — handed around as
 * FILE PATHS, never inlined into dispatches (anything pasted into a dispatch
 * stays resident in the orchestrator's context and is re-sent every turn).
 * The reports/ dir is intentionally NOT tracked (bulky agent output);
 * plan.md / phase-*.md / STATE.md are.
 */

const fs = require('fs');
const path = require('path');
const { die } = require('./lib/common');

function resolveWorkspace(arg) {
  let dir = path.resolve(arg);
  if (fs.existsSync(dir) && fs.statSync(dir).isFile()) dir = path.dirname(dir);
  if (!fs.existsSync(dir)) die(`plan directory not found: ${dir}`);
  const ws = path.join(dir, 'reports');
  fs.mkdirSync(ws, { recursive: true });
  return ws;
}

if (require.main === module) {
  const arg = process.argv[2];
  if (!arg) die('usage: run-workspace.js <plan-dir-or-plan.md>');
  console.log(resolveWorkspace(arg));
}

module.exports = { resolveWorkspace };
