---
name: seo-ecommerce
description: E-commerce SEO — product-page on-page audit, Product schema (JSON-LD) requirements and scoring, Google Shopping / Amazon marketplace intelligence, organic-vs-Shopping keyword gaps, and UCP (Universal Commerce Protocol) agentic-checkout profile audit.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Ecommerce — Product Pages, Marketplace Intelligence, UCP

> A product page competes on three fronts at once: the SERP (on-page + schema), the marketplace (Google Shopping / Amazon pricing and seller data), and — starting in 2026 — AI shopping agents (UCP). This skill scores all three and never treats "no marketplace data" as a blocker.

## When this skill activates

**Implicit:** "ecommerce SEO", "product SEO", "product page audit", "Google Shopping", "marketplace SEO", "product schema", "Amazon SEO", "product listings", "shopping ads", "merchant SEO", "UCP profile", "agentic checkout".
**Explicit:** "Use the seo-ecommerce skill to [task]."
**Routed from:** [[seo]] orchestrator (ecommerce industry detection), product-page and category-page SEO contexts, [[seo-schema]] for the Product schema type specifically, [[seo-page]] for page-level SEO that turns out to be a product page, `/mk:seo` ecommerce actions.

## Scope

Covers:
- Product-page on-page SEO checklist and weighted scoring (title, meta, headings, images, internal linking, content quality).
- Product schema (JSON-LD) — required + recommended properties, validation rules, completeness scoring.
- Marketplace intelligence — Google Shopping and Amazon competitive analysis (pricing, sellers, listing quality).
- Organic-vs-marketplace keyword gap analysis.
- UCP (Universal Commerce Protocol) profile audit — agentic-checkout discoverability for AI shopping agents.

Does NOT cover:
- General JSON-LD generation/validation mechanics for non-Product types → [[seo-schema]] (this skill owns the Product-specific field rules; [[seo-schema]] owns the taxonomy and validator).
- Page-level on-page SEO for non-product pages → [[seo-page]].
- Category-page template generation at scale, faceted-navigation and pagination crawl-budget management, canonicalization rules for large catalogs → [[seo-programmatic]].
- Product image file optimization itself (alt text, format, compression) → [[seo-images]]; this skill only checks that image optimization happened.
- Site-wide technical crawl/index health (Core Web Vitals, sitemaps, JS rendering) → [[seo-technical]].
- DataForSEO cost/quota guardrails as a general concern → [[seo-dataforseo]].

## 1. Product page on-page audit

Fetch the page (`WebFetch`) and score these product-specific signals:

**Title tag** — primary product keyword + brand name, under 60 characters, format `[Product Name] - [Key Feature] | [Brand]`.

**Meta description** — product keyword + benefit, price or "from $XX" (triggers rich-snippet interest), a call to action (Shop now / Buy / Free shipping), under 155 characters.

**Heading structure** — single H1 matching the primary product name; H2s for Features / Specifications / Reviews / Related Products; no duplicate H1s across product variants.

**Product images** — alt text includes product name + distinguishing feature; descriptive filenames (not `IMG_001.jpg`); WebP with JPEG fallback; at least 3 images (hero, detail, lifestyle); >= 800px for Google Shopping eligibility; lazy-loading on below-fold images only. (Delegate the actual fix to [[seo-images]] — this skill checks, doesn't optimize.)

**Internal linking** — breadcrumb Home > Category > Subcategory > Product; related-products cross-sell/upsell section; keyword-rich anchor back to the category page; reviews link to a full review page if separate.

**Content quality** — unique product description (not manufacturer copy-paste); >= 200 words in the description body; a specs table, not just prose; on-page user reviews (UGC signal).

### Scoring

| Category | Weight | Criteria |
|---|---|---|
| Schema completeness | 25% | Required + recommended Product fields (§2 below) |
| Title & meta | 15% | Keyword placement, length, format |
| Image optimization | 20% | Alt text, format, sizing, count |
| Content quality | 20% | Unique description, specs, reviews |
| Internal linking | 10% | Breadcrumbs, related products, categories |
| Technical | 10% | Page speed, mobile rendering, canonical |

## 2. Product schema (JSON-LD)

**Required** (Google Merchant): `name`, `image`, `offers`. Use `Offer`, not `AggregateOffer`, for merchant listings.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "",
  "image": [""],
  "offers": {
    "@type": "Offer",
    "url": "",
    "priceCurrency": "USD",
    "price": "0.00",
    "availability": "https://schema.org/InStock"
  }
}
```

**Recommended** (enhance rich results): `sku`; `description`, `brand`, `offers.seller`; `gtin13`/`gtin14`/`mpn`; `aggregateRating`; `review` (minimum 1); variant attributes `color`/`material`/`size`; `shippingDetails` (a `ShippingDetails` object with rate + delivery time — merchant-level shipping via `ShippingService` is also supported, and shipping/returns can be set in Search Console without a Merchant Center account); `hasMerchantReturnPolicy` (a `MerchantReturnPolicy` with type + days); `hasAdultConsideration` — **required for adult-oriented products**, value must be `https://schema.org/SexualContentConsideration`.

