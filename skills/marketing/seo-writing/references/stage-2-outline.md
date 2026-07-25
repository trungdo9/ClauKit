# Stage 2 — Competitor Analysis & Outline

**Goal:** for a `new` keyword, pull the live SERP, filter to *real content competitors*, extract their skeletons, run a two-pass analysis (Strategist → Outline Creator), and produce a gap-closing outline. Create a `content_production` row with `competitor_analysis` + `competitor_urls` + `outline`, status `outline_ready`.

**Entry:** next `new` keyword row (+ `site`). **Exit:** `content_production` row, status `outline_ready`; keyword row marked `done` (article state now lives in `content_production`).

## Steps

1. **Pick the keyword.** Get the next `new` row from the Keywords table for this `site`. Read its `keyword`, `seo_title`, `search_intent`, `content_angle`.

2. **Fetch the SERP — top 10 organic.** Locale-aware (source: SerpAPI `gl=vn, hl=vi, num=10`; ladder + custom-proxy option in `references/research-tools.md`).

3. **Filter to clean competitor URLs.** Not every SERP result is a competitor — marketplaces, social and category pages pollute the analysis. Apply the filter below, keep the **top 5** clean URLs.

4. **Extract their skeletons.** For each clean URL, fetch (skip-on-error — a dead page must not kill the batch) and extract: `title`, `h1`, all `h2`/`h3`, `meta_description`, and `word_count` (whitespace-split of body text). Use WebFetch (Firecrawl/Jina for JS-heavy pages). Only headings + counts go into the prompts — never full bodies (token saver).

5. **Pass 1 — Analyst** (prompt below): the **top 3** skeletons → a strategy report in markdown (gaps, angle, word target = competitor average +20–30%, SEO rules). No outline yet — strategy only.

6. **Pass 2 — Outline Creator** (prompt below): the Analyst report → strict-JSON outline (H1, sapo, 6–10 H2 sections, FAQs, mandatory conclusion). Parse; invalid JSON → one retry, then `error`.

7. **Persist:**
   - `content_production` row: `keyword_id`, `title` = `outline.h1`, `competitor_analysis` (the Pass-1 markdown), `competitor_urls`, `outline` (jsonb / brief), `site`, `status = 'outline_ready'`.
   - Write the brief to `plans/marketing/<site>/briefs/<slug>.brief.md` (analysis + outline — human review + re-write audit; Stage 3 injects the analysis as context).
   - Keyword row: `status = 'done'`.

## URL filter (ported verbatim from the source)

Reject a URL when any of:

| Rule | Values |
|---|---|
| Not http(s) | — |
| **Domain blacklist** — marketplaces & social | `shopee.vn`, `tiki.vn`, `lazada.vn`, `sendo.vn`, `amazon.com`, `ebay.com`, `alibaba.com`, `youtube.com`, `facebook.com`, `tiktok.com`, `instagram.com`, `pinterest.com` |
| **Path patterns** — category/shop pages, not articles | `/danh-muc/`, `/category/`, `/cua-hang/`, `/shop/`, `/cart`, `/checkout`, `?sort=`, `?filter=`, `/tag/`, `/tags/` |

Defaults are VN-market (from the source); extend per market from `marketing-context.md`. Big retailers (e.g. `dienmayxanh.com`, `thegioididong.com`) are *optional* blacklist — they're real SERP competitors but rarely beatable article templates; source leaves them commented out. The pattern filter is heuristic — drop it if it's rejecting valid articles.

## Pass 1 — Analyst prompt (strategy, no outline)

