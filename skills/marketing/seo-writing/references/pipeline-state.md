# Pipeline State Store

The pipeline table is the single source of truth. Two backing stores — pick with the `store` input.

## Store A — `local` (default, zero infra)

A markdown table at `plans/marketing/<site>/pipeline.md`. One row per article. Claude reads/edits it with Read/Edit tools.

```markdown
# Content Pipeline — <site>

Updated: <YYYY-MM-DD>

## Keywords (cluster tree)

| id | level | parent_keyword | keyword | seo_title | search_intent | content_angle | status |
|----|-------|----------------|---------|-----------|---------------|---------------|--------|
| 1  | Pillar | | máy lọc nước | Máy Lọc Nước: Hướng Dẫn Toàn Diện 2026 | Informational | Ultimate Guide | done |
| 2  | Sub-Pillar | máy lọc nước | cấu tạo máy lọc nước | ... | Informational | Technical | new |

## Articles (production)

| id | keyword_id | slug | title | status | word_count | image_url | publish_url |
|----|-----------|------|-------|--------|-----------|-----------|-------------|
| 1  | 1 | may-loc-nuoc | ... | published | 2400 | ... | https://... |
```

Rules:
- `status` in the Keywords table drives Stage-2 pickup (`new` rows).
- `status` in the Articles table drives Stages 3–6.
- To "get the next row", read the file and pick the first row matching the entry-gate status. To "update a row", Edit that row's cells.
- Idempotency: if a stage's exit status is already set on a row, skip it.

## Store B — `supabase` (matches the source n8n schema)

Mirrors the original tables so the ClauKit pipeline is drop-in compatible with the n8n version. Requires the `supabase` skill + env creds. Two tables:

**`keywords_master`**
| column | type | notes |
|---|---|---|
| id | bigint PK | |
| site | text | scoping |
| level | text | `Pillar` \| `Sub-Pillar` \| `Cluster` |
| parent_keyword | text | empty for Pillar |
| keyword | text | |
| seo_title | text | H1 |
| search_intent | text | Informational \| Commercial \| Transactional \| Navigational |
| content_angle | text | e.g. Ultimate Guide, Comparison |
| status | text | `new` → `done` (mirrors article lifecycle at keyword level) |

**`content_production`**
| column | type | notes |
|---|---|---|
| id | bigint PK | |
| site | text | |
| keyword_id | bigint FK | → keywords_master.id |
| title | text | |
| slug | text | |
| description | text | meta description |
| competitor_analysis | text | Stage-2 Pass-1 Analyst report (markdown) — audit trail; strategy reaches the writer via the outline's `note_for_writer` |
| competitor_urls | jsonb / text[] | the filtered clean SERP URLs analyzed in Stage 2 |
| outline | jsonb | `{ h1, sapo, sections:[{h2,h3_list,estimated_words,note_for_writer}], faqs:[{question,answer_points}], conclusion:{heading,summary_points,cta_text,estimated_words} }` |
| full_content_markdown | text | assembled article |
| tags | jsonb / text[] | |
| image_url | text | featured image |
| status | text | the status machine (see below) |
| publish_post_url | text | live URL after Stage 6 |

## Status values (both stores)

`new` → `outline_ready` → `writing` → `writing_completed` → `optimizing` → `ready_to_publish` → `published` · `error`

- **`writing` and `optimizing` are locks** — set them at stage START so a concurrent/batch run won't pick the same row twice. Clear forward on success, or set `error` on failure.
- A stage's SELECT filters on its entry-gate status + `site`. It processes, then UPDATEs the status forward. This is the whole concurrency model — no queues needed.

## Choosing a store

| Situation | Store |
|---|---|
| Trying the pipeline, single site, no infra | `local` |
| Existing n8n users / want a real DB / multi-writer | `supabase` |
| CI / scheduled batch runs | `supabase` |

The stage playbooks are written store-agnostically: "get the next `<status>` row", "update the row to `<status>`". Translate those to a table-edit (local) or a supabase get/update (supabase).
