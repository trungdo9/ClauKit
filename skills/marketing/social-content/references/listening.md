# Social Listening & Engagement Triage

How to surface the right posts to engage with each day instead of scrolling an open feed. The output is a short, scored list — "here are the 10 posts worth commenting on today" — plus a drafted comment for each.

**Tooling note:** the curl recipes below need Bash, and browser-driven collection needs a browser-automation MCP. This skill's own tools are Read/Write/Glob/Grep, so run collection through the calling agent (`content-strategist`, `campaign-manager`) or hand the recipes to the user; this skill scores, drafts, and formats what comes back. ClauKit ships no listening automation of its own.

## Contents
- When to use this
- The daily triage loop
- Scoring rubric
- Comment quality tiers
- Sources and curl recipes
- Per-platform notes
- Common workflows
- Source list template

---

## When to Use This

Listening is for **commenting and relationships**, not posting. Typical asks:
- "Give me the top 10 posts I should comment on today"
- "Who's complaining about [competitor] right now?"
- "Find people asking for a tool like mine"
- "Surface posts from my 20 target accounts in the last 24h"
- "What's the conversation around [topic] this week?"

Listening feeds creation — it surfaces angles, objections, and the audience's actual vocabulary — but the deliverable is different. For posting, use the rest of the skill. For structured competitor tracking, that is [[competitor-profiling]]; for interview-grade voice-of-customer mining, [[customer-research]].

---

## The Daily Triage Loop

A repeatable 20-minute loop.

1. **Pull** — fetch new posts from defined sources (target accounts, keywords, subreddits, hashtags).
2. **Filter** — drop anything older than 24h, low signal, or off-topic.
3. **Score** — apply the rubric. Keep the top 10.
4. **Draft** — write a comment matched to each post's tier.
5. **Post** — the user reviews, edits, posts. Never auto-post.
6. **Log** — track what was commented on and what got replies. That log is the dataset.

Output shape:

```
TOP 10 POSTS — <date>

1. [Score 9/10] @author — LinkedIn — 2h ago
   "We just rolled out X and the team is loving it..."
   Why: ICP fit (B2B SaaS, 50-200 employees), buying-intent signal
   Suggested comment: [draft]
   Link: https://...
```

---

## Scoring Rubric

Score 1-10 on each dimension, apply the weight, sum, rank.

| Dimension | What it measures | Weight |
|-----------|------------------|--------|
| ICP fit | Is the author the target customer or an influencer over them? | 2x |
| Intent signal | Are they expressing a problem, asking, or shopping? | 2x |
| Reach potential | Is the post gaining traction? | 1x |
| Comment opportunity | Can you say something genuinely useful, not generic? | 2x |
| Recency | Posted in the last 1-4h (early comments win, especially on LinkedIn) | 1x |

**High-value intent language:**
- "Looking for a tool that does X"
- "Why is [category] so painful?"
- "We just switched from [competitor] because..."
- "Anyone use [competitor] — worth it?"
- Any specific complaint about a known competitor

**Drop if:**
- Author is neither ICP nor influencer
- Post is >24h old with 50+ comments (yours buries)
- Generic motivational or AI-slop post
- Self-promotion thread where comments get no reach
- You cannot add anything beyond "Great post!"

---

## Comment Quality Tiers

Match the comment to the post; don't spend a tier-1 draft on a tier-3 opportunity.

**Tier 1 — Relationship builder** (target accounts, ICP, high intent)
- Add a specific insight or counter-example
- Reference your own experience with real numbers, names, outcomes
- Ask a follow-up that invites a reply
- 2-4 sentences, no link

**Tier 2 — Visibility play** (high-reach post, adjacent topic)
- One sharp insight, one sentence: "Agreed — and the part most miss is [X]"
- 1-2 sentences

**Tier 3 — Light touch** (relationship maintenance)
- Quote one specific line and react to it
- 1 sentence

**Never:** "Great post!", emoji-only, "+1", or the platform-native flattery tics.

---

## Sources and curl recipes

Public JSON endpoints, no auth. Run from Bash, pipe to `jq`; the parsed output feeds the rubric above. Requires `jq` (`apt install jq` / `brew install jq`) and `xmllint` for RSS (`apt install libxml2-utils`).

### Reddit

New posts in a subreddit:
```bash
curl -s -A "listening/1.0" \
  "https://www.reddit.com/r/SaaS/new.json?limit=25" \
  | jq '.data.children[].data | {title, author, url: ("https://reddit.com"+.permalink), score, num_comments, created_utc, selftext: (.selftext | .[0:300])}'
```

Keyword search, last day, newest first:
```bash
curl -s -A "listening/1.0" \
  "https://www.reddit.com/search.json?q=KEYWORD&sort=new&t=day&limit=25" \
  | jq '.data.children[].data | {subreddit, title, url: ("https://reddit.com"+.permalink), author, score, created_utc}'
```

