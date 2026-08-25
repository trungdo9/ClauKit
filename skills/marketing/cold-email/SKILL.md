---
name: cold-email
description: B2B cold outreach that gets replies — subject lines, opening lines, body copy, low-friction CTAs, personalization tiers, multi-touch follow-up sequences, and deliverability. Use for cold email, prospecting email, outbound email, SDR/sales-development email, "email to leads", "reach out to prospects", "follow-up sequence", or "nobody's replying to my emails". For lifecycle/drip nurture use email-sequence; for one-shot broadcast campaigns use emails.
allowed-tools: Read, Write, Glob, Grep
---

# Cold Email

> Cold outreach is ruthlessly short and reader-owned. The email should read like a sharp colleague noticed something relevant — not like a template with a first name swapped in.

## When this skill activates

**Implicit:** writing or fixing cold outbound — prospecting emails, SDR sequences, outreach to a lead list, "why is nobody replying", follow-up cadence design, breakup emails.
**Explicit:** "Use the cold-email skill to [task]."
**Routed from:** `/mk:email cold` (the `cold` action names this skill directly), `/mk:leads` (5-phase lead pipeline), the `email-specialist` agent, and `.claude/workflows/sales-workflow.md` Phase 1 (Generate — cold outreach to ICP).

## Scope

Covers:
- Cold outbound to people with no prior relationship: first-touch email, follow-ups, breakup email.
- Subject lines for cold inboxes, opening lines, body structure, one-ask CTAs.
- Personalization tiers and the research-signal stack that feeds them.
- Multi-touch sequence design — how many, how far apart, which angle per touch.
- Deliverability hygiene as it affects cold sends (bounce, complaint, link/HTML discipline).
- Diagnosing a sequence that isn't getting replies.

Does NOT cover:
- Lifecycle / drip nurture to people already in the funnel (welcome, onboarding, re-engagement) → [[email-sequence]].
- One-shot broadcast campaigns to an owned list (announcement, launch, promo) → [[emails]].
- Landing pages, web copy, headlines, value props → [[copywriting]].
- Building and qualifying the prospect list itself → `/mk:leads` phases 1–2 and `customer-research`.

## Before writing

Load `plans/marketing-context.md` first (ICP, positioning, brand voice, forbidden words) — it is the required hub and covers most of what would otherwise be asked. Then confirm only what it does not answer:

1. **Who** — role, company, why this person specifically.
2. **What outcome** — reply, meeting, intro, demo.
3. **What value** — the specific problem you solve for people like them.
4. **What proof** — one result, case study, or credibility signal.
5. **What signal** — funding, hiring, a post, company news, a tech-stack change.

Work with whatever is available. A strong signal plus a clear value prop is enough to write. Do not block on missing inputs — write, then note what would make it stronger.

## Writing principles

- **Write like a peer, not a vendor.** Contractions. Read it aloud. If it sounds like marketing copy, rewrite it.
- **Every sentence earns its place.** The best cold emails feel like they could have been shorter.
- **Personalization must connect to the problem.** Test: remove the personalized opener — if the email still makes sense, the personalization was decoration, not relevance.
- **Lead with their world.** "You/your" should dominate "I/we". Never open with who you are or what your company does.
- **One ask, low friction.** Interest-based CTAs ("Worth exploring?") beat calendar requests. One CTA per email; make a one-line reply enough.

**Target voice:** a smart colleague sharing something relevant. Conversational, not sloppy. Confident, not pushy. Calibrate: C-suite ultra-brief and understated; mid-level more specific value; technical precise and fluff-free.

**It should not sound like:** a template with fields swapped in, a pitch deck compressed into a paragraph, a LinkedIn DM from a stranger, or generated text ("I hope this email finds you well", "I came across your profile", "leverage", "synergy", "best-in-class").

## Structure

No single right shape. Pick the framework that fits the situation, or write freeform when it flows without one.

