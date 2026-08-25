# The Creative Review Page

A shareable, self-contained HTML page that presents generated ad concepts for a client or stakeholder to **review and pick** — the visual upgrade to `INDEX.md`. The markdown outputs are built for the operator; the review page is built for the person approving the spend: each concept rendered as an in-feed platform mockup, carousels broken into a labeled frame-by-frame storyboard, copy variations toggleable, and a disclosure block stating what is grounded in real assets.

> Upstream shipped a ready-made 400-line `assets/creative-review-template.html`. ClauKit does not ship that asset — build the page from the model below (one file, inline CSS/JS, no build step, no network calls) or hand the model to the design tooling of your choice.

## When to produce one

- **Presenting a batch for approval** — after Mode 1 or Mode 3 generation, package the top concepts into a review page instead of (or alongside) `INDEX.md`. Picking 5 of 50 is a *visual* decision; nobody should have to read markdown to make it.
- **Pitching a whitelist / co-branded partnership** — show the partner exactly what the ad looks like under each handle.
- **A monthly slate review** (Mode 4) — render the slate so the account-state call and the pick happen off one link.

Don't produce one for a single headline tweak or a quick internal gut-check — markdown is faster. Reach for the review page when a human who isn't you needs to choose.

## Data model

Drive the whole page from one inert JSON block (`<script type="application/json" id="review-data">`), parsed with `JSON.parse`; the render code reads it and nothing else.

```jsonc
{
  project: {
    brand:  "Brand name",            // required
    agency: "Partner or agency",     // optional — adds the co-brand line + default handle fallback
    date:   "2026-08-25",            // optional
    note:   "one-line context"       // optional
  },
  platforms: ["instagram", "facebook"],  // previews to offer; first is the default
  concepts: [                            // each concept is one strategic ANGLE (see "Define your angles" in SKILL.md)
    {
      name:    "Angle name",             // required
      tagline: "What makes this concept distinct",
      handles: [                         // optional. 1 entry = normal post; 2 = whitelist handle toggle
        { name: "brandhandle", partner: "Paid partnership with partner", initials: "BH" }
      ],
      frames: [                          // 1 frame = single ad; multiple = carousel storyboard
        {
          label:  "Hook",                // the frame's JOB in the narrative arc, not what's pictured
          prompt: "Image description — shown as a styled placeholder when no image exists yet",
          image:  "images/concept-01.png",   // optional — relative path, URL, or data URI
          headline: "Optional per-frame overlay",
          headlineTheme: "dark"          // "dark" (white text, default) or "light"
        }
      ],
      headlines: ["variation 1", "variation 2"],   // selectable; the picked one overlays frame 1
      grounding: "What is real vs. illustrative — required, see below"
    }
    // 2-4 concepts is the sweet spot; more and the tabs stop being a decision
  ]
}
```

## The frame storyboard is a narrative arc

Label each frame by the *job it does* (`Hook`, `The problem`, `The results`, `The ask`), never by its content (`Table screenshot`). A proof-led concept is literally Hook → Problem → Mechanism → Results → Context → Ask. Pick the arc before writing frames; for social-native arc patterns see [[social-content]].

## Images vs. placeholders

- **`image` provided** — the real creative (from the batch `images/` folder, a hosted URL, or a data URI) fills the frame.
- **`image` omitted** — a styled placeholder shows the frame `label` + `prompt`. This is the intended state for concepts that are copy + image-prompt but not yet rendered. Ship review pages with placeholders freely; swap images in as they're generated.

## Grounding — the disclosure block is required

Every concept carries a `grounding` line, and it must be true. Same rule as the Grounded Inputs corpus, surfaced to the reviewer: state exactly what is real (which lab panel, which review, which product photography) and, by omission, what is illustrative. Never present invented stats, fabricated test results, or stock imagery as the brand's own. If a concept's proof isn't real yet, the grounding line says so ("Results shown are illustrative pending the lab panel") — a review page that launders fiction as fact is worse than no review page.

## Writing the data safely

- **Valid JSON only** — double-quoted keys and strings, no comments, no trailing commas. Malformed JSON should fail loud (error banner), not silently.
- **Escape `<` as `\u003c` in every text value.** A value containing `</script>` would close the data block early. Apply this mechanically to all string values; HTML-escape again at render time.
- **Keep image paths relative** so the output folder can be zipped, moved, or hosted intact.

## Delivering it

1. Write `review.html` into the batch folder (e.g. `plans/marketing/<campaign>/ads/batches/YYYY-MM-DD/review.html`).
2. Populate the data block from the generated concepts; point `image` at any frames already rendered.
3. Verify: open it, click through every concept tab, both platform and handle toggles, every storyboard frame.
4. Deliver the folder (html + `images/`), or host it — it's a single page with local assets.

Keep the review page *next to* the markdown outputs, not instead of them: `INDEX.md` and the per-concept files stay the operator's record and the grounding audit trail; `review.html` is the approval surface on top.

## Common mistakes

- **Too many concepts** — 2-4 tabs is a decision; 10 is a menu nobody finishes.
- **Content-labeled frames** — label by narrative job, not by what's pictured.
- **Missing or dishonest grounding** — every concept discloses what's real; illustrative proof is labeled illustrative.
- **Absolute image paths** — breaks portability of the batch folder.
