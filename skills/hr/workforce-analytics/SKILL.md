---
name: hr-workforce-analytics
description: Workforce planning and people analytics — strategic workforce plan (supply, demand, gap, build/buy/borrow/bot), headcount and attrition forecasting, scenarios with trigger points, people-analytics question→data→method→decision chains, attrition-risk models with fairness and human review, organisational network analysis, HR KPI catalogue with formulas, people budget and fully loaded cost, headcount business cases, shift scheduling and time & attendance controls. Use for "workforce plan", "headcount forecast", "how many people do we need", "attrition model", "flight risk", "scenario plan for a downturn", "which HR KPIs", "how do I calculate turnover", "people budget", "variance to finance", "headcount business case", "build a shift rota", "time and attendance rules". For succession and talent review use hr-performance; for pay structures and pay equity use hr-rewards; for restructuring execution use hr-org-change; for the HRIS and HR data platform use hr-technology.
allowed-tools: Read, Write, Glob, Grep
---

# Workforce Analytics

> A workforce number is worth the decision it changes and the definition behind it — nothing more.

## When this skill activates

**Implicit:** annual or multi-year headcount planning; "how many people do we need"; attrition rising and leadership wants to know why; a CFO asking why people cost outruns revenue; a dashboard nobody reads; a 24/7 rota; overtime or timesheet disputes.
**Explicit:** "Read the `hr-workforce-analytics` skill file and [task]."
**Routed from:** `/hr:workforce plan|forecast|scenario|analytics|kpi|budget|schedule`.

## Scope

Covers:
- Strategic and operational workforce planning, forecasting, scenario planning.
- People analytics method, predictive models on people, network analysis — with privacy and fairness controls.
- KPI definitions and formulas ([references/kpi-catalogue.md](references/kpi-catalogue.md)), dashboards, leadership narrative.
- People budget, fully loaded cost, headcount business cases, hire/contract/automate economics.
- Demand-based scheduling and time & attendance controls.

Does NOT cover:
- Succession slates, talent review, 9-box, career paths → [[hr-performance]].
- Pay structures, benchmarking, pay-equity analysis → [[hr-rewards]].
- Skills taxonomy design and the L&D programme that closes a gap → [[hr-learning]].
- Org design, restructuring rationale, change comms → [[hr-org-change]]; RIF/redundancy separation process → [[hr-employee-relations]] `exit`.
- Engagement surveys and listening → [[hr-culture]].
- Attendance discipline cases, payroll compliance, policy text → [[hr-employee-relations]].
- HRIS data model, integrations, HR data governance platform → [[hr-technology]].
- Multi-country cost and statutory addenda → [[hr-global]]. Requisition and funnel execution → [[hr-recruiting]].

## plan — strategic workforce plan

Start from the business strategy document, not last year's headcount. Match horizon to decision:

| Horizon | Decision it serves | Primary output |
|---|---|---|
| 0–3 months | Pipeline execution | Open roles vs candidates in process |
| 3–12 months | Annual headcount plan, budget | Roles by function/level/quarter |
| 1–3 years | Capability build, sourcing strategy | Critical roles, capability gaps, roadmap |
| 3+ years | Strategic bets | Scenario range, not a point estimate |

