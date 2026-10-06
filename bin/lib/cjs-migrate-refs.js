/**
 * cjs-migrate-refs.js — fix the `.js` paths written into ClauKit's own prose.
 *
 * The `.js` → `.cjs` rename (see cjs-migrate.js) moved the files. It did not
 * move the ~20 places where a shipped command, agent, workflow or skill tells
 * Claude to *run* one:
 *
 *     /ck:git cm  →  "node .claude/hooks/file-claims.js list"
 *
 * `ck init` skips a destination directory that already exists unless `--force`,
 * so an upgrading project keeps the old markdown and every one of those
 * instructions resolves to a deleted file. The command does not crash loudly —
 * it degrades into its "registry unavailable" branch — which is exactly the
 * kind of quiet wrong that the rename was meant to end.
 *
 * Scope is deliberately narrow: only path-qualified references to the fourteen
 * files ClauKit ships (`.claude/hooks/<name>.js`, `scripts/ck/<name>.js`,
 * `.claude/statusline.js`), only inside the roots below. A project's own prose
 * about its own `common.js` matches nothing here.
 *
 * `.github/workflows/` is in scope because prose is not the only thing that
 * *runs* these paths: `ck-review.yml.template` is copied into a consumer's
 * workflows and invokes `scripts/ck/ci-review.js` directly, so after the rename
 * every PR review job failed with "Cannot find module" — a red check on every
 * pull request, repaired by nothing, since the two-stage migration only looked
 * at `.claude/` and `scripts/ck/`.
 */

const fs = require("fs");
const path = require("path");

const { MIGRATED } = require("./cjs-migrate");

/**
 * Directories holding ClauKit-shipped prose and wrappers. The root `scripts/ck`
 * is the pre-relocation home of the helpers (see relocate-scripts.js) and stays
 * listed: a project upgrading across that move still has prose there on the run
 * that repairs it.
 */
const DOC_ROOTS = [".claude", "scripts/ck", ".github/workflows"];
const DOC_EXTENSIONS = new Set([".md", ".sh", ".ps1", ".yml", ".yaml", ".template"]);

/** `.claude/hooks/file-claims.js` and friends — path-qualified, shipped names only. */
const REF_PATTERN = new RegExp(
  `(${MIGRATED.map((rel) => rel.replace(/^\.claude\//, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .map((rel) => rel.replace(/\//g, "[/\\\\]"))
    .join("|")})\\.js\\b`,
  "g"
);

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (DOC_EXTENSIONS.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

/**
 * A doc byte-identical to the package's copy is current by definition: the copy
 * loop just wrote it, or it was never touched. Rewriting it anyway is how fresh
 * installs used to end up with docs whose digest no release shipped — and a
 * sentence about the legacy root path turned into nonsense. See install-rewrites.js.
 */
function isPackageCopy(projectRoot, file, resolveSourcePath) {
  if (!resolveSourcePath) return false;
  try {
    const src = resolveSourcePath(path.relative(projectRoot, file).split(path.sep).join("/"));
    return Boolean(src) && fs.existsSync(src) && fs.readFileSync(src).equals(fs.readFileSync(file));
  } catch {
    return false;
  }
}

/**
 * Rewrite stale references in every shipped doc under `projectRoot` — except a
 * doc that is still the package's own copy.
 * Returns the project-relative paths that changed.
 */
function migrateDocRefs(projectRoot, resolveSourcePath) {
  const changed = [];
  for (const root of DOC_ROOTS) {
    for (const file of walk(path.join(projectRoot, root))) {
      if (isPackageCopy(projectRoot, file, resolveSourcePath)) continue;
      let text;
      try {
        text = fs.readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      const next = text.replace(REF_PATTERN, "$1.cjs");
      if (next === text) continue;
      try {
        fs.writeFileSync(file, next);
        changed.push(path.relative(projectRoot, file));
      } catch {
        /* a read-only doc is not worth failing an install over */
      }
    }
  }
  return changed;
}

module.exports = { migrateDocRefs, REF_PATTERN, walk, DOC_ROOTS, isPackageCopy };
