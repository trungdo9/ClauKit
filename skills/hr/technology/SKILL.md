---
name: hr-technology
description: HR technology and AI-in-HR governance — HRIS requirements, data model, implementation, migration and integration (system of record, SSO/provisioning, payroll and benefits interfaces, parallel run, cutover, monitoring), vendor selection scorecards and scripted demos, HR process automation triage, AI use-case risk tiering, DPIA, bias evaluation, human review, employee transparency, AI vendor due diligence, agentic AI autonomy limits, GenAI use standards and prompt libraries, HR chatbot scope and escalation, knowledge base governance, HR data governance. Use for "choose an HRIS", "HRIS requirements", "migrate to a new HRIS", "integrate HRIS with payroll", "vendor scorecard", "RFP for an ATS", "what should we automate", "can we use AI to screen CVs", "AI policy for HR", "bias audit", "DPIA for an HR tool", "HR chatbot", "Slack bot for HR questions", "HR knowledge base", "who can see employee data". For people analytics methods and KPIs use hr-workforce-analytics; for the HR service model and self-service operations use hr-people-ops; for hiring HRIS staff use hr-recruiting.
allowed-tools: Read, Write, Glob, Grep
---

# HR Technology

> Fix the process and the data first; software only makes whatever is there run faster — including the mistakes.

## When this skill activates

**Implicit:** spreadsheets outgrown; an HRIS replacement; data out of sync between HR systems; a vendor pitching AI screening; HR staff pasting employee data into public AI tools; repetitive HR tickets; a request for an HR bot.
**Explicit:** "Read the `hr-technology` skill file and [task]."
**Routed from:** `/hr:tech hris|select|ai|automation|chatbot|data`.

## Scope

Covers:
- HRIS requirements, data model, implementation, migration, integrations, monitoring.
- Vendor selection for any HR system (HRIS, ATS, LMS, payroll, AI tools).
- Process automation triage and workflow design.
- AI in HR: use-case tiering, DPIA, bias evaluation, human oversight, transparency, vendor due diligence, agentic AI, GenAI use standard.
- HR chatbots and the knowledge base behind them; HR data governance.

Does NOT cover:
- People analytics methods, KPIs, predictive models on people → [[hr-workforce-analytics]].
- HR service delivery model, shared services, self-service operating model → [[hr-people-ops]].
- Hiring HRIS, people-systems or knowledge roles → [[hr-recruiting]] / [[hr-tech-hiring]].
- Organisation-wide change programme around a rollout → [[hr-org-change]]; AI fluency curriculum → [[hr-learning]].
- Employee monitoring policy, investigations, policy text → [[hr-employee-relations]].
- Country data-protection and transfer addenda → [[hr-global]].

Vendor names are not used; categories only (core HRIS/HCM, ATS, payroll, benefits administration, LMS, identity provider, integration platform, knowledge base, ticketing).

## hris — requirements, implementation, integration

**Current-state audit first:** system inventory (spreadsheets count if people depend on them) · per process, is the pain the tool or the process · where each data element lives and how accurate it is · employee and manager friction ("what do managers ask HR that they should answer themselves?").

**Maturity** frames ambition: digitised (records digital) → automated (routine transactions flow) → integrated (systems share data, one source of truth) → intelligent (analytics/AI inform decisions). Don't buy stage-4 features on stage-1 data.

**Requirements:** user stories per persona (employee, manager, HR, payroll, finance, IT) plus must-have / nice-to-have, and non-functional: role-based access, audit history, SSO, data residency and retention, localisation per country ([[hr-global]]), reporting, import/export, accessibility. Checklist: [references/hris-implementation.md](references/hris-implementation.md).

**Core data model** (agree before configuration): person vs worker (employee, contractor) · job (catalogue, from [[hr-rewards]] job architecture) vs position (budgeted seat) · organisation unit, cost centre, legal entity, location · manager relationship · effective-dated records (history, future-dated changes) · status and reason codes · multiple concurrent jobs.

**System of record per data type** — decided in writing before any integration:

