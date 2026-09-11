# BA Rules

**Domain:** BA kit (`/ba:` namespace) — applies to all BA skills, commands, and workflows.

## 1. Every requirement cites a source, or is labeled `[UNVERIFIED]`

No exceptions. Three legal `source:` forms: `path/to/file.ts:88` · `doc:<file> p.N` · the literal `[UNVERIFIED]`. In-house precedent: `seo-drift` reports "no baseline exists" rather than inventing one — same posture, never fabricate a source. Consequence: an unsourced entity is reported by `traceability.cjs gap` under `unsourced` and blocks sign-off.

## 2. Confidence label on every entity

`confidence: high|med|low`, exactly those three tokens, in every entity's frontmatter. `high` = a citation the reader can open · `med` = inferred from a cited artifact · `low` = inferred with no citation, and therefore also `[UNVERIFIED]`.

## 3. Draft-default on every external write

Jira, Confluence, WordPress. Dry-run is the default; a live write needs an explicit flag **and** a confirmation in the same turn. Precedent: /ck:tickets is draft-only, publishing opt-in behind a named parent issue. No bidirectional sync (D-3).

The BA→dev handoff (entities → tickets) needs the `engineer` kit installed in the same project — `ba` alone ships no tickets command.

## 4. Every diagram must compile before it ships

Render gate. No renderer available ⇒ ship the source, label it `[UNRENDERED]`, never present it as verified. Same posture as rule 1.

## 5. Say "Read the skill file", never "Activate the skill"

Skills under `.claude/skills/ba/` sit at group depth and are **not registered**; `Skill(skill: "traceability")` returns `Unknown skill`. Measured; see the root `CLAUDE.md`. Quote the canonical form verbatim so it can be copied, with the target counted from `.claude/workflows/`:

**Read the `traceability` skill file** ([.claude/skills/ba/traceability/SKILL.md](../skills/ba/traceability/SKILL.md))

**Read the `ba-context` skill file** ([.claude/skills/ba/ba-context/SKILL.md](../skills/ba/ba-context/SKILL.md))

## 6. Hard-fail pre-flight

Every `/ba:` command verifies `plans/ba-context.md` before doing anything; absent ⇒ emit exactly:

```
❌ BA context not found at plans/ba-context.md
```

Direct to `/ba:plan`, exit. **The single exception is `/ba:plan`, which creates the hub — so `/ba:plan` carries no pre-flight block at all.** Stating the exception *here* is what stops a command file containing a pre-flight that excepts itself (the defect measured in the marketing kit's plan command).

## 7. Output language

(D-4) Vietnamese prose bodies, English artifact keywords. Frozen tokens — the nine kinds and nothing else (D-10): `PRD-###` `SRS-###` `EPIC-###` `FR-###` `NFR-###` `UC-###` `US-###` `AC-###.#` `TC-###`, plus `Given`/`When`/`Then`, `Actor:`, `Precondition:`, `source:`, `confidence:`. Reason: keeps generated ACs and test cases wireable to BDD/Playwright and to Jira.

## 8. Storage: one file per entity; the index is derived

Entity files under `plans/ba/<project>/entities/<ID>.md` are the source of truth; `traceability.derived.json` is regenerated and git-ignored; never hand-edit it. One entity per file. Precedent: `to-tickets`. See the `traceability` skill file (rule 5) for the contract.

- `plans/ba/<project>/deliverables/{PRD-001.md,SRS-001.md}` are **committed** (D-11), not a cache — regenerate them with `/ba:spec compose` before every commit that touches an entity; never hand-edit a rendered deliverable, the next `compose` run discards the edit and the loss lands in git history looking like an intentional revert of a signed document.

## 9. Quy trình chuẩn

The kit's primary workflow — the BA→dev chain, in this order. **`gap` exit 0 is the handover gate**: a spec with orphans or unsourced entities is not handed over.

```
/ba:plan          → plans/ba-context.md
/ba:prd           → PRD-001 + EPIC-*
/ba:spec          → FR / NFR / UC / US / AC / TC entities
/ba:qc gap        → (gate: exit 0 before handing over)
/ba:spec compose  → plans/ba/<project>/deliverables/{PRD-001.md, SRS-001.md}   ← COMMITTED
/ck:tickets plans/ba/<project>/deliverables/SRS-001.md      → tickets
/ck:cook    plans/<YYMMDD-HHmm>-<slug>/tickets/NN-*.md      → code
```

Three seam facts, verified on disk, that a user otherwise discovers the hard way:

1. **The tickets do not land next to the spec.** For a non-plan source, /ck:tickets creates its own `plans/<YYMMDD-HHmm>-<slug>/` and writes `tickets/` there — it does not invent a `plan.md` nobody wrote. The BA artifacts and the tickets live in two plan dirs.
2. **A ticket sliced from a spec is thinner than one sliced from a plan.** It carries the acceptance criteria (that is why `compose` nests every `AC-###.#` under its US) but not file paths or blast radius — a BA spec legitimately does not know them.
3. **So the realistic chain has one more step.** Run /ck:scout (or /ck:plan) between tickets and cook when the area is cold, or let cook's Stage 0 ask its one question — touchpoints. The spec is a first-class ticket source with no conversion step; it is **not** a fully automatic BA→code pipeline, and nothing in this kit claims otherwise.

/ck:tickets and /ck:cook ship with the `engineer` kit — install it in the same project (`ck init --kit engineer`, or `--kit both`). `ba` alone stops at the committed deliverables.

## 10. Không xây lại cái đã có

What the software kit already owns, in one place — ask for these there, not here (the capability map carries the full redirect table):

- research → /ck:research
- design, wireframes → /ck:design
- tracker publishing → /ck:tickets --jira (draft-default, rule 3)
- kanban → the `plans-kanban` skill
- knowledge graph → the `gkg` skill
- test-case methodology → the `scenario` skill: `/ba:spec tc` reads `.claude/skills/software/scenario/SKILL.md` (shipped with `ba` via `requires.shared`) instead of carrying a second method
- implementation → /ck:cook

## 11. Cross-references

- `.claude/skills/ba/traceability/SKILL.md` — traceability spine contract (entity kinds, derived-index rebuild, gap report)
- `.claude/skills/ba/ba-context/SKILL.md` — context hub bootstrap (`plans/ba-context.md`)
- `.claude/skills/ba/README.md` — BA kit landing page
- `.claude/skills/ba/capability-map.md` — 55-capability map, single source (rule 5 example)
- `.claude/scripts/ba/traceability.cjs` — spine CLI (`index` / `gap` / `validate` / `compose`)
- `.claude/commands/ba/qc.md` — `/ba:qc gap`, the handover gate (rule 9)
- `.claude/skills/software/scenario/SKILL.md` — test-scenario methodology read by `/ba:spec tc` (shipped via `requires.shared`)
- `.claude/workflows/development-rules.md` — shared engineering rules (required by `requires.shared`)
