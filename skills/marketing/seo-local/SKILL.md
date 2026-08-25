---
name: seo-local
description: Local SEO analysis — Google Business Profile (GBP) optimization, NAP consistency across page/schema/citations, review-signal health, citation building, LocalBusiness schema by industry vertical, and multi-location doorway-page risk. Detects business type (brick-and-mortar / service-area / hybrid) and industry vertical to route the checks that apply. Use for "local SEO", "Google Business Profile", "GBP", "map pack", "local pack", "citations", "NAP consistency", "service area", or "multi-location".
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Local — Local & Multi-Location SEO

> The local pack runs on GBP signals, review velocity, and NAP consistency, not domain authority — a business with three different addresses across the web loses the map pack before content quality ever gets weighed.

## When this skill activates

**Implicit:** "local SEO", "Google Business Profile", "GBP", "map pack", "local pack", "citations", "NAP consistency", "service area", "multi-location".
**Explicit:** "Use the seo-local skill to [task]."
**Routed from:** the [[seo]] orchestrator (business-type detection dispatches here), `/mk:seo audit` (the [[seo-audit]] envelope owns local signals — GBP, NAP, reviews — as one of its specialist findings). For sites spanning multiple countries/languages rather than multiple cities, hand the locale-targeting half off to [[seo-hreflang]].

## Scope

Covers:
- Business-type detection (brick-and-mortar / service-area business (SAB) / hybrid) and industry-vertical routing.
- GBP optimization checklist (category, posts, photos, Q&A, verification).
- Review-signal audit (velocity, rating thresholds, response patterns, gating compliance).
- NAP consistency across page HTML, schema, and third-party citations.
- Citation-building priorities (Tier 1 directories, data aggregators, industry-specific directories).
- LocalBusiness schema subtype selection by industry vertical.
- Multi-location page quality (doorway-page risk, subdirectory structure, per-location schema).

Does NOT cover:
- Schema JSON-LD generation/validation mechanics → [[seo-schema]].
- Geo-grid rank tracking and deeper review-platform intelligence → [[seo-maps]].
- Crawlability, sitemaps, Core Web Vitals, and other technical checks → [[seo-technical]].
- AI-search citation optimization (llms.txt, ChatGPT/Perplexity/AI-Overview visibility) → [[seo-geo]]; this skill only reports local-specific AI facts and hands off.

## Key statistics

| Metric | Value | Source |
|---|---|---|
| GBP signals share of local pack weight | 32% | Whitespark 2026 |
| Proximity share of ranking variance | 55.2% | Search Atlas ML study |
| Review signals share of local pack weight (up from 16%) | ~20% | Whitespark 2026 |
| Google searches seeking local info | 46% | Industry data |
| Mobile "near me" searches leading to a visit within 24h | 76% | Google confirmed |
| Use of ChatGPT/AI for local recommendations (up from 6%) | 45% | BrightLocal LCRS 2026 |
| ChatGPT local conversion rate vs. Google organic (1.76%) | 15.9% | Seer Interactive |
| Local pack ad share (Jan 2025 → Jan 2026) | 1% → 22% | Sterling Sky |

## Business-type detection

Detect before running any check below — it determines which checks apply.

| Type | Signals |
|---|---|
| **Brick-and-mortar** | Physical street address in content/footer; embedded map with pin/directions; "Visit us at", "Located at"; structured address in schema. |
| **Service-area business (SAB)** | No visible physical address; "serving [city/region]", "service area includes", "we come to you"; `areaServed` in schema without `streetAddress`. |
| **Hybrid** | Both present — e.g. "Visit our showroom" alongside "we also serve [areas]". |

SABs skip embedded-map verification and physical-address consistency checks. Brick-and-mortar gets the full NAP + map treatment.

## Industry-vertical detection

Detect from page content and GBP category patterns — it routes which schema subtype and citation sources apply (see Local schema and Citations below).

