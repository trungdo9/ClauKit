#!/usr/bin/env node

/**
 * wt-new.js — provision a hardened git worktree (T1.6a).
 *
 * Usage: node scripts/ck/wt-new.cjs <id> [--base <ref>] [--dir <parent>]
 *                                       [--skip-install] [--skip-smoke]
 *
 * Guarantees (each earned by a real incident):
 *   - ABSOLUTE paths only; the worktree lands OUTSIDE the repo root, never
 *     nested inside it (a relative-path worktree + later rm -rf deleted
 *     nested directories).
 *   - REFUSES to install if node_modules resolves to a symlink — a frozen
 *     install through a symlink destroyed the shared target (exit-216).
 *   - Installs deps INSIDE the worktree (per-worktree store, no hoisting
 *     clobber).
 *   - SMOKE GATE: typecheck + test suite run on the untouched base commit;
 *     hard-fails if red. An agent must never start editing in an environment
 *     whose baseline is unproven — and a proven base is what makes
 *     "is this failure pre-existing?" answerable later (T2.2/G19).
 *     Full-suite result is CACHED per base-commit SHA (R8): the gate answers
 *     "is this base trustworthy?", a property of the commit, not the worktree.
 *
 * Overrides: CK_SMOKE_TYPECHECK / CK_SMOKE_TEST (shell commands) for
 * non-Node projects or custom gates.
 *
 * Exit: 0 provisioned + smoke green · 1 refused or smoke red
 */

const fs = require('fs');
const path = require('path');
const { git, assertRef, run, repoRoot, die, ok, info, detectPm, readJson } = require('./lib/common.cjs');

function parseArgs(argv) {
  const args = { flags: new Set(), opts: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' || a === '--dir') args.opts[a.slice(2)] = argv[++i];
    else if (a.startsWith('--')) args.flags.add(a.slice(2));
    else if (!args.id) args.id = a;
  }
  return args;
}

function smokeCachePath(mainRoot) {
  return path.join(mainRoot, '.claude', '.ck-smoke-cache.json');
}