1. **Demand.** Annotate the strategy: what grows, shrinks, transforms, appears. Interview function leaders. Model roles × level × location × year, and list net-new role types. Express demand as a range.
2. **Supply.** Current headcount by segment, then project with no action: `supply(t+1) = headcount(t) − expected exits (segment rate × headcount) − moves out + moves in + committed starts`. Segment exit rates by tenure band, function, level — never one blended rate. Add capability supply: skills inventory at a 4-level proficiency scale (awareness · working · advanced · expert).
3. **Gap.** Four types: **volume** (too many/few), **capability** (can't do the work), **distribution** (wrong level/location mix), **timing** (supply arrives after demand peaks). A negative gap is a redeployment question before it is a reduction question.
4. **Prioritise** each gap on strategic criticality · gap size vs supply · lead time to close · risk if unaddressed. A gap that takes longer to build than the business can wait is the urgent one.
5. **Close** — usually a mix:

| Lever | Use when | Watch |
|---|---|---|
| **Build** (develop, rotate, mobility) | Long-term differentiator; learnable inside the horizon; retention of developed people is credible | Build lead time; hand the programme to [[hr-learning]] |
| **Buy** (hire) | Needed now; scarce internally; market supply exists at a price you will pay | Time to fill, ramp, offer competitiveness |
| **Borrow** (contract, partner, outsource) | Temporary, project-bound, or not worth owning | Knowledge leaves with them; worker-classification risk ([[hr-global]] — classification test there) |
| **Bot** (automate, AI) | Repeatable, rules-based work | Upfront cost vs marginal cost; role impact → [[hr-org-change]] |

6. **Roadmap** in business language: priority gaps and lever, hires by function/level/quarter, mobility and L&D asks, automation assumptions, milestones and decision points, risk register (market scarcity, no internal successor, key-person concentration, attrition above assumption, build slippage, strategy shift).
7. **Monitor** quarterly against leading indicators; re-plan when strategy moves.

**Skills supply — triangulate, never trust one source.** Self-report (coverage, inflated) · manager assessment (grounded, biased, partial view) · certifications/courses (objective, measures exposure not proficiency) · project/work evidence (applied, expensive). Use self-report for breadth; validate high-stakes gaps (critical roles) with manager or work evidence. Treat a skill as "emerging" only when external market signal and internal early-adoption signal agree.

**Annual headcount requests** exceeding budget: classify each as replacement · approved growth · critical capability gap · speculative; require the request template ([references/templates.md](references/templates.md)); score on business impact, urgency, risk if delayed, credible alternatives, budget fit; approve, defer with a review date and criteria, or decline.

Failure modes: plan built from last year's numbers; HR-only process (finance and function leads join at demand modelling, not at sign-off); single-point forecast; every gap "urgent"; plan never revisited.

## forecast — headcount and attrition

| Method | Fits | Limitation |
|---|---|---|
| Trend extrapolation | Stable functions | Blind at inflection points |
| Ratio / driver-based | Headcount scales with a forecastable metric (tickets, pipeline, units) | Driver must itself be forecastable |
| Bottom-up manager input | New or specialised roles | Optimism; inconsistent standards |
| Scenario-based | High uncertainty | A range, harder to act on |

Typical blend: driver-based for growth, trend for attrition backfill, manager input as a validation layer.

- **Write every driver down**: "1 FTE per [N] [units]/month at current productivity", with N derived from the organisation's own data. An implicit ratio in a spreadsheet is unreviewable.
- **Attrition is likely the largest error source** — a hypothesis to confirm in your own accuracy log. Segment by tenure band/function/level; split regretted vs non-regretted when the forecast informs retention spend; adjust for known events (reorg, return-to-office change, comp cycle).
- **Effective headcount** discounts new hires for ramp time where ramp is long; a new hire is not a tenured FTE.
- **Ranges, not points**: "most likely X, range Y–Z" tied to named assumptions.
- **Accuracy loop**: compare forecast vs actual each period by function; separate *volume* error from *timing* error; three same-direction misses = a structural assumption, not noise. Keep forecasting at arm's length from target-setting.
- **Top-down vs bottom-up**: never pick one silently. Isolate where they diverge (check specific teams or roles first), backtest each side's history, present the reconciled range with the disputed roles flagged as contingent on a separate decision.
- **Audience views from one model**: recruiting gets role-level, time-phased detail; finance gets cost-phased totals; leaders get the driver assumptions to challenge.

## scenario — scenarios and triggers

Scenarios vary **assumptions**, not just growth rates: revenue path, market/product expansion pace, automation adoption, talent availability and cost, regulation, competitive pressure, macro conditions. Set: base (operating plan) · upside · downside · disruption (qualitatively different future). Two (base + downside) is enough for many stress tests.

1. Model headcount and cost by function per scenario (template in [references/templates.md](references/templates.md)).
2. **Trigger points**: observable, leading, owned, checked monthly — "pipeline coverage below [threshold] for [n] consecutive months". Thresholds come from the organisation's own plan; never from a generic rule.
3. **Pre-plan actions per scenario**, tagged reversible / irreversible. Downside order: freeze non-critical requisitions → pause contingent and discretionary spend → redeploy to critical work → only then any involuntary action. Pre-design, don't pre-decide.
4. Agree decision rights: who activates which scenario, inside which time window.
5. Cadence: full build annually · assumption check quarterly · triggers monthly · full refresh when strategy changes.

Facilitation reframe when leaders anchor on the base case: "We are not predicting which future happens — we are deciding what we do if each one does." Any scenario that implies reductions hands design to [[hr-org-change]] and the separation process to [[hr-employee-relations]] `exit`, and ends with: *review with qualified employment counsel (or the relevant authority) before acting.* (hr-rules § 2).

## analytics — question → data → method → decision

Never start from "what data do we have". Write the chain first:

| Step | Content |
|---|---|
| Question | One sentence, answerable — "Why is voluntary exit concentrated in Support?" |
| Decision | What changes, who decides, by when |
| Data & definitions | Sources, fields, inclusions (contractors? interns? transfers?), period, known gaps |
| Method | Descriptive → diagnostic → predictive → prescriptive; choose the lowest level that answers |
| Output → owner | Finding, confidence, recommended action, named role, date |

**Before trusting the data:** one ID per person; departments match the approved structure; exit reasons in standard codes; worker types tagged separately; transfers not counted as exit + hire; missing values shown, not dropped silently.

**Small groups:** suppress any cell below the minimum group size in `plans/hr-context.md` § data rules (absent ⇒ ask; do not choose a number silently); apply complementary suppression so a hidden cell cannot be back-calculated from totals. Correlation is not cause — diagnose with exit themes, manager context and timeline before recommending.

**Predictive models on individuals** (flight risk, hiring success) — hr-rules § 3, § 6:
- **Worth building only if** the outcome is consequential, measurable, has enough history with outcome events, and an intervention exists. Performance-rating and "potential" prediction may fail the measurable test — check it explicitly.
- **Frame**: voluntary and involuntary exit modelled separately; fixed horizon; segment populations whose drivers differ.
- **Features**: tenure/career dynamics, engagement trend (team-level only; individual survey responses are never model inputs), manager/team context, pay position vs band. **Exclude** protected characteristics and their proxies (postcode, graduation year, school, employment gaps, leave history); run an adverse-impact check on any feature with plausible demographic correlation.
- **Validate**: time-based split (train before a cutoff, test after); precision in the top-risk tier and recall at the action threshold; calibration across the score range; beat a simple baseline (e.g. tenure rule) or don't ship.
- **Fairness**: flag rates and false-positive/negative rates by group where lawful to analyse; document results — the document is the defence.
- **Use**: each risk tier maps to a defined action (a career/workload conversation, not a verdict); never punitive, never a performance input; scores visible only to the HRBP and direct manager; retention and purge rule; disclosure per jurisdiction ([VERIFY: local data-protection and AI law]); revalidate at least annually and after major change. Model card template: [references/templates.md](references/templates.md).

**Organisational network analysis** — a diagnostic, not surveillance. Define the question (collaboration vs formal teams · advice/influence flow · silo and bottleneck) and the boundary first. Data: name-generator survey (best for advice/influence), calendar co-attendance, aggregated communication **metadata only, never content**, shared-artifact co-activity. Metrics: degree centrality (connections), betweenness (bridges/bottlenecks), density (internal cohesion), cluster boundaries vs org chart (silos). Rules: aggregate reporting; purpose stated up front and held (never repurposed for layoffs or ratings); communicated or opt-in participation; high centrality ≠ high performance. Actions: redundancy around key-person bridges, boundary-spanning roles, onboarding network support. Redesign itself → [[hr-org-change]].

**Narrative for leaders**: three risks max, each with evidence, owner, date; trend over 4–6 periods, not one month.

## kpi — KPI set with formulas

1. Pick a short set tied to the current priority (retention · cost · hiring · capability), balanced leading vs lagging.
2. For each KPI fix: formula, inclusions/exclusions, source system, owner, cadence, action trigger, audience. Formulas: [references/kpi-catalogue.md](references/kpi-catalogue.md).
3. **No target values from this skill.** Targets and RAG thresholds come from the organisation's plan or a cited benchmark (source + date) — otherwise `[NEEDS DATA]` (hr-rules § 4).
4. Dashboard: workforce health · cost efficiency · pipeline; each row shows current, prior, plan, trend; a three-sentence narrative on top.
5. Review the set quarterly; drop metrics no decision uses.

Common errors: reporting one blended turnover number; mixing headcount definitions across reports; annualising a single volatile month; outputs (training hours) presented as outcomes; a benchmark without source, date, industry and size band.

## budget — people budget and headcount plan

**Cost components** (each role or level band): base · variable at **expected** attainment, not target · equity at accounting cost amortised over vesting · employer statutory contributions `[VERIFY: <country> social-insurance / payroll-tax law, current year]` · benefits · overtime/shift premia · recruiting and onboarding (amortised over expected tenure) · L&D · equipment, licences, space · contingent labour. Build the organisation's own fully-loaded multiplier per country and level; never apply a rule-of-thumb multiplier to a decision.

**Headcount ≠ cost.** Per planned role: level, location, start month, planned rate (band midpoint, never an identifiable person's salary — hr-rules § 3), multiplier, annualised cost, in-year cost (`annualised × months remaining ÷ 12`). Keep **approved** and **planned-not-approved** in separate lines. Roll up to a monthly run-rate.

**Cycle:** strategic framing (CHRO + CFO agree the envelope) → bottom-up requests → consolidate and challenge against the envelope → approval (plan of record) → in-year reforecast (monthly or quarterly).

**Variance — explain by driver**, in finance terms (run-rate, one-time vs recurring, in-year vs annualised): hiring pace vs plan (vacancy savings vs delivery risk) · hire rate vs budgeted rate · attrition vs assumption · mix shift (level, permanent/contract). Over the envelope: slow hiring, defer roles, offset in lower-priority areas, or request an increase — decided early, not in Q4. Agree assumptions (merit timing, attrition, backfill delay, salary assumptions refreshed during the year) with finance in writing.

**Decision rights:** CHRO + CFO — envelope, major reforecasts · HRBP + finance partner — function plan, backfills within budget · business leader — priority and timing within allocation · recruiting — execution on approved roles only.

**Headcount business case:** value hypothesis (revenue capacity, risk reduced, cost avoided) → fully loaded cost as a range → counterfactual (overtime, contractor spend, delay, burnout attrition) → time-phase cost (immediate) vs value (ramps) → sensitivity on the two weakest assumptions → payback period. **Hire vs contract vs automate:** compare total cost over the same horizon (a contractor rate already embeds overhead and margin), flexibility value, knowledge retention, automation's upfront-vs-marginal profile.

## schedule — scheduling, time & attendance

**Demand to roster:**
1. Forecast workload per time block from history, seasonality and known events.
2. Required concurrent staff per block = `volume × handle time ÷ productive minutes per block`.
3. Required FTE = `coverage hours per week ÷ contracted hours per FTE ÷ (1 − shrinkage)`, shrinkage (absence, leave, training, breaks) measured from own data.
4. Choose a pattern (fixed, rotating, compressed, continuous 24/7 rotation); rotate undesirable shifts (nights, weekends, holidays) by a published rule.
5. Check every roster against local rules before publishing: daily/weekly hour limits, rest between shifts, weekly rest, night work, overtime thresholds and premia, advance-notice and change-compensation rules, on-call/standby pay — each `[VERIFY: <country/state> working-time law]` (hr-rules § 1–2).

**Swaps and open shifts:** who may initiate, approval role, request deadline, qualification check, logged in the system — never informal.

**Time & attendance controls:**
- Missed-punch auto-flags; rounding rule neutral over time (never systematically favours the employer); every manual edit logged with who/when/why.
- Approval workflow with a delegate so payroll is not blocked; reconcile timesheets before payroll cut-off.
- Classify who is hours-tracked for overtime vs tracked for attendance only, per local law `[VERIFY]`; overtime pre-approval where policy requires.
- Distributed teams: one time-zone rule for the workweek.
- Geofencing or biometric clock-in is personal (biometric often special-category) data — purpose, notice and lawful basis first `[VERIFY: data-protection law]`; route to [[hr-technology]].
- Attendance occurrence systems: define occurrence types, grace period, expiry window, escalation tiers; exclude legally protected absences (leave entitlements, disability, family) — `[VERIFY]`. Warnings and dismissal steps belong to [[hr-employee-relations]] and end with: *review with qualified employment counsel (or the relevant authority) before acting.*

## Guardrails

- **Jurisdiction first** for working time, contributions, data rules — hr-rules § 1.
- **No statutory figures from memory**; `[VERIFY: <law/authority>]` — hr-rules § 2.
- **No named people, IDs, individual salaries, health or special-category data** in `plans/hr/`; aggregate with minimum group size — hr-rules § 3.
- **No invented benchmarks or targets**; cite (source + date) or `[NEEDS DATA]` — hr-rules § 4.
- **Adverse-impact check** on any model, rating or selection outcome over a group — hr-rules § 5.
- **Human in the loop**: model scores prompt a conversation; they never decide hiring, exit, pay or discipline — hr-rules § 6.
- **Reductions, discipline, classification** outcomes end with the counsel-review line — hr-rules § 2.

## Output

- `plan` → `plans/hr/<slug>/workforce-plan.md` — demand, supply projection, gaps, levers, roadmap, risk register.
- `forecast` → `plans/hr/<slug>/forecast.md` — method, drivers, segmented attrition, ranges, accuracy log.
- `scenario` → `plans/hr/<slug>/scenarios.md` — assumption sets, model, triggers, pre-planned actions, decision rights.
- `analytics` → `plans/hr/<slug>/analysis.md` (+ `model-card.md` for any predictive model).
- `kpi` → `plans/hr/<slug>/kpi-set.md` — KPI table, definitions, owners, triggers, dashboard layout.
- `budget` → `plans/hr/<slug>/people-budget.md` — assumptions, role-level cost plan, run-rate, variance narrative or business case.
- `schedule` → `plans/hr/<slug>/schedule-design.md` — demand model, FTE calc, pattern, rule checks, T&A controls.

## Before proceeding

1. Which decision does this serve, who makes it, and by when?
2. Scope: which entities, countries, functions, worker types?
3. What data exists (HRIS exports, payroll, ATS, time system) and how far back?
4. Which assumptions are already agreed with finance (attrition, merit, backfill delay)?
5. Is any output about identifiable individuals (risk scores, rosters)? Who may see it?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, headcount, systems, minimum group size
- [[hr-performance]] — succession and talent review consuming the plan
- [[hr-learning]] — build-lever programmes; [[hr-recruiting]] — buy-lever execution
- [[hr-rewards]] — bands feeding cost models; pay equity
- [[hr-org-change]] — restructuring design and redeployment · [[hr-employee-relations]] — `exit` for reductions
- [[hr-technology]] — HRIS data model, data governance, T&A system
- [[hr-global]] — multi-country cost and working-time addenda
- `.claude/workflows/hr-rules.md`

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-analytics`, `hr-kpi`, `hr-organization-network-analysis`, `hr-people-budgeting`, `hr-predictive-analytics`, `hr-skills-intelligence`, `hr-strategic-workforce-planning`, `hr-time-attendance`, `hr-workforce-economics`, `hr-workforce-forecasting`, `hr-workforce-intelligence`, `hr-workforce-planning`, `hr-workforce-scenario-planning`, `hr-workforce-scheduling` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; 14 overlapping sources merged into one plan→forecast→scenario→analytics→kpi→budget→schedule flow; unsourced figures removed (turnover, cost-per-hire, time-to-fill, engagement and training-spend benchmarks, cost multipliers, attrition-cost ranges, example trigger thresholds, statutory contribution rates); minimum-group-size, model-fairness, human-review and counsel-review guardrails added; routing via `/hr:workforce`.
