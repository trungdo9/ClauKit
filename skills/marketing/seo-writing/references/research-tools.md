# Research Tools — SERP, Keywords, Competitor Fetch

The pipeline needs three research capabilities. Each has a **preference ladder** — use the best available, fall back gracefully, never hard-fail on missing infra.

| Need | Used in | Ladder (best → fallback) |
|---|---|---|
| SERP / keyword signal (PAA, related, top organic) | Stage 1, 2 | DataForSEO MCP → SerpAPI MCP → Exa → `WebSearch` → model knowledge `[UNVERIFIED]` |
| Competitor page fetch (headings, word count) | Stage 2 | Firecrawl / Jina MCP → `WebFetch` → skip `[competitors unverified]` |
| Deep topic research / citations | Stage 2, 3 | Exa MCP → `WebSearch` + `WebFetch` → model knowledge |

## Tool notes

- **WebSearch / WebFetch** — always available, zero setup. WebSearch for SERP-shaped queries; WebFetch to pull a competitor URL and extract headings. Good enough for most single-article work.
- **Exa (`exa.ai`)** — semantic/neural search, strong for "find the best content about X" and citation-worthy sources. Use via its MCP if configured (`/ck:use-mcp`), else its API. The user specifically flagged this as a desired research source — prefer it when present for Stage-2 gap analysis and Stage-3 fact-sourcing.
- **DataForSEO / SerpAPI** — real keyword metrics (volume, difficulty, exact PAA/related). The source n8n pipeline uses SerpAPI (`gl=vn, hl=vi`) and a DataForSEO-style keyword API. Use via MCP if the user has one; they give the truest SERP signal.
- **Firecrawl / Jina** — for JS-rendered competitor pages that `WebFetch` returns empty for.
- **Custom SERP proxy** — the source pipeline routes SERP calls through a self-hosted endpoint (an n8n webhook wrapping SerpAPI) instead of calling the provider directly — one shared key, centralized quota. If the user has one, use it: `GET $SERP_PROXY_URL?q=<keyword>` with header `x-api-key: $SERP_PROXY_KEY` → SerpAPI-shaped JSON (`organic_results[].link`). Env-only credentials; slot it at the same rung as SerpAPI in the ladder.

## Graceful degradation

Research infra is optional. The pipeline must still run with only `WebSearch`/`WebFetch`:

1. Try the top of the ladder; on missing/erroring tool, drop down one rung.
2. If you reach model-knowledge, **label the output** (`[UNVERIFIED — no SERP data]` on a cluster, `[competitors unverified]` on a brief) so a human knows to sanity-check before publishing.
3. Never invent SERP data to fill a gap — that violates the truth-only rule. An honest `[UNVERIFIED]` beats a fabricated volume number.

## Locale

Match the site's market: the source pipeline targets Vietnam (`gl=vn`, `hl=vi`, Vietnamese output). Set `language` + locale on every SERP query and generation prompt from the `marketing-context.md` / the `language` input.

## Cross-references

- `/ck:use-mcp <server>` — wire up Exa / DataForSEO / SerpAPI / Firecrawl MCPs
- [[seo-dataforseo]] — DataForSEO-specific skill (if using that provider)
- [[seo-google]] — Search Console / PageSpeed / Rich Results (post-publish measurement)
