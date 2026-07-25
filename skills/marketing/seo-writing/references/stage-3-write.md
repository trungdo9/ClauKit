# Stage 3 — Content Writing (deep, section by section)

**Goal:** turn the `outline_ready` brief into a full article — writing **one H2 section at a time** with global context injected each time, then assembling. This section-by-section approach is the single biggest quality lever over one-shot "write a 2000-word article" prompts: each section gets full attention and stays specific.

**Entry:** next `outline_ready` `content_production` row. **Exit:** same row, status `writing_completed`, `full_content_markdown` populated.

## Steps

1. **Lock the row.** Set status `writing` at the start (prevents a batch run from double-processing).

2. **Build global context** (injected into every section prompt so the writer never "loses memory"):
   ```
   { h1, keyword, sapo, faqs, writing_style, tone }
   ```
   Pull `writing_style`/`tone` from `marketing-context.md` (brand voice); default: "Professional, authoritative, data-driven; active voice; concise."

3. **Split the outline** into section jobs — one per `sections[]` entry, each carrying `_index`, `_total`, `h2`, `h3_list`, `estimated_words`, `note_for_writer`, and the shared `global` block.

4. **Write each section** with the Section-Writer prompt (below). Do them sequentially (or in a small parallel fan-out if using subagents). Each returns raw markdown for that section only — **not** repeating the H2 (the assembler adds it).

5. **Assemble** (the "Assembler" logic):
   ```
   > **{sapo}**              ← lede as blockquote
   ## {h2 of section 1}
   {section 1 markdown}
   ## {h2 of section 2}
   {section 2 markdown}
   ...
   ## Câu Hỏi Thường Gặp (FAQ)   ← if faqs present
   ### {q}                        (per faq)
   {answer_points}
   ## Kết Luận / Conclusion       ← if outline had no explicit conclusion section
   {recap + verdict + CTA}
   ```

6. **Store** `full_content_markdown` on the row, set status `writing_completed`. Also write it to `plans/marketing/<site>/articles/<slug>.md`.

## Section-Writer prompt

```
### ROLE
You are a Senior SEO Copywriter writing Part {_index} of {_total} of a
comprehensive, high-ranking article.

### GLOBAL CONTEXT
- Article Title (H1): {global.h1}
- Target Keyword: {global.keyword}
- Tone & Voice: {global.tone}

### SECTION ASSIGNMENT — write ONLY this section
- Heading (H2): {h2}
- Sub-topics (H3): {h3_list}
- Word target: ~{estimated_words}
- Specific instructions: {note_for_writer}

### WRITING RULES (STRICT)
1. FORMAT: raw Markdown. Start immediately with the body — do NOT repeat the H2
   (the system adds it). Use ### for H3. Use **bold** for entities/key metrics.
   Use lists frequently (scannability).
2. LANGUAGE: {language}.
3. TRUTH-ONLY (CRITICAL):
   - No placeholder names ("Shop A", "Street X", "Company Y") — ever.
   - If real data (names/addresses/prices) is in the instructions → weave it in.
   - If NOT → write the general/analytical form ("Garden cafés in this district
     typically feature…"), never invent specifics.
   - No meta-talk about the content-creation process.
4. ANTI-FLUFF (STRICT):
   - No generic openers ("Nowadays…", "As we all know…"). Open on substance.
   - Active voice. Specifics (numbers, temps, durations, named techniques) over
     vague adjectives ("very", "amazing", "wonderful").

### CONCLUSION HANDLING
If this section is the Conclusion ("Kết luận" / "Lời kết"):
1. Recap the 2–3 strongest points from the article.
2. Give a clear verdict/recommendation (who should do/use what).
3. End with a specific CTA (not "hope this helped").

### IMAGE PLACEMENT (CRITICAL)
At the very END of the section, append ONE image placeholder:
1. Pick the most specific noun/phrase for THIS section's content.
2. Slugify: unaccented lowercase, spaces → hyphens. e.g. "Cách ủ cà phê" → cach-u-ca-phe
3. Output exactly: [[IMAGE_REQUEST:keyword-slug]]

### OUTPUT
Write the section now.
```

## Notes

- Uses [[seo-content]] for the E-E-A-T quality bar (original insight, expertise signals).
- The `[[IMAGE_REQUEST:slug]]` tags are consumed in Stage 4 — leave them in place.
- Keep sections independent: never reference "as we saw above" across sections (they're written in isolation; cross-refs may be wrong). The assembler handles ordering.
- If the assembled draft violates a truth-only rule (spotted placeholder, invented stat) → rewrite just that section, don't ship it.
- Word count is a target, not a floor to pad — a tight 250-word section beats a fluffed 400.
