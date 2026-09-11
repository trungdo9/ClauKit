STATUS: DONE_WITH_CONCERNS

## Files (touch list, verbatim from brief — no others touched)

- `skills/ba/diagramming/SKILL.md` (74 lines) — new
- `skills/ba/diagramming/references/mermaid-patterns.md` (62 lines) — new
- `.claude/commands/ba/diagram.md` (81 lines) — new
- `plans/ba/demo/diagrams/sequence-dat-lich-hen.md` (27 lines) — new fixture
- `plans/ba/demo/diagrams/flow-dat-lich-hen.md` (31 lines) — new fixture
- `plans/ba/demo/diagrams/state-dat-lich-hen.md` (18 lines) — new fixture
- `plans/ba/demo/diagrams/erd-dat-lich-hen.md` (38 lines) — new fixture

All four fixtures hand-authored exactly per `.claude/commands/ba/diagram.md`'s own Workflow section
(ruling R8 precedent: subagents don't invoke slash commands). Derivation: sequence ← FR-012
(Actor) + UC-004 steps + AC-007.1/AC-007.2; flow ← UC-001 steps 1-4 + UC-004 steps 1-3, joined at
HOLD; state ← FR-011/FR-012's HOLD→BOOKED/expired shape; erd ← booking-domain nouns implied by
EPIC-001/FR-011/FR-012 + `plans/ba-context.md` § 2 actors (labelled `confidence: low`/
`[UNVERIFIED]` in-file since no explicit data schema exists in the entity tree). No staging, no
commit — confirmed via `git status --short` (all four listed `??` under `plans/ba/`).

## Gates

### Exit gate — every block parses as mermaid or is labelled `[UNRENDERED]`, no third state

```
$ grep -L '```mermaid' plans/ba/demo/diagrams/*.md
(no output — 0 files lack the fence)
```

### Gate 1 — all four types generate, each carries a fenced block

```
$ ls plans/ba/demo/diagrams/ | wc -l
4
$ for T in sequence flow state erd; do
    f=$(ls plans/ba/demo/diagrams/${T}-*.md 2>/dev/null | head -1)
    test -n "$f" && grep -q '```mermaid' "$f" && echo "OK $T" || echo "MISSING $T"
  done
OK sequence
OK flow
OK state
OK erd
```

### Gate 2 — render gate honest in both directions

```
$ command -v mmdc >/dev/null && echo "renderer=present" || echo "renderer=absent"
renderer=absent
$ grep -l 'UNRENDERED' plans/ba/demo/diagrams/*.md | wc -l
4
```
Matches the required "renderer=absent ⇒ UNRENDERED count == 4".

### Gate 3 — diacritic labels do not break flow syntax

```
$ grep -hoE '^\s*[A-Za-z0-9_]+\[[^]]*\]' plans/ba/demo/diagrams/flow-*.md \
    | grep -P '[À-ỹ]' | grep -cv '\["'
0
```

## Suite

```
$ node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
ℹ tests 358
ℹ pass 356
ℹ fail 1
ℹ skipped 1
```
Unchanged from baseline (`tests/protected-branch-guard.test.js:196`, pre-existing, not touched).

## Link-target and cross-reference checks

- `grep -c '❌ BA context not found at plans/ba-context.md' .claude/commands/ba/diagram.md` → `1`;
  same string in `.claude/workflows/business-analysis-rules.md:36` — byte-identical (rule 6), used
  once.
- `grep -rn 'Activate the `' .claude/commands/ba/diagram.md skills/ba/diagramming/**` → 0 hits (exit
  1); every skill reference says "Read the `<x>` skill file", never "Activate".
- Repo-side `test -e` on links resolved from installed positions: 4/4 OK from
  `.claude/commands/ba/diagram.md` and 1/3 OK from `skills/ba/diagramming/SKILL.md` in-repo (the
  other 2 are the documented false-BROKEN caused by `.claude/skills` being a symlink here —
  precedent recorded at STATE.md:32/phase 4). **Real scratch install** (`ck init --kit ba` run with
  cwd inside a genuine non-symlinked directory, `/tmp/ck-scratch-diagram-test2`) confirmed all 6
  links OK: `../traceability/SKILL.md`, `../../../workflows/business-analysis-rules.md`,
  `../../../commands/ba/diagram.md` (from the skill file) and `../../skills/ba/diagramming/SKILL.md`,
  `../../workflows/business-analysis-rules.md`, `../../skills/ba/traceability/SKILL.md` (from the
  command file) — all present under the installed tree, `test -e` exit 0 for every one.
- Every backticked `.claude/…` path in the two new files names a file the `ba` kit ships (traced
  above); no new path introduced outside what phases 01-06 already shipped.

## Capability-map cross-check (reported, map NOT edited, per instruction)

```
$ grep -n '/ba:diagram' skills/ba/capability-map.md
5:| 1 | ... | `/ba:diagram erd` | ba | W0 |
6:| 2 | ... | `/ba:diagram erd` (notation deferred) | ba | W1 |
31:| 27 | ... | `/ba:diagram flow` | ba | W2 |
32:| 28 | ... | `/ba:diagram sequence` | ba | W2 |
33:| 29 | ... | `/ba:diagram state` | ba | W3 |
34:| 30 | ... | `/ba:diagram context` | ba | W3 |
35:| 31 | ... | `/ba:diagram dfd` | ba | W4 |
36:| 32 | ... | `/ba:diagram journey` | ba | W4 |
37:| 33 | ... | `/ba:diagram class` | ba | W4 |
```
`argument-hint: sequence|flow|state|erd <FR-###|free text> [<project-slug>]` (`.claude/commands/ba/diagram.md:3`)
ships all four actions together, now, in phase 07 — which the phase file itself (STATE.md:84)
labels "**Milestone A — wave 0 product**". Action names match exactly (`erd`/`flow`/`sequence`/
`state`, plus the deferred `context`/`dfd`/`journey`/`class` correctly left out of the
argument-hint). **Wave mismatch**: the capability map's per-row Wave column disagrees with the
phase's own wave — row 1 `erd`=W0 (agrees), but rows 27/28 `flow`/`sequence`=W2 and row 29
`state`=W3, while all four ship in this same wave-0 command today. Not editing the map per
instruction; flagging as a concern below.

## Concerns

1. **Capability-map wave mismatch** (see above) — rows 27-29 (`flow`/`sequence`/`state` = W2/W2/W3)
   disagree with the phase's actual wave (0), since `/ba:diagram` ships all four actions in one
   wave-0 command. Row 1 (`erd`=W0) and row 2 (`erd` D2/dbdiagram=W1, correctly still deferred) are
   consistent. Map not edited, per instruction — needs a planner/coordinator ruling.
2. **`ck.js` self-touches the source repo regardless of invocation cwd/target** — twice during this
   phase's verification, `node bin/ck.js init --kit <x>` mutated this repo's own
   `.claude/metadata.json` and one line of `.claude/workflows/development-rules.md`, even when (a)
   passed an (unsupported) `--dir` flag and it fell back silently to cwd=repo, and (b) `cd`'d into a
   genuine scratch directory in a subshell and invoked `ck.js` by absolute path — the *scratch* dir
   install succeeded correctly and independently (15 paths copied, all `ba` links OK), but the
   *source repo's* `.claude/metadata.json`/`development-rules.md` were touched a second time
   anyway (this time recording `engineer 1.4.0`, unrelated to the `--kit ba` invocation). Both
   incidents self-caught and reverted with `git checkout --` before doing anything else; confirmed
   clean via `git status --short` both times. This reproduces the same defect class recorded at
   STATE.md:37 (phase 5's incident) and is very likely one of the "4 unfixed ClauKit defects" named
   in the BA-kit brainstorm memory — not in this phase's scope to fix, flagging so a future phase
   doesn't get surprised by it.

## Unresolved questions

None.
