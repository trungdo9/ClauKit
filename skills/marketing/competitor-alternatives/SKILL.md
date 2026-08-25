---
name: competitor-alternatives
description: Alternatives pages — singular "<Competitor> alternative" (you as the alternative) and plural "<Competitor> alternatives" (roundup). Covers why-people-switch framing, the criteria framework, honest competitor representation, migration sections, switcher social proof, CTA placement. Triggers on "alternative page", "alternatives to X", "best X alternatives", "tools like X", "switch from X". For head-to-head vs pages, see competitors.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Competitor Alternatives Pages

> Someone searching "<Competitor> alternative" has already decided to leave. The page does not have to sell them on leaving — it has to be the most honest, most complete map of where to go next, with you clearly on it.

## When this skill activates

**Implicit:** "alternatives page", "alternative to X", "best X alternatives", "tools like X", "page for people switching off X", "capture X's unhappy users", "roundup of competitors to X".
**Explicit:** "Use the competitor-alternatives skill to [task]."
**Routed from:** `/mk:research competitor`, `/mk:content` when the asset is an alternatives page, [[seo-competitor-pages]] when the chosen page type is alternatives rather than vs.

## Scope

Covers:
- **Singular alternative** pages — `/alternatives/<competitor>`, positioning your product as *the* alternative to one named competitor.
- **Plural alternatives** pages — `/alternatives/<competitor>-alternatives`, a genuine roundup of 4–7 options with you among them.
- Why-people-leave framing, the evaluation-criteria framework, and per-option "who it's for" verdicts.
- Honest, verifiable representation of competitors (the fairness rules below).
- Migration sections and switcher social proof.
- The alternatives index/hub page, its internal linking, and CTA placement.

Does NOT cover:
- Head-to-head "you vs <Competitor>" and "<A> vs <B>" pages → [[competitors]]. Different reader, different page. Do not write vs-page structure here.
- Gathering the underlying competitor intelligence — pricing, feature audit, review mining, teardowns → [[competitor-profiling]]. This skill consumes that research; it does not perform it.
- Comparison-page schema, feature-matrix markup, comparison-intent keyword mechanics → [[seo-competitor-pages]], [[seo-schema]].
- Generating alternatives pages at scale from a data source → [[seo-programmatic]].
- Sentence-level copy polish → [[copywriting]].

## Fairness and accuracy rules (non-negotiable)

The reader is mid-evaluation and will open the competitor's own site in the next tab. Every inaccuracy is a caught lie.

1. **Acknowledge real strengths.** State plainly what the competitor is genuinely better at. A roundup with no competitor strengths reads as an ad and converts as one.
2. **Be accurate about your own limits.** Name where you are the wrong choice. This is the single strongest trust signal on the page.
3. **Never misrepresent a competitor feature.** No "they don't have X" unless verified this quarter. Missing, limited, and paid-add-on are three different claims.
4. **Attribute complaints, don't invent them.** Weaknesses come from review mining ([[competitor-profiling]]) or your own use of the product — quoted or paraphrased with a source, never fabricated.
5. **Date the comparison.** Pricing and features move. Put a visible "last verified" date on the page and re-verify quarterly.
6. **Real alternatives only.** On a plural page, include 4–7 options that a reasonable evaluator would actually shortlist, including ones that beat you on some axis. Padding the list with non-competitors to look complete is transparent.
7. **No invented metrics.** Per `.claude/workflows/marketing-rules.md` §2 — cite or mark `[NEEDS DATA]`.

## Format 1 — singular: "<Competitor> alternative"

**Reader:** actively leaving one named product; wants one confident recommendation, not homework.
**URL:** `/alternatives/<competitor>` or `/<competitor>-alternative`.
**Keywords:** `<Competitor> alternative`, `alternative to <Competitor>`, `switch from <Competitor>`.

Section order:
1. **Why people leave <Competitor>** — validate the pain in their words, sourced from reviews and switcher interviews. This is the section that earns the rest of the read.
2. **You as the alternative** — one-paragraph positioning: what you built instead, and for whom.
3. **Detailed comparison** — features, pricing, service/support, written as paragraphs first and a table second.
4. **Who should switch — and who should stay.** Explicit. Naming who should stay on the competitor is what makes the rest credible.
5. **Migration path** — what transfers, what needs rebuilding, effort estimate, support offered.
6. **Social proof from switchers** — quotes specifically from people who left that competitor, with name, role, company.
7. **CTA.**

## Format 2 — plural: "<Competitor> alternatives"

**Reader:** earlier in the journey, still building a shortlist; wants a survey, not a pitch.
**URL:** `/alternatives/<competitor>-alternatives`.
**Keywords:** `<Competitor> alternatives`, `best <Competitor> alternatives`, `tools like <Competitor>`.

Section order:
1. **Why people look for alternatives** — the common pain points, aggregated.
2. **What to look for in an alternative** — a criteria framework (3–6 dimensions). This is the highest-leverage section: it frames the category on the axes where you win, without claiming a win.
3. **The alternatives** — 4–7 real options. You first or prominent, but every entry gets a fair write-up.
4. **Summary comparison table.**
5. **Detailed breakdown per alternative** — what it is, strengths, limitations, pricing, best for.
6. **Recommendation by use case** — "if you need X, pick Y" across the whole list, including entries that are not you.
7. **CTA.**

**AI-answer expectation.** These pages often earn *citations* in AI answers, but whether an assistant *recommends* your brand from them depends on offsite consensus — reviews, forums, analyst coverage. For an emerging brand, a self-published roundup can surface your competitors in the AI answer while you get only the citation. Publish for search intent and category framing; set expectations accordingly. Structuring for citation → [[seo-geo]].

