# Plan — Externalize `.claude/skills` → root `./skills/` + Cross-Platform Symlink

**Date:** 2026-06-04 17:47 | **Mode:** `/ck:plan hard` | **Branch target:** NEW feature branch (current = `main`)
**Goal:** Single canonical skill set at repo-root `./skills/`, symlinked back to `.claude/skills` so Claude Code + (best-effort) Antigravity + (deferred) Codex share ONE source. Version-controlled, cross-platform.

## Inputs (read by planner)
- `research/researcher-01-antigravity-skill-discovery.md`
- `research/researcher-02-codex-and-symlink-mechanics.md`
- `reports/01-codebase-impact-analysis.md` (blast radius + the critical `ck.js` break)

## TL;DR architecture
- **Canonical source:** `./skills/` (real dir, git-tracked, 616 files + 6 loose root files).
- **Claude Code:** `.claude/skills` → relative symlink `../skills` (committed, mode 120000). CC follows symlinks. ✅
- **Antigravity:** `./.agent/skills` → relative symlink `../skills` (best-effort; IDE symlink bug documented). ⚠️
- **Codex:** NOT a folder-symlink. Root `AGENTS.md` convention. Explicitly DEFERRED. ➖
- **`ck init` consumers:** get REAL files via dereference-copy (consumers never need/keep the symlink).

## Pre-flight gate (BLOCKING — do before Phase 1)
1. `git status` → working tree CLEAN. If dirty, stop / stash.
2. Create + switch to feature branch: `git checkout -b feat/externalize-skills`. (NEVER work on `main`.)
3. Baseline sanity (record output): `node bin/ck.js help` runs; `git ls-files .claude/skills | wc -l` → expect **616**.
4. Confirm `.claude/skills` is a real dir (not already a symlink): `test -L .claude/skills && echo LINK || echo REALDIR` → expect `REALDIR`.
5. Snapshot baseline commit hash for rollback: `git rev-parse HEAD`.

## Phases

| # | Phase | Confidence | Risk | File |
|---|---|---|---|---|
| 1 | Core move + Claude Code symlink + `files:` update | HIGH | LOW | [phase-01](phase-01-core-move-and-claude-symlink.md) |
| 2 | Cross-platform link script (`scripts/link-skills.js`) | HIGH | MED | [phase-02](phase-02-cross-platform-link-script.md) |
| 3 | `ck init` distribution fix (deref-copy in `ck.js`) | HIGH | **HIGH** | [phase-03](phase-03-ck-init-distribution-fix.md) |
| 4 | Antigravity wiring (`./.agent/skills` best-effort) | LOW | LOW | [phase-04](phase-04-antigravity-wiring-best-effort.md) |
| 5 | Codex / `AGENTS.md` (DEFERRED — outline only) | N/A | N/A | [phase-05](phase-05-codex-agents-md-deferred.md) |

**Ordering rationale:** P1 ships highest value (CC sharing works) but P1 ALONE breaks `npm publish` distribution → **P3 is mandatory before any publish/release** and is the single most important phase. P2 makes the symlink reproducible on fresh clones (esp. Windows). P4 is opportunistic. P5 is documentation-only.

> ⚠️ **Do NOT cut a release / `npm publish` between P1 and P3.** P1 turns `.claude/skills` into a symlink; until P3 lands, the published tarball ships a dangling symlink and `ck init` breaks for all consumers. P1+P3 are a single shippable unit.

## Verification matrix (per tool, after P1–P4)

| Tool | Reads from | Verify | Expected |
|---|---|---|---|
| Claude Code | `.claude/skills/` (symlink) | `/ck:find` or restart + skill list loads; `ls .claude/skills/software/planning/SKILL.md` resolves | Skills load identically to pre-move |
| `ck init` consumer | copied `.claude/skills/` | `ck init` into empty temp dir → target `.claude/skills` is REAL dir w/ files, NOT a link (`test -L` → false; file count = 616) | Real files, no dangling link |
| npm tarball | packed `skills/` + `.claude/` | `npm pack` → inspect tarball lists `skills/...` real files; `.claude/skills` link harmless | `skills/` present |
| Antigravity | `./.agent/skills/` | MANUAL: open workspace in Antigravity IDE, check skill picker | UNKNOWN (document result) |
| Codex | root `AGENTS.md` | N/A this plan | Deferred |

## Global rollback
- Pre-publish, single branch: `git reset --hard <baseline-hash>` then `rm -f .claude/skills .agent/skills` (remove any created symlinks) and re-checkout: `git checkout .claude/skills`. Branch is disposable — worst case `git checkout main && git branch -D feat/externalize-skills`.

## YAGNI / KISS / DRY notes
- **YAGNI:** No npm `postinstall` auto-link (would wrongly fire in consumer installs where deref-copy already gave real files). Link script is a **manual dev step**. Codex generator NOT built (deferred).
- **KISS:** Node script branches Unix/Windows in ONE file (`link-skills.js`) — node already a dep. No bash+ps1 duplication.
- **DRY:** ONE canonical `./skills/`. ONE link script handles both `.claude/skills` and `.agent/skills` targets.

## Unresolved Questions
1. **Codex mechanism (HIGH):** No confirmed skill-discovery folder for Codex (research cutoff). De-facto convention = root `AGENTS.md`, which repo already ships in `files:` but does NOT yet exist in tree. Does Codex read a folder at all, or only `AGENTS.md`? Must confirm out-of-band before promising Codex sharing.
2. **Antigravity workspace symlink (MED):** IDE symlink bug confirmed for GLOBAL `~/.gemini/antigravity/skills/` (vercel-labs/skills#633). Workspace-level `./.agent/skills/` symlink behavior UNTESTED — may also be ignored. Needs manual verify in real IDE (Phase 4).
3. **Do consumers ever need the symlink? (LOW):** Plan assumes NO — `ck init` deref-copies real files; symlink is a dev-repo convenience only. Confirm no consumer workflow expects `.claude/skills` to be a live link to a shared `./skills/`.
4. **Windows contributor friction (MED):** Git on Windows recreates mode-120000 symlinks as TEXT files unless `core.symlinks=true` + Dev Mode/admin. Windows contributors must run `scripts/link-skills.js` (junction, no elevation) after clone. Acceptable? Or do most contributors use WSL/macOS/Linux?
