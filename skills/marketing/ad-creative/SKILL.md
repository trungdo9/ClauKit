---
name: ad-creative
description: Generate, iterate, and scale paid ad creative — headlines, descriptions, primary text, static concepts, hooks, and video scripts for Google, Meta, LinkedIn, TikTok, and X. Triggers on "ad copy variations", "generate headlines", "RSA headlines", "bulk ad copy", "write me some ads", "Facebook/Google/LinkedIn ad copy", "creative testing", "ad iterations", "static ads", "ad templates", "iMessage / chat-reveal / ChatGPT / Apple Notes / AirDrop ad", "motion or faceless video ad", "UGC / greenscreen ad", "TikTok or Reels ad format", "which ad format to make", "Meta ad format tier list", "hook writing", "creative strategy", "creative roadmap", "creative retro", "creative review page". Campaign strategy, targeting, and budgets → ads. Landing-page copy → copywriting.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Ad Creative — Generation, Iteration, and Format Selection

> Ungrounded ad generation produces plausible ads, not converting ones. This skill grounds every concept in real winning ads, real reviews, and real ad comments — then produces copy that fits the platform's character limits on the first pass.

## When this skill activates

**Implicit:** "write me 20 headlines for this campaign", "our Meta ads are fatiguing, give me new angles", "turn this performance CSV into the next round of creative", "what ad format should we make next", "script a UGC ad".
**Explicit:** "Use the ad-creative skill to [task]."
**Routed from:** `/mk:ads creative` (with [[copywriting]]), `/mk:ads google` and `/mk:ads meta` (with [[ads]]); Phase 8 (paid amplification) of `.claude/workflows/marketing-workflow.md` via the `campaign-manager` agent. `/mk:ads` activates the `content-strategist` agent; no marketing agent file names this skill directly.

## Scope

Covers:
- Ad copy at volume — headlines, descriptions, primary text, per angle, validated against platform character limits.
- Iterating creative from performance data (winner/loser pattern analysis → next round).
- Static ad concepts from a 22-template library, each tagged tier + funnel role.
- Video creative — hooks, UGC/creator formats, faceless motion ads, iOS-native reveal ads, vertical-video production spec.
- Format selection before briefing (S→F Meta format taxonomy: which formats scale cold vs. convert warm).
- The creative strategy loop — signals → evidence-ranked concepts → tiered roadmap → monthly retro.

Does NOT cover:
- Campaign structure, targeting, budgets, bidding, kill/keep/scale decisions → [[ads]].
- Landing pages the ad traffic lands on → [[copywriting]], [[cro]].
- Final copy polish and brand-voice enforcement → [[copy-editing]].
- Mining reviews/interviews into the inputs corpus → [[customer-research]].
- Organic social posting and calendars → [[social-content]], [[content-strategy]].
- Measurement, attribution, and reporting instrumentation → [[analytics]].

## Before starting

Read `plans/marketing-context.md` first (ICP, positioning, brand voice, forbidden words). Ask only for what it doesn't cover:

1. **Platform & format** — Google RSAs, Meta feed/stories, LinkedIn, TikTok, X? Display, video, static? Iterating existing ads or starting fresh?
2. **Product & offer** — what's promoted (product, feature, trial, demo, lead magnet), the core value prop, the real differentiator.
3. **Audience & intent** — which segment, what awareness stage (problem-aware / solution-aware / product-aware), what pain or desire drives them.
4. **Performance data** (if iterating) — what's running, top and bottom performers by CTR / CVR / ROAS, angles already tested.
5. **Constraints** — voice guidelines, words to avoid, compliance requirements, mandatory elements (brand name, trademarks, disclaimers).

## Four modes

| Mode | Use when | Core loop |
|---|---|---|
| **1 — Generate from scratch** | No creative running yet | Context + audience → angles → variations → spec validation |
| **2 — Iterate from performance data** | Ads are live and measured | Pull data → find winning patterns → new variations → validate → deliver |
| **3 — Scaled static batches** | Recurring volume production (e.g. 50 concepts/batch) | Grounded corpus + template library → dated batch folder + INDEX |
| **4 — Creative strategy loop** | Deciding *which* ads are worth making | Signals → evidence-ranked concepts → tiered roadmap → briefs → monthly retro |

Mode 4 runs upstream of 1-3. Full system in [references/creative-roadmap.md](references/creative-roadmap.md); hook generation and funnel diagnosis inside any mode in [references/hook-system.md](references/hook-system.md).

## Grounded inputs (non-negotiable)

Most AI ad generation fails on input grounding, not output quality. For anything beyond a one-off headline, maintain a durable corpus under the campaign folder:

