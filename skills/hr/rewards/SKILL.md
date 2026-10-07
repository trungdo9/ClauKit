---
name: hr-rewards
description: Total rewards method — job architecture and levelling (families, tracks, level spine, observable criteria, calibration, title governance), pay structures (midpoint, range spread, midpoint progression, overlap, compa-ratio, range penetration), incentive and pay-mix design, market benchmarking (survey job matching, aging, blending, percentile positioning, geographic differentials), benefits and retirement plan design, recognition programs, total rewards statements, and pay-equity analysis (comparison cohorts, unexplained gap, root cause, remediation, standing governance). Use for "build a pay band", "level our roles", "too many job titles", "benchmark this role", "are we paying competitively", "compa-ratio", "design our benefits", "retirement match", "recognition program", "total rewards statement", "pay equity audit", "gender pay gap". For performance ratings, merit and career-path conversations use hr-performance; for people budgets use hr-workforce-analytics; for multi-country pay use hr-global.
allowed-tools: Read, Write, Glob, Grep
---

# Rewards

> Pay is judged on fairness before amount. A structure that cannot explain why two people doing comparable work are paid differently is not finished.

## When this skill activates

**Implicit:** levelling roles, title sprawl, building or refreshing salary ranges, pricing a new role, out-of-band offers, benefits or retirement plan changes, recognition that feels uneven, showing employees their full package, a pay equity concern or audit request.
**Explicit:** "Read the `hr-rewards` skill file and [task]."
**Routed from:** `/hr:reward structure` · `/hr:reward benchmark` · `/hr:reward benefits` · `/hr:reward recognition` · `/hr:reward equity` (`equity` = pay equity; stock/equity compensation sits under `structure`).

## Scope

Covers:
- Job architecture: families, IC/manager tracks, level spine, levelling criteria, calibration, title governance.
- Pay structures and pay mix: range maths, incentive and equity-compensation design principles, structure health metrics.
- Benchmarking method: job matching, aging, blending, positioning, geography, thin-data roles.
- Benefits and retirement plan design, provider comparison, change communication.
- Recognition programs; total rewards statements.
- Pay-equity analysis: cohorts, model, unexplained gap, root cause, remediation, embedded checks.

Does NOT cover:
- Performance ratings and rating calibration (the input to the merit matrix — the matrix itself stays here, § Merit matrix), career-path conversations, promotion readiness → [[hr-performance]].
- Offer negotiation and offer letters → [[hr-recruiting]]. Payroll compliance and pay disputes → [[hr-employee-relations]].
- Compensation budget and workforce cost forecasting → [[hr-workforce-analytics]].
- Country pay practice, statutory benefits per country, EOR → [[hr-global]].
- Wellbeing strategy and EAP use (beyond funding the benefit) → [[hr-culture]]. Comp-tool selection → [[hr-technology]].

## Structure — job architecture

**Levelling vs titling.** A level is the scope expected at a career stage; a title is the visible label. Fix levels first; titles map to levels per family.

### Build sequence
1. **Audit** the title landscape: count unique titles, titles per level, roles with no family, same-title/different-scope pairs, external hires placed above comparable internal staff.
2. **Model 2–3 structural options** before committing:

| Option | Shape | Trade-off |
|---|---|---|
| Function-based | Separate guide per department | Easy buy-in; weak cross-function comparison, mobility and pay-equity defensibility |
| Unified spine | One level spine, family titles mapped to it | Strongest for equity, mobility, budgeting; more calibration and comms effort |
| Phased hybrid | Unified spine for the highest-risk families first, others later | Matches urgency; temporary two-system period |

3. **Pick levelling dimensions** — typically scope, complexity, impact, autonomy (add knowledge/expertise if needed). Same dimensions across families.
4. **Write criteria per level in observable terms.** Test: could two adjacent levels both claim the sentence? If yes, rewrite. "Demonstrates strong skills" fails; "sets team direction without senior-leader input on day-to-day decisions" differentiates.
5. **Define tracks:** parallel IC and manager tracks with an explicit crossover level so senior specialists are not forced into management.
6. **Calibrate placement:** pre-work (leaders assess roles against draft criteria) → anchor session on definitions → role-by-role placement with written rationale → pay check (who now sits outside band) → correction list with dates. Level the role, not the person's performance.
7. **Govern:** new titles mapped to family + level before a requisition opens; title is never the negotiation lever (pay within band is); periodic calibration; out-of-framework title audit; owner per family.
8. **Sequence the rollout:** corrections first, manager briefing second, employee communication last. Never announce a review before answers exist.

