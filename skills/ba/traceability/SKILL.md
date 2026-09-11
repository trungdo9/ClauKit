---
name: traceability
description: Assign a stable id to every business-analysis requirement and record its parent graph as one markdown file per entity, so gap/doc-drift/CR-impact/dashboard/knowledge-graph views can all be built off one index instead of five bespoke features. Use when authoring or validating a PRD/SRS/EPIC/FR/NFR/UC/US/AC/TC entity, before signing off a deliverable, or before `/ba:qc gap`.
license: MIT
---

# Traceability

The spine is a **stable id per requirement plus a machine-readable parent graph**. It makes five wave-2 views possible without any of them becoming its own bespoke feature (defect D1 the wave-0 build refuses to repeat): `gap` (orphans + unsourced), `doc-drift` (composed deliverable vs. entity tree), `cr` (change-request impact — what a parent edit reaches), `dashboard` (entity status at a glance), `kg` (knowledge-graph rendering of the same edges). All five read one index; none re-derives the graph itself.

## Storage: one file per entity, and why

Source of truth is **one markdown file per entity** under `plans/ba/<project>/entities/<ID>.md`. `traceability.derived.json` is the **derived** index — regenerated from the entity files, never hand-authored.

Per-entity files git-merge cleanly; a monolithic index is the hottest write target in the kit and would need a migration the moment a second BA appears. Storing one file per entity buys multi-BA support later with zero format migration and zero locking now.

Precedent: `to-tickets` — *"one file per ticket, never one combined file"*. The deliberate divergence: a ticket file uses a `# NN: title` body because humans and `cook` read it; an entity file uses YAML frontmatter because a script indexes it, not a human skimming a list.

## D-4 binds the composed deliverable, not storage

The wave-1 composer renders an entity into D-4's exact block: `## FR-012 — …`, then `**Actor:** … **Precondition:** …`, then `**source:** … **confidence:** …`, then the Given/When/Then body. All four D-4 fields survive verbatim in what a client signs — storage just keeps them in frontmatter so the index needs no body parsing. See `references/entity-template.md` § "How this renders" for the FR-012 example worked both ways.

## The contract — if you generate a BA entity, you MUST

- Use exactly the 8 frontmatter keys required for its kind, plus `out_of_scope` (required on `EPIC`) and `touches` (optional on `FR`/`US`) where they apply — full table in `references/id-scheme.md`.
- Name the file `<id>.md`, filename identical to `id`.
- Shape the body per `references/entity-template.md`: Vietnamese prose, English keywords (`Actor:`, `Precondition:`, `Given`/`When`/`Then`).

## The three helper subcommands

```
node .claude/scripts/ba/traceability.cjs index    <project-dir> [--json]
node .claude/scripts/ba/traceability.cjs gap      <project-dir> [--json]
node .claude/scripts/ba/traceability.cjs validate <project-dir> [--json]
```

| exit | meaning |
|---|---|
| `0` | clean — `index` always exits 0 (indexing is not a verdict); `gap`/`validate` exit 0 when there is nothing to report |
| `1` | findings — `gap` found an orphan or an unsourced entity; `validate` found a violation |
| `2` | usage error — bad action, missing `project-dir`, or a `project-dir` with no `entities/` subdir |

## The index is derived — never hand-edit it

`traceability.derived.json` is git-ignored (`plans/**/*.derived.json`) and regenerable byte-for-byte from the entity tree, aside from its `generated` timestamp. Edit the entity file, then re-run `index`. A hand-edited derived file is itself an anti-pattern below — the next `index` run silently overwrites it anyway.

## Anti-patterns (auto-reject)

- An entity with no `source:` and no `[UNVERIFIED]`.
- A filename that disagrees with its `id`.
- An `AC` whose numeric prefix differs from its declared parent's.
- An item kind (`EPIC`/`FR`/`NFR`/`UC`/`US`/`AC`/`TC`) with no `doc:`.
- A document kind (`PRD`/`SRS`) that carries a `doc:`.
- A hand-edited `traceability.derived.json`.
- More than one entity per file.

## References

- `references/id-scheme.md` — the 9 kinds, the two id regexes, the ten-key frontmatter table (single source; `spine-parse.cjs` implements it, never restates it in prose).
- `references/entity-template.md` — the binding entity shape, one worked example per kind, and the storage → deliverable rendering.
- **Read the `business-analysis-rules` workflow** ([.claude/workflows/business-analysis-rules.md](../../../workflows/business-analysis-rules.md)) for the kit-wide rules this skill's checks enforce.
- `/ba:plan` bootstraps the context hub every `/ba:` command reads first ([.claude/commands/ba/plan.md](../../../commands/ba/plan.md)).
