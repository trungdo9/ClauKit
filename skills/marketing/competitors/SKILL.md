---
name: competitors
description: Head-to-head "vs" comparison pages — "[You] vs [Competitor]" and "[Competitor A] vs [Competitor B]". Page structure, paragraph-level feature/pricing/support comparison, honest who-it's-for verdicts, migration sections, switcher social proof, and the fairness rules that keep a comparison credible. Triggers on "vs page", "comparison page", "X vs Y", "how do we compare to X", "head-to-head", "compare us against", "competitor comparison page", "battle card page".
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Competitors — Head-to-Head Comparison Pages

> A "vs" page is read by someone who has already shortlisted two names and wants permission to stop deciding. The page that wins is not the one that flatters itself hardest — it is the one that tells the reader honestly which of the two they should buy.

## When this skill activates

**Implicit:** "write a vs page", "[Product] vs [Product] comparison", "how do we compare to X", "head-to-head page", "compare us against our competitor", "comparison landing page", "we need a versus page for X".
**Explicit:** "Use the competitors skill to [task]."
**Routed from:** `/mk:research competitor` (alongside [[competitor-profiling]] and [[competitor-alternatives]]), the `market-researcher` agent's skill set.

## Scope

Covers:
- Two page formats only: **You vs [Competitor]** and **[Competitor A] vs [Competitor B]**.
- Section-by-section page structure for both formats, with copy templates.
- Paragraph-level comparison by category — features, pricing, service and support — that explains *why* a difference matters rather than listing checkmarks.
- Comparison-table design that carries information instead of ticks.
- The two-sided "who should choose each" verdict, including the honest case for the competitor.
- Migration/switching sections and switcher-sourced social proof.
- Fairness and accuracy rules for representing a competitor in public copy.
- CTA placement and restraint inside competitor-facing sections.
- The `/vs` (or `/compare`) index page and the footer column that feeds it.

Does NOT cover:
- **"[Competitor] alternative(s)" listing pages** (singular switch-intent and plural roundup formats, the "what to look for in an alternative" criteria framework, the `/alternatives` index) → [[competitor-alternatives]]. A vs page argues between two named products; an alternatives page serves a reader who has already decided to leave one and wants a shortlist.
- **Competitor research and teardowns** — signing up for the product, review mining, pricing archaeology, the per-competitor profile that a vs page consumes → [[competitor-profiling]]. This skill assumes that profile exists; it does not produce it.
- **The SEO layer of comparison pages** — comparison-intent keyword tables, title-tag and H1 formulas, Product/SoftwareApplication/ItemList JSON-LD, rich-results eligibility, breadcrumbs, roundup and "best [category] tools" page types → [[seo-competitor-pages]].
- Writing polish and voice → [[copywriting]], [[copy-editing]]. Generating vs pages at scale from a data table → [[seo-programmatic]].

### Boundary with [[seo-competitor-pages]]

Both skills touch vs pages; they own different deliverables and must not be run as substitutes.

| Question | Owner |
|---|---|
| What keyword does this page target, what goes in the title tag, what schema does it emit? | [[seo-competitor-pages]] |
| What does the page *argue*, section by section, and in what words? | this skill |
| Feature-matrix layout, cell-level sourcing conventions, "as of [date]" pricing disclaimers | [[seo-competitor-pages]] |
| Whether the matrix should exist at all versus a paragraph comparison, and what the matrix leaves unsaid | this skill |
| Alternatives pages, category roundups, standalone comparison-table pages | [[seo-competitor-pages]] for the SEO brief, [[competitor-alternatives]] for the copy |
| Migration section, switcher testimonials, the two-sided verdict | this skill |

Rule of thumb: if the deliverable is a ranking or markup decision, it belongs to [[seo-competitor-pages]]; if the deliverable is prose that a prospect reads and acts on, it belongs here. The fairness rules below and that skill's fairness guidelines are the same ruleset stated at different altitudes — no conflict, and neither overrides [[seo-content]]'s truth-only rule.

## Core principles

1. **Honesty builds trust.** Acknowledge competitor strengths. Be accurate about your own limitations. Never misrepresent a competitor feature. The reader is comparing right now, in another tab — they will verify, and one caught exaggeration discredits the whole page.
2. **Depth over surface.** A checklist proves nothing. Explain why each difference matters, for whom, and in what scenario.
3. **Help them decide.** Different tools fit different needs. Say plainly who each product is best for. Reducing evaluation friction converts better than winning every row.
4. **One source of truth per competitor.** Every vs page pulls from the same competitor profile, so a pricing change is corrected once and propagates. See [[competitor-profiling]] for the profile format.

## Format 1 — You vs [Competitor]

