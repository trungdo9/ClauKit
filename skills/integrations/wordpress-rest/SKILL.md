---
name: wordpress-rest
description: WordPress REST API client — connect to a live WP site to publish/update posts & pages (draft→publish), upload media, manage categories/tags, write Yoast/RankMath SEO meta, and audit existing content. Use when pushing generated marketing content to WordPress or auditing live WP articles. Auth via Application Passwords (env vars only). Consumer/client skill (not for building WP plugin endpoints).
license: MIT
---

# WordPress REST Client

Connect to a live WordPress site to publish, update, and audit content via the `wp/v2` REST API.

## When to Use

- Push generated marketing/blog content to WordPress (draft by default)
- Update an existing WP post/page (idempotent, by slug or id)
- Upload media + set featured image
- Manage categories/tags
- Write Yoast/RankMath SEO meta
- Audit a live WP article (fetch → feed to `seo` / claude-seo skills)

**NOT for:** building WP plugin REST endpoints (PHP server-side — out of scope; that is the official `wp-rest-api` skill's domain).

## Credentials (env vars ONLY)

| Var | Purpose |
|---|---|
| `WP_SITE_URL` | e.g. `https://example.com` (no trailing slash) |
| `WP_USER` | WordPress username |
| `WP_APP_PASSWORD` | Application Password (WP Profile → Application Passwords) |

NEVER hardcode credentials. NEVER echo/log the password. Auth header = `Basic base64("$WP_USER:$WP_APP_PASSWORD")`.

## Safety gates (MANDATORY)

1. **PREFLIGHT** — `GET $WP_SITE_URL/wp-json/` must succeed before any write.
2. **DRAFT DEFAULT** — every create/update sends `status:"draft"` unless the user explicitly passed a publish flag AND confirmed.
   > Publishing to a live site is outward-facing and hard to reverse. This skill ALWAYS creates/updates as `status:"draft"`. To publish live, the user must explicitly request it (e.g. `--publish` flag on `/mk:content publish`) AND the model must echo the target URL + title and get an explicit "yes" before sending `status:"publish"`.
3. **IDEMPOTENT** — before create, `GET ?slug=<slug>`; if it exists → update that id, else create. Never blind-POST a duplicate.

## Quick Reference (load on demand)

- Auth & preflight: `references/auth-and-preflight.md`
- Posts & pages: `references/posts-and-pages.md`
- Media: `references/media.md`
- Taxonomies: `references/taxonomies.md`
- SEO meta: `references/seo-meta.md`
- Audit: `references/audit.md`
- Errors: `references/error-handling.md`

## Scripts

- `scripts/wp-auth-header.js` — build `Authorization: Basic <b64>` from env (password never printed)
- `scripts/wp-media-upload.js` — raw-binary media upload helper to `/wp-json/wp/v2/media`

## Implementation Workflow

1. Load `auth-and-preflight.md` → verify connectivity + capability.
2. For publish: load `posts-and-pages.md` → idempotent upsert (draft).
3. Media / taxonomy / SEO meta as needed (load those refs).
4. Confirm + flip to publish ONLY on explicit user flag + confirmation.
5. For audit: load `audit.md`.

Load only the reference needed for the current step to keep context lean.

## Cross-references

- `skills/integrations/mcp-wordpress/SKILL.md` — MCP wrapper (routes here as fallback)
- `.claude/skills/marketing/seo/SKILL.md` — claude-seo orchestrator (audit consumer)
- `.claude/workflows/automation-rules.md` — MCP + idempotency + PII rules
