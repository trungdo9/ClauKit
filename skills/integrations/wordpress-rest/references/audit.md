# Audit (read-only)

Fetch a live WP post/page, normalize it, hand to the `seo` / claude-seo skills for analysis. **Read-only — no writes during audit.**

## Fetch by ID

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/posts/$ID?context=edit&_fields=id,slug,link,title,content,excerpt,yoast_head_json,meta"
```

`context=edit` returns the raw (unrendered) `content.raw` + `meta`, which is what you want for analysis. Requires auth + edit capability; drop to `context=view` (rendered HTML) if unauthenticated/read-only role.

## Fetch by URL

Resolve the slug from the URL path, then query by slug:

```bash
# https://example.com/2026/my-article/  → slug "my-article"
SLUG=$(echo "$URL" | sed -E 's#.*/([^/]+)/?$#\1#')
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/posts?slug=$SLUG&context=edit" | jq '.[0]'
```

If the URL is a page, swap `posts` → `pages`.

## Normalize → analysis input

Extract: `{ title, slug, link, content (raw HTML), excerpt, seo: yoast_head_json || rank_math_* }`.
Strip HTML to plaintext for readability/E-E-A-T scoring; keep raw HTML for structure (headings, links, images, schema).

Hand the normalized object to:
- `.claude/skills/marketing/seo/SKILL.md` (claude-seo orchestrator) for a full audit, OR
- `seo-audit` / `seo-content` / `seo-schema` sub-skills for targeted checks.

## Output

Write the audit report to `plans/marketing/<target>/seo-audit-report.md` (per `/mk:seo` convention). Include the WP post id/URL as the audited target. Each finding should carry a falsifiability check (claude-seo convention).

## Notes

- Read-only: never send a write during audit, even to "fix" — surface fixes as recommendations; apply them only via the separate publish flow with user confirmation.
- For bulk audits, paginate `?per_page=100&page=N` and respect `X-WP-TotalPages`.
