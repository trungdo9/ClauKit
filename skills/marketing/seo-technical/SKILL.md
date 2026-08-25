---
name: seo-technical
description: Technical SEO audit across 9 categories — crawlability, indexability, security, URL structure, mobile/page experience, Core Web Vitals, structured-data detection, JavaScript rendering, and IndexNow. Also covers agent-friendly-page auditing (accessibility tree, agentic browsing). Use for "technical SEO", "crawl issues", "robots.txt", "Core Web Vitals", "site speed", "security headers", or an existing-site inventory before a writing campaign.
allowed-tools: Read, Write, Glob, Grep, WebFetch
---

# SEO Technical — Crawlability, Indexability & Site Health

> Content can't rank on a site that can't be crawled, indexed, or rendered fast — this skill finds the plumbing problems before anyone worries about prose.

## When this skill activates

**Implicit:** "technical SEO", "crawl issues", "robots.txt", "Core Web Vitals", "site speed", "security headers", "is my site indexable", "why isn't Google indexing this page".
**Explicit:** "Use the seo-technical skill to [task]."
**Routed from:** the [[seo-technical]] agent (owns Phase 1 — inventory + technical audit — of the [[seo-writing]] existing-site playbook), [[seo-audit]]'s specialist fan-out (always-included category), `/mk:seo audit`.

## Scope

Covers:
- Crawlability — robots.txt, sitemap discovery, noindex intent, crawl depth/budget, Googlebot fetch limits, AI-crawler access management.
- Indexability — canonicals, duplicate/thin content, pagination, index bloat.
- Security — HTTPS, security headers, HSTS preload, back-button hijacking.
- URL structure — clean paths, hierarchy, redirect chains, length.
- Mobile & page experience — responsive design, mobile/desktop content parity, intrusive interstitials.
- Core Web Vitals — LCP, INP, CLS, and the role image weight/format plays in LCP.
- Structured-data **detection** (present/absent, gross validity) — not deep generation.
- JavaScript rendering — CSR vs SSR, canonical/noindex/status-code pitfalls when JS injects SEO elements.
- IndexNow protocol for non-Google engines.
- Agent-friendly pages — accessibility-tree quality, Lighthouse Agentic Browsing category, WebMCP status.

Does NOT cover:
- **[[seo-audit]]** — the whole-site orchestrator. It crawls the site, detects business type, fans out to up to 15 specialists (this skill is one, always included), aggregates the weighted 0-100 SEO Health Score, and writes the prioritized action plan. seo-technical does not orchestrate or score across categories other than its own nine — seo-audit calls into it for the crawl/index/security/CWV/mobile/JS depth rather than duplicating it. Rule of thumb: **seo-audit is holistic and cross-category; seo-technical is the crawl/index/CWV/architecture specialist it delegates to.**
- **[[seo-sitemap]]** — building, fixing, and submitting the sitemap file itself. seo-technical only checks that a valid sitemap *exists, is discoverable, and is correctly referenced* as part of crawlability; sitemap structure/quality-gate depth is seo-sitemap's job.
- **[[seo-hreflang]]** — hreflang implementation, x-default, cultural adaptation, locale formatting for multi-language/multi-region sites.
- **[[seo-images]]** — image *content* SEO (alt text, descriptive filenames, placeholder resolution) — an authoring concern. seo-technical only cares about image *performance* (format/size/lazy-load and its effect on LCP).
- **[[seo-schema]]** — deep structured-data validation and JSON-LD generation. seo-technical only flags detection-level presence/absence.
- **[[wordpress-rest]]** — the inventory-pull API mechanics for existing WordPress sites. The seo-technical *agent* uses it to build the post inventory; this skill supplies the audit criteria the agent applies, not the API client.

## 1. Crawlability

