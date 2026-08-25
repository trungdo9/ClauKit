---
name: seo-image-gen
description: AI image generation for SEO assets — OG/social preview images, blog hero images, product photos, schema images, infographics, favicons, Pinterest pins. Maps each use case to the right aspect ratio, resolution, and domain-mode prompt, then packages the result (alt text hook, filename, WebP, schema, OG tags) for shipping. Powers AI-generated media in the seo-writing pipeline (Stage 4) and the generation half of an [[seo-images]] pass.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# SEO Image Gen — AI-Generated SEO Assets

> A hero image and a favicon don't share an aspect ratio, a resolution, or a prompt style — "generate an image" with a different sentence isn't enough. This skill maps each SEO asset type to its generation parameters, then hands the result off packaged for shipping.

## When this skill activates

**Implicit:** "generate an OG image", "make a hero image for this post", "generate a product photo", "create an infographic", "I need a favicon", "generate a schema image", "batch-generate N variations of [x]".
**Explicit:** "Use the seo-image-gen skill to [task]."
**Routed from:** [[seo-writing]] Stage 4 media step, when a placeholder's source is "AI-generate" rather than stock/sourced; [[seo-images]], when its optimization pass flags a missing or low-quality OG/hero image that needs generating.

## Scope

Covers:
- Mapping SEO asset use cases → aspect ratio, resolution, and domain-mode defaults.
- Constructing the generation prompt with the 6-component Reasoning Brief (Subject / Action / Context / Composition / Lighting / Style) plus domain-mode modifier libraries (Cinema, Product, Editorial, UI/Web, Infographic, etc.).
- Brand/style presets so a site's generated images stay visually consistent across a batch.
- Model routing, resolution tiers, and cost awareness for single vs. batch generation.
- Post-processing recipes (platform resize, background removal, format conversion) via ImageMagick/FFmpeg.
- Error handling for generation failures (safety blocks, rate limits, missing MCP).

Does NOT cover:
- The underlying prompting technique and raw model mechanics for non-SEO subjects (characters, arbitrary art, general marketing visuals) → [[ai-artist]]. This skill is the SEO-use-case layer on top of that same technique — it doesn't re-derive prompt engineering, it applies it with SEO-specific presets.
- Alt text rules, filename conventions, lazy-loading, image sitemaps, and resolving the `[[IMAGE_REQUEST:slug]]` placeholder itself → [[seo-images]]. This skill is what [[seo-images]] calls when its source ladder picks "AI-generate"; it returns a generated image for that skill to finish (alt text, filename, compression, embed).
- Writing the article the image illustrates → [[seo-content]].
- Full schema markup beyond the `ImageObject` snippet for a newly generated asset → [[seo-schema]].

## Generation is an MCP concern, mapping is this skill's job

This skill does not assume a specific image-generation backend is installed. Before generating, check whether an image-generation MCP is connected (for example `nanobanana-mcp`, exposing tools like `gemini_generate_image` / `set_aspect_ratio` — see `references/mcp-tools.md` for its parameter shapes). If no such MCP is configured, fall back to [[ai-artist]]'s prompting method with whatever generation tool is available, or tell the user what's missing. Never fabricate a saved file path or a generation result.

## SEO use-case → generation parameters

Each use case maps to pre-configured defaults. Apply these before constructing the prompt:

| Use Case | Aspect Ratio | Resolution | Domain Mode | Notes |
|----------|-------------|------------|-------------|-------|
| **OG/Social Preview** | `16:9` | `1K` | Product or UI/Web | Clean, professional, text-friendly |
| **Blog Hero** | `16:9` | `2K` | Cinema or Editorial | Dramatic, atmospheric, editorial quality |
| **Schema Image** | `4:3` | `1K` | Product | Clean, descriptive, feeds an `ImageObject` |
| **Social Square** | `1:1` | `1K` | UI/Web | Platform-optimized square |
| **Product Photo** | `4:3` | `2K` | Product | White background, studio lighting |
| **Infographic** | `2:3` | `4K` | Infographic | Data-heavy, vertical layout, thinking:high if supported |
| **Favicon/Icon** | `1:1` | `512` | Logo | Minimal, scalable, recognizable |
| **Pinterest Pin** | `2:3` | `2K` | Editorial | Tall vertical card |

## Generation pipeline

For every generation request:

1. **Identify the use case** from the request or the calling skill's context (og, hero, product, infographic, …).
2. **Apply the SEO defaults** from the table above — aspect ratio, resolution, domain mode.
3. **Configure the backend** — set the aspect ratio via whatever MCP tool is connected (e.g. `set_aspect_ratio`).
4. **Construct the Reasoning Brief** (below) with the domain-mode emphasis for this use case; be specific and visceral — describe what the camera sees, not an abstract concept.
5. **Check for a preset** — if the user names a brand or one is already configured for the site, load it and let it set colors/mood/typography defaults (see `references/presets.md`, `references/seo-image-presets.md`). User instructions always override a preset.
6. **Generate**, then run the **post-generation SEO packaging** checklist below.

## The 6-component Reasoning Brief

Every prompt is written as natural narrative paragraphs — never a comma-separated keyword list. Full domain-mode modifier libraries, the weight-distribution table, proven templates by use case, and safety-filter rephrase strategies are in `references/prompt-engineering.md` — load it when constructing anything beyond a simple one-off.

| Component | Weight (typical) | Answers |
|---|---|---|
| **Subject** | 30–40% | Who/what, with physical specificity (age, material, texture, condition) |
| **Action / Styling** | 15–25% | What's happening, or brand/texture/accessory detail for product shots |
| **Context / Environment** | 15% | Setting, time of day, spatial detail |
| **Composition** | 10% | Camera angle, shot type, framing |
| **Lighting** | 10% | Source, quality, direction, temperature |
| **Style / Camera** | 10–25% | Art medium, camera + lens, aesthetic reference |

**Good:** "A weathered Japanese ceramicist in his 70s, deep sun-etched wrinkles mapping decades of kiln work, calloused hands cradling a freshly thrown tea bowl with an irregular, organic rim" — specific, visceral.
**Bad:** "old man, ceramic, bowl" — a tag list, not a scene.

Key prompt rules that apply to every SEO asset:
- **No negative prompts** — Gemini doesn't support them. Reframe: "no blur" → "sharp, in-focus, tack-sharp detail"; "no text" → "clean, uncluttered, text-free".
- **Text rendering** — quote exact text, keep it under 25 characters, 2–3 phrases max, describe font characteristics rather than naming fonts.
- **End with an anchor, not a stack** — "ultra-realistic, high resolution" earns its place; "8K, masterpiece, best quality" doesn't.

## Domain-mode modifiers (by use case)

Pick the mode matching the SEO use case, then load `references/prompt-engineering.md` for its full modifier library:

| Domain Mode | Used for |
|---|---|
| **Cinema** | Blog heroes needing dramatic, atmospheric quality |
| **Product** | OG images, product photos, schema images — clean commercial photography |
| **Editorial/Fashion** | Blog heroes and Pinterest pins wanting a magazine-quality look |
| **UI/Web** | OG images and social squares built as flat/isometric graphics rather than photos |
| **Infographic** | Data-heavy vertical assets — modular layout, clear text hierarchy |
| **Logo** | Favicons/icons — max 2–3 colors, works reduced to 32×32 |

## Model & resolution routing

| Scenario | Resolution | Why |
|----------|-----------|-----|
| OG images, social previews | `1K` | Fast, cost-effective |
| Hero images, product photos | `2K` | Quality + detail |
| Infographics with text | `2K`–`4K`, thinking:high if supported | Better text rendering and layout |
| Quick drafts / iteration | `512` | Rapid, cheap iteration |

Model IDs and per-image pricing move fast and are package/version-dependent — verify the currently installed MCP's model aliases and https://ai.google.dev/gemini-api/docs/pricing before quoting either to a user. Full model specs, aspect-ratio support per model, and rate limits are in `references/gemini-models.md`.

## Brand/style presets

A preset fixes colors, style, typography, lighting, and mood so a batch of generated images (e.g. every hero image on a site) looks like one brand rather than N unrelated generations. Schema and example presets (tech-saas, luxury-brand, editorial-magazine) are in `references/presets.md`; ready-to-use SEO-specific preset templates (og-default, blog-hero, product-white, social-square, infographic-vertical, favicon-mark) are in `references/seo-image-presets.md`.

Selection order: a named use case (og/hero/product/…) loads its SEO preset first → a named brand preset overrides colors/mood/typography → user instructions always win over both.

## Post-generation SEO packaging

After every successful generation, hand off for finishing — do not skip this:

