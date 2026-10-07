---
name: hr-org-change
description: Organisation design and change — strategy-first design criteria, grouping, linking, spans and layers, decision rights, options appraisal, RACI; change management (ADKAR, Kotter 8 steps, Bridges transition model — picked by situation), readiness, stakeholder and change-impact assessment, resistance diagnosis, change communication plans and manager cascades, 30/60/90 stabilisation; organisational-effectiveness diagnosis and the HR strategic plan; M&A HR due diligence, Day-1 readiness and 100-day integration; workforce transformation, HR project charter and RACI, crisis response. Use for "redesign the org structure", "spans and layers", "plan this reorg", "change management plan", "how do we announce this restructuring", "stakeholder map", "change impact assessment", "org effectiveness diagnostic", "HR strategy for the next 3 years", "HR due diligence", "Day 1 plan", "100-day integration", "automation impact on roles", "project charter for the HRIS rollout", "crisis playbook". For consultation, selection, notice and severance when roles are removed use hr-employee-relations (`/hr:comply exit`); for multi-country baselines use hr-global.
allowed-tools: Read, Write, Glob, Grep
---

# Org Design & Change

> Structure follows strategy, and adoption follows design. A reorg is finished when the new decision rights are used without prompting, not when the chart is published.

## When this skill activates

**Implicit:** a leader announces a reorg or new operating model; teams have outgrown their structure; a system or policy rollout needs adoption; a deal is signed or closing; automation changes roles; a workforce crisis hits; HR needs a strategic plan or a project charter.
**Explicit:** "Read the `hr-org-change` skill file and [task]."
**Routed from:** `/hr:org design|change|ma|od|transform`.

## Scope

Covers:
- **design**: design criteria, grouping, linking, spans and layers, decision rights, options appraisal, transition plan.
- **change**: approach selection, readiness, stakeholder map, change-impact assessment, resistance diagnosis, communication plan, stabilisation.
- **od**: organisational-effectiveness diagnosis, team effectiveness, internal-consulting stance, design-thinking co-design, HR strategic plan.
- **ma**: HR due diligence, finding triage, key-talent retention, Day-1 readiness, 100-day integration, cross-border sequencing.
- **transform**: task-level impact, redeploy-before-exit, HR project charter + RACI + risk log, crisis response.

Does NOT cover:
- The separation process — consultation, selection pools, notice, severance → [[hr-employee-relations]] `exit`; warnings → [[hr-employee-relations]] `discipline`. This skill owns the org rationale and design.
- Multi-country baseline, entity/EOR choice, country addenda → [[hr-global]].
- Headcount forecasts, scenarios, people budget → [[hr-workforce-analytics]].
- Job architecture, levelling, pay and benefit harmonisation design → [[hr-rewards]].
- Reskilling programme design → [[hr-learning]]; succession for key talent → [[hr-performance]].
- Engagement surveys, culture programmes, business-as-usual internal comms → [[hr-culture]].
- Offboarding mechanics, HR operating model and shared services → [[hr-people-ops]]; HRIS selection → [[hr-technology]].

## Common stance — diagnose before prescribing

Every action starts here. A leader's requested fix ("a training", "a reorg", "PIPs for all three") is a hypothesis to test, not a brief.

| Root-cause type | Typical signal | Where the fix lives |
|---|---|---|
| Skill | Never done well; same gap across everyone in the role | Development → [[hr-learning]] |
| Motivation | Can do it, doesn't; varies by manager | Manager practice, recognition, role fit |
| Process / system | Breaks at handoffs regardless of who does it | Process redesign |
| Structure | Friction between groups; decisions stall; spans drifted | `design` |
| Strategy / clarity | Teams disagree on priorities | Leadership alignment, `od` |

Tests: "Did this ever work — what was different then?" · "Does it happen elsewhere?" · "Would doubling support fix it?" · "One person or everyone in the role?" Triangulate at least three sources (metrics, interviews across levels, documents). Present options with explicit trade-offs and name what you are not recommending and why.

## design — org design

