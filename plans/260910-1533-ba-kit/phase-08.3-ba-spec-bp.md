# Phase 08.3 — `/ba:spec bp` — Business Process Definition as an action, not a kind

**Milestone A′ — wave 1.5 (D-13).** **Depends on:** 07 (`/ba:diagram flow` renders the process), 08.1 (the `CR` kind Gate 4 reads — was undeclared; STATE order already enforced it), 08.2 (the `owned` class header and the never-overwrite rule). **Blocks:** nothing — this is wave 1.5's last phase.
**§ 10i item 13.** `/ba:diagram flow` gives a picture; a Business Process Definition is a document — narrative, roles, trigger, inputs/outputs, steps, business rules, exceptions — with the picture inside it. One action closes it. **Kinds stay at 10.**

**Interfaces**
- Consumes: `traceability.cjs index --json` (the id set to validate citations against) · `/ba:diagram flow` (07) · `.claude/commands/ba/spec.md` + `skills/ba/spec/SKILL.md` (06, 08.1) · `references/deliverable-classes.md` (08.2 task 8.2.1).
- Produces:
  - EDITED `.claude/commands/ba/spec.md` — 9th action `bp`; `argument-hint` gains it.
  - NEW `skills/ba/spec/references/bp-structure.md` — the document shape, ≤ 60 lines.
  - EDITED `skills/ba/spec/SKILL.md` — one `## Business Process Definition` section, ≤ 12 lines.
  - EDITED `skills/ba/capability-map.md` — row `D13`'s *Resolved by* cell becomes `` `/ba:spec bp` `` (the row itself is created by 08.2 task 8.2.11).
  - Runtime, **COMMITTED**, class `owned`: `plans/ba/<project>/deliverables/BP-<slug>.md`.
- **No spine change.** `spine-parse.cjs`, `spine-index.cjs` and `traceability.cjs` are untouched; Gate 4 asserts it.
- **No test delta.** Gate 4 asserts that too, and task 8.3.7 says why.

---

## Task 8.3.1 — The decision: **no `BP` kind**, and the trigger that would reverse it

A kind earns its place in the spine when the graph must reach it or reach **through** it. A Business Process Definition does neither:

- It has **no children.** Its steps cite `UC-###` and `FR-###` ids that already exist as nodes with their own parents; the citation adds no edge the graph did not have.
- **No `PARENT_KINDS` row would name it.** So every `BP-###` entity would be reported `unparented` by `findGaps` on the day it was written, unless a parent rule were invented *for the filename's sake* — which is inventing graph structure to justify a kind. That is exactly the 16-kind mistake D-10 reversed.
- `CR` cleared the same bar for the **opposite** reason, which is what makes the comparison useful: something must be reachable *from* a CR — every entity the change touches — so `PARENT_KINDS.CR` writes itself, and `changelog` is a real view over real edges. Nothing is reachable from a BP.

The traceability a BP actually needs is **citation, not parentage**, and citation is mechanically checkable: Gate 2 asserts every `FR`/`UC`/`NFR` id the document cites exists in the index — the `comm -23` shape phase 08 Gate 2 uses for tickets, applied to a document.

**Trigger to revisit (wave 2+), falsifiable:** a real project needs to ask the *index* — not `grep` — which processes an entity participates in (*"which processes does `FR-014` appear in"*). Until someone needs that query, 10 kinds. Record the trigger in `bp-structure.md` so the next reader inherits the test rather than the conclusion.

## Task 8.3.2 — `skills/ba/spec/references/bp-structure.md` — the document shape

≤ 60 lines. Eight `##` sections, in this order, VI prose + EN keywords (D-4). Gate 3 counts them.

