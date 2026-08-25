---
name: seo-maps
description: Google Maps / map-pack ranking mechanics — geo-grid rank tracking, GBP profile audit via API, cross-platform review intelligence, competitor radius mapping, and cross-platform NAP verification. Three capability tiers (free / DataForSEO / DataForSEO + Google Maps Platform). Analyzes the business on maps PLATFORMS via APIs — not the website's on-page local signals.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Maps — Google Maps Ranking & Map-Pack Mechanics

> The map pack isn't won on the website — it's won on the platform. This skill queries Google Maps, Bing Places, Apple Maps, and OpenStreetMap directly (API-first, free-tier fallback) to show where a business actually ranks, why, and against whom.

## When this skill activates

**Implicit:** "geo-grid rank tracking", "map pack ranking", "GBP profile audit" (live/API), "review velocity", "SoLV" (share of local voice), "competitor radius mapping", "cross-platform NAP check", "is my business ranking on Google Maps".
**Explicit:** "Use the seo-maps skill to [task]."
**Routed from:** [[seo]] orchestrator's local-service branch — activates alongside [[seo-local]] whenever a DataForSEO connection is available (`/mk:seo audit` on a detected local-service site). Also reachable directly for a maps-only request that doesn't need a full audit.

## Scope

Covers:
- Three-tier capability detection (free APIs / DataForSEO / DataForSEO + Google Maps Platform) and communicating the active tier before analysis.
- Geo-grid rank tracking: simulating Google Maps searches from a grid of coordinates, Share of Local Voice (SoLV), heatmap output.
- Live Google Business Profile (GBP) audit via API — the 25-field checklist scored from real API data, not inferred from the page.
- Cross-platform review intelligence: velocity, the 18-day-gap rule, sentiment, fake-review detection, Google/Tripadvisor/Trustpilot comparison.
- Competitor radius mapping (free via Overpass API, or DataForSEO Maps SERP for full competitor profiles).
- Cross-platform NAP verification across Google, Bing Places, Apple, and OpenStreetMap.
- LocalBusiness JSON-LD generation from data collected during a maps analysis.

Does NOT cover:
- On-page local SEO signals read from the business's own website (NAP in HTML/schema, GBP embeds, location-page quality, business-type/industry detection) — that is [[seo-local]]. Boundary rule: seo-local reads the WEBSITE via HTML fetch; seo-maps reads the PLATFORMS via API. Never duplicate seo-local's on-page checks here — recommend `/mk:seo local <url>` for those.
- Schema *validation* or fixing existing markup — [[seo-schema]]. This skill only *generates* a fresh LocalBusiness block from maps data it already collected.
- Full AI-search / LLM-citation visibility — [[seo-geo]].
- Live SERP/keyword data outside of maps (organic rankings, keyword volume) — [[seo-dataforseo]].

## Three-tier capability detection

Detect and announce the tier before any analysis — the user needs to know what's actually being measured.

| Tier | Detection | Adds |
|---|---|---|
| **0 — Free** | No DataForSEO MCP tools available | Overpass API competitor discovery, Geoapify POI search, Nominatim geocoding, a static GBP checklist scored from whatever the website exposes, schema generation, cross-platform NAP guidance |
| **1 — DataForSEO** | `business_data_business_listings_search` (or equivalent DataForSEO MCP tool) is available | Everything in Tier 0, plus geo-grid rank tracking, a *live* GBP profile audit, review intelligence (velocity/sentiment/distribution), GBP post activity, Q&A data, Tripadvisor/Trustpilot reviews |
| **2 — DataForSEO + Google Maps Platform** | Tier 1 available AND a Google Maps API key is present in the environment | Everything in Tier 1, plus Google Places details, real-time business status, AI place summaries, photo analysis. Google's ToS restricts storage to `place_id` only — cache lat/lng for 30 days max. |

## Geo-grid rank tracking (Tier 1+)

Simulates Google Maps searches from multiple GPS coordinates to expose how ranking varies across a geographic area — a business can rank #1 two blocks away and be invisible five miles out, and average-rank tools hide that entirely.

