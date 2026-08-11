/**
 * tail-runtime.cjs — the side-effecting primitives a delivery tail runs on:
 * the shell, the one MCP escape hatch, the run ledger, and the git-derived
 * context. Decisions stay in `delivery-tail.cjs`; parsing in `tail-parse.cjs`.
 *
 * Kept apart so the executor reads as policy — validate, check, run, record —
 * with every call that can touch the world named in one place.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

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

function exec(cmd, root) {
  return spawnSync(cmd, { shell: true, cwd: root, encoding: 'utf-8', maxBuffer: 32 * 1024 * 1024 });
}

/** MCP steps are the only path that needs an agent; the grant is the server, nothing else. */
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

module.exports = { buildContext, exec, execMcp, stateLine };
