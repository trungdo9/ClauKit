# Design Workflow (5-phase)

3D and creative asset production. Linear.

**Trigger:** Design-only tasks (3D models, shaders, animations). Use existing design skills.
**Output dir:** `plans/marketing/<campaign>/design/` or as needed.

---

## Phase 1 — Concept

Mood board, sketches, brief. Skills: `frontend-design` (direction, tokens, inspiration capture), `ai-multimodal` (mood-board images).
*Output:* `concept.md` + `moodboard.png`.

## Phase 2 — Model

3D modeling (Blender, threejs). Skills: `threejs`, `ai-multimodal` (reference generation).
*Output:* `model.glb` or `model.gltf`.

## Phase 3 — Shader

GLSL shader writing (materials, lighting, effects). Skills: `threejs` (shader subskill).
*Output:* `shaders/<name>.glsl` + `material-config.json`.

## Phase 4 — Animate

Animation library (GSAP, Framer Motion, threejs animation). Skills: `threejs` (animation), `remotion`.
*Output:* `animation.json` (timeline) + `preview.mp4`.

## Phase 5 — Export

Final export (glTF, OBJ, MP4, PNG sequences). Skills: `threejs` (export).
*Output:* `export/` (multiple formats for different use cases).

---

**Conventions:** 3D assets use glTF 2.0 (industry standard). Textures in WebP/AVIF. Animations at 30fps minimum (60fps for hero/landing).
