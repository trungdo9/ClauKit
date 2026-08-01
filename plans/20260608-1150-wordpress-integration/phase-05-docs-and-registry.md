# Phase 5 — Docs: Registry, THIRD_PARTY_NOTICES, README, CLAUDE.md

## Context links
- Registry: `docs/clauKit-registry.md` (§1 Skills, §6 Summary Counts, Last Updated line)
- TPN: `skills/THIRD_PARTY_NOTICES.md` (existing GPL v3 entry = format model)
- README: `skills/marketing/README.md` (§MCPs table, §Source repos)
- Root: `CLAUDE.md` (Kits section)

## Overview
- Priority: P1 (final). Depends on P1–P4. Status: ☐.
- Reconcile all docs to final state: +2 skills, new Integrations category, attribution, README mention, optional CLAUDE.md kit note.

## Current counts (from registry, pre-change)
- Last Updated: 2026-06-07. Header counts line: "128 skills (128 active) · 31 agents · 72 commands · 231 total".
- Summary table: marketing 50, automation 6, software 70, global 1 → **Skills total 127** · Agents 31 · Commands 72 · Grand total **230**.
- NOTE: header line (128) and summary table (127) already disagree by 1 pre-existing. Flag but don't fix scope-creep beyond our +2 unless trivially correct. Recommend: set skills total = previous_table_total (127) + 2 = **129**; reconcile header line to match table during this edit.

## Files to modify
| Path | Action | Change |
|---|---|---|
| `docs/clauKit-registry.md` | modify | new `### Integrations (2)` skill section; bump §1 heading + summary table + Last Updated + header counts |
| `skills/THIRD_PARTY_NOTICES.md` | modify | add WordPress agent-skills GPL v2+ attribution block |
| `skills/marketing/README.md` | modify | add WordPress row to MCP table + What's-included mention + Source repos |
| `CLAUDE.md` | modify (optional) | one-line note: integrations skills in marketing/both kit |
| `.claude/kits/marketing.json` | modify | finalize `description` skill count to match registry (reconcile from P1) |

## Registry edits

### New skills section (add after Marketing Automation, before Software · Top-level)
```markdown
### Integrations (2) — `skills/integrations/` — NEW

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `wordpress-rest` | ✅ | `integrations/wordpress-rest/` | WordPress REST client — publish/update posts & pages (draft→publish), media, taxonomies, Yoast/RankMath SEO meta, audit. Env-only auth, idempotent, draft-default. Adapted (consumer) from WordPress agent-skills (GPL v2+, attributed in TPN). |
| `mcp-wordpress` | ✅ | `integrations/mcp-wordpress/` | WordPress MCP wrapper (BYO server) with curl fallback to wordpress-rest. |
```

### Heading + counts to bump
- `## 1 · Skills (74)` → category-group count: add Integrations group; the "(74)" appears to be a grouping subtotal — recompute or leave structural, but ADD Integrations line in summary.
- Summary table (§6): insert row `| Skills · integrations/ (NEW) | 2 | 0 | 2 |`; update `**Skills total**` 127 → **129**; `**Grand total entries**` 230 → **232**.
- Header counts line (top): set to "129 skills (129 active + 0 scaffold) · 31 agents · 72 commands · **232 total entries**". (Reconciles prior 128/127 mismatch to the table number.)
- `**Last Updated**`: → `2026-06-08 (WordPress integration — skills/integrations/ added: wordpress-rest + mcp-wordpress)`.
- Commands: stay 72 (we added ACTIONS to existing /mk:content + /mk:seo, no new command). Optionally note new actions in the `mk` dispatcher row description.

