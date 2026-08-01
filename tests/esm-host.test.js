/**
 * ESM-host tests.
 *
 * The defect: ClauKit's hooks, statusline and scripts/ck helpers are CommonJS
 * but shipped as `.js`. Node picks a `.js` file's module system from the HOST
 * project's nearest package.json, so in any project with `"type": "module"`
 * every one of them died on its first `require`:
 *
 *     ReferenceError: require is not defined in ES module scope
 *
 * The visible symptom was a PostToolUse crash on `/ck:git cp`. The invisible one
 * was worse: `scout-block` and `guard-destructive` are PreToolUse guards, so
 * they had been failing open in every ESM project since install.
 *
 * These tests install into a `"type": "module"` project and actually run the
 * hooks there, plus assert the extension rule so a future `.js` cannot regress
 * it, plus cover the upgrade path off the old names.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = path.join(__dirname, '..');
const CK = path.join(REPO, 'bin', 'ck.js');

/** Every file ClauKit installs into a project and then invokes with `node`. */
const SHIPPED_NODE_DIRS = ['.claude/hooks', 'scripts/ck'];

let work;

function init(dir, extra = []) {
  return spawnSync('node', [CK, 'init', '--kit', 'engineer', ...extra], { cwd: dir, encoding: 'utf-8' });
}

