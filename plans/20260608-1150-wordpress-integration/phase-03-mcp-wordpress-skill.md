# Phase 3 — `mcp-wordpress` MCP-Wrapper SKILL.md

## Context links
- Template: `skills/automation/mcp-resend/SKILL.md` (MCP Server / Tools table / patterns / Error handling / Manual Fallback / Cross-references)
- Sibling: `skills/automation/mcp-sendgrid/SKILL.md`
- Rules: `.claude/workflows/automation-rules.md` (§1 MCP usage, §6 manual fallback)
- Fallback target: the curl path authored in Phase 2 (`skills/integrations/wordpress-rest/`)

## Overview
- Priority: P1. Depends on P1 (folder), references P2 (fallback path). Status: ☐.
- Author optional MCP-server wrapper. If an MCP WP server is configured → route to its tools; else fall back to `wordpress-rest` curl path. Kit works either way (BYO server pattern, like the 5 existing MCP wrappers).

## Key insights
- Mirror mcp-resend exactly: frontmatter `allowed-tools: Read, Bash, Write`; sections = MCP Server, Tools exposed, Common patterns, Error handling, Manual Fallback, Cross-references.
- WP MCP servers exist in community (`automattic/wordpress-mcp`, `server-wordpress` variants). Document generically — user brings their own; don't hard-pin a package.
- Manual fallback = "use `wordpress-rest` skill" — single source of truth for the REST detail; don't duplicate endpoint docs here (DRY).

## Files to create
| Path | Action | Content |
|---|---|---|
| `skills/integrations/mcp-wordpress/SKILL.md` | overwrite stub | full wrapper (outline below) |

## SKILL.md outline
```markdown
---
name: mcp-wordpress
description: <as P1 stub>
allowed-tools: Read, Bash, Write
---

# MCP WordPress Wrapper

> WordPress content ops via MCP server. Falls back to the wordpress-rest curl path when no server.

## MCP Server
**Server command:** `npx -y @automattic/wordpress-mcp` (or community equivalent — BYO)
**Required env:** WP_SITE_URL, WP_USER, WP_APP_PASSWORD
**Setup:** WP admin → Users → Profile → Application Passwords

## Tools exposed (when MCP configured)
| Tool | Purpose |
|---|---|
| mcp__wordpress__createPost | Create post (status draft|publish) |
| mcp__wordpress__updatePost | Update post by id |
| mcp__wordpress__listPosts | List/fetch posts (audit) |
| mcp__wordpress__uploadMedia | Upload media, return id |
| mcp__wordpress__getTaxonomies | List/create categories & tags |
| mcp__wordpress__getSiteInfo | Discovery / connectivity |
(exact tool names depend on chosen server — adapt to its manifest)

## Common patterns
### Create draft post
Tool: mcp__wordpress__createPost
Args: { title, content, status:"draft", slug, categories:[...], tags:[...] }
(DRAFT default — publish only on explicit user confirmation.)

### Audit existing
Tool: mcp__wordpress__listPosts → fetch by id → hand to seo skill.

## Error handling
| Error | Cause | Fix |
|---|---|---|
| auth failed | bad app password | regenerate Application Password |
| 403 | capability | user lacks publish_posts |
| tool not found | MCP server not configured | use Manual Fallback |

## Manual Fallback (no MCP server)
If `mcp__wordpress__*` tools unavailable → activate `skills/integrations/wordpress-rest/` and use the curl path (preflight → idempotent upsert → draft default). All endpoint detail lives there.

## Cross-references
- `skills/integrations/wordpress-rest/SKILL.md` — REST client (the fallback + source of truth)
- `.claude/workflows/automation-rules.md` — MCP + idempotency + PII rules
```

## Safety (inherit, don't redefine)
- Same env-only creds, draft-default, idempotency. State briefly + defer to wordpress-rest for enforcement detail (DRY).

## Todo list
- [ ] write SKILL.md mirroring mcp-resend
- [ ] tools table marked "adapt to chosen server"
- [ ] Manual Fallback points to wordpress-rest
- [ ] draft-default note present

## Success criteria
- Frontmatter valid; `name: mcp-wordpress`; `allowed-tools` set.
- Has all 6 mcp-resend-parallel sections.
- Fallback references wordpress-rest (no endpoint duplication).

## Risk assessment
- Risk: pinning a specific MCP package that drifts/dies. Mitigation: present as BYO + "or community equivalent"; fallback always works.

## Security considerations
- Env-only creds; MCP server inherits same vars. No secrets in SKILL.md.

## Next steps / dependencies
- Optional for command wiring — `/mk:content` + `/mk:seo` can route through mcp-wordpress if present, else wordpress-rest. Document both in Phase 4.

## Unresolved
- Which community WP MCP server to name as the canonical example. Recommend `@automattic/wordpress-mcp` as primary, note alternatives exist.
