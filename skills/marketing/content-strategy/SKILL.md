---
name: content-strategy
description: Editorial strategy — content pillars, the 60/30/10 calendar, format and channel mix, idea scoring, distribution (ORB), repurposing, and content audits. Use when the user asks "what should I write about", "content plan", "editorial calendar", "content pillars", "blog strategy", "content ideas", "content roadmap", "content audit", or "I don't know what to write". Owns the brand/editorial layer; keyword-driven cluster planning and article production belong to the SEO stack.
allowed-tools: Read, Write, Glob, Grep
---

# Content Strategy — Pillars, Calendar, Distribution

> Content isn't overhead, it's brand surface area. Every published piece is another door a stranger can walk through, and a calendar decides how many doors you build, where they open, and who walks past them.

## When this skill activates

**Implicit:** "what should we write about", "build us a content calendar", "define our content pillars", "audit our blog", "how do we repurpose this guide", "which channels should we publish on".
**Explicit:** "Use the content-strategy skill to [task]."
**Routed from:** `content-strategist` agent (primary), `/mk:content`, `/mk:growth` (with [[marketing-ideas]]), `/mk:campaign` Phase 4–5, `.claude/workflows/marketing-workflow.md` Phase 5 Track A.

## Scope

Covers:
- **Content pillars** — the 3–5 topics the brand commits to owning, and why.
- **Editorial calendar** — cadence, the 60/30/10 split, channel mix, who ships what when.
- **Idea sourcing and scoring** — calls, support tickets, surveys, forums, competitor gaps; weighted prioritization.
- **Format discipline** — per-format production standards (post, guide, video, podcast, email) and link-earning format choice.
- **Distribution** — Create Once / Distribute Twice, the ORB funnel, platform half-lives, atomization checklists.
- **Content audits** — inventory an existing library, decide keep / improve / merge / kill.
- **Editorial infrastructure** — content modeling, draft→review→publish workflow, CMS selection.

Does NOT cover — this is the deliberate boundary with the SEO stack:
- Keyword-driven cluster trees (Pillar / Sub-Pillar / Cluster, internal-link graphs) → [[seo-cluster]].
- Prioritized keyword backlogs and write-order roadmaps → [[seo-plan]].
- Per-article outlines and briefs → [[seo-content-brief]].
- Article production (the 6-stage write → optimize → interlink → publish pipeline) → [[seo-writing]].
- Keyword metrics (volume, difficulty, SERP data) → [[seo-dataforseo]], [[seo-google]].
- Writing the actual copy → [[copywriting]], [[copy-editing]].
- Platform-native social execution → [[social-content]]. Launch-day channel plays → [[launch]].
- Technical/on-page SEO → [[seo-audit]], [[seo-technical]]. Scaled template pages → [[seo-programmatic]].

**The handoff:** this skill decides *what the brand talks about and where* — pillars, mix, cadence, channels. When a pillar is search-led, hand it to [[seo-cluster]] to model the keyword tree and to [[seo-plan]] to order the backlog; the backlog returns as the searchable lane of the calendar. Brand, opinion, and demand-creating pieces never leave this skill.

## Searchable vs shareable

Every piece must be searchable, shareable, or both. Anything that is neither is waste.

| | Searchable | Shareable |
|---|---|---|
| Job | Captures existing demand | Creates demand |
| Reader arrives via | Query | Someone else |
| Wins by | Matching intent exactly, comprehensive coverage, clear query-shaped titles | A novel insight, original data, a counterintuitive take, a story that lands |
| Compounds through | Rankings and the long tail | Links, mentions, audience growth |
| Fails when | It answers a question nobody asked, or answers it partially | It repeats consensus |

Search traffic is the foundation, so when forced to choose, prioritize searchable — but a library with no shareable pieces never gets cited, linked, or talked about.

## Content pillars

Pillars are the 3–5 topics the brand will own. Each one spawns a cluster of related pieces and is the unit the calendar allocates against.

**Four lenses for identifying them** — a strong pillar survives more than one:
1. **Product-led** — what problem does the product actually solve?
2. **Audience-led** — what does the ICP need to learn to succeed?
3. **Search-led** — where is there real query volume in the category?
4. **Competitor-led** — what are competitors ranking for, and where are the holes?

**A pillar qualifies when it** aligns with the product, matches something the audience already cares about, has search or social interest behind it, and is broad enough to carry many subtopics without repeating itself.