- **robots.txt** — exists, syntactically valid, not blocking important resources (CSS/JS needed for rendering, or whole sections accidentally).
- **XML sitemap** — discoverable (referenced in robots.txt or at a conventional path), returns a valid entry; report stale or unsafe robots.txt declarations separately from working fallback locations.
- **Noindex tags** — distinguish intentional (thank-you pages, filters) from accidental (a template-wide noindex left on).
- **Crawl depth** — important pages reachable within 3 clicks of the homepage.
- **JavaScript rendering** — flag when critical content requires JS execution to appear (see §8).
- **Crawl budget** — for large sites (>10k pages), crawl efficiency matters; low-value pages (faceted-nav duplicates, thin tag pages) compete with real content for crawl attention.
- **Googlebot fetch limits** — Googlebot fetches the first **2MB of HTML** and the first **64MB of a PDF** (uncompressed; 15MB is the broader crawler-infra default). Inline base64 images, oversized inline CSS/JS, or bloated nav markup can push critical content or JSON-LD past the 2MB cap and out of the index — keep key content and structured data within the first 2MB of the response.
- **Crawl rate auto-adjusts** (backs off on 5xx responses or slow pages); there is no manual crawl-rate control (the legacy Search Console setting was removed). Influence crawl behavior via sitemaps, server responsiveness, and robots directives instead.

### AI crawler management

AI companies crawl the web to train models and power AI search. Managing them via robots.txt is now a standard technical-SEO line item.

| Crawler | Company | robots.txt token | Purpose |
|---|---|---|---|
| GPTBot | OpenAI | `GPTBot` | Model training |
| ChatGPT-User | OpenAI | `ChatGPT-User` | Real-time browsing |
| ClaudeBot | Anthropic | `ClaudeBot` | Model training |
| PerplexityBot | Perplexity | `PerplexityBot` | Search index + training |
| Bytespider | ByteDance | `Bytespider` | Model training |
| Google-Extended | Google | `Google-Extended` | Gemini training (NOT search) |
| CCBot | Common Crawl | `CCBot` | Open dataset |

Key distinctions:
- Blocking `Google-Extended` stops Gemini-training use but does **not** affect Google Search indexing or AI Overviews (those use `Googlebot`).
- Blocking `GPTBot` stops OpenAI training but does **not** stop ChatGPT from citing content it browses live (`ChatGPT-User`).
- Weigh AI-visibility strategy before blocking — being cited drives brand awareness and referral traffic. Cross-reference [[seo-geo]] for the full AI crawler/fetcher taxonomy.
- **User-triggered fetchers ignore robots.txt by design.** Google documents `Google-Agent` (agentic browsing), `Google-NotebookLM`, and `Google Messages` as user-triggered fetchers that cannot be blocked via robots.txt — use server-side access control instead. `Google-Extended` and `Google-CloudVertexBot` do obey robots.txt.

## 2. Indexability

- **Canonical tags** — self-referencing by default, no conflicts with a noindex tag on the same page.
- **Duplicate content** — near-duplicates, parameter URLs (`?sort=`, `?utm_`), www vs non-www, trailing-slash variants.
- **Thin content** — pages below a sane minimum word count for their page type.
- **Pagination** — a coherent `rel=next/prev` or load-more pattern, not orphaned page-2+ URLs.
- **Hreflang** — flag if present but malformed; full validation is [[seo-hreflang]]'s job.
- **Index bloat** — low-value pages (internal search results, empty tag/category pages) consuming crawl budget without earning traffic.

## 3. Security

