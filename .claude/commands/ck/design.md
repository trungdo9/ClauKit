---
description: ⚡⚡ Design UI/UX (fast good · 3d screenshot describe ui-ux-pro-max)
argument-hint: [tasks-or-screenshot] [fast|good] [3d|screenshot|describe|ui-ux-pro-max]
---

**Think hard.** Plan & design from:
<input>$ARGUMENTS</input>

Design work routes to the `frontend-developer` agent, which must activate the canonical design skills (`aesthetic` + `frontend-design`) — no need to re-list here.

## Flags (parse `$ARGUMENTS` — workflow flags + output-type flags are combinable; output-type flags are mutually exclusive)

### Workflow intensity (pick one — default `fast`)

| Flag | Workflow |
|---|---|
| `fast` | **minimal** — designer-only, no research |
| `good` | **research-driven** — researcher + designer (award-quality: Dribbble/Behance/Awwwards/Mobbin/TheFWA tier) |

### Output type / input source (pick at most one — default = standard UI from `<input>` text)

| Flag | Effect |
|---|---|
| `3d` | **Three.js/WebGL** — immersive 3D experiences with custom shaders, particle systems, GPU rendering, 60fps target. Activates `threejs` + `shader` skills. |
| `screenshot` | **match reference** — `<input>` is a screenshot/path; output must match its visual style exactly. |
| `describe` | **describe + plan only** — `<input>` is a screenshot/video; output is a detailed implementation hand-off doc. **No implementation.** |
| `ui-ux-pro-max` | **Style Intelligence** — `<input>` is `[product-type] [style] [industry]`. Applies 50+ styles · 21 palettes · 50 font pairings · domain patterns · Pre-Delivery Checklist. |

Output-type flags drive the *what*; workflow flags drive the *how* (e.g. `good 3d` = research-driven 3D; `fast screenshot` = quick screenshot match).

## Workflows

### Default (no output flag) — standard UI

1. (if `good`) `researcher` subagent → research style, trends, fonts, colors, borders, spacing, element positioning.
2. `frontend-developer` subagent → implement design.
3. Default stack: pure HTML/CSS/JS (unless user specifies).
4. Report → ask review/approve.
5. On approval → update `./docs/design-guidelines.md` if needed.

### `3d` — Three.js / WebGL specialist

1. `frontend-developer` + `researcher` subagents → 3D design plan following `planning` skill's progressive disclosure structure.
2. `frontend-developer` implements step by step: Three.js scenes · particle effects · custom GLSL shaders · cinematic camera + post-processing · responsive · 60fps target.
3. Asset pipeline: `ai-multimodal` (textures, skyboxes, env maps, sprites, video bg, inpainting/outpainting, normal/height maps, masking).
4. Test across devices for 60fps.
5. Report → ask review/approve.
6. On approval → document shaders, particle systems, reusable 3D components in `./docs/design-guidelines.md`.

**Stack:** Three.js · GLSL · HTML/CSS/JS · WebGL · post-processing libraries.

### `screenshot` — match reference exactly

1. `ai-multimodal` → describe screenshot in super detail: style · trends · fonts (predict **Google Fonts name + size**, don't default to Inter/Poppins) · colors · borders · spacing · positions · sizes · shapes · textures · light/shadow · reflections · blur/glow · backgrounds · transitions.
2. `frontend-developer` subagent → design plan via `planning` skill's progressive disclosure structure to match the screenshot.
3. Implement step by step (default stack: pure HTML/CSS/JS).
4. Report → ask review/approve.
5. On approval → update `./docs/design-guidelines.md` if needed.

### `describe` — describe + plan only (no implementation)

1. `ai-multimodal` → describe screenshot/video in super detail. Cover every element: style · position · interaction · animation · transition · color · border · icon · font (Google Fonts name + size) · spacing · padding · margin · size · shape · texture · material · light · shadow · reflection · refraction · blur · glow · image · background transparency.
2. `frontend-developer` subagent → create implementation plan via `planning` skill's progressive disclosure structure.
3. Report plan summary to user. **No implementation.**

### `ui-ux-pro-max` — Style Intelligence

Input: `[product-type] [style] [industry]` (e.g. `SaaS minimal fintech`, `landing page elegant beauty`, `dashboard brutalism gaming`).

1. Analyze requirements (product type · style · industry).
2. Delegate to `frontend-developer` agent reading the `ui-ux-pro-max` skill file (Style Intelligence):
   - Select style (50+ options: Minimalism · Brutalism · Glassmorphism · Neumorphism · Dark Mode · …)
   - Choose palette (21 options: SaaS Blue · Healthcare · Beauty/Spa · Fintech · …)
   - Pick font pairing (50 options: Elegant/Luxury · Modern/Tech · Professional · …)
   - Apply domain-specific patterns.
3. Agent validates with Pre-Delivery Checklist.
4. Output comprehensive UI implementation.

**Stack:** default `html-tailwind`. Supported: react · nextjs · vue · svelte · swiftui · react-native · flutter · shadcn.
**Reference:** [.claude/skills/software/design/ui-ux-pro-max/SKILL.md](../../skills/software/design/ui-ux-pro-max/SKILL.md) for full Style Intelligence docs.

## Notes
- All plan structure → `planning` skill ([.claude/skills/software/planning/SKILL.md](../../skills/software/planning/SKILL.md)).
- All design methodology → `frontend-developer` agent + design skills (`aesthetic`, `frontend-design`, `ui-ux-pro-max`).
- Generate visual assets with `ai-multimodal`; verify quality with same skill. Background removal via `ai-multimodal`.
- Concise grammar in reports. List unresolved questions at end.

## Examples
- `/ck:design hero section with carousel` — default fast minimal workflow.
- `/ck:design good landing page with storytelling` — research-driven award-quality.
- `/ck:design 3d interactive product showcase` — Three.js immersive scene.
- `/ck:design good 3d portfolio hero` — research + 3D.
- `/ck:design screenshot ref.png` — match the screenshot.
- `/ck:design describe ref.png` — describe + plan only.
- `/ck:design ui-ux-pro-max SaaS minimal fintech` — Style Intelligence.