**Search intent:** the reader is directly comparing you against one named competitor.
**URL pattern:** `/vs/[competitor]` or `/compare/[you]-vs-[competitor]`.

Page structure:

1. **TL;DR summary** — the key differences in two or three sentences, above the fold, for scanners.
2. **At-a-glance comparison table** — the summary view, not the whole argument.
3. **Detailed comparison by category** — features, pricing, support, ease of use, integrations. One subsection per category, each with prose.
4. **Who [You] is best for.**
5. **Who [Competitor] is best for** — written to be genuinely useful, not as a straw man.
6. **What customers say** — testimonials from people who switched.
7. **Migration support** — what transfers, what does not, what help exists.
8. **CTA.**

## Format 2 — [Competitor A] vs [Competitor B]

**Search intent:** the reader is comparing two competitors and has not thought about you at all.
**URL pattern:** `/compare/[competitor-a]-vs-[competitor-b]`.

Page structure:

1. **Overview of both products** — neutral, informative, no early pitch.
2. **Comparison by category** — the same category treatment as Format 1, applied to two products you do not own.
3. **Who each is best for** — a real verdict between them.
4. **The third option** — introduce yourself here, after the reader has been served.
5. **Comparison table including all three.**
6. **CTA.**

**Why it works:** it captures search demand for competitor terms you would otherwise never rank for, and positions you as someone who understands the category. **Why it fails:** if the neutral half is thin or visibly rigged toward the reveal, the page reads as an ad and loses both the traffic and the credibility. Earn the introduction by answering the actual question first.

## Section craft

### TL;DR summary

Every vs page opens with one. Name the competitor's real strength, their real weakness, your focus, your differentiator, and a two-way "choose X if / choose Y if". Scanners who read only this block should still leave with a correct answer.

### Paragraph comparisons, not just tables

For each dimension, write a paragraph: how the competitor approaches it, where that works well, where it strains — then your approach, the benefit, and the honest tradeoff. Tables answer *what*; paragraphs answer *why it matters to you*, which is the question that actually moves a decision.

### Feature comparison

Per category: two or three sentences on how each product handles it, an explicit strengths list, an explicit limitations list — for **both** products — then a bottom line that names the scenario where each wins.

### Pricing comparison

Tier-by-tier table, what each tier actually includes, hidden costs (add-ons, implementation, overages, per-seat creep), and a worked total-cost figure for one concrete team size. Do not compute a total from numbers you have not verified.

### Service and support

Documentation quality, response times or SLA where published, support channels, onboarding, and at which tier a CSM appears. Characterize support quality from sourced review themes, not impression.

### Who it's for

Two explicit lists plus a one-or-two-sentence ideal-customer persona for each side. The competitor's list must be a list a reasonable prospect would find accurate.

### Migration

What transfers, what needs reconfiguration and roughly how much effort, what migration support you actually offer, a realistic timeline, and a quote from someone who made the move. Migration friction is the single most common reason a convinced reader still does not switch.

### Social proof

Switcher testimonials outrank generic ones on a vs page — the reader wants evidence from people who faced this exact choice. Attribute every quote to a real name, role, and company.

Full copy templates for all of the above: [references/vs-page-templates.md](references/vs-page-templates.md).

## Comparison-table design

- **Beyond checkmarks.** Replace a tick with what the support actually is: "Full support, including nested rules" versus "Basic, single-condition only". A tick that hides a real limitation on your side is the fastest way to get the page called out.
- **Organize by category.** Core functionality, collaboration, integrations, security and compliance, support and service — grouped rows beat one long undifferentiated list.
- **Ratings only where they mean something,** and always with a note explaining the score. An unexplained star rating is an assertion, not evidence.
- **Never leave a cell guessed.** If a data point is not public, write "Not publicly available" rather than inferring one.
- Matrix layout mechanics and per-cell sourcing conventions live in [[seo-competitor-pages]].

## Fairness rules (non-negotiable)

These are load-bearing. A vs page is public copy about a named third party; getting it wrong is both a trust failure and a legal exposure.

- **Verify before publishing.** Every competitor claim must be checkable against a public source — their site, their docs, their pricing page, a review platform.
- **No misrepresentation.** Never describe a competitor feature as absent when it exists, as limited when it is not, or in language chosen to imply a defect the source does not support.
- **Acknowledge their strengths in your own voice,** not grudgingly and not buried. The reader already knows the competitor is good at something; pretending otherwise costs you the whole page.
- **State your own weaknesses.** A vs page that loses zero rows is not believed.
- **Date everything volatile.** Pricing and feature claims carry an "as of" date and a review cadence — quarterly at minimum, immediately when a competitor ships a major change or a customer reports a discrepancy.
- **Disclose that the page is yours.** Formats 1 and 2 both need the reader to know whose site they are on, Format 2 especially.
- **Cite sources** for review-derived characterizations, and never present an aggregated complaint theme as a verified fact about the product.
- **Stale is unfair.** A comparison that was accurate a year ago and is wrong today is still a misrepresentation. Freshness is part of the fairness obligation, not a separate SEO chore.

