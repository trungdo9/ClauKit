/**
 * gen-write.js — write-once helper for the marketing scaffolding generators.
 *
 * WHY THIS EXISTS. The three `generate-marketing-*.js` scripts wrote every file
 * unconditionally. They were one-shot scaffolders, but they stayed in the repo,
 * and the files they scaffold were then filled in by hand: measured with a
 * dry-run harness on 2026-08-11, a re-run would have replaced 16 hand-authored
 * files with stubs — `seo-cluster` 93 lines → 51, `seo-content` 85 → 51,
 * `/mk:seo` 78 → 50 (losing the `plan`, `write` and `campaign` actions) — and
 * printed `✅ Generated 48 skill stubs` as if nothing had been lost.
 *
 * So: a stub is a STARTING POINT, and a starting point is only ever written
 * once. An existing file is left exactly as it is unless `--force` is passed,
 * and the summary states the skip count instead of hiding it.
 */

const fs = require("fs");
const path = require("path");

/** `--force` overwrites existing files; `--dry-run` writes nothing at all. */
function parseArgs(argv = process.argv.slice(2)) {
  return { force: argv.includes("--force"), dryRun: argv.includes("--dry-run") };
}

/**
 * Write `content` to `file` unless it exists. Returns 'written' | 'skipped' |
 * 'overwritten' | 'would-write' so the caller can report honestly.
 */
function writeOnce(file, content, opts = {}) {
  const exists = fs.existsSync(file);
  if (exists && !opts.force) return "skipped";
  if (opts.dryRun) return exists ? "would-overwrite" : "would-write";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return exists ? "overwritten" : "written";
}

/** One line per outcome, and never a bare success count. */
function report(label, tally, opts = {}) {
  const parts = Object.entries(tally)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} ${k}`);
  console.log(`${label}: ${parts.join(", ") || "nothing to do"}`);
  if (tally.skipped) {
    console.log(`   ${tally.skipped} existing file(s) left untouched — they may hold hand-written content.`);
    console.log("   Re-scaffold them deliberately with --force (git diff first; --dry-run previews).");
  }
}

/** Count one outcome. */
function count(tally, outcome) {
  tally[outcome] = (tally[outcome] || 0) + 1;
  return tally;
}

module.exports = { parseArgs, writeOnce, report, count };
