#!/usr/bin/env node

/**
 * guard-destructive.js - PreToolUse guard (matcher: Bash), runs after scout-block.
 *
 * Two tiers (T1.2 / G5):
 *
 * TIER A — irreversible loss. Always deny; the message names the safe
 * alternative. Shapes: `git stash -u`, `git reset --hard`, `git clean -fd[x]`,
 * whole-tree checkout/restore, `git push --force` without lease, SQL writes
 * through a DB client (DELETE FROM / TRUNCATE / DROP TABLE / UPDATE sans
 * WHERE), `npm ci`/`pnpm i --frozen-lockfile` onto a node_modules symlink,
 * and `rm -rf` of a path git knows as a worktree.
 *
 * TIER B — over-broad staging (`git add -A|.|-u`, `git commit -a[m]`, bare
 * `git stash`). Denies ONLY when the file-claims registry (T1.2b) proves
 * another LIVE session owns a dirty file the op would sweep up. The denial
 * prints the conflict table and the exact scoped command to run instead.
 *
 * Escape hatch: CK_ALLOW_DESTRUCTIVE=1 (env or command prefix) — deliberate
 * one-off override; the denial message says how.
 *
 * Failure posture: unparseable payload or a Tier-B evaluation error FAILS
 * OPEN (a guard that breaks the session is worse than the risk it prevents).
 * Tier A matching is pure string analysis and cannot meaningfully error.
 *
 * Exit codes: 0 = allowed · 2 = denied (stderr is fed back to the model)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const DB_CLIENTS = new Set(['psql', 'mysql', 'mariadb', 'sqlite3', 'sqlcmd', 'mssql-cli', 'clickhouse-client']);

// ---------- tokenization (shared shape with scout-block.js) ----------

// Anything that executes its stdin. A heredoc feeding one of these is CODE.
const SHELL_INTERPRETERS = new Set(['bash', 'sh', 'zsh', 'ksh', 'dash', 'ash', 'busybox', 'python', 'python3', 'node', 'perl', 'ruby', 'php']);

/**
 * Resolve heredocs by WHO CONSUMES THEM — the previous blanket strip was a
 * bypass of the entire guard.
 *
 * History, because both mistakes are instructive:
 *   1. Newlines were not segment separators, so `git status\ngit reset --hard`
 *      was only checked up to line 1. Fixed by splitting on newlines.
 *   2. That made every line of a heredoc parse as a command, so a commit
 *      message *describing* a destructive command was denied. Fixed by
 *      stripping heredoc bodies wholesale.
 *   3. Which meant `bash <<'EOF' … git reset --hard … EOF` — the body of which
 *      the shell genuinely executes — became invisible. Tier A, gone.
 *
 * The distinction is the consumer, not the syntax:
 *   - `git commit -F - <<'MSG'` / `cat > f <<EOF`  → body is data  → strip
 *   - `bash <<EOF` / `python <<EOF`                → body is code  → keep as
 *     separate lines, so each is analysed as its own command
 *   - `psql <<SQL`                                 → body is code, but the SQL
 *     rules need the client and the statement in ONE segment → inline it
 */