| Vertical | Detection signals |
|---|---|
| **Restaurant** | `/menu`, menu items, reservations, cuisine types, food ordering, "dine-in"/"takeout". |
| **Healthcare** | Insurance accepted, patients, appointments, NPI, medical terms, "Dr.", HIPAA notice. |
| **Legal** | Attorney, lawyer, practice areas, bar admission, case results, "free consultation". |
| **Home Services** | Service area, emergency service, "free estimate", licensed/insured/bonded, "24/7". |
| **Real Estate** | Listings, MLS, properties for sale/rent, agent bio, brokerage, "open house". |
| **Automotive** | Inventory, VIN, test drive, dealership, service department, "new/used/certified". |

No vertical detected → fall back to generic `LocalBusiness` analysis.

## GBP optimization checklist

Primary category is the single most important local-pack factor (Whitespark #1, score 193); an incorrect primary category is the #1 *negative* factor (score 176).

- GBP evidence detectable on the page (Maps iframe, place ID, reviews widget).
- Primary category appropriate for the detected vertical; ~4 secondary categories is the optimal count (BrightLocal).
- GBP posts present (no direct ranking weight, but trigger Post Justifications in the pack).
- Photos/video present — listings with photos get 45% more direction requests (Agency Jet).
- GBP Q&A available and optimized where the category/region supports it.
- Google Verified badge eligibility (replaced Guaranteed/Screened badges, Oct 2025).
- GBP website link does **not** point at the site's strongest organic page — doing so risks suppressing that page's rankings (Sterling Sky).
- Business hours visible on the page — businesses open at search time rank higher (factor #5).

**Rate:** Full (embed present, category aligned, posts active, photos present) / Partial (some signals, gaps) / Low (no visible GBP integration).

## Review signals & reputation

Velocity matters more than total count — the **18-day rule** (Sterling Sky): local-pack rankings cliff if a listing goes 3 weeks with no new review.

- Review count visible on page or in schema — 10 reviews is the "magic threshold" (Sterling Sky).
- Star rating — 31% of consumers only consider businesses at 4.5+ stars, 68% only at 4+ (BrightLocal 2026).
- Recency — 74% of consumers only weight reviews from the last 3 months.
- `aggregateRating` present in schema (`ratingValue`, `reviewCount`, `bestRating`).
- Third-party review presence — consumers average across 6 review sites (BrightLocal 2026).
- Owner-response pattern — 88% of consumers would use a business that responds to reviews.
- **Review gating is prohibited**: any pre-screening of satisfaction before directing to a review platform violates Google's fake-engagement policy and the FTC ($53,088/violation).
- Healthcare: HIPAA bars confirming or denying that a reviewer is a patient in any response. Legal: attorney-client privilege constrains what a response can say.

**Rate:** Full (10+ reviews, 4.5+ stars, recent activity, owner responses, multi-platform) / Partial (gaps in recency, rating, or response rate) / Low (<10 reviews, no recent activity, no responses, single platform).

## NAP consistency & citations

Citations are declining as a traditional local-pack factor, but 3 of the top 5 AI-visibility factors are citation-related (Whitespark 2026). Google's July 2025 documentation update dropped "directories" from its definition of prominence — citations now matter more for AI discovery than for the classic pack.

**NAP extraction and cross-check** — compare Name, Address, Phone across three sources and flag any discrepancy:
1. Visible page HTML (footer, contact page).
2. LocalBusiness JSON-LD schema.
3. Any visible GBP data on the page.

**Citation presence** (check via WebSearch/WebFetch `site:` patterns):
- Yelp (`site:yelp.com "Business Name"`), BBB (`site:bbb.org "Business Name"`), Facebook business page.
- Apple Maps / Apple Business listings — recommend claiming; treat any "Apple Business unified platform" launch/rename claim as third-party-sourced until verified against Apple's own documentation.
- Bing Places — powers ChatGPT, Copilot, and Alexa; claiming it is a distinct AI-visibility lever from Google.
- Data aggregators (Data Axle, Foursquare, Neustar/TransUnion) — submission distributes NAP downstream to smaller directories.
- Industry-specific directories per the vertical detected above (e.g. healthcare → insurer/HIPAA-compliant directories, legal → bar-association directories, home services → licensing-board directories).

**Rate:** Full (NAP consistent across all three sources, Tier 1 + industry citations detected) / Partial (NAP present but inconsistent, or citations partly missing) / Low (NAP discrepancies, no detectable citations, no schema address).

## Local schema markup

Schema is not a direct ranking factor (John Mueller has confirmed this) but drives rich results — a 43% CTR increase in one case study (Webstix) — and is how AI systems parse business facts.

- LocalBusiness JSON-LD present with `name` and `address` (PostalAddress sub-properties).
- Recommended: `geo` (5+ decimal places), `openingHoursSpecification`, `telephone`, `url`, `priceRange` (<100 chars), `image`, `aggregateRating`.
- **Correct subtype for the vertical**, not generic `LocalBusiness`:
  - Restaurant → `Restaurant` (+ `Menu`/`MenuSection`/`MenuItem`; `ReserveAction` isn't a Google rich-result trigger, but still valuable machine-readable data).
  - Legal → `LegalService` (the `Attorney` type is deprecated).
  - Automotive → `AutoDealer` (`VehicleListing` is deprecated) + `Car` + `Offer`.
  - Healthcare → `MedicalClinic`/`Hospital`/`Dentist` (not generic `MedicalBusiness`) + `Physician` as `Person` + `sameAs` to NPI.
  - Home Services → the specific subtype + `areaServed` + `Service`.
  - Real Estate → `RealEstateAgent` + `Person` + `RealEstateListing`.
- SAB: `areaServed` with named cities (Schema.org-supported, not on Google's official property list, but still recommended).
- Multi-location: each location page carries its own `LocalBusiness` with a unique `@id`, linked to the parent `Organization` via `branchOf`.

**Rate:** Full (correct subtype, recommended properties, valid JSON-LD) / Partial (LocalBusiness present but generic or missing properties) / Low (no local schema, or schema with errors/placeholders).

## Multi-location patterns

Dedicated location/service pages are the #1 local-organic factor *and* the #2 AI-visibility factor (Whitespark 2026) — and the easiest place to accidentally build doorway pages.

- **Unique-content floor: >60–70%** per location page (industry consensus; no Google-confirmed number).
- **Swap test** (RicketyRoo): if swapping the city name leaves the page still making sense, it's a doorway page. One HVAC company lost 80% of rankings and 63% of traffic after the March 2024 Core Update for this exact pattern.
- Each location page needs local photos, area-specific testimonials, and local FAQs — not a templated paragraph with the city name swapped in.
- Store locator with individually crawlable URLs; prefer SSR/SSG over client-side rendering so pages are indexable.
- Subdirectory structure (`domain.com/locations/city-name/`) consolidates link equity better than subdomains — Bruce Clay reports 50%+ traffic lift from subdirectory migrations.
- Each location page gets its own `LocalBusiness` schema with a unique `@id` (see Local schema markup above).
- Quality gate at scale: WARNING at 30+ location pages (enforce the 60%+ uniqueness floor), HARD STOP at 50+ pages — require explicit user justification before continuing the audit.

## AI search impact on local

Do not duplicate [[seo-geo]]'s analysis here — report only local-specific AI facts and hand off:

- AI Overviews appear on up to 68% of local searches (Whitespark, Q2 2025).
- ChatGPT converts at 15.9% vs. 1.76% for Google organic (Seer Interactive).
- 3 of the top 5 AI-visibility factors are citation-related (Whitespark 2026).
- ChatGPT does not read GBP directly — it sources from the Bing index, Yelp, TripAdvisor, BBB, and Reddit.
- Bing Places is therefore a load-bearing citation, not an optional one: it powers ChatGPT, Copilot, and Alexa.
- Some AI local surfaces on mobile now show only 1–2 businesses (32% fewer than before, per third-party observation, Sterling Sky) — visibility is more winner-take-most than the classic 3-pack.

Recommend `/mk:seo ai <url>` (routes to [[seo-geo]]) for full citability scoring, llms.txt check, and brand-mention audit.

## Key concepts

- **Business type gates the checklist** — SAB, brick-and-mortar, and hybrid businesses fail different checks for different reasons; scoring a SAB against physical-address consistency produces false negatives.
- **Review velocity over review count** — a listing with 200 stale reviews loses to one with 15 recent ones (the 18-day rule).
- **NAP is a three-way consistency problem** — page, schema, and third-party citations must all agree; a discrepancy anywhere is the finding, not just an absent value.
- **Doorway pages are the main multi-location failure mode** — the swap test is the fast diagnostic; the fix is unique local content, not more location pages.
- **Schema is for parsing, not ranking** — treat it as an AI/rich-result enabler, not a ranking lever, when explaining priority to the user.

## Output

Generate `plans/marketing/<campaign>/seo-local.md` (or `LOCAL-SEO-ANALYSIS-<domain>.md` when run standalone against a live URL) with:

1. **Local SEO Score: XX/100** with a per-dimension breakdown (GBP 25%, Reviews 20%, Local on-page 20%, NAP & citations 15%, Local schema 10%, Local links & authority 10%).
2. Business type (brick-and-mortar / SAB / hybrid) and detected industry vertical.
3. GBP optimization checklist — detected vs. missing signals.
4. Review-health snapshot (rating, count, velocity, response pattern).
5. NAP consistency audit — page-vs-schema-vs-citation discrepancies, called out explicitly.
6. Citation presence by directory tier.
7. Local schema status (present / missing / malformed) with a ready-to-use fix.
8. Multi-location quality (if applicable): unique-content %, doorway risk, store-locator crawlability.
9. Top prioritized actions, Critical > High > Medium > Low — quick wins first (fix NAP discrepancies, add/repair LocalBusiness schema with the correct subtype, claim Bing Places and Apple listings), then structural work (dedicated service pages, review-generation cadence, per-location unique content).
10. **Limitations disclaimer** — this analysis cannot assess geo-grid ranking position, Domain Authority, a comprehensive backlink profile, GBP Insights data, or live local-pack position; name the paid tools that can (rank trackers, GBP Insights, a backlink index) rather than guessing at those numbers.

## Cross-references

- `plans/marketing-context.md` — required hub (business context, target locations)
- [[seo]] — orchestrator; dispatches here on business-type detection
- [[seo-audit]] — full-site audit envelope; treats this skill's output as its local-signals finding
- [[seo-schema]] — JSON-LD generation/validation mechanics for the LocalBusiness markup this skill specifies
- [[seo-maps]] — geo-grid rank tracking and deeper review-platform intelligence
- [[seo-technical]] — crawlability, sitemap, and Core Web Vitals checks this skill does not run
- [[seo-geo]] — AI-search citability, llms.txt, and brand-mention audit for local AI visibility
- [[seo-hreflang]] — locale/multi-region targeting when a multi-location site also spans countries or languages
- `.claude/workflows/marketing-rules.md` — content quality and evidence rules

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-local/SKILL.md`, ~315 lines) and adapted for ClauKit. All statistics and cited thresholds (Whitespark 2026, BrightLocal LCRS 2026, Seer Interactive, Sterling Sky, Search Atlas, Bruce Clay, RicketyRoo, Webstix, Agency Jet) are carried over verbatim with their original attribution. Dropped from the source: the standalone "Quick Wins / Medium Effort / High Impact" tiered list (folded into Output's prioritized-actions item, since it duplicated the per-dimension checklists above); the "DataForSEO Integration" and "FLOW Framework Integration" sections (ClauKit has no DataForSEO MCP wiring or FLOW prompt framework installed); and links to `../seo/references/local-seo-signals.md` and `../seo/references/local-schema-types.md` (those reference files were never ported into this repo's `seo/` skill — their load-bearing content, the vertical-detection table and per-vertical schema subtypes, is inlined above instead of link-referenced, per this repo's rule against shipping doc links to files an install doesn't have).
