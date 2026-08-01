# Phase 3 — `ck init` Distribution Fix (Dereference-Copy) ⚠️ CRITICAL

**Context:** [plan.md](plan.md) · [reports/01-codebase-impact-analysis.md](reports/01-codebase-impact-analysis.md) (CRITICAL section) · `bin/ck.js:104-121`
**Priority:** P0 — **MANDATORY before any `npm publish`/release** | **Confidence:** HIGH | **Risk:** HIGH (silent consumer breakage if wrong)
**Status:** Not started

## Objective
Make `ck init` (and the npm tarball) ship REAL skill files into the consumer's `.claude/skills/`, regardless of whether the dev repo's `.claude/skills` is a symlink. Consumers must NEVER receive a dangling symlink or an empty dir. This is THE phase that fixes the distribution break P1 introduces.

## The break (exact mechanics)
After P1, `.claude/skills` is a symlink → `../skills`. Two failure paths:
1. **Publish path (HARD break):** `package.json files:` historically shipped `.claude/` but not `skills/`. npm pack would include `.claude/skills` as a symlink whose target `../skills` is NOT in the tarball → consumer gets a **dangling symlink**. (P1 already adds `"skills/"` to `files:` — necessary but NOT sufficient: tarball symlink behavior + `copyDirectory` still need the deref logic below.)
2. **Copy path:** `bin/ck.js` `copyDirectory()` uses `fs.statSync` (FOLLOWS symlinks). On a dev clone it would recurse into the real `../skills` and copy files — accidentally OK. But it's IMPLICIT and fragile (breaks if the resolved target is missing, e.g., in the published tarball where layout differs). Must be made EXPLICIT + robust.

## Key Insights
- Node `v20.19.5` → `fs.cpSync(src, dst, { recursive: true })` available (Node 16.7+). Default `fs.cpSync` does NOT follow symlinks for the top entry unless `dereference: true`. Use `{ recursive: true, dereference: true }` to copy through links into real files.
- `copyDirectory()` currently: `readdirSync` → per entry `statSync` (follows link) → dir? recurse : `copyFileSync`. The cleanest, DRY fix: when an entry is a SYMLINK whose resolved target is a directory, copy the resolved dir's real contents (deref) instead of trying to recreate the link.
- `listFiles()` (lines 126-139) also `statSync` — cosmetic only (post-copy display of the TARGET, which has real files) → no change needed.

## Requirements
**Functional:** `ck init` into an empty dir → target `.claude/skills/` is a REAL directory containing all 616 files; `test -L target/.claude/skills` is FALSE. Works from (a) a dev clone where source is a symlink, AND (b) a published tarball.
**Non-functional:** No new deps. Minimal diff. Backward-compatible when source is a plain dir (pre-P1 behavior unchanged).

## Architecture / chosen approach
**Approach B (deref-copy) — RECOMMENDED.** Consumer gets real files; no symlink dependency. Symlink is a DEV-ONLY convenience. Implement by making `copyDirectory` symlink-aware via `fs.lstatSync` + dereference copy of linked dirs.

Rejected alternatives:
- *Recreate symlink in consumer + also copy `skills/` to consumer root* — adds consumer-side complexity, leaks dev topology, needs `skills/` at consumer root. Violates KISS. ❌
- *Rely on implicit `statSync` follow* — works by accident, fragile across tarball layouts. ❌

## Related Code Files
- **MODIFY:** `/home/trung/workspace/project/private/ClauKit/bin/ck.js` — `copyDirectory()` (lines 104-121). Switch `fs.statSync` → `fs.lstatSync` and handle symlinked dirs via deref copy.
- **VERIFY (no change):** `package.json files:` already has `"skills/"` from P1 (re-confirm present).

## Exact code change
Replace `copyDirectory` (current lines 104-121):
```js
/**
 * Copy directory recursively (dereferences symlinked dirs -> real files).
 * Ensures `ck init` consumers get real skills even when the dev repo's
 * .claude/skills is a symlink to ../skills.
 */
function copyDirectory(source, target) {
  const files = fs.readdirSync(source);

  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const lstat = fs.lstatSync(sourcePath);           // does NOT follow link

    if (lstat.isSymbolicLink()) {
      // Resolve the link's real target; copy real contents (deref).
      const real = fs.realpathSync(sourcePath);
      const realStat = fs.statSync(real);             // follows -> real type
      if (realStat.isDirectory()) {
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
        copyDirectory(real, targetPath);              // recurse into real dir
      } else {
        fs.copyFileSync(real, targetPath);            // linked file -> real file
      }
      return;
    }

    if (lstat.isDirectory()) {
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}
```
> Behavior: source `.claude/skills` symlink → `isSymbolicLink()` true → `realpathSync` → `../skills` (real dir) → recurse → consumer gets real files at `.claude/skills/`. When source is a plain dir (pre-P1 or in a tarball that materialized real files), the symlink branch is skipped → identical to old behavior. Robust both ways.
>
> Alt one-liner per linked dir (if implementer prefers built-in): `fs.cpSync(real, targetPath, { recursive: true, dereference: true })` instead of the recursive call. Either is fine; the recursive form reuses existing function (DRY).

