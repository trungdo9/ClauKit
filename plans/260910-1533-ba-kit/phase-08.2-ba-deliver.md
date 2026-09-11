# Phase 08.2 — `/ba:deliver` — the 9th dispatcher, and the downstream documents

**Milestone A′ — wave 1.5 (D-13).** **Depends on:** 08.1 (`changelog` + CR status), 06 (`compose`'s renderers), 08 (a complete demo tree and a clean `gap`). **Blocks:** 08.3 only for the `class:` header it defines.
**The phase that closes the downstream gap.** § 10i scored the plan 1 ✅ · 7 🟡 · 5 ❌ and named the pattern: the kit covers analysis and specification and almost nothing for **acceptance, release, handover** — the documents that gate payment in fixed-price delivery. Six template actions over the spine close it without a seventh dispatcher and without a new entity kind.

**Interfaces**
- Consumes: `buildIndex` · `findGaps` · `changelog` · `CR_STATUS` (08.1) · `spine-compose.cjs`'s `HEADER`/`rawBody`/`stripHeading`/`finalize` (06) · `plans/ba/demo` complete (08) · `skills/ba/capability-map.md` (03) · `.claude/kits/ba.json` (01).
- Produces:
  - NEW `.claude/scripts/ba/lib/spine-deliver.cjs` — `deliver(projectDir, what, { force }) => { ok, files?, skipped?, violations? }` · the class table · the sign block · the never-overwrite rule.
  - NEW `.claude/scripts/ba/lib/deliver-templates.cjs` — the six renderers, one exported function each.
  - EDITED `.claude/scripts/ba/traceability.cjs` — 6th subcommand `deliver <project-dir> <what> [--force] [--json]`.
  - EDITED `.claude/scripts/ba/lib/spine-compose.cjs` — **export widening only**: `module.exports = { compose, HEADER, rawBody, stripHeading, finalize }`. No behaviour change, so phase 06 Gate 5 is unaffected (Gate 3 re-measures it anyway).
  - NEW `.claude/commands/ba/deliver.md` — the 9th dispatcher.
  - NEW `skills/ba/deliver/SKILL.md` + `references/{deliverable-classes.md,sign-block.md}`.
  - EDITED `skills/ba/capability-map.md` — a second table, 13 `D`-prefixed rows, plus the H1 counts.
  - EDITED `.claude/kits/ba.json` — the `description` string's command count.
  - NEW `tests/ba-deliver.test.js` — 4 tests.
  - Runtime, **COMMITTED**: `plans/ba/<project>/deliverables/{SCOPE-001.md, UAT-001.md, ACCEPTANCE-001.md, RELEASE-NOTES-001.md, GOLIVE-001.md, HANDOVER-001.md}`.
- Types:
  ```
  Class      = 'derived' | 'owned'
  Deliverable= { action: string, file: string, class: Class, render: (ctx) => string }
  Ctx        = { projectDir: string, index: Index, gaps: {orphans, unsourced}, crs: CRRow[] }
  Result     = { ok: boolean, files?: string[], skipped?: string[], violations?: Violation[] }
  ```

---

## Task 8.2.1 — Two deliverable classes — **the D-11 interaction, resolved**

D-11 says a composed deliverable is *regenerated before commit, never hand-edited*, and it is right — for a document that is a pure function of the spine. **It is wrong for a UAT run record.** That document's result, date and tester cells *are* the run; regenerating it destroys the evidence the client is paying against. The same holds for the acceptance record's sign block, the go-live checklist's ticks and the handover tables' contents.

So D-11 **splits by class** rather than bending:

| class | actions | rule |
|---|---|---|
| `derived` | `scope` · `release-notes` | Overwritten on every run · **byte-stable** over an unchanged tree · no timestamp · never hand-edited · wave-2 `qc drift` applies (`render(ctx) == committed bytes`, else DRIFT). |
| `owned` | `uat` · `acceptance` · `golive` · `handover` | **Seeded once.** The generator **refuses to overwrite an existing file** and exits 1 naming `--force`. After the seed the human owns the file; `qc drift` must skip it. The *seed* is byte-stable, which is what Gate 3 measures. |

Both classes are **committed** — D-11's four reasons apply unchanged to a billing document, and argument 1 (*exact bytes are the contract*) applies to an `owned` file more strongly than to a `derived` one.

The class is machine-readable from the file, one grep, so wave-2 `qc drift` needs no table of its own:

```
<!-- ba-deliverable: <action> · class: derived · nguồn: plans/ba/<project>/entities/ -->
```

- `derived` files then carry `compose`'s sentence: sinh tự động, **không sửa tay** — sửa entity rồi chạy lại.
- `owned` files carry its inverse, verbatim in the template: *Seeded bởi `/ba:deliver <action>`. Sau khi seed, file này do người dùng sở hữu — điền các ô `[TO FILL]`. Chạy lại sẽ bị từ chối; cần `--force` (và `--force` xoá nội dung đã điền).*

`references/deliverable-classes.md` holds this table and nothing else, so the two rules have one home and the six templates point at it.

## Task 8.2.2 — The dispatcher invariant: **`/ba:deliver` writes no entity**

Every action reads the spine and writes only under `deliverables/`. Gate 4 measures it by listing `entities/` before and after all six actions.

The reason to fix it now rather than discover it later: the moment `deliver` may write an entity, the spine has two writers, and `qc drift` — whose whole job is comparing a rendered document against the entity tree — has two sources for the same fact. `/ba:spec` writes entities; `/ba:deliver` composes documents. One writer each.

## Task 8.2.3 — `scope` → `deliverables/SCOPE-001.md` (class `derived`)

**§ 10i item 1.** A field answers *"what does this EPIC not cover"*; a Scope Statement answers *"what is not in this project"*, and the second is not the concatenation of the first unless someone writes it down. That is the whole gap, and it is why the per-EPIC field was never a substitute.

Sections, in order: `# SCOPE-001 — <PRD title>` · `## Tầm nhìn (vision)` — `PRD-001`'s body, heading stripped · `## Phạm vi (in scope)` — one row per `EPIC`: id · title · its `out_of_scope` verbatim · `## Ràng buộc (constraints)` — every `NFR` by id + title, ordered by id · `## Ngoài phạm vi (exclusions)` — the union of every `EPIC` and `FR` `out_of_scope` line, deduplicated, each labelled with the id it came from so a reader can challenge it at source.

## Task 8.2.4 — `uat` → `deliverables/UAT-001.md` (class `owned`) — billing milestone

**§ 10i item 9.** One row per `TC` in the index, ordered by id, each with:

| `TC` | `AC` cha | Kết quả (pass/fail/blocked) | Ngày | Người kiểm thử |
|---|---|---|---|---|
| `TC-002` | `AC-007.1` | `[TO FILL]` | `[TO FILL]` | `[TO FILL]` |

`AC cha` is the TC's `AC` parent, or its `FR`/`NFR` parent when the TC has no AC (both are legal per `PARENT_KINDS.TC`); never blank, so no row can hide an untraceable test.

Then **one coverage line**, and it must not be able to disagree with the tool:

```
**Độ phủ:** TC=<n> · AC có TC=<m>/<total AC> · orphans=<o> · unsourced=<u>
```

`o` and `u` are read from `findGaps` in the same process that renders the file — not restated by a human, not recomputed later. Gate 1 asserts the line equals what `gap` prints, because a client document whose coverage number drifts from the tool's is worse than one with no number.

Then the **sign block**, shape fixed by `references/sign-block.md` and identical in `uat` and `acceptance` (Gate 1 and Gate 2 both grep it):

```markdown
## Ký xác nhận

| Vai trò | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| BA | [TO FILL] | [TO FILL] | [TO FILL] |
| Chủ sản phẩm (PO) — phía khách hàng | [TO FILL] | [TO FILL] | [TO FILL] |
```

## Task 8.2.5 — `acceptance` → `deliverables/ACCEPTANCE-001.md` (class `owned`) — biên bản nghiệm thu

**§ 10i items 3 and 9.** Sections:

- `## Phạm vi đã bàn giao` — every `FR` by id + title, each with the `EPIC` it belongs to, so the delivered list is readable against `SCOPE-001.md` rather than against memory.
- `## Lỗi còn mở` — read from `UAT-001.md` when that file exists: every row whose result cell is `fail` or `blocked`, carried over with its TC id. When `UAT-001.md` is absent, emit one line: run `/ba:deliver uat`, fill it, then re-seed this file with `--force`.
  **This is the one place a deliverable reads another deliverable, and it is deliberate:** acceptance is the billing document, its open-defect list must equal the UAT record's failures, and deriving it is the only construction in which the two cannot disagree.
- `## Thay đổi trong quá trình thực hiện (variance)` — `changelog(index)` filtered to `status: approved` (via `CR_STATUS`, not a string literal), each row id · impact · parents. A `rejected` or `proposed` CR must not appear here: a variance section is what was *agreed*, and listing a rejected request in it is a billing dispute waiting to happen.
- The sign block from task 8.2.4, byte-identical.

## Task 8.2.6 — `release-notes` → `deliverables/RELEASE-NOTES-001.md` (class `derived`)

**§ 10i item 5.** `FR` and `US` grouped by the optional `release:` key (08.1 task 8.1.1 — optional on `FR`/`US`, absent by default, never required), groups in descending string order, and everything without a `release:` under a final `## Unreleased`.

**Verified before adding the key: the engineer kit has no release concept.** `to-tickets`, `planning` and `plans-kanban` carry zero hits; the only `release notes` strings under `skills/software/**` are prose about reading an *upstream project's* notes (`research/SKILL.md:39`, `design/mermaidjs-v11/SKILL.md:88`). So there is nothing to redirect to and nothing to duplicate — which is the test D-10 applied to every cut capability, applied here to an addition.

`release:` is a **label, not a plan.** § 10i item 11 (release plan: versions, dates, contents) stays 🟡 on purpose: dates and version policy are not derivable from a requirements spine, and `/ba:prd roadmap`'s Now/Next/Later is the honest BA-side answer. The D-13 table says so rather than implying `release-notes` closed it.

## Task 8.2.7 — `golive` → `deliverables/GOLIVE-001.md` (class `owned`) — business readiness only

**§ 10i item 6, business half.** Five `[TO FILL]` checklist items and nothing else:

1. Đào tạo (training) đã hoàn tất — ai, khi nào.
2. Dữ liệu đã đối chiếu (data reconciled) — **expressed as the id of the `AC` on the migration `FR`**, not as a tool run. BA owns the criterion; whoever runs the migration owns the run. § 10i item 7's BA half, and the only part of it in this kit.
3. UAT đã ký — points at `UAT-001.md`'s sign block.
4. Thông báo (comms) đã gửi — to whom, through which channel.
5. **Người quyết định rollback (rollback decision owner)** — a named person. Not a procedure: naming the decider is a business-readiness fact, and the procedure is not this kit's.

The template's own header carries the redirect: the technical half — deploy steps, rollback procedure, cut-over runbook — is the engineer kit's. Name **`/ck:docs`** as a bare slash string and the target as the project's `docs/deployment-guide.md`, with the wording *"create it there if it does not exist"* — verified at `.claude/commands/ck/docs.md:40`, which marks that guide **optional**, so a template promising the reader it is there would be pointing at nothing in most projects.

## Task 8.2.8 — `handover` → `deliverables/HANDOVER-001.md` (class `owned`) — shape only

**§ 10i item 8.** Five `[TO FILL]` tables: tài khoản (accounts) · môi trường (environments) · cấu hình (configs) · quy trình vận hành (procedures) · liên hệ (contacts).

The header states that **the content is the `docs-manager` agent's job** and this template supplies only the shape a client expects. `docs-manager` ships from the engineer kit at `.claude/agents/engineering/docs-manager.md`, and `ba.json` declares no `agents` path — so it is named as a **bare agent name with the prerequisite stated** (`engineer` installed in the same project), exactly the treatment phase 08 task 8.3 gives `/ck:tickets`. **Never a backticked `.claude/agents/…` path**: that is the one form *"no shipped doc names a `.claude/` path the install does not have"* (`installer-packaging.test.js:292`) is built to catch, and Gate 5 checks for it directly because phase 09's derived kit loops have not run yet.

No credentials, ever — the tables name *where* a secret lives, never its value. State it in the template header, not only in the skill.

## Task 8.2.9 — The CLI surface

```
node .claude/scripts/ba/traceability.cjs deliver <project-dir> <what> [--force] [--json]
   what ∈ scope | uat | acceptance | release-notes | golive | handover | all
```

- `<what>` is `rest[0]` under the existing `const [action, projectDir, ...rest]` parse — the positional shape is unchanged, so no argument-parsing rewrite.
- `deliver` **validates first and writes nothing on violations**, the same contract `compose` carries (ruling R7): violations ⇒ print them, exit 1.
- Missing or unknown `<what>` ⇒ usage to stderr, **exit 2** — the same class as an unknown action.
- An `owned` target that already exists ⇒ printed as `⊘ <file> exists (class: owned) — pass --force to re-seed`, that file **skipped**, and **exit 1** so a script cannot mistake a skip for a write. `--force` overwrites and says so.
- **Output path would be git-ignored ⇒ one stderr line, exit unchanged** (verify-plan R-VP3): after resolving `<out>`, run `git check-ignore -q <out>`; on exit 0 print `⚠ <out> is git-ignored in this project — add \`!plans/**/deliverables/*.md\` to .gitignore or the signed document will not be committed (D-11)`. ≤ 3 lines. Consumers receive `PLAN_RULES` (no deliverables allowlist); a project that already ignores `plans/**` would otherwise silently drop the billing document. `compose` carries the twin under 08.1 task 8.1.4.
- `all` runs the six in the table order, skipping existing `owned` files; exit 1 if anything was skipped or violated, else 0.
- `--json` ⇒ `{ files, skipped }` only.
- **Line budget:** the six renderers do not fit beside the dispatcher under the 200-line rule, which is why `deliver-templates.cjs` is a separate file — `spine-deliver.cjs` holds the class table, the never-overwrite rule, the shared sign block and the dispatch; `deliver-templates.cjs` holds one exported renderer per action. Gate 7 measures both.

## Task 8.2.10 — `.claude/commands/ba/deliver.md` — the 9th dispatcher

```markdown
---
description: BA delivery documents — scope, UAT, acceptance, release notes, go-live, handover
argument-hint: scope|uat|acceptance|release-notes|golive|handover|all [<project-slug>]
---
```

Hard-fail pre-flight (rules § 6), byte-identical to the other commands' block. Then: read the `deliver` skill file → run `node .claude/scripts/ba/traceability.cjs deliver plans/ba/<project-slug> <action>` → surface the exit code rather than burying it, and on a skip say which file and that `--force` discards filled-in content. The command **never hand-renders a deliverable** — the byte-stability gate a committed document depends on is unreachable by an LLM re-render (ruling R7's reasoning, applied to the `derived` class) and the never-overwrite rule is unreachable by a prompt.

