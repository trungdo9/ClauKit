---
name: seo-hreflang
description: Hreflang and international SEO — validate existing hreflang implementations (self-ref, return tags, x-default, language/region codes) and generate correct HTML/HTTP-header/sitemap implementations for multi-language and multi-region sites. Also audits cultural adaptation, content parity, locale formatting, and machine-translation quality across language versions.
allowed-tools: Read, Write, Glob, Grep
---

# SEO Hreflang — International SEO Validation & Generation

> A hreflang set with one broken return tag invalidates the whole set — Google treats it as a hint, not a directive, and a hint it can't trust it drops.

## When this skill activates

**Implicit:** "hreflang", "i18n SEO", "international SEO", "multi-language site", "multi-region site", "language tags", "x-default".
**Explicit:** "Use the seo-hreflang skill to [task]."
**Routed from:** [[seo]] orchestrator, for sites detected as multi-region/multi-language; `/mk:seo hreflang audit <directory-or-url>`.

## Scope

Covers:
- Hreflang validation: self-referencing tags, return-tag bidirectionality, x-default, language/region code correctness, canonical alignment, protocol consistency, cross-domain setups.
- Hreflang generation: HTML `<link>` tags, HTTP headers, XML sitemap entries.
- Cultural adaptation assessment (CTAs, trust signals, legal pages, foreign-brand references) per target market.
- Content parity audit across language versions (structure, SEO elements, word-count ratio, freshness).
- Locale format validation (number/date/currency/address/phone) and machine-translation QA flags.

Does NOT cover:
- Broader technical SEO (crawl budget, Core Web Vitals, site architecture unrelated to i18n) → [[seo-technical]].
- Local/regional business targeting (Google Business Profile, NAP consistency, local pack) → [[seo-local]].
- Writing the localized content itself → [[seo-content]].

## Validation checks

### 1. Self-referencing tags
Every page must include a hreflang tag pointing to itself, and that self-referencing URL must exactly match the page's canonical URL. Missing it causes Google to ignore the entire hreflang set.

### 2. Return tags
If page A links to page B with hreflang, B must link back to A — every relationship bidirectional (full mesh across all language versions). A missing return tag invalidates the signal for both pages.

### 3. x-default
Recommended whenever a selector/fallback URL exists: designates the fallback page for unmatched languages/regions (typically the language selector or English version). Only one `x-default` per alternate set, and it needs return tags from every other version too.

### 4. Language code validation
- Must use ISO 639-1 two-letter codes (`en`, `fr`, `de`, `ja`).
- An optional ISO 15924 script subtag is the documented mechanism for script: `zh-Hant` (Traditional) / `zh-Hans` (Simplified). Script can combine with region — `zh-Hans-US` is valid.
- Common errors: `eng` (ISO 639-2, invalid) instead of `en`; `jp` instead of `ja`; bare `zh` is valid but ambiguous for script-specific pages — prefer `zh-Hans`/`zh-Hant`.

### 5. Region code validation
- Optional region qualifier uses ISO 3166-1 Alpha-2 (`en-US`, `en-GB`, `pt-BR`), format `language-REGION` (lowercase-UPPERCASE).
- A country code alone is invalid — no region without a language. Google's own bad example, `be`, is actually the Belarusian *language* code, not Belgium.
- Common errors: `en-uk` instead of `en-GB` (UK isn't a valid ISO 3166-1 region); `EU`/`UN` as a region (not valid values); `es-LA` (Latin America isn't a country — use specific countries); region without a language prefix.

### 5b. Geo-targeting signal hierarchy
Practical locale-signal heuristic (not a confirmed ranking order): **ccTLD > hreflang annotations > server location/IP > addresses/language/currency/Business Profile**. hreflang is a hint, not a directive. Google ignores locational meta tags and HTML geotargeting attributes. Search Console's International Targeting report and manual country-targeting setting were removed in 2022 — don't recommend GSC country targeting; hreflang is the remaining lever.

### 6. Canonical URL alignment
Hreflang tags must only appear on canonical URLs. If a page's `rel=canonical` points elsewhere, hreflang on that page is ignored. The canonical and hreflang URLs must match exactly, including trailing slashes.

### 7. Protocol consistency
All URLs in a hreflang set must use the same protocol. Mixed HTTP/HTTPS breaks validation — after an HTTPS migration, update every hreflang tag.

### 8. Cross-domain support
Hreflang works across domains (`example.com` + `example.de`) provided return tags exist on both sides. Sitemap-based implementation is recommended for cross-domain setups; use GSC verification or cross-site sitemap submission for monitoring.

## Common mistakes

| Issue | Severity | Fix |
|---|---|---|
| Missing self-referencing tag | Critical | Add hreflang pointing to same page URL |
| Missing return tags (A→B but no B→A) | Critical | Add matching return tags on all alternates |
| Missing x-default when fallback behavior is required | Medium | Add x-default pointing to fallback/selector page |
| Invalid language code (e.g. `eng`) | High | Use ISO 639-1 two-letter codes |
| Invalid region code (e.g. `en-uk`) | High | Use ISO 3166-1 Alpha-2 codes |
| Hreflang on non-canonical URL | High | Move hreflang to canonical URL only |
| HTTP/HTTPS mismatch in URLs | Medium | Standardize all URLs to HTTPS |
| Trailing slash inconsistency | Medium | Match canonical URL format exactly |
| Hreflang in both HTML and sitemap | Low | Choose one method (sitemap preferred at scale) |
| Language without region when needed | Low | Add region qualifier for geo-targeted content |

## Implementation methods

