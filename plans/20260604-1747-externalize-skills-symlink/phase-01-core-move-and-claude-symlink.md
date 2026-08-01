# Phase 1 — Core Move + Claude Code Symlink + `files:` Update

**Context:** [plan.md](plan.md) · [reports/01-codebase-impact-analysis.md](reports/01-codebase-impact-analysis.md)
**Priority:** P0 (foundation) | **Confidence:** HIGH | **Risk:** LOW (history-preserving move + transparent symlink)
**Status:** Not started

## Objective
Move the entire `.claude/skills/` tree to repo-root `./skills/` with history preserved, replace `.claude/skills` with a relative symlink → `../skills`, and ship `skills/` in the npm package. Result: Claude Code loads skills identically; canonical source now lives at root for multi-tool sharing.

## Key Insights
- `.claude/skills` is currently a REAL dir (`drwxrwxrwx`), 616 git-tracked files + 6 loose root files.
- Loose root files that MUST move with the tree: `agent_skills_spec.md`, `.env.example`, `INSTALLATION.md`, `README.md`, `skills-lock.json`, `THIRD_PARTY_NOTICES.md`.
- `.env.example` is tracked via `.gitignore` negation `!.env.example` (basename match) — survives the move, still tracked at `skills/.env.example`. Verify.
- `package.json` `files:` ships `.claude/` but NOT `skills/`. Add `"skills/"`.
- Only ONE internal hardcoded ref: `.claude/settings.json:34` `Edit(/.claude/skills/mobile-development/**)` — symlink-TRANSPARENT, NO change. (Note: that subpath `mobile-development/` may not even exist under skills; glob is harmless either way.)
- Repo already uses committed/ignored symlinks (`.gemini/settings.json`) → symlink pattern is established precedent.

## Requirements
**Functional:** `./skills/` contains the full prior tree; `.claude/skills` resolves to it; Claude Code sees all skills.
**Non-functional:** Git history preserved (`git mv`/`git log --follow` works); symlink is RELATIVE (`../skills`) so it survives clone/relocation; symlink committed as mode 120000.

## Architecture / data flow
```
Before:  .claude/skills/{global,marketing,software}/**  (real)
After:   ./skills/{global,marketing,software}/**         (real, canonical)
         .claude/skills  --symlink-->  ../skills          (mode 120000, committed)
```
Claude Code reads `.claude/skills/<x>/SKILL.md` → OS follows link → `./skills/<x>/SKILL.md`. Transparent.

## Related Code Files
- **MOVE (git mv):** `/home/trung/workspace/project/private/ClauKit/.claude/skills/` → `/home/trung/workspace/project/private/ClauKit/skills/` (whole tree incl. 6 loose files).
- **CREATE (symlink):** `/home/trung/workspace/project/private/ClauKit/.claude/skills` → `../skills`.
- **MODIFY:** `/home/trung/workspace/project/private/ClauKit/package.json` — add `"skills/"` to `files:`.
- **NO CHANGE (verify only):** `/home/trung/workspace/project/private/ClauKit/.claude/settings.json` (L34 glob symlink-transparent).

## Implementation Steps
1. **Pre-flight done** (clean tree, on `feat/externalize-skills`, baseline hash recorded — see plan.md gate).
2. **Move tree with history.** `git mv` moves the whole directory and all tracked children in one op (incl. dotfiles like `.env.example` which `git mv` handles since they're tracked):
   ```bash
   git mv .claude/skills skills
   ```
   - If `git mv` errors on the dotfile, fall back: `git mv .claude/skills skills` should still carry `.env.example` (it's tracked). If any loose file is left behind, move explicitly: `git mv .claude/skills/.env.example skills/.env.example`.
3. **Verify move count BEFORE creating symlink.**
   ```bash
   git ls-files skills | wc -l          # expect 616
   test -e .claude/skills && echo "STALE" || echo "GONE"   # expect GONE (dir removed by git mv)
   ls skills/.env.example                # exists
   ```
4. **Create RELATIVE symlink** (target is relative to the link's own dir = `.claude/`):
   ```bash
   ln -s ../skills .claude/skills
   ls -la .claude/skills                 # lrwxrwxrwx ... .claude/skills -> ../skills
   readlink .claude/skills               # ../skills  (RELATIVE, not absolute)
   ```
5. **Stage the symlink as a real git symlink (mode 120000).**
   ```bash
   git add .claude/skills
   git ls-files -s .claude/skills        # leading mode MUST be 120000
   ```
   - If mode shows `100644` (text file), symlink creation/`core.symlinks` is wrong — abort, fix `git config core.symlinks true`, redo step 4.
6. **Update `package.json` `files:`** — add `"skills/"` right after `".claude/",`:
   ```jsonc
   "files": [
     "bin/",
     ".claude/",
     "skills/",          // <-- ADD
     ".opencode/",
     "plans/",
     ...
   ]
   ```
7. **Verify Claude Code path resolution** (proxy for CC loading):
   ```bash
   cat .claude/skills/software/planning/SKILL.md | head -3   # YAML frontmatter prints (resolves through link)
   ```
8. **Verify `.gitignore` did not drop `.env.example`:** `git ls-files --error-unmatch skills/.env.example` → prints path (tracked).
9. **Commit** (only when user approves — per repo rules): `git commit -m "refactor(skills): externalize .claude/skills to root ./skills + symlink"`.

## Todo List
- [ ] Pre-flight gate passed (branch + clean tree)
- [ ] `git mv .claude/skills skills`
- [ ] Verify 616 files moved; `.env.example` present
- [ ] Create relative symlink `.claude/skills -> ../skills`
- [ ] Confirm git mode 120000
- [ ] Add `"skills/"` to `package.json` files:
- [ ] Verify SKILL.md resolves through symlink
- [ ] Verify `.env.example` still tracked
- [ ] (On approval) commit

## Success Criteria
- `git log --follow skills/software/planning/SKILL.md` shows pre-move history.
- `readlink .claude/skills` == `../skills` (relative).
- `git ls-files -s .claude/skills` mode == `120000`.
- SKILL.md readable through `.claude/skills/...`.
- `git ls-files skills | wc -l` == 616.
- `package.json` `files:` contains `skills/`.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `git mv` leaves dotfile behind | LOW | LOW | Explicit `git mv` of `.env.example` fallback (step 2) |
| Symlink committed as text file (mode 100644) | LOW (Unix) | MED | Verify mode in step 5; set `core.symlinks=true` |
| Absolute symlink created by mistake | LOW | MED | Use `../skills` not `$(pwd)/skills`; `readlink` check |
| **Publish before P3** ships dangling link | MED | **HIGH** | plan.md gate: P1+P3 = one shippable unit; do not release between |
| settings.json L34 glob breaks | NONE | — | Glob matches through symlink; no change |

## Security Considerations
- Symlink stays INSIDE repo (`../skills`), no escape to parent FS. No traversal risk.
- `.env.example` (template, no secrets) moves; real `.env*` still gitignored.

## Next Steps / Dependencies
- **Blocks release:** Phase 3 (deref-copy) MUST land before any `npm publish`.
- Phase 2 makes this symlink reproducible on fresh clones (Windows especially).
- Phase 4 reuses the same relative-symlink pattern for `.agent/skills`.
