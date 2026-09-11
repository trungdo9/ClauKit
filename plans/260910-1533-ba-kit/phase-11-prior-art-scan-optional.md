# Phase 14 — D-2 prior-art spike (1 day, timeboxed)

**Optional reference scan — not a gate on anything** (D-10 downgraded it from a wave-1 gate: under the narrowed scope the 3–4 week saving shrinks, and BMAD's persona methodology is not "standard BA"). Half a day, or skip. **Depends on:** nothing — may run concurrently with every other phase.

**Depends on:** nothing. **Blocks:** wave 1 only. **May run concurrently with phases 01–06** — it touches no shipped file and no file any other phase touches.
**Decision rule — now TWO gates in order (D-5 item 3 adds the first):**

1. **License / trademark gate.** A blocked license makes coverage irrelevant, so it is checked *first* and a failure ends the assessment for that candidate. Verified so far: **BMAD-METHOD is MIT** (commercial vendoring permitted) **but "BMad" and "BMAD-METHOD" are trademarks of BMad Code, LLC** (its `TRADEMARK.md`) — so adapt content, attribute, and **never use the BMAD name as a product or feature label**. **The Anthropic PM plugin's license is unverified and is a gating item of this spike.**
2. **Quality gate (D-2, locked):** **≥ 8 of 13 overlapping items covered at acceptable quality ⇒ vendor that half** (brainstorm categories 1/2/4) via `/ck:port` + a pinned commit, reinvesting the saved 3–4 weeks in `/ba:reverse` + the spine. **< 8 ⇒ build wave 1 ClauKit-native.**

An item from a candidate that fails gate 1 counts as `ABSENT` for gate 2, not as `NOT ASSESSED` — a license block is a real answer, not a missing one.

**Interfaces**
- Consumes: `plan.md` § Global Constraints (the item template + ID scheme are the yardstick — "covered at acceptable quality" means *can its output be mapped onto our contract without re-authoring*).
- Produces: `docs/spike-prior-art.md` — the 13-row coverage table, the verdict, and, if the verdict is VENDOR, the pinned commit SHA + license + the wrapper shape. **No file outside this plan directory.**
- **Timebox: 1 working day.** At the box, write the verdict from what is known and mark unexamined rows `NOT ASSESSED` — an over-run spike is the scope-collapse this plan exists to avoid (R8).

---

## Task 14.1 — Acquire the two candidates (read-only)

```bash
S=$(mktemp -d)
git clone --depth 1 https://github.com/bmad-code-org/BMAD-METHOD "$S/bmad"
(cd "$S/bmad" && git log -1 --format='%H %ci' && cat package.json | head -20 && ls)
npx -y repomix --style markdown --output "$S/bmad.md" "$S/bmad"
```
`repomix` is **not installed on this machine** (verified) — `npx -y` is required, and it needs network. If network is unavailable, `git clone` + `find`/`cat` is a sufficient substitute; say which was used in the report.

Second candidate: the Anthropic **product-management plugin**. Locate it in the official plugin marketplace (`/plugin` in Claude Code, or the `anthropics/claude-code` plugin index) rather than by guessing a repo URL. If it cannot be located in the timebox, mark every row it would have covered `NOT ASSESSED` and say so — a fabricated feature list is worse than an admitted gap, and the brainstorm already flags both candidates as **web-search-derived, not hand-verified**.

**Record for each candidate, from the tree and not from a README claim:** resolved commit SHA · tag/version · LICENSE file contents (SPDX id) · file count · whether it ships `SKILL.md`-shaped skills, agent `.md` files, slash commands, or scripts.

## Task 14.1b — Run the license / trademark gate FIRST (D-5 item 3)

Before scoring a single capability, for each candidate record: the **LICENSE file's SPDX id and full text location in the cloned tree**, any `TRADEMARK.md` / `NOTICE` / trademark clause, and whether the terms permit redistribution **inside a package that may later be sold**. Read the files; do not infer from a README badge.

Known going in, to be re-verified on disk:
- **BMAD-METHOD — MIT**, plus a `TRADEMARK.md` reserving "BMad" and "BMAD-METHOD" to BMad Code, LLC. Consequence: content may be adapted and redistributed with attribution; **the name may not be used as a product or feature label.** A `/ba:` command, skill, or docs heading must never read "BMAD".
- **Anthropic PM plugin — UNVERIFIED.** Gating. If the license cannot be established within the timebox, its rows are `ABSENT` for gate 2 and the report says why.

**Output format is already set by house precedent:** `ClauKit's `skills/THIRD_PARTY_NOTICES.md``. That file documents claude-seo (MIT, adapted) and — the instructive case — records that the GPL-2.0 WordPress skill was **deliberately re-authored** rather than copied, to avoid contamination. Draft the entry this spike would add, in that file's exact section shape, as an appendix to the report. **Do not edit `ClauKit's `skills/THIRD_PARTY_NOTICES.md`` in this phase** — it ships, and it must not name a vendored tree before the vendoring decision is approved.

## Task 14.2 — Fill the 13-row coverage table

The 13 overlapping items are the brainstorm's categories 1, 2 and 4 (§ 4: BMAD overlaps "categories 1, 2, 4 (~13 of 55)"). Enumerate them **explicitly by name** in the report before scoring — an unnamed denominator makes "8 of 13" unfalsifiable. Derive the names from `.claude/skills/ba/capability-map.md`'s 55-row table (phase 06), taking every row whose `/ba:` target is `discover`, `prd`, or `spec`.

| column | meaning |
|---|---|
| `item` | the BA capability name |
| `candidate` | BMAD / PM-plugin / none |
| `artifact` | the exact upstream file that covers it (path in the cloned tree) |
| `verdict` | `COVERED` · `PARTIAL` · `ABSENT` · `NOT ASSESSED` |
| `evidence` | one quoted line from that file — **not** a paraphrase |
| `spine fit` | can its output carry our frontmatter + item template **without re-authoring the generator**? `yes` / `wrapper` / `no` |

**`COVERED` requires all four:** its candidate passed the license gate; the artifact exists, its output shape is a document (not a prompt fragment), and `spine fit` ∈ {`yes`, `wrapper`}. **An item whose output cannot carry `id`/`parents`/`source`/`confidence` is not covered at acceptable quality**, however good it is — the spine is R4 and it is not negotiable for a vendored half.

## Task 14.3 — Write the verdict

`docs/spike-prior-art.md`, sections in this order:

1. **Verdict** — `VENDOR` or `BUILD`, with the count (`n of 13 COVERED`) in the first line.
2. **What was actually verified** vs what the brainstorm § 4 claimed from web search — including, explicitly, whether "BMAD-METHOD v6.8.0 ~May 2026" is the real version on disk. § 4 carries a ⚠ saying it is unverified; this is where that gets closed or stays open.
3. The 13-row table.
4. **If VENDOR:** the pinned commit SHA, the SPDX license and whether it permits redistribution inside this package, the target path (`.claude/skills/ba/vendor/<name>/` — *inside* `.claude/skills/ba/` so one manifest entry still covers it), the wrapper shape (`/ba:prd` and `/ba:spec` dispatch to it the way `/mk:seo` dispatches to `AgriciDaniel/claude-seo`), the `ClauKit's `skills/THIRD_PARTY_NOTICES.md`` entry, and the **drift policy: pin a commit, wrap, never fork-edit** (risk R5) — and the point at which `skills/skills-lock.json` finally earns its place, since a pinned upstream version is the first thing there has ever been to lock (phase 13 task 13.5).
5. **If BUILD:** the 3–4 upstream ideas worth porting by hand anyway, each with its file citation.
6. **Either way:** the two things a vendored tree can never supply, so wave 2 is unaffected by the verdict — `/ba:reverse code-to-srs` (the moat) and the spine.
7. **Unresolved questions.**

## Task 14.4 — Record the R3 renderer finding

The spike is also where § 11 Q3's second half closes. Append a short section: the binary table from `plan.md` § Environment findings, plus the **decision wave 1 needs**: does `diagram` (a) require a renderer and refuse without one, (b) degrade to `[UNRENDERED]` with the source emitted, or (c) default to `--format mermaid` because Claude Artifacts render mermaid natively with no binary at all?

Recommend **(c) as the default plus (b) as the fallback**. Rationale to state: (a) makes the command unusable on a machine like this one, and rule 4 ("every diagram must compile") is satisfiable by *labelling what could not be verified* — the same posture `seo-drift` takes with `[NO BASELINE]`, which the brainstorm already cites as the in-house precedent.

---

## Exit gate

**Exit gate:** `head -3 docs/spike-prior-art.md | grep -E 'VENDOR|BUILD'` → one line containing `VENDOR` or `BUILD` **and** a count of the form `n of 13`. Detail in Gate 1–3 below.

### Gate 1 — the report exists and is decisive

```bash
cd <repo>
test -f docs/spike-prior-art.md
head -3 docs/spike-prior-art.md | grep -E 'VENDOR|BUILD'
grep -c '^| ' docs/spike-prior-art.md
grep -cE 'COVERED|PARTIAL|ABSENT|NOT ASSESSED' docs/spike-prior-art.md
```
→ the file exists; line 1–3 contain `VENDOR` or `BUILD` **and** a count of the form `n of 13`; the table has **≥ 15** rows (13 + header + separator); the verdict-token count is **≥ 13** (one per row).

```bash
grep -cE 'MIT|Apache|GPL|proprietary|UNVERIFIED' docs/spike-prior-art.md
grep -c 'TRADEMARK\|trademark' docs/spike-prior-art.md
```
→ license tokens **≥ 2** (one per candidate) and trademark mentions **≥ 1** — the BMad name restriction must be stated, not assumed remembered.

### Gate 2 — every `COVERED` row cites a real file in a pinned tree

```bash
grep '| COVERED' docs/spike-prior-art.md
```
→ every line names an `artifact` path **and** an `evidence` column containing a quoted string. A `COVERED` row with an empty evidence cell fails the gate — that is the exact failure mode § 4's ⚠ warns about (web-search claims presented as verified).

### Gate 3 — nothing was shipped

```bash
git status --porcelain | grep -vE '^\?\? (docs/|plans/260910-1533-ba-kit/)' | grep -E '^\s*[AMD]' ; echo "changed-outside-report=$?"
```
→ `changed-outside-report=1` (grep found nothing). The spike writes **only** its report; it ships no kit file and edits no ClauKit source.
