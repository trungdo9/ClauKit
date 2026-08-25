# Phase 6 — OPTIONAL / DEFERRED: marketing skill attribution footers

**Exit gate:** `grep -rc 'adapted for ClauKit' skills/marketing --include=SKILL.md | grep -vc ':0$'` → `0` (full gate block at the end of this file)

**Status: not part of the recommended scope (Option A).** Ship it as a separate commit, later, or never. Depends on nothing; blocks nothing. `plan.md` question 4 asks the maintainer to decide.

**Interfaces**
- Consumes: from Phase 1 — the display-name string `KitForge`. Nothing else.
- Produces: nothing consumed by any other phase.

---

## What it is

60 files under `skills/marketing/*/SKILL.md` carry one generated attribution line each. Two variants, by source repo:

```
Imported from `coreyhaines31/marketingskills` and adapted for ClauKit. Adaptations: ClauKit frontmatter, scoped to marketing kit namespace (`/mk:`), references `plans/marketing-context.md`. For full original content, see source repo.
```

```
Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. Adaptations: ClauKit frontmatter, scoped to marketing kit namespace (`/mk:`), references `plans/marketing-context.md`. For full original content, see source repo.
```

Two occurrences of the brand word per line, 60 lines, all at line ~50 of their file. Every one of them is emitted by a template.

## Why it is deferred, not skipped

**For shipping it:** the files are shipped (`package.json` `files` includes `skills/`), the line is prose a user can read, and it is a single template string — a genuinely cheap change.

**For deferring it:** 60 files in the diff would bury the 17-file brand change and make it unreviewable, the line is attribution boilerplate rather than positioning copy, and no user reads line 50 of a skill body for the product name. YAGNI.

## The change, if run

**Source of truth first — edit the generators, then regenerate or sed:**

- `scripts/generate-marketing-skills.js:133` — the template literal:
  ```js
  Imported from \`${source}\` and adapted for ClauKit. Adaptations: ClauKit frontmatter, scoped to marketing kit namespace (\`/mk:\`), references \`plans/marketing-context.md\`. For full original content, see source repo.
  ```
  → replace both `ClauKit` with `KitForge`.
- `scripts/generate-marketing-skills.js:6` — header comment `* - ClauKit frontmatter (name, description, allowed-tools)` → `KitForge frontmatter`.
- `scripts/generate-marketing-skills.js:55` — `docs/clauKit-registry.md` path → **unchanged** (frozen).
- `scripts/generate-marketing-agents.js` — 3 occurrences; apply the same split (prose → `KitForge`, `docs/clauKit-registry.md` → unchanged).

**Do not regenerate the skill files.** The generators are write-once by design (`--force` to overwrite) precisely because a re-run once replaced 16 hand-authored files with stubs — recorded in `docs/clauKit-registry.md` § the 2026-08-11 entry. Apply the 60 footer edits with a **line-anchored** replacement instead:

```bash
cd /home/trung/workspace/project/private/ClauKit
grep -rl 'and adapted for ClauKit' skills/marketing --include=SKILL.md \
  | xargs sed -i 's/and adapted for ClauKit\. Adaptations: ClauKit frontmatter/and adapted for KitForge. Adaptations: KitForge frontmatter/g'
```

The pattern is anchored on the full sentence, so it cannot touch `docs/clauKit-registry.md` references or any other `ClauKit` in those files.

---

## Exit gate

```bash
cd /home/trung/workspace/project/private/ClauKit
echo "old footers: $(grep -rc 'adapted for ClauKit' skills/marketing --include=SKILL.md | grep -v ':0$' | wc -l)"
echo "new footers: $(grep -rc 'adapted for KitForge' skills/marketing --include=SKILL.md | grep -v ':0$' | wc -l)"
echo "generator old: $(grep -c 'adapted for ClauKit' scripts/generate-marketing-skills.js)"
echo "generator new: $(grep -c 'adapted for KitForge' scripts/generate-marketing-skills.js)"
echo "files changed: $(git diff --name-only | wc -l)"
npm test 2>&1 | tail -6
```

**Expected, exactly:**

```
old footers: 0
new footers: 60
generator old: 0
generator new: 1
files changed: 62
```

and `npm test` → `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1`.

`files changed: 62` = 60 `SKILL.md` + `scripts/generate-marketing-skills.js` + `scripts/generate-marketing-agents.js`. A higher number means the `sed` escaped its intended set.

Commit separately, same no-release type:

```bash
git commit -m 'chore(brand): rename ClauKit -> KitForge in marketing skill attribution footers'
```
→ `git log -1 --pretty=%s | grep -qE '^chore\(' && echo ok` → `ok`
