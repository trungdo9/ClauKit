/**
 * plan-checks.cjs — the checks behind `plan-lint.cjs`. Parsing + verdicts only;
 * the CLI, exit codes and reporting live in the entrypoint.
 *
 * Every check here exists because its absence fails *silently* downstream:
 *   - no `## Global Constraints` ⇒ `phase-brief.cjs` emits a "plan declares no
 *     Global Constraints" comment and exits 0, so the per-phase implementer gets
 *     a brief with none of the verbatim values (file-size limit, versions, target
 *     paths) and the violation surfaces three gates later, at review.
 *   - a prose exit gate ("tests pass") ⇒ a `run-state` resume cannot re-derive
 *     whether a phase genuinely completed, the one thing the ledger exists for.
 * Phase discovery mirrors `phase-brief.cjs` deliberately: a linter that inspects
 * different phases than the brief generator would prove nothing.
 */

const fs = require('fs');
const path = require('path');

/** Phrases banned by the planning skill's No-Placeholders rule. */
const PLACEHOLDERS = [
  /\bTBD\b/i,
  /appropriate error handling/i,
  /similar to phase\s*\d/i,
  /handle edge cases/i,
  /write tests for the above/i,
];

/** The six items a plan signs off on. Matched by keyword, in order. */
const ATTESTATION = [
  'spec coverage', 'placeholder', 'interfaces', 'gate', 'global constraints', 'scope',
];

/**
 * A gate must state its expected result — `<cmd> → <expected>`, not prose.
 *
 * `Acceptance` / `Exit criteria` are the same contract under another label: what
 * makes a gate re-runnable is the command plus the expectation, not the heading
 * word. The plan in this repo writes 29 of them as `**Acceptance:** <cmd> → <r>`;
 * failing that would enforce vocabulary rather than rigor.
 */
const GATE_LABEL = /\*\*(?:Exit gate|Acceptance|Exit criteria):?\*\*|^#+\s*(?:Exit gate|Acceptance criteria)/i;

/** Lines outside fenced code blocks, as [lineNo, text] — a fence may show `TBD` legitimately. */
function proseLines(md) {
  const out = [];
  let fenced = false;
  md.split('\n').forEach((line, i) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return; }
    if (!fenced) out.push([i + 1, line]);
  });
  return out;
}

/**
 * Drop backticked and quoted spans before a placeholder scan. A plan that
 * documents the ban list writes the phrases as citations ("TBD", "add
 * appropriate error handling") — the real plan here hit exactly that. A quoted
 * phrase is a mention; an unquoted one is an instruction.
 */
function stripCitations(line) {
  return line.replace(/`[^`]*`/g, '').replace(/"[^"]*"/g, '').replace(/[“][^”]*[”]/g, '');
}

/** Body of a `#`-heading section (heading excluded), or null when absent. */
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
  return lines.slice(start + 1, end).join('\n').trim();
}

