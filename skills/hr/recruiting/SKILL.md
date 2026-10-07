---
name: hr-recruiting
description: Recruiting method end to end — hiring intake and demand validation, req prioritisation, light job analysis, inclusive job descriptions and job ads, search strategy, market and talent mapping, Boolean/X-ray sourcing, passive-candidate outreach, talent CRM, social and community recruiting, structured interviews and scorecards, panel debriefs, work samples and assessment centres, reference checks, offer construction, negotiation and counteroffers, candidate experience, EVP and recruitment marketing, recruiting ops (requisitions, ATS, SLAs, capacity, operating model, metrics), executive, confidential and retained search. Use for "open a req", "intake with the hiring manager", "write a JD", "rewrite this job ad", "source candidates", "Boolean string", "outreach message", "nobody replies", "interview questions", "scorecard", "run the debrief", "work sample", "reference check", "build the offer", "candidate has a competing offer", "counteroffer", "candidate experience", "employer brand", "EVP", "recruiting SLAs", "time-to-fill", "executive search", "retained search". For role-family primers and technical interview loops use hr-tech-hiring; for pay bands use hr-rewards.
allowed-tools: Read, Write, Glob, Grep
---

# Recruiting

> Write down what good looks like before you meet anyone. Criteria drafted after the candidates are seen are rationalisations, not criteria.

## When this skill activates

**Implicit:** a role is opening or stuck; the hiring manager's brief is vague ("someone sharp"); panel feedback conflicts; an offer is at risk; candidates drop out or go silent; nobody can say where recruiting time goes.
**Explicit:** "Read the `hr-recruiting` skill file and [task]."
**Routed from:** `/hr:recruit intake|jd|source|interview|assess|offer|brand|ops|exec`. `/hr:recruit tech` goes to [[hr-tech-hiring]], not here — read the `hr-tech-hiring` skill file for role-family primers, screening cues and tech loops, then come back here for references and offer; hr-tech-hiring owns the tech-loop scorecard and debrief.

## Scope

Covers:
- Intake: validating the need, req prioritisation, light job analysis, the intake brief.
- JD and job ad; inclusive wording; must-have discipline.
- Sourcing: search strategy, market/talent maps, channels, outreach, talent CRM, social/community recruiting.
- Selection: structured interviews, assessments, references, debrief and decision record.
- Offer through acceptance-to-start hand-off.
- Employer brand, candidate experience, recruitment marketing.
- Recruiting ops: requisitions, ATS, SLAs, capacity, operating model, metrics; agency/RPO/contingent supply as channels.
- Executive, confidential and retained search.

Does NOT cover:
- Tech role primers, seniority signals, coding/system-design loops → [[hr-tech-hiring]].
- Pay bands, levelling, benchmarking, equity plan design, pay-equity analysis → [[hr-rewards]].
- Workforce plan, headcount forecast, people budget → [[hr-workforce-analytics]] (this skill consumes the approved plan).
- Pre-boarding and onboarding after acceptance → [[hr-people-ops]].
- Internal succession benches, 9-box, promotions → [[hr-performance]].
- Worker-classification audits, right-to-work/visa casework → [[hr-employee-relations]]; country hiring rules, EOR → [[hr-global]].
- Selecting or governing AI screening/ATS tools → [[hr-technology]]; DEI programme → [[hr-culture]].

## Fairness gate — applies to every action (hr-rules § 5)

