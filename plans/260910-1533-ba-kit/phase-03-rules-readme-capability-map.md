# Phase 03 — Cross-cutting rules + kit README + capability map (55↔12)

**Depends on:** 01 (the trees exist).

**Blocks:** 07, 08.
**Why it is early:** every other `ba` file cites these rules, and the manifest cannot ship a workflow that does not exist.

**Interfaces**
- Consumes: phase 04 (the tree exists). Phase 09 appends `## 9. Template versioning` to the same file; **this phase writes §§ 1–8 and § 10 and must leave a gap at 9.** Whichever runs second must not renumber the other's sections.
- Produces:
  - `.claude/workflows/business-analysis-rules.md` §§ 1–8 — cited by `.claude/commands/ba/plan.md` (03) and every wave 1–4 command.
  - `.claude/skills/ba/README.md` — the SHIPPED kit landing page (distinct from the repo-internal `README.md` at the tree root, phase 01 task 1.5).
  - `.claude/skills/ba/capability-map.md` — **the single source for the 55↔12 mapping** (D-5 item 4). README and any landing page **point at it and never restate it**.
  - Constant reused downstream: the hard-fail string, **verbatim** — `❌ BA context not found at plans/ba-context.md`. Phase 03's command reproduces it byte-for-byte.

---

## Task 3.1 — CREATE (or extend) `.claude/workflows/business-analysis-rules.md` §§ 1–8

Shape mirrors `.claude/workflows/marketing-rules.md`: numbered `##` rules, cross-references last.

Header:
```markdown
# BA Rules

**Domain:** BA kit (`/ba:` namespace) — applies to all BA skills, commands, and workflows.
```

**`## 1. Every requirement cites a source, or is labeled `[UNVERIFIED]`** — no exceptions. The three legal `source:` forms: `path/to/file.ts:88` · `doc:<file> p.N` · the literal `[UNVERIFIED]`. In-house precedent by name: `seo-drift` reports `[NO BASELINE]` rather than inventing one. Consequence: an unsourced entity is reported by `traceability.cjs gap` under `unsourced` and blocks sign-off.

**`## 2. Confidence label on every entity`** — `confidence: high|med|low`, exactly those three tokens, in every entity's frontmatter. `high` = a citation the reader can open · `med` = inferred from a cited artifact · `low` = inferred with no citation, and therefore also `[UNVERIFIED]`.

**`## 3. Draft-default on every external write`** — Jira, Confluence, WordPress. Dry-run is the default; a live write needs an explicit flag **and** a confirmation in the same turn. Precedent: `/ck:tickets` is draft-only, publishing opt-in behind a named parent issue. No bidirectional sync (D-3).

**`## 4. Every diagram must compile before it ships`** — render gate. No renderer available ⇒ ship the source, label it `[UNRENDERED]`, never present it as verified. Same posture as rule 1.

**`## 5. Say "Read the skill file", never "Activate the skill"`** — skills under `.claude/skills/ba/` sit at group depth and are **not registered**; `Skill(skill: "traceability")` returns `Unknown skill`. Measured; see the root `CLAUDE.md`. Quote the canonical form verbatim so it can be copied, with the target counted from `.claude/workflows/`:
`**Read the `traceability` skill file** ([.claude/skills/ba/traceability/SKILL.md](../skills/ba/traceability/SKILL.md))`

**`## 6. Hard-fail pre-flight`** — every `/ba:` command verifies `plans/ba-context.md` before doing anything; absent ⇒ emit exactly `❌ BA context not found at plans/ba-context.md`, direct to `/ba:plan`, exit. **The single exception is `/ba:plan`, which creates the hub — so `/ba:plan` carries no pre-flight block at all.** Stating the exception *here* is what stops a command file containing a pre-flight that excepts itself (the defect in `.claude/commands/mk/plan.md`).

**`## 7. Output language`** (D-4) — Vietnamese prose bodies, English artifact keywords. Enumerate the frozen tokens — **the nine kinds and nothing else** (D-10): `PRD-###` `SRS-###` `EPIC-###` `FR-###` `NFR-###` `UC-###` `US-###` `AC-###.#` `TC-###`, `Given`/`When`/`Then`, `Actor:`, `Precondition:`, `source:`, `confidence:`. Reason, stated: it keeps generated ACs and test cases wireable to BDD/Playwright and to Jira.

