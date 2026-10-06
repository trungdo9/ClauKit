---
name: pipeline-forecast
description: Opportunity pipeline diagnostics and revenue forecasting — pipeline velocity, quality-adjusted coverage, stage conversion, deal health scoring, Commit / Best Case / Upside forecasts with stated assumptions, pipeline-review facilitation, and rep coaching cadence. Use for "pipeline review", "pipeline health", "forecast", "commit call", "are we going to hit the number", "coverage ratio", "pipeline velocity", "win rate by stage", "stalled deals", "forecast accuracy", "RevOps report", "rep coaching plan", "ramp plan". Opportunity pipeline only — lead scoring and lifecycle stages belong to the crm-specialist agent; single-deal strategy belongs to deal-strategy.
allowed-tools: Read, Write, Glob, Grep
---

# Pipeline & Forecast

> A forecast is a set of claims about specific deals. If you cannot show the evidence under each one, you are reporting optimism with a currency symbol.

## When this skill activates

**Implicit:** "run the pipeline review", "what's our forecast this quarter", "do we have enough pipeline", "which deals are at risk", "why did win rate drop", "the CRM says X but I don't believe it", "build a coaching plan for this rep", "new rep ramp plan".
**Explicit:** "Use the pipeline-forecast skill to [task]."
**Routed from:** `/mk:sales pipeline`, `.claude/workflows/sales-workflow.md` Phase 5 (forecast roll-up), and any time the question is portfolio-level rather than one deal.

## Scope

