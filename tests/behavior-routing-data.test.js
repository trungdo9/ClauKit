/**
 * Routing-eval dataset code (phase 03a): PII scrubber, transcript miner,
 * seeded splitter. Synthetic strings and fixture dirs only; the real
 * transcript pool is never touched.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const DIR = path.join(__dirname, 'behavior', 'routing');
const { scrub, loadTerms } = require(path.join(DIR, 'scrub-pii.cjs'));
const { mine } = require(path.join(DIR, 'mine-prompts.cjs'));
const { split } = require(path.join(DIR, 'split-cases.cjs'));

test('scrub: email, url, ip', () => {
  assert.strictEqual(scrub('mail jane.doe+x@example.org now', []), 'mail <EMAIL> now');
  assert.strictEqual(scrub('see https://git.example.com/a/b?c=1 ok', []), 'see <URL> ok');
  assert.strictEqual(scrub('host 10.0.12.255 down', []), 'host <IP> down');
});

test('scrub: secrets', () => {
  const sk = 'sk-' + 'a1B2c3D4e5F6g7H8i9J0';
  const gh = 'ghp_' + 'A1b2C3d4E5f6G7h8I9j0K1l2';
  const aws = 'AKIA' + 'ABCDEFGHIJKLMNOP';
  const slack = 'xoxb-' + '123456789012-abcdefABCDEF';
  for (const s of [sk, gh, aws, slack]) {
    assert.strictEqual(scrub(`key ${s} end`, []), 'key <SECRET> end', s);
  }
  assert.strictEqual(scrub('hash ' + 'deadbeef'.repeat(5) + ' end', []), 'hash <SECRET> end');
  assert.strictEqual(scrub('tok ' + 'Zm9vYmFy0123456789ABCdefGHIjklMNOpq' + ' end', []), 'tok <SECRET> end');
});

test('scrub: ordinary long paths are not secrets; ticket keys', () => {
  const t = 'edit src/components/navigation/sidebar/menu-item-list.tsx please';
  assert.strictEqual(scrub(t, []), t);
  assert.strictEqual(scrub('fix ABC-1234 and XY-7', []), 'fix PROJ-123 and PROJ-123');
});

test('scrub: absolute home paths', () => {
  assert.strictEqual(scrub('open /home/alice/work/app/src/x.js.', []), 'open ~/project/….');
  assert.strictEqual(scrub('open /Users/bob/dev/a b', []), 'open ~/project/… b');
  assert.strictEqual(scrub('open C:\\Users\\carol\\dev\\a.txt now', []), 'open ~/project/… now');
});

test('scrub: terms are case-insensitive, regex-safe, single pass', () => {
  assert.strictEqual(scrub('Ask FooCorp and foocorp', ['foocorp']), 'Ask <CLIENT> and <CLIENT>');
  assert.strictEqual(scrub('a.b axb', ['a.b']), '<CLIENT> axb');
  // a later term must not eat the placeholder an earlier one produced
  assert.strictEqual(scrub('zeta here', ['zeta', 'client']), '<CLIENT> here');
  assert.strictEqual(scrub('x zeta', ['', '  ']), 'x zeta');
});

test('scrub: longest term wins; idempotent; plain prose untouched', () => {
  assert.strictEqual(scrub('Acme Labs rocks', ['acme', 'acme labs']), '<CLIENT> rocks');
  const once = scrub('mail a@b.io at 1.2.3.4 re ABC-9', ['zeta']);
  assert.strictEqual(scrub(once, ['zeta']), once);
  const prose = 'please add a retry to the upload handler and update the docs';
  assert.strictEqual(scrub(prose, []), prose);
});

test('loadTerms: skips blanks and comments, missing file is empty', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'terms-'));
  const f = path.join(d, 't.txt');
  fs.writeFileSync(f, '# note\nAlpha\n\n  Beta Co  \n');
  assert.deepStrictEqual(loadTerms(f), ['Alpha', 'Beta Co']);
  assert.deepStrictEqual(loadTerms(path.join(d, 'nope.txt')), []);
});

const W6 = 'please refactor the billing handler module';           // 6 words
const user = (content, extra) => JSON.stringify({ type: 'user', message: { role: 'user', content }, ...extra });
const cmd = (name, args) =>
  `<command-message>${name}</command-message>\n<command-name>/${name}</command-name>\n<command-args>${args}</command-args>`;

function fixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mine-'));
  const put = (dir, file, lines) => {
    fs.mkdirSync(path.join(root, dir, path.dirname(file)), { recursive: true });
    fs.writeFileSync(path.join(root, dir, file), lines.join('\n') + '\n');
  };
  put('-home-zeta-client', 's1.jsonl', [
    user(W6),                                                              // kept
    user('  ' + W6.toUpperCase() + '  '),                                   // dup after normalise
    user([{ type: 'text', text: 'write unit tests for' }, { type: 'text', text: 'the parser module now' }]), // joined
    user([{ type: 'text', text: 'lots of words in this one here' }, { type: 'tool_result', content: 'x' }]), // skipped
    user([{ type: 'tool_result', content: 'output' }]),                    // skipped
    user(cmd('ck:fix', 'the login page crashes when the cookie expires')), // slash, kept
    user(cmd('ck:fix', 'too short')),                                      // slash <6
    user('too short'),                                                     // <6
    user('<local-command-stdout>' + ' word'.repeat(10) + '</local-command-stdout>'), // starts with <
    user('word '.repeat(400)),                                             // > 1500 chars
    user(W6 + ' meta', { isMeta: true }),                                  // meta
    user(W6 + ' sidechain', { isSidechain: true }),                        // sidechain
    JSON.stringify({ type: 'assistant', message: { content: W6 + ' assistant' } }),
    '{not json',
  ]);
  put('-home-zeta-client', 's1/subagents/agent-1.jsonl', [user('nested subagent prompt should never be mined')]);
  put('-tmp-scratch', 's2.jsonl', [user('scratch harness prompt that must be excluded')]);
  put('-home-gamma', 's3.jsonl', [user(W6)]);                              // dup across dirs
  return root;
}

test('mine: extraction rules, dedupe, exclusions', () => {
  const root = fixtureRoot();
  const { candidates, counts } = mine(root);
  const texts = candidates.map(c => c.text).sort();
  assert.deepStrictEqual(texts, [
    'the login page crashes when the cookie expires',
    'write unit tests for\nthe parser module now',
    W6,
  ].sort());
  assert.deepStrictEqual(candidates.map(c => c.sourceCmd).filter(Boolean), ['ck:fix']);
  for (const c of candidates) {
    assert.match(c.id, /^[0-9a-f]{10}$/);
    assert.match(c.projectHash, /^[0-9a-f]{8}$/);
    assert.deepStrictEqual(Object.keys(c).sort(), ['id', 'projectHash', 'sourceCmd', 'text']);
  }
  assert.strictEqual(counts.files, 2);          // s1 + s3; tmp dir and nested file excluded
  assert.strictEqual(counts.dirsSkippedTmp, 1);
  assert.strictEqual(counts.kept, 3);
  assert.strictEqual(counts.duplicates, 2);
});

test('mine: unreadable root is an empty result', () => {
  assert.strictEqual(mine(path.join(os.tmpdir(), 'no-such-root-xyz')).candidates.length, 0);
});

test('mine CLI: --root/--out, prints counts only (no text, no dir names)', () => {
  const root = fixtureRoot();
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mine-out-')), 'sub', 'candidates.jsonl');
  const r = spawnSync(process.execPath, [path.join(DIR, 'mine-prompts.cjs'), '--root', root, '--out', out], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  const all = r.stdout + r.stderr;
  for (const leak of ['billing', 'parser', 'login', 'zeta', 'client', 'gamma', 'scratch', 'cookie']) {
    assert.ok(!all.toLowerCase().includes(leak), `leaked ${leak}`);
  }
  assert.match(all, /kept\D+3/);
  const rows = fs.readFileSync(out, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows.length, 3);
  const out2 = out + '.env';   // root via env instead of --root
  const r2 = spawnSync(process.execPath, [path.join(DIR, 'mine-prompts.cjs'), '--out', out2],
    { encoding: 'utf8', env: { ...process.env, CK_ROUTING_PROJECTS_ROOT: root } });
  assert.strictEqual(r2.status, 0, r2.stderr);
  assert.strictEqual(fs.readFileSync(out2, 'utf8'), fs.readFileSync(out, 'utf8'));
});

const mk = (n, gate, source = 'transcript') =>
  Array.from({ length: n }, (_, i) => ({ id: `${gate}${source[0]}${i}`, prompt: 'p', expected: [gate], labels: { a: [gate], b: [gate] }, source }));

function corpus() {
  return [...mk(20, 'cook'), ...mk(10, 'tdd'), ...mk(10, 'verify-plan'), ...mk(5, 'cook', 'registry')];
}

test('split: deterministic, pure, order-independent', () => {
  const c = corpus();
  const snap = JSON.stringify(c);
  const a = split(c);
  assert.strictEqual(JSON.stringify(c), snap, 'input mutated');
  assert.deepStrictEqual(split(corpus()), a);
  const rev = split([...corpus()].reverse());
  const byId = o => Object.fromEntries(o.map(x => [x.id, x.split]));
  assert.deepStrictEqual(byId(rev), byId(a));
  assert.deepStrictEqual(a.map(x => x.id), c.map(x => x.id), 'input order preserved');
});

test('split: registry forced to train; strata hit ~30% test', () => {
  const out = split(corpus());
  assert.ok(out.filter(x => x.source === 'registry').every(x => x.split === 'train'));
  const t = g => out.filter(x => x.source === 'transcript' && x.expected[0] === g && x.split === 'test').length;
  assert.strictEqual(t('cook'), 6);
  assert.strictEqual(t('tdd'), 3);
  assert.strictEqual(t('verify-plan'), 3);
});

test('split: seed matters, default seed is 1729, tiny strata stay train', () => {
  const ids = o => o.filter(x => x.split === 'test').map(x => x.id).sort().join();
  assert.strictEqual(ids(split(corpus())), ids(split(corpus(), { seed: 1729 })));
  assert.notStrictEqual(ids(split(corpus())), ids(split(corpus(), { seed: 7 })));
  assert.strictEqual(split(mk(1, 'solo'))[0].split, 'train');
});

test('split CLI: refuses to re-split without --force; counts only', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'split-'));
  const f = path.join(d, 'cases.jsonl');
  fs.writeFileSync(f, corpus().map(x => JSON.stringify(x)).join('\n') + '\n');
  const run = (...a) => spawnSync(process.execPath, [path.join(DIR, 'split-cases.cjs'), '--file', f, ...a], { encoding: 'utf8' });
  const r1 = run();
  assert.strictEqual(r1.status, 0, r1.stderr);
  const rows = fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse);
  assert.ok(rows.every(x => x.split));
  assert.strictEqual(run().status, 2);
  assert.strictEqual(run('--force').status, 0);
  assert.deepStrictEqual(fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse), rows);
});
