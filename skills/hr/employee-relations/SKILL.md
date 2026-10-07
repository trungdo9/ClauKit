---
name: hr-employee-relations
description: Employee relations and HR compliance — policy lifecycle and handbook governance, workplace investigations (intake, interim measures, plan, interviews, evidence, findings standard, report, retaliation protection), progressive discipline for conduct, conflict resolution, mediation and grievance procedures, union and works-council engagement, HR risk register, HR compliance audit, payroll controls, the reasonable-accommodation interactive process, work-permit and visa case tracking. Use for "write or update a policy", "employee handbook", "investigate a complaint", "harassment allegation", "written warning", "disciplinary process", "mediate between two employees", "grievance procedure", "union organising", "works council consultation", "bargaining prep", "HR risk register", "HR compliance audit", "payroll error", "payroll controls", "accommodation request", "visa expiry tracker", "redundancy process", "RIF selection", "layoff consultation". For capability PIPs use hr-performance; for multi-country baselines and country addenda use hr-global; for restructuring design (org rationale, structure) use hr-org-change.
allowed-tools: Read, Write, Glob, Grep
---

# Employee Relations & Compliance

> Procedure is the protection. A fair process, applied the same way every time and written down as it happens, is what holds up — for the employee and for the organisation.

## When this skill activates

**Implicit:** a complaint, grievance or allegation arrives; a manager wants to issue a warning; two colleagues are in open conflict; a policy is missing, stale or applied inconsistently; organising activity or a works-council request appears; an audit or inspection is coming; a pay run went wrong; an employee asks for an adjustment; a work permit is close to expiry; roles are being eliminated or someone is leaving for a non-disciplinary reason.
**Explicit:** "Read the `hr-employee-relations` skill file and [task]."
**Routed from:** `/hr:comply policy|investigate|discipline|risk|audit|labor|payroll|accommodate|immigration|exit`.

## Scope

Covers: the ten actions below, plus grievance-procedure design; `exit` owns the separation process (redundancy / RIF / non-disciplinary termination) once [[hr-org-change]] has set the org rationale and design.

Does NOT cover:
- Capability / performance PIPs, reviews, calibration → [[hr-performance]].
- Multi-country baseline, entity/EOR choice, country addenda (incl. Vietnam) → [[hr-global]].
- Org design, the business case for restructuring, change plans → [[hr-org-change]] (the separation process itself is `exit` here).
- Exit interviews, offboarding logistics → [[hr-people-ops]].
- Pay structures, pay equity method, benefits design → [[hr-rewards]].
- Wellbeing, EAP programme design, engagement surveys → [[hr-culture]].
- HR data platforms, monitoring tools, AI governance → [[hr-technology]]; accessible hiring → [[hr-recruiting]].

## Triage — which route?

| Situation | Route |
|---|---|
| Harassment, discrimination, retaliation, safety, fraud, whistleblowing, senior-leader allegation | `investigate` — never mediation first |
| Interpersonal friction, no misconduct alleged | Conflict resolution (under `discipline`) |
| Breach of a known rule, facts established | `discipline` |
| Can't meet standard despite trying | Capability → [[hr-performance]] |
| Request linked to health, disability, pregnancy | `accommodate` (and statutory leave check) |
| Collective issue or representative body involved | `labor` |
| Role eliminated, redundancy / RIF, non-disciplinary termination | `exit` |

Before any sanction, check for **protected activity** in the recent past (complaint, leave, accommodation request, union or representative activity, whistleblowing). If present → retaliation risk → counsel before acting.

## policy — lifecycle

1. **Need test.** A policy is right when a consistent standard must apply at scale or the law requires a written rule. Not for one incident, judgement calls, or a rule nobody will enforce.
2. **Draft** — answer five questions explicitly: who it applies to · the rule (a standard, not an aspiration) · exceptions and who approves them · consequences of breach (proportionate, consistent with other policies) · owner (a role). Plain language, second person; define legally loaded terms ("immediate family"); policy says *what*, a separate procedure says *how*. Multi-country: global baseline + per-country addendum (hr-rules § 1) → [[hr-global]].
3. **Review** — legal for anything touching dismissal, discrimination, data, pay, leave; employee representatives where consultation is required `[VERIFY: national works-council / consultation law]`; data protection for any monitoring rule.
4. **Approve** — tiered authority: enterprise-wide (CHRO + legal) · regional/entity (HRBP + local legal) · team procedures (manager, no policy status). Approvers from `plans/hr-context.md`.
5. **Communicate** — proportionate to the change; plain change summary (what is different, what it means for you); manager talking points; FAQ; notice before enforcement where operationally significant.
6. **Acknowledge** — tracked per version; reminders; escalate non-acknowledgment through managers.
7. **Review cycle** — annual for high-change areas (pay, leave, data, anti-discrimination), longer for stable operational policies, event-triggered on new law, a ruling, or an incident that exposed a gap.
8. **Retire** — archive with date and reason; remove stale copies from the intranet; version every policy individually.

