# Phase 05 — `/ba:prd` — product definition

**Milestone A — wave 0 product.** **Depends on:** 02 (spine), 03 (rules), 04 (context hub). **Blocks:** 06 (`spec` derives FRs from EPICs).
**The first command that produces a BA artifact.** Everything before it is scaffolding; this is where the kit starts earning its place.

**Interfaces**
- Consumes: `.claude/scripts/ba/traceability.cjs` (validate/index) · `plans/ba-context.md` (actors, glossary, sources) · the entity contract from phase 02.
- Produces:
  - `.claude/commands/ba/prd.md` — actions `prd` · `roadmap`
  - `.claude/skills/ba/prd/SKILL.md` + `references/prd-structure.md`
  - Runtime: `plans/ba/<project>/entities/PRD-001.md` + `EPIC-001.md…EPIC-NNN.md`
- Downstream contract: **phase 06's `spec fr` reads the `EPIC-*` entity set and nothing else** — an FR's `parents` must name an EPIC that exists, so `/ba:prd` is what makes `/ba:spec` possible.

---

## Task 5.1 — CREATE `skills/ba/prd/SKILL.md`

Frontmatter (`name: prd`, `description`, `license`). Body ≤ 130 lines, the methodology a BA follows — not a template dump.

- **What a PRD answers, in order:** the problem, who has it, what changes for them, what is explicitly out. Four questions, and a section that answers none of them does not belong.
- **Where the content comes from** — `plans/ba-context.md` § 1 (scope), § 2 (actors), § 4 (sources), § 6 (glossary). **Rule 1 applies from the first line:** every claim about the current state carries a `source:` or ships `[UNVERIFIED]`. A PRD is the document most likely to be written from the BA's head; say so.
- **EPIC decomposition** — one EPIC per user-visible capability, sized so its FRs fit on one page. Anti-patterns named: an EPIC per team, an EPIC per screen, an EPIC that is one FR wearing a hat.
- **Every EPIC declares `out_of_scope`, and the skill says why in one line:** it becomes `/ck:cook` Stage-0 item 3 (scope boundary) for every ticket sliced from that EPIC's FRs. A BA who writes "TBD" there has moved the scope argument downstream to a developer who has less context to settle it. `validate` rejects an EPIC without it.
- **The `roadmap` action** — Now / Next / Later over the existing EPIC set. **It creates no entities**; it orders the ones `prd` made. Say this explicitly, because "roadmap" invites inventing work.
- **Confidence discipline** — a PRD written before any interview is `confidence: low` throughout, and that is a legitimate state, not a failure. It becomes `med`/`high` as sources land.
- Reading order: `references/prd-structure.md`.

Links from `.claude/skills/ba/prd/`: `../traceability/SKILL.md`, `../ba-context/SKILL.md`, `../../../workflows/business-analysis-rules.md`.

## Task 5.2 — CREATE `skills/ba/prd/references/prd-structure.md`

The `PRD-001` entity body shape (frontmatter is phase 02's contract, unchanged), Vietnamese prose + English keywords (D-4):

```markdown
# PRD-001 — <tên sản phẩm>

## 1. Vấn đề        (ai đang chịu, chịu thế nào, bằng chứng)
## 2. Người dùng     (Actor + nhu cầu, khớp ba-context § 2)
## 3. Mục tiêu       (kết quả đo được, không phải tính năng)
## 4. Phạm vi        (Trong / Ngoài — bảng hai cột)
## 5. EPIC           (bảng: EPIC-### | tên | giá trị mang lại)
## 6. Giả định & rủi ro
```

Plus a worked `EPIC-001.md` entity, ≤ 12 lines, and the `roadmap` output shape — a three-column table over existing EPIC ids, written into `PRD-001.md` § 7, **not** a new entity.

## Task 5.3 — CREATE `.claude/commands/ba/prd.md`

```markdown
---
description: BA product definition — PRD + EPIC breakdown, or roadmap over the existing EPICs
argument-hint: [prd|roadmap] [<project-slug>]
---
```

- **Pre-flight (HARD FAIL):** no `plans/ba-context.md` ⇒ emit exactly `❌ BA context not found at plans/ba-context.md`, direct to `/ba:plan`, exit. (Rule 6; `/ba:plan` is the only exception, and this is not it.)
- **Workflow:** read the `prd` skill file, then the `traceability` skill file before writing any id.
- **`prd`** — interview or scaffold → write `PRD-001.md` + one `EPIC-###.md` per capability → run `traceability.cjs validate`, and **refuse to report success while it exits 1**. A generator that writes invalid entities is worse than one that writes none, because the next command inherits them.
- **`roadmap`** — read the EPIC set, order it, write § 7 of `PRD-001.md`. Creates no entities; re-running replaces § 7 only.
- `description` **≤ 110 bytes**; "Read the … skill file" phrasing with `../../skills/ba/…` targets; no backticked path the kit does not ship.

---

## Exit gate

**Exit gate:** `node .claude/scripts/ba/traceability.cjs validate plans/ba/demo && node .claude/scripts/ba/traceability.cjs index plans/ba/demo` → `exit=0` and `✓ indexed N node(s)` with **1 PRD + ≥ 3 EPIC**. Detail in Gate 1–3 below.

### Gate 1 — the entities are valid and complete

```bash
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "validate=$?"
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json \
  | node -e 'const i=JSON.parse(require("fs").readFileSync(0));
      const k=n=>i.nodes.filter(x=>x.kind===n).length;
      console.log("PRD="+k("PRD"), "EPIC="+k("EPIC"), "orphans="+i.orphans.length,
                  "unsourced="+i.unsourced.length,
                  "epics-missing-scope="+i.nodes.filter(x=>x.kind==="EPIC"&&!x.out_of_scope).length)'
```
→ `validate=0` · `PRD=1` · `EPIC>=3` · `orphans=0` · `unsourced=0` · **`epics-missing-scope=0`**. Every EPIC's `parents` is `[PRD-001]`; nothing is unsourced, because rule 1 has no exception for the first document.

### Gate 2 — `roadmap` orders and does not invent

```bash
B=$(node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e 'console.log(JSON.parse(require("fs").readFileSync(0)).nodes.length)')
# run `/ba:prd roadmap`
A=$(node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e 'console.log(JSON.parse(require("fs").readFileSync(0)).nodes.length)')
echo "before=$B after=$A"; grep -c '^## 7' plans/ba/demo/entities/PRD-001.md
```
→ `before` **equals** `after` (roadmap creates **zero** entities) and § 7 exists exactly once. Re-running replaces it rather than appending a second.

### Gate 3 — command hygiene

```bash
awk '/^description:/{print length($0)-13}' .claude/commands/ba/prd.md
grep -c '❌ BA context not found at plans/ba-context.md' .claude/commands/ba/prd.md
grep -rn 'Activate the `' .claude/commands/ba/prd.md .claude/skills/ba/prd/; echo "activate=$?"
```
→ description **≤ 110**; the hard-fail string present **exactly once**, byte-identical to rule 6; `activate=1` (no hits).
