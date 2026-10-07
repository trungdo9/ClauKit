---
name: hr-performance
description: Performance and talent method — SMART goals and OKR cascade, review cycle design, rating-scale definitions, evidence-based review writing, self-assessment, 360 and upward feedback, PIP fitness test and drafting, calibration with rater-bias checks and a rating-distribution check across groups, talent review and 9-box, critical-role succession with readiness tiers and post-transition stabilisation, career paths, competency frameworks with behavioural indicators, IDPs and career conversations, coaching and mentoring programmes, manager effectiveness, HRBP advisory (skill/will/structure diagnosis, option modelling). Use for "set OKRs", "design our review cycle", "write a performance review", "review my self-assessment", "draft a PIP", "is a PIP right here", "run calibration", "ratings feel unfair across teams", "9-box", "succession plan", "who could replace X", "career ladder", "competency framework", "IDP", "not-yet promotion conversation", "mentoring programme", "manager 360", "manager with low upward feedback". For pay, merit and levelling use hr-rewards; for training and leadership-development programmes use hr-learning; for misconduct, discipline and termination use hr-employee-relations.
allowed-tools: Read, Write, Glob, Grep
---

# Performance & Talent

> A rating is only as fair as the definition written before it and the evidence behind it.

## When this skill activates

**Implicit:** goal-setting season; a review cycle starting or a draft review to check; a manager wanting to "put someone on a PIP"; ratings that differ by manager for similar work; "what happens if our VP leaves tomorrow?"; people leaving because they see no path; a manager with poor team feedback.
**Explicit:** "Read the `hr-performance` skill file and [task]."
**Routed from:** `/hr:perform goals`, `/hr:perform review`, `/hr:perform pip`, `/hr:perform calibrate`, `/hr:perform succession`, `/hr:perform career`, `/hr:perform coach`.

## Scope

Covers: goals and OKRs · review cycle and review writing · 360/upward feedback · PIPs · calibration · talent review, 9-box, succession · career paths, competency frameworks, IDPs · coaching, mentoring, manager effectiveness · HRBP advisory on performance issues.

Does NOT cover:
- Merit increases, promotion pay, bonus, job architecture and levels, recognition programmes → [[hr-rewards]] (career paths here reference its levels).
- Training design, leadership-development programmes, skills taxonomy, training evaluation → [[hr-learning]].
- Misconduct, disciplinary sanctions, termination process, accommodation → [[hr-employee-relations]].
- Engagement surveys and listening → [[hr-culture]]; workforce/headcount planning, people analytics → [[hr-workforce-analytics]].
- Org design and restructuring → [[hr-org-change]]; performance software, AI scoring tools → [[hr-technology]].
- Competency-based interview scorecards → [[hr-recruiting]]; onboarding to day 90 → [[hr-people-ops]].

## The cycle

**Goals → ongoing check-ins and notes → self-assessment + peer/360 input → manager draft → calibration → delivery → development plan and next goals.** Hold the rating conversation separately from the pay conversation (pay → [[hr-rewards]]). Annual-only reviews force reconstruction from memory, which is where recency bias lives — pair formal reviews with lighter check-ins.

## Goals

- **Individual goals are SMART** (specific, measurable, achievable, relevant, time-bound); **OKRs** set team direction — objective qualitative, key results measurable outcomes. Decide upfront whether stretch OKRs feed ratings; if they do, say how.
- **Cascade:** company priority → team key result → individual goal; each individual goal names the key result it serves. Keep the list short enough to remember.
- **"What" and "how":** outcome goals plus the competency behaviours expected while delivering them.
- **Co-create and record** at the start; revisit at mid-cycle; changed goals are logged with date and reason.
- **Fairness:** comparable roles get goals of comparable difficulty; goals are pro-rated for part-time work and protected leave — never penalise leave `[VERIFY: <country> leave protection]`.

| Weak | Strong |
|---|---|
| "Improve communication" | "Run weekly stakeholder updates with a tracked action log for Q3 projects" |
| "Be more strategic" | "Present a two-quarter roadmap for [area] to [forum] by [date], with options and trade-offs" |

## Review — cycle design and writing

**Cycle checklist:** rating definitions published **before** drafting (managers anchor on first impressions) · bias self-check and one model review sent with them · evidence from the full period · HR screens drafts for red flags · calibration · manager owns delivery · every development plan has action, owner, timeline.

**Review structure:** summary of the full period · two or three strengths, each with evidence · development areas as *behaviour → business impact → suggested action* · goals review (objective, status, outcome, evidence) · development plan · three to five next-period goals.

