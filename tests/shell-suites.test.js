/**
 * Wraps the legacy shell test suites in node:test so `npm test`
 * (node --test tests/) runs everything in one invocation.
 *
 * The shell scripts print "✗ FAIL" but always exit 0, so the wrapper
 * asserts on output as well as exit code.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');

test('legacy shell suite: test-scout-block', { skip: process.platform === 'win32' }, () => {
  const res = spawnSync('bash', [path.join(REPO_ROOT, 'tests', 'test-scout-block.sh')], {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
  });
  const out = (res.stdout || '') + (res.stderr || '');
  assert.strictEqual(res.status, 0, `suite exited ${res.status}:\n${out}`);
  assert.ok(!out.includes('✗ FAIL'), `suite reported failures:\n${out}`);
});

test('legacy powershell suite: test-scout-block', { skip: process.platform !== 'win32' }, () => {
  const res = spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(REPO_ROOT, 'tests', 'test-scout-block.ps1')],
    { cwd: REPO_ROOT, encoding: 'utf-8' }
  );
  const out = (res.stdout || '') + (res.stderr || '');
  assert.strictEqual(res.status, 0, `suite exited ${res.status}:\n${out}`);
  assert.ok(!out.includes('FAIL'), `suite reported failures:\n${out}`);
});