Pitfalls: aspirational language that reads as a promise; a template copied but not practised; policy and practice drifting apart silently. Handbook = the employee-facing subset (employment basics, conduct, anti-harassment, leave, confidentiality, how to raise concerns); procedures and plan documents stay out. Template in [references/templates.md](references/templates.md).

## investigate — workplace investigation

1. **Intake.** Record the concern in the complainant's words; what, when, where, who was present, documents/witnesses. Screen: safety, harassment/discrimination, retaliation, senior-leader involvement, possible crime, regulator-reportable or whistleblower-protected matter `[VERIFY: applicable whistleblower law]`. Explain confidentiality limits — confidential, not secret.
2. **Choose the investigator.** Independent of the reporting line, no prior involvement; external when a senior leader is involved, conflicts exist, or legal risk is high. Decide with counsel whether the work is counsel-directed.
3. **Interim measures.** Non-punitive and not disadvantaging the complainant: separate reporting lines, schedules or locations; paid leave for the respondent where policy allows; access restrictions. Written reminder to all parties that retaliation is prohibited. Preserve evidence (hold on mail, chat, logs) with counsel.
4. **Plan.** Number each allegation as a discrete issue; map to the policy provision; evidence needed; witness list; interview order (complainant → witnesses → respondent → follow-ups); internal target timeline; statutory deadlines `[VERIFY]`.
5. **Interviews.** Interviewer + note-taker; open questions before specific ones; one topic at a time; no leading. Respondent hears each allegation with enough detail to answer. Companion/representative rights per jurisdiction `[VERIFY: e.g. UK statutory right to be accompanied]`. Notes read back or signed.
6. **Evidence.** Documents, messages, calendars, access logs, recordings — relevant items only, chain of custody noted, data-protection rules applied.
7. **Findings.** Standard of proof set by policy and jurisdiction — commonly balance of probabilities `[VERIFY]`. Per allegation: substantiated / not substantiated / inconclusive. Credibility weighed on consistency, corroboration, plausibility, motive; demeanour carries least weight. Keep apart: findings of fact → policy conclusion → recommended action. The investigator recommends; a separate decision-maker decides.
8. **Report** — template in [references/investigation-report.md](references/investigation-report.md), filled in the case system, never in `plans/`. Pseudonyms only (`Complainant A`, `Respondent B`, `Witness 1`); the key lives in the case system (hr-rules § 3).
9. **Close.** Tell both parties the outcome to the extent privacy allows; appeal route; scheduled retaliation check-ins; look for patterns by team or manager.

*Investigation findings and any resulting sanction: review with qualified employment counsel (or the relevant authority) before acting.*

## discipline — conduct, conflict, grievance

**Progressive discipline** (conduct, not capability):

| Stage | Typical content | Every stage needs |
|---|---|---|
| Informal word | Documented conversation, expectation restated | Facts established first (proportionate investigation) |
| First written warning | Issue, standard breached, expected change, review/expiry period | Written notice of the meeting with the allegation and evidence |
| Final written warning | As above + consequence of further breach | Chance to respond; companion where the law gives one `[VERIFY]` |
| Dismissal / other sanction | Decision, reasons, effective date, appeal | Written decision with reasons; appeal to someone not previously involved |

Gross misconduct may skip stages only where the policy says so and local law allows `[VERIFY]`. Expiry periods follow the policy. **Consistency check** before every warning: how were comparable cases handled (comparator review), is the sanction proportionate, is there protected activity. Post-sanction check-in to catch retaliation or constructive-dismissal risk. At-will regimes (US example) still require consistency. Warning template in [references/templates.md](references/templates.md).

