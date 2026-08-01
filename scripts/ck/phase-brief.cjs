#!/usr/bin/env node

/**
 * phase-brief.js — extract one phase's full text from a plan into a brief
 * file for a fresh per-phase implementer (T3.2).
 *
 * Usage: node scripts/ck/phase-brief.cjs <plan-dir-or-plan.md> <phase-number>
 *
 * The brief = the plan's Global Constraints block (implicitly part of every
 * phase) + the phase's complete text (from phase-<N>*.md if present, else the
 * `## / ### Phase <N>` section of plan.md). Written to a uniquely named file
 * in the plan's reports/ workspace; the PATH is printed — hand the path to
 * the implementer, never the content (context hygiene: a pasted brief is
 * re-sent on every later turn of the orchestrator).
 */

const fs = require('fs');
const path = require('path');
const { die } = require('./lib/common.cjs');
const { resolveWorkspace } = require('./run-workspace.cjs');

function planDirOf(arg) {
  let dir = path.resolve(arg);
  if (fs.existsSync(dir) && fs.statSync(dir).isFile()) dir = path.dirname(dir);
  return dir;
}

/** Extract a `## <heading>` (any level) section by regex from markdown. */
function extractSection(md, headingRe) {
  const lines = md.split('\n');
  const start = lines.findIndex(l => headingRe.test(l));
  if (start === -1) return null;
  const level = (lines[start].match(/^#+/) || ['##'])[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+)\s/);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}

function main() {
  const [arg, phaseArg] = process.argv.slice(2);
  if (!arg || !phaseArg || !/^\d+(\.\d+)?$/.test(phaseArg)) {
    die('usage: phase-brief.js <plan-dir-or-plan.md> <phase-number>');
  }
  const dir = planDirOf(arg);
  const planMd = path.join(dir, 'plan.md');
  if (!fs.existsSync(planMd)) die(`plan.md not found in ${dir}`);
  const plan = fs.readFileSync(planMd, 'utf-8');

  // 1 — Global Constraints (verbatim values, implicitly part of every phase)
  const constraints = extractSection(plan, /^#+\s*Global Constraints/i);

  // 2 — the phase text: dedicated phase file first, plan.md section fallback
  const n = phaseArg;
  const phaseFile = fs.readdirSync(dir).find(f =>
    new RegExp(`^phase-0*${n.replace('.', '\\.')}\\b|^phase-0*${n.replace('.', '\\.')}-`).test(f) && f.endsWith('.md'));
  let phaseText = null;
  let source = null;
  if (phaseFile) {
    phaseText = fs.readFileSync(path.join(dir, phaseFile), 'utf-8').trim();
    source = phaseFile;
  } else {
    phaseText = extractSection(plan, new RegExp(`^#+\\s*(Phase\\s+0*${n.replace('.', '\\.')})\\b`, 'i'));
    source = 'plan.md';
  }
  if (!phaseText) die(`phase ${n} not found (no phase-${n}*.md and no "Phase ${n}" heading in plan.md)`);

  const ws = resolveWorkspace(dir);
  const out = path.join(ws, `phase-${n}-brief-${Date.now()}.md`);
  const brief = [
    `# Phase ${n} brief — ${path.basename(dir)}`,
    `<!-- extracted from ${source}; this file is your complete requirements. Values are verbatim — do not re-derive them. -->`,
    '',
    constraints ? `${constraints}\n` : '<!-- plan declares no Global Constraints block -->\n',
    phaseText,
    '',
  ].join('\n');
  fs.writeFileSync(out, brief);
  console.log(out);
}

if (require.main === module) main();
