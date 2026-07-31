#!/usr/bin/env node

/**
 * review-package.js — assemble a reviewer's diff package as ONE file (T3.2).
 *
 * Usage: node scripts/ck/review-package.js <BASE> [HEAD] [--plan <plan-dir>]
 *
 * Contents: `git log --oneline BASE..HEAD` + `git diff --stat` + `git diff -U10`.
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
const { sh, die } = require('./lib/common');
const { resolveWorkspace } = require('./run-workspace');

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

  let baseSha, headSha;
  try {
    baseSha = sh(`git rev-parse --short ${base}`);
    headSha = sh(`git rev-parse --short ${head}`);
  } catch (e) {
    die(`cannot resolve refs: ${e.message}`);
  }

  const log = sh(`git log --oneline ${baseSha}..${headSha}`);
  const stat = sh(`git diff --stat ${baseSha}..${headSha}`);
  const diff = sh(`git diff -U10 ${baseSha}..${headSha}`, { maxBuffer: 64 * 1024 * 1024 });

  const body = [
    `# Review package — ${baseSha}..${headSha}`,
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
