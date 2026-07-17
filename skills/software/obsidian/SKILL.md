---
name: obsidian
description: Author & edit Obsidian vaults — Obsidian-flavored markdown (wikilinks [[note]], embeds, callouts, tags, block refs), typed YAML frontmatter properties, vault conventions, and link-integrity on rename/move. Optional live-vault Local REST API MCP path. Triggers on obsidian, vault, wikilink, note-taking, markdown notes. Operates on plain .md files with normal tools (no client code).
license: MIT
---

# Obsidian

Knowledge skill for reading and writing notes in an Obsidian vault as plain markdown files — no plugin code, no client library; just correct syntax, safe file operations, and vault-aware conventions.

## When to Use

- Create or edit notes using Obsidian-flavored markdown (wikilinks, embeds, callouts, tags, block refs)
- Add or merge typed YAML frontmatter properties on notes
- Rename or move notes safely (link-integrity across the vault)
- Understand vault layout (attachments, daily notes, templates, `.obsidian/`)
- Escalate to a live running vault via MCP (see `references/live-vault-mcp.md`)

**NOT for:** Dataview/Templater/Canvas plugin syntax (out of scope — do not emit); building Obsidian plugins; plain markdown outside a vault (use standard markdown).

## Safety Rules (MANDATORY)

1. **NEVER write inside `.obsidian/`** — it holds config, plugins, and workspace state; edits risk corruption and data loss.
2. **Link-integrity before rename/move** — grep the whole vault for every reference form of the old name (see `references/vault-conventions.md`); update all matches or WARN the user with a file+line list. Never rename blind.
3. **MERGE frontmatter, never overwrite** — parse the existing YAML block, add/update only the intended keys, preserve unknown keys and their order (see `references/frontmatter-properties.md`).
4. **MCP path gated on plugin ≥ 4.1.3** — earlier Local REST API versions have a path-traversal CVE (GHSA-62gx-5q78-wrvx). Verify the version before any live-vault operation.

## Quick Reference (load on demand)

- Markdown syntax (wikilinks, embeds, callouts, tags, comments, block refs): `references/obsidian-markdown.md`
- Frontmatter properties (typed YAML, merge rule): `references/frontmatter-properties.md`
- Vault conventions + link-integrity procedure: `references/vault-conventions.md`
- Live-vault MCP escalation (optional): `references/live-vault-mcp.md`

Load only the reference needed for the current step to keep context lean.

## Workflow

1. **Detect vault root** — from the note's path, walk up parent directories until one contains `.obsidian/`. If none is found, this is not a vault: warn and treat files as plain markdown.
2. **Syntax / authoring** → load `references/obsidian-markdown.md`.
3. **Properties** → load `references/frontmatter-properties.md`; MERGE into any existing block.
4. **Rename / move** → run the link-integrity procedure in `references/vault-conventions.md` FIRST, then apply the change.
5. **Live vault ops** → load `references/live-vault-mcp.md`, verify Local REST API plugin ≥ 4.1.3, route via `/ck:use-mcp`.

## Cross-references

- `/ck:use-mcp` — MCP registration/usage entry point
- `skills/software/markdown-novel-viewer/SKILL.md` — render markdown as book-like HTML (complementary)
- `skills/integrations/wordpress-rest/SKILL.md` — publish notes to WordPress (marketing kit)