1. **Criteria before candidates.** Must-haves, competencies and rubric anchors are written and signed by the hiring manager before the first CV is opened. Changing them mid-search = re-issue the brief and re-screen everyone already seen against the new version.
2. **Job-related or out.** Every criterion traces to a task or outcome from intake. "Culture fit" is not a criterion — name the behaviour ("gives direct written feedback") and test it for everyone.
3. **Banned topics** — never asked, scored, inferred or noted: age or graduation year, pregnancy or family plans, marital status, care duties, religion, ethnicity, national origin or nationality (ask right-to-work only, of everyone), disability or health (ask only whether essential functions can be performed with or without adjustment, where lawful), sexual orientation, gender identity, union membership, political views, financial status. Salary history and criminal record are restricted in some jurisdictions [VERIFY: local law, e.g. national transposition of EU Pay Transparency Directive 2023/970].
4. **Same process per stage.** Same core questions, same exercise, same time box; adjustments offered on request.
5. **Adverse-impact check before outcomes are final.** Pass rates by stage by group, where lawful to collect, aggregated only (hr-rules § 3). A stage with a materially lower pass rate for a group is investigated — the content, not just the pool — before decisions stand. In US practice a ratio below four-fifths is a US rule-of-thumb signal (29 CFR 1607.4(D)); passing it does not prove absence of adverse impact `[VERIFY: jurisdiction]`; other jurisdictions differ.
6. **Humans decide** (hr-rules § 6). AI may draft JDs, summarise notes, suggest search strings. AI that ranks or scores candidates is high-risk: purpose, data, human reviewer and bias test documented → [[hr-technology]].

## intake — validate the need, write the brief

| Ask the hiring manager | Why |
|---|---|
| What breaks if this hire doesn't happen this quarter? | Separates committed from aspirational demand |
| Growth or backfill? Budget approved or pending? | Different approval path and urgency |
| Which business driver sets the number (launch, volume, revenue)? | Stops flat-percentage padding |
| Could build, borrow or automate cover it? | Hiring is one lever of four — check the others first |

**Lever check:** *build* — develop internally (lead time exists, adjacent skills exist); *buy* — hire (urgent or genuinely new capability); *borrow* — contractor, agency, fractional (temporary or fluctuating need; classification test → [[hr-global]]); *bot* — automate a well-defined repeatable task.

**Reqs exceed recruiter capacity →** rank with a written score, not by who escalates loudest: revenue/customer impact, compliance or safety criticality, dependency (a manager whose team waits), days already open. Publish the committed and deferred lists with reasons.

**Light job analysis** (new role, redesign, or contested criteria): interview an incumbent and the manager separately — where they disagree is a finding. Per task: frequency, criticality, share of time; essential vs marginal (accommodation decisions rest on it). Per knowledge/skill: day-one vs learnable on the job. Learnable items never enter must-haves.

**Intake meeting:**
1. Why open; what the hire achieves at months 1, 3, 12.
2. Must-have calibration — for each: "Strong on everything else but missing this — still consider?" Yes → nice-to-have.
3. Disqualifiers and strong signals.
4. Pay range confirmed against band ([[hr-rewards]]); not competitive for the profile → decide now, not after a decline.
5. Process: stages, panel, the competency each interviewer owns, decision-maker, tie-break rule.
6. Sourcing: target companies, exclusions (non-solicit, client relationships), known names.
7. Logistics: hiring-manager interview slots for the next 4 weeks; feedback SLA.

Template: [references/jd-template.md](references/jd-template.md) § Intake brief.

## jd — job description and job ad

Two artefacts. The **position description** is internal and complete (grading, accommodation, performance). The **posting** is external, persuasive and scannable. Never post the first.

Posting order: role summary (specific, 2–3 sentences) → what you'll do (5–8 outcome bullets — "owns X", not "attends meetings") → what success looks like at 6–12 months → must-haves (short) / nice-to-haves → pay range and benefits (as law requires or policy allows) → team and working model → inclusion and adjustments statement.

| Rule | Check |
|---|---|
| Market title | The title candidates search for, not the internal grade |
| Must-have = day-one need | Could you onboard someone without it? Then it isn't one |
| Capability over proxy | "Has designed and run structured interviews" beats a years-of-experience count; drop degrees the work doesn't need |
| No stacked filters | Degree AND years AND named tool — each needs its own reason |
| Inclusive wording | No gendered pronouns, "rockstar/ninja", "digital native", "young team", bravado; plain language |
| Honest | Real reporting line, team size and hard parts; no promotion timeline you can't commit to |
| Readable on a phone | Short paragraphs, bullets |

Pay-range disclosure is mandatory in some jurisdictions [VERIFY: jurisdiction from `plans/hr-context.md`]. Templates and wording list: [references/jd-template.md](references/jd-template.md).

## source — strategy before outreach