| Data | Typical system of record |
|---|---|
| Person, job, position, status, org | HRIS |
| Candidate until hire | ATS → HRIS at hire |
| Pay rate, compensation | HRIS / compensation module |
| Pay results, deductions | Payroll |
| Benefit elections | Benefits platform (HRIS supplies eligibility) |
| Learning completions | LMS |
| Hours, attendance | Time / workforce-management system |
| Accounts and access | Identity provider, driven by HRIS status |

**Integration patterns:** native connector (cheap, vendor-supported, limited fields) · integration platform / middleware (central monitoring and transformation, extra licence) · custom API (flexible, you own maintenance) · file/SFTP batch (legacy and carriers, latency, late error detection). Prefer the least custom option that meets the requirement. Triggers: event-driven · scheduled batch · on-demand. Transformations: field names, value codes, formats, calculated fields, conditional inclusion — all in a mapping spec.

**Identity provisioning:** joiner → account and access by role on start date; mover → access re-derived on job/org change; leaver → deprovisioning on termination effective time. Leaver latency is a security metric.

**Payroll interface:** agree cut-off calendar, retro-change handling, off-cycle runs, and who corrects what. Parallel-run payroll for an agreed number of cycles; cut over only on zero unexplained pay differences.

**Edge cases every integration test covers:** rehire (ID continuity) · leave of absence · part-time / FTE change · transfer across entity or country · name change · mid-period termination · future-dated change · multiple jobs · dependants ageing out of eligibility `[VERIFY: plan rules]`.

**Migration:** inventory → cleanse at source → field mapping → trial loads → record-count and value reconciliation → parallel run → cutover criteria all met → tested rollback → hypercare with named support. Decide what history migrates vs archives.

**Run state:** monitoring tiers (critical: payroll, benefits, deprovisioning — fastest alert · important · standard), sync logs, periodic cross-system reconciliation, runbook per integration, named owner per integration.

Failure modes: requirements written by vendors · over-customisation · data cleanup unplanned · training and adoption underfunded · no owner after go-live · every tool integrated "because it can be" (each integration is a failure point and a governance surface).

## select — vendor selection

1. Requirements and **weighted criteria agreed by HR, IT, finance, legal (and DPO where one exists) before any demo**; weights sum to 100 and are frozen.
2. Long list → RFI → shortlist (3–4).
3. **Scripted demos** — every vendor runs the same scenarios on your sanitised data; no product tours. Scenarios in [references/hris-implementation.md](references/hris-implementation.md).
4. References at similar size, countries and stack: what broke in year 1, support responsiveness, would they choose again.
5. Sandbox / proof of concept on the riskiest requirement (usually integration or migration).
6. Total cost of ownership over the contract term: licences by module and user, implementation, integration, internal effort, training, support tiers, renewal uplift, exit cost.
7. Security, privacy and legal review; for AI features run § ai.
8. Decision memo: recommendation, scores, key trade-off, risks, conditions, named internal owner before signature.

Contract must-haves: data ownership, portability and deletion on exit · subprocessor list and change notice · audit and security reporting rights · SLAs with remedies · notice of model changes for AI features · exit and transition assistance.

Scorecard categories (team sets weights): core workflows · payroll/benefits fit · integration quality · reporting · employee and manager experience · security and compliance · implementation effort and support · total cost.

## ai — AI-in-HR governance

Templates — use-case register, DPIA questions, bias plan, agent boundary, notice, GenAI standard: [references/ai-governance.md](references/ai-governance.md).

**1. Classify the use case** before choosing a tool:

| Class | Examples | Minimum control |
|---|---|---|
| Administrative assistance | Drafting from approved sources, scheduling, summarising for HR staff | Approved sources, data rules, reviewer before anything reaches an employee |
| Decision support | CV summarisation, shortlist suggestions, risk flags, policy answers | Documented purpose, bias test, named human reviewer with authority to override, notice |
| Automated decision-making | Auto-reject, auto-rank to final, auto-change pay/status | **Not used** for hiring, exit, promotion, pay or discipline — hr-rules § 6 |

Screening, ranking or scoring candidates or employees is high-risk: the EU AI Act lists employment uses in Annex III as high-risk `[VERIFY: current obligations and application dates]`; other jurisdictions regulate automated employment decision tools (bias audits, notice, alternative process) `[VERIFY: <jurisdiction>]`.