```
plans/marketing/<campaign>/ads/inputs/
  winning-ads/   10-20 of the highest-performing ads from the last 90 days (screenshots + copy)
  reviews/       50-100 customer reviews (Trustpilot, G2, Amazon, App Store) as .md/.txt
  comments/      top comments on existing ads — objections, unprompted praise, customer-raised angles
```

- **Winning ads** carry the hooks, structures, and angles already proven for this brand.
- **Reviews** carry the exact language buyers use for pain, transformation, and unexpected benefit — pull copy verbatim, never paraphrased into marketing-speak.
- **Ad comments** are the most-skipped, highest-value input: objections ("does it work for X?") become FAQ Card ads; unprompted praise surfaces angles nobody wrote.

**Rules:** every concept cites its source (which review, winning ad, or comment). No invented claims, stats, or testimonials — ever. If `winning-ads/` or `reviews/` is empty, stop and ask the user to populate them; do not fall back to ungrounded generation. Inputs decay — refresh winning ads as new ones scale, reviews and comments monthly.

## Platform specs

Platforms truncate or reject creative over these limits, so validate every line before delivering.

**Google Ads (Responsive Search Ads)**

| Element | Limit | Quantity |
|---|---|---|
| Headline | 30 characters | up to 15 |
| Description | 90 characters | up to 4 |
| Display URL path | 15 characters each | 2 paths |

RSA rules: headlines must read correctly independently *and* in any combination; pin only when necessary (pinning reduces optimization); include at least one keyword-focused, one benefit-focused, and 2-3 CTA headlines.

**Meta (Facebook / Instagram)**

| Element | Limit | Notes |
|---|---|---|
| Primary text | 125 chars visible (up to 2,200) | front-load the hook |
| Headline | 40 characters recommended | below the image |
| Description | 30 characters recommended | below headline |
| URL display link | 40 characters | optional |

**LinkedIn** — intro text 150 recommended / 600 max; headline 70 recommended / 200 max; description 100 recommended / 300 max.
**TikTok** — ad text 80 recommended / 100 max; display name 40.
**X (Twitter)** — tweet text 280; card headline 70; card description 200.

Full per-placement specs, PMax and Display asset requirements, lead-form and Spark Ad fields, character-counting rules, and multi-platform adaptation in [references/platform-specs.md](references/platform-specs.md).

## Generating ad copy

**Step 1 — define angles.** Before writing a single headline, establish 3-5 distinct *reasons someone would click*. Each angle taps a different motivation:

| Category | Example angle |
|---|---|
| Pain point | "Stop wasting time on X" |
| Outcome | "Achieve Y in Z days" |
| Social proof | "Join 10,000+ teams who…" |
| Curiosity | "The X secret top companies use" |
| Comparison | "Unlike X, we do Y" |
| Urgency | "Limited time: get X free" |
| Identity | "Built for [specific role]" |
| Contrarian | "Why [common practice] doesn't work" |

**Step 2 — vary within each angle.** Word choice (synonyms, active vs. passive), specificity (numbers vs. general claims), tone (direct vs. question vs. command), structure (short punch vs. full benefit statement).

**Step 3 — validate against specs.** Check every line against the platform limit; flag anything over and supply a trimmed alternative in the same output.

**Step 4 — organize for upload.** Present in a structure that maps to the platform's upload form or bulk sheet.

## Hooks (video and static)

A hook is not a line — it is three simultaneous components:

| Component | What it is | Job |
|---|---|---|
| Visual action | what happens on screen in seconds 0-3 | stop the thumb |
| Spoken line | first words of VO or dialogue | open the loop |
| Caption text | on-screen header/overlay | anchor the claim for sound-off viewers |

**No-duplication rule:** the three must complement, never repeat. If the VO and the caption say the same sentence over a static talking head, two of three slots are wasted. Statics collapse this to two components (visual + headline) — same rule: the headline must not caption the image.

Generate top-down — **Segment → Motivation (verbatim from corpus) → Format → Hook** — and lay results out as a matrix so coverage is visible. Ten hooks across ten segment × motivation cells beat thirty rewordings of one cell.

**Diagnostic funnel** — when an ad underperforms, read which stage failed instead of scrapping the whole ad:

| Stage | Metric | Weak means | Fix |
|---|---|---|---|
| Stop | thumbstop / 3-sec view rate | visual action (and caption) | new visual opening, same everything else |
| Stay | hold rate (3s → 15s / 50% view) | the on-ramp (seconds ~3-15) | rework the bridge, not the hook |
| Click | CTR | desire/offer clarity mid-ad | sharpen promise, CTA, or proof |
| Convert | post-click CVR | congruence — page doesn't continue the ad | fix landing page or claim → [[cro]] |