Leading drift signals: titles created outside the framework, levelling by manager advocacy, external hires above internal peers at the same level.

### Pay ranges — formulas

Inputs are the organisation's own market data and philosophy; the skill supplies the arithmetic, never the figures.

| Metric | Formula | Use |
|---|---|---|
| Midpoint | (min + max) / 2, or set = market reference point at target percentile | Anchor of the range |
| Range spread | (max − min) / min | Room for growth in grade; typically widens with level — width is a philosophy choice `[NEEDS DATA]` |
| Min / max from midpoint and spread *s* | min = 2·mid / (2 + s); max = min · (1 + s) | Build a range from a chosen midpoint |
| Midpoint progression | (mid₍n+1₎ − mid₍n₎) / mid₍n₎ | Promotion meaningfulness between grades |
| Range overlap | (max₍n₎ − min₍n+1₎) / (max₍n₎ − min₍n₎) | Too much overlap blurs levels; too little blocks movement |
| Compa-ratio | salary / midpoint | Individual or group position vs. midpoint |
| Range penetration | (salary − min) / (max − min) | Position in range; out-of-band cases < 0 or > 1 |

Health checks: count below-min / above-max; compa-ratio drift by cohort across cycles; offer-stage deviations approved by discretion. Targets for these are set in the comp philosophy, not imported.

### Compensation philosophy (one page)
Peer group (who we hire from / lose to) · positioning per role group (lead / match / lag) · pay mix by level (base, variable, equity, benefits) · differentiation basis (level, location, performance — and what never counts) · transparency stance · governance owner and review cycle.

### Merit matrix

Grid: performance rating (from [[hr-performance]] calibration) × position in range (compa-ratio bands, e.g. < 0.9 · 0.9–1.1 · > 1.1 — bands set in the philosophy). Each cell = a guideline increase range; lower in range + higher rating → larger guideline.
- **Budget pool** from the [[hr-workforce-analytics]] `budget`; cells are solved so the modelled spend fits the pool — no percentages imported `[NEEDS DATA]`.
- **Guideline, not entitlement** — managers deviate with a written reason; outliers reviewed.
- **Adverse-impact check by group** on proposed increases before final (aggregate, minimum group size; hr-rules § 5).
- **Approvals** per `plans/hr-context.md` § 6; individual amounts stay in the comp tool/HRIS.

### Incentives and equity compensation — design tests
- Metric is **measurable, controllable by the participant, transparent**, aligned to strategy.
- Model payouts against several performance scenarios before launch (budget and behaviour).
- Separate individual / team / company components explicitly; state thresholds and caps.
- Equity compensation: vesting, dilution, refresh logic, plain-language valuation. Tax and securities treatment `[VERIFY: tax authority / securities law, <jurisdiction>]`.

## Benchmark — market pricing method

1. **Define the benchmark job:** family, level, scope, reporting line, location, key skills. Title alone is not a match.
2. **Choose sources:** published surveys (structured, matched by job code), job-posting data (directional — ranges are wide and unverified), custom peer surveys (competition-law review first: pay-data exchange between competitors can be unlawful `[VERIFY: competition authority guidance, <jurisdiction>]`).
3. **Match by scope**, grade each match: exact / close / adjusted (state the adjustment and why). Check scope mismatch first — it often produces a false "we are underpaid".
4. **Age the data** to a common effective date: aged = reported × (1 + annual movement)^(months / 12). Movement rate from the survey vendor's projection or own data `[NEEDS DATA]` — never assumed.
5. **Blend** sources: weighted average, weights set by match quality and sample size, written down before seeing results. Drop matches below a minimum sample the source itself flags.
6. **Position:** pick target percentile per role group from the philosophy; scarcity premiums are explicit, time-boxed exceptions, not silent drift.
7. **Geography:** apply cost-of-labour differentials (what the market pays there), not cost-of-living; one approach per location tier, documented.
8. **Total compensation:** benchmark base, target cash and total direct comp separately; a base gap may close or widen once variable is included.
9. **Reconcile with internal equity:** market says "raise the group", internal equity says "group is consistent" → it is an external retention risk (market adjustment), not an equity correction. Document why the two numbers differ.
10. **Refresh cadence** and off-cycle triggers (offer declines citing pay, regretted exits, sudden posting-range movement) set in governance.

Thin-data roles: price adjacent levels and interpolate, use a blend of two partial matches, or treat as a hybrid of two job codes with stated weights — and flag low confidence.

## Benefits — design and retirement