Swap `KEYWORD` for `"alternative to <competitor>"`, `"recommend a <category>"`, competitor names, or the brand name for mentions. Quote multi-word phrases.

### Hacker News (Algolia)

```bash
SINCE=$(($(date +%s) - 86400))
curl -s "https://hn.algolia.com/api/v1/search_by_date?query=KEYWORD&tags=story&numericFilters=created_at_i>${SINCE}" \
  | jq '.hits[] | {title, url, author, points, num_comments, created_at, hn_url: ("https://news.ycombinator.com/item?id="+.objectID)}'
```

Swap `tags=story` for `tags=comment` to catch mentions buried in threads.

### Bluesky

```bash
curl -s "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=KEYWORD&limit=25&sort=latest" \
  | jq '.posts[] | {author: .author.handle, text: .record.text, likes: .likeCount, replies: .replyCount}'
```

### RSS (blogs, podcasts, YouTube channels)

```bash
curl -s "https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID"
curl -s "https://example.com/feed/" | xmllint --xpath "//item[position()<6]" - 2>/dev/null
```

### LinkedIn and X — browser-driven

Neither exposes a useful public API. If a browser-automation MCP with a persistent session is configured (Playwright or equivalent), the user logs in once and the agent can navigate the authenticated view, extract post text, and score it. Without one, the user collects manually and pastes in.

| URL pattern | What it shows |
|-------------|---------------|
| `linkedin.com/in/HANDLE/recent-activity/all/` | One account's recent posts, unfiltered by algorithm |
| `linkedin.com/feed/hashtag/TOPIC/` | Hashtag feed |
| `x.com/HANDLE` | One account's profile |
| `x.com/search?q=QUERY&f=live` | Real-time search (`f=live` = chronological) |
| `x.com/i/lists/LIST_ID` | A curated list — the cleanest source for target accounts |

Rules: never auto-post or auto-comment (bot detection, and the stakes are the brand's account); scroll to load before extracting; the user reviews every draft.

Paid alternatives exist per platform (LinkedIn Sales Navigator saved searches, X Pro columns, and the various engagement tools). Instagram and TikTok have no reliable path — use native saved searches and hashtag follows.

---

## Per-Platform Notes

**LinkedIn** — first-hour comments matter most; prioritize posts under 2h old from target accounts. Comments of 5+ words get more reach than reactions. Replying to other commenters puts you in front of their network.

**Twitter/X** — reply within the first 30 minutes on large accounts. Quote-post when adding substantial value, reply when adding a line. Don't pile onto dunks; relationships outlast clout.

**Reddit** — read the subreddit rules first; several ban self-promotion outright. Answer the question before mentioning anything you own, and earn karma in the sub before linking.

**Hacker News** — the quality bar is high and low-effort gets downvoted fast. Founders commenting on their own product's thread are welcome if transparent. Search past discussions of the category; they are often dormant and still ranking.

**Bluesky** — lower volume, high engagement-to-follower ratio, active tech and indie-hacker communities. Custom feeds replace algorithmic search.

---

## Common Workflows

**"Top 10 posts to comment on today"** — pull target-account RSS/saved searches + relevant subreddits + HN last 24h, score, output top 10 with drafted comments.

**"Find people complaining about [competitor]"** — Reddit search sorted new, HN comment search, Bluesky search; score by switching language ("moving from", "alternatives to", "frustrated with").

**"Brand mentions this week"** — Reddit + HN (stories and comments) + Bluesky for brand name and handle; output as reply-needed (yes/no), tone, suggested response.

**"Target-account posts I missed"** — fetch each source's recent posts, filter to 24h, sort by score.

---

## Source List Template

Keep the source list persistent at `plans/marketing/listening-sources.md` so the loop is reproducible. Copy and fill:

```markdown
# Listening Sources

## What we're listening for
Brand / product: [name]
Category: [e.g. "AI writing assistant"]
Goal: [e.g. "find people switching from <competitor>"]

## ICP (used by the scoring rubric)
Role: [founder, head of marketing, ...]
Company stage: [seed to Series B SaaS, 10-200 employees]
Industry: [B2B SaaS, devtools]
Fit signals: [writes about GTM, runs paid ads, recently raised]

## Target accounts (20-50 max)
LinkedIn: [name] — linkedin.com/in/handle
X: [@handle]
Reddit: u/[username]
Bluesky: [handle.bsky.social]
RSS: [name] — https://example.com/feed/
YouTube: [name] — channel ID UCxxxxxxxx

## Intent keywords
High intent: "alternative to [competitor]", "looking for a [category] tool"
Problem language: [the phrases the ICP uses for the pain]
Brand + competitor names: [list]

## Subreddits / communities
r/[sub], [forum], [Slack or Discord]

## Do not engage
[accounts, threads, or topics to stay out of]
```

Pull the ICP and forbidden-word entries from `plans/marketing-context.md` rather than restating them differently here. Keep the file short and current — stale sources are worse than none.
