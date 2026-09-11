# Phase 07 — `/ba:diagram` — mermaid only

**Milestone A — wave 0 product.** **Depends on:** 02 (entities to read), 03 (rule 4, the render gate). **Blocks:** nothing.
**One command, one skill, four types, one notation.** D-10 cut D2/PlantUML/BPMN/DBML until a real project asks — which is also the honest answer to R3, since **zero renderers exist on this machine** (verified: `d2`, `plantuml`, `mmdc`, `dot` all absent).

**Interfaces**
- Consumes: entity files (02) or free text; `plans/ba-context.md` § 2 for actor names.
- Produces:
  - `.claude/commands/ba/diagram.md` — `sequence` · `flow` · `state` · `erd`
  - `.claude/skills/ba/diagramming/SKILL.md` + `references/mermaid-patterns.md`
  - Runtime: `plans/ba/<project>/diagrams/<type>-<slug>.md` (a fenced ```mermaid block plus a caption), **or** an inline block inside a composed document.

---

## Task 7.1 — CREATE `skills/ba/diagramming/SKILL.md`

- **Four types, and what each is for** — `sequence` (who calls whom, in order) · `flow` (activity/decision, with `subgraph` lanes standing in for swimlanes) · `state` (an entity's lifecycle — the `TRẢ_HÀNG → REFUND_APPROVED` shape D-4's example implies) · `erd` (data model). A type that does not answer a question in the spec should not be drawn.
- **Input is the spine first, free text second.** Given `FR-012`, read the entity and its `UC`/`US` children and draw from them, so the diagram and the spec cannot disagree. Free text is the fallback for a whiteboard moment, and what it produces carries `confidence: low` like anything else unsourced.
- **Why mermaid only** — Claude Artifacts render mermaid natively with no binary, GitHub renders it in markdown, and this machine has no renderer for anything else. One notation that always displays beats five that display sometimes. Other notations arrive **when a real project asks**, not before (YAGNI, and D-10 made it explicit).
- **The render gate (rule 4), and how it degrades.** Try `npx -y @mermaid-js/mermaid-cli` when available; **it is not installed here** and may be offline. So the gate is: syntax-check what can be checked locally, and when nothing can render, ship the source **labelled `[UNRENDERED]`**. Never present an unverified diagram as verified — the same posture `seo-drift` takes with `[NO BASELINE]`. **This is the whole of rule 4's teeth**, so state it here, not only in the rules file.
- Anti-patterns: a 40-node flow nobody can read · a sequence diagram with no actor from `ba-context` § 2 · re-drawing what the composed SRS already says in prose.

## Task 7.2 — CREATE `references/mermaid-patterns.md`

One minimal, **known-good** block per type — the four that must compile — with the Vietnamese-label caveat stated: labels with diacritics belong in quotes (`A["Duyệt hoàn"]`), which is the single most common mermaid syntax failure for this kit's output. Plus the `[UNRENDERED]` header block, verbatim, so every degraded artifact looks identical.

## Task 7.3 — CREATE `.claude/commands/ba/diagram.md`

```markdown
---
description: BA diagrams in mermaid — sequence, flow, state, erd; from entities or free text
argument-hint: sequence|flow|state|erd <FR-###|free text> [<project-slug>]
---
```

Hard-fail pre-flight (rule 6). Read the `diagramming` skill file; when the argument is an entity id, read the `traceability` skill file and the entity first. Output path and the render-gate outcome are both reported.

---

## Exit gate

**Exit gate:** every generated block parses as mermaid, or is labelled `[UNRENDERED]` — no third state. `grep -L '```mermaid' plans/ba/demo/diagrams/*.md` → empty. Detail in Gate 1–3 below.

### Gate 1 — all four types generate, and each carries a fenced block

```bash
ls plans/ba/demo/diagrams/ | wc -l
for T in sequence flow state erd; do
  f=$(ls plans/ba/demo/diagrams/${T}-*.md 2>/dev/null | head -1)
  test -n "$f" && grep -q '```mermaid' "$f" && echo "OK $T" || echo "MISSING $T"
done
```
→ **4** files, `OK` for all four types, zero `MISSING`.

### Gate 2 — the render gate is honest in both directions

```bash
command -v mmdc >/dev/null && echo "renderer=present" || echo "renderer=absent"
grep -l 'UNRENDERED' plans/ba/demo/diagrams/*.md | wc -l
```
→ **On this machine `renderer=absent`, so the `[UNRENDERED]` count must equal 4** — every diagram labelled, none claiming verification it did not get. With a renderer present the count must be **0** and each block must have compiled. **A file that is neither compiled nor labelled fails this gate**; that third state is exactly what rule 4 exists to forbid.

### Gate 3 — diacritic labels do not break the syntax

```bash
grep -hoE '^\s*[A-Za-z0-9_]+\[[^]]*\]' plans/ba/demo/diagrams/flow-*.md \
  | grep -P '[À-ỹ]' | grep -cv '\["'
```
→ `0` — every node label containing Vietnamese diacritics is quoted. This is the failure that would otherwise make "mermaid always renders" false for this kit specifically, which is the whole basis for choosing it.