`skills/ba/deliver/SKILL.md`, body ≤ 140 lines: the two classes and which action is which · the six documents and what each is *for* in a fixed-price delivery · **what `deliver` does not own**, with the redirects · the sign block's fixed shape · the anti-patterns: hand-editing a `derived` file · `--force` over a filled-in `owned` file · a coverage number typed by a human · a variance section listing a CR that is not `approved` · credentials in the handover tables.

## Task 8.2.11 — The capability map: a **second table**, so `rows=55` survives

Five of § 10i's items were never in the original 55 (release notes, UAT sign-off, biên bản nghiệm thu, go-live, migration reconciliation), so the 55-row table cannot absorb them without destroying its own metric. **`55` is a provenance count** — it means *every capability the proposal promised resolves* — and it is asserted verbatim by phase 03's Gate 3, a **committed** phase this block must not touch.

So: `## Delivery-governance capabilities (D-13)`, **13 rows**, one per § 10i checklist item, ids `D1`–`D13` matching that table's numbering so the two are auditable against each other. Columns `| # | § 10i item | Verdict then | Resolved by | Owner | Wave |`, with the old ✅/🟡/❌ kept in *Verdict then* so the delta is visible rather than asserted.

**`D`-prefixed ids are load-bearing:** phase 03's metric is `awk -F'|' '/^\| *[0-9]+ *\|/…'`, which matches any row whose first cell is a bare number **anywhere in the file**. Measured on the extended file: `rows=55 unmapped=0 no-gloss=0`, unchanged, and `grep -c '^| \`/'` still `4`. Numbering the new rows `1`–`13` would have printed `rows=68` and failed a committed gate.

