---
name: hr-culture
description: Culture and employee experience method — engagement and culture diagnosis (lived vs stated values, stay interviews, engagement-decline recovery), employee listening and surveys (listening architecture, item design, anonymity thresholds, segmentation, driver analysis, action-planning loop, exit insight), DEI (systems audit, inclusive funnel and promotion review, lawful demographic data, ERGs, inclusion measures), wellbeing (structural burnout diagnosis, support and crisis routing to EAP/professionals, return-to-work coordination), internal communications (channel architecture, sensitive-news sequencing, manager talking points, FAQ, measurement), and employee journey mapping (personas, moments that matter, friction, internal mobility, hybrid work model). Use for "engagement dropped", "run an engagement survey", "pulse survey", "survey results action plan", "DEI strategy", "inclusive hiring review", "ERG", "burnout on the team", "wellbeing program", "announce this change", "manager talking points", "map the employee journey", "internal mobility program", "hybrid work policy". For culture-fit interviewing use hr-recruiting; for onboarding/offboarding processes use hr-people-ops; for change management of a restructure use hr-org-change.
allowed-tools: Read, Write, Glob, Grep
---

# Culture

> Culture is what the organisation rewards, tolerates and repeats, not what it prints. Listening without visible action makes the next survey worse.

## When this skill activates

**Implicit:** engagement or belonging scores falling, regretted exits clustering, "people feel it's a different company", a survey to design or results to act on, a DEI question, burnout signals, a sensitive announcement, friction at a lifecycle moment, employees leaving for growth they could have had internally, a hybrid-work decision.
**Explicit:** "Read the `hr-culture` skill file and [task]."
**Routed from:** `/hr:culture engage` · `/hr:culture survey` · `/hr:culture dei` · `/hr:culture wellbeing` · `/hr:culture comms` · `/hr:culture journey`.

## Scope

Covers: engagement and culture diagnosis, retention listening, surveys and listening architecture, DEI strategy and audits, wellbeing programs, internal communications, journey mapping, internal mobility, work-model design.

Does NOT cover:
- Culture-add interview questions, scorecards, employer brand → [[hr-recruiting]].
- Onboarding/offboarding process build, exit logistics → [[hr-people-ops]]. Performance and manager effectiveness reviews → [[hr-performance]].
- Change management and comms plans for restructures, M&A, layoffs → [[hr-org-change]]; consultation duties, accommodation, grievances, policy text → [[hr-employee-relations]].
- Pay equity and benefit funding (EAP, mental-health cover) → [[hr-rewards]]. Engagement dashboards, attrition modelling → [[hr-workforce-analytics]].
- Survey/listening tool selection, AI sentiment tooling governance → [[hr-technology]]. Country specifics → [[hr-global]].

## Engage — engagement and culture diagnosis

