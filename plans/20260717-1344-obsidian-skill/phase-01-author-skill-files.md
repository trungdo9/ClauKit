# Phase 01 — Author Skill Files

## Context Links
- Style/safety-gate reference: `skills/integrations/wordpress-rest/SKILL.md`
- Knowledge-only precedent: `skills/software/markdown-novel-viewer/SKILL.md`
- Frontmatter spec: `docs/code-standards.md` § "Skill Definition Files" (`name:` lowercase-hyphen == folder)

## Overview
- **Priority:** High (blocks Phase 2/3). **Status:** ☐
- Author 6 files under real dir `skills/software/obsidian/` (NOT `.claude/skills/...` — that is a symlink → `../skills`).
- Each file self-contained, focused, < ~200 lines (repo hard limit). Load-on-demand: SKILL.md thin, detail in refs.

## Key Insights
- `.claude/skills` symlinks to `../skills` → write to `/home/trung/workspace/project/private/ClauKit/skills/software/obsidian/`.
- wordpress-rest pattern = frontmatter (name/description/license) → When to Use → Safety gates (MANDATORY) → Quick Reference (load on demand) → Workflow → Cross-references. Mirror it.
- Description MUST embed trigger words so skill auto-activates: obsidian, vault, wikilink, note-taking, markdown notes.
- Knowledge-only = teaches Claude how to act on plain `.md` vault files with its normal Read/Edit/Grep tools; MCP path is optional escalation, ships NO client code.

## Related Code Files (all CREATE)
| Path | Purpose | Target lines |
|------|---------|-------------|
| `skills/software/obsidian/SKILL.md` | entry: triggers, safety, workflow, ref pointers | ~85 |
| `skills/software/obsidian/references/obsidian-markdown.md` | wikilinks, embeds, callouts, tags, comments, block refs, highlight | ~160 |
| `skills/software/obsidian/references/frontmatter-properties.md` | typed YAML props, merge rule | ~120 |
| `skills/software/obsidian/references/vault-conventions.md` | detection, folders, filename rules, link-integrity | ~150 |
| `skills/software/obsidian/references/live-vault-mcp.md` | optional Local REST API MCP escalation | ~90 |

---

## File 1 — `SKILL.md` (content outline)

**Frontmatter** (YAML):
```yaml
---
name: obsidian
description: Author & edit Obsidian vaults — Obsidian-flavored markdown (wikilinks [[note]], embeds, callouts, tags, block refs), typed YAML frontmatter properties, vault conventions, and link-integrity on rename/move. Optional live-vault Local REST API MCP path. Triggers on obsidian, vault, wikilink, note-taking, markdown notes. Operates on plain .md files with normal tools (no client code).
license: MIT
---
```

**Body sections:**
1. `# Obsidian` + 1-line intro: knowledge skill for reading/writing notes in an Obsidian vault as plain markdown files.
2. `## When to Use` — bullets:
   - Create/edit notes using Obsidian-flavored markdown (wikilinks, embeds, callouts).
   - Add/merge typed YAML frontmatter properties.
   - Rename/move notes safely (link-integrity).
   - Understand vault layout (attachments, daily notes, templates).
   - Escalate to a live running vault via MCP (see `live-vault-mcp.md`).
   - **NOT for:** Dataview/Templater/Canvas plugin syntax (out of scope); building Obsidian plugins; non-vault plain markdown (use standard markdown).
3. `## Safety Rules (MANDATORY)` — numbered, bold the imperative:
   1. **NEVER write inside `.obsidian/`** — config/plugins/workspace; edits risk data loss.
   2. **Link-integrity before rename/move** — grep whole vault for old name (see vault-conventions.md); update all or WARN with file+line list.
   3. **MERGE frontmatter, never overwrite** — parse existing YAML, add/update keys, preserve unknown keys + order (see frontmatter-properties.md).
   4. **MCP path gated on plugin ≥ 4.1.3** — earlier versions have path-traversal CVE (GHSA-62gx-5q78-wrvx).
4. `## Quick Reference (load on demand)`:
   - Markdown syntax (wikilinks/embeds/callouts/tags/comments/block refs): `references/obsidian-markdown.md`
   - Frontmatter properties (typed YAML, merge): `references/frontmatter-properties.md`
   - Vault conventions + link-integrity: `references/vault-conventions.md`
   - Live-vault MCP (optional): `references/live-vault-mcp.md`
   - Note: load only the ref needed for the current step to keep context lean.
5. `## Workflow` — numbered:
   1. Detect vault root (walk up for `.obsidian/`) — if none, treat as plain markdown, warn.
   2. For syntax/authoring → load `obsidian-markdown.md`.
   3. For properties → load `frontmatter-properties.md`, MERGE.
   4. For rename/move → run link-integrity procedure (vault-conventions.md) FIRST.
   5. For live vault ops → load `live-vault-mcp.md`, verify plugin ≥ 4.1.3, route via `/ck:use-mcp`.
