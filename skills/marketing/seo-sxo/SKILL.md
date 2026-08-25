---
name: seo-sxo
description: Search Experience Optimization — reads the SERP backwards to catch page-type mismatches (a blog post competing against product pages), derives user stories from PAA/ads/related-searches, and scores the page from 4-7 SERP-derived personas (relevance/clarity/trust/action). Produces an SXO Gap Score, kept separate from the SEO Health Score, plus an IST/SOLL wireframe on request.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO SXO — Search Experience Optimization

> A page can score 95/100 on technical SEO and still never rank — because it's the wrong page type for what Google is actually rewarding in the SERP.

## When this skill activates

**Implicit:** "why isn't my page ranking", "SXO", "search experience", "page type mismatch", "SERP analysis", "user story for this keyword", "persona scoring", "wireframe this page".
**Explicit:** "Use the seo-sxo skill to [task]."
**Routed from:** [[seo]] orchestrator — activated on every full audit (search experience applies to every site); `/mk:seo audit` when a page ranks below expectation despite a clean technical score.

## Scope

Covers:
- SERP-backwards analysis: classifying the top-10 results by page type, format, and SERP features to establish what Google is actually rewarding for a keyword.
- Page-type mismatch detection between the target page and SERP consensus, with severity.
- User-story derivation from PAA / ad copy / related searches / featured-snippet format / AI Overview.
- Persona-based scoring (4-7 personas × Relevance / Clarity / Trust / Action).
- The 7-dimension SXO Gap Score (0-100) — separate from, and reported alongside, the SEO Health Score.
- IST/SOLL wireframes with ultra-concrete placeholders.