**Search plan,** agreed before any outreach: target profile as must / signal / disqualifier (never title alone — titles inflate with company size), target-company tiers, channel sequence, positioning, checkpoint date.

| Search type | Lead channels |
|---|---|
| High volume, moderate seniority | Careers site, job boards, programmatic ads, referrals |
| Scarce skill | Outbound against mapped companies, communities, referrals |
| Senior / executive | Confidential outbound, network referrals, retained search |
| Urgent | Agency in parallel with internal sourcing |

**Market map:** tier 1 direct (similar product and complexity), tier 2 adjacent (transferable skills), tier 3 feeder (larger organisations, reasons to move). Estimate **total** vs **addressable** pool (minus pay, location, visa, restrictive-covenant constraints) and state the method and its uncertainty. A small addressable pool changes the plan (wider geography, adjacent profile, build) before effort is spent. Exclusions live in the map.

**Search strings:** Boolean on platforms (AND / OR / NOT / "phrase" / parentheses — OR the title variants, AND the must-have skills); X-ray via a search engine (`site:` + terms). Check the first page of results for too broad / too narrow.

**Passive outreach:**
- One specific, verifiable detail about their work (a talk, repo, project) — not their title or employer.
- Value first, small ask: why it may matter to them, then a short call, not an application.
- 3–4 touches over a few weeks, each with a new angle. A clear no ends it; log the opt-out permanently.
- "Happy where I am" → thank them, say you won't chase this role, ask whether you may check back later.
- Re-engagement names the earlier contact honestly and gives a real reason (new role, milestone).

**Low response:** split the funnel (sent → accepted → replied → positive) and fix the failing stage only — targeting, recruiter-profile credibility, message, or cadence.

**Community and social:** follow each community's rules, participate before posting, use designated job channels, no mass DMs, no scraping or automation that breaks platform terms. Never collect ID numbers or bank details over chat.

**Talent CRM:** segment by role family × stage (identified, contacted, engaged, nurture, silver medalist) × last activity. Silver medalists are contacted first when a similar role opens. Nurture is infrequent and relevant to the segment. Hygiene: disposition every touch, date-stamp, archive stale records, honour opt-outs; consent and retention per data-protection law [VERIFY: e.g. GDPR Arts. 5, 13; Vietnam Decree 13/2023/ND-CP or successor law]. Measure pipeline contribution and silver-medalist conversion, not database size.

**Checkpoint:** no viable slate by the agreed date → revisit the brief (criteria or pay), not just the effort.

## interview — structured, evidence first

1. 4–6 job-related competencies from intake, each with a one-line definition and strong/weak anchors.
2. Panel plan: one primary competency per interviewer, plus one common opening question so everyone has a comparable data point. No competency tested twice, none left untested.
3. Per competency: one behavioural question (STAR — situation, task, action, result), one situational question, 2–3 prepared probes ("What was your part?", "What data did you use?", "What would you change?").
4. Scorecard: evidence written **before** the rating; anchored 1–4 scale; completed straight after the interview, before any talk with other panellists.
5. HR screens scorecards before the debrief. A rating with no evidence, a vague "not a fit", comments outside the assigned competency or on a banned topic → sent back for specifics or struck.
6. Debrief by competency, not by interviewer: the owner gives rating + evidence; others add only what they directly observed. Split ratings go back to evidence; unresolved splits are recorded, not averaged away. Decision and the evidence behind it are written down.

Score the whole exchange, probes included. Polish is not evidence; more rounds are not more signal. Full kit: [references/interview-kit.md](references/interview-kit.md).

## assess — work samples, screens, references

| Method | Use when | Watch |
|---|---|---|
| Work sample / simulation | A core task can be reproduced | Task taken from job analysis; time box matches the real task; same context an employee would have |
| Skills test | A specific, checkable skill | Applied skill, not look-up trivia |
| Structured case | Judgment; candidate lacks direct experience | Needs a rubric and trained assessors, or it is unstructured |
| Assessment centre | Senior or high-stakes, multi-dimension roles | Cost and candidate time — only when the stakes justify it |
| CV screen | Minimum criteria only | Scored against the written must-haves; identifying fields hidden where feasible |