- **Observation → Problem → Proof → Ask** — noticed X, which usually means Y; we helped Z with that; interested?
- **Question → Value → Ask** — struggling with X? we do Y; Z saw [result]; worth a look?
- **Trigger → Insight → Ask** — congrats on X; that usually creates Y; curious?
- **Story → Bridge → Ask** — [similar company] had [problem]; they solved it this way; relevant to you?

Full catalog with worked examples — PAS, BAB, QVC, AIDA, PPP, Star-Story-Solution, SCQ, ACCA, 3C's, Mouse Trap, Justin Michael Method, Vanilla Ice Cream, PASTOR — in `references/frameworks.md`.

## Personalization tiers

| Level | What it is | Scales? |
|---|---|---|
| 1 — Basic | Merge tags: first name, company, title | Fully; no longer differentiating |
| 2 — Industry/segment | Segment-specific pain, trend, regulation | Via micro-segmentation |
| 3 — Role-level | Challenges specific to role + seniority | Via persona templates |
| 4 — Individual | A specific, timely observation about that person, tied to the problem you solve | Via trigger templates |

Level 4 is the target. The practical route to it at volume is a small set of pre-written trigger openers (funding, hiring, tech stack, post, news, talk, site change) each with a prepared segue into the problem, with the rest of the email constant. Signal sources, the four "-graphic" dimensions, observation-opener patterns, and the "So what?" test are in `references/personalization.md`.

## Subject lines

The subject line's only job is to get the email opened, not to sell.

- 2–4 words, lowercase, no punctuation tricks.
- Should look internal, like it came from a colleague: "reply rates", "hiring ops", "Q2 forecast".
- Context beats name — pain point, competitor, trigger event; a first name in the subject reads as automation.
- No product pitch, no urgency words, no emoji, no fake "Re:" or "Fwd:".
- Specific pain questions can work; generic ones ("Quick question?") do not. Default to statements.

Comparative data and the anti-pattern table: `references/subject-lines.md`.

## Follow-up cadence

Most replies to cold sequences come from follow-ups, not the first email — and each follow-up must add something new. "Just checking in" gives the reader nothing to respond to.

| Touch | Day | Angle |
|---|---|---|
| Initial | 0 | Personalized hook + core value prop + soft CTA |
| Follow-up 1 | 3 | Different angle, one new value piece |
| Follow-up 2 | 7–8 | Social proof / case study from a similar company |
| Follow-up 3 | 14 | New insight, trend, or genuinely useful resource |
| Follow-up 4 | 21–28 | Breakup — acknowledge silence, leave the door open |

Rules: 3–5 emails total, gaps widening; each email must stand alone (assume they never read the previous one); exactly one new value proposition per email; if you send the breakup email, honor it and stop. Cadence detail, breakup templates including the reply-with-a-number format, and the phrases that suppress replies: `references/follow-up-sequences.md`.

## Deliverability

Cold sending is judged by the mailbox provider before it is judged by the reader.

- **Plain text.** No HTML templates, no tracking-heavy images, no more than one link — ideally zero in the first touch.
- **Bounce control.** Verify addresses before sending; a high bounce rate on a cold list is the fastest route to a domain reputation problem.
- **Complaint control.** Spam complaints are the harshest signal a sender can accumulate; major providers publish complaint-rate thresholds and enforce them. Assume the tolerance is very low.
- **Spam-trigger language.** "free", "guarantee", "act now", stacked urgency, all-caps, "!!!" — costs both opens and inbox placement.
- **Narrow targeting over volume.** Small, tightly-matched send batches out-reply large sprays; contacting many people at one company at once reads as a blast.
- **Honor opt-outs immediately** and keep an easy way to say stop.

## Compliance

Cold outbound is legally constrained and the constraints are jurisdiction-dependent — commercial-email law (e.g. CAN-SPAM in the US), data-protection law (e.g. GDPR/ePrivacy in the EU/EEA and UK), and separate national rules elsewhere govern whether a cold send is permitted at all, on what legal basis, what identification and opt-out it must carry, and how prospect data may be sourced and stored.