function runStep(label, cmd, cwd) {
  info(`${label}: ${cmd}`);
  const res = run(cmd, [], { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  if (res.status !== 0) {
    const tail = ((res.stdout || '') + (res.stderr || '')).split('\n').slice(-30).join('\n');
    return { pass: false, tail };
  }
  return { pass: true };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.id || !/^[A-Za-z0-9._-]+$/.test(args.id)) {
    die('usage: wt-new.js <id> [--base <ref>] [--dir <parent>] [--skip-install] [--skip-smoke]\n  <id> must be [A-Za-z0-9._-]+');
  }

  const mainRoot = repoRoot();
  if (!mainRoot) die('not inside a git repository');

  // --- placement: absolute, outside the repo root ---
  // realpath both sides: the check compared lexical paths, so `--dir ~/wt` where
  // ~/wt is a symlink INTO the repo passed it and put the worktree physically
  // inside the working tree — the very shape whose later rm -rf deleted real
  // nested directories.
  const real = p => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
  const parent = real(path.resolve(args.opts.dir || path.dirname(mainRoot)));
  const realMain = real(mainRoot);
  const wtPath = path.join(parent, `${path.basename(mainRoot)}-wt-${args.id}`);
  if (!path.isAbsolute(wtPath)) die(`worktree path must be absolute, got: ${wtPath}`);
  if ((wtPath + path.sep).startsWith(realMain + path.sep)) {
    die(`refusing to nest the worktree inside the repo root.\n  repo:     ${mainRoot}\n  worktree: ${wtPath}\n  A nested worktree + a later rm -rf deleted real nested directories. Use --dir to pick a location outside the repo.`);
  }
  if (fs.existsSync(wtPath)) die(`target already exists: ${wtPath} (pick another id or run wt-clean.js first)`);

  // --base can arrive from a STATE.md line or a branch name; argv only.
  const base = assertRef(args.opts.base || 'HEAD', '--base');
  const baseSha = git(['rev-parse', base], { cwd: mainRoot });
  const branch = `wt/${args.id}`;

  // --- create ---
  const add = run('git', ['worktree', 'add', wtPath, '-b', branch, baseSha], { cwd: mainRoot });
  if (add.status !== 0) die(`git worktree add failed:\n${add.stderr}`);
  ok(`worktree created: ${wtPath} (branch ${branch}, base ${baseSha.slice(0, 7)})`);

  // --- install (inside the worktree only) ---
  const pmInfo = detectPm(wtPath);
  if (pmInfo && !args.flags.has('skip-install')) {
    const nm = path.join(wtPath, 'node_modules');
    if (fs.existsSync(nm) && fs.lstatSync(nm).isSymbolicLink()) {
      die(`node_modules in the new worktree is a SYMLINK (→ ${fs.readlinkSync(nm)}).\n  A frozen install through a symlink destroys the shared target (this exact shape caused the exit-216 toolchain loss).\n  Remove the symlink deliberately, or provision with --skip-install and install by hand.`);
    }
    if (pmInfo.pm === 'yarn') info('yarn detected — proceeding, but only npm/pnpm are first-class (R7)');
    info(`installing deps inside the worktree via: ${pmInfo.installCmd.join(' ')}`);
    const inst = run(pmInfo.installCmd[0], pmInfo.installCmd.slice(1), { cwd: wtPath, stdio: ['ignore', 'pipe', 'pipe'] });
    if (inst.status !== 0) {
      die(`dependency install failed in the worktree:\n${(inst.stderr || inst.stdout || '').split('\n').slice(-20).join('\n')}`);
    }
    ok('deps installed (per-worktree)');
  } else if (!pmInfo) {
    info('no package.json — skipping install');
  }

  // --- smoke gate on the untouched base commit ---
  if (args.flags.has('skip-smoke')) {
    console.log('⚠ SMOKE GATE SKIPPED (--skip-smoke) — this baseline is UNPROVEN. Do not treat later failures as regressions.');
  } else {
    const pkg = readJson(path.join(wtPath, 'package.json')) || {};
    const scripts = pkg.scripts || {};

    // typecheck: always (cheap)
    let typecheckCmd = process.env.CK_SMOKE_TYPECHECK
      || (scripts.typecheck && 'npm run typecheck')
      || (fs.existsSync(path.join(wtPath, 'tsconfig.json')) && 'npx tsc --noEmit')
      || null;
    if (typecheckCmd) {
      const t = runStep('smoke/typecheck', typecheckCmd, wtPath);
      if (!t.pass) die(`SMOKE GATE RED — typecheck fails on the untouched base commit ${baseSha.slice(0, 7)}.\n${t.tail}\nThe baseline is broken; fix the base (or pick another --base) before any agent edits here.`);
      ok('smoke/typecheck green');
    } else {
      info('smoke/typecheck: no typecheck detected — skipped');
    }

    // full suite: cached per base SHA (R8)
    const testCmd = process.env.CK_SMOKE_TEST || (scripts.test && 'npm test') || null;
    if (testCmd) {
      const cacheFile = smokeCachePath(mainRoot);
      const cache = readJson(cacheFile) || {};
      const key = `${baseSha}::${testCmd}`;
      if (cache[key] && cache[key].pass) {
        ok(`smoke/tests green (cached for base ${baseSha.slice(0, 7)}, run ${new Date(cache[key].ts).toISOString()})`);
      } else {
        const t = runStep('smoke/tests', testCmd, wtPath);
        if (!t.pass) die(`SMOKE GATE RED — the test suite fails on the untouched base commit ${baseSha.slice(0, 7)}.\n${t.tail}\nThe baseline is broken; an agent must not start editing here (failures would be indistinguishable from regressions).`);
        cache[key] = { pass: true, ts: Date.now() };
        try {
          fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
          fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
        } catch { /* cache is best-effort */ }
        ok('smoke/tests green (cached for this base SHA)');
      }
    } else {
      info('smoke/tests: no test script detected — skipped');
    }
  }

  console.log(`\nWORKTREE READY\n  path:   ${wtPath}\n  branch: ${branch}\n  base:   ${baseSha}\nRecord the path in plans/<plan>/STATE.md so a resume lands in the right tree.`);
}

main();
