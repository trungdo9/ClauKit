---
name: seo-google
description: Google's own SEO field data — PageSpeed Insights v5 + CrUX (real Chrome CWV, with 25-week history), Search Console (Search Analytics, URL Inspection, Sitemaps), Indexing API v3, GA4 organic traffic, YouTube/NLP/Knowledge-Graph/Web-Risk extras, and Ads Keyword Planner volume. Direct REST calls (curl via Bash, or WebFetch) against Google's own endpoints — bridges the gap between crawl-based analysis and what Google itself reports. Use when the user says "search console", "GSC", "PageSpeed", "CrUX", "field data", "indexing API", "GA4 organic", "URL inspection", or "real CWV data".
allowed-tools: Read, Write, Glob, Grep, Bash, WebFetch
---

# SEO Google — Field Data From Google's Own APIs

> Crawl-based analysis is an estimate of what Google sees. These APIs are what Google actually reports: real Chrome user metrics, real indexation verdicts, real search performance. All of it is free.

## When this skill activates

**Implicit:** "check Core Web Vitals field data", "pull Search Console data", "is this URL indexed", "GA4 organic traffic", "submit this URL to Google", "CrUX history for this domain".
**Explicit:** "Use the seo-google skill to [task]."
**Routed from:** [[seo]] orchestrator — conditionally, when a GSC/PSI/GA4 connection is available; [[seo-technical]] (real CWV field data to supplement Lighthouse lab scores); the `campaign`/`write` measure phase in `/mk:seo campaign`.

## Scope

Covers:
- PageSpeed Insights v5 (Lighthouse lab scores) + CrUX field data + 25-week CrUX History trends.
- Search Console: Search Analytics (clicks/impressions/CTR/position), URL Inspection (single + batch), Sitemaps, Sites.
- Indexing API v3 (JobPosting/BroadcastEvent-eligible URLs only).
- GA4 Data API v1beta — raw `runReport`/`batchRunReports` calls for organic-traffic breakdowns.
- YouTube Data API (video SEO), Cloud NLP (entity/sentiment diagnostics — not an E-E-A-T score), Knowledge Graph (brand entity check), Web Risk (malware/phishing flag check).
- Google Ads Keyword Planner (gold-standard search volume — the source DataForSEO itself resells).
- Credential setup (API key vs. service account), rate limits/quotas, and the DMA/consent-mode-v2 caveats that affect how EU GSC/GA4 numbers should be read.
- Markdown report templates for CWV audits, GSC performance, and indexation status.

Does NOT cover:
- Crawl-based technical audits (site architecture, robots/sitemap *content*, JS rendering) → [[seo-technical]]. This skill supplies the CWV *field data* that audit consumes; it doesn't crawl the site itself.
- DataForSEO-sourced SERP/backlink/keyword-difficulty data → [[seo-dataforseo]]. Google Ads Keyword Planner (this skill) is the upstream volume source; DataForSEO is a paid alternative when Ads API access isn't set up.
- Schema/JSON-LD generation → [[seo-schema]]. URL Inspection here reports which rich-result types Google *detected*; it doesn't generate the markup.
- AI-Overviews/AI-Mode citation strategy → [[seo-geo]]. This skill can pull the GSC Generative-AI performance report (impressions only) as one input to that work.

**Boundary with `mcp-gsc` / `mcp-ga4`** (`skills/automation/`): those two skills are thin MCP-tool wrappers for the single most common GSC/GA4 read (`searchAnalytics`, `sitemaps`, one-URL `inspectUrl`, `listSites`; GA4 `runReport`) with a manual-CSV-export fallback when no MCP server is configured — reach for them first when an `mcp__gsc__*`/`mcp__ga4__*` tool is already wired up and covers the ask (simpler call surface, no auth wrangling). Use **this** skill when the ask needs something they don't expose — batch URL Inspection, sitemap submission, the Generative-AI performance report, DMA/consent-mode interpretation of the numbers — or for everything outside GSC/GA4 entirely (PSI/CrUX, Indexing API, YouTube, NLP, Keyword Planner, Knowledge Graph, Web Risk). Both paths hit the same Google APIs; don't run both for the same request.

