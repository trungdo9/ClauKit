# Competitor Profile Templates

Fill-in templates for [[competitor-profiling]]. Every profile in a run uses the same template so the set reads as one table, not N essays.

Rules that apply to all templates below:

- A field you could not retrieve is `[not found]`. Never a plausible guess.
- A figure you estimated rather than measured is suffixed `[estimated]`.
- A conclusion you drew rather than read is prefixed `Inferred:`.
- Every strength/weakness line names its evidence source.
- Stamp the generated date (`bash -c 'date +%F'`).

## Contents
- Quick Scan Profile
- Full Profile
- Summary / Landscape Document
- Positioning Map
- Competitive SWOT
- Change Log

---

## Quick Scan Profile

Default depth. Homepage + pricing + domain metrics.

```markdown
# [Competitor Name] — Quick Profile

**URL**: [website]
**Generated**: [YYYY-MM-DD]

## At a Glance

| Metric | Value |
|--------|-------|
| Tagline | [from homepage] |
| Target audience | [inferred from copy] |
| Pricing starts at | [lowest paid tier] |
| Free tier/trial | [yes/no + details] |
| Domain rank | [source] |
| Est. organic traffic | [monthly] |
| Organic keywords (top 10) | [count] |
| Referring domains | [count] |

## Positioning

**Headline**: "[exact homepage headline]"
**Subheadline**: "[exact subheadline]"
**Positioning angle**: Inferred: [1-2 sentences on how they ask to be judged]

## Pricing Summary

| Tier | Price | Notable Inclusions |
|------|-------|-------------------|
| [tier] | [price] | [key items] |

## Key Takeaway

[2-3 sentences: what makes this competitor notable, where they are strong, where they are weak]

## Raw data sources
- Pages fetched: [date] → `raw/[slug]/[date]/pages/`
```

---

## Full Profile

Deep mode. One file per competitor.

```markdown
# [Competitor Name] — Competitor Profile

**URL**: [website]
**Generated**: [YYYY-MM-DD]
**Depth**: deep profile

---

## At a Glance

| Metric | Value |
|--------|-------|
| Tagline | [from homepage] |
| Founded | [year] |
| Headquarters | [location] |
| Team size | [estimate + basis] |
| Funding | [if sourced] |
| Domain rank | [source] |
| Est. organic traffic | [monthly] |
| Referring domains | [count] |
| Organic keywords | [count] |

## Positioning & Messaging

**Primary value proposition**: [headline + subheadline, quoted]
**Target audience**: Inferred: [who the copy speaks to, and what signalled it]
**Positioning angle**: Inferred: [e.g. simplicity-first, enterprise-grade, all-in-one]
**Key messaging themes**:
- [theme] — source: [page]
- [theme] — source: [page]

## Product & Features

### Core capabilities
- [capability] — [how they describe it]

### Notable differentiators
- [what they claim as unique, quoted]

### Integrations
- [count] integrations. Key: [top 5-10]

### Product direction signals
- [from changelog / recent releases — release velocity + recent focus]

## Pricing

| Tier | Price | Key Inclusions |
|------|-------|---------------|
| [tier] | [price] | [what's included] |

**Billing**: [monthly/annual, annual discount]
**Free trial**: [yes/no, duration]
**Notable**: [per-seat, usage-based, hidden costs, enterprise-only gates]

## Customers & Social Proof

**Named customers**: [logos listed on site]
**Industries**: [primary industries served]
**Case study themes**: [what outcomes they highlight]
**Review ratings**: G2 [rating] ([count]) · Capterra [rating] ([count])
**Praise themes**: [recurring across reviews]
**Complaint themes**: [recurring across reviews — the positioning material]
**Representative quotes**:
> "[verbatim]" — [source, date]

## SEO & Content Strategy

**Organic strength**: est. monthly traffic [n] · top-10 keywords [n] · traffic value $[n]

**Top organic pages**:
| Page | Keyword | Est. traffic |
|------|---------|--------------|
| [url] | [keyword] | [n] |

**Content strategy signals**: post frequency [estimate] · primary formats [guides/comparisons/templates] · investment topics [list]

**Backlink profile**: referring domains [n] · top referring sites [5] · acquisition trend [growing/stable/declining]

## Strengths & Weaknesses

### Strengths
- [strength] — evidence: [source]

### Weaknesses
- [weakness] — evidence: [source]

## Competitive Implications for [Your Product]

**Where they are stronger**: [honest]
**Where we are stronger**: [honest]
**Opportunities**: [gaps in their offering or positioning]
**Threats**: [where they are improving or gaining]

## Consistency checks
- [claim on site] vs [what traffic/backlink/review data supports] → [note discrepancy or confirm]

## Raw data sources
- Pages fetched: [date] → `raw/[slug]/[date]/pages/`
- SEO data pulled: [date] → `raw/[slug]/[date]/seo/`
- Reviews pulled: [date, sources] → `raw/[slug]/[date]/reviews/`
```

