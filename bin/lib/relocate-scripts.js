/**
 * relocate-scripts.js — retire the ROOT `scripts/ck/` of installs made before
 * the helpers moved under `.claude/`.
 *
 * `scripts/ck/` was the one destination any kit wrote outside `.claude/`, and it
 * cost twice. Once mechanically: `--force` used to `rmSync` a kit destination, so
 * a project's own `scripts/ck/deploy.js` was deleted with no warning (the scar is
 * in file-copier.js). Once conceptually: a tool that claims `.claude/` and then
 * drops a second directory in the project root has no boundary a user can state.
 * The helpers now install to `.claude/scripts/ck/`, so the whole kit lives under
 * one directory that is ClauKit's to manage.
 *
 * That fixes new installs. This fixes the ones already on disk, which the copy
 * loop cannot: it only ever writes, so an upgrade would leave the old tree in
 * place next to the new one — two copies of every helper, and the docs pointing
 * at whichever the last edit happened to name.
 *
 * Two gates, both borrowed rather than invented:
 *
 *   1. **Content is the proof.** A file at the old path is deleted only when its
 *      `git hash-object` digest is one ClauKit shipped there — the same standard
 *      `retired-files.js` and `cjs-migrate.js` hold themselves to, and the same
 *      reason: `scripts/ck/run-workspace.cjs` is a name a user could have written.
 *   2. **Coherence first.** The prose that *invokes* these paths is rewritten in
 *      the same run. Deleting the script while a shipped command still says
 *      `node scripts/ck/plan-lint.cjs` trades a duplicate for a dangling gate.
 *
 * Regenerate the table with:
 *   for c in $(git rev-list --all -- <path>); do git rev-parse "$c:<path>"; done | sort -u
 */

const fs = require("fs");
const path = require("path");
const { digestOf, digestOfBuffer } = require("./blob-digest");
const { walk, DOC_ROOTS } = require("./cjs-migrate-refs");

const OLD_ROOT = "scripts/ck";
const NEW_ROOT = ".claude/scripts/ck";

/**
 * Every byte sequence ClauKit ever shipped under the root `scripts/ck/`, `.js`
 * era included — an install that never ran the `.cjs` migration still has those
 * on disk, and they are just as much ours to clean up.
 *
 * The set is closed: nothing is shipped at these paths any more.
 */
const SHIPPED = [
  { path: "scripts/ck/branch-guard.cjs", sha: ["9b9a370f6859dc313a05dc786ec4f535e94128c8", "cc498c7d3d458ba465ed7b1e37e6eb91879250c8"] },
  { path: "scripts/ck/ci-review.cjs", sha: ["c9962dd1690411a3a1ed79f122bb6e6f9720a86a"] },
  { path: "scripts/ck/ci-review.js", sha: ["5ea1d29def9f59e11fb17e49699829c08ec036af", "97cc45cd8c16f06b273db0ec37d0a137875e7d97", "afe4fa14ce16dd7db8dc32624b299d9ad60e9eb3"] },
  { path: "scripts/ck/delivery-tail.cjs", sha: ["e30c32022bde70d6bd78abc9a961e7e08b099e7a", "fe44d3cb843da221466ab01a1c49fc67cd11a29a"] },
  { path: "scripts/ck/delivery-tail.js", sha: ["1a88ec9f3860115c31ca5dea9857bf00f617c0dd", "a767cc98e05b01f74b70e1953bb4df9a44307737"] },
  { path: "scripts/ck/phase-brief.cjs", sha: ["a88dd2d57ac4621a8c1697b0bb85e7bcca86d132"] },
  { path: "scripts/ck/phase-brief.js", sha: ["82ee96a29fcd639954c3c95f59b620e7462519d3"] },
  { path: "scripts/ck/plan-lint.cjs", sha: ["5554b6769f591188882d272d870fdbcc0af53381"] },
  { path: "scripts/ck/review-package.cjs", sha: ["0169d3f6699bb9b9b691694b4a87f941ea2ffee3"] },
  { path: "scripts/ck/review-package.js", sha: ["9c96f1b2995523044de07ec6ed9cd1943a061a5c", "e96545864087a94ed377b5047f59106adbe2b814"] },
  { path: "scripts/ck/run-workspace.cjs", sha: ["84855dd1f3e7764fd89541ce435019a25f7bd321"] },
  { path: "scripts/ck/run-workspace.js", sha: ["5ab7039b581e614cef83d7b350f494dc68c9f1b5"] },
  { path: "scripts/ck/lib/branch-checks.cjs", sha: ["27359c0355934d0e42843473b3fc5957c27c0259", "daaf6abdd0ac0906248e0ddf7e6d17e9be7ec07a"] },
  { path: "scripts/ck/lib/common.cjs", sha: ["d6b72c7fe9bc11c48582788a441b7f13c61e0f99", "fd7c22ef084ca8ad91c18626ecec7bf754d62272"] },
  { path: "scripts/ck/lib/common.js", sha: ["24aee7c3764bad43b620d1cbf5fda25dbb23487b", "d6b72c7fe9bc11c48582788a441b7f13c61e0f99"] },
  { path: "scripts/ck/lib/plan-checks.cjs", sha: ["4436bf32a465d9e0a632a74005692a79e9588adf"] },
  { path: "scripts/ck/lib/shell-parse.cjs", sha: ["75a7d01998027cd868e79e685ac19a85a6c85202"] },
  { path: "scripts/ck/lib/tail-checks.cjs", sha: ["c8610149488cfd63ccbb2fe50a4888d8997b60fc"] },
  { path: "scripts/ck/lib/tail-parse.cjs", sha: ["55f1813941e10c7ab95cac7604369820db610b5b"] },
  { path: "scripts/ck/lib/tail-runtime.cjs", sha: ["ed8f4bb94ea0cf9a48428efeec6a0b76ee6062e4"] },
];

