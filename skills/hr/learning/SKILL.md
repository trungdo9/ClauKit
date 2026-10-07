---
name: hr-learning
description: Learning and development method — training needs analysis (organisation / role / individual, is-it-a-training-problem diagnosis), program design (ADDIE, measurable objectives, modality mix, practice and job aids, learning-request governance), leadership and first-time-manager development (capability maps, cohort journeys, applied projects), skills taxonomy and inventory (domain-cluster-skill hierarchy, proficiency scales, multi-source inventory, impact-weighted gap analysis, taxonomy governance), capability building and reskilling at scale, and evaluation (Kirkpatrick four levels, optional ROI with isolation, learning-transfer checkpoints). Use for "training needs analysis", "design a training program", "first-time manager program", "leadership development", "build a skills taxonomy", "skills gap analysis", "reskill this team", "is the training working", "Kirkpatrick", "learning ROI". For career paths, succession, 360 and coaching programs use hr-performance; for onboarding use hr-people-ops; for headcount build-buy-borrow plans use hr-workforce-analytics.
allowed-tools: Read, Write, Glob, Grep
---

# Learning

> Training is the answer to a skill gap and to nothing else. Diagnose first; design for transfer to the job, not for completion of the course.

## When this skill activates

**Implicit:** a leader asks for "some training", capability gaps after growth or reorganisation, managers promoted without preparation, a new strategy needing skills the workforce lacks, an L&D budget under challenge, a program with high completion and no visible change.
**Explicit:** "Read the `hr-learning` skill file and [task]."
**Routed from:** `/hr:learn needs` · `/hr:learn program` · `/hr:learn leadership` · `/hr:learn skills` · `/hr:learn evaluate`.

## Scope

Covers:
- Needs analysis and performance-problem diagnosis.
- Program and curriculum design, modality choice, transfer design, request governance.
- Leadership and manager development programs.
- Skills taxonomy, proficiency scales, skills inventory, gap analysis, capability building, reskilling.
- Evaluation: reaction → learning → behaviour → results, ROI, transfer tracking.

Does NOT cover:
- Career paths, succession, 360 instruments, coaching/mentoring schemes, manager effectiveness reviews → [[hr-performance]].
- Onboarding programs → [[hr-people-ops]]. Internal mobility and talent marketplaces → [[hr-culture]].
- Headcount plans and build/buy/borrow costing at workforce level → [[hr-workforce-analytics]].
- Skills-based hiring and assessments → [[hr-recruiting]]. Reorganisation-driven role changes → [[hr-org-change]].
- LMS/LXP selection, AI-in-HR governance → [[hr-technology]]. Level spine / job architecture → [[hr-rewards]].

## Needs — training needs analysis

### 1. Is it a training problem?
Start from the performance gap ("what should people do that they do not do?"), then classify the cause:

| Cause | Signal | Intervention |
|---|---|---|
| Skill / knowledge | Cannot do it even when it matters and time exists | **Training**, practice, coaching |
| Clarity | Does not know it is their job, or what "good" is | Expectations, role definition, standards |
| Authority / backing | Knows how, not empowered to act | Decision rights, leader backing |
| Tools / process | Workflow, system or data blocks the behaviour | Process or tool fix |
| Capacity / structure | No time (e.g. team lead still carries full individual workload) | Workload and role redesign first |
| Motivation / incentives | Rewarded for the opposite behaviour | Goals, recognition, consequences |

Only the first row is solved by learning. Report the others to the sponsor as non-training actions; training layered on a structural cause will not transfer.

### 2. Three levels of analysis
| Level | Question | Inputs |
|---|---|---|
| Organisation | Which capabilities does the strategy need that we lack at scale? | Strategy/OKRs, leader interviews, risk register |
| Role / task | What must each role do, to what standard? | Job architecture, task analysis, SME input, standards |
| Individual | Who has the gap, how large? | Performance data (aggregate), manager observation, assessments, self-assessment |

Leader interview core: which outcomes are at risk and is capability a factor · what must the team do in 12 months it cannot do today · where current L&D helps and does not.

### 3. Prioritise
Score each gap on business impact × gap size × population × urgency; tag foundational (broad baseline, deliver efficiently) vs. critical (differentiating, invest deeply). Output: ranked need list with non-training actions separated.

## Program — design

**ADDIE with gates:** Analyse (TNA above, audience, constraints) → Design (objectives, assessment, modality, transfer plan, measurement plan **before** content) → Develop (content, scenarios, job aids, pilot) → Implement (manager briefing first, cohort launch) → Evaluate (levels below; feed back into Analyse).

**Objectives:** audience + observable behaviour + condition + standard. Use action verbs from Bloom's revised taxonomy at the level the job needs (apply / analyse / evaluate, rarely just "understand"). Each objective has a matching assessment and a job-level behaviour indicator.

**Model 2–3 options before committing** (e.g. single cohort vs. parallel tracks vs. sequenced; build vs. buy vs. curate) — compare reach, time-to-capability, cost, manager load, risk.