| Method | Best for | Pros | Cons |
|---|---|---|---|
| HTML `<link>` tags | <50 variants per page | Easy, visible in source | Bloats `<head>`, hard to maintain at scale |
| HTTP headers | Non-HTML files (PDFs, docs) | Works where there's no `<head>` | Complex server config, invisible in HTML |
| XML sitemap | Large sites, cross-domain, 50+ pages | Scalable, centralized | Not visible on-page, needs sitemap upkeep |

HTML:
```html
<link rel="alternate" hreflang="en-US" href="https://example.com/page" />
<link rel="alternate" hreflang="en-GB" href="https://example.co.uk/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

HTTP header:
```
Link: <https://example.com/page>; rel="alternate"; hreflang="en-US",
      <https://example.com/fr/page>; rel="alternate"; hreflang="fr",
      <https://example.com/page>; rel="alternate"; hreflang="x-default"
```

XML sitemap (see below for the full rules): use the `xhtml:link` entries inside each `<url>`.

## Hreflang generation process

1. **Detect languages** — scan for URL path, subdomain, TLD, and `<html lang>` signals.
2. **Map page equivalents** — match corresponding pages across languages/regions.
3. **Validate codes** — check every code against ISO 639-1 and ISO 3166-1.
4. **Generate tags** — for each page, including the self-reference.
5. **Verify return tags** — confirm every relationship is bidirectional.
6. **Add x-default** — set the fallback for each page set.
7. **Output** — HTML, HTTP header, or sitemap XML per the chosen method.

## Hreflang sitemap generation

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/page</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/page" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/page" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/page" />
  </url>
  <url>
    <loc>https://example.com/fr/page</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/page" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/page" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/page" />
  </url>
</urlset>
```

Rules: include the `xmlns:xhtml` namespace; every `<url>` entry carries ALL alternates including itself; each alternate is a separate `<url>` entry with its own full set; split at whichever comes first — 50,000 URLs or 50MB uncompressed per sitemap file.

## Cultural adaptation assessment

Beyond technical validation, assess whether content is culturally adapted per target market. Load `references/cultural-profiles.md` for pre-built profiles (DACH, Francophone, Hispanic, Japanese, plus a Default Profile checklist for unlisted locales).

Steps: identify all language versions and target markets → load the relevant profile(s) → check CTAs match cultural expectations (direct vs. indirect) → check trust signals are locale-appropriate (certifications, legal pages) → check for foreign-brand references on localized pages → check number/date/currency consistency → flag adaptation gaps as Medium severity. Output a Cultural Adaptation Score (0–100) per language version with specific findings.

## Content parity audit

Load `references/content-parity.md` for the full parity matrix and scoring methodology.

Checks: page existence across all declared languages; section-structure equivalence (H2/H3 count); SEO element parity (title, meta, schema localization); word-count ratio validation (DE should run 25–35% longer than EN, JA 10–25% shorter); freshness tracking via timestamps; cultural-marker scanning (foreign brands, wrong legal references, untranslated elements). Output: a parity matrix table with per-page scores and prioritized action items.

## Locale format validation

Load `references/locale-formats.md` for number, date, currency, address, and phone tables per locale.

Checks: number-format consistency (e.g. `1,000.00` should read `1.000,00` on de-DE pages); date format matches locale expectations; currency symbols and placement correct for the target market; phone numbers in international format with the right country code.

## Machine-translation QA flag

Load `references/machine-translation-qa.md` before flagging any translated page. Google's Quality Rater Guidelines treat **unreviewed** machine translation as scaled content abuse (§4.6.5) — the enforceable spam policy names "translating" among the automated transformations it targets. MT is fine when a human speaker reviewed and corrected it; untranslated or lightly post-edited MT (hallucinated terms, wrong agreement, untranslated proper nouns) is not. Surface signals like identical-except-chrome alternates, `lang` mismatching body content, and untrimmed auto-translated meta descriptions — see the reference for the full signal table and what NOT to flag (honestly-labelled MT fallback pages, i18n UI strings).

## Validation report format

### Hreflang validation report

Summary: pages scanned, language variants detected, issues found (Critical/High/Medium/Low).

| Language | URL | Self-Ref | Return Tags | x-default | Status |
|---|---|---|---|---|---|
| en-US | https://... | done | done | done | pass |
| fr | https://... | missing | partial | done | fail |
| de | https://... | done | missing | done | fail |

Plus: generated hreflang tags (HTML/header/sitemap, per chosen method) and recommendations (missing implementations, code fixes, method-migration suggestions).

Written to `plans/marketing/<campaign>/seo-hreflang.md`.

## Key concepts

- **Hint, not directive** — hreflang tells Google your intent; it does not override ccTLD, server location, or content signals. A broken set is simply ignored, not penalized.
- **Full mesh** — every language version in a set must reference every other version, including itself. One missing edge breaks the whole set for everyone in it.
- **Word expansion/contraction** — Germanic/Romance languages run longer than English, CJK languages run shorter; content parity checks must expect this, not flag it as a gap.

## Output

- `plans/marketing/<campaign>/seo-hreflang.md` — validation report, generated tags, parity/cultural findings.
- Inline recommendations in the conversation.

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo]] — orchestrator; routes multi-region/multi-language sites here
- [[seo-technical]] — broader technical SEO (crawl, CWV, architecture)
- [[seo-local]] — local/regional business targeting (GBP, NAP, local pack)
- [[seo-content]] — writes the localized content this skill validates
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. Validation checks, implementation methods, cultural-profile/content-parity/locale-format/machine-translation-QA references preserved from source; output path retargeted to `plans/marketing/<campaign>/`.