**2. DPIA / privacy impact** before deployment, not after: data inventory incl. **inferred** data · purpose and necessity (could less data do it?) · lawful basis — consent is often weak in employment because of the power imbalance `[VERIFY: local data-protection law]` · repurposing risk (survey data feeding a risk model) · third parties and transfers · retention · risks × likelihood × severity · mitigations · employee disclosure. Prompts, uploads, outputs, logs and vendor telemetry are all employee-data surfaces.

**3. Bias evaluation.** Mechanisms: biased training data, biased labels (past ratings, past hiring decisions), feedback loops. Proxies: postcode, graduation year, school, employment gaps, name, communication style. Fairness definitions conflict (equal selection rates · equal true-positive rates · equal calibration cannot all hold when base rates differ) — legal and DEI choose one and document why. Tests: adverse-impact ratio on selection rates — a ratio below four-fifths is a US rule-of-thumb signal (29 CFR 1607.4(D)); passing it does not prove absence of adverse impact `[VERIFY: jurisdiction]`; false-positive/negative rates by group, synthetic profiles varying one attribute, a human-reviewed sample compared with tool output, atypical inputs (career changers, gaps, non-native language, accessibility needs). Re-test on model update, data change, workforce change, regulation change. Never rely on vendor results alone.

**4. Human oversight that is real.** Reviewer has authority, context and time to override; interface shows evidence and uncertainty; overrides and reasons logged; override rates sampled (near-zero overrides = rubber-stamping). Modes: **full review** (every action approved — default for pilots and decision support) · **exception review** (acts within parameters, holds the rest) · **audit review** (sampled after the fact — only for trivial, reversible actions, never for employment status, pay or sensitive data).

**5. Agentic AI** (systems that *act* — send, update, advance, reject): write the autonomy boundary (may / must hand off / never); stage autonomy from full review to exception review only on evidence; tested kill switch (pause without losing state, notify affected people, correct records, named authority); accountability for agent errors assigned to a role before go-live.

**6. Transparency** to candidates/employees in plain language, before the decision: what the AI does and does not decide, data categories, the human role, how to ask questions, request human review or contest. Never promise "a human in the loop" who cannot change the outcome.

**7. Vendor due diligence:** training data and labelling · independent bias audit (who, when, report) · per-group results · explainability of a single output · model-update notice · data retention, residency, deletion, subprocessors · audit logs · for agents: configurable actions, failure alerting, rollback. Evasive answers are a qualification signal. Questionnaire: [references/ai-governance.md](references/ai-governance.md).

**8. Pilot** one use case, one team, fixed period; parallel run against the current process; success and stop criteria written first (quality vs baseline, adverse-impact flags, rework, reviewer load); weekly error review; go/no-go memo.

**GenAI use standard for HR staff:** permitted uses (first drafts, variations, summaries of anonymised input, plain-language rewrites) · no-go list (disciplinary letters, investigation findings, individual written feedback sent unedited, anything deciding an outcome) · no personal data in tools not approved by procurement/privacy — anonymise (`Employee X, senior engineer`) · review checklist (facts, invented policy, tone, legal, inclusive language, proxies) · the sender is accountable. Prompt library: role · task · context · format; few-shot examples for consistency; iterate rather than regenerate; a prompt enters the library after testing on several cases and carries an owner.

**Adoption** (after governance, not instead of it): start from a real task users repeat; pilot includes sceptics; champions are credible peers with a bounded remit (not policy owners); measure a funnel — first use, repeat use in the target workflow, quality, rework, confidence, safe-use adherence — not logins. Answer job-security questions honestly and specifically; programme-level change → [[hr-org-change]].

Deploying AI that influences hiring, promotion, pay, discipline or exit ends with: *review with qualified employment counsel (and the privacy lead) before acting* (hr-rules § 2).

## automation — process automation triage

Score each candidate process:

| Criterion | Automate | Redesign first | Keep human |
|---|---|---|---|
| Volume | Frequent | — | Rare |
| Logic | Rules expressible without judgement | Rules exist but exceptions dominate | Judgement, relationship, confidentiality |
| Stability | Stable | Changing | — |
| Documentation | Documented, standard inputs | Undocumented workarounds | — |
| Error cost if wrong | Low, reversible | — | High, hard to reverse |

