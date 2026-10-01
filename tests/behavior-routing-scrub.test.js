/**
 * Scrub ordering and coverage fixes (phase 03 follow-up). Synthetic strings only.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const { scrub } = require(path.join(__dirname, 'behavior', 'routing', 'scrub-pii.cjs'));

test('scrub: URL with a client host is fully scrubbed (urls before terms)', () => {
  const t = 'see https://acme.no/admin/objectinfo/123/revisions/456 ok';
  assert.strictEqual(scrub(t, ['acme']), 'see <URL> ok');
});

test('scrub: email with a client domain is fully scrubbed', () => {
  assert.strictEqual(scrub('mail john.doe@acme.no now', ['acme']), 'mail <EMAIL> now');
});

test('scrub: client terms still replaced in plain prose', () => {
  assert.strictEqual(scrub('ask Acme about it', ['acme']), 'ask <CLIENT> about it');
});

test('scrub: long standalone numbers become <NUM>; IPs stay <IP>', () => {
  assert.strictEqual(scrub('org 933396738 ok', []), 'org <NUM> ok');
  assert.strictEqual(scrub('record 291166 ok', []), 'record <NUM> ok');
  assert.strictEqual(scrub('count 12345 ok', []), 'count 12345 ok');
  assert.strictEqual(scrub('host 10.0.12.255 down', []), 'host <IP> down');
});

test('scrub: /tmp/claude-<uid> paths embedding a project dir become <TMP>', () => {
  const t = 'cat /tmp/claude-1000/-home-alice-acmeapp/abc/scratchpad/x.txt now';
  assert.strictEqual(scrub(t, []), 'cat <TMP> now');
  assert.strictEqual(scrub('see /tmp/claude-501/-Users-bob-acmeapp/z.', []), 'see <TMP>.');
});

test('scrub: acronym-digit tokens are not ticket keys; real keys still are', () => {
  for (const s of ['UTF-8', 'ISO-8859', 'SHA-256', 'RFC-2616', 'TLS-13', 'HTTP-2', 'X-1']) {
    assert.strictEqual(scrub(`use ${s} here`, []), `use ${s} here`, s);
  }
  assert.strictEqual(scrub('fix ABC-12 now', []), 'fix PROJ-123 now');
});
