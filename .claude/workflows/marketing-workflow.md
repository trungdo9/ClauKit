# Marketing Workflow (10-phase)

End-to-end marketing campaign pipeline. Linear with 1 parallel track + 1 optimize loop.

**Trigger:** `/mk:campaign <campaign-name>`
**Agent:** `campaign-manager`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign-name>/`

---

## Phase 0 — Setup (one-time, gate)

Verify `plans/marketing-context.md` exists. If absent → hard-fail, direct to `/mk:plan`.
Initialize `plans/marketing/<campaign-name>/` with `README.md` (campaign brief).

## Phase 1 — Research (parallel)

**Track A:** Customer research (interviews, surveys, jobs-to-be-done). Skills: `customer-research`, `market-researcher` agent.
**Track B:** Trends (industry reports, competitor moves, viral content). Skills: `competitor-profiling`, `marketing-ideas`.
*Output:* `research.md` (synthesized findings, ~3-5 key insights).

## Phase 2 — Insights

*Input:* `research.md` (Phase 1).

Synthesize research into 3-5 actionable insights. Each insight: (1) observation, (2) implication, (3) falsifiability check.
*Output:* `insights.md` (5 insights max).

## Phase 3 — Strategy

Define content pillars, channel mix, key messages, success metrics. Aligned with `marketing-context.md` goals.
*Output:* `strategy.md` (1-pager, ≤500 words).

## Phase 4 — Plan

Build execution plan: assets needed, owners (agent/skills), deadlines, dependencies.
*Output:* `plan.md` (table form: asset, channel, owner, due, depends-on).

## Phase 5 — Create (parallel)

*Input:* `plan.md` (Phase 4).

**Track A:** Copy (blog, social, email, ads). Skills: `copywriting`, `copy-editing`, `content-strategy`. SEO articles at scale → delegate to the `seo-writing` pipeline (`/mk:seo plan` → `write`); SEO-led campaigns may run the full `.claude/workflows/seo-workflow.md` loop instead of Phases 5–10 here.
**Track B:** Visuals (images, infographics). Skills: `ai-artist`, `ai-multimodal`.
**Track C:** Video — delegate to `/mk:video` (passes `<campaign-name>` as context). Agent: `video-producer`.
*Output:* `content/`, `visuals/`, `video/` directories.

## Phase 6 — Edit

*Input:* `content/`, `visuals/`, `video/` (Phase 5).

Sequential review (order matters — each track appends to `edits-log.md`, do not overwrite):
1. **Copy review** — brand voice, clarity, concision. Skill: `copy-editing`. Owns: `content/`.
2. **SEO check** — E-E-A-T, keywords, schema. Skills: `seo-content`, `seo-schema`. Owns: headings, meta, schema fields.
3. **CRO check** — value prop, CTA, friction. Load `.claude/workflows/cro-framework.md` (25-point checklist). Skills: `cro`, `signup`. Owns: CTAs, forms, above-fold copy.
*Output:* edits applied in-place, `edits-log.md` (append-only, one section per track).

## Phase 7 — Publish

*Input:* edited assets from Phase 6, `plan.md` (Phase 4).

Deploy to channels. Use automation (MCP wrappers) where possible:
- Blog/website → CMS (manual or MCP, including `mcp-wordpress` if configured)
- Email → `mcp-sendgrid` or `mcp-resend` (with manual fallback)
- Social → Buffer/Hootsuite (manual or MCP)

**Before send:** dedup by content/recipient key (automation-rules R5). Redact PII from `published-log.md` (automation-rules R4).
*Output:* `published-log.md` (URLs, timestamps, per asset — PII-redacted).

## Phase 8 — Promote

*Input:* `published-log.md` (Phase 7).

Paid + influencer amplification:
- Paid ads (Google, Meta, LinkedIn). Skills: `ads`, `ad-creative`.
- Influencer outreach. Skills: `cold-email`, `marketing-ideas`.
- Community engagement (Reddit, Twitter, LinkedIn, niche forums). Skills: `social-content`.
*Output:* `promotion-log.md` (channels, spend, reach).

## Phase 9 — Measure

*Input:* `published-log.md` (Phase 7), targets from `strategy.md` (Phase 3).

Pull metrics. Use MCP wrappers (`mcp-ga4`, `mcp-gsc`) with manual fallback (CSV export).
- Traffic, conversions, CTR, engagement, signups, revenue.
**Redact user-level rows** from GA4/GSC before writing report (automation-rules R4).
*Output:* `metrics-report.md` (vs targets from Phase 3 — aggregated only, no PII).

## Phase 10 — Optimize (loop)

*Input:* `metrics-report.md` (Phase 9), prior `optimize-decisions.md` (if exists — read before deciding to avoid re-deciding).

Analyze results. Identify 1-2 biggest wins/losses.
- Win: scale, document, replicate.
- Loss: diagnose, iterate, or kill.
*Output:* `optimize-decisions.md` (3-5 actions for next cycle).

**Loop exit — ask user:**
> "Phase 9 metrics vs Phase 3 targets: [summary]. Continue to next cycle (Phase 3)? (y/n)"
- `y` → loop back to Phase 3 with `optimize-decisions.md` as input.
- `n` → campaign complete.
- Auto-exit if targets met or budget exhausted (document reason in `optimize-decisions.md`).

---

**Note:** Phase 1 Tracks A + B run in parallel within the phase. Phase 5 Tracks A/B/C run in parallel within the phase. Phase 10 loops back to Phase 3 — user confirms each cycle (ask before looping).

**Conventions:** Each phase output is a markdown file in the campaign dir. Phase 9 metrics + Phase 10 decisions are the only required artifacts for retrospective. Sub-workflows (`/mk:leads`, `/mk:nurture`, `/mk:video`) are orchestrated by this workflow — `<campaign-name>` is passed as context; they do not need to resolve it independently.