Good targets: access provisioning on hire, onboarding task generation, routine leave approval, policy acknowledgement tracking, compliance-training assignment, document generation from HRIS data, reminders, offboarding checklists and access revocation, scheduled reports. Poor targets: ER case handling, performance judgement, sensitive communications, complex leave and accommodation.

Design: redesign the process (remove non-value steps, shortest approval chain, standard inputs) → trigger → rules → **exception routing with the reason attached** (e.g. insufficient balance, protected leave type, overlapping absence) → notifications → audit trail (what, when, trigger, outcome) → manual fallback. Choose the simplest tool tier: native HRIS workflow → low-code platform → screen-automation for systems without APIs → AI only where rules cannot express the task (then § ai).

Triage sheet and workflow spec: [references/chatbot-kb.md](references/chatbot-kb.md). Before go-live: data-quality check on every field the rules read; test with edge cases at realistic volume; rollback plan. Measure against a baseline: cycle time, error rate, exception rate, HR time freed and where it went, user satisfaction. Decide and communicate role impact before go-live, not after.

## chatbot — scope, escalation, knowledge base

1. **Scope narrow**: one high-volume domain first (leave, benefits FAQ, onboarding navigation, how-to requests). Mine intents from ticket, email and chat logs — not from HR's guess.
2. **Intent spec** per intent: trigger phrasings · answer source (KB article or authenticated HRIS lookup) · conditions that change the answer · escalation condition. Templates (scope, intent spec, escalation matrix, KB article): [references/chatbot-kb.md](references/chatbot-kb.md).
3. **The bot informs and routes — it never decides**: no approvals, denials, eligibility rulings, legal or medical advice, pay disputes.
4. **Hard escalation to a named human, with context carried over:** harassment, discrimination, safety, threats, self-harm or mental-health crisis, whistleblowing, legal questions, pay disputes, health/accommodation, immigration, termination, explicit request for a human, low confidence, repeated rephrasing.
5. **Grounded answers**: from approved, owned, dated KB articles, with the source linked; personal data only via authenticated lookup at least privilege; no free generation of policy.
6. **Responses**: short, actionable (link or button), honest about limits; identifies itself as AI; multilingual workforces get tested translations.
7. **Test**: many phrasings per intent, multi-topic messages, sensitive topics, adversarial input, user acceptance with real employees.
8. **Run**: weekly transcript review in the first month, then a regular sample; track resolution **with** quality sampling, wrong-answer rate, escalation rate, unresolved queries, satisfaction. Fast but wrong is worse than no bot.

**Knowledge base behind it:** organise by employee task ("request leave"), not HR department; each article has owner, last-reviewed and next-review date; search-gap analysis (searched, not found) and ticket themes set priorities; retire duplicates and stale content on a cycle; capture tacit knowledge by having experts walk through a recent real case, then structure it into an SOP. AI search surfaces wrong content as confidently as right content — accuracy is the foundation.

## data — HR data governance

- **Ownership:** a data owner (accountable) and steward (maintains quality) per domain — person, job/org, pay, time, performance, learning.
- **Classification:** public · internal · confidential (pay, performance, ER) · special-category (health, biometrics, ethnicity, religion, union, sexual orientation). Special-category data is never written to committed files and never inferred; collection outside the repo only on a counsel-confirmed lawful basis, voluntary, isolated, reported in aggregate above the minimum group size in `plans/hr-context.md` § 7 — hr-rules § 3 `[VERIFY: local law]`.
- **Access:** role-based by need, field-level for confidential data, manager scope limited to their reporting line, quarterly access recertification, export controls, audit logs reviewed.
- **Definitions dictionary** shared with analytics: active headcount, worker types, hire/termination dates, reason codes — consumed by [[hr-workforce-analytics]].
- **Quality rules:** uniqueness, completeness, validity, cross-system consistency, timeliness; validation at entry; scheduled audits and reconciliations; issue log with owner.
- **Lifecycle:** retention schedule per record type `[VERIFY: local retention law]` · deletion and anonymisation routine · data-subject request procedure (find all copies incl. AI tools and logs, respond with categories and plain-language logic) · breach response · cross-border transfer mechanism `[VERIFY]` ([[hr-global]]).
- **Analytics layer:** pseudonymised, aggregated extracts; minimum group size from `plans/hr-context.md`.