1. **Strategy → design criteria.** 4–7 testable statements the structure must satisfy ("product teams ship routine changes without a cross-functional approval chain"). Written before options; used to score them.
2. **Current-state map.** Layers from CEO to front line, span per manager, single-report managers, dotted lines, decisions that stall (decision log, escalation counts). Count explicitly; layers are usually more than leaders assume.
3. **Four design decisions:**

| Decision | Question | Choices |
|---|---|---|
| Grouping | How is work clustered? | Function · product/BU · geography · customer segment · matrix |
| Linking | How do groups coordinate? | Shared hierarchy · lateral roles and forums · shared standards · shared data |
| Sizing | Spans and layers? | Per role family, from span drivers — never one ratio |
| Decision rights | Who decides what? | RACI on the decisions that actually caused friction |

4. **Span drivers.** Wider when work is standardised, the team experienced, co-located, and the manager has few non-managerial duties; narrower when work is novel or coaching-intensive, the team distributed, or the manager is a player-coach. Derive targets from these drivers and the organisation's own data; any external span benchmark is cited or `[NEEDS DATA]` (hr-rules § 4).
5. **Layer test.** Each layer names the decision or coordination it performs that the layer above or below cannot. A layer that exists mainly as a promotion path is a career-track problem → [[hr-rewards]].
6. **Options appraisal.** At least two genuine options plus "minimal change". Score against criteria; mark failures fatal or mitigable; add transition cost and risk. Template in [references/templates.md](references/templates.md).

| Model | Strength | Watch |
|---|---|---|
| Functional | Depth, clear career paths | Cross-functional coordination needs deliberate linking |
| Divisional / BU | Outcome accountability | Duplicated capability across units |
| Matrix | Expertise plus delivery focus | Dual reporting → ambiguity unless decision rights are explicit |
| Flat / network | Speed at small scale | Coordination breaks as headcount grows |

7. **RACI.** Exactly one A per decision; map friction decisions only; revisit after 60–90 days of operation.
8. **Transition plan.** Design settled before announcement. Roles before people: finalise structure and role criteria, then map people against written criteria (hr-rules § 5). Time-boxed path to target state; a lingering half-state compounds disruption.

**Design removes or materially changes roles** → information/consultation duties, selection rules, notice and severance differ by country and may have to start before decisions are final `[VERIFY: national labour code; EU — Directive 98/59/EC on collective redundancies as transposed]`. Hand to [[hr-employee-relations]] `exit` before any announcement. *Review with qualified employment counsel (or the relevant authority) before acting.*

Pitfalls: chart changes but decision rights don't; designing around incumbents; uniform span target across unlike work; macro redesign with no team-level role clarity.

## change — change plan, impact, communication

**Pick the model by situation — blend, don't recite:**

| Situation | Lead with | Why |
|---|---|---|
| Individual adoption of a new system, process or policy | **ADKAR** (Prosci): Awareness → Desire → Knowledge → Ability → Reinforcement | Locates the stage each group is stuck at |
| Organisation-wide shift that needs sponsorship and momentum | **Kotter 8 steps** (1996): create urgency → build a guiding coalition → form a strategic vision → communicate the vision → empower broad-based action → generate short-term wins → consolidate gains and produce more change → anchor new approaches in the culture | Leadership-led sequence |
| Loss-heavy change (restructure, merger, relocation, role loss) | **Bridges transition model**: Ending → Neutral zone → New beginning | The change is an event; the transition is the psychological process people go through |

Common blend: Kotter for the leadership arc, ADKAR per stakeholder group, Bridges for anyone who loses something.

1. **Readiness.** Sponsor commitment, change history and fatigue, manager capability, competing initiatives, concerns (pulse + focus groups).
2. **Stakeholder map.** Influence × impact; per group: what changes, what they lose, likely stance, owner.
3. **Change-impact assessment.** Group × dimension (process, systems, role/skills, reporting line, location, terms, headcount), rated H/M/L; every H row gets a support action. Template in [references/templates.md](references/templates.md).
4. **Resistance diagnosis.** Attitudinal (distrust, no credible "why") vs structural (workload, capacity, incentives) vs communication gap (inconsistent messages, silence after announcement). Fix the type, not the person. Resistance is information, not proof the decision was wrong.
5. **Options.** Model 2–3 approaches (e.g. training-first / readiness-first / parallel) with timeline and risk.
6. **Communicate** (below). **Enable**: role-based training, manager toolkit, coaching — started before launch.
7. **Stabilise.** Checkpoints at 30/60/90 days (default horizon, adjust): are new tools and decision rights used unprompted? sentiment trend? informal reversion? Named owner per check. Measure behaviour and outcomes, not attendance.

