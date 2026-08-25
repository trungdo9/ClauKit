---
name: social-content
description: Write and optimize platform-native social posts — LinkedIn posts and document carousels, X threads, Instagram carousels and Reels, TikTok and Shorts scripts, hooks, hashtags, and character limits. Use for "LinkedIn post", "Twitter thread", "tweet ideas", "carousel", "slide-by-slide", "Reel", "Shorts", "TikTok video", "video hook", "short-form video script", "repurpose this article/podcast/webinar into social", "what should I post", "social listening", "brand mentions", "top posts to comment on", "find people asking for", "grow my following". Pillars, calendars, and channel mix belong to content-strategy; paid ad creative to ad-creative.
allowed-tools: Read, Write, Glob, Grep
---

# Social Content — Platform-Native Posts, Hooks, and Repurposing

> The same idea dies on LinkedIn and lands on TikTok depending on nothing but its first line and its shape. This skill writes the post, not the plan — hooks that survive the truncation point, threads and carousels built to earn the next tap, and one long-form piece cut into a fortnight of platform-native posts.

## When this skill activates

**Implicit:** "write me a LinkedIn post about this", "turn this article into a thread", "script a Reel for the new feature", "we published the guide — now promote it", "give me the 10 posts worth commenting on today", "what hashtags should this use".
**Explicit:** "Use the social-content skill to [task]."
**Routed from:** `/mk:content social` (with [[copywriting]]); the `content-strategist` agent; `.claude/workflows/seo-workflow.md` Phase 5 (repurpose a published article to social); `.claude/workflows/video-workflow.md` Phase 6 (distribute a finished video per platform, with the `video-producer` agent); `.claude/workflows/marketing-workflow.md` Phase 8 (community engagement); [[launch]] for launch-day posts.

## Scope

Covers:
- **Writing the post** — hooks, body structure, and CTA for LinkedIn, X, Instagram, TikTok, Facebook, YouTube Shorts, Threads.
- **Format construction** — thread architecture, carousel and LinkedIn document-post frameworks, Reel/Short scripts with timed beats.
- **Platform constraints** — character counts, truncation points, hashtag counts and placement, link handling per platform.
- **Repurposing execution** — published article, podcast, video, webinar, or newsletter into platform-native cuts.
- **Posting cadence and batching** — per-platform rhythm, queue management, schedule-vs-live decisions.
- **Listening and engagement triage** — scoring which posts to comment on, drafting the comments.
- **Reverse-engineering** — extracting hook, format, and CTA patterns from what already performs in the niche.
- **Post-level measurement** — which metrics judge a post, and what to change when one fails.

Does NOT cover — the deliberate boundaries:
- Content pillars, the editorial calendar, channel mix, and distribution planning → [[content-strategy]]. That skill decides *what the brand talks about, where, and when*; this one writes *the actual post* once that is decided.
- General persuasive copy — landing pages, headlines, long-form sales copy → [[copywriting]]. This skill is the platform-native layer on top of it.
- Final voice and grammar polish → [[copy-editing]].
- Paid social — ad copy, ad creative concepts, UGC ad scripts, ad specs → [[ad-creative]]; targeting and budgets → [[ads]].
- Video production beyond the script — voiceover, AI visuals, editing, render → the `/mk:video` pipeline and the `video-producer` agent.
- Launch-day sequencing across channels → [[launch]]. Email distribution of the same content → [[emails]].
- Structured competitor tracking → [[competitor-profiling]]; voice-of-customer interview mining → [[customer-research]].
- Analytics instrumentation and attribution → [[analytics]].

## Before writing

Read `plans/marketing-context.md` first — ICP, positioning, brand voice, forbidden words. Ask only for what it does not cover:

1. **Platform(s)** — which, and is this one post or a multi-platform set?
2. **Goal** — awareness, engagement, traffic, leads, community. What action should the reader take?
3. **Identity** — personal brand, company brand, or both? They tolerate different levels of first-person.
4. **Source material** — is there an article, transcript, launch, or data point to build from, or is this from scratch?
5. **What has worked** — past top performers, if any. They beat every template in this skill.

