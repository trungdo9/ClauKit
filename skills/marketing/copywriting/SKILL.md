---
name: copywriting
description: Write new persuasive marketing copy — headlines, subheadlines, value props, CTAs, hero sections, landing/pricing/feature/about page copy, ad and email copy, social posts. Use when the user says "write copy for", "headline help", "CTA copy", "value proposition", "tagline", "hero section", "above the fold", "make this more compelling", "subject lines", "help me describe my product", or needs a page/campaign written from scratch. Carries headline formulas, the "Now you can" test, the Human Action Model, page-structure templates, and CTA patterns. For revising copy that already exists, use copy-editing.
allowed-tools: Read, Write, Glob, Grep
---

# Copywriting — Persuasive Copy Generation

> Clarity converts, cleverness decodes. This skill generates new copy that names a real ability the reader did not have before — and refuses to invent the proof that backs it.

## When this skill activates

**Implicit:** the task is to produce copy that does not yet exist — a headline, hero, value prop, CTA, landing page, ad, subject line, or launch post.
**Explicit:** "Use the copywriting skill to [task]."
**Routed from:** `/mk:content copy` and `/mk:content blog|social|video` · `/mk:email campaign` · `/mk:cro landing` and `/mk:cro signup` · `/mk:ads` (with [[ad-creative]]) · `/mk:growth launch` · the `copywriter`, `content-strategist`, and `video-producer` agents · `.claude/workflows/video-workflow.md` (hook → problem → solution → proof → CTA) · `.claude/workflows/marketing-workflow.md` Phase 5 Track A.

## Scope

Covers:
- Generating headlines, subheadlines, taglines, and hero sections from formulas plus voice-of-customer language.
- Value propositions and benefit blocks — feature → benefit → outcome.
- CTA copy (button, link, final-section) and email subject lines / preview text.
- Full page copy by section: homepage, landing, pricing, feature, about, launch.
- Persuasion structures: AIDA, PAS, BAB, 4 Ps, Human Action Model.
- Alternatives with rationale + A/B test hypotheses for the copy produced.

Does NOT cover:
- Line-editing, tightening, or polishing copy that already exists → [[copy-editing]].
- Page structure, friction, and flow diagnosis → [[cro]] (25-point framework).
- SEO article writing and E-E-A-T scoring → [[seo-content]].
- Ad-unit specs, character limits, creative variants per placement → [[ad-creative]].
- Full email sequence architecture and timing → [[emails]], [[email-sequence]].
- Popup and modal copy → [[popup]]. Platform-native social calendars → [[social-content]].
- Positioning and ICP definition itself → [[product-marketing]], `plans/marketing-context.md`.

## Before writing — required inputs

Read `plans/marketing-context.md` first (hard-fail per `.claude/workflows/marketing-rules.md` §1). Pull ICP, positioning, brand voice, terminology, forbidden words. Ask only for what it does not cover:

1. **Page purpose** — which page type, and the ONE action a visitor should take.
2. **Audience** — who, what problem, what objections, and the exact words they use for it.
3. **Product/offer** — what is sold, what makes it different, the transformation, and any real proof points (numbers, testimonials, case studies).
4. **Traffic context** — where visitors come from and what they already know on arrival.

Missing proof is a gap to flag, not a gap to fill. See "Truth-only" below.

## Core principles

1. **Clarity over cleverness.** If the reader has to decode the line, it lost. Clarity lets the right buyer self-qualify fast and the wrong one bounce early.
2. **Benefits over features.** Feature = what it does. Benefit = what that means for them. Always land on the outcome.
3. **Specificity over vagueness.** "Cut weekly reporting from 4 hours to 15 minutes" beats "save time on your workflow".
4. **Customer language over company language.** Mirror reviews, interviews, support tickets. Never the internal product name for a concept the market calls something else.
5. **One idea per section.** Each section advances one argument; the page is a chain, not a pile.
6. **Honest over sensational.** Invented stats and testimonials destroy trust and create legal exposure.

## Writing style rules

- Simple over complex — "use" not "utilize", "help" not "facilitate".
- Active over passive — "we generate reports" not "reports are generated".
- Confident over qualified — cut "almost", "very", "really", "quite".
- Show over tell — describe the outcome instead of reaching for an adverb.
- No exclamation points. No buzzwords without substance ("streamline", "optimize", "innovative", "seamless", "revolutionary").
- No generic openers — "In today's fast-paced world…", "Nowadays…", "As we all know…". Open on substance.
- Respect the forbidden-words list in `plans/marketing-context.md` over every rule here.