```
### ROLE
You are a Senior SEO Strategist & Data Analyst specialized in the "Skyscraper
Technique". Audit the top-ranking competitors and define a winning content
strategy to outrank them. You DO NOT write the article or the outline —
STRATEGIC DIRECTION only.

### INPUT
- Target keyword: "{keyword}"  |  Search intent: {search_intent}
- Competitor data (top 3): for each — Title, Length (words), H2 list.

### INSTRUCTIONS
1. Reason internally in English; FINAL OUTPUT in {language}.
2. Gap analysis — missing semantic entities, shallow H2 sections, unmet intent.
3. Word target — average of the top 3, then add 20–30%.

### OUTPUT (MARKDOWN ONLY — no filler, start at the first header)
## 1. Competitor Analysis
- Average length: [avg] words
- Shared weaknesses (content gaps): [3 specific gaps — missing sub-topics,
  shallow depth / outdated data, poor structure]
- Opportunities to win: [actionable — e.g. comparison table, step-by-step, deeper X]
## 2. Content Strategy
- Angle: [the USP — e.g. Ultimate Guide vs Honest Review]
- Persona: [target reader + their pain points]
- Tone & voice: professional, objective, authoritative ("we"/"chúng tôi")
## 3. SEO Rules
- Target word count: [avg + 25%] words
- Keyword density: 1.5%–2.5%
- Mandatory keyword placement: H1, sapo (first 100 words), ≥1 H2, conclusion
- Formatting: bold the main keyword in the sapo; bullets for lists
```

## Pass 2 — Outline Creator prompt (strict JSON)

```
### ROLE
Senior Content Architect (SEO Skyscraper). Translate the Analyst strategy into
a structural blueprint that will be more comprehensive than any competitor.

### INPUT
- Target keyword: "{keyword}"
- Analyst strategy & gaps: {pass-1 markdown}

### RULES
1. H1 (STRICT): must contain the EXACT keyword phrase — no reordering, no
   splitting. Format: [Keyword] + [Hook/Benefit].
   ❌ "Ứng dụng y tế của than hoạt tính"  ✅ "Than hoạt tính y tế: Công dụng và
   Hướng dẫn an toàn" (keyword = "Than hoạt tính y tế")
2. Depth: 6–10 H2 sections (excluding intro/conclusion). You MUST add H2s that
   close the Analyst's identified gaps.
3. Sapo: <150 words, main keyword **bolded** in the first sentence, open on the
   reader's pain point.
4. estimated_words: a bare integer per section (300, not "300"/[300]).
   note_for_writer: extremely specific ("compare X vs Y", "cite Analyst data").
5. Conclusion object is MANDATORY: recap + verdict + CTA, ~150 words.
6. TRUTH-ONLY: zero fake entities ("Quán A", "Công ty X", "123 Đường ABC").
   Real names only if present in input; else instruct the writer to use general
   categories / industry norms.
7. Output in {language}.

### OUTPUT — a single valid JSON object. No markdown fences, no wrapper key.
{
  "h1": "...", "sapo": "...",
  "sections": [ { "h2": "...", "h3_list": ["..."], "estimated_words": 300,
                  "note_for_writer": "..." } ],
  "faqs": [ { "question": "...", "answer_points": "..." } ],
  "conclusion": { "heading": "...", "summary_points": ["...","..."],
                  "cta_text": "...", "estimated_words": 150 }
}
```

## Notes

- **Two passes, not one.** The source pipeline splits Analyst → Outline Creator deliberately: strategy quality drops when the model is simultaneously forced into strict JSON. The Pass-1 report is also *persisted* (`competitor_analysis`) as an audit trail — humans can check the reasoning behind the outline (the source pipeline stores it but does not feed it into the writing stage; the outline's `note_for_writer` fields carry the strategy forward).
- This stage is where you **beat**, not match, the competition — if the outline is only as deep as the best competitor, the article won't move. The gap-filling H2s are mandatory, not advisory.
- Uses [[seo-content-brief]] for E-E-A-T requirements (author signal, sources, original insight).
- No body content here — only the skeleton. Depth comes from Stage 3's section-by-section writing.
- Competitors unfetchable (paywall/blocked/JS)? Fall back down the fetch ladder; if <3 skeletons remain, use what exists and mark the brief `[competitors unverified: N/3]`. Never fabricate competitor data.
