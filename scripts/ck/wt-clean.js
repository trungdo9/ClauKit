#!/usr/bin/env node

/**
 * wt-clean.js — safe worktree teardown (T1.6a).
 *
 * Usage: node scripts/ck/wt-clean.js <path> [--force]
 *        node scripts/ck/wt-clean.js --list
 *
 * Rules:
 *   - `git worktree remove` with path validation, NEVER rm -rf (an rm -rf
 *     against a worktree corrupted git metadata and deleted nested dirs).
 *   - Refuses any path git does not know as a worktree, and the main
 *     worktree itself.
 *   - Reports reclaimed disk (~20GB of stale worktrees had accumulated).
 *   - --list shows every non-main worktree with its disk usage, so stale
 *     ones are visible instead of silently piling up.
 *
 * Exit: 0 removed (or listed) · 1 refused / failed
 */

const path = require('path');
const { run, repoRoot, worktrees, die, ok, dirSize, fmtBytes } = require('./lib/common');

function main() {
  const argv = process.argv.slice(2);
  const root = repoRoot();
  if (!root) die('not inside a git repository');

  const wts = worktrees(root);
  const main_ = wts[0];

  if (argv.includes('--list')) {
    const others = wts.slice(1);
    if (others.length === 0) {
      console.log('no linked worktrees');
      return;
    }
    let total = 0;
    for (const w of others) {
      const size = dirSize(w);
      total += size;
      console.log(`${fmtBytes(size).padStart(9)}  ${w}`);
    }
    console.log(`${fmtBytes(total).padStart(9)}  total reclaimable (via wt-clean.js <path>)`);
    return;
  }

  const target = argv.find(a => !a.startsWith('--'));
  if (!target) die('usage: wt-clean.js <path> [--force] | --list');
  const abs = path.resolve(target);

  if (abs === main_) die(`refusing to remove the MAIN worktree: ${abs}`);
  if (!wts.includes(abs)) {
    die(`refusing: '${abs}' is not a worktree of this repository.\n  Known worktrees:\n    ${wts.join('\n    ')}\n  (wt-clean never rm -rf's arbitrary paths — that shape deleted real nested directories.)`);
  }

  const size = dirSize(abs);
  const args = ['worktree', 'remove'];
  if (argv.includes('--force')) args.push('--force');
  args.push(abs);

  const res = run('git', args, { cwd: main_ });
  if (res.status !== 0) {
    die(`git worktree remove failed:\n${res.stderr}\n  If the worktree has uncommitted changes, commit/stash them by path first, or pass --force to discard.`);
  }
  run('git', ['worktree', 'prune'], { cwd: main_ });
  ok(`removed ${abs} — reclaimed ${fmtBytes(size)}`);
  const branch = `wt/${path.basename(abs).split('-wt-').pop()}`;
  console.log(`  note: branch '${branch}' (if it exists) was left in place — delete with \`git branch -d ${branch}\` once merged.`);
}

main();