- **HTTPS** — enforced site-wide, valid certificate, no mixed content (HTTP resources on an HTTPS page).
- **Security headers** — `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- **HSTS preload** — check preload-list inclusion for high-security sites.
- **Back-button hijacking** — a spam-policy violation (Google's malicious-practices policy, enforced since 2026-06-15 with manual actions + automated demotions): flag pages that defeat the Back button via `history.pushState`/`replaceState`, including scripts injected by third-party ad or library platforms. Treat as **Critical**.

## 4. URL structure

- Clean, descriptive, hyphenated URLs — no query parameters standing in for content.
- Logical folder hierarchy reflecting site architecture.
- Redirects — no chains (max 1 hop), 301 for permanent moves.
- Flag URLs over ~100 characters.
- Consistent trailing-slash usage.

## 5. Mobile optimization & page experience

- Responsive design — viewport meta tag, responsive CSS, no horizontal scroll.
- Touch targets — minimum 48×48px with 8px spacing; base font size minimum 16px.
- **Mobile-first indexing** — Googlebot Smartphone is the primary crawler. A mobile version is not strictly *required* (Google: "very strongly recommended"); a site that doesn't work well on mobile can still be indexed. The real risk is **content/parity loss**, not hard exclusion from the index.
- **Mobile/desktop content parity** (the highest-value mobile check) — equivalent primary content, matching robots meta tags, matching titles/descriptions, equivalent structured data, crawlable resources on both. Avoid lazy-loading primary content behind a user-interaction gate.
- **Intrusive interstitials / ad density** — flag full-page interstitials, standalone consent-redirect pages, persistent blocking dialogs, and distracting ad density. Small banners and standard CMS/legal dialogs are acceptable.
- **"Read more" deep links** — keep key content visible on load (not behind tabs/accordions on first paint), don't hijack scroll on load, preserve URL hash fragments. Content hidden behind expandable sections is less likely to qualify as primary content.
- **Page experience is guidance, not a single ranking system.** Only **Core Web Vitals** feeds ranking directly; **HTTPS** is a confirmed but lightweight signal (affects roughly <1% of queries). Relevance can still win over a page-experience deficit — don't over-weight security headers relative to content quality. The standalone Page Experience report was removed from Search Console; monitor via the Core Web Vitals and HTTPS reports instead.

## 6. Core Web Vitals

- **LCP** (Largest Contentful Paint) — target ≤2.5s. Image weight and format are usually the biggest lever here: oversized hero images, missing responsive `srcset`, and non-lazy-loaded below-fold images all inflate LCP. This is the technical-performance side of images — contrast with [[seo-images]]'s content side (alt text, filenames, placement).
- **INP** (Interaction to Next Paint) — target ≤200ms. INP replaced FID on 2024-03-12; FID was removed from Chrome's field-data tools (CrUX API, PageSpeed Insights) on 2024-09-09. Do not report FID anywhere — it no longer exists as a metric.
- **CLS** (Cumulative Layout Shift) — target ≤0.1. Reserve space for images/ads/embeds and avoid injecting content above already-rendered content.
- Evaluation uses the 75th percentile of real-user (field) data, not a single lab run — report both when available and flag the gap between them.

## 7. Structured data (detection only)

- Detect JSON-LD (preferred), Microdata, or RDFa presence.
- Flag gross validity issues (malformed JSON, missing required `@type`).
- Route anything past presence/absence — full validation, rich-results eligibility, generation — to [[seo-schema]].

## 8. JavaScript rendering

- Check whether critical content is present in the initial HTML response or requires JS execution to appear.
- Identify client-side rendered (CSR) vs server-side rendered (SSR) pages; flag SPA frameworks (React, Vue, Angular) that risk indexing gaps.
- Verify a dynamic-rendering setup if one is claimed.

**JavaScript SEO — canonical & indexing pitfalls:**
1. **Canonical conflicts** — if the raw-HTML canonical differs from one injected by JS, Google may use either one. Keep them identical between server-rendered HTML and JS-rendered output.
2. **noindex with JavaScript** — if raw HTML carries `<meta name="robots" content="noindex">` but JS removes it, Google may still honor the raw-HTML noindex. Serve the correct robots directive in the initial HTML.
3. **Non-200 status codes** — Google does not render JavaScript on pages returning a non-200 status. Any content or meta tags injected via JS on an error page are invisible to Googlebot.
4. **Structured data via JS** — Product/Article/etc. structured data injected client-side can face delayed processing. For time-sensitive markup (especially e-commerce Product schema), ship it in the initial server-rendered HTML.

Best practice: serve canonical, meta robots, structured data, title, and meta description in the initial server-rendered HTML rather than relying on JS injection.

## 9. IndexNow protocol

- Check whether the site supports IndexNow (Bing, Yandex, Naver — not Google).
- Recommend implementation for faster indexing on non-Google engines, especially for sites publishing frequently.

## Agent-friendly pages & agentic browsing

AI agents — not just AI summarizers — increasingly act on a page through three channels: a vision model reading screenshots, raw HTML/DOM parsing, and the **accessibility tree** (the cleanest signal of the three; if it's broken, visual polish doesn't compensate). Audit for: real semantic elements (`<button>`/`<a>`, not `<div onclick>`), label associations on form inputs, interactive-target sizing, layout stability across templates, correct `cursor: pointer` usage, and stable/meaningful selectors. Full checklist, the Lighthouse **Agentic Browsing** category (default-on since Lighthouse 13.3.0 — reports a fractional pass-ratio, not a 0-100 score, kept distinct from this skill's own category scores), and current WebMCP status: `references/agent-friendly-pages.md`.

Surface agent-UX findings as **opportunities**, not failures — don't gate an audit on imperfect agentic-browsing results, and don't treat absent WebMCP support as a defect.

## Key concepts

- **Crawlability vs indexability** — crawlability is "can a bot reach and read the page"; indexability is "should this specific URL be in the index." A page can be perfectly crawlable and still excluded on purpose (noindex, canonical elsewhere).
- **Field data vs lab data** — Core Web Vitals field data (CrUX, real users, 75th percentile) is what ranks; lab data (Lighthouse) is a diagnostic proxy for it, not a substitute.
- **Page experience is a modifier, not the whole signal** — only CWV feeds ranking directly; relevance still wins over a page-experience deficit.
- **The accessibility tree** — the browser's semantic distillation of a page (roles, names, states); the cleanest signal for both assistive tech and AI agents reading a site.

## Output

- `plans/marketing/<site>/seo-technical-report.md` — category scorecard (pass/warn/fail per the 9 categories above) + Critical/High/Medium/Low findings, each stated with its verification signal ("how would we know this is fixed?").
- `plans/marketing/<site>/inventory.md` — existing-site triage (when run as [[seo-writing]] Phase 1): per-post `keep`/`improve`/`merge`/`rewrite`/`leave` tags feeding the writer's gap list.
- Inline recommendations in the conversation when run standalone (not as part of a persisted campaign).

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo-audit]] — the orchestrator this skill is a specialist under; draws the boundary above
- [[seo-writing]] — Phase 1 (inventory + technical audit) of the existing-site playbook consumes this skill's output
- [[seo-sitemap]] — sitemap generation/validation/submission depth
- [[seo-hreflang]] — international SEO / hreflang depth
- [[seo-images]] — image content SEO (alt text, filenames) vs this skill's image *performance* concern
- [[seo-schema]] — structured-data validation/generation depth
- [[seo-geo]] — full AI crawler/fetcher taxonomy and citability
- `.claude/skills/integrations/wordpress-rest/SKILL.md` — read-only inventory path used by the seo-technical agent
- `.claude/workflows/marketing-rules.md` — content quality rules
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-technical/`, v2.2.4) and adapted for ClauKit: ClauKit frontmatter, scoped to the marketing kit namespace (`/mk:`), output paths moved under `plans/marketing/<site>/`, `claude-seo run <script>.py` tool invocations removed (no such CLI is ported into ClauKit — checks are stated as audit criteria for the agent/skill to apply via its own tools, e.g. WebFetch). The DataForSEO/Google-API optional-integration and generic error-handling tables from the source were dropped as duplicative of [[seo-audit]]'s own integration sections. The `references/agent-friendly-pages.md` file is ported with only the cross-reference line adjusted for ClauKit's skill-linking convention.