---

## Summary / Landscape Document

Written last, after every individual profile exists. `_summary.md`.

```markdown
# Competitive Landscape Summary

**Generated**: [YYYY-MM-DD]
**Your product**: [name]
**Competitors profiled**: [count]

## Landscape overview
[One paragraph: shape of the field, who clusters where, what the market rewards]

## Side-by-Side Comparison

| Dimension | [Your Product] | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|-----------|---------------|----------------|----------------|----------------|
| **Tagline** | | | | |
| **Target audience** | | | | |
| **Positioning angle** | | | | |
| **Starting price** | | | | |
| **Free tier** | | | | |
| **Domain rank** | | | | |
| **Est. organic traffic** | | | | |
| **Referring domains** | | | | |
| **G2 rating** | | | | |
| **Key strength** | | | | |
| **Key weakness** | | | | |

## Positioning map
[see below]

## Key takeaways
1. [strategic observation]
2. [strategic observation]
3. [strategic observation]

## Gaps & opportunities
- [where the market is underserved, and which of our strengths maps to it]
```

---

## Positioning Map

Plot competitors on the two axes most relevant to the market. The point is to expose whitespace.

| Market type | X-axis | Y-axis |
|-------------|--------|--------|
| SaaS tools | Simple → Complex | Cheap → Expensive |
| Developer tools | Low-code → Code-first | Individual → Team |
| B2B platforms | SMB-focused → Enterprise-focused | Point solution → Platform |
| Content tools | Template-driven → Custom | Self-serve → Managed |

```markdown
## Positioning Map

**Axes**: [X-axis label] vs. [Y-axis label]

                    [Y-axis high label]
                           |
          [Competitor A]   |    [Competitor B]
                           |
    -----------------------+-----------------------
    [X-axis low]           |           [X-axis high]
                           |
          [Your Product]   |    [Competitor C]
                           |
                    [Y-axis low label]

### Interpretation
- [what the map reveals]
- [where the whitespace is, and whether we can credibly occupy it]
```

---

## Competitive SWOT

Per competitor, relative to your product. Feeds the battle card.

```markdown
## SWOT: [Competitor] vs. [Your Product]

### Strengths (theirs)
- [where they genuinely outperform us — be honest; source]

### Weaknesses (theirs)
- [where they fall short — with evidence, not assertion]

### Opportunities (ours)
- [gaps in their offering we can exploit]
- [segments they are ignoring]
- [messaging angles they are missing]

### Threats (from them)
- [where they are improving fast]
- [features they are building that overlap with us]
- [market moves that could shift perception]
```

---

## Change Log

Append to the bottom of a profile on every re-run. This is what makes snapshots worth keeping.

```markdown
---

## Change Log

| Date | What Changed | Source |
|------|-------------|--------|
| [date] | Pricing moved from $X to $Y | Pricing page re-fetch |
| [date] | Launched [feature] | Changelog |
| [date] | Domain rank X → Y | SEO re-pull |
| [date] | Added [integration] | Integrations page re-fetch |
```