/** Old path → the path that replaces it (`.js` twins land on their `.cjs`). */
function newPathOf(oldRel) {
  return oldRel.replace(OLD_ROOT, NEW_ROOT).replace(/\.js$/, ".cjs");
}

/**
 * Digests that prove a file at the old path is ClauKit's: everything shipped
 * historically there, plus the bytes this package ships at the new path — which
 * covers anyone who installed from a tree newer than this table.
 */
function provenDigests(entry, resolveSourcePath) {
  const known = new Set(entry.sha);
  if (!resolveSourcePath) return known;
  try {
    const src = resolveSourcePath(newPathOf(entry.path));
    if (src && fs.existsSync(src)) known.add(digestOfBuffer(fs.readFileSync(src)));
  } catch {
    /* no source to compare against: the historical set still stands */
  }
  return known;
}

/** `scripts/ck/x.cjs` → `.claude/scripts/ck/x.cjs`, in prose and in wrappers. */
const REF_PATTERN = /(?<![\w./\\-])scripts[/\\]ck[/\\]/g;

/**
 * Repoint every shipped doc, hook wrapper and CI template that still runs a
 * helper from the old location. `.github/workflows/` is in scope for the reason
 * cjs-migrate-refs documents: `ck-review.yml` is copied into the consumer's repo
 * and invokes the path directly, so a stale reference is a red check on every PR.
 */
function relocateDocRefs(projectRoot) {
  const changed = [];
  for (const root of DOC_ROOTS) {
    for (const file of walk(path.join(projectRoot, root))) {
      let text;
      try {
        text = fs.readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      const next = text.replace(REF_PATTERN, `${NEW_ROOT}/`);
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

/** Drop `scripts/ck/`, and `scripts/` itself, only while they are empty. */
function pruneEmptyDirs(projectRoot) {
  for (const rel of [`${OLD_ROOT}/lib`, OLD_ROOT, "scripts"]) {
    try {
      fs.rmdirSync(path.join(projectRoot, rel));
    } catch {
      /* not empty — the user's own files live there, and they stay */
    }
  }
}

/**
 * Remove the legacy root `scripts/ck/` once its replacement is on disk.
 *
 * Returns { removed, kept, refs } — `kept` carries the reason per file, because
 * a file left behind is now inert (nothing points at it any more) and saying so
 * is the difference between the user porting their edits and never learning they
 * were orphaned.
 */
function relocateScripts(projectRoot, resolveSourcePath) {
  const removed = [], kept = [];

  for (const entry of SHIPPED) {
    const legacy = path.join(projectRoot, entry.path);
    const current = path.join(projectRoot, newPathOf(entry.path));
    // Never leave the project with neither copy: a half-finished install that
    // deleted the old helper and never wrote the new one is worse than both.
    if (!fs.existsSync(legacy) || !fs.existsSync(current)) continue;

    if (!provenDigests(entry, resolveSourcePath).has(digestOf(legacy))) {
      kept.push({
        path: entry.path,
        why: "not a copy ClauKit shipped — yours, or edited by you; nothing loads it now, so port your changes and delete it",
      });
      continue;
    }
    try {
      fs.unlinkSync(legacy);
      removed.push(entry.path);
    } catch {
      /* a read-only file is not worth failing an install over */
    }
  }

  const refs = relocateDocRefs(projectRoot);
  if (removed.length) pruneEmptyDirs(projectRoot);

  return { removed, kept, refs };
}

module.exports = { relocateScripts, relocateDocRefs, newPathOf, REF_PATTERN, SHIPPED, OLD_ROOT, NEW_ROOT };
