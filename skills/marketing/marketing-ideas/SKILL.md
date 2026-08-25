---
name: marketing-ideas
description: Marketing idea generation for SaaS and software products — a catalogue of 139 proven tactics across 17 categories (content, SEO, free tools, paid, social, email, partnerships, events, PR, launches, product-led, unconventional, marketplaces), filtered against stage, budget, timeline, and goal into a short ranked shortlist. Triggers on "marketing ideas", "growth ideas", "how do I market this", "marketing strategies", "marketing tactics", "ways to promote", "ideas to grow", "what else can I try", "I don't know how to market this", "brainstorm marketing", "what marketing should I do", "we're stuck on growth".
allowed-tools: Read, Write, Glob, Grep
---

# Marketing Ideas

> A list of 139 tactics is not a strategy — the value is the filter. This skill picks the three to five ideas that survive this product's stage, budget, timeline, and goal, and says how to start each one.

## When this skill activates

**Implicit:** "we need marketing ideas", "how do I grow this", "what should I try next", "we're out of ideas", "what are other SaaS companies doing", "give me growth tactics", "cheap ways to get users".
**Explicit:** "Use the marketing-ideas skill to [task]."
**Routed from:** `/mk:research market` (paired with [[customer-research]] — market sizing plus the tactic landscape), `/mk:growth referral` and `/mk:growth free-tool`, the `market-researcher` and `content-strategist` agents, and `.claude/workflows/marketing-workflow.md` Phase 1 Track B (trends) and Phase 8 (influencer/promotion tactics).

## Scope

Covers:
- Generating a ranked shortlist of tactics for a specific product, stage, and constraint set — never a dump of the whole catalogue.
- The 139-idea catalogue itself: 17 categories, stable idea numbers, one line each (`references/idea-catalogue.md`).
- Filtering by stage (pre-launch / early / growth / scale), by budget (free / low / medium / high), and by timeline (quick win / medium / long).
- Goal-driven shortlists: leads fast, building authority, low-budget growth, product-led growth, enterprise sales.
- Guerrilla and unconventional plays in depth — the direct-mail 3-rule framework, ROI discipline, and case library (`references/guerrilla-marketing.md`).
- Hand-off: naming which ClauKit skill executes each selected idea.

Does NOT cover:
- Executing the chosen tactic. This skill stops at "here are the first three steps" — [[content-strategy]] builds the calendar, [[ads]] runs the paid play, [[emails]] and [[email-sequence]] build the sequences, [[launch]] runs the launch, [[cro]] fixes the conversion path.
- ICP, positioning, brand voice, market sizing → [[customer-research]] and `plans/marketing-context.md`.
- Competitor tactic teardowns and what rivals actually run → [[competitor-profiling]].
- A full multi-channel campaign plan with phases and owners → `/mk:campaign` and `.claude/workflows/marketing-workflow.md`.

## Selection process

1. **Load context.** Read `plans/marketing-context.md` for product, ICP, positioning, stage, and constraints. Ask only for what it does not already answer.
2. **Fill the four gaps** (ask, do not assume):
   - Current stage and the single main growth goal.
   - Budget and team size.
   - What has already been tried — what worked, what did not.
   - Which competitor tactics they admire.
3. **Filter the catalogue** through stage, then budget, then timeline. An idea reaches the shortlist only if it passes all three gates.
4. **Cut to 3-5.** More than five is a dump, not a recommendation. Rank by fit, not by how interesting the idea is.
5. **Write each up in the recommendation format** below.
6. **Name the executing skill** for each so the user can move straight to it.

## Gate 1 — stage

