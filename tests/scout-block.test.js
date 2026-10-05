/**
 * Regression tests for scout-block precision (T1.3 / G6).
 *
 * The original implementation substring-matched blocked dirs, so
 * `grep -v node_modules` (an EXCLUSION) was rejected. These tests pin the
 * fixed semantics: block traversal, allow exclusion contexts.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', '.claude', 'hooks', 'scout-block.cjs');

function runHook(command) {
  const res = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_input: { command } }),
    encoding: 'utf-8',
  });
  return res.status;
}

const ALLOWED = [
  'grep -rn foo . | grep -v node_modules',            // the reproduced false positive
  'grep -rn foo --exclude-dir=node_modules .',
  'rg foo -g !node_modules',
  "find . -path ./node_modules -prune -o -name '*.js' -print",
  "find . -not -path '*/node_modules/*' -name '*.py'",
  'tar --exclude node_modules -czf app.tgz .',
  'npm run build',                                    // bare word, not a path
  'npm run dist',
  'ls -la',
  'cat .env',
  'git status',
  'echo "checking node_modules_backup"',              // prefix, not a path segment — must not match
  'composer install --no-vendor-check',               // bare word, not a path
  'grep -rn foo --exclude-dir=vendor .',
];

const BLOCKED = [
  'cat node_modules/x/y.js',
  "find node_modules -name '*.js'",
  'ls node_modules',
  'cd .git/ && ls',
  'find __pycache__',
  'cat dist/bundle.js',
  'rm -rf build/',
  'du -sh ./node_modules',
  'grep -rn foo node_modules/',                       // traversal even in a grep command
  'cat vendor/autoload.php',
  'ls .venv',
  'find .next -name "*.js"',
];

for (const cmd of ALLOWED) {
  test(`allows: ${cmd}`, () => {
    assert.strictEqual(runHook(cmd), 0, `expected ALLOW for: ${cmd}`);
  });
}

for (const cmd of BLOCKED) {
  test(`blocks: ${cmd}`, () => {
    assert.strictEqual(runHook(cmd), 2, `expected BLOCK for: ${cmd}`);
  });
}

test('rejects invalid JSON', () => {
  const res = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf-8' });
  assert.strictEqual(res.status, 2);
});

test('rejects empty input', () => {
  const res = spawnSync('node', [HOOK], { input: '', encoding: 'utf-8' });
  assert.strictEqual(res.status, 2);
});

// ripgrep's -g is an INCLUDE glob unless the pattern starts with `!`, and the
// `!` form is matched independently — so listing -g/--glob/--iglob as
// "exclusion flags" turned a real traversal into an allowed command.
const HEAVY = ['node', 'modules'].join('_');

test('rg -g <dir> is an include glob and must still be blocked', () => {
  assert.strictEqual(runHook(`rg -g ${HEAVY} foo`), 2);
  assert.strictEqual(runHook(`rg --glob '${HEAVY}/**' foo`), 2);
});

// A heredoc body is data (file content, script source), not arguments — the
// reproduced false positive was a python edit script quoting ".git/,".
test('heredoc body fed to a non-shell is data and passes', () => {
  assert.strictEqual(runHook(`python3 - <<'EOF'\ns = s.replace(".git/,", "dist/")\nEOF\necho done`), 0);
  assert.strictEqual(runHook(`cat > notes.md <<EOF\nsee ${HEAVY}/foo and build/\nEOF`), 0);
  assert.strictEqual(runHook(`cat > a <<-EOF\n\tdist/x\n\tEOF\nls`), 0);
});

test('heredoc body fed to a shell is commands and is still scanned', () => {
  assert.strictEqual(runHook(`bash <<'EOF'\ncat ${HEAVY}/x.js\nEOF`), 2);
  assert.strictEqual(runHook(`cat <<EOF | sh\nls ${HEAVY}\nEOF`), 2);
});

test('commands after the heredoc terminator are still scanned', () => {
  assert.strictEqual(runHook(`cat > f <<EOF\nok\nEOF\nls ${HEAVY}`), 2);
});

test('a newline starts a new command; a backslash continuation does not', () => {
  assert.strictEqual(runHook(`echo hi\nls ${HEAVY}`), 2);
  assert.strictEqual(runHook(`find . -path ./${HEAVY} -prune \\\n  -o -name '*.js' -print`), 0);
});

test("rg -g '!<dir>' is a genuine exclusion and still passes", () => {
  assert.strictEqual(runHook(`rg foo -g '!${HEAVY}'`), 0);
  assert.strictEqual(runHook(`rg foo -g !${HEAVY}`), 0);
});
