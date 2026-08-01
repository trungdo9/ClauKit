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

/** Files ClauKit ships as CommonJS, relative to the project root, sans extension. */
const MIGRATED = [
  ".claude/hooks/scout-block",
  ".claude/hooks/guard-destructive",
  ".claude/hooks/modularization-hook",
  ".claude/hooks/file-claims",
  ".claude/statusline",
  "scripts/ck/ci-review",
  "scripts/ck/delivery-tail",
  "scripts/ck/phase-brief",
  "scripts/ck/review-package",
  "scripts/ck/run-workspace",
  "scripts/ck/wt-clean",
  "scripts/ck/wt-doctor",
  "scripts/ck/wt-new",
  "scripts/ck/lib/common",
];

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
 * Delete the stale `.js` twin of every shipped file, but only once the `.cjs`
 * replacement is actually on disk — a half-finished copy must not leave the
 * project with neither.
 */
function pruneStaleJs(projectRoot) {
  const removed = [];
  for (const rel of MIGRATED) {
    const legacy = path.join(projectRoot, `${rel}.js`);
    const current = path.join(projectRoot, `${rel}.cjs`);
    if (fs.existsSync(legacy) && fs.existsSync(current)) {
      try {
        fs.unlinkSync(legacy);
        removed.push(`${rel}.js`);
      } catch {
        /* a read-only file is not worth failing an install over */
      }
    }
  }
  return removed;
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

  return { restored, rewritten, removed: pruneStaleJs(projectRoot) };
}

module.exports = {
  migrateCjs, migrateSettings, pruneStaleJs, restoreMissingCjs, rewriteCommand, MIGRATED,
};
