---
name: hr-tech-hiring
description: Recruiter method for hiring technical roles without being an engineer — intake with the hiring engineer, one-track role scoping, scope-based seniority signals, CV and phone screening cues, decoding technical answers, portfolio/GitHub/shipped-work review, structured tech interview loop and rubric calibration, system-design rounds, take-home ethics, red flags, tech JD pitfalls, plus per-family primers (AI/ML, data, backend, frontend, fullstack, mobile, DevOps/cloud/SRE, QA, security, design, product, architecture, embedded/IoT, games/XR, blockchain). Use for "hire a senior backend engineer", "screen this data engineer", "what does this candidate's answer mean", "is this GitHub any good", "design a tech interview loop", "system design rubric", "AI engineer vs ML engineer", "take-home assignment", "our tech JD gets no applicants". For generic intake, JD template, sourcing, offers and references use hr-recruiting; for levels and pay bands use hr-rewards.
allowed-tools: Read, Write, Glob, Grep
---

# Tech Hiring

> Hire for the systems a candidate has owned under real constraints, not for the tools they can list.

## When this skill activates

**Implicit:** a recruiter or HR generalist must hire an engineer, designer, PM or other technical role and cannot judge the technical content alone; a hiring engineer's request reads as a stack of buzzwords; a loop keeps producing inconsistent hire/no-hire calls; a tech JD attracts the wrong profiles.
**Explicit:** "Read the `hr-tech-hiring` skill file and [task]."
**Routed from:** `/hr:recruit tech <slug>` (slug names the req; role family — e.g. backend, data engineer, mobile, security, product designer — from the goal text).

## Scope

Covers:
- Translating the hiring engineer's ask into one scoped role, with must-haves a non-engineer can screen for.
- Scope-based seniority signals that hold across technical families.
- Screening and decoding technical answers without engineering background.
- Portfolio, GitHub and shipped-work review; structured tech loop; rubric calibration; take-home design.
- Per-family primers: [references/role-primers.md](references/role-primers.md). Intake, scorecard, take-home and debrief templates: [references/templates.md](references/templates.md).

Does NOT cover:
- Generic intake mechanics, JD template, sourcing, offer, reference process, employer brand → [[hr-recruiting]].
- Job architecture, level definitions, pay ranges, market data → [[hr-rewards]].
- Governance of AI screening/scoring tools in the ATS → [[hr-technology]].
- Onboarding (incl. hardware, lab and access lead times) → [[hr-people-ops]].
- Hiring in a country without an entity, EOR, work permits → [[hr-global]].

## 1. Intake with the hiring engineer — scope one role

Hypothesis to check first — the failure is often upstream: the hiring engineer describes a team's whole wish-list, and the JD turns it into one impossible person. Run the intake with [references/templates.md](references/templates.md) § Intake and do not leave without these answers.

| Ask | Why | Good answer |
|---|---|---|
| What must this person have delivered in 6–12 months? | Outcomes pick the track; tools follow | 2–3 outcomes, each observable ("multi-tenant schema live", "on-call rota with runbooks") |
| Which **one** track is primary? | A "unicorn" JD is usually several careers stacked | One family from the primer; the rest marked nice-to-have |
| Which 2–3 skills are truly must-have? | Long tool lists repel senior candidates and screen on noise | Named skills, each tied to an outcome |
| Which layer / ecosystem / platform exactly? | Skills transfer poorly across ecosystems (iOS vs Android, EVM vs other chains, Unity vs Unreal, one RTOS vs another) | Explicit platform; "transferable from X" stated if acceptable |
| What scope = what level? | Level is set by scope, not years | Scope statement per § 2 |
| On-call, crunch, travel, lab/hardware, regulated domain, security clearance? | Hidden conditions cause late drop-out and early attrition | Stated plainly in the JD |
| Who assesses the technical content? | A non-engineer cannot score depth alone | Named role(s) for each technical stage; external advisor if nobody in-house has the specialism |
| What would make you reject a strong-looking CV? | Surfaces unstated criteria early | Job-related reasons only (hr-rules § 5) |

**Track-collision test.** If the ask contains two of these pairs, it is two roles — make the hiring engineer choose or split the req.

