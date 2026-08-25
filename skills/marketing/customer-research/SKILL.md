---
name: customer-research
description: Customer research — run and synthesize primary research (interviews, surveys, PMF survey), mine public voice-of-customer signal (Reddit, G2/Capterra, Hacker News, app stores, communities), and build evidence-backed JTBD maps, VOC quote banks, and personas. Use for "customer research", "talk to customers", "customer interviews", "interview questions", "survey design", "PMF survey", "analyze transcripts", "support ticket analysis", "win/loss", "churn research", "voice of customer", "VOC", "review mining", "G2 reviews", "Reddit mining", "digital watering holes", "Sales Safari", "jobs to be done", "JTBD", "build personas", "ICP refinement".
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Customer Research

> Find out what customers actually think, say, and struggle with — so positioning, product, and copy rest on evidence instead of assumption.

## When this skill activates

**Implicit:** "talk to our customers", "why do they churn", "write interview questions", "analyze these transcripts / tickets / reviews", "what language do buyers use", "build a persona", "sharpen our ICP".
**Explicit:** "Use the customer-research skill to [task]."
**Routed from:** `/mk:research customer`, `/mk:research icp`, `/mk:research market` (demand-side half only — see Market sizing below), the `market-researcher` agent, `/mk:plan` when the ICP section of the hub needs evidence.

## Scope

Covers:
- **Mode 1 — analyze existing assets:** interview/sales-call transcripts, surveys, support tickets, win/loss notes, NPS verbatims.
- **Mode 2 — mine public signal:** Reddit, G2/Capterra/Trustpilot, Hacker News, Indie Hackers, Product Hunt, LinkedIn posts + job postings, YouTube/TikTok comments, app-store reviews.
- **Mode 3 — primary research:** recruiting, outreach, casual interviews, 5-why laddering, survey design, the PMF survey.
- Synthesis: JTBD maps, theme clustering with frequency x intensity, confidence labelling, VOC quote banks.
- Persona and ICP construction from evidence (including the no-reviews-yet proxy ladder).

Does NOT cover:
- Competitor teardowns (pricing, positioning, feature matrices) → [[competitor-profiling]]. This skill only extracts what *customers say about* competitors.
- Owning the ICP/positioning record → [[product-marketing]] writes `plans/marketing-context.md`; this skill feeds it evidence.
- Tactic/channel ideation from the findings → [[marketing-ideas]].
- **Top-down market sizing (TAM/SAM/SOM)** — no method here; see Market sizing below.

## Three modes

Most engagements combine them. **Mine before you ask:** Mode 2 tells you what to ask in Mode 3, and in whose words. Establish which modes apply before doing anything else.

| Mode | Situation | Method |
|---|---|---|
| 1. Analyze existing assets | You already hold raw material | Extract signal with the framework below |
| 2. Mine public signal | Customers speak unprompted in public | Watering-hole research, `references/source-guides.md` |
| 3. Go ask | No signal yet, or only the customer can answer | Interviews + surveys, `references/interviews-and-surveys.md` |

## Mode 1 — extraction framework

For every asset, extract six things:

1. **Jobs to Be Done** — functional job (the task), emotional job (how they want to feel), social job (how they want to be perceived).
2. **Pain points** — what is broken or inadequate now. Prioritize pains raised *unprompted* and with emotional language.
3. **Trigger events** — what changed that started the search. Common: team growth, new hire, missed target, an embarrassing incident, a competitor move.
4. **Desired outcomes** — success in their words. Capture exact quotes, never paraphrase.
5. **Language and vocabulary** — "we were drowning in spreadsheets" beats "manual process inefficiency". This is the copy input.
6. **Alternatives considered** — including doing nothing, hiring someone, and building internally.

Asset-specific reading order:

- **Transcripts / sales calls** — find the moment they decided to look, what they tried before, what success means to them.
- **Surveys** — segment by tier/use case/tenure *before* concluding. Flag where open-ended answers contradict multiple-choice ones (they often do).
- **Support conversations** — categorize first: bugs vs. confusion vs. missing features vs. expectation mismatch. Not all tickets are equal signal. Mine "I wish it could…".
- **Win/loss + churn notes** — wins: what tipped it, what nearly won instead. Losses: price, features, fit, or timing. Segment by reason; never average across causes.
- **NPS** — passives and detractors carry more improvement signal than promoters. A 9 with a specific complaint beats a 10 with no comment.