**Writing rules:** observable behaviour, not personality; what happened and why it matters; separate fact from opinion; no guesses about motive; no reference to age, health, leave, family, pregnancy or any protected characteristic (hr-rules § 5).

**Red flags to send back before calibration:** superlatives without evidence ("rockstar", "great"); top rating with no goals or outcomes mentioned (halo); "nothing major" with no development area; no sign the whole period was considered.

**Self-assessment, 360, upward feedback:** the self-assessment is input, not the rating. 360 raters are chosen with employee and manager input; items are behavioural; anonymity has a minimum respondent count set in policy; results are developmental unless the policy says otherwise upfront; debrief with a coach or HRBP. Three ratings exist — self, manager draft, calibrated — and the calibrated one is final; the manager explains it against the shared standard, never as "what HR decided".

Template: [references/review-template.md](references/review-template.md).

## PIP — fitness test, draft, run

A PIP is for a **performance** gap after expectations were clear and feedback was given. Run the test first:

| Question | If "no" or "it's this" |
|---|---|
| Were expectations clear, job-related, documented and communicated? | Set expectations first — not a PIP yet |
| Was specific feedback given, with reasonable time to improve? | Informal coaching and documented feedback first |
| Is it a **skill** gap? | Training, pairing, clearer standards — PIP may follow |
| Is it a **will** gap (knows how, isn't doing it)? | Direct conversation on expectations; PIP if it persists |
| Is it **structural** (workload, unclear priorities, missing resources)? | Fix the structure — a PIP would be unfair |
| Could leave, health or an adjustment need be involved? | Stop → [[hr-employee-relations]] before any PIP |
| Is it conduct, not performance? | Disciplinary process → [[hr-employee-relations]] |

**Documentation before drafting:** role expectations; dated examples with impact; prior feedback and responses; support already given; workload/leave/adjustment considerations.

**Drafting rules:** observable gaps with dates and impact · measurable required improvement per gap · named support (manager cadence, resources, training) · check-in schedule with written notes · plan period per policy and local law `[VERIFY: <country> law]` · neutral, factual language · consequences stated as policy, not threat · employee may respond in writing · pseudonym in `plans/hr/`, the named version lives in the HRIS.

**Running it:** initial meeting (purpose, gaps, support, cadence, questions) · weekly tracker (requirement, evidence, met/not met, notes) · outcomes: met → close and keep normal feedback; partly met → one documented extension with reason; not met → decision by people, not tools.

A PIP outcome that leads to a sanction or termination ends with: *review with qualified employment counsel (or the relevant authority) before acting.* (hr-rules § 2).

Template: [references/pip-template.md](references/pip-template.md).

## Calibrate — bias and distribution checks

**Before:** definitions and bias guide already shared · HR compiles all draft ratings in one view · flags in advance: managers whose distribution differs markedly from peers, ratings without evidence, big changes from last cycle · an authorised analyst prepares the **group distribution check** inside the HRIS/analytics tool (aggregate only — see below).

**During (facilitated):**
1. Restate the rating definitions.
2. Flagged cases first, while attention is fresh — never alphabetical.
3. Manager states rating and evidence; challenges must cite evidence, not impressions.
4. Quick confirmation round for unflagged cases.
5. HR records the final rating and a one-line rationale for each change.

| Rater bias | Facilitator check |
|---|---|
| Recency | "What happened in the first half of the period?" |
| Halo / horn | "Rate each area on its own evidence — is one trait carrying the rest?" |
| Leniency / severity | "How does this manager's spread compare with peers and last cycle?" |
| Central tendency | "Is everyone 'meets' because the evidence says so, or to avoid conversations?" |
| Similarity / affinity | "Would the rating be the same for someone who works very differently from you?" |
| Visibility | "Are remote or part-time people judged on outcomes or on face time?" |
| Performance ≈ potential | Keep them separate — potential belongs to the talent review |

**Group distribution check (hr-rules § 5) — before ratings are final:**
- Compare the share of top and bottom ratings by group against the overall share: gender, age band, part-time vs full-time, recent protected leave, remote vs office, plus special-category groups only on a counsel-confirmed lawful basis, voluntarily provided, in aggregate above the minimum group size (hr-rules § 3) `[VERIFY: <country> data-protection and equality law]`. Also compare by manager.
- Use a ratio of selection rates as a screen — a ratio below four-fifths is a US rule-of-thumb signal (Uniform Guidelines on Employee Selection Procedures, 29 CFR 1607.4(D)); passing it does not prove absence of adverse impact `[VERIFY: jurisdiction]`; for small groups look at counts and individual cases, not ratios.
- A gap triggers re-examination of the evidence for the cases involved — never an adjustment to hit a quota. Forced distributions do not prove fairness.
- Results go in `calibration.md` as aggregates with minimum cell sizes; individual group membership never leaves the HRIS (hr-rules § 3).

**After:** lock ratings; share change rationale with the relevant manager only; give talking points; the manager owns delivery.

## Succession — critical roles to readiness

1. **Critical roles by continuity risk** — business impact × replaceability × likelihood of vacancy — not seniority alone. Start with a focused list; widen next cycle.
2. **Pre-work:** performance rating from recent cycles; a **separate** potential rating against written criteria (learning agility, appetite and capacity for larger scope, leadership behaviours).
3. **9-box session**, facilitated with behavioural anchors; challenges need evidence; strong disagreement goes to a follow-up, not a vote.
4. **Readiness tiers:** Ready now · Ready in 1–2 years · Ready in 3+ years · No successor.
5. **Coverage:** aim for more than one successor per critical role — one successor is one resignation from a gap. Flag single- and no-successor roles.
6. **Every named successor** gets a development owner, an early development conversation and an IDP with real stretch assignments. Pair with a retention check: role/scope, recognition and pay (→ [[hr-rewards]]), direction, manager relationship — diagnose before assuming a departure.
7. **Confidentiality covers the list, not the development.**
8. **Report** coverage, gaps, actions and the ask — gaps framed as managed risks with dates.
9. **Stabilise** after any move: 30/60/90 checks on mandate, team acceptance, peer relationships, gap support.

9-box and nomination outcomes get the same group distribution check as ratings; potential criteria are written before the session; tools may surface data but do not nominate (hr-rules § 5–6). Template: [references/succession-template.md](references/succession-template.md).

## Career — paths, competencies, IDPs

- **Career framework:** tracks (individual contributor and management — advancement must not require managing people), levels taken from the job architecture in [[hr-rewards]], level criteria with behavioural indicators, written transition criteria. Lateral and cross-functional moves count as growth. Publish it so people can self-assess without HR mediation.
- **Competency framework:** start from the problem it must solve (hiring consistency, "how" in reviews, development language). Layers: core (everyone), leadership, functional. Keep it short. Each competency has behavioural indicators per proficiency level, specific enough that a manager and employee looking at the same evidence agree. Validate with top-performer interviews, manager input and known cases; pilot; embed in hiring ([[hr-recruiting]]), reviews and IDPs rather than a separate event; one owner, an advisory group, an annual review, versioned changes.
- **IDP:** career goal (1–3 years) · strengths to build on · one to three development priorities · activities weighted toward on-the-job experience, then relationships (mentoring, feedback), then formal learning ([[hr-learning]]) · milestones and dates · manager commitments.
- **Career conversation** (quarterly, separate from the review, employee leads): aspirations → strengths → development priorities → manager connects goals to real opportunities → commitments on both sides.
- **"Not yet" promotion conversation:** decision first, plainly · two concrete strengths · the specific gap against next-level criteria · a plan that produces evidence by the next cycle · an option the employee controls (project, rotation, lateral move).
- **Internal moves** → [[hr-culture]] § Journey (mobility policy); career paths link to it.

## Coach — coaching, mentoring, managers, HRBP

| | Coaching | Mentoring | Managing |
|---|---|---|---|
| Purpose | Person finds own answer | Share experience and perspective | Set expectations, evaluate |
| Fits | Capable but blocked; behaviour change | Career navigation, context | Conduct or performance gaps |
| Not for | Missing foundational skill; conduct issues | Performance management | — |

- **Manager-as-coach** works for development conversations, not ratings — the evaluator cannot offer full psychological safety. High-stakes cases go to a coach outside the reporting line. Teach one model deeply, e.g. **GROW** (Goal, Reality, Options, Will — popularised by John Whitmore).
- **Mentoring programme:** formal programmes widen access beyond the well-networked — monitor participation across groups (hr-rules § 5). Match on development goals, outside the reporting line; kickoff (goal, ground rules, confidentiality limits) → working sessions (mentee brings a live challenge; mentor asks before advising) → closing reflection. Mentor guide covers boundaries: no advocacy in pay/rating decisions without the mentee's knowledge, disclose conflicts, escalate only safety risks. Coordinator checks each pair early. Measure completion, goal clarity, participant-reported outcomes.
- **Manager effectiveness:** turn standards into observable practices (scheduled 1:1s, quarterly career conversations, timely specific feedback, documented reviews). Measure with upward feedback (behavioural items, anonymity threshold, used for development), team-health lagging signals (team attrition, engagement vs peers), skip-levels. Diagnose capability vs motivation vs environment. A 90-day plan: awareness and commitments (days 1–30) → practice with observation (31–60) → pulse check and decision to close or escalate (61–90). Brief protective business leaders with the pattern, the plan and what you need from them.
- **HRBP advisory on a performance issue:** diagnose skill / will / structure → model two or three options with trade-offs (e.g. coaching-first, PIP, structural fix) → recommend → 30/60/90 follow-through for manager and team.

## Guardrails

- **Jurisdiction** (hr-rules § 1–2): PIP periods, warning steps, probation, leave protection and data rules are local — name the country; figures `[VERIFY: <law>]`. PIPs leading to sanctions or termination carry the counsel-review line.
- **PII** (hr-rules § 3): `plans/hr/` holds roles and pseudonyms (`Employee A`, `Successor 1`), aggregate distributions only; ratings of named people stay in the HRIS.
- **No invented benchmarks** (hr-rules § 4): PIP success rates, high-potential percentages, coverage ratios, attrition norms — cite or `[NEEDS DATA]`.
- **Fairness** (hr-rules § 5): criteria and rating definitions written before assessment; every rating, 9-box or nomination outcome over a group gets the distribution check before it is final.
- **Human decision** (hr-rules § 6): AI may draft reviews, summarise evidence and flag outliers; it does not rate, rank, nominate or decide a PIP outcome. AI used to score employees is high-risk — document purpose, data, reviewer and bias test.

## Output

- `goals` → `plans/hr/<slug>/goals.md` (cascade table, SMART goals, review dates).
- `review` → `plans/hr/<slug>/review-cycle.md` (scale, timeline, bias guide, model review); single review drafts → `plans/hr/<slug>/review-<pseudonym>.md` (working draft).
- `pip` → `plans/hr/<slug>/pip.md` (fitness test result, plan, tracker, counsel-review line; working draft).
- `calibrate` → `plans/hr/<slug>/calibration.md` (agenda, flags, aggregate distribution check, change log without names).
- `succession` → `plans/hr/<slug>/succession-plan.md` (critical role list, readiness counts, coverage, actions, stabilisation); named-role + successor rows go in the HRIS talent module.
- `career` → `plans/hr/<slug>/career-framework.md` or `plans/hr/<slug>/idp.md`.
- `coach` → `plans/hr/<slug>/coaching-programme.md` or `plans/hr/<slug>/manager-effectiveness.md`.

Per-person files (`review-<pseudonym>.md`, `pip.md`, an individual `idp.md`) are pseudonymised **working drafts** only: the final copy moves to the HRIS and the draft is removed from `plans/` (hr-rules § 3).

## Before proceeding

1. Which country (and state/province) applies, and are there works councils, unions or collective agreements touching reviews?
2. Which action, and what population (one person, a team, the whole cycle)?
3. What already exists — rating scale, competency framework, levels, review tool?
4. PIP: what was communicated, when, and what support was already given? Any leave, health or adjustment factor?
5. Calibrate/succession: who attends, and who is authorised to run the group distribution analysis?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, systems, approvers
- [[hr-rewards]] — levels, pay decisions after ratings, pay equity
- [[hr-learning]] — development programmes behind IDPs and manager development
- [[hr-employee-relations]] — conduct, discipline, termination, accommodation
- [[hr-workforce-analytics]] — rating and attrition analytics, workforce plans
- [[hr-people-ops]] — day-90 handoff into the cycle
- [[hr-culture]] — engagement signals used in manager effectiveness
- `.claude/workflows/hr-rules.md` — § 1–6

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-business-partner`, `hr-career-development`, `hr-coaching-mentoring`, `hr-competency-management`, `hr-manager-effectiveness`, `hr-people-leadership`, `hr-performance-management`, `hr-performance-review`, `hr-succession-planning`, `hr-talent-management` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method tables and decision tests; overlaps merged (succession and 9-box across three sources, review and calibration across three, leadership and manager effectiveness into one section); unsourced figures removed (benchmark tables for PIP success, attrition, coverage ratios, high-potential rates, post-transition failure, survey scores, development-mix percentages, anonymity thresholds); vendor tool lists dropped; group distribution check, PIP fitness test, jurisdiction, PII and human-decision guardrails added; routing via `/hr:perform`.
