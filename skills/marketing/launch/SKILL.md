---
name: launch
description: Product launch and go-to-market planning — readiness gate (SLC), the ORB channel framework, the five-phase launch ramp (internal → alpha → beta → early access → full), Product Hunt playbook, launch-day checklist, and post-launch adoption. Triggers on "launch", "Product Hunt", "GTM plan", "feature release", "announcement", "beta launch", "early access", "waitlist", "launch checklist", "we're about to ship".
allowed-tools: Read, Write, Glob, Grep
---

# Launch Strategy

> The best companies don't launch once — they launch again and again. A launch is a phased ramp that compounds attention into owned relationships, not a single day on a calendar.

## When this skill activates

**Implicit:** planning a product launch, feature announcement, release strategy, waitlist, beta/early-access program, or Product Hunt run.
**Explicit:** "Use the launch skill to [task]."
**Routed from:** `/mk:growth launch` (skills: `launch`, `copywriting`, `ads`), `/mk:campaign` when the campaign is a launch, `/mk:email campaign` for the announcement send.

## Scope

Covers:
- Launch readiness gate — is this thing actually launchable (SLC), or are you in Stealth Mode / "just one more feature"?
- Channel strategy across Owned / Rented / Borrowed (ORB), with everything funnelling back to owned.
- The five-phase ramp: internal → alpha → beta → early access → full launch, with per-phase goals and actions.
- Product Hunt (and comparable platform) launches — pre-day, day-of, after.
- Launch-day touchpoint checklist and asset list.
- Post-launch adoption work and the ongoing update-tiering cadence (major / medium / minor).

Does NOT cover:
- Writing the announcement email or onboarding sequence → [[emails]], [[email-sequence]].
- Writing the launch tweets/threads/LinkedIn posts → [[social-content]].
- Launch ad creative and paid amplification → [[ad-creative]], [[ads]].
- Headline, tagline, and landing-page copy → [[copywriting]]; conversion tuning of the launch page → [[cro]].
- Positioning, ICP, and messaging that precede the launch → [[product-marketing]] (hub: `plans/marketing-context.md`).
- Comparison / alternatives pages named in post-launch → [[seo-programmatic]], [[competitor-alternatives]].
- Post-signup activation flows → [[user-onboarding]], [[signup]].

## Readiness gate — run before any planning

Launch mechanics only pay off if the thing is worth launching. Two failure modes kill launches from opposite ends:

- **Stealth Mode** — launching too late. Polishing in private, waiting for perfect. Procrastination in a fancy suit.
- **"Just one more feature"** — never launching. Every date slips for one more thing; scope creeps forever.

The middle path is **SLC — Simple, Lovable, Complete** (Jason Cohen), the antidote to an MVP that is minimal but unlovable:

- **Simple** — it does *one* thing, not many things poorly.
- **Lovable** — a target user would *choose* it, not merely endure it to give feedback. If nobody would be sad to lose it, it isn't lovable yet.
- **Complete** — a whole experience at its chosen scope; no glaring stubs, not a teaser for a bigger promise.

Gate checks: one clearly-defined thing? would a target user choose it? whole at that scope? Still polishing past the bar → Stealth Mode, ship. Still adding scope → cut back to SLC, then ship. A real launch now beats a perfect launch never.

## ORB — the channel frame

Every launch channel is Owned, Rented, or Borrowed. Rented and Borrowed buy attention; Owned is where it is banked.

| Type | You control | Examples | Role in a launch |
|---|---|---|---|
| **Owned** | Channel (not audience) | Email list, blog, podcast, community, the product itself | Compound asset; the destination for all other traffic |
| **Rented** | Nothing | X/Twitter, LinkedIn, YouTube, Reddit, app stores, marketplaces | Speed and reach; convert to owned or it evaporates |
| **Borrowed** | Nothing, and not even the relationship | Guest posts, podcast interviews, newsletter features, webinars, influencers, affiliates | Instant credibility; shortcut past "nobody knows you" |

Rules: start with 1–2 owned channels chosen by audience behavior; pick 1–2 rented platforms where the audience already is; be proactive on borrowed — list the people your audience follows, pitch win-win collaborations, and set referral/affiliate incentives before launch week. Rented channels give speed, not stability. Detail, tactics, and case studies (Superhuman, Notion, TRMNL): `references/orb-channels.md`.

## The five-phase ramp

Launching is a process that builds momentum, not a one-day event.

