# Phase 06 — `/ba:spec` — the spec core, and `compose`

**Milestone A — wave 0 product.** **Depends on:** 05 (EPICs to derive from). **Blocks:** 08 (the handoff chain composes here).
**The centre of the kit.** Six entity-writing actions plus `compose`, which renders the signed deliverable. **D-4's template becomes real in this phase**, so the template lives here rather than in a reference nobody opens.

**Interfaces**
- Consumes: `EPIC-*` entities (05) · the entity contract + `traceability.cjs` (02) · `plans/ba-context.md` (04).
- Produces:
  - `.claude/commands/ba/spec.md` — actions `fr` `nfr` `uc` `us` `ac` `tc` `compose`. **`compose` renders BOTH deliverables** — `PRD-001.md` and `SRS-001.md` — because it is one pass over one index; giving `/ba:prd` its own compose action would duplicate the renderer for no gain. (D-11 named both files without saying which command makes them; this is that decision.)
  - `.claude/skills/ba/spec/SKILL.md` + `references/{entity-bodies.md,compose-format.md}`
  - Runtime entities under `entities/`: `SRS-001.md`, `FR-*`, `NFR-*`, `UC-*`, `US-*`, `AC-*.*`, `TC-*`
  - **Runtime deliverables — COMMITTED: `plans/ba/<project>/deliverables/{PRD-001.md, SRS-001.md}`** — the artifacts a client signs (D-11), and the **input `/ck:tickets` consumes** (phase 08). See § Task 6.5.
- Downstream contract: `compose` output carries every `AC-###.#` inline under its parent, because `to-tickets` requires a ticket to carry acceptance criteria and can only get them from what it read.

---

## Task 6.1 — CREATE `skills/ba/spec/SKILL.md`

Body ≤ 160 lines. The derivation chain is the content:

```
EPIC-001 ──> FR-012 ──> UC-004        (how the actor does it)
                    └─> US-007 ──> AC-007.1 ──> TC-021
             NFR-003 (parents PRD-001 or an EPIC)
```

- **One action per kind, and each derives from the one above it.** A `us` run with no FRs is a spec written from imagination — refuse and say which action to run first. This ordering *is* the methodology; without it the kit is a template pile.
- **`tc` derives from AC and nothing else, and it re-uses rather than rewrites.** D-10 folded the `test` dispatcher into this action. **Read `.claude/skills/software/scenario/SKILL.md` § Design Process and § Scenario Template** (verified present at `:39` and `:48`) instead of carrying a method here — that skill already covers happy / error / edge / recovery paths (§ Scenario Types, `:26`) and the layer→tool mapping (§ Tool Mapping, `:62`). This skill contributes exactly one thing on top: **every TC's `parents` names the `AC` it exercises**, which is what makes coverage queryable. `tc` is the one action needing a file the kit does not author — which is exactly why `scenario/SKILL.md` is a **`requires.shared`** entry in `ba.json` (phase 01): it is link-clean, so it travels alone.
- **Rule 1 and rule 2 at the point of generation** — an FR with no `source:` ships `[UNVERIFIED]` and `confidence: low`, never a plausible-looking citation. This is where hallucinated requirements would enter (R1 🔴), and the only defence is that the template has nowhere to put an unsourced claim quietly.
- **AC numbering** — `AC-###.#` inherits its parent's number; the validator enforces it. State the allocation rule: assign the AC id **when its parent exists**, never before.
- Anti-patterns: an FR that is three FRs · an AC that is not pass/fail · a UC with no `Precondition:` · a TC that restates its AC instead of exercising it · editing `deliverables/SRS-001.md` by hand — it is regenerated, so a hand-edit is lost on the next `compose` **and** the file is committed, so the loss lands in git history looking like an intentional revert.

## Task 6.2 — CREATE `references/entity-bodies.md`

One worked body per item kind, ≤ 12 lines each, Vietnamese prose + English keywords. `FR` uses D-4's fields verbatim (`**Actor:**`, `**Precondition:**`); `US` uses `Là <actor>, tôi muốn <X>, để <Y>`; `AC` is Given/When/Then; `TC` is `Bước / Dữ liệu / Kết quả mong đợi`.

## Task 6.3 — CREATE `references/compose-format.md` — **D-4, binding**

`compose` renders each entity into exactly this block. Copy verbatim:

```markdown
## FR-012 — Duyệt đơn hoàn tiền
**Actor:** CSKH   **Precondition:** đơn ở TRẢ_HÀNG
**source:** src/order/refund.service.ts:88   **confidence:** high

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED
```

