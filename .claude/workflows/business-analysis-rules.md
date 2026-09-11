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

## 10. Cross-references

- `.claude/skills/ba/traceability/SKILL.md` — traceability spine contract (entity kinds, derived-index rebuild, gap report)
- `.claude/skills/ba/ba-context/SKILL.md` — context hub bootstrap (`plans/ba-context.md`)
- `.claude/skills/ba/README.md` — BA kit landing page
- `.claude/skills/ba/capability-map.md` — 55-capability map, single source (rule 5 example)
- `.claude/scripts/ba/traceability.cjs` — spine CLI (`build` / `gap` / `check`)
- `.claude/workflows/development-rules.md` — shared engineering rules (required by `requires.shared`)
