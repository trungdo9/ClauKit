---
name: mcp-wordpress
description: WordPress MCP wrapper. Activate for WordPress content ops via an MCP server when available; else falls back to the wordpress-rest curl path. Manages posts, pages, media, taxonomies, SEO meta.
allowed-tools: Read, Bash, Write
---

# MCP WordPress Wrapper

> WordPress content ops via an MCP server. Bring your own server — this skill documents the tools + falls back to the `wordpress-rest` curl path when no server is configured.

---

## MCP Server

**Server command:** `npx -y @automattic/wordpress-mcp` (or a community equivalent — BYO server)
**Required env:** `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`
**Setup:** WP Admin → Users → Profile → Application Passwords

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__wordpress__createPost` | Create post (`status: draft\|publish`) |
| `mcp__wordpress__updatePost` | Update post by id |
| `mcp__wordpress__listPosts` | List/fetch posts (audit) |
| `mcp__wordpress__uploadMedia` | Upload media, return id |
| `mcp__wordpress__getTaxonomies` | List/create categories & tags |
| `mcp__wordpress__getSiteInfo` | Discovery / connectivity |

(Exact tool names depend on the chosen server — adapt to its manifest. List the server's tools with `/ck:use-mcp` to discover real tool names.)

## Common patterns

### Create draft post
```
Tool: mcp__wordpress__createPost
Args: { title, content, status: "draft", slug, categories: [...], tags: [...] }
```
DRAFT default — publish only on explicit user confirmation (echo target URL + title, get "yes").

### Audit existing
```
Tool: mcp__wordpress__listPosts → fetch by id → hand to the `seo` skill (claude-seo).
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| auth failed / 401 | bad Application Password | regenerate Application Password, update env |
| 403 | user lacks `publish_posts` capability | grant role, or REST blocked by security plugin |
| tool not found | MCP server not configured | use Manual Fallback below |

## Manual Fallback (no MCP server)

If `mcp__wordpress__*` tools are unavailable → activate `skills/integrations/wordpress-rest/` and use the curl path: preflight (`GET /wp-json/`) → idempotent upsert by slug → draft default. **All endpoint/auth detail lives there** (single source of truth — not duplicated here).

## Safety (inherited)

Same as `wordpress-rest`: env-only credentials, draft-default with explicit-publish confirmation, idempotent upsert. See `wordpress-rest` for enforcement detail.

## Cross-references

- `skills/integrations/wordpress-rest/SKILL.md` — REST client (the fallback + source of truth)
- `.claude/workflows/automation-rules.md` — MCP + idempotency + PII rules
- `skills/automation/mcp-resend/SKILL.md` — sibling MCP-wrapper pattern
