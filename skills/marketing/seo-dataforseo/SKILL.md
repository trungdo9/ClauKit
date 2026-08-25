---
name: seo-dataforseo
description: DataForSEO MCP wrapper — live SERP results (Google/Bing/Yahoo/YouTube/Images), keyword volume/difficulty/intent/trends, backlink profiles, domain and competitor analytics, on-page/Lighthouse audits, business listings, and AI-visibility (LLM mention) tracking across 9 API modules. Bring-your-own MCP server; degrades to the WebSearch/WebFetch research ladder when not configured. Paid per API call — always cost-check before bulk operations.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# SEO DataForSEO — Live Search Data (MCP Wrapper)

> Every other skill in this kit reasons from static analysis or a WebSearch snapshot — this one talks to the actual DataForSEO API for real SERP positions, real search volume, real backlink counts. Bring your own MCP server; every consuming skill degrades gracefully without it.

## When this skill activates

**Implicit:** "check keyword volume", "live SERP data", "backlink profile for X", "AI visibility check", "keyword difficulty", "real search data", "dataforseo".
**Explicit:** "Use the seo-dataforseo skill to [task]."
**Routed from:** [[seo-cluster]] (keyword volume/difficulty on cluster nodes), [[seo-content]] / [[seo-content-brief]] (search intent, keyword metrics, content-quality signals), [[seo-technical]] (Lighthouse/crawl data, tech-stack detection), [[seo-plan]] (competitor domain intel, traffic estimation), [[seo-geo]] (LLM mention tracking, ChatGPT visibility), [[seo-audit]] (live SERP/backlink/on-page evidence), and the SERP/keyword research ladder in `references/research-tools.md` of [[seo-writing]] (this skill is the top rung).

## Scope

Covers:
- Live Google/Bing/Yahoo organic SERP, Google Images SERP, YouTube search + video deep-analysis
- Keyword ideas/suggestions, search volume, difficulty, intent classification, Google Trends
- Backlink profiles: summary, referring domains, anchors, spam score, timeseries
- Domain/competitor analytics: ranked keywords, competitor discovery, traffic estimation, domain intersection, subdomains, top searches
- On-page technical data: instant-page checks, content parsing, Lighthouse audit, tech-stack detection, WHOIS
- Content analysis (quality, sentiment, phrase trends) and local business listings
- AI visibility / GEO: ChatGPT web-search scraping, cross-platform LLM mention tracking
- Per-call cost awareness for the underlying paid API (this is metered, unlike most skills in this kit)

Does NOT cover:
- Static/manual technical audits when no live crawl is warranted → [[seo-technical]]
- E-E-A-T writing/scoring of the content itself → [[seo-content]]
- Schema markup generation → [[seo-schema]]
- The non-DataForSEO fallback chain (Exa, SerpAPI, WebSearch/WebFetch) → `references/research-tools.md` in [[seo-writing]]

## MCP server (bring your own)

This skill has no bundled server — wire one up like the `mcp-gsc` / `mcp-ga4` wrappers in `skills/automation/`:

- **Server:** any MCP server exposing the DataForSEO API surface (e.g. the official `dataforseo-mcp-server`, or a community equivalent). Configure via `/ck:use-mcp dataforseo`.
- **Required env:** `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` (or an API key, depending on the server). Env-only — never paste credentials into a plan file or prompt.
- **Availability check:** before calling any tool below, confirm one of them (e.g. `serp_organic_live_advanced`) is actually present in the tool list. If not, say so and route to the manual fallback — do not guess at data.

## Cost awareness (this API is metered)

Unlike GSC/GA4-style wrappers, DataForSEO bills per call. Be deliberate:

- Prefer bulk endpoints (`*_bulk_*`) over N single calls.
- Use default parameters (US, English, `live_regular` over `live_advanced`) unless the user's market requires otherwise.
- Don't re-fetch the same keyword/domain within a session — reuse what was already pulled.
- **Before anything in the "always confirm" tier below, or before a batch of more than ~10 calls, tell the user the endpoint, the approximate cost from `references/cost-tiers.md`, and ask for a go-ahead.** There is no automated budget tracker in this kit — the confirmation step is manual, every time.
- Note the actual source in output as "DataForSEO (live)" so it's distinguishable from a WebSearch-derived estimate.

**Always confirm before calling**, regardless of batch size — these are the ones people run up a bill on by accident:
- `backlinks_backlinks` (can return large result sets)
- `backlinks_domain_intersection` (multi-domain, expensive)
- `ai_optimization_chat_gpt_scraper` (LLM scraping)
- `ai_opt_llm_ment_search` (LLM mention tracking)
- Any `serp_google_images_live_*` call using `site:`/`filetype:` operators (5x cost multiplier)

Full pricing table, budget presets, and cost-reduction tips: `references/cost-tiers.md`.

---

## SERP analysis

**Organic SERP** — live Google (also Bing/Yahoo via the `se` parameter) results. Tool: `serp_organic_live_advanced`. Defaults: `location_code=2840` (US), `language_code=en`, `device=desktop`, `depth=100`. Returns rank, URL, title, description, domain, featured snippets, AI Overview references, People Also Ask.

