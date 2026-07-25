---
name: seo-writing
description: End-to-end SEO article production pipeline — from keyword strategy to published post. Standardizes a 6-stage flow (research/strategy → competitor analysis + outline → section-by-section writing → on-page optimization → media → internal-link + publish) into a Claude-native workflow. Ported from an n8n production pipeline. Use to plan, write, optimize, and publish complete SEO articles (single or at scale), incl. WordPress. State tracked via a content pipeline table (Supabase or a local plan file).
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch, Bash
---

# SEO Writing — Full Article Production Pipeline

> One seed keyword → topic cluster → competitor-beating outline → deep-written article → on-page-optimized, media-embedded, internally-linked → published. This is the assembly line, not a single writing prompt.

This skill is the ClauKit-native port of a production n8n SEO pipeline (6 chained sub-workflows). It replaces external HTTP/Supabase/OpenAI nodes with Claude tools + research MCPs, but keeps the **exact same stage boundaries, status machine, and anti-hallucination rules** that made the original work.

---

## When this skill activates

**Implicit:** "write an SEO article", "plan SEO content for my site", "build a topic cluster and write the posts", "batch-write blog articles and publish to WordPress".
**Explicit:** "Use the seo-writing skill to [task]."

**Routed from:** `/mk:seo write`, `/mk:seo plan`, `/mk:content blog`, and the `seo-writer` agent.

## Scope

Covers:
- **Strategy** — seed keyword → Pillar / Sub-Pillar / Cluster topic tree (via [[seo-cluster]]).
- **Briefing** — SERP + competitor analysis → gap-closing outline with H2/H3, word targets, FAQs (via [[seo-content-brief]]).
- **Writing** — section-by-section deep writing (one H2 at a time) to avoid shallow, generic AI prose (via [[seo-content]]).
- **Optimization** — title tag, meta description, slug, tags, keyword density check, schema (via [[seo-schema]], [[seo-geo]]).
- **Media** — image placement tags → generated/sourced images + SEO alt text (via [[seo-images]]).
- **Internal linking + publish** — link the new post into the existing cluster, then push to WordPress or an API (via [[wordpress-rest]]).

Does NOT cover:
- Full technical-SEO site audits → use [[seo-technical]] / [[seo-audit]].
- Backlink outreach → use [[seo-backlinks]].
- The marketing context hub (ICP, brand voice) → created by `/mk:plan` ([[product-marketing]]).

## Key concepts

- **Content pipeline table** — the single source of truth for article state. Two backing stores: `supabase` (mirrors the original n8n `keywords_master` + `content_production` tables) or `local` (a markdown/JSON file at `plans/marketing/<site>/pipeline.md`). Pick with the `store` input; **default `local`** (zero infra).
- **Status machine** — every article moves through a fixed set of statuses. Never skip forward; a stage only picks up rows whose status matches its entry gate.
- **Stage isolation** — each stage is independently runnable and idempotent. Re-running a stage on an already-advanced row is a no-op. This is what lets the pipeline run at scale without duplicating work or double-publishing.
- **Deep-write, not one-shot** — the article is written one H2 section at a time with global context injected each time, then assembled. This is the single biggest quality lever vs. "write me a 2000-word article" prompts.
- **Truth-only rule** — no placeholder names ("Quán A", "Company X"), no invented stats. Missing real data → write the general/analytical form, never fabricate. Enforced at the writing stage AND at final review.

## The status machine

```
new ──▶ outline_ready ──▶ writing ──▶ writing_completed ──▶ optimizing ──▶ ready_to_publish ──▶ published
 │            │                             │                                      │                  │
 └ Stage 1    └ Stage 2                     └ Stage 3          Stage 4 ────────────┘      Stage 5/6 ───┘
   (strategy)   (outline)                     (write+assemble)  (optimize+media)           (link+publish)
                                                                                          error ◀── any stage on failure
```

| Status | Meaning | Set at end of |
|---|---|---|
| `new` | Keyword in cluster, nothing written | Stage 1 |
| `outline_ready` | Brief + outline exist, awaiting writing | Stage 2 |
| `writing` | In-flight (lock — prevents double-processing) | Stage 3 start |
| `writing_completed` | Raw markdown assembled | Stage 3 end |
| `optimizing` | Meta/media in progress | Stage 4 start |
| `ready_to_publish` | 100% finished, awaiting push | Stage 4 end |
| `published` | Live on site | Stage 6 |
| `error` | Failed — needs human review | any stage |

## The 6 stages

Load the matching reference file for the stage you're on. **Run stages in order for a fresh article; run a single stage to resume or batch-process.**

| Stage | Name | Reference | Entry gate | Exit status |
|---|---|---|---|---|
| **1** | Research & Strategy | `references/stage-1-strategy.md` | seed keyword | `new` (rows) |
| **2** | Competitor Analysis & Outline | `references/stage-2-outline.md` | `new` | `outline_ready` |
| **3** | Content Writing | `references/stage-3-write.md` | `outline_ready` | `writing_completed` |
| **4** | On-Page Optimization + Media | `references/stage-4-optimize.md` | `writing_completed` | `ready_to_publish` |
| **5** | Internal Linking | `references/stage-5-internal-links.md` | `ready_to_publish` | `ready_to_publish` |
| **6** | Publish | `references/stage-6-publish.md` | `ready_to_publish` | `published` |

