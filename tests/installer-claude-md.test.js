/**
 * CLAUDE.md wiring tests.
 *
 * The behavioural sweep caught this defect: `ck init` copied
 * .claude/workflows/*.md but Claude Code only auto-reads CLAUDE.md, so every
 * gate shipped dark. Same scenario, one variable — a bare install edited source
 * against a plan whose root cause was false; with CLAUDE.md naming the workflows
 * it refused and marked the claim REFUTED.
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

before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-claudemd-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

test('fresh install wires the workflows into a CLAUDE.md', () => {
  const p = fresh();
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  const md = path.join(p, 'CLAUDE.md');
  assert.ok(fs.existsSync(md), 'a fresh install must leave the workflows reachable');
  const text = fs.readFileSync(md, 'utf-8');

  // The hard gate in particular must be named, not buried in a glob.
  assert.match(text, /\.claude\/workflows\/skill-activation\.md/, 'the skill-activation hard gate must be wired');
  assert.match(text, /\.claude\/workflows\/primary-workflow\.md/);
  assert.match(res.stdout, /CLAUDE\.md created/);

  // No dangling pointers: everything referenced must have actually landed.
  for (const ref of text.match(/\.claude\/workflows\/[\w.-]+\.md/g) || []) {
    assert.ok(fs.existsSync(path.join(p, ref)), `CLAUDE.md points at a file that was not installed: ${ref}`);
  }
});

test('an existing CLAUDE.md gets §Workflows appended, its content untouched', () => {
  const p = fresh();
  const mine = '# CLAUDE.md\n\n## Build\n\nRun `make thing`.\n';
  fs.writeFileSync(path.join(p, 'CLAUDE.md'), mine);

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  assert.ok(text.startsWith(mine), 'the user\'s own instructions must survive verbatim');
  assert.match(text, /\.claude\/workflows\/skill-activation\.md/);
  assert.match(res.stdout, /wired .* into your existing CLAUDE\.md/);
});

test('CLAUDE.md wiring is idempotent — a second init adds nothing', () => {
  const p = fresh();
  init(p);
  const first = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8'), first);
  assert.ok(!/CLAUDE\.md created|wired .* workflow/.test(res.stdout), 'nothing left to wire');
});

test('a project that already references the workflows its own way is left alone', () => {
  const p = fresh();
  const theirs = '# CLAUDE.md\n\nSee ./.claude/workflows/primary-workflow.md and do what it says.\n';
  fs.writeFileSync(path.join(p, 'CLAUDE.md'), theirs);
  init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8'), theirs,
    'their wording wins — we only add a pointer where none exists');
});

test('each kit wires its own workflows, not another kit\'s', () => {
  const p = fresh();
  spawnSync('node', [CK, 'init', '--kit', 'marketing'], { cwd: p, encoding: 'utf-8' });
  const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  assert.match(text, /marketing-workflow\.md/);
  assert.ok(!/primary-workflow\.md/.test(text), 'the marketing kit does not ship the engineer workflow');
});

test('runtime state is git-ignored in the consuming project', () => {
  const p = fresh();
  init(p);
  fs.writeFileSync(path.join(p, '.claude/.ck-file-claims.jsonl'), '{}\n');
  fs.writeFileSync(path.join(p, '.claude/.ck-tail-approved'), 'deadbeef\n');
  for (const f of ['.claude/.ck-file-claims.jsonl', '.claude/.ck-tail-approved']) {
    const r = spawnSync('git', ['check-ignore', f], { cwd: p, encoding: 'utf-8' });
    assert.strictEqual(r.status, 0, `${f} must be ignored in a consuming repo — it carries session ids and conflicts on every merge`);
  }
});

test('the refuted-premise hard stop reaches CLAUDE.md itself, not just a link', () => {
  // A behavioural eval caught a run that opened NONE of the linked workflow
  // files, verified a plan's cited commit, found it was a no-op, silently did
  // the missing work and shipped the dependent change. CLAUDE.md is the only
  // text guaranteed to be in context, so a rule that must fire before any
  // reading has to be stated here — a pointer is not enough.
  const p = fresh();
  init(p);
  const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  const line = text.split('\n').find((l) => /Hard stop/.test(l));
  assert.ok(line, 'CLAUDE.md must state the refuted-premise stop, not merely link to it');
  assert.match(line, /do not quietly do the missing work/i);
  assert.match(line, /verify-plan/, 'and must point at the skill for the detail');
  // One line, so tests/behavior ablation removes the rule atomically. Split
  // across lines, a negative control would strip half of it and measure nothing.
  assert.strictEqual(text.split('\n').filter((l) => /Hard stop/.test(l)).length, 1);
});

// --- upgrade path -----------------------------------------------------------
// "Already wired" was treated as "nothing to add", so a later version's rules
// reached brand-new installs only. The refuted-premise hard stop — the one rule
// a positive control proved necessary — never arrived for any existing user.

/** A CLAUDE.md as an older ck version left it: our marker, none of today's rules. */
function oldWired(p) {
  fs.writeFileSync(path.join(p, 'CLAUDE.md'),
    '# CLAUDE.md\n\n## Workflows\n\n<!-- ck:workflows -->\n'
    + '- Primary workflow: `./.claude/workflows/primary-workflow.md`\n');
}

