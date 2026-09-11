/**
 * spine-parse.cjs — parse one BA entity file (frontmatter + id) into a Node.
 *
 * No I/O beyond `fs.readFileSync`. Hand-rolled frontmatter reader: the contract
 * is 12 scalar keys plus one inline array (`parents: [EPIC-001]`), so pulling in
 * `js-yaml` for that is not justified in a zero-dependency package.
 *
 * Single source for the id scheme: this file owns `DOC_ID` / `ITEM_ID` /
 * `KIND_ORDER` / `PARENT_KINDS`. `references/id-scheme.md` documents them in
 * prose for humans; it must never restate the regexes, only this file does.
 */

const fs = require('fs');
const path = require('path');

const DOC_ID = /^(PRD|SRS)-\d{3}$/;
const ITEM_ID = /^(EPIC|FR|NFR|UC|US|TC|CR)-\d{3}$|^AC-\d{3}\.\d{1,2}$/;
const KIND_ORDER = ['PRD', 'SRS', 'EPIC', 'FR', 'NFR', 'UC', 'US', 'AC', 'TC', 'CR']; // CR appended last to keep CR-free trees byte-identical
const DOC_KINDS = new Set(['PRD', 'SRS']);
const ITEM_KINDS = new Set(KIND_ORDER.filter((k) => !DOC_KINDS.has(k)));
const PARENT_KINDS = {
  PRD: [],
  SRS: ['PRD'],
  EPIC: ['PRD'],
  FR: ['EPIC'],
  NFR: ['PRD', 'EPIC'],
  UC: ['FR'],
  US: ['EPIC', 'FR', 'UC'],
  AC: ['US', 'FR'],
  TC: ['AC', 'FR', 'NFR'],
  CR: ['EPIC', 'FR', 'NFR', 'UC', 'US'],
};

const CONFIDENCE = new Set(['high', 'med', 'low']);
const OUT_OF_SCOPE_KINDS = new Set(['EPIC', 'FR']);
const TOUCHES_KINDS = new Set(['FR', 'US']);
const CR_STATUS = new Set(['proposed', 'approved', 'rejected', 'done']);
const STATUS_KINDS = new Set(['CR']);
const IMPACT_KINDS = new Set(['CR']);
const RELEASE_KINDS = new Set(['FR', 'US']);
/** Keys checked by plain presence; `title` and `doc` get their own bespoke checks. */
const REQUIRED_KEYS = ['id', 'kind', 'project', 'parents', 'source', 'confidence'];

function blank(v) {
  return v === undefined || (typeof v === 'string' && v.trim() === '');
}

/**
 * The frontmatter block between the file's first `---` line and the next
 * `---`, or null when the file has no closed block. Only `parents` is parsed
 * as an inline array — every other key, including `source`, stays a raw
 * string even when its legal value itself contains brackets (`[UNVERIFIED]`).
 */
function readFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (lines[i] === undefined || lines[i].trim() !== '---') return null;
  const start = i + 1;
  let end = start;
  while (end < lines.length && lines[end].trim() !== '---') end++;
  if (end >= lines.length) return null;

  const data = {};
  for (const raw of lines.slice(start, end)) {
    const m = raw.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (key === 'parents') {
      const inner = val.replace(/^\[/, '').replace(/\]$/, '').trim();
      data[key] = inner ? inner.split(',').map((s) => s.trim()).filter(Boolean) : [];
    } else {
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }
  return data;
}

