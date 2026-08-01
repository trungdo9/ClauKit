/**
 * Packaging tests — what survives `npm pack`, as opposed to what works when run
 * from this repo.
 *
 * These exist because `installer.test.js` asserted the right behaviour through a
 * path that could not fail. It ran `bin/ck.js` from the repo, where
 * `.claude/.gitignore` is present on disk, so the copy loop found it and
 * `git check-ignore` passed. npm strips every `.gitignore` from every tarball —
 * a packing rule, not a misconfiguration — so on a real install the
 * manifest-declared path did not exist, `checkKitPathsAvailable()` reported it
 * missing, and `ck init` exited 1 before copying anything, for all three kits.
 *
 * Same blindness as the CLAUDE.md defect one release earlier: the repo's own
 * layout hid a defect every consumer would hit. So the last test here asserts
 * the general rule rather than this one instance — every kit-declared path must
 * be present in the tarball.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { RULES, existingPatterns } = require('../bin/lib/gitignore-wire');

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

before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-pack-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

test('.claude/.gitignore is created from data, not copied as a file', () => {
  const p = fresh();
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const f = path.join(p, '.claude/.gitignore');
  assert.ok(fs.existsSync(f), 'a fresh install must produce it even though npm cannot ship it');
  const text = fs.readFileSync(f, 'utf-8');
  for (const rule of RULES) assert.match(text, new RegExp(`^${rule.replace(/\./g, '\\.')}$`, 'm'));
});

test('an existing .claude/.gitignore keeps the user\'s lines and gains only what is missing', () => {
  const p = fresh();
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(p, '.claude/.gitignore'), '# mine\nscratch/\n.ck-tail-approved\n');
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  const text = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  assert.match(text, /^scratch\/$/m, 'the user\'s own rule survives');
  assert.match(text, /^# mine$/m, 'their comment survives');
  assert.strictEqual(text.match(/^\.ck-tail-approved$/gm).length, 1, 'a rule they already had is not duplicated');
  assert.match(text, /^\.ck-file-claims\.jsonl$/m, 'a rule they lacked is appended');
});

test('.gitignore wiring is idempotent — a second init adds nothing', () => {
  const p = fresh();
  init(p);
  const first = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8'), first);
  assert.ok(!/added \d+ rule/.test(res.stdout), 'nothing left to add');
});

test('an equivalent pattern written with a leading slash is not re-added', () => {
  const p = fresh();
  fs.mkdirSync(path.join(p, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(p, '.claude/.gitignore'), RULES.map((r) => `/${r}`).join('\n') + '\n');
  init(p);
  const text = fs.readFileSync(path.join(p, '.claude/.gitignore'), 'utf-8');
  for (const rule of RULES) {
    const hits = (text.match(new RegExp(`^/?${rule.replace(/\./g, '\\.')}$`, 'gm')) || []).length;
    assert.strictEqual(hits, 1, `${rule} must not be appended alongside its /-prefixed twin`);
  }
});

test('the wired rules stay in sync with ClauKit\'s own .claude/.gitignore', () => {
  const own = fs.readFileSync(path.join(REPO, '.claude/.gitignore'), 'utf-8');
  const declared = existingPatterns(own);
  for (const rule of RULES) {
    assert.ok(declared.has(rule), `${rule} is wired into consumers but missing from this repo's own .claude/.gitignore — the two must not drift`);
  }
});

test('every kit-declared path survives npm pack', () => {
  const res = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: REPO, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 });
  assert.strictEqual(res.status, 0, res.stderr);
  const packed = JSON.parse(res.stdout)[0].files.map((f) => f.path);
  // A declared path is satisfied when the tarball carries it, or carries its
  // de-symlinked twin (`.claude/skills/x` ships as `skills/x` — npm drops the
  // .claude/skills symlink), matching resolveSourcePath()'s fallback.
  const satisfied = (p) => {
    const stripped = p.replace(/^\.claude[\\/]/, '');
    return packed.some((f) => f === p || f.startsWith(p.replace(/\/?$/, '/'))
      || f === stripped || f.startsWith(stripped.replace(/\/?$/, '/')));
  };
  for (const name of ['engineer', 'marketing', 'both']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(REPO, `.claude/kits/${name}.json`), 'utf-8'));
    const declared = [
      ...Object.values(manifest.paths || {}).flat(),
      ...Object.values(manifest.requires || {}).flat(),
    ];
    const missing = declared.filter((p) => !satisfied(p));
    assert.deepStrictEqual(missing, [], `kit '${name}' declares path(s) npm will not ship — ck init exits 1 on a real install`);
  }
});