The 13 rows, with the three redirects and the two pointers that are not `deliver`'s — **six columns, matching the spec above and Gate 6's awk (`$5` = Resolved by); verify-plan R15 closed a 4-column worked example that would have failed the gate:**

| # | § 10i item | Verdict then | Resolved by | Owner | Wave |
|---|---|---|---|---|---|
| D1 | Scope Statement | 🟡 | `/ba:deliver scope` | ba | W1.5 |
| D2 | SRS / backlog with clear AC | ✅ | `/ba:spec compose` *(already ✅ — row 22)* | ba | W0 |
| D3 | Biên bản nghiệm thu | ❌ | `/ba:deliver acceptance` | ba | W1.5 |
| D4 | User manual by role | 🟡 | `/ba:export userguide` (W4) | ba | W4 |
| D5 | Release Notes | ❌ | `/ba:deliver release-notes` | ba | W1.5 |
| D6 | Go-live checklist + rollback | ❌ | `/ba:deliver golive` (business half) + `/ck:docs` → the project's deployment guide (technical half) | ba + ck | W1.5 |
| D7 | Data migration + reconciliation | ❌ | `/ba:spec ac` on the migration FR (the criterion) + the `database-admin` agent (the plan) | ba + ck | W0 |
| D8 | Handover / ops doc | 🟡 | `/ba:deliver handover` (shape) + the `docs-manager` agent (content) | ba + ck | W1.5 |
| D9 | UAT sign-off | ❌ | `/ba:deliver uat` | ba | W1.5 |
| D10 | Backlog Epic→Feature→Story + sprint plan | 🟡 | spine `EPIC→FR→US` + `/ck:tickets` and skill `plans-kanban` (sprint plan) | ba + ck | W0 |
| D11 | Release plan / roadmap | 🟡 | `/ba:prd roadmap` — **stays 🟡**: dates and version policy are not derivable from a spine | ba | W0 |
| D12 | Change Request form + Change Log | 🟡 | `/ba:spec cr` (form) + `traceability.cjs changelog` (log) | ba | W1.5 |
| D13 | Business Process Definition | 🟡 | `/ba:spec bp` (08.3) | ba | W1.5 |

