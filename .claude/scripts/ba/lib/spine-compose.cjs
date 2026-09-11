/**
 * spine-compose.cjs — render the two committed deliverables (D-11: PRD-001.md,
 * SRS-001.md) from the entity index. A deterministic script, not an LLM
 * re-render (ruling R7) — an LLM cannot satisfy Gate 5's byte-stability.
 *
 * `compose(projectDir)` runs `validate` first: violations ⇒ `{ ok: false,
 * violations }`, nothing written. Clean ⇒ writes both files under
 * `<projectDir>/deliverables/` and returns `{ ok: true, files }`.
 *
 * Byte-stable by construction: no `Date.now()`/`new Date()` anywhere in this
 * file. Generation metadata (the `generated` timestamp) lives in
 * `traceability.derived.json` instead — see `spine-index.cjs`.
 *
 * Block shape is D-4, binding — see `skills/ba/spec/references/compose-format.md`.
 */

const fs = require('fs');
const path = require('path');
const { buildIndex, validate } = require('./spine-index.cjs');

const HEADER = [
  '<!-- Tài liệu này được sinh tự động (generated) bởi `/ba:spec compose`.',
  '     KHÔNG sửa tay (do not hand-edit) — sửa file nguồn dưới entities/ rồi chạy lại compose. -->',
].join('\n');

/** Everything after the closing frontmatter `---`, verbatim. Whole file when there is none. */
function rawBody(absPath) {
  const text = fs.readFileSync(absPath, 'utf8');
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (lines[i] !== undefined && lines[i].trim() === '---') {
    let end = i + 1;
    while (end < lines.length && lines[end].trim() !== '---') end++;
    return lines.slice(end + 1).join('\n');
  }
  return text;
}

