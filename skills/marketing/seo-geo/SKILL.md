---
name: seo-geo
description: Generative Engine Optimization (GEO) — structure and audit content so ChatGPT, Perplexity, Claude, and Google AI Overviews/AI Mode extract and cite it. Covers citability scoring, structural readability, entity/authority signals, AI-crawler access, llms.txt, and platform-specific optimization. Powers Stage 4 of the seo-writing pipeline.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO GEO — AI-Search Citation Optimization

> Ranking gets you into the index; citability gets you into the answer. This skill restructures and audits content so an AI answer engine can lift a clean, attributable, self-contained answer from the page — while keeping every claim tied to Google's own position that GEO is SEO fundamentals applied to a new surface, not a separate discipline.

## When this skill activates

**Implicit:** "optimize for AI Overviews", "get cited by ChatGPT/Perplexity", "AI search visibility", "GEO audit", "will an LLM cite this", "AI crawler access".
**Explicit:** "Use the seo-geo skill to [task]."
**Routed from:** [[seo-writing]] Stage 4 (on-page optimization calls this skill for "clear definitions, extractable answers, entity clarity"), `/mk:seo ai` action, the `seo-geo` agent.

## Scope

Covers:
- Citability scoring — passage structure, length, self-containment, extractability.
- Structural readability — heading hierarchy, question-shaped H2s, lists/tables/FAQ.
- Authority & brand-mention signals (Wikipedia, Reddit, YouTube, LinkedIn) and why they now out-correlate backlinks with AI citation.
- AI crawler access strategy — which bots to allow/block, robots.txt directives, JS-rendering risk.
- `llms.txt` — evidence-based guidance on when it does (and mostly doesn't) matter.
- Platform-specific optimization (Google AI Overviews vs. AI Mode vs. ChatGPT vs. Perplexity vs. Bing Copilot).
- Citation-rate measurement — how to define and track the falsifiable signal.

Does NOT cover:
- Writing the article body itself → [[seo-content]] (E-E-A-T writing; GEO restructures what E-E-A-T already produced, it doesn't replace it).
- JSON-LD generation and validation → [[seo-schema]] (GEO calls for schema as an entity-reinforcement signal; the markup itself is that skill's job).
- The end-to-end article pipeline (outline → write → optimize → publish) → [[seo-writing]]; this skill is one contributor at Stage 4, not the pipeline itself.
- Site-wide crawl/index/Core Web Vitals issues → [[seo-technical]] (this skill only checks AI-crawler-specific access, not general crawlability).

## Primary source: Google says GEO is SEO

Google's official position (published under Search Central docs, "Generative AI fundamentals"):

> "Optimizing for generative AI search is **still SEO** from Google's perspective. AEO and GEO are rebranded labels for the same work."

Full synthesis, myth-busting list, and the Who/How/Why content-quality test: `references/google-ai-optimization-guide.md`. Key implication for every audit this skill produces: **frame findings as SEO fundamentals applied to AI-search surfaces**, not as a separate optimization discipline. When a community GEO tactic contradicts Google's stated position, defer to Google and flag the contradiction explicitly rather than picking a side quietly.

**Eligibility floor:** a page must already be indexed and snippet-eligible in classic Search to appear in any AI feature — there is no separate "AI index." A GEO audit on a page that fails that floor should say so before scoring anything else.

## Citability scoring (the core rubric)

Score five weighted dimensions. Each becomes a line item in the output report.

### 1. Citability score (25%)

**Optimal passage length: 134–167 words** for a single citable answer block. Front-load the most self-contained, quotable answer — a large share of AI citations come from early in the page, so don't bury the answer below the fold.

Strong signals: clear quotable sentences with specific facts/stats; self-contained answer blocks extractable without surrounding context; a direct answer in the first 40–60 words of a section; claims attributed to specific sources; "X is…" / "X refers to…" definitional sentences; unique data points not found elsewhere.

Weak signals: vague general statements; opinion without evidence; buried conclusions; no specific data points.

### 2. Structural readability (20%)

Strong signals: clean H1→H2→H3 hierarchy; question-based headings that match how people phrase queries; short paragraphs (2–4 sentences); tables for comparative data; ordered/unordered lists for steps or multi-item content; FAQ sections in clear Q&A format.

Weak signals: wall of text with no structure; inconsistent heading hierarchy; no lists or tables; information buried inside paragraphs instead of surfaced as scannable blocks.

### 3. Multi-modal content (15%)

Check for: text + relevant images; embedded or linked video; infographics/charts; interactive elements (calculators, tools); structured data that supports the media. Multi-modal pages are materially more likely to be selected as a citation source than text-only pages.

### 4. Authority & brand signals (20%)

**Brand mentions correlate more strongly with AI citation than backlinks do.** Only a small minority of domains get cited by both ChatGPT and Google AI Overviews for the same query — platform-specific optimization is not optional, it's the point.

| Signal | Relative strength for AI citation |
|---|---|
| YouTube mentions | Strongest |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks alone) | Weak |

Strong signals: author byline with credentials; publication + last-updated date (recent content is markedly more likely to be cited; content stale 6+ months tends to lose citation eligibility — a scheduled refresh program is one of the highest-leverage GEO plays); citations to primary sources; organization credentials/affiliations; expert quotes with attribution; entity presence on Wikipedia/Wikidata; mentions on Reddit, YouTube, LinkedIn.

Weak signals: anonymous authorship; no dates; no sources cited; no brand presence across platforms.

### 5. Technical accessibility (20%)

**AI crawlers do not execute JavaScript.** Server-side rendering of the citable content is a hard requirement, not a nice-to-have. Check for: SSR vs. client-only rendering of key content; AI crawler access in `robots.txt`; `llms.txt` presence and quality (see below — report only, don't weight); RSL licensing terms if the site cares about machine-readable AI-licensing (an emerging standard, evaluate case by case rather than assuming it applies).

## AI crawler access strategy

Check `robots.txt` for these AI crawlers and report allow/block status for each:

| Crawler | Owner | Purpose | Obeys robots.txt? |
|---|---|---|---|
| GPTBot | OpenAI | ChatGPT web search | yes |
| OAI-SearchBot | OpenAI | OpenAI search features | yes |
| ChatGPT-User | OpenAI | ChatGPT browsing (user-triggered) | no (user-triggered) |
| ClaudeBot | Anthropic | Claude web features | yes |
| PerplexityBot | Perplexity | Perplexity AI search | yes |
| CCBot | Common Crawl | Training data (often blocked deliberately) | yes |
| anthropic-ai | Anthropic | Claude training | yes |
| Bytespider | ByteDance | TikTok/Douyin AI | yes |
| cohere-ai | Cohere | Cohere models | yes |
| Google-Extended | Google | Gemini/Vertex training & grounding opt-out | yes |
| Google-CloudVertexBot | Google | Site-owner-requested Vertex AI Agent crawls | yes |
| Google-Agent | Google | Agentic browsing (e.g. Project Mariner), acts for a user | no (user-triggered) |
| Google-NotebookLM | Google | Fetches individual user-added source URLs | no (user-triggered) |

**Recommendation:** allow GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot for AI-search visibility. Block CCBot and pure-training crawlers only if the site owner deliberately wants to opt out of training use — that's a separate decision from citation visibility, don't conflate the two in a report.

**User-triggered fetchers ignore robots.txt by design** (Google-Agent, Google-NotebookLM, ChatGPT-User). `robots.txt` cannot block them — that requires server-side access controls, and a GEO audit should say so rather than recommending a robots directive that won't work. An emerging **Web Bot Auth** (RFC 9421) approach lets bots authenticate via a `Signature-Agent` header plus a key directory; reverse-DNS verification remains the fallback verification method where that isn't implemented.

## `llms.txt` — report, don't over-weight

Full evidence trail (Mueller, Illyes, SE Ranking 300k-domain study, OtterlyAI server-log audit, Google's own docs) in `references/llmstxt-evidence.md`. The short version: **Google Search explicitly ignores `/llms.txt`**, and no major AI search system has confirmed consuming third-party `llms.txt` files. This skill:

- Reports presence/absence of `/llms.txt` and `/llms-full.txt`.
- Notes whether it's well-formed if present.
- Assigns it **zero citation-ranking weight** in the score.
- If asked to generate one, ships a minimal valid example plus an explicit banner that it's non-Google optionality, not a citation lever.

Minimal format if generating one:

```
# Title of site
> Brief description

## Main sections
- [Page title](url): Description

## Optional: Key facts
- Fact 1
- Fact 2
```

## Platform-specific optimization

| Platform | Key citation sources | Optimization focus |
|---|---|---|
| **Google AI Overviews** | Strongly ranking-correlated; cites pages that already rank well | Traditional SEO + passage-level citability |
| **Google AI Mode** | Weakly ranking-correlated; broader citation pool | Freshness, entity authority, citable passages beyond position 5 — a distinct surface from AI Overviews |
| **ChatGPT** | Wikipedia, Reddit weighted heavily | Entity presence, authoritative third-party sources |
| **Perplexity** | Reddit, Wikipedia weighted heavily | Community validation, discussion presence |
| **Bing Copilot** | Bing index, authoritative sites | Bing-specific SEO, IndexNow submission |

**Google AI Overviews and AI Mode are two separate citation engines**, not one. They tend to reach similar conclusions far more often than they cite the same URLs — treat them as distinct surfaces and score both rather than assuming one implies the other. Ranking well in classic Search feeds AI Overviews directly; AI Mode draws from a broader pool where freshness and entity authority can outweigh raw ranking position.

Google has been unifying the *user experience* of AI Overviews and AI Mode into one flow (question → AI Overview → follow-up in AI Mode), but the underlying models and link sets remain technically distinct — don't let a unified UI collapse the two into one audit line.

### Citation/source surfaces worth checking

- **Preferred Sources** — a site-owner-facing feature where users can mark preferred sites for AI answers; Google has signaled interest in evolving this into a ranking signal. Quick win: encourage the site's own audience to add it as a preferred source where the feature is available to them.
- **"Highly Cited" badges** — earned via original primary reporting that other pages cite. Reinforces the "unique, first-hand content" theme from the primary-source guide.
- **Community Perspectives** — elevates Reddit/forum/firsthand discussion content in AI answers; relevant when auditing brand presence, not just the owned page.
- Inline links, link-preview hovers, and link carousels are all standard AI-answer surfaces to check the page's presence in, alongside the main cited passage.

**Controlling appearance:** there is no AI-specific opt-out file. Appearance in AI features is governed by the same directives as classic Search snippets — `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`. If a client wants *out* of AI citation while staying indexed for blue links, this is the lever — don't recommend a nonexistent "AI opt-out."

**Agent-facing surfaces:** beyond citation, some AI systems now run background monitoring agents and agentic booking/calling flows for select categories. This means agent-friendly-page qualities — real interactive elements, a sane accessibility tree, layout stability — increasingly matter for *actions* an agent takes on a user's behalf, not only for citation. Flag this as a forward-looking finding; deep remediation is [[seo-technical]] territory.

## Citation-rate measurement

A GEO recommendation without a way to check it worked isn't a finding, it's a guess. For every GEO change this skill recommends, state the falsifiable check:

1. **Define the query set** — the 5–20 real queries the target page/entity should be cited for.
2. **Baseline** — before the change, record (manually or via an AI-search-visibility tool) whether/how the brand appears for each query across the target platforms (Google AI Overviews, AI Mode, ChatGPT, Perplexity).
3. **Re-check on a cadence** — AI answers are non-deterministic and platforms change frequently; a single query is not a measurement, a tracked set over weeks is.
4. **Report citation rate**, not citation existence — "cited in 6/15 tracked queries on ChatGPT, up from 2/15" is falsifiable; "should help with AI visibility" is not.

If DataForSEO MCP tools are available in the environment, use an AI-search-scraper tool to check what a platform's web search actually returns for target queries (a real visibility check) and an LLM-mention-tracking tool for cross-platform mention tracking. Treat this as an optional accelerant — the manual query-set method above works without it and should always be offered as the fallback.

## Key concepts

- **Citability** — whether a passage can be lifted by an LLM and presented as a self-contained, attributable answer without losing meaning. The unit GEO optimizes is the *passage*, not just the page.
- **Extractability** — a passage's structural readiness for extraction: short, self-contained, front-loaded, unambiguous about what entity it's describing.
- **Entity clarity** — consistent naming and disambiguation of the people/organizations/concepts a page discusses, reinforced by schema and by consistent external presence (Wikipedia, Wikidata, sameAs links).
- **Brand-mention signal** — third-party mentions (Wikipedia, Reddit, YouTube, LinkedIn) that AI systems appear to weight more heavily than raw backlink count when deciding what to cite.
- **Two-engine model** — Google AI Overviews and AI Mode are distinct citation systems that must be scored separately even when their UX is unified.
- **GEO-is-SEO framing** — Google's own position that generative-AI-search optimization is SEO fundamentals (indexation, quality, E-E-A-T) applied to a new surface, not a distinct discipline requiring separate tactics like content-chunking or llms.txt.

## Output

`plans/marketing/<campaign>/seo-geo.md` (or the GEO section of a broader `/mk:seo` audit) containing:

1. GEO readiness score (0–100) with the five weighted dimensions broken out.
2. Platform breakdown — separate scores/notes for Google AI Overviews, Google AI Mode, ChatGPT, Perplexity.
3. AI crawler access status — which crawlers allowed/blocked, with the exact robots.txt directive to change if needed.
4. `llms.txt` status — present/missing, well-formed or not, explicitly zero-weighted in scoring.
5. Brand-mention/authority analysis — presence on Wikipedia, Reddit, YouTube, LinkedIn.
6. Passage-level citability findings — specific passages identified as under/over the 134–167 word optimal band, with rewrite suggestions.
7. Server-side rendering check — JavaScript dependency risk for the citable content.
8. Top 5 highest-impact changes, ranked.
9. Schema recommendations handed to [[seo-schema]] for implementation.
10. The citation-rate tracking plan (query set + cadence) for verifying the changes worked.

## Cross-references

- `plans/marketing-context.md` — required hub (brand voice, entity names, business context)
- [[seo-writing]] — the pipeline; this skill contributes to Stage 4 (on-page optimization) after [[seo-content]] finishes the draft
- [[seo-content]] — writes/scores the underlying content this skill restructures; GEO citability and E-E-A-T are the same signal from two angles
- [[seo-schema]] — implements the JSON-LD that reinforces entities this skill identifies
- [[seo-technical]] — owns general crawlability/SSR/Core Web Vitals; this skill only checks AI-crawler-specific access
- `references/google-ai-optimization-guide.md` — Google's primary-source position, myth-busting list, Who/How/Why content test
- `references/llmstxt-evidence.md` — the full evidence trail on why `llms.txt` gets reported but not weighted
- `.claude/workflows/marketing-rules.md` — content quality rules (truth-only, no fabricated stats — applies doubly here since AI engines penalize and won't cite fabricated specifics)

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-geo/`) and adapted for ClauKit: ClauKit frontmatter and wikilink cross-references, forward-pointers to skills not yet fully ported ([[seo-technical]], [[seo-ecommerce]]) softened to avoid claiming reference files that don't exist yet, `claude-seo`-specific tool names generalized. The citability rubric, crawler table, and llms.txt evidence are preserved from source; `references/` ports the two substantive source reference files with the same adaptation.
