---
name: seo-competitor-pages
description: Competitor comparison and alternatives pages — "X vs Y", "alternatives to X", "best [category] tools" roundups. Covers feature matrices, comparison-intent keyword targeting, Product/SoftwareApplication/ItemList schema, and conversion-optimized layout with fairness guidelines. A distinct page format, not the SERP-beating competitor analysis that feeds a regular article outline.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Competitor Pages — Comparison & Alternatives Pages

> A comparison page doesn't win by out-writing a competitor's article — it wins by capturing the comparison itself: the searcher already knows both names and wants a verdict.

## When this skill activates

**Implicit:** "comparison page", "vs page", "alternatives page", "competitor comparison", "X vs Y", "versus", "compare competitors", "alternative to", "best [category] tools roundup".
**Explicit:** "Use the seo-competitor-pages skill to [task]."
**Routed from:** [[seo]] orchestrator, `/mk:seo` page-type requests.

**Not routed from [[seo-content-brief]] or [[seo-writing]] Stage 2** — despite the shared word "competitor," those do their own self-contained SERP analysis (fetch top-10 → filter clean URLs → extract heading skeletons → two-pass Analyst/Outline Creator, in `references/stage-2-outline.md`) to out-write a competitor's *ranking article* for a regular keyword. That process never calls into this skill and does not produce a comparison page. This skill activates only when the deliverable itself is a comparison/alternatives/roundup page — a distinct page format targeting comparison-intent keywords, not a wider or deeper version of an existing article topic.

## Scope

Covers:
- Four comparison-intent page types: "X vs Y", "alternatives to X", "best [category] tools" roundups, standalone comparison-table pages.
- Feature-matrix construction and data-accuracy requirements.
- Schema markup for comparisons (Product+AggregateRating, SoftwareApplication, ItemList).
- Comparison-intent keyword targeting and title/H1 formulas.
- Conversion-optimized layout (CTA placement, social proof, pricing highlights, trust signals).
- Fairness/accuracy guidelines for describing competitors.
- Internal linking between comparison pages and product pages.

Does NOT cover:
- SERP-based competitor analysis to out-write a regular article → [[seo-content-brief]], [[seo-writing]] Stage 2.
- Topic cluster / pillar structure planning → [[seo-cluster]].
- Section-by-section body writing, E-E-A-T scoring → [[seo-content]].
- General schema markup outside comparison contexts → [[seo-schema]].
- AI-search/GEO structuring of the resulting page → [[seo-geo]].

## Page types

### 1. "X vs Y" comparison pages
Direct head-to-head between two products/services. Balanced feature-by-feature analysis with a clear verdict or recommendation and justification. Target keyword: `[Product A] vs [Product B]`.

### 2. "Alternatives to X" pages
A list of alternatives to a specific product/service. Each alternative gets a brief summary, pros/cons, and a "best for" use case. Target keyword: `[Product] alternatives`, `best alternatives to [Product]`.

### 3. "Best [category] tools" roundup pages
A curated list of top tools/services in a category, with ranking criteria clearly stated. Target keyword: `best [category] tools [year]`, `top [category] software`.

### 4. Comparison table pages
A feature matrix with multiple products in columns, sortable/filterable if interactive. Target keyword: `[category] comparison`, `[category] comparison chart`.

## Comparison table generation

### Feature matrix layout

```
| Feature          | Your Product | Competitor A | Competitor B |
|------------------|:------------:|:------------:|:------------:|
| Feature 1        | ✅           | ✅           | ❌           |
| Feature 2        | ✅           | ⚠️ Partial   | ✅           |
| Feature 3        | ✅           | ❌           | ❌           |
| Pricing (from)   | $X/mo        | $Y/mo        | $Z/mo        |
| Free Tier        | ✅           | ❌           | ✅           |
```

### Data accuracy requirements
- All feature claims must be verifiable from public sources.
- Pricing must be current — include an "as of [date]" note.
- Update frequency: review quarterly or when a competitor ships major changes.
- Link to a source for each competitor data point where possible.

## Schema markup

### Product schema with AggregateRating
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Product Description]",
  "brand": { "@type": "Brand", "name": "[Brand Name]" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Rating]",
    "reviewCount": "[Count]",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

### SoftwareApplication (for software comparisons)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Software Name]",
  "applicationCategory": "[Category]",
  "operatingSystem": "[OS]",
  "offers": { "@type": "Offer", "price": "[Price]", "priceCurrency": "USD" }
}
```

### ItemList (for roundup pages)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best [Category] Tools [Year]",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "numberOfItems": "[Count]",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "[Product Name]", "url": "[Product URL]" }
  ]
}
```

Validate against Rich Results eligibility, or hand off to [[seo-schema]] for full JSON-LD generation and validation.

## Keyword targeting

### Comparison-intent patterns