| Often bundled | Actually different | Hire the first when… / the second when… |
|---|---|---|
| AI engineer + ML engineer | Builds products on existing models vs trains/optimises models | Using hosted models in workflows / need proprietary models on own data |
| Backend + platform engineer | Product APIs and data layer vs internal tooling engineers use | Building features / unblocking delivery for other engineers |
| DevOps + SRE | Delivery automation vs reliability ownership | Deployments are painful and manual / uptime commitments exist and incidents are unmanaged |
| Data engineer + analytics engineer | Pipelines that move and store data vs trusted business models on top | Data arrives late or breaks / analysts drown in inconsistent metrics |
| Fullstack + two specialists | End-to-end ownership vs depth per layer | Small team, simple layers / both layers have grown complex enough for owners |
| Manual QA + automation QA / SDET | Exploratory judgment vs building test systems | Product risk is usability and edge cases / regression and release confidence |
| Pentester + defensive security engineer | Simulates attacks vs builds and runs defences and controls | Need assurance testing / need posture, identity, compliance ownership |
| UI + UX + product designer + researcher | Visual craft vs flows vs end-to-end product outcomes vs evidence | Name the primary need; portfolios differ accordingly |
| Staff + principal engineer | One team or a few vs a domain across many teams | Set by span of influence |

## 2. Seniority signals — scope, not years

Years of experience and framework count are weak proxies. Level by what the person has owned. Map to the org's job architecture via [[hr-rewards]]; the table below is a screening lens, not a level guide.

| Level | Scope | Ownership | Ambiguity | Incidents / failure | Influence |
|---|---|---|---|---|---|
| Junior | A task or component | Implements to an existing pattern | Needs a defined problem | Participates, learns | Own work |
| Mid | A feature or service | Designs within a system someone else shaped | Clarifies requirements | Handles routine issues | Pairs, reviews |
| Senior | A system end-to-end | Makes and defends architecture trade-offs | Turns a vague problem into a plan | Leads response, fixes root cause | Mentors; aligns adjacent teams |
| Staff / principal | Several teams or a domain | Sets direction others build on | Defines which problems matter | Changes how the org prevents failure | Influences without authority; writes the docs others cite |

**Cues that read "senior" in any family:** explains *why* a choice was made and what it cost; names what they would do differently; talks about failure modes, evaluation, cost, security and operability without being prompted; uses "I" for decisions and "we" for team outcomes, and can separate the two.
**Cues that read "less senior than the title":** tool lists without decisions; only happy-path examples; can describe what a system does but not how it fails; every project is greenfield and solo.

Title inflation is normal across company sizes — a "senior" at a five-person startup and at a large platform company can differ by a full level. Calibrate on scope evidence.

## 3. Screening without being an engineer

### CV screen
- **Ownership verbs** ("built", "owned", "led", "migrated") with a system and an outcome outrank exposure verbs ("familiar with", "exposure to", "knowledge of").
- **Production evidence:** real users, a deployment, an incident, a migration, an audit — scale described in the candidate's own terms.
- **Depth over breadth:** one system owned in production beats a long list of tools touched.
- **Certifications are a baseline, not a proxy** for operating experience; neither required nor penalised unless the role mandates one.
- **Non-traditional paths are normal** in software (self-taught, bootcamp, career-changers). Screen on evidence, not pedigree or brand-name employers (hr-rules § 5).

### Recruiter phone screen — questions a non-engineer can score
Use three open prompts and score only what you can hear: specificity, ownership, trade-offs, reflection.
1. "Walk me through the most complex thing you built or ran. What made it hard?"
2. "Tell me about something that broke in production (or failed with users). How did you find out and what changed afterwards?"
3. "If you rebuilt it today, what would you do differently, and why?"
Follow-up for any answer: "Why that rather than the alternative?" A strong candidate names the alternative and the cost.

### Decoding a technical answer
1. **List the claims** — write the answer down near-verbatim (no scoring from memory).
2. **Separate tool names from decisions.** "We used a message queue" is a tool; "we made processing asynchronous so a slow partner API could not block checkout" is a decision.
3. **Look for the why** — trade-off language, constraints, what was rejected.
4. **Look for failure handling and measurement** — monitoring, evaluation, rollback, tests, how they knew it worked.
5. **Check ownership** — which parts were theirs.
6. **Flag, do not judge, what you cannot parse** — pass the verbatim note and your question to the technical interviewer. Use the primer's core terms to ask one informed follow-up, never to grade.

A profile that is strong but mismatched (e.g. an offensive-security background for a cloud-compliance role, a manual QA for an automation-architect role) is a scoping or routing outcome, not a weak candidate — consider the right req or level before rejecting.

## 4. Portfolio, GitHub and shipped-work review

Review only what the candidate chose to share. Absence of a public portfolio is **not** a negative signal — much professional work is under NDA, and public side projects favour people with spare time (hr-rules § 5). Offer an alternative evidence path (work-sample walk-through, anonymised design doc, structured exercise).

| Strong | Worth asking about | Concerning (probe, do not auto-reject) |
|---|---|---|
| Real system complexity beyond tutorials | All solo, never reviewed by anyone | Only tutorial clones, no customisation |
| README / case study explains *why*, not just *how to run* | README describes features, never decisions | Cannot explain the problem the work solved |
| Handles error, empty and loading states; failure cases | Happy path only | Hard-coded secrets, no auth, no error handling |
| Tests, CI config, deployment or live link | Tests exist but never run automatically | No evidence the thing was ever used |
| Incremental commit history | One bulk commit | Claims expert depth across every specialism at once |
| Evidence of real users or a real deployment | Concept-only work for a role needing production experience | — |

