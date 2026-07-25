# Stage 5 — Internal Linking

**Goal:** weave the new article into the existing content cluster — link it to related published posts (and, ideally, add a link back from the pillar). This is what turns a pile of articles into a ranking topic cluster.

**Entry:** a `ready_to_publish` row (post-Stage-4). **Exit:** same row, `full_content_markdown` mutated in place, still `ready_to_publish`.

## Steps

1. **Build the link candidate set.** Query the pipeline table for this `site` where `status = 'published'` (and the current article's siblings in the cluster). Collect `{ keyword, slug, publish_url, title }` for each.
   - Prefer cluster-relatives: same Sub-Pillar, the parent Pillar, and Clusters under the same Sub-Pillar. These are the highest-relevance links.

2. **Find anchor opportunities.** Scan `full_content_markdown` for text matching a candidate's `keyword` (or a close variant) that is NOT already inside a link.
   - Match case-insensitively; skip matches already wrapped in `[...](...)` or inside headings.

3. **Insert links — conservatively:**
   - **One link per target** (link the first natural occurrence only — no spammy repeat-linking).
   - **Cap total internal links** to ~1 per 150–200 words (avoid over-linking).
   - Anchor text = the natural matched phrase, not "click here". Link to the target's `publish_url`.
   - Never link a keyword to its own article.

4. **Add the pillar/hub link.** Ensure every Cluster/Sub-Pillar article links up to its Pillar page, and (optionally) queue the reverse link to be added to the Pillar on its next edit.

5. **Store** the updated `full_content_markdown` on the row. Status stays `ready_to_publish` (linking mutates content; publishing is a separate, redoable step).

## Notes

- Uses the [[seo-cluster]] internal-link-graph model — links should reinforce the Pillar→Sub-Pillar→Cluster hierarchy, not random cross-links.
- The source n8n pipeline stubs this ("TODO: internal link") — this stage is the ClauKit completion of that intent. Keeping it separate from publish means a bad link pass can be re-run without re-publishing.
- Only link to **published** targets (a link to an unpublished/404 slug hurts). Skip candidates without a `publish_url`.
- Don't force it: if there are no relevant published articles yet (early in a batch), this stage is a no-op — links accrue naturally as the cluster fills. Re-running Stage 5 on older articles after new ones publish is a legitimate maintenance pass.
- External/authority links (to sources cited in the body) are a content-quality concern handled in Stages 2–3, not here.
