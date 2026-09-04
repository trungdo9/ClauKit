# Examples — brief → prompt → tool

Worked end-to-end flows showing the brief, the model-agnostic prompt, the routing, and the honest gates.

Brand context for these examples: a SaaS social scheduler with a clean, design-led look — mono palette with
one terminal-green accent. Real output pulls the real brand from `plans/marketing-context.md`.

---

## Full flow: a post needs a visual

**Need:** "I need a visual for a post about batching a week of content."

**Brief:** stop-scroll hero for Instagram (4:5), conveying *"a whole week, done in one calm sitting"*, in the
clean mono brand look.

**Model-agnostic prompt:** "A calm, minimal flat-lay: a single laptop and a coffee on a light desk, a tidy
weekly calendar visible on screen, soft morning light, muted neutrals with one terminal-green accent, clean
editorial style, generous empty space top-left. 4:5."

**Route:** photoreal-ish lifestyle with no critical in-image text → Nano Banana via [[ai-artist]], or a
photoreal model if it must read as an actual photograph. Hand off for the model-specific craft.

---

## Routing a batch of needs

| Need | Route |
|---|---|
| Quote graphic with the tagline | Ideogram **or** Nano Banana — both strong at text; pick by tooling |
| Photoreal headshot-style portrait | Nano Banana or Midjourney — **not** Ideogram, weak at real faces |
| Same product, six campaign scenes | Nano Banana references, or Flux multi-reference |
| Swap the background, keep the product identical | Nano Banana, or Flux instruction-based edit |
| The logo as a clean vector | Recraft — vector-native |
| A 6-second moving hook | A video model such as Veo → [[ai-multimodal]] |
| An OG card for a blog post | [[seo-image-gen]] — it owns the specs and the packaging |

---

## Weak → strong

**Weak:** "cool office, 4k, masterpiece, ultra detailed"

**Strong:** "A minimal co-working corner: one laptop on light oak by a window, soft left light, muted
neutrals with a small green plant, editorial photography, shallow depth of field, empty wall on the right
for a headline. 16:9."

---

## The do-not-generate gate

**Need:** "Generate a realistic photo of my actual cafe and staff."

**Answer:** use a **real photo** of the actual cafe and the actual team. It is authentic, it is *them*, and
AI cannot — and should not — fabricate a real place or real people. Generation is for what does not exist
or must match a specific look. This is neither.

Same answer shape for "generate a photo of our warehouse", "make it look like our founder", and "generate a
customer testimonial photo". The last one also needs consent, which a generated image cannot supply.

---

## Designing for an overlay

**Need:** a background image with a headline added later in a design tool.

**Prompt move:** "…deliberate negative space in the lower third, low detail and even tone there, high
contrast so white text reads on a phone. **No text in the image.**"

Then the headline goes on in the design tool, where it can be edited without a regeneration.

---

## Honest cross-cutting scope — say this out loud

- **Should it even be AI?** A real photo, screenshot, chart, or UGC often beats generic generation. Gate first.
- **Disclose AI-generated media** per platform and region — Meta's "Made with AI", the EU AI Act.
  **Watermark behaviour varies by tool** and some apply none; never treat a watermark as disclosure.
- **No real people, no IP.** No real identifiable individuals, copyrighted characters, or trademarked logos.
- **Consent for UGC**, recorded before the asset ships.
- **Verify** in-image text and any data before publishing. Models still garble both.
- **Accessibility** — contrast and legibility on a phone, room for overlays, real alt text.
- **Router, not generator.** This skill briefs, describes, and routes. [[ai-artist]] and the connected
  image-generation MCP do the generating; [[seo-image-gen]] packages SEO assets; publishing is somebody
  else's job. **Never fabricate a file path or a generation result.**

---

## What the good examples share

- **Brief first** — job, the one thing, format, brand — then a **specific natural-language prompt**.
- **Routed to the right tool** with an honest read, then handed off.
- **Gated** for "a real asset beats AI", **designed for overlays**, and **disclosed, IP-safe, and verified**.