## Implementation Steps
1. Apply the `copyDirectory` change above.
2. Confirm `package.json files:` contains `"skills/"` (from P1).
3. **Smoke test from dev clone (source = symlink):**
   ```bash
   T=$(mktemp -d) && (cd "$T" && node /home/trung/workspace/project/private/ClauKit/bin/ck.js init)
   test -L "$T/.claude/skills" && echo "FAIL: link" || echo "OK: real dir"
   find "$T/.claude/skills" -type f | wc -l        # expect 616
   head -3 "$T/.claude/skills/software/planning/SKILL.md"   # real content
   rm -rf "$T"
   ```
4. **Tarball test (simulates publish):**
   ```bash
   cd /home/trung/workspace/project/private/ClauKit && npm pack          # -> @trungdo9-clau-kit-1.x.x.tgz
   T=$(mktemp -d) && tar -xzf *.tgz -C "$T"
   ls "$T/package/skills" >/dev/null && echo "OK: skills/ in tarball" || echo "FAIL: no skills/"
   # inspect how .claude/skills was packed (symlink vs real):
   tar -tvzf *.tgz | grep '\.claude/skills' | head
   # then run init FROM the unpacked package to confirm real-file copy:
   D=$(mktemp -d) && (cd "$D" && node "$T/package/bin/ck.js" init)
   test -L "$D/.claude/skills" && echo "FAIL: dangling/link" || echo "OK: real dir"
   find "$D/.claude/skills" -type f | wc -l
   rm -rf "$T" "$D" *.tgz
   ```
   - If `tar -tvzf` shows `.claude/skills` as a symlink (`l` flag) AND `skills/` real files are present, the deref copy in step 3 still produces real files because `copyDirectory` resolves via `realpathSync` against the unpacked tree (where `../skills` exists alongside). If the unpacked symlink target is missing, the deref branch throws — see Risk row + mitigation.

## Todo List
- [ ] Patch `copyDirectory` (lstat + deref)
- [ ] Confirm `files:` has `skills/`
- [ ] Dev-clone init smoke test → real dir, 616 files
- [ ] `npm pack` → `skills/` present in tarball
- [ ] Init from unpacked tarball → real dir, no dangling link
- [ ] Pre-P1 regression: plain-dir source still copies (mental/`statSync`-path check)

## Success Criteria
- `ck init` (dev clone) → `.claude/skills` in target is REAL dir, 616 files, NOT a link.
- `npm pack` tarball lists `skills/...` real files.
- Init from unpacked tarball → real files, no dangling symlink, no `statSync` throw.
- Behavior unchanged when source is a plain directory.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tarball packs `.claude/skills` as symlink with target missing in tarball → `realpathSync` throws on init | MED | HIGH | `skills/` now in `files:` (target present in tarball alongside). If still flaky, alternatively EXCLUDE `.claude/skills` symlink from pack via `.npmignore` and have init copy from packed `skills/` into `.claude/skills` (documented variant). Validate with tarball test before publish. |
| `realpathSync` on broken link aborts whole init | LOW | HIGH | Wrap symlink branch in try/catch → on failure, fall through to copy from sibling `skills/` if resolvable; else clear error msg. |
| Consumer expected a live symlink | LOW | LOW | Documented: consumers get real files by design (see plan.md Unresolved Q3). |
| Forgot `files: skills/` | LOW | HIGH | Step 2 re-verify; tarball test catches it. |

## Security Considerations
- `realpathSync` resolves only WITHIN the package/repo tree; no copy of out-of-tree files (symlink target is repo-relative `../skills`).
- No execution of skill content during copy; pure file IO.

## Next Steps / Dependencies
- HARD dependency on Phase 1 (symlink + `files:` change exist).
- **Release gate:** this phase + P1 form the minimum shippable unit. Do not `npm publish` without P3 green.
- Independent of P2 (dev linking) and P4 (Antigravity).
