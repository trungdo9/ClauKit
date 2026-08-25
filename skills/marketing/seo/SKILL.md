---
name: seo
description: Claude-SEO engine root — the orchestrator behind `/mk:seo audit|keywords|ai|programmatic|schema`. Detects business type (SaaS, local, e-commerce, publisher, agency) from homepage signals, dispatches the 24 sibling seo-* skills/agents in parallel, and synthesizes raw findings into a prioritized action plan via a 10-principle framework. Owns the SEO Health Score, quality gates, and the Critical/High/Medium/Low priority model shared by every audit-side sub-skill.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO — Claude-SEO Orchestrator

> A pile of findings isn't a strategy. This skill collects what the sibling skills observe, walks it through PERCEIVE → ANALYZE → VALIDATE → ACT, and ships a dependency-sequenced action plan where every recommendation carries its own falsifiability check.

## When this skill activates

**Implicit:** "audit my site's SEO", "how's my SEO health", "full SEO audit", "what's wrong with my site's SEO", "SEO for [business type]".
**Explicit:** "Use the seo skill to [task]."
**Routed from:** `/mk:seo audit|keywords|ai|programmatic|schema` (`.claude/commands/mk/seo.md`) dispatches here for anything audit-shaped; `/mk:seo plan|write|campaign` instead route to `seo-writing` + the `seo-writer` agent, which this skill does not own. This is the parent skill 24 sibling seo-* skills cross-reference back to.

## Scope

Covers:
- Business-type detection from homepage signals (SaaS / local service / e-commerce / publisher / agency).
- Deciding which sibling skills a given audit needs, and in what order.
- The 10-principle synthesis framework that turns raw per-skill findings into a coherent, dependency-sequenced action plan.
- The SEO Health Score (0–100, weighted) and the Critical/High/Medium/Low priority model.
- Cross-cutting quality gates: content thresholds, doorway-page limits, deprecated-schema guardrails — the rules every sibling skill must not violate.

Does NOT cover:
- Any single domain's actual analysis logic — that lives in the sibling skill: technical crawl/CWV → [[seo-technical]]; E-E-A-T/content → [[seo-content]]; schema generation → [[seo-schema]]; AI-search/GEO → [[seo-geo]]; topic clusters → [[seo-cluster]]; content briefs → [[seo-content-brief]]; images → [[seo-images]]; full-site audit assembly → [[seo-audit]]; single-page deep dive → [[seo-page]]; backlinks → [[seo-backlinks]]; local/GBP → [[seo-local]]; maps/geo-grid → [[seo-maps]]; hreflang/i18n → [[seo-hreflang]]; programmatic pages → [[seo-programmatic]]; e-commerce → [[seo-ecommerce]]; search experience → [[seo-sxo]]; competitor pages → [[seo-competitor-pages]]; drift monitoring → [[seo-drift]]; DataForSEO data → [[seo-dataforseo]]; Google APIs → [[seo-google]]; AI image generation → [[seo-image-gen]]; strategic planning templates → [[seo-plan]]; FLOW prompts → [[seo-flow]].
- Writing/publishing articles → `seo-writing` pipeline + `seo-writer` agent (a separate ClauKit-native pipeline this skill does not orchestrate; see `/mk:seo plan|write|campaign`).

## Orchestration logic

When `/mk:seo audit` (or an equivalent implicit request) fires:

1. **Detect business type** from homepage signals (see table below).
2. **Select sibling skills** to activate based on type + detected capability:
   - Always: [[seo-technical]], [[seo-content]], [[seo-schema]], [[seo-sxo]] (search experience applies to every site).
   - If a Google Search Console / PageSpeed / GA4 connection is available: also [[seo-google]].
   - If local-service signals detected: also [[seo-local]]; add [[seo-maps]] too when a DataForSEO connection is available.
   - If backlink data sources are reachable (free: Moz/Bing/Common Crawl, or DataForSEO): also [[seo-backlinks]].
   - If content-strategy signals (blog, pillar pages, topic clusters) are present: also [[seo-cluster]].
   - If e-commerce signals detected: also [[seo-ecommerce]].
   - If a stored drift baseline exists for this URL: also [[seo-drift]].
   - GEO / AI-search readiness ([[seo-geo]]) runs on every full audit.
