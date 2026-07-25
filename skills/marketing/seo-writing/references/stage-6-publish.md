# Stage 6 — Publish

**Goal:** push the finished, optimized, internally-linked article to the target (WordPress or a REST endpoint). Idempotent. **Draft by default** — live publish requires an explicit flag + confirmation.

**Entry:** a `ready_to_publish` row. **Exit:** same row, status `published`, `publish_post_url` set.

## Safety gates (MANDATORY — mirror [[wordpress-rest]])

1. **PREFLIGHT** — verify connectivity before any write (`GET /wp-json/` for WordPress, or a HEAD/GET on the REST endpoint).
2. **DRAFT DEFAULT** — send `status: "draft"` unless the user explicitly passed `publish_status=publish` (or `--publish`) AND confirmed. Publishing is outward-facing and hard to reverse.
3. **IDEMPOTENT** — before create, look up by slug; if it exists → UPDATE that id, else CREATE. Never blind-POST a duplicate. The source pipeline keys on `source_url = "ai_creator_<id>"` and handles an "already exists" response by updating status instead of erroring — preserve that.
4. **CONFIRM ON LIVE** — for `publish`, echo the target URL + title and get an explicit "yes" before sending `status: "publish"`.

## Steps

1. **Get the row** (`ready_to_publish`, `site`, `content_id`).

2. **Clean the markdown** (source pipeline's "Code: Clean"): collapse runs of non-newline whitespace, and fix table rows that got glued (`||` → `|\n|`) so markdown tables render. Small but real — skipping it breaks tables on the live site.

3. **Convert** markdown → HTML (open links in new window, keep tables). Some targets accept markdown directly — check the endpoint.

4. **Build the payload:**
   ```json
   {
     "name": "<title>",
     "content": "<content_html>",
     "source_url": "ai_creator_<content_id>",
     "image_url": "<featured image url>",
     "status": "draft",            // or "publish" after confirmation
     "categories": [ { "id": <mapped>, "name": "<category>" } ],
     "tags": [ ... ],
     "description": "<meta description>",
     "content_id": <id>,
     "keyword_id": <keyword_id>
   }
   ```
   - **Category mapping** — map the article's Sub-Pillar (or `content_angle`) to a real site category id. The source pipeline hardcodes one ("Kiến thức ngành F&B", id 27) — replace with a lookup for the actual site. If unknown, publish uncategorized and flag it.

5. **Send** to the target:
   - **WordPress** → use [[wordpress-rest]]: idempotent upsert by slug, draft-default, Yoast/RankMath SEO meta from `description`/`tags`, featured image from `image_url`. Attach the Stage-4 JSON-LD schema if present.
   - **REST endpoint** → POST the payload to `publish_target` with the site's auth header.

6. **On success:** store `publish_post_url` (the returned live URL) and set status `published`.

7. **On "already exists":** treat as success — update the existing post + set status `published` (don't create a duplicate, don't error).

8. **On failure:** set status `error`, capture the message for review. Do NOT advance.

9. **Notify (optional):** the source pipeline sends a Lark/Slack message ("🎉 New article published: <title> — <link>"). Wire to any notification MCP if configured.

## Notes

- Credentials: env only (`WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD` for WordPress). Never hardcode or log the password.
- After publish, older articles become internal-link targets → a Stage-5 maintenance re-run on the cluster is worthwhile as it fills.
- Re-publishing the same `content_id` updates the live post (idempotent), never creates a second one.
- This stage is deliberately separate from Stage 5 so a content fix + re-link can happen without an unwanted re-publish, and a publish can be retried without re-linking.
