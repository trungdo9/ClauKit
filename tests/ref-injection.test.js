/**
 * Regression tests for C2 — git refs interpolated into a shell (code review, 2026-07-31).
 *
 * `sh(\`git rev-parse --short ${base}\`)` built a shell string from a ref.
 * Git accepts `;`, backtick, `$`, `|` and `&` inside a branch name, so any ref
 * reaching these scripts — a branch name, a STATE.md base SHA, or the CI
 * template's `origin/${{ github.base_ref }}` — was arbitrary command execution
 * inside a job holding an API key and a write-scoped token.
 *
 * These tests assert the marker file is NEVER created. They fail loudly if a
 * future edit reintroduces a shell string.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPTS = path.join(__dirname, '..', 'scripts', 'ck');
const { git, assertRef } = require(path.join(SCRIPTS, 'lib', 'common.cjs'));

let repo, marker;

function sh(args, cwd) {
  const r = spawnSync(args[0], args.slice(1), { cwd, encoding: 'utf-8' });
  return r;
}

before(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-inj-'));
  marker = path.join(repo, 'INJECTED');
  sh(['git', 'init', '-q', '.'], repo);
  sh(['git', 'config', 'user.email', 't@t'], repo);
  sh(['git', 'config', 'user.name', 't'], repo);
  fs.writeFileSync(path.join(repo, 'a.txt'), 'one\n');
  sh(['git', 'add', '.'], repo);
  sh(['git', 'commit', '-qm', 'first'], repo);
  fs.writeFileSync(path.join(repo, 'a.txt'), 'two\n');
  sh(['git', 'commit', '-qam', 'second'], repo);
});

after(() => fs.rmSync(repo, { recursive: true, force: true }));

// `${IFS}` matters: git rejects a branch name containing a space, so the
// space-free form is the payload that actually lands.
const PAYLOADS = ref => [
  `${ref};touch\${IFS}${marker}`,
  `${ref}\`touch\${IFS}${marker}\``,
  `${ref}|touch\${IFS}${marker}`,
  `${ref}&&touch\${IFS}${marker}`,
  `$(touch\${IFS}${marker})`,
];

function runScript(name, args) {
  return spawnSync('node', [path.join(SCRIPTS, name), ...args], { cwd: repo, encoding: 'utf-8' });
}

for (const payload of PAYLOADS('HEAD')) {
  test(`review-package.cjs does not execute an injected ref: ${payload}`, () => {
    runScript('review-package.cjs', [payload]);
    assert.ok(!fs.existsSync(marker), `COMMAND INJECTION via review-package.cjs with ref: ${payload}`);
  });

  test(`ci-review.cjs does not execute an injected ref: ${payload}`, () => {
    runScript('ci-review.cjs', [payload, 'HEAD', '--dry-run']);
    assert.ok(!fs.existsSync(marker), `COMMAND INJECTION via ci-review.cjs with ref: ${payload}`);
  });
}

test('a real branch name carrying metacharacters resolves without executing it', () => {
  const evil = 'x;touch${IFS}' + marker;
  const cb = sh(['git', 'checkout', '-q', '-b', evil], repo);
  assert.strictEqual(cb.status, 0, `git should accept this branch name: ${cb.stderr}`);
  const res = runScript('review-package.cjs', [evil]);
  assert.ok(!fs.existsSync(marker), 'COMMAND INJECTION via a genuine branch name');
  assert.strictEqual(res.status, 0, `should still produce a package: ${res.stderr}`);
  sh(['git', 'checkout', '-q', '-'], repo);
});

// ---------- the helpers themselves ----------

test('git() passes argv, so a metacharacter ref is just a bad revision', () => {
  assert.throws(() => git(['rev-parse', '--short', 'HEAD;touch ' + marker], { cwd: repo }));
  assert.ok(!fs.existsSync(marker));
});

test('assertRef rejects a ref that would be read as an option', () => {
  const res = spawnSync('node', ['-e',
    `const {assertRef}=require(${JSON.stringify(path.join(SCRIPTS, 'lib', 'common.cjs'))}); assertRef('--upload-pack=touch /tmp/x','BASE')`,
  ], { encoding: 'utf-8' });
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /starts with '-'/);
});

test('review-package.cjs still works on a normal range', () => {
  const res = runScript('review-package.cjs', ['HEAD~1', 'HEAD']);
  assert.strictEqual(res.status, 0, res.stderr);
  const out = res.stdout.trim();
  assert.ok(fs.existsSync(out), `expected a package file at ${out}`);
  const body = fs.readFileSync(out, 'utf-8');
  assert.match(body, /## Commits/);
  assert.match(body, /## Diff \(-U10\)/);
});
