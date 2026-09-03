#!/usr/bin/env node

/**
 * protected-branch-guard.js — PreToolUse hook (matcher: Bash). Refuses a git
 * command that would publish to a long-lived shared branch.
 *
 * WHY A HOOK, AND WHY THIS ONE DID NOT EXIST. Two separate sessions had a
 * delegated agent push to `staging` against an explicit instruction not to; one
 * pushed six commits and the code had already been pulled, so there was nothing
 * to revert. An audit of both kits afterwards found the reason: **no hook
 * anywhere refused a push.** `guard-destructive` denies `push --force` without a
 * lease and nothing else; `branch-guard` classifies `checkout` / `switch` /
 * `branch` only — its `MOVES_HEAD` set is `{create, switch, detach}`, so `push`
 * and `merge` never reach it. The whole defence was one line of prose in
 * `agents/git-manager.md` ("Only push if user explicitly requested"), and that
 * line was read and ignored twice. A shared branch is a mechanical invariant.
 *
 * WHAT IT REFUSES (each verified in scripts/verify-protected-branch-guard.js):
 *   1. An explicit protected destination — `git push origin staging`,
 *      `HEAD:staging`, `+staging`, `feature:refs/heads/main`.
 *   2. A DELETE of one — `git push --delete origin staging`, `git push origin :main`.
 *   3. An implicit one — bare `git push`, `git push origin`, `git push -u origin`
 *      or `git push origin HEAD` **while HEAD is standing on a protected
 *      branch**. This is the shape both real incidents took: nobody types the
 *      branch name, the agent is simply already on it.
 *   4. `--all` / `--mirror`, which carry every branch including the protected ones.
 *   5. `git merge <anything>` while HEAD is on a protected branch — the local
 *      half of "merged staging and pushed six commits".
 *
 * WHAT IT DELIBERATELY ALLOWS, because a guard that fires on these gets routed
 * around within a day:
 *   - `git merge origin/staging` from a feature branch. `rules/branching-rules.md`
 *     §3 Stage 1 instructs exactly that before opening a PR. Only the direction
 *     matters: what is refused is merging *while standing on* the shared branch.
 *   - `git push origin v1.4.0` and `--tags`. §3 Stage 3 tags releases this way;
 *     a tag ref is not a branch, and `refs/tags/...` is matched explicitly.
 *   - `git push --dry-run` — it writes nothing, and it is how you check a refspec.
 *   - `git rebase staging` / `git fetch` / `git pull` — none publishes anything.
 *
 * CONSENT is `CK_ALLOW_PROTECTED_PUSH=1`, either exported for the run or as an
 * assignment prefix on the one command (`CK_ALLOW_PROTECTED_PUSH=1 git push ...`),
 * which consents to that segment alone. Same mechanism as
 * `CK_ALLOW_DESTRUCTIVE` / `CK_AUTO_MODE`, for the same reason: a `--flag` on a
 * slash command never reaches a hook, an env var does.
 *
 * `CK_AUTO_MODE=1` does NOT bypass this, on purpose. Auto mode consents to
 * moving a shared HEAD — a local, recoverable act. Publishing to `staging` is
 * neither, and an unattended run is precisely the context both incidents
 * happened in.
 *
 * FAILS OPEN on: an unreadable payload, a segment it cannot tokenize, and a
 * current branch it cannot resolve (not a repo => the push would fail anyway).
 * This hook adds a refusal to a previously-allowed action, so a bug in it must
 * not become a new way for work to fail.
 *
 * MAINTENANCE: this file is shipped by BOTH kits — norskmat-claude-skills
 * (`.claude/hooks/protected-branch-guard.js`) and ClauKit
 * (`.claude/hooks/protected-branch-guard.cjs`) — and the two copies are
 * **byte-identical**; only the extension differs, which is each kit's own module
 * convention. A repo receives exactly one of them, never both.
 *
 * Keeping them identical needed one design choice: the two kits have different
 * doc trees (ClauKit ships no `rules/`), so the ladder pointer in the refusal is
 * RESOLVED AT RUNTIME from whichever doc the receiving project actually has —
 * see LADDER_DOCS. Hard-coding it would have been the one line that differed,
 * and a one-line difference is how two copies start drifting.
 *
 * Exit: 0 = allow · 2 = deny (reason on stderr, shown to the model)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * The default set is a SUPERSET spanning both estates the hook ships into:
 * `main`/`master` (PROD), `staging` (integration), `uat` (pre-prod soak) per
 * rules/branching-rules.md §2, plus `prod`/`production` for repos that name the
 * production branch outright. Override with a comma-separated
 * CK_PROTECTED_BRANCHES; an empty value disables the branch list (not the hook).
 */
