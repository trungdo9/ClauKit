---
name: seo-schema
description: Detect, validate, and generate Schema.org structured data (JSON-LD preferred). Covers per-type templates (Article, FAQPage, Product, LocalBusiness, BreadcrumbList, and 15+ more), nested @graph patterns, rich-results eligibility, and the deprecated-type guardrails. Powers Stage 4 of the seo-writing pipeline and the seo-schema agent.
allowed-tools: Read, Write, Glob, Grep
---

# SEO Schema — JSON-LD Generation & Validation

> A page can say the right things and still lose the rich result to a competitor with cleaner markup — schema is the layer that tells Google (and AI crawlers) exactly what's on the page, not just what it says.

## When this skill activates

**Implicit:** "add schema markup", "generate JSON-LD", "is my structured data valid", "will this qualify for rich results", "extract the schema from this page".
**Explicit:** "Use the seo-schema skill to [task]."
**Routed from:** [[seo-writing]] Stage 4 (generates `Article` + `FAQPage` when the article has an FAQ section), the `seo-schema` agent, `/mk:seo schema`.

## Scope

Covers:
- Detecting existing structured data (JSON-LD, Microdata, RDFa) on a page.
- Generating valid JSON-LD for the active Schema.org types (Article, FAQPage, Product, LocalBusiness, BreadcrumbList, Organization, and the extended catalog in `references/templates.json`).
- Nested `@graph` patterns that tie WebPage + BreadcrumbList + Article + Person + FAQPage into one linked block.
- Validation (required properties, data types, placeholder detection, absolute URLs, ISO 8601 dates) and rich-results eligibility.
- Deprecated/retired-type guardrails — steering requests away from dead rich results toward the current replacement.

Does NOT cover:
- LocalBusiness/GBP depth (multi-location, geo-grid, review-response schema) → [[seo-local]]. This skill emits the base `LocalBusiness` template only.
- Product/Offer e-commerce depth (variant pricing, loyalty programs, adult-consideration flags, Merchant API migration) → [[seo-ecommerce]]. This skill emits the base `Product` template only.
- AI-search/GEO content structuring (entity clarity, extractable answers) → [[seo-geo]] — schema is a signal for that work, not a substitute for it.
- Writing the article content that the schema describes → [[seo-content]] / [[seo-writing]].

## Detection

When auditing an existing page:
1. Scan page source for JSON-LD: `<script type="application/ld+json">`.
2. Check for Microdata (`itemscope`, `itemprop` attributes).
3. Check for RDFa (`typeof`, `property` attributes).
4. Always recommend migrating Microdata/RDFa to JSON-LD — it's Google's stated preference and the only format this skill generates.

## Schema type status

Full status tables live in `references/schema-types.md` (active / no-rich-result / deprecated / recent additions) and `references/deprecated-types.md` (retirement dates, sources, replacement decision table). The short version:

- **Active, recommend freely:** Organization, LocalBusiness, Product, Offer, Service, Article/BlogPosting/NewsArticle, Review, AggregateRating, BreadcrumbList, WebSite, WebPage, Person, VideoObject, Event, JobPosting, Course, ProductGroup, ProfilePage, QAPage, and more — see the table.
- **No SERP rich result, keep only if useful:** **FAQPage** — Google retired FAQ rich results for all sites May 7, 2026. Flag existing FAQPage at Info (not Critical); never recommend it, or removal of it, for SERP benefit. For genuine user Q&A, use `QAPage` instead.
- **Deprecated, never recommend:** HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo, ClaimReview, VehicleListing, Book Actions, Practice Problem. If a user asks for one, explain the retirement and offer the replacement from the decision table in `references/deprecated-types.md`.
- **Special case:** Dataset is *not* discontinued — it just has no Google Search rich result, only Dataset Search. Don't claim it was killed.

## Generation workflow