## Platform quick reference

| Platform | Best for | Cadence | Native format |
|----------|----------|---------|---------------|
| LinkedIn | B2B, thought leadership | 3-5x/week | Text post, document carousel |
| Twitter/X | Tech, real-time, community | 3-10x/day incl. replies | Threads, short takes |
| Instagram | Visual brands, lifestyle | 1-2 posts + Stories daily | Reels, carousels |
| TikTok | Awareness, younger audiences | 1-4x/day | Short-form video |
| Facebook | Communities, local, Groups | 1-2x/day | Groups, native video |

Cadence figures are the upstream source's recommendation and a ceiling for most teams — pick what can be sustained, then raise it. Per-platform detail, algorithm behaviour, and what fails on each: [references/platforms.md](references/platforms.md).

## The hook decides everything

The first line is the only thing most people read, and on every platform it is what appears before the truncation cut (LinkedIn ~210 chars, Instagram ~125, TikTok ~150, X the whole post).

| Family | Shape | Use when |
|--------|-------|----------|
| Curiosity | "I was wrong about [belief]." / "The real reason [outcome] isn't what you think." | The insight is counterintuitive |
| Story | "Last week, [unexpected thing] happened." / "3 years ago I [past]. Today [present]." | There is a real personal event |
| Value | "How to [outcome] (without [pain]):" / "[N] [things] that [outcome]:" | The post is a list or how-to |
| Contrarian | "Unpopular opinion: [statement]" / "[Common advice] is wrong. Here's why:" | You will actually defend it in the comments |
| Social proof | "We [result] in [timeframe]. Here's the story:" | The result is real, measured, and yours |

Rules: draft five hooks, keep one. Every bracket holding a number or a claim gets filled from something real — an invented stat in a hook is a fabrication published under the brand's name. Full library and per-platform post templates: [references/post-templates.md](references/post-templates.md).

## Formats

**Threads (X, and long LinkedIn posts by extension).** Post 1 hooks and promises; posts 2-N deliver one idea each; the final post recaps and asks. If a post needs two ideas, split it. Never bury the payoff past post 3 without paying something out first. Links go in the last post, not the first.

**Carousels (Instagram) and document posts (LinkedIn).** Pick the narrative architecture before writing slides — Value-Stack, Problem-Proof, Hack List, Rant Callout, or Demo Walkthrough. Two rules cut across all five: slide 1 is the feed thumbnail and must stop the scroll alone, and every interior slide uses one visual template. Selection table, per-slide copy slots, and the production checklist: [references/carousel-frameworks.md](references/carousel-frameworks.md).

**Short-form video (TikTok, Reels, Shorts).** Three seconds to stop the scroll, and the hook is three simultaneous channels — visual, verbal, and text overlay — all landing in the first second.

```
Problem-Solution (15-30s)      List (30-60s)                Tutorial (30-60s)
[0-3s]   Problem               [0-3s]   "N things that X"   [0-3s]   Show the end result
[3-10s]  Why it matters        [3-50s]  One item / 5-8s     [3-8s]   "Here's how"
[10-25s] The solution          [50-60s] CTA                 [8-50s]  Steps
[25-30s] CTA                                                [50-60s] Result + CTA
```

Subtitles are not optional — most social video is watched muted. Max 2 lines on screen, 3-5 words per line, bold sans-serif with an outline, timed to speech. Hook library, scripting template, audio strategy, and visual patterns: [references/short-form-video.md](references/short-form-video.md).

## Repurposing a published article to social

The routed job from `.claude/workflows/seo-workflow.md` Phase 5. Input: the article at `plans/marketing/<site>/articles/<slug>.md` plus its live URL from `published-log.md`. Output: a platform-native set, plus the post list Phase 5 records in `promotion-log.md`.

