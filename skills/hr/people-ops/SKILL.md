---
name: hr-people-ops
description: People operations method — offer-acceptance-to-day-90 onboarding (pre-boarding, day 1, 30/60/90, buddy, manager checklist, trigger-based IT/HR handoffs, onboarding scorecard), voluntary and involuntary offboarding (access and asset recovery, knowledge transfer, team announcement, exit interview, exit-theme analysis, rehire), employee lifecycle map (stage handoffs, lifecycle-event checklists, system of record per field, risk-signal escalation), HR operating model (three pillars, RACI), tiered service delivery, service catalogue and SLAs, self-service content, shared services, HR coordination calendar and runbooks, HR service-vendor (EOR, benefits broker, background check, EAP, payroll bureau) selection, contracting and governance. Use for "onboarding plan", "30/60/90 for a new hire", "new hire checklist", "laptop wasn't ready on day one", "offboarding checklist", "exit interview questions", "knowledge transfer before they leave", "map the employee lifecycle", "HR service desk tiers", "HR shared services", "HRBP vs CoE", "select an EOR or benefits broker", "HR operations calendar". For terminations, investigations and redundancy process use hr-employee-relations (`/hr:comply exit`); for HRIS and HR software selection (`select`), automation and chatbots use hr-technology; for engagement and experience design use hr-culture.
allowed-tools: Read, Write, Glob, Grep
---

# People Operations

> A process that lives in one person's inbox is a risk, not a process — every handoff gets a trigger, an owner and a date.

## When this skill activates

**Implicit:** a hire or cohort is about to start; someone resigns or is being separated; day-one failures (no equipment, no access); HR questions piling into HRBP inboxes; "who owns this — HR, IT or Finance?"; an HR vendor contract nearing renewal.
**Explicit:** "Read the `hr-people-ops` skill file and [task]."
**Routed from:** `/hr:people onboard`, `/hr:people offboard`, `/hr:people lifecycle`, `/hr:people service`.

## Scope

Covers:
- **Onboard** — offer acceptance to day 90: tracks, phases, handoffs, buddy, check-ins, quality scorecard.
- **Offboard** — voluntary and involuntary exits: checklist, access/asset recovery, knowledge transfer, announcement, exit interview, theme analysis, alumni/rehire.
- **Lifecycle** — stage map, stage-to-stage handoffs, lifecycle-event checklists, data ownership, risk-signal escalation.
- **Service** — HR operating model, tiered delivery, service catalogue, SLAs, self-service content, shared services, coordination, vendor lifecycle.

Does NOT cover:
- Termination decisions, misconduct, investigations → [[hr-employee-relations]]; redundancy/RIF process, separation agreements → [[hr-employee-relations]] `exit`; restructuring as a change programme → [[hr-org-change]].
- HRIS selection and integration, workflow automation build, HR chatbots, AI-in-HR governance → [[hr-technology]].
- Experience/journey design, listening, engagement and stay surveys → [[hr-culture]].
- Onboarding training content and learning programmes → [[hr-learning]].
- Pay, final-pay amounts, benefits design → [[hr-rewards]]; payroll compliance → [[hr-employee-relations]].
- Probation and day-90 performance assessment → [[hr-performance]]; offer and candidate experience up to acceptance → [[hr-recruiting]].
- People dashboards, HR budget → [[hr-workforce-analytics]]; country registration rules, EOR, cross-border moves → [[hr-global]].

## Onboard — acceptance to day 90

Split the work into four tracks so nothing is owned by "HR" in general:

| Track | Content | Owner |
|---|---|---|
| Company | Mission, policies, tools, who-to-ask map | HR operations |
| Role | Outcomes (not just tasks), priorities, success measures, key stakeholders | Hiring manager |
| Team | Introductions with context, buddy, working norms | Manager + buddy |
| Admin / compliance | Contract, right-to-work, tax and social-insurance registration, payroll, benefits enrolment | HR operations — deadlines `[VERIFY: <country> law]` |

| Phase | New hire can... (know / do / feel) | Owner | Checkpoint |
|---|---|---|---|
| Pre-boarding | Has welcome, day-1 schedule, documents done; equipment and access ready | HR ops, IT | Readiness confirmed the business day before start |
| Day 1 | Meets manager first; working tools; knows the first-week plan | Manager, HR | End-of-day check |
| Week 1 | Has met team and key stakeholders; can state role outcomes | Manager | Weekly 1:1 starts |
| Day 30 | Explains priorities, stakeholders, success measures | Manager, buddy | Day-30 check-in |
| Day 60 | Owns core tasks with support; has had structured feedback | Manager | Day-60 check-in |
| Day 90 | Role-ready; development plan agreed | Manager, HRBP | Day-90 review → [[hr-performance]] |