Also update the H1 — `# BA capability map — 55 capabilities, 12 commands` is already stale on the command count (D-10 cut 12 → 8, D-13 makes it 9) — to state **55 capabilities + 13 delivery-governance items, 9 dispatchers**, and gate the three numbers against the measured counts so the header cannot go stale again.

`.claude/kits/ba.json`'s `description` says *"5 commands, 8 skills"*; `deliver` makes it **6 commands** and adds a skill. Update the counts in the same task — a manifest description is what `ck --kit list` prints, so a stale count is user-visible.

## Task 8.2.12 — `tests/ba-deliver.test.js` — a new file, four tests

A **new file**, not an extension of `tests/ba-spine.test.js`: that file is already 216 lines (the concern phase 02 parked for Review) and would pass 320 here, and `node --test "tests/*.test.js"` globs, so a new file needs no wiring. Same harness idiom: `node:test` + `node:assert`, `before`/`after` around an `os.tmpdir()` workspace, fixtures written by the test.

1. **`'the derived class renders byte-identically twice, the owned class refuses the second run'`** — render `scope` twice into one temp project and compare bytes; render `uat` twice and assert the second call returns `ok: false` with the file in `skipped` and the bytes untouched; then `{ force: true }` rewrites.
2. **`'the uat record covers every TC exactly once and its coverage line matches findGaps'`** — a fixture with 3 TCs (two with `AC` parents, one with an `FR` parent); assert each TC id appears exactly once, each row's parent cell is non-empty, and the `**Độ phủ:**` line's `orphans`/`unsourced` numbers equal `findGaps(index)`'s lengths.
3. **`'the variance section lists exactly the approved CRs'`** — a fixture with one `approved`, one `rejected` and one `proposed` CR; assert the variance section contains the approved id and **neither** of the others. The two negative controls are the test: a filter that passes everything satisfies the positive half alone.
4. **`'no deliverable carries a timestamp, and every one declares its class'`** — render all six; assert zero ISO-8601 matches across the six files (a timestamp is what makes byte-stability unreachable), and exactly one `ba-deliverable: … class: (derived|owned)` header each, with the class matching the table in task 8.2.1.