**Structure:** pillar hub → subtopic clusters → articles. Most libraries live fine under `/blog` with disciplined internal linking; dedicated `/guides/<topic>` URL structures are only worth it for a major topic with layered depth. Build the hub before the spokes — spokes linking up to a page that does not exist yet leak into nothing.

Once a pillar is chosen and it is search-led, the tree itself is [[seo-cluster]]'s job. Stop at "these are our pillars and this is why."

## Content types that work

**Searchable**
- **Use-case content** — `[persona] + [use-case]`. "Project management for designers." Long-tail, high intent, near-infinite supply.
- **Hub and spoke** — one comprehensive overview plus interlinked subtopics. Hub first.
- **Template libraries** — high-intent searches ("marketing plan template"), standalone value, natural product demo.

**Shareable**
- **Thought leadership** — name the thing everyone feels but hasn't articulated; challenge consensus with evidence.
- **Data-driven** — anonymized product data, public-data analysis, or original research.
- **Expert roundups** — 15–30 experts on one specific question; distribution is built in because contributors share.
- **Case studies** — Challenge → Solution → Results → Key learnings.
- **Meta content** — behind-the-scenes transparency about the business itself.

**Link-earning formats.** When backlinks are the explicit goal of a piece, format matters more than production effort. Foundation Inc.'s B2B Backlink Intelligence Report (March 2026) measured each format's share of backlinks against its share of pages — a single-vendor study of B2B SaaS sites, so treat it as directional, not as a benchmark:

| Format | Backlinks vs. page share |
|---|---|
| Statistics / data roundups | 4.25x |
| Glossary / definition pages | 1.47x |
| Interactive tools / calculators | 1.38x |
| How-to / tutorials | 1.36x |
| Original research / reports | 0.80x |
| Ultimate guides | 0.77x |
| Thought leadership | 0.74x |
| Templates / frameworks | 0.68x |

The counterintuitive read: *curating* statistics tends to out-earn *producing* original research, because writers link to whatever makes citation easiest, and original research is often cited via the roundups that aggregate it. Two implications: keep a fresh stats page for your category (cheap, compounding, and the one-line citable stats are exactly what LLMs lift — see [[seo-geo]]); and when you do run original research, publish your own stat-roundup alongside it so you capture the links your data generates. The bottom of the table is not dead — guides, templates, and thought leadership earn on rankings, conversions, and brand. Judge each piece by the job it was made for.

## Buyer-stage mapping

Map topics across the journey so the calendar is not all top-of-funnel. Modifiers are the shorthand:

| Stage | Modifiers | Sourced from |
|---|---|---|
| **Awareness** | what is, how to, guide to, introduction to | Early-call questions, forum threads |
| **Consideration** | best, top, X vs Y, alternatives, comparison | Competitive evaluations in sales calls |
| **Decision** | pricing, reviews, demo, trial | Objections, pricing pushback |
| **Implementation** | templates, examples, tutorial, setup, how to use | Support tickets, onboarding friction |

Decision- and implementation-stage content is chronically under-produced and converts hardest. Comparison and alternatives pages have their own skills — [[competitor-alternatives]], [[seo-competitor-pages]].

## Idea sourcing

Rank sources by how close they sit to a real customer.

1. **Call transcripts** — questions asked (become FAQs and posts), pain points in the customer's own words, objections to pre-empt, exact phrasing to reuse, competitor mentions. Highest-signal source there is. See [[customer-research]].
2. **Sales and support input** — repeated questions, ticket patterns, success stories, feature requests and the problem underneath them.
3. **Survey responses** — open-ended answers for topics and language; a theme mentioned by 30%+ of respondents is a priority; explicit resource requests are free briefs.
4. **Forum research** — `site:reddit.com <topic>`, `site:quora.com <topic>`, plus Indie Hackers, Hacker News, Product Hunt, industry Slack/Discord. Extract FAQs, misconceptions, live debates, terminology.
5. **Competitor content** — `site:competitor.com/blog`. Look for their top performers, what they cover repeatedly, what they have never covered, and what is outdated enough to beat. See [[competitors]].
6. **Keyword data** — if the user supplies an Ahrefs/SEMrush/GSC export, group into topic clusters, tag buyer stage and intent, flag quick wins and gaps. Acquiring and modeling that data properly is [[seo-cluster]] + [[seo-plan]]; here it is one input among six.