3. **Collect** each sibling's findings without bucketing them yet.
4. **Synthesize** via the 10-principle framework (below) — this is the step that turns findings into a strategy, not optional polish.
5. **Score**: compute the weighted SEO Health Score and bucket recommendations into Critical/High/Medium/Low.
6. **Sequence**: order the action plan as a dependency graph (what unblocks what), not a flat list.
7. **Ship** the report to `plans/marketing/<target>/seo-audit-report.md`.

Narrower requests ("just check my schema", "how's my E-E-A-T") load the single relevant sibling skill directly and skip steps 2–3 — but per step 4's discipline, still pass their recommendations through at least THINK + ACCEPT before emitting.

### Business-type detection

| Signal | Type | Follow-up |
|---|---|---|
| Pricing page, `/features`, `/integrations`, `/docs`, "free trial", "sign up" | SaaS | — |
| Phone number, address, service area, "serving [city]", Maps embed | Local Service | activate [[seo-local]] (+ [[seo-maps]] if available) |
| `/products`, `/collections`, `/cart`, "add to cart", product schema | E-commerce | activate [[seo-ecommerce]] |
| `/blog`, `/articles`, `/topics`, article schema, author pages, publication dates | Publisher | activate [[seo-cluster]] |
| `/case-studies`, `/portfolio`, `/industries`, "our work", client logos | Agency | — |

If detection is ambiguous, present the top two candidate types with their supporting signals and ask the user to confirm before applying type-specific recommendations.

## Synthesis: the 10-principle framework

Full source: `references/thinking-framework.md`. Four phases, ten principles — a recommendation that hasn't passed through all four is a finding, not a recommendation.

| Phase | Principle | Discipline |
|---|---|---|
| **PERCEIVE** | Observe (external) | Collect signals — HTML, schema, SERP visibility, backlinks, CWV field data, AI-citation patterns, competitor pages — without scoring or classifying yet. |
| | Observe (internal) | Audit your own assumptions before recommending: is the homepage representative? Is "low traffic" actually "low value"? Is a CMS limitation really unfixable? |
| | Listen | Read the site's existing copy, the SERP for target keywords, and user-review language before prescribing a rewrite — they're data, not noise. |
| **ANALYZE** | Think | Reduce to first principles: page type + intent match, AI-feature eligibility floor (must be indexed first), the single highest-leverage constraint gating everything else. |
| | Connect (lateral) | Combine findings sibling skills wouldn't naturally pair — e.g. thin-content × SERP-overlap → merge three weak pages into one cluster hub; low AI-citation × weak brand-mentions → reframe link-building budget toward PR/Reddit/YouTube. |
| | Connect (system) | Wire validated recommendations into a dependency graph: what unblocks the most other work goes first; flag anything that needs a tool/data source not yet available. |
| **VALIDATE** | Feel | Pressure-test against UX, brand voice, and operator capacity — would this recommendation make the page worse for a human, or ask a 2-person team to ship 30 location pages? |
| | Accept | Every recommendation states "how would we know this failed?" — a measurable, falsifiable check. Retract stale v1 findings explicitly when the guidance has moved on. |
| **ACT** | Create | Ship the artifact: the markdown report, the JSON-LD block, the content brief — not another round of strategizing. |
| | Grow | Name one or two leading indicators to monitor, and what the *next* audit should look for. |

Full audits walk all four phases before bucketing. Narrow single-skill requests still owe THINK + ACCEPT at minimum.

## SEO Health Score (0–100)

Weighted aggregate across categories:

| Category | Weight |
|---|---|
| Technical SEO | 22% |
| Content Quality | 23% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (Core Web Vitals) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

### Priority levels

- **Critical** — blocks indexing or risks a penalty; fix immediately.
- **High** — significantly impacts rankings; fix within a week.
- **Medium** — optimization opportunity; fix within a month.
- **Low** — nice to have; backlog.

## Quality gates (hard rules — apply across every sibling skill)

Full thresholds: `references/quality-gates.md`.