**Google Images SERP** — which images/domains rank for a keyword. Tool: `serp_google_images_live_advanced`. Params: keyword (required), depth (max 700, billed per 100-result increment), search_param (e.g. `site:example.com` — **5x cost**, warn first). Returns position, title, alt text, source page URL, image URL, domain. Worth pairing with: domain dominance (top-10 domains by image-position count), alt-text patterns, format distribution (WebP/JPEG/PNG from the URL extension), and gap identification (keywords where the user ranks organically but has no image presence).

**YouTube SERP** — Tool: `serp_youtube_organic_live_advanced`. Useful for GEO: YouTube mentions are one of the stronger correlates with AI-search citations found in third-party studies.

**YouTube video deep-analysis** — info, comments, subtitles for a specific video. Tools: `serp_youtube_video_info_live_advanced`, `serp_youtube_video_comments_live_advanced`, `serp_youtube_video_subtitles_live_advanced`. Param: `video_id`. Treat any specific correlation number (e.g. "0.737") as methodology-dependent, not a fixed constant — cite the study if quoting a figure, otherwise describe the direction only.

## Keyword research

- **Ideas/suggestions/related terms** from a seed — `dataforseo_labs_google_keyword_ideas`, `dataforseo_labs_google_keyword_suggestions`, `dataforseo_labs_google_related_keywords`. Defaults: `location_code=2840`, `language_code=en`, `limit=50`. Returns keyword, volume, CPC, competition, difficulty, trend.
- **Search volume** for a keyword list — `kw_data_google_ads_search_volume`. Returns monthly volume, CPC, competition, monthly trend series.
- **Keyword difficulty (bulk)** — `dataforseo_labs_bulk_keyword_difficulty`. Returns a 0–100 score with an Easy/Medium/Hard/Very Hard interpretation.
- **Search intent** — `dataforseo_labs_search_intent`. Classifies informational/navigational/commercial/transactional with a confidence score.
- **Trends** — `kw_data_google_trends_explore`. Params: keywords, location, date range. Returns a time series, trend direction, seasonality signal.

This is the block [[seo-cluster]] and [[seo-content-brief]] want for real numbers instead of a WebSearch-inferred guess.

## Domain & competitor analysis

- **Backlink profile** — `backlinks_summary`, `backlinks_backlinks`, `backlinks_anchors`, `backlinks_referring_domains`, `backlinks_bulk_spam_score`, `backlinks_timeseries_summary`. Returns total backlinks, referring domains, domain rank, spam score, top anchors, new/lost over time, dofollow ratio.
- **Competitors + traffic** — `dataforseo_labs_google_competitors_domain`, `dataforseo_labs_google_domain_rank_overview`, `dataforseo_labs_bulk_traffic_estimation`. Returns competitor domains, keyword overlap %, estimated traffic, domain rank.
- **Ranked keywords** — `dataforseo_labs_google_ranked_keywords`, `dataforseo_labs_google_relevant_pages`. Returns keyword, position, URL, volume, traffic share, SERP features.
- **Intersection** (2–20 domains) — `dataforseo_labs_google_domain_intersection`, `backlinks_domain_intersection`. Returns shared keywords per domain position, shared backlink sources, unique keywords.
- **Bulk traffic estimation** — `dataforseo_labs_bulk_traffic_estimation`. Domain → estimated organic traffic, traffic cost, top keywords.
- **Subdomains** — `dataforseo_labs_google_subdomains`. Subdomain → ranked-keyword count, estimated traffic, organic cost.
- **Top searches mentioning a domain** — `dataforseo_labs_google_top_searches`. Query → volume, domain position, SERP features, traffic share.

Feeds [[seo-plan]]'s competitive-intelligence prioritization and [[seo-audit]]'s backlink evidence.

## Technical / on-page

- **On-page analysis** — `on_page_instant_pages` (status codes, meta tags, content size, timing, broken links), `on_page_content_parsing` (extracted text, word count, structure), `on_page_lighthouse` (performance/accessibility/best-practices/SEO scores, Core Web Vitals).
- **Tech-stack detection** — `domain_analytics_technologies_domain_technologies`. Returns technology, version, category (CMS/analytics/CDN/framework).
- **WHOIS** — `domain_analytics_whois_overview`. Registrar, creation/expiry date, nameservers, registrant (if public).

Feeds [[seo-technical]] with real crawl data instead of a manual spot-check.

## Content & business data

- **Content analysis** — `content_analysis_search` (topic search with quality scores + sentiment), `content_analysis_summary` (URL → readability/quality metrics), `content_analysis_phrase_trends` (phrase volume over time).
- **Business listings** — `business_data_business_listings_search`. Keyword (+ optional location) → name, category, address, phone, domain, rating, review count, claimed status. Local-SEO competitive scan.

## AI visibility / GEO