**Design loop:** statutory floor per country `[VERIFY: <jurisdiction> labour/social-security law]` → workforce needs by segment (life stage, location, work pattern) from survey and claims/utilisation data → core offer (strong, simple) + targeted flexibility → cost model (per head, per segment, renewal trend) → vendor comparison → communication. More options is not automatically more value — test for choice overload in your own survey and enrolment data.

**Vendor comparison:** cost/fees · coverage and quality · employee tools and support · data/privacy terms · admin effort. Fees never decide alone.

**Retirement plans** (all limits, rates, tax treatment and notice periods are jurisdiction-specific → `[VERIFY: pension/retirement regulator, <jurisdiction>]`):

| Lever | Options | Consideration |
|---|---|---|
| Plan type | Defined contribution · defined benefit · hybrid | Who bears investment risk; cost volatility; portability |
| Employer contribution | Flat match · tiered match · non-elective | Tiered encourages higher saving; flat is simpler to explain |
| Vesting | Immediate · cliff · graded | Retention lever vs. perceived fairness; legal maxima apply |
| Default design | Auto-enrolment · auto-escalation · default fund | Defaults drive participation more than education alone |
| Fund line-up | Default (e.g. lifecycle) + small core set | Fewer, clearer choices |

**Plan change / provider switch comms:** advance notice (what changes, why, what carries over) → any legally required blackout/transfer notice in a dedicated message `[VERIFY: required notice period]` → action-needed reminder (e.g. beneficiary re-confirmation) → go-live confirmation. Segment by career stage: early career cares about match and escalation; near-retirement about stability and advice access. Never give individual investment advice; point to the provider or a licensed adviser.

## Recognition

| Layer | Who | Frequency |
|---|---|---|
| Day-to-day | Manager → employee | Continuous, specific, behavioural — the foundation |
| Peer | Employee → employee | Platform or channel, values-tagged |
| Team | Lead → team, in rituals | Retros, team meetings |
| Milestone | Organisation | Service anniversaries, project completions |
| Organisational | Executives | Rare, high visibility |

Design rules: recognition (appreciation) is kept separate from rewards (monetary/tangible) so it does not become transactional; managers model use first; prompts or value tags make the "why" specific; ask preference for public vs. private. Cash or gift awards may be taxable `[VERIFY: tax treatment of non-cash awards, <jurisdiction>]`.

**Equity audit of recognition:** distribution by team, role type, location, work pattern (remote/shift) — not just volume. Teams near zero over the period → coach their managers to name less-visible work (reliability, back-office accuracy) and add value categories that cover it. Measure program health (active senders, received per head, spread) separately from outcomes (engagement items on "my work is recognised", attrition by team activity level).

## Total rewards statement

Purpose: make invisible value visible (benefits, employer contributions, equity, development). Sections: base · variable (target and actual) · equity (granted, vested, valuation method stated) · employer-paid benefits and statutory contributions · retirement contributions · time off · development spend · non-financial (flexibility, recognition). Generated per person inside the HRIS/payroll — `plans/hr/` holds the **template** only (hr-rules § 3). Valuation assumptions and "this is not a contract" line on every statement. Template: [references/templates.md](references/templates.md).

## Equity — pay-equity analysis

Purpose: find **unexplained** differences among people doing comparable work; not to prove intent.

1. **Set up under counsel.** Decide with legal before data is pulled: privilege, access list, which demographic fields may lawfully be used, retention. hr-rules § 3: special-category fields (e.g. ethnicity) never in committed files and never inferred; used only on a counsel-confirmed lawful basis, voluntarily provided, analysed in the controlled environment and reported in aggregate above the minimum group size.
2. **Fix the factors in advance:** legitimate, job-related factors (level, family, location/pay zone, time in role, documented performance) vs. factors that need their own justification (prior salary, negotiated premiums, counteroffers).
3. **Clean levelling first** — wrong levels produce false gaps. Standardise pay zones; same review cycle for ratings; flag transitional cases (recent promotion, transfer, leave return).
4. **Build comparison cohorts** of similar work (family × level × pay zone). Set a minimum cohort size with your analyst and counsel `[NEEDS DATA]`; cohorts below it get qualitative review, never a published statistic.
5. **Model:** pay ~ legitimate factors; residual = actual − predicted. Protected characteristics are used to **test** residuals, not as model inputs. Run base and total cash separately. Group-average comparisons alone are descriptive, not a finding.
6. **Diagnose root cause** before calling a gap unexplained:

