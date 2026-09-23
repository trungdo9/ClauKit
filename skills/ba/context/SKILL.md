---
name: ba-context
description: Foundation BA skill. Create or update the BA context hub (plans/ba-context.md) — scope, actors, system boundary, sources, NFRs, glossary, sign-off, tracker. Read by /ba:plan; every other /ba: command hard-fails without it.
license: MIT
---

# BA Context (Hub)

The BA analogue of `product-marketing` (marketing kit's hub skill). Owns `plans/ba-context.md` —
the project-level facts every BA artifact must agree on.

## What the hub is

The facts written once so every later artifact agrees. Without it, an SRS written on Monday and
a test pack written on Friday disagree about who the actors are. Every wave 1–4 `/ba:` command
hard-fails without this file (rule 6).

## The 8 interview questions (`full` mode)

Ask one at a time, in order. Capture answers verbatim; skip a question the user already answered.

1. **Hệ thống/sản phẩm là gì, phục vụ ai?**
   Why: fixes scope + primary users before anything else is drafted.
   Good answer: one sentence naming the system, one sentence naming who uses it.

2. **Các Actor và quyền của họ?**
   Why: drives every `**Actor:**` field in every FR/UC/US written later.
   Good answer: a name + a one-line permission per actor, not a job title alone.

3. **Ranh giới hệ thống — cái gì trong, cái gì ngoài?**
   Why: stops scope creep in the SRS by fixing in/out before FRs are drafted.
   Good answer: a short list each side; ambiguous items go to § 9, not silently in.

4. **Nguồn sự thật hiện có?**
   Why: this becomes the legal `source:` set for rule 1 — every requirement's citation must
   resolve to something named here (doc, code repo, ticket).
   Good answer: a path or URL per source, not "existing docs".

5. **Ràng buộc phi chức năng đã biết?**
   Why: feeds `NFR-###` — performance, security, availability constraints already known.
   Good answer: a measurable constraint ("p95 < 300ms"), not "fast".

6. **Từ điển thuật ngữ / glossary — VI term ↔ EN keyword?**
   Why: D-4's seam (Vietnamese prose, English artifact keywords) — without an agreed glossary
   the same concept gets two names across artifacts.
   Good answer: one VI term ↔ one EN keyword ↔ one definition, no synonyms left unresolved.

7. **Quy trình phê duyệt & ai ký?**
   Why: drives `confidence:` thresholds and the draft-default gate (rule 3) — who signs off
   before a draft becomes a committed deliverable.
   Good answer: a named approver per deliverable kind (PRD, SRS), not "the team".

8. **Tracker & không gian tài liệu?**
   Why: the external ids (Jira project key, Confluence space) `/ba:sync` will be idempotent on
   in wave 4 — recorded now so later writes don't invent a second key.
   Good answer: the literal project key / space key, not a description of the tool.

## `fast` mode

Skip the interview. Scaffold from what is on disk: `README`, `docs/`, `package.json`, existing
`plans/`. Every scaffolded field ships `confidence: low` and `[UNVERIFIED]` until a human confirms
it — this is rule 1 applied to the hub itself; the hub is not exempt from the kit's own sourcing
rule.

## Update semantics

Re-running `/ba:plan` on an existing hub **merges**: never silently overwrite a human-edited
field; report what changed. Precedent: `settings-merge.js` and `wireGitignore` — add what is
missing, never touch what the user wrote, and say what changed.

## Reading order

`references/context-template.md` — the literal skeleton written to `plans/ba-context.md`.

## Cross-references

- **Read the `business-analysis-rules` workflow** ([.claude/workflows/business-analysis-rules.md](../../../workflows/business-analysis-rules.md)) — rule 6 (hard-fail pre-flight, `/ba:plan` exception), rule 1 (sourcing), rule 7 (output language).
- **Read the `ba-traceability` skill file** ([.claude/skills/ba/traceability/SKILL.md](../traceability/SKILL.md)) — the spine this hub's `project id` names (`plans/ba/<slug>/`).