### Synthesis

1. Cluster by theme across assets.
2. Score **frequency x intensity** — how often it appears, how strongly it's felt.
3. Segment by profile (company size, role, use case, tenure) — do the patterns diverge?
4. Pull 5-10 **money quotes** per theme, verbatim with source and date.
5. Flag contradictions — where customers say one thing and do another.

### Quality guardrails

Label every insight before presenting it:

| Confidence | Criteria |
|---|---|
| High | Theme in 3+ independent sources, raised unprompted, consistent across segments |
| Medium | 2 sources, or prompted only, or confined to one segment |
| Low | Single source; may be an outlier; needs validation |

- **Recency window** — last 12 months is primary; 12-24 months with caution; 2+ years for baseline context only. A theme that holds across old and new data is durable.
- **Sample bias** — reviewers skew to strong opinions; tickets skew to problems, not value; Reddit skews technical and skeptical vs. mainstream buyers. Say so when generalizing.
- **Minimum viable sample** — no personas and no messaging conclusions from fewer than 5 independent data points per segment.

Full source-by-source weighting table: `references/source-guides.md`.

## Mode 2 — digital watering holes

Pick sources by ICP type, then use the per-platform playbooks and search operators in `references/source-guides.md`.

| ICP type | Primary sources |
|---|---|
| B2B SaaS / technical buyers | Reddit (role subs), G2/Capterra, Hacker News, LinkedIn, Indie Hackers |
| SMB / founders | r/entrepreneur, r/smallbusiness, Indie Hackers, Product Hunt, Facebook Groups |
| Developer / DevOps | r/devops, r/programming, Hacker News, Stack Overflow, Discord |
| B2C / consumer | App-store reviews (1-3 star), hobby subreddits, YouTube + TikTok comments |
| Enterprise | LinkedIn, G2 enterprise filter, job postings, analyst reports |

Quick routing: have a category → G2/Capterra (yours + competitors, 3-star first). Need raw language → Reddit, YouTube comments. Need triggers → LinkedIn posts, job postings, "Ask HN". Need competitive gaps → competitor 4-star reviews.

Capture per item: source (platform, URL, date) · verbatim quote · context (what prompted it) · sentiment · theme tag (`#pain` `#trigger` `#outcome` `#language` `#alternative` `#objection` `#competitor`) · profile signals (role, company size, industry). After 20-30 entries the patterns surface; quotes recurring across *unrelated* sources are the highest-confidence insights.

## Mode 3 — interviews and surveys

**Load `references/interviews-and-surveys.md` before running any interview or survey.** Headlines:

- **The first rule of customer research: you do not talk about customer research.** Framed as a study, people perform and give the socially acceptable answer. Keep it a casual chat. Don't lead, don't pitch, don't defend the product.
- **Prove yourself wrong, not right.** Research is disconfirmation, not validation.
- **Recruit the customers you want more of** — segment the CRM by high deal size, short sales cycle, low churn; take referrals from sales and CS; close every call with *"who else should we talk to?"*.
- **Keep asking why** — ladder each answer 3-5 levels to the root motivation or business outcome. Capture pain points (drive acquisition) *and* passion points (drive retention and referrals).
- **The PMF survey** — "How would you feel if you could no longer use [product]?" with the 40% "very disappointed" benchmark.
- **Survey design** — short, open-ended for language mining, never leading; multiple-choice answers are artifacts of the options you supplied.

First-party interview and survey signal outranks scraped sources when the two conflict. Analyze everything you gather back through the Mode 1 framework and confidence labels.

## ICP refinement and personas

Personas are built from research, not invented. Gate: at least 5-10 data points from one consistent segment before writing one. Structure, proxy ladder for pre-revenue products, and anti-patterns: `references/personas-and-icp.md`.

