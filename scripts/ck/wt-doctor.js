#!/usr/bin/env node

/**
 * wt-doctor.js — diagnose the three recurring worktree breakages (T1.6a).
 *
 * Usage: node scripts/ck/wt-doctor.js [worktree-path]   (default: cwd)
 *
 * Checks, each named after the incident that earned it:
 *   1. node_modules symlink health — broken or circular symlink (a shared
 *      symlink was destroyed by a frozen install → tsc/vitest exit 216)
 *   2. dependency version skew — declared range vs installed version
 *      (zod 3.x installed where ^4.x was required left FE tests unverifiable)
 *   3. missing env/API tokens — keys in .env.example absent from .env
 *      and the process env (dev server / API calls die midway otherwise)
 *
 * Exit: 0 healthy · 1 unhealthy (any check failed)
 */

const fs = require('fs');
const path = require('path');
const { repoRoot, die, readJson } = require('./lib/common');

let failures = 0;

function report(name, pass, detail) {
  console.log(`${pass ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures++;
}

/** Follow a symlink chain; classify as ok / broken / circular. */
function symlinkHealth(p) {
  const seen = new Set();
  let cur = p;
  for (let hops = 0; hops < 40; hops++) {
    let st;
    try {
      st = fs.lstatSync(cur);
    } catch {
      return { state: 'broken', at: cur };
    }
    if (!st.isSymbolicLink()) return { state: 'ok', target: cur };
    const key = path.resolve(cur);
    if (seen.has(key)) return { state: 'circular', at: cur };
    seen.add(key);
    cur = path.resolve(path.dirname(cur), fs.readlinkSync(cur));
  }
  return { state: 'circular', at: cur };
}

/** Minimal range check: exact / ^major / ~major.minor / >=. */
function satisfies(installed, range) {
  const v = installed.split('.').map(Number);
  const clean = range.trim();
  const num = clean.replace(/^[\^~>=<\s]+/, '').split('.').map(x => parseInt(x, 10) || 0);
  if (clean.startsWith('^')) return num[0] === 0 ? v[0] === 0 && v[1] === num[1] : v[0] === num[0] && (v[1] > num[1] || (v[1] === num[1] && v[2] >= num[2]) || v[1] >= num[1]);
  if (clean.startsWith('~')) return v[0] === num[0] && v[1] === num[1];
  if (clean.startsWith('>=')) return v[0] > num[0] || (v[0] === num[0] && v[1] >= num[1]);
  if (/^\d/.test(clean)) return installed === clean;
  return true; // *, workspace:, file:, git: … — out of scope
}

function main() {
  const target = path.resolve(process.argv[2] || process.cwd());
  const root = repoRoot(target);
  if (!root) die(`not a git worktree: ${target}`);

  console.log(`wt-doctor: ${root}\n`);

  // 1 — node_modules symlink health
  const nm = path.join(root, 'node_modules');
  if (!fs.existsSync(path.join(root, 'package.json'))) {
    report('node_modules', true, 'no package.json — n/a');
  } else if (!fs.existsSync(nm) && !isLink(nm)) {
    report('node_modules', false, 'missing — deps not installed (run the wt-new install, inside this worktree)');
  } else {
    const h = symlinkHealth(nm);
    if (h.state === 'ok' && !fs.lstatSync(nm).isSymbolicLink()) {
      report('node_modules', true, 'real directory (per-worktree)');
    } else if (h.state === 'ok') {
      report('node_modules', false, `SYMLINK → ${fs.readlinkSync(nm)} — node_modules is NOT shared between worktrees; a frozen install here destroys the shared target (exit-216 incident)`);
    } else {
      report('node_modules', false, `${h.state.toUpperCase()} symlink at ${h.at}`);
    }
  }

  // 2 — dependency version skew
  const pkg = readJson(path.join(root, 'package.json'));
  if (pkg) {
    const declared = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const skews = [];
    for (const [name, range] of Object.entries(declared)) {
      const ipkg = readJson(path.join(root, 'node_modules', name, 'package.json'));
      if (!ipkg || !ipkg.version) continue; // missing handled by check 1
      if (!satisfies(ipkg.version, range)) skews.push(`${name}: installed ${ipkg.version}, declared ${range}`);
    }
    if (skews.length) {
      report('dependency versions', false, `skew detected (declared vs installed):\n    ${skews.slice(0, 10).join('\n    ')}`);
    } else {
      report('dependency versions', true, `${Object.keys(declared).length} deps match declared ranges`);
    }
  }

  // 3 — env keys
  const example = path.join(root, '.env.example');
  if (fs.existsSync(example)) {
    const keysOf = f => new Set(
      fs.readFileSync(f, 'utf-8').split('\n')
        .map(l => l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/))
        .filter(Boolean).map(m => m[1])
    );
    const wanted = keysOf(example);
    const have = fs.existsSync(path.join(root, '.env')) ? keysOf(path.join(root, '.env')) : new Set();
    const missing = [...wanted].filter(k => !have.has(k) && !(k in process.env));
    if (missing.length) {
      report('env/API tokens', false, `missing keys (in .env.example, absent from .env and env): ${missing.join(', ')}`);
    } else {
      report('env/API tokens', true, `${wanted.size} keys covered`);
    }
  } else {
    report('env/API tokens', true, 'no .env.example — n/a');
  }

  console.log(failures === 0 ? '\nHEALTHY' : `\nUNHEALTHY — ${failures} check(s) failed. Do not start editing here; fix the environment first.`);
  process.exit(failures === 0 ? 0 : 1);
}

function isLink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

main();