## Credential tiers

Check `~/.config/claude-seo/google-api.json` (or `GOOGLE_API_KEY` / `GOOGLE_APPLICATION_CREDENTIALS` / `GA4_PROPERTY_ID` / `GSC_PROPERTY` env vars) before running anything. Full setup walkthrough: `references/auth-setup.md`.

| Tier | Detection | Unlocks |
|---|---|---|
| **0** — API key | `api_key` present | PageSpeed, CrUX, CrUX History, YouTube, NLP, Knowledge Graph, Web Risk |
| **1** — + Service account | OAuth token or service-account JSON | + Search Console (Analytics, Inspection, Sitemaps), Indexing API |
| **2** — + GA4 property | `ga4_property_id` configured | + GA4 organic traffic reports |
| **3** — + Ads access | `ads_developer_token` + `ads_customer_id` | + Keyword Planner (ideas, volume) |

Always state the detected tier before running a command, and name which of the sections below are unavailable at the current tier.

## PageSpeed Insights + CrUX (field data)

Full endpoint/response reference: `references/pagespeed-crux-api.md`.

- **PSI v5** (`GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<url>&key=<key>`) — Lighthouse lab scores (performance/accessibility/best-practices/SEO) plus a same-call CrUX snapshot. Google is migrating field data out of PSI, so prefer CrUX directly for field data and use PSI mainly for the lab scores.
- **CrUX** (`POST https://chromeuxreport.googleapis.com/v1/records:queryRecord`, API key in `X-Goog-Api-Key` header) — 28-day p75 for LCP/INP/CLS/FCP/TTFB. `404` means insufficient Chrome traffic, not an auth error. **CLS p75 is string-encoded** (`"0.05"`) — always parse as float.
- **CrUX History** (`POST .../records:queryHistoryRecord`) — same request shape, returns up to 25 weekly collection periods as a timeseries. Updates Mondays ~04:00 UTC; watch for `"NaN"` density strings and `null` percentiles in ineligible periods.

Core Web Vitals thresholds (current as of 2026-07-09; INP replaced FID on 2024-03-12 — never reference FID):

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP | ≤ 2,500ms | 2,500–4,000ms | > 4,000ms |
| INP | ≤ 200ms | 200–500ms | > 500ms |
| CLS | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| FCP | ≤ 1,800ms | 1,800–3,000ms | > 3,000ms |
| TTFB | ≤ 800ms | 800–1,800ms | > 1,800ms |

## Search Console

Full reference (request/response shapes, filters, pagination): `references/search-console-api.md`.

- **Search Analytics** (`POST .../webmasters/v3/sites/{siteUrl}/searchAnalytics/query`) — clicks/impressions/CTR/position by query/page/country/device/date. 2–3 day lag, ~16 months of history. Query- and page-level rows can silently omit anonymized low-volume traffic, so **never sum them for a site total** — run a separate dimensionless aggregate query for that, and only present it as authoritative once it comes back complete. Detect quick wins: queries at position 4–10 with high impressions.
- **AI surfaces (2026):** the dedicated **Generative AI performance** report (impressions only, no clicks/CTR/position; Pages/Countries/Devices/Dates; 1,000-row cap) is the only clean way to see AI Overviews + AI Mode visibility — AI Mode traffic otherwise rolls into standard Web totals, so it can't be split out after the fact.
- **Data-reliability caveat:** a GSC logging bug made impressions/CTR/average-position **unreliable from 2025-05-13 to 2026-04-27** (clicks unaffected, fixed forward-only, no backfill). Flag any trend that spans that window.
- **URL Inspection** (`POST .../urlInspection/index:inspect`, single or batched from a file) — the indexation *truth*: verdict (PASS/FAIL/NEUTRAL/PARTIAL), coverage state, robots.txt state, indexing state, page-fetch state, Google-selected vs. user-declared canonical, detected rich-result types. Note that FAQPage (retired 2026-05-07) and HowTo (retired 2023) no longer produce rich results — don't expect them. Rate-limited to 2,000/day, 600/min per site.
- **Sitemaps** (`GET/PUT/DELETE .../sitemaps`) — submitted-count/error/warning status only. This reports what was *submitted*, not what's indexed — use URL Inspection for the indexation truth on specific URLs.

