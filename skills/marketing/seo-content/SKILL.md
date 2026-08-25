---
name: seo-content
description: Content SEO with the E-E-A-T framework — write and score long-form articles for quality, original insight, and author signals. Enforces the truth-only rule (no placeholder entities, no invented stats) and anti-fluff writing. Powers the deep section-by-section writing in the seo-writing pipeline (Stage 3).
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# SEO Content — E-E-A-T Writing & Scoring

> The difference between an article that ranks and one that doesn't is depth and trust, not word count. This skill writes for Experience, Expertise, Authoritativeness, Trust — and rejects the generic-AI-prose that Google's helpful-content system demotes.

## When this skill activates

**Implicit:** "write an SEO article", "improve this content's E-E-A-T", "score this article for quality", "make this content rank".
**Explicit:** "Use the seo-content skill to [task]."
**Routed from:** [[seo-writing]] Stage 3, `/mk:content blog`, `/mk:seo` content actions.

## Scope

Covers:
- Deep, section-by-section article writing (the quality lever vs. one-shot prompts).
- E-E-A-T scoring + gap-closing on existing content.
- The truth-only rule + anti-fluff enforcement.
- Original-insight and author-signal requirements.

Does NOT cover:
- Outline/brief creation → [[seo-content-brief]].
- Meta tags, slug, density check → [[seo-writing]] Stage 4.
- AI-search structuring → [[seo-geo]].

## Deep-write, not one-shot

The core method (from the seo-writing pipeline): **write one H2 section at a time**, injecting global context (H1, keyword, tone) into each. Then assemble. Why it wins:
- Each section gets full model attention → stays specific, avoids drift.
- Sections don't dilute each other → no "we already said this" padding.
- A weak section can be rewritten in isolation without touching the rest.

The section prompt + assembler live in `references/stage-3-write.md` of [[seo-writing]].

## Truth-only rule (non-negotiable)

1. **No placeholder entities** — never "Shop A", "Street X", "Company Y". No real data → write the general/analytical form.
2. **No invented metrics** — cite a source or mark `[NEEDS DATA]`. Never fabricate a percentage, date, or case-study number.
3. **No meta-talk** — don't narrate the writing ("in this article…"). State the value.

## Anti-fluff rules

- **No generic openers** — kill "Nowadays…", "In today's world…", "As we all know…". Open on substance.
- **Active voice.** "The manual technique preserves the aroma" > "The aroma is preserved".
- **Specifics over adjectives** — numbers, temperatures, durations, named techniques instead of "very good / amazing / wonderful".
- **Scannable** — bold entities/metrics, use lists, short paragraphs.

## E-E-A-T scoring rubric

Score existing or drafted content 0–2 per pillar; anything scoring 0 is a rewrite target:

| Pillar | 0 (fail) | 2 (pass) |
|---|---|---|
| **Experience** | Generic, could be written by anyone | First-hand test/process/observation present |
| **Expertise** | Vague, wrong terms | Correct terminology, named techniques, depth |
| **Authoritativeness** | No sources, no original data | Cites authorities, adds original insight/data |
| **Trust** | No author, no date, unsupported claims | Credentialed author, visible date, every claim supported |

## Key concepts

- **Helpful-content signal** — Google rewards content written for people, demotes content written for search engines. Depth + originality + trust are the proxies.
- **Original insight** — the one thing the article says that the competitors don't. Without it, the article is a summary of the SERP, not a reason to rank.
- **Information gain** — each section should add something not already obvious from the H2. Sections that only restate the heading are cut.

## Output

- The article body markdown → `plans/marketing/<site>/articles/<slug>.md`.
- Or an E-E-A-T score report + rewrite recommendations for existing content.

## Cross-references

- `plans/marketing-context.md` — required hub (brand voice, tone, forbidden words)
- [[seo-writing]] — the full pipeline; this skill powers Stage 3 (and the Stage-4 truth-only re-check)
- [[seo-content-brief]] — provides the outline this skill writes to
- [[seo-geo]] — structure the same content for AI-search citation
- `.claude/workflows/marketing-rules.md` — §2 (no fluff/no hallucination), §3 (E-E-A-T gate), §7 (anti-patterns)

## Provenance

Imported from `AgriciDaniel/claude-seo` and adapted for KitForge. The section-writer method + truth-only/anti-fluff rules are the seo-writing pipeline's Stage 3, preserved verbatim.
