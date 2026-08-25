---
name: seo-programmatic
description: Programmatic SEO — plan and audit pages generated at scale from structured data sources (CSV/API/DB). Covers template architecture, URL patterns, internal-linking automation, thin-content/quality-at-scale gates (2025-2026 Scaled Content Abuse enforcement), canonical strategy, sitemap integration, and index bloat prevention for large page sets.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# SEO Programmatic — Pages at Scale

> A programmatic page set lives or dies on one question per page: would this be worth publishing if no sibling page existed? Template architecture and quality gates are how you keep answering yes at 10,000 pages.

## When this skill activates

**Implicit:** "programmatic SEO", "pages at scale", "dynamic pages", "template pages", "generated pages", "data-driven SEO", "build pages from this CSV/API/database".
**Explicit:** "Use the seo-programmatic skill to [task]."
**Routed from:** `/mk:seo programmatic`, `.claude/skills/marketing/seo/SKILL.md` (orchestrator).

## Scope

Covers:
- Data-source assessment (CSV/API/DB) for programmatic-page fitness.
- Template architecture — variable injection points, static vs. dynamic blocks, standalone-value test.
- URL pattern strategy and internal-linking automation for large page sets.
- Thin-content / quality-at-scale gates, including 2025-2026 Scaled Content Abuse enforcement context.
- Canonical strategy, sitemap integration, and index bloat prevention at scale.

Does NOT cover:
- E-commerce category/filter pages specifically (faceted navigation UX, merchandising rules) → [[seo-ecommerce]].
- Topic-cluster modeling / pillar-sub-pillar-cluster trees for hand-written content → [[seo-cluster]].
- Crawl-budget diagnostics, Core Web Vitals, and JS-rendering audits at scale → [[seo-technical]].
- Writing the actual page copy for a single article → [[seo-content]].

## Data source assessment

Evaluate the data powering programmatic pages before any template gets built:
- **CSV/JSON files** — row count, column uniqueness, missing values.
- **API endpoints** — response structure, data freshness, rate limits.
- **Database queries** — record count, field completeness, update frequency.
- Data quality checks:
  - Each record must carry enough unique attributes to generate genuinely distinct content.
  - Flag duplicate or near-duplicate records (>80% field overlap) — they will produce duplicate pages.
  - Verify data freshness; stale data produces stale pages, and stale programmatic pages are the easiest ones to deprioritize.

## Template architecture

Design templates that produce unique, valuable pages, not keyword mad-libs:
- **Variable injection points** — title, H1, body sections, meta description, schema.
- **Content blocks** — static (shared across all pages) vs. dynamic (unique per page). The dynamic share is what carries the SEO value.
- **Conditional logic** — show/hide sections based on data availability so missing fields don't leave visible gaps.
- **Supplementary content** — related items, contextual tips, user-generated content (reviews, Q&A) that a template alone can't fabricate.

Template review checklist:
- Each page must read as a standalone, valuable resource on its own.
- No "mad-libs" pattern — swapping city/product names into otherwise identical text.
- Dynamic sections must add genuine information, not just keyword variations of the same sentence.

## URL pattern strategy

Common patterns:
- `/tools/[tool-name]` — tool/product directory pages.
- `/[city]/[service]` — location + service pages.
- `/integrations/[platform]` — integration landing pages.
- `/glossary/[term]` — definition/reference pages.
- `/templates/[template-name]` — downloadable template pages.

URL rules:
- Lowercase, hyphenated slugs derived from data.
- Logical hierarchy reflecting site architecture.
- No duplicate slugs; enforce uniqueness at generation time.
- Keep URLs under 100 characters.
- No query parameters for primary content URLs.
- Consistent trailing-slash usage (match the existing site pattern).

## Internal linking automation

- **Hub/spoke model** — category hub pages link out to individual programmatic pages.
- **Related items** — auto-link to 3-5 related pages based on shared data attributes.
- **Breadcrumbs** — generate `BreadcrumbList` schema from the URL hierarchy.
- **Cross-linking** — link between programmatic pages sharing attributes (same category, same city, same feature).
- **Anchor text** — descriptive, varied anchor text; avoid exact-match keyword repetition on every instance.
- **Link density** — 3-5 internal links per 1000 words, matching [[seo-content]] guidelines.

## Thin content & quality-at-scale gates

### Quality gates

| Metric | Threshold | Action |
|---|---|---|
| Pages without content review | 100+ | WARNING — require a content audit before publishing |
| Pages without justification | 500+ | HARD STOP — require explicit user approval + thin-content audit |
| Unique content per page | <40% | Flag as thin content (penalty risk) |
| Word count per page | <300 | Flag for review (may lack sufficient value) |

### Scaled Content Abuse: enforcement context (2025-2026)

Google's Scaled Content Abuse policy (introduced March 2024) saw major enforcement escalation through 2025:
- **June 2025** — a wave of manual actions targeted sites running AI-generated content at scale.
- **August 2025** — third-party/SEO-community reporting described stronger SpamBrain detection for AI-generated link schemes and content farms.
- **Result** — Google reported a 45% reduction in low-quality, unoriginal content in search results following the March 2024 enforcement.

Enhanced quality gates for programmatic pages:
- **Content differentiation** — ≥30-40% of content must be genuinely unique between any two programmatic pages (not just city/keyword string replacement).
- **Human review** — minimum 5-10% sample review of generated pages before publishing.
- **Progressive rollout** — publish in batches of 50-100 pages; monitor indexing and rankings for 2-4 weeks before expanding. Never publish 500+ programmatic pages simultaneously without explicit quality review.
- **Standalone value test** — each page should pass: "would this page be worth publishing even if no other similar pages existed?"
- **Site reputation abuse** — Google clarified site-reputation-abuse language on 2024-11-19; treat third-party/hosted programmatic content as a policy risk.