/** A git project whose package.json declares ESM — the configuration that broke. */
function esmProject() {
  const d = fs.mkdtempSync(path.join(work, 'esm-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: d });
  fs.writeFileSync(
    path.join(d, 'package.json'),
    JSON.stringify({ name: 'host', version: '1.0.0', type: 'module' }, null, 2)
  );
  return d;
}

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-esm-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

test('no CommonJS file is shipped as .js into a host project', () => {
  for (const dir of SHIPPED_NODE_DIRS) {
    for (const file of walk(path.join(REPO, dir))) {
      if (!file.endsWith('.js')) continue;
      assert.fail(
        `${path.relative(REPO, file)} ships as .js — Node reads it as ESM in a "type": "module" project. Use .cjs.`
      );
    }
  }
  assert.ok(fs.existsSync(path.join(REPO, '.claude/statusline.cjs')), 'statusline must ship as .cjs');
  assert.ok(!fs.existsSync(path.join(REPO, '.claude/statusline.js')), 'statusline.js must be gone');
});

test('hooks run inside a "type": "module" project', () => {
  const p = esmProject();
  assert.strictEqual(init(p).status, 0);

  const cases = [
    ['.claude/hooks/scout-block.cjs', '{"tool_input":{"command":"ls -la"}}'],
    ['.claude/hooks/guard-destructive.cjs', '{"tool_input":{"command":"git status"}}'],
    ['.claude/hooks/modularization-hook.cjs', '{"tool_input":{"file_path":"/tmp/nope.ts"}}'],
    ['.claude/hooks/file-claims.cjs', '{"tool_input":{"file_path":"a.ts"},"tool_name":"Edit"}'],
  ];

  for (const [rel, payload] of cases) {
    const res = spawnSync('node', [path.join(p, rel)], { cwd: p, input: payload, encoding: 'utf-8' });
    assert.ok(
      !/require is not defined|Cannot use import statement/.test(res.stderr),
      `${rel} failed to load under "type": "module": ${res.stderr}`
    );
  }
});

test('statusline and scripts/ck load inside a "type": "module" project', () => {
  const p = esmProject();
  assert.strictEqual(init(p).status, 0);

  const status = spawnSync('node', [path.join(p, '.claude/statusline.cjs')], {
    cwd: p, input: '{}', encoding: 'utf-8',
  });
  assert.ok(!/require is not defined/.test(status.stderr), `statusline.cjs: ${status.stderr}`);

  // wt-doctor pulls in scripts/ck/lib/common.cjs — an extensionless require of
  // it would not resolve, so this also covers the relative-import rewrite.
  const doctor = spawnSync('node', [path.join(p, 'scripts/ck/wt-doctor.cjs')], { cwd: p, encoding: 'utf-8' });
  assert.ok(
    !/require is not defined|Cannot find module/.test(doctor.stderr),
    `wt-doctor.cjs: ${doctor.stderr}`
  );
});

test('every settings.json command points at a file that exists', () => {
  const p = esmProject();
  assert.strictEqual(init(p).status, 0);
  const settings = JSON.parse(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'));

  const commands = Object.values(settings.hooks || {}).flat()
    .flatMap(g => (g.hooks || []).map(h => h.command))
    .concat(settings.statusLine ? [settings.statusLine.command] : []);

  for (const cmd of commands) {
    const file = cmd.replace(/["']/g, '').split(/\s+/).pop().replace('$CLAUDE_PROJECT_DIR/', '');
    assert.ok(file.endsWith('.cjs'), `settings.json still invokes a .js file: ${cmd}`);
    assert.ok(fs.existsSync(path.join(p, file)), `settings.json references a missing file: ${file}`);
  }
});

test('upgrade: a pre-rename install is repaired without --force', () => {
  const p = esmProject();
  assert.strictEqual(init(p).status, 0);

  // Rewind to the broken shape: .js files on disk, settings.json pointing at
  // them, no .cjs anywhere. Plus one hook the user wrote, which must survive.
  const legacy = ['scout-block', 'guard-destructive', 'modularization-hook', 'file-claims'];
  for (const name of legacy) {
    fs.renameSync(path.join(p, `.claude/hooks/${name}.cjs`), path.join(p, `.claude/hooks/${name}.js`));
  }
  fs.renameSync(path.join(p, '.claude/statusline.cjs'), path.join(p, '.claude/statusline.js'));
  fs.writeFileSync(path.join(p, '.claude/hooks/their-own.js'), '// user hook\n');

  const theirs = {
    permissions: { allow: ['Bash(npm run test:*)'] },
    env: { MY_KEY: 'keep-me' },
    hooks: {
      PreToolUse: [{
        matcher: 'Bash',
        hooks: [
          { type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/scout-block.js' },
          { type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/guard-destructive.js' },
          { type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/their-own.js' },
        ],
      }],
    },
    statusLine: { type: 'command', command: 'node .claude/statusline.js', padding: 0 },
  };
  fs.writeFileSync(path.join(p, '.claude/settings.json'), JSON.stringify(theirs, null, 2));

  const res = init(p);   // no --force: the default path must fix it
  assert.strictEqual(res.status, 0, res.stderr);

  for (const name of legacy) {
    assert.ok(fs.existsSync(path.join(p, `.claude/hooks/${name}.cjs`)), `${name}.cjs must be installed`);
    assert.ok(!fs.existsSync(path.join(p, `.claude/hooks/${name}.js`)), `stale ${name}.js must be removed`);
  }
  assert.ok(fs.existsSync(path.join(p, '.claude/statusline.cjs')));
  assert.ok(!fs.existsSync(path.join(p, '.claude/statusline.js')));
  assert.ok(fs.existsSync(path.join(p, '.claude/hooks/their-own.js')), "the user's own hook is not ours to delete");

  const after = JSON.parse(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'));
  const commands = Object.values(after.hooks).flat().flatMap(g => (g.hooks || []).map(h => h.command));

  assert.ok(commands.some(c => /scout-block\.cjs/.test(c)), 'scout-block repointed');
  assert.ok(commands.some(c => /guard-destructive\.cjs/.test(c)), 'guard repointed');
  assert.ok(commands.some(c => /their-own\.js/.test(c)), "the user's own hook entry is untouched");
  assert.ok(!commands.some(c => /(scout-block|guard-destructive|file-claims|modularization-hook)\.js\b/.test(c)),
    'no shipped hook may still be invoked by its .js name');
  assert.match(after.statusLine.command, /statusline\.cjs/);

  assert.deepStrictEqual(after.permissions, theirs.permissions, 'their permissions must be untouched');
  assert.deepStrictEqual(after.env, theirs.env, 'their env must be untouched');

  // The rewrite must not leave a duplicate next to an entry a previous merge added.
  const shipped = commands.filter(c => /scout-block\.cjs/.test(c));
  assert.strictEqual(shipped.length, 1, 'the repointed entry must not duplicate a merged one');
});

test('upgrade: shipped docs stop invoking the deleted .js paths', () => {
  const p = esmProject();
  assert.strictEqual(init(p).status, 0);

  fs.renameSync(path.join(p, '.claude/hooks/file-claims.cjs'), path.join(p, '.claude/hooks/file-claims.js'));
  const cmd = path.join(p, '.claude/commands/ck/git.md');
  fs.writeFileSync(cmd, 'Run `node .claude/hooks/file-claims.js list` first.\nMy own tools/build.js is fine.\n');

  assert.strictEqual(init(p).status, 0);

  const after = fs.readFileSync(cmd, 'utf-8');
  assert.match(after, /\.claude\/hooks\/file-claims\.cjs list/, 'the instruction must name the file that exists');
  assert.doesNotMatch(after, /file-claims\.js/, 'no shipped doc may still invoke the deleted path');
  assert.match(after, /tools\/build\.js/, "an unrelated .js in the same doc is not ours to rewrite");
});

test('migration is idempotent — a second init changes nothing', () => {
  const p = esmProject();
  init(p);
  const first = fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8');
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, '.claude/settings.json'), 'utf-8'), first);
  assert.ok(!/migrated ClauKit's CommonJS files/.test(res.stdout), 'nothing left to migrate');
});