A great thumbstop is not a great ad: clickbait shows up as high thumbstop plus collapsed hold and CVR. Change one component per test cycle. Opening moves, the on-ramp rule, and fidelity laddering (cheap tests for hunches, production budget only for validated angles) in [references/hook-system.md](references/hook-system.md).

## Choosing a format before briefing it

One question ranks every format: **is it a unicorn scaler or supporting cast?** Unicorn scalers puncture cold, net-new audiences and hold as spend scales — rare, worth disproportionate investment. Supporting cast converts people already mid/low funnel — useful and necessary, but it will not open new audiences no matter the budget. A format isn't bad for being supporting cast; it's bad only when you expect it to scale cold and it structurally can't. Build a portfolio of both.

Meta's persona-based delivery is why creator-fronted formats top the ranking — the format *is* the targeting. S-tier: founder content, partnership ads, VSL. F-tier (explicitly de-prioritized): press ads, podcast ads, notes-app / fake-native ads. The full ~51-format S→F catalog with funnel role, production complexity, and when-to-skip is [references/meta-creative-formats.md](references/meta-creative-formats.md).

Then go to the how-to-build reference for the format you picked:

| Need | Reference |
|---|---|
| Static layouts (Us vs. Them, Stat Callout, Review Card, Before/After, Founder Message, FAQ Card, Grid, Callout, Mood Board, Tweet screenshot, …) — 22 templates with copy slots, tier, funnel role, DTC + SaaS examples | [references/static-ad-templates.md](references/static-ad-templates.md) |
| Creator/UGC short-form (13 formats) + founder vlog structures + the vertical-video production spec (safe zones, caption recipe, audio) | [references/short-form-video-specs.md](references/short-form-video-specs.md) |
| Faceless motion ads — 15-45s generated concept videos, nine-style library with prompt formulas, motion prompt formula, QC gotchas | [references/motion-video-ads.md](references/motion-video-ads.md) |
| iOS-native reveals — iMessage chat, ChatGPT, Apple Notes, AirDrop; angles, pacing, production routes, dramatization compliance | [references/imessage-video-ads.md](references/imessage-video-ads.md) |
| Image, video, voice, and code-based (Remotion) generation tools + per-placement image specs + cost comparison | [references/generative-tools.md](references/generative-tools.md) |

Cycle through templates rather than clustering on favorites — template diversity is angle diversity — but weight toward S/A tiers when the goal is cold net-new reach, and toward B-tier supporting cast when feeding retargeting.

## Iterating from performance data (Mode 2)

1. **Analyze winners** — ask which metric matters (CTR, CVR, ROAS), then extract winning *themes*, *structures* (question / statement / command / number), *word patterns*, and character utilization.
2. **Analyze losers** — which angles fall flat, and what the low performers share (too generic? too long? wrong tone?).
3. **Generate the next round** — double down on winning themes with fresh phrasing, extend winning angles, test 1-2 unexplored angles, avoid loser patterns.
4. **Log the iteration** — round number, date, top performers with metrics, winning patterns, counts of new headlines/descriptions, new angles tested, angles retired.

## Writing quality standards

**Headlines that click:** specific ("Cut reporting time 75%") over vague ("Save time"); benefits ("Ship code faster") over features ("CI/CD pipeline"); active over passive; numbers wherever they're real. Avoid unrecognized jargon, unsupported superlatives ("Best", "Leading"), all-caps and excessive punctuation, and clickbait the landing page can't deliver.

**Descriptions that convert:** complement the headline, never repeat it. Use the slot for proof points (numbers, awards), objection handling ("No credit card required"), CTA reinforcement, or genuine urgency. "Learn more about our solution" wastes it.

## Batch generation

For large-scale production, split by artifact and generate in waves:

1. **Sub-tasks** — headline generation (click-through), description generation (conversion), primary text (engagement, Meta/LinkedIn).
2. **Waves** — Wave 1: core angles (3-5 angles × 5 variations). Wave 2: extended variations on the top 2 angles. Wave 3: wild cards (contrarian, emotional, hyper-specific).
3. **Quality filter** — drop anything over the character limit, remove near-duplicates, flag possible policy violations, confirm headline/description combinations still make sense together.

For a 50-concept static batch, spread across the template set weighted by tier and funnel goal; if performance data shows certain templates consistently winning for this brand, shift toward 60% proven / 40% full-cycle coverage — never drop coverage to zero.

## Common mistakes

