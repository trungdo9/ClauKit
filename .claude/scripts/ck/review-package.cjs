#!/usr/bin/env node

/**
 * review-package.js — assemble a reviewer's diff package as ONE file (T3.2).
 *
 * Usage: node .claude/scripts/ck/review-package.cjs <BASE> [HEAD] [--plan <plan-dir>]
 *
 * Contents: `git log --oneline BASE..HEAD` + `git diff --stat` + `git diff -U10`,
 * the two diffs taken against the MERGE-BASE (`BASE...HEAD`, three dots).
 * Written to the plan's reports/ workspace (or the system temp dir without
 * --plan); the PATH is printed. Reviewers always get a diff FILE — an inlined
 * diff stays resident in the orchestrator's context forever.
 *
 * BASE is explicit by design: `HEAD~1` silently truncates a multi-commit
 * phase. Pass the phase's recorded base SHA (STATE.md `started (base <sha>)`).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { git, assertRef, die } = require('./lib/common.cjs');
const { resolveWorkspace } = require('./run-workspace.cjs');

function main() {
  const argv = process.argv.slice(2);
  const planIdx = argv.indexOf('--plan');
  let planDir = null;
  if (planIdx !== -1) {
    planDir = argv[planIdx + 1];
    argv.splice(planIdx, 2);
  }
  const [base, headArg] = argv;
  if (!base) die('usage: review-package.js <BASE> [HEAD] [--plan <plan-dir>]\n  BASE must be explicit — HEAD~1 silently truncates a multi-commit phase.');
  const head = headArg || 'HEAD';
  assertRef(base, 'BASE');
  assertRef(head, 'HEAD');

  let baseSha, headSha;
  try {
    baseSha = git(['rev-parse', '--short', base]);
    headSha = git(['rev-parse', '--short', head]);
  } catch (e) {
    die(`cannot resolve refs: ${e.message}`);
  }

  // baseSha/headSha are hex at this point, but they still travel as single
  // argv elements — no shell is involved anywhere in this file.
  //
  // Two ranges, not one. `log A..B` is the commits under review — correct with
  // two dots. `diff A..B` is not: it is a plain two-endpoint diff, so when BASE
  // is a branch that moved on after this work forked off, every commit someone
  // else landed there shows up inverted in the review. Three dots diffs against
  // the merge-base, which is the change actually under review. (Symmetric for
  // `log`, so the two forms are not interchangeable — keep both.)
  const logRange = `${baseSha}..${headSha}`;
  const diffRange = `${baseSha}...${headSha}`;
  const log = git(['log', '--oneline', logRange]);
  const stat = git(['diff', '--stat', diffRange]);
  const diff = git(['diff', '-U10', diffRange]);

  const body = [
    `# Review package — ${baseSha}...${headSha} (merge-base diff)`,
    '',
    '## Commits',
    '```',
    log || '(no commits in range)',
    '```',
    '',
    '## Stat',
    '```',
    stat || '(no changes)',
    '```',
    '',
    '## Diff (-U10)',
    '```diff',
    diff || '(empty diff)',
    '```',
    '',
  ].join('\n');

  const outDir = planDir ? resolveWorkspace(planDir) : fs.mkdtempSync(path.join(os.tmpdir(), 'ck-review-'));
  const out = path.join(outDir, `review-package-${baseSha}..${headSha}.md`);
  fs.writeFileSync(out, body);
  console.log(out);
}

if (require.main === module) main();