**Workflow:**
1. Geocode the business address to a center lat/lng.
2. Generate a grid of points (default 7x7, 5 km radius) via the Haversine offset formula.
3. **Display a cost estimate and get explicit confirmation before firing any paid calls** — each grid point is a billed DataForSEO Maps SERP request:
   ```
   Geo-Grid Scan: [keyword] at [location]
   Grid: 7x7 (49 points) | Keywords: [N] | Est. cost: $[amount]
   DataForSEO credits will be consumed. Proceed?
   ```
4. Fire the Maps SERP request per grid point using its coordinates.
5. Locate the target business's rank at each point.
6. Compute **Share of Local Voice (SoLV)**: `(points where the business ranks top-3 / total grid points) * 100`.
7. Render an ASCII heatmap of rank-by-position alongside the SoLV percentage and average rank.

## GBP profile audit

**Tier 1 (preferred) — live API workflow:**
1. Fetch the profile via the DataForSEO My Business Info API (by keyword or CID).
2. Map the response onto the 25-field checklist (categories, hours, posts, photos, Q&A, attributes, messaging, booking links, etc.).
3. Score each field: present + optimized = 2 pts, present = 1 pt, missing = 0 pts.
4. Apply industry-specific weight multipliers (e.g. hours and booking links weigh more for restaurants and home services than for a professional-services firm).
5. Normalize to a 0–100 scale.

**Tier 0 — manual/static fallback:**
1. Fetch the business website via WebFetch.
2. Extract whatever GBP signals are visible from the outside (Maps embed, place references, review widgets).
3. Score against the static checklist using only detectable signals.
4. Mark every field the site can't expose as "Unknown — requires DataForSEO for live data" rather than guessing.

Ranking-relevant context to fold into the audit narrative: primary GBP category correctness is consistently the single strongest map-pack factor in third-party ranking-factor studies, and an incorrect primary category is reported as the single strongest *negative* factor — so a category mismatch should be flagged Critical regardless of what else scores well.

## Review intelligence (Tier 1+)

Cross-platform review analysis: velocity, sentiment, rating distribution, response rate, and fake-review screening.

**Workflow:**
1. Fetch Google reviews via the DataForSEO Reviews API, sorted newest-first.
2. Compute review velocity: reviews per month over the trailing 6 months.
3. Check the **18-day rule** (an industry heuristic attributed to Sterling Sky): any 3-week gap with zero new reviews is treated as a ranking-risk signal, not just a reputation gap.
4. Assess rating distribution — healthy skews toward 5-star with a natural bell curve; a distribution that's suspiciously all-5-star or bimodal (mostly 5s and 1s) is itself a signal worth flagging.
5. Compute owner response rate (responses / total reviews).
6. Pull Tripadvisor and Trustpilot reviews where available and build a cross-platform comparison table.

**Fake-review detection** — flag any review cluster matching 2 or more of:
- Uniform timing (multiple reviews landing the same day/hour)
- Reviewer accounts with little or no history, or exactly one review ever
- Geographic inconsistency (reviewer's location vs. the business's)
- A sudden 5-star-only velocity spike with no corresponding marketing event
- Near-identical or templated text across multiple reviews
- A volume spike with no explanation (no campaign, no press, no event)

## Competitor radius mapping

**Tier 0 (Overpass API — free):**
1. Geocode the business address.
2. Query Overpass for same-category (OSM tag) businesses within a radius.
3. Parse name, address, phone, website, distance-from-center per result.
4. Sort by distance; present as a competitor-landscape table.

**Tier 1 (DataForSEO):**
1. Run the Maps SERP API with the target keyword + location.
2. Extract the top 20 competitors with full profile data (rating, review count, categories, photos, attributes).
3. Compute a competitive-density score: competitors per km².

## Cross-platform NAP verification

Checks listing consistency across the platforms that actually drive local discovery — Google, Bing Places, Apple, and OSM — as distinct from seo-local's page-vs-schema NAP check.