Stage it: screen (minimums, motivation, pay range, logistics) → technical/domain → competency interviews → final (only what is observable only there). Rubrics: 3–5 observable criteria, anchored levels, calibrated by raters scoring the same sample before live use. An assessor is not the candidate's advocate. Keep unpaid take-homes short — long ones penalise candidates with less free time. Vendor tools: no validity evidence for your roles and no adverse-impact data → don't use them. Periodically check whether scores predict post-hire outcomes.

**References** are due diligence after a directional decision and before signature — never the first filter.
- Candidate consent first; say who will be contacted. Off-list references for senior roles only, with the candidate's knowledge.
- A former manager, a peer, a direct report for leadership roles; at least three for professional roles, more for senior.
- Same core questions for every reference, tied to the role's competencies; ask for examples; ask the rehire question ("without hesitation, or with reservations?").
- Read hedges, qualified praise and silence on a topic; act on patterns across references, not one call.
- Document every check equally, whatever the outcome. What former employers may disclose, and whether background/criminal checks are allowed, is local [VERIFY: jurisdiction].

Call guide: [references/interview-kit.md](references/interview-kit.md) § Reference check.

## offer — construct, approve, close

- **Set the number** from the band ([[hr-rewards]]), internal equity with peers in the same role and level, and the approved budget. Above band → escalate before the offer, not after a decline.
- **Pre-approve** standard packages; escalate exceptions only; track an internal approval SLA — approval lag loses candidates who have deadlines.
- **Verbal first,** written promptly after. Walk every component; say gross or net explicitly.
- **Negotiate on the driver:** "A specific number, or comparing to another offer? What else matters?" Test the close ("If we reach X, are you ready to accept?") before seeking approval. One considered counter beats many small concessions. Same flexibility for everyone in the same role; log exceptions.
- **Competing offer** = information. Learn the deadline and what differs; never pressure a candidate to drop another process.
- **Retention counteroffer:** ask what's driving it. A pattern in one function signals a pay or career-path gap → [[hr-rewards]].
- **Expiry date** on every offer; follow up before it lapses.
- **Accept → start:** keep contact; watch renege signals (silence, start-date slips); hand to [[hr-people-ops]] for pre-boarding.
- **Declines:** ask why, record a reason code, review in aggregate.
- **Before final:** the offer checked against peers (pay-equity lens, hr-rules § 5); probation, notice and restrictive covenants checked locally [VERIFY: jurisdiction]. Non-standard covenants or withdrawing an offer: *review with qualified employment counsel (or the relevant authority) before acting.*

Checklist: [references/offer-checklist.md](references/offer-checklist.md).

## brand — EVP, candidate experience, recruitment marketing

**EVP:** differentiated (not true of every competitor) and credible (current employees recognise it). Build it from stay and exit interviews, engagement data and offer-decline reasons — at least two independent sources. Lead with 2–3 real differentiators. A promise the first 90 days of employment break is worse than none.

**Candidate journey:** map discovery → application → screen → interviews → decision → offer → pre-start as the candidate lives it, not as ATS stages. Per stage: owner, response SLA (from your baseline), message template, drop-off rate. Cheapest lever: response time, and telling candidates about a delay before they ask. Survey everyone who reaches interview, hired or not (short score + open text); segment by outcome and stage reached; act, and say what changed.

**Reputation incident** (public criticism, review spike): categorise themes (structural, communication, credibility) → acknowledge specifically → repair the experience gap → show the change in funnel and sentiment data → only then relaunch messaging. Public statements get leadership and legal sign-off.

**Recruitment marketing:** start from a hiring goal (role, volume, date) and a persona; choose channels where that persona is; write copy for the channel (specific hook, low-friction apply); measure cost per qualified applicant and source-of-hire, not reach or clicks. Keep always-on brand content separate from role campaigns. Employee advocacy is voluntary and unscripted.

## ops — requisitions, ATS, SLAs, capacity, metrics