Full transition-phrase bank and the AI-tell blocklist: [references/natural-transitions.md](references/natural-transitions.md).

## Truth-only (non-negotiable)

Aligned with `.claude/workflows/marketing-rules.md` §2 and the truth-only rule in [[seo-content]]:

1. **No invented metrics.** Never write a percentage, customer count, rating, or case-study number the user did not supply. No number → mark `[NEEDS DATA]` and leave the slot.
2. **No fabricated testimonials or logos.** Quotes are quoted, never authored. No real quote → `[NEEDS TESTIMONIAL]`.
3. **No placeholder entities passed off as real** — no "Company X uses us to…". Write the general form instead.
4. **Genuine urgency only.** Scarcity, deadlines, and "limited spots" ship only when true. Fake timers are an auto-reject.
5. **Every claim traceable** to the product, the context hub, or a named source. "Trust us" without proof is an anti-pattern (§7).

## Headline generation

Draft with a formula, then filter. The formula bank (outcome, problem, audience, differentiation, proof-focused, plus shapes) lives in [references/copy-frameworks.md](references/copy-frameworks.md).

Fast starting shapes:
- `{Achieve outcome} without {pain point}`
- `The {category} for {audience}` / `The {category} that {differentiator}`
- `Never {unpleasant event} again`
- `Stop {pain}. Start {pleasure}.`
- `{Question naming the main pain}`

Then run two tests on every candidate:

- **The "Now you can" test** — prefix the line with "Now you can…". Keep it only if the result is both compelling and true. "Now you can… have a powerful analytics platform" fails (a description, not a new ability); "Now you can… see which companies visit your site" passes.
- **The Human Action Model** — the hero must carry three beats: current discomfort (named in their words) → better vision → path to action. Miss discomfort and there is no reason to move; miss vision and there is no destination; miss path and there is no reason to believe you are it. The hero states the transformation; the rest of the page substantiates each beat.

Watch the **Perception Gap**: "ship in a weekend" reads as momentum to a startup and as instability to an enterprise buyer. Match the framing to the reader's risk tolerance, and segment rather than averaging two audiences into mush.

## Page structure

**Above the fold** — headline (single most important message), subheadline (adds specificity, 1-2 sentences), primary CTA, supporting visual, optional proof bar.

**Body sections**, in narrative order rather than feature order:

| Section | Purpose |
|---|---|
| Social proof | Credibility — logos, one metric, rating, or a snippet |
| Problem / pain | Articulate their problem better than they can |
| Solution / benefits | 3-5 benefits, each: outcome headline + how + proof |
| How it works | 3-4 numbered steps; kills perceived complexity |
| Objection handling | FAQ, comparison, guarantee |
| Final CTA | Recap value, repeat CTA, add risk reversal |

Hero → feature → feature → feature → CTA is a list, not an argument. Full section catalog and five page templates (strong, compact, enterprise/B2B, launch): [references/copy-frameworks.md](references/copy-frameworks.md).

**Per page type:** *Homepage* — serve several audiences without going generic; lead with the broadest value prop and branch paths by intent. *Landing* — one message, one CTA, message-match the ad that sent them. *Pricing* — answer "which is right for me?"; make the recommended plan obvious. *Feature* — feature → benefit → outcome, with use cases. *About* — why you exist, tied to customer benefit, still ends in a CTA.

## CTA copy

Formula: **`{action verb} + {what they get} + {qualifier if needed}`**.

| Weak (auto-reject per §7) | Strong |
|---|---|
| Submit · Sign Up · Learn More · Click Here · Get Started | Start My Free Trial · Get the Complete Checklist · See Pricing for My Team · Create Your First Report · See {Product} in Action |

One primary CTA per page. Secondary CTAs get visibly lower weight and must not compete for the same decision.

## Persuasion frameworks

| Framework | Beats | Best for |
|---|---|---|
| **AIDA** | Attention → Interest → Desire → Action | Long pages, launch posts |
| **PAS** | Problem → Agitate → Solution | Cold email, ads, pain-led heroes |
| **BAB** | Before → After → Bridge | Feature pages, migration/switch copy |
| **4 Ps** | Promise → Picture → Proof → Push | Sales pages, webinar and offer copy |
| **Human Action Model** | Discomfort → Vision → Path | Hero sections, any transformation story |

Agitate is not exaggerate — sharpen a real cost, never invent one.

## Channel notes