function resolveHeredocs(command) {
  return command.replace(
    /(^|[|&;\r\n])([^\r\n]*?)<<-?\s*(['"]?)([A-Za-z_]\w*)\3([^\r\n]*)\r?\n([\s\S]*?)^[ \t]*\4[ \t]*$/gm,
    (_m, sep, before, _q, _delim, after, body) => {
      const owner = binOf(tokens(before));
      const head = `${sep}${before}${after}`;
      if (SHELL_INTERPRETERS.has(owner)) return `${head}\n${body}`;      // each line is a command
      if (DB_CLIENTS.has(owner)) return `${head} ${body.replace(/\s+/g, ' ')}`; // same segment as the client
      return `${head} <<HEREDOC`;                                        // data: cat, git commit -F, tee…
    }
  );
}

/**
 * Split a command into independently-executed pieces.
 *
 * Newlines and a bare `&` are separators too — without them a multi-line
 * command was only ever checked up to its first `git` invocation, so
 * `git status\ngit reset --hard` passed Tier A while the single-line form was
 * denied. Multi-line Bash payloads are routine, which made that the widest
 * hole in the guard.
 */
function segments(command) {
  return resolveHeredocs(command)
    .split(/[|&;\r\n]+/)
    .map(s => s.replace(/^[()\s]+|[()\s]+$/g, '').trim())  // `(cd sub && git reset --hard)` — parens are not part of the argv
    .filter(Boolean);
}

function tokens(segment) {
  return segment.split(/\s+/).filter(Boolean).map(t => t.replace(/^['"]+|['"]+$/g, ''));
}

/** First token that is not an env assignment / sudo / command wrapper. */
function binOf(toks) {
  for (const t of toks) {
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(t)) continue;
    if (t === 'sudo' || t === 'command' || t === 'exec' || t === 'nohup' || t === 'time') continue;
    return t.split('/').pop();
  }
  return '';
}

/** Args after the git subcommand, with `git -C <path>` style globals skipped. */
function gitParts(toks) {
  const i = toks.findIndex(t => t.split('/').pop() === 'git');
  if (i === -1) return null;
  let j = i + 1;
  while (j < toks.length && toks[j].startsWith('-')) {
    j += (toks[j] === '-C' || toks[j] === '-c' || toks[j] === '--git-dir' || toks[j] === '--work-tree') ? 2 : 1;
  }
  if (j >= toks.length) return null;
  return { sub: toks[j], args: toks.slice(j + 1) };
}

/**
 * Does any short-flag cluster carry `letter`?
 *
 * The test was case-insensitive while the membership check was not, so `-Rf`
 * — the POSIX/BSD spelling `man rm` shows first — slipped past `rm -rf`.
 */
function hasCombinedFlag(args, letter) {
  return args.some(a => /^-[a-z]+$/i.test(a) && a.toLowerCase().includes(letter.toLowerCase()));
}

/** Short cluster OR any of the long spellings. */
function hasFlag(args, letter, ...longs) {
  return hasCombinedFlag(args, letter) || args.some(a => longs.includes(a));
}

/** Pathspecs that mean "the whole tree", whatever the current directory is. */
const WHOLE_TREE = new Set(['.', ':/', '*', './', ':/*', '"*"', "'*'"]);

/**
 * A `VAR=1 cmd` prefix binds to THAT command only — bash does not carry it
 * across `&&`. So the escape hatch exempts the segment it prefixes and nothing
 * else; `CK_ALLOW_DESTRUCTIVE=1 npm ci && git reset --hard` still denies the
 * reset, which is what the user meant and what the old whole-string match got
 * wrong.
 */
function isOverridden(segment) {
  return /^CK_ALLOW_DESTRUCTIVE=1(\s|$)/.test(segment.trim());
}

// ---------- Tier A ----------

function tierA(command, cwd) {
  for (const seg of segments(command)) {
    if (isOverridden(seg)) continue;
    const toks = tokens(seg);
    const bin = binOf(toks);
    const git = gitParts(toks);

    if (git) {
      const { sub, args } = git;
      // `-a`/`--all` is `-u` plus git-ignored files — strictly worse, and it was
      // unguarded because the check looked only for `u`.
      if (sub === 'stash' && (hasFlag(args, 'u', '--include-untracked') || hasFlag(args, 'a', '--all'))) {
        return 'git stash -u/-a destroys untracked (and with -a, git-ignored) files no other session can recover — this is what deleted a real node_modules. Use `git stash push -- <paths>` scoped to YOUR files.';
      }
      if (sub === 'reset' && args.includes('--hard')) {
        return 'git reset --hard discards other sessions\' uncommitted work tree-wide. Roll back YOUR files with `git restore --source=HEAD -- <paths>`, or commit/stash by path first.';
      }
      // `-f` alone already deletes untracked FILES throughout the tree (it only
      // spares untracked directories), so requiring -d/-x here left the loss
      // path open. Any forced, non-dry-run clean is Tier A.
      if (sub === 'clean' && !hasFlag(args, 'n', '--dry-run')
          && hasFlag(args, 'f', '--force')) {
        return 'git clean -f deletes untracked files tree-wide (with -d directories, with -x git-ignored files too) — including other sessions\' scratch and un-ignored ledgers. Preview with `git clean -n`, then delete explicit paths only.';
      }
      // Three whole-tree shapes, not one: the literal `.`, the repo-root
      // pathspec `:/` (and a bare glob), and `checkout -f`, which discards
      // every uncommitted change on its way to another branch.
      if ((sub === 'checkout' || sub === 'restore')
          && (args.some(a => WHOLE_TREE.has(a)) || (sub === 'checkout' && hasFlag(args, 'f', '--force')))
          && !(sub === 'restore' && args.includes('--staged') && !args.includes('--worktree'))) {
        const how = sub === 'restore' ? 'restore --source=HEAD -- <paths>' : 'checkout -- <paths>';
        return `whole-tree ${sub} overwrites every session's uncommitted edits (\`.\`, \`:/\`, a bare glob and \`-f\` are all whole-tree). Scope to explicit paths: \`git ${how}\`.`;
      }
      if (sub === 'push' && hasFlag(args, 'f', '--force')
          && !args.some(a => a.startsWith('--force-with-lease'))) {
        return 'git push --force can erase remote commits someone else already built on. Use `git push --force-with-lease`.';
      }
    }

    if ((bin === 'npm' && toks.includes('ci'))
        || (bin === 'pnpm' && (toks.includes('install') || toks.includes('i')) && toks.some(t => t.startsWith('--frozen')))) {
      try {
        const nm = path.resolve(cwd || process.cwd(), 'node_modules');
        if (fs.existsSync(nm) && fs.lstatSync(nm).isSymbolicLink()) {
          return 'node_modules here is a SYMLINK — a clean install would destroy the shared target (the exit-216 incident). Install inside the worktree via scripts/ck/wt-new, or replace the symlink deliberately first.';
        }
      } catch { /* fs race: fall through */ }
    }

    if (bin === 'rm' && hasFlag(toks, 'r', '--recursive', '-R')) {
      const here = cwd || process.cwd();
      const home = os.homedir();
      const targets = toks.slice(1).filter(t => !t.startsWith('-'));
      const wts = worktreePaths(cwd);
      for (const t of targets) {
        // `~` and `$HOME` are shell-expanded, so they never reached path.resolve
        // and `rm -rf ~` read as a relative path that matched nothing.
        const expanded = t.replace(/^~(?=$|\/)/, home).replace(/^\$HOME(?=$|\/)/, home).replace(/^\$\{HOME\}(?=$|\/)/, home);
        const abs = path.resolve(here, expanded);
        if (abs === path.parse(abs).root) {
          return `rm -r on the filesystem root (${abs}). Nothing in this repo requires that.`;
        }
        if (abs === home) {
          return `rm -r on your home directory (${abs}). Delete an explicit subdirectory instead.`;
        }
        // `startsWith(abs + sep)` produced '//' at the root and matched nothing;
        // path.relative gives containment that is correct everywhere.
        const contains = w => {
          const rel = path.relative(abs, w);
          return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
        };
        if (wts.some(contains)) {
          return `'${t}' is (or contains) a git worktree. rm -rf on a worktree corrupts git metadata and has deleted nested directories here. Use \`git worktree remove <path>\` (scripts/ck/wt-clean).`;
        }
      }
    }
  }

  // SQL writes: judged PER SEGMENT, so the DB client and the destructive
  // statement must be the same command. Matching the client in one segment and
  // the SQL anywhere in the string denied
  // `psql -c "SELECT 1" && echo "DELETE FROM is scary"` — a false positive of
  // exactly the kind that trains people to disable the guard.
  for (const seg of segments(command)) {
    if (isOverridden(seg) || !DB_CLIENTS.has(binOf(tokens(seg)))) continue;
    if (/\bDELETE\s+FROM\b/i.test(seg) || /\bTRUNCATE\b/i.test(seg)
        || /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b/i.test(seg)) {
      return 'destructive SQL through a DB client. Route it through the database safe-writes protocol (skills/software/database — dry-run SELECT with row count, paired rollback script in the same commit, explicit approval).';
    }
    if (/\bUPDATE\s+\S+\s+SET\b/i.test(seg) && !/\bWHERE\b/i.test(seg)) {
      return 'UPDATE without WHERE through a DB client mutates every row. Add a WHERE guard and route through the database safe-writes protocol (dry-run SELECT first).';
    }
    // Specified as Tier A and never implemented — and it is the one DB incident
    // in the evidence base: a 32-row backfill INSERT that proved invalid, with
    // no rollback because the query tool blocked DELETE.
    if (/\bINSERT\s+INTO\b/i.test(seg)) {
      return 'bulk INSERT through a DB client has no undo when the query tool blocks DELETE — a 32-row backfill here had to be reversed by hand. Ship it as a migration/script with a paired rollback in the same commit (skills/software/database safe-writes).';
    }
  }

  return null;
}

// ---------- Tier B ----------

/**
 * Identify an over-broad staging op AND what it can actually reach.
 *
 * The reach matters: denying on any foreign claim produced false denials that
 * the guard's own message then contradicted — `git add -u` cannot stage an
 * untracked file, and `git add .` in `docs/` cannot reach `src/`. Each of those
 * pushes the user toward `git add :/`, which is the shape we least want.
 *
 * Returns { shape, tracked, rootRelative } or null.
 *   tracked=true      → only already-tracked modifications are swept
 *   rootRelative=false→ scoped to the current directory, not the whole tree
 */
function tierBShape(command) {
  for (const seg of segments(command)) {
    if (isOverridden(seg)) continue;
    const git = gitParts(tokens(seg));
    if (!git) continue;
    const { sub, args } = git;
    if (sub === 'add') {
      const wholeTree = args.includes('-A') || args.includes('--all') || args.includes(':/') || args.includes(':/*');
      const cwdScoped = args.some(a => a === '.' || a === './' || a === '*');
      const updateOnly = args.includes('-u') || args.includes('--update');
      if (wholeTree || cwdScoped || updateOnly) {
        return {
          shape: `git add ${args.join(' ')}`,
          tracked: updateOnly && !wholeTree && !cwdScoped,
          rootRelative: wholeTree || updateOnly,   // `-u` with no pathspec is repo-wide
        };
      }
    }
    if (sub === 'commit' && (args.includes('--all') || args.some(a => /^-[a-z]*a[a-z]*$/.test(a)))) {
      // `-a` stages tracked modifications only, repo-wide.
      return { shape: `git commit ${args.join(' ')}`, tracked: true, rootRelative: true };
    }
    if (sub === 'stash') {
      const sub2 = args.find(a => !a.startsWith('-'));
      const isPushForm = sub2 === undefined || sub2 === 'push';
      const hasPathspec = args.includes('--') || (sub2 === 'push' && args.slice(args.indexOf('push') + 1).some(a => !a.startsWith('-')));
      // A bare stash takes tracked modifications; -u/-a is Tier A already.
      if (isPushForm && !hasPathspec) return { shape: 'git stash (no pathspec)', tracked: true, rootRelative: true };
    }
  }
  return null;
}

function worktreePaths(cwd) {
  try {
    const out = execSync('git worktree list --porcelain', {
      cwd: cwd || process.cwd(), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split('\n').filter(l => l.startsWith('worktree ')).map(l => path.resolve(l.slice(9).trim()));
  } catch {
    return [];
  }
}

function noticeOnce(session, message) {
  try {
    const marker = path.join(os.tmpdir(), `ck-guard-notice-${(session || 'unknown').replace(/[^\w-]/g, '')}`);
    if (fs.existsSync(marker)) return;
    fs.writeFileSync(marker, String(Date.now()));
    console.error(message);
  } catch { /* notice is best-effort */ }
}

/** Returns null (allow) or a denial message. May print a one-time notice. */
function tierB(command, cwd, session) {
  const found = tierBShape(command);
  if (!found) return null;
  const { shape, tracked, rootRelative } = found;

  try {
    const fc = require(path.join(__dirname, 'file-claims.js'));
    const root = fc.worktreeRoot(cwd);
    if (!root) return null;
    if (!fs.existsSync(fc.claimsPath(root))) {
      noticeOnce(session, `[guard-destructive] NOTE: '${shape}' allowed — the file-claims registry has no entries in this worktree, so there is no other live session to protect. This notice prints once per session.`);
      return null;
    }
    const claims = fc.readClaims(root);
    const mine = claims.filter(c => c.session === session);

    // Keep only the foreign files this particular op could actually stage.
    let untracked = new Set();
    if (tracked) {
      try { untracked = fc.untrackedFiles(root); } catch { /* fall back to no filtering */ }
    }
    const prefix = rootRelative ? '' : path.relative(root, path.resolve(cwd || root)).split(path.sep).filter(Boolean).join('/');
    const reachable = c =>
      !(tracked && untracked.has(c.file))
      && (prefix === '' || c.file === prefix || c.file.startsWith(prefix + '/'));

    const foreign = claims.filter(c => c.session !== session).filter(reachable);
    if (foreign.length === 0) return null;

    const bySession = new Map();
    for (const c of foreign) {
      if (!bySession.has(c.session)) bySession.set(c.session, []);
      bySession.get(c.session).push(c);
    }
    const lines = [`BLOCKED: \`${shape}\` would sweep up ${foreign.length} file(s) owned by other live session(s):`];
    for (const [sess, cs] of bySession) {
      const age = Math.round((Date.now() - Math.max(...cs.map(c => c.ts))) / 60000);
      for (const c of cs) lines.push(`  ${c.file}  (session ${sess.slice(0, 8)}, active ${age}m ago, ${c.tool})`);
    }
    lines.push(mine.length
      ? `Your files:  git add ${mine.map(c => c.file).join(' ')}`
      : 'Your files:  (none claimed in this worktree — stage explicit paths you actually edited)');
    lines.push('Override:    CK_ALLOW_DESTRUCTIVE=1 (stages their work into your commit)');
    return lines.join('\n');
  } catch (e) {
    // Tier B FAILS OPEN: an unreadable registry must not block work.
    console.error(`[guard-destructive] NOTE: '${shape}' allowed — claim registry could not be evaluated (${e.message}).`);
    return null;
  }
}

// ---------- entry point ----------

function main() {
  let payload;
  try {
    const stdin = fs.readFileSync(0, 'utf-8');
    payload = JSON.parse(stdin);
  } catch {
    process.exit(0); // fail open: cannot even see the command
  }
  const command = payload && payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !command.trim()) process.exit(0);

  // In-env override covers everything; the inline prefix does not — see
  // isOverridden(). Matching the token anywhere in the string meant
  // `CK_ALLOW_DESTRUCTIVE=1 npm ci && git reset --hard` disarmed the guard for
  // a reset the shell never applied the variable to, and a command that merely
  // *mentioned* the token disarmed it too.
  if (process.env.CK_ALLOW_DESTRUCTIVE === '1') process.exit(0);

  const cwd = payload.cwd || process.cwd();
  const session = payload.session_id || payload.sessionId || process.env.CLAUDE_CODE_SESSION_ID || `ppid:${process.ppid}`;

  const a = tierA(command, cwd);
  if (a) {
    console.error(`BLOCKED (irreversible): ${a}\nOverride for a deliberate one-off: prefix the command with CK_ALLOW_DESTRUCTIVE=1`);
    process.exit(2);
  }

  const b = tierB(command, cwd, session);
  if (b) {
    console.error(b);
    process.exit(2);
  }
  process.exit(0);
}

if (require.main === module) main();

module.exports = { tierA, tierB, tierBShape };
