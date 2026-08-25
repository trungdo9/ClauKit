---
name: seo-audit
description: Full-site SEO audit — crawls a site (or a single WordPress post via wordpress-rest), detects business type, fans out to up to 15 specialist skills, aggregates a 0-100 SEO Health Score, and writes a prioritized Critical>High>Medium>Low action plan. Use for "audit my site", "full SEO check", "website health check", or as the baseline phase before an seo-writing campaign.
allowed-tools: Read, Write, Glob, Grep, WebFetch
---

# SEO Audit — Full-Site Health Check

> A site isn't "good at SEO" or "bad at SEO" — it has a health score, a list of evidence-backed findings, and a priority order to fix them in. This skill produces that list, not a vibe.

## When this skill activates

**Implicit:** "audit my site", "full SEO check", "analyze my site", "website health check", "what's wrong with my SEO".
**Explicit:** "Use the seo-audit skill to [task]."
**Routed from:** the `seo` orchestrator (industry detection → dispatch) and `/mk:seo audit <target>` (target may be a URL or a live WordPress post via `wordpress-rest`, read-only). In the SEO campaign workflow (`.claude/workflows/seo-workflow.md`), this skill runs in **Phase 1 — Baseline**, *before* the `seo-writing` pipeline's Phase 2 Plan — its findings become the "before" state that Phase 6 (Measure) compares against, and for existing sites its inventory/triage feeds the cluster's gap analysis.

## Scope

Covers:
- Whole-site crawl + business-type detection, orchestration of specialist findings into one report.
- SEO Health Score aggregation (weighted 0-100) and a prioritized action plan.
- The audit-data envelope other tooling (report generation, the campaign baseline) reads.

Does NOT cover — delegates to the specialist that owns the depth:
- Crawlability, sitemaps, canonicals, security headers, JS rendering → [[seo-technical]].
- E-E-A-T, thin content, readability → [[seo-content]].
- Structured data validation/generation → [[seo-schema]].
- Sitemap structure/quality gates → [[seo-sitemap]].
- Core Web Vitals (LCP/INP/CLS), mobile/page-experience parity → [[seo-technical]].
- AI-crawler access, llms.txt, citability → [[seo-geo]].
- Local signals (GBP, NAP, reviews) → [[seo-local]]; geo-grid + review intelligence → [[seo-maps]].
- CrUX/GSC/GA4 field data → [[seo-google]].
- Backlink profile, DA/PA, anchor text, toxic links → [[seo-backlinks]].
- Semantic clustering of existing content → [[seo-cluster]].
- Search-experience / page-type / persona scoring → [[seo-sxo]].
- Baseline-vs-current drift → [[seo-drift]].
- Product schema / marketplace signals → [[seo-ecommerce]].
- Turning findings into new articles → [[seo-writing]] (this skill audits; that one produces).

## Process

1. **Render + fingerprint** the homepage (raw HTML, rendered HTML, extracted text, SPA status).
2. **Detect business type** from homepage signals (e-commerce, local-service, SaaS, content/blog, etc.) — this decides which conditional specialists spawn.
3. **Crawl** internal links per the configuration below, respecting `robots.txt`.
4. **Delegate** to specialists (parallel where the runtime supports it, otherwise sequential):
   - Always: [[seo-technical]], [[seo-content]], [[seo-schema]], [[seo-sitemap]], [[seo-geo]], [[seo-sxo]].
   - Conditional: [[seo-local]] + [[seo-maps]] (local-service/brick-and-mortar/hybrid business type), [[seo-google]] (Google API credentials available), [[seo-backlinks]] (Moz/Bing credentials, or Common Crawl domain metrics as a no-credential fallback), [[seo-cluster]] (blog/pillar-page signals detected), [[seo-drift]] (a stored baseline exists for this URL), [[seo-ecommerce]] (e-commerce business type), `seo-dataforseo` (DataForSEO MCP available — live SERP, backlinks-with-spam-score, Lighthouse on-page, AI-visibility checks).
5. **Score** — aggregate specialist findings into the weighted SEO Health Score (0-100).
6. **Persist** artifacts under `plans/marketing/<site>/` (see Output).
7. **Report** — prioritized action plan; offer a PDF/HTML report if the environment supports report generation.

## Crawl configuration

| Setting | Value |
|---|---|
| Max pages | 500 |
| Respect robots.txt | Yes |
| Follow redirects | Yes (max 3 hops) |
| Timeout per page | 30s |
| Concurrent requests | 5 |
| Delay between requests | 1s |