Covers:
- Pipeline velocity and its four levers, segmented.
- Coverage — raw and quality-adjusted — against remaining quota.
- Stage conversion funnel and stage-age benchmarks from the user's own history.
- Deal health scoring (qualification depth × engagement × progression).
- Forecast construction: Commit / Best Case / Upside, compared across methods.
- Pipeline-review facilitation and the coaching cadence around it (folded in from the source's sales-coach persona).

Does NOT cover:
- Deep strategy on one deal — MEDDPICC gap closing, competitive zones, win plans → [[deal-strategy]].
- Call-level coaching (discovery technique, objection handling) → [[discovery]].
- Lead scoring, MQL/SQL definitions, lifecycle stages → the `crm-specialist` agent (`/mk:nurture`).
- Account-level expansion and churn → [[account-expansion]].
- Company financial forecasting (P&L, cash) → the finance skills (`/mk:finance`).

## Pipeline velocity

**Velocity = (Qualified opportunities × Average deal size × Win rate) ÷ Sales cycle length**

Each term is a diagnostic lever — and each must be **segmented** (by segment, source, deal size, rep tenure) before any conclusion. Blended averages hide the signal.

| Lever | Watch for |
|---|---|
| Qualified opportunities | Falling creation shows up in revenue quarters later — the earliest warning in the system |
| Average deal size | Up: better targeting or scope creep. Down: discount pressure or market shift |
| Win rate | Track by stage, rep, segment, size, over time. A drop concentrated at one stage is a process failure, not a person |
| Cycle length | Lengthening is often the first symptom of competition, a growing buying committee, or qualification gaps |

## Coverage

Two ratios, never mixed:

- **Raw coverage** = *unweighted* open pipeline ÷ remaining quota for the period. Required raw coverage ≈ 1 ÷ the user's **historical win rate for the segment**, on pipeline of that age. Derive it; do not import a generic "3x".
- **Weighted coverage** = probability-weighted pipeline ÷ remaining quota. The weighting already applies the win rate, so the target is ≈ 1.0 — dividing by win rate again double-discounts and overstates the pipeline needed.
- Report **quality-adjusted coverage** alongside raw: discount deals that are stale, under-qualified, or single-threaded. A smaller pipeline of active, qualified deals beats a large stale one.
- Flag any deal with no update in 30+ days for review regardless of stage or close date (a hygiene threshold — adjust to the user's cycle length).

## Deal health scoring

Stage + close date is not a methodology. Score three dimensions:

1. **Qualification depth** — MEDDPICC (Metrics, Economic buyer, Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition), each 0–5 on the same evidence scale as [[deal-strategy]] (one scale across the kit). Under-qualified deals in late stages are the usual source of forecast misses. Full framework → [[deal-strategy]].
2. **Engagement** — meeting recency, stakeholder breadth (single-threaded large deals are high risk), buyer-initiated activity (the strongest positive signal), content engagement.
3. **Progression** — time in current stage vs. the user's median for that stage. A deal sitting well past the median needs an explicit intervention or removal.

```markdown
# Deal Score: <deal-slug>
| Element | G/Y/R | 0–5 | Evidence / gap |
|---|---|---|---|
| Metrics | | | |
| Economic buyer | | | |
| Decision criteria | | | |
| Decision process | | | |
| Paper process | | | |
| Identify pain | | | |
| Champion | | | |
| Competition | | | |
Qualification [N]/40 · Engagement [N]/10 · Progression [N]/10 — report the three separately; a 0–1 on EB, Pain or Paper Process overrides any total
Recommendation: Advance / Intervene / Nurture / Disqualify — [next action, owner, date]
```

## Forecast construction

Layer the methods and **compare them** — divergence between methods is itself the risk signal.

| Method | Base |
|---|---|
| Stage-weighted (CRM) | CRM stage probabilities — usually optimistic |
| Historical conversion | Actual close rate of deals at that stage, segment, and period in the user's history |
| Velocity-adjusted | Raise/lower probability by how fast the deal is moving vs. median |
| Engagement-adjusted | Multi-threaded, active deals vs. single-threaded, quiet ones |
| Seasonal | Quarter-end compression, customer budget cycles |

Forecast categories, **defined by evidence, not feel**:
- **Commit** — verifiable evidence every close condition is met (decision made, paper process mapped and moving, signer identified).
- **Best Case** — Commit + qualified deals with a credible path and no known blocker.
- **Upside** — could close with effort; at least one material unknown.

Never a single number: report a range and the assumptions under each category. The commit question is never "do you feel good?" — it is "what has to be true for this to close this period, and what evidence shows each condition is met?"

```markdown
# Forecast: <period>
| Category | Amount | Evidence standard | Key assumptions |
|---|---|---|---|
| Commit | | | |
| Best Case | | | |
| Upside | | | |

| Method | Amount | Δ vs Commit |
|---|---|---|
| Stage-weighted | | |
| Historical conversion | | |
| Velocity-adjusted | | |
| Engagement-adjusted | | |

Risks: [value at risk if <condition>] · Data-quality caveats: [missing fields, stale deals]
```

## Pipeline health report

```markdown
# Pipeline Health: <period>
## Velocity (segmented)
| Metric | Current | Prior | Trend | User baseline |
## Coverage
| Segment | Quota remaining | Unweighted pipeline | Raw coverage (need ≈ 1 ÷ win rate) | Weighted coverage (need ≈ 1.0) | Quality-adjusted |
## Stage funnel
| Stage | In | Converted | Lost | Conv. rate | Median days | Days vs median |
## Deals needing intervention
| Deal | Stage | Days stalled | MEDDPICC /40 | Risk signal | Action · owner · date |
## Creation gap
[New qualified pipeline needed by <date> to reach required coverage next period]
```

## Pipeline review facilitation

Cadence (adapt to cycle length):
- **Weekly 1:1** — activities, blockers, habits.
- **Biweekly pipeline review** — deal health, qualification gaps, risk.
- **Monthly/quarterly forecast session** — roll-up accuracy, patterns, resource allocation.

For each deal under review, six questions:
1. What changed since last review — progress, not activity?
2. Who are we talking to — multi-threaded or single?
3. What is the buyer's business case?
4. What is the decision process — steps, people, criteria, timeline?
5. What is the biggest risk, and the plan against it?
6. What is the next step — date, owner, purpose?

Rules: inspect deals, never accept an aggregate number. Challenge "they loved the demo" with "what did they commit to?". **Reward pulling a deal out of commit** — that is honesty; leaving a dead deal in commit is the behavior to coach. Keep review coaching brief and deal-specific; skill development happens in 1:1s.

## Rep coaching (portfolio level)

- Diagnose first from data: where in the funnel does this rep lose deals relative to the team? Then observe actual calls before forming an opinion.
- Classify the gap: **skill** (doesn't know how) → coach; **will** (knows, doesn't do) → manage; **environment** (system prevents it) → fix the system.
- **One focus at a time, max three in a plan**, each with current behavior, target behavior, coaching action, observable milestone, target date.
- Track forecast accuracy per rep over time: chronic over-forecasters need qualification rigor; chronic under-forecasters need deal control.
- Coach behavior, not outcome: a lost deal with disciplined process needs refinement; a lucky win with no process needs coaching now.
- Ramp plans are competency-gated at 30/60/90 days (learn → execute with support → execute independently), with targets the user sets.

Call-level coaching mechanics (timestamped moments, talk-listen, question depth) → [[discovery]].

## Guardrails

- **No invented benchmarks** (`.claude/workflows/marketing-rules.md` §2). Coverage targets, conversion rates, stage durations, and "good" win rates come from the user's own CRM history or are marked `[NEEDS DATA]`. Industry figures only with a cited, dated source.
- **Flag data quality before analysis.** Missing close dates, stale stages, empty qualification fields — list them and state assumptions. Never silently interpolate.
- **Leading vs. lagging.** Act on leading indicators (creation, engagement); lagging ones (revenue, win rate) confirm.
- **Correlation ≠ causation.** A high-win-rate, small-deal rep may be cherry-picking.
- **PII** — deal and rep reports in committed files use slugs and role IDs, not personal names (`.claude/workflows/automation-rules.md` §4).

## Output

`plans/sales/pipeline/<period>/` — `health.md`, `forecast.md`, `deal-scores.md`; rep plans at `plans/sales/coaching/<rep-id>.md` (anonymized ID).

## Before proceeding

1. What period and quota (remaining) are we forecasting against?
2. What CRM export exists — stage, amount, close date, last activity, contacts, qualification fields?
3. What history is available to derive stage conversion and median stage duration?
4. Is the ask a health report, a forecast call, a pipeline review, or a coaching plan?

## Cross-references

- [[deal-strategy]] — deal-level MEDDPICC, competitive zones, win plans, loss debriefs
- [[discovery]] — call-level coaching
- [[account-expansion]] — expansion pipeline and churn risk in the base
- [[outbound]] — pipeline creation when the creation gap is the problem
- `crm-specialist` agent — lead scoring and lifecycle stages upstream of opportunities
- `.claude/workflows/sales-workflow.md`, `.claude/workflows/marketing-rules.md`

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-pipeline-analyst.md` + the pipeline-review, forecast-discipline, and rep-coaching sections of `sales/sales-coach.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: two personas merged into one skill (sales-coach folded; deal coaching → [[deal-strategy]], call coaching → [[discovery]]); fixed coverage targets (3x / 4–5x / 5x+), "<5 of 8 MEDDPICC = underqualified", "2–3x close rate for multi-threaded", ">90/>60/<60% confidence bands", "1.5x median stage" and "$50K single-thread" thresholds, and the coaching statistics (91.2% vs 84.7% attainment, 56% vs 43% win rate) removed or replaced by user-derived baselines; forecast categories redefined by evidence standard; PII rule applied.