**Validation rules:**
1. `price` is a bare number string ("29.99"), never `"$29.99"`.
2. `availability` uses the full `https://schema.org/...` enum.
3. `image` is an array with >= 1 high-resolution URL.
4. `priceCurrency` is ISO 4217 (USD, EUR, GBP...).
5. If `brand` is present, `brand.name` is non-empty and not "N/A".
6. `priceValidUntil` (if present) is ISO 8601.
7. If `aggregateRating` is present, both `ratingValue` and `reviewCount` are required.

**Completeness scoring:** all required fields = 50/100; + `aggregateRating` = 65/100; + `sku`/`gtin`/`mpn` = 75/100; + `shippingDetails` = 85/100; + `hasMerchantReturnPolicy` = 90/100; + 3+ reviews = 100/100.

Delegate JSON-LD generation itself and cross-type validation to [[seo-schema]]; this skill supplies the Product-specific field list and the score above.

## 3. Marketplace intelligence — Google Shopping & Amazon

Live pricing/seller data needs a paid provider. Use a preference ladder, same as the rest of the marketing kit (see [[seo-writing]] `references/research-tools.md`): **DataForSEO Merchant API (via MCP, `/ck:use-mcp`) → manual `WebSearch`/`WebFetch` spot-check of the Shopping tab or Amazon listing → skip and label `[marketplace data unverified]`.** Never fabricate a price, rating, or seller name to fill the gap. Cost/quota guardrails for DataForSEO itself are a [[seo-dataforseo]] concern — check budget approval before a paid call.

When a provider is available, produce:

**Pricing intelligence** — price distribution (min, max, median, P25, P75); outliers (> 2 std. dev. from median); price-to-rating correlation; currency normalized to USD or the user's currency.

**Seller landscape** — top 10 sellers by listing count; merchant rating distribution; free-shipping prevalence; new vs. established sellers.

**Product listing quality** — title keyword patterns in top listings; average rating/review-count benchmarks; image count per listing; availability status distribution.

Amazon results additionally carry `asin`, `is_prime`, `is_best_seller`. Full endpoint/field reference (for when a DataForSEO Merchant API MCP is wired up): `references/marketplace-endpoints.md`.

**Cross-marketplace report:**

| Metric | Google Shopping | Amazon |
|---|---|---|
| Avg price | $ | $ |
| Median rating | X.X | X.X |
| Avg review count | N | N |
| Top seller share | % | % |
| Free shipping % | % | % |

## 4. Marketplace keyword gaps

Cross-reference organic visibility against Shopping/marketplace visibility for the same keyword set:

1. Organic rankings for the domain (via [[seo-dataforseo]] MCP, or a `site:domain` + keyword `WebSearch` spot-check).
2. Shopping/marketplace presence for the same top organic keywords (§3 above).
3. Cross-reference into gap types.

| Gap type | Meaning | Action |
|---|---|---|
| **Organic only** | Ranks organically, no Shopping presence | Set up a Merchant Center feed; bid on these keywords |
| **Shopping only** | Shopping visibility, weak/no organic | Write content (buying guides, comparisons) targeting these keywords |
| **Both present** | Visible in both channels | Optimize: keep price consistent across channels, enhance schema |
| **Neither** | No visibility either way | Low priority unless search volume is high |

Output as two tables: `Organic → Shopping` opportunities and `Shopping → Organic` opportunities, each with keyword / position-or-rank / volume / CPC / recommended action.

## 5. UCP — Universal Commerce Protocol

A Google-initiated open standard (co-developed with Shopify, Etsy, Wayfair, Target, Walmart; payment partners Visa/Mastercard/Stripe/Adyen/Amex) letting AI shopping agents discover, negotiate, and transact with merchants without one-off integrations. Google has a confirmed first reference implementation for conversational buying in AI Mode in Search; broader "Universal Cart" rollout claims trace to keynote coverage, not a Google-owned source — treat those as hedged. UCP uses **date-based versioning** (`YYYY-MM-DD`, e.g. `2026-04-08`), not semver — a literal `"version": "1.0"` is invalid. Two integration paths: **Native checkout** (default, full agentic potential) and **Embedded checkout** (iframe-based, Google-approved merchants only). Pairs with **AP2** (Agent Payments Protocol) for cryptographic proof of user consent. Merchants stay Merchant of Record under UCP.

