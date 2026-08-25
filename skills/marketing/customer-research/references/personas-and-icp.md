# Personas, ICP & Deliverable Templates

Personas are built from research, not invented. Gate: **at least 5-10 data points from one consistent segment** (interviews, reviews, or community posts) before writing one.

---

## When there are no reviews yet

Early-stage products and new categories lack first-party review data. Don't invent personas — walk outward through proxy sources, in this order:

1. **Your own differentiator** — what the product does differently defines who feels that difference most. Write it down *as a hypothesis*, labelled as one.
2. **Direct competitors' reviews** — their customers describe the problem space in their own words. Note what is praised and what is missing.
3. **Comparable products on marketplaces** — Amazon / app-store reviews for adjacent solutions to the same job.
4. **Adjacent brands sharing the audience** — what else this buyer buys; those reviews reveal broader language and values.

Personas built this way are **provisional**: tag each with its proxy source, and replace proxy evidence with first-party evidence as real data arrives.

---

## Persona structure

```
## [Persona name] — [role/title]

**Profile**
- Title range:
- Company size:
- Industry (if narrow):
- Reports to:
- Team size managed (if relevant):

**Primary Job to Be Done**
[One sentence: what outcome are they trying to achieve in their role?]

**Trigger events**
What makes them start looking for a solution like yours?
-
-

**Top pains** (ranked, in their words where possible)
1.
2.
3.

**Desired outcomes**
- What success looks like to them
- How they measure it
- How it makes them look to their boss or team

**Objections and fears**
- What makes them hesitate to buy or switch

**Alternatives they consider**
- Competitor / DIY / do nothing / hire someone

**Key vocabulary** (sourced from research)
- "[phrase]"
- "[phrase]"

**How to reach them**
- Channels:
- Content they consume:
- Communities and voices they trust:

**Evidence**
- Data points: [n] — [sources, dates]
- Confidence: High / Medium / Low
- Proxy-sourced fields: [list, or "none"]
- Would be disproved by: [observation that would falsify this persona]
```

The last block is the ClauKit addition — a persona without its evidence trail is an assumption with a headshot.

---

## Persona anti-patterns

- **Don't name them cutely** ("Marketing Mary") unless the team genuinely finds it useful — usually a distraction.
- **Don't average across segments** — a persona representing everyone represents no one.
- **Don't invent details** — leave a field blank rather than filling it in. Blank is honest; filled-in is a fabricated stat by another name.
- **Revisit quarterly** — personas decay as market and product move.

---

## ICP refinement

An ICP is narrower than a persona: it is the *account/segment* filter, not the human. Derive it from the research, in this order:

1. **Start from the best customers** — the ones already segmented for interviews: high deal size, short sales cycle, low churn. What do they share firmographically (size, industry, stage, stack, geography)?
2. **Add the qualifying trigger** — the event that makes the job urgent. An account matching the firmographics without the trigger is not in-market yet.
3. **Add disqualifiers** — segments where the research shows a different job, a free workaround, or a structural blocker (procurement, compliance, budget owner mismatch).
4. **State the evidence** — how many accounts/interviews back each criterion, and what would falsify it.

Hand the result to `product-marketing` for the ICP section of `plans/marketing-context.md` as a proposed diff — do not overwrite the hub silently.

---

## Theme synthesis template

```
## Top themes (ranked by frequency x intensity)

### Theme 1: [name]
**Summary**: [1-2 sentences]
**Frequency**: appeared in X of Y sources
**Intensity**: High / Medium / Low (from the emotional language used)
**Confidence**: High / Medium / Low
**Representative quotes**:
- "[exact quote]" — [source, date]
- "[exact quote]" — [source, date]
**Implications**: what this means for messaging / product / positioning
**Would be disproved by**: [the observation that would kill this finding]
```

---

## Deliverable formats

Ask which is wanted before generating:

1. **Research synthesis report** — themes, quotes, patterns, implications (the default `plans/marketing/<research>/report.md`)
2. **VOC quote bank** — verbatim quotes organized by theme, for copy
3. **Persona document** — 1-3 personas built from the research
4. **Jobs-to-be-done map** — functional, emotional, and social jobs by segment
5. **Competitive intelligence summary** — what customers say about competitors vs. you
6. **Research gap analysis** — what is still unknown, and how to find it

Every deliverable carries confidence labels and sources. Redact PII per `.claude/workflows/automation-rules.md`.

---

Source: `coreyhaines31/marketingskills` (MIT, (c) 2025 Corey Haines), adapted for ClauKit. The evidence/falsification blocks are ClauKit additions required by `.claude/workflows/marketing-rules.md`.
