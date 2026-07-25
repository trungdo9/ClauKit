# Stage 1 — Research & Strategy

**Goal:** one seed keyword → a hierarchical topic cluster (1 Pillar · N Sub-Pillars · 2–3 Clusters each), written to the Keywords table with status `new`.

**Entry:** `seed_keyword`, `site`, `cluster_limit` (default 3). **Exit:** rows in Keywords table, status `new`.

## Steps

1. **Load context.** Read `plans/marketing-context.md` for `business_context`, `target_audience`, brand voice, forbidden words. If absent → hard-fail, direct to `/mk:plan`.

2. **Gather SERP signal** (token-saver: keep only what the architect needs). Use the best available research tool (see `references/research-tools.md`), targeting the seed keyword in the site's locale:
   - **People Also Ask** — questions (→ become Cluster long-tails)
   - **Related searches** — adjacent queries
   - **Top 5 organic** — `{title, snippet}` only (context for the architect; strip ads/menus/pagination)

   Fallback ladder: DataForSEO/SerpAPI MCP → Exa/Firecrawl → plain `WebSearch`. If nothing is available, proceed from the model's own topical knowledge and mark the cluster `[UNVERIFIED — no SERP data]`.

3. **Run the Strategy Architect** prompt (below) → JSON topic tree.

4. **Filter through business constraints.** Drop any keyword that violates `excluded_topics` or doesn't serve `business_context`/`target_audience`. Intent-mismatch is the #1 failure mode — be ruthless.

5. **Write rows** to the Keywords table (one per node): `level, parent_keyword, keyword, seo_title, search_intent, content_angle, status='new', site`.

## Strategy Architect prompt

> Adapt language to the `language` input (source pipeline = Vietnamese).

```
### ROLE
You are a Senior SEO Strategist specialized in Semantic SEO and Topical Authority.
Build a hierarchical Topic Cluster (Pillar > Sub-Pillar > Cluster) that dominates
search while strictly obeying the business constraints.

### INPUT
- Master Keyword: "{seed_keyword}"
- Sub-Pillar count: {cluster_limit}
- People Also Ask: {paa_list}
- Related Searches: {related_list}
- Business Context: {business_context}
- Target Audience: {target_audience}
- EXCLUDED (never generate): {excluded_topics}

RULE: If a topic violates EXCLUDED or doesn't serve the Business Context/Audience,
IGNORE IT. Do not include it.

### ARCHITECTURE
Level 1 — Pillar (exactly 1): keyword = Master Keyword; parent_keyword = "".
Level 2 — Sub-Pillars (exactly {cluster_limit}): cover diverse FACETS of the master
  keyword using these universal frameworks:
  1. Foundational & Core Concepts (definitions, principles, mechanisms, history)
  2. Typology & Classifications (types, variants, models, formats)
  3. Actionable & Application (tutorials, how-tos, use cases, best practices)
  4. Commercial & Decision Support (pricing, buying guides, tools, A-vs-B)
  5. Troubleshooting & Optimization (pain points, errors, FAQs, trends)
  parent_keyword = Master Keyword.
Level 3 — Clusters (2–3 per Sub-Pillar): specific long-tails from People Also Ask,
  user pain points, edge cases. parent_keyword = the parent Sub-Pillar keyword.

### OUTPUT — valid JSON only, no markdown fence, no prose:
{
  "strategy": [
    { "level": "Pillar", "parent_keyword": "", "keyword": "...",
      "seo_title": "Attractive, keyword-rich, authority-building H1",
      "search_intent": "Informational|Commercial|Transactional|Navigational",
      "content_angle": "Ultimate Guide|Comparison|Technical|Case Study|..." },
    { "level": "Sub-Pillar", "parent_keyword": "<Master>", "keyword": "...", ... },
    { "level": "Cluster", "parent_keyword": "<Sub-Pillar>", "keyword": "...", ... }
  ]
}

### FINAL CHECK
- level ∈ {Pillar, Sub-Pillar, Cluster}
- every Cluster.parent_keyword matches an existing Sub-Pillar.keyword
- zero topics related to EXCLUDED
- language = {language}
```

## Notes

- Uses the [[seo-cluster]] skill's methodology for the tree shape and internal-link graph.
- Temperature low (~0.3) — this is structure, not prose.
- The Pillar row's `seo_title` becomes the eventual pillar-page H1; Sub-Pillar/Cluster titles seed each article's H1 in Stage 2.
- Output of this stage is a **plan** — stop here in `plan` mode and let a human review before writing burns tokens.