**Evidence that fits the family** (detail per family in the primer): app-store listing for mobile; playable build or shipped title credit for games/XR; case studies with research for design; design docs/RFCs for staff+; IaC and pipeline repos for DevOps; lab or CTF write-ups and detection work for security; deployed or audited contracts for blockchain; shipped connected-device or certified product involvement for embedded/IoT; evaluation and observability in AI projects.

## 5. Structured tech interview loop

Design the loop and its rubric **before** the first candidate (hr-rules § 5). Same prompts, same time, same rubric for every candidate at a level.

| Stage | Purpose | Run by | Scored on |
|---|---|---|---|
| Recruiter screen | Motivation, logistics, § 3 prompts | Recruiter | Specificity, ownership, reflection; must-have logistics |
| Technical screen | Confirm the must-haves are real | Engineer in the family | Rubric dimensions 1–2 |
| Deep-dive / past-project review | Depth on something they owned | Senior engineer | Decisions, trade-offs, failure handling |
| System design (mid+; scale to level) | Reasoning under ambiguity | Calibrated interviewer | Requirements, trade-offs, data/modelling, communication — not the final diagram |
| Practical exercise (take-home **or** live pairing **or** portfolio walk-through — one, not all) | Realistic work sample | Engineer + rubric | Rubric; see § 6 |
| Collaboration / behavioural | Influence, conflict, feedback, incidents | Hiring manager + cross-functional peer | STAR-style evidence |
| Debrief | Decide against evidence | Hiring manager chairs | Independent scores first, then discussion |

**Rubric rules.** Score dimensions separately — technical depth, design and trade-offs, production/operational maturity, collaboration and influence, communication. Write behavioural anchors per score point. Define the decision rule (e.g. which dimensions are must-pass) in calibration; do not borrow numeric thresholds from elsewhere. Template in [references/templates.md](references/templates.md) § Scorecard.

**System-design rounds.** Open-ended prompt with several valid answers, scaled to level (junior candidates should not face staff-level ambiguity). Score reasoning along the way, not the final picture. Interviewers calibrate with sample strong / adequate / weak answer patterns and by independently scoring the same sample transcript, then reconciling against the rubric before running live loops.

**Debrief discipline.** Every interviewer submits scores and evidence before the debrief; discussion starts from evidence, not from the most senior voice; "culture fit" without a stated behaviour is not a reason; record the decision rationale against the rubric. Run an adverse-impact check across the pipeline once there is volume (hr-rules § 5). AI may summarise notes; it does not score or rank (hr-rules § 6).

## 6. Take-home and exercise ethics

| Rule | Why |
|---|---|
| State the expected time up front, keep it short, and time-box it; the hiring team sets the cap and checks it by doing the task themselves | Long unpaid tasks screen out employed and caregiving candidates, not weak ones |
| Never use real backlog work; use a synthetic, self-contained problem | Avoids free labour and IP disputes |
| Pay for anything substantial, or offer a live-pairing / portfolio alternative | Equity across candidates with different time budgets |
| Same task, same instructions, same rubric for everyone at the level | Comparability |
| Share what is assessed; publish the rule on AI-assistant use | Removes guessing; tests the job as it is done |
| Candidate keeps their work; it is not reused | Trust and IP |
| Offer adjustments on request (extra time, format) | Accessibility (hr-rules § 5) |
| Discuss the submission with the candidate | Tests understanding and ownership, not just output |

Algorithm-puzzle tests are a weak fit for most product engineering, design, QA and infrastructure roles; prefer work-sample tasks close to the real job (fullstack: connect UI → API → database; QA: automate a realistic flow; security: review a flawed config; design: rework a flawed flow and explain why).

## 7. Red flags — signal, meaning, probe

| Signal | May mean | Probe |
|---|---|---|
| Buzzword density, no decisions | Surface familiarity | "What did you choose against, and why?" |
| Everything is "we" | Peripheral role — or just modesty | "Which part was yours alone?" |
| Certifications fill the CV, no outcomes | Studied, not operated | "Tell me about an incident you handled end-to-end." |
| Claims expert depth in every specialism | Breadth over depth, or inflated claims | Pick one, go two levels deeper |
| No failure stories | Little production exposure, or low reflection | "What broke? What did you change after?" |
| Blames others for every incident | Low ownership, weak collaboration | "What would you do differently?" |
| Cannot explain how they know it works | No evaluation or testing habit | "How did you measure quality?" |
| Demo-only work for a production role | Prototype-level experience | "Who used it, and what happened when it failed?" |