/** Drop the leading `# ID — title` line (and surrounding blanks) — compose renders its own heading. */
function stripHeading(body) {
  const lines = body.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (lines[i] !== undefined && /^#\s/.test(lines[i])) i++;
  while (i < lines.length && lines[i].trim() === '') i++;
  return lines.slice(i).join('\n');
}

/** FR only: split the body into its own `**Actor:** … **Precondition:** …` line and the remainder. */
function splitFRBody(body) {
  const lines = stripHeading(body).split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  let actorLine = null;
  if (lines[i] !== undefined && /^\*\*Actor:\*\*/.test(lines[i])) {
    actorLine = lines[i];
    i++;
    while (i < lines.length && lines[i].trim() === '') i++;
  }
  return { actorLine, remainder: lines.slice(i).join('\n').trim() };
}

/** A real `path/to/file.ts:88` — never `doc:…` and never the `[UNVERIFIED]` literal. */
function isFileLine(source) {
  return typeof source === 'string' && source !== '[UNVERIFIED]' && !source.startsWith('doc:') && /:\d+$/.test(source);
}

function parentEpic(node, byId) {
  for (const p of node.parents) {
    const par = byId.get(p);
    if (par && par.kind === 'EPIC') return par;
  }
  return null;
}

/** NFR ids+titles whose `parents` names the same EPIC as the FR — the FR's `**Constraints:**`. */
function constraintsFor(epic, index) {
  if (!epic) return '[UNKNOWN]';
  const nfrs = index.nodes.filter((n) => n.kind === 'NFR' && n.parents.includes(epic.id));
  return nfrs.length ? nfrs.map((n) => `${n.id} — ${n.title}`).join(', ') : 'Không có';
}

function renderFR(node, index, byId, projectDir) {
  const { actorLine, remainder } = splitFRBody(rawBody(path.join(projectDir, node.file)));
  const epic = parentEpic(node, byId);
  const outOfScope = node.out_of_scope || (epic && epic.out_of_scope) || '[UNKNOWN]';
  const touches = isFileLine(node.source) ? node.source : (node.touches || '[UNKNOWN]');
  return [
    `## ${node.id} — ${node.title}`,
    actorLine || '**Actor:** [UNKNOWN]   **Precondition:** [UNKNOWN]',
    `**source:** ${node.source || '[UNVERIFIED]'}   **confidence:** ${node.confidence || 'low'}`,
    `**Out of scope:** ${outOfScope}`,
    `**Constraints:** ${constraintsFor(epic, index)}`,
    `**Touches:** ${touches}`,
    '',
    remainder,
  ].join('\n');
}

/** NFR/UC: heading + one `source`/`confidence` meta line + body. No Actor/Out-of-scope/etc. */
function renderMeta(node, projectDir) {
  const body = stripHeading(rawBody(path.join(projectDir, node.file))).trim();
  return [
    `## ${node.id} — ${node.title}`,
    `**source:** ${node.source || '[UNVERIFIED]'}   **confidence:** ${node.confidence || 'low'}`,
    '',
    body,
  ].join('\n');
}

function renderAC(node, projectDir) {
  const body = stripHeading(rawBody(path.join(projectDir, node.file))).trim();
  return [`### ${node.id} — ${node.title}`, body].join('\n');
}

/** US: the meta head, then every AC whose `parents` names this US, nested beneath it. */
function renderUS(node, index, projectDir) {
  const acs = index.nodes.filter((n) => n.kind === 'AC' && n.parents.includes(node.id));
  return [renderMeta(node, projectDir), '', ...acs.map((ac) => renderAC(ac, projectDir))].join('\n');
}

/** TC: heading + body only — no source/confidence line (it carries `parents` to its AC instead). */
function renderTC(node, projectDir) {
  const body = stripHeading(rawBody(path.join(projectDir, node.file))).trim();
  return [`## ${node.id} — ${node.title}`, '', body].join('\n');
}

function finalize(text) {
  return text.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function composeSRS(index, byId, projectDir) {
  const srs = byId.get('SRS-001');
  const title = srs ? srs.title : 'SRS-001';
  const scope = srs ? stripHeading(rawBody(path.join(projectDir, srs.file))).trim() : '[UNKNOWN]';
  const byKind = (kind) => index.nodes.filter((n) => n.kind === kind);

  const sections = [
    HEADER,
    `# SRS-001 — ${title}`,
    ['## Phạm vi', scope].join('\n\n'),
    ...byKind('FR').map((n) => renderFR(n, index, byId, projectDir)),
    ...byKind('NFR').map((n) => renderMeta(n, projectDir)),
    ...byKind('UC').map((n) => renderMeta(n, projectDir)),
    ...byKind('US').map((n) => renderUS(n, index, projectDir)),
    ...byKind('TC').map((n) => renderTC(n, projectDir)),
  ];
  return finalize(sections.join('\n\n'));
}

function composePRD(byId, projectDir) {
  const prd = byId.get('PRD-001');
  if (!prd) return null;
  return finalize([HEADER, rawBody(path.join(projectDir, prd.file)).trim()].join('\n\n'));
}

/** `compose(projectDir) => { ok, violations? , files? }`. Never throws on a clean or dirty index. */
function compose(projectDir) {
  const { index, errors } = buildIndex(projectDir);
  const violations = validate(index, errors);
  if (violations.length) return { ok: false, violations };

  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  const outDir = path.join(projectDir, 'deliverables');
  fs.mkdirSync(outDir, { recursive: true });

  const files = [];
  const prdText = composePRD(byId, projectDir);
  if (prdText !== null) {
    const p = path.join(outDir, 'PRD-001.md');
    fs.writeFileSync(p, prdText);
    files.push(p);
  }
  const srsPath = path.join(outDir, 'SRS-001.md');
  fs.writeFileSync(srsPath, composeSRS(index, byId, projectDir));
  files.push(srsPath);

  return { ok: true, files };
}

module.exports = { compose, HEADER, rawBody, stripHeading, finalize };
