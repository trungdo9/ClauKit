---
name: hr-global
description: Multi-country HR method — global operating model (centralise vs localise, standardise vs adapt), global policy baseline plus per-country addendum, entity vs employer of record (EOR) vs contractor decision and EOR diligence, misclassification and permanent-establishment flags, country-entry checklist and sequencing, cross-border mobility (assignment types, policy components, repatriation, working from abroad), cultural adaptation for managers, country-variance method, and country references (Vietnam). Use for "we are hiring in a new country", "entity or EOR", "can we use contractors in X", "global HR policy", "country addendum", "first hires in Vietnam", "expat / assignment policy", "employee wants to work from abroad", "managing a team in another culture". For investigations, discipline and immigration case handling use hr-employee-relations; for global pay bands and benefits design use hr-rewards; for cross-border M&A integration use hr-org-change.
allowed-tools: Read, Write, Glob, Grep
---

# Global HR

> One global baseline, one addendum per country — never one text pretending to fit every jurisdiction.

## When this skill activates

**Implicit:** `plans/hr-context.md` lists more than one country; a request names a country not yet in the hub; first hire planned in a new market; a policy drafted for one country is about to be applied in another; an employee asks to work from another country; a manager starts leading a team abroad.
**Explicit:** "Read the `hr-global` skill file and [task]."
**Routed from:** `/hr:comply global` (multi-country baseline + addenda, entity vs EOR vs contractor) and `/hr:comply country <cc>` (country addendum; `vn` reads [references/vietnam.md](references/vietnam.md)).

## Scope

Covers:
- Global HR operating model and governance across countries.
- Policy architecture: global baseline + country addendum, and the conflict rule between them.
- Entry structure: entity vs EOR vs contractor; EOR vendor diligence; when to revisit.
- Country-entry checklist and sequencing before the first local hire.
- Cross-border mobility basics; cultural adaptation for managers and HR processes.
- Country references: [references/vietnam.md](references/vietnam.md). Addendum + entry templates: [references/country-addendum.md](references/country-addendum.md).

Does NOT cover:
- Running a work-permit case, investigations, discipline, labour-relations engagement, payroll controls → [[hr-employee-relations]].
- Global pay structures, levels, benefits design, market pricing → [[hr-rewards]].
- Cross-border M&A and post-merger integration → [[hr-org-change]].
- Onboarding/offboarding flows in the new country → [[hr-people-ops]].
- Multi-country HRIS and payroll integration → [[hr-technology]]; headcount and cost scenarios → [[hr-workforce-analytics]].

## 1. Global operating model (`/hr:comply global`)

Four choices shape every later policy. Record each one with its reason; they are trade-offs, not best practice.

| Choice | One end | Other end | Decide by |
|---|---|---|---|
| Who runs HR | Centralised at HQ (consistency, scale) | Delegated to countries (responsiveness, local fit) | Headcount per country, legal complexity, local HR capacity |
| Policy content | Standardised globally | Localised per market | Which clauses law fixes locally (always local) vs which carry company identity |
| Talent philosophy | Global pool that moves across borders | Local hiring for local roles | Leadership pipeline needs, mobility budget |
| Culture | Shared values, identical practice | Shared values, local expression | How much practice must look the same to mean the same |

**Governance.** Global HR sets principles and the baseline; country HR (or the EOR) interprets local compliance; local counsel confirms. Name, per decision type, who sets, who adapts, who approves — by role (see [[hr-context]] approvers). Maintain a **country compliance matrix**: one row per country, columns per domain in § 4, each cell either a cited rule with date or `[VERIFY: <law>]`, plus owner and next review date.

## 2. Baseline + addendum method

1. **Inventory** every policy and contract template in use; note the country each was written for.
2. **Classify each clause:**
   - *Global standard* — values, code of conduct, anti-harassment and non-discrimination floor, data-handling principles, speak-up channel.
   - *Global commitment, local form* — a promise made everywhere, delivered per local rules (e.g. "everyone has health cover", "everyone has paid leave above the statutory floor"); the core-vs-periphery split.
   - *Fully local* — contract form and language, probation, working time, overtime, leave entitlements, statutory benefits, termination, payroll and tax, employee representation.
3. **Write the baseline** with the conflict rule stated once: *where local law gives the employee more, local law applies; where the baseline gives more, the baseline applies unless local law forbids it.*
4. **Write one addendum per country** from [references/country-addendum.md](references/country-addendum.md) — only the deltas from the baseline, each with its legal source or `[VERIFY]`.
5. **Language:** employee-facing text in the language(s) the law and the hub require; state which version governs [VERIFY: local contract-language rule].
6. **Counsel review per country** before publication; record reviewer role and date.
7. **Version and trigger reviews** on: law or decree change, new country, entity change (EOR → entity), annual cycle.

Never copy an HQ policy into a new market and edit by eye — local hires notice the mismatch, and the gaps are where liability sits.

## 3. Entity vs EOR vs contractor