---

## Exit gate

**Exit gate:** `node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo all --force >/dev/null; echo $?` → `0`, then `ls plans/ba/demo/deliverables/*.md | wc -l` → `8` (the six new + `PRD-001.md` + `SRS-001.md`), then `grep -c 'ba-deliverable:' plans/ba/demo/deliverables/*.md` → `1` on each of the six and `1` on `PRD-001.md`/`SRS-001.md` too — the compose deliverables carry the class marker (plan.md:119-120 requires it on *every* deliverable; this gate originally asserted `0` here, inverting that constraint — corrected 2026-09-11 per review S1 / adversarial-verify H3; code fixed in 947d854). Detail in Gate 1–7 below.

### Gate 1 — `uat` covers every TC once, and its coverage line equals `gap`'s

```bash
node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo uat --force
F=plans/ba/demo/deliverables/UAT-001.md
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e \
 'const i=JSON.parse(require("fs").readFileSync(0));
  console.log("index-TC="+i.nodes.filter(n=>n.kind==="TC").length,
              "index-AC="+i.nodes.filter(n=>n.kind==="AC").length);'
grep -oE '\bTC-[0-9]{3}\b' "$F" | sort | uniq -c | awk '$1!=1{b++} END{print "not-exactly-once="b+0}'
grep -oE '\bTC-[0-9]{3}\b' "$F" | sort -u | wc -l
grep -c '^\*\*Độ phủ:\*\*' "$F"; grep -n '^\*\*Độ phủ:\*\*' "$F"
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo --json | node -e \
 'const g=JSON.parse(require("fs").readFileSync(0));console.log("gap orphans="+g.orphans.length,"unsourced="+g.unsourced.length);'
awk '/^## Ký xác nhận/{f=1} f' "$F" | grep -cE '^\| (BA|Chủ sản phẩm \(PO\))'
grep -c '\[TO FILL\]' "$F"
```
→ the distinct TC count in the file **equals `index-TC`** · `not-exactly-once=0` · the `**Độ phủ:**` line present exactly **1** time, and its `orphans=`/`unsourced=` numbers **equal** what `gap --json` reports · the sign block's two role rows present (**2**) · `[TO FILL]` count **≥ 3 × index-TC + 8** (three per TC row plus the sign block's six cells and the date cells).

