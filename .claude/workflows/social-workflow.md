# Social Omnichannel Workflow (6-phase)

Omnichannel social media content production and community engagement pipeline across Facebook, YouTube, TikTok/Shorts, Messaging (Zalo/WhatsApp), and LinkedIn.

**Trigger:** `/mk:content social <campaign-name>` or standalone social campaigns
**Agent:** `content-strategist`, `copywriter`, `video-producer`
**Required input:** `plans/marketing-context.md`
**Output dir:** `social/` or `plans/marketing/<campaign-name>/social/`
**Orchestration:** Invoked by `/mk:campaign` Phase 5 Track A or executed standalone.

---

## Phase 0 — Setup & Channel Mapping (gate)

Verify `plans/marketing-context.md` exists. If absent → hard-fail, direct to `/mk:plan`.
Identify active brand channels and target audience segment:
- **B2B (Enterprise / Industrial):** LinkedIn, Facebook Master Page, YouTube Long-form, Zalo OA / Direct Messaging.
- **B2C (Retail / Direct Consumers):** YouTube Shorts, TikTok, Instagram/Facebook Reels, Product Niche Pages.
- **C2C (Peer Community / DIY):** Facebook Groups, Technical Forums, Discussion Threads.

Confirm channel roster and campaign goals with user before proceeding.

## Phase 1 — Angle & Core Asset Selection

Select 1 Master Core Asset (e.g. Technical Whitepaper, Product Pillar, or Case Study).
Identify primary hook, problem statement, core proof (test results, certifications, data), and call-to-action (CTA).
*Output:* `social-brief.md` (Pillar theme, ICP, core evidence, angle per channel).

## Phase 2 — Multi-Format Repurposing Matrix (1-to-N)

Transform the core asset into 5 standard social formats:
1. **Video Long-form (YouTube 8-15 min):** Authority breakdown, lab demo, walkthrough.
2. **Short-form Video (Shorts/TikTok/Reels 45-60s):** Visual punchline, myth-busting, 10s tip.
3. **In-depth Page/Post (Facebook/LinkedIn):** High-value carousel or narrative post with proof assets.
4. **Community Discussion (Group/Forum):** Peer-level prompt, case question, or exchange thread.
5. **Instant Messaging Broadcast (Zalo OA/Newsletter):** Clean, concise summary with direct CTA.
*Output:* `repurposing-matrix.md`.

## Phase 3 — Copywriting & Asset Scripting (parallel)

- **Track A (Visual & Short Video):** Scripts with 3s visual hook, problem, proof, CTA (`shorts-tiktok/`).
- **Track B (Long-form Video):** Scene-by-scene script, timestamps, visual cues (`youtube/scripts/`).
- **Track C (Social Feed & Articles):** Platform-native posts (`fanpages/`, `linkedin/posts/`).
- **Track D (Community & Discussion):** Discussion starter prompts, Q&A scenarios (`community-groups/`).
*Output:* Draft scripts and copy in respective subdirectories.

## Phase 4 — Platform Formatting & Safety Review

Review drafted assets against platform-specific constraints:
1. **Formatting Rules:** Redact or clean raw markdown for platforms that do not support it (e.g. clean `**` for Zalo OA).
2. **Brand Voice:** Verify tone (no disallowed emojis if prohibited by Brand Design System, correct phone and technical metric formatting).
3. **Data Grounding:** Verify all technical claims, pricing, and specs match the single source of truth.
*Output:* `social-edits-log.md` (review checklist signed off).

## Phase 5 — Publishing & Scheduling

Schedule or publish approved assets across target platforms.
- Track post URLs, scheduled dates, asset links, and targeted hashtags.
- Dedup by platform + asset key to prevent double posting.
*Output:* `published-social-log.md` (Platform, URL, timestamp, CTA destination).

## Phase 6 — Community Engagement & Lead Routing

- Monitor post comments, group questions, and direct messages.
- Route high-intent inquiries (pricing, quote requests, project specs) directly to CRM pipeline.
- Moderate community discussions and flag spam or compliance risks.
*Output:* `engagement-report.md` (interactions, qualified leads generated).

---

**Conventions:**
- **Zero Hallucination:** All technical figures and pricing must trace back to the verified knowledge base and CRM data.
- **Idempotency:** Re-running a publishing step updates existing draft/scheduled records without duplication.
- **Privacy:** User comments and lead PII are sanitized before writing to public logs.