Document order: `# SRS-001 — <title>` → § Phạm vi → FR (ascending) → NFR → UC → US **with its ACs nested beneath it** → TC. Each AC renders as `### AC-007.1 — <title>` under its parent US.

**Every rendered FR/US block carries all five `/ck:cook` Stage-0 items**, because `--from-plan` extracts them from this file and `[ASSUMED]`-logs whatever is missing:

| item | rendered as |
|---|---|
| expected output | the `## FR-### — <title>` heading + body |
| acceptance criteria | nested `### AC-###.#` Given/When/Then blocks |
| scope boundary | `**Out of scope:**` — from the FR's `out_of_scope`, else inherited from its EPIC's |
| constraints | `**Constraints:**` — the `NFR-*` reachable from the same EPIC, listed by id + title |
| touchpoints | `**Touches:**` — `source:` when it is a real `file:line`, else `touches:`, else `[UNKNOWN]` |

Three of the five were already there; the emphasis is that **compose must not drop them into prose** — `--from-plan` reads a file, so a bolded labelled line is the difference between a satisfied gate item and an `[ASSUMED]` one.

**Header, and no timestamp.** The file states that it is generated by `/ba:spec compose` and must not be hand-edited — a reader who receives the `.md` by email needs to know where corrections go. It carries **no generation timestamp**: the deliverable must be byte-stable over an unchanged entity tree (task 6.5), and generation metadata lives in the index instead.

## Task 6.4 — CREATE `.claude/commands/ba/spec.md`

```markdown
---
description: BA specification — FR/NFR/UC/US/AC/TC entities, and compose to a signed SRS
argument-hint: fr|nfr|uc|us|ac|tc|compose [<project-slug>]
---
```

Hard-fail pre-flight (rule 6). Each writing action: read the `spec` skill file → read the `traceability` skill file → write entities → run `validate`, refuse success while it exits 1. `compose` additionally runs `index` first, so the document and the graph are rendered from one read.

## Task 6.5 — The composed deliverables **are committed** (D-11)

`deliverables/PRD-001.md` and `deliverables/SRS-001.md` go into git. **This inverts the earlier ruling in this plan**, which treated them as regenerable caches and ignored them. Four reasons, each decisive alone:

1. **Exact bytes are the contract.** The composer will change between waves; a regenerated copy is then a different document with no record of what was approved. *"Which version did the client sign?"* is a real BA failure mode, and ignoring the file guarantees it.
2. **A committed ticket must not point at an ignored source.** `/ck:tickets` writes committed tickets that reference their source — exactly the *"an ignored report is a 404 in a PR body"* failure the repo's own root `.gitignore` comment guards against.
3. **Repo precedent.** `plan.md`, `phase-*.md`, `reports/*.md` are committed; only artifacts regenerated from git on demand are ignored. **A deliverable is a release, not a cache.**
4. **Deferring the deliverable to wave 4 defeats D-10** — a BA must hand over an SRS in wave 0.

**The two-sources-of-truth concern gets determinism, not deletion:**

- **`compose` is byte-stable over an unchanged entity tree.** Same requirement the index already carries. **No timestamp in the deliverable** — that is what makes byte-stability achievable, and generation metadata belongs in the index.
- **Regenerate before commit; never hand-edit.** Already an anti-pattern in this skill; it now protects a committed file, so state it as a rule in `.claude/workflows/business-analysis-rules.md` rather than only as advice.
- **Wave-2 `qc drift` gets its first real job:** `compose(entities) == committed bytes`, else DRIFT. Record it here as the wave-2 requirement this task creates.

**And committing strengthens reason 1 rather than weakening it:** a composer change that rewrites a signed document shows up as a **diff in a commit**. Ignoring the file is what would have made that rewrite invisible. Git history *is* the record of what was signed.

**Ignored, still:** `traceability.derived.json` alone, by ClauKit's generic `plans/**/*.derived.json` (phase 09 task 9.4) — **JSON-only, and now sufficient**; D-11 withdrew the widening to `*.derived.*`. Wave 0 has no installer, so `/ba:plan` prints **one** line at hub creation when it is absent from the project's root `.gitignore`.

**Not in `entities/`.** The indexer scans `<projectDir>/entities/*.md` non-recursively (phase 02 task 2.5), so `deliverables/` is outside the scan by construction — `deliverables/SRS-001.md` cannot be mistaken for the `entities/SRS-001.md` document entity that shares its basename. That is what the separate directory buys.

---

## Exit gate

**Exit gate:** `node .claude/scripts/ba/traceability.cjs validate plans/ba/demo` → `exit=0`, then `grep -c '^\*\*source:\*\*' plans/ba/demo/deliverables/SRS-001.md` equals the FR+NFR+UC+US count from the index. Detail in Gate 1–5 below.

