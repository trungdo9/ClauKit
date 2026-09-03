/**
 * Tests for protected-branch-guard.cjs — publishing to a shared branch is a
 * mechanical invariant, not a convention.
 *
 * The guard exists because prose failed twice: two separate sessions had a
 * delegated agent push to `staging` against an explicit instruction, one of them
 * six commits, with the code already pulled so nothing could be reverted. The
 * audit found no hook anywhere refused a push — `guard-destructive` covers
 * `push --force` without a lease and nothing else, and `branch-guard`'s
 * `MOVES_HEAD` set is `{create, switch, detach}`, so `push` and `merge` never
 * reach it.
 *
 * Two things must both hold or the guard is worthless: it refuses every form of
 * publishing to a protected branch — including the IMPLICIT one, where nobody
 * types a branch name and the agent is simply already standing on it — while
 * staying out of the way of the flows the git skill itself instructs. The benign
 * cases carry the same weight as the refusals: a guard that refused `git merge
 * origin/staging` or `git push origin v1.4.0` would be switched off within a day,
 * which is worse than not shipping it.
 *
 * The end-to-end block is not redundant with the unit block. A unit-green
 * `assess()` whose `main()` forgot to `exit(2)` would still let every push
 * through, so the hook is SPAWNED and its exit codes asserted.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', '.claude', 'hooks', 'protected-branch-guard.cjs');
const { parseGit, assess, segments, destinationBranch, ladderDoc } = require(HOOK);

const PROT = new Set(['main', 'master', 'staging', 'uat', 'production', 'prod']);

/** Every segment of `cmd` through assess(), with HEAD pinned to `branch`. */
function verdict(cmd, branch) {
  const segs = segments(cmd);
  if (!segs) return null;
  for (const seg of segs) {
    const g = parseGit(seg);
    if (!g) continue;
    const res = assess(g, '/nowhere', PROT, () => branch);
    if (res) return res;
  }
  return null;
}
const denies = (cmd, branch) => verdict(cmd, branch) !== null;

// ---------- refusals ----------

test('an explicit protected destination is refused in every refspec form', () => {
  for (const cmd of [
    'git push origin staging',
    'git push origin HEAD:staging',
    'git push origin +staging',
    'git push origin feature/x:refs/heads/main',
    'git push origin staging:refs/heads/staging',
    'git push origin master',
    'git push origin uat',
    'git push -f origin staging',
    'git push https://x.example/a.git staging',
  ]) assert.ok(denies(cmd, 'feature/x'), cmd);
});

test('deleting a protected branch is refused', () => {
  assert.ok(denies('git push --delete origin staging', 'feature/x'));
  assert.ok(denies('git push origin :main', 'feature/x'));
});

test('the IMPLICIT push is refused — this is the shape both incidents took', () => {
  // Nobody typed a branch name in either incident; the agent was already on it.
  for (const cmd of ['git push', 'git push origin', 'git push -u origin', 'git push origin HEAD',
    'git push origin --tags']) {
    assert.ok(denies(cmd, 'staging'), cmd);
  }
});

test('--all and --mirror are refused: they carry every branch', () => {
  assert.ok(denies('git push --all', 'feature/x'));
  assert.ok(denies('git push --mirror origin', 'feature/x'));
});

test('merging while standing ON a protected branch is refused', () => {
  assert.ok(denies('git merge feature/x', 'staging'));
  assert.ok(denies('git merge --no-ff feature/x', 'main'));
});

test('a protected push is caught inside a compound command and behind -C', () => {
  assert.ok(denies('git add -A && git commit -m "x" && git push origin staging', 'feature/x'));
  assert.ok(denies('git status; git push origin main', 'feature/x'));
  assert.ok(denies('git -C api push origin staging', 'feature/x'));
});

// ---------- the benign cases, which matter just as much ----------

test('the flows the git skill instructs are allowed', () => {
  // Branch Policy / Finish-Branch Protocol depend on all of these working.
  assert.ok(!denies('git push origin feature/KSL-1234', 'feature/KSL-1234'));
  assert.ok(!denies('git push -u origin fix/KSL-1', 'fix/KSL-1'));
  assert.ok(!denies('git push', 'feature/x'));
  assert.ok(!denies('git push origin HEAD', 'feature/x'));
  assert.ok(!denies('git push -o ci.skip origin feature/x', 'feature/x'));
});

test('merging the shared branch INTO a feature branch is allowed — only the direction is refused', () => {
  assert.ok(!denies('git merge origin/staging', 'feature/x'));
  assert.ok(!denies('git merge --abort', 'staging'));
  assert.ok(!denies('git rebase staging', 'feature/x'));
});

test('release tagging is allowed, including from main', () => {
  assert.ok(!denies('git push origin v1.8.0', 'main'));
  assert.ok(!denies('git push origin refs/tags/v1.8.0', 'main'));
});

test('an explicit refspec suppresses the default push, so a feature refspec from staging is allowed', () => {
  // The discriminating pair. An earlier draft asked whether a refspec RESOLVED
  // to a branch rather than whether one was PRESENT: a tag resolves to none, so
  // `push origin refs/tags/...` from main looked like a default push and was
  // refused, and this row was unreachable.
  assert.ok(!denies('git push origin feature/x', 'staging'));
  assert.ok(!denies('git push origin refs/tags/v1.8.0', 'staging'));
});

test('read-only and local commands are never touched', () => {
  for (const cmd of ['git fetch origin staging', 'git pull --rebase origin staging',
    'git log --oneline origin/staging..HEAD', 'git branch staging-notes', 'git status']) {
    assert.ok(!denies(cmd, 'staging'), cmd);
  }
});