**Step 1 — Read the article and extract atoms.** Five to ten self-contained moments: the original insight the article was written around, each framework or numbered list, any real data point, the strongest counterintuitive claim, the concrete example or process walkthrough. Ignore the intro and conclusion — they are transitions, not atoms.

**Step 2 — Map atoms to platforms.**

| Article element | Platform | Cut |
|---|---|---|
| The single original insight | LinkedIn | Text post, article link in the first comment |
| The main framework or numbered list | LinkedIn document post / Instagram carousel | One point per slide, Value-Stack or Hack List |
| The full argument, stepwise | X | Thread, one step per post, link in the last post |
| A surprising data point | X, LinkedIn | Standalone post or quote graphic — cite the source in the post |
| The process or walkthrough section | Reels, Shorts, TikTok | 30-60s tutorial script, end result shown first |
| A contrarian line | X, LinkedIn | Standalone take, written to be argued with |

**Step 3 — Rewrite, do not excerpt.** A pasted paragraph reads as a pasted paragraph. Each post gets its own hook, its own standalone context, and one CTA. The article's H2 is not a hook.

**Step 4 — Handle links per platform.** LinkedIn: first comment. X: final post of the thread. Instagram: bio or Stories. Facebook: expect the reach penalty and decide it is worth it or don't link.

**Step 5 — Schedule across 1-2 weeks.** One article is a fortnight of posts. Publishing every cut on launch day competes with itself and burns the atoms in an afternoon.

**Step 6 — Report back.** Return the post list with platform, scheduled date, and the article URL each points at, so the caller can write `promotion-log.md`. Keep an atom log of what was used, so the same article can be re-cut later from what is left rather than from zero.

Podcast, video, webinar, and newsletter sources follow the same loop with different atom types: [references/repurposing.md](references/repurposing.md).

## Hashtags and limits

Hashtags count against character limits everywhere, and the caps move. Current-as-of-import values, per-platform recommendations, and placement rules: [references/platform-limits.md](references/platform-limits.md) — **verify against the platform before publishing anything that would break on an overrun.** The durable rules: few and precise beats stuffing on Instagram and TikTok; end-of-post beats inline on LinkedIn; 1-2 max on X and Facebook; on YouTube, exceeding the cap makes the platform ignore all of them.

## Cadence, batching, and queue

Weekly batching, roughly 2-3 hours: review the pillars [[content-strategy]] set, draft the week's LinkedIn posts, draft the threads and daily posts, outline the carousel and video ideas, schedule, then leave room for real-time posts.

**Schedule:** core posts, threads, carousels, evergreen content.
**Post live:** commentary on news, replies to trends, anything conversational.

Keep 1-2 weeks queued, review the queue weekly for anything that has aged badly, and leave gaps. A fully-booked queue means nothing spontaneous can ship.

## Engagement and listening

A daily 20-30 minute loop: reply to every comment on your own posts, comment on 5-10 posts from target accounts, share with added insight, and follow up on new connections. Quality comments add an insight, a related experience, a thoughtful question, or a respectful disagreement — never "Great post!".

To decide *which* posts to comment on, use the scored triage loop: pull from target accounts, keywords, and communities; score on ICP fit, intent signal, reach, comment opportunity, and recency; keep the top 10; draft a comment matched to each post's tier. Rubric, curl recipes for Reddit/HN/Bluesky, browser-driven notes for LinkedIn and X, and the source-list template: [references/listening.md](references/listening.md).

## Reverse-engineering what already works

Rather than guessing: identify 10-20 high-engagement creators in the niche, collect their posts, rank by engagement rate, and codify the top 10% into hook, format, and CTA patterns. Then layer the brand's own voice on top and test against your own data. Patterns and vocabulary are fair to take; a creator's specific post, claim, or asset is not, and no borrowed number ever enters your copy. Full six-step framework and the voice principles that keep it from reading as imitation: [references/reverse-engineering.md](references/reverse-engineering.md).

## Measuring a post

