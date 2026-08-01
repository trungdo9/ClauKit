# Phase 2 — Cross-Platform Link Script (`scripts/link-skills.js`)

**Context:** [plan.md](plan.md) · [research/researcher-02-codex-and-symlink-mechanics.md](research/researcher-02-codex-and-symlink-mechanics.md)
**Priority:** P1 | **Confidence:** HIGH (OS mechanics well-documented) | **Risk:** MED (Windows path/elevation edge cases)
**Status:** Not started

## Objective
Provide a single `node scripts/link-skills.js` that recreates the `.claude/skills → ../skills` link (and, in Phase 4, `.agent/skills → ../skills`) on ANY platform. Needed because Git on Windows does NOT recreate mode-120000 symlinks (renders as text files) without `core.symlinks=true` + Dev Mode/admin. Node is already a dep → ONE script, no bash+ps1 duplication (DRY/KISS).

## Key Insights (from researcher-02, HIGH confidence)
- **Unix:** relative symlink `ln -s ../skills .claude/skills` → `fs.symlinkSync('../skills', '.claude/skills', 'dir')`.
- **Windows:** junction `mklink /J` needs NO elevation; symlink `/D` needs admin/Dev Mode. Node `fs.symlinkSync(target, path, 'junction')` creates a junction (no elevation) — but **junctions require an ABSOLUTE target**. So Windows branch resolves `../skills` → absolute path.
- **Copy fallback:** if symlink+junction both throw (locked-down Windows), `fs.cpSync(realSkills, target, { recursive: true })` produces real files (Node 16.7+; repo runs Node 20 — confirmed `v20.19.5`).
- **Git committed symlink (P1) already works on Unix clones.** This script is the RECOVERY path for Windows clones (where the committed symlink arrived as a junk text file) and a re-link convenience.
- **NOT an npm `postinstall`.** Repo's existing `scripts/postinstall.js` is DORMANT (not referenced in `package.json`, `scripts/` not in `files:`). A postinstall link hook would WRONGLY fire in CONSUMER `npm install` (consumers get deref-copied REAL files via `ck init` — they must not try to symlink). Keep this a MANUAL dev step. (YAGNI.)

## Requirements
**Functional:** Idempotent. Detect platform. Create relative symlink (Unix) / junction (Windows) / copy (fallback). If `.claude/skills` already a correct symlink → no-op. If it's a stale text file / wrong link → replace.
**Non-functional:** Zero external deps (Node stdlib only). Clear console output. Non-zero exit on hard failure.

## Architecture / control flow
```
link-skills.js  (targets: [".claude/skills"], later + ".agent/skills")
  for each target:
    real = path.resolve(repoRoot, "skills")
    if target is already a symlink/junction pointing at skills -> log OK, skip
    if target exists as file/dir (stale) -> rm
    try:
      Unix  -> fs.symlinkSync("../skills", target, "dir")        # relative
      Win   -> fs.symlinkSync(real, target, "junction")          # absolute, junction (no admin)
    catch:
      copy fallback -> fs.cpSync(real, target, {recursive:true}) # real files
      warn: "copied (not linked) — re-run after enabling Dev Mode for a live link"
```
> Note: on Unix the link target is the RELATIVE `../skills` (survives relocation). On Windows a junction stores an ABSOLUTE path (junction limitation) — acceptable since it's regenerated post-clone by this script, never committed from Windows.

## Related Code Files
- **CREATE:** `/home/trung/workspace/project/private/ClauKit/scripts/link-skills.js`
- **MODIFY (optional):** `/home/trung/workspace/project/private/ClauKit/package.json` — add convenience script `"link-skills": "node scripts/link-skills.js"` (NOT postinstall).
- **MODIFY (docs, Phase-1 file already moved):** `/home/trung/workspace/project/private/ClauKit/skills/INSTALLATION.md` and/or `/home/trung/workspace/project/private/ClauKit/README.md` — document "Windows/fresh-clone: run `npm run link-skills`".
- **DO NOT add to `.gitignore`:** `.claude/skills` STAYS committed as a symlink (Unix source of truth). The script only repairs platforms where git couldn't materialize it.

