# Phase 08 — `/ba:qc gap` + the BA→dev handoff chain

**Milestone A — wave 0 product.** **Depends on:** 02, 05, 06 (something to check and hand over). **Blocks:** nothing — this is wave 0's last phase and carries its top-line metric.
**The phase that makes the kit complement the software kit** rather than sit beside it (criterion 2).

**Interfaces**
- Consumes: `traceability.cjs gap` (02) · `deliverables/SRS-001.md` from `compose` (06).
- Produces:
  - `.claude/commands/ba/qc.md` — action `gap` only in wave 0
  - `## Quy trình chuẩn` (the primary workflow) in `.claude/workflows/business-analysis-rules.md`, and the same chain in `.claude/skills/ba/README.md`
  - **No new skill** — `qc gap` is a thin wrapper over a helper that already exists. A skill file for it would be a wrapper around a wrapper.

---

## Task 8.1 — CREATE `.claude/commands/ba/qc.md`

```markdown
---
description: BA quality control — gap analysis over the traceability spine
argument-hint: gap [<project-slug>]
---
```

Hard-fail pre-flight (rule 6). `gap` runs `node .claude/scripts/ba/traceability.cjs gap plans/ba/<project>` and renders the result for a human: orphans grouped by reason, unsourced items listed, and **the exit code surfaced** — a clean run says so, a dirty run does not bury it in prose.

**Wave 0 ships `gap` and nothing else.** `drift` and `cr` are wave 2; `dashboard` and `kg` are cut to `plans-kanban` and `gkg`. The command file names the four absent actions **as bare slash strings with their owner**, so a user who types `/ba:qc dashboard` gets a redirect instead of a failure — never as backticked paths, which would fail the shipped-path check.

## Task 8.2 — Document the handoff chain — **the kit's primary workflow**

Verified on disk, and it is better than assumed:

- `.claude/commands/ck/tickets.md` `argument-hint` lists **`spec-path`** explicitly, and its SOURCE table resolves *"any other `.md` path → that spec file"*.
- `to-tickets/SKILL.md:45` — *"a spec path → read the file"*.

⇒ **`deliverables/SRS-001.md` is a valid `/ck:tickets` input today, with zero glue code.** Write the chain into the rules file as `## Quy trình chuẩn`:

```
/ba:plan  → plans/ba-context.md
/ba:prd   → PRD-001 + EPIC-*
/ba:spec  → FR/NFR/UC/US/AC/TC entities
/ba:qc gap→ (gate: exit 0 before handing over)
/ba:spec compose → plans/ba/<project>/deliverables/{PRD-001.md,SRS-001.md}   ← COMMITTED
/ck:tickets plans/ba/<project>/deliverables/SRS-001.md   → tickets
/ck:cook   plans/<YYMMDD-HHmm-slug>/tickets/NN-*.md → code
```

**Three seam facts a user will otherwise discover the hard way, all verified:**

1. **The tickets do not land next to the spec.** For a non-plan source `/ck:tickets` creates its own `plans/<YYMMDD-HHmm-slug>/` and writes `tickets/` there — it explicitly *"does not invent a `plan.md` that nobody wrote"*. So the BA artifacts and the tickets live in two different plan dirs. Say where.
2. **A ticket sliced from a spec is thinner than one sliced from a plan.** `to-tickets/SKILL.md:134`: a ticket handed to cook *"must carry its acceptance criteria and link its parent `plan.md` for the rest"* — and from a spec source **there is no parent `plan.md`**. The ACs are carried (that is why `compose` nests them under their US); the file paths and blast radius are not, because **a BA spec legitimately does not know them**.
3. ⇒ **The realistic chain has one more step, and the docs must say so:** run `/ck:scout` (or `/ck:plan`) between tickets and cook when the area is cold, or let cook's Stage 0 ask its one question. `/ck:tickets` step 2 already says to scout when the area is cold — the BA chain inherits that, it does not escape it. **Do not claim a fully automatic BA→code pipeline**; claim what is true, which is that the spec is a first-class ticket source with no conversion step.

## Task 8.3 — Reuse, and name what is reused

The rules file gets a short `## Không xây lại cái đã có` section — the redirects from the capability map, in one place a user reads before asking for a feature: research → `/ck:research` · design/wireframe → `/ck:design` · tracker publishing → `/ck:tickets --jira` · kanban → `plans-kanban` · knowledge graph → `gkg` · test-case methodology → the `scenario` skill · implementation → `/ck:cook`.

**One of these is a hard dependency, not a suggestion:** `/ba:spec tc` reads `.claude/skills/software/scenario/SKILL.md`, which `ba.json` ships via **`requires.shared`** (phase 01) — link-clean, so it can travel alone. Record it in the rules file's cross-references. **`/ck:tickets` is the opposite case:** it cannot be a `requires.shared` entry (its links drag in most of the engineer kit), so it is a **documented prerequisite** — name it as a bare slash string and state that the handoff needs `engineer` installed in the same project.