Feeding the hub: the ICP section of `plans/marketing-context.md` is owned by [[product-marketing]]. This skill supplies segment definition, trigger events, ranked pains, desired outcomes, objections, alternatives, and the vocabulary list — each with its confidence label and sources. Do not overwrite the hub silently; propose the diff.

## Market sizing (routing, not a method)

`/mk:research market` and the `market-researcher` agent claim TAM/SAM/SOM sizing. **This skill does not provide a sizing methodology** — the upstream source contains none, and none is invented here. What it *can* contribute to a sizing exercise:

- Segment definition and qualifying criteria (who is actually in the market).
- Bottom-up demand evidence: trigger frequency, alternatives in use, willingness-to-switch signals, budget/objection language from interviews.
- Falsification of a top-down number — if a segment's buyers all report a different job or a free workaround, the SAM claim is wrong.

Top-down sizing inputs (analyst reports, census/firmographic counts, public revenue benchmarks) must come from cited external sources via WebSearch/WebFetch and be marked as such. Never state a market size without a citation or a stated bottom-up derivation; if neither exists, write `[NEEDS DATA]`.

## Key concepts

- **Disconfirmation over validation** — a question that cannot return an answer you dislike is worthless. Rewrite it.
- **Falsifiable findings** — every insight ships with its confidence label, source count, and the observation that would disprove it ("how would we know this is wrong?"). Required by `.claude/workflows/marketing-rules.md` for research reports.
- **Frequency x intensity** — ranking themes on both, not on count alone; one furious customer and twelve shrugs are different signals.
- **Jobs to Be Done** — functional, emotional, and social; buyers hire a product for an outcome, not a feature.
- **Money quote** — verbatim customer language, sourced and dated, that carries a theme into copy without translation.
- **Passion points vs. pain points** — pains drive acquisition, passions drive retention and referral. Ladder for both.
- **Proxy evidence** — provisional persona input from competitor/adjacent reviews when first-party data does not exist yet; tagged as proxy, replaced as real data arrives.

## Output

- `plans/marketing/<research>/report.md` — the `/mk:research` deliverable: themes ranked by frequency x intensity, confidence-labelled findings, money quotes with sources, implications, and open questions.

Ask which deliverable(s) are wanted before generating. Options: research synthesis report · VOC quote bank (quotes by theme, for copy) · persona document (1-3) · JTBD map by segment · competitive intelligence summary (what customers say about competitors vs. you) · research gap analysis (what is still unknown and how to find it).

**PII:** redact names, emails, phone numbers, and company-identifying details from quotes written into `plans/marketing/` — per `.claude/workflows/automation-rules.md`. Quote the language, not the person.

## Before proceeding

If context is unclear, lead with (1) and (2), follow up as needed:

1. What's the goal — messaging, personas, product gaps, churn?
2. What do you already have — transcripts, surveys, tickets, reviews, nothing?
3. Which segment — all customers, a tier, churned users, lost prospects?
4. What's the product? (skip if `plans/marketing-context.md` answers it)
5. What deliverable?

Read `plans/marketing-context.md` first and skip anything it already answers.

## Cross-references

- `plans/marketing-context.md` — required hub; this skill's ICP/persona findings feed its ICP section
- `.claude/workflows/marketing-rules.md` — quality gates, no-hallucinated-metrics, falsifiable findings, output conventions
- `.claude/workflows/automation-rules.md` — PII redaction for customer data
- [[product-marketing]] — owns the ICP/positioning record this skill supplies evidence for
- [[competitor-profiling]] — competitor teardowns; pair for `/mk:research competitor`
- [[marketing-ideas]] — turns findings into tactics; pair for `/mk:research market`
- [[copywriting]] · [[cro]] · [[cold-email]] · [[content-strategy]] · [[ads]] — downstream consumers of the VOC quote bank and JTBD map
- `references/interviews-and-surveys.md` · `references/source-guides.md` · `references/personas-and-icp.md`
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, (c) 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter, `/mk:` routing and output paths, `plans/marketing-context.md` replaces the upstream `.agents/product-marketing.md` context file, PII + falsifiability gates added, upstream handoffs to skills ClauKit lacks (`churn-prevention`, `prospecting`, `marketing-plan`) re-pointed; the SparkToro tool integration referenced upstream is not shipped here.
