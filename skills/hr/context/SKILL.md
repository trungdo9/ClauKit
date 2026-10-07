---
name: hr-context
description: Foundation HR skill. Create or update the HR context hub (plans/hr-context.md) — organisation, jurisdictions, headcount and locations, workforce mix, HRIS and systems, existing policies, governance and approvers, data-handling rules, HR priorities. Read by /hr:plan; every other /hr: command hard-fails without it.
allowed-tools: Read, Write, Glob, Grep
---

# HR Context (Hub)

> Write the facts once so every HR artifact agrees on them — above all, which country's law applies.

Owns `plans/hr-context.md`. The HR analogue of `ba-context` (BA kit) and `product-marketing`
(marketing kit). Every other `/hr:` command hard-fails without it (hr-rules § 8).

## When this skill activates

**Implicit:** first HR task in a project; a request names a country, entity or HRIS the hub does not list.
**Explicit:** "Read the `hr-context` skill file and [task]."
**Routed from:** `/hr:plan full|fast`.

## Scope

Covers: the hub file, its interview, its update semantics.
Does NOT cover: any HR deliverable — those belong to the domain skills ([[hr-recruiting]],
[[hr-people-ops]], [[hr-performance]], [[hr-rewards]], [[hr-learning]], [[hr-org-change]],
[[hr-workforce-analytics]], [[hr-employee-relations]], [[hr-culture]], [[hr-technology]],
[[hr-global]], [[hr-tech-hiring]]).

## Why a hub

HR advice that is right in one country is a liability in another. A PIP drafted on Monday and a
termination checklist drafted on Friday must agree on jurisdiction, approvers and data rules. The hub
is where hr-rules § 1 (jurisdiction) and § 3 (employee data) get their concrete values.

## The 9 interview questions (`full` mode)

Ask one at a time, in order. Capture answers as given; skip what the user already answered.

| # | Question | Why it is asked | A good answer |
|---|---|---|---|
| 1 | What is the organisation — sector, size band, stage? | Sizes every recommendation (a 40-person startup ≠ a 4,000-person group) | Sector + headcount band + one-line business model |
| 2 | Which countries (and states/provinces) do you employ people in, through which entity or EOR? | Drives hr-rules § 1 for every legal-adjacent output | One row per country: entity / EOR / contractors-only |
| 3 | Headcount by location and workforce mix (employees, contractors, interns, unionised, remote)? | Classification, works-council and scheduling questions depend on it | Approximate counts per row; bands are fine |
| 4 | Which HR systems — HRIS, ATS, payroll, LMS, survey tool? | Outputs name real fields and real integration points | Product category + whether it is the system of record |
| 5 | Which HR policies already exist, and where do they live? | New drafts extend, not contradict | Path/URL per policy, or "none" |
| 6 | Who approves what — offers, pay changes, terminations, policy? | Fills approval steps; nothing ships past a missing approver | Role per decision type, not a person's name |
| 7 | Data rules — what may be written into this repo, what must stay in the HRIS? | Concretises hr-rules § 3 for this org | "Roles/pseudonyms only" by default; stricter if the org says so |
| 8 | Language(s) for employee-facing documents? | Avoids rewriting deliverables later | Language per country/audience |
| 9 | Top 3 HR priorities for the next 6–12 months? | Lets commands rank options against what matters now | Three outcomes, each with an owner role |

## `fast` mode

Scaffold from what is on disk (`README`, `docs/`, existing `plans/`, policy files). Every scaffolded
field ships `confidence: low` and `[UNVERIFIED]` until a human confirms it. Never guess a jurisdiction
in `fast` mode — leave § Jurisdictions as `[UNVERIFIED — ask]`; that field gates legal-adjacent work.

## Update semantics

Re-running `/hr:plan` on an existing hub **merges**: add what is missing, never silently overwrite a
human-edited field, report what changed. A new country added to § Jurisdictions is called out
explicitly — it widens the scope of every later legal-adjacent output.

## Guardrails

- The hub holds no employee personal data — roles and counts only (hr-rules § 3).
- Jurisdiction is recorded as the user states it; no inferring country from language or company name (hr-rules § 1).
- Statutory facts (minimum wage, leave days, contribution rates) do not belong in the hub — they go stale; skills cite them per output with `[VERIFY]` (hr-rules § 2).

## Output

`plans/hr-context.md` per [references/context-template.md](references/context-template.md), and
`plans/hr/` created empty for the domain commands.

## Before proceeding

1. Does `plans/hr-context.md` already exist? → merge, do not overwrite.
2. `full` or `fast`?
3. Is this repo shared or public? → tighten § Data rules accordingly.

## Cross-references

- `.claude/workflows/hr-rules.md` — § 1 jurisdiction, § 3 employee data, § 8 hard-fail pre-flight (`/hr:plan` exception)
- [[hr-global]] — when § Jurisdictions lists more than one country

## Provenance

Original ClauKit skill (no source equivalent — `tuanductran/hr-skills` has no context hub). Modelled
on the BA kit's `ba-context`.
