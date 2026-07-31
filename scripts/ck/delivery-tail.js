#!/usr/bin/env node

/**
 * delivery-tail.js — deterministic executor for the project-declared post-PR tail (T4.2 / T6.1).
 *
 * Usage: node scripts/ck/delivery-tail.js [--claude-md <path>] [--plan <plan-dir>]
 *                                         [--context k=v ...] [--dry-run]
 *
 * An EXECUTOR, not a script with steps in it: ClauKit declares zero handoff
 * steps. It reads the optional `## Delivery tail` block from the project's
 * CLAUDE.md (one bullet per step; `run` / `needs` / `done-when` / `on-fail`
 * sub-bullets) and runs whatever the project declared. Same single code path
 * whether invoked by `/ck:git pr` step 5 or by hand on resume.
 *
 * WHY NO LLM ON THE DEFAULT PATH: a declared step carries `run` + `done-when`,
 * so it is deterministic by construction — that is the premise the tail was
 * designed on. Spawning `claude -p` to run `gh issue close` would contradict
 * this script's own reason for existing ("the part spend limits keep eating"),
 * make the outcome depend on parsing model prose, and raise a tool-grant
 * question with no good answer (an allowlist derived from the declaration is
 * derived from the very input it would be protecting against). Steps that
 * genuinely need an agent declare `run: mcp <server> <tool> [json]`, and only
 * that path spawns `claude -p` — with `--allowedTools mcp__<server>__*` and no
 * Bash at all, narrow by construction rather than by parsing.
 *
 * Semantics (canonical in skills/software/git/SKILL.md):
 *   - declaration order · `done-when` evaluated FIRST (already satisfied ⇒
 *     SKIPPED, no second write) · re-checked after `run`
 *   - a step with no `done-when` runs ONCE and is never retried
 *   - failure (non-zero, unresolved input, missing tool) ⇒ PASTE-READY payload
 *     and CONTINUE. Never retries, never prompts, always exits 0
 *   - one STATE.md line per step when --plan is given
 *   - unparseable step → reported and skipped, never aborts the run
 *   - NO declaration (absent/empty/commented-out block) → no-op, exit 0
 *
 * --dry-run resolves every placeholder and prints the exact commands that
 * would run, without executing anything. Run it once before trusting a tail.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { repoRoot } = require('./lib/common');

/** Extract the `## Delivery tail` section; returns raw markdown or null. */
function extractTailBlock(md) {
  const lines = md.split('\n');
  const start = lines.findIndex(l => /^##\s+Delivery tail/i.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start + 1, end).join('\n');
}

/** Parse declared steps: top-level bullets with run/needs/done-when/on-fail sub-bullets. */
function parseSteps(block) {
  const steps = [];
  const bad = [];
  // strip HTML comments (the shipped sample is commented out = not declared)
  const visible = block.replace(/<!--[\s\S]*?-->/g, '');
  let current = null;
  for (const line of visible.split('\n')) {
    const top = line.match(/^-\s+\*\*(.+?)\*\*\s*$/) || line.match(/^-\s+([^\s*].*?)\s*$/);
    const sub = line.match(/^\s+-\s+(run|needs|done-when|on-fail):\s*(.+)$/);
    if (top && !sub) {
      if (current) (current.run ? steps : bad).push(current);
      current = { name: top[1].trim() };
    } else if (sub && current) {
      current[sub[1]] = sub[2].trim();
    }
  }
  if (current) (current.run ? steps : bad).push(current);
  return { steps, bad };
}

/**
 * `\`cmd\` = \`expected\`` → {cmd, expected}. An empty or absent expected means
 * "satisfied iff the command exits 0". Backticks are optional.
 */
function parseDoneWhen(raw) {
  if (!raw) return null;
  const m = raw.match(/^`([^`]+)`\s*(?:=\s*`([^`]*)`)?\s*$/)
    || raw.match(/^(.+?)\s*=\s*(.*)$/);
  if (!m) return { cmd: raw.trim(), expected: null };
  const expected = (m[2] || '').trim();
  return { cmd: m[1].trim(), expected: expected === '' ? null : expected };
}

function strip(s) {
  return s.replace(/^`|`$/g, '').trim();
}

/** Context from --context k=v plus git-derived built-ins. */
function buildContext(pairs, root) {
  const ctx = {};
  const git = args => {
    const r = spawnSync('git', args, { cwd: root, encoding: 'utf-8' });
    return r.status === 0 ? r.stdout.trim() : null;
  };
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const sha = git(['rev-parse', '--short', 'HEAD']);
  if (branch) ctx.branch = branch;
  if (sha) ctx.sha = sha;
  for (const p of pairs) {
    const i = String(p).indexOf('=');
    if (i > 0) ctx[p.slice(0, i).trim()] = p.slice(i + 1);
  }
  return ctx;
}

/** Substitute {{name}}. Returns {text, missing:[names]} — never emits a literal {{…}}. */
function resolve(text, ctx) {
  const missing = [];
  const out = String(text).replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => {
    if (Object.prototype.hasOwnProperty.call(ctx, k)) return ctx[k];
    missing.push(k);
    return `{{${k}}}`;
  });
  return { text: out, missing: [...new Set(missing)] };
}

function exec(cmd, root) {
  return spawnSync(cmd, { shell: true, cwd: root, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 });
}

