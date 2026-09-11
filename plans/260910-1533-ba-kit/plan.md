# Plan — BA Kit (wave 0: kit skeleton + traceability spine) + D-2 spike + distribution decision

**Created**: 2026-09-10 · **Revised**: 2026-09-10 (D-5..**D-12** — D-12 made the kit public, so it is a third in-package kit and the plan got smaller) · **Revised**: 2026-09-11 (**D-13** — wave 1.5 appended as phases **08.1–08.3**, downstream delivery governance; 06–08 untouched) · **Type**: new in-package kit (`ba`) · **Version impact**: minor
**Source**: [brainstorm-report.md](brainstorm-report.md) — recommendation **B**; decisions **D-1..D-4** locked there, **D-5..D-12** locked by the team lead, **D-13** by the user after the § 10i verify pass.
**Scope of THIS plan**: wave 0 — the daily BA→dev chain — as **one milestone**, phases 01–10, plus **wave 1.5** (08.1–08.3, D-13) and an optional reference scan (11). File level. Waves 2–4 get shape only.

---

## Problem

ClauKit has no business-analysis surface. Six of the 55 proposed commands (`gap`, `doc-drift`, `cr`, `dashboard`, `kg`) are **one data model and five views**, and the proposal defines no data model (defect D1). Risk R4 makes the model wave 0's job: retrofitted after wave 3 it means rewriting every generator.

**D-5 and D-6 change what wave 0 must decide, not what it must build.** D-6 (solo BA) removes concurrency work; D-5 (sellable seed) adds a licensing/distribution decision and makes the storage format a forward commitment. The team lead's resolution — *build single-writer, do not choose a single-writer file format* — is adopted in full and drives the § Spine model below.

### Corrections to the brainstorm and to the D-5/D-6 brief (all verified on disk)

| Source | Claim | Verified state |
|---|---|---|
| brainstorm § 8 | wave-0 round-trip runs through **`/ba:qc gap`** | **Wrong for wave 0** — `/ba:qc` ships in wave 2. Metric is pinned at the helper CLI; `/ba:qc gap` wraps it later. |
| brainstorm § 8 | "`installer-packaging.test.js` green" | Not a gate. Its three kit loops are the hardcoded literal `['engineer','marketing','both']` (lines 165, 275, 341); a fourth sits at `installer-claude-md.test.js:179`. Green means the guards never looked at `ba`. |
| brainstorm § 10 D-4 | the item template is binding on storage | Under the per-entity model D-4 is binding on the **composed deliverable** (what a client signs), and `source:`/`confidence:` move to entity frontmatter. All four D-4 fields survive verbatim in the rendered block. See § Spine model. |
| brainstorm § 4 | BMAD v6.8.0 feature set, Anthropic PM plugin scope | Still unverified — the report's own ⚠. Phase 07 closes it, with a **license gate first** (D-5 item 3). |
| brainstorm § 9 | `repomix` available | **Absent.** `npx -y repomix` or `git clone`. |
| brainstorm § 9 | Atlassian MCP present | **Confirmed** — all five tools D-3 names resolve. |
| D-5 brief, item 1 | option (a) "BA kit in a separate private repo/package, installs as a paid add-on" — *"verify whether `ck init` can install a kit from outside the package tree"* | **It cannot, and this is the single most consequential finding in this revision.** Proven by probe, transcript in phase 08. `resolveKit` accepts an **external manifest file**, but `resolveSourcePath` resolves every declared path with `path.join(PACKAGE_ROOT, relPath)` — so a manifest may live anywhere while its *content* must already be inside the installed ClauKit package. External relative path ⇒ `❌ references 1 missing path(s) in package`. **External absolute path ⇒ the same failure, because `path.join(PACKAGE_ROOT, '/tmp/x')` silently rebases to `<pkg>/tmp/x`** — a latent bug in its own right. Control (external manifest + in-package path) installs fine. **⇒ option (a) is not buildable without a CLI change**, and `CLAUDE.md`'s *"adding a new kit = drop a JSON file, no CLI changes"* is true only for kits whose content ships inside the package. |
| D-5 brief, item 1 | "`LICENSE` does not exist … the repo is public and MIT" | `LICENSE` confirmed absent — not on disk, not tracked, not ignored — while `package.json` declares `"license": "MIT"` and lists `"LICENSE"` in `files`. **The state is inconsistent, and the inconsistency is itself the finding.** This plan does **not** resolve it and states no legal conclusion; phase 08 records the facts and the options for a human (with counsel, if money is involved) to decide. |
| D-5 brief, item 2 | npm name invalid | **Confirmed.** `npm view @trungdo9/ClauKit` → `E404 … name can no longer contain capital letters`. `@trungdo9/claukit` is a plain 404, i.e. **free**. |
| D-5 brief, "in-house precedent: `to-tickets`" | one file per entity | **Confirmed** (`to-tickets/SKILL.md:26,93` — *"one file per ticket, never one combined file"*). Note the divergence: ticket files use a `# NN: title` + bold-field body, **not** YAML frontmatter. The spine uses frontmatter because its files are machine-indexed; ticket files are read by humans and by `cook`. Deliberate, stated in the skill. |
| D-5 brief, item 5 | `skills/skills-lock.json` unused | **Confirmed** — `{"version": 1, "skills": {}}`. Evaluated in phase 08; recommendation is *do not adopt in wave 0*. |

### D-12 — the kit is public, so it is an in-package kit

The BA kit is public MIT, like ClauKit itself. **The separation D-5/D-7/D-8 built existed only for IP, so with no IP boundary there is no reason for a separate tree.** `ba` becomes a third in-package kit in `marketing`'s exact shape, and `ck init --kit ba` works with **zero CLI change** — `CLAUDE.md`'s *"adding a kit = drop a JSON file, no CLI changes"* is true again.

**This is a deletion, and the plan got smaller: 14 phases → 11, and three of the hardest disappeared.**

| | reversed / superseded | why |
|---|---|---|
| **D-5** sellable · **D-7** option (a′) · **D-8** ownership seam | **reversed** | no IP boundary to enforce |
| **R13** ship-or-hold | superseded | no private content to withhold |
| **R16** digest machinery | superseded | it *does* manage in-package files |
| **"two-step install"** | superseded | one step: `ck init --kit ba` |
| private `LICENSE` · `.gitignore` · `package.json` · product decision record · manifest+install phase | **deleted** | MIT covers `ba` automatically; none of it applies in-package |

**Unchanged and still binding:** D-1 (**9** dispatchers since D-13 added `deliver`; 5 ship in wave 0 and a 6th in wave 1.5) · D-2 (spike optional) · D-3 · D-4 · D-6 (per-entity spine) · D-9 (one generic `plans/**/*.derived.json` — the "no proprietary name in MIT code" reason is moot, but it is still the better engineering: one rule, zero per-kit work) · D-10 (product first) · D-11 (deliverables committed).

**Not done, deliberately:** no `both.json` rename and no combination manifest. A BA installs `ba`, a dev installs `engineer`, in one project, and `ck init` unions them by file (`ck.js:66-78`, idempotent settings merge). A combo would be `all.json` re-listing every path — `extends` is inert — and nobody has asked for one.

### D-13 — wave 1.5: the downstream half (2026-09-11, user)

The § 10i verify pass ran the plan against a 13-item delivery-governance checklist and scored it **1 ✅ · 7 🟡 · 5 ❌**. The count is not the finding; **the pattern is**: the plan covers **analysis and specification (upstream)** and has almost nothing for **acceptance, release and handover (downstream)** — the documents that gate payment in fixed-price delivery. The original 55-item proposal under-weighted the same half, because its implied ICP was a product BA rather than a delivery/outsourcing BA.