| Stage | Where the leverage is | Anchor ideas |
|---|---|---|
| Pre-launch | Build the list and the launch moment | Waitlist / early-access referrals (#79), early-access pricing (#81), Product Hunt prep (#78) |
| Early | Owned, compounding, founder-powered | Content & SEO (#1-10), community (#35), founder-led email (#47) |
| Growth | Paid and borrowed audiences | Paid acquisition (#23-34), partnerships (#54-64), events (#65-72) |
| Scale | Category ownership | Brand campaigns, international (#131-132), media acquisitions (#73) |

Do not sell a scale tactic to an early-stage product. Conference sponsorship at pre-launch is spend without a funnel behind it.

## Gate 2 — budget

| Budget | What is actually available |
|---|---|
| Free | Content & SEO, community building, social presence, comment marketing (#44) |
| Low | Targeted ads, sponsorships, free tools (#14-22) |
| Medium | Events, partnership programs, PR |
| High | Acquisitions, own conference, brand campaigns |

Budget is a hard gate, not a preference. Team size is part of it — content and community are free in cash and expensive in hours.

## Gate 3 — timeline

- **Quick wins** — ads, email, social posts. Days to weeks. Use when the goal has a deadline.
- **Medium-term** — content, SEO, community. Weeks to months.
- **Long-term** — brand, thought leadership, platform effects. Quarters. Only worth starting if the company can wait.

A shortlist should normally mix one quick win with one compounding play, so something moves while the slow thing builds.

## Goal shortlists

| Goal | First-look ideas |
|---|---|
| Leads fast | Google Ads (#31, high intent), LinkedIn Ads (#28, B2B targeting), engineering as marketing (#15, free-tool lead gen) |
| Building authority | Conference speaking (#70), book (#104), podcast (#107) |
| Low-budget growth | Easy keyword ranking (#1), Reddit marketing (#38), comment marketing (#44) |
| Product-led growth | Viral loops (#93), powered-by badges (#87), in-app upsells (#91) |
| Enterprise sales | Investor marketing (#133), expert networks (#57), conference sponsorship (#72) |

These are starting points to filter, not answers. Every one still passes through the three gates.

## Recommendation format

For each shortlisted idea, write:

- **Idea name** (with catalogue number) — one-line description.
- **Why it fits** — the specific connection to their stage, audience, or constraint. Not "this works well for SaaS".
- **How to start** — the first two to three concrete steps, doable this week.
- **Expected outcome** — what success looks like, in their terms. Describe the shape of the result; never quote a conversion rate or multiplier the product has not measured.
- **Resources needed** — time, budget, skills.
- **Executes with** — the ClauKit skill that builds it (`references/idea-catalogue.md` maps every category).

## Guerrilla and unconventional plays

The unconventional block (#110-122) is where small teams outrun budget, and it has its own discipline — two principles govern it: **think in stories, not campaigns** (people share a story worth retelling, not a funnel) and **test small before going big** (a guerrilla idea is a hypothesis, proven on a handful of targets first).

Physical mail is the most under-used channel and must pass all three rules — **relevance**, **relationship-building**, **precision targeting** — plus the ROI discipline: a high-cost package only makes sense against a hand-qualified list where one closed deal pays for dozens of packages. Full framework, the ROI math, and the named case library: `references/guerrilla-marketing.md`.

## Key concepts

- **The filter is the deliverable** — the catalogue is public knowledge; the ranked 3-5 that survive this product's constraints is the work.
- **Three gates** — stage, budget, timeline. An idea that fails any one is off the list regardless of how well it worked elsewhere.
- **Steal the pattern, not the prop** — a case study's value is its mechanism, not its execution. Copying the floatie is not the lesson.
- **Story over campaign** — distribution comes from something worth retelling, not from a channel.
- **Test small before scaling** — every idea enters as a hypothesis with a cheap version.
- **Idea numbers are stable** — cite `#31` so a recommendation traces back to the catalogue entry.

## Output

- `plans/marketing/<campaign>/marketing-ideas.md` — the ranked shortlist in the recommendation format, plus the gates applied and what was rejected and why.
- `plans/marketing/<campaign>/growth-<tactic>.md` — when routed from `/mk:growth referral` or `/mk:growth free-tool`, matching that command's declared output path.
- `plans/marketing/<research>/report.md` — the tactic-landscape section, when routed from `/mk:research market`.
- Inline shortlist in conversation, for a quick "what should we try" question.

## Cross-references

- `plans/marketing-context.md` — required hub (product, ICP, positioning, stage, constraints); hard-fail if absent
- `references/idea-catalogue.md` — all 139 ideas, 17 categories, with the executing skill per category
- `references/guerrilla-marketing.md` — direct-mail 3-rule framework, ROI discipline, case library
- [[customer-research]] — ICP, interviews, and the customer language idea #139 depends on
- [[competitor-profiling]] — what competitors actually run, feeding ideas #11-13
- [[content-strategy]] — turns selected content/format ideas into a calendar
- [[launch]] — executes the launch block (#77-86)
- [[ads]] / [[ad-creative]] — execute the paid block (#23-34)
- [[emails]] / [[email-sequence]] / [[cold-email]] — execute the email and outreach blocks
- [[seo-programmatic]] — executes #4; [[competitors]] and [[competitor-alternatives]] execute #11
- [[cro]] / [[user-onboarding]] / [[signup]] — execute the product-led block (#87-96)
- `.claude/workflows/marketing-workflow.md` — Phase 1 (research) and Phase 8 (promotion) entry points
- `.claude/workflows/marketing-rules.md` — quality gates (no invented metrics, brand voice, output conventions)
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, (c) 2025 Corey Haines) and adapted for ClauKit: the 139-idea catalogue and the guerrilla deep dive are preserved in `references/`; the upstream `.agents/product-marketing.md` context convention is replaced by `plans/marketing-context.md`; the eval harness and the upstream `marketing-plan` / `free-tools` / `referrals` cross-references are dropped (ClauKit does not ship those skills — `/mk:plan`, [[content-strategy]], and [[cro]] cover that ground); category-to-skill execution mapping added.
