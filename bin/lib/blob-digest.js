/**
 * blob-digest.js — the one way ClauKit proves a file on disk is its own.
 *
 * Two installer gates delete files from a user's project (`retired-files.js`
 * removes what ClauKit stopped shipping; `cjs-migrate.js` removes the `.js`
 * twins of files now shipped as `.cjs`). Both must answer the same question
 * before unlinking anything — "is this byte sequence one ClauKit shipped?" — and
 * both must answer it the same way. Two copies of this function could drift, and
 * a drift here means one gate deletes a file the other would have kept.
 *
 * The value is `git hash-object -t blob`, so every digest in those tables can be
 * regenerated and checked by a reviewer with git alone.
 */

const crypto = require("crypto");
const fs = require("fs");

/** `git hash-object -t blob` of a file's contents, or null if it cannot be read. */
function digestOf(absPath) {
  let buf;
  try {
    buf = fs.readFileSync(absPath);
  } catch {
    return null;
  }
  return digestOfBuffer(buf);
}

/** Same digest, for content already in memory. */
function digestOfBuffer(buf) {
  return crypto.createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");
}

module.exports = { digestOf, digestOfBuffer };
