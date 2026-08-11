/**
 * Tests for plan-lint.cjs — the mechanical plan hand-over gate.
 *
 * The gate's value is entirely in what it refuses, so each silent-failure shape
 * it was written for gets its own case: a missing Global Constraints block (the
 * one that makes phase-brief.cjs degrade without erroring), a prose exit gate
 * (the one that makes a run-state resume unverifiable), and an unticked or
 * incomplete sign-off. Phase discovery is asserted to match phase-brief.cjs's
 * resolution order, since a linter that inspects different phases than the
 * brief generator would prove nothing.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT = path.join(__dirname, '..', '.claude', 'scripts', 'ck', 'plan-lint.cjs');
const BRIEF = path.join(__dirname, '..', '.claude', 'scripts', 'ck', 'phase-brief.cjs');

const CONSTRAINTS = ['## Global Constraints', '', '- code files under 200 lines', '- node >= 20.10', ''].join('\n');

const SIGNOFF = [
  '## Plan Completeness',
  '',
  '- [x] spec coverage — every requirement maps to a phase',
  '- [x] placeholder scan clean',
  '- [x] Interfaces blocks consistent across phases',
  '- [x] every phase gate is a runnable command with a stated expected result',
  '- [x] Global Constraints values verbatim, not referenced',
  '- [x] scope option recorded — N/A, single layer',
  '',
].join('\n');

function phaseBody(n, iface = true) {
  return [
    `## Phase ${n} — step ${n}`,
    '',
    ...(iface ? ['**Interfaces**', `- Produces: \`step${n}(): void\` — from \`src/step${n}.ts\``, ''] : []),
    `**Exit gate:** \`npm test -- step${n}.test.js\` → 3 pass, 0 fail`,
    '',
  ].join('\n');
}

/** Write a plan dir; `parts` overrides any section. Returns the dir. */
function makePlan(parts = {}, extraFiles = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-planlint-'));
  const body = [
    '# Plan — a thing',
    '',
    parts.constraints === undefined ? CONSTRAINTS : parts.constraints,
    parts.phases === undefined ? phaseBody(1) + '\n' + phaseBody(2) : parts.phases,
    parts.signoff === undefined ? SIGNOFF : parts.signoff,
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'plan.md'), body);
  for (const [name, content] of Object.entries(extraFiles)) fs.writeFileSync(path.join(dir, name), content);
  return dir;
}

function lint(dir, ...args) {
  return spawnSync('node', [SCRIPT, dir, ...args], { encoding: 'utf-8' });
}

test('a complete plan passes', () => {
  const res = lint(makePlan());
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /plan-lint PASS — 2 phase\(s\)/);
  assert.match(res.stdout, /attested-only/, 'must not imply the unverifiable items were checked');
});

test('missing Global Constraints fails — the shape phase-brief.cjs degrades on', () => {
  const dir = makePlan({ constraints: '' });
  const res = lint(dir);
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[global-constraints\].*no `## Global Constraints`/);

  // The paired proof: phase-brief still exits 0 on this same plan, which is why
  // the linter has to be the gate.
  const brief = spawnSync('node', [BRIEF, dir, '1'], { encoding: 'utf-8' });
  assert.strictEqual(brief.status, 0);
  assert.match(fs.readFileSync(brief.stdout.trim(), 'utf-8'), /declares no Global Constraints/);
});