const PROTECTED_DEFAULT = ['main', 'master', 'staging', 'uat', 'production', 'prod'];

function protectedBranches() {
  const raw = process.env.CK_PROTECTED_BRANCHES;
  if (raw === '') return new Set();
  if (typeof raw === 'string' && raw.trim() !== '') {
    return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
  }
  return new Set(PROTECTED_DEFAULT);
}

/**
 * Split a command line into pipeline/list segments, respecting quotes so that
 * `git commit -m "a && b"` stays one segment. Returns null when the quoting is
 * unbalanced — the caller then fails open rather than guessing at boundaries.
 */
function segments(command) {
  const out = [];
  let cur = '';
  let quote = null;
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (quote) {
      if (c === '\\' && quote === '"' && i + 1 < command.length) { cur += c + command[++i]; continue; }
      cur += c;
      if (c === quote) quote = null;
      continue;
    }
    if (c === '\'' || c === '"') { quote = c; cur += c; continue; }
    if (c === '\\' && i + 1 < command.length) { cur += c + command[++i]; continue; }
    if (c === ';' || c === '\n' || c === '&' || c === '|') {
      // `&&`, `||`, `|`, `;`, newline all end a segment; `&` alone backgrounds it.
      if ((c === '&' || c === '|') && command[i + 1] === c) i++;
      out.push(cur); cur = '';
      continue;
    }
    cur += c;
  }
  if (quote) return null;
  out.push(cur);
  return out.filter((s) => s.trim() !== '');
}

/** Quote-aware tokenizer for one segment. Strips the quotes it consumed. */
function tokenize(segment) {
  const out = [];
  let cur = '';
  let started = false;
  let quote = null;
  for (let i = 0; i < segment.length; i++) {
    const c = segment[i];
    if (quote) {
      if (c === '\\' && quote === '"' && i + 1 < segment.length) { cur += segment[++i]; continue; }
      if (c === quote) { quote = null; continue; }
      cur += c;
      continue;
    }
    if (c === '\'' || c === '"') { quote = c; started = true; continue; }
    if (c === '\\' && i + 1 < segment.length) { cur += segment[++i]; started = true; continue; }
    if (/\s/.test(c)) {
      if (started || cur !== '') { out.push(cur); cur = ''; started = false; }
      continue;
    }
    cur += c;
    started = true;
  }
  if (started || cur !== '') out.push(cur);
  return out;
}

const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;

/** Git global options that consume the NEXT token. */
const GIT_GLOBAL_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path', '--config-env']);
/** Push options that consume the NEXT token. */
const PUSH_FLAG_WITH_VALUE = new Set(['--repo', '-o', '--push-option', '--receive-pack', '--exec']);

/**
 * Parse one segment into { sub, positional, flags, env, dir } for a `git`
 * invocation, or null when the segment is not one. `dir` carries `-C <path>` so
 * the current branch is resolved in the tree the command actually targets.
 */
function parseGit(segment) {
  const tokens = tokenize(segment);
  let i = 0;
  const env = [];
  while (i < tokens.length && ASSIGNMENT.test(tokens[i])) env.push(tokens[i++]);
  if (i >= tokens.length) return null;

  // `git`, `/usr/bin/git`, `git.exe` — but not `github-cli` or `gitk`.
  const base = path.basename(tokens[i]).replace(/\.exe$/i, '');
  if (base !== 'git') return null;
  i++;

  let dir = null;
  while (i < tokens.length && tokens[i].startsWith('-')) {
    const t = tokens[i];
    if (t.indexOf('=') > 0) { i++; continue; }
    if (GIT_GLOBAL_WITH_VALUE.has(t)) {
      if (t === '-C') dir = tokens[i + 1] || null;
      i += 2;
      continue;
    }
    i++;
  }
  if (i >= tokens.length) return null;

  const sub = tokens[i++];
  const flags = [];
  const positional = [];
  for (; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith('-') && t !== '-') {
      flags.push(t);
      const name = t.includes('=') ? t.slice(0, t.indexOf('=')) : t;
      if (PUSH_FLAG_WITH_VALUE.has(name) && !t.includes('=')) i++;
      continue;
    }
    positional.push(t);
  }
  return { sub, flags, positional, env, dir };
}

