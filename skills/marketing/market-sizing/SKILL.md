---
name: market-sizing
description: Market sizing — TAM/SAM/SOM built bottom-up from addressable accounts x realistic ACV, cross-checked against cited published figures, with every number sourced or marked [NEEDS DATA]. Use for "market sizing", "TAM", "SAM", "SOM", "how big is this market", "addressable market", "market opportunity", "is this market big enough", "size the opportunity", "total addressable market", "how much revenue is in this segment", "market size for the deck".
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Market Sizing — TAM / SAM / SOM

> A market size is an argument, not a fact. It is worth exactly what its assumptions and its sources are worth — so ship those, or you have shipped a guess with a currency symbol in front of it.

## When this skill activates

**Implicit:** "how big is this market", "what's our TAM", "size the opportunity", "is this market big enough to be worth building for", "how much revenue sits in this segment", "we need a market slide".
**Explicit:** "Use the market-sizing skill to [task]."
**Routed from:** `/mk:research market` (the sizing half; [[customer-research]] covers the demand-side half), the `market-researcher` agent.

## Scope

Covers:
- TAM / SAM / SOM defined, derived, and bounded — each from the one above it by a stated filter.
- Bottom-up sizing (default method): countable addressable units x evidenced ACV.
- Top-down sizing as a cross-check against published category figures, with its failure modes.
- Value-pool sizing where no category and no register exist.
- Triangulation: two methods and a written reconciliation of the gap between them.
- Source-quality grading, citation labelling, sensitivity, and falsification conditions.

Does NOT cover:
- Primary demand evidence — interviews, surveys, review mining → [[customer-research]]. That skill supplies the segment definitions and the willingness-to-pay signal this one multiplies.
- Competitor pricing/positioning teardowns → [[competitor-profiling]]. Consumed here as an ACV and incumbency input.
- Owning the ICP record → [[product-marketing]] writes `plans/marketing-context.md`. The ICP there is what bounds SAM.
- What to do with the number — channel and tactic choice → [[marketing-ideas]].
- Revenue forecasting, unit economics, pricing strategy. A market size is not a plan.

## The three numbers

| Number | Answers | Bounded by | Inflated by |
|---|---|---|---|
| **TAM** | If every entity with this problem bought a solution in this category for a year, at your price, what is the total annual spend? | Category definition + buying-unit count | Swapping in the widest adjacent category; counting entities that cannot legally or technically buy; using lifetime rather than annual spend; claiming the whole budget line rather than the slice the product replaces |
| **SAM** | Of that, how much matches the customers we actually serve? | The ICP: geography, language, segment size, regulatory eligibility, tech-stack fit, price band | An aspirational ICP nobody can name accounts against; ignoring geo and regulatory limits; counting segments no channel reaches |
| **SOM** | Of that, how much can we win in a stated period, at current capacity? | Reachable channels, sales throughput, budget, delivery capacity, incumbent lock-in | Picking a share percentage instead of building from capacity — the "1% of a huge market" move |

Two standing rules. **Each number is derived from the one above it by a filter you can state and a reader can check** — never by a percentage chosen because it looked reasonable. And **all three are annual spend** unless the report says otherwise in the same line; lifetime value never enters a TAM.

## Method 1 — bottom-up (default; use this unless it is impossible)

1. **Define the buying unit.** The entity that signs: company, site or location, team, seat, household, vehicle. One unit, named explicitly. Most sizing errors are unit errors.
2. **Count the units** from something countable: government business registries, regulatory licence registers, statistical-agency establishment counts, industry-association membership rolls, firmographic databases, platform/app-store directories, public customer counts disclosed by incumbents, job-posting counts as an adoption proxy.
3. **Apply qualifying filters serially**, one line each, showing the count after each. This ladder *is* the SAM derivation — it is the part a reader argues with, so make it arguable.
4. **Set ACV from evidence**: your own closed-won deals, competitor published pricing x typical unit size, or the annual cost of the alternative being replaced. Never from a price you hope to charge later.
5. **Multiply, then name the sensitivity** — the two or three inputs that move the answer most.

### Worked example

Every number below is an invented round figure chosen to show the arithmetic. None is a real count, none is researched, and none may be reused or cited. In a real run each line carries a source and a collection date.

Hypothetical: scheduling software for veterinary clinics.

| Step | Figure | Note |
|---|---|---|
| Buying unit | one clinic location | not a seat, not a practitioner |
| Units in market | 20,000 | illustrative; a real run cites a licence register with its year |
| Filter: 3+ practitioners | x 0.60 → 12,000 | smaller clinics run on paper; from interview evidence, not assumption |
| Filter: geography served today | x 0.50 → 6,000 | this is the SAM unit count |
| ACV | 2,400/yr | competitor list price 200/mo, taken from a public pricing page |
| **SAM** | 6,000 x 2,400 = **14.4M/yr** | round to ~14M — the inputs do not support three digits |
| Filter: under contract with an incumbent | x 0.75 → 4,500 | winnable only at renewal; model the renewal timing |
| Capacity: 2 reps x 4 closes/month | 96/yr | plus ~40/yr self-serve at current traffic |
| **SOM, year 1** | ~136 clinics x 2,400 = **~330K new ARR** | capacity-bound, not share-bound |