### Gate 1 — the derivation chain holds

```bash
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e '
 const i=JSON.parse(require("fs").readFileSync(0)), k=n=>i.nodes.filter(x=>x.kind===n);
 const id=new Map(i.nodes.map(n=>[n.id,n]));
 const bad=[];
 for (const n of i.nodes) for (const p of n.parents) {
   const par=id.get(p); if(!par) bad.push(n.id+"->"+p+" (missing)");
 }
 console.log("FR="+k("FR").length,"US="+k("US").length,"AC="+k("AC").length,"TC="+k("TC").length);
 console.log("broken-edges="+bad.length, "orphans="+i.orphans.length, "unsourced="+i.unsourced.length);'
```
→ every count **≥ 2**; `broken-edges=0`, `orphans=0`, `unsourced=0`.

### Gate 2 — AC prefixes and TC parentage are enforced, not merely documented

```bash
cp plans/ba/demo/entities/AC-007.1.md /tmp/ac.bak
sed -i 's/^parents: .*/parents: [US-999]/' plans/ba/demo/entities/AC-007.1.md
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo | grep -cE 'ac-prefix-mismatch|dangling'
cp /tmp/ac.bak plans/ba/demo/entities/AC-007.1.md
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "restored=$?"
```
→ the planted break is reported (**≥ 1**), and `restored=0`. A validator that never fires is not a validator.

### Gate 3 — `compose` emits D-4's block, with ACs nested under their US

```bash
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json > /tmp/i.json
grep -c '^## FR-' plans/ba/demo/deliverables/SRS-001.md
grep -c '^### AC-'  plans/ba/demo/deliverables/SRS-001.md
grep -A2 '^## FR-012' plans/ba/demo/deliverables/SRS-001.md | grep -cE '^\*\*Actor:\*\*.*\*\*Precondition:\*\*'
grep -A3 '^## FR-012' plans/ba/demo/deliverables/SRS-001.md | grep -cE '^\*\*source:\*\*.*\*\*confidence:\*\*'
awk '/^### AC-/{a++} /^## US-/{u++} END{print "AC="a" under US="u}' plans/ba/demo/deliverables/SRS-001.md
```
→ FR and AC counts **match the index**; both D-4 meta lines present for `FR-012` (**1** each, on the exact two lines the template specifies); every AC sits after a US heading.

### Gate 4 — every rendered block carries all five Stage-0 items

```bash
F=plans/ba/demo/deliverables/SRS-001.md
for L in '^\*\*Actor:\*\*' '^\*\*Out of scope:\*\*' '^\*\*Constraints:\*\*' '^\*\*Touches:\*\*'; do
  printf '%-28s %s\n' "$L" "$(grep -c "$L" "$F")"; done
FR=$(grep -c '^## FR-' "$F")
echo "FR=$FR  (each label count must equal it)"
grep -c '^### AC-' "$F"
```
→ each of the four label counts **equals `FR`**, and the AC count matches the index. A block missing one label is a gate item cook will `[ASSUMED]`-log.

### Gate 5 — `compose` is byte-stable, and both deliverables are committable

Byte-stability is what makes a **committed** deliverable safe (task 6.5): without it every regeneration is a spurious diff, and `qc drift` in wave 2 could never distinguish a real edit from noise.

```bash
cp plans/ba/demo/deliverables/SRS-001.md /tmp/a.md
cp plans/ba/demo/deliverables/PRD-001.md /tmp/b.md
# re-run `/ba:spec compose`
diff /tmp/a.md plans/ba/demo/deliverables/SRS-001.md && diff /tmp/b.md plans/ba/demo/deliverables/PRD-001.md && echo BYTE-STABLE
grep -ciE 'sinh tự động|generated|không sửa tay' plans/ba/demo/deliverables/SRS-001.md
grep -cE '[0-9]{4}-[0-9]{2}-[0-9]{2}T|Generated at|Sinh lúc' plans/ba/demo/deliverables/SRS-001.md
(cd <project> && git check-ignore -q plans/ba/demo/deliverables/SRS-001.md); echo "deliverable-ignored=$?"
(cd <project> && git check-ignore -q plans/ba/demo/traceability.derived.json); echo "index-ignored=$?"
```
→ `BYTE-STABLE`, **no diff on either file** · the do-not-hand-edit header present (**≥ 1**) · **`0`** timestamp lines (a timestamp would break byte-stability, which is why it lives in the index instead) · `deliverable-ignored=1` (**committable — it is the artifact a client signs**) · `index-ignored=0`.
