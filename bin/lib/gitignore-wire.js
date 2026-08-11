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
 * Artifacts ClauKit REGENERATES from git on demand, relative to the project
 * root. `run-workspace.cjs` describes `plans/<plan>/reports/` as "a git-ignored
 * per-plan artifact dir" — and nothing ClauKit installed ignored it. Every
 * `review-package.cjs` run writes a full `git diff -U10` there and every
 * `phase-brief.cjs` run writes a NEW `phase-N-brief-<timestamp>.md` (nothing
 * ever cleans them), so in a consumer project the next `git add -A` swept
 * megabytes of regenerable diff into history. Only ClauKit's own root
 * .gitignore had these two rules, and that file is not shipped.
 *
 * Scoped to the two regenerable NAME PATTERNS, not to `plans/**` or even to
 * `reports/`: a plan's `plan.md`, `STATE.md` and its hand-written reports are
 * linked from the PR body and must stay committable — an ignored report is a 404
 * in a review.
 */
const PLAN_RULES = [
  "plans/**/reports/review-package-*.md",
  "plans/**/reports/*-brief-*.md",
];

const PLAN_HEADER = [
  "# ClauKit regenerates these from git on demand — never commit them.",
  "# Hand-written plan files and reports are deliberately NOT ignored: they are",
  "# linked from the PR body, and an ignored report is a 404 in a review.",
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
 * Ensure one gitignore file covers every rule in `rules`.
 *
 * created   — no file existed; wrote the header plus every rule
 * wired     — appended only the rules the file lacked
 * unchanged — the file already covers all of them
 *
 * Never rewrites or reorders lines the user already had.
 */
function wireOne(file, rules, header) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, [...header, ...rules, ""].join("\n"));
    return { action: "created", added: [...rules] };
  }

  const existing = fs.readFileSync(file, "utf-8");
  const have = existingPatterns(existing);
  const missing = rules.filter((r) => !have.has(r));
  if (!missing.length) return { action: "unchanged", added: [] };

  const sep = existing.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(file, existing + sep + [...header, ...missing, ""].join("\n"));
  return { action: "wired", added: missing };
}

/**
 * Wire both scopes and report them separately, because they are different
 * files with different reasons: `.claude/.gitignore` covers machine-local
 * runtime state, the project root `.gitignore` covers regenerable plan
 * artifacts (a `plans/` rule inside `.claude/` would match `.claude/plans/`
 * and ignore nothing that exists).
 *
 * Returns { action, added, plans: { action, added } }. The top-level fields
 * stay the `.claude/` result so existing callers and tests keep their meaning.
 * Neither scope runs when `.claude/` is absent — nothing has been installed, so
 * there is no runtime state and no artifact dir to ignore yet.
 */
function wireGitignore(projectRoot) {
  const dir = path.join(projectRoot, ".claude");
  if (!fs.existsSync(dir)) {
    return { action: "unchanged", added: [], plans: { action: "unchanged", added: [] } };
  }
  const claude = wireOne(path.join(dir, ".gitignore"), RULES, HEADER);
  const plans = wireOne(path.join(projectRoot, ".gitignore"), PLAN_RULES, PLAN_HEADER);
  return { ...claude, plans };
}

module.exports = { wireGitignore, RULES, HEADER, PLAN_RULES, PLAN_HEADER, existingPatterns };
