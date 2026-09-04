# Choosing the tool

The router. Match the job to the model, then hand off for the model-specific craft. This is a decision
layer, not a tool tutorial.

> **Fast-moving landscape.** The specific "best for X" picks below are dated 2026 — **re-verify quarterly**
> before quoting one as current. The principle — match the job to the tool — is stable; the winners shift,
> and so do pricing and model IDs. Never quote a model ID or a price from memory.

## The decision tree

Pick by the **dominant requirement** of the image.

- **In-image text / typographic design** — quote graphics, posters, packaging, text-heavy layouts →
  **Ideogram** or **Nano Banana (Gemini)**. Both handle text well now. Pick by tooling and ecosystem, not
  by a manufactured "best at text" claim: Ideogram brings design tooling and structured layout control;
  Nano Banana brings Gemini reasoning, multi-image consistency, and conversational editing.
- **Photoreal portraits or product realism** → **Nano Banana** or **Flux**; Midjourney externally. Avoid
  Ideogram for real faces.
- **Surreal, painterly, or editorial art** → **Midjourney**-class, which has the wider artistic range.
- **Search-grounded infographics, accurate scenes, conversational editing** → **Nano Banana** (Gemini
  reasoning, many reference images, inpainting-style editing).
- **Editing an existing image** — "change one thing, keep the rest", inpaint, outpaint, fix → **Nano
  Banana** (conversational) or **Flux** (instruction-based edits).
- **A consistent character or product across a set** → reference-image models: **Nano Banana** (multiple
  references) or **Flux** (multi-reference).
- **Brand-exact colour, licence control, or open weights you can run and tune** → **Flux**, or Ideogram's
  open weights.
- **Vector / SVG for brand work** → **Recraft**, which is vector-native.
- **Moving image** → a video model such as **Veo**, or animate a still through an image-to-video pipeline
  → [[ai-multimodal]].

## Honest "which of these two?" calls

When two tools both fit — common with text graphics — **say both work, then pick by the deciding factor**:
the workflow the user is already in, the controls they need (style references versus reference images
versus editing), the ecosystem, cost, or open-weights access.

**Do not manufacture a clean winner where there is not one.** An honest either-way answer with a named
tiebreaker is more useful than a confident wrong pick.

## What runs where, in this kit

- **The prompting technique and the generation call** → [[ai-artist]] (Nano Banana / Gemini) or whichever
  image-generation MCP the user actually has connected. **Check what is connected before promising a
  generation** — and never fabricate a saved file path or a generation result.
- **SEO asset presets** — OG cards, hero images, favicons, schema images, aspect ratios and packaging →
  [[seo-image-gen]], with optimization and alt text in [[seo-images]].
- **Ad visuals** — concept, offer, and creative variants → [[ad-creative]].
- **Video** → [[ai-multimodal]], plus the `video-producer` agent where the automation kit is installed.

## If no tool fits

If the best answer is a **real photo, a screenshot, a chart, or UGC** — see `the-image-brief.md` — route
there instead of forcing a generation. Saying "take the photo" is a valid and often correct output of this
skill.