1. **Identify page type** from content analysis (blog post, product page, local business, FAQ section present, event, job listing, etc.).
2. **Select the schema type(s)** — prefer the narrowest correct type (e.g. `BlogPosting` over generic `Article` for a blog, `QAPage` over `FAQPage` for genuine user Q&A).
3. **Pull the template** from the inline examples below or `references/templates.json` for less common types.
4. **Fill every bracketed placeholder** with real, verifiable page data. No real data for a field → omit the field or mark it `[NEEDS DATA]` in the surrounding report, never ship a literal `[Company Name]`.
5. **Decide single-block vs. `@graph`** — one entity → single JSON-LD block; a page with multiple related entities (WebPage + Breadcrumb + Article + Author + FAQ) → the nested `@graph` pattern below, so entities reference each other by `@id` instead of duplicating data.
6. **Validate** against the checklist before presenting output.

## Core JSON-LD templates

### Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Company Name]",
  "url": "[Website URL]",
  "logo": "[Logo URL]",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[Phone]",
    "contactType": "customer service"
  },
  "sameAs": [
    "[Facebook URL]",
    "[LinkedIn URL]",
    "[Twitter URL]"
  ]
}
```

### LocalBusiness

*(base template only — multi-location, geo-grid, and GBP-review-schema depth is [[seo-local]]'s job)*

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "image": "[Storefront/Logo Image URL]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street]",
    "addressLocality": "[City]",
    "addressRegion": "[State]",
    "postalCode": "[ZIP]",
    "addressCountry": "[Country Code, e.g. US]"
  },
  "telephone": "[Phone]",
  "priceRange": "[e.g. $$]",
  "openingHours": "Mo-Fr 09:00-17:00",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Lat]",
    "longitude": "[Long]"
  }
}
```

### Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Title, <= 110 chars]",
  "description": "[Meta/summary description]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "[Author Profile URL]"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "image": "[Featured Image URL]",
  "publisher": {
    "@type": "Organization",
    "name": "[Publisher Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[Logo URL]"
    }
  },
  "mainEntityOfPage": "[Canonical Page URL]"
}
```

### FAQPage

*(no Google SERP rich result since May 7, 2026 — emit only when the article genuinely has a Q&A section; document it, don't sell it as a ranking lever)*

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
```

### Product

*(base template only — variant/loyalty/adult-consideration/Merchant-API depth is [[seo-ecommerce]]'s job)*

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Product Description]",
  "image": "[Product Image URL]",
  "sku": "[SKU]",
  "brand": {
    "@type": "Brand",
    "name": "[Brand Name]"
  },
  "offers": {
    "@type": "Offer",
    "price": "[Price]",
    "priceCurrency": "[Currency Code, e.g. USD]",
    "availability": "https://schema.org/InStock",
    "url": "[Product Page URL]",
    "priceValidUntil": "[YYYY-MM-DD]",
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnPolicyCountry": "[Country Code — required since March 2025]"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Average Rating]",
    "reviewCount": "[Number of Reviews]"
  }
}
```

### BreadcrumbList

*(the final, current-page item conventionally has no `item` URL — it isn't a link)*

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "[Home]", "item": "[https://example.com/]" },
    { "@type": "ListItem", "position": 2, "name": "[Category Name]", "item": "[https://example.com/category/]" },
    { "@type": "ListItem", "position": 3, "name": "[Current Page Title]" }
  ]
}
```

**Extended catalog** — VideoObject, BroadcastEvent, Clip, SeekToAction, SoftwareSourceCode, ProductGroup, ProfilePage, Certification, OfferShippingDetails, WebSite, WebPage, Person, Review, AggregateRating, Event, JobPosting, QAPage, ItemList — see `references/templates.json` for ready-to-use JSON-LD.

## Nested `@graph` pattern

