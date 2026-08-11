#!/usr/bin/env node

/**
 * plan-lint.js — mechanical hand-over gate for a plan directory (CLI).
 *
 * Usage: node .claude/scripts/ck/plan-lint.cjs <plan-dir-or-plan.md> [--warn-only]
 * Exit:  0 = PASS · 1 = violations (gate closed) · 2 = usage / plan not found
 *
 * Why a script and not a prompt: the `planning` skill's self-review checklist was
 * attested by the same agent that wrote the plan, so nothing caught a plan that
 * shipped without the blocks the downstream machinery depends on. The checks and
 * their rationale live in `lib/plan-checks.cjs`.
 *
 * Attested vs verified: `## Plan Completeness` is the plan's explicit sign-off,
 * but four of its six items are re-checked from the file itself, so a ticked box
 * cannot stand in for the thing it claims. The two that stay attestation-only
 * (spec coverage, cross-phase type agreement) are reported as such rather than
 * implied to be machine-checked.
 */

const fs = require('fs');
const path = require('path');
const { die } = require('./lib/common.cjs');
const checks = require('./lib/plan-checks.cjs');

function planDirOf(arg) {
  let dir = path.resolve(arg);
  if (fs.existsSync(dir) && fs.statSync(dir).isFile()) dir = path.dirname(dir);
  return dir;
}

function main() {
  const argv = process.argv.slice(2);
  const warnOnly = argv.includes('--warn-only');
  const arg = argv.find(a => !a.startsWith('--'));
  if (!arg) die('usage: plan-lint.js <plan-dir-or-plan.md> [--warn-only]', 2);

  const dir = planDirOf(arg);
  const res = checks.lintPlan(dir);
  if (!res) die(`plan.md not found in ${dir}`, 2);

  const { violations, warnings, phases } = res;
  for (const w of warnings) console.log(`⚠ ${w}`);
  if (!violations.length) {
    console.log(`✓ plan-lint PASS — ${phases.length} phase(s), all blocks present`);
    console.log('  attested-only (not machine-checked): spec coverage · cross-phase type agreement');
    return;
  }
  console.error(`✗ plan-lint FAIL — ${violations.length} violation(s) in ${path.basename(dir)}`);
  for (const v of violations) console.error(`  [${v.check}] ${v.where} — ${v.msg}`);
  console.error('\nFix the plan (or send it back to `planner`) before any implementation. Contract: planning skill § Plan Rigor.');
  if (!warnOnly) process.exit(1);
}

if (require.main === module) main();

module.exports = { planDirOf, ...checks };
