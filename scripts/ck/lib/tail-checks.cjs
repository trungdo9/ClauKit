/**
 * tail-checks.cjs — approval policy and the payloads a delivery tail prints.
 * Parsing lives in `lib/tail-parse.cjs`, execution in `scripts/ck/delivery-tail.cjs`.
 *
 * Nothing here executes a declared step, which is the point of the seam: the
 * fingerprint that arms a tail and the text that tells a human how to review it
 * are testable without running anything.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { strip, parseDoneWhen, resolve } = require('./tail-parse.cjs');

/**
 * Fingerprint of the EXECUTABLE content of a tail — names, commands, checks.
 * Reformatting or re-wording prose around it does not change the hash.
 */
function fingerprint(steps) {
  const canon = steps.map(s => [s.name, strip(s.run || ''), strip(s['done-when'] || ''), s['on-fail'] || '']
    .map(v => v.replace(/\s+/g, ' ').trim()).join(' ')).join('\n');
  return crypto.createHash('sha256').update(canon).digest('hex').slice(0, 16);
}

function approvalPath(root) {
  return path.join(root, '.claude', '.ck-tail-approved');
}

/**
 * The tail is read out of the project's CLAUDE.md — a TRACKED file that
 * arrives via `git pull` or a merged PR. Without this check, a four-line
 * change that reviews as a docs edit becomes code execution on every
 * maintainer's next `/ck:git pr`, unattended.
 *
 * So: run only a tail whose executable content someone approved on this
 * machine. Unchanged tail → still fully unattended, which is the point.
 * Changed or first-seen → refuse, print it, and say how to approve. Modelled
 * on `direnv allow`, for the same reason direnv needs it.
 */
function isApproved(root, fp) {
  try {
    return fs.readFileSync(approvalPath(root), 'utf-8').split(/\s+/).includes(fp);
  } catch {
    return false;
  }
}

function approve(root, fp) {
  const p = approvalPath(root);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, fp + '\n');
  return p;
}

/**
 * The refusal — the ONLY place that tells a user how to review and arm a tail.
 * Both commands in it are pasted by hand, so the script path must be the real
 * one: it printed `delivery-tail.js` for a release after the `.cjs` rename, so
 * both lines exited 1 with "Cannot find module" and the tail stayed refused for
 * anyone who did not guess the extension.
 */
function refusedPayload({ fp, root, claudeMdPath, planDir, steps }) {
  return [
    `REFUSED: this delivery tail (${fp}) has not been approved on this machine.`,
    '',
    `  The tail is read from ${path.relative(root, claudeMdPath) || 'CLAUDE.md'}, which is tracked in git — a`,
    '  merged pull request can add or change steps, and they would otherwise run',
    '  unattended on the next `/ck:git pr`.',
    '',
    `  Review it:   node scripts/ck/delivery-tail.cjs --dry-run${planDir ? ` --plan ${planDir}` : ''}`,
    '  Approve it:  node scripts/ck/delivery-tail.cjs --approve',
    '',
    `  Steps declared: ${steps.map(s => s.name).join(' → ')}`,
  ].join('\n');
}

/** Every command a run would issue, fully resolved, executing nothing. */
function dryRunReport(steps, ctx) {
  const out = [
    `# parsed ${steps.length} step(s): ${steps.map(s => s.name).join(' → ')}`,
    '# dry run — nothing is executed. Commands below are fully resolved:',
  ];
  for (const s of steps) {
    const r = resolve(strip(s.run), ctx);
    const dw = parseDoneWhen(s['done-when']);
    out.push('', `${s.name}:`);
    out.push(`  run:       ${r.text}${r.missing.length ? `   <-- UNRESOLVED: ${r.missing.join(', ')}` : ''}`);
    if (!dw) {
      out.push('  done-when: (none — runs once, never retried)');
      continue;
    }
    const d = resolve(dw.cmd, ctx);
    const e = dw.expected === null ? null : resolve(dw.expected, ctx);
    const unresolved = [...new Set([...d.missing, ...(e ? e.missing : [])])];
    out.push(`  done-when: ${d.text}${e === null ? '  (exit 0)' : `  ==  ${e.text}`}`
      + (unresolved.length ? `   <-- UNRESOLVED: ${unresolved.join(', ')}` : ''));
  }
  return out.join('\n');
}

module.exports = { fingerprint, approvalPath, isApproved, approve, refusedPayload, dryRunReport };
