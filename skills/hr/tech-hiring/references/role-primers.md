# Role primers — per tech family

> **Snapshot, verify with the hiring team.** Stacks, tool names and role titles change quickly. Terms below
> are listed so a recruiter can ask one informed follow-up — never to grade, and never as a JD tool list.
> No popularity or market claims; no versions. Method lives in [../SKILL.md](../SKILL.md).

Each block: **Does** · **Terms** (to recognise, not require) · **Often confused with** · **Screen with** (question → what a strong answer contains) · **Seniority cues** · **Watch for**.

## AI / ML
- **Does:** AI engineer builds products on existing models (LLM integration, retrieval, agents, evaluation); ML engineer trains, optimises and serves models; applied AI embeds AI in user flows; AI infrastructure runs serving and accelerator capacity; research engineer implements and evaluates new methods.
- **Terms:** LLM, prompt/context design, RAG (retrieval-augmented generation), embeddings, vector store, agents/tool use, fine-tuning, inference, evaluation set, LLM-as-judge, hallucination, observability, guardrails.
- **Often confused with:** data scientist (analysis, statistics, experiments); "prompt engineer" (usually a subset of AI engineering).
- **Screen with:** "How do you know your AI feature works in production?" → evaluation set, human review, failure tracing, monitoring. "Fine-tune or retrieval — when?" → cost, data needs, freshness, latency, chosen by context. "How do you keep cost and latency under control?" → caching, model-tier choice, batching.
- **Seniority cues:** owns evaluation and observability; designs for failure (fallbacks, human escalation, limits on agent actions); ties model quality to product outcomes.
- **Watch for:** demo-only chatbots; "uses ChatGPT" as a skill; cannot explain evaluation; framework names as the whole answer.

## Data
- **Does:** data engineer builds pipelines and storage; analytics engineer builds trusted, documented business models and metrics; analyst/BI turns data into reporting and decisions; data scientist models, forecasts, runs experiments.
- **Terms:** pipeline, ingestion, ETL vs ELT, orchestration, warehouse, lakehouse, layered models (raw → cleaned → business-ready), data quality tests, lineage, data contracts, partitioning, backfill, idempotency.
- **Often confused with:** each other — the four roles above are distinct hires; ML engineer.
- **Screen with:** "Design a pipeline from three sources into the warehouse." → source traits, raw vs transformed layers, scheduling, failure handling. "A late batch arrives — what happens to dashboards?" → idempotent reruns, incremental models, telling consumers. "How do you control warehouse cost?" → partitioning, materialisation choices, monitoring.
- **Seniority cues:** owns data quality and governance; designs datasets that serve both BI and ML without leakage; documents so others can run it.
- **Watch for:** SQL alone as proof of engineering; dashboards alone as proof of insight; competition/Kaggle scores as proof of production work.

## Backend
- **Does:** server-side logic, APIs, data modelling, auth, performance, integrations, reliability.
- **Terms:** REST, GraphQL, gRPC, WebSockets, relational vs document stores, indexing, caching, queues/event streams, monolith vs microservices, multi-tenancy, rate limiting, migrations (expand–contract), N+1 queries.
- **Often confused with:** platform engineer (builds tools for other engineers); DevOps; data engineer.
- **Screen with:** "An endpoint got slow in production — how did you find and fix it?" → profiling, query plans, indexing, pooling, before/after. "How do you change a schema on a live system?" → backward compatibility, phased rollout, rollback. "Splitting a monolith?" → incremental extraction, flags, traffic shifting.
- **Seniority cues:** schema and data-model ownership; security by default (authz, input handling); trade-off reasoning on architecture.
- **Watch for:** "knows framework X" as seniority; algorithm puzzles as the main test; ignoring database design.

## Frontend
- **Does:** user-facing application layer — components, state, data fetching, rendering, performance, accessibility.
- **Terms:** component architecture, state management, server vs client state, CSR / SSR / SSG, hydration, design tokens, bundle splitting, lazy loading, page-load and interaction metrics, WCAG, semantic HTML, keyboard navigation.
- **Often confused with:** UI designer; fullstack.
- **Screen with:** "When do you render on the server vs the client?" → per-use-case trade-offs, not definitions. "How did you make a slow page fast?" → measured before/after, images, splitting, caching. "Designer wants an animation that hurts performance — then what?" → negotiates on user impact.
- **Seniority cues:** owns a component system or design-system implementation; accessibility as a default; architecture for a growing team.
- **Watch for:** tutorial clones; only static UI; no loading/error states; accessibility never mentioned.

