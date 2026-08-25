# DataForSEO API Cost Reference

Load this when about to run anything beyond a single spot-check, or when the
user asks what something will cost. Figures are per-call at the standard
(non-priority) queue; treat them as indicative, not contractual — verify
against the account's actual plan for anything budget-sensitive.

## Pricing tiers (USD per call, standard queue)

| Category | Endpoint | Cost/call | Notes |
|----------|----------|-----------|-------|
| **SERP** | `serp_*_live_advanced` | $0.002 | Per 100 results |
| **SERP** | `serp_*_live_regular` | $0.001 | Lightweight |
| **SERP Images** | `serp_google_images_live_*` | $0.002 | 5x with `site:`/`filetype:` operators |
| **Keywords** | `kw_data_google_ads_search_volume` | $0.05 | Per batch of keywords |
| **Keywords** | `kw_data_google_trends_explore` | $0.01 | Per query |
| **Labs** | `dataforseo_labs_*_keyword_*` | $0.05 | Ideas, suggestions, related |
| **Labs** | `dataforseo_labs_bulk_*` | $0.01 | Difficulty, traffic |
| **Labs** | `dataforseo_labs_*_domain_*` | $0.05 | Competitors, intersection |
| **On-Page** | `on_page_instant_pages` | $0.01 | Quick analysis |
| **On-Page** | `on_page_lighthouse` | $0.02 | Full Lighthouse |
| **Backlinks** | `backlinks_*` | $0.02 | Per sub-call |
| **Content** | `content_analysis_*` | $0.02 | Search, summary, trends |
| **Business** | `business_data_*` | $0.05 | Listings search |
| **AI/GEO** | `ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_*` | $0.05 | ChatGPT scraper, LLM mentions |
| **Domain** | `domain_analytics_whois_*` | $0.005 | WHOIS data |
| **Domain** | `domain_analytics_technologies_*` | $0.01 | Tech stack |

## Budget presets (guidance, not enforcement)

ClauKit has no automated spend tracker for this API — there is no equivalent
of `claude-seo run dataforseo_costs.py`. These presets are a reference point
for the manual confirmation conversation with the user, not a config you set:

| Preset | Suggested daily ceiling | Confirm above | Best for |
|--------|------------------------|----------------|----------|
| **Conservative** | $2.00 | $0.10/call | Learning, one-off checks |
| **Standard** | $10.00 | $0.50/call | Regular audits |
| **Aggressive** | $50.00 | $2.00/call | Agency-scale bulk work |
| **Unlimited** | — | — | Trusted, already-budgeted pipelines |

If the user states a daily budget, track spend for the session informally
(running total in the conversation or in the output file) and stop to ask
before a call would push past it — there's no persistent counter across
sessions.

## Cost reduction tips

- Use `live_regular` instead of `live_advanced` when full SERP features aren't needed (roughly 50% cheaper).
- Batch keywords into a single `search_volume` call instead of one lookup per keyword.
- Prefer the `standard` task queue over `live` for non-urgent analysis (60–80% cheaper) if the MCP server exposes it.
- Avoid `site:`/`filetype:` operators in image-SERP queries — 5x cost multiplier.
- Don't re-fetch the same keyword/domain twice in one session; reuse what was already pulled.

## Always-confirm endpoints

These require explicit user confirmation before calling, regardless of the
budget preset in play — they're the ones that run up a bill unexpectedly:

- `backlinks_backlinks` — can return very large result sets
- `backlinks_domain_intersection` — expensive multi-domain comparison
- `ai_optimization_chat_gpt_scraper` — ChatGPT web scraping
- `ai_opt_llm_ment_search` — LLM mention tracking
- `serp_google_images_live_*` with `site:`/`filetype:` operators
