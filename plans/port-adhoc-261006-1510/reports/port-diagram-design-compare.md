# Port compare — diagram-design → ClauKit

## Local conventions
- Skills grouped, never depth-1: engineer → `skills/software/<name>/`, BA → `skills/ba/<name>/` (frontmatter `ba-<name>`, prefix reserved)
- Grouped skill ≠ registered skill → entry point must be a **command**; prose says "Read the `x` skill file" + relative link
- BA kit pulls engineer files via `requires.shared` (precedent: `software/scenario/SKILL.md`); `getKitPaths` accepts dirs
- Shipped md links relative to containing file; `installer-packaging.test.js` checks every relative `.md` target in all kit installs
- Provenance in md = `<!-- Adapted from <url>@<ref>:<path> (MIT) -->`; attribution in `skills/THIRD_PARTY_NOTICES.md`

## Overlap with existing skills
| local | overlap | resolution |
|---|---|---|
| `ba-diagramming` (`/ba:diagram`) | mermaid sequence/flow/state/erd, render gate, spine-first | **complementary**: mermaid = spec-embedded source of truth; diagram-design = presentation-grade HTML/SVG + types BA deferred (capability map rows 30–33 context/dfd/journey/class) + story-map/swimlane/process/quadrant/fishbone |
| `software/design/frontend-design` | aesthetics for UI, not schematics | none |
| `planning/references/html-output.md` | `/ck:plan -o html` | can embed a diagram-design SVG; pointer only |
| `docs-manager` / `system-architecture.md` | architecture docs | pointer: architecture/deployment/dependency types |

## Deps
None added. Python 3 stdlib only (already used by ClauKit skills). Optional: headless Chrome/Playwright for PNG export (existing `chrome-devtools` skill covers it).

## Risks
1. **Size**: full skill +5.4 MB vs `skills/` ~14 MB. dark/full/animated examples (~2.9 MB) linked 134× from references → trimming needs link rewrites
2. Upstream references cite repo-root scripts (`verify-*.py`, `lint-skin.py`, `doctor`) not in skill → rewrite to "upstream-only" or port the one that matters (`verify-geometry.py`)
3. `wiretext` (not in ClauKit) cited in SKILL.md → reroute
4. `doctor` = upstream plugin-install health → superseded by `/ck:health`; drop
5. Upstream `name: diagram-design` collides with nothing locally

## File-level plan
- `skills/software/diagram-design/{SKILL.md,references/,assets/,scripts/}` ← source skill (+ `scripts/verify_geometry.py`)
- `.claude/commands/ck/diagram.md` — new entry point (draw · import · export · profile)
- `.claude/kits/ba.json` `requires.shared` += `.claude/skills/software/diagram-design/`
- `skills/ba/diagramming/SKILL.md` + `.claude/commands/ba/diagram.md` — route presentation/deferred types to diagram-design
- `skills/THIRD_PARTY_NOTICES.md`, `docs/clauKit-registry.md`, counts in docs/README
- tests: BA install ships diagram-design; engineer install ships it
