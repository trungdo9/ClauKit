#!/usr/bin/env node

/**
 * root-commit-guard — PreToolUse hook (matcher: Bash).
 *
 * THE PROBLEM IT CLOSES. Hooks are loaded from the SESSION's project directory,
 * not from the directory a command happens to touch. In a workspace whose root is
 * a plain folder holding several git checkouts, a session opened at that root can
 * run `git -C <repo> commit` — and every hook that <repo> installed for itself is
 * simply absent from that run. The commit looks guarded (the root's own hooks fire)
 * while the repo's gates never see it.
 *
 * COMMIT WARNS, PUSH BLOCKS. Working from the root is a legitimate flow — it is how
 * cross-repo work gets done — so a commit gets a named warning and the person
 * decides. Push is the outward-facing, non-revertible step and is what the repo's
 * gates usually exist for, so it is refused with a one-line override. The warning
 * names the repo's actual hook files, read from its own `.claude/hooks/`, so it
 * stays true in any workspace rather than hardcoding one kit's hook names.
 *
 * INERT EVERYWHERE ELSE, by construction: it exits immediately when the session's
 * project directory is itself a git repo — which is every ordinary repo session.
 *
 * FAILS OPEN: an unparseable payload, an unreadable path, or any internal throw
 * exits 0. This hook adds a refusal to a previously-allowed action, so a bug in it
 * must not become a new way for work to fail.
 *
 * WHERE TO REGISTER IT. In `settings.json` of a WORKSPACE ROOT that is a plain folder
 * holding repo checkouts — that is the only place it can ever fire. Shipped unregistered
 * by design: installed into a repo it would exit on its first line for every Bash call,
 * which is cost without benefit.
 *
 * Override: ALLOW_ROOT_PUSH=1 (env, or as a command prefix).
 * Exit: 0 = allow (warnings on stderr) · 2 = deny.
 */

const fs = require('fs');
const path = require('path');

/** Split a shell line into segments that each run in their own right. */
function segments(command) {
  return command.split(/&&|\|\||;|\|/g).map(s => s.trim()).filter(Boolean);
}

/** `cd foo`, `cd "foo bar"` → the argument; otherwise null. */
function cdTarget(seg) {
  const m = seg.match(/^cd\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s*$/);
  return m ? (m[1] || m[2] || m[3]) : null;
}

/**
 * The git verb this segment performs, plus any `-C <dir>`. Only commit and push
 * are of interest; everything else is somebody else's gate.
 */
function gitOp(seg) {
  if (!/(^|\s)git(\s|$)/.test(seg)) return null;
  const dashC = seg.match(/\bgit\s+(?:-C\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s+)?/);
  const dir = dashC ? (dashC[1] || dashC[2] || dashC[3] || null) : null;
  if (/\bgit\s+(?:-C\s+\S+\s+)?(?:-\S+\s+)*commit\b/.test(seg)) return { verb: 'commit', dir };
  if (/\bgit\s+(?:-C\s+\S+\s+)?(?:-\S+\s+)*push\b/.test(seg)) return { verb: 'push', dir };
  return null;
}

/**
 * Nearest ancestor of `start` (inclusive) that holds a `.git`, searching no higher
 * than `stopAt`. Null when the path is not inside a repo — the normal case for a
 * command aimed at the workspace root itself, which must stay silent.
 */
function repoContaining(start, stopAt) {
  let dir = path.resolve(start);
  const ceiling = path.resolve(stopAt);
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    if (dir === ceiling || dir === path.dirname(dir)) return null;
    dir = path.dirname(dir);
  }
  return null;
}

/**
 * Walk the command, tracking the working directory across `cd` segments, and
 * return every commit/push that lands inside a repo below the workspace root.
 */
function analyze(command, cwd, workspaceRoot) {
  const hits = [];
  let here = cwd;
  for (const seg of segments(command)) {
    const cd = cdTarget(seg);
    if (cd) { here = path.resolve(here, cd); continue; }
    const op = gitOp(seg);
    if (!op) continue;
    const target = op.dir ? path.resolve(here, op.dir) : here;
    const repo = repoContaining(target, workspaceRoot);
    if (!repo || path.resolve(repo) === path.resolve(workspaceRoot)) continue;
    // Only a checkout NESTED IN this workspace is in scope. A repo elsewhere on
    // disk — a sibling clone, a kit source tree — was never going to load its hooks
    // from this session's root, so it is not this hook's business.
    const rel = path.relative(workspaceRoot, repo);
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) continue;
    hits.push({ verb: op.verb, repo: rel });
  }
  return hits;
}

/**
 * Hook files the target repo installed that this session does not load. Naming the
 * real files beats naming a kit's: it is correct in any workspace, and it says
 * nothing at all when the repo has no hooks of its own.
 */
function missingHooks(workspaceRoot, repoRel) {
  const list = d => { try { return fs.readdirSync(d).filter(f => /\.(c?js|sh|ps1)$/.test(f)); } catch { return []; } };
  const mine = new Set(list(path.join(workspaceRoot, '.claude', 'hooks')).map(f => f.replace(/\.\w+$/, '')));
  return list(path.join(workspaceRoot, repoRel, '.claude', 'hooks'))
    .map(f => f.replace(/\.\w+$/, ''))
    .filter(n => !mine.has(n))
    .filter((n, i, a) => a.indexOf(n) === i);
}

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0); // cannot see the command
  }
  const command = payload && payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !command.trim()) process.exit(0);

  const workspaceRoot = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();

  // A session whose project directory is itself a repo already loads that repo's
  // hooks. Nothing to say.
  try {
    if (fs.existsSync(path.join(workspaceRoot, '.git'))) process.exit(0);
  } catch {
    process.exit(0);
  }

  let hits;
  try {
    hits = analyze(command, payload.cwd || workspaceRoot, workspaceRoot);
  } catch {
    process.exit(0); // a bug here must not block Bash
  }
  if (!hits.length) process.exit(0);

  const consented = process.env.ALLOW_ROOT_PUSH === '1' || /\bALLOW_ROOT_PUSH=1\b/.test(command);
  const pushes = hits.filter(h => h.verb === 'push');

  if (pushes.length && !consented) {
    const repos = [...new Set(pushes.map(h => h.repo))];
    const absent = repos.flatMap(r => missingHooks(workspaceRoot, r));
    const names = absent.length ? ` — its own ${absent.join(', ')} never fire` : '';
    console.error(
      `BLOCKED (root session → ${repos.join(', ')}): a push from the workspace root loads the ROOT hook ` +
      `set, so that repo's gates do not see it${names}.\n` +
      `Do one of:\n` +
      `  • open a session with cwd inside the repo and push from there (the intended flow), or\n` +
      `  • re-run prefixed with ALLOW_ROOT_PUSH=1 if you have decided those gates do not apply.`
    );
    process.exit(2);
  }

  for (const repo of [...new Set(hits.filter(h => h.verb === 'commit').map(h => h.repo))]) {
    const absent = missingHooks(workspaceRoot, repo);
    console.error(
      `[root-commit-guard] committing into ${repo}/ from the workspace root` +
      (absent.length ? ` — its own hooks (${absent.join(', ')}) are NOT loaded in this session.` : '.') +
      ` The root's guards still ran. Open the session inside ${repo}/ when that repo's gates matter.`
    );
  }
  process.exit(0);
}

if (require.main === module) main();

module.exports = { segments, cdTarget, gitOp, repoContaining, analyze, missingHooks };