- **Requisition paths by type:** budgeted backfill → light path; net-new headcount → full path. No search opens without a complete intake brief.
- **ATS:** stages = real decision points, one definition across teams; standard disposition reasons used every time; a scorecard on every evaluation stage; reports built before go-live; a named ATS owner; periodic data-quality audit.
- **SLAs with owners:** req approval, intake held, first slate, application response, interview feedback, hiring-manager decision, offer approval, verbal → written. Targets come from your own baseline [NEEDS DATA], then tighten. Hiring-manager obligations are stated at intake. Breaches visible weekly with a named action owner; a missed SLA is a process signal before it is a people problem.
- **Capacity:** open reqs per recruiter weighted by role complexity (senior/niche ≠ volume), plus non-recruiting load; thresholds from your own throughput [NEEDS DATA]. Over capacity → re-prioritise, add capacity, or reset SLAs openly.
- **Operating model:** generalist pod (small, moderate volume) · functional specialists (sustained volume per function) · central sourcing + distributed closing (heavy top-of-funnel volume) · embedded partners (hiring-manager depth matters). At scale, hybrid: centre owns process, tools and brand; aligned recruiters execute. Revisit when hiring volume or mix shifts.
- **Agencies, RPO, contingent:** written terms (fee, exclusivity, candidate ownership, replacement); same fairness and data rules as in-house; contingent workers via a separate path, classification test → [[hr-global]].
- **Metrics** (weekly ops, monthly strategy): time-to-fill (req open → accept) and time-to-hire (candidate in → accept) kept separate; stage conversion; source-of-hire; offer acceptance and decline reasons; quality of hire at a fixed post-hire interval; hiring-manager satisfaction; pipeline representation by stage (aggregate). Speed alone rewards lowering the bar. External benchmarks need a source and date (hr-rules § 4).
- **Audit:** walk a sample of closed reqs stage by stage against SLAs; ask recruiters and managers where they work around the process.

## exec — executive, confidential and retained search

1. **Position specification** signed by the board or committee before sourcing: mandate, 12–18-month success criteria, leadership competencies, derailers, who decides and how disagreement is settled.
2. **Confidentiality protocol:** who knows, code name, what may be disclosed to candidates at each stage, approach log; candidates briefed on confidentiality too.
3. **Retained terms** with an external firm, in writing: fee milestones, exclusivity, replacement guarantee, scope-change handling. Milestones: brief sign-off → early market-feedback update → comparative slate → close support.
4. **Slate:** 3–5 genuinely different candidates, side by side on the agreed criteria, risks stated; say so if the market was thin.
5. **Multi-method assessment:** structured behavioural interview (press for specifics — executives speak in principles), a case built on a real business challenge, several assessors in different settings, psychometrics only if validated and interpreted by a qualified assessor as one input among several. Separate what they drove from what they inherited.
6. **Derailment risk** — rigidity, low empathy downward, rejecting feedback, credit-taking, poor political judgement, ethical shortcuts under pressure — probed via behavioural examples and references, especially former direct reports.
7. **Internal vs external finalists** judged on the same criteria and evidence standard.
8. **Board prep:** each stakeholder briefed on what to probe; structured comparison; confidence and unresolved risks stated; capability findings kept separate from fit findings.
9. **Hand-off:** assessed gaps become the support plan → [[hr-people-ops]]; development → [[hr-performance]].

## Guardrails

- **Fairness gate** (hr-rules § 5) is not optional. Every criteria-setting output includes the adverse-impact step; every interview output includes the banned-topics list.
- **PII** (hr-rules § 3): `plans/hr/` holds roles and pseudonyms (Candidate A, Finalist 2). Names, contacts, CVs, reference notes and offer amounts for identifiable people stay in the ATS/HRIS. Special-category data is never written to committed files and never inferred; voluntary monitoring only outside the repo on a counsel-confirmed lawful basis, aggregate above the minimum group size.
- **Jurisdiction** (hr-rules § 1, § 2): contracts, probation, covenants, background checks, pay disclosure and data retention name the country; statutory items carry `[VERIFY: ...]`.
- **No invented benchmarks** (hr-rules § 4): time-to-fill, acceptance rates, agency fees, salary ranges → source + date, or `[NEEDS DATA]`.
- **Human in the loop** (hr-rules § 6) for every screen, rank or hire decision.
- Withdrawing an offer, rescinding after a check, or declining an adjustment request ends with: *review with qualified employment counsel (or the relevant authority) before acting.*
- Candidate data: stated purpose, consent, defined retention, opt-outs honoured across ATS, CRM and outreach tools.