| Phase | Audience | Core action | Goal |
|---|---|---|---|
| 1. Internal | Hand-picked friendlies | Recruit testers one-on-one, collect usability feedback; demo-grade is enough | Validate core functionality |
| 2. Alpha | First externals | Landing page + early-access form; announce it exists; invite individually | First external validation, waitlist starts |
| 3. Beta | Wider early-access list | Work the list (some free, some paid); tease the problem you solve; recruit friends/investors/influencers to test and share | Buzz plus broader feedback |
| 4. Early access | Engaged cohort at scale | Leak screenshots/GIFs/demos; gather usage data + qualitative research; optional PMF survey | Validate at scale, sharpen messaging |
| 5. Full launch | Everyone | Open self-serve signups, start charging, announce GA everywhere | Maximum visibility and conversion |

Phase-4 expansion is a choice: throttle invites in batches (5–10% at a time) for control, or open the whole list at once under an "early access" framing for a bigger moment. Per-phase actions, "consider adding" lists, and the full GA touchpoint list: `references/launch-phases.md`.

## Launch-day touchpoints

Announcement email to the list · blog post · social posts across chosen platforms · in-app popup or product tour · "New" sticker in dashboard nav · site banner linking to launch assets · platform listing live (Product Hunt / BetaList / Hacker News) · team on deck all day to respond · monitoring for breakage and feedback. Full pre / day-of / post checklist: `references/launch-checklist.md`.

## Product Hunt

Powerful for reaching early adopters, not magic. Upside: tech-savvy audience, credibility bump (especially Product of the Day), PR and backlinks. Downside: competitive, short-lived traffic spike, heavy pre-work. It rewards relationships built weeks earlier, a polished listing (tagline, visuals, short demo video), and all-day real-time engagement — then converting that traffic into email signups the same day. Playbook plus the SavvyCal and Reform case studies: `references/product-hunt.md`.

## Ongoing launch cadence

Tier every update so marketing effort matches significance:

| Tier | Examples | Treatment |
|---|---|---|
| **Major** | New product, new feature, overhaul | Full campaign — blog, email, in-app, social, platform listings |
| **Medium** | New integration, UI improvement | Targeted — email to relevant segments, in-app banner |
| **Minor** | Bug fixes, small tweaks | Changelog and release notes only |

Space releases out rather than shipping everything at once, reuse the tactics that measurably worked last time, and keep shipping changelog entries — visible active development builds retention and word of mouth. Post-launch adoption work (onboarding sequence, roundup email, comparison pages, site updates, interactive demo): `references/post-launch.md`.

## Key concepts

- **ORB** — Owned / Rented / Borrowed channels; borrowed and rented attention only counts once converted to owned.
- **SLC (Simple, Lovable, Complete)** — the launchable-v1 bar that replaces "minimum viable".
- **Stealth Mode / "just one more feature"** — the two opposite ways launches die.
- **Phased ramp** — five escalating audiences; each phase de-risks the next.
- **Launch moment** — a manufactured spike (waitlist open, GA day, platform listing) that concentrates attention rather than dribbling it.
- **Update tiering** — major/medium/minor, so small ships still signal momentum without burning the list.

## Intake questions

1. What is being launched — new product, major feature, or minor update?
2. Current audience size and engagement per channel?
3. Which owned channels exist today (list size, blog traffic, community)?
4. Timeline to launch date?
5. Previous launches — what worked, what didn't?
6. Product Hunt or similar in scope? Preparation status?

## Output

- `plans/marketing/<campaign>/growth-launch.md` — launch plan (readiness verdict, ORB channel map, phased timeline, touchpoint checklist, asset list, owners/dates). Path matches `/mk:growth`'s declared output.
- Optional companions in the same folder: `launch-checklist.md`, `product-hunt-plan.md`.
- Inline recommendations for quick checks.

## Cross-references

- `plans/marketing-context.md` — **required** hub (ICP, positioning, brand voice, forbidden words). Read before asking the intake questions; only ask what it does not already answer.
- [[product-marketing]] — positioning and messaging feeding the launch narrative
- [[emails]] / [[email-sequence]] — announcement send and post-launch onboarding sequence
- [[social-content]] — launch-day posts and threads
- [[ad-creative]] / [[ads]] — paid amplification of the launch moment
- [[copywriting]] / [[cro]] — launch page copy and conversion tuning
- [[marketing-ideas]] — additional launch tactics (Product Hunt, early-access referrals)
- [[analytics]] — launch instrumentation and post-launch measurement
- `.claude/workflows/marketing-rules.md` — quality gates, output-path convention, anti-patterns
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter, `/mk:` namespace wiring, `.agents/product-marketing.md` context convention replaced by `plans/marketing-context.md`, long-form sections split into `references/`. Dropped: the upstream eval harness (`evals/evals.json` — no ClauKit equivalent), the `tools/integrations/introw.md` vendor link, and cross-references to upstream skills ClauKit does not ship (`marketing-psychology`, `sales-enablement`, `offers`); their intents are redirected to shipped siblings above.