- Writing RSA headlines that only work in sequence — they get combined randomly.
- Ignoring character limits; platforms truncate without warning.
- Variations that all sound the same — vary angles, not just word choice.
- No CTA headlines (RSAs need 2-3).
- Generic descriptions that waste the slot.
- Iterating on gut feeling instead of data.
- Generating without grounding — ungrounded concepts read like every other ad in the feed.
- Skipping the comments input, where customers raise the objections and angles that convert best.
- Testing several variables at once.
- Retiring creative before it has ~1,000+ impressions.

## Key concepts

- **Grounding** — every concept traces to a real review, winning ad, or ad comment; no invented claim, stat, or testimonial ever ships.
- **Angle** — a distinct reason to click. Diversity of angles, not of wording, is what produces learning.
- **Unicorn scaler vs. supporting cast** — whether a format opens cold net-new audiences or converts warm ones. Staff both roles; judge each by its own job.
- **Hook = three components** — visual action + spoken line + caption text, complementary, never duplicating.
- **Diagnostic funnel** — thumbstop / hold / CTR / CVR each isolate a different component, so a weak ad gets a targeted fix instead of a rewrite.
- **Fidelity ladder** — hunches ship low-fidelity; only angles with a funnel signal earn production budget.
- **Evidence tier** — concepts rank by strongest supporting evidence (own account > verbatim customers > long-running competitor ads > organic engagement > cross-niche > hunch); evidence sets priority, production tier sets cost.
- **Account state** — exploration (go wide, net-new angles, count single-metric wins) vs. scaling (go deep on the winner, keep an exploration allocation alive).
- **Capacity check** — roadmap to what can be produced *at quality*; a 20-concept slate against 8 concepts of capacity yields 20 compromised ads.

## Output

- `plans/marketing/<campaign>/ads/creative-brief.md` — angles, hook matrix, format picks, grounding sources.
- `plans/marketing/<campaign>/ads/<platform>-copy.md` — creative organized by angle with character counts, over-limit items flagged and trimmed; bulk CSV alongside it when generating 10+ variations for direct upload.
- `plans/marketing/<campaign>/ads/batches/YYYY-MM-DD/` (Mode 3) — `INDEX.md` (every concept: template, tier, grounding source — scannable in two minutes), `concepts/` (one `.md` each: headline, body, visual description, image prompt, grounding), `images/`, and optionally `review.html` (see [references/creative-review-page.md](references/creative-review-page.md)).
- `plans/marketing/<campaign>/ads/creative-roadmap.md` + `retros/YYYY-MM.md` (Mode 4) — icebox, quarter themes, monthly slate with evidence and production tiers; monthly retro feeding the next slate.
- Iteration report inline or appended to the platform copy file — performance summary, new creative, recommendations (pause / scale / test next).

## Cross-references

- `plans/marketing-context.md` — **required** hub (ICP, positioning, brand voice, forbidden words)
- [[ads]] — campaign structure, targeting, budgets, kill/keep/scale decisions once creative is live
- [[copywriting]] — landing pages the ad traffic lands on; message match with the ad promise
- [[cro]] — post-click congruence and conversion fixes when CVR is the weak funnel stage
- [[copy-editing]] — final polish and brand-voice pass before launch
- [[customer-research]] — building and refreshing the reviews/comments corpus
- [[competitor-profiling]] — competitor ad and positioning signal for the strategy loop
- [[social-content]] — organic vocabulary mining and social-native narrative arcs
- [[analytics]] — measurement and attribution for the performance data Mode 2 reads
- `.claude/workflows/marketing-rules.md` — copy quality, brand voice, no-fabrication gates
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for KitForge: KitForge frontmatter, `/mk:` namespace routing, `plans/marketing-context.md` replacing the upstream `.agents/product-marketing.md` context file, and all output paths moved under `plans/marketing/<campaign>/ads/`. Ten reference files ported; sibling-skill mentions rewritten to ClauKit skills ([[social-content]], [[customer-research]], [[competitor-profiling]], [[cro]], [[ads]], [[analytics]]). Dropped: the upstream ad-platform CLI wrappers and tools registry (`node tools/clis/*.js`, `tools/REGISTRY.md`) — ClauKit has no such CLIs, so performance data is read from platform CSV exports or pasted output; the bundled 400-line `assets/creative-review-template.html`, replaced by a template-independent spec in `references/creative-review-page.md`; the `evals/evals.json` harness (no ClauKit equivalent); a third-party `npx`-installed rendering skill in the iOS-reveal production routes; and pointers to upstream skills ClauKit does not ship (`marketing-loops`, `scraping`, `social`, `ab-testing`, `marketing-psychology`) plus the `ads` skill's `meta-decision-system.md` reference file, which ClauKit's [[ads]] does not carry.
