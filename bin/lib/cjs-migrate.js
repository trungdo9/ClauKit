/**
 * cjs-migrate.js — retire the `.js` names of ClauKit's shipped CommonJS files.
 *
 * Why this exists: ClauKit's hooks, statusline and `scripts/ck/` helpers are
 * CommonJS, and they used to ship as `.js`. Node decides a `.js` file's module
 * system from the *host project's* nearest package.json — so in any project
 * with `"type": "module"` (every Vite/Next/modern-ESM app) Node parsed them as
 * ES modules and every one of them died on its first line:
 *
 *     ReferenceError: require is not defined in ES module scope
 *
 * The user sees the crash on a PostToolUse hook and thinks their editor broke.
 * Worse is what they do NOT see: `guard-destructive` and `scout-block` are
 * PreToolUse guards, so in an ESM project they had been failing open — the
 * destructive-command protection was simply absent, silently, since install.
 *
 * `.cjs` is parsed as CommonJS regardless of the host's package.json, so the
 * files are now shipped under that extension. That fixes new installs. This
 * module fixes the ones already on disk, which `ck init` otherwise cannot:
 *
 *   1. `copyPath` skips a destination directory that already exists (and with
 *      `--force` it keeps files it does not ship), so the stale `.js` hooks
 *      survive an upgrade and stay in place next to the new `.cjs` ones.
 *   2. `settings-merge` only ever ADDS hook entries. The user's settings.json
 *      keeps pointing `node .../scout-block.js` at the broken file, and the
 *      merge helpfully adds a second entry for the `.cjs` one — so the crash
 *      keeps firing alongside the fix.
 *
 * So: install the `.cjs` twin, rewrite the references, then delete the files
 * they used to point at. The repair runs on a plain `ck init` — requiring
 * `--force` would mean the only projects the bug actually broke are the ones
 * that stay broken by default. Only names ClauKit itself ships are touched; a
 * project's own `.claude/hooks/deploy.js` is not ours to rewrite or remove.
 */

const fs = require("fs");
const path = require("path");
const { digestOf, digestOfBuffer } = require("./blob-digest");

/** Files ClauKit ships as CommonJS, relative to the project root, sans extension. */
const MIGRATED = [
  ".claude/hooks/scout-block",
  ".claude/hooks/guard-destructive",
  ".claude/hooks/modularization-hook",
  ".claude/hooks/file-claims",
  ".claude/statusline",
  ".claude/scripts/ck/ci-review",
  ".claude/scripts/ck/delivery-tail",
  ".claude/scripts/ck/phase-brief",
  ".claude/scripts/ck/review-package",
  ".claude/scripts/ck/run-workspace",
  ".claude/scripts/ck/lib/common",
];

/**
 * Every byte sequence ClauKit ever shipped as `<path>.js`, by `git hash-object`.
 *
 * Deleting a file needs proof it is ClauKit's, and "the `.cjs` twin exists"
 * is not that proof — the twin exists because the copy loop just wrote it, which
 * says nothing about who wrote the `.js`. A user who customised
 * `.claude/hooks/guard-destructive.js` (adding their own denied patterns — an
 * ordinary thing to do) had those edits deleted by this function, silently, and
 * reported as a clean upgrade. Content is the only real evidence, and it is the
 * same standard `retired-files.js` already holds itself to.
 *
 * This table never needs updating: ClauKit does not ship `.js` at these paths
 * any more, so the set of blobs that could legitimately appear there is closed.
 * The current release is covered at runtime instead — see `shippedDigests`.
 *
 * Regenerate with:
 *   for c in $(git rev-list --all -- <path>.js); do git rev-parse "$c:<path>.js"; done | sort -u
 */