**Conflict resolution / mediation** — only after screening out misconduct and power-imbalance cases.
1. Separate intake with each party: specific incidents · impact on work · what each needs from the other · past agreements and where they broke · what would make the next few weeks workable · any conduct concern to assess outside mediation.
2. Joint session (~60 min): purpose and ground rules → each describes work impact (specific, behavioural) → shared goals and recurring breakdowns → working norms with owners → follow-up and escalation path.
3. Reframe accusations → concerns, positions → interests, blame → process. Check for structural causes (role overlap, unclear decision rights) → [[hr-org-change]].
4. Neutral written working agreement; check-ins at agreed dates; re-open or escalate if it fails.

**Grievance procedure:** informal resolution with the manager → formal written grievance → meeting → written outcome with reasons → appeal. Internal target times; statutory steps `[VERIFY]`. Measure resolution quality and repeat issues, not just case volume — low volume can mean suppression.

*Final warnings, dismissals and sanctions: review with qualified employment counsel (or the relevant authority) before acting.*

## risk — HR risk register

1. **Categories:** compliance · operational · people / employee relations · reputational · strategic. Log a cross-category risk once, under its primary category, with a cross-reference.
2. **Score** likelihood (12 months, given current controls) and impact (legal, cost, retention, reputation) on 1–5 each; score = L × I. Default thresholds — calibrate to the organisation: high (active plan, executive visibility) / medium / low (longer review cycle). If most risks score high, the scale isn't discriminating.
3. **Fields:** description (specific: "overtime tracking at Site B inconsistent", not "wage risk") · category · L · I · score · current controls · owner (a person's role) · mitigation + target date · status (open / in progress / mitigated / accepted) · last reviewed.
4. **Identify** twice a year and after major events (restructure, acquisition, executive exit, rapid growth, new country): open cases, exit themes, survey trends, audit findings, regulatory change, near-misses, AI/tool deployments, third-party workforce. Involve legal, finance, BU heads, IT/security.
5. **Escalation:** any credible discrimination/harassment/retaliation allegation, regulatory inquiry, senior-leader allegation, pay error beyond an internal threshold, HR data breach, or a risk moving up a band → defined notification path and time.
6. **Review** quarterly; annual top-risk summary for leadership/board with trend direction.

Template in [references/templates.md](references/templates.md).

## audit — HR compliance audit

1. **Written scope:** objective, areas, entities/countries, period, sample, owner, timeline. Areas: personnel-file completeness · right-to-work records · worker classification (employee vs contractor — test in [[hr-global]]; US example: exempt vs non-exempt) `[VERIFY]` — *review with qualified employment counsel (or the relevant authority) before acting.* · working time and pay rules · leave administration · policy currency and acknowledgment · mandatory training · data retention · safety records · pay-equity screen with [[hr-rewards]].
2. **Privilege:** where findings may reveal violations, ask counsel whether to run the audit under counsel's direction.
3. **Sample:** stratified random by entity/location/department; size with statistical advice; full review for small or high-risk populations.
4. **Method:** document review + data analysis + process walkthrough (how it is really done vs documented).
5. **Rate findings** by legal exposure × frequency × severity; report highest risk first, not in discovery order.
6. **Corrective action plan:** owner, deadline, evidence of closure per finding; follow-up verification that the gap closed, not just that it was documented. Recurring audit calendar; self-assessment ahead of external inspections.

## labor — unions and works councils

1. **Map representation** per country and site: unions, works councils, employee representatives, collective agreements, information/consultation forums (from `plans/hr-context.md`; gaps → ask).
2. **Trigger matrix:** which decisions trigger information, consultation or co-determination rights — restructuring, transfers, working time, monitoring technology, pay systems, policy changes `[VERIFY: per-country law and agreement]`. Inform before deciding where required; document every consultation step.
3. **Bargaining preparation:** interests behind positions, costed proposals, mandate and walk-away point agreed internally, information-request handling with counsel, interest-based vs positional approach chosen deliberately.
4. **Organising activity** (US example): counsel first; supervisors must not threaten, interrogate, promise benefits or surveil (often taught as "TIPS") `[VERIFY: NLRA, NLRB guidance]`; only improvements decided before the activity began; diagnose drivers (pay, scheduling, supervision, safety, voice) without asking anyone about union activity. Discussing pay and conditions among colleagues can be protected even without a union `[VERIFY]`.
5. **Stabilise** after any bargaining outcome, election or dispute: climate pulse, grievance trend, consistency of supervisor conduct at 30/60/90 days.

*Organising responses, bargaining positions and consultation steps: review with qualified employment counsel (or the relevant authority) before acting.*

## payroll — controls and compliance checks

| Control | What good looks like |
|---|---|
| Calendar | Per-country pay dates, input cut-offs, approval deadlines, statutory filing/remittance dates `[VERIFY]` |
| Change approval | Maker–checker: HR owns master data, payroll processes, a second person approves; finance reconciles |
| Pre-run | Variance review vs prior cycle by population, joiners/leavers, one-off payments, retro adjustments |
| Post-run | Gross-to-net check, payroll-to-ledger reconciliation, remittance vs filing |
| Statutory tables | Named owner per country; update trigger; every rate cited with effective date or `[VERIFY: authority]` — never from memory |
| Access & audit trail | Least-privilege access; every change logged with who/when/why |

**Discrepancy:** pay the correction promptly; explain individually and in writing; classify root cause (input data · configuration · approval/process gap · vendor); fix the cause, log it, check the same rule for everyone else it touches. **Migration / new country:** phased cut-over, parallel run for at least one cycle where risk is high, named sign-off per country before each run, 30/60/90 error-rate review. Salaries of identifiable employees never appear in `plans/` (hr-rules § 3) — aggregate or pseudonymise.

## accommodate — interactive process

Terms differ: "reasonable accommodation" + interactive process (US example, ADA), "reasonable adjustments" (UK, Equality Act 2010); other jurisdictions `[VERIFY]`.
1. **Recognise** a request even when it isn't labelled as one; any channel counts.
2. **Acknowledge** within an internal service level; explain process and timeline.
3. **Dialogue** (good faith): which tasks are affected · what the employee thinks would help · what was tried before · whether the manager is involved (employee's consent) · urgency. Never ask diagnosis, medication, history or treatment.
4. **Documentation** only to the extent needed to confirm the functional limitation and the need — from a provider, through HR or occupational health, never via the manager.
5. **Options:** effectiveness first; consider schedule, equipment, workspace, remote work, reallocating non-essential tasks, leave. Refusal only on the legal test (e.g. undue hardship / disproportionate burden) `[VERIFY]`; offer alternatives.
6. **Decide in writing** with reasons; implement with IT/facilities/manager; review effectiveness after an agreed period. Coordinate with statutory leave rules.
7. **Consistency log** lives in the HR / occupational-health file (request type, functional category, outcome, rationale — no diagnosis), reviewed quarterly. `plans/` holds the process plus a periodic count by functional category, suppressed below the minimum group size in `plans/hr-context.md` § 7.

Health data is special category: it never enters `plans/` (hr-rules § 3). *Any denial or partial grant: review with qualified employment counsel (or the relevant authority) before acting.*

## immigration — work-permit and visa case tracking

1. **Tracker** lives in the HRIS or counsel's portal; `plans/` holds the process and a pseudonymised view. Fields: pseudonym · country · permit type · sponsoring entity · expiry · renewal lead time (from counsel) · owner · status · next action.
2. **Alerts** staged at counsel-advised lead times per permit type; monthly review with counsel.
3. **Right-to-work checks** at hire and re-checks (US example: Form I-9 / E-Verify `[VERIFY: USCIS]`; UK example: right-to-work checks `[VERIFY: Home Office]`); others via [[hr-global]].
4. **Status-affecting events** — role, pay, location or hours change, entity transfer (incl. M&A), termination → counsel before acting.
5. **Sponsorship policy:** when the company sponsors, prioritisation criteria, costs and any repayment terms `[VERIFY]`, relocation support consistent by level.
6. **Manager guidance:** realistic timelines, no promises; selection asks only about right to work, never nationality (hr-rules § 5).

*Visa and work-authorisation decisions: review with qualified immigration counsel (or the relevant authority) before acting.*

## exit — redundancy / RIF / non-disciplinary termination

Starts once [[hr-org-change]] has set the org rationale and target design; this is the separation process.

| Step | What |
|---|---|
| Rationale | Business reason in writing + alternatives considered (attrition, hiring freeze, redeployment, reduced hours, voluntary schemes) and why each was rejected |
| Pool + criteria | Selection pool (roles affected) and objective, job-related criteria with weights written **before** any names are scored (hr-rules § 5) |
| Adverse impact | Aggregate check on the pool — selected vs retained by group, protected activity screen; above the minimum group size only |
| Consultation | Individual and, above collective thresholds, collective consultation — thresholds, timing, authority notification vary `[VERIFY: <country> law]` (EU example: Directive 98/59/EC on collective redundancies) → `labor` for representative bodies |
| Terms | Notice, severance, accrued leave, benefits continuation, release/settlement agreement `[VERIFY: <country> law]`; visa holders → `immigration` |
| Communication | Managers briefed + scripted first → individual meetings (same day, private, HR present) → team announcement → support: EAP, outplacement, references, redeployment window |

Logistics after notice → [[hr-people-ops]] `offboard`. Names, scores and individual terms live in the HRIS / case system; `plans/` holds roles and counts only (hr-rules § 3).

*Selection, consultation and termination terms: review with qualified employment counsel (or the relevant authority) before acting.*

## Guardrails

- **Jurisdiction (hr-rules § 1).** Every output names its country; baseline + addendum for multi-country.
- **No statutory figures from memory (§ 2).** Notice, leave, thresholds, rates, deadlines → cite with effective date or `[VERIFY: <law>]`. Investigation findings, sanctions, accommodation denials, consultation steps, redundancy selections and visa decisions end with the counsel-review line.
- **Employee data (§ 3).** Pseudonyms in every committed file; investigation details, health data and identifiable salaries stay in the case system/HRIS.
- **No invented benchmarks (§ 4).** Case-volume norms, error-rate targets, investigation durations → cited or `[NEEDS DATA]`.
- **Fair (§ 5)** — comparator check on sanctions; criteria written before decisions. **Human decides (§ 6)** — AI may summarise evidence and draft letters; it never decides findings or sanctions.

## Output

- `policy` → `plans/hr/<slug>/policy.md` (+ `policy-rollout.md`) · `investigate` → `plans/hr/<slug>/investigation-process.md` (roles, steps, timeline — no facts or findings; the filled plan, notes and report live in the case system)
- `discipline` → `plans/hr/<slug>/discipline-record.md` or `mediation-agreement.md` · `risk` → `plans/hr/<slug>/risk-register.md`
- `audit` → `plans/hr/<slug>/audit-report.md` (findings + corrective action plan) · `labor` → `plans/hr/<slug>/labor-relations-plan.md`
- `payroll` → `plans/hr/<slug>/payroll-controls.md` · `accommodate` → `plans/hr/<slug>/accommodation-process.md` (process + suppressed category counts)
- `immigration` → `plans/hr/<slug>/immigration-tracker.md` · `exit` → `plans/hr/<slug>/separation-plan.md` (roles and counts only)

## Before proceeding

1. Which country, entity and (where relevant) site? Any collective agreement or representative body?
2. Is anyone at risk now (safety, retaliation, evidence loss)?
3. Who decides, and who must stay independent of the decision?
4. What exists already — policy text, case notes, prior warnings, audit findings, tracker?
5. Has counsel been engaged, and should the work be counsel-directed?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-performance]] — capability PIPs · [[hr-org-change]] — restructuring rationale and design · [[hr-global]] — country addenda
- [[hr-rewards]] — pay equity · [[hr-people-ops]] — offboarding · [[hr-technology]] — HR data and monitoring tools · [[hr-context]]
- `.claude/workflows/hr-rules.md` — §§ 1–6, 9

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-employee-relations`, `hr-compliance`, `hr-policy-management`, `hr-conflict-resolution`, `hr-labor-relations`, `hr-risk-management`, `hr-audit`, `hr-payroll`, `hr-accessibility-accommodation`, `hr-immigration` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; overlapping investigation, discipline and compliance material merged; unsourced figures removed (election and win-rate statistics, arbitration costs, investigation durations, payroll error and on-time targets, audit sample percentages, filing windows); US-specific items (I-9, E-Verify, ADA, NLRA) kept only as jurisdiction examples with `[VERIFY]`; pseudonym, health-data and counsel-review guardrails added; routing via `/hr:comply`.