| Cause | Check |
|---|---|
| Levelling | Doing above-level work without re-levelling? |
| Hiring | Lower starting offers for a cohort? Philosophy change left an older cohort behind? |
| Progression | Slower merit/promotion for a group? |
| Offer discretion | Managers clustering offers low in band? |
| Ratings | Rating distribution differs by group → upstream bias; separate fix in [[hr-performance]] |

7. **Remediate:** scope (significant residual → include; legitimately explained → exclude with documented reason; borderline → second review), sizing to an agreed tolerance set by counsel and finance `[NEEDS DATA]`, separate budget line (never inside merit), single off-cycle action preferred, no performance justification required.
8. **Report in aggregate** (methodology, cohorts, flagged count, root-cause categories, budget, timeline). No individual demographic detail leaves the analysis environment.
9. **Embed:** offer-stage check against band and incumbents; re-run before each merit cycle; equity reserve in the merit budget; promotion-rate and pay-outcome tracking by group as a leading indicator.

Statutory pay reporting and transparency duties (e.g. gender pay gap reporting, pay-range disclosure, EU Pay Transparency Directive) vary by jurisdiction and date `[VERIFY: <jurisdiction> equal pay / pay transparency law + effective date]`. Remediation and individual pay decisions arising from the review: *review with qualified employment counsel (or the relevant authority) before acting.*

## Guardrails

- **Jurisdiction first** — statutory benefits, retirement rules, pay reporting, award taxation all named per country (hr-rules § 1).
- **No figures from memory** — band widths, percentiles, contribution limits, match norms, remediation tolerances: cited source + date, own data, or `[NEEDS DATA]` / `[VERIFY: …]` (hr-rules § 2, § 4).
- **No individual pay in committed files** — structures, cohorts and aggregates only; per-person statements and residuals stay in HRIS (hr-rules § 3).
- **Job-related criteria written before assessment**; any group pay outcome gets an equity check before it is final (hr-rules § 5).
- **AI drafts and flags; people decide pay** — anonymise/aggregate before any AI tool without an enterprise data agreement (hr-rules § 6).
- **Counsel line** on pay-equity remediation, pay-transparency compliance and benefit plan changes with legal notice duties (hr-rules § 2).

## Output

- `structure` → `plans/hr/<slug>/job-architecture.md` (families, spine, criteria, governance) and/or `plans/hr/<slug>/pay-structure.md` (philosophy, range table with formulas, health metrics, incentive design).
- `benchmark` → `plans/hr/<slug>/benchmark.md` (benchmark job definitions, sources, match grades, aging/blending method, positioning, recommendation, methodology note).
- `benefits` → `plans/hr/<slug>/benefits-design.md` (needs, core/flex design, cost model, vendor matrix, comms plan).
- `recognition` → `plans/hr/<slug>/recognition-program.md` (layers, criteria, budget model, equity audit, metrics).
- `equity` → `plans/hr/<slug>/pay-equity-review.md` (scope, factors, cohort rules, model spec, aggregate findings, remediation plan, governance).
- Total rewards statement template → `plans/hr/<slug>/total-rewards-statement-template.md`.

Templates: [references/templates.md](references/templates.md).

## Before proceeding

1. Which action, which population (families, levels, locations), and what triggered it (audit, complaint, funding diligence, law, attrition)?
2. Is there a documented comp philosophy and level spine, or are we building one?
3. Which market data sources are licensed, and their effective dates?
4. For pay equity: has counsel agreed the set-up, and which demographic fields are lawfully held?
5. Who decides (comp committee, CFO, CEO) and by when?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, HRIS, existing comp policies
- [[hr-performance]] — ratings feeding merit, career paths built on the level spine
- [[hr-workforce-analytics]] — comp budget, cost modelling, pay dashboards
- [[hr-recruiting]] — offer approvals against bands
- [[hr-global]] — multi-country pay and statutory benefits
- [[hr-culture]] — wellbeing programs, recognition in culture and engagement data
- `.claude/workflows/hr-rules.md`

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-compensation-benefits`, `hr-job-architecture`, `hr-recognition`, `hr-retirement-benefits`, `hr-salary-benchmarking`, `hr-total-rewards` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; job-architecture, benchmarking and pay-equity overlaps merged; range formulas added in place of quoted widths; unsourced figures removed (band widths, overlap and compa-ratio targets, remediation cost share, cohort-size floor, match and auto-enrolment rates, survey prices, benefit-undervaluation claim, US plan specifics); jurisdiction, special-category-data and counsel guardrails added; routing via `/hr:reward`.
