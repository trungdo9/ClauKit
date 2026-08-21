---
description: Content creation — blog posts, social, video scripts, copy
argument-hint: blog|social|video|copy|publish <topic|target>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: blog)
REST: $2..$n (action-specific arguments)

## Workflow

Activate content-strategist agent + the action-specific skills. For `publish`, content-strategist coordinates the `wordpress-rest`/`mcp-wordpress` skill; default status is draft, live publish gated on explicit `--publish` flag + user confirmation.

### Actions

- **`blog`** — SEO-optimized long-form blog post (E-E-A-T compliant)
  - skills: `copywriting`, `seo-content`, `copy-editing`
- **`social`** — Multi-platform social content (Twitter, LinkedIn, Instagram)
  - skills: `social-content`, `copywriting`
- **`video`** — Video script (hook + body + CTA) for short-form or long-form
  - skills: `copywriting`, `video-producer`
- **`copy`** — Conversion copy — landing pages, ads, CTAs
  - skills: `copywriting`, `cro`
- **`publish`** — Push a generated post to WordPress (DRAFT by default; live publish requires explicit `--publish` flag + confirmation)
  - skills: `wordpress-rest`, `mcp-wordpress` (use MCP server if configured, else REST curl path)
  - args: `<file-or-slug>` (the content asset to push); flags: `--publish` (live), `--page` (target page not post)
  - Safety gate: preflight `GET /wp-json/` → idempotent upsert by slug (update if exists, else create) → `status:draft` unless `--publish` AND user confirms target URL + title.
  - Requires env: `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`.

## Output

Results written to `plans/marketing/<campaign>/content/<asset>.<ext>`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- WordPress publish: credentials via env only (never hardcode/log). Default = draft. Live publish = explicit `--publish` + confirmation. Re-publish updates by slug (idempotent), never duplicates.
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`, `.claude/skills/integrations/wordpress-rest/SKILL.md`.

## Examples

```
blog|social|video|copy|publish blog <example-target>
publish <draft-file-or-slug>            # push to WordPress as draft
publish <draft-file-or-slug> --publish  # live publish (after confirmation)
```