**Modality fit:**

| Modality | Best for | Weak for |
|---|---|---|
| Self-paced digital / microlearning | Knowledge, compliance, right/wrong procedures | Judgement, behaviour change |
| Instructor-led (live/virtual) | Complex skills needing practice and feedback | Scale, cost |
| Blended | Pre-work for knowledge, live time for practice | Programs with no live budget |
| Cohort-based | Leadership, complex capability, peer learning | Urgent individual needs |
| On-the-job (stretch, rotation, project) | Converting knowledge into applied skill | Without debrief and a sponsor |
| Coaching / mentoring / communities of practice | Contextual acceleration, spreading expertise | Foundational knowledge |

Design balance heuristic: most development happens through experience, then through others, least through formal courses — budget all three deliberately, do not fund only the course.

**Transfer design (before / during / after):** manager pre-brief on expected behaviour → realistic scenarios from real work, job aids, practice with feedback → manager follow-up, application assignment, 30/60/90 check-ins. Manager reinforcement is designed in at the start, not added after launch.

**Request governance:** tier requests (enterprise pillar / function program / self-directed catalogue) with an owner per tier. Filter each new request: linked to a strategic gap? population large enough for custom build? measurable outcome? existing solution available? Failing most filters → catalogue, not custom build.

Jurisdiction notes: whether mandatory training counts as working time, training-cost repayment clauses and statutory/mandatory training duties vary — `[VERIFY: <jurisdiction> working-time / training law]`; contract clauses → [[hr-employee-relations]].

## Leadership — leadership and manager development

| Level | Typical population | Development focus |
|---|---|---|
| Emerging / first-time | New team leads | Priorities, feedback, delegation, 1:1s, coaching basics, early conflict |
| Mid-level | Department / functional managers | Cross-functional work, stakeholder management, building managers, operational leadership |
| Senior | Directors, executives | Strategy, organisational change, executive communication, long-horizon decisions |

**Method:**
1. **Diagnose per person/cohort**: skill gap vs. clarity vs. structural (see Needs). Spot the strongest participants early — use them as peer coaches.
2. **Capability map** — capability → observable behaviour → practice activity (e.g. "gives feedback" → "timely, specific, behaviour-based" → role play on real scenarios). Competency headings without behaviours are not a map.
3. **Program structure:** assessment input (from [[hr-performance]] 360/talent review) → individual development plan → modules → coaching → peer cohort → applied business project → follow-up evaluation.
4. **Journey cadence** (first-time manager pattern): expectations briefing with executives → workshop on priorities and 1:1 structure → feedback/coaching lab → peer circle on live challenges → performance and conflict practice → team pulse on manager behaviour → reflection and leader review. Tools ship with it (1:1 agenda, feedback script).
5. **Measure behaviour**, not attendance: 1:1 consistency, feedback quality, priority clarity, coaching habit, follow-through — rated by the team, not only self-report.

Rules: potential ≠ current performance (promote on readiness criteria, not technical excellence); keep career-visibility problems separate from manager-capability problems — different fixes, different timelines; tell participants it is development before any "capability program" is announced, or it lands as a performance concern; cross-cultural and remote leadership modules when teams are distributed.

## Skills — taxonomy, inventory, gap

**Terms:** *skill* = discrete, assessable, transferable ability · *competency* = broad, role-centric behaviour pattern (for performance evaluation) · *capability* = organisational combination of skills, process, tools. Do not merge a competency framework into a taxonomy unexamined.

**Build sequence:**
1. **Scope** to priority roles tied to the strategy, not the whole organisation.
2. **Audit existing data:** job descriptions, review narratives (aggregate), learning records, project history. Reference public taxonomies (O*NET, ESCO) for definitions instead of writing from scratch.
3. **Choose structure:** flat list (fast, unusable at scale) · **domain → cluster → skill** (default start) · ontology with prerequisite/adjacency links (needs platform support; phase two).
4. **Granularity test:** specific enough to match to roles and learning content; stable enough not to need rewriting each quarter. Keep the list small for priority roles first; prune.
5. **Proficiency scale** (e.g. four levels) with observable descriptors per skill — never years of experience.
6. **Inventory by triangulation:** role baseline from job descriptions → validate with SMEs → tag learning content to clusters → manager nominations → targeted self-assessment for proficiency **after** the taxonomy is validated, with calibration examples and manager validation.
7. **Gap analysis:** per critical skill, supply vs. demand at each proficiency level (headcount-equivalent). Prioritise:

| | Gap large | Gap moderate |
|---|---|---|
| **High business impact** | Build and acquire now | Build with acceleration |
| **Moderate impact** | Acquire or partner | Build at normal pace |
| **Low impact** | Monitor, defer | Monitor |

8. **Integrate** into at least the decisions it was built for (learning paths, mobility, hiring, succession) — a taxonomy used only for reporting is shelfware.
9. **Govern:** named owner, add/retire rules, contribution route for managers, periodic external-demand scan and internal review, re-tagging of learning content.

