/**
 * Shared write/copy helpers for the convert targets, tracking a summary
 * {written, skipped, warnings} the same shape both to-*.js modules return.
 */

const fs = require("fs");
const path = require("path");

function newSummary() {
  return { written: [], skipped: [], warnings: [] };
}

function relLabel(projectRoot, dst) {
  return path.relative(projectRoot, dst) || ".";
}

/** Write a single text file, honoring --force skip-if-exists semantics. */
function writeFileSafe(projectRoot, dst, content, options, summary) {
  const label = relLabel(projectRoot, dst);
  if (fs.existsSync(dst) && !options.force) {
    summary.skipped.push(label);
    return;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, content);
  summary.written.push(label);
}

/** Copy a directory tree (dereferencing symlinks), honoring --force. */
function copyDirSafe(projectRoot, src, dst, options, summary) {
  const label = relLabel(projectRoot, dst);
  if (!src || !fs.existsSync(src)) {
    summary.warnings.push(`no source skills directory found — skipped ${label}`);
    return;
  }
  if (fs.existsSync(dst)) {
    if (!options.force) {
      summary.skipped.push(`${label}/ (exists — use --force to refresh)`);
      return;
    }
    fs.rmSync(dst, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true, dereference: true });
  summary.written.push(`${label}/`);
}

module.exports = { newSummary, writeFileSafe, copyDirSafe, relLabel };