test('--dry-run writes nothing, so it is allowed', () => {
  assert.ok(!denies('git push --dry-run origin staging', 'feature/x'));
  assert.ok(!denies('git push -n origin staging', 'feature/x'));
});

test('the branch name inside a quoted argument is not a push', () => {
  // The most likely false positive in real use: a commit body or an echo that
  // mentions the command. segments() is quote-aware precisely for this.
  assert.ok(!denies('git commit -m "run git push origin staging by hand"', 'staging'));
  assert.ok(!denies('echo "git push origin staging"', 'staging'));
});

test('a non-git tool is out of scope', () => {
  assert.ok(!denies('gh pr merge 42 --squash --delete-branch', 'feature/x'));
});

test('a detached HEAD cannot be resolved, so it is allowed rather than guessed', () => {
  assert.ok(!denies('git push', null));
});

test('the inline consent prefix consents to that segment alone', () => {
  assert.ok(!denies('CK_ALLOW_PROTECTED_PUSH=1 git push origin staging', 'feature/x'));
});

// ---------- refspec resolution ----------

test('destinationBranch resolves what a refspec lands on', () => {
  assert.strictEqual(destinationBranch('feature/x:staging'), 'staging');
  assert.strictEqual(destinationBranch('x:refs/heads/main'), 'main');
  assert.strictEqual(destinationBranch('+staging'), 'staging');
  assert.strictEqual(destinationBranch('staging'), 'staging');
  assert.strictEqual(destinationBranch('refs/tags/v1.0'), null);
  assert.strictEqual(destinationBranch('refs/notes/commits'), null);
});

test('the protected set is configurable, and an empty set disables the list', () => {
  const narrow = new Set(['main']);
  assert.strictEqual(assess(parseGit('git push origin staging'), '/nowhere', narrow, () => 'feature/x'), null);
  assert.notStrictEqual(assess(parseGit('git push origin main'), '/nowhere', narrow, () => 'feature/x'), null);
  assert.strictEqual(assess(parseGit('git push origin main'), '/nowhere', new Set(), () => 'feature/x'), null);
});

test('the ladder pointer resolves against the receiving project, not this kit', () => {
  // Why this exists: the same file ships byte-identical in the Norskmat kit,
  // which has .claude/rules/. Hard-coding either path makes the refusal cite a
  // file the reader cannot open in the other kit.
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pbg-doc-'));
  const mk = (rel) => {
    fs.mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(d, rel), 'x');
  };
  assert.match(ladderDoc(d), /none of the known paths exist/);
  mk('.claude/skills/software/git/SKILL.md');
  assert.match(ladderDoc(d), /skills\/software\/git\/SKILL\.md/);
  mk('.claude/rules/branching-rules.md');
  assert.match(ladderDoc(d), /rules\/branching-rules\.md/);
  fs.rmSync(d, { recursive: true, force: true });
});

// ---------- end-to-end: the hook spawned, exit codes asserted ----------

test('spawned in a real repository, the exit codes are the gate', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pbg-e2e-'));
  const repo = path.join(root, 'repo');
  fs.mkdirSync(repo);
  const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('init', '-q', '-b', 'staging');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'test');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'a\n');
  git('add', 'a.txt');
  git('commit', '-q', '-m', 'seed');

  const run = (command, env = {}) => {
    const r = spawnSync(process.execPath, [HOOK], {
      input: JSON.stringify({ tool_input: { command }, cwd: repo }),
      encoding: 'utf-8',
      env: { ...process.env, ...env },
    });
    return { code: r.status, stderr: r.stderr || '' };
  };

  const bare = run('git push');
  assert.strictEqual(bare.code, 2, 'bare push while HEAD is on staging');
  assert.match(bare.stderr, /BLOCKED \(protected branch\): `staging`/);
  assert.match(bare.stderr, /CK_ALLOW_PROTECTED_PUSH=1/);
  assert.match(bare.stderr, /CK_AUTO_MODE does NOT override/);

  assert.strictEqual(run('git push origin staging').code, 2);
  assert.strictEqual(run('git merge feature/x').code, 2);
  assert.strictEqual(run('git push --dry-run origin staging').code, 0);
  assert.strictEqual(run('git fetch origin').code, 0);
  assert.strictEqual(run('ls -la').code, 0);

  // Consent is its own variable; auto mode is deliberately not enough.
  assert.strictEqual(run('git push', { CK_ALLOW_PROTECTED_PUSH: '1' }).code, 0);
  assert.strictEqual(run('git push', { CK_AUTO_MODE: '1' }).code, 2);
  assert.strictEqual(run('git push', { CK_PROTECTED_BRANCHES: '' }).code, 0);

  // Fails open — this hook adds a refusal to a previously-allowed action.
  assert.strictEqual(spawnSync(process.execPath, [HOOK], { input: 'not json', encoding: 'utf-8' }).status, 0);
  assert.strictEqual(spawnSync(process.execPath, [HOOK], { input: '', encoding: 'utf-8' }).status, 0);

  git('switch', '-q', '-c', 'feature/KSL-1');
  assert.strictEqual(run('git push').code, 0, 'bare push from a feature branch');
  assert.strictEqual(run('git merge origin/staging').code, 0);
  assert.strictEqual(run('git push origin staging').code, 2);

  // `-C` from an unrelated cwd: HEAD must be resolved in the TARGET tree.
  const other = path.join(root, 'other');
  fs.mkdirSync(other);
  const viaC = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ tool_input: { command: `git -C ${repo} push origin staging` }, cwd: other }),
    encoding: 'utf-8', env: process.env,
  });
  assert.strictEqual(viaC.status, 2);

  fs.rmSync(root, { recursive: true, force: true });
});