test('an empty Global Constraints block fails', () => {
  const res = lint(makePlan({ constraints: '## Global Constraints\n' }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /Global Constraints` block is empty/);
});

test('a prose exit gate fails — resume cannot re-derive it', () => {
  const phases = phaseBody(1) + '\n## Phase 2 — step 2\n\n**Interfaces**\n- Consumes: `step1()`\n\n**Exit gate:** tests pass\n';
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[exit-gate\].*phase 2.*no expected result/);
});

test('a missing exit gate fails', () => {
  const phases = phaseBody(1) + '\n## Phase 2 — step 2\n\n**Interfaces**\n- Consumes: `step1()`\n';
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[exit-gate\].*phase 2.*no `\*\*Exit gate:\*\*`/);
});

test('Interfaces required once phases interlock, not for a single phase', () => {
  const multi = lint(makePlan({ phases: phaseBody(1) + '\n' + phaseBody(2, false) }));
  assert.strictEqual(multi.status, 1);
  assert.match(multi.stderr, /\[interfaces\].*phase 2/);

  const solo = lint(makePlan({ phases: phaseBody(1, false) }));
  assert.strictEqual(solo.status, 0, solo.stderr);
});

test('no phases at all fails', () => {
  const res = lint(makePlan({ phases: '' }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[phases\].*no phases found/);
});

test('banned placeholders fail, with the line cited', () => {
  const phases = phaseBody(1).replace('**Exit gate:**', '- add appropriate error handling\n\n**Exit gate:**');
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[placeholder\] plan\.md:\d+.*appropriate error handling/);
});

test('a placeholder inside a fenced block is not a violation', () => {
  const phases = phaseBody(1).replace('**Exit gate:**', '```\nstatus: TBD\n```\n\n**Exit gate:**');
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 0, res.stderr);
});

test('a quoted or backticked ban-list citation is not a violation', () => {
  // The shape the repo's own plan hit: a plan that documents the No-Placeholders
  // rule by quoting every banned phrase.
  const cite = '- **No Placeholders** rule — "TBD", "add appropriate error handling", `handle edge cases` are plan failures.';
  const phases = phaseBody(1).replace('**Exit gate:**', cite + '\n\n**Exit gate:**');
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 0, res.stderr);
});

test('`**Acceptance:** <cmd> → <expected>` counts as an exit gate', () => {
  // Same contract under the label the real plan uses; the gate enforces rigor,
  // not vocabulary.
  const phases = phaseBody(1) + [
    '## Phase 2 — step 2',
    '',
    '**Interfaces:** none — no cross-phase surface',
    '',
    '- **Acceptance:** `npm test` → 1..186, 0 fail',
    '',
  ].join('\n');
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 0, res.stderr);
});

test('`**Interfaces:** none` is a recorded decision and passes; silence does not', () => {
  const declared = phaseBody(1) + '\n## Phase 2 — step 2\n\n**Interfaces:** none — independent workstream\n\n**Exit gate:** `npm test` → 0 fail\n';
  assert.strictEqual(lint(makePlan({ phases: declared })).status, 0);

  const silent = phaseBody(1) + '\n## Phase 2 — step 2\n\n**Exit gate:** `npm test` → 0 fail\n';
  const res = lint(makePlan({ phases: silent }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /\[interfaces\].*phase 2/);
});

test('a missing sign-off block fails', () => {
  const res = lint(makePlan({ signoff: '' }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /never declares itself finished/);
});

test('an unticked sign-off item fails', () => {
  const res = lint(makePlan({ signoff: SIGNOFF.replace('- [x] placeholder scan clean', '- [ ] placeholder scan clean') }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /unticked sign-off/);
});

test('a sign-off missing a required item fails', () => {
  const res = lint(makePlan({ signoff: SIGNOFF.split('\n').filter(l => !l.includes('scope option')).join('\n') }));
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, /never covers "scope"/);
});

test('a dedicated phase file wins over the plan.md section, as phase-brief resolves it', () => {
  // plan.md's phase 2 is broken; the phase file is correct → the file is what counts.
  const phases = phaseBody(1) + '\n## Phase 2 — step 2\n\n**Exit gate:** tests pass\n';
  const dir = makePlan({ phases }, {
    'phase-2-step-2.md': ['# Phase 2', '', '**Interfaces**', '- Consumes: `step1(): void`', '', '**Exit gate:** `npm test -- step2.test.js` → 4 pass, 0 fail', ''].join('\n'),
  });
  const res = lint(dir);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /2 phase\(s\)/);
});

test('a multi-dir plan with no scope table warns but still passes', () => {
  const phases = phaseBody(1) + '\n' + phaseBody(2).replace('src/step2.ts', 'tests/step2.test.js');
  const res = lint(makePlan({ phases }));
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /⚠ .*no scope options table/);
});

test('--warn-only reports violations without closing the gate', () => {
  const res = lint(makePlan({ constraints: '' }), '--warn-only');
  assert.strictEqual(res.status, 0);
  assert.match(res.stderr, /plan-lint FAIL/);
});

test('a missing plan.md exits 2, distinct from a lint failure', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-planlint-empty-'));
  assert.strictEqual(lint(dir).status, 2);
  assert.strictEqual(spawnSync('node', [SCRIPT], { encoding: 'utf-8' }).status, 2);
});

test('accepts plan.md itself, not only its directory', () => {
  const res = lint(path.join(makePlan(), 'plan.md'));
  assert.strictEqual(res.status, 0, res.stderr);
});
