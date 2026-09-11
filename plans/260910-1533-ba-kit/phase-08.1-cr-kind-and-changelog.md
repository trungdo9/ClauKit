# Phase 08.1 — `CR` as the 10th entity kind + the derived Change Log

**Milestone A′ — wave 1.5 (D-13).** **Depends on:** 02 (the spine is shipped code), 06 (`compose` + the demo tree), 08 (the demo tree is complete and `gap` is clean). **Blocks:** 08.2 (`acceptance`'s variance section reads CR status), and wave-2 `qc cr`.
**The spine's first additive change after shipping.** Phases 01–08 are committed or in flight; this phase edits four shipped files and must leave every existing entity tree valid and every existing gate result unchanged. That constraint, not the CR kind, is what makes the phase non-trivial — Gate 5 is the whole point.

**Interfaces**
- Consumes: `.claude/scripts/ba/lib/spine-parse.cjs` (`DOC_ID` · `ITEM_ID` · `KIND_ORDER` · `DOC_KINDS` · `PARENT_KINDS` at lines 16–31, `REQUIRED_KEYS` at 37) · `lib/spine-index.cjs` (`buildIndex` · `findGaps` · `validate`) · `traceability.cjs` (the 4-action CLI) · `tests/ba-spine.test.js` (the temp-workspace `synth` fixture at :53) · `skills/ba/traceability/references/id-scheme.md` · `.claude/commands/ba/spec.md` + `skills/ba/spec/SKILL.md` (06).
- Produces:
  - EDITED `.claude/scripts/ba/lib/spine-parse.cjs` — `ITEM_ID` gains `CR`; `KIND_ORDER` **appends** `'CR'`; `PARENT_KINDS.CR`; `CR_STATUS` · `STATUS_KINDS` · `IMPACT_KINDS` · `RELEASE_KINDS`; six new `check` slugs; three new `Node` fields. Exports gain `CR_STATUS`.
  - EDITED `.claude/scripts/ba/lib/spine-index.cjs` — `changelog(index) => CRRow[]`, exported.
  - EDITED `.claude/scripts/ba/traceability.cjs` — 5th subcommand `changelog <project-dir> [--json]`.
  - EDITED `.claude/commands/ba/spec.md` — 8th action `cr`; `argument-hint` gains it.
  - NEW `skills/ba/spec/references/cr-body.md` — the Change Request **form** (§ 10i item 12's first half).
  - EDITED `skills/ba/spec/SKILL.md` — one bullet: a CR derives from an existing entity and never creates one.
  - EDITED `skills/ba/traceability/references/id-scheme.md` — 10 kinds, 13 frontmatter keys.
  - EDITED `tests/ba-spine.test.js` — 4 new tests (9 → 13).
  - EDITED **the repo's root `.gitignore`** — one allowlist line, `!plans/**/entities/*.md` (task 8.1.9). Same file phase 02 task 2.9 already edits; **`bin/lib/gitignore-wire.js`'s `PLAN_RULES` is NOT touched** (task 8.1.9 states why).
  - Runtime: `plans/ba/demo/entities/CR-001.md` (`approved`), `CR-002.md` (`rejected`) — **hand-authored**, per ruling R8 (task 8.1.6).
- Type delta — **additive, every new field nullable**, so a CR-free tree keeps its node set and its node order:
  ```
  Node  = { …the ten fields phase 02 declares…,
            status: 'proposed'|'approved'|'rejected'|'done'|null,
            impact: string|null,
            release: string|null }
  CRRow = { id: string, title: string, status: string, impact: string,
            parents: string[], file: string }
  ```
  `traceability.derived.json` gains three keys per node. It is git-ignored (D-9), so the shape change costs no diff anywhere — which is the reason an additive spine change is cheap here and would not have been after wave 3 (risk R4).

---

## Task 8.1.1 — EDIT `spine-parse.cjs` — the 10th kind

```js
const ITEM_ID = /^(EPIC|FR|NFR|UC|US|TC|CR)-\d{3}$|^AC-\d{3}\.\d{1,2}$/;
const KIND_ORDER = ['PRD', 'SRS', 'EPIC', 'FR', 'NFR', 'UC', 'US', 'AC', 'TC', 'CR'];
```

- **`'CR'` is APPENDED, never inserted.** `KIND_ORDER.indexOf(kind)` is the primary node sort key in `buildIndex` (`spine-index.cjs:52`). Inserting `CR` anywhere but last shifts the index of every kind below it and silently reorders `nodes` in every existing index and every downstream view. Appending keeps a CR-free tree byte-identical. State the reason in a comment beside the array — it is the kind of line a later reader "tidies" alphabetically.
- `PARENT_KINDS.CR = ['EPIC', 'FR', 'NFR', 'UC', 'US']` — the entities the change touches. **No `AC`, no `TC`**, deliberately: an AC changes because its US changed and a TC because its AC did, so a CR pointed at one of those is a CR pointed at the wrong node, and `parent-kind-not-allowed` should say so.
- `parents: []` on a CR needs no new rule — the existing `unparented` orphan class already rejects it (`kind !== 'PRD'`), and a CR that touches nothing is not a change request.
- Three kind sets plus one value set, beside `OUT_OF_SCOPE_KINDS`/`TOUCHES_KINDS`:
  ```js
  const CR_STATUS    = new Set(['proposed', 'approved', 'rejected', 'done']);
  const STATUS_KINDS = new Set(['CR']);
  const IMPACT_KINDS = new Set(['CR']);
  const RELEASE_KINDS = new Set(['FR', 'US']);
  ```
- Six checks, each in the exact shape `doc-on-document-kind` (`:114`) and `out-of-scope-on-wrong-kind` (`:118`) already use — required on the owning kind, **rejected on every other kind**:

  | `check` slug | fires when |
  |---|---|
  | `missing-status` | `kind: CR` and `status` blank |
  | `bad-status` | `status` present and ∉ `CR_STATUS` |
  | `status-on-wrong-kind` | `status` present and `kind` ∉ `STATUS_KINDS` |
  | `missing-impact` | `kind: CR` and `impact` blank |
  | `impact-on-wrong-kind` | `impact` present and `kind` ∉ `IMPACT_KINDS` |
  | `bad-release` | `release` present and `kind` ∉ `RELEASE_KINDS` |

- **Do NOT add `status` or `impact` to `REQUIRED_KEYS` (`:37`).** That array is the always-required list, checked by plain presence on every entity of every kind; adding a CR-only key there fails all 13 demo entities and every fixture. Kind-conditional keys are enforced by their own check, which is why `out_of_scope` is not in that array either.
- `node` gains `status`, `impact`, `release` — `blank(v) ? null : v`, same idiom as `out_of_scope`/`touches`.
- Header comment: *"the contract is 9 scalar keys plus one inline array"* → **12 scalar keys** plus one inline array (`id kind project title doc source confidence out_of_scope touches status impact release`). The sentence is the justification for not taking a YAML dependency; a stale count weakens the argument it exists to make.
- Exports gain **`CR_STATUS` only** — 08.2's variance filter reads it, and exporting the three kind sets would publish internals nothing consumes.

## Task 8.1.2 — `source:` on a CR, and why `findGaps` is NOT touched

Rule 1 (`business-analysis-rules.md` § 1) applies to `CR` unchanged. A CR's `source:` names the change-request artifact: `doc:CR-2026-014-email.pdf p.1`, a ticket path, or a meeting-minutes file.

**A CR carrying `[UNVERIFIED]` therefore lands in `index.unsourced`, and `gap` exits 1.** That is correct behaviour and must not be exempted: an unsourced change request is a corridor conversation, and phase 08's handover gate (`gap` exit 0 before hand-over) should refuse to sign off on one. Record the decision here so a later reader does not read the exit code as a bug and add a CR branch to `findGaps`. **`findGaps` gets no edit in this phase.**

`doc:` guidance — **documented, not validated**: `SRS-001` normally; `PRD-001` when every parent is an `EPIC`. It stays unenforced because a CR may legally touch `EPIC-003` and `FR-011` in one request, and then no single answer exists. Enforcing it would make the tool dictate how a client is allowed to write a change request, which is the wrong side of the seam.

## Task 8.1.3 — `changelog(index)` in `spine-index.cjs`

```js
/**
 * `changelog(index) => CRRow[]` — CR nodes in id order. The Change Log IS this
 * view: there is no register file to keep in step with the entities, which is
 * the failure mode a hand-written log has and a derived one cannot.
 */
```

- Filter `kind === 'CR'`; sort by `[numericPart(id), id]` **independently of the index sort**, so the view does not silently depend on `KIND_ORDER` staying append-only.
- Map to `{ id, title, status, impact, parents, file }`.
- **No new lib file.** The view is ~8 lines over data `buildIndex` already produced; a `lib/spine-changelog.cjs` would be one file per verb.
- Add `changelog` to the module exports, and to `traceability.cjs`'s `module.exports = { main, ...spine }` spread by inheritance — no second edit needed there.

## Task 8.1.4 — the `changelog` subcommand

```
node .claude/scripts/ba/traceability.cjs changelog <project-dir> [--json]
```

- Add `'changelog'` to the action whitelist (`:37`) **and** to the `USAGE` string (`:35`) — both, or the error message lies about what the tool accepts.
- Human output: a header line, then one row per CR — `CR-001  approved  FR-011  <impact>` — columns padded so the status column is scannable. Empty set prints `✓ no change requests`.
- **Exit 0 always**, like `index`: a change log is a report, not a verdict. `gap` and `validate` are the two verdicts and adding a third would make "the exit code is the gate" ambiguous.
- `--json` → the `CRRow[]` array and nothing else, the machine surface wave-2 `qc cr` consumes.
- Wave-2 note, recorded here because this phase creates the possibility: `qc cr <CR-id>` is **reverse-reachability** — from a CR, every entity reachable through `parents` — and it is buildable from `index.edges` with no further spine change.

**While in `traceability.cjs` (verify-plan R-VP3):** `compose` gains the same ≤ 3-line stderr warning 08.2 task 8.2.9 gives `deliver` — after resolving each deliverable path, `git check-ignore -q <out>`; exit 0 ⇒ `⚠ <out> is git-ignored in this project — add \`!plans/**/deliverables/*.md\` to .gitignore or the signed document will not be committed (D-11)`. Exit code unchanged. Placed here because this phase already edits the file; `PLAN_RULES` is NOT touched (one-directional sync test; consumers' `plans/` is not ignored by default).

## Task 8.1.5 — `/ba:spec cr` — the Change Request form

- `.claude/commands/ba/spec.md`: `argument-hint: fr|nfr|uc|us|ac|tc|cr|compose [<project-slug>]`, and a `cr` bullet in § Actions.
- `cr` writes one `CR-###.md` with `parents` naming the entities the change touches and **`status: proposed`**. **A command never writes `approved`.** Approval is a human decision recorded by editing the entity, and the reason is mechanical: `status: approved` is exactly what 08.2's `acceptance` bills against, so a generator that can set it can generate a billing line.
- NEW `skills/ba/spec/references/cr-body.md`, ≤ 14 lines, VI prose + EN keywords (D-4): `**Người yêu cầu:**` · `**Ngày:**` · `**Lý do:**` · `**Thay đổi đề xuất:**` · `**Ảnh hưởng (impact):**` (one line, mirroring the frontmatter `impact:` so the two cannot disagree) · `**Quyết định:**`.
- `skills/ba/spec/SKILL.md` gains one bullet in the derivation chain: **a CR derives from an existing entity and never creates one.** A change with no entity to point at is not a change request, it is a new requirement — run `fr`. This is the anti-pattern that turns a change log into a shadow backlog.
- Link forms, counted from **installed** positions: command at `.claude/commands/ba/` → `../../skills/ba/spec/references/cr-body.md`; skill at `.claude/skills/ba/spec/` → `references/cr-body.md`. Display text stays the canonical `.claude/…` path.

## Task 8.1.6 — the demo fixture: two CRs

| file | `status` | `parents` | note |
|---|---|---|---|
| `plans/ba/demo/entities/CR-001.md` | `approved` | `[FR-011]` | the one 08.2's variance section must list |
| `plans/ba/demo/entities/CR-002.md` | `rejected` | `[FR-012]` | the negative control — it must appear in `changelog` and **not** in the variance section |

Both carry `doc: SRS-001`, a real `source:` (task 8.1.2), `confidence`, and a one-line `impact:`. `FR-012` is named rather than a second reference to `FR-011` so that "the variance section lists exactly the approved CRs" cannot pass by accident on a single-FR tree.

> **`FR-011`/`FR-012` are the ids the demo tree held when this phase was written, and phase 06 is still filling that tree — substitute whatever two distinct `FR-*` ids `ls plans/ba/demo/entities/FR-*.md` reports, and carry the substitution into Gate 1's expected `parents=` string.** The binding requirement is **two distinct FRs that exist**, not these two numbers: one CR `approved` against the first, one `rejected` against the second. A gate whose expected value names an absent id fails for the wrong reason, and a fixture pointed at an absent id is a planted `dangling` orphan that would break Gate 2.

**Both files are HAND-AUTHORED by the implementer, exactly per `/ba:spec cr`'s Workflow section — do not try to invoke `/ba:spec cr`.** Ruling R8 (verify-plan 2026-09-11): a subagent cannot invoke a slash command, which is why phases 05 and 07 hand-authored `plans/ba/demo` the same way. The command file is the specification the fixture must satisfy; writing the fixture by hand from it is also the cheapest test that the Workflow section is complete enough to follow.

**The fixture must change no phase-06 and no phase-08 gate result.** That is Gate 5, and it is measured rather than assumed.

## Task 8.1.7 — `id-scheme.md`: 10 kinds, 13 keys

- Heading `## ID scheme — 9 kinds` → `— 10 kinds`; `**Item kinds (7)**` → `(8)`; add the row
  `| `CR` | `CR-001` | `EPIC`, `FR`, `NFR`, `UC`, `US` | `SRS-001` (`PRD-001` khi chỉ đụng `EPIC`) |`
- `## Ten frontmatter keys — eight required, two conditional` → `## Thirteen frontmatter keys — eight required, five conditional`, with three rows added:
  | key | rule |
  |---|---|
  | `status` | **required on `CR`** — exactly `proposed`, `approved`, `rejected` or `done`. Absent on every other kind. |
  | `impact` | **required on `CR`** — one line naming what the change affects. Absent on every other kind. |
  | `release` | **optional on `FR`/`US`** — the release this ships in; absent by default and never required. Absent on every other kind. |
- Update the `js` fence's `ITEM_ID` and `KIND_ORDER` to match `spine-parse.cjs` exactly. The regexes stay **owned by `spine-parse.cjs`** (its own header says so at `:8-10`); this file restates them for a human and must not diverge.
- § *Dropped, with the reason*: the `BR` clause gains one sentence — **`CR` is the tenth kind and `BR` is still not.** Open Q1's trigger was *"a real project needs to query changes independently of the FRs that carry them"*; D-13 met that trigger **for changes** and left it unmet for rules. Naming the distinction is what stops the next kind arriving on precedent instead of on evidence.

## Task 8.1.8 — tests: four, in the existing spine file

Add to `tests/ba-spine.test.js`. **Do not create a second spine test file** — the temp-workspace `synth` fixture and the two grep guards live here, and splitting them would give the CR checks a different fixture from the checks they must not disturb. Extend `synth(dir, { clean, crs })` with an opt-in `crs` flag; every existing call site keeps its current behaviour by omitting it.

1. **`'a CR indexes, and changelog orders by id'`** — `synth(d, { crs: true })`; `changelog(index).map(r => r.id)` deep-equals `['CR-001', 'CR-002']`; statuses `['approved', 'rejected']`; every `impact` non-empty.
2. **`'a CR whose parents exist is not a gap'`** — `findGaps` on the `{ clean: true, crs: true }` fixture: `orphans` deep-equals `[]` and `unsourced` deep-equals `[]`. Both properties matter — the second is the one task 8.1.2 depends on, and it only holds because the fixture CRs are sourced.
3. **`'status and impact are required on CR and rejected everywhere else'`** — five assertions in one test, because they are one contract: a CR without `status` → `missing-status`; a CR without `impact` → `missing-impact`; `status: approved` written onto `FR-001` → `status-on-wrong-kind`; `release: v1.2` on `EPIC-001` → `bad-release`; **`release: v1.2` on `FR-001` → no violation.** The last one is the negative control that stops the whole group being satisfied by a checker that rejects every unknown key.
4. **`'CR is appended to KIND_ORDER, so a CR-free tree keeps its node order'`** — `KIND_ORDER.indexOf('CR') === KIND_ORDER.length - 1`; on the CR-free 13-entity fixture, `nodes.map(n => n.id)` equals the literal expected order written out in the test; and every node's `status`, `impact` and `release` are `null`. This is task 8.1.1's append rule, tested rather than commented.

## Task 8.1.9 — The demo fixture's entity files become **tracked** (coordinator ruling, 2026-09-11)

This phase is the first to ship new entity files into `plans/ba/demo`, so the ignore asymmetry lands here.

**The state, read off the working tree.** The phase-06 implementer added `!plans/**/deliverables/*.md` at `.gitignore:70-72` with D-11's rationale, but `plans/**/*` at `:59` still ignores `plans/ba/demo/entities/*.md`. **In-repo, a demo deliverable is therefore tracked while the entity files it was composed from are not** — the source of truth ignored, the artifact committed, which is D-6 inverted.

**Edit — one allowlist line plus its comment, beside the deliverables line (after `:72`):**

```gitignore
# …and their source of truth: an entity file is the spine (D-6), so a committed
# deliverable must not be composed from ignored inputs. Fixture trees become
# reproducible; the derived index stays ignored by the rule above.
!plans/**/entities/*.md
```

- **Last matching pattern wins, and the placement keeps the index ignored:** `traceability.derived.json` matches `plans/**/*.derived.json` (`:69`) and does **not** match `!plans/**/entities/*.md`, so D-9 is intact. Gate 8 asserts both halves rather than one.
- **`bin/lib/gitignore-wire.js`'s `PLAN_RULES` is NOT touched, and this is the asymmetry phase 02 task 2.9 forbids widening — read the difference.** `PLAN_RULES` is the **narrow** list the installer writes into a *consumer's* `.gitignore`, and *"the plan-artifact rules stay in sync with ClauKit's own root .gitignore"* asserts every `PLAN_RULES` **entry** exists in both files — it does not assert the converse, so a repo-local allowlist line is legal and a `PLAN_RULES` addition would not be. **Consumers are unaffected by this edit**: they never receive this file, and a consumer's own `plans/` is not ignored to begin with, so they need no allowlist. Gate 8 re-asserts the sync check.
- Consequence to state in the phase report: `plans/ba/demo/**` becomes a **committed fixture**. Phase 05's ledger note *"fixture `plans/ba-context.md` + `plans/ba/demo/**` confirmed IGNORED"* is superseded for the entity tree — recorded as an appended `plan:` line in `STATE.md`, not by rewriting that note. Nothing in any gate depends on in-repo ignore status: 08.2 Gate 4's ignore check runs in a **scratch install**, which is the only place the consumer-facing rule can be measured.

---

## Exit gate

**Exit gate:** `node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo --json` → a 2-element array, `CR-001` then `CR-002`, statuses `approved` then `rejected`, exit `0`; then `node .claude/scripts/ba/traceability.cjs gap plans/ba/demo; echo $?` → `✓ no gaps …` and `0`. Detail in Gate 1–7 below.

### Gate 1 — `changelog` is a report: two rows, ordered, status present, exit 0

```bash
node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo; echo "exit=$?"
node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo --json \
 | node -e 'const r=JSON.parse(require("fs").readFileSync(0));
   console.log("rows="+r.length, "ids="+r.map(x=>x.id).join(","), "status="+r.map(x=>x.status).join(","),
               "no-impact="+r.filter(x=>!x.impact).length, "parents="+r.map(x=>x.parents.join("+")).join(","));'
```
→ `exit=0` (a log is a report, not a verdict) · `rows=2` · `ids=CR-001,CR-002` **in that order** · `status=approved,rejected` · `no-impact=0` · `parents=FR-011,FR-012` — **substitute the two `FR-*` ids the demo tree actually holds** (task 8.1.6's note; phase 06 was still filling that tree when this gate was written, and `FR-011`/`FR-012` were its ids at the time). The assertion is that each CR's `parents` echoes back exactly the FR it was written against, not that these two numbers appear.

### Gate 2 — `gap` does not flag a CR whose parents exist

```bash
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo; echo "gap=$?"
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo --json \
 | node -e 'const g=JSON.parse(require("fs").readFileSync(0));
   console.log("orphans="+g.orphans.length, "unsourced="+g.unsourced.length,
               "cr-flagged="+[...g.orphans.map(o=>o.id),...g.unsourced].filter(i=>i.startsWith("CR-")).length);'
```
→ `gap=0` · `orphans=0` · `unsourced=0` · `cr-flagged=0`. Phase 08's handover gate is unchanged by the presence of change requests.

### Gate 3 — `validate` rejects a CR without `status`, and `status` on an FR

```bash
D=$(mktemp -d) && cp -r plans/ba/demo "$D/demo"
sed -i '/^status:/d' "$D/demo/entities/CR-001.md"
node .claude/scripts/ba/traceability.cjs validate "$D/demo" | grep -c 'missing-status'; echo "exit=$?"
node .claude/scripts/ba/traceability.cjs validate "$D/demo" >/dev/null; echo "no-status-exit=$?"
cp -r plans/ba/demo "$D/demo2"
sed -i '/^confidence:/a status: approved' "$D/demo2/entities/FR-011.md"
node .claude/scripts/ba/traceability.cjs validate "$D/demo2" | grep -c 'status-on-wrong-kind'
node .claude/scripts/ba/traceability.cjs validate "$D/demo2" >/dev/null; echo "wrong-kind-exit=$?"
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "clean-exit=$?"
```
→ `missing-status` reported **1** time and `no-status-exit=1` · `status-on-wrong-kind` reported **1** time and `wrong-kind-exit=1` · `clean-exit=0` on the untouched tree. A validator that fires on neither placement is not a validator; one that fires on the clean tree is worse.

### Gate 4 — a CR pointed at the wrong kind is refused

```bash
D=$(mktemp -d) && cp -r plans/ba/demo "$D/demo"
sed -i 's/^parents: .*/parents: [AC-007.1]/' "$D/demo/entities/CR-001.md"
node .claude/scripts/ba/traceability.cjs validate "$D/demo" | grep -c 'parent-kind-not-allowed'
```
→ **1**. `PARENT_KINDS.CR` omits `AC`/`TC` on purpose (task 8.1.1), and this is the check that makes the omission real rather than documentary. *(Substitute any `AC-*` id the demo tree actually holds.)*

### Gate 5 — **the additive claim, measured**: the deliverables do not move

```bash
cp plans/ba/demo/deliverables/SRS-001.md /tmp/srs-before.md
cp plans/ba/demo/deliverables/PRD-001.md /tmp/prd-before.md
node .claude/scripts/ba/traceability.cjs compose plans/ba/demo
diff /tmp/srs-before.md plans/ba/demo/deliverables/SRS-001.md \
  && diff /tmp/prd-before.md plans/ba/demo/deliverables/PRD-001.md && echo COMPOSE-UNCHANGED
F=plans/ba/demo/deliverables/SRS-001.md
grep -c '^## CR-' "$F"; grep -c '^## FR-' "$F"
for L in '^\*\*Actor:\*\*' '^\*\*Out of scope:\*\*' '^\*\*Constraints:\*\*' '^\*\*Touches:\*\*'; do
  printf '%-28s %s\n' "$L" "$(grep -c "$L" "$F")"; done
```
→ `COMPOSE-UNCHANGED` with **no diff on either file** · `0` `## CR-` blocks (`composeSRS` renders an explicit kind list at `spine-compose.cjs:143-147`, so a CR cannot leak into a signed document) · the FR count and all four Stage-0 label counts **identical to phase 06 Gate 4's recorded values**. This gate is the reason the phase is described as additive; without it "additive" is a claim.

### Gate 6 — the suite, and the file-size rule

```bash
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
node --test tests/ba-spine.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)'
wc -l .claude/scripts/ba/traceability.cjs .claude/scripts/ba/lib/*.cjs tests/ba-spine.test.js
```
→ `ℹ tests 362` · `ℹ pass 360` · `ℹ fail 1` · `ℹ skipped 1` — the `fail 1` is the pre-existing `tests/protected-branch-guard.test.js:196`; **a second failure fails this gate.** The spine file reports `ℹ tests 13 · pass 13 · fail 0` (9 + 4). Every `.cjs` **< 200** lines; `tests/ba-spine.test.js` is reported so the 216-line concern phase 02 parked for Review is re-measured here rather than quietly doubled.

### Gate 7 — the shipped docs still install clean

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
```
→ `0` broken relative links · `0` missing backticked `.claude/` paths · `activate-hits=1` (grep found nothing). Run against a **real install**, not the repo: `.claude/skills` is a symlink here and a real directory there, so the repo cannot validate this form at all — and phase 09's derived kit loops, which would catch it automatically, have not run yet.

### Gate 8 — the entity tree is tracked, the index is still ignored

**`-q` for every exit-code assertion; `-v` only for display.** `git check-ignore -v` exits **`0` for a path matched by a `!` allowlist pattern** — it reports *"a pattern matched"* and prints the negating line, not *"the path is excluded"* — so an `-v` exit code cannot distinguish tracked from ignored. Reproduced in a scratch repo: on an allowlisted path `-v` → exit `0` printing `.gitignore:3:!plans/**/entities/*.md`, while `-q` → exit `1`; on a truly ignored path `-q` → exit `0`. **Phase 06 Gate 5 and phase 02 Gate 6 already use `-q`**, which is why they read correctly — this gate must match them.

```bash
cd <repo>
git check-ignore -q plans/ba/demo/entities/FR-011.md;            echo "entity-ignored=$?"
git check-ignore -q plans/ba/demo/entities/CR-001.md;            echo "cr-ignored=$?"
git check-ignore -q plans/ba/demo/traceability.derived.json;     echo "index-ignored=$?"
git check-ignore -q plans/ba/demo/deliverables/SRS-001.md;       echo "deliverable-ignored=$?"
git check-ignore -v plans/ba/demo/entities/CR-001.md             # display only: names the allowlist line
git check-ignore -v plans/ba/demo/traceability.derived.json      # display only: must name .gitignore:69
git add -n plans/ba/demo/entities/CR-001.md
git status --porcelain plans/ba/demo/entities | wc -l
grep -c '!plans/\*\*/entities/\*\.md' .gitignore
grep -c 'plans/\*\*/entities' bin/lib/gitignore-wire.js
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)'
```
→ `entity-ignored=1` and `cr-ignored=1` (**not ignored** — `-q` exits 1 when the path is not excluded) · `index-ignored=0` (**still ignored** — D-9 intact) and its `-v` line names `.gitignore:69` · `deliverable-ignored=1` (unchanged from phase 02 Gate 6) · `git add -n` prints an `add` line for the CR, the independent confirmation that the path is genuinely addable · `git status` lists the demo entity files · the allowlist line present **1** time in the root `.gitignore` and **`0`** times in `bin/lib/gitignore-wire.js` (task 8.1.9 — a repo-local allowlist, never a consumer rule) · the packaging suite reports `ℹ fail 0`, so *"the plan-artifact rules stay in sync with ClauKit's own root .gitignore"* still holds.
