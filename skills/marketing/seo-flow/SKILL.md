---
name: seo-flow
description: SEO workflow recipes — named, multi-step playbooks that chain SEO skills into a repeatable process. The flagship recipe is the full article-production pipeline (seo-writing); others cover audits, migrations, and recovery. Use to pick and run a standard SEO workflow end-to-end.
allowed-tools: Read, Write, Glob, Grep
---

# SEO Flow — Workflow Recipes

> Individual SEO skills are ingredients. A flow is a recipe — a named, ordered sequence that turns a goal ("write and publish an article", "recover a traffic drop") into a repeatable process with checkpoints.

## When this skill activates

**Implicit:** "run the full SEO article flow", "what's the process for [SEO goal]", "SEO workflow for X".
**Explicit:** "Use the seo-flow skill to [task]."
**Routed from:** `/mk:seo` when a multi-step workflow is needed.

## Scope

Covers:
- Selecting the right named recipe for an SEO goal.
- Chaining SEO skills with checkpoints + entry/exit gates.
- Resumable, inspectable multi-step processes.

Does NOT cover:
- The individual skill logic (each recipe delegates to real skills).
- Non-SEO marketing flows → `.claude/workflows/marketing-workflow.md`.

## Recipes

| Recipe | Goal | Delegates to | Entry point |
|---|---|---|---|
| **SEO Campaign** 🔁 | Closed loop: baseline → plan → write → publish → measure → optimize (repeat) | `.claude/workflows/seo-workflow.md` (7 phases, wraps [[seo-writing]]) | `/mk:seo campaign` |
| **Article Production** ⭐ | Seed keyword → published, optimized, interlinked article(s) | [[seo-writing]] (6 stages) | `/mk:seo write`, `/mk:seo plan` |
| **Site Content Audit** | Existing site → cluster map + gap/triage list | [[seo-writing]] playbook Phase 1–2, [[seo-audit]] | `/mk:seo audit` |
| **Full SEO Audit** | Technical + content + schema audit | [[seo]] orchestrator (parallel sub-skills) | `/mk:seo audit` |
| **Traffic Recovery** | Ranking drop → diagnose + fix plan | [[seo-drift]], [[seo-technical]], [[seo-content]] | `/mk:seo audit` |

> ⭐ **Article Production is the flagship.** It's a 6-stage assembly line (strategy → outline → write → optimize → media → publish) with a status machine, ported from a production n8n pipeline. See [[seo-writing]] for the full flow and the 100-article WordPress playbook.
> 🔁 **SEO Campaign is Article Production run as a campaign** — it adds the "before" (baseline audit + metrics) and the "after" (GSC/GA4 measurement, refresh/scale/kill decisions, optimize loop). Use it when the goal is *organic growth over cycles*, not a batch of articles.

## Recipe anatomy (why flows beat ad-hoc prompting)

Each recipe is:
- **Staged** — discrete steps with clear boundaries.
- **Gated** — a stage only starts when its entry condition is met (a status, an artifact).
- **Idempotent** — re-running a completed stage is a no-op; you can resume mid-flow.
- **Inspectable** — every stage writes an artifact (a plan, a brief, a draft) you can review before the next.

This is what makes SEO work at scale reliable instead of a black box — you can stop after planning, review a draft before publishing, or re-run one stage without redoing the rest.

## Key concepts

- **Recipe vs. skill** — a skill is knowledge; a recipe is a sequence of skills with checkpoints. `seo-flow` picks the recipe; the recipe drives the skills.
- **Checkpoint** — a human-review or gate point between stages (e.g. "review the plan before writing burns tokens").
- **Resumability** — because state lives in an artifact (the pipeline table), a flow survives interruption and picks up where it stopped.

## Output

- Recipe selection + the delegated skill's outputs (cluster, briefs, articles, published posts).
- Written under `plans/marketing/<site>/`.

## Cross-references

- `.claude/workflows/seo-workflow.md` — the SEO Campaign closed loop (7 phases)
- [[seo-writing]] — the flagship Article Production recipe (6 stages + playbooks)
- [[seo]] — the audit-side orchestrator
- [[seo-cluster]] · [[seo-content-brief]] · [[seo-content]] · [[seo-plan]] — skills the recipes chain
- `.claude/workflows/marketing-workflow.md` — the broader 10-phase marketing flow
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for KitForge. The Article Production recipe is the ClauKit-native port of a production n8n SEO pipeline — see [[seo-writing]].