6. `## Cross-references`:
   - `/ck:use-mcp` — MCP registration/usage entry point.
   - `skills/software/markdown-novel-viewer/SKILL.md` — render markdown as book-like HTML (complementary).
   - `skills/integrations/wordpress-rest/SKILL.md` — publish notes to WordPress (marketing kit).

---

## File 2 — `references/obsidian-markdown.md` (content outline)

Cover, with fenced code examples for each:

- **Internal links (wikilinks):**
  - `[[Note Name]]` — link by note name (extension omitted).
  - `[[Note Name|Display Text]]` — aliased display.
  - `[[Note Name#Heading]]`, `[[Note Name#Heading#Subheading]]` — heading links.
  - `[[Note Name#^block-id]]` — block link; `[[#Heading]]` / `[[#^block-id]]` — same-note.
  - Markdown-style alternative: `[text](Note%20Name.md)` or `[text](<Note Name.md>)`; wikilink vs md-link controlled by Settings → Files & Links → "Use [[Wikilinks]]".
- **Embeds (transclusion):** prefix link with `!`.
  - `![[Note Name]]` (whole note), `![[Note Name#Heading]]` (section), `![[Note#^block-id]]` (block).
  - `![[image.png]]`, size: `![[image.png|200]]` (width) or `![[image.png|200x100]]` (WxH).
  - `![[document.pdf#page=3]]` — embed PDF page.
- **Block references (`^block-id`):**
  - Append `^my-id` at END of a paragraph/line (own line for list items). IDs: letters, numbers, hyphens only.
  - Typing `^` in link autocomplete makes Obsidian generate a random id (e.g. `^a1b2c3`).
  - Reference elsewhere: `[[Note#^my-id]]`; embed: `![[Note#^my-id]]`.
- **Callouts:** blockquote + `[!type]`.
  ```
  > [!note]
  > Body line.

  > [!warning] Custom Title
  > Body.

  > [!tip]- Collapsed by default
  > Body (foldable: `-` collapsed, `+` expanded).
  ```
  - Types: note, abstract/summary/tldr, info, todo, tip/hint/important, success/check/done,
    question/help/faq, warning/caution/attention, failure/fail/missing, danger/error, bug, example, quote/cite.
  - Nest by adding extra `>`.
- **Tags:** `#tag` inline anywhere in body; nested `#parent/child`.
  - Rules: must have ≥1 non-numeric char; no spaces; allowed = alphanumeric `_ - /`. `#2024` alone is invalid; `#v2024` valid. Case-insensitive match, display preserves case.
  - Frontmatter tags live under `tags:` WITHOUT `#` (see frontmatter-properties.md).
- **Comments:** `%%inline comment%%` or block:
  ```
  %%
  multi-line, not rendered in reading view / export
  %%
  ```
- **Highlight:** `==highlighted==`.
- **Standard markdown also supported (note briefly):** bold `**`, italic `*`, strikethrough `~~`, task lists `- [ ]`/`- [x]`, tables, footnotes `[^1]`, GFM. Keep this section to 1–2 lines.

---

## File 3 — `references/frontmatter-properties.md` (content outline)

- **What/where:** YAML block fenced by `---` at the VERY TOP (first line) of the note. Obsidian 1.4+ calls these "Properties" and assigns types.
- **Property types:** Text, List, Number, Checkbox (bool), Date (`YYYY-MM-DD`), Date & time (`YYYY-MM-DDThh:mm:ss`).
- **Recognized/special properties (table):**
  | Key | Meaning | Format |
  |-----|---------|--------|
  | `tags` | note tags (no `#`) | list or inline `[a, b]` |
  | `aliases` | alt names; `[[alias]]` resolves here | list |
  | `cssclasses` | CSS classes on note view (1.4+ name; old = `cssclass`) | list |
  | `publish` | Obsidian Publish include | bool |
- **Example block:**
  ```yaml
  ---
  aliases: [Meeting Notes, Standup]
  tags:
    - project/atlas
    - wip
  cssclasses: [wide-table]
  created: 2026-07-17
  reviewed: 2026-07-17T09:30:00
  priority: 3
  done: false
  related:
    - "[[Project Atlas]]"
  ---
  ```
- **Notes:** list-type property may hold quoted wikilinks `"[[Note]]"` (renders as link). `#` prefix NOT used in frontmatter tags.
- **MERGE RULE (MANDATORY — repeat from SKILL.md):**
  1. If a note already has a frontmatter block, PARSE it first.
  2. Add/update only the intended keys; KEEP all existing keys, their values, and order.
  3. Preserve user comments/formatting where feasible; never replace the whole block.
  4. If no frontmatter exists, prepend a new `---` block as the first lines.
- **Pitfalls:** reserved key `position` (internal) — avoid; no leading/trailing spaces in names; keep one block only (Obsidian reads the first).

---

## File 4 — `references/vault-conventions.md` (content outline)