/** Every phase as {id, source, text} — a `phase-<N>*.md` file wins over the plan.md section. */
function discoverPhases(dir, plan) {
  const ids = new Set();
  for (const [, line] of proseLines(plan)) {
    const m = line.match(/^#+\s*Phase\s+0*(\d+(?:\.\d+)?)\b/i);
    if (m) ids.add(m[1]);
  }
  const entries = fs.readdirSync(dir);
  for (const f of entries) {
    const m = f.match(/^phase-0*(\d+(?:\.\d+)?)[-.]/);
    if (m && f.endsWith('.md')) ids.add(m[1]);
  }
  return [...ids].sort((a, b) => Number(a) - Number(b)).map(id => {
    const esc = id.replace('.', '\\.');
    const file = entries.find(f => new RegExp(`^phase-0*${esc}[-.]`).test(f) && f.endsWith('.md'));
    if (file) return { id, source: file, text: fs.readFileSync(path.join(dir, file), 'utf-8') };
    return { id, source: 'plan.md', text: extractSection(plan, new RegExp(`^#+\\s*Phase\\s+0*${esc}\\b`, 'i')) || '' };
  });
}

function gateVerdict(text) {
  const lines = text.split('\n').filter(l => GATE_LABEL.test(l));
  if (!lines.length) return 'missing';
  return lines.some(l => /→|->/.test(l)) ? 'ok' : 'no-expected-result';
}

/** Top-level directories the plan's file paths touch — proxy for blast radius. */
function topLevelDirs(plan) {
  const tops = new Set();
  for (const [, line] of proseLines(plan)) {
    for (const m of line.matchAll(/(?:^|[\s`(])([a-z0-9_.-]+)\/[a-z0-9_./-]+\.[a-z]{2,4}\b/gi)) tops.add(m[1]);
  }
  tops.delete('plans');
  return tops;
}

function checkAttestation(plan, V) {
  const attest = extractSection(plan, /^#+\s*Plan Completeness/i);
  if (attest === null) {
    V('attestation', 'plan.md', 'no `## Plan Completeness` block — the plan never declares itself finished');
    return false;
  }
  const boxes = attest.split('\n').filter(l => /^\s*[-*]\s*\[[ xX]\]/.test(l));
  if (boxes.length < ATTESTATION.length)
    V('attestation', 'plan.md', `\`## Plan Completeness\` has ${boxes.length} of ${ATTESTATION.length} items`);
  for (const want of ATTESTATION) {
    if (!boxes.some(l => l.toLowerCase().includes(want)))
      V('attestation', 'plan.md', `\`## Plan Completeness\` never covers "${want}"`);
  }
  for (const l of boxes.filter(l => /\[\s\]/.test(l)))
    V('attestation', 'plan.md', `unticked sign-off — ${l.trim().slice(0, 80)}`);
  return true;
}

/** Lint a plan directory. Returns null when there is no plan.md to lint. */
function lintPlan(dir) {
  const planMd = path.join(dir, 'plan.md');
  if (!fs.existsSync(planMd)) return null;
  const plan = fs.readFileSync(planMd, 'utf-8');
  const violations = [];
  const warnings = [];
  const V = (check, where, msg) => violations.push({ check, where, msg });

  const constraints = extractSection(plan, /^#+\s*Global Constraints/i);
  if (constraints === null) V('global-constraints', 'plan.md', 'no `## Global Constraints` block — every phase brief will ship without the verbatim values');
  else if (!constraints) V('global-constraints', 'plan.md', '`## Global Constraints` block is empty');

  const phases = discoverPhases(dir, plan);
  if (!phases.length) V('phases', 'plan.md', 'no phases found (no `phase-<N>*.md` and no `## Phase <N>` heading)');

  for (const p of phases) {
    const verdict = gateVerdict(p.text);
    if (verdict === 'missing') V('exit-gate', `${p.source} (phase ${p.id})`, 'no `**Exit gate:**` — a resumed run cannot re-derive whether this phase completed');
    else if (verdict === 'no-expected-result') V('exit-gate', `${p.source} (phase ${p.id})`, 'exit gate states no expected result (want `<command> → <expected>`)');
    // Interfaces has a legitimate N/A (independent workstreams), so the gate
    // demands a recorded decision, not a block: `**Interfaces:** none` passes,
    // silence does not.
    if (phases.length > 1 && !/\*\*Interfaces:?\*\*/i.test(p.text))
      V('interfaces', `${p.source} (phase ${p.id})`, 'no `**Interfaces**` block — a fresh implementer reading only this phase cannot learn neighbouring signatures (declare `**Interfaces:** none — no cross-phase surface` if that is true)');
  }

  const scanTargets = [['plan.md', plan], ...phases.filter(p => p.source !== 'plan.md').map(p => [p.source, p.text])];
  for (const [name, text] of scanTargets) {
    for (const [lineNo, line] of proseLines(text)) {
      if (PLACEHOLDERS.some(re => re.test(stripCitations(line))))
        V('placeholder', `${name}:${lineNo}`, `banned placeholder — ${line.trim().slice(0, 80)}`);
    }
  }

  const attested = checkAttestation(plan, V);

  const tops = topLevelDirs(plan);
  if (tops.size > 1 && !/^\s*\|.*\bOption\b/im.test(plan))
    warnings.push(`touches ${tops.size} top-level dirs (${[...tops].slice(0, 5).join(', ')}) but records no scope options table (A minimal / B thorough)`);

  return { violations, warnings, phases, attested };
}

module.exports = {
  lintPlan, discoverPhases, gateVerdict, extractSection, proseLines, stripCitations,
  topLevelDirs, PLACEHOLDERS, ATTESTATION,
};