/** MCP steps are the only path that needs an agent; grant is the server, nothing else. */
function execMcp(runSpec, root) {
  const m = runSpec.match(/^mcp\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (!m) return { status: 1, stderr: `malformed mcp step: expected 'mcp <server> <tool> [json]', got: ${runSpec}` };
  const [, server, tool, payload] = m;
  const prompt = `Call the MCP tool ${tool} on server ${server}${payload ? ` with arguments: ${payload}` : ''}. Report only the tool result.`;
  const res = spawnSync('claude', ['-p', prompt, '--allowedTools', `mcp__${server}__*`], {
    cwd: root, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024,
  });
  if (res.error && res.error.code === 'ENOENT') return { status: 1, stderr: 'claude CLI not found on PATH (required for mcp steps)' };
  return res;
}

function stateLine(planDir, line) {
  if (!planDir) return;
  try {
    fs.appendFileSync(path.join(planDir, 'STATE.md'), line + '\n');
  } catch { /* ledger is best-effort; the run must not die on it */ }
}

function pasteReady(step, cmd, res) {
  const err = (res.stderr || res.stdout || '').trim().split('\n').slice(0, 5).join('\n    ');
  return [
    `FAILED: ${step.name}`,
    `  run by hand:  ${cmd}`,
    err ? `  reason:       ${err}` : null,
    step['done-when'] ? `  done when:    ${strip(step['done-when'])}` : null,
  ].filter(Boolean).join('\n');
}

/** Evaluate done-when. Returns true (satisfied), false (not), or null (no check declared). */
function isDone(step, ctx, root) {
  const dw = parseDoneWhen(step['done-when']);
  if (!dw) return null;
  const { text, missing } = resolve(dw.cmd, ctx);
  if (missing.length) return false;
  const res = exec(text, root);
  if (dw.expected === null) return res.status === 0;
  return res.status === 0 && (res.stdout || '').trim() === dw.expected;
}

function runStep(step, ctx, root, planDir) {
  const isMcp = /^mcp\s/.test(strip(step.run));
  const { text: cmd, missing } = resolve(strip(step.run), ctx);

  if (missing.length) {
    console.log(pasteReady(step, cmd, { stderr: `unresolved input(s): ${missing.join(', ')}${step.needs ? ` — declared needs: ${step.needs}` : ''}` }));
    stateLine(planDir, `finish: tail ${step.name} → FAILED (missing input: ${missing.join(', ')})`);
    return 'failed';
  }

  if (isDone(step, ctx, root) === true) {
    console.log(`SKIPPED (idempotent): ${step.name}`);
    stateLine(planDir, `finish: tail ${step.name} → SKIPPED (idempotent)`);
    return 'skipped';
  }

  const res = isMcp ? execMcp(cmd, root) : exec(cmd, root);
  const after = isDone(step, ctx, root);
  const succeeded = after === null ? res.status === 0 : after === true;

  if (!succeeded) {
    console.log(pasteReady(step, cmd, res));
    stateLine(planDir, `finish: tail ${step.name} → FAILED (paste-ready emitted)`);
    return 'failed';
  }
  console.log(`DONE: ${step.name}`);
  stateLine(planDir, `finish: tail ${step.name} → DONE`);
  return 'done';
}

function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const opt = name => {
    const i = argv.indexOf(name);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : null;
  };
  const planDir = opt('--plan');
  const pairs = argv.flatMap((a, i) => (a === '--context' && i + 1 < argv.length ? [argv[i + 1]] : []));

  const root = repoRoot() || process.cwd();
  const claudeMdPath = opt('--claude-md') || path.join(root, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) process.exit(0);            // nothing declared
  const block = extractTailBlock(fs.readFileSync(claudeMdPath, 'utf-8'));
  if (!block || !block.trim()) process.exit(0);                 // nothing declared

  const { steps, bad } = parseSteps(block);
  for (const b of bad) console.error(`[delivery-tail] step '${b.name}' has no run: — reported and skipped (never aborts the PR)`);
  if (steps.length === 0) process.exit(0);                      // block present, zero runnable steps

  const ctx = buildContext(pairs, root);

  if (dryRun) {
    console.log(`# parsed ${steps.length} step(s): ${steps.map(s => s.name).join(' → ')}`);
    console.log('# dry run — nothing is executed. Commands below are fully resolved:');
    for (const s of steps) {
      const r = resolve(strip(s.run), ctx);
      const dw = parseDoneWhen(s['done-when']);
      console.log(`\n${s.name}:`);
      console.log(`  run:       ${r.text}${r.missing.length ? `   <-- UNRESOLVED: ${r.missing.join(', ')}` : ''}`);
      if (dw) {
        const d = resolve(dw.cmd, ctx);
        console.log(`  done-when: ${d.text}${dw.expected === null ? '  (exit 0)' : `  ==  ${dw.expected}`}`);
      } else {
        console.log('  done-when: (none — runs once, never retried)');
      }
    }
    return;
  }

  const tally = { done: 0, skipped: 0, failed: 0 };
  for (const s of steps) tally[runStep(s, ctx, root, planDir)]++;
  console.log(`TAIL COMPLETE: ${tally.done}/${steps.length} done, ${tally.skipped} skipped, ${tally.failed} failed`);
  process.exit(0); // failed steps emitted paste-ready payloads — never a dead end
}

if (require.main === module) main();

module.exports = { extractTailBlock, parseSteps, parseDoneWhen, resolve, buildContext };
