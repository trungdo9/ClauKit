# Plan — Add `obsidian` Knowledge-Only Skill

**Date:** 2026-07-17 · **Type:** knowledge skill (no command/agent/scripts) · **Status:** ✅ Complete (all 3 phases; review passed C0/H0; ready to commit)

## Goal
Add a knowledge-only skill `obsidian` teaching Obsidian-flavored markdown, vault
conventions, link-integrity, YAML properties, and an OPTIONAL Local REST API MCP
escalation path. Expose to engineer/both/marketing kits. Sync registry + counts.

## Scope (decisions locked — do NOT re-litigate)
- Location: `skills/software/obsidian/` (real dir; `.claude/skills` is a symlink → `../skills`).
- Files: `SKILL.md` + 4 refs (`obsidian-markdown.md`, `frontmatter-properties.md`,
  `vault-conventions.md`, `live-vault-mcp.md`). NO command, NO agent, NO scripts.
- NO Dataview/Templater/Canvas refs (YAGNI, rejected).
- Marketing kit: add `".claude/skills/software/obsidian/"` to `skills[]` in `marketing.json`.
  Engineer + both already cover via `".claude/skills/software/"`.
- Version/changelog: semantic-release handles. Commit `feat(skills): add obsidian knowledge skill`.
- `skills/skills-lock.json` (`{"skills":{}}`) — do NOT touch.

## Safety rules the skill must teach (MANDATORY section in SKILL.md)
1. NEVER write inside `.obsidian/`.
2. Link-integrity check (grep whole vault) before any rename/move.
3. MERGE YAML frontmatter — never blind-overwrite.
4. MCP path requires Local REST API plugin ≥ 4.1.3 (CVE gate).

## Phases
| # | File | Focus | Status |
|---|------|-------|--------|
| 1 | [phase-01-author-skill-files.md](phase-01-author-skill-files.md) | Author SKILL.md + 4 references (full content outlines) | ✅ |
| 2 | [phase-02-kit-registry-docs-sync.md](phase-02-kit-registry-docs-sync.md) | marketing.json patch · registry 3 rows · count bump 126→128 | ✅ |
| 3 | [phase-03-validation.md](phase-03-validation.md) | ck init smoke test · registry lint · leftover-126 grep | ✅ |

## Dependencies
- Phase 2 depends on Phase 1 (files must exist before registry references them).
- Phase 3 depends on Phase 1 + 2 (validates both).

## Key files touched
- CREATE: `skills/software/obsidian/SKILL.md` + `skills/software/obsidian/references/*.md` (4)
- MODIFY: `.claude/kits/marketing.json`; `docs/clauKit-registry.md`; `README.md`;
  `docs/codebase-summary.md`; `docs/project-roadmap.md`; `docs/system-architecture.md`
- UNTOUCHED: `.claude/kits/engineer.json`, `.claude/kits/both.json`, `skills/skills-lock.json`, `CLAUDE.md`

## Success criteria
- 6 files created under `skills/software/obsidian/`; each < ~200 lines; well-formed frontmatter.
- `obsidian` appears in registry 3 places (main software table + Docs category + knowledge-only list) + count line updated.
- All "126" skill-count refs → "127" (README ×8, docs ×6); no stale "126 skills/curated" remain.
- `ck init --kit marketing` in a temp dir lands `skills/software/obsidian/` (or SKIPs cleanly if present).

## Estimated effort
~1.5–2 h (mostly Phase 1 authoring). Low risk — additive docs, no runtime code.

## Unresolved questions
See end of [phase-02](phase-02-kit-registry-docs-sync.md) and summary. None blocking.