## Scoring and prioritization

Score each candidate 1–10 on four weighted factors, multiply by weight, sum, and rank.

| Factor | Weight | Ask |
|---|---|---|
| **Customer impact** | 40% | How often did this come up in research? What share of customers hit it? How charged is the pain? What is the LTV of customers with this need? |
| **Content-market fit** | 30% | Does it map to a problem the product solves? Do we have unique insight or customer stories? Does it lead naturally to product interest? |
| **Search potential** | 20% | Volume, competitiveness, long-tail spread, trend direction. |
| **Resource requirements** | 10% | Do we have the expertise? What research, data, or assets does it need? |

| Idea | Impact (40%) | Fit (30%) | Search (20%) | Resources (10%) | Total |
|---|---|---|---|---|---|
| Topic A | 8 | 9 | 7 | 6 | 8.0 |
| Topic B | 6 | 7 | 9 | 8 | 7.1 |

Customer impact dominates on purpose. A topic with big volume and no customer evidence behind it is a traffic play, not a content strategy.

## The calendar

**The 60/30/10 split** balances compounding against visibility:
- **60% searchable** — the foundation; demand you can capture predictably.
- **30% shareable** — thought leadership, original data, opinion; creates demand, earns links.
- **10% experimental** — new formats, channels, or bets. Cheap insurance against a stale mix.

A starting ratio, not a rule. A new blog should over-index on searchable to build a base; an established brand chasing category leadership pushes shareable up.

**Calendar row shape** — every entry carries enough to be actionable without a meeting:

| Date | Pillar | Title | Type | Searchable/Shareable/Both | Buyer stage | Format | Owner | Primary channel | Repurpose cuts | Status |
|---|---|---|---|---|---|---|---|---|---|---|

**Cadence rules:** pick a frequency the team can hold for a quarter, not a heroic month. Hubs before spokes. Batch by pillar so research amortizes. Leave slack for reactive shareable pieces — an on-trend take dies if it ships three weeks late.

## Per-format production standards

Treating content like a product means each format has a standard, not just a topic.

- **Blog post** — write 10 title options before drafting; the title does most of the work. Budget ~5 editing passes: structure, clarity, evidence, line edit, headline/SEO. Writing itself → [[copywriting]], [[copy-editing]].
- **Long-form guide** — the flagship of a pillar. Comprehensive enough to be *the* resource, with a table of contents and internal links to every spoke. Hub before spokes.
- **Video** — script the hook first, front-load the payoff, and plan the short-form clips at creation time, not after.
- **Podcast** — one interview yields a transcript, quote graphics, clips, and a written recap. Design the episode knowing it will be atomized.
- **Email** — one idea per send; the subject line is the title, so write several and pick. Sequences → [[email-sequence]], [[emails]].

## Distribution and repurposing

Creating is half the job. The philosophy is **one exceptional piece, reformatted across every channel** — not a fresh piece per platform. A flagship plus ten derived cuts beats eleven thin native posts.

Build distribution hooks in **at creation time**: subheads that stand alone as social posts, sections structured to be lifted out modularly, pull quotes and stats you already know you will graphic-ify. A well-designed guide is a distribution kit in disguise.

**ORB as a funnel** — route attention from borrowed → rented → owned:

| Layer | Channels | Funnel role | You control |
|---|---|---|---|
| **Borrowed** | Podcasts, guest posts, partnerships, PR | Discovery / breakthrough reach | Nothing |
| **Rented** | Social platforms, ad networks, marketplaces | Engagement | The content, not the audience or algorithm |
| **Owned** | Email list, blog, community, product | Conversion / retention | Everything |

**Failure modes:** *spray-and-pray* (posting everywhere with no flagship and no repurposing plan — effort scatters, nothing compounds); *platform dependency* (building on rented land that can throttle you overnight); *the ownership paradox* (most effort spent on channels the team does not control while the owned assets that actually convert get neglected).

Full spine — platform half-lives, the distribution flywheel, the per-flagship atomization checklist — in `references/content-distribution.md`. Platform-native execution is [[social-content]]; the ORB channel-type playbook is [[launch]].

## Content audits

Auditing an existing library is the fastest strategy work available: the pages already exist and already have data.

1. **Inventory** — every URL with pillar, buyer stage, format, publish date, last update, traffic, conversions, backlinks.
2. **Classify** each piece against the rubric below.
3. **Decide** in this order — improve beats create, merge beats maintain, kill beats ignore.

