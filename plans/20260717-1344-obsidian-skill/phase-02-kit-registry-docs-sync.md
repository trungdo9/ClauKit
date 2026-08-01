# Phase 02 — Kit Manifest · Registry · Docs Count Sync

## Context Links
- Registry: `docs/clauKit-registry.md` (rows to edit: 5, ~147, ~424, ~447)
- Kit manifest: `.claude/kits/marketing.json`
- Precedent skill in all 3 registry spots: `markdown-novel-viewer`

## Overview
- **Priority:** High. **Status:** ☐ · **Depends on:** Phase 1 (files exist).
- Register `obsidian` and bump skill count 126 → 127 everywhere it appears. Additive, low risk.

## Key Insights
- Engineer + both kits auto-include via `".claude/skills/software/"` — only marketing.json needs a path added.
- Marketing-kit install COPY will SKIP `skills/software/obsidian` if the dir already exists (copyPath skips existing without `--force`) — acceptable/expected; note it, do not treat as a bug.
- `skills/skills-lock.json` is `{"skills":{}}` — do NOT touch.
- CLAUDE.md contains no "126" count (verified) — no edit there.

## Related Code Files (all MODIFY)

### 2.1 `.claude/kits/marketing.json`
Add one entry to `paths.skills[]` (after `".claude/skills/integrations/"`):
```json
    "skills": [
      ".claude/skills/marketing/",
      ".claude/skills/automation/",
      ".claude/skills/integrations/",
      ".claude/skills/software/obsidian/"
    ],
```
- Keep JSON valid (comma placement). Optionally bump the `description` skill count if it lists one — current marketing.json `description` says "48 skills" (marketing-kit-scoped, NOT global 126) → leave unless team wants +1; obsidian adds one software skill to the marketing kit surface. **Decision:** update to "49 skills" is OPTIONAL/cosmetic — flag, default = leave as-is (marketing count is fuzzy already). List in unresolved.

### 2.2 `docs/clauKit-registry.md` — 4 edits
**(a) Count line (line 5):**
- OLD: `**Counts**: 126 skills (126 active + 0 scaffold) · 30 agents · 64 commands · **220 total entries**`
- NEW: `**Counts**: 127 skills (127 active + 0 scaffold) · 30 agents · 64 commands · **221 total entries**`

**(b) Software main table (after `markdown-novel-viewer` row ~147 / before/after `mintlify`):** add row (match column format):
```
| `obsidian` | ✅ | `software/obsidian/` | Knowledge-only — Obsidian-flavored markdown (wikilinks, callouts, block refs), typed frontmatter properties, vault conventions + link-integrity, optional Local REST API MCP |
```

**(c) Docs category table (line ~424):** add `` `obsidian` `` to the skill list:
- OLD: `| Docs | \`mintlify\`, \`markdown-novel-viewer\`, \`tech-graph\`, \`document-skills/*\` | \`docs-manager\` | \`/ck:docs [init\|update\|summarize]\` |`
- NEW: `| Docs | \`mintlify\`, \`markdown-novel-viewer\`, \`obsidian\`, \`tech-graph\`, \`document-skills/*\` | \`docs-manager\` | \`/ck:docs [init\|update\|summarize]\` |`

**(d) Misc knowledge-only list (line ~447):** add `` `obsidian` ``:
- OLD: `| Misc skills (knowledge only) | \`preview\`, \`markdown-novel-viewer\`, \`mintlify\`, \`tech-graph\`, \`cti-expert\`, design subskills | – | – |`
- NEW: `| Misc skills (knowledge only) | \`preview\`, \`markdown-novel-viewer\`, \`mintlify\`, \`obsidian\`, \`tech-graph\`, \`cti-expert\`, design subskills | – | – |`

### 2.3 Count bump 126 → 127 (README ×8, docs ×5 more)
Run first: `grep -rn "126 skills\|126 curated\|126 \`SKILL" README.md docs/ CLAUDE.md`

**`README.md`** — replace 126 → 127 in these 8 lines (verify each is a skill-count, not an unrelated number):
- L3 `*126 skills · 30 agents …*`
- L12 `126 curated skills, 30 specialized agents …` (one occurrence)
- L20 `126 skills hand-selected …`
- L278 `across 126 skills + 52 commands`
- L500 `# Specialized skills library (126 skills)`
- L633 `126 curated skills, 30 agents …`
- L716 JSON-LD `126 curated skills …`
- L731 JSON-LD FAQ `126 curated skills …`

**`docs/codebase-summary.md`** — 4 edits:
- L24 `126 SKILL.md files` → `127 SKILL.md files`
- L101 `126 \`SKILL.md\` files across 5 top-level groups` → `127 …`
- L109 `| \`software/\` | 67 | Top-level standalone (37) + subcategorized: …` → `| \`software/\` | 68 | Top-level standalone (38) + subcategorized: …`
- L220 `Skill files: 126 \`SKILL.md\`` → `127`

**`docs/project-roadmap.md`** — L187:
- OLD `… 126 \`SKILL.md\` files (software 67 · marketing 50 · global 1 · automation 6 · integrations 2).`
- NEW `… 127 \`SKILL.md\` files (software 68 · marketing 50 · global 1 · automation 6 · integrations 2).`

**`docs/system-architecture.md`** — L279:
- OLD `**126 skills across 5 groups** …` → NEW `**127 skills across 5 groups** …`

> Line numbers are as-of this plan; re-grep before editing in case of drift. Use exact-string Edit, not line-number edits.

## Implementation Steps
1. Patch `marketing.json` (2.1); validate JSON: `node -e "JSON.parse(require('fs').readFileSync('.claude/kits/marketing.json'))"`.
2. Registry 4 edits (2.2 a–d).
3. Count bump across README + 3 docs (2.3).
4. Re-grep to confirm zero stale skill-count "126" remain (see Phase 3).

## Todo List
- [ ] marketing.json: add `".claude/skills/software/obsidian/"`, JSON valid
- [ ] registry line 5 counts 126→127 / 220→221
- [ ] registry software table: add `obsidian` row
- [ ] registry Docs category row: add `obsidian`
- [ ] registry knowledge-only row: add `obsidian`
- [ ] README ×8 count edits
- [ ] codebase-summary ×4 (incl. software 67→68, standalone 37→38)
- [ ] project-roadmap L187 (126→127, software 67→68)
- [ ] system-architecture L279 (126→127)

## Success Criteria
- marketing.json parses; contains the obsidian path.
- `grep -n obsidian docs/clauKit-registry.md` → 3 hits (main table + Docs + knowledge-only), count line = 127.
- No remaining skill-count "126" in README/docs (Phase 3 grep clean).

## Risk Assessment
- **Missed count ref:** mitigate with the mandatory re-grep in Phase 3.
- **Non-skill "126":** L500/other may contain unrelated numbers — verify each match is a skill count before replacing (do not `sed` blindly).
- **JSON break:** run the JSON.parse check after editing marketing.json.

## Security Considerations
- None (docs/manifest only).

## Next Steps → Phase 3 validation.

## Unresolved (this phase)
- marketing.json `description` "48 skills" bump to "49" — cosmetic, default leave. Confirm preference.
