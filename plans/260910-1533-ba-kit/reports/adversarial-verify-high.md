# Adversarial verify — 4 High findings (security/standards/spec)

Repo `ClauKit`. Reviews were taken at `744c271..3b0f793`. **Methodology note, load-bearing:** all
four `.claude/scripts/ba/*.cjs` files and `plans/ba/demo/deliverables/{PRD-001,SRS-001}.md` were
edited live, twice, during this verification run, then committed as `947d854` ("fix(ba): review
cycle 1 — path containment, error boundary, class markers, test hygiene") while this report was
being written. Verdicts below are against **HEAD = 947d854**, re-checked fresh after the commit
landed. Where the pre-fix behavior matters to the verdict it's stated explicitly.

All repro in `cp -r plans/ba/demo "$(mktemp -d)/…"` scratch copies. Nothing written under
`plans/ba/demo` by this run except two read-only `grep`s.

---

## H1 — path traversal (`traceability.cjs:39-41` → `mkdirSync`/`writeFileSync`)

**Verdict: REFUTED for the traced attack flow (slug → `plans/ba/<slug>`). A narrower, separate
gap remains for a directly-supplied absolute `<project-dir>` — reproduced live, see below;
judged out of the original finding's traced flow, not a re-statement of it.**

The security report traced: `<project-slug>` (command arg `$2`/`$3`) → interpolated by the model
into `plans/ba/<project-slug>` (always **relative** — no code path ever builds this, the command
markdown literally says "Run `node … deliver plans/ba/<project-slug> …`") → `traceability.cjs`
`projectDir` → `mkdirSync`/`writeFileSync`, unchecked.

Two independent fixes now cover exactly that flow (commit `947d854`):

1. **Command layer** (`.claude/commands/ba/{deliver,plan,spec,prd,qc,diagram}.md`, all six):
   `PROJECT: $2 … must match \`^[a-z0-9][a-z0-9-]*$\`; a slash, \`..\`, or whitespace ⇒ refuse and
   exit`. Prose-enforced (the model reads and obeys it, same idiom as this kit's other hard-fail
   pre-flights), not code-level — but it means a malicious slug never reaches the CLI as `..` or a
   `/` in the first place, under the documented invocation.
2. **CLI layer**, `traceability.cjs:40-52` (current):
   ```js
   if (!path.isAbsolute(projectDir)) {
     const root = process.cwd();
     const resolved = path.resolve(projectDir);
     const climbs = projectDir.split(/[\\/]+/).includes('..');
     if (climbs || (resolved !== root && !resolved.startsWith(root + path.sep))) {
       die(`project dir must be inside the current project (${root}) and contain no '..': ${projectDir}`, 2);
     }
   }
   ```
   placed before the `entities/` check and before any I/O.

Repro — the exact PoC named in the security report (`../../../../tmp/pwn`-shaped, relative):
```
$ node .claude/scripts/ba/traceability.cjs compose "plans/ba/../../../../tmp/tmp.bbsyBpBaSA/other"
✗ project dir not found: plans/ba/../../../../tmp/tmp.bbsyBpBaSA/other
exit=2
```
Refused before any `mkdirSync`/`writeFileSync`. Confirmed fixed for this flow.

**Residual gap found, outside the traced flow — reproduced live at HEAD `947d854`:** the
containment check at `traceability.cjs:45` only applies `if (!path.isAbsolute(projectDir))`. An
absolute path is explicitly trusted (`"An ABSOLUTE path is the operator's explicit choice and is
taken as-is (the commands never build one from a slug)"`).
```
$ rm -rf /tmp/tmp.bbsyBpBaSA/other/deliverables
$ node .claude/scripts/ba/traceability.cjs compose /tmp/tmp.bbsyBpBaSA/demo/../other
✓ composed PRD-001.md, SRS-001.md
exit=0
$ ls /tmp/tmp.bbsyBpBaSA/other/deliverables
PRD-001.md  SRS-001.md      # written outside the repo, outside plans/ba/, via an absolute arg
```
`$T/other` is a sibling tree with its own matching `entities/*.md` (project name adjusted so
`validate()`'s `bad-project` check doesn't refuse it first) — the same "existing entity tree"
precondition the compose/deliver path always had (see below); `index` has no such precondition.

**Precondition question, answered:** `compose`/`deliver` call `validate()` before writing, which
refuses a target whose `entities/*.md` files declare a different `project:` than the target dir's
basename — so those two can only write into a tree that already has a **matching, well-formed**
entity set, not an arbitrary empty directory. `index` has no such gate — verified directly against
the library (bypassing the CLI, the only place any containment check lives):
```
$ mkdir -p $T/libcheck/entities   # empty, no .md files, no project match needed
$ node -e "const {buildIndex,writeIndex}=require('./.claude/scripts/ba/lib/spine-index.cjs');
           writeIndex('$T/libcheck', buildIndex('$T/libcheck').index)"
wrote: /tmp/tmp.bbsyBpBaSA/libcheck/traceability.derived.json
```
So `index` can create `traceability.derived.json` in any directory with a merely-existing
(possibly empty) `entities/` folder; `compose`/`deliver` need that directory's entities to already
belong to it. Neither the CLI's containment check nor `validate()` exists in the library layer
itself — only `traceability.cjs`'s `main()` enforces containment, so any future direct caller of
`spine-index.cjs`/`spine-compose.cjs`/`spine-deliver.cjs` (e.g. a test, per the standards report's
own citation of `ba-spine.test.js:17` requiring `spine-index.cjs` directly) is unguarded.

**Severity: lower, from High to Low/informational.** The finding as raised (slug injection through
the documented `/ba:*` command surface) is fixed two ways over. The absolute-path gap is real and
demonstrated, but sits outside that traced flow, requires bypassing the documented invocation
entirely (hand-typing an absolute path to the raw script), and the security report's own "no
finding" section already frames this class of tool as "single-user local CLI over the operator's
own filesystem" (rules 04/12) — an operator who directly supplies an absolute path is the same
trust boundary as one who runs `rm -rf` themselves. Worth a follow-up line item, not a High.

---

## H2 — uncaught FS errors escape the 0/1/2 exit contract

**Verdict: REFUTED — fixed at HEAD `947d854`.**

Docstrings no longer claim "Never throws": `spine-compose.cjs:159` now reads *"Throws only on I/O
errors (ENOENT etc.); the CLI maps those to exit 2"*; `spine-deliver.cjs:45-46` matches.
`traceability.cjs:165-172` wraps `main()`:
```js
if (require.main === module) {
  try { main(); }
  catch (e) { die(e && e.message ? e.message : String(e), 2); }
}
```
Repro (cwd = scratch dir; H1's containment check requires a relative target under cwd, or an
absolute one — either way the fs error is what's under test here):
```
$ chmod 000 h2a/entities/FR-011.md
$ node traceability.cjs compose h2a
✗ permission denied, open 'h2a/entities/FR-011.md'
exit=2

$ ln -s /nonexistent-target-xyz h2b/entities/FR-999.md
$ node traceability.cjs compose h2b
✗ no such file or directory, open 'h2b/entities/FR-999.md'
exit=2
```
No stack trace on stderr in either case; exit code is 2, inside the documented 0/1/2 set. Reran
against the final committed HEAD — same result (see full transcript above; also `index`/`gap` on
the same two fixtures return the same clean exit-2 shape).

**Not covered, correctly so now:** a direct caller of `spine-index.cjs`'s `buildIndex` (bypassing
`traceability.cjs`) still gets a raw throw — the docstring no longer promises otherwise for the
library layer, only for "the CLI."

**Severity: lower** (was High — undocumented contract break with a live repro; the docstring/
behavior mismatch is closed and the exit-code contract holds for every shipped invocation path).

---

## H3 — class header missing on compose output

**Verdict: REFUTED — fixed at HEAD `947d854`, both the generator and the committed artifact.**
**Sub-claim (phase-08.2's exit gate contradicts plan.md:120): CONFIRMED, still open — the phase
doc was not corrected.**

`spine-compose.cjs:22` now prepends
`<!-- ba-deliverable: compose · class: derived · nguồn: plans/ba/<project>/entities/ -->` to
`HEADER`. The commit also regenerated the committed artifacts (`"plans/ba/demo: PRD-001/SRS-001
regenerated with the class marker"`). Read-only, real repo, at HEAD:
```
$ grep -c 'ba-deliverable:' plans/ba/demo/deliverables/PRD-001.md plans/ba/demo/deliverables/SRS-001.md
plans/ba/demo/deliverables/PRD-001.md:1
plans/ba/demo/deliverables/SRS-001.md:1
```
(At review time, and again mid-verification before the commit, this was `0` on both — the exact
evidence the finding cites; now `1`.)

**The doc-vs-doc contradiction the reviewer flagged is untouched.** plan.md's Global Constraints
table (`plan.md:119-120`) lists `{PRD-001.md, SRS-001.md}` as class `derived` in the same row that
states *"Every file declares its class in a header line…"* — unambiguous, "every file" includes
the two compose writes. `phase-08.2-ba-deliver.md:204`'s exit gate, unedited at HEAD:
```
$ grep -n "grep -c 'ba-deliverable" plans/260910-1533-ba-kit/phase-08.2-ba-deliver.md
204:**Exit gate:** … then `grep -c 'ba-deliverable:' plans/ba/demo/deliverables/*.md` → `1` on each
of the six and `0` on the two `compose` writes. …
```
still literally asserts **0** for the two compose writes — the inverse of plan.md:120, and now
also the inverse of the actual (fixed) implementation's output (`1`, verified above). The gate
text was not part of this commit's touched-file list and remains wrong on both counts.

**Severity: lower for the code/artifact defect (fixed, verified on-disk); keep the doc
contradiction as a separate, still-open Medium** — plan.md and phase-08.2 assert opposite things
about the same two files, and nothing in this commit reconciled them.

---

## H4 — `deliver --json` contract + unreported rewrite

Three sub-claims.

### 4a — `--json` never emits `skipped`
**Verdict: REFUTED — fixed at HEAD `947d854`.**
`traceability.cjs:144` (failing branch) and `:153` (success branch):
```js
console.log(JSON.stringify({ files: names(result.files), skipped: names(result.skipped), violations: result.violations || [] }));
...
console.log(JSON.stringify({ files: names(result.files), skipped: names(result.skipped) }));
```
Repro, scratch copy of demo (owned deliverables pre-existing, as shipped):
```
$ node traceability.cjs deliver demo all --json
exit=1
stdout: {"files":["SCOPE-001.md","RELEASE-NOTES-001.md"],"skipped":["UAT-001.md","ACCEPTANCE-001.md","GOLIVE-001.md","HANDOVER-001.md"],"violations":[]}

$ node traceability.cjs deliver demo all --force --json
exit=0
stdout: {"files":["SCOPE-001.md","RELEASE-NOTES-001.md","UAT-001.md","ACCEPTANCE-001.md","GOLIVE-001.md","HANDOVER-001.md"],"skipped":[]}
```
`skipped` present and correctly populated on both branches — matches phase-08.2:145's
`{ files, skipped }` contract (plus an additive `violations` key on the failing branch).

### 4b — exit-1-before-JSON (empty stdout)
**Verdict: REFUTED — fixed at HEAD `947d854`.**
Same repro as 4a: exit code is still 1 (per spec: "exit 1 if anything was skipped or violated"),
but stdout is no longer empty — the `if (json)` arm now runs before `process.exit(1)`. Previously
there was no `json` arm on the failing branch at all, so `--json` fell through to the
human-readable `console.error` lines with nothing on stdout.

### 4c — unreported rewrite of `derived` files on `deliver all` (non-JSON path)
**Verdict: CONFIRMED — still reproducible at HEAD `947d854`, not touched by the commit.**
```
$ stat -c '%Y' demo/deliverables/SCOPE-001.md            # 1789120787
$ node traceability.cjs deliver demo all                 # no --json, no --force
exit=1
stdout: (empty)
stderr:
⊘ demo/deliverables/UAT-001.md exists (class: owned) — pass --force to re-seed
⊘ demo/deliverables/ACCEPTANCE-001.md exists (class: owned) — pass --force to re-seed
⊘ demo/deliverables/GOLIVE-001.md exists (class: owned) — pass --force to re-seed
⊘ demo/deliverables/HANDOVER-001.md exists (class: owned) — pass --force to re-seed
$ stat -c '%Y' demo/deliverables/SCOPE-001.md            # 1789120789 — changed
```
`SCOPE-001.md` (`derived`) was rewritten (`spine-deliver.cjs`'s `all` loop always renders `derived`
entries regardless of skips elsewhere) but the current non-JSON failing branch
(`traceability.cjs:147-148`) only loops `result.skipped` — `result.files` (the files actually just
written) is never printed there. The identical run with `--json` reports it correctly
(`"files":["SCOPE-001.md","RELEASE-NOTES-001.md"]`) — the JSON consumer got fixed (4a/4b); the
human-readable default output, which is what `deliver.md`'s documented workflow runs, did not.

**Severity for H4 overall: lower for 4a/4b (fixed, verified); keep 4c at High** — the default
(no-flag) invocation of `/ba:deliver … all` silently rewrites a committed `derived` deliverable
every time it's run whenever any `owned` file already exists (the common case after first seed),
and gives no indication of it; only `--json` reveals the write.

---

## Summary

| # | Claim | Verdict (HEAD `947d854`) | Severity call |
|---|---|---|---|
| H1 | Path traversal via unvalidated `<project-dir>` | REFUTED for the traced slug-injection flow (command-layer regex + CLI relative-path/`..` check, both new). Separate gap found: an absolute `<project-dir>` argument is still unchecked and was demonstrated live writing outside the repo — judged out of the original finding's scope (requires bypassing the documented command surface entirely) | Lower (was High); log the absolute-path gap separately |
| H2 | Uncaught FS errors break 0/1/2 contract | REFUTED — `traceability.cjs`'s `main()` now wrapped in try/catch, maps EACCES/ENOENT to exit 2 with no stack trace; docstrings corrected | Lower (was High) |
| H3 | No `ba-deliverable:` header on PRD-001.md/SRS-001.md; gate contradicts plan.md:120 | REFUTED for the header defect — code fixed and the committed demo artifacts regenerated (verified `grep -c` = 1 on both, on disk, read-only). CONFIRMED, unresolved: phase-08.2:204's exit gate still literally asserts `0` for those two files, contradicting both plan.md:120 and the now-fixed actual output | Lower for the artifact defect; keep the gate/plan doc contradiction as a separate open Medium |
| H4 | `deliver --json` missing `skipped`; exit-1-before-JSON; unreported `derived` rewrite | 4a REFUTED, 4b REFUTED (both fixed); 4c CONFIRMED — `SCOPE-001.md` mtime advances on every non-`--json` `deliver all` re-run with no report of it | Lower for the JSON contract; keep High for the silent-rewrite (4c) |

## Unresolved questions

1. H1: is the absolute-path carve-out (`traceability.cjs:45`, "the operator's explicit choice") an
   accepted, deliberate scope boundary, or should it also require containment (e.g. under the
   repo, or under `plans/ba/` specifically) regardless of relative/absolute? The comment reads as
   a conscious decision; flagging in case that wasn't meant to survive review.
2. H3: phase-08.2-ba-deliver.md:204's exit gate (`→ 0 on the two compose writes`) is now wrong
   against both plan.md:120 and the shipped behavior (`→ 1`, verified). Someone needs to edit that
   line; the commit that fixed the code and the demo artifact did not touch it.
3. H4/4c: fix shape — should the non-JSON failing branch also print `result.files` when non-empty
   (symmetric with the JSON branch that already reports it), or does `deliver all`'s
   skip-vs-partial-write semantics need a rework so a partial success isn't routed through the
   `!ok` branch at all?