### Fix the handoff, not the person

Hypothesis to test first: a day-one failure often traces to one handoff with no trigger and no owner. Map the current state step by step (offer accepted → record created → IT request → equipment → manager notified), find the gap, fix it manually first, automate later.

| Step | Trigger | Owner | Lead time |
|---|---|---|---|
| HRIS record created | Offer accepted in ATS | People ops | Same business day |
| Equipment + access request | HRIS record created | People ops (or automated) | IT's stated lead time before start |
| Manager checklist sent | Fixed days before start | People ops | Set locally |
| Readiness confirmation | Business day before start | IT + people ops | Before end of day |

If offers routinely close inside IT's lead time, the start-date policy is part of the problem — raise it with [[hr-recruiting]].

### Design rules

- **Personalise** by role family, seniority, location and work pattern. New people managers get a manager track (expectations, people processes, peer group).
- **Remote/hybrid:** scheduled interaction, an explicit buddy rhythm, visible culture — not a video login and a document pack.
- **Inclusive:** accessible materials; ask one neutral question ("Is there anything that would help you do your best work?"). Never ask about health, disability, family plans or religion on pre-boarding forms; adjustment requests → [[hr-employee-relations]].
- **Pace it.** Spread content over the 90 days; week-one overload buries what matters.
- **Buddy:** a peer outside the reporting line, briefed on the role (social integration, informal questions) — not the trainer, not the evaluator.
- **Check-ins at 30/60/90** include HR, not only the manager — new hires raise things with HR they will not raise with their manager. Structured: role clarity, tools/access, connections, feedback, agreements.

| Scorecard | Green | Yellow | Red |
|---|---|---|---|
| Equipment and access | Ready before day 1 | Ready in week 1 | Missing after week 1 |
| Role clarity | Outcomes documented | Tasks shared, outcomes unclear | Cannot state success measures |
| Manager check-ins | Weekly, structured | Occasional | None planned |
| Buddy | Assigned and active | Assigned, role unclear | None |
| Feedback loop | Day-30 feedback collected | Collected late | Not collected |

Template: [references/onboarding-plan.md](references/onboarding-plan.md).

## Offboard — notice to alumni

**When someone resigns:** the manager acknowledges it professionally, confirms the last day against the contract (`[VERIFY: notice period — contract + <country> law]`), agrees how and when the team hears, and makes no counteroffer on the spot. Before any counteroffer, HR asks: is the reason pay (addressable) or something else? Are we committed to this person long-term? What does it do to internal equity (→ [[hr-rewards]])? The transition plan targets knowledge transfer, not persuasion.

| | Voluntary | Involuntary (performance, conduct, redundancy) |
|---|---|---|
| Decision | Employee's | Made, documented and legally reviewed **before** offboarding starts → [[hr-employee-relations]] (`discipline` · `exit`) |
| Access revocation | Scheduled for the last day | Timed to the meeting; prepared beforehand with IT security |
| Delivered by | Manager | Manager with HR present; clear, brief, unambiguous that it is final |
| Logistics | Over the notice period | Final pay, equipment return, access ready before the conversation |
| Exit interview | Offered | Optional, handled with care, separate from admin |
| Team message | Wording agreed with the leaver | Factual and respectful; in a redundancy, affected people first, others the same day |

Any involuntary separation ends with: *review with qualified employment counsel (or the relevant authority) before acting.* (hr-rules § 2).

### Knowledge transfer — riskiest first

1. **Inventory:** undocumented dependencies and workarounds, in-flight work, stakeholders and contacts, systems and accounts the person owns (transfer ownership, never share credentials).
2. **Rank** by business impact × how undocumented it is.
3. **Name the successor(s)** and run short, regular handoff sessions across the notice period — not one document dump on the last day.
4. **The manager owns the plan**, not the leaver alone.
5. **Sign-off** = the successor performs the task, not "received the doc".

### Exit interview

- Run by someone other than the direct manager, kept separate from administrative steps, confidential **with stated limits** (reports of harassment or misconduct must be acted on → [[hr-employee-relations]]).
- Offer timing before or after the last day; some leavers speak more freely after leaving.
- Surface manager-related causes without naming anyone: "What would have changed your decision?" "How would you describe day-to-day support from your manager?" "When did you first start considering leaving?"
- **Analyse quarterly:** code themes (growth, manager, pay, workload, role, culture), aggregate by segment with a minimum group size, report themes only (hr-rules § 3), and hand retention actions to [[hr-culture]] / [[hr-workforce-analytics]].

Rehire eligibility is set against job-related criteria written in advance (hr-rules § 5), recorded in the HRIS — not a parting mood.

Checklist: [references/offboarding-checklist.md](references/offboarding-checklist.md).