**The user's ruling: close it now, as a block after phase 08, without touching 06–08 in flight.** D-1 goes 8 → **9** dispatchers.

| | shape | why not the obvious alternative |
|---|---|---|
| **08.1** | `CR` as the **10th entity kind** (`status`, `impact`), and the **Change Log as a derived view** — `traceability.cjs changelog` | A hand-written change register is a second source for a fact the entities already carry, and it drifts. Open Q1's trigger (*"a project needs to query changes independently of the FRs that carry them"*) is met by the user asking, which is what the trigger was for. It also makes wave-2 `qc cr` real: reverse-reachability over edges that now exist. |
| **08.2** | **one** dispatcher `/ba:deliver` with six template actions — `scope · uat · acceptance · release-notes · golive · handover` | Six commands for six documents is the 55-flat-commands defect (D2) rebuilt. One dispatcher, six actions, every action a template composed over the spine + project state. |
| **08.3** | `/ba:spec bp` as an **action, not a kind** | A Business Process Definition needs **citation, not parentage** — see § ID scheme's `BP` entry. Kinds stay at 10. |

**Three things this decision required that the brief for it did not anticipate, and each changes the design:**

1. **D-11 splits by class.** *"Regenerate before commit, never hand-edit"* is right for a document that is a pure function of the spine and **wrong for a UAT run record**, whose result/date/tester cells *are* the run. So deliverables carry a `class:`: `derived` (`scope`, `release-notes`, and 06's `PRD-001`/`SRS-001`) keeps D-11 verbatim; `owned` (`uat`, `acceptance`, `golive`, `handover`, `BP-*`) inverts it — **seeded once, then the human owns it** — and the generator enforces the inversion by refusing to overwrite without `--force`. Byte-stability still applies to both, in the form each can carry: two in-place runs for `derived`, two fresh seeds for `owned`. Wave-2 `qc drift` reads the class header and skips `owned`.
2. **The capability map gets a second table, not seven more rows.** `55` is a **provenance count** — *every capability the proposal promised resolves* — and it is asserted verbatim by **phase 03's Gate 3, a committed phase this block must not touch**. Five of § 10i's items were never among the 55. So the new rows are `D1`–`D13`, `D`-prefixed, which the metric's `awk -F'|' '/^\| *[0-9]+ *\|/'` does not match: measured on the extended file, `rows=55 unmapped=0 no-gloss=0`, unchanged.
3. **One committed assertion is genuinely superseded, and is recorded rather than edited.** Phase 03's Gate 3 also asserts *distinct `/ba:` dispatchers ≤ 8*. Adding `` `/ba:deliver` `` to the map makes that command print **9**. The gate was true when it ran; **08.2 Gate 6 re-runs the identical commands at the new bound `≤ 9`** and names this supersession. A committed phase's gate is history — the honest move is to supersede it in the plan, not to rewrite what a past run checked.

**Deliberately not built**, each with the owner named in the D-13 table so it resolves rather than dangles: sprint plan → `/ck:tickets` + the `plans-kanban` skill · data-migration **plan** → the `database-admin` agent (BA owns only the reconciliation **acceptance criterion**, as an `AC` on the migration `FR`) · the go-live **technical** half, deploy steps and rollback **procedure** → `/ck:docs` and the project's deployment guide · user manual by role → stays `/ba:export userguide` in wave 4 · release **plan** (versions, dates, contents) → stays 🟡 at `/ba:prd roadmap`, because dates and version policy are not derivable from a requirements spine and pretending otherwise is the claim this plan refuses elsewhere.

`docs-manager` and `database-admin` ship from the **engineer** kit (`.claude/agents/engineering/`), and `ba.json` declares no `agents` path — so they are named as **bare agent names with the `engineer` prerequisite stated**, exactly the treatment phase 08 task 8.3 gives `/ck:tickets`, and never as backticked `.claude/agents/…` paths.

### D-10 — product before distribution

The plan was inverted: ten phases, ~2 weeks, and exactly **one** BA-facing command shipping — a context hub — while PRD/FR/UC/US/AC stayed "wave 1, shape only". D-5→D-9 were correct decisions about the *destination* and got built as wave-0 *work*. A solo BA (D-6) developing the kit for their own use needs the skills in a project's `.claude/` — a copy or a symlink. **The installer is for buyers, and buyers arrive after wave 2 validates the kit on a real project.**

| | **Wave 0 — the product** |
|---|---|
| Phases | 01 kit skeleton+manifest · 02 spine · 03 rules+map · 04 `/ba:plan` · **05 `/ba:prd`** · **06 `/ba:spec`+compose** · **07 `/ba:diagram`** · **08 `/ba:qc gap`+handoff** · 09 test wiring · 10 defect record + registry |
| Install | `ck init --kit ba` |
| Gate | the end-to-end chain runs |


The distribution block D-10 created was **deleted outright by D-12** — with the kit public and in-package there is nothing to distribute separately. What survived from it is generic and folded back in: the derived kit loops and exemptions (phase 09) and the defect record (phase 10). Phase 11 (prior-art scan) stays an optional half-day: under the narrowed scope the 3–4 week saving shrinks, and BMAD's persona methodology is not "standard BA".

**Surface cuts (criterion 1, YAGNI on the list *and* the infrastructure).** Dispatchers 12 → **8 BA-owned** (`plan prd spec diagram qc reverse api export`), then **9** when D-13 added `deliver`; wave 0 ships **five** (`plan` `prd` `spec` `diagram` `qc gap`) and wave 1.5 adds `deliver`. Five capability groups are **cut, not deferred**, because the software kit already owns them — `discover`→`/ck:research`, `screen`→`/ck:design`, `sync`→`/ck:tickets --jira`, `test`→folded into `/ba:spec tc`, `qc dashboard|kg`→`plans-kanban`/`gkg`. The capability map records each as a **redirect row**, so all 55 names still resolve and the `rows=55 unmapped=0` metric survives — a row's target may now be a `/ck:` command. `diagram` is **mermaid only**; other notations arrive when a real project asks.

**Spine kinds 16 → 9** (docs `PRD` `SRS`; items `EPIC` `FR` `NFR` `UC` `US` `AC` `TC`), **then 10 when D-13 added `CR`** — the one kind the "promote it only when a project needs to query it independently" trigger has actually been met for. Storage model, derived index, `parents` tables and the AC-prefix rule are unchanged — fewer rows, same contract. (What is ignored vs committed was later settled by **D-11**: index ignored, deliverables committed.)

### The ordering consequence — resolved by D-8

If D-5 is a real product decision, then **phases 01–06 write the BA kit into a public repo that declares itself MIT.** That is not retroactively undoable for anything published.

**Resolved, and better than the answer I proposed.** I recommended shipping wave 0 publicly and gating wave 1, on the reasoning that wave 0 carries no BA domain knowledge. D-8 makes the question moot instead of answering it: the BA files never enter the public repo at all, and what does enter — out-of-tree kit support, derived test loops, a defect record — is generic and worth having on its own merits.

**Nothing in this plan is blocked.** Phase 01 can start immediately.

---

## Global Constraints

Verbatim values. Implicitly part of every phase.

### Identity

| Thing | Verbatim value |
|---|---|
| Kit name · namespace · version | `ba` · `ba` · `0.1.0` |
| Manifest | `.claude/kits/ba.json` — a third in-package kit |
| Commands | `.claude/commands/ba/` |
| Skills | **author under `skills/ba/`**; manifest declares `.claude/skills/ba/` (`.claude/skills` is a symlink here; `resolveSourcePath` de-symlinks on the tarball) |
| Scripts | `.claude/scripts/ba/` |
| Rules workflow | `.claude/workflows/business-analysis-rules.md` — named so `labelFor` yields "Business analysis rules", not "Ba rules" (verified) |
| Capability map (single source) | `.claude/skills/ba/capability-map.md` |
| `requires.shared` | **exactly three**: `.claude/skills/software/scenario/SKILL.md` · `.claude/workflows/primary-workflow.md` · `.claude/workflows/development-rules.md` (see § The `requires.shared` correction) |
| Kit tests | `tests/ba-spine.test.js`, inside ClauKit's suite |
| Install | **one step**: `ck init --kit ba` |
| Context hub (user's project) | `plans/ba-context.md` |
| **Entity files — SOURCE OF TRUTH** | `plans/ba/<project>/entities/<ID>.md`, one file per entity, flat |
| **Derived index — ignored** | `plans/ba/<project>/traceability.derived.json` |
| **Deliverables — COMMITTED** | `plans/ba/<project>/deliverables/` — `{PRD-001.md, SRS-001.md}` (06, class `derived`) · `{SCOPE-001.md, RELEASE-NOTES-001.md}` (08.2, class `derived`) · `{UAT-001.md, ACCEPTANCE-001.md, GOLIVE-001.md, HANDOVER-001.md}` (08.2, class `owned`) · `BP-<slug>.md` (08.3, class `owned`) |
| **Deliverable classes** (D-11 + D-13) | `derived` = regenerated every run, byte-stable, never hand-edited, `qc drift` applies · `owned` = seeded once, then the human owns it, generator refuses to overwrite without `--force`, `qc drift` skips it. Every file declares its class in a header line: `<!-- ba-deliverable: <action> · class: derived\|owned · nguồn: plans/ba/<project>/entities/ -->` |

### The `requires.shared` correction (three entries, not six)

D-12 proposed six, adding `to-tickets/SKILL.md`, `ticket-slicer.md` and `commands/ck/tickets.md` so a `ba`-only install could reach the handoff. **Those three cannot ship**, for a mechanical reason measured on disk:

| candidate | markdown links it carries |
|---|---|
| `commands/ck/tickets.md` | `ticket-slicer.md` · `cook.md` · `git.md` · `plan.md` · `refactor.md` · `scout.md` · `planning/SKILL.md` · `to-tickets/SKILL.md` |
| `skills/software/to-tickets/SKILL.md` | `ticket-slicer.md` · `cook.md` · `plan.md` · `scout.md` · `tickets.md` |
| `skills/software/scenario/SKILL.md` | **none** — and no backticked `.claude/` path either |

`installer-packaging.test.js` § *"no shipped doc links to a file the install does not have"* resolves **every** relative `.md` target in every kit. Shipping `tickets.md` drags in five more commands, each with its own links; the transitive closure is most of the engineer kit. **That is a dependency on `engineer`, not a `requires.shared`.** `marketing.json` agrees — its five entries are all files its prose *names*, and **no `commands/ck/*` at all**.

⇒ ship `scenario/SKILL.md` (link-clean, and a genuine read-time dependency of `/ba:spec tc`) plus the two workflows `hooks/README.md` backticks. **The `/ck:tickets` handoff is a documented prerequisite**: the rules file and README name `/ck:tickets` as a **bare slash string** — never a link, never a backticked path — and state that the handoff needs `engineer` installed in the same project.

### Repo baseline (measured 2026-09-10, before any edit)

```
node --test "tests/*.test.js"   →  ℹ tests 349 / ℹ pass 347 / ℹ fail 1 / ℹ skipped 1
```

The one failure is **pre-existing and unrelated**: `tests/protected-branch-guard.test.js:196` — *"spawned in a real repository, the exit codes are the gate"*, `actual: 0, expected: 2`. Do not fix it here; do not let a gate chase it.

**Suite arithmetic through the plan**, so every phase gate states a number it can re-derive rather than inherit: `349` baseline → `358` after **02** (+9, `tests/ba-spine.test.js`) → `362` after **08.1** (+4, same file) → `366` after **08.2** (+4, `tests/ba-deliver.test.js`) → `366` after **08.3** (+0, by decision — 08.3 task 8.3.7). `pass` is always `tests − 2`, `fail 1`, `skipped 1`. **Phase 09's exit gate reads `366`, not the `358` it was written with** — D-13 inserted three phases ahead of it.

**`npm test` is broken on this machine.** The script is `node --test tests/`; Node v24.14.1 resolves the trailing-slash directory as a module entry point (`Cannot find module '…/tests'`, **0 tests run**). **Every gate in this plan uses `node --test "tests/*.test.js"`.** Fixing the script is out of scope (§ Unresolved Q5).

### Spine model (binding — this is the D-6 change)

**Source of truth = one markdown file per entity. The index is derived and never authored.**

```
plans/ba/<project>/
├── entities/
│   ├── PRD-001.md        ← every node is a file; filename === frontmatter id
│   ├── EPIC-001.md
│   ├── SRS-001.md
│   ├── FR-001.md … FR-010.md
│   └── AC-012.1.md
└── traceability.derived.json     ← DERIVED, regenerable, git-ignored
```

Why, verbatim from the D-6 rationale: per-entity files git-merge cleanly, so multi-BA works later with **zero format migration and zero locking now**; a monolithic JSON is the hottest write target in the kit and would need a migration the moment a second BA appears. Precedent: `to-tickets` — *"one file per ticket, never one combined file"*.

**Entity file, binding shape:**

```markdown
---
id: FR-012
kind: FR
project: acme-refund
title: Duyệt đơn hoàn tiền
doc: SRS-001
parents: [EPIC-003]
source: src/order/refund.service.ts:88
confidence: high
---

# FR-012 — Duyệt đơn hoàn tiền

**Actor:** CSKH   **Precondition:** đơn ở TRẢ_HÀNG

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED
```

**Thirteen frontmatter keys** — eight required, **five** conditional, as noted. (Ten until D-13; `status` and `impact` arrive with `CR`, `release` with `release-notes`. The brief that requested them called `release` "the 11th key" — it is the **13th**, because `status` and `impact` precede it.) **None of the three enters `REQUIRED_KEYS`**: that array is the always-required list checked by plain presence on every kind, and a kind-conditional key placed there fails every entity of every other kind.

| key | rule |
|---|---|
| `id` | matches `DOC_ID` or `ITEM_ID`; **must equal the filename without `.md`** |
| `kind` | one of the 16 kinds below; must agree with the id prefix |
| `project` | equals the basename of the project dir |
| `title` | non-empty |
| `doc` | **item kinds only** — the document entity this renders into. Omitted (and rejected if present) on document kinds. |
| `parents` | inline array. `[]` legal only for `kind: PRD`. |
| `source` | `path/to/file.ts:88` · `doc:<file> p.N` · the literal `[UNVERIFIED]` |
| `confidence` | exactly `high`, `med`, or `low` |
| `out_of_scope` | **required on `EPIC`, optional on `FR`** — one line naming what this deliberately does not cover. Absent on every other kind. |
| `touches` | **optional on `FR`/`US`** — comma-separated module or path hints for greenfield work, or the literal `[UNKNOWN]`. Brownfield uses `source:` instead. |
| `status` | **required on `CR`** (D-13) — exactly `proposed`, `approved`, `rejected` or `done`. Rejected on every other kind (`status-on-wrong-kind`). |
| `impact` | **required on `CR`** (D-13) — one line naming what the change affects. Rejected on every other kind (`impact-on-wrong-kind`). |
| `release` | **optional on `FR`/`US`** (D-13) — the release this ships in; **absent by default and never required**. Rejected on every other kind (`bad-release`). Entities without it group under `## Unreleased`. |

**Why `out_of_scope` is a field and not a prose convention.** It maps to `/ck:cook` Stage-0 item 3 (scope boundary), and it is the item BA specs habitually omit — so **if it cannot be validated it will be omitted.** A field can be required by `validate` and rendered deterministically by `compose`; a `## Phạm vi` section convention can be neither. It sits on `EPIC` because that is where scope decisions are actually made, and tickets slice along FR/US lines, so an FR inherits its EPIC's boundary unless it narrows it. This is the one addition D-10's addendum forces on the 8-key contract; everything else the gate needs was already there.

**D-4 is binding on the COMPOSED deliverable, not on storage.** The wave-1 composer renders each **requirement entity (FR / NFR / UC / US)** into exactly D-4's block — the set phase-06's exit gate counts `**source:**` lines against; AC nests under its US and TC under its AC, each carrying provenance through `parents` rather than a repeated meta line (review ruling R-S4, 2026-09-11) — — `## FR-012 — Duyệt đơn hoàn tiền`, then `**Actor:** … **Precondition:** …`, then `**source:** … **confidence:** …`, then the Given/When/Then body. All four D-4 fields survive verbatim in the artifact a client signs. Storage keeps them in frontmatter so the index needs no body parsing. **My earlier proposal to add `**parents:**` to D-4's rendered meta line is withdrawn** — parents live in frontmatter now, and D-4's block is untouched.

### ID scheme (verbatim) — 10 kinds

Two **disjoint** sets, one regex each. D-10 cut seven kinds; what remains is what a two-document spec pack actually signs, plus **`CR`** (D-13).

**Document kinds (2)** — a document IS a node; `doc:` may name only these, and they carry no `doc:` of their own:

| kind | id | `parents` may name |
|---|---|---|
| `PRD` | `PRD-001` | — (root; `[]` legal) |
| `SRS` | `SRS-001` | `PRD` |

**Item kinds (8)** — each requires a `doc:`:

| kind | id | `parents` may name | `doc:` |
|---|---|---|---|
| `EPIC` | `EPIC-001` | `PRD` | `PRD-001` |
| `FR` | `FR-001` | `EPIC` | `SRS-001` |
| `NFR` | `NFR-001` | `PRD`, `EPIC` | `SRS-001` |
| `UC` | `UC-001` | `FR` | `SRS-001` |
| `US` | `US-001` | `EPIC`, `FR`, `UC` | `SRS-001` |
| `AC` | `AC-012.1` | `US`, `FR` | `SRS-001` |
| `TC` | `TC-001` | `AC`, `FR`, `NFR` | `SRS-001` |
| `CR` | `CR-001` | `EPIC`, `FR`, `NFR`, `UC`, `US` | `SRS-001` (`PRD-001` when every parent is an `EPIC`) |

```js
const DOC_ID     = /^(PRD|SRS)-\d{3}$/;
const ITEM_ID    = /^(EPIC|FR|NFR|UC|US|TC|CR)-\d{3}$|^AC-\d{3}\.\d{1,2}$/;
const KIND_ORDER = ['PRD','SRS','EPIC','FR','NFR','UC','US','AC','TC','CR'];
```

**`'CR'` is APPENDED to `KIND_ORDER`, never inserted.** That array's index is the primary node sort key in `buildIndex`; inserting a kind anywhere but last reorders `nodes` in every existing index and every view over it. Appending is what makes D-13's spine change additive — measured by 08.1 Gate 5, which re-runs `compose` over the demo tree and requires a **zero-byte diff** on both signed deliverables.

**`CR` has no `AC`/`TC` parent, deliberately.** An AC changes because its US changed and a TC because its AC did, so a CR pointed at either is pointed at the wrong node — and `parent-kind-not-allowed` says so (08.1 Gate 4).

**`source:` on a `CR` follows rule 1 unchanged** — it names the change-request artifact (`doc:CR-2026-014-email.pdf p.1`). A CR carrying `[UNVERIFIED]` therefore lands in `index.unsourced` and `gap` exits 1. **That is correct and is not to be exempted:** an unsourced change request is a corridor conversation, and phase 08's handover gate should refuse it. `findGaps` gets no CR branch.

**Dropped, with the reason** — `BRD`/`URD`/`UCS`/`USS`/`TCS` (most teams ship two signed documents; UC/US/TC are lists inside the SRS or composed views, not separately signed) · `BR` (business rules live in FR prose in wave 0 — see § Unresolved Q1; **`CR` became the tenth kind and `BR` still has not**, because Q1's trigger was met for changes and not for rules) · `TKT` (tickets are `/ck:tickets`' model, and duplicating it here would be the twin this kit exists to avoid) · **`BP`** (D-13: a Business Process Definition has no children and no `PARENT_KINDS` row would name it, so every `BP-*` would be `unparented` on day one; it needs **citation, not parentage**, and 08.3 Gate 2 checks citations mechanically. Revisit only when a project needs to ask the index — not grep — which processes an entity participates in).

**AC prefix rule** unchanged: an `AC` id's `\d{3}` must equal its declared parent's. **Numbering** unchanged: three digits, zero-padded, unique per kind per project.

### `traceability.derived.json` shape (binding, derived)

```json
{
  "version": 1,
  "project": "acme-refund",
  "generated": "2026-09-10T17:06:00.000Z",
  "generator": "ba-traceability/1.0.0",
  "nodes": [
    { "id": "FR-012", "kind": "FR", "title": "Duyệt đơn hoàn tiền",
      "file": "entities/FR-012.md", "doc": "SRS-001", "parents": ["EPIC-003"],
      "source": "src/order/refund.service.ts:88", "confidence": "high",
      "out_of_scope": null, "touches": null,
      "status": null, "impact": null, "release": null }
  ],
  "edges": [{ "from": "FR-012", "to": "EPIC-003" }],
  "orphans": [{ "id": "FR-014", "reason": "dangling", "detail": "parent EPIC-999 is not in the index" }],
  "unsourced": ["NFR-002"]
}
```

- `file` is **relative to the project dir**, POSIX separators. Absolute paths never enter the file.
- `nodes` sorted by `[KIND_ORDER.indexOf(kind), numericPart, id]`; `edges` sorted by `[from, to]`. One edge per (child, parent) pair. **No `type` field** — relation derives from endpoint kinds.
- `orphans[].reason` ∈ `'unparented' | 'dangling'`. `doc:` problems are **validation** violations, not orphans.
- Determinism: two runs over an unchanged tree differ **only** in `generated`.

### The `compose` output is a `/ck:cook` Stage-0 input (binding)

`/ck:cook`'s Exact-Requirements Gate derives **five items** and is **UNSKIPPABLE** (`.claude/commands/ck/cook.md:85-86`): expected output · acceptance criteria · scope boundary · constraints · touchpoints. `--from-plan` *satisfies it from the file* and `[ASSUMED]`-logs anything missing (`:36`) — it never asks. **So "did the BA spec carry enough" is greppable**, which is what makes the handoff testable rather than asserted.

| cook Stage-0 item | supplied by |
|---|---|
| expected output | the FR/US title + body — already present |
| acceptance criteria | `AC-*` children rendered as D-4's Given/When/Then — already present, and why `compose` nests ACs under their US |
| **scope boundary** | **`out_of_scope`**, required on `EPIC`, inherited by its FRs — the one key this contract adds |
| constraints | `NFR-*` reachable from the same EPIC. **Not "NFR + BR tags"** — `BR` is dropped and no tag mechanism exists (§ Unresolved Q1); wave 0 supplies constraints from NFRs alone |
| touchpoints | `source:` when it is a real `file:line`; `touches:` otherwise; `[UNKNOWN]` when genuinely unknown. **This is the one item expected to be `[ASSUMED]`.** |

**The metric this enables, and its honest scope:** `/ck:cook <ticket> --from-plan` reaches Stage 0.5 with `[ASSUMED]` logged **only for touchpoints (item 5), and for nothing else** — `grep -c '[ASSUMED]'` = **1** per ticket, and that one line names touchpoints.

Touchpoints is **unknowable from a BA spec by construction** — a spec names no files — so 1 is the correct floor, not a shortfall. Items 1–2 are not `[ASSUMED]` precisely because they are present in the composed file, which subsumes the structural check I previously ran separately; items 3–4 come from `out_of_scope` and the reachable `NFR-*`. **Anything above 1 means `compose` dropped a label** — check phase 06 Gate 4 first.

**The claim this licenses, and its limit:** the spec is a first-class ticket source with no conversion step; the cook leg still needs `/ck:scout` or one Stage-0 answer for touchpoints. **Do not claim a fully automatic BA→code pipeline.**

### What is ignored, and what is committed (D-9 + **D-11**)

**Ignored — the index only.** `traceability.derived.json` is a cache: byte-derivable from the entity tree, regenerated on demand, and the hottest merge target in the kit. ClauKit's generic `plans/**/*.derived.json` in `PLAN_RULES` (phase 09 task 9.4) covers it, and the kit declares nothing. That rule is **JSON-only and now sufficient** — D-11 withdrew the widening to `plans/**/*.derived.*`.

**Committed — the deliverables.** `deliverables/PRD-001.md` and `deliverables/SRS-001.md` are the artifacts a client signs. **D-11 overruled my earlier ruling that they were regenerable caches to be ignored.** Four reasons, and each is decisive on its own:

1. **Exact bytes are the contract.** The composer *will* change between waves; a regenerated copy is then a different document with no record of what was approved. *"Which version did the client sign?"* is a real BA failure mode, and ignoring the file guarantees it.
2. **A committed ticket must not point at an ignored source.** `/ck:tickets` output lives in `plans/<dir>/tickets/` and is committed, referencing its source — precisely the *"an ignored report is a 404 in a PR body"* failure the repo's own root `.gitignore` comment exists to prevent.
3. **Repo precedent is exact.** `plan.md`, `phase-*.md` and `reports/*.md` are committed; only artifacts *regenerated from git on demand* are ignored. **A deliverable is a release, not a cache.**
4. **Deferring the deliverable to wave 4 defeats D-10.** A BA must be able to hand over an SRS in wave 0; that is the whole point of the re-sequence.

**The two-sources-of-truth concern is real and gets a cheaper answer than deletion:** determinism plus a drift gate. `compose` must be **byte-stable over an unchanged entity tree** — the same requirement the index already carries, extended — so the deliverable carries **no timestamp**; generation metadata lives in the index only. The rule is *regenerate before commit, never hand-edit* (already an anti-pattern in phase 06; it now protects a committed file), and wave-2 `qc drift` gets its first real job: `compose(entities) == committed bytes`, else DRIFT.

**And the inversion strengthens argument 1 rather than weakening it:** a composer change that rewrites a signed document shows up as a **diff in a commit**. Ignoring the file is what would have made that rewrite invisible. Git history *is* the record of what was signed — which is the non-obvious reason committing wins, and worth stating so the ruling is not re-litigated.

**Rejected, again:** having `traceability.cjs index` write a `plans/ba/.gitignore` at runtime. Kit-local, but it invents a pattern where a tested mechanism exists.

### Helper CLI contract (binding)

```
node .claude/scripts/ba/traceability.cjs index     <project-dir> [--json]
node .claude/scripts/ba/traceability.cjs gap       <project-dir> [--json]
node .claude/scripts/ba/traceability.cjs validate  <project-dir> [--json]
node .claude/scripts/ba/traceability.cjs compose   <project-dir> [--json]            # ruling R7
node .claude/scripts/ba/traceability.cjs changelog <project-dir> [--json]            # 08.1 (D-13)
node .claude/scripts/ba/traceability.cjs deliver   <project-dir> <what> [--force] [--json]   # 08.2 (D-13)
     what ∈ scope | uat | acceptance | release-notes | golive | handover | all
```

Exit codes — same shape as `.claude/scripts/ck/plan-lint.cjs`: **`0` = clean · `1` = findings · `2` = usage error / project dir missing.**

**Which subcommands are verdicts:** `gap` and `validate` only (and `compose`/`deliver` inherit `validate`'s exit 1 when the tree is dirty, writing nothing). `index` and **`changelog`** exit **0 always** — an index and a change log are reports, and a third verdict would make *"the exit code is the gate"* ambiguous. `deliver` additionally exits 1 when it **skipped** an `owned` file that already exists, so a script cannot mistake a skip for a write.

### Link + prose rules (enforced by `tests/installer-packaging.test.js`)

- **Markdown link targets resolve from the containing file's INSTALLED position.** Commands at `.claude/commands/ba/` → `../../skills/ba/…`. Skills at `.claude/skills/ba/<name>/` → `../../../workflows/…`. Display text stays the canonical `.claude/…` path.
- **Backticked prose paths are root-relative and must exist in a `ba` install.** Never backtick a wave-1+ command file; name unshipped commands as bare slash strings (`/ba:spec`).
- **Never write "Activate the `<x>` skill"** for anything under `.claude/skills/ba/` — grouped skills at depth 2 are not registered (measured, `CLAUDE.md`). Write, verbatim (shown as code so it is not itself a link):
  ```markdown
  **Read the `traceability` skill file** ([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md))
  ```
- **An install writes nothing outside `.claude/`.** Every manifest path is `.claude/`-prefixed.

### Files this plan must NOT touch

`CHANGELOG.md` · `.claude/kits/{engineer,marketing,both}.json` · `bin/lib/relocate-scripts.js` · `bin/lib/retired-files.js` · `bin/lib/cjs-migrate.js` · `tests/protected-branch-guard.test.js` · `tests/relocate-scripts.test.js` · `skills/marketing/**` · `skills/software/**` · **`package.json`** (the npm rename is a named prerequisite, not this plan's work) · **any LICENSE file** (phase 08 records, does not decide).

**Added by D-13, for the wave-1.5 block only:** phase files **01–08** are committed or in flight and are **not edited** — the block appends 08.1–08.3 and supersedes in `plan.md` instead (§ D-13 item 3) · **`STATE.md` history is extended, never rewritten** · `.claude/scripts/ck/**` (Unresolved Q6 is ClauKit debt, recorded not fixed) · `npm test`'s script line (Q4 stands; every gate uses `node --test "tests/*.test.js"`). Editable by the block, and only these: `phase-09-test-wiring.md`'s exit-gate **count** (`358` → `366`, a stale number in a phase that runs *after* the block — leaving it guarantees a false gate failure) and `.claude/kits/ba.json`'s `description` **counts**.

---

## Scope options

D-12 settled the repo axis (one tree, in-package). The remaining choice is how much generic ClauKit hygiene the kit takes on.

| Option | Surface | Conventions followed / broken | Recommended |
|---|---|---|---|
| **A (minimal)** | `.claude/kits/ba.json` + `skills/ba/` + `.claude/commands/ba/` + `.claude/scripts/ba/` only | Ships the kit. **Breaks:** the four guards keep their hardcoded `['engineer','marketing','both']`, so nothing ever checks a `ba` link or path; `.claude/scripts/ba/` ships outside `esm-host`'s scope; `hooks/README.md`'s backtick to `branch-guard.cjs` fails the shipped-path check the moment `ba` enters the loops. | |
| **B (thorough)** | + derived kit list · generic `shipsCkScripts` exemption · derived `SHIPPED_NODE_DIRS` · one `PLAN_RULES` entry · `docs/known-defects.md` + registry rows | Every added item is generic and kit-agnostic — a fifth kit inherits all of it for free. Cost: 3 test files, 2 `bin/lib` lines, 5 doc files. | **✓** |

**Picked: B.** Option A is not "smaller", it is *unguarded*: wave 0 would ship a kit that no link check, no path check and no ESM check has ever seen — the exact failure class that produced 38 broken links and a `ck init` that exited 1 for every consumer.

## Architecture

```
ClauKit repo (public, MIT)                    a project after `ck init --kit ba`
──────────────────────────────                ────────────────────────────────────
.claude/kits/ba.json                  ──────▶ (read by the installer)
.claude/commands/ba/{plan,prd,spec,   ──────▶ .claude/commands/ba/*.md
                     diagram,qc}.md
skills/ba/**  (via the .claude/skills ──────▶ .claude/skills/ba/**
              symlink; de-symlinked
              on the npm tarball)
.claude/scripts/ba/{traceability.cjs, ──────▶ .claude/scripts/ba/**
                    lib/}
.claude/workflows/business-analysis-  ──────▶ .claude/workflows/…
                  rules.md
requires.shared: scenario/SKILL.md +  ──────▶ (three engineer files, link-clean)
                 2 workflows
                                              plans/ba-context.md               ← /ba:plan
                                              plans/ba/<p>/entities/*.md        ← SOURCE OF TRUTH
                                              plans/ba/<p>/traceability.derived.json  ← ignored
                                              plans/ba/<p>/deliverables/*.md    ← COMMITTED
                                                        │
                                                        ▼  /ck:tickets (needs `engineer`)
                                              plans/<YYMMDD-HHmm>/tickets/*.md  → /ck:cook
```

**The seam is a command call, not an integration.** `/ba:spec compose` writes a markdown spec; `/ck:tickets` already accepts `spec-path` as a first-class source. Nothing is wired, adapted or converted — which is why `requires.shared` stays at three files and why the two kits compose in one project without a combination manifest.

## Phases

One milestone. Phases 01–08 are the product; **08.1–08.3 are wave 1.5** (D-13, delivery governance); 09–10 are the guards and the paper trail; 11 is optional.

**Why the new phases are numbered `08.1`–`08.3` and nothing was renumbered.** Three options were measured against `.claude/scripts/ck/lib/plan-checks.cjs` `discoverPhases` (`:79-96`) and `phase-brief.cjs:57-58`, which share a phase-discovery regex on purpose:

| option | measured result |
|---|---|
| `phase-08b-*.md` (the shape the D-13 brief suggested) | **Invisible.** `^phase-0*(\d+(?:\.\d+)?)[-.]` never matches `08b`, so the phase gets **no lint coverage and no phase brief** — probed: a dir holding `phase-08`, `phase-08b`, `phase-09` discovers phases `8` and `9` only. Rejected. |
| renumber `09→12, 10→13, 11→14` | Works, but renames three phase files that nothing in this block edits, leaves `Task 9.x` numbering inside a `phase-12` file, invalidates ruling **R2**'s recorded execution order and phase 06's cross-reference to "phase 09". Rejected — the brief also forbids rewriting STATE.md history, and this rewrites what that history *means*. |
| **`phase-08.1/.2/.3-*.md`** | **Picked.** Probed: `plan-lint` discovers `1, 8, 8.1, 8.2, 8.3, 9` and resolves each to its own file; `Number(a)-Number(b)` sorts the block between 08 and 09; the root `.gitignore` allowlist `!plans/*/phase-*.md` tracks them; 09/10/11 keep their numbers, their task numbering and their place in R2's order. |

**The one cost of the decimals, and its mitigation.** The resolver's per-id regex `^phase-0*8[-.]` matches **both** `phase-08-…` and `phase-08.1-…`, so which file phase `8` resolves to depends on `readdirSync` order. It resolved correctly in every probe (`-` sorts before `.`, and the new files are appended to a small linear ext4 directory), but that is luck, not a contract — so **08.1 Gate 0 below is the check**, and the ambiguity is recorded as § Unresolved Q6:

```bash
node -e 'const c=require("./.claude/scripts/ck/lib/plan-checks.cjs"),fs=require("fs");
  const d="plans/260910-1533-ba-kit";
  console.log(c.discoverPhases(d,fs.readFileSync(d+"/plan.md","utf-8")).map(p=>p.id+" -> "+p.source).join("\n"))'
```
→ `8 -> phase-08-qc-gap-and-handoff.md` and `8.1 -> phase-08.1-cr-kind-and-changelog.md` (and `.2`, `.3` likewise). **Run it before 08.1 and after 08.3.** A crossed mapping means a phase brief would be generated from the wrong file, which is the failure this one line makes loud.

| # | Phase | File | Depends on | Status |
|---|---|---|---|---|
| 01 | Kit skeleton + `.claude/kits/ba.json` | [phase-01-kit-skeleton-and-manifest.md](phase-01-kit-skeleton-and-manifest.md) | — | ✅ a60655c |
| 02 | Traceability spine (9 kinds) + the `PLAN_RULES` entry | [phase-02-traceability-spine.md](phase-02-traceability-spine.md) | 01 | ✅ 26d879d |
| 03 | Rules + kit README + capability map (55 names, redirect rows) | [phase-03-rules-readme-capability-map.md](phase-03-rules-readme-capability-map.md) | 01 | ✅ c5c827b |
| 04 | `/ba:plan` + `ba-context` hub | [phase-04-ba-plan-and-context-hub.md](phase-04-ba-plan-and-context-hub.md) | 03 | ✅ d608d31 |
| 05 | `/ba:prd` — PRD + EPIC breakdown, roadmap | [phase-05-ba-prd.md](phase-05-ba-prd.md) | 02, 03, 04 | ✅ 7e41066 |
| 06 | `/ba:spec` — FR/NFR/UC/US/AC/TC + **compose** (D-4 lives here) | [phase-06-ba-spec.md](phase-06-ba-spec.md) | 05 | ✅ 3ec8f78 |
| 07 | `/ba:diagram` — mermaid only, 4 types | [phase-07-ba-diagram.md](phase-07-ba-diagram.md) | 02, 03 | ✅ 6331527 |
| 08 | `/ba:qc gap` + the BA→dev handoff chain | [phase-08-qc-gap-and-handoff.md](phase-08-qc-gap-and-handoff.md) | 02, 05, 06 | ✅ edcfc36 |
| **08.1** | **`CR` as the 10th entity kind + the derived Change Log** (D-13) | [phase-08.1-cr-kind-and-changelog.md](phase-08.1-cr-kind-and-changelog.md) | 02, 06, 08 | ✅ b63a5dc |
| **08.2** | **`/ba:deliver` — the 9th dispatcher: scope · uat · acceptance · release-notes · golive · handover** (D-13) | [phase-08.2-ba-deliver.md](phase-08.2-ba-deliver.md) | 08.1, 06, 08 | ✅ f47ef78 |
| **08.3** | **`/ba:spec bp` — Business Process Definition as an action** (D-13) | [phase-08.3-ba-spec-bp.md](phase-08.3-ba-spec-bp.md) | 07, 08.2 | ✅ 1ece676 |
| 09 | Test wiring — derived kit loops, generic exemptions | [phase-09-test-wiring.md](phase-09-test-wiring.md) | 01 | ✅ 1185be8 |
| 10 | Defect record + registry/docs | [phase-10-defect-record.md](phase-10-defect-record.md) | 01–09 | ✅ 1c59c23 |
| 11 | *(optional)* Prior-art reference scan, license-first | [phase-11-prior-art-scan-optional.md](phase-11-prior-art-scan-optional.md) | — | ⏭ skipped (optional) |

```
01 ──┬─> 02 ──┬──────────────> 07 ──────────────────────┐
     │        └─> 09                      (guards; needs only the manifest)
     └─> 03 ──┴─> 04 ─> 05 ─> 06 ─> 08 ─> 08.1 ─> 08.2 ─┴─> 08.3 ─> 09 ─> 10
                                    ▲                                ▲
                          wave-0 exit: the chain runs    test wiring still runs last
                          end to end                     (its four guards must see
                                                          every wave-1.5 file)
```

**Ordering constraint (wave 1.5):** the block runs **after 08 and before 09**, and 09 must still run last of the code phases. 09 derives the four guard loops from `.claude/kits/*.json`, so whatever 08.1–08.3 ship enters the link check, the shipped-path check and the ESM check **by existing** — but only for files that are on disk when 09 runs. Until then each wave-1.5 phase carries its own install-and-walk gate (08.1 Gate 7, 08.2 Gate 5), because `.claude/skills` is a symlink in this repo and a real directory in an install, so the repo cannot validate a relative link at all.

**Ordering constraint (wave 0):** phase 01 authors the manifest, but `ck init --kit ba` cannot be *run* until 02–08 have filled the declared trees — `bin/ck.js:49` exits 1 on a missing path before copying anything. Phase 01's Gate 1 (the manifest is listed and well-formed) runs immediately; its Gates 2–3 (a clean install) run last.

## Success metrics → the step that makes each true

**Top-line — the chain, and the cook handoff:**

| Metric | Made true by |
|---|---|
| **The chain runs end to end** — `/ba:prd → /ba:spec → /ba:qc gap → /ba:spec compose → /ck:tickets <SRS>` yields **≥ 3 tickets, each with ≥ 1 AC that traces to an `AC-###.#` in the spine** | **08** Gates 1–2 — `comm`s ticket ACs against the index, empty diff required. `gap` exit 0 is the handover gate. |
| **`/ck:cook <ticket> --from-plan` reaches Stage 0.5 with `[ASSUMED]` logged only for touchpoints** — `grep -c` = **1**, and that line names touchpoints | **08** Gate 3, supplied by **06** Gate 4. Greenfield fixture sets the bar; brownfield can reach 0. Above 1, or a line naming anything else ⇒ `compose` dropped a label. |

**Kit metrics — the original ones, restored by D-12:**

| Metric | Made true by |
|---|---|
| **`ck --kit list` shows `ba`** | **01** Gate 1 — `printKitList()` globs `.claude/kits/*.json`; no code change. (The D-8-era "assert it does **not** appear" guard is **deleted**.) |
| **`ck init --kit ba` installs clean into a scratch dir** — one step | **01** Gate 2, incl. the `scenario` skill arriving via `requires.shared` and CLAUDE.md reading "Business analysis rules" |
| A two-kit project works — `ba` + `engineer` union onto one tree, idempotently | **01** Gate 3 |
| `installer-packaging.test.js` / `installer-claude-md.test.js` / `esm-host.test.js` **green *and actually looking at `ba`*** | **09** — the four loops derive from `.claude/kits/*.json`, so `ba` enters by existing; **09** Gate 3 proves a fifth kit would too |

**Product metrics:**

| Metric | Made true by |
|---|---|
| Spine round-trips: 13 entities ⇒ 2 planted orphans, 0 false positives, with a negative control | **02** task 2.7 · Gates 1–2 |
| 0 orphans / 0 unsourced / 0 broken edges on generated output; every EPIC carries `out_of_scope` | **05** Gate 1 · **06** Gate 1 |
| `compose` emits D-4's block verbatim, ACs nested under their US, all five Stage-0 labels per block | **06** Gates 3–4 |
| Deliverables are **byte-stable and committable**; only the index is ignored | **06** Gate 5 · **02** Gate 6 |
| 100% of diagrams compiled **or** `[UNRENDERED]` — no third state | **07** Gate 2 (expected here: 4 labelled, 0 claimed) |
| All 55 capability names resolve (`rows=55 unmapped=0`); **≤ 9** `/ba:` dispatchers; ≥ 5 redirect rows | **03** Gate 3 as run (`≤ 8`, true at the time) · **08.2** Gate 6 re-runs the identical commands at the D-13 bound `≤ 9`. **The committed gate is superseded, not rewritten** — § D-13. |
| 0 new duplicate registry entries — **as a written decision, not silence** | **10** task 10.2 § 4b/4f, in ClauKit's own registry (the private-registry redirection is gone) |

**Wave-1.5 metrics (D-13) — the § 10i scoreboard, closed:**

| Metric | Made true by |
|---|---|
| § 10i's 13 delivery-governance items each resolve to a command, a script view, or a **named** redirect — `d-rows=13 unresolved=0`, and `rows=55` is **byte-for-byte unchanged** | **08.2** Gate 6 (a second, `D`-prefixed table; numbering the new rows `1`–`13` would have printed `rows=68` and failed a committed gate) |
| The spine change is **additive**: `compose` over the demo tree produces a **zero-byte diff** on both signed deliverables after `CR` exists | **08.1** Gate 5 |
| `changelog` = 2 rows, ordered, status present, exit 0; `gap` still 0 orphans / 0 unsourced with CRs present; `validate` exits 1 on a CR without `status` **and** on `status` placed on an FR | **08.1** Gates 1–3 |
| `deliver uat` names every `TC` in the index **exactly once**, and its coverage line equals what `gap` reports | **08.2** Gate 1 |
| `deliver acceptance`'s FR set equals the index's FR set, and its variance section lists **exactly** the `approved` CRs (the `rejected` one appears **0** times) | **08.2** Gate 2 |
| Every new deliverable is byte-stable per class — `derived` across two in-place runs, `owned` across two fresh seeds — with **0** timestamp lines and **0** clock calls in the renderers | **08.2** Gate 3 |
| `/ba:deliver` and `/ba:spec bp` write **no entity** — one writer per store | **08.2** Gate 4 · **08.3** task 8.3.3 |
| Kinds stay at **10**: no `BP` kind, and every id a `BP-<slug>.md` cites exists in the spine (`comm` prints nothing) | **08.3** Gates 2 and 4 |
| 9 dispatchers, **6** shipped command files, every `description:` ≤ 110 bytes and the total ≤ **1536** | **08.2** Gate 7 (measured before the block: `248` bytes over 3 files) |

## Waves 1–4 — shape only

Wave 0 is phases 01–08 above; what follows is the shape of the rest, with D-10's cuts applied and D-12's simplification already absorbed (everything lands in ClauKit, as `ba`-kit paths).

**Wave 1 (~1–2 wk) — deepen what wave 0 shipped, do not widen it.** `/ba:prd` and `/ba:spec` gain the interview depth a real project demands (stakeholder passes, glossary enforcement, NFR checklists); `/ba:diagram` gains a second notation **only if a real project asks for one**. No new dispatcher.

**Wave 2 (~2–3 wk) — `reverse`, then STOP and validate.** `reverse` (`reverse-doc`, `code-to-srs`) is the moat: legacy source → SRS with a resolvable `file:line` in every `source:`, built on `scout`/`ck-graphify`/`gkg`/`Explore`. It is once-per-project rather than daily, which is why D-10 moved it out of wave 0. `qc` gains `drift` and `cr`. **This is the real-project validation gate**, and with D-12 it no longer gates a distribution milestone — it gates whether waves 3–4 are worth building.

**Wave 3 (~1 wk) — `api`, trimmed.** `doc` + `map` only — the BA halves. `test`/`checklist`/`readiness` are QA and dev work and stay cut.

**Wave 4 (~1 wk) — `export`.** Onto ClauKit's `preview` skill and `planning/references/html-output.md`. The first `ba` command needing `requires.shared`, in `marketing.json`'s shape — **still no combination manifest**, since `extends` is inert. Note that `/ba:spec tc`'s dependency on the `scenario` skill (phase 08 task 8.3) is the *first* such entry chronologically, even though `export` is where the manifest field first gets written.

## Environment findings (R3 / § 11 Q3)

Measured 2026-09-10. **Nothing was installed.**

| Binary | `command -v` | Consequence |
|---|---|---|
| `d2` · `plantuml` · `mmdc` · `dot` | **all not found** | R3's render gate has **zero** locally-callable binaries |
| `java` | `/usr/bin/java` | a downloaded `plantuml.jar` would run |
| `npx` | present (Node v24.14.1) | `npx -y @mermaid-js/mermaid-cli` would work with network |
| `repomix` | **not found** | phase 07 must use `npx -y repomix` or `git clone` |

No `plantuml*.jar` anywhere under `/` (depth 4). Global npm packages: `@trungdo9/ClauKit`, `corepack`, `npm`.

**Reading:** not blocked — two of three are one `npx`/download away and `d2` is a static binary — but wave 1's `diagram` needs a **degrade-explicitly** contract, the posture `seo-drift` takes with `[NO BASELINE]`. Default `--format mermaid`.

---

## Unresolved questions

Six, none blocking. D-12 closed two; D-13 added one and partly answered another.

1. **`BR` was dropped as "a tag on FR" — but no tag mechanism exists, and one should not be built now.** The entity contract has thirteen fixed frontmatter keys and no `tags: []`. **Business rules live in FR prose in wave 0.** Promote `BR` to a further kind **only if a real project needs to query rules independently of the FRs that carry them** — a falsifiable trigger, unlike "it feels like a first-class concept". **D-13 is the worked example of that trigger firing**: `CR` became the tenth kind because something must be reachable *from* a change request, so `PARENT_KINDS.CR` wrote itself and `changelog` is a view over real edges. `BR`'s trigger has still not fired, and `/ba:spec bp` explicitly forbids a BP from restating a rule as prose — its business-rules section carries `FR-###` references only (08.3 task 8.3.2), so the second source this question warns about cannot enter through the new document either.
2. **ClauKit's missing `LICENSE`** — `package.json` declares MIT and its `files` array promises `LICENSE`, and no such file exists, so the grant lives only in a JSON field. **MIT covers `ba` automatically** (D-12), so this does not block the kit; it is ClauKit debt recorded in `docs/known-defects.md` (**10** task 10.1). Facts only, no legal conclusion.
3. **npm rename** — `@trungdo9/claukit` is free; the current name cannot be published. Blast radius recorded, **including the collision**: `plans/260825-1134-kitforge-display-rename/phase-05-verify-and-manual-steps.md:52` asserts `p.name === "@trungdo9/ClauKit"` as a frozen-literal gate, so a rename fails that plan's own verification. **Revisit that freeze first.** Noted, not planned.
4. **`npm test` runs zero tests on Node ≥ 24** — the script is `node --test tests/`, which Node 24 resolves as a module entry point. CI reports one failure that is actually complete absence of coverage. One-line fix, its own change. **Do not fix here**; every gate uses `node --test "tests/*.test.js"`.
5. **AC id allocation under `reverse`** — `AC-###.#` inherits its parent's number, but a reverse run produces FRs before ACs. Fine for wave 0 (validation checks, does not allocate). **A wave-2 design question, and it belongs there.**
6. **`plan-lint`'s phase-file resolver is ambiguous across a decimal insert** (found while placing D-13's block; ClauKit debt, not `ba` debt). `plan-checks.cjs:92` resolves phase id `8` with `` new RegExp(`^phase-0*8[-.]`) `` and `phase-brief.cjs:58` with `` `^phase-0*8\b` `` — **both match `phase-08.1-…` as well as `phase-08-…`**, so which file phase `8` resolves to depends on `readdirSync` order. It resolved correctly in every probe (`-` sorts before `.`; the new files append to a small linear ext4 directory), and § Phases carries the one-line check that makes a crossed mapping loud. The fix is a one-character change — `[-.]` → `-` in the per-id lookup, with the decimal case handled by the id itself — and it is **not this plan's work**: it touches `.claude/scripts/ck/lib/` for every plan in the repo. Record it in `docs/known-defects.md` alongside the LICENSE finding (**10** task 10.1); do not fix it inside the BA block.

**Closed:** the kit's home (**D-12** — public ⇒ in-package third kit; D-5/D-7/D-8 reversed, the distribution milestone deleted) · proprietary licence text (**no longer exists** — MIT covers `ba`) · the wave-0 sequence (D-10) · the dispatcher surface (12 → 8, five in wave 0) · the spine kind count (16 → 9) · the ignore-rule route (D-9 generic pattern) · the deliverable's git status (**D-11** — committed) · `/mk:plan`'s self-contradicting pre-flight (no ticket; `/ba:plan` does not inherit it) · `skills-lock.json` (deferred until a VENDOR verdict).

## Execution record

**Execution order (ruling R2, STATE:11):** 01 → 03 → 02 → 04 → 05 → 06 → 07 → 08 → 08.1 → 08.2 → 08.3 → 09 → 10 (phase 11 optional, skipped). Ordered per dependencies: phase 02 Gate 6 requires phase 03's business-analysis-rules.md, so 03 runs before 02. Phase 09 runs last of code phases to capture all guard loops.

**Collaboration (STATE:79, ruling):** Two sessions drove this plan. Session **ac3691da** (06:00–17:09 UTC) executed Implement on phases 01–07 (~220 min); session **daa2b6c5** (16:00–18:13 UTC) executed phases 08 (STATE:75), 08.1–10 and Implement, with session **2d17922d** (14:00–present) as SUPPORT: verify-plan 08.x, gate line, Review + Docs. Coordination via STATE.md ledger; no file conflict. Final HEAD: `c97482d` (phase 10 = `1c59c23`, then review fix cycles `947d854` → `3e1f6d5` → `c97482d`) (phase 10 complete).

**Review (STATE:115–151):** Three fix cycles: cycle 1 (947d854) fixed path-traversal containment + error boundary + class markers; cycle 2 (3e1f6d5) fixed derived-rewrite reporting + slug in markers; cycle 3 (c97482d) fixed rules § Cross-references and violation object ids. Closed 4 High + 5 dedup Medium + 2 Low across Standards / Spec / Security axes. Closing gate 13/13 CLEAN on c97482d.

**Test coverage:** 349/347 baseline (measured 2026-09-10) → 366/364 final (1 pre-existing fail, 1 skipped). Phases 02/08.1/08.2 each added tests; phase 08.3 added zero by decision (development-rules.md § guidance).

## Plan Completeness

- [x] spec coverage — every requirement maps to a phase
- [x] placeholder scan clean
- [x] Interfaces blocks consistent across phases
- [x] every phase gate is a runnable command with a stated expected result
- [x] Global Constraints values verbatim, not referenced
- [x] scope option recorded (A minimal / B thorough) — **B picked**, § Scope options
