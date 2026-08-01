# Code Review — `obsidian` knowledge skill

Date: 2026-07-17 · Reviewer: code-reviewer agent · Scope: obsidian-attributable files only
(concurrent-session changes — mcp-manager deletion, agent edits, claude-md skill, project-overview-pdr — NOT reviewed)

## Scope

Files reviewed:
- `skills/software/obsidian/SKILL.md` (49 L)
- `skills/software/obsidian/references/obsidian-markdown.md` (111 L)
- `skills/software/obsidian/references/frontmatter-properties.md` (66 L)
- `skills/software/obsidian/references/vault-conventions.md` (61 L)
- `skills/software/obsidian/references/live-vault-mcp.md` (35 L)
- Obsidian hunks in: `.claude/kits/marketing.json`, `docs/clauKit-registry.md`, `docs/codebase-summary.md`, `docs/project-roadmap.md`, `docs/system-architecture.md`, `README.md`

Review focus: factual accuracy of Obsidian facts + internal/registry consistency (knowledge skill — no runtime surface).
LOC analyzed: 322 (skill) + doc hunks.

## Overall Assessment

Solid, accurate, well-structured knowledge skill. Obsidian-flavored markdown, frontmatter/properties, callout taxonomy, tag rules, vault layout facts all verified correct. All 4 mandatory safety rules present in SKILL.md AND detailed in matching ref. No Dataview/Templater/Canvas syntax leaked (only named as exclusions). All cross-ref targets exist. All 6 files well under 200 L. Registry/docs top-line counts (128 skills · software 69 · group totals) match filesystem ground truth exactly — no stale "126". marketing.json valid JSON with obsidian path added.

No Critical or High findings. One substantive Medium (link-integrity completeness gap) + minor Low items.

## Critical Issues

None.

## High Priority Findings

None.

## Medium Priority Improvements

### M1 — Link-integrity grep misses PATH-QUALIFIED link forms
`references/vault-conventions.md:40-53` (patterns table + example sweep)

The MANDATORY rename/move procedure anchors every pattern on the basename immediately after the opener: `[[Old Name`, `[[Old Name|`, `[[Old Name#`, `![[Old Name`, `](Old Name.md)`. Example sweep is `grep -rn "\[\[Old Name" <vault-root>`.

Gap: when a vault's "Files & Links → New link format" is set to *Relative path* or *Absolute path in vault*, Obsidian writes path-qualified links — `[[folder/Old Name]]`, `[[sub/dir/Old Name#H]]`, `](notes/Old%20Name.md)`. None of the listed patterns match these (text between `[[` and the basename). Step 3's "ambiguous → STOP and WARN" safety net does NOT fire, because a missed link produces zero matches — silent broken links after rename/move.

Impact: broken wikilinks/embeds in path-based-link vaults; the default "shortest path" mode is covered, so common case is safe, but the doc claims a whole-vault sweep.

Fix: add a path-qualified row + loosen the sweep, e.g.
```bash
# basename may be preceded by a folder path inside the link
grep -rnE "\[\[([^]|#]*/)?Old Name([]|#]|$)" <vault-root>
grep -rnE "\]\(([^)]*/)?Old(%20| )Name\.md\)" <vault-root>
```
Or state explicitly that the procedure assumes shortest-path link mode and to widen the grep when the vault uses path-based links.

## Low Priority Suggestions

### L1 — List-item block-ID guidance likely imprecise
`references/obsidian-markdown.md:42` — "For list items, put the id on its own line after the item." Canonical Obsidian form appends `^id` at the END of the list-item line (same as paragraphs); autocomplete inserts it there. Suggest clarifying end-of-line form works for list items too (verify against current Obsidian behavior).

### L2 — Live-vault MCP: self-signed TLS gotcha unaddressed
`references/live-vault-mcp.md:18-23` — `claude mcp add --transport http obsidian https://127.0.0.1:27124/mcp/ …` targets an HTTPS endpoint with a self-signed cert; TLS verification may reject the connection with no mention of how to trust the cert. Add a one-line caveat (trust cert / known self-signed limitation). Ports 27124 (HTTPS) / 27123 (HTTP) and transport flag are otherwise correct.

### L3 — Registry prose stale next to obsidian-edited header (pre-existing, adjacent)
`docs/clauKit-registry.md:124,126` — obsidian hunk bumped header "Top-level standalone (37→39)" but adjacent unchanged prose still reads "All 40 are active"/"baseline 39 active". Confusing at the edit site though not introduced by this change. Optional cleanup.

## Positive Observations

- Every Obsidian markdown construct has a working syntax example (req 3 met): wikilinks, embeds, block refs, callouts, tags, comments, highlight.
- Callout type taxonomy (note/abstract/info/todo/tip/success/question/warning/failure/danger/bug/example/quote + all aliases) matches Obsidian docs exactly.
- Frontmatter facts correct: 6 property types, `cssclasses` (1.4+) vs legacy `cssclass`, `position` reserved-key pitfall, tags-without-`#`, quoted-wikilink-in-list. MERGE RULE (safety 3) sound — parse/preserve keys+order, prepend if absent.
- Safety rules 1-4 each stated in SKILL.md and expanded in the correct ref; `.obsidian/` write-ban + CVE-gated MCP (≥4.1.3, GHSA-62gx-5q78-wrvx) consistently repeated.
- Vault-detection (walk up to `.obsidian/`), attachment-convention detection, filename-constraint set all accurate.
- `description` embeds all required trigger words (obsidian, vault, wikilink, note-taking, markdown notes); `name: obsidian` == folder.
- Lazy-load discipline ("load only the reference needed") keeps context lean — good skill hygiene.

## Recommended Actions

1. (M1) Widen link-integrity grep to cover path-qualified links, or scope the procedure to shortest-path mode explicitly.
2. (L1) Fix/clarify list-item block-ID placement.
3. (L2) Add self-signed-TLS caveat to MCP setup.
4. (L3) Optional: reconcile "standalone (39)" header with adjacent "40 active" prose (pre-existing).

## Metrics

- Obsidian factual accuracy: pass (1 imprecision L1)
- Safety rules coverage: 4/4 in SKILL.md + 4/4 detailed in refs
- Leaked out-of-scope syntax (Dataview/Templater/Canvas): 0
- Cross-ref targets valid: 3/3 (markdown-novel-viewer, wordpress-rest, /ck:use-mcp)
- File sizes: all < 200 L (max 111)
- Registry math: 128 = software 69 + marketing 50 + global 1 + automation 6 + integrations 2 — matches disk; software 39 standalone + 30 subcat = 69 (registry scheme, internally consistent)
- marketing.json: valid JSON, obsidian path present

## Unresolved Questions

1. Cross-doc classification of `csharp-developer` + `node-specialist`: registry lists them in the standalone table (→ standalone 39, development 9) while codebase-summary + system-architecture count them under `development/` (→ standalone 37, development 11). Both net to software 69. Disk path is `software/development/…`, so the docs' scheme matches disk; the registry table scheme does not. PRE-EXISTING (predates obsidian), out of review scope — flag only: is a single canonical decomposition desired?
2. L1 (list-item `^id` on-own-line) — confirm against a live current Obsidian build before rewording; asserted from knowledge, not tested here.
