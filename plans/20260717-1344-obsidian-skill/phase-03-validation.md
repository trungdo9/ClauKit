# Phase 03 — Validation

## Context Links
- CLI entry: `bin/ck.js` · resolver: `bin/lib/kit-resolver.js` · copier: `bin/lib/file-copier.js`
- Verified fact (do NOT re-verify): resolver handles arbitrary-depth kit paths; copyPath skips existing dirs without `--force`.

## Overview
- **Priority:** Medium. **Status:** ☐ · **Depends on:** Phase 1 + 2.
- Confirm files present, kit install lands the skill, registry consistent, no stale counts.

## Implementation Steps

### 3.1 Structural checks
```bash
cd /home/trung/workspace/project/private/ClauKit
ls skills/software/obsidian/ skills/software/obsidian/references/   # expect SKILL.md + 4 refs
head -6 skills/software/obsidian/SKILL.md                           # frontmatter name: obsidian
for f in skills/software/obsidian/SKILL.md skills/software/obsidian/references/*.md; do
  printf '%s: %s lines\n' "$f" "$(wc -l < "$f")"; done              # each < ~200
```

### 3.2 Manifest + registry lint
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/kits/marketing.json','utf8'));console.log('marketing.json OK')"
grep -n "obsidian" docs/clauKit-registry.md                         # expect 3 rows
grep -n "127 skills\|127 active\|221 total" docs/clauKit-registry.md # count line updated
```

### 3.3 Leftover-126 grep (MUST be clean for skill counts)
```bash
grep -rn "126 skills\|126 curated\|126 \`SKILL\|(126 skills)\|126 SKILL" README.md docs/ CLAUDE.md
# expect: no skill-count matches. Any hit → fix before commit.
```

### 3.4 Kit-install smoke test (temp dir)
`ck init` is non-interactive and installs into the CURRENT working directory (no target-dir arg, no `--yes`). Source templates resolve from the script's package root, so run the repo's `ck.js` from inside a temp cwd:
```bash
REPO=/home/trung/workspace/project/private/ClauKit
TMP=$(mktemp -d)
( cd "$TMP" && node "$REPO/bin/ck.js" init --kit marketing ) 2>&1 | tail -20
ls "$TMP/.claude/skills/software/obsidian/" && echo "LANDED"       # expect SKILL.md + references/
rm -rf "$TMP"
```
- Flags (from `cli-parser.js`): only `--kit <name|list|file>` and `--force`. No positional target dir; cwd is the install target.
- Expected SKIP case: if the cwd already has `.claude/skills/software/obsidian`, copyPath prints `⚠️ SKIP (exists)` without `--force` — correct behavior, not a failure. A fresh temp dir avoids this and should report the obsidian path copied.
- Dry alternative (if needed): confirm resolver expands `".claude/skills/software/obsidian/"` and copier mkdir-recursive at depth (already verified facts).

### 3.5 (Optional) engineer + both kits still resolve
```bash
grep -n "skills/software/" .claude/kits/engineer.json .claude/kits/both.json  # confirm broad path present → obsidian auto-covered
```

## Todo List
- [ ] 3.1 structural checks pass (6 files, sizes OK, frontmatter OK)
- [ ] 3.2 marketing.json parses; registry shows 3 obsidian rows + 127 counts
- [ ] 3.3 leftover-126 grep clean
- [ ] 3.4 marketing kit install lands obsidian dir (or clean SKIP)
- [ ] 3.5 engineer/both broad path confirmed

## Success Criteria
- All todos checked. `obsidian` skill installs via all 3 kits. No stale 126 skill-counts.
- Ready for commit: `feat(skills): add obsidian knowledge skill` (semantic-release handles version/changelog).

## Risk Assessment
- **`ck init` flag mismatch:** confirm real signature via `node bin/ck.js init --help`; adapt 3.4 command.
- **False-positive 126 hits:** unrelated numbers may match — inspect, don't blind-replace.

## Security Considerations
- None (validation only, temp dir cleaned up).

## Next Steps
- Report validation results; hand to git-manager for the conventional commit.