> Stages 5 and 6 both operate on `ready_to_publish` — internal linking mutates the content in place, then publish pushes it. Keep them as separate steps so a bad link pass can be redone without re-publishing.

## Inputs

| Input | Required | Default | Notes |
|---|---|---|---|
| `seed_keyword` | Stage 1 only | — | The master/pillar keyword to expand |
| `site` | yes | — | Site identifier (e.g. `example.com`) — scopes the pipeline table |
| `store` | no | `local` | `local` (plan file) or `supabase` (matches n8n schema) |
| `cluster_limit` | no | `3` | Number of Sub-Pillars to generate in Stage 1 |
| `business_context` | no | from `marketing-context.md` | Filters topic ideas to intent-matched ones |
| `target_audience` | no | from `marketing-context.md` | — |
| `excluded_topics` | no | `None` | Negative constraints — topics to never generate |
| `language` | no | from context / `vi` | Output language (the source pipeline targets Vietnamese) |
| `publish_target` | Stage 6 | — | `wordpress` (via [[wordpress-rest]]) or a REST endpoint URL |
| `publish_status` | Stage 6 | `draft` | `draft` (default) or `publish` — **live publish requires explicit flag + confirmation** |

## Orchestration modes

- **`plan`** — Stage 1 + 2 only. Produce the cluster + briefs, stop. Human reviews the plan before any writing. **Recommended entry point** for a new site.
- **`write-one`** — Stages 2→4 for a single `content_id`. One finished, optimized article, unpublished.
- **`write-batch`** — loop Stages 2→5 over the next N `new`/`outline_ready` rows. Bounded by a `limit` (default 1 per run — the n8n pipeline processes one keyword per trigger to control cost).
- **`publish`** — Stage 6 for `ready_to_publish` rows.
- **`full`** — Stages 1→6 end-to-end for the seed keyword (single article). Use only after you trust the plan.
- **`campaign`** — the closed loop around this pipeline: baseline audit + metrics → `plan` → `write-batch` → `publish` → measure (GSC/GA4, 2–4 wk bake) → scale/refresh/kill decisions that feed rows back into the status machine. Defined in `.claude/workflows/seo-workflow.md`; entry `/mk:seo campaign`. Refresh = update the brief, set the row back to `outline_ready`.

## Anti-hallucination rules (enforced every stage)

1. **No placeholder entities.** Never "Shop A / Street X / Company Y". If real names/addresses/prices aren't provided → write the *categorical/analytical* form ("Garden cafés in this district typically feature…").
2. **No invented metrics.** Cite a source or mark `[NEEDS DATA]`. Never fabricate percentages, dates, case-study numbers.
3. **No meta-talk.** Don't write about the writing ("In this article we will…"). State the value directly.
4. **No generic intros.** Cut "In today's fast-paced world / As we all know". Open on the section's substance.
5. **Specifics over adjectives.** Numbers, temperatures, durations, named techniques — not "very good", "amazing".

These mirror `.claude/workflows/marketing-rules.md` §2 + §7 and are re-checked at Stage 4.

## Output

- `plans/marketing/<site>/pipeline.md` — the content pipeline table (local store) with one row per article + status.
- `plans/marketing/<site>/articles/<slug>.md` — the finished article markdown (optimized, media-embedded, internally linked).
- `plans/marketing/<site>/briefs/<slug>.brief.md` — the Stage-2 outline/brief (kept for audit + re-writes).
- Inline: cluster tree (Stage 1), publish confirmation with live URL (Stage 6).

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, brand voice, forbidden words)
- `.claude/workflows/marketing-rules.md` — content quality rules (E-E-A-T, anti-fluff, PII)
- `references/stage-1-strategy.md` … `references/stage-6-publish.md` — per-stage playbooks
- `references/pipeline-state.md` — the state store schema (local + supabase) and status transitions
- `references/playbook-100-articles.md` — worked example: existing WordPress site, ~100 posts, mediocre SEO → plan + write + publish
- `references/research-tools.md` — SERP/keyword research options (WebSearch, Exa, DataForSEO, SerpAPI) + graceful fallback
- [[seo-cluster]] · [[seo-content-brief]] · [[seo-content]] · [[seo-schema]] · [[seo-geo]] · [[seo-images]] · [[wordpress-rest]]
- `skills/marketing/seo/SKILL.md` — claude-seo orchestrator (audit side)

## Provenance

Ported from a production n8n SEO pipeline (`seo/generate-article` webhook + 5 chained sub-workflows: strategy, outline, write, optimize, publish). n8n nodes → ClauKit equivalents: `httpRequest`/`serpApi` → WebSearch/WebFetch + [[research-tools]]; `lmChatOpenAi` + `agent` → the section-writer prompts in `references/stage-3-write.md`; `supabase` → the pipeline-state store; `markdownToHtml` + `wordpress` publish → [[wordpress-rest]]. The status machine, prompts, and truth-only rules are preserved verbatim from the source workflow.
