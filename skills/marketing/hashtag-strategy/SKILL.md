---
name: hashtag-strategy
description: Hashtag and social discoverability strategy for 2026 — sets the keyword/social-SEO layer first (caption, on-screen text, spoken audio), then a tight per-platform tag set within caps, favoring niche and mid-tier tags over mega-tags, plus branded and campaign hashtag design. Use when the user says "hashtags", "what hashtags should I use", "how many hashtags", "hashtag strategy", "help me get discovered", "do hashtags still work", "are hashtags dead", "hashtags for Instagram/TikTok/LinkedIn", or asks how to tag a post. Corrects the outdated "30 hashtags to go viral" playbook — tags categorize and aid search; they are not a reach hack.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Hashtag Strategy

> The most valuable thing this skill does is correct an outdated belief. Hashtags categorize a post and aid search. They do not multiply reach, and no number of them will carry a weak post.

## When this skill activates

**Implicit:** the task involves hashtags, tagging a post, social discoverability, or "why isn't anyone finding our posts".
**Explicit:** "Use the hashtag-strategy skill to [task]."
**Routed from:**
- `/mk:content social` — primary route (skills: `social-content`, `hashtag-strategy`)
- [[facebook-strategy]] — the social-SEO keyword layer inside the REACH framework's "Anchor" step
- `.claude/workflows/marketing-workflow.md` Phase 8 (promote / distribution)

## Scope

Covers:
- The keyword and social-SEO layer — caption, on-screen text, spoken audio — which is the real discovery lever.
- Per-platform tag counts, caps, and the actual mechanic behind each.
- Tag types, research, and vetting before use.
- Branded and campaign hashtag design — the one place hashtags still pull real weight.
- Rotating sets rather than pasting one identical block.

Does NOT cover:
- Writing the caption or script itself → [[social-content]], [[copywriting]].
- Website and AI-search SEO → [[seo-content]], [[seo-geo]].
- Platform strategy → [[facebook-strategy]].
- Paid targeting → [[ads]].

## Why this skill exists

In 2026, platforms understand content directly — captions, on-screen text, audio, visuals, and how people
engage — so tags now mostly **categorize** a post and **aid search**. Instagram removed hashtag-following
in 2024 and **caps hashtags at 5** as of 2025; its own head has said plainly that more tags do not mean
more reach.

So this skill does two jobs, in order:

1. **The keyword / social-SEO layer first** — the real discovery lever. Platforms are search engines now,
   and they index captions, on-screen text, and spoken audio.
2. **A tight, relevant hashtag set** on top — per platform, within caps, niche over generic — plus branded
   and campaign tags where community applies.

Full reasoning: `references/the-2026-reality.md`.

> **Platform caps and behaviors change without notice.** Every count in this skill is dated 2026 — re-verify
> quarterly before shipping a set, and label anything unverified.

## Step 0 — Read the foundation and the actual post

Load **`plans/marketing-context.md`** ([[product-marketing]]) and the audience picture ([[customer-research]]),
then look at **the actual content being tagged**. Tags must match real content and the audience's real
searches. A tag set written without reading the post is guesswork.

## Step 1 — Set the keyword / social-SEO layer (the real lever)

Pick the **primary keyword** — how the audience actually searches — plus a couple of variations, and place
them where platforms index:

- **Caption, front-loaded.** The first ~80 characters carry most of the weight.
- **On-screen text** for Reels, TikTok, and Shorts.
- **Spoken audio** in video — say the keyword aloud. On TikTok the "triple mention" (say it, show it,
  caption it) is the core ranking move.

This does more for discovery than any tag. Do not skip it to get to the hashtags.

## Step 2 — Pick a tight, relevant set per platform

Per `references/platform-playbook.md`: Instagram 3–5 (hard cap 5), TikTok 3–5 treated as keywords,
LinkedIn 3–5 specific, X 0–2, Threads 1, Facebook 1–2, Pinterest and YouTube keyword-led.

Favor **mid-tier and niche tags (~10K–500K posts)** over mega-tags. Mix topic, niche/community, and
sometimes location or branded. **Vet each tag on its own page before using it** — see
`references/research-and-types.md`.

## Step 3 — Add branded and campaign tags where they apply

For community, UGC, and tracking, design a **branded** tag (ongoing) or a **campaign** tag (time-bound):
short, unique, unused, typo-safe, on-brand, and promoted in the bio, caption, and CTA. This is the one
place hashtags still earn their keep.

## Step 4 — Rotate, place, publish

- Build **2–4 reusable sets per content pillar** and rotate by what each post is actually about. Do not
  paste one identical block.
- **Placement:** in the caption, which is best for search on most platforms.
- **Publish:** hand the post and its tags to whoever posts. Respect the **Instagram 5-cap** so the post is
  not blocked or trimmed.

## Quality bar — self-check

- Did I lead with the **keyword and SEO layer**, not the hashtags?
- Is the tag set **tight, relevant, mid-tier or niche**, and **within the platform's cap**?
- Is it **per-platform**, not one block pasted everywhere?
- Did I avoid **generic mega-tags**, `#fyp`, and 30-tag dumps?
- Did I add a **branded or campaign tag** where community or UGC applies?
- Are sets **rotated**, and is the expectation set **honestly** — categorize and search, not reach?
- Did I avoid claiming performance data that nobody has pulled?

## Edge cases and pushback

- **"Give me 30 to go viral"** → push back. More tags do not mean more reach, Instagram caps at 5, and the
  redirect is keywords plus content plus engagement. Then deliver a tight set anyway.
- **"Add #fyp #viral #explore"** → decline the generic mega-tags. `#fyp` does not affect the For You Page.
  Offer niche and mid-tier alternatives.
- **"Use the same block on every post"** → rotate relevant sets. Frame the shadowban claim accurately: it
  is unconfirmed, but relevance and rotation still win.
- **"Which hashtags perform best for us?"** → there is no analytics surface here. Point to native
  per-post insight on reach from hashtags, or qualitative review.
- **Wrong platform** → do not tag X like Instagram. Match the playbook.
- **Regulated or sensitive niche** → avoid tags implying unverifiable claims; carry the brand guardrails
  from `plans/marketing-context.md`.

## Output

- `plans/marketing/<campaign>/hashtag-strategy.md` — the keyword layer per pillar, 2–4 rotating tag sets
  per pillar per platform, the branded and campaign tags with their vetting notes, and the placement rules.

## Definition of done

- The keyword and social-SEO layer is set first, with placements named (caption front, on-screen, spoken).
- Tag sets are per-platform, within caps, mid-tier or niche, and matched to the actual post.
- 2–4 rotating sets exist per pillar; no single pasted block.
- A branded or campaign tag is designed and vetted where community or UGC applies.
- Expectations are set honestly: tags categorize and aid search; content, keywords, and engagement drive reach.
- Every platform cap cited carries its 2026 date and a re-verify note.
- No performance claims that nobody measured.

## References

- `references/the-2026-reality.md` — why hashtags are not reach now, what they do, the real levers, and the myths to retire.
- `references/platform-playbook.md` — per-platform counts, caps, and the actual mechanic for each.
- `references/research-and-types.md` — the eight tag types, vetting, rotating sets, and branded/campaign design.
- `references/examples.md` — worked keyword-plus-tag sets per platform, contrasted with the old 30-tag block.