test('re-running init on an already-wired project delivers rules it lacks', () => {
  const p = fresh();
  oldWired(p);
  init(p);
  const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  assert.match(text, /Hard stop/, 'an existing user must receive the rule, not just new installs');
  assert.match(text, /fix-pipeline\.md/, 'and workflows the older version did not ship');
});

test('bringing CLAUDE.md up to date is idempotent', () => {
  const p = fresh();
  oldWired(p);
  init(p); init(p); init(p);
  const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
  const count = (re) => text.split('\n').filter((l) => re.test(l)).length;
  assert.strictEqual(count(/Hard stop/), 1, 'a rule must never be appended twice');
  assert.strictEqual(count(/These workflow files are instructions/), 1);
  assert.strictEqual(count(/fix-pipeline\.md/), 1);
});

test("a hand-written CLAUDE.md is not edited, and the gap is reported instead", () => {
  // The rules only work from CLAUDE.md itself — a file it links to is not read
  // on the runs they exist for. So the gap is real and cannot be closed by the
  // pointer the user wrote. Reporting it keeps the choice with the person whose
  // file it is, rather than silently accepting or silently closing it.
  const p = fresh();
  const theirs = '# My project\n\nWe keep our rules in `./.claude/workflows/` — read them.\n';
  fs.writeFileSync(path.join(p, 'CLAUDE.md'), theirs);
  const res = init(p);
  assert.strictEqual(fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8'), theirs,
    'a file we did not write is not a file we edit');
  assert.match(res.stdout, /left untouched/);
  assert.match(res.stdout, /Hard stop/, 'and it must name what is missing, not just that something is');
});

test('a rule never cites a path its kit does not ship', () => {
  // The engineer scenarios cannot catch this: they only ever install one kit.
  // The hard stop was emitted unconditionally, so every marketing install got a
  // CLAUDE.md pointing at `skills/software/verify-plan/SKILL.md`, which that kit
  // does not ship — the exact thing `workflowLines` already refuses to do for
  // workflow pointers ("worse than no pointer"). The rule itself is
  // self-contained and stays; only its citation is conditional.
  for (const kit of ['engineer', 'marketing', 'both']) {
    const p = fresh();
    spawnSync('node', [CK, 'init', '--kit', kit], { cwd: p, encoding: 'utf-8' });
    const text = fs.readFileSync(path.join(p, 'CLAUDE.md'), 'utf-8');
    assert.match(text, /Hard stop/, `${kit}: the rule is worth having in every kit`);
    for (const cited of text.match(/`\.claude\/[A-Za-z0-9_./-]+\.md`/g) || []) {
      const rel = cited.replace(/`/g, '');
      assert.ok(fs.existsSync(path.join(p, rel)), `${kit}: CLAUDE.md cites ${rel}, which this kit does not install`);
    }
  }
});