The WARNING gate at <40% unique content remains appropriate as a baseline. Given 2025-2026 enforcement, treat <30% unique content as a HARD STOP, not just a warning, to keep margin against scaled-content-abuse risk.

### Safe at scale vs. penalty risk

Safe programmatic pages:
- Integration pages with real setup docs, API details, screenshots.
- Template/tool pages with downloadable content and usage instructions.
- Glossary pages with 200+ word definitions, examples, related terms.
- Product pages with unique specs, reviews, comparison data.
- Data-driven pages with unique statistics, charts, analysis per record.

Penalty risk — avoid at scale:
- Location pages with only the city name swapped into identical text.
- "Best [tool] for [industry]" pages without industry-specific value.
- "[Competitor] alternative" pages without real comparison data.
- AI-generated pages published without human review or unique value-add.
- Pages where >60% of content is shared template boilerplate.

### Uniqueness calculation

`Unique content % = (words unique to this page) / (total words on page) × 100`

Measure against every other page in the programmatic set. Shared headers, footers, and navigation are excluded from the calculation; template boilerplate text IS included, since that's exactly what erodes uniqueness at scale.

## Canonical strategy

- Every programmatic page carries a self-referencing canonical tag.
- Parameter variations (sort, filter) canonical to the base URL when duplicate or low-value.
- Paginated series — self-canonical each page when content differs; keep crawlable links between pages.
- If a programmatic page overlaps with a manually authored page, the manual page is canonical.
- No canonical to a different domain unless the cross-domain setup is intentional.

## Sitemap integration

- Auto-generate sitemap entries for all programmatic pages.
- Split at 50,000 URLs or 50MB uncompressed per sitemap file, whichever comes first (protocol limit).
- Use a sitemap index if multiple sitemap files are needed.
- `<lastmod>` reflects the actual data-update timestamp, not the page-generation time.
- Exclude noindexed programmatic pages from the sitemap.
- Register the sitemap in `robots.txt`.
- Update the sitemap dynamically as new records land in the data source.

## Index bloat prevention

- **Noindex low-value pages** — anything that fails the quality gates above.
- **Pagination** — reserve noindex/canonical consolidation for true duplicates or low-value filtered views.
- **Faceted navigation** — reserve noindex/canonical to the base category for true duplicates or low-value filtered views.
- **Crawl budget** — for sites with >10k programmatic pages, monitor crawl stats in Search Console; escalate to [[seo-technical]] if crawl rate can't keep pace with the page count.
- **Thin-page consolidation** — merge records with insufficient data into aggregated pages instead of publishing them thin.
- **Regular audits** — monthly review of indexed page count vs. intended count; a growing gap signals either a technical block or a quality-gate failure.

## Key concepts

- **Standalone value test** — the single question that separates a legitimate programmatic page from scaled content abuse: would this page justify itself with zero siblings?
- **Uniqueness %** — the quantified proxy for standalone value; template boilerplate counts against it, shared chrome doesn't.
- **Progressive rollout** — publishing in monitored batches (50-100 pages, 2-4 week bake) instead of dumping the full set, so a quality problem is caught at 100 pages, not 10,000.
- **Index bloat** — pages that get crawled and indexed but carry no ranking value; left unchecked, it dilutes crawl budget and site-quality signals for the whole domain.

## Output

- A programmatic SEO score report (data quality, template uniqueness, URL structure, internal linking, thin-content risk, index management) with Critical/High/Medium/Low findings and remediation recommendations, written to `plans/marketing/<campaign>/seo-programmatic.md`.
- Inline recommendations in the conversation when used for a quick pre-build check rather than a full audit.

## Cross-references

- `plans/marketing-context.md` — required hub (business context filters which data sources are worth templating)
- [[seo-content]] — link-density guideline this skill matches; writes the supplementary/dynamic content blocks
- [[seo-cluster]] — topic-cluster modeling for hand-authored content; use instead of this skill when pages aren't data-driven
- [[seo-ecommerce]] — category/filter-page specifics when the programmatic set is a product catalog
- [[seo-technical]] — crawl-budget and indexation diagnostics when the page count pushes past what Search Console shows as fully crawled
- `.claude/workflows/marketing-rules.md` — content quality rules
- `.claude/skills/marketing/README.md` — full kit overview
- `.claude/skills/marketing/seo/SKILL.md` — orchestrator (parent)

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-programmatic/SKILL.md`) and adapted for ClauKit: reformatted into the ClauKit skill template, scoped to the marketing kit namespace (`/mk:`), output path repointed to `plans/marketing-context.md`/`plans/marketing/<campaign>/`. The prior duplicate `programmatic-seo` skill (coreyhaines31 import) was retired in favor of this one — see `docs/clauKit-registry.md` §4f — so this file carries the full domain content standalone; no sibling skill covers the gaps. Data-source assessment, template architecture, URL/linking rules, quality gates (including the 2025-2026 Scaled Content Abuse enforcement notes), canonical/sitemap/index-bloat guidance preserved from source with no facts invented. The source's `## Error Handling` table (URL-unreachable / no-pages-detected / threshold-exceeded runtime responses) was intentionally not carried over — it described a live-crawl audit tool's error paths, which don't apply to this skill's plan/audit-from-supplied-data usage in ClauKit; its substantive quality thresholds are preserved above in Thin content & quality-at-scale gates instead.