| Factor | Own entity | Employer of record (EOR) | Independent contractor |
|---|---|---|---|
| Who is the legal employer | You | EOR provider | Nobody — commercial contract |
| Time to first hire | Longest (registration, bank, tax, payroll) `[NEEDS DATA: counsel/provider estimate]` | Short once provider contracted `[NEEDS DATA: provider quote]` | Shortest |
| Cost shape | Fixed set-up + running cost, lower marginal cost per head | Per-head fee on top of employment cost | Fees only; no employer contributions |
| Control over policy, benefits, contracts | Full | Limited to provider's local templates | Minimal — control itself is a classification risk |
| Compliance liability | Yours | Shared per contract — check allocation | Yours if reclassified |
| Fits | Proven, growing, permanent presence; regulated activity; need to invoice locally | Market test, small initial team, speed | Genuinely project-based, independent, non-substitutable work |
| Exit | Liquidation, local termination rules | Provider-run termination under local law | Contract end — if classification holds |

**Decision steps.**
1. Expected headcount and permanence over the planning horizon (from [[hr-workforce-analytics]] or the business case).
2. Is the work genuinely independent? Apply the local classification test — control over how/when work is done, integration in the organisation, exclusivity, duration, who supplies tools, who carries financial risk. Tests differ by country `[VERIFY: local worker-classification law]`. Ongoing, directed, full-time work is employment in most systems.
3. Tax exposure: local staff — even through an EOR or as contractors — can create a taxable presence (permanent establishment) for the company depending on activities (e.g. concluding contracts) `[VERIFY: domestic law + applicable tax treaty]`. Route to tax counsel.
4. Compare total cost of employment, not salary: statutory employer contributions, mandatory benefits, EOR fee, entity running cost `[NEEDS DATA: quotes + local payroll estimate]`. Never convert HQ salary by exchange rate — benchmark locally via [[hr-rewards]].
5. Set the **revisit trigger** with finance (a headcount or cost point at which entity beats EOR) — no generic threshold applies; derive it from the org's own quotes.

**EOR diligence checklist:** local legal entity actually owned vs sub-contracted partner; IP-assignment and confidentiality clauses flow through to you; benefits above statutory floor; data-processing agreement and cross-border transfer basis; termination support and who bears severance; conversion/transfer fee and process when you open an entity; payroll SLAs and error liability; references in that country.

Worker-classification decisions end with: *review with qualified employment counsel (or the relevant authority) before acting.* Entry-structure decisions end with: *review with qualified employment and tax counsel (or the relevant authority) before acting.* (hr-rules § 2).

## 4. Country-entry checklist and sequencing (`/hr:comply country <cc>`)

Research every domain before the first offer; each item cites a source or carries `[VERIFY: <law>]`. Do not rely on general knowledge — engage local counsel per market.

| Domain | Questions to answer |
|---|---|
| Contract | Written form, mandatory terms, language, contract types, fixed-term limits, probation rules |
| Working time | Normal hours, overtime limits and premiums, rest periods, night work |
| Pay | Minimum wage, pay frequency, mandatory bonuses or allowances, payslip content |
| Social contributions | Employer and employee schemes, rates, ceilings, registration deadlines |
| Leave and holidays | Annual leave, public holidays, sick, maternity/paternity/parental, other statutory leave |
| Termination | Lawful grounds, procedure, notice, severance, protected categories, collective dismissal rules |
| Representation | Unions, works councils, employee representative bodies, consultation duties, collective agreements |
| Work authorisation | Permits for foreign staff, lead times, exemptions, sponsor duties |
| Tax | Withholding, registration, residency rules, annual filing |
| Data protection | Employee-data law, consent/legal basis, cross-border transfer, localisation, breach notice |
| Health and safety | Mandatory training, medical checks, insurance |
| Internal rules | Mandatory workplace rules or handbook registration |

**Sequence:** (1) entry structure decided (§ 3) → (2) compliance research + counsel engaged → (3) local compensation benchmark → (4) contract, addendum and handbook localised → (5) payroll, social-insurance and tax registration set up → (6) manager briefing (§ 6) → (7) first hire → (8) post-entry review after the first payroll cycles. Template: [references/country-addendum.md](references/country-addendum.md) § Entry plan.

**Country-variance method** (also for restructures and integrations — full M&A treatment in [[hr-org-change]]): identify per country (a) employee-representative consultation duties and their timelines, (b) how employment transfers or changes legally (automatic transfer vs consent), (c) statutory cost differences (leave, contributions, severance), (d) who delivers communication locally. Never assume a region is uniform — EU member states differ from each other. Sequence the plan against each country's legal timeline, not the HQ calendar.

## 5. Cross-border mobility basics

| Type | Use when | Key questions |
|---|---|---|
| Permanent transfer (localisation) | Career move, restructure | Ends home contract; host terms apply; pension and service continuity |
| Long-term assignment | Leadership development, market building | Home or host payroll; tax equalisation vs protection; family support |
| Short-term assignment | Project delivery, skills transfer | Tax-residence and social-security day-count triggers `[VERIFY: host tax law + totalisation agreement]` |
| Commuter / frequent business traveller | Proximity markets | Multi-country payroll and social-security coordination |
| Working from abroad (employee-initiated) | Retention, personal reasons | Immigration right to work, tax residence, PE risk, social security, local labour law that may apply anyway |