const SHIPPED_JS = {
  ".claude/hooks/scout-block": ["103594e5f1157c8393261e33b75d2392019f5c40", "7d135b043b2d41f7b835022392814adfef8b4c29", "aa359a6c270d32af30c57771cd0ecf0045260a23"],
  ".claude/hooks/guard-destructive": ["0e8105d4dcddce235298a71929f7daf43fd92b65", "70bdf40b76c06dae820eac437b2797ad9bdf56b7", "bd4057851d3477c950c7d710175e124516f9460e"],
  ".claude/hooks/modularization-hook": ["bce44ed2e18af76dedfd6109d884a54758386835", "fcfc0918ef91c78ac3170ef1cbd3088fce82d5c2"],
  ".claude/hooks/file-claims": ["3c48983db8f143d4040ff17431ab4d8cd0ab98f5", "b9b1116de30494395f0f5f00b0d2567a8aed3bcc", "bef8fd71dd35cccd9abc8cc3a88e3e6bfaebe8d7"],
  ".claude/statusline": ["c7f4d514c811401739af32a61c20c16beeddd6f4"],
  // The helpers' `.js` era happened at the ROOT `scripts/ck/`, which is not a
  // path ClauKit writes any more — their digests moved to relocate-scripts.js
  // with the rest of that directory's history, so it stays one table.
};

const BASENAMES = MIGRATED.map((p) => path.posix.basename(p));

/**
 * Rewrite `<name>.js` → `<name>.cjs` in a command string, for shipped names only.
 * Anchored on a path separator or string start; matches on the ClauKit-shipped
 * basename, which is what its own settings entries always use.
 *
 * `names` restricts the rewrite to files whose `.cjs` is on disk — pointing a
 * hook at a file that is not there would trade a crashing hook for a missing
 * one.
 */
function rewriteCommand(command, names = BASENAMES) {
  let out = command;
  for (const base of names) {
    out = out.replace(
      new RegExp(`([/\\\\]|^|\\s)${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.js\\b`, "g"),
      `$1${base}.cjs`
    );
  }
  return out;
}

/** Walk every {event, group, hook} in a settings object. */
function eachHook(settings, fn) {
  for (const groups of Object.values((settings && settings.hooks) || {})) {
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      for (const hook of (group && group.hooks) || []) {
        if (hook && typeof hook.command === "string") fn(hook);
      }
    }
  }
}

/**
 * Point an existing settings.json at the `.cjs` files and drop entries that
 * became duplicates of one already present. Returns the rewritten commands.
 */