- **Landing page** — hero promises the outcome, subhead explains how, bullets are benefits, CTA is specific.
- **Email** — subject line carries curiosity or a concrete benefit; preview text extends the hook rather than repeating it; body is scannable and benefit-led; P.S. reinforces the CTA. Sequence design → [[emails]].
- **Twitter/X** — the first ~140 characters are the preview and decide everything; line breaks for readability; thread only when there is a story; hashtags sparingly or not at all.
- **LinkedIn** — professional, not lifeless; the first two lines must hook before "see more"; story and data beat announcement voice.
- **Video / VSL** — hook → problem → solution → proof → CTA (`.claude/workflows/video-workflow.md`).

## Before / after

| Weak | Why | Rewritten |
|---|---|---|
| "An Innovative AI-Powered Platform for Streamlined Business Operations" | Jargon stack, company language, no audience, no outcome | "Get paid on time, without chasing a single invoice" |
| "Slack lets you share files instantly, from documents to images, directly in your conversations" | Buries the value in qualification | "Need to share a screenshot? Send as many documents, images, and audio files as you like." |
| "Save time on your workflow" | Unfalsifiable; fails "Now you can" | "Cut weekly reporting from 4 hours to 15 minutes" |
| "Our Pricing Plans" | Label, not a message; no help choosing | "Pick the plan that fits your team — most teams start on Pro" |

Also allowed and underused: rhetorical questions that make the reader picture their own situation ("Hate returning stuff to Amazon?"), analogies that make an abstract mechanic concrete, and light humor **when the brand voice in `marketing-context.md` supports it and it does not cost clarity**.

## Key concepts

- **Message-market fit** — the line names a feeling the reader has not heard the category acknowledge. Beats any feature list.
- **"Now you can" test** — the compelling-and-true filter every headline must survive.
- **Human Action Model** — discomfort → vision → path; the narrative spine of a converting hero.
- **Perception Gap** — the same benefit is a selling point to one segment and a red flag to another; frame to risk tolerance.
- **Message match** — the landing headline must echo the ad or email that sent the visitor, or they bounce.
- **Voice of customer** — copy assembled from the words customers already use, not from internal vocabulary.

## Process

1. Load `plans/marketing-context.md` (ICP, voice, forbidden words). Absent → hard-fail per §1.
2. Gather the four required inputs; ask only for gaps.
3. Pick the page/asset template and the persuasion framework that fits the awareness level.
4. Draft headline candidates from the formula bank; filter through "Now you can" + the three beats.
5. Write section by section, one idea per section, proof slots marked where data is missing.
6. Self-check against the writing style rules, truth-only, and marketing-rules §3 quality gates + §7 anti-patterns.
7. Hand the draft to [[copy-editing]] for line-level polish; hand structural doubts to [[cro]].

## Output

- `plans/marketing/<campaign>/copy/<asset>.md` — the copy, organized by section (headline / subheadline / CTA, then each body section).
- Or inline in conversation for a single headline or CTA request.

Every delivery includes:

1. **Primary version** — the strongest recommendation.
2. **Alternatives** — 2-3 variants for the headline and CTA, each testing a different angle.
3. **Rationale** — one line per key choice: which principle or formula it applies.
4. **A/B test suggestions** — one variable per test (per the CRO framework).
5. **Open gaps** — every `[NEEDS DATA]` / `[NEEDS TESTIMONIAL]` slot listed explicitly.
6. **Meta content** when the asset is a page — page title and meta description.

## Cross-references

- `plans/marketing-context.md` — **required** hub: ICP, positioning, brand voice, forbidden words. Supersedes repo `README.md`/`docs/` for voice.
- `.claude/workflows/marketing-rules.md` — §1 context hard-fail, §2 no fluff / no hallucinated metrics, §3 quality gates, §6 output paths, §7 anti-patterns.
- `.claude/workflows/cro-framework.md` — 25-point framework behind CTA, proof placement, and one-variable testing.
- [references/copy-frameworks.md](references/copy-frameworks.md) — headline formulas, section catalog, page templates, clarity tests.
- [references/natural-transitions.md](references/natural-transitions.md) — transition bank + AI-tell blocklist.
- [[copy-editing]] · [[cro]] · [[seo-content]] · [[ad-creative]] · [[emails]] · [[popup]] · [[social-content]] · [[product-marketing]] · [[analytics]]
- `.claude/skills/marketing/README.md` — full kit overview.

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter and `/mk:` routing, context source switched from `.agents/product-marketing.md` to `plans/marketing-context.md`, truth-only + anti-fluff rules aligned with `.claude/workflows/marketing-rules.md` §2, unsourced upstream lift figures demoted to `[NEEDS DATA]`, and pointers to skills ClauKit does not ship (`offers`, `ab-testing`) re-pointed or dropped.
