---
name: image-prompt
description: The foundation and router for any image a post or page needs — the "should this even be AI-generated?" gate, the four-question image brief, model-agnostic prompt craft (subject, composition, lighting, colour, style, mood, constraints), and a tool router by dominant requirement (typographic, photoreal, surreal, editing, consistent series, vector, video). Use when the user says "I need a visual for this post", "what image should I use", "make a graphic", "help me prompt an image", "which image model should I use", "write me an image prompt", or "generate a hero/OG/thumbnail image". Sits above the SEO-asset pipeline in [[seo-image-gen]] and the ad-visual work in [[ad-creative]].
allowed-tools: Read, Write, Glob, Grep
---

# Image Prompt

> A prompt with no brief produces a pretty, purposeless picture. This skill decides *what* image the work needs, describes it in model-agnostic language, routes it to the right tool — and says so out loud when a real photo would beat anything generated.

## When this skill activates

**Implicit:** the task involves choosing, briefing, or prompting an image — for a social post, a blog hero, an OG card, a thumbnail, an ad, or a Group cover.
**Explicit:** "Use the image-prompt skill to [task]."
**Routed from:**
- `/mk:content social` — when a post needs a visual (skills: `social-content`, `image-prompt`)
- [[seo-image-gen]] — the brief-and-route layer above the SEO-asset generation pipeline
- [[ad-creative]] — when the ad concept needs a visual described before it is produced
- [[facebook-strategy]] and [[facebook-groups]] — Page post graphics, Reel covers, Group covers

## Scope

Covers:
- The gate: whether this image should be AI-generated at all.
- The four-question image brief — job, the one thing, format, brand look.
- Model-agnostic prompt anatomy, and the weak → strong rewrite.
- The tool router: matching the dominant requirement to the right model or medium.
- Cross-cutting rules: AI disclosure, IP and real-people limits, verification, accessibility, overlay design.

Does NOT cover:
- SEO asset specs — OG dimensions, favicon sizes, WebP packaging, schema images → [[seo-image-gen]] and [[seo-images]].
- Ad concept and offer → [[ad-creative]].
- Caption and overlay copy → [[copywriting]], [[social-content]].
- Charts and data visualization — a real chart beats a generated one; use a charting tool.

## Where this sits

This is the **shared decision layer** above the tool-specific work. It is the visual equivalent of the
brand and pillar context: the thinking that a model-specific skill assumes has already happened.

Once routed, model-specific craft belongs to whichever tool the user actually runs. This skill does not
pretend to own another tool's tricks.

## Step 0 — The gate: should this even be AI-generated?

AI generation is one option, not the default. Often something else wins outright:

- **A real photo** — the actual product, space, team, or result. Authenticity beats AI for trust, and AI
  **cannot** depict a real place or real people honestly.
- **A screenshot** — a testimonial, a result, a UI, a number in context. Concrete and credible.
- **UGC** — a customer's photo or video, **with recorded permission**. Social proof that cannot be faked.
- **A chart or diagram** — for data, a clean chart is clearer and more honest than any illustration.
- **Stock** — when generic is genuinely fine and speed matters.

Reach for **generation** when the image does not exist, must match a specific brand look, needs legible
in-image text, or must be one of a consistent series — and no real asset fits.

**If a real asset is better, say so.** Do not generate for the sake of generating.

Depth: `references/the-image-brief.md`.

## Step 1 — Write the brief

Read **`plans/marketing-context.md`** ([[product-marketing]]) for the visual brand, then answer four things:

1. **Job / purpose** — hero, explainer, quote graphic, product shot, lifestyle, thumbnail, background, ad creative.
2. **The one thing it must convey.** One idea. An image trying to say five things says nothing.
3. **Format and aspect ratio** for the destination.
4. **Brand look** — palette, style, typographic feel, and the do-nots.

Output a one-line brief: *"[Job] for [destination, aspect ratio], conveying [the one thing], in [brand look]."*

## Step 2 — Describe it (model-agnostic)

Turn the brief into a **specific, natural-language** prompt covering **subject · composition · lighting ·
colour · style · mood · detail · constraints**, and **drop the quality-token spam** ("4k, masterpiece,
ultra-detailed") — modern models reason over description, not incantation.

Specificity beats length. Design for any **text overlay** now: negative space, low detail where the words
go, high contrast. Depth: `references/prompt-anatomy.md`.

## Step 3 — Route to the tool

Pick by the image's **dominant requirement** — in-image text, photorealism, surreal art, editing, a
consistent series, brand-exact colour, vector, or video. When two tools both fit, **say both work and pick
by the deciding factor**; do not manufacture a winner. Depth: `references/choosing-the-tool.md`.

## Step 4 — Hand off, verify, ship

After generation: **verify** any in-image text and any data, **disclose** AI generation per platform and
region, then hand the asset to whoever publishes.

- SEO asset packaging — dimensions, alt text, WebP, schema, OG tags → [[seo-image-gen]] and [[seo-images]].
- Social posting is manual; ClauKit does not publish to social platforms.

## Cross-cutting rules (always)

- **Disclose AI-generated media** per platform and region — Meta's "Made with AI" labelling, the EU AI Act.
  **Watermark behaviour varies by tool** and some tools apply none; never rely on a watermark as disclosure.
- **No real people, no IP.** No real identifiable individuals, no copyrighted characters, no trademarked
  logos. Original directions only.
- **Verify in-image text and any data before publishing.** Models still garble both.
- **Consent for UGC.** A customer's photo needs recorded permission before it becomes a brand asset.
- **Accessibility.** Contrast and legibility on a phone; leave room for overlays; write real alt text.

## Quality bar — self-check

- Did I run the **gate** — real asset versus AI — before reaching for generation?
- Did I write a **brief** (job, the one thing, format, brand) and then a **specific, natural-language**
  prompt with no token spam?
- Did I **route by the dominant requirement**, honestly, and hand off rather than bluff model specifics?
- Did I design for **overlays and accessibility**?
- Did I cover **disclosure, IP, consent, and verification**?

## Edge cases and pushback

- **"Just write a cool image prompt"** → build the brief first. Purpose before prompt.
- **"4k masterpiece ultra-detailed"** → rewrite into a specific scene; drop the quality tokens.
- **"Generate my real cafe and staff"** → use a real photo. Do not fabricate a real place or real people.
- **"Base it on [studio]'s characters" or a real person** → decline the IP and the real likeness; offer an
  original direction that gets at the same feeling.
- **"Which model, A or B?"** → an honest either-way answer when both fit, with the deciding factor named.
- **"Just make me a chart"** → a real chart from real numbers, not a generated picture of one.

## Output

- `plans/marketing/<campaign>/image-briefs.md` — one brief per asset: job, the one thing, format, brand
  look, the model-agnostic prompt, the routed tool, and the disclosure and verification notes.

## Definition of done

- The real-asset-versus-AI gate was run, and its answer is stated.
- Each asset has a one-line brief and a specific, natural-language prompt with no quality-token spam.
- Each prompt names its aspect ratio and its overlay constraints.
- Routing is by dominant requirement, with honest either-way calls where two tools fit.
- Disclosure, IP, consent, verification, and accessibility are all addressed.
- SEO packaging is handed to [[seo-image-gen]] rather than improvised here.

## References

- `references/the-image-brief.md` — the "should this be AI?" gate and the four-question brief.
- `references/prompt-anatomy.md` — the universal, model-agnostic anatomy of a strong prompt.
- `references/choosing-the-tool.md` — the router, the decision tree, and honest which-tool calls.
- `references/examples.md` — end-to-end flows, weak → strong, the do-not-generate gate, and honest scope.
