# Playbook — Existing WordPress Site, ~100 Posts, Mediocre SEO

**Situation (the canonical case):** You inherit/own a WordPress site with ~100 existing articles. SEO is middling — some posts rank, most don't; no clear topic-cluster structure; thin/duplicative coverage. You want a concrete plan: what to write, in what order, optimized, published — with research (e.g. Exa) filling gaps. This playbook drives the whole thing with the [[seo-writing]] pipeline.

The principle: **audit before you write.** With 100 posts already live, the fastest wins usually come from *improving and interlinking what exists*, not only new articles. Do a triage first, then run the pipeline for the gaps.

---

## Phase 0 — Prerequisites (one-time)

1. `plans/marketing-context.md` exists (`/mk:plan`) — ICP, brand voice, business context, forbidden words.
2. WordPress creds in env: `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`.
3. Pick the pipeline store: `local` (default) or `supabase`. For 100+ articles + scheduled batches, `supabase` scales better.
4. (Optional) Wire research MCPs: Exa, DataForSEO/SerpAPI, Firecrawl (`/ck:use-mcp`). Without them, `WebSearch`/`WebFetch` still work.

---

## Phase 1 — Inventory & Audit the existing 100 (READ-ONLY)

**Goal:** know what you have before adding more.

1. **Pull the inventory** via [[wordpress-rest]] (read-only): `GET /wp/v2/posts` (paginate) → for each: `{ id, slug, title, categories, tags, date, word_count, url }`. Write to `plans/marketing/<site>/inventory.md`.
2. **Cluster the existing posts** — group by topic. Which Pillars/Sub-Pillars do they *already* cover? Map each existing post to a node (or "orphan" if it fits none). This reveals your de-facto topic structure.
3. **Score each post** (quick triage, not a full audit):
   | Signal | Cheap check |
   |---|---|
   | Thin | word_count < ~600 |
   | No target keyword | title/H1 not keyword-shaped |
   | Duplicative | 2+ posts targeting the same intent (cannibalization) |
   | Stale | old date + evergreen topic |
   | Orphan | few/no internal links in or out |
4. **Optional deep audit** on the top candidates → route to `/mk:seo audit wp:<id>` (claude-seo, read-only). Reserve for the posts you'll actually invest in.

**Output:** `inventory.md` + a triage table tagging each post: `keep` / `improve` / `merge` / `rewrite` / `leave`.

---

## Phase 2 — Strategy: cluster tree + gap list

**Goal:** a target topic-cluster map, and the delta between it and what exists.

1. Run [[seo-writing]] **Stage 1** for each core seed keyword (the site's main themes) → Pillar/Sub-Pillar/Cluster tree. Use Exa/DataForSEO for real PAA + related + volume where available.
2. **Overlay the inventory** (Phase 1) onto the tree:
   - Node **covered well** by an existing post → mark `keep` (maybe `improve`).
   - Node **covered thinly/wrong** → mark `rewrite` (feed the old post as raw material to Stage 2/3).
   - Node **not covered** → mark `new` → this is a write target.
3. **Prioritize** the write/rewrite list (see Phase 3 scoring). Write it to `plans/marketing/<site>/pipeline.md` (the Keywords table), status `new` for the gaps.

**Output:** the pipeline table seeded with the real gap list — not "100 random ideas" but "the specific nodes your cluster is missing or fumbling."

---

## Phase 3 — Prioritize (what to write first)

Rank the `new`/`rewrite` targets. Simple, defensible scoring (uses [[seo-plan]]):

```
priority = intent_value × reach ÷ effort
```
- **intent_value** — Transactional/Commercial > Informational (closer to revenue).
- **reach** — search volume (if known) or PAA/related breadth (proxy when volume unknown).
- **effort** — new article (high) vs. improve-existing (low). *Improving a near-miss existing post is usually the cheapest win — do those first.*

Also front-load **Pillar pages** and the **Sub-Pillars** under your highest-value theme — they anchor the cluster and give the Cluster articles something to link up to.

**Output:** an ordered backlog in `pipeline.md`. This *is* the "write plan" the user asked for — concrete, ordered, with each item's keyword, intent, angle, and whether it's new-or-improve.

---

## Phase 4 — Produce (batch through the pipeline)

Run [[seo-writing]] in **`write-batch`** mode over the backlog. For each item, Stages 2→5:

- **Stage 2** — competitor analysis + outline (Exa/WebFetch for gap analysis). For `rewrite` items, feed the existing post's content as a starting skeleton.
- **Stage 3** — deep section-by-section writing (the quality lever).
- **Stage 4** — meta, density check, images + alt, schema, truth-only pass.
- **Stage 5** — internal-link into the cluster (now including the existing posts from Phase 1 as link targets).

**Cadence:** batch a bounded N per run (the n8n pipeline does 1/keyword/trigger to control cost). Schedule it with `/loop` or a cron routine to drip out articles daily rather than 50 in one burst.

**Review gate:** for the first few, human-review the finished markdown in `plans/marketing/<site>/articles/` before publishing. Once the quality is trusted, let the batch run.

---

## Phase 5 — Publish (draft-first)

Run **Stage 6** for `ready_to_publish` rows via [[wordpress-rest]]:

1. **First pass = drafts.** Everything lands as WordPress drafts. Review a sample in the WP editor.
2. **Flip to live** with explicit `--publish` + confirmation, in controlled batches.
3. Idempotent by slug — re-runs update, never duplicate. `rewrite` items update the existing post (match its slug), preserving the URL + its link equity.
4. Set category from the Sub-Pillar mapping; attach featured image + SEO meta + schema.

---

## Phase 6 — Interlink & Measure (ongoing)

1. **Re-run Stage 5** across the cluster after each publish batch — new posts become link targets for old ones and vice-versa. This is where the cluster's ranking power compounds.
2. **Improve the `improve`-tagged existing posts** (Phase 1): add the missing sections, fix meta, link them into the new cluster. Cheapest ROI on the whole project.
3. **Measure** via [[seo-google]] (Search Console): track impressions/clicks/position per cluster. After ~4–8 weeks, feed the losers back into Stage 2 as `rewrite` targets. The pipeline loops.

---

## What the user gets, concretely

- `plans/marketing/<site>/inventory.md` — the 100 existing posts, clustered + triaged.
- `plans/marketing/<site>/pipeline.md` — the ordered write/rewrite plan (the "kế hoạch viết bài").
- `plans/marketing/<site>/briefs/*.brief.md` — a research-backed outline per target.
- `plans/marketing/<site>/articles/*.md` — finished, optimized articles.
- Published WordPress drafts → live posts, idempotent, interlinked, schema'd.

Every step has an explicit artifact and a status, so the work is inspectable and resumable — you can stop after Phase 3 with just a plan, or run straight through to published.