Does NOT cover:
- Core Web Vitals, crawl/index health, mobile rendering — this skill's "UX Signals" dimension scores only what's visibly present (CTA clarity, above-fold content), never the CWV metrics themselves → [[seo-technical]].
- Funnel/conversion mechanics once a visitor is already on the right page type — headline/CTA copy tests, form-friction reduction, popups, the 25-point framework → [[cro]]. The boundary: SXO decides whether this is even the right page type for the keyword and whether it serves the right personas; `cro` optimizes that page's conversion mechanics once SXO has confirmed the page type is aligned. Route a "wrong page type" or "wrong personas served" finding here; route a "right page, weak headline/CTA/form" finding to `cro`.
- E-E-A-T depth scoring of the content itself → [[seo-content]] (this skill's Authority Signals dimension flags the gap; `seo-content` closes it).
- Schema generation for the types this skill's taxonomy expects per page type → [[seo-schema]].
- Single-page technical/content deep dive unrelated to SERP comparison → `seo-page`.

## Core insight

The SEO Health Score measures technical compliance (crawlability, speed, schema). SXO asks a narrower, sharper question: does this page *deserve* to rank for this keyword, given what Google is currently rewarding in the SERP? A page can be 95 SEO + 30 SXO — technically perfect, strategically misaligned. Report both scores together whenever both are available; never let one stand in for the other.

## SERP-backwards analysis

Read `references/page-type-taxonomy.md` for the 8-type classification (Landing Page, Blog Post, Product Page, Hybrid, Service Page, Comparison Page, Local Page, Tool/Interactive) and its priority order for resolving overlapping signals.

1. Fetch the target page; extract title, H1, meta description, heading hierarchy, word count, schema markup, CTAs, media. If no keyword is given, derive one from title/H1 overlap.
2. Search the target keyword; for each of the top 10 organic results record: page type (via the taxonomy), content format, word-count tier, schema types present, media signals, domain-authority tier.
3. Record SERP features: featured-snippet format, PAA questions (verbatim), ad count + copy themes, related searches, knowledge panel/local pack/shopping results, AI Overview presence + cited sources.
4. Calculate SERP consensus: dominant page type (>60% = strong, 40-60% = mixed, <40% = fragmented), content-depth norm, schema expectation, media expectation.

Need at least 5 organic results before calling a consensus; below that, proceed but flag the sample as limited in the output.

## Page-type mismatch detection

Classify the target page with the same taxonomy used on the SERP, then compare:

| Target type | SERP expects | Severity | Fix |
|---|---|---|---|
| Blog Post | Product Pages | Critical | Build a dedicated product page |
| Blog Post | Comparison | High | Restructure as a comparison with a feature matrix |
| Product | Informational | High | Add an educational content layer |
| Landing Page | Tool/Calculator | High | Build the interactive tool |
| Service Page | Local Results | Medium | Add NAP + LocalBusiness schema |
| Match | — | Aligned | Focus on content depth and UX, not page type |

A fragmented SERP (no dominant type) is not a mismatch — it's a differentiation opportunity; say so instead of forcing a verdict.

## User-story derivation

Read `references/user-story-framework.md` for the full signal-to-story mapping.

Each SERP signal source reveals something different: PAA = knowledge gaps and concerns, ad copy = commercial triggers, related searches = journey position (narrowing / broadening / comparing / reviewing), featured-snippet format = the expected answer shape, AI Overview = what Google treats as the authoritative synthesis. Turn signal clusters into 3-5 stories:

```
As a [persona derived from a signal cluster],
I want to [goal derived from query intent],
because [emotional driver from ad tone / PAA phrasing],
but I'm blocked by [barrier from PAA / related searches].
```

Every story must cite the specific signal that produced it — no invented personas, no guessed barriers. Span at least two journey stages (awareness / consideration / decision).

## Persona-based scoring

Read `references/persona-scoring.md` for the full rubric.

Derive 4-7 personas from the same signal clusters (never invent one without SERP evidence), then score the target page 0-25 on each of 4 dimensions per persona:
- **Relevance** — does the page address this persona's specific goal?
- **Clarity** — can this persona find their answer within 10 seconds?
- **Trust** — are there trust signals this persona specifically needs (case studies matching their industry, security badges for risk-averse personas, etc.)?
- **Action** — is there a next step matched to this persona's journey stage?

Sort recommendations by weakest persona × highest estimated search-volume weight first, then by systemic issue (the same dimension weak across every persona).

## Gap analysis — the SXO Score

Score the page 0-100 across 7 dimensions, independent of the SEO Health Score:

| Dimension | What's scored | Points |
|---|---|---|
| Page Type | Target type vs SERP dominant type | 0-15 |
| Content Depth | Word count, heading depth, topic coverage | 0-15 |
| UX Signals | CTA clarity, above-fold content, mobile layout | 0-15 |
| Schema Markup | Present vs SERP-expected structured data | 0-15 |
| Media Richness | Images / video / interactive vs SERP norm | 0-15 |
| Authority Signals | E-E-A-T markers, social proof, credentials | 0-15 |
| Freshness | Last-updated / date signals | 0-10 |

Lower = larger gap. Report this as "SXO Gap Score: XX/100" — never merged into or averaged with the SEO Health Score.

## Wireframes (IST/SOLL)

On request only, not part of the default analysis. Read `references/wireframe-templates.md` for the 8 page-type SOLL templates.

- **IST** — the page's current structure, section by section, as it actually reads today.
- **SOLL** — the target structure, built from the SERP-consensus page type + this analysis's gap findings + weakest-persona fixes.
- Placeholders must be ultra-concrete: not "add a CTA" but "add a 'Start Free Trial' button below the hero, links to /signup"; not "add social proof" but "add 3 logos (G2, Capterra, TrustRadius) + '4.8/5 from 2,300 reviews'".

## Key concepts

- **SXO Gap Score vs SEO Health Score** — SEO Health Score is technical compliance; SXO Gap Score is alignment between page and SERP expectation. Report both, never conflate them.
- **Page-type mismatch** — the single highest-leverage SXO finding: no amount of on-page polish fixes a page that is fundamentally the wrong type for the keyword.
- **Signal-sourced personas/stories** — every persona and every user story must trace to an observed SERP signal (a specific PAA question, ad theme, related search). An unsourced persona is a guess, not a finding.
- **Pogo-sticking** — a searcher who clicks a result, bounces back to the SERP within seconds, and tries another result; the behavioral symptom a page-type mismatch or a weak persona-clarity score predicts before it ever shows up in analytics.
- **Dwell time as a proxy** — time-on-page after a click is Google's indirect read on "did this page satisfy the query"; a low Clarity or Relevance persona score is the on-page cause a short dwell time only reports as a symptom.

## Output

- Full SXO analysis written to `plans/marketing/<campaign>/seo-sxo.md`: SERP landscape, page-type verdict, user stories, gap-score breakdown, persona scorecards, priority actions, limitations.
- Wireframe output (when requested) as a semantic-HTML section outline with concrete annotations, appended to the same file or delivered inline.
- Findings handed to sibling skills where the fix isn't SXO's own: E-E-A-T gaps → [[seo-content]]; schema gaps → [[seo-schema]]; local intent detected in the SERP → `seo-local`; technical/CWV issues hit during fetch → [[seo-technical]]; page-type-aligned but still under-converting → [[cro]].

## Cross-references

- `plans/marketing-context.md` — required hub (ICP shapes which personas matter)
- [[seo]] — orchestrator; runs seo-sxo on every full audit
- [[seo-technical]] — Core Web Vitals / crawl / render (this skill's UX Signals dimension stops at visible layout, not CWV metrics)
- [[cro]] — funnel/conversion mechanics once the page type is already aligned; see Scope for the exact handoff
- [[seo-content]] — closes the E-E-A-T gaps this skill's Authority Signals dimension surfaces
- [[seo-schema]] — generates the structured-data types this skill's taxonomy expects per page type
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` (original author: Florian Schmitz, Pro Hub Challenge) and adapted for ClauKit. Adaptations: ClauKit frontmatter, scoped to marketing kit namespace (`/mk:`), references `plans/marketing-context.md`, dropped the source's `scripts/render_page.py` / `parse_html.py` / DataForSEO-MCP invocations in favor of WebFetch/WebSearch (that CLI is the original repo's own tooling and isn't vendored into ClauKit). The page-type taxonomy, persona-scoring rubric, user-story framework, and wireframe templates in `references/` are preserved from the source almost verbatim — they're durable domain content, not tooling.