---

## Exit gate

**Exit gate:** *(wave 0's top-line metric)* `node .claude/scripts/ba/traceability.cjs gap plans/ba/demo && ls plans/*/tickets/*.md | wc -l && comm -23 /tmp/tickets-ac.txt /tmp/spine-ac.txt` → `exit 0` from `gap`, then **`3` or more** ticket files, then **no output** from `comm` (every AC a ticket cites exists in the spine). The full chain — `/ba:prd → /ba:spec → /ba:qc gap → /ba:spec compose → /ck:tickets <SRS>` — must have run to produce those. Detail in Gate 1–3 below.

### Gate 1 — the chain runs, and `gap` gates it

```bash
# after /ba:prd + /ba:spec on the synthetic project
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo; echo "gap=$?"
# then /ba:spec compose
test -f plans/ba/demo/deliverables/SRS-001.md && test -f plans/ba/demo/deliverables/PRD-001.md && echo COMPOSED
# then: /ck:tickets plans/ba/demo/deliverables/SRS-001.md
T=$(ls -d plans/*/tickets 2>/dev/null | head -1); ls "$T" | wc -l
```
→ `gap=0` (**the handover gate: a spec with orphans is not handed over**) · `COMPOSED` · **≥ 3** ticket files.

### Gate 2 — every ticket carries criteria that trace back to the spine

```bash
for f in "$T"/*.md; do
  ac=$(grep -c '^- \[ \]' "$f"); bl=$(grep -c '^\*\*Blocked by:\*\*' "$f")
  echo "$(basename $f) ac=$ac blocked-by=$bl"
done
grep -ohE 'AC-[0-9]{3}\.[0-9]+' "$T"/*.md | sort -u > /tmp/tickets-ac.txt
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json \
  | node -e 'const i=JSON.parse(require("fs").readFileSync(0));
      console.log(i.nodes.filter(n=>n.kind==="AC").map(n=>n.id).sort().join("\n"))' > /tmp/spine-ac.txt
comm -23 /tmp/tickets-ac.txt /tmp/spine-ac.txt
```
→ every ticket has `ac>=1` and `blocked-by=1`; the `comm` prints **nothing** — no ticket cites an AC that is not in the spine. **This is the traceability claim, tested rather than asserted.**

### Gate 3 — the cook handoff, mechanically checked

`/ck:cook`'s Stage-0 gate is **UNSKIPPABLE** (`cook.md:86`) and derives five items; `--from-plan` **satisfies it from the file** and `[ASSUMED]`-logs anything missing (`:36`) rather than asking. So "did the BA spec carry enough" is greppable — which replaces the manual "record which fields it asked about" step this gate used to carry.

**Fixture is greenfield** — the ordinary case for a new BA project, and the one that sets the bar. A brownfield fixture (FRs citing real `file:line`) can reach 0 and is worth running second, but the contract this gate enforces is *nothing except touchpoints is ever assumed*.

```bash
T=$(ls -d plans/*/tickets | head -1)
# run: /ck:cook --from-plan "$T"/01-*.md   (stop it after Stage 0.5)
grep -c '\[ASSUMED\]' plans/*/STATE.md
grep -n 'Stage 0.5\|Verify-Plan' plans/*/STATE.md | head -1
```
→ **exactly `1`** `[ASSUMED]` entry per ticket, and **that one line names touchpoints**. The ledger shows the run reached **Stage 0.5**.

Four of the five items — expected output, acceptance criteria, scope boundary, constraints — come out of `deliverables/SRS-001.md` via the composed labels (phase 06 task 6.3), so they are *not* assumed. **Touchpoints is unknowable from a BA spec by construction** — a spec names no files — so `1` is the correct floor, not a shortfall.

**Anything above 1, or a `[ASSUMED]` line naming anything other than touchpoints, means `compose` dropped a label** — check phase 06 Gate 4 first, where each of the four labels must count equal to the FR count.

On a **brownfield** project whose FRs carry a real `file:line` in `source:`, the count can reach **`0`** — that is a bonus, not the bar. The bar is: nothing except touchpoints is ever assumed.

**This is the real test of criterion 2.** A BA kit that "complements the software kit" produces a spec cook can consume with **one** open question; one that merely sits beside it produces a document a human has to re-key. The difference is four bolded labels in the composed output, and this gate is what measures it.

**The claim this licenses, and its limit** — write both in the rules file: *the spec is a first-class ticket source with no conversion step; the cook leg still needs `/ck:scout`, or one Stage-0 answer, for touchpoints.* **Do not claim a fully automatic BA→code pipeline.**