For a typical blog article page, don't repeat data across separate blocks — link entities by `@id` inside one `@graph`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "[https://example.com/blog/post-slug/#webpage]",
      "url": "[https://example.com/blog/post-slug/]",
      "name": "[Page Title]",
      "isPartOf": { "@id": "[https://example.com/#website]" },
      "primaryImageOfPage": { "@id": "[https://example.com/blog/post-slug/#primaryimage]" },
      "datePublished": "[YYYY-MM-DD]",
      "dateModified": "[YYYY-MM-DD]",
      "breadcrumb": { "@id": "[https://example.com/blog/post-slug/#breadcrumb]" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "[https://example.com/blog/post-slug/#breadcrumb]",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "[https://example.com/]" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "[https://example.com/blog/]" },
        { "@type": "ListItem", "position": 3, "name": "[Post Title]" }
      ]
    },
    {
      "@type": "Article",
      "@id": "[https://example.com/blog/post-slug/#article]",
      "isPartOf": { "@id": "[https://example.com/blog/post-slug/#webpage]" },
      "headline": "[Post Title]",
      "author": { "@id": "[https://example.com/author/name/#person]" },
      "publisher": { "@id": "[https://example.com/#organization]" },
      "datePublished": "[YYYY-MM-DD]",
      "dateModified": "[YYYY-MM-DD]",
      "mainEntityOfPage": { "@id": "[https://example.com/blog/post-slug/#webpage]" },
      "image": { "@id": "[https://example.com/blog/post-slug/#primaryimage]" }
    },
    {
      "@type": "ImageObject",
      "@id": "[https://example.com/blog/post-slug/#primaryimage]",
      "url": "[Featured Image URL]",
      "contentUrl": "[Featured Image URL]"
    },
    {
      "@type": "Person",
      "@id": "[https://example.com/author/name/#person]",
      "name": "[Author Name]",
      "url": "[Author Profile URL]"
    },
    {
      "@type": "FAQPage",
      "@id": "[https://example.com/blog/post-slug/#faq]",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[Question 1]",
          "acceptedAnswer": { "@type": "Answer", "text": "[Answer 1]" }
        }
      ]
    }
  ]
}
```

Only include the `FAQPage` node in the graph when the article actually has a Q&A section (see the FAQPage caveat above). Drop unused nodes rather than emitting empty ones.

## Validation checklist

For any schema block, verify before shipping:

1. `@context` is `"https://schema.org"` (not `http`).
2. `@type` is valid and non-deprecated (check `references/deprecated-types.md`).
3. All required properties for that type are present.
4. Property values match expected data types (string vs. object vs. array).
5. No placeholder text remains (e.g. literal `"[Business Name]"`).
6. URLs are absolute, never relative.
7. Dates are ISO 8601 (`YYYY-MM-DD` or full timestamp with timezone).
8. Images have valid, absolute URLs.
9. JSON is syntactically valid — no trailing commas, all keys quoted.

## Rich-results eligibility

A generated block is only worth shipping if it can actually earn a rich result:

- **Article/BlogPosting/NewsArticle** — needs `headline`, `image`, `datePublished`, `author`; eligible for the Top Stories / article rich result.
- **Product** — needs `name`, `image`, `offers.price`, `offers.priceCurrency`, `offers.availability`; `aggregateRating` or `review` adds star ratings. Missing `returnPolicyCountry` on `MerchantReturnPolicy` blocks the merchant listing since March 2025.
- **LocalBusiness** — needs `name`, `address`; `geo` and `openingHours` strengthen local-pack eligibility (map-pack ranking itself is not schema-driven).
- **BreadcrumbList** — needs `itemListElement` with sequential `position`; renders as the breadcrumb trail under the SERP title.
- **FAQPage** — technically valid, zero SERP rich-result value since May 7, 2026. Not an eligibility question anymore — it's a "don't sell this as ranking value" question.
- **QAPage** — needs `mainEntity.acceptedAnswer` (or `suggestedAnswer`); still eligible for the Q&A rich result.
- **VideoObject** — needs `name`, `description`, `thumbnailUrl`, `uploadDate`; `duration` and `contentUrl`/`embedUrl` strengthen it.

Anything asked for from the deprecated list (HowTo, SpecialAnnouncement, ClaimReview, VehicleListing, EstimatedSalary, LearningVideo, CourseInfo carousel, Practice Problem, Book Actions) is **not eligible for any rich result** — say so plainly rather than generating dead markup.

## Key concepts

- **JSON-LD over Microdata/RDFa** — Google's stated format preference; this skill only generates JSON-LD, and recommends migrating any Microdata/RDFa found during detection.
- **`@graph` linking** — entities reference each other by `@id` instead of nesting full copies, so one Organization/Person/WebPage definition backs every page that needs it.
- **Placeholder discipline** — a bracketed field left unfilled in shipped output is a validation failure, not a formatting choice; either fill it with real data or omit the property.
- **Rich result ≠ valid schema** — a block can be perfectly valid JSON-LD and still earn nothing in the SERP (FAQPage, and everything on the deprecated list). Eligibility and validity are separate checks.
- **JS-rendered schema risk** — per Google's December 2025 JS SEO guidance, structured data injected via JavaScript can face delayed processing. For time-sensitive markup (Product, Offer especially), put the JSON-LD in the initial server-rendered HTML.

## Output

- `plans/marketing/<campaign>/seo-schema-report.md` — detection + validation results:

  | Schema | Type | Status | Issues |
  |--------|------|--------|--------|
  | ... | ... | pass / warn / fail | ... |

  plus a Recommendations section (missing schema opportunities, validation fixes, generated code).
- `generated-schema.json` (or inline in the conversation) — ready-to-use JSON-LD block(s), single or `@graph`.
- When routed from [[seo-writing]] Stage 4: the `Article` (+ `FAQPage` if applicable) block handed back to the pipeline to store alongside the article for the publish step.

## Error handling

| Scenario | Action |
|----------|--------|
| URL unreachable | Report the connection error with status code. Suggest verifying the URL and checking whether the page requires authentication. |
| No schema markup found | Report that no JSON-LD, Microdata, or RDFa was detected. Recommend schema types based on page content analysis. |
| Invalid JSON-LD syntax | Parse and report the specific syntax error (missing bracket, trailing comma, unquoted key). Provide corrected JSON-LD. |
| Deprecated schema type requested | Flag it with its retirement date (`references/deprecated-types.md`). Recommend the current replacement, or say plainly that none exists. |

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo-writing]] — Stage 4 calls this skill to generate `Article` + `FAQPage` (when applicable) for the optimized draft
- [[seo-local]] — LocalBusiness depth: multi-location, geo-grid, GBP review schema
- [[seo-ecommerce]] — Product/Offer depth: variants, loyalty pricing, adult-consideration flags, Merchant API
- [[seo-geo]] — AI-search content structuring that schema supports but doesn't replace
- [[seo-content]] — writes the content this schema describes
- `.claude/workflows/marketing-rules.md` — content quality rules
- `.claude/skills/marketing/README.md` — full kit overview
- `.claude/skills/marketing/seo/SKILL.md` — orchestrator (parent); owns the deprecated-schema guardrail as a cross-cutting quality gate

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-schema/SKILL.md` + `skills/seo/references/schema-types.md` + `skills/seo-schema/references/deprecated-types-2024-2026.md` + root `schema/templates.json`, v2.2.4) and adapted for KitForge: merged the source's inline common-templates section with its separate schema/templates.json catalog into one skill-local `references/templates.json`; added FAQPage, BreadcrumbList, QAPage, WebSite, WebPage, Person, Review, AggregateRating, Event, and JobPosting templates (standard, correctly-formed Schema.org structures per schema.org/Google documentation, not present as literal JSON in the source pack) to meet the pipeline's minimum coverage; added the nested `@graph` example; scoped LocalBusiness/Product depth out to [[seo-local]]/[[seo-ecommerce]] to avoid duplicating those skills' territory; retitled `deprecated-types-2024-2026.md` to `deprecated-types.md`. Facts and dates (retirement timelines, tooling-removal dates) carried over verbatim from source — not re-verified against Google's live docs during this port.