## Output

- intake → `plans/hr/<slug>/intake-brief.md` — need validation, lever check, job-analysis notes, must/signal/disqualifier, panel plan, pay-range confirmation, SLAs.
- jd → `plans/hr/<slug>/jd.md` — posting + position description.
- source → `plans/hr/<slug>/search-plan.md` — tiers, addressable-pool estimate with method, channel sequence, outreach sequence, checkpoint; no named prospects.
- interview → `plans/hr/<slug>/interview-kit.md`.
- assess → `plans/hr/<slug>/assessment-plan.md`; debrief → `plans/hr/<slug>/selection-record.md` (evidence per pseudonymised candidate, adverse-impact result) — a **working draft** only: the final record moves to the ATS/HRIS and the draft is removed from `plans/` (hr-rules § 3).
- offer → `plans/hr/<slug>/offer-plan.md` — package structure, approval path, negotiation bounds, close plan; candidate amounts stay in the HRIS.
- brand → `plans/hr/<slug>/evp.md` (+ `candidate-journey.md`, `campaign.md` as asked).
- ops → `plans/hr/<slug>/recruiting-ops.md` — SLA charter, ATS stage map, capacity model, dashboard spec.
- exec → `plans/hr/<slug>/position-spec.md`, `confidentiality-protocol.md`, `slate-comparison.md` (slate: pseudonyms, working draft per hr-rules § 3).

`<slug>` names the req, search or topic and follows hr-rules § 9.

## Before proceeding

1. Which action, which role (function, level, location) and which slug?
2. Is the req approved and budgeted; growth or backfill; fill-by date?
3. Which jurisdiction(s) does the candidate pool sit in?
4. What exists already — prior JD, scorecards, ATS stages, pay band?
5. Who decides — hiring manager, panel, committee, board?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — jurisdictions, HRIS/ATS, policies this skill reads first
- [[hr-tech-hiring]] — tech role primers and loops (`/hr:recruit tech`)
- [[hr-rewards]] — bands, levelling, offer pay, pay equity
- [[hr-workforce-analytics]] — the headcount plan and recruiting dashboards' data
- [[hr-people-ops]] — pre-boarding and onboarding after acceptance
- [[hr-performance]] — internal succession, executive development after hire
- [[hr-employee-relations]] — right-to-work, background-check disputes
- [[hr-technology]] — AI screening governance, ATS selection
- [[hr-culture]] — DEI programme, engagement data behind the EVP
- [[hr-global]] — country hiring rules, EOR, worker-classification test
- `.claude/workflows/hr-rules.md` — § 1–6, § 9

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-candidate-assessment`, `hr-candidate-experience`, `hr-candidate-sourcing`, `hr-contingent-workforce`, `hr-demand-planning`, `hr-employer-branding`, `hr-executive-assessment`, `hr-executive-search`, `hr-interviewing`, `hr-job-analysis`, `hr-job-description`, `hr-market-mapping`, `hr-offer-management`, `hr-passive-candidate-engagement`, `hr-recruiting`, `hr-recruitment-marketing`, `hr-recruitment-operations`, `hr-reference-checking`, `hr-retained-search`, `hr-search-strategy`, `hr-social-recruiting`, `hr-talent-acquisition`, `hr-talent-crm`, `hr-talent-intelligence`, `hr-talent-mapping`, `hr-talent-supply-chain` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: 26 prompt libraries distilled into one method organised by `/hr:recruit` action; overlaps merged (three interview/scorecard sources, four sourcing sources, three exec-search sources, two ops sources); unsourced figures removed (offer-acceptance, time-to-fill and SLA targets, recruiter load thresholds, agency fees, channel-mix percentages, exec mis-hire cost, platform message limits, review-rating thresholds, sample budgets); vendor/tool name lists dropped; statutory items marked `[VERIFY]`; fairness gate, PII, consent and counsel-review guardrails added; workforce forecasting, succession, contractor classification and people analytics routed to sibling skills; routing via `/hr:recruit`.
