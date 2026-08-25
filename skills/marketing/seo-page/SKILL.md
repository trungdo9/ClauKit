---
name: seo-page
description: Deep single-page SEO audit — on-page elements (title, meta, headers, links), content-quality signals, technical meta tags, schema detection, image checks, and Core Web Vitals signals inferred from HTML. Use when the user says "analyze this page", "check page SEO", "single URL", "page analysis", or hands over one URL/page for review.
allowed-tools: Read, Write, Glob, Grep
---

# SEO Page — Single-Page On-Page Audit

> A page can lose the click with a great body and a weak title tag, or lose the ranking with great copy and a broken header hierarchy. This skill scores everything between the URL bar and the last image on the page — on one URL, in one pass.

## When this skill activates

**Implicit:** "analyze this page", "check page SEO", "single URL", "check this page", "page analysis", or the user hands over one URL (or raw HTML) for review.
**Explicit:** "Use the seo-page skill to [task]."
**Routed from:** `/mk:seo audit` (single-page mode), [[seo-writing]] Stage 4 (on-page optimization).

**Boundary with [[seo-writing]] Stage 4:** `seo-page` is the general-purpose on-page audit — it runs against *any* page (yours, a competitor's, published or still a draft) and produces a scored report of what's wrong. Stage 4 of the writing pipeline (`references/stage-4-optimize.md` in [[seo-writing]]) is not an audit — it is a narrow *generation* step for the one article the pipeline just wrote: it invents a meta description/slug/tags from scratch, runs a deterministic keyword-density count, resolves image placeholders, and re-checks truth-only compliance. It executes a subset of this skill's Content Quality and Images checks, scoped to a single in-flight draft, and it never produces the score card or the full on-page/technical/schema sweep below. Run `seo-page` on an article after Stage 4 (or independently, on any page) when a full audit is wanted; use Stage 4 only inside the production pipeline to fill in fields a fresh draft doesn't have yet.

## Scope

Covers:
- On-page SEO: title tag, meta description, H1–H6 hierarchy, URL structure, internal/external link quality.
- Content-quality signals: word count vs. page-type minimum, readability, keyword density, E-E-A-T markers, freshness.
- Technical meta elements: canonical tag, meta robots, Open Graph, Twitter Card, hreflang.
- Schema detection and gap-spotting (what's present, what rich-result opportunities are missing).
- Image checks: alt text, file size, format, dimensions, lazy-load method.
- Core Web Vitals *signals* inferable from static HTML (not a live measurement).

Does NOT cover:
- Generating meta/slug/tags for an article still in production, its density re-check, or its truth-only re-pass → [[seo-writing]] Stage 4 (see boundary above).
- Authoring or deep-validating JSON-LD schema → [[seo-schema]] (this skill only detects what's there and flags gaps).
- Site-wide crawl/index/architecture audits or actually-measured Core Web Vitals → [[seo-technical]].

## What to analyze

### On-page SEO
- Title tag: 50–60 characters, includes the primary keyword, unique on the site.
- Meta description: 150–160 characters, compelling, includes the keyword.
- H1: exactly one, matches page intent, includes the keyword.
- H2–H6: logical hierarchy, no skipped levels, descriptive text.
- URL: short, descriptive, hyphenated, no parameters.
- Internal links: sufficient count, relevant anchor text, no orphan pages.
- External links: to authoritative sources, reasonable count.

### Content quality
- Word count against the page-type minimum (homepage / service / blog / product / location — thresholds live with the [[seo]] orchestrator's quality gates).
- Readability: Flesch Reading Ease score, grade level.
- Keyword density: natural (1–3%), semantic variations present.
- E-E-A-T signals: author bio, credentials, first-hand-experience markers.
- Freshness: publication date, last-updated date.

### Technical elements
- Canonical tag: present, self-referencing or correctly pointed.
- Meta robots: index/follow unless intentionally blocked.
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`.
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`.
- Hreflang: correct implementation if the site is multi-language.

### Schema markup
- Detect all types present (JSON-LD preferred).
- Validate required properties are populated.
- Identify missing rich-result opportunities.
- Never recommend HowTo (deprecated) or FAQ for rich results (retired May 2026); existing FAQPage need not be removed — use QAPage for genuine Q&A going forward.

### Images
- Alt text: present, descriptive, includes keywords where natural.
- File size: flag >200KB (warning), >500KB (critical).
- Format: recommend WebP/AVIF over JPEG/PNG.
- Dimensions: width/height set, for CLS prevention.
- Lazy loading: report `lazy_method` per image (native | perfmatters | ewww | js-generic | none). Do not flag "not lazy-loaded" when a JS lazy-loader (Perfmatters, EWWW, lazysizes) is detected — those intentionally strip the native `loading="lazy"` attribute in favor of `data-src` placeholders.

### Core Web Vitals (signals only — not measurable from HTML alone)
- Flag potential LCP issues: oversized hero images, render-blocking resources.
- Flag potential INP issues: heavy JS, missing async/defer.
- Flag potential CLS issues: missing image dimensions, content injected after load.

## Key concepts

- **Score card, not a pass/fail** — every category (on-page, content, technical, schema, images) gets its own 0–100 score plus an overall roll-up, so a page can be told apart from "broken" vs. "one weak category".
- **Signal vs. measurement** — the Core Web Vitals section flags *risk factors* visible in static HTML; it is never a substitute for field/lab CWV data, which belongs to [[seo-technical]].
- **Lazy-load false positives** — a page missing the native `loading="lazy"` attribute is not automatically a defect; JS lazy-loaders remove it on purpose. Check for `data-src`/known plugin markers before flagging.

## Output

### Page score card
```
Overall Score: XX/100

On-Page SEO:     XX/100  ████████░░
Content Quality: XX/100  ██████████
Technical:       XX/100  ███████░░░
Schema:          XX/100  █████░░░░░
Images:          XX/100  ████████░░
```

### Issues found
Organized by priority: Critical → High → Medium → Low.

### Recommendations
Specific, actionable improvements with expected impact.

### Schema suggestions
Ready-to-use JSON-LD for detected opportunities (hand off deep authoring to [[seo-schema]]).

Written to `plans/marketing/<campaign>/seo-page.md`, with the score card and top issues surfaced inline in the conversation.

### DataForSEO integration (optional)
If DataForSEO MCP tools are available, use `serp_organic_live_advanced` for real SERP positions and `backlinks_summary` for backlink data and spam scores.

## Error handling

| Scenario | Action |
|---|---|
| URL unreachable (DNS failure, connection refused) | Report the error clearly. Do not guess page content. Suggest the user verify the URL and try again. |
| Page requires authentication (401/403) | Report that the page is behind authentication. Suggest the user provide the rendered HTML directly or a publicly accessible URL. |
| JavaScript-rendered content (empty body in raw HTML) | Note that key content may render client-side. Analyze the available HTML and flag that results may be incomplete. Suggest a browser-rendered snapshot if one is available. |

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo-writing]] — Stage 4 (`references/stage-4-optimize.md`) executes a narrow generation/density-check subset of this skill's checks for one in-flight article
- [[seo-schema]] — deep JSON-LD authoring and validation for schema gaps this skill identifies
- [[seo-technical]] — site-wide crawl/index/architecture and actually-measured Core Web Vitals
- `.claude/workflows/marketing-rules.md` — content quality rules
- `.claude/skills/marketing/README.md` — full kit overview
- `.claude/skills/marketing/seo/SKILL.md` — orchestrator (parent); quality-gate word-count minimums

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-page/SKILL.md`) and adapted for KitForge. Adaptations: KitForge frontmatter, scoped to the marketing kit namespace (`/mk:`), added an explicit scope boundary against [[seo-writing]] Stage 4, references `plans/marketing-context.md`. Domain checks (on-page, content quality, technical, schema, images, CWV signals) and the error-handling table are preserved from the source.