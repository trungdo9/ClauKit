---
name: seo-sitemap
description: XML sitemap analysis and generation — validate an existing sitemap against Google's real rules (50k/50MB caps, lastmod accuracy, extension subtypes), or generate a new one (with index splitting) for a site being built out. Feeds the technical-SEO audit and the sitemap step of the seo-writing pipeline's publish stage.
allowed-tools: Read, Write, Glob, Grep, WebFetch, Bash
---

# SEO Sitemap — Analysis & Generation

> A sitemap doesn't get pages ranked — it gets them *seen*. Most sitemap problems aren't XML syntax errors; they're a mismatch between what the file claims (200, canonical, indexable) and what's actually true, which is a much easier way to waste a crawl budget than it looks.

## When this skill activates

**Implicit:** "sitemap", "generate sitemap", "sitemap issues", "check my XML sitemap", "why isn't my sitemap being read", "sitemap index".
**Explicit:** "Use the seo-sitemap skill to [task]."
**Routed from:** [[seo-technical]] (sitemap/robots.txt is part of its crawl-and-index check), `/mk:seo audit` (technical phase), [[seo-writing]] Stage 6 publish (a newly published article should land in the site's sitemap — see Cross-references).

## Scope

Covers:
- Analyzing an existing XML sitemap: format validity, size caps, `<lastmod>` accuracy, robots.txt linkage, crawled-vs-listed comparison.
- Extension sitemap subtypes (image / video / news) and their distinct rules.
- Generating a new sitemap (or sitemap index) for a site being built out, including safe-vs-risky programmatic-page judgment calls.
- robots.txt's `Sitemap:` directive and how it interacts with the file itself.

Does NOT cover:
- Crawl budget, render/index issues, Core Web Vitals, and general site architecture → [[seo-technical]].
- Whether a *page* belongs in the sitemap at all (noindex decisions, canonical strategy) → [[seo-technical]]; this skill only flags the mismatch once that decision exists.
- Publishing the article whose URL eventually needs to land in the sitemap → [[seo-writing]] Stage 6 (`references/stage-6-publish.md`) — that stage does not currently trigger a sitemap refresh; see Cross-references.

## Mode 1: Analyze existing sitemap

Before reporting a sitemap missing, check both places it's declared:
1. **robots.txt** — read every `Sitemap:` line (there can be more than one; each is a full absolute URL, not a relative path).
2. **Common paths** — `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` (WordPress core), `/sitemap-index.xml` — probe these even when robots.txt is silent or a declared URL 404s, since a stale robots.txt entry is common.

Only report "not found" once both the declared and common-path candidates have been checked and none resolve. A declared line that 404s is a finding ("robots.txt points at a dead sitemap"), not proof the site has none.

### Validation checks

- Valid XML format (well-formed, correct namespace).
- Per-file limit: **≤50,000 URLs AND ≤50MB uncompressed** — whichever is hit first triggers a split.
- All listed URLs return HTTP 200 (spot-check a sample on large sitemaps rather than every URL).
- `<lastmod>` is accurate: a valid **W3C Datetime**, reflecting the **last significant content change** (body content, structured data, links) — not a bump on every deploy or a copyright-year edit. Google only trusts `<lastmod>` when it's consistently and verifiably accurate; flag values that are suspiciously uniform (every URL has the identical timestamp) or newer than the page's real last edit.
- No deprecated tags: `<priority>` and `<changefreq>` are both ignored by Google — flag as informational cleanup, not a real issue.
- Sitemap is referenced in robots.txt (see robots.txt interplay below).
- Compare a crawl of the site against the sitemap's URL list; flag pages that exist but aren't listed, and listed URLs that no longer exist.

### Quality signals

- A sitemap index is used once the site exceeds 50k URLs (rather than one file silently truncating).
- Split by content type where it helps triage (pages, posts, images, videos) rather than one undifferentiated list.
- No non-canonical URLs included.
- No noindexed URLs included.
- No redirected URLs included (list the final destination, not the redirect source).
- HTTPS URLs only — no `http://` entries on an HTTPS site.

### Common issues

| Issue | Severity | Fix |
|---|---|---|
| >50k URLs in a single file | Critical | Split into a sitemap index |
| >50MB uncompressed in a single file | Critical | Split into a sitemap index |
| Non-200 URLs listed | High | Remove or fix the broken URLs |
| Noindexed URLs included | High | Remove from the sitemap |
| Redirected URLs included | Medium | Replace with the final destination URL |
| All `<lastmod>` identical | Low | Use real per-page modification dates |
| `<priority>`/`<changefreq>` present | Info | Can remove — Google ignores both |

### Extension sitemaps (image / video / news)

Google documents three subtypes, each with its own schema and rules — validate against the specific subtype, not the generic URL rules:

- **Image** (`http://www.google.com/schemas/sitemap-image/1.1`): only `<image:image>` and `<image:loc>` remain valid, max **1,000** `<image:image>` entries per `<url>`. `<image:caption>`, `<image:geo_location>`, `<image:title>`, and `<image:license>` were deprecated — flag any present as info-level removable clutter.
- **Video**: each `<video:video>` requires `<video:thumbnail_loc>`, `<video:title>`, `<video:description>`, plus either `<video:content_loc>` or `<video:player_loc>` (mRSS is also accepted). Flag deprecated/removed sub-tags (`<video:category>`, `<video:gallery_loc>`, `<video:price>`, `<video:tvshow>`, autoplay/allow_embed player params) as info-level removable — reconfirm against current Google docs before citing an exact removal date, since this area changes.
- **News**: hard cap of **1,000** `<news:news>` entries per file (not the generic 50,000), and only articles from the **last 2 days** belong in it — older articles should be pruned, not left to accumulate. Requires `<news:publication>`/`<news:name>`, `<news:language>`, `<news:publication_date>`, `<news:title>`. Discovery is through Search Console or a robots.txt/sitemap-index reference, same as any other sitemap. When the `news:` namespace is present, apply the 1,000-item cap instead of the generic 50k check.

## Mode 2: Generate a new sitemap

### Process

1. Confirm business type (or infer it from the existing site) — it shapes what URL patterns to expect (products vs. locations vs. articles).
2. Plan the structure interactively with the user: which sections exist, roughly how many URLs each contributes, whether any of them are programmatic (see the safe/risky split below).
3. Apply the location-page scale gate before including any city/location pages: **warn** at 30+ location pages (require 60%+ unique content per page to justify them) and **hard-stop** at 50+ (require explicit user justification — this is the doorway-page range [[seo-technical]] flags in audits).
4. Generate valid XML output.
5. Split at whichever limit hits first — 50,000 URLs or 50MB uncompressed — into a sitemap index once either is exceeded.
6. Write a short structure summary alongside the XML (see Output) so the URL organization is reviewable, not just the raw file.

### Safe programmatic pages (scale these without much worry)

- Integration pages, when each has real setup documentation.
- Template/tool pages, when each has genuinely downloadable or usable content.
- Glossary pages, when each definition runs 200+ words.
- Product pages, when specs/reviews are genuinely unique per product.
- User-profile pages, when the content is real user-generated content.

### Penalty risk (do not scale these into a sitemap without review)

- Location pages where only the city name changes.
- "Best [tool] for [industry]" pages with no industry-specific value.
- "[Competitor] alternative" pages with no real comparison data.
- AI-generated pages with no human review or unique value added.

Including thin pages like these in a sitemap doesn't just risk a ranking penalty on those pages — it invites Google to crawl them more, spending budget that would otherwise go to pages worth indexing.

## Sitemap format

### Standard sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2026-08-25</lastmod>
  </url>
</urlset>
```

### Sitemap index (for >50k URLs, or for organizing by content type)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-08-25</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2026-08-25</lastmod>
  </sitemap>
</sitemapindex>
```

## robots.txt interplay

- A sitemap is declared in robots.txt with a full absolute URL: `Sitemap: https://example.com/sitemap.xml` — never a relative path.
- robots.txt can declare more than one `Sitemap:` line (e.g. one per content type, or one being the sitemap index that fans out to the rest) — read all of them, not just the first match.
- The `Sitemap:` directive is independent of the `Allow`/`Disallow` rules in the same file — a URL can be listed in the sitemap and still be blocked from crawling by a `Disallow` rule elsewhere in robots.txt. That combination is a real finding (the sitemap is advertising a URL the crawler is told not to fetch), not a false positive.
- Search Console's Sitemaps report is the other legitimate way to point Google at a sitemap and doesn't require a robots.txt entry — a site can submit there directly. Prefer having both: robots.txt for any crawler, GSC submission for indexing status and error visibility specific to Google.

## Error handling

- **URL unreachable**: report the HTTP status code and suggest checking whether the site itself is live.
- **No sitemap found**: only after both the robots.txt-declared and common-path candidates have been checked and none resolve — report "not found," not "likely missing."
- **Invalid XML**: report the specific parsing error with a line number where possible, not just "malformed."
- **Rate limiting encountered while crawling for comparison**: back off, report partial results, and note that the comparison is incomplete rather than presenting it as final.

## Key concepts

- **Crawl budget** — the sitemap is a request, not a command; a bloated or inaccurate sitemap spends budget on pages that don't matter and doesn't guarantee the pages that do get crawled sooner.
- **`<lastmod>` trust** — Google only uses `<lastmod>` as a recrawl signal when it's verifiably accurate across the file; a sitemap that lies about freshness (or is uniformly identical) gets the tag ignored entirely, which is worse than not having it.
- **Sitemap index** — a sitemap of sitemaps; the mechanism for exceeding the 50k/50MB single-file caps or for organizing by content type without changing what's actually in each leaf file.
- **Doorway-page risk in a sitemap** — listing thin, swapped-variable pages doesn't just risk a per-page penalty; it's a declaration to Google that these pages are meant to be indexed, which raises their visibility to the spam classifiers described in [[seo-technical]].

## Output

### For analysis

- `plans/marketing/<site>/seo-sitemap-report.md` — validation results, issues list with severity, recommendations.

### For generation

- `sitemap.xml` (or split files plus a `sitemap-index.xml`) written to the location the user specifies.
- A short structure summary (URL count per section, index organization) in the same report file or inline in conversation.

## Cross-references

- `plans/marketing-context.md` — required hub.
- [[seo-technical]] — owns the broader crawl/index/architecture audit this skill's findings feed into; also owns the doorway-page and location-page-scaling judgment this skill applies when generating.
- [[seo-writing]] `references/stage-6-publish.md` — publishes new articles but does not currently trigger a sitemap update; most CMS/SEO-plugin setups (e.g. Yoast/RankMath on WordPress) regenerate the sitemap automatically on publish, but a custom REST target should re-run this skill's analysis mode after a publish batch to confirm new URLs actually landed in the sitemap.
- [[seo-programmatic]] — the safe-vs-penalty-risk page judgment used here in Mode 2 is the same one applied when planning programmatic pages generally.
- `.claude/workflows/marketing-rules.md` — content quality rules.
- `skills/marketing/README.md` — full kit overview.

## Provenance

Imported from `AgriciDaniel/claude-seo` (`seo-sitemap`, v2.2.4) and adapted for ClauKit. Dropped: the `claude-seo run sitemap_discovery.py --json` helper invocation — ClauKit ships no bundled Python runtime (the same drop applied across every ported seo-* skill, see the root [[seo]] skill's Provenance); the discovery method it implemented (read robots.txt `Sitemap:` lines through an SSRF-safe fetch, fall back to common paths) is preserved here as plain instructions for Claude to carry out directly. Also dropped: "load industry template from `../seo-plan/assets/`" — ClauKit's `seo-plan` skill ships no `assets/` directory, so Mode 2 plans structure interactively instead of from a template file. Output path changed from a bare `VALIDATION-REPORT.md`/`STRUCTURE.md` to `plans/marketing/<site>/seo-sitemap-report.md`, matching ClauKit's shared output convention.
