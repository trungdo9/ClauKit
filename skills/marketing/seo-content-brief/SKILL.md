---
name: seo-content-brief
description: SEO content brief — turn a target keyword into a writer-ready outline by analyzing the top-ranking competitors, finding their content gaps, and specifying H2/H3 structure, word targets, FAQs, and E-E-A-T requirements. Feeds the seo-writing pipeline (Stage 2).
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Content Brief — Competitor-Beating Outlines

> A brief isn't a topic and a word count. It's a blueprint that guarantees the article covers everything the top 3 competitors cover AND the gaps they miss — before a single sentence is written.

## When this skill activates

**Implicit:** "write a content brief for [keyword]", "outline an article that beats the competition", "what should this article cover".
**Explicit:** "Use the seo-content-brief skill to [task]."
**Routed from:** [[seo-writing]] Stage 2, `/mk:seo keywords`.

## Scope

Covers:
- SERP + top-3-competitor analysis (headings, depth, word count).
- Content-gap detection (what everyone misses).
- Outline: H2/H3 structure, per-section word targets + writer notes.
- Sapo (lede), FAQ block from People Also Ask.
- E-E-A-T requirements (author signal, sources, original insight).

Does NOT cover:
- The cluster/tree structure → [[seo-cluster]].
- Writing the body → [[seo-content]] / [[seo-writing]] Stage 3.
- On-page meta (title tag, slug) → [[seo-writing]] Stage 4.

## The brief pipeline

1. **SERP** the target keyword (locale-aware) → top 3 organic URLs.
2. **Extract skeletons** — for each URL: `h1`, all `h2`/`h3`, `word_count`, `meta_description`. Headings only (token saver).
3. **Gap analysis** — what do all 3 miss or treat shallowly? These become your edge sections.
4. **Build the outline** — union of competitor sub-topics (never thinner) + gap sections (the edge), ordered by intent.
5. **Set targets** — per-H2 `estimated_words` summing to ≈ 1.2–1.5× the longest competitor; a `note_for_writer` per section (angle, real data to inject, what to avoid).
6. **FAQ + sapo** — 3–6 PAA questions with bullet answer-points; a keyword-first 2–3 sentence lede.

## Brief schema

```json
{
  "h1": "final H1, compelling + keyword-rich",
  "sapo": "2–3 sentence lede, keyword in sentence 1, no fluff",
  "sections": [
    { "h2": "...", "h3_list": ["...","..."], "estimated_words": 300,
      "note_for_writer": "angle / real data to use / what to avoid" }
  ],
  "faqs": [ { "question": "...", "answer_points": "• ...\n• ..." } ]
}
```

## E-E-A-T requirements (bake into every brief)

| Signal | What the brief must specify |
|---|---|
| **Experience** | First-hand angle — a test, a process, a real observation to include |
| **Expertise** | Depth markers — named techniques, specifics, correct terminology |
| **Authoritativeness** | Sources to cite (link out to authorities); original data/insight to add |
| **Trust** | Author with credentials; visible date; no unsupported claims |

## Key concepts

- **Content gap** — the section your competitors don't have; the reason to rank above them. Force ≥2 per brief.
- **Search intent ordering** — sequence sections the way the searcher's need unfolds: definition → how → compare → troubleshoot.
- **Depth over length** — the word target is a guide, not a padding quota. A brief that specifies *specificity* (data, examples) beats one that just says "1500 words".

## Output

- The brief JSON/markdown, written to `plans/marketing/<site>/briefs/<slug>.brief.md`.
- Kept for audit + re-writes (a `rewrite` in the pipeline re-uses the brief).

## Cross-references

- `plans/marketing-context.md` — required hub (business context, forbidden words)
- [[seo-writing]] — consumes this as Stage 2 (Analyst prompt lives there)
- [[seo-cluster]] — provides the node this brief expands
- [[seo-content]] — E-E-A-T quality bar for the eventual body
- `.claude/workflows/marketing-rules.md` — content quality rules (§3 E-E-A-T)

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for KitForge. The competitor-gap + outline method matches the seo-writing pipeline's Analyst stage (Stage 2).