## Fullstack
- **Does:** ships a feature end-to-end — UI, API, data model, deployment, monitoring.
- **Terms:** monolith vs decoupled front/back, shared types across layers, ORM, auth/session handling, monorepo, CI/CD, end-to-end tests.
- **Often confused with:** "expert in everything"; most strong fullstack engineers lean to one side — that is normal.
- **Screen with:** "Architect a notifications feature from database to UI." → schema, API, real-time vs polling, client state. "A page is slow — where do you look?" → both front (bundle, rendering) and back (queries, caching).
- **Seniority cues:** product judgment (what to cut); knows when to split the stack; owns production after release.
- **Watch for:** front-only projects with mocked data; no deployment; single-layer take-home used to judge a fullstack hire.

## Mobile
- **Does:** native iOS/Android or cross-platform apps — UI, offline sync, performance, release pipeline, store compliance.
- **Terms:** native vs cross-platform, offline-first, local database, sync/conflict resolution, push notifications, deep links, app-store review, staged rollout, crash reporting, startup time, frame drops, battery/memory profiling.
- **Often confused with:** frontend web; "cross-platform means no native knowledge needed" — it does not.
- **Screen with:** "How did you build offline support?" → local store choice, sync queue, conflict strategy. "A performance problem you fixed?" → profiler used, root cause, measured result. "A release or store-rejection problem?" → process fix.
- **Seniority cues:** owns release pipeline; native debugging on both platforms; architecture for several engineers.
- **Watch for:** no live store listing for a "senior"; screenshots without source or demo; one platform scoped as "iOS + Android + every framework".

## DevOps / cloud / SRE / platform
- **Does:** DevOps automates delivery and infrastructure; SRE owns reliability targets and incident practice; platform engineer builds self-service internal tooling; cloud engineer/architect designs cloud infrastructure and networking; DevSecOps embeds security in the pipeline.
- **Terms:** CI/CD, infrastructure as code, containers, orchestration, GitOps, drift, blue-green / canary, observability (logs, metrics, traces), SLO / SLA / error budget, on-call, runbook, blameless post-mortem, least privilege, FinOps.
- **Often confused with:** each other; backend; "certified = experienced".
- **Screen with:** "An incident you owned from detection to prevention." → alert-detected (not customer-reported), timeline, containment, systemic fix. "Infra drift across environments?" → remote state, reviews in CI, detection. "Reduce deploy friction without risk?" → self-service, flags, fast feedback.
- **Seniority cues:** sets reliability strategy; improves developer experience; cost and capacity awareness; leads incidents.
- **Watch for:** local-cluster-only experience for a production role; hard-coded secrets in samples; tool lists without ownership; JD stacking DevOps + security + DBA + QA.

## QA / quality engineering
- **Does:** manual QA — exploratory and release validation; automation QA — regression suites in CI; SDET — test frameworks and tooling; quality engineer — org-wide quality strategy.
- **Terms:** unit / integration / end-to-end / regression / smoke / contract / performance / accessibility testing, shift-left, flaky tests, page objects, fixtures, test pyramid, risk-based prioritisation.
- **Often confused with:** each other; "QA only clicks buttons".
- **Screen with:** "What do you automate vs test manually?" → risk- and stability-based. "How do you handle flaky tests?" → root causes, quarantine vs fix, prevention. "What runs on every commit vs nightly?" → fast smoke vs full regression.
- **Seniority cues:** built a suite from zero; integrated in CI; influences developers on quality; structured bug reports.
- **Watch for:** certificates without a project; tests that only assert a page loaded; manual vs automation merged in one JD.

## Security
- **Does:** SOC / blue team — detection and response; AppSec — secure SDLC, code and dependency scanning; cloud security — identity, posture, configuration; pentest / red team — attack simulation; GRC — policy, audit, risk; DevSecOps — security in pipelines.
- **Terms:** threat model, least privilege, IAM, zero trust, SIEM, detection engineering, vulnerability triage, secure SDLC, supply-chain security, incident lifecycle (detect → triage → contain → remediate → recover → review), audit controls.
- **Often confused with:** "security = hacking"; pentester vs defensive engineer.
- **Screen with:** "Harden an environment that grew without oversight — where do you start?" → risk-ordered plan, identity first, logging. "An incident you responded to?" → detection, blast radius, root cause, new controls. "Security in CI without slowing teams?" → block only high severity, work with developers.
- **Seniority cues:** risk prioritisation; communicates risk to executives; builds programmes that teams follow.
- **Watch for:** certificate-only CVs; claims of expert depth across SOC, AppSec, cloud, pentest and GRC; "familiar with" everywhere. Bring an external assessor if no in-house security specialist.