| Verdict | Signal | Action |
|---|---|---|
| **Keep** | Ranks and converts, still accurate | Leave it; recheck next audit |
| **Improve** | Near-miss rankings, thin sections, stale data, no internal links | Refresh — cheapest win available |
| **Merge** | Two or more pieces on the same intent competing | Consolidate into the stronger URL, redirect the rest |
| **Kill** | No traffic, no conversions, no links, off-pillar | Remove or redirect; a thin library beats a bloated one |
| **Gap** | A pillar subtopic nothing covers | Feed into the scoring table as a new idea |

Merge decisions are cannibalization calls; if the library is search-led, run them alongside [[seo-cluster]]'s cluster map so the resulting URL fits the tree.

## Key concepts

- **Brand surface area** — each published piece is an independent entry point; hundreds compound into hundreds of doorways working continuously. A piece that ships and is never distributed has almost none.
- **Content pillar** — one of 3–5 topics the brand commits to owning, the allocation unit for the calendar. Distinct from an SEO Pillar *page*, which is a specific URL in a cluster tree.
- **60/30/10** — the calendar's balance between compounding search, demand-creating share, and cheap experiments.
- **Create Once, Distribute Twice** — design the flagship so its atomized cuts already exist inside it.
- **ORB** — Owned / Rented / Borrowed; borrowed and rented reach are funnels into owned, never endpoints.
- **The ownership paradox** — the channels getting the least effort (email, blog, community) are the ones that convert and cannot be revoked.
- **Improve before create** — a near-miss existing post at 80% beats a higher-value one starting from zero.

## Process

1. Load `plans/marketing-context.md` — ICP, positioning, brand voice, forbidden words. Absent → stop and direct the user to `/mk:plan`.
2. Establish context: business goal for content (traffic / leads / awareness / thought leadership), existing library, team capacity, producible formats.
3. Mine ideas from the sources above, weighted toward customer evidence.
4. Define 3–5 pillars, each justified against the four lenses and the pillar criteria.
5. Score candidate topics; rank.
6. Shape the calendar — 60/30/10, cadence, channels, formats, owners.
7. For every search-led pillar, hand off to [[seo-cluster]] → [[seo-plan]] and slot the returned backlog into the searchable lane.
8. Attach distribution: primary channel plus the atomization cuts per flagship.
9. Validate against `.claude/workflows/marketing-rules.md` — brand voice, no invented metrics, concrete over fluffy, sources cited.

## Output

- `plans/marketing/<campaign>/content-calendar.md` — the primary deliverable the `content-strategist` agent declares. Sections: Content Pillars (with rationale and subtopic clusters), Priority Topics (scored table), Calendar (dated rows in the shape above), Distribution Plan (per-flagship channels + atomization cuts).
- `plans/marketing/<campaign>/content-audit.md` — when auditing an existing library: inventory plus keep/improve/merge/kill verdicts.
- Inline pillar or topic recommendations in the conversation, for quick checks.

Cluster trees and article backlogs are written by their own skills to their own paths — do not duplicate them here; link to them from the calendar.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice)
- `references/content-distribution.md` — ORB funnel, platform half-lives, distribution flywheel, atomization checklist
- `references/editorial-infrastructure.md` — content modeling, editorial workflow, CMS selection
- [[seo-cluster]] · [[seo-plan]] · [[seo-content-brief]] · [[seo-writing]] — the SEO content stack this skill hands search-led pillars to
- [[copywriting]] · [[copy-editing]] — writing and editing the pieces
- [[social-content]] · [[launch]] — distribution execution and channel playbooks
- [[customer-research]] · [[competitors]] · [[marketing-ideas]] — idea sourcing
- [[analytics]] — measuring what the calendar produced
- `.claude/skills/integrations/wordpress-rest/SKILL.md` — publishing path used by `/mk:content publish`
- `.claude/workflows/marketing-rules.md` — quality gates
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` and adapted for ClauKit. Adaptations: ClauKit frontmatter, `/mk:` namespace, `plans/marketing-context.md` replaces the upstream `.agents/product-marketing.md` context file, keyword-cluster and article-production material handed to the claude-seo stack ([[seo-cluster]], [[seo-plan]], [[seo-content-brief]], [[seo-writing]]), content-audit rubric added for the `content-strategist` agent's audit path, upstream eval harness and unmapped skill references dropped.