## Section craft

- **TL;DR first.** Scanners decide in the first screen. Two or three sentences: what the competitor is good at, where it falls down, who each option suits.
- **Paragraphs before tables.** A checkmark grid says *whether*; a paragraph says *why it matters and when*. Every dimension gets prose, then the table summarizes.
- **Tables that say something.** Replace checkmark/cross glyphs with a phrase — "full support, including <detail>" vs "basic, capped at <limit>". Group rows by category (core functionality, collaboration, integrations, security/compliance, support).
- **Pricing beyond the sticker.** Tier-by-tier, what is included, add-ons and hidden costs, and a worked total for one realistic team size.
- **Migration is a conversion section, not an appendix.** Switching cost is the top objection on an alternatives page. Answer it concretely: what exports, what does not, how long, who helps.
- **Switcher proof beats generic proof.** One quote from someone who left that exact competitor outperforms five general testimonials.

## Ranking intent and internal linking

| Page | Primary keywords | Intent |
|---|---|---|
| Singular alternative | `<Competitor> alternative`, `alternative to <Competitor>` | Leaving, wants a destination |
| Plural alternatives | `<Competitor> alternatives`, `best <Competitor> alternatives`, `tools like <Competitor>` | Shortlisting, wants options |

- Build an **alternatives index** at `/alternatives` — intro on why people switch to you, then every alternative page with a one-line differentiator. It ranks for broad category terms and passes equity down.
- Cross-link plural → singular (roundup entry to the deep page) and singular → related comparisons.
- Footer: an "Alternatives to <X>" column of up to 8 competitors by search volume, plus "View all". Only list formats you have actually built. The `/vs` footer column belongs to [[competitors]].
- FAQ schema on "What is the best alternative to <Competitor>?" is usually worth it → [[seo-schema]].

## CTA placement

- One primary action per page; the secondary action is always lower-commitment (migration guide, comparison PDF, demo).
- Place CTAs after the sections that resolve doubt — after "who should switch" and after "migration" — not only at the bottom.
- On plural pages, the CTA sits with *your* entry and at the end; do not interrupt a competitor's write-up with a pitch. It reads as bad faith and it is.
- Full CTA and friction rules → [[cro]] and `.claude/workflows/cro-framework.md`.

## Key concepts

- **Departure intent** — the alternatives searcher has already made the leave decision; persuasion effort goes into *where to*, not *whether to*.
- **Criteria framing** — defining what a good alternative looks like is more persuasive than claiming to be one.
- **Honest-loss sections** — explicitly naming who should not switch; the credibility engine of the whole format.
- **Switching cost** — the real objection; migration content is the answer to it.
- **Centralized competitor data** — one file per competitor feeds every alternatives page, so a pricing change is a one-file edit (see `references/alternatives-templates.md`).

## Process

1. Load `plans/marketing-context.md` — ICP, positioning, brand voice, forbidden words, known competitors.
2. Confirm the format: one named competitor and switch intent → singular; shortlist intent or "best/tools like" phrasing → plural. Two named products → stop, that is [[competitors]].
3. Pull or request competitor data ([[competitor-profiling]]). Missing pricing or feature facts are blockers, not guesses.
4. Draft to the section order above, prose before tables.
5. Run the fairness checklist — every competitor claim traced to a source, every weakness of your own stated once.
6. Add migration, switcher proof, CTAs, last-verified date.
7. Add the page to the alternatives index and footer.

## Output

- `plans/marketing/<campaign>/alternatives/<competitor>-alternative.md` — singular page copy (URL, meta, full sections, tables, CTAs).
- `plans/marketing/<campaign>/alternatives/<competitor>-alternatives.md` — plural roundup.
- `plans/marketing/<campaign>/alternatives/index.md` — hub page plan + footer link set.
- `plans/marketing/<campaign>/competitor-data/<competitor>.yaml` — centralized competitor record (shared with [[competitors]]).
- A prioritized page-set plan when more than one competitor is in scope.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice)
- `references/alternatives-templates.md` — section templates, competitor-data schema, index/footer patterns
- [[competitors]] — head-to-head vs pages (you vs competitor, competitor vs competitor)
- [[competitor-profiling]] — the research that feeds this skill
- [[seo-competitor-pages]] — page-format SEO mechanics, feature matrices, comparison schema
- [[seo-programmatic]] — alternatives pages at scale
- [[seo-geo]] — AI-answer citation structuring
- [[cro]] — CTA and friction rules
- [[copywriting]] — copy polish
- `.claude/workflows/marketing-rules.md` — §2 no invented metrics, §3 quality gates, §7 anti-patterns

## Provenance

Imported from `coreyhaines31/marketingskills` (`competitors` skill, MIT, © 2025 Corey Haines) and adapted for ClauKit. Upstream's single skill covered four page formats; ClauKit splits them — the two alternatives formats (singular, plural) live here, the two vs formats live in [[competitors]]. Carried over: the honesty/fairness principles, both alternatives page structures, section templates, centralized competitor-data architecture, alternatives index and footer patterns, AI citations-vs-recommendations caveat. Dropped: the `sales-enablement` route for internal battle cards (no such skill in ClauKit — closest is [[competitor-profiling]]), and upstream's `.agents/product-marketing.md` context lookup, replaced by ClauKit's `plans/marketing-context.md` hub. Research process delegated to [[competitor-profiling]] rather than duplicated.