1. **Alt text** — write it, or hand the image to [[seo-images]] to write it (keyword-aware, describes what's shown, never empty).
2. **Filename** — SEO-friendly: `keyword-description-widthxheight.webp`, not the raw generator output name.
3. **WebP conversion** — `magick output.png -quality 85 output.webp` (see `references/post-processing.md` for the full recipe set).
4. **File size** — target under 200KB for hero images, under 100KB for thumbnails.
5. **Schema** — suggest an `ImageObject` for the new asset:
   ```json
   {
     "@type": "ImageObject",
     "url": "https://example.com/images/keyword-description.webp",
     "width": 1200,
     "height": 630,
     "caption": "Descriptive caption with target keyword"
   }
   ```
6. **OG meta tags** — for social preview images:
   ```html
   <meta property="og:image" content="https://example.com/images/og-image.webp" />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   <meta property="og:image:alt" content="Descriptive alt text" />
   ```

## Post-processing recipes

Common operations after generation — resize for a platform, remove a solid/green-screen background (Gemini can't generate transparency directly), convert format. Check `magick`/`convert`/`ffmpeg` availability first. Full recipe set — including the green-screen transparency workaround, compositing, and batch loops — is in `references/post-processing.md`.

```bash
# WebP conversion (always do this before shipping)
magick output.png -quality 85 output.webp

# Platform resize example (OG image)
magick input.png -resize 1200x630^ -gravity center -extent 1200x630 og-image.webp
```

## Cost awareness

Generation costs money — be transparent before batch runs:
- Show an estimated cost before generating, especially for `batch` requests.
- Verify current per-image pricing against https://ai.google.dev/gemini-api/docs/pricing and the installed MCP's configuration — do not quote a fixed number from memory.
- Free-tier rate limits are steep (roughly 10 requests/minute, 500/day per project) — plan batch timing around that.
- Details and a cost-ledger command pattern are in `references/cost-tracking.md`.

## Error handling

| Error | Resolution |
|-------|-----------|
| Image-gen MCP not configured | Tell the user which MCP is expected and that none is connected; don't fabricate output |
| API key invalid | New key at https://aistudio.google.com/apikey |
| Rate limited (429) | Wait ~60s, retry; free tier is roughly 10 RPM / 500 RPD |
| `IMAGE_SAFETY` / `SAFETY` finish reason | Rephrase — see the Safety Filter Rephrase Strategies section of `references/prompt-engineering.md` |
| `PROHIBITED_CONTENT` | Not retryable — the topic itself is blocked; change the concept |

## Key concepts

- **Domain mode is a weighted preset, not decoration** — it shifts how much of the prompt goes to Subject vs. Style vs. Context for that asset type; applying the wrong mode (e.g. Cinema on a product schema image) produces an off-brief result even with a good Subject description.
- **Positive framing** — Gemini has no negative-prompt syntax; every exclusion has to be rephrased as what IS present.
- **Provenance is automatic, not a checklist item** — SynthID watermarking is embedded in every generated image regardless of what the prompt asked for; don't promise a client "no watermark."

## Output

- A generated image (or N batch variations) plus: the crafted prompt (shown for transparency), the settings used (domain mode, aspect ratio, resolution), and the post-generation SEO checklist (alt text suggestion, filename, WebP conversion, schema/OG snippet where applicable).
- When used as a planning pass rather than a single generation: `plans/marketing/<campaign>/seo-image-gen.md` — which assets need generating, their use-case mapping, and an estimated cost.

## Cross-references

- [[seo-images]] — alt text, filenames, compression, placeholder-tag resolution; this skill is its "AI-generate" source option and hands a finished image back to it
- [[ai-artist]] — the underlying Nano Banana/Gemini prompting technique this skill's SEO presets sit on top of
- [[seo-writing]] — Stage 4 media step routes AI-generation requests here
- [[seo-schema]] — full schema markup beyond the `ImageObject` snippet this skill suggests
- `plans/marketing-context.md` — required hub (brand voice/colors feed presets)
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo`'s `seo-image-gen` skill (itself built on the standalone Claude Banana image-generation skill) and adapted for KitForge: reframed "install the banana extension" as "check whether an image-gen MCP is connected," dropped the audit-only sub-agent role (ClauKit doesn't 1:1-port sub-agents), and pointed to [[ai-artist]] as the general-purpose generation primitive instead of duplicating its prompting guide. Model IDs and pricing were already flagged unverified in the source and are kept that way here — verify against the installed MCP and https://ai.google.dev/gemini-api/docs/pricing before quoting either.
