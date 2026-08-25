---
name: seo-images
description: Image SEO — resolve in-article image placeholders into real images with keyword-rich alt text, descriptive filenames, WebP compression, and lazy loading. Handles featured images and image sitemaps. Powers the media stage of the seo-writing pipeline (Stage 4).
allowed-tools: Read, Write, Glob, Grep, Bash
---

# SEO Images — Alt Text, Compression, Placement

> Images are ranking assets and accessibility requirements, not decoration. Every in-body image needs keyword-aware alt text and a descriptive filename; every image needs compression. This skill turns the writer's `[[IMAGE_REQUEST:slug]]` tags into real, optimized media.

## When this skill activates

**Implicit:** "add images to this article", "write alt text", "optimize these images for SEO", "resolve image placeholders".
**Explicit:** "Use the seo-images skill to [task]."
**Routed from:** [[seo-writing]] Stage 4, `/mk:seo` image actions.

## Scope

Covers:
- Resolving `[[IMAGE_REQUEST:slug]]` placeholder tags → real images.
- Alt text (keyword-aware, specific, describes the image).
- Descriptive filenames from slugs.
- Compression (→ WebP), lazy loading, featured-image selection.
- Image sitemap entries.

Does NOT cover:
- Writing the article body → [[seo-content]].
- Actually AI-generating an image (use-case → aspect ratio/resolution/domain-mode mapping, prompt construction, model routing) → [[seo-image-gen]], which in turn sits on [[ai-artist]]'s general prompting technique.

## Placeholder resolution (the Stage-4 job)

The writer (Stage 3) appends one `[[IMAGE_REQUEST:keyword-slug]]` per section. Resolve each:

1. **Extract** every tag: regex `\[\[IMAGE_REQUEST:([a-z0-9-]+)\]\]`.
2. **Source the image** (preference ladder):
   | Option | When | Tool |
   |---|---|---|
   | AI-generate | original imagery | [[seo-image-gen]], prompt = keyword + slug |
   | Stock/API | fast, generic | image API MCP (source pipeline uses a `generate-image/serp` webhook) |
   | Skip | no infra | delete the tag |
3. **Write alt text** — describe the image AND include the section keyword naturally. Never empty alt.
4. **Replace** the tag with `![alt](url)`.
5. **Cleanup sweep** — delete any unresolved tag so a raw `[[IMAGE_REQUEST:...]]` never ships.

## Alt text rules

| Rule | Example |
|---|---|
| Describe what's shown | "Activated-carbon filter cross-section" not "image1" |
| Include the keyword naturally | "…activated carbon water filter…" when relevant |
| Specific, not generic | "barista tamping espresso at 30lb pressure" not "coffee" |
| Never empty, never keyword-stuffed | one natural mention, describing the actual image |

## Optimization checklist

- **Filename** — descriptive, from the slug: `activated-carbon-filter.webp`, not `IMG_2931.jpg`.
- **Format** — WebP (or AVIF) for photos; compress before upload.
- **Dimensions** — right-sized to display; no 4000px hero for a 800px column.
- **Lazy load** — `loading="lazy"` on below-fold images.
- **Featured image** — one hero per article, set as the post's featured image (WordPress) + used for social/OG.

## Key concepts

- **Alt text is dual-purpose** — accessibility (screen readers) first, SEO second. Write for a human who can't see the image; the keyword follows naturally.
- **Filename is a ranking signal** — descriptive filenames help image search; random camera names waste it.
- **Weight is a Core Web Vitals cost** — uncompressed images tank LCP. Compression isn't optional.

## Output

- Optimized images with alt + filenames, embedded in the article markdown (placeholders resolved).
- Featured image set for the post.
- Image-sitemap entries where applicable.

## Cross-references

- [[seo-writing]] — Stage 4 consumes this to resolve placeholders
- [[seo-content]] — writer emits the `[[IMAGE_REQUEST:slug]]` tags in Stage 3
- [[seo-image-gen]] — AI-generation option for the source ladder above (SEO use-case mapping, prompt construction); returns a finished image for this skill to alt-text/filename/compress
- [[seo-technical]] — Core Web Vitals (image weight impacts LCP)
- `.claude/workflows/marketing-rules.md` — content quality rules

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for ClauKit. Placeholder-tag resolution matches the seo-writing pipeline's Stage 4 media flow.