function migrateSettings(settingsPath, names = BASENAMES) {
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  } catch {
    return [];
  }

  const rewritten = [];
  eachHook(settings, (hook) => {
    const next = rewriteCommand(hook.command, names);
    if (next !== hook.command) {
      rewritten.push(path.posix.basename(hook.command.replace(/["']/g, "").split(/\s+/).pop()));
      hook.command = next;
    }
  });

  if (settings.statusLine && typeof settings.statusLine.command === "string") {
    const next = rewriteCommand(settings.statusLine.command, names);
    if (next !== settings.statusLine.command) {
      rewritten.push("statusline.js");
      settings.statusLine.command = next;
    }
  }

  if (!rewritten.length) return [];

  // The rewrite can collide with an entry a previous `ck init` already added
  // for the .cjs path — same event, same matcher, same command. Collapse them
  // so the hook does not run twice.
  for (const groups of Object.values(settings.hooks || {})) {
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      if (!Array.isArray(group && group.hooks)) continue;
      const seen = new Set();
      group.hooks = group.hooks.filter((h) => {
        if (!h || typeof h.command !== "string") return true;
        if (seen.has(h.command)) return false;
        seen.add(h.command);
        return true;
      });
    }
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  return rewritten;
}

/**
 * Install the `.cjs` twin for any legacy `.js` still on disk.
 *
 * `copyPath` skips a destination directory that already exists unless `--force`,
 * and with `--force` it keeps files it does not ship — either way the upgrade
 * leaves the broken `.js` in place and the fix absent. A legacy `.js` at a path
 * ClauKit ships is proof ClauKit put it there, so replacing it is not a
 * judgement call about the user's files.
 */
function restoreMissingCjs(projectRoot, resolveSourcePath) {
  const restored = [];
  for (const rel of MIGRATED) {
    const legacy = path.join(projectRoot, `${rel}.js`);
    const current = path.join(projectRoot, `${rel}.cjs`);
    if (!fs.existsSync(legacy) || fs.existsSync(current)) continue;
    const src = resolveSourcePath(`${rel}.cjs`);
    if (!fs.existsSync(src)) continue;
    try {
      fs.mkdirSync(path.dirname(current), { recursive: true });
      fs.writeFileSync(current, fs.readFileSync(src));
      restored.push(`${rel}.cjs`);
    } catch {
      /* a read-only tree is not worth failing an install over */
    }
  }
  return restored;
}

/**
 * The digests that prove a `<rel>.js` on disk is ClauKit's: everything shipped
 * historically under that name, plus the content of the `.cjs` this package
 * ships right now.
 *
 * The runtime term is what keeps SHIPPED_JS from needing maintenance. It also
 * covers the honest case of someone who renamed the current `.cjs` to `.js`
 * themselves — the bytes are ClauKit's either way, so nothing of theirs is lost.
 */
function shippedDigests(rel, resolveSourcePath) {
  const known = new Set(SHIPPED_JS[rel] || []);
  if (!resolveSourcePath) return known;
  try {
    const src = resolveSourcePath(`${rel}.cjs`);
    if (src && fs.existsSync(src)) known.add(digestOfBuffer(fs.readFileSync(src)));
  } catch {
    /* no source to compare against: fall back to the historical set */
  }
  return known;
}

/**
 * Delete the stale `.js` twin of every shipped file — but only once the `.cjs`
 * replacement is actually on disk (a half-finished copy must not leave the
 * project with neither) and only when the `.js` content is one ClauKit shipped.
 *
 * Digest-gating does not weaken the repair it exists for. The projects this bug
 * actually broke are running ClauKit's own unmodified hooks — a user who had
 * customised one would have seen it crash. So the realistic population matches
 * a digest and is still cleaned up; the only files that now survive are the ones
 * that were never ours to delete.
 *
 * Returns { removed, kept } — `kept` carries the reason. A file left behind is
 * inert (settings.json now points at the `.cjs`), so saying so is the difference
 * between the user porting their changes and never learning they were dropped.
 */
function pruneStaleJs(projectRoot, resolveSourcePath) {
  const removed = [], kept = [];
  for (const rel of MIGRATED) {
    const legacy = path.join(projectRoot, `${rel}.js`);
    const current = path.join(projectRoot, `${rel}.cjs`);
    if (!fs.existsSync(legacy) || !fs.existsSync(current)) continue;

    if (!shippedDigests(rel, resolveSourcePath).has(digestOf(legacy))) {
      kept.push({
        path: `${rel}.js`,
        why: "not a copy ClauKit shipped — yours, or edited by you; nothing now loads it, so port your changes to the .cjs and delete it",
      });
      continue;
    }
    try {
      fs.unlinkSync(legacy);
      removed.push(`${rel}.js`);
    } catch {
      /* a read-only file is not worth failing an install over */
    }
  }
  return { removed, kept };
}

/**
 * Full migration for one project. Safe to run on a fresh install (no-op) and
 * on an already-migrated one (idempotent). Must run after the copy loop (so the
 * `.cjs` files exist) and before `mergeSettings` (so the merge sees the
 * rewritten entries as already present and does not add duplicates).
 */
function migrateCjs(projectRoot, resolveSourcePath) {
  const restored = resolveSourcePath ? restoreMissingCjs(projectRoot, resolveSourcePath) : [];

  // Only rewrite references to files that are actually there now.
  const present = MIGRATED
    .filter((rel) => fs.existsSync(path.join(projectRoot, `${rel}.cjs`)))
    .map((rel) => path.posix.basename(rel));

  const settingsPath = path.join(projectRoot, ".claude", "settings.json");
  const rewritten = present.length && fs.existsSync(settingsPath)
    ? migrateSettings(settingsPath, present)
    : [];

  const pruned = pruneStaleJs(projectRoot, resolveSourcePath);
  return { restored, rewritten, removed: pruned.removed, kept: pruned.kept };
}

module.exports = {
  migrateCjs, migrateSettings, pruneStaleJs, restoreMissingCjs, rewriteCommand, MIGRATED, SHIPPED_JS,
};
