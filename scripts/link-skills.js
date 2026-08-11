#!/usr/bin/env node

/**
 * link-skills.js — recreate this repo's `.claude/skills` pointer after a
 * checkout. Dev-only: `scripts/` is not published, and a consumer's `ck init`
 * writes real files instead (the installer dereferences the symlink).
 *
 * ONE canonical `./skills/`, ONE pointer at it. The pointer is regenerated per
 * platform on every checkout, so it **does not belong in git** — see the
 * `/.claude/skills` rule in `.gitignore`. A tracked symlink is the one shape
 * that breaks on Windows: git without symlink support materialises it as a text
 * file containing `../skills`, `linkOne` removes that and writes a junction, and
 * the path then reads as permanently modified. Worse on the COPY fallback below
 * — the whole skills tree lands there as ~1500 untracked files, one `git add -A`
 * from history.
 *
 * RETIRED 2026-08-11: a second target at `.agent/skills` (Antigravity IDE's
 * workspace skills path — a link at `.claude/skills` does not serve that IDE;
 * plan `20260604-1747-externalize-skills-symlink` phase 4, always best-effort
 * because the IDE ignores symlinked skills at its global path,
 * vercel-labs/skills#633). Removed by maintainer decision along with `.agent/`
 * itself: it was tracked, un-ignored, and referenced by no installer, kit
 * manifest or doc. To bring it back, add the path to `targets` **and** give it a
 * `.gitignore` rule — one without the other is what went wrong the first time.
 */
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const realSkills = path.join(repoRoot, "skills");
const isWin = process.platform === "win32";

const targets = [
  path.join(repoRoot, ".claude", "skills"),
];

function linkOne(target) {
  const linkDir = path.dirname(target);
  const relTarget = path.relative(linkDir, realSkills); // "../skills"

  // already correct?
  try {
    const st = fs.lstatSync(target);
    if (st.isSymbolicLink()) {
      const cur = fs.readlinkSync(target);
      if (path.resolve(linkDir, cur) === realSkills) {
        console.log(`OK  ${target}`);
        return;
      }
    }
    // stale (text file from win git, wrong link, or real copy) -> remove
    fs.rmSync(target, { recursive: true, force: true });
  } catch (_) { /* ENOENT: nothing to remove */ }

  if (!fs.existsSync(realSkills)) {
    console.error(`MISSING source: ${realSkills}`);
    process.exit(1);
  }
  fs.mkdirSync(linkDir, { recursive: true });

  try {
    if (isWin) {
      fs.symlinkSync(realSkills, target, "junction"); // absolute, no admin
    } else {
      fs.symlinkSync(relTarget, target, "dir"); // relative
    }
    console.log(`LINK ${target} -> ${isWin ? realSkills : relTarget}`);
  } catch (e) {
    fs.cpSync(realSkills, target, { recursive: true });
    console.warn(`COPY ${target} (link failed: ${e.code}). Real files copied; re-run after enabling Dev Mode for a live link.`);
  }
}

targets.forEach(linkOne);
