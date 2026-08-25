---
name: seo-backlinks
description: Off-page backlink profile analysis — referring-domain quality, anchor-text distribution, toxic/spam link detection with disavow criteria, link-reclamation targets, and competitor backlink-gap mapping. Produces a confidence-weighted 0-100 backlink health score that degrades to "insufficient data" rather than faking a number when only free sources are available. Use for link audits, disavow decisions, and link-building opportunity lists.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Backlinks — Link Profile & Off-Page Analysis

> A backlink profile is a trust signal, not a vanity metric — 10 relevant, editorial links beat 500 directory links, and a numeric health score built on partial data is more misleading than no score at all.

## When this skill activates

**Implicit:** "check backlinks for X", "who links to my competitor", "is my link profile toxic", "should I disavow these links", "find link building opportunities", "anchor text looks spammy".
**Explicit:** "Use the seo-backlinks skill to [task]."
**Routed from:** [[seo]] orchestrator (off-page pillar), `/mk:seo audit` (backlink section), `/mk:seo` gap/toxic/outreach actions.

## Scope

Covers:
- Backlink profile overview — referring-domain count, follow ratio, domain diversity, trend.
- Anchor-text distribution vs. over-optimization benchmarks.
- Referring-domain quality — TLD mix, geography, authority tier, follow/nofollow split.
- Toxic/spam link detection with disavow criteria.
- Top linked pages, link-reclamation targets (404s that still hold external link equity).
- Competitor backlink-gap analysis (who links to them but not to us).
- New/lost link velocity, where a data source that tracks it over time is available.
- The 0-100 backlink health score and its data-sufficiency gate.

Does NOT cover:
- Technical crawl/index/Core Web Vitals audit → [[seo-technical]] / [[seo-audit]].
- On-page content quality, E-E-A-T scoring → [[seo-content]].
- Competitor *content*/SERP analysis (what ranks and why) → [[seo-competitor-pages]].
- DataForSEO account setup and tool wiring → [[seo-dataforseo]].
- Writing the actual outreach email copy → `copywriter` agent / [[seo-writing]] (this skill produces the *target list*, not the pitch).

## Data source ladder

ClauKit has no bundled backlink-API script harness or bulk crawl-graph download. Use a preference ladder — best available source, graceful fallback, never a hard fail:

| Tier | Source | Confidence | What it gives |
|---|---|---|---|
| 1 | DataForSEO MCP (if configured — see [[seo-dataforseo]], wire via `/ck:use-mcp`) | 1.0 | Referring domains, anchors, spam score, new/lost velocity, page-level backlinks |
| 2 | Moz API or Bing Webmaster Tools (free signup; call the vendor's REST endpoint yourself via `WebFetch` with the user's own key) | 0.85 / 0.70 | Moz: Domain/Page Authority, spam score, anchors, linking domains. Bing: registered-property link data only |
| 3 | `WebSearch` spot-checks (`site:`, quoted-URL, or brand-name searches) | 0.5 | Confirms a *specific* known backlink is still live; not bulk discovery — cannot enumerate a full referring-domain list |
| — | Model knowledge alone | n/a | Never assert a specific backlink, domain count, or spam score from memory. Label anything not backed by tiers 1-3 `[UNVERIFIED]` |

Always state which tier backed each number in the output — never present a tier-2/3 figure as if it were tier-1 precision.

If nothing beyond tier 3 is available, say so up front: "No backlink API is configured. This analysis is a manual spot-check via search, not a full profile crawl — configure DataForSEO or a free Moz/Bing key for referring-domain counts and anchor-text distribution."

## Analysis framework

Produce the sections below that the request calls for; state the source tier for each figure.

### 1. Profile overview

| Metric | Good | Warning | Critical |
|---|---|---|---|
| Referring domains | >100 | 20-100 | <20 |
| Follow ratio | >60% | 40-60% | <40% |
| Domain diversity | no single domain >5% of links | 1 domain >10% | 1 domain >25% |
| Trend | growing or stable | slow decline | rapid decline (>20%/quarter) |

### 2. Anchor-text distribution

| Anchor type | Target range | Over-optimization signal |
|---|---|---|
| Branded (company/domain name) | 30-50% | <15% |
| URL / naked link | 15-25% | — |
| Generic ("click here", "learn more") | 10-20% | — |
| Exact-match keyword | 3-10% | >15% |
| Partial-match keyword | 5-15% | >25% |
| Long-tail / natural phrase | 5-15% | — |

Exact-match anchors above 15% is a review heuristic, not an automatic penalty claim — flag it as "check for unnatural link patterns," not "this site is penalized."

### 3. Referring-domain quality

Check:
- **TLD mix** — `.edu`/`.gov`/`.org` skew signals authority; heavy `.xyz`/`.info` skews low-quality.
- **Geographic mix** — should roughly match the target market; a large majority from unrelated countries is a private-blog-network (PBN) signal.
- **Authority-tier spread** — a healthy profile has links across low/mid/high authority, not only the bottom tier.
- **Follow/nofollow per domain** — domains that only ever nofollow contribute limited direct SEO value (still fine for referral traffic/brand).

### 4. Toxic link detection

**High-risk (flag immediately):**
- Links from known PBN domains.
- A domain sending 100% exact-match anchor text.
- Links from penalized or deindexed domains.
- Mass directory submissions (50+ directory links).
- Link farms — pages with 10K+ outbound links.
- Sitewide paid-link patterns (footer/sidebar links present across every page of a domain).

