---
name: preview
description: Create presentations and slide decks (Marp, reveal.js, Quarto) from markdown or notebooks
category: Documentation & Content
status: active
---

# Preview

## Purpose
Transform markdown or notebooks into slide decks (Marp, reveal.js, Quarto). Separates content authoring from presentation design. **Presentations only** — for viewing/serving plain markdown documents as formatted HTML, use the `markdown-novel-viewer` skill (scope split 2026-07-31; the render-markdown half previously duplicated here now lives only there).

## When to Use
- Converting markdown slides for talks, demos, or team presentations
- Creating animated "how-to" visuals (step-by-step with transitions)
- Building interactive notebooks with executable code (Quarto with R/Python)
- Generating PDFs or HTML slides for sharing with non-technical audiences

**Do NOT use when**: Viewing/rendering markdown documents (use `markdown-novel-viewer`), building interactive web apps (use a framework), creating video tutorials (use video editing software), or needing real-time collaboration (use Google Slides/Figma).

## Workflow
1. **Choose tool** — Marp (simple markdown → slides), reveal.js (advanced HTML/CSS control), or Quarto (scientific/data-driven content)
2. **Write markdown** — For Marp: `---` separates slides; for reveal.js: use HTML wrapper; for Quarto: YAML front-matter + markdown
3. **Add transitions** — Include speaker notes, animations, code highlights, and image placements
4. **Preview locally** — Marp CLI, reveal.js dev server, or Quarto preview
5. **Export/deploy** — Output to PDF, HTML, or PowerPoint (Marp, Quarto); host reveal.js on web server

## Key Concepts
### Marp (Markdown Presentation Ecosystem)
Markdown input → HTML/PDF output. Three built-in themes (default, gaia, uncover) or custom CSS. Fastest path from content to slides. Supports inline HTML/CSS for custom styling. Best for: quick talks, team updates, demo recordings.

### Reveal.js (HTML Framework)
Full-featured reveal.js framework with nested slides, auto-animate between similar elements, speaker view (notes + timer), and mobile support. Steeper learning curve but maximum control. Best for: conference talks, interactive demos, complex animations.

### Quarto (Scientific Publishing)
Combines markdown + executable code (R, Python, Julia) + LaTeX equations. Outputs to HTML, PDF, Word, ePub. Built-in figure numbering, cross-references, and citations. Best for: technical reports, data-driven presentations, academic papers.

## Example (Marp)
```markdown
---
marp: true
theme: gaia
---

# Slide 1: Title

## Subtitle

---

# Slide 2: Key Points

- Point A
- Point B

---

<!-- Speaker notes below -->

This is hidden from audience view
```

## Common Pitfalls
- Too much text per slide (practice the 5-7 word rule; make text scannable)
- Ignoring readability (small fonts, low contrast; test from 10ft away)
- Overusing transitions (distracting; save animations for emphasis)
- Forgetting speaker notes (hint: "pause here", "emphasize X"; hidden from audience)
- Mixing tools mid-project (pick one tool and stick with it for consistency)

## References
- [Marp Official Docs](https://marp.app/) — Markdown presentation ecosystem; three themes + custom CSS
- [Reveal.js Documentation](https://revealjs.com/) — HTML presentation framework with auto-animate and speaker view
- [Quarto Official Documentation](https://quarto.org/) — Scientific publishing system supporting R/Python/Julia with code execution
