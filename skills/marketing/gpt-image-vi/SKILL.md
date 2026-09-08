---
name: gpt-image-vi
description: Generate SEO images with OpenAI GPT image (gpt-image-2) — hero images, concept diagrams, process flows, OG images — with first-class support for Vietnamese and other diacritic-heavy scripts. Wraps a batch generation engine with brand presets, an image-classification rule that keeps generated art out of numeric charts, alt-text rules, and idempotent re-runs. Use when an article needs illustrations or diagrams, when replacing stock photography with owned assets, or when batch-generating images across many posts.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# GPT Image VI — SEO Images with Reliable Non-English Text

> Most AI image models mangle diacritics, so teams writing in Vietnamese, Czech, Turkish or Polish fall back to stock photos — and ship articles whose whole value is a framework (Prime Cost, a 2×2 matrix, a one-way kitchen flow) illustrated by a generic photo of a café. This skill turns those frameworks into owned diagrams with correct text.

## When this skill activates

**Implicit:** "generate an image for this post", "draw a process diagram", "replace the stock photos", "make a hero image", "batch-generate images for N posts", "I need diagrams with Vietnamese labels".
**Explicit:** "Use the gpt-image-vi skill to [task]."
**Related:** [[seo-image-gen]] is the broader SEO-asset mapping layer and assumes a Gemini/Nano-Banana MCP; this skill is the concrete OpenAI-backed generator to use when no image MCP is connected. [[seo-images]] owns alt text, filenames and embedding. [[ai-artist]] owns general prompting technique.

---

## 🔴 LAW 1 — CLASSIFY THE IMAGE BEFORE GENERATING

Measured 2026-09-06: `gpt-image-2` renders **label text exactly**, including full Vietnamese diacritics — but **draws geometry approximately**. A request for segments of 32% / 21% / 47% with a threshold line at 65% produced roughly 35 / 24 / 41 with the line near 67%.

| Class | Carries numbers? | Method |
|---|:---:|---|
| **A. Hero / illustration** | No | ✅ GPT image, free rein |
| **B. Concept diagram** — matrices, hierarchies, checklists | No | ✅ GPT image |
| **B′. Process flow** — steps, pipelines, one-way flows | No | ✅ GPT image, preset `flow` |
| **C. Numeric chart** — bar, pie, proportional stack | **Yes** | 🚫 **Never GPT image.** Build deterministic SVG from the real figures |

> 🚫 **A generated image must never be the source of a number.** Readers read proportions *off the picture*, not off the caption — so a chart whose bars disagree with its own labels is fabricated data, however accurate the text is.

## 🔴 LAW 2 — THE MODEL OBEYS THE PROMPT, SO ERRORS ARE THE BRIEF'S

Verified: a prompt placed "Puzzle" in the top-right quadrant (wrong for the Kasavana-Smith matrix, where Puzzle is high-margin / low-popularity). The model rendered it exactly as instructed. It does not correct domain errors for you.

⇒ **Every class B/B′ diagram needs a reviewed data brief before generation.** A wrong brief yields a confidently wrong diagram — the most expensive kind.

## 🔴 LAW 3 — TYPE THE DIACRITICS

The model reproduces your label strings **character for character**, including characters you left out.

Measured in the same batch: a prompt written `"Ton dau ky"` produced an image reading *Ton dau ky*. A prompt written `"Nhận hàng"`, `"Bò kéo cày"`, `"Mức độ bán chạy"` produced all three perfectly accented.

⇒ ✅ **Always type labels with full diacritics.** This is a *silent* failure — the image still looks polished, it is simply misspelled.

## 🔴 LAW 4 — AN EMPTY DIAGRAM IS A USELESS DIAGRAM

Measured: a prompt asking for seven numbered boxes "containing no text, only the numbered circles" produced exactly that — seven empty boxes. Correct to the brief, unusable in an article.

⇒ Every box, step and quadrant needs a **real label**. If the labels aren't decided yet, the brief isn't finished and generation is premature.

## 🔴 LAW 5 — `gpt-image-1` IS DISQUALIFIED

Measured: told *"no text labels"*, `gpt-image-1` invented its own text, and its colour blocks did not encode the described data at all. Use `gpt-image-2` only.

---

## Usage

```bash
# Single image
python3 scripts/gen-image.py single \
  --prompt-file prompt.txt \
  --out path/to/hero.png \
  --preset hero

# Batch — ALWAYS dry-run first
python3 scripts/gen-image.py batch --manifest m.json --dry-run
python3 scripts/gen-image.py batch --manifest m.json --concurrency 4
```

**Manifest format:**
```json
[{"out": "images/<slug>/flow-01.png",
  "preset": "flow",
  "prompt": "A one-way flow diagram with six rounded boxes …"}]
```

### Presets

| Preset | Size | Use for |
|---|---|---|
| `hero` | 1536×1024 | Article lead / featured image |
| `og` | 1536×1024 | Social share image |
| `flow` | 1536×1024 | **Horizontal** process flows and step chains |
| `diagram` | 1024×1024 | **Square** layouts — 2×2 matrices, vertical lists |

> ⚠️ Picking the wrong preset wastes canvas: a six-step horizontal flow on a square frame leaves over half the image empty (observed in the pilot batch).

---

## Writing prompts

**Five-part frame:** `diagram type` → `element count + arrangement` → `EXACT label text` → `shapes` → `prohibitions`.

Three rules that matter most:
1. **Quote every label and say `exactly`.** `The boxes read exactly, in order: "Nhận hàng", "Kho", "Sơ chế"`. Never describe labels indirectly.
2. **State the position of each element** in matrices — top-left, top-right, bottom-left, bottom-right.
3. **Keep numbers out of prompts** except ordinals (1, 2, 3…). If the image needs proportions, it is class C — build SVG instead.

The brand preset (palette, flat-vector style, no watermark) is **appended automatically** to every prompt — don't restate it.

---

## Alt text

| Class | Rule |
|---|---|
| A | Describe the scene and its domain context |
| B/B′ | Describe the diagram's **structure** and name its parts |
| C | Describe the **conclusion**, with the real figures |

🚫 No keyword stuffing. 🚫 Never empty. 🚫 Never "illustrative image".

---

## Safety, cost and reruns

- API key is read from a local `.env`. **Never print it** to logs, files or documentation — record only whether it is present.
- **Idempotent:** existing images are skipped, so re-running a batch costs nothing and creates no duplicates. Overwriting requires `--force`.
- **Sidecar `.json`** beside every image records the full prompt, model, size, tokens and elapsed time — the only way to audit spend and reproduce an asset.
- **Measured cost:** 5,500–7,000 output tokens and 88–105 seconds per image. Price per token varies by account — read it from the provider's billing page rather than assuming.
- **Always `--dry-run` before a large batch, and always hand-review a small pilot batch first.** In the reference pilot, 9 images surfaced two brief-level defects that would otherwise have propagated across hundreds.

## Out of scope

- Writing the article the image illustrates → [[seo-content]]
- Alt-text conventions, filenames, lazy-loading, image sitemaps → [[seo-images]]
- Accurate numeric charts → build deterministic SVG
- Publishing images to a CMS → the relevant CMS skill
