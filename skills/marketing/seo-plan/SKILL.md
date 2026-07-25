---
name: seo-plan
description: SEO planning — turn a topic cluster + content inventory into a prioritized, ordered writing roadmap. Scores what to write first (intent × reach ÷ effort), front-loads pillars, and produces the "kế hoạch viết bài" (content plan). Feeds the seo-writing pipeline as the backlog.
allowed-tools: Read, Write, Glob, Grep
---

# SEO Plan — Prioritized Content Roadmap

> A cluster tells you *what could* be written. A plan tells you *what to write first, and why* — so effort goes where it moves rankings, not where it's easiest.

## When this skill activates

**Implicit:** "make an SEO content plan", "what should I write first", "prioritize these articles", "content roadmap for the quarter".
**Explicit:** "Use the seo-plan skill to [task]."
**Routed from:** [[seo-writing]] (Phase 3 of the 100-article playbook), `/mk:seo plan`.

## Scope

Covers:
- Prioritizing a cluster's nodes into an ordered backlog.
- Scoring: intent value, reach, effort; new-vs-improve decisions.
- Quarterly/rolling roadmap shaping (pillars first, then facets).
- ROI framing for stakeholders.

Does NOT cover:
- Building the cluster tree → [[seo-cluster]].
- Writing the articles → [[seo-content]] / [[seo-writing]].
- Keyword metrics acquisition → research tools (see [[seo-writing]] `references/research-tools.md`).

## Prioritization model

```
priority = intent_value × reach ÷ effort
```

| Factor | Higher when | Source |
|---|---|---|
| **intent_value** | Transactional / Commercial (closer to revenue) > Informational | keyword `search_intent` |
| **reach** | Higher search volume; or broader PAA/related coverage (proxy when volume unknown) | research tool / SERP |
| **effort** | New article > improving a near-miss existing post | inventory triage |

**Two rules that beat the formula:**
1. **Front-load Pillars + top-theme Sub-Pillars** — they anchor the cluster and give Cluster articles something to link up to. Write the hub before the spokes.
2. **Improve before you create** — fixing an existing near-miss post (add sections, fix meta, interlink) is the cheapest win. Do those first when a site already has content.

## Roadmap shape

```
Wave 1  Pillar pages + highest-value Sub-Pillars        (anchors)
Wave 2  Cluster articles under the top Sub-Pillar        (depth where it pays)
Wave 3  Remaining Sub-Pillars + their Clusters           (breadth)
Ongoing Improve existing posts · re-write SERP losers    (maintenance loop)
```

Pace with a bounded batch (e.g. N/day via `/loop` or a cron routine) rather than a single burst — steady publishing + interlinking compounds.

## Key concepts

- **Effort-adjusted priority** — a medium-value article that already exists at 80% beats a high-value one from scratch. Effort is the denominator for a reason.
- **Anchor-first sequencing** — Clusters that link up to a not-yet-written Pillar leak link equity into a 404. Publish hubs first.
- **Falsifiable ROI** — frame projections as testable ("expect this cluster to gain impressions in GSC within 6–8 weeks"), never as guaranteed traffic numbers. Measure and adjust.

## Output

- An ordered backlog in `plans/marketing/<site>/pipeline.md` (the Keywords table, status `new`, in priority order) — this *is* the content plan.
- Optionally a stakeholder-facing `plans/marketing/<site>/seo-roadmap.md` with waves + rationale.

## Cross-references

- `plans/marketing-context.md` — required hub (business goals set intent_value weighting)
- [[seo-cluster]] — provides the nodes to prioritize
- [[seo-writing]] — consumes the backlog; playbook Phase 3 is this skill
- [[seo-google]] — post-publish measurement feeds the maintenance loop
- `.claude/workflows/marketing-rules.md` — content quality + no-hallucinated-metrics rule

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. Prioritization aligns with the seo-writing 100-article playbook (Phase 3).