Note what the example does *not* do: it never asserts a share of the market. SOM falls out of rep count and close rate. If the capacity line yields a number the reader finds too small, the answer is to change capacity, not to raise the percentage.

## Method 2 — top-down (cross-check, rarely primary)

Start from a published category figure and narrow it with the same ICP filters. Useful as a sanity bound; dangerous as a headline.

Failure modes, all common:

- **Stale.** Reports circulate for years. Check the *data-collection* year, not the publication date and never the re-publication date.
- **Vendor-funded.** A report commissioned by a vendor sizes the category that vendor sells into. It is marketing with a methodology section.
- **Category mismatch.** The report's category boundary almost never matches the product. Read its own scope note; if the scope and method are not stated, the number is unusable at any price.
- **Press-release laundering.** A blog cites a press release citing a paywalled report nobody has read. Trace to the primary. If the methodology is not visible, label the figure unverified and do not build on it.
- **CAGR extrapolation.** A long-horizon forecast is a line drawn through two points. Use the base-year figure; treat the forecast as commentary, not data.
- **The motivated number.** A top-down TAM is usually the number someone wanted rather than the number that is true. When a figure lands suspiciously close to a round, impressive threshold, ask who benefited from it landing there.

A top-down figure never stands alone. Its job is to be compared against the bottom-up build.

## Method 3 — value pool (when neither of the above fits)

Use when the category does not exist yet, no register counts the buyers, or the product displaces labour and loss rather than a software line item.

Build the pool of value currently spent or destroyed on the job: hours x loaded hourly cost, error/rework/downtime/fraud losses, outsourced spend, or the all-in cost of the incumbent workaround. Then argue a capture rate — what buyers have historically paid for a comparable saving in this segment. The capture rate must be justified from evidence; software captures a modest fraction of the value it creates, and which fraction is the whole argument.

Label the result honestly: this produces a **value pool**, an upper bound on what could be charged, not a market that exists. It is the only defensible method for a genuinely new category, and it is the method most often abused to make a new category look enormous. Substitution sizing — what buyers pay today for the alternative, including doing it manually — is the conservative sibling and is usually the more credible of the two.

## Triangulation (required)

**Size at least two ways.** One method with no cross-check is not a size, it is a guess with arithmetic on it.

| Gap between methods | What it means | What to do |
|---|---|---|
| Within 2x | Normal | Report the range, lead with the lower figure, note the spread |
| 2x-5x | One input is wrong | Hunt the usual culprits: category definition mismatch, ACV drawn from a different segment, unit double-counting (seats vs. accounts), geography scope drift |
| Over 5x | The two methods are measuring different things | Stop. Find the definitional difference before reporting anything |

**Never average across methods.** Splitting the difference between two numbers that disagree produces a third number that is wrong in a new way and looks more authoritative than either. Write the reconciliation instead — the gap between the methods is usually the most informative output of the whole exercise.

## Source-quality tiers

| Tier | What | Label it | Usable for |
|---|---|---|---|
| **A** | Government registries, statistical-agency data, regulatory filings and licence registers, public-company segment disclosures | Publisher, dataset, collection year | Load-bearing inputs |
| **B** | Industry/trade-association counts, paid research with a published methodology and sample | Source + methodology note + date | Load-bearing if the method is visible |
| **C** | Vendor-published: pricing pages, disclosed customer counts, earnings-call metrics | "vendor-published" | ACV and incumbency only — never category size |
| **D** | Vendor press releases, market-research summary sites, content-marketing roundups | "unverified — secondary" | Evidence of what the market believes, nothing more |
| **E** | Recalled figures, numbers with no traceable origin, anything remembered rather than retrieved | — | Never. This includes a figure that feels right |

Tier E is the dangerous one, because a recalled number arrives already sounding plausible. Every figure entering the report carries value, unit, currency, period, source, collection date, and tier.

## SOM realism

Build SOM from capacity, then take the binding constraint — not the optimistic sum:

- **Reachable channels** — how many SAM units any channel you have or can afford actually touches. A segment with no reachable channel is not in SOM at any price.
- **Sales throughput** — quota-carrying reps x close rate x cycle length; or traffic x conversion for self-serve. Whichever the motion actually is.
- **Budget** — CAC x target customers must fit inside the marketing budget that exists.
- **Delivery capacity** — accounts you can onboard and support without breaking retention.
- **Incumbency** — units locked into multi-year contracts are winnable at renewal, not this year. Model the renewal timing rather than ignoring it.

### The "1% of a huge market" fallacy

"The market is enormous — we only need 1%" inverts the entire exercise. It asserts an outcome and reverse-engineers the revenue from it; it says nothing about whether that 1% is reachable, by which channel, against which incumbent; and every experienced reader treats it as proof that no bottom-up work was done. 1% of a vast market is frequently harder to win than 30% of a small one, because the small one has a nameable, reachable buyer list.

Replace it with three sentences: here are the accounts we can reach, here is our close rate, here is what that yields.

