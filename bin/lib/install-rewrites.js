/**
 * install-rewrites.js — prove a doc is ClauKit's even after an installer rewrote it.
 *
 * Every keep/refresh/delete decision ClauKit makes about a user's file is a digest
 * match against blobs it shipped (retired-files.js). But `ck init` itself rewrites
 * shipped prose in place: `relocateDocRefs` turns a bare `scripts/ck/` into
 * `.claude/scripts/ck/`, `migrateDocRefs` turns a shipped helper's `.js` into `.cjs`.
 * Until 2026-10 it did that even to the copy it had just written, so every install
 * holds docs whose digest no release ever shipped — and digest proof alone would
 * call them the user's forever, so no upgrade could refresh or retire them.
 *
 * The rewrites are known and deterministic, so the proof extends cleanly: a file
 * is ClauKit's if some *pre-rewrite* text both hashes to a shipped blob and, run
 * through the same rewrites, reproduces the file byte for byte. Both conditions,
 * not either — a user edit anywhere breaks the second, a lookalike the first.
 *
 * The pre-rewrite text is not unique (`.claude/scripts/ck/` may have been written
 * that way, or rewritten into it), so candidates are enumerated over every
 * rewritten-looking occurrence. Shipped docs carry a handful; past the cap only
 * the two extremes are tried, which still covers a doc that was all one or the other.
 */

const { digestOfBuffer } = require("./blob-digest");
const { REF_PATTERN: RELOCATE_PATTERN, NEW_ROOT } = require("./relocate-scripts");
const { REF_PATTERN: CJS_PATTERN } = require("./cjs-migrate-refs");

const MAX_ENUMERATED = 12;

/** What `ck init` does to a shipped doc: relocate first, then `.js` → `.cjs` (bin/ck.js order). */
function installRewrite(text) {
  return text.replace(RELOCATE_PATTERN, `${NEW_ROOT}/`).replace(CJS_PATTERN, "$1.cjs");
}

/** `.cjs` occurrences that `CJS_PATTERN` could have produced from a `.js`. */
const CJS_OUTPUT = new RegExp(CJS_PATTERN.source.replace(/\\\.js\\b$/, "\\.cjs\\b"), "g");
const RELOCATED = `${NEW_ROOT}/`;
const DROPPED_PREFIX = RELOCATED.length - "scripts/ck/".length; // ".claude/"

/** Spots in `text` where a rewrite may have happened, as {at, del, ins} edits that undo it. */
function undoableEdits(text) {
  const edits = [];
  for (let i = text.indexOf(RELOCATED); i !== -1; i = text.indexOf(RELOCATED, i + 1)) {
    edits.push({ at: i, del: DROPPED_PREFIX, ins: "" });
  }
  for (const m of text.matchAll(CJS_OUTPUT)) {
    edits.push({ at: m.index + m[0].length - ".cjs".length, del: ".cjs".length, ins: ".js" });
  }
  return edits.sort((a, b) => b.at - a.at); // apply right to left so offsets stay valid
}

function applyEdits(text, edits) {
  let out = text;
  for (const e of edits) out = out.slice(0, e.at) + e.ins + out.slice(e.at + e.del);
  return out;
}

/**
 * True when `buf` is a ClauKit-shipped blob from `shas`, as shipped or as an
 * install rewrote it.
 */
function matchesShipped(buf, shas) {
  if (shas.includes(digestOfBuffer(buf))) return true;
  const text = buf.toString("utf-8");
  if (!Buffer.from(text, "utf-8").equals(buf)) return false; // not text we wrote
  const edits = undoableEdits(text);
  if (!edits.length) return false;

  const subsets = edits.length <= MAX_ENUMERATED
    ? Array.from({ length: (1 << edits.length) - 1 }, (_, k) => edits.filter((_, i) => ((k + 1) >> i) & 1))
    : [edits];
  for (const chosen of subsets) {
    const candidate = applyEdits(text, chosen);
    if (installRewrite(candidate) === text && shas.includes(digestOfBuffer(Buffer.from(candidate, "utf-8")))) {
      return true;
    }
  }
  return false;
}

module.exports = { matchesShipped, installRewrite };
