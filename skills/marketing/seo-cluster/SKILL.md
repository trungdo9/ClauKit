---
name: seo-cluster
description: Topic cluster modeling — turn a seed keyword into a Pillar / Sub-Pillar / Cluster tree with a clean internal-link graph. Use to plan topical authority before writing, or to map an existing set of posts onto a cluster structure. Feeds the seo-writing pipeline (Stage 1).
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Cluster — Topical Authority Modeling

> A ranking site isn't a pile of articles — it's a cluster. One Pillar page owns the broad term; Sub-Pillars own its facets; Cluster articles own long-tails; internal links tie them into a hierarchy Google reads as authority.

## When this skill activates

**Implicit:** "build a topic cluster", "plan content structure for [topic]", "what articles should I write about X", "map my posts into clusters".
**Explicit:** "Use the seo-cluster skill to [task]."
**Routed from:** [[seo-writing]] Stage 1, `/mk:seo keywords`.

## Scope

Covers:
- Seed keyword → 3-level topic tree (Pillar → Sub-Pillar → Cluster).
- Facet coverage frameworks (so a cluster is comprehensive, not lopsided).
- Internal-link graph rules (hub-and-spoke, up/down/sideways linking).
- Mapping existing content onto a target cluster (gap detection).

Does NOT cover:
- Writing the articles → [[seo-content]] / [[seo-writing]].
- Per-article briefs/outlines → [[seo-content-brief]].
- Keyword *metrics* (volume/difficulty) — that's a research-tool concern → `references/research-tools.md` in [[seo-writing]].

## The cluster model

```
                 ┌─────────────┐
                 │  PILLAR      │  broad head term, "ultimate guide", links to all Sub-Pillars
                 └──────┬───────┘
        ┌───────────────┼───────────────┐
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │Sub-Pillar│     │Sub-Pillar│    │Sub-Pillar│  a distinct FACET each
   └────┬────┘     └────┬────┘     └────┬────┘
    ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
  Cluster Cluster  Cluster Cluster  Cluster Cluster   long-tail, specific-intent
```

- **Pillar (1)** — the head term. Broad, comprehensive, links down to every Sub-Pillar.
- **Sub-Pillars (N)** — each a *different facet* of the head term (not overlapping). Link up to Pillar + down to their Clusters.
- **Clusters (2–3 per Sub-Pillar)** — specific long-tail queries / pain points. Link up to their Sub-Pillar.

## Facet frameworks (pick facets that don't overlap)

To make Sub-Pillars comprehensive across any niche, choose facets from these universal angles:

1. **Foundational & Core** — definitions, principles, mechanisms, history.
2. **Typology & Classification** — types, variants, models, formats.
3. **Actionable & Application** — how-to, tutorials, use cases, best practices.
4. **Commercial & Decision** — pricing, buying guides, tools, A-vs-B comparisons.
5. **Troubleshooting & Optimization** — pain points, errors, FAQs, trends.

A cluster covering 3–5 of these reads as authoritative; one that's all "how-to" reads as thin.

## Internal-link graph rules

| Link direction | Rule |
|---|---|
| **Down** (Pillar→Sub, Sub→Cluster) | Always. The hub links to every spoke. |
| **Up** (Cluster→Sub→Pillar) | Always. Every article links up to its parent. |
| **Sideways** (Cluster↔Cluster) | Only when genuinely related, same Sub-Pillar. Sparingly. |
| **Cross-cluster** | Rare — only for a real topical bridge. Random cross-links dilute the signal. |

Anchor text = the natural target-keyword phrase, never "click here". One link per target (first occurrence). This graph is executed by [[seo-writing]] Stage 5.

## Key concepts

- **Topical authority** — Google rewards comprehensive coverage of a topic space, signalled by the cluster structure + interlinking, not by any single page.
- **Intent mismatch** — the #1 cluster failure: including keywords that don't serve the business. Filter every node against business context + excluded topics.
- **Cannibalization** — two articles targeting the same intent compete with each other. One node = one intent = one article. Merge duplicates.

## Output

- A cluster tree (markdown table or the [[seo-writing]] Keywords table): `level, parent_keyword, keyword, seo_title, search_intent, content_angle`.
- Written to `plans/marketing/<site>/pipeline.md` (when feeding the writing pipeline) or `plans/marketing/<campaign>/seo-cluster.md` (standalone).

## Cross-references

- `plans/marketing-context.md` — required hub (business context filters the tree)
- [[seo-writing]] — consumes this as Stage 1; executes the link graph in Stage 5
- [[seo-content-brief]] — turns each node into an article outline
- [[seo-plan]] — prioritizes which nodes to write first
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for KitForge. Facet frameworks + link-graph rules align with the seo-writing pipeline's Strategy Architect (Stage 1).
