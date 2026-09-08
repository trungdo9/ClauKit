# The image brief

Before any prompt: decide what image this actually needs. A prompt with no brief produces a pretty,
purposeless picture. This is the step every tool-specific skill assumes has already happened.

## Start with the gate: should this even be AI-generated?

AI image generation is one option, not the default. Often something else wins:

- **A real photo** — the actual product, space, team, or result. **Authenticity beats AI** for trust; raw
  real content frequently outperforms polished generation, and AI **cannot** honestly depict a real place
  or real people.
- **A screenshot** — a testimonial, a result, a UI, a number in context. Concrete and credible.
- **UGC** — a customer's photo or video, **with recorded permission**. Social proof that cannot be faked.
- **A chart or diagram** — for data, a clean chart is clearer and more honest than an illustration of one.
- **Stock** — when generic is genuinely fine and speed matters more than distinctiveness.

Reach for **AI generation** when the image does not exist, must match a specific brand look, needs legible
in-image text, or must be one of a consistent series — and no real asset fits.

**If a real asset is better, say so.** Do not generate for the sake of generating.

## If you are generating, write the brief

Four questions, answered before prompting.

### 1. Job / purpose

What is this image *for*? The common jobs:

- **Stop-scroll hero** — earn the pause in the feed.
- **Explainer / infographic** — make a concept or a sequence clear. Verify the data.
- **Quote / text graphic** — a line of copy as the visual. Text-led.
- **Product shot** — the thing itself, in context.
- **Lifestyle / scene** — the world around the brand.
- **Thumbnail** — the click. High contrast, one focal point, room for a few words.
- **Background / overlay base** — a backdrop for text added later.
- **Ad creative** — hero plus offer plus CTA → [[ad-creative]].
- **OG / social preview card** — the link preview → [[seo-image-gen]] for the specs.

### 2. The one thing it must convey

A single idea or feeling. If it is trying to say five things, it says nothing. Name the one.

### 3. Format and aspect ratio for the destination

1:1, 4:5 (feed portrait and carousels), 9:16 (Stories, Reels, TikTok), 16:9 (thumbnail, landscape, OG),
2:3 or 3:4 (Pinterest, poster). Decide up front — reframing later costs a regeneration.

### 4. Brand look

Pull from `plans/marketing-context.md` ([[product-marketing]]): palette, visual style, typographic feel,
and the explicit do-nots. So the image looks like the brand rather than like generic AI output. Capturing
it as a reference image in the tool works too, where the tool supports that.

## Output of this step

A one-line brief you can hand straight to a prompt:

> *"[Job] for [destination, aspect ratio], conveying [the one thing], in [brand look]."*

From there → `prompt-anatomy.md` to describe it → `choosing-the-tool.md` to route it.
