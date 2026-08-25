# SEO Image Presets

Pre-configured presets for common SEO image use cases. These map to the preset
format in `references/presets.md`, and are the concrete defaults behind the
"SEO use-case → generation parameters" table in `SKILL.md`.

## Preset Templates

### og-default — Standard OG/Social Preview

```json
{
  "name": "og-default",
  "description": "Clean, professional OG image for social sharing",
  "aspect_ratio": "16:9",
  "resolution": "1K",
  "domain_mode": "Product",
  "style": {
    "colors": ["#FFFFFF", "#F5F5F5"],
    "mood": "Professional, clean, trustworthy",
    "lighting": "Bright, even studio lighting with soft shadows",
    "typography": "Modern sans-serif if text needed"
  },
  "post_processing": "magick output.png -resize 1200x630^ -gravity center -extent 1200x630 output-og.webp"
}
```

### blog-hero — Widescreen Blog Hero Image

```json
{
  "name": "blog-hero",
  "description": "Dramatic widescreen hero for blog posts",
  "aspect_ratio": "16:9",
  "resolution": "2K",
  "domain_mode": "Cinema",
  "style": {
    "colors": ["contextual"],
    "mood": "Dramatic, atmospheric, editorial",
    "lighting": "Golden hour or moody blue hour, directional",
    "typography": "None — image only"
  },
  "post_processing": "magick output.png -quality 85 output-hero.webp"
}
```

### product-white — E-commerce Product Shot

```json
{
  "name": "product-white",
  "description": "Clean white background product photography",
  "aspect_ratio": "4:3",
  "resolution": "2K",
  "domain_mode": "Product",
  "style": {
    "colors": ["#FFFFFF"],
    "mood": "Clean, professional, catalog-ready",
    "lighting": "360-degree soft studio lighting, minimal shadows",
    "typography": "None"
  },
  "prompt_suffix": "Studio product photography, clean white background, professional catalog shot, high resolution",
  "post_processing": "magick output.png -fuzz 5% -transparent white output-transparent.png"
}
```

### social-square — Social Media Square

```json
{
  "name": "social-square",
  "description": "1:1 square image for social media platforms",
  "aspect_ratio": "1:1",
  "resolution": "1K",
  "domain_mode": "UI/Web",
  "style": {
    "colors": ["brand-contextual"],
    "mood": "Engaging, scroll-stopping, platform-native",
    "lighting": "Bright, even, high-contrast",
    "typography": "Bold sans-serif if text needed, under 25 characters"
  }
}
```

### infographic-vertical — Data-Heavy Infographic

```json
{
  "name": "infographic-vertical",
  "description": "Tall vertical infographic for data visualization",
  "aspect_ratio": "2:3",
  "resolution": "4K",
  "domain_mode": "Infographic",
  "style": {
    "colors": ["brand-contextual", "data-visualization palette"],
    "mood": "Informative, structured, authoritative",
    "lighting": "Flat, even, no dramatic shadows",
    "typography": "Clear hierarchy — headline, subheads, body, captions"
  },
  "notes": "Use thinking: high for better text rendering accuracy, if the connected MCP supports it"
}
```

### favicon-mark — Favicon / App Icon

```json
{
  "name": "favicon-mark",
  "description": "Minimal iconic mark for favicon or app icon",
  "aspect_ratio": "1:1",
  "resolution": "512",
  "domain_mode": "Logo",
  "style": {
    "colors": ["2-3 brand colors max"],
    "mood": "Minimal, recognizable, scalable",
    "lighting": "Flat, no shadows",
    "typography": "Single letter or symbol only"
  },
  "post_processing": "magick output.png -resize 32x32 favicon.ico && magick output.png -resize 180x180 apple-touch-icon.png"
}
```

## Creating Custom Presets

If a brand needs its own preset, create it with the same schema as above —
either through the source project's preset manager if it's installed, or as
a plain JSON file (see `references/presets.md`). Custom brand presets override
SEO defaults for colors, mood, and typography; SEO presets still supply the
aspect ratio and resolution defaults unless the user says otherwise.

## Preset Selection Logic

1. If the request names a use case (og, hero, product, …), load the matching SEO preset from this file.
2. If the request names a brand preset, load it (per `references/presets.md`).
3. Brand presets override SEO presets for colors, mood, and typography.
4. SEO presets always provide the aspect ratio and resolution defaults.
