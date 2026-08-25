# Content Refresh Editing

Copy editing is not only for new drafts. Published pages decay — outdated stats, stale examples, drifted brand voice, missed search opportunities. A refresh applies the same editing rigor to content already live.

## When to refresh

- **Traffic declining** on a page that used to perform.
- **Stats or data older than ~12 months.**
- **Product changed** — features, pricing, or positioning no longer match the copy.
- **Competitors updated** their version of the same content.
- **AI-search visibility matters** — outdated content gets cited less (structuring for that → [[seo-geo]]).

## Refresh checklist

1. **Freshness pass** — update dates, stats, examples. Replace year-anchored phrasing with current data. Remove references to deprecated features or dead tools.
2. **Accuracy pass** — verify every claim is still true. Check linked resources still resolve. Confirm pricing and feature descriptions match the current product.
3. **Voice pass** — does the tone match the brand voice in `plans/marketing-context.md` today? Older content usually reflects an earlier stage of the company.
4. **SEO pass** — has search intent shifted for this topic? New keywords or questions to cover? Surface "Last updated: <date>" prominently.
5. **Proof pass** — add testimonials, case studies, or data points that did not exist at first publish.
6. **Structure pass** — add comparison tables, FAQ blocks, or other scannable formats.

Truth-only applies to every pass (`.claude/workflows/marketing-rules.md` §2): a refresh replaces a stale number with a **sourced** current number, or marks it `[NEEDS DATA]`. Never update a figure by estimating what it probably is now.

## Refresh vs. rewrite

| Signal | Action |
|---|---|
| Core message valid, details outdated | Refresh (facts, stats, examples) |
| Brand voice has evolved significantly | Refresh + voice rewrite |
| Topic angle or audience has shifted | Full rewrite → [[copywriting]] |
| Structure no longer matches search intent | Full rewrite → [[copywriting]] + [[seo-content]] |
| Only stats and links are stale | Light refresh |

## Cadence

- **Pricing and product pages** — quarterly, or whenever pricing/features change.
- **High-traffic blog posts** — every 6 months.
- **Comparison and alternatives pages** — every 3–6 months; competitors move fast.
- **Evergreen guides** — annually, unless traffic drops sooner.
- **Low-traffic pages** — only when the traffic data shows an opportunity.

## Output

Refreshed asset written back to `plans/marketing/<campaign>/content/<asset>.md`, with a refresh note listing what changed, what was verified, and any `[NEEDS DATA]` items left open.

Ported from `coreyhaines31/marketingskills` (`skills/copy-editing/references/content-refresh.md`); adapted to ClauKit paths, wikilinks, and the truth-only rule.
