# Phase 2 — `wordpress-rest` Client SKILL.md (full authoring)

## Context links
- Research: `.../research/wp-rest-api-research.md` (Auth, Core endpoints, SEO meta, Error handling)
- Template (rich skill): `skills/software/payment-integration/SKILL.md` + its `references/sepay/` + `scripts/`
- Rules: `.claude/workflows/automation-rules.md` (§4 PII, §5 idempotency, §6 manual fallback)

## Overview
- Priority: P0 (core deliverable). Depends on P1. Status: ☐.
- Author the rich consumer-client skill: SKILL.md (progressive-disclosure index) + `references/` subfiles + `scripts/` helpers.

## Key insights
- Mirror payment-integration structure: SKILL.md is a thin **router** — "When to Use", "Quick Reference" linking to `references/*.md`, "Implementation Workflow", "Key Capabilities". Heavy detail lives in references (loaded on demand → context-efficient).
- WP has NO Node SDK requirement — all REST via curl. Scripts are optional convenience (base64 auth header, multipart media upload).
- Three hard safety gates must appear in SKILL.md body AND in the workflow refs: env-only creds, draft-default + explicit-publish confirmation, idempotent upsert.

## Requirements
**Functional**
- Document: connectivity preflight, auth, create/update post, create/update page, media upload, taxonomy (categories/tags) read+create, SEO meta (Yoast/RankMath discovery + write + fallback), audit existing posts.
**Non-functional**
- Env-only creds; never log secrets; draft default; idempotent; polite backoff on 429.

## Files to create
| Path | Action | Content |
|---|---|---|
| `skills/integrations/wordpress-rest/SKILL.md` | overwrite stub | full router (outline below) |
| `.../references/auth-and-preflight.md` | create | Application Passwords, base64 header, env vars, `GET /wp-json/` preflight, capability check |
| `.../references/posts-and-pages.md` | create | create/update/list/get posts & pages, body fields, draft→publish, idempotent upsert by slug |
| `.../references/media.md` | create | multipart upload, `Content-Disposition`, set `featured_media` |
| `.../references/taxonomies.md` | create | categories/tags read, create-if-missing, attach to post |
| `.../references/seo-meta.md` | create | Yoast (`yoast_head_json` read / meta write), RankMath (`rank_math_*`), discovery, fallback |
| `.../references/audit.md` | create | fetch live post by id/URL → normalize → hand to claude-seo analysis |
| `.../references/error-handling.md` | create | 401/403/404/400/429 table + remedies |
| `.../scripts/wp-auth-header.js` | create | build `Authorization: Basic base64($WP_USER:$WP_APP_PASSWORD)` from env |
| `.../scripts/wp-media-upload.js` | create | multipart POST helper to `/wp-json/wp/v2/media` |
| `.../scripts/package.json` | create | name/version/license MIT (mirror payment scripts pkg) |

## SKILL.md body outline
```markdown
---
name: wordpress-rest
description: <as P1 stub>
license: MIT
---

# WordPress REST Client

Connect to a live WordPress site to publish, update, and audit content via the wp/v2 REST API.

## When to Use
- Push generated marketing/blog content to WordPress (draft by default)
- Update an existing WP post/page (idempotent, by slug or id)
- Upload media + set featured image
- Manage categories/tags
- Write Yoast/RankMath SEO meta
- Audit a live WP article (fetch → feed claude-seo)
NOT for: building WP plugin REST endpoints (that's PHP server-side — out of scope).

## Credentials (env vars ONLY)
| Var | Purpose |
|---|---|
| WP_SITE_URL | e.g. https://example.com (no trailing slash) |
| WP_USER | WP username |
| WP_APP_PASSWORD | Application Password (WP profile → Application Passwords) |
NEVER hardcode. NEVER echo/log the password. Auth header = Basic base64("$WP_USER:$WP_APP_PASSWORD").

## Safety gates (MANDATORY)
1. PREFLIGHT — `GET $WP_SITE_URL/wp-json/` succeeds before any write.
2. DRAFT DEFAULT — every create/update sends status:"draft" unless user explicitly passed a publish flag AND confirmed. (gate wording below)
3. IDEMPOTENT — before create, GET `?slug=<slug>`; if exists → update that id, else create. Never blind-POST a duplicate.

## Quick Reference (load on demand)
- Auth & preflight: references/auth-and-preflight.md
- Posts & pages: references/posts-and-pages.md
- Media: references/media.md
- Taxonomies: references/taxonomies.md
- SEO meta: references/seo-meta.md
- Audit: references/audit.md
- Errors: references/error-handling.md

## Scripts
- scripts/wp-auth-header.js — build Basic auth header from env
- scripts/wp-media-upload.js — multipart media upload helper

## Implementation Workflow
1. Load auth-and-preflight.md → verify connectivity + capability.
2. For publish: load posts-and-pages.md → idempotent upsert (draft).
3. Media/taxonomy/SEO as needed (load those refs).
4. Confirm + flip to publish ONLY on explicit user flag.
5. For audit: load audit.md.
Load only the reference needed for the current step.
```