- **Vault = a folder** containing a hidden `.obsidian/` config dir at its root.
- **Detection procedure:** from a note's path, walk UP parent directories until one contains `.obsidian/` → that is the vault root. If none found → not a vault; warn, treat as plain markdown.
- **NEVER write in `.obsidian/`** (restate safety rule 1): plugins, workspace.json, themes, snippets — corruption/data-loss risk.
- **Attachment folders:** Settings → Files & Links → "Default location for new attachments" = vault root | same folder as note | subfolder under current | specified folder. Common conventions: `attachments/`, `_attachments/`, `assets/`. Detect existing convention before adding files; match it.
- **Daily notes:** core Daily Notes plugin → configured folder + date format (default `YYYY-MM-DD.md`) + optional template.
- **Templates:** core Templates plugin `templates/` folder; placeholders `{{title}}`, `{{date}}`, `{{time}}`. (Templater plugin syntax is OUT of scope — do not emit.)
- **Filename constraints:** disallow in note names — `/ \ : # ^ [ ] |` (break wikilinks) plus OS-illegal `* " < > ?`. Avoid leading `.` (hidden). Prefer spaces or hyphens; keep basenames unique across vault (Obsidian resolves by shortest unique path).
- **LINK-INTEGRITY on rename/move (MANDATORY — the core value of this skill):**
  1. Obsidian's app auto-updates links; direct file edits by an agent do NOT. So do this manually.
  2. Before renaming `Old Name.md` → `New Name.md`, grep the WHOLE vault for every reference form:
     - `[[Old Name]]`
     - `[[Old Name|`  (aliased)
     - `[[Old Name#`  (heading/block links)
     - `![[Old Name`  (embeds, incl. `![[Old Name#...`)
     - `](Old Name.md)` and `](Old%20Name.md)`  (only if md-style links used)
     - Example grep: `grep -rn "\[\[Old Name" <vault-root>`
  3. Update every match to the new name (preserve `|alias`, `#heading`, `^block` suffixes), OR if any match is ambiguous → STOP and WARN user with a file+line list; do not guess.
  4. Moving folders: basename links usually still resolve; if duplicate basenames exist, verify/adjust to a path-qualified link.
- **New-note placement:** infer from where similar notes live; respect existing folder structure; don't dump at root unless that's the vault convention.

---

## File 5 — `references/live-vault-mcp.md` (content outline)

- **Purpose:** OPTIONAL escalation — interact with a RUNNING Obsidian instance (read active file, live search, trigger commands) vs. static file editing. Default = static file editing; use MCP only when live interaction is needed.
- **Plugin:** "Local REST API" (community plugin). **Require version ≥ 4.1.3.**
  - v4.0 (May 2026) shipped a built-in MCP server.
  - 4.1.3 patched a path-traversal CVE: **GHSA-62gx-5q78-wrvx** → versions < 4.1.3 are BLOCKED (safety rule 4).
- **Setup steps:**
  1. Obsidian → Community plugins → install & enable "Local REST API".
  2. Copy the API key from the plugin settings tab.
  3. Endpoint: HTTPS `https://127.0.0.1:27124/` (self-signed cert), MCP at path `/mcp/`. (Plain HTTP on 27123 — avoid.)
  4. Register with Claude:
     ```
     claude mcp add --transport http obsidian https://127.0.0.1:27124/mcp/ --header "Authorization: Bearer <api-key>"
     ```
  5. Route all usage through `/ck:use-mcp`.
- **Safety:** localhost-only (self-signed cert); NEVER expose port publicly; API key is a secret (env/keychain, never commit). Gate every use on plugin ≥ 4.1.3.
- **Boundary:** ClauKit ships NO client code — this file is a thin pointer only. If plugin absent/old → fall back to static file editing.

## Todo List
- [ ] `mkdir -p skills/software/obsidian/references`
- [ ] Write `SKILL.md` (File 1)
- [ ] Write `references/obsidian-markdown.md` (File 2)
- [ ] Write `references/frontmatter-properties.md` (File 3)
- [ ] Write `references/vault-conventions.md` (File 4)
- [ ] Write `references/live-vault-mcp.md` (File 5)
- [ ] Confirm each file < ~200 lines; frontmatter `name: obsidian` == folder name

## Success Criteria
- 6 files exist; SKILL.md frontmatter valid (name/description/license); triggers present in description.
- All 4 safety rules stated in SKILL.md AND detailed in the matching ref.
- Syntax examples present for every markdown construct listed.
- No Dataview/Templater/Canvas syntax emitted.

## Risk Assessment
- **Wrong dir (symlink):** author under real `skills/…`, not `.claude/skills/…`. Mitigate: verified `.claude/skills → ../skills`.
- **File over 200 lines:** split content or tighten; obsidian-markdown.md is the tightest — keep examples minimal.
- **Stale plugin facts:** version/CVE are locked facts from brainstorm; do not re-verify or "correct".

## Security Considerations
- Covered by the 4 safety rules (`.obsidian/` write ban, link-integrity, frontmatter merge, MCP CVE gate) — these ARE the security surface of a knowledge skill.

## Next Steps
- Proceed to Phase 2 (register + docs sync) once all 6 files exist.