**Communication plan**
- **Sequence:** directly affected first (1:1, never mass email) → their managers (briefed with time to absorb, plus toolkit) → wider organisation → external only if material. Sequence defensively against leaks.
- **Message architecture:** what is changing (plainly, no euphemism) · why now · what it means for me · what is *not* changing · what happens next, with dates · where to ask (a named channel).
- Say what is known and what is not, with a date for the rest. Never promise "no layoffs" or "no change to your role" unless the decision is locked.
- **Backbone:** T-2w leadership alignment and Q&A prep · T-1w manager briefing · D0 announcement synced with manager conversations · D1–7 team conversations · W2–4 follow-ups · milestone updates (even "on track, no change") · formal close.
- **Channels:** personal impact → 1:1; team context → manager meeting; narrative → all-hands after affected people are informed; written → reference that supplements, never replaces, a conversation.
- **Two-way:** live Q&A, anonymous questions, pulse; publish answers to recurring themes. Manager rule: "I don't know; I'll come back by <date>" beats a guess.
- Each country's message gets local legal and tone review → [[hr-global]].

**Design thinking** when the change touches employee experience: empathise (interviews, journey map with emotions) → define (problem from the user's point of view) → ideate (wide before narrow) → prototype (low fidelity, small pilot) → test (watch use; scale / iterate / drop rules set before the pilot). Tell co-designers what is negotiable and close the loop on their input.

## od — effectiveness diagnosis and HR strategic plan

**Effectiveness diagnostic**
1. Sponsor commits to act before data collection; the question is scoped narrowly enough to answer.
2. **Dimensions:** structure · decision rights · capability · process · culture and incentives. Lenses: **McKinsey 7S** (alignment across strategy, structure, systems, shared values, style, staff, skills) or **Galbraith Star** (strategy, structure, processes, rewards, people). Team level: check goals → roles → processes → relationships in that order; relationship friction often traces back to goal or role ambiguity.
3. **Data:** interviews across levels (not only senior), focus groups, one process walkthrough end-to-end (a real decision or launch), documented vs lived structure, quant (decision cycle time, span/layer data, attrition by segment, engagement drivers from [[hr-culture]]).
4. **Symptom → root cause:** ask "why" against evidence; a pattern recurring in unconnected groups outweighs one loud account.
5. **Report:** ≤5 prioritised findings, evidence per finding, interventions sequenced by dependency (decision rights before process redesign), one metric each; share a summary back with participants.

Common misreads: slow decisions = governance, not leadership · team underperformance = clarity, not talent · cross-functional friction = incentives or structure, not culture · low engagement = belief in strategy, not management.

**HR strategic plan**
1. Inputs: business strategy (bets, required capabilities, vulnerabilities), workforce data ([[hr-workforce-analytics]]), people-risk register ([[hr-employee-relations]]), external (labour market, regulation), leader interviews.
2. Translate strategy → workforce implications (capability, shape, structure) → gap vs today.
3. 3–5 priorities organised by outcome, not by HR function. Each: business outcome, current → target, initiatives, owner, leading + lagging metric, resources.
4. Explicit stop-doing list (inertia programmes, unused reports, untested processes).
5. Objectives and key results measure outcomes, not activity ("manager-effectiveness score improves", not "launch manager training").
6. Fit the planning calendar: strategy → budget envelope → BU plans → HR plan; mid-cycle review; quarterly progress.
7. Two versions: executive narrative with top-line metrics; HRBP/manager view with initiatives and roles.

## ma — due diligence, Day 1, 100 days

**Due diligence** (under NDA: data room → management interviews → key-talent assessment). Areas: workforce and cost; contracts and change-of-control; equity and retention; benefits and pension liabilities; litigation, claims, regulatory matters; contractor classification; immigration-dependent staff; collective agreements and employee-representative bodies; HR compliance posture; culture (decision style, pace, risk tolerance — from interviews, not values statements); key-person dependency. Checklist in [references/ma-integration.md](references/ma-integration.md).

| Finding class | Meaning | Goes to |
|---|---|---|
| Deal-breaker | Changes deal economics or carries unacceptable risk | Deal committee now |
| Price-adjustor | Quantifiable liability | Valuation, indemnity, escrow |
| Integration issue | Creates work, not value change | Integration plan |

Key talent: criticality (knowledge, client relationships, leadership — not title) × flight risk (deal uncertainty is itself a risk). Every flagged person gets a mitigation: milestone-tied retention agreement, early role clarity, senior outreach. Pseudonyms in plans; names stay in the deal room (hr-rules § 3).

**Day 1** must answer: who do I report to · do pay, benefits or terms change · is my job affected (only what is decided) · who is my HR contact · payroll and benefits continue uninterrupted. **100 days:** pre-close → D1–30 stabilise → D31–90 integrate → D91–100 review and hand to business-as-usual; the legal sequence in each country governs. Fast on decisions that hit individuals (reporting line, role, pay timeline); deliberate on structure and culture; name leaders of combined functions early. Order: payroll/benefits continuity → overlapping roles → pay and benefit harmonisation ([[hr-rewards]]) → systems → deeper culture work. Integration is not assimilation: assess both cultures and pick 3–5 dimensions that need an explicit decision.

**Cross-border:** the most consultation-heavy jurisdiction paces the whole plan. Confirm per country the transfer mechanism (automatic transfer of terms vs re-offer/consent) `[VERIFY: e.g. EU Acquired Rights Directive 2001/23/EC as transposed; local law]` and any duty to inform/consult employee representatives before implementing changes `[VERIFY: national works-council law]`. Day-1 messages are local, delivered by local leaders. Country requirement tables → [[hr-global]]; any post-close role removal → [[hr-employee-relations]] `exit` + counsel line.

**Integration health:** leading (first 90 days) — acquired-org voluntary attrition vs pre-deal baseline, key-talent retention, integration-confidence pulse, decision-completion rate. Lagging — engagement, milestone completion, synergy vs deal thesis.

## transform — workforce transformation, HR projects, crisis

**Workforce transformation.** (1) Task-level impact, not job titles: per role, tasks automated / augmented / unchanged, and the resulting role change. (2) Path order: redeploy → reskill ([[hr-learning]]) → redesign roles → exit last; exits go to [[hr-employee-relations]] `exit`. (3) Phased roadmap with checkpoints; leaders → managers → employees; every disruption message paired with the path forward. (4) Measure redeployment rate, critical-talent retention, time-to-productivity in new roles, sentiment — not cost savings alone.

**HR project charter + RACI.** Objective, sponsor, scope in/out, measurable success criteria, deliverables, milestones, governance (steering committee decides, working group delivers, escalation path), stakeholders, risk log, budget, change control. One A per deliverable. Risk log reviewed every status cycle; change and comms workload sized alongside technical work; go-live readiness check; post-implementation review before the team disperses. Template in [references/templates.md](references/templates.md).

**Crisis response.**
- *Before:* typology (safety/health · conduct, e.g. senior-leader allegation · business, e.g. large layoff, closure, sudden executive exit · data/tech, e.g. HR data breach, payroll failure); named crisis team and roles; decision-authority matrix; activation criteria; escalation triggers HR → exec → board; pre-arranged counsel, EAP, investigators, comms support; message templates; yearly tabletop exercise.
- *First hour:* confirm facts → convene team → employee safety → who must be told, in what order (employees, leaders, board, regulators) → agree what can be said now. Internal before external; factual and calibrated; regular updates even with no news; named channels; EAP activated.
- *Unplanned layoff:* counsel first — collective-notice duties and release-of-claims rules `[VERIFY: e.g. US WARN Act + state laws; EU Directive 98/59/EC as transposed]`; decision structure; information lockdown; adverse-impact check on the affected pool (hr-rules § 5); 1:1 notifications in a tight window; manager say/don't-say brief; survivor communication. Separation process → [[hr-employee-relations]] `exit`; exit logistics → [[hr-people-ops]]. *Review with qualified employment counsel (or the relevant authority) before acting.*
- *After:* after-action review without blame for good-faith decisions; update the playbook; address the longer-term trust impact.

## Guardrails

- **Jurisdiction (hr-rules § 1).** Every role removal, transfer, consultation or notice names its country; multi-country = baseline + addenda via [[hr-global]].
- **No statutory figures from memory (§ 2).** Consultation periods, notice, thresholds, severance formulas → cite or `[VERIFY: <law>]`. Restructuring, RIF and termination outputs end with the counsel-review line.
- **Employee data (§ 3).** Org maps, flight-risk lists, due-diligence findings and selection pools use roles or pseudonyms; names stay in the HRIS or deal room.
- **No invented benchmarks (§ 4).** Span targets, adoption rates, deal-failure rates, post-reorg engagement dips → cited or `[NEEDS DATA]`.
- **Fair (§ 5).** Criteria for new roles written before people are mapped; adverse-impact check on any reduction pool.
- **Human decides (§ 6).** AI drafts scenarios and messages; people decide structure and outcomes for individuals.
- **Confidentiality.** Pre-announcement work uses code names and leak-resistant sequencing.

## Output

- `design` → `plans/hr/<slug>/org-design.md` — criteria, current-state map, options appraisal, recommended structure, RACI, transition plan.
- `change` → `plans/hr/<slug>/change-plan.md` (approach, readiness, stakeholder map, impact assessment, stabilisation) + `plans/hr/<slug>/change-comms.md` (sequence, message architecture, manager toolkit, FAQ).
- `od` → `plans/hr/<slug>/oe-diagnostic.md` or `plans/hr/<slug>/hr-strategy.md`.
- `ma` → `plans/hr/<slug>/hr-due-diligence.md` + `plans/hr/<slug>/integration-100-day.md`.
- `transform` → `plans/hr/<slug>/transformation-roadmap.md`, `plans/hr/<slug>/project-charter.md` or `plans/hr/<slug>/crisis-playbook.md`.

Each artifact ends with open questions and the counsel-review line where § 2 applies.

## Before proceeding

1. What triggered this, and what has already been announced or promised?
2. Which countries and entities, and how many people, are in scope? Will roles be removed or transferred?
3. Who sponsors, who decides, and who already knows?
4. What data exists — org chart export, decision log, engagement, attrition, deal-room access?
5. Which hard dates bind (deal close, go-live, board meeting)?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-employee-relations]] — `exit` (consultation, selection, notice, severance), warnings, risk register
- [[hr-global]] — multi-country baseline, country addenda, cross-border integration detail
- [[hr-workforce-analytics]] — forecasts, scenarios, people budget behind a design or transformation
- [[hr-rewards]] — job architecture, pay and benefit harmonisation
- [[hr-culture]] — engagement data, culture work after integration
- [[hr-people-ops]] — HR operating model, offboarding mechanics
- [[hr-context]] — the hub this skill reads first
- `.claude/workflows/hr-rules.md` — §§ 1–6, 9

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-organizational-design`, `hr-organizational-development`, `hr-organization-effectiveness`, `hr-change-management`, `hr-change-communication`, `hr-consulting`, `hr-design-thinking`, `hr-strategic-planning`, `hr-mergers-acquisitions`, `hr-post-merger-integration`, `hr-ma-integration-by-country`, `hr-workforce-transformation`, `hr-project-management`, `hr-crisis-management` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; overlapping change, OD and M&A material merged; unsourced figures removed (span and layer targets, adoption and survey benchmarks, deal-failure rates, consultation durations, severance norms, threshold figures); statutory references marked `[VERIFY]`; jurisdiction, PII, fairness and counsel-review guardrails added; routing via `/hr:org design|change|ma|od|transform`.