## Scoring weights (SEO Health Score, 0-100)

| Category | Weight |
|---|---|
| Technical SEO | 22% |
| Content Quality | 23% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

## Report sections

Executive Summary (score, business type, top-5 critical issues, top-5 quick wins) → Technical SEO (crawlability, indexability, security, CWV status) → Content Quality (E-E-A-T, thin/duplicate content, readability) → On-Page SEO (titles, meta descriptions, headings, internal linking gaps) → Schema (implementation, validation errors, missed opportunities) → Performance (LCP/INP/CLS, resource + third-party script impact) → Images (missing alt text, oversized files, format) → AI Search Readiness (citability, structural improvements, authority signals).

## Priority definitions

- **Critical** — blocks indexing or risks a penalty. Fix immediately.
- **High** — significantly impacts rankings. Fix within 1 week.
- **Medium** — optimization opportunity. Fix within 1 month.
- **Low** — nice to have. Backlog.

The action plan groups findings into four phases: Week 1 (Critical), Weeks 2-3 (High-impact), Month 2 (Content & Authority), Ongoing (Monitoring & Iteration).

## Error handling

| Scenario | Action |
|---|---|
| URL unreachable (DNS/connection failure) | Report the error clearly. Do not guess site content — ask the user to verify the URL. |
| `robots.txt` blocks crawling | Report which paths are blocked; analyze only accessible pages and note the limitation. |
| Rate limiting (429s) | Back off, reduce concurrency; report partial results with which sections were incomplete. |
| Timeout on large sites (500+ pages) | Cap at the crawl limit; report findings for pages crawled and estimate total site scope. |

## Key concepts

- **Falsifiable finding** — every finding states evidence + a specific fix, not an opinion; the same falsifiability discipline as [[seo-technical]] and [[seo-content]].
- **Business-type detection** — the gate that decides which conditional specialists run; a local-service site without [[seo-local]]/[[seo-maps]] is an incomplete audit, an e-commerce site without [[seo-ecommerce]] likewise.
- **Improve-before-create** — an audit's near-miss findings (page ranks #8-20, thin but salvageable) should outrank net-new content in the backlog the campaign workflow builds next; this is what lets [[seo-cluster]] and [[seo-writing]] prioritize fixes over fresh articles.
- **Baseline** — this audit's health score and per-page findings are the "before" state; [[seo-drift]] and the campaign workflow's Phase 6 (Measure) diff against it.

## Output

- `plans/marketing/<site>/audit-report.md` — full findings, organized per Report sections above.
- `plans/marketing/<site>/action-plan.md` — prioritized Critical > High > Medium > Low plan.
- `plans/marketing/<site>/audit-data.json` — structured envelope (`summary`, `categories[]` with per-finding `title/severity/description/recommendation`, `action_plan.phases[]`) that downstream report generation and the campaign baseline consume.
- `plans/marketing/<site>/findings/*.md` — one file per specialist (`technical.md`, `content.md`, `schema.md`, `performance.md`, `visual.md`, …).
- `plans/marketing/<site>/screenshots/` — desktop + mobile captures, when available.

## Cross-references

- `plans/marketing-context.md` — required hub (business context informs severity/priority calls)
- `.claude/skills/marketing/seo/SKILL.md` — the orchestrator that dispatches this skill
- [[seo-technical]], [[seo-content]], [[seo-schema]], [[seo-sitemap]], [[seo-geo]], [[seo-local]], [[seo-maps]], [[seo-google]], [[seo-backlinks]], [[seo-cluster]], [[seo-sxo]], [[seo-drift]], [[seo-ecommerce]] — the specialists this skill delegates to
- [[seo-writing]] — consumes this audit's findings (via the campaign's Phase 2 Plan) to build the writing backlog
- `.claude/workflows/seo-workflow.md` — Phase 1 (Baseline) is this skill; Phase 6 (Measure) diffs against it
- `.claude/workflows/marketing-rules.md` — falsifiability + evidence-backed findings requirement

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for KitForge. Dropped: the source's `claude-seo run <script>.py` CLI invocations (`render_page.py`, `drift_history.py`, `google_auth.py`/`backlinks_auth.py` credential checks, `google_report.py` PDF generation) — that CLI is the original repo's own tooling and isn't vendored into ClauKit, so those steps are described here as capabilities/preconditions ("if Google API credentials are available…") rather than literal commands. Crawl config, scoring weights, report structure, priority definitions, and error-handling table are preserved as-is.