### Gate 2 — `acceptance`: the FR set and the variance set are both exact

```bash
node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo acceptance --force
A=plans/ba/demo/deliverables/ACCEPTANCE-001.md
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e \
 'const i=JSON.parse(require("fs").readFileSync(0));
  console.log(i.nodes.filter(n=>n.kind==="FR").map(n=>n.id).sort().join("\n"))' > /tmp/spine-fr.txt
awk '/^## Phạm vi đã bàn giao/{f=1;next} /^## /{f=0} f' "$A" | grep -ohE '\bFR-[0-9]{3}\b' | sort -u > /tmp/acc-fr.txt
diff /tmp/spine-fr.txt /tmp/acc-fr.txt && echo FR-SET-EXACT
node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo --json | node -e \
 'const r=JSON.parse(require("fs").readFileSync(0));
  console.log(r.filter(x=>x.status==="approved").map(x=>x.id).sort().join("\n"))' > /tmp/approved.txt
awk '/^## Thay đổi/{f=1;next} /^## /{f=0} f' "$A" | grep -ohE '\bCR-[0-9]{3}\b' | sort -u > /tmp/acc-cr.txt
diff /tmp/approved.txt /tmp/acc-cr.txt && echo VARIANCE-EXACT
awk '/^## Thay đổi/{f=1;next} /^## /{f=0} f' "$A" | grep -c 'CR-002'
grep -c '^## Lỗi còn mở' "$A"
```
→ `FR-SET-EXACT` — the delivered list is the index's FR set, not a subset · `VARIANCE-EXACT` — exactly `CR-001` · **`0`** occurrences of `CR-002` (the `rejected` control) in the variance section · the open-defects section present (**1**), carrying `UAT-001.md`'s `fail`/`blocked` rows or the run-uat-first line.