## CTA placement

- A primary CTA above the fold, next to the TL;DR, for readers who arrive already decided.
- A CTA after the comparison table, where the summary view has just done its work.
- A closing CTA with the final recommendation.
- **No CTAs inside competitor-description sections.** Interrupting an honest account of the competitor with a pitch reads as bias and undoes the credibility the section just bought.
- On Format 2, hold every CTA until after "the third option" — a CTA above a neutral comparison exposes the page as promotional before it has earned attention.

## Index page and footer

A `/vs` (or `/compare`) index collects both formats: one section for "[You] vs Competitors", one for head-to-head "[A] vs [B]" pages, plus a short methodology note and a CTA. Keep it current — every new comparison page gets added, and each page links back.

In the site footer, a "vs" column with up to eight comparisons (ordered by search demand) plus a "View all" link distributes link equity sitewide and helps both crawlers and evaluating visitors find the set. Only build a column for a format you have actually published. The parallel "Alternatives to [X]" footer column belongs to [[competitor-alternatives]].

## Key concepts

- **Comparison intent** — the reader knows both names and wants a verdict, not an introduction to the category. Every section either helps them decide or is cut.
- **Two-sided verdict** — naming who should buy the competitor is the mechanism that makes your own recommendation believable. It is a conversion device, not a concession.
- **Switcher proof** — social proof from customers who moved off the named competitor, which is qualitatively stronger on a vs page than general testimonials.
- **Migration friction** — the gap between "convinced" and "switched"; the migration section exists to close it.
- **Centralized competitor data** — one profile per competitor feeding every page, so accuracy is maintained once ([[competitor-profiling]] owns the profile).
- **Format 2 patience** — on a competitor-vs-competitor page, the value you deliver before mentioning yourself is what buys the right to mention yourself.

## Output

- `plans/marketing/<campaign>/vs-pages/<you>-vs-<competitor>.md` — full page copy: URL, TL;DR, comparison table, category-by-category prose, both who-it's-for sections, migration, social proof slots, CTAs.
- `plans/marketing/<campaign>/vs-pages/<a>-vs-<b>.md` — same for the competitor-vs-competitor format.
- `plans/marketing/<campaign>/vs-pages/plan.md` — recommended vs pages in priority order, plus the `/vs` index and footer column structure.
- Any unverified data point is emitted as `[NEEDS DATA]` or "Not publicly available", never guessed.

## Cross-references

- `plans/marketing-context.md` — required hub (own positioning, ICP, differentiators, brand voice, forbidden words). Read before asking the user anything; ask only for what it does not cover.
- [[competitor-alternatives]] — the "[Competitor] alternative(s)" listing formats, the other half of this split
- [[competitor-profiling]] — competitor research, teardowns, and the per-competitor data profile this skill consumes
- [[seo-competitor-pages]] — keyword targeting, title formulas, schema, matrix mechanics for comparison pages
- [[seo-programmatic]] — generating vs pages at scale from centralized competitor data
- [[seo-schema]] — FAQ and Product JSON-LD for the published page
- [[copywriting]] / [[copy-editing]] — comparison copy voice and polish
- [[cro]] — CTA and conversion review of the finished page
- [[product-marketing]] — positioning and differentiator source material
- `.claude/workflows/marketing-rules.md` — content quality gates (no hallucinated metrics, brand voice, E-E-A-T)
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for KitForge.

Adaptations: the upstream `competitors` skill covered four page formats; ClauKit splits it by reader intent, so this skill carries **only** Formats 3 and 4 (you-vs-competitor, competitor-vs-competitor) plus the vs-relevant halves of Essential Sections, Content Architecture, and the section templates. Formats 1 and 2 (singular and plural alternatives) moved to [[competitor-alternatives]]; the Research Process and centralized competitor-profile schema moved to [[competitor-profiling]]; the SEO Considerations block (keyword table, schema) was dropped in favour of the existing [[seo-competitor-pages]] skill.

Dropped upstream mechanisms ClauKit does not have: the `.agents/product-marketing.md` context file (ClauKit uses `plans/marketing-context.md`); the `sales-enablement` skill referenced for internal battle cards and objection docs (no ClauKit equivalent — battle-card requests are served here as page copy or by [[competitor-profiling]]); the `ai-seo` citations-vs-recommendations reference, which upstream attached to the plural-alternatives format and which has no direct ClauKit counterpart ([[seo-geo]] is the nearest); and the skill's `evals/evals.json` suite, which has no place in the ClauKit skill format.