**Policy components:** eligibility; pre-departure (immigration, cultural briefing, family and school support); on-assignment terms (housing, cost-of-living, home leave, tax approach); duty-of-care and security; repatriation plan agreed *before* departure (role on return, knowledge transfer). A mismanaged return wastes the investment — set the return role early.
**Cost:** model total assignment cost per case including indirect costs `[NEEDS DATA: provider quotes, tax estimate]`. Immigration filings themselves run through [[hr-employee-relations]].
Working-from-abroad requests end with: *review with qualified immigration and tax counsel (or the relevant authority) before acting.* (hr-rules § 2).

## 6. Cultural adaptation

Brief managers before they lead across borders — friction comes more often from management practice than from compliance gaps.

| Dimension | Ask locally | Adapt |
|---|---|---|
| Directness of feedback | Is critical feedback given openly or privately? | Channel and setting for feedback; 1:1 before group |
| Hierarchy and decisions | Who is expected to decide; is challenging a senior welcome? | How to invite dissent; decision rights made explicit |
| Agreement signals | Does "yes" mean commitment or acknowledgement? | Confirm actions in writing; ask open questions |
| Relationship vs task | How much rapport precedes business? | Time for relationship-building; local leaders front key messages |
| Time and calendar | Key holidays, family obligations, working-hour norms | Planning calendar, release and review cycles |
| Recognition | Public or private; individual or team? | Recognition design (with [[hr-rewards]]) |

Treat country patterns as hypotheses to test with local staff, not as stereotypes; individuals vary more than averages. Adapt performance reviews, engagement surveys (anonymous channels where open dissent is uncommon) and change communication per country; have local HR or legal review employee-facing messages.

## Guardrails

- **Jurisdiction first** — every legal-adjacent line names its country; a country not in the hub ⇒ ask (hr-rules § 1).
- **No statutory figures from memory** — rates, days, caps, thresholds, deadlines cite authority + effective date, or `[VERIFY: <law>]`; country references go stale by decree (hr-rules § 2).
- **Counsel review** — entry structure, worker classification, terminations, mobility tax/immigration questions end with the counsel-review line (hr-rules § 2).
- **No invented benchmarks** — set-up times, EOR fees, assignment costs, salary levels cited or `[NEEDS DATA]` (hr-rules § 4).
- **Employee data** — assignee and local-hire details stay in the HRIS; addenda and plans use roles (hr-rules § 3). Cross-border transfer of employee data needs a lawful basis in both countries.

## Output

- `/hr:comply global` → `plans/hr/<slug>/global-baseline.md` (operating-model choices, clause classification, baseline text, conflict rule), `plans/hr/<slug>/country-matrix.md` (domains × countries, sources, owners, review dates), and on request `plans/hr/<slug>/entry-structure-decision.md` (§ 3 table filled, recommendation, revisit trigger, counsel line) or `plans/hr/<slug>/mobility-policy.md`.
- `/hr:comply country <cc>` → `plans/hr/<slug>/country-<cc>-addendum.md` and, for a new market, `plans/hr/<slug>/entry-plan-<cc>.md` — both per [references/country-addendum.md](references/country-addendum.md); `vn` draws on [references/vietnam.md](references/vietnam.md).

## Before proceeding

1. Which countries, and through which structure today (entity / EOR / contractors)?
2. Headcount now and expected per country over the planning horizon?
3. Is there a global baseline already, or are policies HQ-only?
4. Who is local counsel / the EOR contact per country (role, not name)?
5. Is this a new-market entry, a policy harmonisation, a mobility case, or a manager briefing?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-employee-relations]] — immigration cases, discipline, investigations, payroll compliance, labour relations
- [[hr-rewards]] — local benchmarking, global grades, benefits
- [[hr-org-change]] — cross-border M&A integration
- [[hr-people-ops]] — onboarding in the new country
- [[hr-workforce-analytics]] — headcount and cost scenarios behind the entry decision
- [[hr-context]] — § Jurisdictions is the source of truth for which countries are in scope
- `.claude/workflows/hr-rules.md` — § 1 jurisdiction, § 2 no figures from memory + counsel line, § 3 employee data, § 4 benchmarks

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-global-hr`, `hr-global-expansion`, `hr-vietnam-context`, with the country-variance method from `hr-ma-integration-by-country` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; global-HR and expansion overlaps merged into one baseline-plus-addendum method; unsourced figures removed (EOR and entity set-up times, EOR headcount thresholds, assignment cost ranges, assignment durations, country contribution percentages, German and Vietnamese statutory figures); Vietnam statutory details moved to a reference with every figure as `[VERIFY: <law>]`; misclassification, permanent-establishment, data-transfer and counsel-review guardrails added; routing via `/hr:comply global|country <cc>`.