## Guardrails

- **Jurisdiction first** for data protection, AI rules, retention, transfers — hr-rules § 1.
- **No statutory figures, dates or penalties from memory**; `[VERIFY: <law/authority>]` — hr-rules § 2.
- **No real employee data** in specs, test plans, prompts or `plans/hr/`; synthetic or pseudonymised records only — hr-rules § 3.
- **No invented ROI, adoption or deflection figures**; baseline from own data or `[NEEDS DATA]` — hr-rules § 4.
- **Adverse-impact testing** before any AI or automated rule affects a group outcome — hr-rules § 5.
- **AI drafts, flags and routes; humans decide** hiring, firing, promotion, pay, discipline — hr-rules § 6.
- **No vendor names**; categories only.

## Output

- `hris` → `plans/hr/<slug>/hris-plan.md` — current state, requirements, data model, system-of-record map, integration and migration plan, test and cutover criteria, run-state monitoring.
- `select` → `plans/hr/<slug>/vendor-selection.md` — criteria and weights, demo scripts, scorecard, TCO, contract checklist, decision memo.
- `ai` → `plans/hr/<slug>/ai-assessment.md` — use-case class, DPIA summary, bias test plan, oversight mode, notice text, vendor due diligence, pilot criteria, decision record.
- `automation` → `plans/hr/<slug>/automation-triage.md` — scored backlog, workflow design with exceptions, test and rollback, baseline metrics.
- `chatbot` → `plans/hr/<slug>/chatbot-design.md` — scope, intent specs, escalation matrix, KB governance, test and run plan.
- `data` → `plans/hr/<slug>/data-governance.md` — owners, classification, access matrix, dictionary, quality rules, retention and request procedures.

## Before proceeding

1. Which systems exist today, which is the system of record, and who owns each?
2. Which countries and entities are in scope (data protection, payroll, AI rules differ)?
3. For AI: what exactly will the output influence, and who is the human reviewer?
4. What baseline data exists (ticket volumes, cycle times, error rates) to measure against?
5. Who signs off: HR, IT/security, privacy, legal, works council or employee representatives where applicable?

Read `plans/hr-context.md` — jurisdiction, headcount, HRIS, policies. Skip what it already answers.

## Cross-references

- [[hr-context]] — systems inventory, jurisdictions, data rules, approvers
- [[hr-workforce-analytics]] — KPIs, models and dashboards on top of the data
- [[hr-people-ops]] — service delivery model, self-service, onboarding/offboarding flows
- [[hr-org-change]] — change programme for rollouts and role impact
- [[hr-employee-relations]] — monitoring policy, complaints about AI decisions
- [[hr-recruiting]] — AI in screening as used in the hiring process
- [[hr-global]] — country data-protection and transfer addenda
- `.claude/workflows/hr-rules.md`

## Provenance

Adapted from `tuanductran/hr-skills` → `hr-agentic-ai`, `hr-ai-adoption`, `hr-ai-change-management`, `hr-ai-ethics`, `hr-ai-evaluation`, `hr-ai-governance`, `hr-ai-privacy`, `hr-automation`, `hr-chatbot-design`, `hr-digital-hr`, `hr-genai`, `hr-hris`, `hr-knowledge-management`, `hr-prompt-engineering`, `hr-system-integration`, `hr-technology` (MIT, © 2026 Tuan Duc Tran). ClauKit adaptations: prompt libraries distilled into method; 16 overlapping sources merged into hris→select→ai→automation→chatbot→data; role-hiring material (HRIS/knowledge-manager JDs, scorecards) routed to hr-recruiting; vendor and product names removed; unsourced figures removed (demo scorecard weights, parallel-run match rates, alert windows, carrier-feed rules, maturity distributions); named regulations reduced to `[VERIFY]` pointers; human-oversight, DPIA, bias-test and counsel-review guardrails added; routing via `/hr:tech`.