Corollary: **a market can be too big.** A large SAM with no concentration and no channel that reaches it is a worse position than a smaller market you can enumerate.

## Anti-fabrication rules (non-negotiable)

Market sizing is the easiest place in marketing to produce a confident, fabricated number: the format looks rigorous and almost nobody audits the inputs. Assume this reader will.

1. **Every figure carries a citation with its date, or is written `[NEEDS DATA]`.** No exceptions — including figures "everyone knows".
2. **Never interpolate.** A figure for one year and one country is not a figure for another year or another country. Do not scale by population, GDP, exchange rate, or a growth rate you did not source.
3. **Never present a modeled estimate as a measured one.** Modeled figures are labelled `[estimated]` inline at every occurrence — in tables, in the headline, in the summary sentence.
4. **The assumptions are the deliverable.** Every modeled number ships with a visible list of what it rests on. The number is downstream of the assumptions; a reader who disputes one must be able to see it and recompute without asking you.
5. **No invented precision.** A round input cannot produce a precise output. If the count is "about 6,000", the answer is "~14M", not "14.4M".
6. **No self-manufactured growth rates.** Report a CAGR only if a cited source states it. Never construct one from two of your own estimates.
7. **Unit, currency, and period on every figure.** An unlabelled number is not a figure.
8. **`[NEEDS DATA]` is a valid deliverable.** If the sizing cannot be done from available sources, say so and list precisely what would unblock it. A report full of gaps is honest; a report full of invented numbers is not recoverable.
9. **Round-number smell test.** A suspiciously round figure that is heavily cited is often one old estimate laundered through repetition. Trace it or drop it.

This section operationalizes the no-hallucinated-metrics rule in `.claude/workflows/marketing-rules.md`. It is not negotiable down for a deck, a deadline, or a founder who wants a bigger number.

## Key concepts

- **Falsifiability** — every size estimate ships with the observation that would disprove it and the single input it is most sensitive to. "If under half of qualifying clinics hold a budget line for scheduling software, SAM falls by more than half" is a falsifiable claim; "the market is large" is not. Required by `.claude/workflows/marketing-rules.md` for research outputs.
- **Sensitivity** — rank inputs by their effect on the result. Usually ACV and one count filter dominate and the rest is noise. Report the estimate at the low and high plausible value of the dominant input, not just at the midpoint.
- **ICP bounds SAM** — SAM is a restatement of the ICP in units and currency. If the ICP in `plans/marketing-context.md` is vague, SAM cannot be computed; fix the ICP first, via [[product-marketing]] and [[customer-research]].
- **Serviceable vs. reachable** — a unit that qualifies but that no channel touches belongs in SAM and not in SOM. Conflating the two is how SOM inflates.
- **Size is not opportunity** — a large market with entrenched incumbents and no wedge is worse than a small one where you hold a distribution advantage. Report both.
- **Stated direction** — say whether the build is deliberately conservative or aggressive, and why. An unstated bias reads to a careful reader as fabrication.

## Output

`plans/marketing/<research>/market-size.md` — sits beside the `/mk:research` deliverable `plans/marketing/<research>/report.md` and is linked from it; fold it in as a section instead when the engagement is small.

Required sections:

1. **Headline** — TAM / SAM / SOM with unit, currency, period, method label, and `[estimated]` where modeled.
2. **Assumptions table** — assumption · value · source · collection date · tier · sensitivity (high/medium/low). This table is the report; everything else is commentary on it.
3. **Bottom-up build** — the filter ladder, one row per filter, count after each.
4. **Cross-check** — the second method, its result, and a written reconciliation of the gap.
5. **Sensitivity note** — dominant input, result at its low and high plausible values.
6. **Falsification** — what observation would show this size is wrong, and where to look for it.
7. **Sources** — publisher, title, collection date, tier, URL, one per line.
8. **Open questions** — every `[NEEDS DATA]` marker collected, with what would resolve it.

## Before proceeding

1. What decision does this size support — fundraise, segment prioritization, go/no-go, budget allocation? Required precision differs sharply.
2. What is the buying unit, and what price point (or price band under test)?
3. Which geography and segment — as the hub's ICP defines them, or narrower?
4. What evidence already exists — closed-won deals, pipeline, competitor pricing, access to any register or firmographic database?

Read `plans/marketing-context.md` first and skip whatever it already answers.

## Cross-references

- `plans/marketing-context.md` — required hub; its ICP definition is what bounds SAM
- [[customer-research]] — bottom-up demand evidence, segment definitions, willingness-to-switch and budget language; also the fastest way to falsify a top-down figure
- [[competitor-profiling]] — competitor pricing, disclosed customer counts, incumbency (ACV and SOM inputs)
- [[product-marketing]] — owns the ICP and positioning record this skill sizes against
- [[marketing-ideas]] — what to do once a segment is sized and judged reachable
- `.claude/workflows/marketing-rules.md` — no-hallucinated-metrics, falsifiable findings, output conventions
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

ClauKit-authored, not imported from any upstream source. Written to close a gap: `/mk:research market` and the `market-researcher` agent both promise TAM/SAM/SOM sizing, no skill in the kit supplied a method, and [[customer-research]] explicitly declines to own it.
