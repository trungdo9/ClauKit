/**
 * spine-index.cjs — build the derived traceability index from entity files,
 * plus the gap and validation views over it. `traceability.derived.json` is
 * regenerable and git-ignored (D-9) — never hand-edit it, edit the entity
 * file under `entities/` and rebuild.
 */

const fs = require('fs');
const path = require('path');
const { parseEntity, KIND_ORDER, PARENT_KINDS, DOC_KINDS } = require('./spine-parse.cjs');

const GENERATOR = 'ba-traceability/1.0.0';

function numericPart(id) {
  const m = String(id).match(/\d+/);
  return m ? Number(m[0]) : 0;
}
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * `buildIndex(projectDir) => { index, errors }`. Scans `entities/` only, non-
 * recursive — a flat dir keeps an id greppable by path, and stops
 * `deliverables/SRS-001.md` (phase 06's committed artifact) being mistaken
 * for `entities/SRS-001.md` (the document entity) — same basename, different
 * dir. `orphans`/`unsourced` stay empty here; that is `findGaps`'s job.
 */
function buildIndex(projectDir) {
  projectDir = path.resolve(projectDir); // so `.` or a trailing slash still yields the real dir name for `project:`
  const errors = [];
  const entitiesDir = path.join(projectDir, 'entities');
  const nodes = [];
  const seen = new Map();
  for (const ent of fs.readdirSync(entitiesDir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      errors.push({ file: `entities/${ent.name}`, check: 'nested-entity-dir', msg: 'entities/ must be flat; found a nested directory' });
      continue;
    }
    if (!ent.name.endsWith('.md')) continue;
    const abs = path.join(entitiesDir, ent.name);
    const { node, errors: parseErrors } = parseEntity(abs, projectDir);
    errors.push(...parseErrors);
    if (!node) continue;
    if (seen.has(node.id)) {
      errors.push({ file: node.file, check: 'duplicate-id', msg: `id '${node.id}' already claimed by ${seen.get(node.id)}` });
    } else {
      seen.set(node.id, node.file);
    }
    nodes.push(node);
  }
  nodes.sort((a, b) => {
    const byKind = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
    if (byKind) return byKind;
    return numericPart(a.id) - numericPart(b.id) || cmp(a.id, b.id);
  });
  const edges = [];
  for (const n of nodes) for (const p of n.parents) edges.push({ from: n.id, to: p });
  edges.sort((a, b) => cmp(a.from, b.from) || cmp(a.to, b.to));
  const index = {
    version: 1,
    project: path.basename(projectDir),
    generated: new Date().toISOString(),
    generator: GENERATOR,
    nodes,
    edges,
    orphans: [],
    unsourced: [],
  };
  return { index, errors };
}

/** `findGaps(index) => { orphans, unsourced }` — two orphan classes plus one finding list. */
function findGaps(index) {
  const ids = new Set(index.nodes.map((n) => n.id));
  const orphans = [];
  const dedupe = new Set();
  const add = (o) => {
    const key = o.id + o.reason;
    if (dedupe.has(key)) return;
    dedupe.add(key);
    orphans.push(o);
  };
  for (const n of index.nodes) {
    if (n.parents.length === 0 && n.kind !== 'PRD') add({ id: n.id, reason: 'unparented', detail: 'no parents declared' });
    const dangling = n.parents.filter((p) => !ids.has(p));
    if (dangling.length) add({ id: n.id, reason: 'dangling', detail: `parent ${dangling.join(', ')} is not in the index` });
  }
  const unsourced = index.nodes.filter((n) => n.source === null || n.source === '[UNVERIFIED]').map((n) => n.id);
  return { orphans, unsourced };
}

/** DFS over `edges`; each cycle reported once by its lexicographically smallest member. */
function findCycles(index) {
  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  const adj = new Map();
  for (const e of index.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }
  const state = new Map(); // absent unvisited, 1 in-stack, 2 done
  const reported = new Set();
  const violations = [];
  function dfs(id, stack) {
    state.set(id, 1);
    stack.push(id);
    for (const next of adj.get(id) || []) {
      if (state.get(next) === 1) {
        const cycle = stack.slice(stack.indexOf(next)).concat(next);
        const smallest = [...cycle].sort()[0];
        if (!reported.has(smallest)) {
          reported.add(smallest);
          const node = byId.get(smallest);
          violations.push({ id: smallest, file: node ? node.file : '', check: 'cycle', msg: `cycle: ${cycle.join(' -> ')}` });
        }
      } else if (!state.get(next)) dfs(next, stack);
    }
    stack.pop();
    state.set(id, 2);
  }
  for (const id of adj.keys()) if (!state.get(id)) dfs(id, []);
  return violations;
}

/** `validate(index, errors) => Violation[]` — the parse errors, plus structural checks over the built graph. */
function validate(index, errors) {
  const violations = errors.map((e) => ({ id: null, file: e.file, check: e.check, msg: e.msg }));
  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  for (const n of index.nodes) {
    for (const p of n.parents) {
      if (n.kind === 'AC') {
        const childNum = String(n.id).match(/\d+/)[0];
        const parentMatch = String(p).match(/\d+/);
        if (parentMatch && parentMatch[0] !== childNum) {
          violations.push({ id: n.id, file: n.file, check: 'ac-prefix-mismatch', msg: `AC prefix '${childNum}' disagrees with parent '${p}'` });
        }
      }
      const parent = byId.get(p);
      if (!parent) continue; // dangling — already an orphan finding, not a validate() concern
      const allowed = PARENT_KINDS[n.kind] || [];
      if (!allowed.includes(parent.kind)) {
        violations.push({ id: n.id, file: n.file, check: 'parent-kind-not-allowed', msg: `parent '${p}' has kind '${parent.kind}', not one of [${allowed.join(', ')}]` });
      }
    }
    if (n.doc !== null) {
      const docNode = byId.get(n.doc);
      if (!docNode) {
        violations.push({ id: n.id, file: n.file, check: 'dangling-doc', msg: `doc '${n.doc}' is not in the index` });
      } else if (!DOC_KINDS.has(docNode.kind)) {
        violations.push({ id: n.id, file: n.file, check: 'doc-not-a-document-kind', msg: `doc '${n.doc}' has kind '${docNode.kind}', not a document kind` });
      }
    }
  }
  violations.push(...findCycles(index));
  return violations;
}

/** `writeIndex(projectDir, index) => absolute path written`. */
function writeIndex(projectDir, index) {
  const out = path.resolve(projectDir, 'traceability.derived.json');
  fs.writeFileSync(out, JSON.stringify(index, null, 2) + '\n');
  return out;
}

/**
 * `changelog(index) => CRRow[]` — CR nodes in id order. The Change Log IS this
 * view: there is no register file to keep in step with the entities, which is
 * the failure mode a hand-written log has and a derived one cannot.
 */
function changelog(index) {
  return index.nodes
    .filter((n) => n.kind === 'CR')
    .sort((a, b) => {
      const byNum = numericPart(a.id) - numericPart(b.id);
      if (byNum) return byNum;
      return cmp(a.id, b.id);
    })
    .map((n) => ({
      id: n.id,
      title: n.title,
      status: n.status,
      impact: n.impact,
      parents: n.parents,
      file: n.file,
    }));
}

module.exports = { buildIndex, findGaps, validate, writeIndex, changelog };