**Workflow:**
1. Search for the business on each platform: Google (from GBP data or a Maps SERP hit), Bing (`WebFetch` the Bing Maps search URL), Apple (no public API — verify manually, and treat any third-party claim about Apple's business-listing product as unconfirmed until checked against an Apple primary source), OSM (Overpass or Nominatim).
2. Extract Name/Address/Phone from each source found.
3. Compare pairwise: exact match, partial match, missing, or conflicting.
4. Flag discrepancies by severity: Critical (name mismatch), High (address mismatch), Medium (phone mismatch).
5. Recommend claiming any platform where no listing exists yet.

## Schema generation

Generates LocalBusiness JSON-LD from data this skill has already collected during a maps run — not a general-purpose schema tool (that's [[seo-schema]]).

1. Pick the most specific LocalBusiness subtype for the industry, not the generic type.
2. Populate required properties: `@type`, `name`, `address`, `image`.
3. Add recommended properties: `telephone`, `url`, `geo`, `openingHoursSpecification`, `priceRange`.
4. For multi-location businesses, add `branchOf`, `areaServed`, `sameAs`.
5. Add `aggregateRating` only if real review data was collected in this run.
6. **Never generate self-serving review markup.** Google disregards LocalBusiness review markup sourced from the business itself — only mark up third-party reviews that are genuinely visible on the page.

## Key concepts

- **Tier detection** — every output opens with the detected capability tier (0/1/2) so the user knows whether a claim is measured or inferred. Never present Tier-0 estimates as Tier-1 measurements.
- **Share of Local Voice (SoLV)** — the percentage of geo-grid points where the business ranks top-3; a single "average rank" number hides the geographic variance that actually matters to a multi-neighborhood business.
- **18-day rule** — a sustained 3-week gap in new reviews is treated as a ranking-risk signal on its own, independent of total review count or rating.
- **Platform vs. page** — this skill's entire boundary with [[seo-local]] in one line: platforms (API) here, page (HTML) there.

## Output

Generate `plans/marketing/<campaign>/seo-maps.md` (or `MAPS-ANALYSIS-<domain>.md` for a standalone run) with:

1. Maps Health Score (0–100) with a per-dimension breakdown.
2. Detected capability tier, stated plainly, with what it does and doesn't unlock.
3. Geo-grid heatmap + SoLV (Tier 1+ only).
4. GBP profile audit, field-by-field, with industry weighting shown.
5. Review intelligence: velocity, distribution, response rate, cross-platform comparison.
6. Competitor landscape: count in radius, top 5 by rating/reviews, density score.
7. Cross-platform presence table (Google/Bing/Apple/OSM).
8. Generated LocalBusiness JSON-LD, if missing or incomplete upstream.
9. Top 10 prioritized actions (Critical > High > Medium > Low).
10. DataForSEO credit/cost report for the run (Tier 1+ only).
11. A limitations disclaimer naming exactly what couldn't be assessed at the detected tier.

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo-local]] — the website-side counterpart; explicit boundary is platform (here) vs. page (there). Always cross-link rather than re-deriving NAP/GBP/review findings the other skill already produced.
- [[seo-schema]] — validates/fixes existing schema; this skill only generates fresh LocalBusiness JSON-LD from maps data.
- [[seo-geo]] — full AI-search visibility, beyond maps-platform scope.
- [[seo-dataforseo]] — the underlying live SERP/keyword data provider this skill depends on for Tier 1+.
- [[seo]] — orchestrator; dispatches here alongside [[seo-local]] for local-service audits when a DataForSEO connection exists.
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-maps/SKILL.md`, v2.2.4) and adapted for KitForge. Dropped from the original: the standalone `../seo/references/*.md` file pointers (maps-api-endpoints, maps-free-apis, maps-geo-grid, maps-gbp-checklist — these reference docs were never ported into ClauKit's tree, so the detail they held was inlined directly into this file instead of left as a dangling link) and the source's command-table/FLOW-framework/error-handling sections, which are ClauKit-command surface (`/seo maps ...` argument parsing) rather than skill content. The "AI & 2026 context" callout on Ask Maps / agentic booking was dropped as time-sensitive third-party-sourced speculation rather than durable ranking mechanics. Core mechanics — tier detection, geo-grid + SoLV formula, GBP audit workflow, review intelligence + fake-review heuristics, competitor radius mapping, cross-platform NAP verification, and schema-generation rules — preserved.
