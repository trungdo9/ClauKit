# KitForge BA Kit

Business analysis, spec-first: PRD → SRS → traceability spine → dev handoff, under the `/ba:` namespace.

## What's included

Wave-0 build (this phase), present tense — nothing forward-promised:

- **1 command:** `/ba:plan` (bootstraps the context hub)
- **2 skills:** `ba-context`, `traceability`
- **1 workflow:** `.claude/workflows/business-analysis-rules.md`
- **1 helper:** `.claude/scripts/ba/traceability.cjs`

> Waves 1–4 add the remaining 11 commands — see the capability map.

## Capabilities

`ba` maps 55 business-analysis capabilities onto 8 owned dispatchers (`plan prd spec diagram qc reverse api export`) plus a handful of deliberate redirects to the `engineer` kit. The mapping, plain-language glosses, owner, and delivery wave for every one of the 55 live in one place, machine-checked for completeness — see `.claude/skills/ba/capability-map.md`. This file does not restate them.

## Quick start

```bash
ck init --kit ba
```

Then run `/ba:plan` once to bootstrap `plans/ba-context.md`. Every other `/ba:` command reads that file first.

## Hard-fail rule

Every `/ba:` command (except `/ba:plan` itself) requires `plans/ba-context.md` to exist; absent, it prints `❌ BA context not found at plans/ba-context.md` and stops. See `.claude/workflows/business-analysis-rules.md` § 6.

## The traceability spine

Source of truth is one markdown file per entity, not a database: `plans/ba/<project>/entities/<ID>.md`. `plans/ba/<project>/traceability.derived.json` is a regenerated index — git-ignored, never hand-edited. Entity kinds by example: `PRD-001`, `EPIC-003`, `SRS-001`, `FR-012`, `NFR-004`, `UC-007`, `US-021`, `AC-012.1`, `TC-030`. The helper exposes three subcommands: `build` (regenerate the derived index from entity files), `gap` (report unsourced/orphan entities), `check` (verify consistency for sign-off). See the `traceability` skill file (`.claude/skills/ba/traceability/SKILL.md`) for the full contract.

Handoff to dev tickets is a redirect, not a `ba` feature: it needs the `engineer` kit installed in the same project (`/ck:tickets`).

## Quy trình chuẩn

```
/ba:plan → /ba:prd → /ba:spec → /ba:qc gap (exit 0 = handover gate) → /ba:spec compose → /ck:tickets <SRS> → /ck:cook <ticket>
```

`/ck:tickets` slices `plans/ba/<project>/deliverables/SRS-001.md` directly — no conversion step — and writes its tickets to its own `plans/<YYMMDD-HHmm>-<slug>/tickets/`. Spec-sliced tickets carry the acceptance criteria but no file paths; run `/ck:scout` before `/ck:cook` when the area is cold. Full chain and the three seam facts: `.claude/workflows/business-analysis-rules.md` § 9.

## Output language

Prose bodies are Vietnamese; artifact keywords (`PRD-###`, `FR-###`, `Given`/`When`/`Then`, `source:`, `confidence:`, etc.) stay English so generated entities wire straight into BDD/Playwright and Jira. No i18n beyond that split.