### Gate 3 — byte-stability, per class, and zero timestamps

```bash
for A in scope release-notes; do node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo $A --force >/dev/null; done
cp plans/ba/demo/deliverables/SCOPE-001.md /tmp/s1.md
cp plans/ba/demo/deliverables/RELEASE-NOTES-001.md /tmp/r1.md
for A in scope release-notes; do node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo $A >/dev/null; done
diff /tmp/s1.md plans/ba/demo/deliverables/SCOPE-001.md \
  && diff /tmp/r1.md plans/ba/demo/deliverables/RELEASE-NOTES-001.md && echo DERIVED-BYTE-STABLE
node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo uat; echo "owned-second-run=$?"
D=$(mktemp -d); cp -r plans/ba/demo "$D/demo"; rm "$D/demo/deliverables/UAT-001.md"
node .claude/scripts/ba/traceability.cjs deliver "$D/demo" uat >/dev/null
diff plans/ba/demo/deliverables/UAT-001.md "$D/demo/deliverables/UAT-001.md" && echo OWNED-SEED-STABLE
grep -cE '[0-9]{4}-[0-9]{2}-[0-9]{2}T|Generated at|Sinh lúc' plans/ba/demo/deliverables/*.md
grep -rn 'new Date\|Date.now' .claude/scripts/ba/lib/spine-deliver.cjs .claude/scripts/ba/lib/deliver-templates.cjs; echo "clock-hits=$?"
```
→ `DERIVED-BYTE-STABLE`, **no diff on either file** · `owned-second-run=1` with a message naming `--force` · `OWNED-SEED-STABLE` — a fresh seed of an `owned` file is byte-identical, which is the form byte-stability takes for a class that is never overwritten in place · every line of the timestamp grep prints `:0` · `clock-hits=1` (grep found no clock call — byte-stable *by construction*, the property `spine-compose.cjs`'s header already claims for `compose`).

### Gate 4 — `deliver` writes no entity, and a billing document is committable

```bash
ls plans/ba/demo/entities | sort > /tmp/e1.txt
touch /tmp/stamp
node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo all --force >/dev/null; echo "all=$?"
ls plans/ba/demo/entities | sort > /tmp/e2.txt
diff /tmp/e1.txt /tmp/e2.txt && echo NO-ENTITY-ADDED
find plans/ba/demo/entities -newer /tmp/stamp -type f | wc -l
P=$(mktemp -d) && (cd "$P" && git init -q . && node <repo>/bin/ck.js init --kit ba >/dev/null 2>&1)
mkdir -p "$P/plans/ba/demo/deliverables" && : > "$P/plans/ba/demo/deliverables/ACCEPTANCE-001.md"
(cd "$P" && git check-ignore -q plans/ba/demo/deliverables/ACCEPTANCE-001.md && echo IGNORED || echo TRACKED)
```
→ `all=0` · `NO-ENTITY-ADDED` · **`0`** entity files modified (the mtime half — a rewrite with identical bytes would pass the listing half alone) · **`TRACKED`** — a billing document is committable, like the SRS (D-11). **Mechanism, stated truthfully (verify-plan R-VP3):** a fresh `ck init` project never ignores `plans/**` — `PLAN_RULES` (`bin/lib/gitignore-wire.js`) carries only the two review-package rules and `*.derived.json` — so the file is tracked by *absence* of an ignore, **not** via `.gitignore:72`, which is ClauKit's own repo file and never reaches a consumer. A consumer that already ignores `plans/**` would silently drop this document; that is what task 8.2.9's stderr warning exists for, and this brand-new-repo fixture cannot exercise it.

### Gate 5 — links, prose paths, and no path to a file `ba` does not install

```bash
P=$(mktemp -d) && (cd "$P" && git init -q . && node <repo>/bin/ck.js init --kit ba >/dev/null 2>&1)
cd "$P"
for f in $(find .claude -path '*/ba/*' -name '*.md') .claude/workflows/business-analysis-rules.md; do
  grep -oE '\]\([^)[:space:]]+\.md\)' "$f" | sed -E 's/^\]\(|\)$//g' | while read -r t; do
    [ -e "$(dirname "$f")/$t" ] || echo "BROKEN $f -> $t"; done; done | wc -l
grep -rohE '`\.claude/[^`[:space:]]*\.(md|sh|js|cjs|json)`' .claude/skills/ba .claude/commands/ba \
  .claude/workflows/business-analysis-rules.md | tr -d '`' | sort -u \
  | while read -r p; do [ -e "$p" ] || echo "MISSING $p"; done | wc -l
grep -rn 'Activate the `' .claude/skills/ba .claude/commands/ba; echo "activate-hits=$?"
grep -rnc '\.claude/agents/' .claude/skills/ba .claude/commands/ba | grep -v ':0$' | wc -l
grep -rn 'docs-manager\|database-admin' .claude/skills/ba .claude/commands/ba | grep -c 'engineer'
```
→ `0` broken relative links · `0` missing backticked `.claude/` paths · `activate-hits=1` (nothing found) · **`0`** files mentioning `.claude/agents/` — `docs-manager` and `database-admin` are bare agent names, because `ba.json` declares no `agents` path · **≥ 1** line naming the `engineer` prerequisite alongside them, so the reader learns the dependency where they learn the name.

### Gate 6 — the capability map: 55 untouched, 13 added, 9 dispatchers

```bash
awk -F'|' '/^\| *[0-9]+ *\|/{n++; if ($5 !~ /`\//) bad++; if ($4 !~ /[^ ]/) g++} END{print "rows="n, "unmapped="bad+0, "no-gloss="g+0}' .claude/skills/ba/capability-map.md
awk -F'|' '/^\| *D[0-9]+ *\|/{n++; if ($5 !~ /`/ && $5 !~ /agent|skill|spine/) bad++} END{print "d-rows="n, "unresolved="bad+0}' .claude/skills/ba/capability-map.md
grep -oE '`/ba:[a-z]+' .claude/skills/ba/capability-map.md | sort -u | wc -l
grep -cE '\| \*\*ck\*\* \|' .claude/skills/ba/capability-map.md
grep -c '^| `/' .claude/skills/ba/capability-map.md
awk -F'|' '/^\| *[0-9]+ *\|/{print $7}' .claude/skills/ba/capability-map.md | grep -cvE ' *(W[0-4]|—) *'
head -1 .claude/skills/ba/capability-map.md
awk '/^description:/{s+=length($0)-13} END{print "kit-desc-cmds", s}' .claude/commands/ba/*.md
grep -o '[0-9]* commands' .claude/kits/ba.json
```
→ **`rows=55 unmapped=0 no-gloss=0`** — byte-for-byte what phase 03's Gate 3 asserted, because the new rows are `D`-prefixed · `d-rows=13 unresolved=0` · distinct `/ba:` dispatchers **`9`** — phase 03's Gate 3 asserted `≤ 8`, which was true when it ran and is **superseded by D-13** (`plan.md` § D-13 records the supersession; the committed gate is not rewritten) · redirect rows **≥ 8** · the cut table still **4** rows · `0` rows with a bad wave value · the H1 states `55`, `13` and `9` · `ba.json` says **`6 commands`**.

### Gate 7 — the suite, and the 200-line rule

```bash
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
node --test tests/ba-deliver.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)'
wc -l .claude/scripts/ba/traceability.cjs .claude/scripts/ba/lib/*.cjs tests/ba-deliver.test.js
awk '/^description:/{n++; s+=length($0)-13; printf "%s %d\n", FILENAME, length($0)-13} END{print "files="n, "total="s}' .claude/commands/ba/*.md
```
→ `ℹ tests 366` · `ℹ pass 364` · `ℹ fail 1` · `ℹ skipped 1` (362 after 08.1, **+4** here; the one failure is the pre-existing `protected-branch-guard.test.js:196`) · the deliver file reports `ℹ tests 4 · pass 4 · fail 0` · **every `.cjs` < 200 lines** — the reason `deliver-templates.cjs` is split out of `spine-deliver.cjs` · every per-command `description:` **≤ 110** bytes (phase 04 Gate 3's bound) and `total=` **≤ 1536** over the six wave-0/1.5 command files (measured before this phase: `248` over three).
