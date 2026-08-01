/**
 * gitignore-wire.js — keep ClauKit's machine-local runtime state out of the
 * project's history.
 *
 * Why this exists: all three kit manifests declared `.claude/.gitignore` in
 * `paths.config`, as if it were an ordinary file to copy. **npm strips every
 * `.gitignore` from every tarball** — a packing rule, not a misconfiguration —
 * so on an installed package the declared path does not exist,
 * `checkKitPathsAvailable()` reports it missing, and `ck init` exits 1 before
 * copying anything. Every kit, every install. v1.3.6 was fine because the entry
 * did not exist yet; ad9e8d0 added it and turned the whole installer into a
 * hard failure.
 *
 * A file npm refuses to carry cannot be shipped as a file. So the rules live
 * here as data and are merged in — same remedy as settings-merge.js (hooks) and
 * claude-md-wire.js (workflows): add what is missing, never touch what the user
 * wrote, and say what changed. `tests/installer.test.js` asserts this list
 * stays a subset of ClauKit's own `.claude/.gitignore`, so the two cannot drift.
 */

const fs = require("fs");
const path = require("path");

/**
 * Paths ClauKit generates at runtime, relative to `.claude/`. Each is
 * machine-local: session ids and edited-file paths do not belong in a shared
 * repo, the claim registry conflicts on every merge between concurrent
 * worktrees, and settings.local.json is per-machine by definition.
 */
const RULES = [
  ".ck-file-claims.jsonl",
  ".ck-smoke-cache.json",
  ".ck-tail-approved",
  "settings.local.json",
];

const HEADER = [
  "# ClauKit runtime state — machine-local, never useful in history.",
  "# Session ids and edited-file paths do not belong in a shared repo, and the",
  "# claim registry conflicts on every merge between concurrent worktrees.",
];

/**
 * The patterns a gitignore file already declares. Comments and blanks are not
 * patterns; a leading `/` and trailing whitespace do not change what a
 * single-segment pattern matches, so both are normalised away before comparing
 * — otherwise `/settings.local.json` would read as missing and get appended a
 * second time.
 */
function existingPatterns(text) {
  const out = new Set();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    out.add(line.replace(/^\/+/, "").replace(/\/+$/, ""));
  }
  return out;
}

/**
 * Ensure `.claude/.gitignore` in the project covers every rule in RULES.
 *
 * created   — no file existed; wrote the header plus every rule
 * wired     — appended only the rules the file lacked
 * unchanged — the file already covers all of them
 *
 * Returns { action, added: string[] }. Never rewrites or reorders lines the
 * user already had, and never runs when `.claude/` itself is absent (nothing
 * has been installed, so there is no runtime state to ignore yet).
 */
function wireGitignore(projectRoot) {
  const dir = path.join(projectRoot, ".claude");
  if (!fs.existsSync(dir)) return { action: "unchanged", added: [] };

  const file = path.join(dir, ".gitignore");

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, [...HEADER, ...RULES, ""].join("\n"));
    return { action: "created", added: [...RULES] };
  }

  const existing = fs.readFileSync(file, "utf-8");
  const have = existingPatterns(existing);
  const missing = RULES.filter((r) => !have.has(r));
  if (!missing.length) return { action: "unchanged", added: [] };

  const sep = existing.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(file, existing + sep + [...HEADER, ...missing, ""].join("\n"));
  return { action: "wired", added: missing };
}

module.exports = { wireGitignore, RULES, HEADER, existingPatterns };