## Lifecycle — map, connect, govern

Six stages: **attract → hire → onboard → develop and perform → grow and move → exit (alumni)**. For each stage record: HR's role, owner, data events, signals, and the handoff to the next stage. Most damage happens at the connections:

| Connection | Typical failure | Fix |
|---|---|---|
| Hire → onboard | Silence between acceptance and day 1 | Pre-boarding cadence with owner |
| Onboard → develop | Day 90 "graduates" into nothing | Day-90 review hands to the performance cycle |
| Develop → grow | No visible criteria for advancement | Career framework → [[hr-performance]] |
| Grow → exit | People must leave to advance | Internal moves visible; exit themes fed back |

### Lifecycle events and data ownership

Every event type (promotion, transfer, manager change, pay change, leave start/return, exit) gets a named role as owner and a checklist confirming every connected system is updated before the event closes. Define one system of record per field:

| Field | System of record | Update path | Owner (role) |
|---|---|---|---|
| Legal name, employment status, manager, department | HRIS | Integration to payroll/IT | People ops |
| Pay | HRIS or payroll — pick one | One-way sync | Payroll / reward |
| Work authorisation | HRIS | Expiry alert | People ops |

Restrict edits outside the system of record; downstream updates go by integration (build → [[hr-technology]]). Cadence: enforce on every change, check every event, compare HRIS vs payroll monthly, review governance quarterly. A recurring mismatch gets a process fix, not just a data correction.

### Risk-signal escalation

Tier it so combined signals trigger action instead of being dismissed one by one: one signal (cancelled 1:1s, team-level pulse drop) → manager checks in informally; two or more inside a defined window → HRBP-facilitated conversation. Add checkpoints at tenure points where **your own** exit data shows departures cluster. Signals come from data employees know is used; no monitoring creep, no inference of special-category data (hr-rules § 3); tools flag, people decide (hr-rules § 6).

## Service — operating model, delivery, vendors

### Operating model

- Start from how the business creates value, then design HR around it. Compare **centralised / decentralised / federated** on governance, speed, cost and consistency.
- **Three-pillar model (Ulrich):** HR business partners, centres of excellence (CoE), shared services. Build a **RACI** across the pillars before moving headcount — check for blurred boundaries first; they are a likely failure point.
- HRBP owns: organisation diagnosis, talent review coordination, org-design support, ER escalations above a threshold, change support, workforce-planning input. HRBP does **not** own: pay benchmarking (CoE), training delivery (CoE), payroll queries and standard onboarding (shared services), routine ER below the threshold. If HRBPs do the second list, they cannot do the first.
- HRBP-to-employee ratios depend on complexity — cite a source or use `[NEEDS DATA]`.
- Find capacity with a two-week time log by category (transactional, reactive, proactive partnering, programme design, analysis): what moves to coordinators, self-service, or back to managers.
- Pilot structural change in one business unit first.

### Tiered delivery and catalogue

| Tier | Handles | Example |
|---|---|---|
| 0 Self-service | Policy lookups, balances, payslips, standard how-to | Knowledge base, portal |
| 1 Generalist | Transactional requests | Address change, employment letter |
| 2 Specialist | Leave, benefits, payroll cases | Leave-of-absence case |
| 3 HRBP / ER / legal | Sensitive or strategic | Harassment, medical, termination |

Sensitive cases (harassment, discrimination, medical, terminations) route straight to a specialist, never through a general queue. Each catalogue entry: request type, who may submit, required information, tier, response and resolution SLA, owner, sensitivity flag. SLAs differ by case type and are set from your own volume and capacity baseline (`[NEEDS DATA]` until measured); track quality (satisfaction, reopen rate) beside speed.

### Self-service content

Write for the question, not the policy document; plain language in the second person; short, one question per article; show a last-reviewed date; build the list from real tickets; one owner per content area; review at least quarterly and on every policy change. Always offer a human after one failed attempt. Measure deflection (resolved without HR contact) together with satisfaction and contact volume by type. Chatbot build and AI governance → [[hr-technology]].

### Shared services and coordination

- **Centralise** high-volume, low-variation work first; keep judgment-heavy work local longer. Scope document lists in/out processes; a steering group of business-unit leads sets priorities; chargeback by headcount, volume or flat fee — auditable by the units that pay. Multi-country hubs must handle language, time zones, local law and data residency → [[hr-global]]. Communicate the "why" before go-live — loss of local control is the main resistance.
- **Coordination:** one annual HR operations calendar (cycles, enrolment windows, compliance dates `[VERIFY]`); a runbook standard (trigger, numbered steps, owner per step, tools, time, escalation, completion record); a weekly status (done, in progress, due in 14 days, blockers with the specific ask); lead times and SLAs agreed with IT, Finance, Legal and Facilities. Record retention periods per law `[VERIFY: <country> law]`.