| Goal | Judge on |
|------|----------|
| Awareness | Impressions, reach, follower growth rate |
| Engagement | Comments (worth more than likes), shares, saves |
| Video | Watch-time percentage, completion rate |
| Conversion | Link clicks, profile visits, DMs, attributed leads |

Weekly: the top 3 posts and why they worked, the bottom 3 and what they taught, the engagement-rate trend. Fixes: low engagement means test new hooks first, then formats, then timing. Declining reach usually means external links in the post body or a format the platform has stopped favouring. Attribution and instrumentation belong to [[analytics]].

## Key concepts

- **Content atom** — a self-contained moment from a longer piece that works with none of its original context. Repurposing is atom extraction, not summarization.
- **Truncation point** — the character count at which each platform cuts the post with a "more" link. It, not the character cap, is the real headline length.
- **The 3-second rule** — short-form video must land visual, verbal, and text hooks simultaneously in the first second or the scroll continues.
- **Standalone caption** — every repurposed post must make sense to someone who never saw the source. If it needs "as I said above", it is not finished.
- **Open loop** — a claim made on slide 1 or post 1 and proven at the end; it is the mechanism that keeps people swiping or scrolling.
- **Platform-native** — the same idea rewritten into each platform's shape. Identical text cross-posted everywhere is the most common reason distribution underperforms.

## Output

Following `/mk:content`'s declared path (`plans/marketing/<campaign>/content/<asset>.<ext>`):

- `plans/marketing/<campaign>/content/social-<topic>.md` — the post set: one section per platform, each with the final copy, hashtags, link placement, and any asset notes (slide copy, video beats).
- `plans/marketing/<campaign>/content/social-<topic>-<platform>.md` — one file per platform when a batch is large enough that a single file becomes unreadable.
- When repurposing from the SEO pipeline or `marketing-workflow.md` Phase 8: the same post set, plus the post list (platform, date, target URL) returned to the caller for `promotion-log.md`.
- When distributing a finished video (`video-workflow.md` Phase 6): per-platform caption, hashtags, and title/description, returned for `distribution-log.md`.
- When doing listening: a scored top-10 list with drafted comments, inline or written next to the source list at `plans/marketing/listening-sources.md`.

Video scripts handed to `/mk:video` follow that pipeline's paths, not these.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice, forbidden words)
- `.claude/workflows/marketing-rules.md` — quality gates (copy quality, brand voice, no fabricated metrics)
- `.claude/workflows/seo-workflow.md` — Phase 5 routes article repurposing here
- `.claude/workflows/video-workflow.md` — distribution phase routes per-platform publishing here
- [[content-strategy]] — pillars, calendar, channel mix, distribution planning (upstream of this skill)
- [[copywriting]] · [[copy-editing]] — general persuasive copy and final polish
- [[ad-creative]] · [[ads]] — the paid counterpart to everything here
- [[launch]] · [[emails]] — launch-day sequencing and email distribution of the same content
- [[competitor-profiling]] · [[customer-research]] · [[analytics]] — inputs and measurement
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for ClauKit: renamed `social` → `social-content` to match ClauKit's skill directory and every existing cross-reference; ClauKit frontmatter and `/mk:` routing; `plans/marketing-context.md` replacing the upstream `.agents/product-marketing.md` context file; outputs moved under `plans/marketing/<campaign>/content/`; the article-to-social recipe written for `seo-workflow.md` Phase 5. Seven reference files ported (platforms, platform-limits, post-templates, carousel-frameworks, short-form-video, reverse-engineering, listening) plus a new `repurposing.md` carrying the non-article atomization detail. Dropped: the upstream content-pillar framework and weekly content calendar (ClauKit's [[content-strategy]] owns the editorial layer); the `evals/evals.json` harness (no ClauKit equivalent); the standalone `listening-sources-template.md`, folded into `listening.md` and repathed to `plans/marketing/`; the `dev-browser` MCP dependency in the listening workflow, generalized to any configured browser-automation MCP; and pointers to upstream skills ClauKit does not ship (`marketing-psychology`, `public-relations`).