A merchant already on Google Merchant Center with clean Product schema can declare a UCP profile at `/.well-known/ucp` in a sprint. Full spec context, capability examples, and the AP2 relationship: `references/ucp-universal-commerce-protocol.md`.

**Audit procedure** (`WebFetch` the profile, no dedicated tool needed):
1. **Presence** — does `/.well-known/ucp` resolve to valid JSON? Missing profile is an *opportunity*, not a failure.
2. **Capability coverage** — which capabilities are declared (`dev.ucp.shopping.checkout`, `.fulfillment`, `.discount`, `.cart`)? Flag missing ones as opportunities.
3. **Endpoint reachability** — are declared endpoints HTTPS with valid TLS, not 5xx? A plain `WebFetch` against each declared endpoint is enough to catch dead links; full negotiation testing is out of scope.
4. **Version coherence** — is `version` a valid date (`YYYY-MM-DD`)? Flag a literal `"1.0"` or any non-date string as invalid.
5. **Integration path** — does the profile imply Native or Embedded checkout?

**Audit posture by tier:**

| Tier | Guidance |
|---|---|
| E-commerce site already on Merchant Center | Recommend declaring a UCP profile as a forward-looking opportunity |
| DTC site not on Merchant Center | Don't recommend UCP yet — Merchant Center is the prerequisite |
| Informational / B2B site | Ignore UCP — except hospitality/restaurant sites: UCP is expanding into Lodging and Food (hotel booking in AI Mode, food delivery via Google Maps) |

Never score the absence of a UCP profile as a critical failure — the protocol itself is live, but broad merchant adoption is still early.

## Key concepts

- **Merchant Center vs. on-page schema** — Product schema on the page and a Merchant Center feed are two different surfaces carrying overlapping data; this skill audits the page, not the feed (feed validation is a Merchant Center / Merchant API concern, not this skill's).
- **Preference ladder for marketplace data** — MCP/paid provider first, `WebSearch`/`WebFetch` spot-check second, honest `[unverified]` label last. Never invent a price, rating, or seller.
- **Keyword-channel gap** — a keyword can rank organically, appear in Shopping, both, or neither; each combination implies a different next action (§4).
- **UCP is a discovery/negotiation layer, not a payment processor** — it sits next to Merchant Center feeds and Google Business Profile as a third agent-era discovery surface; it doesn't replace either.

## Output

- `plans/marketing/<campaign>/seo-ecommerce.md` — the e-commerce SEO report: overall score, product-page sub-scores, schema completeness, marketplace intelligence (if a provider was available, else labeled unverified), UCP audit, and ranked recommendations.
- Inline recommendations in the conversation for single-page or single-keyword requests.

## Cross-references

- `plans/marketing-context.md` — required hub
- `.claude/workflows/marketing-rules.md` — content quality + truth-only rules (no fabricated prices, ratings, or reviews)
- `.claude/skills/marketing/README.md` — full kit overview
- `.claude/skills/marketing/seo/SKILL.md` — orchestrator (parent)
- [[seo-schema]] — JSON-LD generation/validation mechanics this skill's Product rules plug into
- [[seo-page]] — page-level on-page SEO for non-product pages
- [[seo-programmatic]] — category-page templates at scale, faceted nav, pagination
- [[seo-images]] — product image optimization itself
- [[seo-technical]] — site-wide crawl/index health
- [[seo-dataforseo]] — DataForSEO provider integration + cost guardrails
- [[seo-google]] — GSC indexation/Performance data for product URLs (not Merchant Center feed validation)

## Provenance

Imported from `AgriciDaniel/claude-seo` (`seo-ecommerce`, v2.2.4; original author Matej Marjanovic, Pro Hub Challenge) and adapted for ClauKit. Adaptations: dropped all `claude-seo run <script>.py` invocations and the DataForSEO cost-guardrail script calls — ClauKit ships no script runtime for this kit, so marketplace/UCP data fetches now route through the same MCP-first/`WebSearch`-`WebFetch`-fallback preference ladder used elsewhere in the kit (see [[seo-writing]] `references/research-tools.md`), and DataForSEO cost/quota concerns are pointed at [[seo-dataforseo]] instead of a bespoke script. Product-page checklist, Product schema field rules + scoring, keyword-gap framework, and UCP audit criteria are preserved substantively. Two reference files ported (`marketplace-endpoints.md`, `ucp-universal-commerce-protocol.md`) with script-invocation lines replaced by the MCP/WebFetch ladder and the `cost-tiers.md` cross-reference (not present in this port) replaced by a pointer to [[seo-dataforseo]]. For full original content see the source repo.