### HR vendor lifecycle

Scope: HR service vendors (EOR, benefits brokers, background check, EAP, payroll bureau); HR software/systems → [[hr-technology]] `select`.

1. **Needs:** problem, users, integrations, budget, success at 12 months — before seeing any demo.
2. **Longlist → shortlist** from peers, analyst sources, procurement registry.
3. **RFP + weighted scorecard**, weights agreed before demos (functional fit, integration, vendor support, security, total cost of ownership).
4. **Scripted demos** using your scenarios and a non-admin user view.
5. **Security and data:** independent audit report (e.g. SOC 2 Type II), data residency, subprocessors, breach history, deletion and portability; privacy review → [[hr-technology]].
6. **Contract:** pricing model, cap on annual increases, SLAs with remedies, data ownership and return format/timeline, exit for cause and convenience, auto-renewal opt-out window calendared. Uptime and response targets come from the vendor's quote or market comparison, not memory.
7. **Implementation:** named internal owner, written go-live criteria, parallel run, 30/90-day reviews.
8. **Govern:** central registry (vendor, owner, dates, renewal window, cost, data categories); scorecard reviews for major vendors; start renewal review well before the opt-out window; plan exits as carefully as selections.

## Guardrails

- **Jurisdiction first** (hr-rules § 1–2): registration deadlines, notice periods, final-pay timing, continuation coverage (e.g. US COBRA), record retention and work-permit checks are local — name the country and write `[VERIFY: <law/authority>]` for every figure. Country addenda → [[hr-global]].
- **Separations:** involuntary exits, redundancy and separation terms carry the counsel-review line; the decision process belongs to [[hr-employee-relations]] (`exit` for redundancy and non-disciplinary termination).
- **PII** (hr-rules § 3): plans use roles or pseudonyms (`New hire A`, `Leaver B`); checklists point to the HRIS record; exit content is reported only in aggregate.
- **No invented benchmarks** (hr-rules § 4): SLA targets, deflection rates, completion rates, ratios — your baseline or a cited source.
- **Fair criteria** (hr-rules § 5): buddy matching, personalisation and rehire eligibility use job-related criteria.
- **Human in the loop** (hr-rules § 6): AI drafts checklists and flags signals; it does not decide separations or rehire.

## Output

- `onboard` → `plans/hr/<slug>/onboarding-plan.md` (tracks, phases, handoff table, check-ins, scorecard).
- `offboard` → `plans/hr/<slug>/offboarding-checklist.md` (checklist, knowledge-transfer plan, exit interview guide); quarterly themes → `plans/hr/<slug>/exit-themes.md`.
- `lifecycle` → `plans/hr/<slug>/lifecycle-map.md` (stages, connections, event checklists, system-of-record table, escalation tiers).
- `service` → `plans/hr/<slug>/service-model.md` (operating model, RACI, tiers, catalogue, SLAs); vendor work → `plans/hr/<slug>/vendor-evaluation.md`.

## Before proceeding

1. Which country (and state/province) applies, and is the work on-site, remote, hybrid or cross-border?
2. Who is in scope — one hire, a cohort, a role family, the whole organisation?
3. Offboard: voluntary or involuntary? Contractual notice? Who holds critical undocumented knowledge?
4. Which systems hold what — HRIS, ATS, payroll, ticketing, identity provider — and which is the system of record?
5. Service: current request volume by type, and who handles it today?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, systems, approvers this skill reads first
- [[hr-recruiting]] — offer and pre-hire handoff into pre-boarding
- [[hr-performance]] — day-90 review, probation, career paths
- [[hr-employee-relations]] — terminations, `exit` (redundancy / RIF), investigations, accommodation, payroll compliance
- [[hr-technology]] — HRIS, automation, chatbots, vendor privacy review
- [[hr-culture]] — experience design, exit and stay listening
- [[hr-global]] — multi-country service hubs, country addenda
- `.claude/workflows/hr-rules.md` — § 1–6

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-coordination`, `hr-employee-lifecycle`, `hr-employee-self-service`, `hr-management`, `hr-offboarding`, `hr-onboarding`, `hr-operating-model`, `hr-people-operations`, `hr-service-delivery`, `hr-shared-services`, `hr-vendor-management` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method tables and checklists; overlaps merged (onboarding across four sources, service delivery/shared services/operating model/self-service into one service section, offboarding across three); unsourced figures removed (benchmark tables for SLAs, deflection, data accuracy, HR ratios, HRBP ratios, uptime and rate caps, retention claims); statutory figures replaced with `[VERIFY]`; tool vendor lists dropped; jurisdiction, PII, fairness and human-in-the-loop guardrails added; routing via `/hr:people`.