**Capability building and reskilling at scale:** foundational vs. critical capabilities; heat map (required vs. current, gap, priority); academy tracks (foundational / practitioner / expert) with a practice layer and certification. For reskilling: explain why roles are changing before designing; psychological safety to admit gaps; voluntary pathways first; connect completion to real role-transition outcomes. Role eliminations route to [[hr-org-change]] / [[hr-employee-relations]].

Skills data is personal data: tell employees what is collected and why, let them view and correct their profile; AI inference of skills used for staffing or pay decisions follows hr-rules § 6.

## Evaluate — evaluation and transfer

**Measurement plan before launch**, with baseline, owner and timing.

| Kirkpatrick level | Question | Evidence | Apply to |
|---|---|---|---|
| 1 Reaction | Was it relevant and usable? | Post-session survey (relevance, intent to apply) | All programs |
| 2 Learning | Did they acquire the skill? | Pre/post assessment, skill demonstration | Skill-targeted programs |
| 3 Behaviour | Do they do it on the job? | Manager/team observation at 30/60/90 days, work samples, process data | Strategic programs |
| 4 Results | Did the business metric move? | Metric agreed with sponsor at design time (quality, cycle time, retention of cohort's teams) | Strategic, high-cost programs |

**ROI (optional, high-cost programs):** ROI = (monetised benefits − fully loaded costs) / costs. Isolate the program's effect (comparison group, trend-line, or participant/manager estimates discounted by stated confidence) and state the method — an un-isolated ROI does not ship. All inputs from the organisation's data or `[NEEDS DATA]`; never quote "industry" transfer or ROI rates (hr-rules § 4).

**Transfer tracking:** completion ≠ transfer. At each checkpoint ask: applying, or reverting under workload? Reversion signals → targeted coaching, workload fix, or manager follow-up — not more content. Leading indicators: manager observation of new behaviour, active development plans, application assignments done. Lagging: capability-linked performance issues, regretted exits citing development.

## Guardrails

- **Diagnose before designing** — no program for a clarity, structural or incentive problem.
- **No invented figures** — transfer rates, budget per head, time-to-proficiency, ROI: own data with date or `[NEEDS DATA]` (hr-rules § 4).
- **Assessment data stays aggregate** in `plans/hr/`; individual proficiency and leadership assessment results stay in the HRIS/LMS (hr-rules § 3).
- **Job-related, fair access** — selection into leadership/high-potential programs uses criteria written beforehand and gets an adverse-impact check (hr-rules § 5); content accessible and inclusive.
- **AI drafts** objectives, scenarios, tagging and narratives; SMEs validate, people decide who is selected or rated (hr-rules § 6).
- **Jurisdiction** for mandatory training, working-time and repayment clauses (hr-rules § 1, § 2).

## Output

- `needs` → `plans/hr/<slug>/tna.md` — gap statement, cause classification, three-level findings, ranked needs, non-training actions.
- `program` → `plans/hr/<slug>/program-design.md` — objectives, options compared, modality mix, journey, transfer plan, measurement plan.
- `leadership` → `plans/hr/<slug>/leadership-program.md` — population, capability map, journey, tools, behaviour measures.
- `skills` → `plans/hr/<slug>/skills-taxonomy.md` (structure, proficiency scale, governance) and `plans/hr/<slug>/skills-gap.md` (aggregate heat map, priorities, build plan).
- `evaluate` → `plans/hr/<slug>/evaluation-plan.md` before launch; `plans/hr/<slug>/evaluation-report.md` after.

Templates: [references/templates.md](references/templates.md).

## Before proceeding

1. What business outcome or performance gap triggered this, and who sponsors it?
2. Target population (roles, size, locations, work pattern) and the deadline?
3. What data exists — job architecture, skills data, performance trends, prior evaluation results?
4. Budget, manager time available, and delivery channels (LMS, live, vendors)?
5. How will the sponsor judge success — which metric, by when?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — org, jurisdictions, systems
- [[hr-performance]] — 360, succession, career paths, coaching and mentoring programs
- [[hr-workforce-analytics]] — workforce plan, skills supply/demand costing
- [[hr-people-ops]] — onboarding journeys
- [[hr-rewards]] — level spine the skills map onto
- [[hr-org-change]] — reskilling inside restructures
- [[hr-technology]] — learning platforms, AI governance
- `.claude/workflows/hr-rules.md`

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-leadership-development`, `hr-learning-development`, `hr-learning-strategy`, `hr-skills-management`, `hr-skills-taxonomy`, `hr-training-development`, `hr-workforce-capability` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; overlapping L&D, taxonomy and capability material merged into needs → program → leadership → skills → evaluate; unsourced figures removed (transfer-rate, time-to-effectiveness, budget-per-employee, skills half-life, mobility-uplift and taxonomy-size benchmarks, example program targets and costs, the experience/social/formal percentages); ROI isolation requirement, skills-data privacy, fair-selection and jurisdiction guardrails added; routing via `/hr:learn`.
