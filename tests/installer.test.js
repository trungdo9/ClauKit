/**
 * Installer tests (code review 2026-07-31).
 *
 * Two defects, both silent:
 *   - `ck init` skipped an existing .claude/settings.json, so an upgrading user
 *     received the new hook FILES with nothing wiring them. The install printed
 *     a success summary either way, and the only alternative was --force.
 *   - Once a kit shipped a destination outside .claude/ (scripts/ck/), --force
 *     recursively deleted a top-level user directory.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = path.join(__dirname, '..');
const CK = path.join(REPO, 'bin', 'ck.js');

let work;

function init(dir, extra = []) {
  return spawnSync('node', [CK, 'init', '--kit', 'engineer', ...extra], { cwd: dir, encoding: 'utf-8' });
}

function fresh() {
  const d = fs.mkdtempSync(path.join(work, 'p-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: d });
  return d;
}

before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-install-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

test('fresh install wires every hook the settings file references', () => {
  const p = fresh();
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const settings = JSON.parse(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'));
  const commands = Object.values(settings.hooks || {}).flat()
    .flatMap(g => (g.hooks || []).map(h => h.command));
  assert.ok(commands.length >= 2, 'expected hooks to be registered');
  for (const cmd of commands) {
    const file = cmd.replace(/["']/g, '').split(/\s+/).pop().replace('$CLAUDE_PROJECT_DIR/', '');
    assert.ok(fs.existsSync(path.join(p, file)), `settings.json references a file that was not installed: ${file}`);
  }
});

test('upgrade path: an existing settings.json gets the new hooks merged in', () => {
  const p = fresh();
  // Simulate an older install: hook files absent, settings.json hand-written
  // with the user's own permissions and one older hook.
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  const theirs = {
    permissions: { allow: ['Bash(npm run test:*)'] },
    env: { MY_KEY: 'keep-me' },
    hooks: {
      PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/scout-block.js' }] }],
    },
  };
  fs.writeFileSync(path.join(p, '.claude/settings.json'), JSON.stringify(theirs, null, 2));

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  const after = JSON.parse(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'));
  const commands = Object.values(after.hooks).flat().flatMap(g => (g.hooks || []).map(h => h.command)).join(' ');

  assert.match(commands, /guard-destructive\.js/, 'the new PreToolUse guard must be wired, not left inert');
  assert.match(commands, /file-claims\.js/, 'the claim registry hook must be wired');
  assert.match(commands, /scout-block\.js/, 'their existing hook must survive');
  assert.deepStrictEqual(after.permissions, theirs.permissions, 'their permissions must be untouched');
  assert.deepStrictEqual(after.env, theirs.env, 'their env must be untouched');
  assert.match(res.stdout, /wired into your existing/);
});

test('merging is idempotent — a second init adds nothing', () => {
  const p = fresh();
  init(p);
  const first = fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8');
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'), first);
  assert.ok(!/wired into your existing/.test(res.stdout), 'nothing left to wire');
});

test('--force refreshes shipped dirs but never eats the settings the merge protects', () => {
  const p = fresh();
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  const theirs = { permissions: { allow: ['Bash(make:*)'] }, env: { MY_VAR: 'keep-me' } };
  fs.writeFileSync(path.join(p, '.claude/settings.json'), JSON.stringify(theirs, null, 2));

  const res = init(p, ['--force']);
  assert.strictEqual(res.status, 0, res.stderr);

  const after = JSON.parse(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'));
  assert.deepStrictEqual(after.permissions, theirs.permissions, '--force must not replace their permissions');
  assert.deepStrictEqual(after.env, theirs.env, '--force must not replace their env');
  const commands = Object.values(after.hooks || {}).flat().flatMap(g => (g.hooks || []).map(h => h.command)).join(' ');
  assert.match(commands, /guard-destructive\.js/, 'and the new hooks still get wired');
  assert.ok(fs.existsSync(path.join(p, 'scripts/ck/wt-new.js')), '--force still refreshes everything else');
});

test('--force overwrites shipped files but keeps files the user owns', () => {
  const p = fresh();
  init(p);
  const mine = path.join(p, 'scripts/ck/my-own-deploy.js');
  fs.mkdirSync(path.dirname(mine), { recursive: true });
  fs.writeFileSync(mine, '// mine\n');
  const theirHook = path.join(p, '.claude/hooks/my-hook.js');
  fs.writeFileSync(theirHook, '// mine too\n');

  const res = init(p, ['--force']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.ok(fs.existsSync(mine), '--force must not delete a user file in a shipped directory');
  assert.ok(fs.existsSync(theirHook), '--force must not delete a user hook');
  assert.ok(fs.existsSync(path.join(p, 'scripts/ck/wt-new.js')), 'shipped files are still refreshed');
  assert.match(res.stdout, /kept \d+ file\(s\) you own/);
});
