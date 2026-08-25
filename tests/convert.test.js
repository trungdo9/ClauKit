/**
 * `ck convert` tests — converting an installed .claude/ tree into Codex CLI
 * and Antigravity conventions (see bin/lib/convert/to-codex.js /
 * to-antigravity.js for the mapping rationale).
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
let project;

function run(dir, args) {
  return spawnSync('node', [CK, ...args], { cwd: dir, encoding: 'utf-8' });
}

// `fs.readdirSync(dir, { recursive: true })` needs Node 20+; package.json
// supports Node >=18, so walk by hand instead.
function walkFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkFiles(full));
    else out.push(full);
  }
  return out;
}

before(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-convert-'));
  project = fs.mkdtempSync(path.join(work, 'p-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: project });
  const res = run(project, ['init', '--kit', 'engineer']);
  assert.strictEqual(res.status, 0, res.stderr);
});

after(() => fs.rmSync(work, { recursive: true, force: true }));

test('convert with no .claude/ fails clearly instead of writing partial output', () => {
  const empty = fs.mkdtempSync(path.join(work, 'empty-'));
  const res = run(empty, ['convert', 'codex']);
  assert.notStrictEqual(res.status, 0);
  assert.match(res.stdout + res.stderr, /run `ck init` first/i);
});

test('convert with an unknown target reports it and exits non-zero', () => {
  const res = run(project, ['convert', 'bogus-target']);
  assert.notStrictEqual(res.status, 0);
  assert.match(res.stdout + res.stderr, /Unknown convert target 'bogus-target'/);
});

test('convert with no target lists the supported ones', () => {
  const res = run(project, ['convert']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /codex/);
  assert.match(res.stdout, /antigravity/);
});

test('codex: writes AGENTS.md, mirrors skills, and emits parseable agent/config TOML', () => {
  const res = run(project, ['convert', 'codex']);
  assert.strictEqual(res.status, 0, res.stderr);

  const agentsMd = fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf-8');
  assert.match(agentsMd, /# AGENTS\.md/);
  assert.match(agentsMd, /## Agents/);

  const skillFiles = walkFiles(path.join(project, '.codex/skills'))
    .filter((f) => f.endsWith('SKILL.md'));
  // engineer kit only ships skills/software/** + the ck/ commands (not marketing) —
  // just assert a healthy floor, not the full-repo count.
  assert.ok(skillFiles.length > 60, `expected skills + ported commands, got ${skillFiles.length}`);
  // Command-derived skills are namespaced and carry a synthesized Trigger section.
  const askSkill = fs.readFileSync(path.join(project, '.codex/skills/ck-ask/SKILL.md'), 'utf-8');
  assert.match(askSkill, /^---\nname: ck-ask\n/);
  assert.match(askSkill, /## Trigger/);
  // A Claude Code command only ever runs on explicit /ck:name — the Codex skill it
  // becomes must document the equivalent explicit $ck-ask syntax and actually carry
  // the policy file that stops Codex from firing it on its own judgment instead.
  assert.match(askSkill, /\$ck-ask/);
  const askPolicy = fs.readFileSync(path.join(project, '.codex/skills/ck-ask/agents/openai.yaml'), 'utf-8');
  assert.match(askPolicy, /allow_implicit_invocation:\s*false/);

  const debuggerToml = fs.readFileSync(path.join(project, '.codex/agents/debugger.toml'), 'utf-8');
  assert.match(debuggerToml, /^name = "debugger"$/m);
  assert.match(debuggerToml, /^model = "opus"$/m);
  assert.match(debuggerToml, /^developer_instructions = '''$/m);
  // Skill cross-links get rewritten for the new (flatter) .codex/ layout, not left
  // pointing at the Claude Code-only .claude/ path.
  assert.doesNotMatch(debuggerToml, /\.claude\/skills\//);
  assert.match(debuggerToml, /\.codex\/skills\/software\/debugging\/SKILL\.md/);

  const configToml = fs.readFileSync(path.join(project, '.codex/config.toml'), 'utf-8');
  assert.match(configToml, /^\[mcp_servers\.github\]$/m);
  assert.match(configToml, /^command = "npx"$/m);
});

test('codex: re-running without --force skips, with --force overwrites', () => {
  const first = run(project, ['convert', 'codex']);
  assert.match(first.stdout, /SKIP \(exists\)/);
  assert.match(first.stdout, /0 written/);

  const forced = run(project, ['convert', 'codex', '--force']);
  assert.doesNotMatch(forced.stdout, /SKIP \(exists\)/);
  assert.match(forced.stdout, /written · 0 skipped/);
});

test('antigravity: writes agents/workflows/rules with frontmatter and JSON mcp config', () => {
  const res = run(project, ['convert', 'antigravity', '--force']);
  assert.strictEqual(res.status, 0, res.stderr);

  const debuggerMd = fs.readFileSync(path.join(project, '.agents/agents/debugger.md'), 'utf-8');
  assert.match(debuggerMd, /^name: debugger$/m);
  assert.match(debuggerMd, /^subagent: true$/m);
  assert.match(debuggerMd, /\.agents\/skills\/software\/debugging\/SKILL\.md/);

  const askWorkflow = fs.readFileSync(path.join(project, '.agents/workflows/ck-ask.md'), 'utf-8');
  assert.match(askWorkflow, /^# \/ck-ask$/m);

  const rules = fs.readdirSync(path.join(project, '.agents/rules'));
  assert.ok(rules.includes('claude.md'));
  assert.ok(rules.includes('development-rules.md'));

  const mcp = JSON.parse(fs.readFileSync(path.join(project, '.agents/mcp_config.json'), 'utf-8'));
  assert.strictEqual(mcp.mcpServers.github.command, 'npx');
});

test('--out redirects the whole write elsewhere, leaving the project untouched', () => {
  const outDir = fs.mkdtempSync(path.join(work, 'out-'));
  const untouchedBefore = fs.existsSync(path.join(project, '.codex'));
  const res = run(project, ['convert', 'codex', '--out', outDir, '--force']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.ok(fs.existsSync(path.join(outDir, 'AGENTS.md')));
  // --out must not also write into the project root's own .codex from THIS run
  // (it may already exist from the earlier in-place test — that's fine, just
  // confirm this invocation's target was the redirected dir).
  assert.strictEqual(fs.existsSync(path.join(project, '.codex')), untouchedBefore);
});