## THIRD_PARTY_NOTICES edit (append new section)
```markdown
---

## **GNU General Public License v2.0 or later**

The following knowledge source informed an ADAPTED (re-authored) skill in this product. No source code was copied; ClauKit's `wordpress-rest` skill is original work that consumes the documented WordPress REST API. Attribution per GPL provenance:

**WordPress agent-skills (`wp-rest-api`)**, Copyright (c) WordPress contributors
Source: https://github.com/WordPress/agent-skills/tree/trunk/skills/wp-rest-api
License: GPL v2.0 or later (same as WordPress core)

Note: the original skill is PHP-developer-focused (building REST endpoints inside a WP plugin). ClauKit's adaptation is a CLIENT/consumer skill (publishing & auditing content over REST). Only the public API knowledge (endpoints, auth model) was referenced.
```
(If reproducing full GPL v2 text is desired for completeness, append the canonical GPL v2 license text below this block — match the existing GPL v3 entry's "License Text:" pattern. Recommend: link + provenance note sufficient since we copied no code; include full text only if repo policy requires.)

## marketing README edits
- §MCPs table — add row:
  ```markdown
  | **WordPress** | Publish/update posts & pages, media, taxonomies, SEO meta, audit | `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD` | curl REST path (wordpress-rest skill) |
  ```
- §What's included — add a line: "Integrations: WordPress REST client (publish/update/audit content) — `/mk:content publish`, `/mk:seo audit wp:<id>`."
- §Source repos — add: "`WordPress/agent-skills` — wp-rest-api knowledge (GPL v2+, adapted to consumer client; see THIRD_PARTY_NOTICES)."

## CLAUDE.md edit (optional, recommended)
Under the Kits/marketing section, add one line:
> Integrations: `skills/integrations/` (marketing + both kits) — `wordpress-rest` client + `mcp-wordpress` wrapper. WP publish via `/mk:content publish` (draft-default), WP audit via `/mk:seo`.

## marketing.json description reconcile
- Update `description` skill count to match final registry (e.g. reflect +2 skills / "2 integration skills") so manifest description ≈ registry. Cosmetic but keeps single-source-of-truth consistent.

## Todo list
- [ ] registry: add Integrations section
- [ ] registry: summary table + skills total 129 + grand total 232
- [ ] registry: header counts line reconciled
- [ ] registry: Last Updated → 2026-06-08
- [ ] TPN: WordPress GPL v2+ attribution block
- [ ] README: MCP table row + What's-included + Source repos
- [ ] CLAUDE.md: integrations note (optional)
- [ ] marketing.json: description count reconcile

## Success criteria
- Registry counts internally consistent (header = summary table). Integrations section present, both skills ✅.
- TPN has WordPress GPL v2+ entry with source URL + adapt-not-copy note.
- README MCP table + sources mention WordPress.
- All docs use env-var creds in any example (no secrets).

## Risk assessment
- Risk: count drift / pre-existing 128-vs-127 mismatch. Mitigation: explicitly reconcile to 129 (table-derived) this pass; document the reconciliation in Last Updated note.
- Risk: GPL contamination claim. Mitigation: TPN states no code copied, original re-authored, MIT on our work; only public API knowledge referenced.

## Security considerations
- Docs must not contain real credentials/site URLs. Use placeholders only.

## Consolidated Unresolved Questions (whole plan)
1. **GPL full text in TPN** — include full GPL v2 license text, or provenance link + note sufficient? (We copy no code → recommend link+note; confirm repo policy.)
2. **Registry count baseline** — header (128) vs summary table (127) already disagree pre-change. Plan reconciles to 129 (table+2). Confirm acceptable to fix the pre-existing off-by-one here.
3. **MCP server canonical name** — `@automattic/wordpress-mcp` named as primary example; community alternatives exist. Confirm OK to reference generically (BYO).
4. **SEO meta writability** — unknown per target site (Yoast/RankMath REST may not be exposed). Handled at runtime via discovery + manual fallback; no plan-time resolution needed.
5. **JS helper scripts** — ship the 2 optional scripts (auth header + media upload) or pure-curl only? Recommend ship (parity w/ payment-integration), low cost.
6. **`/mk:content publish` vs new `/mk:publish`** — plan uses action on existing command (per user). Confirm no desire for standalone command (would change command count to 73).
