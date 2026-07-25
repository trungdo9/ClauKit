# Stage 4 — On-Page Optimization + Media

**Goal:** take the `writing_completed` draft → generate meta (title tag, description, slug, tags), run keyword-density + truth-only checks, resolve image placeholders into real images with alt text, attach a featured image, and optionally add schema. End at `ready_to_publish`.

**Entry:** next `writing_completed` row. **Exit:** same row, status `ready_to_publish`, with `slug`, `description`, `tags`, `image_url`, media resolved.

## Steps

1. **Lock:** set status `optimizing`.

2. **Run the On-Page Optimizer prompt** (below) on the draft → `{ meta_description, slug, tags }`.

3. **Keyword density check** (deterministic, not AI): count primary-keyword occurrences ÷ word count.
   - Target band: **0.8%–2.5%**. Below → the writing under-uses the keyword; above → stuffing.
   - Out of band → rewrite the 1–2 weakest passages to add/remove natural mentions (don't keyword-stuff to hit a number).

4. **Resolve images** (consume the `[[IMAGE_REQUEST:slug]]` tags from Stage 3):
   - Extract every tag via regex `\[\[IMAGE_REQUEST:([a-z0-9-]+)\]\]`.
   - For each: generate or source an image (see below), write SEO alt text (keyword + specific, per [[seo-images]]), replace the tag with `![alt](url)`.
   - **Cleanup:** any tag left unresolved → delete it (never ship a raw `[[IMAGE_REQUEST:...]]`). Regex-sweep at the end.

5. **Featured image:** generate/source one hero image for the article title; store as `image_url` (prepended to the body or set as the post's featured image at publish).

6. **Schema (optional but recommended):** via [[seo-schema]], generate JSON-LD (`Article` + `FAQPage` if the article has an FAQ section). Store alongside for the publish step. For AI-search visibility, also apply [[seo-geo]] structuring (clear definitions, extractable answers, entity clarity).

7. **Final truth-only pass:** re-scan for placeholder names / invented stats / meta-talk (Stage 3 rules). Any hit → fix before advancing.

8. **Store** `slug`, `description` (meta), `tags`, `image_url`, optimized `full_content_markdown`; set status `ready_to_publish`.

## On-Page Optimizer prompt

```
### ROLE
Senior SEO On-Page Optimizer. Maximize visibility via high-CTR meta, clean URL,
semantic tags.

### INPUT
- Target keyword: {keyword}
- Title (H1): {title}
- Content preview: {first ~1500 chars of markdown}

### TASKS
1. META DESCRIPTION — 150–160 chars, keyword near the start, high-CTR,
   action-oriented, no fluff.
2. URL SLUG — lowercase, unaccented ASCII ("đ"→"d", "á"→"a"), spaces→hyphens,
   drop stop words, no special chars. Short but meaningful.
3. TAGS — max 6, in {language}, each ≥3 words/syllables. LSI satellites of the
   main keyword (support it, don't drift). Prefer proper nouns / locations /
   technical terms actually in the text. FORBIDDEN: generic tags like "news",
   "latest", "update", "good article".

### OUTPUT — valid JSON:
{ "meta_description": "...", "slug": "...", "tags": ["...", "..."] }
```

## Image sourcing options (in order of preference)

| Option | When | How |
|---|---|---|
| AI generation | Original imagery wanted | [[ai-artist]] / an image-gen MCP (DALL·E, etc.) with the slug + keyword as prompt; then compress to WebP |
| Stock/SERP image API | Fast, generic illustrative | The source pipeline calls a `generate-image/serp` webhook — swap for any image API MCP |
| Skip (placeholder removed) | No image infra | Delete the tag; article ships text-only |

Always: descriptive filename from the slug, **alt text with the keyword** (never empty alt), compress before upload. See [[seo-images]].

## Notes

- Density check is code, not vibes — the source pipeline runs a JS counter and warns/rewrites out of band. Do the same.
- Meta description and slug are the highest-leverage CTR levers here; spend the effort.
- Keep the optimized markdown as the source of truth; HTML conversion happens at publish (Stage 6).
- If schema is generated, validate it (well-formed JSON-LD, required properties present) before storing — an invalid block is worse than none.