/** `parseEntity(absPath, projectDir) => { node, errors }`. `node` is null when the file has no usable `id`. */
function parseEntity(absPath, projectDir) {
  const errors = [];
  const file = path.relative(projectDir, absPath).split(path.sep).join('/');
  const push = (check, msg) => errors.push({ file, check, msg });

  const data = readFrontmatter(fs.readFileSync(absPath, 'utf8'));
  if (!data) {
    push('missing-frontmatter', 'file must start with a --- frontmatter block, closed by another ---');
    return { node: null, errors };
  }

  for (const key of REQUIRED_KEYS) if (blank(data[key])) push('missing-key', `missing required key: ${key}`);
  if (blank(data.title)) push('empty-title', 'title is missing or empty');

  const id = data.id;
  if (blank(id)) return { node: null, errors };

  if (path.basename(absPath, '.md') !== id) {
    push('filename-id-mismatch', `filename does not match id '${id}'`);
  }

  if (!DOC_ID.test(id) && !ITEM_ID.test(id)) push('bad-id', `id '${id}' matches neither DOC_ID nor ITEM_ID`);

  const prefix = String(id).split('-')[0];
  const kind = data.kind;
  if (!blank(kind) && !KIND_ORDER.includes(kind)) push('unknown-kind', `unknown kind '${kind}'`);
  else if (!blank(kind) && kind !== prefix) push('kind-id-mismatch', `kind '${kind}' disagrees with id prefix '${prefix}'`);

  if (!blank(data.project) && data.project !== path.basename(projectDir)) {
    push('bad-project', `project '${data.project}' does not match project dir '${path.basename(projectDir)}'`);
  }
  if (!blank(data.confidence) && !CONFIDENCE.has(data.confidence)) {
    push('bad-confidence', `confidence '${data.confidence}' must be high, med, or low`);
  }

  if (DOC_KINDS.has(prefix) && !blank(data.doc)) push('doc-on-document-kind', `'${prefix}' is a document kind and must not carry doc:`);
  if (ITEM_KINDS.has(prefix) && blank(data.doc)) push('doc-missing', `item kind '${prefix}' requires doc:`);

  if (prefix === 'EPIC' && blank(data.out_of_scope)) push('missing-out-of-scope', 'EPIC requires out_of_scope');
  if (!blank(data.out_of_scope) && !OUT_OF_SCOPE_KINDS.has(prefix)) {
    push('out-of-scope-on-wrong-kind', `out_of_scope is not allowed on kind '${prefix}'`);
  }
  if (!blank(data.touches) && !TOUCHES_KINDS.has(prefix)) {
    push('bad-touches', `touches is not allowed on kind '${prefix}'`);
  }

  if (prefix === 'CR' && blank(data.status)) push('missing-status', 'CR requires status');
  if (!blank(data.status) && !CR_STATUS.has(data.status)) push('bad-status', `status '${data.status}' must be one of [${[...CR_STATUS].join(', ')}]`);
  if (!blank(data.status) && !STATUS_KINDS.has(prefix)) {
    push('status-on-wrong-kind', `status is not allowed on kind '${prefix}'`);
  }
  if (prefix === 'CR' && blank(data.impact)) push('missing-impact', 'CR requires impact');
  if (!blank(data.impact) && !IMPACT_KINDS.has(prefix)) {
    push('impact-on-wrong-kind', `impact is not allowed on kind '${prefix}'`);
  }
  if (!blank(data.release) && !RELEASE_KINDS.has(prefix)) {
    push('bad-release', `release is not allowed on kind '${prefix}'`);
  }

  const node = {
    id,
    kind: blank(kind) ? prefix : kind,
    title: data.title || '',
    file,
    doc: blank(data.doc) ? null : data.doc,
    parents: Array.isArray(data.parents) ? data.parents : [],
    source: blank(data.source) ? null : data.source,
    confidence: blank(data.confidence) ? null : data.confidence,
    out_of_scope: blank(data.out_of_scope) ? null : data.out_of_scope,
    touches: blank(data.touches) ? null : data.touches,
    status: blank(data.status) ? null : data.status,
    impact: blank(data.impact) ? null : data.impact,
    release: blank(data.release) ? null : data.release,
  };
  return { node, errors };
}

module.exports = { parseEntity, DOC_ID, ITEM_ID, KIND_ORDER, DOC_KINDS, PARENT_KINDS, CR_STATUS };