## Draft-default gate — exact wording (put in SKILL.md + posts-and-pages.md)
> Publishing to a live site is outward-facing and hard to reverse. This skill ALWAYS creates/updates as `status:"draft"`. To publish live, the user must explicitly request it (e.g. `--publish` flag on `/mk:content publish`) AND the model must echo the target URL + title and get an explicit "yes" before sending `status:"publish"`.

## Key snippets for references

### auth-and-preflight.md
```bash
# Preflight (no auth needed for discovery)
curl -sf "$WP_SITE_URL/wp-json/" >/dev/null && echo "WP reachable"
# Authenticated capability probe
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/users/me?context=edit" | jq '.capabilities.publish_posts'
```

### posts-and-pages.md — idempotent upsert
```bash
SLUG="my-post-slug"
EXISTING=$(curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/posts?slug=$SLUG&status=draft,publish,future" | jq -r '.[0].id // empty')
BODY='{"title":"...","content":"<p>...</p>","excerpt":"...","slug":"'$SLUG'","status":"draft","categories":[3],"tags":[7]}'
if [ -n "$EXISTING" ]; then
  curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
    -X POST "$WP_SITE_URL/wp-json/wp/v2/posts/$EXISTING" -d "$BODY"   # update
else
  curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
    -X POST "$WP_SITE_URL/wp-json/wp/v2/posts" -d "$BODY"            # create
fi
```
Pages: same shape at `/wp-json/wp/v2/pages`.

### media.md — multipart upload
```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  -H "Content-Disposition: attachment; filename=hero.jpg" \
  -H "Content-Type: image/jpeg" \
  --data-binary @hero.jpg \
  -X POST "$WP_SITE_URL/wp-json/wp/v2/media"
# returns {id} → set as post featured_media
```

### seo-meta.md — discovery + write + fallback
```bash
# Discover which SEO plugin exposes REST
curl -s "$WP_SITE_URL/wp-json/" | jq '.routes | keys[]' | grep -Ei 'yoast|rank' || echo "no SEO REST routes — fallback"
# Yoast read on a post: field yoast_head_json. Write: meta if registered show_in_rest, else Yoast REST API plugin.
# RankMath: rank_math_* meta fields.
```
Fallback: if no writable SEO REST surface → emit the meta (title/description/canonical/OG) as a markdown block and instruct user to paste into the post's SEO panel manually.

### audit.md
```bash
# By id
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/posts/123?context=edit"
# By URL → resolve slug from URL, then GET ?slug=
```
Then normalize {title, content, excerpt, yoast_head_json/rank_math} → feed to `seo`/`seo-audit` skills (claude-seo) for analysis. Output to `plans/marketing/<target>/seo-audit-report.md`.

### error-handling.md
| Code | Cause | Fix |
|---|---|---|
| 401 | bad app password/user | regenerate Application Password; verify env |
| 403 | lacks capability | user needs edit_posts/publish_posts; or REST blocked by security plugin |
| 404 | REST disabled / wrong route | check permalinks, `/wp-json/` reachable |
| 400 | invalid/missing param | validate body fields |
| 429 | security-plugin rate limit | exponential backoff, retry |

## scripts/wp-auth-header.js (pseudocode)
```js
// reads WP_USER + WP_APP_PASSWORD from env, prints "Authorization: Basic <b64>"
const u=process.env.WP_USER, p=process.env.WP_APP_PASSWORD;
if(!u||!p){console.error('missing WP_USER/WP_APP_PASSWORD env');process.exit(1);}
process.stdout.write('Authorization: Basic '+Buffer.from(`${u}:${p}`).toString('base64'));
// NEVER log the password itself.
```

## Todo list
- [ ] write SKILL.md (router)
- [ ] write 7 references/*.md
- [ ] write 2 scripts + package.json
- [ ] confirm every example uses `$WP_*` env (no literals)
- [ ] confirm draft-default gate present in SKILL.md + posts-and-pages.md

## Success criteria
- SKILL.md frontmatter valid; `name: wordpress-rest`.
- All 7 references exist + linked from Quick Reference.
- Scripts read creds from env only; no secret printed.
- Idempotent upsert + draft gate documented with runnable snippets.

## Risk assessment
- Risk: SEO meta not writable on target site → mitigated by discovery + manual fallback (documented).
- Risk: media upload auth subtleties (some hosts block) → error-handling 403 note.
- Risk: over-stuffing SKILL.md → keep router thin, push detail to refs (KISS/context-efficiency).

## Security considerations
- Env-only creds reiterated in SKILL.md + auth ref. Auth header built at call time, never persisted. Align w/ automation-rules §4 (no PII in logs/outputs).

## Next steps / dependencies
- Unblocks P4 (`/mk:content publish` references this skill).

## Unresolved
- Whether to ship the JS scripts at all vs pure-curl. Recommend ship minimal 2 (parity w/ payment-integration); cheap, optional.
