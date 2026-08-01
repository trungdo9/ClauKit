# Codebase Impact Analysis — Externalize `.claude/skills` + Symlink

**Date:** 2026-06-04 17:50 | **Mode:** /ck:plan hard | **Scope:** move `.claude/skills/` → repo-root `./skills/`, symlink back, share across Claude Code + Antigravity + Codex.

## Current state (verified)

- `.claude/skills/` = **regular dir** (not yet symlink). 74 `SKILL.md` across `global/`, `marketing/`, `software/`.
- **Loose files at `.claude/skills/` root** (move WITH the tree): `agent_skills_spec.md`, `.env.example`, `INSTALLATION.md`, `README.md`, `skills-lock.json`, `THIRD_PARTY_NOTICES.md`.
- No git-tracked symlinks (mode 120000) exist yet.
- No `.codex/`, `.antigravity/`, `.agent/` dirs present. `AGENTS.md` referenced in `package.json` `files:` but not in working tree root (ships from elsewhere / not yet created).
- `.opencode/` already shipped (per `package.json` `files:`) — repo **already multi-tool aware**.

## Internal references to `.claude/skills` (low blast radius)

Only **one** hardcoded reference found:
- [.claude/settings.json:34](.claude/settings.json#L34) → `"Edit(/.claude/skills/mobile-development/**)"` — a permission glob. **Symlink-transparent** (glob matches through symlink). No change needed.
- `docs/*` and command/skill `.md` files mention `.claude/skills/...` as doc links — these resolve fine through a symlink at runtime; no functional break. (Optional: leave as-is.)

## ⚠️ CRITICAL: `ck init` distribution breaks (bin/ck.js)

[bin/ck.js:104-121](bin/ck.js#L104-L121) `copyDirectory()`:
- Uses `fs.statSync` (FOLLOWS symlinks) + `fs.readdirSync` + `fs.copyFileSync`.
- Walks `__dirname/../.claude` recursively and copies into target project's `.claude/`.

**Failure mode after symlinking:**
1. `package.json` `files:` ships `.claude/` but **NOT `skills/`** (the new real folder at repo root). → On `npm install -g`, published tarball contains `.claude/skills` as a **dangling symlink** (target `../skills` absent). `ck init` then either copies an empty/broken dir or throws on `statSync`.
2. Even cloned (Option 3), `copyDirectory` on a symlink dir: `statSync(sourcePath).isDirectory()` is TRUE (follows link) → recurses into real `../skills` and **copies content into target `.claude/skills/` as real files** (target loses the symlink → just a copy). Acceptable for a consumer project, but the publish path (#1) is a hard break.

**Required fixes (any one, plan must pick):**
- (A) Add `"skills/"` to `package.json` `files:` array so the real folder ships. AND make `ck.js` resolve the symlink: after copying `.claude/`, if `.claude/skills` is a symlink, copy the *real* `skills/` into target `.claude/skills/` as files (or recreate symlink + copy `skills/` to target root). Simplest: dereference-copy (consumer gets real files, no symlink dependency).
- (B) Keep `ck init` consumer output as **real files** (deref copy) — consumers don't need the symlink; only THIS repo (dev) uses symlink for multi-tool sharing. This is the cleanest: symlink is a dev-repo convenience, `ck init` flattens it.

## ⚠️ Antigravity symlink bug (researcher-01)

- Antigravity **IDE ignores symlinked skills** (GitHub vercel-labs/skills#633) at global `~/.gemini/antigravity/skills/`. Workspace `./.agent/skills/` symlink behavior **untested**.
- Antigravity uses path `./.agent/skills/` (workspace) — DIFFERENT from `.claude/skills/`. So even a working symlink at `.claude/skills` does NOT make Antigravity see the skills; Antigravity needs its OWN pointer at `./.agent/skills/`.
- Format IS identical (SKILL.md + YAML `name`/`description`). So content reuse is valid; only the *path wiring* differs per tool.

## Codex (researcher-02, low confidence — knowledge-cutoff limited)

- Researcher could not confirm Codex CLI skill-discovery (cutoff predates current Codex). **AGENTS.md is the de-facto cross-tool convention** the repo already bets on (`files:` includes `AGENTS.md`). Codex (and many agents) read root `AGENTS.md`, NOT a skills folder.
- Implication: Codex likely does **not** consume a `skills/` folder at all — it reads `AGENTS.md`. Sharing "skills" with Codex ≠ symlinking a folder; it means generating/maintaining an `AGENTS.md` that points to or summarizes the skills. **This is a separate concern from the symlink task** and should be flagged, not silently assumed solved.

## Symlink mechanics (researcher-02, high confidence)

- **Unix relative symlink:** `ln -s ../skills .claude/skills` (relative target survives clone/relocation). ✅
- **Windows:** `mklink /D` (symlink) needs admin/Dev Mode; `mklink /J` (junction) needs **no elevation**. Git on Windows recreates 120000 symlinks as **text files** unless `core.symlinks=true` + privilege. → cross-platform needs a setup script with junction + copy fallback.
- **Git:** symlink stored mode 120000; `git mv` preserves history.

## Topology decision space (for planner)

Given target = repo-root `./skills/`, the per-tool wiring is:

| Tool | Reads from | Wiring needed | Works via symlink? |
|---|---|---|---|
| Claude Code | `.claude/skills/` | symlink → `../skills` | ✅ yes (CC follows symlinks) |
| Antigravity | `./.agent/skills/` (workspace) | symlink → `../skills` | ⚠️ untested workspace-level; global broken |
| Codex | root `AGENTS.md` (likely) | NOT a folder — needs AGENTS.md | ➖ out of scope for folder-symlink |

**Recommendation seed:** Phase the work — (1) core move + Claude Code symlink (high confidence, immediate value), (2) Antigravity `.agent/skills` symlink (best-effort, document the IDE caveat), (3) cross-platform setup script, (4) `ck init` distribution fix. Treat Codex/AGENTS.md as explicitly deferred or a separate follow-up.

## Open questions for plan

1. Should `ck init` consumers get **real files** (deref) or also a symlink? (Recommend: real files.)
2. Is Antigravity targeting the **IDE** or **CLI**? (CLI symlink behavior may differ; bug is IDE-confirmed.)
3. Confirm Codex skill mechanism out-of-band (docs predate cutoff) before promising Codex sharing.
4. Track `./skills/` in git as the canonical source (yes) and `.claude/skills` symlink (yes, mode 120000) — confirm Windows contributors use the setup script.