This skill does not determine legality. It will:
- Include sender identification and a working opt-out path in generated sequences.
- Flag when a target list looks EU/UK-based or consumer-facing, since those raise the bar.
- Refuse to write scraped-list-at-scale outreach dressed up as personalization.

Have counsel confirm the basis for the specific list, jurisdiction, and offer. Do not treat any number, timeframe, or exemption stated in a draft as legal advice — this skill states none.

Lead data handling follows `.claude/workflows/automation-rules.md` §4: no PII in logs or summaries, lead lists written PII-redacted.

## Quality check

Before presenting a draft:

- Does it sound like a human wrote it? (Read it aloud.)
- Would you reply to this if you received it?
- Does every sentence serve the reader rather than the sender?
- Is the personalization connected to the problem you solve?
- Is there exactly one clear, low-friction ask?
- Under ~75 words for the first touch, plain text, no feature dump?

## What to avoid

- "I hope this email finds you well" / "My name is X and I work at Y".
- Jargon: synergy, leverage, circle back, best-in-class, leading provider.
- Feature dumps — one proof point beats ten features.
- HTML, images, multiple links.
- Fake "Re:" or "Fwd:" subject lines.
- Identical templates with only the first name swapped.
- A 30-minute call as the first ask.
- "Just checking in" / "I never heard back" / "bumping this up" follow-ups.
- Unsubstantiated numbers ("300% more leads") with no named proof.

## Key concepts

- **Internal camouflage** — a subject line that looks like internal mail gets opened; one that looks like sales gets categorized and skipped before it is read.
- **Problem-connected personalization** — an observation only counts if it leads into the problem you solve; otherwise it is an attention hack.
- **One new value proposition per email** — the constraint that forces genuine angle rotation across a sequence instead of bumps.
- **Loss-aversion close** — the breakup email works by withdrawing, not by pushing; it must be honored.
- **Friction scales with seniority, inversely** — the higher the title, the smaller the ask you can make.
- **Reader-owned copy** — "you/your" density over "I/we" is the fastest structural tell of a cold email that will get read.

## Output

Written to the `/mk:email` convention:
- `plans/marketing/<campaign>/emails/<sequence>.md` — the full sequence: per-touch subject line, body, send-day offset, angle, and the personalization variables each touch needs.
- Optionally `plans/marketing/<campaign>/emails/<sequence>-triggers.md` — the reusable trigger-opener set backing Level-4 personalization.
- Or inline drafts / a diagnosis of an existing sequence for quick checks.

Lead lists stay at `plans/marketing/<campaign>/leads.csv`, PII-redacted — never inline prospect PII into a sequence file.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice, forbidden words)
- [[email-sequence]] — lifecycle/drip nurture for people already in the funnel
- [[emails]] — one-shot broadcast campaigns to an owned list
- [[copywriting]] — landing pages, headlines, value props
- [[customer-research]] — ICP and pain-point evidence that makes Level 2–4 personalization real
- `.claude/workflows/sales-workflow.md` — Phase 1 (Generate) routes here
- `.claude/workflows/marketing-rules.md` — quality gates, anti-patterns
- `.claude/workflows/automation-rules.md` — §4 PII handling, output conventions
- `references/frameworks.md` · `references/personalization.md` · `references/subject-lines.md` · `references/follow-up-sequences.md` · `references/benchmarks.md`
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (`skills/cold-email/`, MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter and wikilink cross-references, scoped strictly to cold outbound against [[email-sequence]] and [[emails]], product-marketing context file replaced by `plans/marketing-context.md`, upstream pointers to skills ClauKit lacks (prospecting, sales-enablement, revops) dropped, deliverability and compliance sections added; the five source reference files are ported with the same adaptation.