**Medium-risk (review manually, don't auto-disavow):**
- Links from an unrelated niche.
- Reciprocal link patterns (A links to B, B links back to A).
- Links from thin-content pages (<100 words).
- One domain sending 50+ backlinks.

Only recommend disavowing links that clear the high-risk bar or that a manual review confirms; a disavow file is a blunt instrument and wrongly disavowing a legitimate link costs ranking equity.

### 5. Top pages by backlinks / link reclamation

Identify:
- Pages that attract the most external links ("link magnets" — study what made them link-worthy).
- Pages with strong external links but weak internal linking (an internal-linking opportunity).
- **404s that still hold external link equity** — redirect these to reclaim the equity instead of losing it.

### 6. Competitor backlink-gap analysis

For target vs. one or more competitors:
- Domains linking to the competitor but **not** to the target → the outreach/link-building opportunity list.
- Domains linking to **both** → validate the relationship still holds.
- Domains linking **only** to the target → a competitive advantage worth protecting.
- Rank opportunities by the linking domain's authority tier, not raw count.

### 7. New and lost backlinks

Only tier-1 sources track link velocity over time; tier-2/3 sources are point-in-time snapshots. If this is requested without a tier-1 source, say so explicitly rather than fabricating a trend line.

**Red flags when velocity data exists:**
- A sudden spike in new links (possible negative-SEO attack).
- A sudden loss of many links at once (penalty or site-wide content removal upstream).
- Declining acquisition velocity over 3+ months (content has stopped earning links organically).

## Backlink health score

A 0-100 score, confidence-weighted by source tier:

| Factor | Weight | Best source | Confidence if tier 1 / tier 2 |
|---|---|---|---|
| Referring-domain count | 20% | DataForSEO > Moz | 1.0 / 0.85 |
| Domain quality distribution | 20% | DataForSEO > Moz authority spread | 1.0 / 0.85 |
| Anchor-text naturalness | 15% | DataForSEO > Moz > Bing anchors | 1.0 / 0.85 / 0.70 |
| Toxic-link ratio | 20% | DataForSEO > Moz spam score | 1.0 / 0.85 |
| Link velocity trend | 10% | DataForSEO only | 1.0 |
| Follow/nofollow ratio | 5% | DataForSEO > Bing detail | 1.0 / 0.70 |
| Geographic relevance | 10% | DataForSEO > Bing country data | 1.0 / 0.70 |

**Data-sufficiency gate:** count how many of the 7 factors have at least one real data source behind them.
- **4+ factors scored** → produce a numeric 0-100 score, redistributing the missing weights proportionally across what's scored.
- **Fewer than 4 factors** → do **not** produce a numeric score. Show `Backlink Health Score: INSUFFICIENT DATA (X/7 factors scored)`, list the factors that ARE scored with their source and confidence, and recommend configuring a free Moz or Bing key.

A numeric score built from fewer than 4 factors reads as a real health grade when it's actually mostly absence of evidence — that's worse than admitting the gap.

## Pre-delivery review (do before showing the report)

- [ ] Every metric in the report carries a source-tier label (e.g., "Moz (0.85)", "spot-check (0.5)").
- [ ] Every "not found" result distinguishes "not checked" from "checked, below threshold" from "source errored" — never collapse these into a bare negative.
- [ ] Reciprocal-link claims are checked both directions (A→B and B→A) before being flagged.
- [ ] The health score is either a real 4+/7 number or explicitly `INSUFFICIENT DATA` — never a number implied to be precise when it isn't.
- [ ] No disavow recommendation rests on a medium-risk-only signal without saying so.
- [ ] No specific backlink, spam score, or domain count is asserted from model knowledge alone — mark it `[UNVERIFIED]` per the truth-only rule.

## Key concepts

- **Link equity ≠ link count.** A handful of topically relevant, editorially earned links outweighs hundreds of low-authority or directory links; the quality distribution matters more than the total.
- **Confidence-weighted scoring.** Mixing sources of different reliability without labeling confidence turns an estimate into a false claim — always carry the tier/confidence alongside the number.
- **Disavow is a blunt, risky tool.** Reserved for links clearing the high-risk bar or confirmed by manual review; over-disavowing legitimate links destroys ranking value the site already earned.
- **Link reclamation.** 404s and broken pages that still hold external links are near-free equity recovery via a redirect — usually higher ROI than new outreach.

## Output

- `plans/marketing/<campaign>/seo-backlinks.md` — the profile/gap/toxic-link report, source-tier labeled, per §6 of `.claude/workflows/marketing-rules.md` (audit reports with falsifiable findings).
- Inline recommendations and a prioritized opportunity/disavow list in the conversation.

## Cross-references

- `plans/marketing-context.md` — required hub (target market/geography informs the geographic-relevance check)
- [[seo]] — orchestrator; this skill covers its off-page/backlink pillar
- [[seo-audit]] — full-site audit that includes this as one section
- [[seo-technical]] — crawl/index/CWV side of technical SEO (not link-based)
- [[seo-competitor-pages]] — competitor *content* analysis, complements the backlink-gap view here
- [[seo-dataforseo]] — DataForSEO account/tool setup for tier-1 data
- `.claude/workflows/marketing-rules.md` — §2 (no hallucinated metrics — applies directly to spam scores/domain counts), §6 (output conventions)

## Provenance

Imported from `AgriciDaniel/claude-seo` (`skills/seo-backlinks/SKILL.md`, v2.2.4) and adapted for KitForge: the analysis framework, scoring tables, and toxic-link criteria are preserved; the source's `claude-seo run <script>.py` CLI harness and Common Crawl bulk-graph download (no local script/download infra in ClauKit) were replaced with a WebSearch/WebFetch + optional-MCP preference ladder in the style of [[seo-writing]]'s `references/research-tools.md`.