Employer-side red flags that lose good candidates: slow or silent feedback, unpaid long take-homes, interviewers improvising questions, changing the role mid-loop.

## 8. Tech JD pitfalls

- **Kitchen-sink scope** — stacking tracks (see § 1); list the primary track, 2–3 must-haves, the rest as nice-to-have.
- **Version numbers and fashionable tool lists** — they date fast and screen on noise; name the capability and the primary stack.
- **Years-of-experience gates** — use scope statements instead; years can proxy age (hr-rules § 5).
- **Degree requirements without a job reason** — exclude non-traditional engineers.
- **Hype and exclusionary language** ("rockstar", "ninja", "digital native", "young team") — plain, gender-neutral wording.
- **Hidden conditions** — on-call, crunch, hardware lab, travel, clearance: state them.
- **"Competitive salary"** — pay-range disclosure is mandatory in some jurisdictions [VERIFY: pay-transparency law for the posting location]; ranges come from [[hr-rewards]].
- **No "not a fit if"** — a short honest line ("not a fit if your experience is limited to demos") saves both sides time.

## Guardrails

- **Job-related, pre-written criteria** — rubric before candidates; no question proxying a protected characteristic; no portfolio-absence penalty (hr-rules § 5).
- **No invented benchmarks** — salary ranges, time-to-fill, market supply, pass rates cited or `[NEEDS DATA]` (hr-rules § 4). Primers carry no popularity claims; stacks are a dated snapshot.
- **Human decides** — AI tools may summarise or structure; AI ranking or scoring of candidates is high-risk and goes through [[hr-technology]] governance (hr-rules § 6).
- **Candidate data** — scorecards and notes committed to the repo use candidate pseudonyms (`Candidate B`); names, contact details and CVs stay in the ATS (hr-rules § 3).
- **Jurisdiction** — background checks, pay transparency, right-to-work and candidate-notice rules are local (hr-rules § 1).

## Output

- Intake + role scope: `plans/hr/<slug>/tech-intake.md` — outcomes, primary track, must-haves, level by scope, conditions, technical assessors.
- Recruiter screen guide: `plans/hr/<slug>/tech-screen-guide.md` — CV cues, phone-screen prompts, family terms for follow-ups, routing rules.
- Loop + rubric: `plans/hr/<slug>/tech-loop.md` — stages, owners, prompts per stage, anchored scorecard, decision rule, calibration plan.
- Exercise brief (if used): `plans/hr/<slug>/tech-exercise.md` — task, time cap, rubric, AI-use rule, adjustments.
- Debrief: `plans/hr/<slug>/debrief-<candidate-pseudonym>.md` — scores with evidence, decision rationale. Pseudonymised **working draft** only: the final record moves to the ATS/HRIS and the draft is removed from `plans/` (hr-rules § 3).

## Before proceeding

1. Which role family and level, and what must the hire deliver in 6–12 months?
2. Is this one track, or a bundle that needs splitting (§ 1)?
3. Who on the team can assess the technical content — or do we need an external assessor?
4. Is there an existing level framework and interview process to extend?
5. Which country is the role hired in (posting rules, pay transparency, background checks)?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-recruiting]] — generic intake, JD, sourcing, offers, references
- [[hr-rewards]] — levels, job architecture, pay ranges
- [[hr-technology]] — AI-in-hiring governance
- [[hr-people-ops]] — onboarding incl. hardware and access lead times
- [[hr-global]] — cross-border hires, EOR, work permits
- [[hr-context]] — the hub every `/hr:` command reads first
- `.claude/workflows/hr-rules.md` — § 1 jurisdiction, § 3 candidate data, § 4 benchmarks, § 5 fair selection, § 6 human in the loop

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-ai`, `hr-ar-vr`, `hr-backend`, `hr-blockchain`, `hr-cloud`, `hr-data`, `hr-devops`, `hr-embedded`, `hr-frontend`, `hr-fullstack`, `hr-game-development`, `hr-iot`, `hr-mobile`, `hr-product-management`, `hr-qa`, `hr-security`, `hr-software-architecture`, `hr-system-design`, `hr-uiux` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into one cross-family method; the shared intake → screen → portfolio → loop → debrief pattern extracted from 19 per-role examples; cloud + DevOps, architecture + system design, embedded + IoT, games + AR/VR merged; unsourced figures removed (years-of-experience requirements, numeric hire thresholds, team-size cut-offs, take-home hour caps, user-scale examples, popularity and "dominant tool" claims); version-specific stack lists reduced to a dated snapshot; portfolio-absence, take-home-ethics, adverse-impact, candidate-PII and AI-scoring guardrails added; routing via `/hr:recruit tech`.