## Indexing API v3

Full reference: `references/indexing-api.md`.

`POST https://indexing.googleapis.com/v3/urlNotifications:publish` with `{"url": ..., "type": "URL_UPDATED"|"URL_DELETED"}` (batches of up to 100 via `multipart/mixed`). **This API is scoped to JobPosting and BroadcastEvent/VideoObject pages only** — always say so before using it on an ordinary page; a `URL_UPDATED` ping there only nudges a recrawl, no ranking benefit. For ordinary URLs: URL Inspection for a few, sitemaps for many. Quota: 200 publish/day (resets midnight Pacific), tracked per project.

## GA4 organic traffic

Full reference (dimensions, metrics, filter expressions, Python example): `references/ga4-data-api.md`.

`POST https://analyticsdata.googleapis.com/v1beta/{property=properties/*}:runReport` filtered to `sessionDefaultChannelGroup = "Organic Search"`. Useful dimensions: `landingPage`, `pagePath`, `deviceCategory`, `country`; metrics: `sessions`, `totalUsers`, `bounceRate`, `engagementRate`, `keyEvents` (replaced deprecated `conversions`). Token-budgeted, not request-counted — pass `returnPropertyQuota: true` to watch spend (25K tokens/day, 5K/hour, 10 concurrent per property).

**GA4 "AI Assistants" channel (live ~2026-05-13):** sessions from a recognized AI assistant (ChatGPT, Gemini, Claude, Deepseek, Copilot, Grok) get `medium=ai-assistant` — but it excludes Google AI Overviews/AI Mode, Perplexity needs separate verification, and most AI-referred sessions arrive referrer-less and land in Direct. Treat it as a floor on AI traffic, not the full count.

## YouTube, NLP, Knowledge Graph, Web Risk

Free, API-key-only extras. Full references: `references/youtube-api.md`, `references/nlp-api.md`, `references/supplementary-apis.md`.

| API | Use | Quota |
|---|---|---|
| YouTube Data API v3 | Video SEO — search (`search.list`, 100 units), video details + top comments (`videos.list`/`commentThreads.list`, ~1 unit each) | 10,000 units/day |
| Cloud NLP | Entity/sentiment/classification diagnostics for internal content-quality checks — **not** a Google E-E-A-T score, never present it as one | 5,000 units/month free (entities/sentiment); billing must be enabled |
| Knowledge Graph Search | Brand/entity presence check — does the site have a Knowledge Panel, is the entity disambiguated | 100,000 reads/day |
| Web Risk | Malware/social-engineering flag check — can explain a deindexing | 6,000 QPM, 100K/month free |

Some third-party GEO research reports a correlation between YouTube mentions and AI-search visibility — treat that as a methodology-dependent signal, not a Google-sourced benchmark.

## Keyword Planner (Google Ads)

Full reference: `references/keyword-planner-api.md`.

`GenerateKeywordIdeas` / `GenerateKeywordHistoricalMetrics` — the volume source DataForSEO itself resells, so this is the more direct read when Ads API access exists (developer token + customer ID, Tier 3). Without active ad spend on the account, volumes come back as bucketed ranges ("1K–10K") rather than exact numbers — say so when reporting a bucketed figure. Competition score measures *advertiser* competition, not organic ranking difficulty.

## DMA / consent-mode v2 — reading EU numbers correctly

Full note: `references/dma-consent-mode-v2.md`. The Digital Markets Act (in force since 2024-03-07) and GA4/Ads consent-mode v2 change what EU numbers mean, not what to recommend:

- **GSC:** EU CTR comparisons that straddle 2024-03-07 aren't apples-to-apples — flag it, don't silently trend it.
- **GA4:** EU organic sessions under a "denied ad_storage / granted analytics_storage" consent default are systematically under-counted (conversion modelling fills the gap; raw counts stay low). Surface the consent-mode config if the GA4 admin API exposes it.
- Do **not** lecture on cookie-consent UX (legal/engineering, out of scope) and do **not** recommend "switch to cookieless attribution" — Google abandoned third-party-cookie deprecation in 2024 and confirmed in 2025 there's no standalone Chrome cookie prompt coming. Recommend consent-mode v2 + server-side tagging for EU compliance and signal recovery instead.

## Rate limits & error handling

Consolidated table + exponential-backoff strategy: `references/rate-limits-quotas.md`.

| API | Per-minute | Per-day |
|---|---|---|
| PSI v5 | 240 | 25,000 |
| CrUX + History (shared) | 150 | unlimited |
| GSC Search Analytics | 1,200/site | 30M/project |
| GSC URL Inspection | 600/site | 2,000/site |
| Indexing API | 380 total | 200 publish |
| GA4 Data API | 10 concurrent | ~25K tokens |

| Scenario | Action |
|---|---|
| No credentials configured | Walk through `references/auth-setup.md`. List which Tier-0 (API-key-only) calls still work. |
| `403` on GSC/GA4 | Service-account `client_email` not added to the property, or wrong permission level. |
| `404` on CrUX | Insufficient Chrome traffic — not an auth error. Fall back to PSI lab data. |
| `429` | Exponential backoff (1s, 2s, 4s, 8s, 16s + jitter); honor `Retry-After` if present. |
| Indexing quota exceeded | Report the 200/day cap; prioritize the most important URLs; suggest sitemaps for the rest. |

## Reports

After analysis, offer to write a markdown report from the templates in `assets/templates/`:

| Template | Fed by |
|---|---|
| `cwv-audit-report.md` | PSI + CrUX + CrUX History |
| `gsc-performance-report.md` | Search Analytics |
| `indexation-status-report.md` | Batch URL Inspection |

Fill the `{placeholder}` fields from the API responses above; leave a field `[NEEDS DATA]` rather than inventing a number.

## Key concepts

- **Field data vs. lab data** — CrUX/PSI's `loadingExperience` block is real Chrome-user telemetry (field); Lighthouse's `lighthouseResult` is a single synthetic run (lab). Field data is the ranking signal; lab data is the diagnostic.
- **Indexation truth** — sitemaps report what was *submitted*; URL Inspection reports what Google actually *did* with it. Never infer indexation from a sitemap alone.
- **Bucketed vs. exact volume** — Keyword Planner without ad spend returns ranges, not point estimates. Report the range, don't collapse it to a fake midpoint.
- **NLP entities are a diagnostic, not a score** — Cloud NLP salience/sentiment inform internal content review; they are not Google's E-E-A-T weighting.

## Output

- Inline findings in the conversation (CWV ratings, quick-win queries, indexation verdicts).
- A markdown report from `assets/templates/` when the user wants an artifact: `plans/marketing/<site>/GOOGLE-API-REPORT-{domain}.md`.
- Raw JSON saved alongside a report when the user needs it for a later `/mk:seo campaign` measure cycle.

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo]] — orchestrator; dispatches here when a GSC/PSI/GA4 connection is available
- [[seo-technical]] — consumes CrUX field data to supplement its Lighthouse lab audit
- [[seo-dataforseo]] — paid alternative for SERP/backlink/volume data when Ads API access isn't set up
- [[seo-geo]] — consumes the GSC Generative-AI performance report for AI-citation work
- `skills/automation/mcp-gsc/SKILL.md`, `skills/automation/mcp-ga4/SKILL.md` — lighter MCP-tool wrappers for the single most common GSC/GA4 read; see the boundary note above
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. The source skill drove all calls through its own `claude-seo run <script>.py` CLI harness, which ClauKit doesn't ship — adapted here to direct REST calls (curl via Bash, or WebFetch) against the same Google endpoints, with routing to `mcp-gsc`/`mcp-ga4` noted where those wrappers already cover the ask. Endpoint shapes, quotas, and the 2026 GSC/GA4 AI-surface and DMA/consent-mode notes are preserved from source.