## UI / UX / product design
- **Does:** UI — visual craft and consistency; UX — flows, information architecture, usability; product designer — end-to-end outcomes; researcher — evidence; interaction designer — motion and behaviour.
- **Terms:** wireframe vs mockup vs prototype, information architecture, usability test, progressive disclosure, visual hierarchy, cognitive load, design system, tokens, WCAG, handoff, edge/empty/error states.
- **Often confused with:** each other; frontend engineer; graphic/brand designer.
- **Screen with:** "Walk me through the hardest problem you solved." → constraints, research, iterations, trade-offs. "When is a design ready for engineering?" → edge, empty, error, responsive and accessibility states. "Engineering says it can't be built — then?" → separates essential from nice-to-have.
- **Seniority cues:** case studies show problem → research → decision → outcome; owns or evolves a design system; stakeholder facilitation.
- **Watch for:** tool proficiency as the headline (it is the floor); only final screens; no real users; marketing/brand work for a product role.

## Product management
- **Does:** owns problem selection, prioritisation and outcomes for a product area; leads without authority over engineering and design.
- **Terms:** discovery, prioritisation, success metric, experiment, roadmap, trade-off, stakeholder alignment.
- **Screen with:** a case grounded in the company's real domain → structured diagnosis, prioritised options, success metrics. "An outcome you moved — what changed, and how much was yours?" → measurable, attributed.
- **Seniority cues:** APM works within a defined area; PM owns an area; senior/group PM owns a domain and mentors; director+ sets strategy across teams.
- **Watch for:** generic textbook cases; vague impact claims; "product sense" scored as one gut number — score sense, execution and stakeholder leadership separately.

## Architecture / staff+ engineers and the system-design round
- **Does:** sets technical direction across teams; makes and documents cross-cutting trade-offs; influences without management authority.
- **Terms:** design doc, RFC, architecture decision record, scalability, availability, consistency, trade-off, migration path.
- **Screen with:** review of a past design doc or RFC (anonymised); a realistic scaling scenario; "a contested technical decision you drove to alignment."
- **Seniority cues:** staff — a team or a few; principal — a domain across many teams; organisation-wide direction above that. Scope of influence, not years.
- **System-design round (any family, mid+):** open prompt scaled to level; same prompt and time for all; score requirements, trade-offs, data/modelling and communication separately; calibrate interviewers on sample answers first.
- **Watch for:** assessing like a people-manager hire; trivia over judgment; inconsistent staff/principal meaning across teams.

## Embedded / firmware and IoT
- **Does:** firmware on microcontrollers (bare metal or RTOS); embedded Linux; hardware-software integration. IoT spans device, connectivity and cloud/edge layers — few people are deep in all three.
- **Terms:** RTOS, interrupts, memory constraints, real-time deadlines, priority inversion, bootloader, OTA update with rollback, device provisioning, fleet management, connectivity protocols (short-range, low-power wide-area, cellular, publish/subscribe messaging), functional safety.
- **Often confused with:** general C/C++ application work; "IoT" as one interchangeable skill (industrial vs consumer vs wearables differ).
- **Screen with:** a concrete low-level scenario (interrupt handling, memory limit, priority inversion); "How would you provision and update a large deployed fleet safely?" → staged OTA, rollback, monitoring.
- **Seniority cues:** shipped hardware products; regulated-domain certification work (automotive, medical, aerospace) where relevant; fleet-scale operations.
- **Watch for:** postings that omit the target platform/RTOS or demand all IoT layers; onboarding plans that ignore lab/hardware lead time.

## Games and AR/VR (spatial)
- **Does:** gameplay engineer (mechanics, systems), engine/graphics programmer, technical artist (shaders, pipelines, optimisation), game designer, producer; XR engineer (spatial interaction, SDK integration), spatial UX designer (comfort, accessibility), 3D artist (real-time assets).
- **Terms:** engine, frame budget, performance profiling, live operations, comfort / motion-sickness design, locomotion, field of view, playable build.
- **Often confused with:** engines treated as interchangeable; static showreels treated as interactive evidence.
- **Screen with:** play or watch the shipped/demo build; "Walk me through iterations and what you cut"; for XR, "a comfort decision you made and how you validated it with users."
- **Seniority cues:** shipped titles with a clear ownership area; performance work under tight budgets; live post-launch fixes.
- **Watch for:** polish without process; craft and collaboration scored as one — score separately; postings silent on crunch/overtime.

## Blockchain (brief)
- **Does:** smart-contract engineer, protocol engineer, contract security auditor.
- **Terms:** smart contract, audit, common vulnerability classes (reentrancy, access-control errors, arithmetic errors), ecosystem/language family.
- **Screen with:** a code-review exercise on a deliberately flawed sample contract; deployed or audited contracts and audit/bug-bounty history as evidence.
- **Watch for:** token-trading enthusiasm as engineering skill; hype language in postings; assuming skills transfer across chain ecosystems; weak security depth where bugs move money.
