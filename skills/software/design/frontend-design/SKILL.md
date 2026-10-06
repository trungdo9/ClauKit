---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality — a committed aesthetic direction, design principles (hierarchy, type, color, accessibility), micro-interactions, inspiration capture and design-image iteration, and design-guideline / design-story documentation. Use when the user asks to build or restyle web components, pages, or applications, or to set a project's visual system. Generates creative, polished code that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available (Use `anime.js` for animations: `./references/animejs.md`). Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Four Stages: Beautiful → Right → Satisfying → Peak

The direction above is the *taste*; these are the checks that keep it usable. Load the reference for the stage you are in.

1. **BEAUTIFUL** — visual hierarchy, typography, color, white space. Aesthetic standards come from studying quality examples, not from the model's defaults. → [`references/design-principles.md`](references/design-principles.md)
2. **RIGHT** — design systems, tokens, component semantics, WCAG 2.1 AA. A beautiful interface that fails accessibility is not done. → [`references/design-principles.md`](references/design-principles.md)
3. **SATISFYING** — micro-interactions: 150–300ms, ease-out on entry, ease-in on exit, sequential delays. → [`references/micro-interactions.md`](references/micro-interactions.md)
4. **PEAK** — narrative: scroll storytelling, parallax, thematic consistency — with restraint. → [`references/storytelling-design.md`](references/storytelling-design.md)

Inspiration platforms, design systems and tooling: [`references/design-resources.md`](references/design-resources.md).

## Workflows

### Capture & analyze inspiration

1. Pick references (Dribbble, Mobbin, Behance, Awwwards) that match the chosen direction.
2. Capture viewport screenshots (not full page) with the `chrome-devtools` skill or the host's browser tools.
3. Analyze each with the `ai-multimodal` skill: style, grid, type system (**predict the Google Fonts name + size** — don't fall back to Inter/Poppins), palette with hex codes, hierarchy techniques, component patterns, micro-interactions, accessibility, overall quality 1–10.
4. Record the findings in the design guidelines (below).

### Generate & iterate design images

1. Write the prompt: style, colors, typography, audience, motion notes.
2. Generate with `ai-multimodal` (or `ai-artist` for prompt craft), then score the output with `ai-multimodal`.
3. Below 7/10 → name the specific weakness (color, type, layout, spacing, hierarchy), refine the prompt, regenerate.
4. Stop at ≥ 7/10 and document the decisions.

### Showcase / landing pages

A one-page showcase still follows the direction above — no template defaults. Before shipping: Open Graph + Twitter card meta, one visible primary CTA, responsive breakpoints checked on a phone width, images resized and served as WebP/AVIF. Static hosts (GitHub Pages, Vercel, Netlify) need no build step for plain HTML.

## Design Documentation

- **Design guidelines** — fill [`assets/design-guideline-template.md`](assets/design-guideline-template.md) (color, type, layout, component styling, accessibility, rationale) and save as `./docs/design-guidelines.md` — the file every `/ck:` command and the `frontend-developer` agent read.
- **Design story** — fill [`assets/design-story-template.md`](assets/design-story-template.md) (narrative, emotional journey, peak moments, rationale) and save as `./docs/design-story.md`.

## Related skills

- `ui-styling` — shadcn/ui + Tailwind implementation, theme config generation
- `threejs` — 3D / WebGL scenes (`/ck:design 3d`)
- `ai-multimodal` — screenshot analysis, design-image generation and scoring
- `chrome-devtools` — inspiration capture, visual verification of the built page