## Reference implementation (pseudocode — exact code is implementer's)
```js
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const repoRoot = path.resolve(__dirname, "..");
const realSkills = path.join(repoRoot, "skills");
const isWin = process.platform === "win32";

// Phase 4 appends ".agent/skills" to this list.
const targets = [path.join(repoRoot, ".claude", "skills")];

function linkOne(target) {
  const linkDir = path.dirname(target);            // .claude/
  const relTarget = path.relative(linkDir, realSkills); // "../skills"

  // already correct?
  try {
    const st = fs.lstatSync(target);
    if (st.isSymbolicLink()) {
      const cur = fs.readlinkSync(target);
      if (path.resolve(linkDir, cur) === realSkills) { console.log(`OK  ${target}`); return; }
    }
    // stale (text file from win git, wrong link, or real copy) -> remove
    fs.rmSync(target, { recursive: true, force: true });
  } catch (_) { /* ENOENT: nothing to remove */ }

  if (!fs.existsSync(realSkills)) { console.error(`MISSING source: ${realSkills}`); process.exit(1); }
  fs.mkdirSync(linkDir, { recursive: true });

  try {
    if (isWin) fs.symlinkSync(realSkills, target, "junction"); // absolute, no admin
    else       fs.symlinkSync(relTarget, target, "dir");       // relative
    console.log(`LINK ${target} -> ${isWin ? realSkills : relTarget}`);
  } catch (e) {
    fs.cpSync(realSkills, target, { recursive: true });
    console.warn(`COPY ${target} (link failed: ${e.code}). Real files copied; re-run after enabling Dev Mode for a live link.`);
  }
}

targets.forEach(linkOne);
```

## Implementation Steps
1. Create `scripts/link-skills.js` per reference above.
2. `chmod +x scripts/link-skills.js` (Unix); shebang present.
3. Add `package.json` script: `"link-skills": "node scripts/link-skills.js"`.
4. Document in `skills/INSTALLATION.md` + `README.md`: Windows / fresh-clone users run `npm run link-skills` after clone.
5. Test idempotency on Unix: with P1 symlink present → script prints `OK` and changes nothing (`readlink` unchanged).
6. Test repair on Unix: `rm .claude/skills && node scripts/link-skills.js` → recreates relative symlink; `readlink` == `../skills`.
7. (If Windows available) Test: delete link, run script → junction created (`dir` shows `<JUNCTION>`), no elevation prompt.

## Todo List
- [ ] Create `scripts/link-skills.js`
- [ ] Idempotent OK-path
- [ ] Stale-file removal path
- [ ] Unix relative symlink branch
- [ ] Windows junction branch (absolute target)
- [ ] Copy fallback (`fs.cpSync`)
- [ ] `package.json` `link-skills` script
- [ ] Docs note (INSTALLATION/README)
- [ ] Verify idempotency + repair on Unix
- [ ] (opt) Verify junction on Windows

## Success Criteria
- Running twice in a row on Unix: 2nd run prints `OK`, no FS change.
- After `rm .claude/skills`, script restores RELATIVE symlink (`readlink` == `../skills`).
- Script never requires admin on Windows (junction path).
- Copy fallback yields real, readable SKILL.md files when linking blocked.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Junction needs absolute target (relative fails on Win) | HIGH (known) | MED | Win branch uses absolute `realSkills` |
| Copy fallback drifts from canonical `./skills` over time | MED | MED | Doc: copy is last resort; prefer Dev Mode; re-run to re-sync |
| Script run from wrong cwd | LOW | LOW | Resolve paths from `__dirname`, not cwd |
| Someone wires it as `postinstall` → fires in consumer installs | MED | HIGH | Explicitly NOT postinstall; doc warns; manual `npm run link-skills` |
| Symlink loop (skills/* → back into .claude) | NONE | — | No reverse links created; verify `find . -maxdepth 4 -type l` |

## Security Considerations
- Target stays within repo (junction/symlink to in-repo `skills/`). No FS escape.
- Copy fallback duplicates only repo-internal content; no secret material (`.env.example` is a template).

## Next Steps / Dependencies
- Depends on Phase 1 (`./skills/` must exist).
- Phase 4 extends `targets` array with `.agent/skills`.
- Independent of Phase 3 (different concern: dev-clone linking vs. consumer distribution).
