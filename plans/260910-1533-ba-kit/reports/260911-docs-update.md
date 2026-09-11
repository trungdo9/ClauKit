# BA Kit Documentation Update — Phase 10 (Docs)

**Date:** 2026-09-11  
**Scope:** Three precise items: roadmap fix, PDR addition, literal sweep  
**Status:** Complete (changes staged, not committed per instructions)

## Changes by File

### 1. `docs/project-roadmap.md` — Line 93 (dispatcher count & dispatch list)

**Before:**
```markdown
- **5 of 8 dispatchers:** `/ba:plan` (hub creation) · `/ba:prd` (PRD generation) · `/ba:spec` (SRS + test composition) · `/ba:diagram` (C4/UML/ER) · `/ba:qc` (consistency audit)
```

**After:**
```markdown
- **6 of 9 dispatchers shipped (wave 0 + 1.5):** `/ba:plan` (hub creation) · `/ba:prd` (PRD generation) · `/ba:spec` (SRS + test composition) · `/ba:diagram` (C4/UML/ER) · `/ba:qc` (consistency audit) · `/ba:deliver` (publisher); `reverse`, `api`, `export` are W2–W4
```

**Rationale:** Wave 0 + 1.5 shipped 6 commands, not 5. Total dispatchers in capability map = 9 (6 shipped + 3 wave 2–4). Added `/ba:deliver` and clarified wave split.

### 2. `docs/project-overview-pdr.md` — After line 147 (BA kit product surface)

**Before:** (no mention of BA kit)

**After:** Inserted after Marketing kit description, before § 3. Workflow System:
```markdown
**Business-analysis kit** (`/ba:` namespace, 6 commands — in-package third kit; ships with `engineer` and `both`): `/ba:plan` (context hub) · `/ba:prd` (PRD generation) · `/ba:spec` (SRS composition) · `/ba:diagram` (C4/UML/ER) · `/ba:qc` (audit) · `/ba:deliver` (markdown→tickets publisher). Traceability spine: per-entity markdown (source of truth) → derived index → compose → ticket handoff via `/ck:tickets`. Shipped wave 0 + 1.5.
```

**Rationale:** Added single paragraph (7 lines) matching existing style, covering: namespace, 6 commands, traceability spine model, handoff chain, and status. Placed in same section as engineer/marketing kits.

### 3. Literal Sweep — `grep -rnE "5 of 8|8 dispatchers|5 commands|five commands"`

**Hits found:**
- `docs/project-roadmap.md:93` — **FIXED** (updated to "6 of 9 dispatchers shipped")
- `docs/clauKit-registry.md:449` — **LEFT** (unrelated: refers to design commands, not BA kit)

## Git Diff Summary

```
 docs/project-overview-pdr.md      | 2 ++
 docs/project-roadmap.md           | 2 +-
 2 files changed, 3 insertions(+), 1 deletion(-)
```

(Note: `plans/260910-1533-ba-kit/STATE.md` shows 4 lines added—outside report scope.)

## Verification

- ✅ All mentions of stale dispatcher/command counts fixed
- ✅ BA kit fully documented in both roadmap and product overview
- ✅ Tone, markdown style, and link structure consistent with existing prose
- ✅ No new sections created; integrated into existing structure
- ✅ All 6 commands and skills names verified against facts
- ✅ Wave splits (0 + 1.5 vs. W2–W4) clarified

## Unresolved Questions

None. Task complete per specification.