**Read culture from systems, not statements** (Schein's three levels: artifacts → espoused values → underlying assumptions; change sticks only at the assumption level):

| Signal | Where to look |
|---|---|
| What is rewarded | Promotions, bonuses, recognition patterns |
| What is tolerated | Senior behaviour without consequence, conflict handling |
| How decisions are made | Who is consulted, how they are communicated |
| Transmission | Manager consistency across teams, onboarding, sub-cultures by site/function |

Values work: a few values, each with observable behaviours and the decisions they govern; enforced on senior leaders first.

**Engagement drivers to diagnose:** manager relationship, role clarity, meaningful work, recognition, growth, workload, psychological safety, trust in leadership, fairness. Engagement is a system outcome; managers are the main lever.

**Decline / crisis recovery sequence:**
1. **Contain retention risk** — stay conversations with people most likely to leave, run by someone other than the manager if the manager is the flagged issue. Stay-interview guide in [references/listening-kit.md](references/listening-kit.md).
2. **Diagnose before programs** — segment (team, tenure cohort, location, work pattern); split the drop into components (team connection, direction, career, leadership trust); triangulate with exits, absence, mobility.
3. **Model options** — company-level relaunch vs. manager-led team recovery vs. phased (listen and triage now, redesign after diagnosis); compare speed, credibility, durability.
4. **Separate owners** — what HR runs (manager kit, listening, journey fixes) vs. what leadership must change (decision transparency, visibility, values-to-decision consistency). Present both.
5. **Sequence** — affected individuals → managers briefed on their own results → company-wide message (what we heard, what happens next, when we check again).
6. **Stabilise** — 30/60/90-day checks on manager follow-through, committed fixes, pulse items, retention; the mid-point is where early energy fades.

Do not launch new programs as the first response; activity without diagnosis produces a second decline.

## Survey — listening and the action loop

**Architecture:** outcome + driver survey (periodic) · pulse (short, rotating topics) · lifecycle (onboarding, post-promotion, return from leave, exit) · always-on (1:1 structure, open channels, anonymous reporting). Start with periodic survey + exit insight; add layers as capacity to act grows.

**Item design:** short over comprehensive — every item must drive a decision you will make; validated scales for core constructs where licensed, custom items for local topics; anchor to behaviour ("My manager gives me feedback that helps me improve") over attitude ("I feel valued"); one idea per item; consistent scale; eNPS if used = % promoters − % detractors.

**Anonymity and confidentiality (decide before launch):**
- **Minimum reporting group size:** set a minimum, e.g. agree a number with legal/works council — and apply it to every cut, filter combination and comment view, not just the headline.
- Block differencing (two overlapping cuts that reveal a small group); suppress or merge small cells.
- Free-text comments can identify — review/redact before managers see them.
- Say honestly whether the survey is **anonymous** (no identity held) or **confidential** (vendor holds identity, HR sees aggregates) — never call a confidential survey anonymous.
- Demographic questions: optional, purpose-stated, lawful basis (see DEI); special-category items only on a counsel-confirmed lawful basis, voluntary, reported in aggregate above the minimum group size (hr-rules § 3).
- Works-council consultation and data-protection notices may be required before launch `[VERIFY: <jurisdiction> co-determination / data protection law]`.

**Analysis:** never stop at the company average (flat averages hide falling teams); segment by team, tenure, location, work pattern within the threshold; driver analysis — rank items by low score × strength of relationship with the outcome; check participation by segment (low participation is itself a trust signal); triangulate with behaviour data.

**Action-planning loop:**
1. Publish a results date before launch and keep it.
2. Brief managers on their team results **before** employees see company results.
3. Team conversation → **1–3 actions** per team, each with owner and date; company-level actions for issues teams cannot fix.
4. Close the loop: "You said … / We are doing … / We are not changing … because …".
5. Re-measure the targeted items next pulse; report follow-through, not just scores.

**Exit insight:** exit themes are produced by [[hr-people-ops]] (`exit-themes.md`); here they feed the listening architecture — read beside survey and stay-interview data, patterns over anecdotes.

## DEI — systems, data, inclusion

**Strategy:** baseline (representation, outcomes, experience) → equity gaps by process → goals with owners → interventions in systems → accountability → monitoring. Systems over individual attitudes: do not assume awareness training alone changes outcomes — measure it, and pair it with process redesign.

**Process audits (where bias enters):**

| Process | Check | Owner |
|---|---|---|
| Hiring funnel | Pass-through by stage, job-related criteria, structured questions, scorecard evidence, written scores before debrief | with [[hr-recruiting]] |
| Promotion | Criteria written beforehand, calibration notes, outcome rates by group, discretion points | with [[hr-performance]] |
| Pay | Pay-equity review | [[hr-rewards]] |
| Development access | Who gets stretch work, programs, sponsorship | with [[hr-learning]] |
| Recognition | Distribution by team and group | [[hr-rewards]] |
| Exits | Attrition by group and reason (aggregate) | exit themes from [[hr-people-ops]] |

**Demographic data — lawful basis first (hr-rules § 3):**
- Special-category data (ethnicity, religion, health/disability, sexual orientation, union membership) is **never** written to committed files and never inferred; collection outside the repo only on a counsel-confirmed lawful basis `[VERIFY: <jurisdiction> data protection law, e.g. GDPR Art. 9 + national rules]`, voluntary, reported in aggregate above the minimum group size in `plans/hr-context.md` § 7; some jurisdictions restrict collecting certain categories at all.
- Where lawful: voluntary self-identification with "prefer not to say", stated purpose, separate restricted storage, aggregate reporting only above the minimum group size.
- Never infer characteristics from names, photos or proxies. Committed files hold aggregates only.

**Targets vs. quotas:** aspirational representation goals and positive action are lawful in many places; quotas and preferential selection often are not `[VERIFY: <jurisdiction> equality law]`. Selection stays job-related (hr-rules § 5).

**ERGs:** voluntary, open to allies, charter + executive sponsor + budget + advisory role; leaders' time recognised. Membership lists can reveal special-category data — never stored in `plans/hr/`.

**Inclusion measures:** inclusion/belonging index items, psychological safety items, outcome rates by group (hire, promotion, exit) with thresholds, representation by level. Accommodation requests → [[hr-employee-relations]].

## Wellbeing — risk, support, return

**Boundary:** HR designs work and support systems; it does not diagnose, treat or give clinical advice. Health concerns route to the EAP, occupational health or medical professionals. Imminent risk to life → emergency services first, then HR.

**Diagnose structurally first:** burnout signals are usually workload, staffing, role-design or sustained-pressure problems before they are individual-resilience problems. Look at: scope added vs. headcount, concentration in specific roles, duration of the pressure, recovery periods, norms about overtime. Leading signals: sustained overtime vs. team baseline, declining participation, manager-raised concerns. Monitor at team level and aggregate; activity monitoring of individuals needs a lawful basis and may need works-council agreement `[VERIFY]`.

**Program layers:**

| Layer | Content |
|---|---|
| Prevention | Workload and staffing decisions, job design, recovery time after peaks, flexible work, leave use encouraged |
| Manager capability | Recognise early signals, listen without diagnosing, refer, adjust workload, keep confidentiality |
| Support | EAP and mental-health benefits (funding → [[hr-rewards]]), access barriers removed, stigma addressed |
| Crisis protocol | Escalation path, who to call, confidentiality limits, after-care — written and rehearsed before needed |
| Return to work | Phased, individual, guided by medical/occupational-health advice; adjustments via [[hr-employee-relations]]; structured check-ins after return |

**Option modelling:** workload relief vs. support-only vs. combined phased — support-only reads as dismissive when people are naming workload. Measure risk reduction (hours, absence, pulse items, retention), not participation. Working-time and rest limits are statutory `[VERIFY: <jurisdiction> working-time law]`. Health data never enters `plans/hr/`; individual cases use pseudonyms (hr-rules § 3).

## Comms — internal communications

**Channel architecture:**

| Channel | Use for | Not for |
|---|---|---|
| All-company | Strategy, results, major policy | Routine updates (dilutes) |
| Manager briefing | Anything significant — the most trusted channel | Being the first to hear in public |
| Team channel / chat | Real-time, conversational | Formal notices needing a record |
| Email | Documented notices, non-chat users | Discussion |
| Intranet / HRIS | Reference library, policies | Urgent news |
| Town hall | Strategy, Q&A, cultural moments | Status reporting |
| Frontline (print, shift briefings, SMS) | Non-desk staff without email | — |

**Writing:** lead with what it means for the reader; plain language; specific over abstract; state what is **not** changing; end with action, deadline, contact; localise per language/country. Pre-send check: first paragraph carries the point, readable on a phone, clear next step, question channel named.

**Sensitive news sequence:** directly affected people individually → managers briefed with talking points and answers to the hardest questions → company-wide announcement → FAQ → follow-up after the first wave of questions. Set an embargo time; brief close to announcement to limit leaks. Restructures, layoffs and policy changes may carry consultation or notice duties before announcement `[VERIFY: <jurisdiction> consultation law]` — *review with qualified employment counsel (or the relevant authority) before acting.* Templates: [references/comms-and-journey.md](references/comms-and-journey.md).

**Measure:** reach (opens/reads, attendance), comprehension (quick check, questions received), outcome items in surveys ("I get the information I need"), rumour lag before official comms.

## Journey — moments that matter, mobility, work model

**Mapping method:**
1. **Scope a persona and stages** (attract → recruit → onboard → develop → perform → engage/retain → transition/exit) — one persona per map.
2. **List touchpoints** at evaluable granularity.
3. **Expected vs. experienced** at each touchpoint, from listening data and system timestamps (aggregate) — not HR assumptions.
4. **Moments that matter** — disproportionate effect on trust or retention: first day, first review, promotion decisions, manager change, return from leave, internal transfer, exit.
5. **Friction and gaps** — where process and reality diverge.
6. **Prioritise** by impact × frequency × feasibility; pilot, measure, iterate; revisit the map when processes change.

Common findings: onboarding cliff after the first weeks, opaque career paths, feedback only at review time, neglected exits. Process fixes route to owners ([[hr-people-ops]], [[hr-performance]]).

**Internal mobility:**

| Failure mode | Fix |
|---|---|
| Manager hoarding | Development of people in manager expectations; release window in policy; leaders celebrate moves |
| Information asymmetry | All roles posted internally first for a set window |
| Self-selection out | Explicit no-risk exploration; when the current manager is told is defined in policy |
| Opaque process | Structured internal selection with criteria, timeline, feedback to every applicant |

Policy defines tenure eligibility, notice/release timing, pay handling on move (→ [[hr-rewards]]), exceptions — values set by the organisation, not imported. Metrics: internal fill rate, internal applicant conversion, post-move retention vs. population, by function (targets `[NEEDS DATA]`).

**Work model (hybrid / flexible / pilots):** design from collaboration needs per team; pilot significant changes with success metrics and a rollback rule; enable managers to lead by outcomes before the switch; monitor proximity bias in promotion and opportunity data by work location. Flexible-working request rights and remote-work rules are statutory in some countries `[VERIFY]`; policy text → [[hr-employee-relations]].

## Guardrails

- **Anonymity minimums** agreed before launch and enforced on every cut (hr-rules § 3).
- **Special-category data** never in committed files, never inferred; collected outside the repo only on a counsel-confirmed lawful basis, voluntary, aggregate above the minimum group size (hr-rules § 3, § 5).
- **No clinical advice**; health concerns go to EAP/professionals; no health details in files.
- **No invented benchmarks** — participation, eNPS, burnout prevalence, mobility rates: cited or `[NEEDS DATA]` (hr-rules § 4).
- **AI sentiment/theme analysis** drafts and flags only, on de-identified data (hr-rules § 6).
- **Counsel line** on announcements with consultation duties and on any individual case decision (hr-rules § 2).

## Output

- `engage` → `plans/hr/<slug>/engagement-diagnosis.md` (segments, root causes, options, recovery plan, checkpoints).
- `survey` → `plans/hr/<slug>/survey-design.md` (purpose, items, anonymity rules, comms) and `plans/hr/<slug>/survey-action-plan.md` (aggregate findings, priorities, team/company actions, close-the-loop message).
- `dei` → `plans/hr/<slug>/dei-strategy.md` or `plans/hr/<slug>/dei-audit.md` (process audit, data basis, goals, owners).
- `wellbeing` → `plans/hr/<slug>/wellbeing-plan.md` (risk diagnosis, layers, crisis protocol, measures).
- `comms` → `plans/hr/<slug>/comms-plan.md` (sequence, messages, talking points, FAQ, measures).
- `journey` → `plans/hr/<slug>/journey-map.md` (persona, touchpoints, moments, friction, prioritised fixes); mobility or work-model designs as `plans/hr/<slug>/mobility-program.md` / `work-model.md`.

Kits: [references/listening-kit.md](references/listening-kit.md) · [references/comms-and-journey.md](references/comms-and-journey.md).

## Before proceeding

1. What triggered this (score drop, exits, incident, leadership request, planned cycle), and for which population?
2. What listening data exists, and what anonymity/confidentiality was promised?
3. Is there a works council, union or employee forum to consult?
4. Which demographic data is held, on what lawful basis?
5. Who owns action — which leaders and managers, by when?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, works councils, systems
- [[hr-performance]] — manager effectiveness, promotion fairness, career paths
- [[hr-rewards]] — recognition, pay equity, wellbeing benefits funding
- [[hr-people-ops]] — onboarding/offboarding journeys
- [[hr-org-change]] — change communication for restructures
- [[hr-employee-relations]] — consultation, accommodation, policy text
- [[hr-workforce-analytics]] — attrition and engagement analytics
- `.claude/workflows/hr-rules.md`

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-culture`, `hr-diversity-inclusion`, `hr-employee-communications`, `hr-employee-engagement`, `hr-employee-experience`, `hr-employee-journey-mapping`, `hr-employee-listening`, `hr-future-of-work`, `hr-internal-mobility`, `hr-wellbeing` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; engagement, experience and listening overlaps merged; culture-fit hiring routed to hr-recruiting; unsourced figures removed (anonymity group size, participation, eNPS, burnout prevalence, EAP utilisation, engagement-dip, turnover-cost, results-turnaround, mobility fill-rate, tenure and release-window numbers); anonymity, special-category-data, clinical-boundary and consultation guardrails added; routing via `/hr:culture`.