| section | content |
|---|---|
| `## Tóm tắt (narrative)` | 3–6 sentences: what the process achieves and for whom. |
| `## Vai trò & tác nhân (roles/actors)` | table — vai trò · trách nhiệm · hệ thống sử dụng. |
| `## Kích hoạt (trigger)` | the event that starts the process, and who or what raises it. |
| `## Đầu vào / Đầu ra (inputs/outputs)` | table — two columns, each row naming the artifact and where it comes from or goes. |
| `## Các bước (steps)` | numbered. Each step names its actor and, where one exists, the `UC-###` or `FR-###` it realises. |
| `## Quy tắc nghiệp vụ (business rules)` | **as `FR-###` references, never as new prose rules.** Open Q1 stands: business rules live in FR prose in wave 0, so a BP that restates one creates a second source for the same fact — the exact defect the spine exists to prevent. A rule with no FR to cite means the FR is missing: run `/ba:spec fr`. |
| `## Ngoại lệ (exceptions)` | each exception names the step it branches from and the outcome. |
| `## Sơ đồ` | the `/ba:diagram flow` render inline in a ` ```mermaid ` fence, **or** the literal `[UNRENDERED]` with the source beside it. Rules § 4: compiled or labelled, never a third state. |

Header: the `owned`-class line from 08.2 task 8.2.1, with the action `bp`:

```
<!-- ba-deliverable: bp · class: owned · nguồn: plans/ba/<project>/entities/ -->
```

## Task 8.3.3 — `.claude/commands/ba/spec.md` gains `bp`

- `argument-hint: fr|nfr|uc|us|ac|tc|cr|bp|compose [<project-slug>]` — `cr` arrives in 08.1, `bp` here, and the dispatcher count does **not** move (Gate 1). That is the point of making it an action: § 10i asked for a document, not a command.
- Action bullet, with the order of operations stated because it is the part an implementer will otherwise get backwards:
  1. read the `spec` skill file → read `references/bp-structure.md`;
  2. **run `/ba:diagram flow` first**, so the `## Sơ đồ` section holds a real render or an honest `[UNRENDERED]` label rather than a promise;
  3. write `plans/ba/<project>/deliverables/BP-<slug>.md`, `<slug>` kebab-cased from the process name;
  4. run `node .claude/scripts/ba/traceability.cjs index plans/ba/<project> --json` and check every `FR-`/`UC-`/`NFR-` id the document cites against `nodes[].id`. **Refuse to report success on an unknown id** — an invented id in a signed process document is the hallucination class rule 1 exists to stop, arriving through a side door.
- `bp` writes **no entity** — the same invariant `/ba:deliver` carries (08.2 task 8.2.2). One writer per store: `/ba:spec <kind>` writes `entities/`, `bp` and `deliver` write `deliverables/`.
- Link form, counted from the installed `.claude/commands/ba/`: `../../skills/ba/spec/references/bp-structure.md`; display text stays the canonical `.claude/…` path.

## Task 8.3.4 — Class `owned`, and why `bp` is not a script

The BP document is **narrative**: its summary, its step prose and its exceptions are written, not derived. So it cannot be byte-stable, and it must not be regenerated over a human's edits — which places it in 08.2's `owned` class rather than `derived`.

Consequences, each stated in the command file:

- Re-running `bp` for a slug whose file already exists **reports the path and writes nothing**. Unlike `deliver`'s, this refusal is the *command's* (there is no script to enforce it), so it is gated by re-running it — Gate 3.
- Wave-2 `qc drift` must **skip** `class: owned`, so the file carries the class header and `drift` reads it. Without the header, `drift` would report every hand-filled BP as drifted and be switched off within a week.
- It is **committed**, like every other deliverable (D-11): `.gitignore:72`'s `!plans/**/deliverables/*.md` covers `BP-*.md` by pattern, with no new rule.

## Task 8.3.5 — Skill and map wiring

- `skills/ba/spec/SKILL.md` gains one `## Business Process Definition` section, ≤ 12 lines: what the action produces, the eight sections by name, the pointer to `references/bp-structure.md`, and the two anti-patterns — **a business rule written as prose instead of an `FR` reference**, and **a `## Sơ đồ` section with neither a fence nor `[UNRENDERED]`**.
- `skills/ba/capability-map.md`: row `D13`'s *Resolved by* cell → `` `/ba:spec bp` ``, `Owner` `ba`, `Wave` `W1.5`. Nothing is added to the 55-row table — a BP was never one of the 55, which is precisely why 08.2 built the second table.

## Task 8.3.6 — The demo artifact is **hand-authored**, per ruling R8

Gate 2 and Gate 3 read a real `plans/ba/demo/deliverables/BP-<slug>.md`. **Write it by hand, exactly per the `bp` action's Workflow section — do not try to invoke `/ba:spec bp`.** Ruling R8 (verify-plan 2026-09-11): a subagent cannot invoke a slash command, which is why phases 05 and 07 hand-authored `plans/ba/demo` and why 08.1 hand-authors its two CRs. The command file is the specification the artifact must satisfy, and authoring from it is also the cheapest test that task 8.3.3's four-step order is complete enough to follow.

Two consequences for the gates, so they are not read as automation:

- The `## Sơ đồ` fence holds whatever `/ba:diagram flow` produces for this process, or the literal `[UNRENDERED]` — the environment has **no locally-callable mermaid renderer** (§ Environment findings: `mmdc` not found), so `[UNRENDERED]` is the expected state here and is a pass, not a shortfall. Rules § 4 is satisfied by the label, never by silence.
- Gate 3's re-run check is performed by the implementer following the command file's refusal rule (task 8.3.4), and recorded as a line in the phase report naming the file it declined to overwrite.

`plans/ba/demo/**` is a **committed fixture** as of 08.1 task 8.1.9, so `BP-<slug>.md` lands in git under `.gitignore:72`'s existing `!plans/**/deliverables/*.md` with no new rule.

## Task 8.3.7 — No test, and the reason

