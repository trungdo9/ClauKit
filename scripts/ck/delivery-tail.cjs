#!/usr/bin/env node

/**
 * delivery-tail.cjs — deterministic executor for the project-declared post-PR tail (T4.2 / T6.1).
 *
 * Usage: node scripts/ck/delivery-tail.cjs [--claude-md <path>] [--plan <plan-dir>]
 *                                          [--context k=v ...] [--dry-run] [--approve]
 *
 * An EXECUTOR, not a script with steps in it: ClauKit declares zero handoff
 * steps. It reads the optional `## Delivery tail` block from the project's
 * CLAUDE.md (one bullet per step; `run` / `needs` / `done-when` / `on-fail`
 * sub-bullets) and runs whatever the project declared. Same single code path
 * whether invoked by `/ck:git pr` step 5 or by hand on resume.
 *
 * Parsing and substitution live in `lib/tail-parse.cjs`; approval policy and the
 * printed payloads in `lib/tail-checks.cjs`. This file executes and nothing else
 * — the previous single 357-line unit held six defects at once, all of them in
 * the parsing half, with no seam to test them at.
 *
 * WHY NO LLM ON THE DEFAULT PATH: a declared step carries `run` + `done-when`,
 * so it is deterministic by construction. Spawning `claude -p` to run
 * `gh issue close` would contradict this script's own reason for existing ("the
 * part spend limits keep eating") and make the outcome depend on parsing model
 * prose. Steps that genuinely need an agent declare `run: mcp <server> <tool>
 * [json]`; only that path spawns `claude -p`, with `--allowedTools
 * mcp__<server>__*` and no Bash at all.
 *
 * **Execution semantics are canonical in skills/software/git/SKILL.md** and are
 * deliberately not restated here — order, done-when-first idempotency, run-once
 * without a check, paste-ready-and-continue, the STATE.md line, and no-op on an
 * absent declaration all live there.
 */

const fs = require('fs');
const path = require('path');
const { repoRoot } = require('./lib/common.cjs');
const { extractTailBlock, parseSteps, parseDoneWhen, strip, resolve } = require('./lib/tail-parse.cjs');
const { fingerprint, isApproved, approve, refusedPayload, dryRunReport } = require('./lib/tail-checks.cjs');
const { buildContext, exec, execMcp, stateLine } = require('./lib/tail-runtime.cjs');

function pasteReady(step, cmd, res) {
  const err = (res.stderr || res.stdout || '').trim().split('\n').slice(0, 5).join('\n    ');
  return [
    `FAILED: ${step.name}`,
    `  run by hand:  ${cmd}`,
    err ? `  reason:       ${err}` : null,
    step['done-when'] ? `  done when:    ${strip(step['done-when'])}` : null,
  ].filter(Boolean).join('\n');
}

/**
 * The done-when check, resolved but not run — or null when none is declared.
 *
 * BOTH sides carry placeholders (`\`gh pr view {{pr}}\` = \`{{state}}\``), and
 * only the command side was ever resolved. The expected side's `{{…}}` stayed a
 * literal, so the comparison could never match: the step ran on every
 * invocation and was reported FAILED each time, however well its command
 * worked. Unsafe metacharacters are refused on the command side only — the
 * expected value is compared to stdout, never executed.
 */
function checkSpec(step, ctx) {
  const dw = parseDoneWhen(step['done-when']);
  if (!dw) return null;
  const cmd = resolve(dw.cmd, ctx);
  const exp = dw.expected === null ? { text: null, missing: [] } : resolve(dw.expected, ctx);
  return {
    dw,
    text: cmd.text,
    expected: exp.text,
    missing: [...new Set([...cmd.missing, ...exp.missing])],
    unsafe: cmd.unsafe,
  };
}

/** Evaluate done-when. Returns true (satisfied), false (not), or null (none declared). */
function isDone(spec, root) {
  if (!spec) return null;
  const res = exec(spec.text, root);
  if (spec.expected === null) return res.status === 0;
  return res.status === 0 && (res.stdout || '').trim() === spec.expected;
}

/** A step whose placeholders cannot be resolved fails BEFORE anything executes. */
function blockingReason(what, r, step) {
  if (r.unsafe.length) {
    return `refusing to substitute value(s) containing shell metacharacters in ${what}: ${r.unsafe.join(', ')}\n`
      + '    A value may not restructure the command it is spliced into. Quote it in the\n'
      + '    declaration, or pass a sanitised value via --context.';
  }
  if (r.missing.length) {
    return `unresolved input(s) in ${what}: ${r.missing.join(', ')}${step.needs ? ` — declared needs: ${step.needs}` : ''}`;
  }
  return null;
}

function runStep(step, ctx, root, planDir) {
  const isMcp = /^mcp\s/.test(strip(step.run));
  const run = resolve(strip(step.run), ctx);
  const cmd = run.text;
  const spec = checkSpec(step, ctx);

  // The check's placeholders are validated with the command's. Returning a bare
  // `false` for an unresolved done-when meant the step EXECUTED (writing a
  // second time on every re-run) and was then reported FAILED with no reason —
  // both halves of the idempotency contract broken by one missing branch.
  for (const [what, r] of [['run', run], ...(spec ? [['done-when', spec]] : [])]) {
    const reason = blockingReason(what, r, step);
    if (!reason) continue;
    console.log(pasteReady(step, cmd, { stderr: reason }));
    const kind = r.unsafe.length
      ? `REFUSED (unsafe substitution in ${what}: ${r.unsafe.map(u => u.split('=')[0]).join(', ')})`
      : `FAILED (missing input in ${what}: ${r.missing.join(', ')})`;
    stateLine(planDir, `finish: tail ${step.name} → ${kind}`);
    return 'failed';
  }

  if (isDone(spec, root) === true) {
    console.log(`SKIPPED (idempotent): ${step.name}`);
    stateLine(planDir, `finish: tail ${step.name} → SKIPPED (idempotent)`);
    return 'skipped';
  }

  const res = isMcp ? execMcp(cmd, root) : exec(cmd, root);
  const after = isDone(spec, root);
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

  const { steps, bad, warn } = parseSteps(block);
  for (const b of bad) console.error(`[delivery-tail] step '${b.name}' has no run: — reported and skipped (never aborts the PR)`);
  for (const w of warn) console.error(`[delivery-tail] ${w}`);
  if (steps.length === 0) process.exit(0);                      // block present, zero runnable steps

  const ctx = buildContext(pairs, root);
  const fp = fingerprint(steps);

  if (argv.includes('--approve')) {
    approve(root, fp);
    console.log(`approved delivery tail ${fp} for ${root}`);
    return;
  }

  if (!dryRun && !isApproved(root, fp)) {
    console.log(refusedPayload({ fp, root, claudeMdPath, planDir, steps }));
    stateLine(planDir, `finish: tail REFUSED (unapproved declaration ${fp}, ${steps.length} step(s))`);
    process.exit(0); // never a dead end — the PR itself is already open
  }

  if (dryRun) {
    console.log(dryRunReport(steps, ctx));
    return;
  }

  const tally = { done: 0, skipped: 0, failed: 0 };
  for (const s of steps) tally[runStep(s, ctx, root, planDir)]++;
  console.log(`TAIL COMPLETE: ${tally.done}/${steps.length} done, ${tally.skipped} skipped, ${tally.failed} failed`);
  process.exit(0); // failed steps emitted paste-ready payloads — never a dead end
}

if (require.main === module) main();

module.exports = { extractTailBlock, parseSteps, parseDoneWhen, resolve, buildContext };
