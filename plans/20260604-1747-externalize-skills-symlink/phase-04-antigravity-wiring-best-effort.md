# Phase 4 — Antigravity Wiring (`./.agent/skills`) — BEST-EFFORT

**Context:** [plan.md](plan.md) · [research/researcher-01-antigravity-skill-discovery.md](research/researcher-01-antigravity-skill-discovery.md)
**Priority:** P2 (opportunistic) | **Confidence:** LOW (IDE symlink bug; workspace behavior untested) | **Risk:** LOW (additive; isolated)
**Status:** Not started — gated on manual IDE verification

## Objective
Point Google Antigravity at the same canonical `./skills/` via a workspace-level symlink `./.agent/skills → ../skills`, reusing the Phase-2 script. This is BEST-EFFORT: Antigravity's IDE has a CONFIRMED symlink-discovery bug for GLOBAL skills; workspace-level behavior is UNTESTED. Ship the wiring + a documented manual verification; do NOT claim it works until verified.

## Key Insights (researcher-01)
- Antigravity reads workspace skills from `./.agent/skills/` — DIFFERENT path from `.claude/skills/`. So the Phase-1 `.claude/skills` symlink does NOTHING for Antigravity; it needs its OWN pointer.
- SKILL.md format is IDENTICAL (YAML `name`/`description` + body) → content reuse is valid; only path wiring differs.
- **CONFIRMED BUG (vercel-labs/skills#633):** Antigravity IDE ignores symlinked skills at GLOBAL `~/.gemini/antigravity/skills/`. Workspace-level `./.agent/skills/` symlink: UNTESTED — may share the same bug.
- No env var override for discovery paths found.

## Requirements
**Functional (best-effort):** Create `./.agent/skills → ../skills`. If Antigravity IDE resolves it → skills appear in Antigravity. If not (bug) → fall back to copy (`fs.cpSync`) so real files exist at `./.agent/skills/` (defeats live-sharing but makes skills visible).
**Non-functional:** Reuse Phase-2 `link-skills.js` (DRY) — just add the target. Decide git-tracking of `.agent/skills` based on verification outcome (see decision gate).

## Architecture / decision gate
```
Add ".agent/skills" to link-skills.js targets[].
Run: node scripts/link-skills.js
MANUAL VERIFY in Antigravity IDE: do skills appear?
   YES (symlink resolves) -> commit .agent/skills as symlink (mode 120000); add ".agent/" to package.json files: ONLY IF distributing to consumers (likely NO -> keep dev-only).
   NO  (bug ignores link)  -> use copy fallback OR generate real files; document caveat. Decide: track copied dir? (probably .gitignore it to avoid 616 dup files in VCS.)
```
> Until manually verified, default to NOT committing `.agent/skills` and NOT adding `.agent/` to `files:`. Treat as local dev wiring.

## Related Code Files
- **MODIFY:** `/home/trung/workspace/project/private/ClauKit/scripts/link-skills.js` — append `path.join(repoRoot, ".agent", "skills")` to `targets` array (Phase-2 already structured for this).
- **CREATE (runtime, maybe not committed):** `/home/trung/workspace/project/private/ClauKit/.agent/skills` → `../skills` (symlink) OR copied dir.
- **MODIFY (conditional):** `/home/trung/workspace/project/private/ClauKit/.gitignore` — if copy-fallback used, add `/.agent/skills` to avoid committing 616 duplicate files. (Decision deferred to verification.)
- **MODIFY (docs):** `/home/trung/workspace/project/private/ClauKit/skills/INSTALLATION.md` — Antigravity section + caveat + manual-verify instructions.
- **DO NOT (default):** add `.agent/` to `package.json files:` (consumers don't need it; revisit only if proven + desired).

## Implementation Steps
1. Edit `scripts/link-skills.js`: add `.agent/skills` to `targets`.
2. Run `node scripts/link-skills.js` → creates `.agent/skills` link (Unix) / junction (Win).
3. Verify FS resolution: `head -3 .agent/skills/software/planning/SKILL.md` → real content.
4. **MANUAL GATE:** Open this repo as a workspace in Antigravity IDE. Check skill picker / agent skill list. Record result in this file's Status.
5. **Branch on result:**
   - Resolves → keep symlink; consider committing (`git add .agent/skills`; verify mode 120000). Document "works on Antigravity vX".
   - Ignored (bug) → `rm .agent/skills`; re-run a copy variant (or `fs.cpSync` fallback already triggers if you force it); add `/.agent/skills` to `.gitignore`; document "Antigravity needs real files; run `npm run link-skills` (copy mode) to refresh".
6. Document the caveat + the vercel-labs/skills#633 reference in `INSTALLATION.md`.

## Todo List
- [ ] Add `.agent/skills` target to `link-skills.js`
- [ ] Run script → link/junction created
- [ ] FS resolution check (SKILL.md readable)
- [ ] MANUAL: verify in Antigravity IDE (record outcome)
- [ ] Branch: commit symlink OR copy + gitignore
- [ ] Document Antigravity caveat + #633 ref in INSTALLATION.md

## Success Criteria (best-effort)
- `.agent/skills` resolves to `./skills` on the filesystem.
- Manual IDE check performed and OUTCOME RECORDED (pass or fail — both are acceptable deliverables; the requirement is to verify+document, not to force it to work).
- If symlink ignored: real files present at `.agent/skills/` via fallback; caveat documented.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Antigravity IDE ignores workspace symlink (same as global bug) | MED-HIGH | LOW | Copy fallback; gitignore dup; document. Feature is best-effort. |
| Committing copied `.agent/skills` bloats repo (616 dup files) | MED | MED | If copy needed, `.gitignore` it; regenerate via script |
| Drift between `.agent/skills` copy and canonical `./skills` | MED | LOW | Doc: re-run `npm run link-skills` after skill changes |
| Over-promising Antigravity support | LOW | MED | plan.md + docs label it best-effort/untested |

## Security Considerations
- Symlink/junction stays within repo. Copy duplicates only repo-internal content. No secrets.

## Next Steps / Dependencies
- Depends on Phase 1 (`./skills/`) + Phase 2 (`link-skills.js` exists & structured for multi-target).
- Outcome feeds plan.md Unresolved Q2 (workspace symlink behavior).
- Does NOT block release.
