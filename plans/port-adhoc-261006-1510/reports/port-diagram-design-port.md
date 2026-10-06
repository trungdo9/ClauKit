# Port report — diagram-design → ClauKit

Source `cathrynlavery/diagram-design` v2.6.59 (local checkout, no git SHA → provenance pinned to `@v2.6.59`). License MIT © 2025 Cathryn Lavery — compatible.

## User decisions
- Assets: trim variants (light example per type + templates + icons + gallery)
- Engineer entry: new `/ck:diagram` dispatcher (draw · import · export · profile)
- BA: `/ba:diagram --html` + 6 HTML-only types; ships via `requires.shared`

## Added
- `skills/software/diagram-design/` — SKILL.md, 61 references, 78 html assets (5 templates, icons, gallery, 71 examples), 6 scripts. 2.5 MB (upstream skill 5.4 MB)
- `scripts/verify_geometry.py` ← upstream repo `scripts/verify-geometry.py`, `ASSET_DIR` repointed to sibling `assets/`
- `.claude/commands/ck/diagram.md` — merges upstream import-{drawio,mermaid,excalidraw}, export-diagram, profile
- test: `engineer and ba both install diagram-design with its gate scripts`

## Modified
- `.claude/kits/ba.json` requires.shared += `.claude/skills/software/diagram-design/`
- `.claude/commands/ba/diagram.md` — `--html`, types `context dfd journey class swimlane story-map` (HTML-only), HTML render-gate branch
- `skills/ba/diagramming/SKILL.md` (presentation-layer section + cross-ref) · `skills/ba/capability-map.md` rows 30–33 → W0 via `--html` · `skills/ba/README.md` · `business-analysis-rules.md` rule 10
- `docs/clauKit-registry.md` (rows, counts 117/28/64 = 209) · `codebase-summary.md` · `system-architecture.md` · `README.md` counts · `guide/SKILLS.md` · `skills/THIRD_PARTY_NOTICES.md`

## Refactors applied
- Frontmatter: ClauKit description (routes spec mermaid → ba-diagramming), `metadata.upstream`
- `wiretext` route → inline ASCII / ba-diagramming
- `<repo-root>/scripts/verify-geometry.py` → `<skill-dir>/scripts/verify_geometry.py`; repo-only verifier mentions governed by new SKILL.md §13 (manual, never reported as run)
- `/diagram-design:*` commands → `/ck:diagram …`; `<skill-dir>` = `.claude/skills/software/diagram-design/`
- Variant bullets/table rows naming dropped files removed (119 lines); §10 explains dark/full = template + light example
- `references/doctor.md` dropped (→ `/ck:health`)
- Provenance header on every ported md/py/html **except templates** (they are copied into user output; attribution via THIRD_PARTY_NOTICES)

## Deps
None. Python 3 stdlib only. PNG export needs Playwright (optional, never auto-installed — upstream rule kept).

## Env vars / secrets
None.

## Verification
- `verify_geometry.py --all` 78 files, 0 findings · `self_check.py` OK on all 71 examples
- extractors OK on upstream fixtures incl. adversarial mmd/excalidraw · `export_svg.py` OK
- `npm test` 461 pass / 0 fail / 1 skip (baseline 457/0/1; delta = new test + parallel session's tests)
- packaging guard caught a BA-install dangling path (`export.md` → `.claude/commands/ck/diagram.md`) — fixed

## Remaining TODOs
- `package.json` description still says 124 skills / 63 commands (stale before this port)
- Upstream style-guide working copy is edited in place inside the install; `ck init` never rewrites existing files so customisation survives, but `--force` would reset it → profiles (`~/.diagram-design/`) are the durable path

## Unresolved questions
- Parallel session 67957649 live in same tree (installer work) — commit split is the user's call

## Phase 4 — code-reviewer (0 critical / 0 high / 7 medium) — all medium fixed
- `/ba:diagram` args: parse non-flag tokens of `$ARGUMENTS` (was `$1..$3` → `--html` landed in PROJECT)
- ba-only install has no `/ck:diagram` → point at `references/profiles.md`/`export.md`; SKILL.md §13 says so
- `verify_geometry.py` matched only `x y width height` order → order-independent parser; probe both orders now exit 1; assets still 0 findings
- HTML `[UNRENDERED]` comment (invisible to stakeholders) → no python3 ⇒ no HTML, reported `HTML skipped`
- one gate outcome per file (.md + .html)
- `primitives-core.md` repo-root verifier paths → shipped `verify_geometry.py`
- icon licences (Tabler, Simple Icons, log-z/logos, Devicon, SAS/Stata + trademark note) added to THIRD_PARTY_NOTICES
- lows fixed: ba-diagramming intro/description, /ck:diagram hint + per-action output, onboarding grouped-skill path + `/regenerate-examples`, repo-only "Run:" wording, import-mermaid `<skill-dir>`, registry engineer 28, codebase-summary counts/date, §13 brand-skin durability note
- lows left: `self_check.py` doesn't flag `<meta http-equiv="refresh">` (upstream script, unchanged); upstream anchor bug `#consultant-special-2x2…`; dead variant-tab JS in gallery (harmless); no capability-map rows for swimlane/story-map; `ba.json` version not bumped
- final `npm test` 461 pass / 0 fail / 1 skip