| Pattern | Example | Search volume signal |
|---|---|---|
| `[A] vs [B]` | "Slack vs Teams" | High |
| `[A] alternative` | "Figma alternatives" | High |
| `[A] alternatives [year]` | "Notion alternatives 2026" | High |
| `best [category] tools` | "best project management tools" | High |
| `[A] vs [B] for [use case]` | "AWS vs Azure for startups" | Medium |
| `[A] review [year]` | "Monday.com review 2026" | Medium |
| `[A] vs [B] pricing` | "HubSpot vs Salesforce pricing" | Medium |
| `is [A] better than [B]` | "is Notion better than Confluence" | Medium |

### Title tag formulas
- X vs Y: `[A] vs [B]: [Key Differentiator] ([Year])`
- Alternatives: `[N] Best [A] Alternatives in [Year] (Free & Paid)`
- Roundup: `[N] Best [Category] Tools in [Year], Compared & Ranked`

### H1 patterns
Match title tag intent, include the primary keyword naturally, keep under 70 characters.

## Conversion-optimized layout

### CTA placement
- **Above fold** — brief comparison summary with a primary CTA.
- **After the comparison table** — "Try [Your Product] free" CTA.
- **Bottom of page** — final recommendation with a CTA.
- Avoid aggressive CTAs inside competitor-description sections — it reads as biased and reduces trust.

### Social proof
- Customer testimonials relevant to the comparison criteria.
- G2/Capterra/TrustPilot ratings, with source links.
- Case studies showing migration from the competitor.
- "Switched from [Competitor]" stories.

### Pricing highlights
- A clear pricing comparison table.
- Highlight value advantages, not just the lowest price.
- Include hidden costs — setup fees, per-user pricing, overage charges.
- Link to the full pricing page.

### Trust signals
- "Last updated [date]" timestamp.
- An author with relevant expertise.
- Methodology disclosure — how the comparison was conducted.
- Disclosure of the page owner's own product affiliation.

## Fairness guidelines (non-negotiable)

- **Accuracy** — all competitor information must be verifiable from public sources.
- **No defamation** — never make false or misleading claims about a competitor.
- **Cite sources** — link to competitor websites, review sites, or documentation.
- **Timely updates** — review and update when competitors release major changes.
- **Disclose affiliation** — clearly state which product is the page owner's.
- **Balanced presentation** — acknowledge competitor strengths honestly.
- **Pricing accuracy** — include "as of [date]" disclaimers on all pricing data.
- **Feature verification** — test competitor features where possible, cite documentation otherwise.

These rules apply on top of, not instead of, the truth-only rule in [[seo-content]] — no invented ratings, no fabricated review counts, no placeholder competitor names.

## Internal linking

- Link to the page owner's own product/service pages from comparison sections.
- Cross-link between related comparison pages (e.g., "A vs B" links to "A vs C").
- Link to feature-specific pages when discussing individual features.
- Breadcrumb: Home > Comparisons > [This Page].
- A "related comparisons" section at the bottom of the page.
- Link to any case studies or testimonials mentioned in the comparison.

## Key concepts

- **Comparison intent** — the searcher already knows both products by name; the page's job is to give a verdict, not to introduce the category. Different from informational intent, which [[seo-content-brief]] outlines target.
- **Feature matrix** — the trust-building core of a comparison page; every cell must be sourced or marked "Not publicly available," never guessed.
- **Fairness as a ranking signal, not just an ethics rule** — Google and readers both penalize obviously one-sided comparisons; balanced presentation of competitor strengths is what makes the page's verdict credible enough to convert.

## Output

- `plans/marketing/<campaign>/seo-competitor-pages.md` — comparison page brief:
  - Page type + target keyword (primary + secondary + long-tail opportunities).
  - Feature matrix table.
  - Content outline with word-count targets (minimum 1,500 words).
  - Content gaps vs. existing competitor comparison pages.
- `plans/marketing/<campaign>/comparison-schema.json` — Product/SoftwareApplication/ItemList JSON-LD.
- Recommendations: content improvements for existing comparison pages, new comparison-page opportunities, schema additions, conversion-optimization suggestions.

## Error handling

| Scenario | Action |
|---|---|
| Competitor URL unreachable | Report which competitor URLs failed. Proceed with available data and note gaps in the comparison. |
| Insufficient competitor data (pricing, features unavailable) | Flag missing data points clearly. Use "Not publicly available" in comparison tables rather than guessing. |
| No product/service overlap found | Report that the products serve different markets. Suggest alternative competitors that share feature overlap, or pivot to a category roundup format. |

## Cross-references

- `plans/marketing-context.md` — required hub (own-product positioning, forbidden words)
- [[seo]] — orchestrator this skill routes from
- [[seo-content-brief]] / [[seo-writing]] Stage 2 — separate SERP-analysis mechanism for regular articles; does not feed into or from this skill
- [[seo-cluster]] — comparison/alternatives pages typically sit as Commercial & Decision facet nodes in a cluster
- [[seo-content]] — truth-only rule and anti-fluff apply to comparison prose too
- [[seo-schema]] — full JSON-LD generation/validation beyond the templates above
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. Page types, schema templates, keyword patterns, and fairness guidelines are preserved from the source; adaptations are ClauKit frontmatter/style, `plans/marketing/<campaign>/` output paths, and explicit scoping against the seo-writing pipeline's separate competitor-analysis mechanism (source repo did not need this distinction).