const hasFlag = (flags, ...names) => flags.some((f) => {
  const name = f.includes('=') ? f.slice(0, f.indexOf('=')) : f;
  return names.includes(name);
});

/**
 * The branch a refspec lands on, or null when it does not land on one.
 * `+src:dst` -> dst · `src` -> same name on the remote · `refs/tags/x` -> not a branch.
 */
function destinationBranch(refspec) {
  const spec = refspec.replace(/^\+/, '');
  const colon = spec.lastIndexOf(':');
  if (colon === 0) return null;                            // `:dst` — handled by the caller
  let dst = colon > 0 ? spec.slice(colon + 1) : spec;
  if (dst === '') return null;                             // `src:` is not a branch destination
  if (/^refs\/tags\//.test(dst)) return null;
  dst = dst.replace(/^refs\/heads\//, '');
  if (/^refs\//.test(dst)) return null;                    // refs/notes, refs/meta, ...
  return dst;
}

function currentBranch(cwd) {
  try {
    const out = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out && out !== 'HEAD' ? out : null;
  } catch { return null; }
}

/**
 * Classify one parsed git invocation.
 * Returns null (allow) or { branch, why } describing the refusal.
 */
function assess(g, cwd, prot, resolveBranch = currentBranch) {
  if (prot.size === 0) return null;
  if (g.env.some((e) => e === 'CK_ALLOW_PROTECTED_PUSH=1')) return null;

  const base = g.dir ? path.resolve(cwd, g.dir) : cwd;

  if (g.sub === 'push') {
    if (hasFlag(g.flags, '--dry-run', '-n')) return null;

    if (hasFlag(g.flags, '--mirror')) {
      return { branch: [...prot].join('/'), why: '`--mirror` publishes every local ref, protected branches included' };
    }
    if (hasFlag(g.flags, '--all')) {
      return { branch: [...prot].join('/'), why: '`--all` publishes every local branch, protected ones included' };
    }

    const isDelete = hasFlag(g.flags, '--delete', '-d');
    // positional[0] is the remote when more than one is present. `git push staging`
    // (one arg) is ambiguous: git reads it as a REMOTE, so a branch of that name is
    // not a destination — but a repo with a remote literally named `staging` is
    // vanishingly rare next to the cost of missing this, so a lone positional is
    // checked as a refspec too.
    const args = g.positional.slice();
    const refspecs = args.length > 1 ? args.slice(1) : args;

    for (const spec of refspecs) {
      if (spec.startsWith(':')) {
        const dst = spec.slice(1).replace(/^refs\/heads\//, '');
        if (prot.has(dst)) return { branch: dst, why: 'that refspec DELETES the branch on the remote' };
        continue;
      }
      const dst = destinationBranch(spec);
      if (dst === null) continue;
      if (dst === 'HEAD') {
        const cur = resolveBranch(base);
        if (cur && prot.has(cur)) {
          return { branch: cur, why: '`HEAD` resolves to `' + cur + '`, which HEAD is currently standing on' };
        }
        continue;
      }
      if (prot.has(dst)) {
        return { branch: dst, why: isDelete ? 'that DELETES the branch on the remote' : 'the refspec names it as the destination' };
      }
    }

    // With NO refspec on the command line git falls back to the default one
    // (push.default), which publishes the branch HEAD is standing on. That is
    // the shape both real incidents took: nobody typed a branch name, the agent
    // was simply already on `staging`.
    //
    // The test is "were there explicit refspecs", NOT "did any of them resolve
    // to a branch" — an earlier draft used the latter and refused
    // `git push origin refs/tags/v1.8.0` from `main`, which is the release flow
    // in branching-rules §3 Stage 3. An explicit refspec suppresses the default
    // push entirely, so once one is present the scan above is the whole story.
    //
    // A single positional stays ambiguous and is therefore checked BOTH ways:
    // as a refspec (above, so `git push staging` is caught) and as "no refspec"
    // (here, so `git push origin` from `staging` is caught).
    //
    // `--tags` gets no exemption: with no explicit refspec it pushes tags *in
    // addition to* the default push, so on a protected branch it still
    // publishes that branch.
    const hasExplicitRefspec = args.length > 1;
    if (!hasExplicitRefspec) {
      const cur = resolveBranch(base);
      if (cur && prot.has(cur)) {
        return { branch: cur, why: 'no refspec was given, so this pushes the branch HEAD is standing on' };
      }
    }
    return null;
  }

  if (g.sub === 'merge') {
    if (hasFlag(g.flags, '--abort', '--continue', '--quit')) return null;
    const cur = resolveBranch(base);
    if (cur && prot.has(cur)) {
      return {
        branch: cur,
        why: 'HEAD is standing ON the protected branch, so this merges INTO it '
           + '(merging `origin/' + cur + '` INTO a feature branch is the allowed direction)',
      };
    }
    return null;
  }

  return null;
}

/**
 * Where the branch ladder is written down, per kit. The refusal cites the first
 * one that EXISTS in the receiving project, so the same file is correct in both
 * kits and in a project that has neither.
 */
const LADDER_DOCS = [
  ['.claude/rules/branching-rules.md', '.claude/rules/branching-rules.md §2-3'],
  ['.claude/skills/software/git/SKILL.md', '.claude/skills/software/git/SKILL.md § Branch Policy'],
  ['.claude/skills/git/SKILL.md', '.claude/skills/git/SKILL.md § Branch Policy'],
];

function ladderDoc(cwd) {
  for (const [rel, label] of LADDER_DOCS) {
    try { if (fs.existsSync(path.join(cwd, rel))) return label; } catch { /* keep looking */ }
  }
  return 'your branch-ladder doc (none of the known paths exist in this project)';
}

function deny(res, cwd) {
  const out = process.stderr;
  out.write('\nBLOCKED (protected branch): `' + res.branch + '` — ' + res.why + '.\n');
  out.write('\nThe shared branches are integration state; two sessions have already had an agent\n');
  out.write('publish to one unasked. Land the work on a ticket branch and open a PR:\n');
  out.write('  git switch -c <type>/<TICKET>   # or `git branch <name>` if HEAD is shared\n');
  out.write('  git push -u origin <that branch>\n');
  out.write('  /ck:git pr                      # PR into the next tier up\n');
  out.write('\nLadder + merge gates: ' + ladderDoc(cwd) + '\n');
  out.write('Deliberate override (this command only):  CK_ALLOW_PROTECTED_PUSH=1 <command>\n');
  out.write('CK_AUTO_MODE does NOT override this — an unattended run is where both incidents happened.\n\n');
}

function main() {
  if (process.env.CK_ALLOW_PROTECTED_PUSH === '1') process.exit(0);

  let payload;
  try { payload = JSON.parse(fs.readFileSync(0, 'utf-8')); } catch { process.exit(0); }
  const command = payload && payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !command.trim()) process.exit(0);
  if (!/\bgit\b/.test(command)) process.exit(0);

  const cwd = (payload && payload.cwd) || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const prot = protectedBranches();

  const segs = segments(command);
  if (!segs) process.exit(0);                     // unbalanced quoting — cannot see it

  for (const seg of segs) {
    let g;
    try { g = parseGit(seg); } catch { continue; }
    if (!g) continue;
    let res;
    try { res = assess(g, cwd, prot); } catch { continue; }
    if (res) { deny(res, cwd); process.exit(2); }
  }
  process.exit(0);
}

if (require.main === module) main();

module.exports = { segments, tokenize, parseGit, destinationBranch, assess, protectedBranches, currentBranch, ladderDoc };