- **ChatGPT scrape** — `ai_optimization_chat_gpt_scraper`. Query → response content, cited sources/URLs, referenced domains. Shows which sources ChatGPT cites for a target keyword; pair with GSC's AI Overview / AI Mode reports where available (see [[seo-google]]). Location lookup: `ai_optimization_chat_gpt_scraper_locations`.
- **LLM mention tracking** — `ai_opt_llm_ment_search` (mentions of a brand/keyword across LLM responses), `ai_opt_llm_ment_top_domains` (most-cited domains for the topic), `ai_opt_llm_ment_top_pages` (most-cited specific pages), `ai_opt_llm_ment_agg_metrics` (aggregate volume/trend). Cross-model comparison: `ai_opt_llm_ment_cross_agg_metrics`. Location/model lookups: `ai_opt_llm_ment_loc_and_lang`, `ai_optimization_llm_models`.

This is the strongest available signal for [[seo-geo]]'s citation-rate measurement — it's the only source in this kit that observes actual LLM output rather than inferring citability from content structure.

## Additional utility tools

Location lookups, historical-data variants, bulk operations, and filter-option tools that don't have a dedicated section above are catalogued in `references/tool-catalog.md` — load it when the six sections above don't cover the specific need.

## Error handling

| Situation | Response |
|---|---|
| MCP server not connected / tool not in list | Say so plainly; point to "MCP server (bring your own)" above; do not fabricate a result |
| Auth failure | Report invalid credentials; check `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD` (or key) in the MCP config |
| Rate limit hit | Report the limit and suggest waiting before retrying |
| No results | Report "no data found" — never guess a plausible-looking number to fill the gap |
| Invalid location/language code | Use the relevant `*_locations` lookup tool to find the correct code |

## Manual fallback (no MCP server configured)

DataForSEO has no CSV-export equivalent like GSC/GA4 — when the server isn't available, don't try to approximate its numbers by hand. Instead, drop down the ladder documented in `references/research-tools.md` of [[seo-writing]]: SerpAPI MCP → Exa → `WebSearch` → model knowledge, and **label the output** `[UNVERIFIED — no live SERP/keyword data]` so downstream consumers ([[seo-cluster]], [[seo-content-brief]], [[seo-plan]]) know to sanity-check before acting on it. Never invent a search-volume or difficulty number to fill the gap.

## Key concepts

- **Metered API** — every call costs money; this is the one skill in the kit where "just check it live" isn't free. Batch, cache within-session, and confirm before the expensive tier.
- **Live vs. Labs data** — `serp_*` and `kw_data_*` tools hit the search engine or ad platform directly (freshest, costs more); `dataforseo_labs_*` tools are DataForSEO's own derived/cached datasets (cheaper, near-real-time, better for bulk/competitive work).
- **GEO signal, not SEO signal** — the AI-visibility tools (`ai_opt_llm_ment_*`, `ai_optimization_chat_gpt_scraper`) measure LLM citation behavior, a distinct and much newer surface than organic ranking; treat correlational claims about it as provisional.

## Output

- Inline data tables in the conversation (rank/volume/difficulty/backlink comparisons), formatted with issues prioritized Critical > High > Medium > Low where applicable.
- When feeding another skill's artifact — e.g. `plans/marketing/<site>/pipeline.md` ([[seo-cluster]]), `briefs/<slug>.md` ([[seo-content-brief]]), `audit-report.md` ([[seo-audit]]) — write the live numbers into that file, tagged "DataForSEO (live)" so a reader can tell it apart from a WebSearch estimate.
- Standalone use: `plans/marketing/<campaign>/seo-dataforseo.md`.

## Cross-references

- `plans/marketing-context.md` — required hub (market/locale informs `location_code`/`language_code` defaults)
- [[seo-writing]] `references/research-tools.md` — the research ladder this skill sits at the top of, and its manual-fallback labeling convention
- [[seo-cluster]], [[seo-content-brief]], [[seo-plan]] — consumers of keyword/competitor metrics
- [[seo-technical]] — consumer of Lighthouse/crawl/tech-stack data
- [[seo-geo]] — consumer of AI-visibility/LLM-mention data
- [[seo-audit]] — consumer of live SERP/backlink/on-page evidence
- `skills/automation/mcp-gsc/SKILL.md`, `skills/automation/mcp-ga4/SKILL.md` — sibling MCP-wrapper skills; same bring-your-own-server + manual-fallback convention
- `references/cost-tiers.md` — pricing table, budget presets, cost-reduction tips
- `references/tool-catalog.md` — utility MCP tools without a dedicated section above

## Provenance

Imported from `AgriciDaniel/claude-seo` (`seo-dataforseo`, v2.2.4) and adapted for KitForge. Adaptations: dropped the `./extensions/dataforseo/install.sh` installer and the `claude-seo run dataforseo_costs.py` cost-tracking CLI (neither exists in ClauKit) in favor of the manual, judgment-based cost-confirmation flow described above and the bring-your-own-MCP-server convention already used by `skills/automation/mcp-gsc` and `mcp-ga4`; dropped the source's bespoke `/seo dataforseo <command>` slash-command surface (this kit routes to the skill via `/mk:seo` + implicit activation, not a per-tool subcommand router); all MCP tool names, API module coverage, defaults, and cost figures are preserved from source. `references/cost-tiers.md` and `references/tool-catalog.md` are ported with the same script-removal adaptation.
