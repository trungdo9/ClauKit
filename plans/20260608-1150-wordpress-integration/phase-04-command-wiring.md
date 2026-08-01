# Phase 4 — Command Wiring (`/mk:content` publish + `/mk:seo` WP audit)

## Context links
- `.claude/commands/mk/content.md` — current Actions: blog/social/video/copy
- `.claude/commands/mk/seo.md` — current Actions: audit/keywords/ai/programmatic/schema
- Skills authored P2/P3: `wordpress-rest`, `mcp-wordpress`
- Agent: `.claude/agents/marketing/content-strategist.md` (reuse — see decision)

## Overview
- Priority: P1. Depends on P2 (skills must exist). Status: ☐.
- Add a `publish` action to `/mk:content`; add WordPress `audit` target to `/mk:seo`. Skills activate automatically via the command's `### Actions` skill list (per existing convention).

## Key insights
- Commands declare skills inline under each action's `skills:` bullet → that's the auto-activation mechanism. No code; just markdown additions.
- Routing preference: prefer `mcp-wordpress` if MCP server present, else `wordpress-rest`. Listing both in the action's skills line lets the model pick at runtime.
- Pre-flight HARD FAIL (`plans/marketing-context.md`) + Notes block (PII/idempotency/cross-refs) already present — keep, optionally append WP-specific note.
- `argument-hint` frontmatter must be updated to include new actions.

## Agent decision — REUSE `content-strategist` (no new agent)
- `/mk:content` already "Activate content-strategist agent + action-specific skills." Publishing is a content-lifecycle step, not a new persona. YAGNI → no new agent. content-strategist orchestrates; the skill carries the how-to.
- For `/mk:seo` WP audit: keep routing through the `seo` skill (claude-seo orchestrator) — WP fetch is just the input acquisition step before existing analysis. No agent change.

## Files to modify
| Path | Action | Change |
|---|---|---|
| `.claude/commands/mk/content.md` | modify | add `publish` action + skills line; update `argument-hint`; add WP note |
| `.claude/commands/mk/seo.md` | modify | add `audit` WP-target sub-mode + skills; update `argument-hint`; add WP note |

## `/mk:content` edits

### frontmatter argument-hint
`blog|social|video|copy <topic>` → `blog|social|video|copy|publish <topic|target>`

### Add to `### Actions`
```markdown
- **`publish`** — Push a generated post to WordPress (DRAFT by default; live publish requires explicit `--publish` flag + confirmation)
  - skills: `wordpress-rest`, `mcp-wordpress` (use MCP server if configured, else REST curl path)
  - args: `<file-or-slug>` (the content asset to push); flags: `--publish` (live), `--page` (target page not post)
  - Safety gate: preflight `GET /wp-json/` → idempotent upsert by slug (update if exists, else create) → status:draft unless `--publish` AND user confirms target URL+title.
  - Requires env: `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`.
```

### Workflow line update
Change "Activate content-strategist agent + the action-specific skills." → add: "For `publish`, content-strategist coordinates the `wordpress-rest`/`mcp-wordpress` skill; default status draft, live publish gated on explicit flag + confirmation."

### Notes append
```markdown
- WordPress publish: credentials via env only (never hardcode/log). Default = draft. Live publish = explicit `--publish` + confirmation. Re-publish updates by slug (idempotent), never duplicates.
```

## `/mk:seo` edits

### frontmatter argument-hint
`audit|keywords|ai|programmatic|schema <target>` → keep, but document `<target>` may be a WP post id or URL for `audit`.

### Extend `audit` action
```markdown
- **`audit`** — Full SEO audit (technical + content + backlinks + schema). Target may be: a URL, OR a live WordPress post (`wp:<id>` or a WP URL) — fetched via REST then analyzed.
  - skills: `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`; + `wordpress-rest` (when target is a WP post — fetch live content via REST before analysis)
  - WP flow: preflight `GET /wp-json/` → `GET /wp-json/wp/v2/posts/<id>?context=edit` (or resolve slug from URL) → normalize {title,content,excerpt,yoast/rankmath meta} → run claude-seo analysis.
```

### Notes append
```markdown
- WordPress audit: read-only (GET). Credentials via env only. No writes during audit.
```

## Todo list
- [ ] content.md: argument-hint + publish action + skills + workflow line + note
- [ ] seo.md: audit WP-target + skills + note
- [ ] verify draft-default + idempotency wording present in content.md
- [ ] verify seo WP path is read-only

## Success criteria
- `/mk:content` lists `publish` w/ wordpress-rest + mcp-wordpress skills, draft-default gate, `--publish` flag.
- `/mk:seo` `audit` accepts WP post id/URL, lists wordpress-rest for fetch, read-only.
- argument-hints updated. Pre-flight + existing Notes intact.

## Risk assessment
- Risk: users expect live publish by default → mitigated by explicit flag + confirmation wording in command + skill.
- Risk: duplicate posts on re-run → idempotent-upsert note in command points to skill enforcement.
- Risk: scope creep (adding update/delete actions). YAGNI — `publish` covers create+update via upsert; no separate delete action in v1.

## Security considerations
- Command text reiterates env-only creds + draft default. Audit path read-only. No secrets in command files.

## Next steps / dependencies
- Unblocks P5 (registry command count + README mention reflect new actions; note `/mk:` command count unchanged — actions added, not new commands).

## Unresolved
- Whether `publish` should be a new top-level `/mk:publish` command vs an action on `/mk:content`. Decision per user: action on `/mk:content` (no new command). Keeps command count stable.