- **Content minimums** — homepage 500 words, service page 800, blog post 1,500, product page 400+ (80% unique), location page 500–600 depending on tier. See the reference for the full table.
- **Location-page scaling** — WARNING at 30+ location pages (enforce 60%+ unique content per page); HARD STOP at 50+ (require explicit user justification — doorway-page risk). Doorway tells: only the city name changes, no local specifics, no local business signals, keyword-stuffed URLs.
- **Safe-at-scale vs. penalty-risk programmatic pages** — integration pages, template/tool pages, glossary entries, and real product pages scale safely; "best X for [industry]" pages, thin competitor-alternative pages, and mass AI-generated pages carry real penalty risk (E-E-A-T failure, thin/duplicate content).
- **Schema**: never recommend `HowTo` (Google removed its rich result Sept 2023). `FAQPage` rich results are fully retired for all sites (May 7, 2026) — flag existing `FAQPage` at Info, not Critical; don't claim AI-citation benefit; don't recommend removal or new `FAQPage` for SERP benefit. Use `QAPage` for genuine user Q&A instead. Full type table (active / deprecated / recent additions): [[seo-schema]] `references/schema-types.md`.
- **Core Web Vitals**: always INP, never FID (FID was removed from CrUX/PSI Sept 9, 2024). Thresholds and diagnostic breakdown: `references/cwv-thresholds.md`.
- **E-E-A-T**: score content 0–100 against Experience/Expertise/Authoritativeness/Trust before recommending a rewrite; Trust is Google's own stated "most important member of the family". Full rubric + weights: `references/eeat-framework.md`.

## Key concepts

- **SEO Health Score** — the 0–100 weighted aggregate above; the single number a full audit reports, always accompanied by the underlying category breakdown.
- **Falsifiable finding** — a recommendation is not done until it states "how would we know this failed?"; this is the ACCEPT step, non-negotiable for every emitted item.
- **Doorway page** — a programmatic page whose only variation is a swapped city/keyword with no unique local or business content; Google's spam classifiers target these directly.
- **Business-type detection** — the homepage-signal classification (SaaS/local/e-commerce/publisher/agency) that decides which sibling skills activate and which industry-specific thresholds apply.
- **Dependency-sequenced action plan** — the ACT-phase output: not a flat priority list but a graph of what unblocks what, so the user knows what to do first.

## Output

- `plans/marketing/<target>/seo-audit-report.md` — full audit: SEO Health Score, category breakdown, dependency-sequenced action plan, one leading indicator per major recommendation.
- `plans/marketing/<target>/seo-<action>-report.md` — narrower single-skill requests (schema-only, GEO-only, etc.), per `.claude/commands/mk/seo.md`.
- Inline recommendations in the conversation for quick checks that don't warrant a written report.

## Cross-references

- `plans/marketing-context.md` — required hub (every `/mk:` command hard-fails without it).
- `.claude/commands/mk/seo.md` — the command surface that routes `audit|keywords|ai|programmatic|schema` here.
- `.claude/workflows/marketing-rules.md` — content quality rules shared across the marketing kit.
- `.claude/workflows/seo-workflow.md` — the 7-phase closed-loop campaign that wraps this skill's audit output with the `seo-writing` pipeline.
- `skills/marketing/README.md` — full kit overview, the 25-skill claude-seo roster, and the 3-layer architecture diagram.
- Sibling skills: see "Does NOT cover" above for the full list with wikilinks.

## Provenance

Imported from `AgriciDaniel/claude-seo` (root `seo` skill, v2.2.4) and adapted for KitForge. Dropped: the bundled-Python-runtime layer (`claude-seo run`, `/seo setup`/`doctor`, isolated launcher) and the extension-installer mechanics (Firecrawl/DataForSEO/image-gen `install.sh`) — ClauKit skills read/write/search directly and have no equivalent runtime to bootstrap; the PDF-report offer and the "Optional Extensions" section were dropped for the same reason. The community footer (Skool community links) was dropped as promotional content not relevant to ClauKit. Subagent-count language was adjusted: the source lists 18 conditionally-spawned subagents, ClauKit currently ships 5 real agents for this domain (seo-content, seo-geo, seo-schema, seo-technical, seo-writer) plus the remaining coverage as skills Claude activates directly — the dispatch *logic* (who gets included and when) is preserved even though the execution mechanism differs.