**`## 8. Storage: one file per entity; the index is derived`** — entity files under `plans/ba/<project>/entities/<ID>.md` are the source of truth; `traceability.derived.json` is regenerated and git-ignored; never hand-edit it. One entity per file. Precedent: `to-tickets`. Points at the `traceability` skill for the contract.

**`## 10. Cross-references`** (§ 9 is phase 09's) — backticked, root-relative, **only paths the `ba` kit installs**: `.claude/skills/ba/traceability/SKILL.md` · `.claude/skills/ba/ba-context/SKILL.md` · `.claude/skills/ba/README.md` · `.claude/skills/ba/capability-map.md` · `.claude/scripts/ba/traceability.cjs` · `.claude/workflows/development-rules.md`.

> Never backtick `.claude/skills/software/…` or `.claude/scripts/ck/…` — `ba` ships neither, and *"no shipped doc names a .claude/ path the install does not have"* fails on it.

## Task 3.2 — CREATE `skills/ba/README.md`

Kit landing page, shaped like ClauKit's `skills/marketing/README.md`. **Prose paths in backticks, root-relative — no markdown links**, so nothing can dangle.

1. `# KitForge BA Kit` + one-line positioning.
2. **`## What's included`** — wave-0 truth only, no forward promise in the present tense: 1 command (`/ba:plan`), 2 skills (`ba-context`, `traceability`), 1 workflow, 1 helper. A `> Waves 1–4 add the remaining 11 commands — see the capability map.` note is fine; a table row claiming they exist is not.
3. **`## Capabilities`** — **one paragraph and a pointer to `.claude/skills/ba/capability-map.md`.** Do not restate the 55 rows here: two copies drift, and the map has a machine-checked completeness metric that only works with one source.
4. **`## Quick start`** — `ck init --kit ba`, then `/ba:plan`.
5. **`## Hard-fail rule`** — one paragraph → `.claude/workflows/business-analysis-rules.md` § 6.
6. **`## The traceability spine`** — 8–12 lines: entity files are the source of truth, `traceability.derived.json` is derived and git-ignored, the kind tables by example, the three helper subcommands with exit codes. Points at `.claude/skills/ba/traceability/SKILL.md`.
7. **`## Output language`** — D-4, two sentences.

## Task 3.3 — CREATE `skills/ba/capability-map.md` (D-5 item 4)

**A product artifact, not a docs nicety.** A buyer who is shown 55 features and handed 12 commands feels shorted; this file is the answer, and it is machine-checked.

**D-7 changes who it is written for.** The buyer ICP is wider than "BA" — PM, founder, product lead — so a row may not assume the reader knows what `SRS`, `FR`, `AC` or `UC` mean. **Same 55 rows, same 55→8+redirect mapping, plainer glosses.** Add a `Plain gloss` column: `SRS` → *"đặc tả chi tiết cho dev"*, `FR` → *"hệ thống phải làm được gì"*, `AC` → *"làm sao biết là xong"*, `UC` → *"kịch bản người dùng làm gì"*. The English artifact keyword stays (D-4 stands exactly as written — VI bodies + EN keywords, **no i18n**); the gloss sits beside it, it does not replace it. Same rule in `.claude/skills/ba/README.md` § Capabilities: name the outcome a buyer wants, not the acronym.

Structure — one table, exactly 55 body rows, plus one `## Deliberately not in this kit` table:

```markdown
# BA capability map — 55 capabilities, 12 commands

| # | Capability | Plain gloss | Command + action | Owner | Wave |
|---:|---|---|---|:--:|:--:|
| 1 | Sơ đồ quan hệ thực thể (Mermaid) | vẽ sơ đồ dữ liệu — bảng nào nối bảng nào | `/ba:diagram erd` | ba | W0 |
| 2 | Sơ đồ quan hệ thực thể (D2/dbdiagram) | như trên, định dạng khác | `/ba:diagram erd` (notation deferred) | ba | W1 |
| 3 | Nghiên cứu thị trường / đối thủ | tìm hiểu xem có nên làm không | `/ck:research` | **ck** | — |
| 4 | Thiết kế màn hình / wireframe | phác hoạ giao diện | `/ck:design` | **ck** | — |
…
| 55 | … | … | … | … | … |
```

Hard rules on this file, because the metric depends on them:
- **Exactly 55 body rows**, numbered `1`–`55` with no gaps.
- **Every `Plain gloss` cell is non-empty**, and contains no bare acronym without its expansion somewhere in the row (D-7 ICP rule).
- **Every `Command + action` cell begins with a backticked slash command** and names either one of the **8 BA-owned dispatchers** — `plan prd spec diagram qc reverse api export` (D-10 tightened 12 → 8) — **or a `/ck:` redirect**. Zero unmapped rows.
- **Redirect rows are first-class, not apologies.** Five capability groups are owned by the software kit and are cut, not deferred: `discover` → `/ck:research`, `screen` → `/ck:design`, `sync` → `/ck:tickets --jira`, `test` → folded into `/ba:spec tc`, `qc dashboard`/`kg` → `plans-kanban` / `gkg`. A redirect row still resolves the name, so **all 55 names resolve and `rows=55 unmapped=0` survives** — the target is simply a `/ck:` command for some of them. Add a `Owner` column: `ba` or `ck`.
- **`Wave` ∈ `W0 W1 W2 W3 W4` or `—` for a redirect row** (a `/ck:` capability ships already; it has no BA wave).
- Below it, `## Deliberately not in this kit` — 4 rows: `/delegate` → `/ck:team`, `/brainstorm` → `/ck:brainstorm`, `/ask` → `/ck:ask`, `/prototype-next` → `/ck:cook` handoff. Naming the replacement is what stops each being re-proposed, and it is the honest answer to "why isn't this here?".
- The three-way collisions the brainstorm flagged must land on distinct rows with distinct `--format` flags — `/erd`, `/d2-erd`, `/dbdiagram` all map to `/ba:diagram erd --format …`. That is the mapping's whole point (defect D2).

---

## Exit gate

**Exit gate:** `awk -F'|' '/^\| *[0-9]+ *\|/{n++; if ($5 !~ /`\//) bad++; if ($4 !~ /[^ ]/) nogloss++} END{print n, bad+0, nogloss+0}' .claude/skills/ba/capability-map.md` → `55 0 0`. Detail in Gate 1–4 below.

### Gate 1 — the rules file is complete and clean

```bash
cd <repo>
grep -c '^## ' .claude/workflows/business-analysis-rules.md
grep -c '^## ' .claude/workflows/business-analysis-rules.md  # 9 sections until phase 09 adds its own
grep -rn 'Activate the `' .claude/workflows/business-analysis-rules.md .claude/skills/ba/ ; echo "activate-hits=$?"
```
→ `9` sections (1–8 and 10; § 9 arrives with phase 09); `activate-hits=1` (grep found nothing).

### Gate 2 — no backticked path the `ba` kit will not ship

```bash
grep -ohE '`\.claude/[^`[:space:]]*\.(md|sh|js|cjs|json)`' \
  .claude/workflows/business-analysis-rules.md .claude/skills/ba/README.md .claude/skills/ba/capability-map.md | sort -u
```
→ every line is one of: `` `.claude/skills/ba/README.md` `` · `` `.claude/skills/ba/capability-map.md` `` · `` `.claude/skills/ba/ba-context/SKILL.md` `` · `` `.claude/skills/ba/traceability/SKILL.md` `` · `` `.claude/workflows/business-analysis-rules.md` `` · `` `.claude/workflows/development-rules.md` `` · `` `.claude/scripts/ba/traceability.cjs` `` · `` `.claude/commands/ba/plan.md` ``. **Any other line fails the phase.**

### Gate 3 — the 55↔12 completeness metric (D-5 item 4)

```bash
awk -F'|' '/^\| *[0-9]+ *\|/{n++; if ($5 !~ /`\//) bad++; if ($4 !~ /[^ ]/) g++} END{print "rows="n, "unmapped="bad+0, "no-gloss="g+0}' .claude/skills/ba/capability-map.md
grep -oE '`/ba:[a-z]+' .claude/skills/ba/capability-map.md | sort -u | wc -l
grep -cE '\| \*\*ck\*\* \|' .claude/skills/ba/capability-map.md
awk -F'|' '/^\| *[0-9]+ *\|/{print $6}' .claude/skills/ba/capability-map.md | grep -cvE ' *W[0-4] *'
grep -c '^| `/' .claude/skills/ba/capability-map.md
```
→ `rows=55 unmapped=0 no-gloss=0` · redirect rows **≥ 5** · distinct **`/ba:`** dispatchers **≤ 8** · third command prints `0` (every row has a valid wave) · fourth prints **4** (the cut table).

### Gate 4 — the README does not fork the map

```bash
grep -c '^| *[0-9]* *|' .claude/skills/ba/README.md
grep -c 'capability-map' .claude/skills/ba/README.md
```
→ first **0** (the README holds no numbered capability table); second **≥ 1** (it points at the map).
