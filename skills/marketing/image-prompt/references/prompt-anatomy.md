# Prompt anatomy (model-agnostic)

The transferable craft: how to describe an image so any modern model gets close. Tool-specific tricks
belong to the tool. This is the shared foundation underneath all of them.

## Describe, do not incant

Modern image models reason over **natural language**. Drop the 2023-era token spam — "4k, masterpiece,
trending on artstation, ultra-detailed, best quality" adds nothing. **Specific description** is what moves
quality.

A weak prompt names a thing. A strong prompt directs a picture.

## The anatomy

Cover what actually matters for the shot:

- **Subject** — who or what, specifically. "A matte-black ceramic mug", not "a mug". The focal point.
- **Composition / framing** — shot type and arrangement. "Close-up, centered, generous negative space on
  the left"; "flat lay, top-down". Where things sit and how much room they get.
- **Lighting** — direction, quality, time of day. "Soft window light from the left"; "harsh midday";
  "golden hour". Lighting carries most of the mood.
- **Colour / palette** — the brand palette or a named scheme. "Muted earth tones with one green accent."
- **Style / medium** — "clean flat vector", "editorial photography", "3D render", "watercolour".
- **Mood / atmosphere** — the feeling. "Calm, optimistic"; "energetic, high-contrast".
- **Detail / focus** — what is sharp versus soft. "Shallow depth of field on the product."
- **Constraints** — **aspect ratio**, **negative space for a text overlay**, and what to avoid.

A workable order: *[Subject with adjectives], [composition], [lighting], [colour], [style], [mood].
[Aspect ratio and constraints].* Tool-specific moves go on top, in the tool.

## Specificity beats length

Long is not the goal; **specific** is. Every word should change the picture. Cut adjectives that direct
nothing. If a detail matters — a colour, a layout, a piece of text — state it precisely. If it does not,
leave it open and let the model choose.

## Iterate, do not one-shot

Generate, read what came back, then change **one thing** at a time: "same, but warmer light" / "more
negative space" / "tighter crop". Most models return variations — make a few, pick, refine. Iterate cheap,
then finalize.

## Design for the overlay

If a headline or caption goes on top later in a design tool, **compose for it now**: leave a deliberate
low-detail region, keep contrast high where the text will sit, and do not fill the frame. Plan the text's
home before generating, not after.

Say it explicitly in the prompt — for example: *"…deliberate negative space in the lower third, low detail
and even tone there, high contrast so white text reads on a phone. No text in the image."*

## Weak → strong

**Weak:** "cool office, 4k, masterpiece, ultra detailed"

**Strong:** "A calm, minimal co-working corner: a single laptop on a light oak desk by a window, soft
morning light from the left, muted neutrals with one small green plant, clean editorial photography,
shallow depth of field, generous empty wall space on the right for a headline. 16:9."

Carry the brand in from `plans/marketing-context.md`, set the aspect ratio, then route the prompt with
`choosing-the-tool.md`.