This phase adds **no test**, and that is a decision rather than an omission. The BP document is LLM-authored prose; its one mechanical claim — *every id it cites exists in the spine* — is Gate 2, run against the real demo artifact. A unit test would have to synthesize a BP file first, and would then be asserting that its own fixture's ids match its own fixture's index: a test of the test. The checkable surface this phase adds to shipped code is zero lines of `.cjs`.

The grep guard that *does* cover this phase already exists: `tests/ba-spine.test.js`'s *"no shipped ba doc tells the reader to activate a grouped skill"* (phase 02 task 2.8) walks `.claude/skills/ba/**` and `.claude/commands/ba/**`, so the new reference file and the edited skill enter it by existing.

---

## Exit gate

**Exit gate:** `comm -23 /tmp/bp-ids.txt /tmp/spine-ids.txt` → **no output**, and `grep -c '^## ' plans/ba/demo/deliverables/BP-*.md` → `8`. Detail in Gate 1–4 below.

### Gate 1 — the action exists, is documented, and adds no dispatcher

```bash
grep -n '^argument-hint:' .claude/commands/ba/spec.md
grep -c '`bp`' .claude/commands/ba/spec.md
grep -c 'bp-structure.md' .claude/commands/ba/spec.md .claude/skills/ba/spec/SKILL.md
grep -c '^## Business Process Definition' .claude/skills/ba/spec/SKILL.md
grep -oE '`/ba:[a-z]+' .claude/skills/ba/capability-map.md | sort -u | wc -l
ls .claude/commands/ba/*.md | wc -l
```
→ the hint reads `fr|nfr|uc|us|ac|tc|cr|bp|compose [<project-slug>]` · the `bp` action documented (**≥ 1**) · both files reference `bp-structure.md` (**1** each) · the skill section present (**1**) · distinct `/ba:` dispatchers still **`9`** and command files still **`6`** — *a BP is a document, so it got an action, not a dispatcher.*

### Gate 2 — every id the document cites exists in the spine

```bash
B=$(ls plans/ba/demo/deliverables/BP-*.md | head -1); echo "file=$B"
grep -ohE '\b(FR|UC|NFR)-[0-9]{3}\b' "$B" | sort -u > /tmp/bp-ids.txt
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e \
 'const i=JSON.parse(require("fs").readFileSync(0));
  console.log(i.nodes.filter(n=>["FR","UC","NFR"].includes(n.kind)).map(n=>n.id).sort().join("\n"))' > /tmp/spine-ids.txt
comm -23 /tmp/bp-ids.txt /tmp/spine-ids.txt
wc -l < /tmp/bp-ids.txt
awk '/^## Quy tắc nghiệp vụ/{f=1;next} /^## /{f=0} f' "$B" | grep -c 'FR-'
```
→ `comm` prints **nothing** — no cited id is absent from the spine, the traceability claim tested rather than asserted · the document cites **≥ 2** ids (one that cites none is a narrative, not a specification) · the business-rules section carries **≥ 1** `FR-` reference, because task 8.3.2 forbids it from carrying a prose rule instead.

### Gate 3 — the render gate, the eight sections, and the `owned` rule

```bash
B=$(ls plans/ba/demo/deliverables/BP-*.md | head -1)
grep -c '^## ' "$B"
grep -cE '^```mermaid|\[UNRENDERED\]' "$B"
grep -c 'ba-deliverable: bp · class: owned' "$B"
grep -cE '[0-9]{4}-[0-9]{2}-[0-9]{2}T|Generated at|Sinh lúc' "$B"
cp "$B" /tmp/bp-before.md
# re-run `/ba:spec bp <the same slug>` on plans/ba/demo — it must refuse
diff /tmp/bp-before.md "$B" && echo OWNED-NOT-OVERWRITTEN
```
→ **`8`** `##` sections, the eight `bp-structure.md` names · **≥ 1** diagram-or-label (rules § 4 — compiled or `[UNRENDERED]`, never a third state) · the `owned` class header present (**1**) · **`0`** timestamp lines · `OWNED-NOT-OVERWRITTEN`, and the re-run reports the existing path.

### Gate 4 — the spine did not move, and neither did the suite

```bash
node -e "const p=require('./.claude/scripts/ba/lib/spine-parse.cjs');
  console.log('kinds='+p.KIND_ORDER.length, 'last='+p.KIND_ORDER[p.KIND_ORDER.length-1], 'bp='+p.KIND_ORDER.includes('BP'));"
git diff --stat HEAD -- .claude/scripts/ba tests | tail -1
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "validate=$?"
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo >/dev/null; echo "gap=$?"
```
→ `kinds=10 last=CR bp=false` — **no eleventh kind** (task 8.3.1) · the `git diff --stat` line shows **no change under `.claude/scripts/ba` or `tests/`** for this phase · `ℹ tests 366 · pass 364 · fail 1 · skipped 1` — **identical to 08.2's exit count**, because this phase adds no test (task 8.3.7) · `validate=0` and `gap=0`, so the wave-0 handover gate is untouched by wave 1.5's last phase.
