---
description: SEO operations — audit/keywords/ai/programmatic/schema via the claude-seo engine, plan/write for the article-production pipeline (seo-writing), campaign for the closed-loop SEO campaign (baseline → plan → write → publish → measure → optimize)
argument-hint: audit|keywords|ai|programmatic|schema|plan|write|campaign <target>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: audit)
REST: $2..$n (action-specific arguments)

## Workflow

For **audit / keywords / ai / programmatic / schema** — activate the `seo` skill (.claude/skills/marketing/seo/SKILL.md), the claude-seo orchestrator. It dispatches sub-skills in parallel based on industry detection.

For **plan / write** — activate the `seo-writer` agent + `seo-writing` skill (.claude/skills/marketing/seo-writing/SKILL.md) — the 6-stage article-production pipeline (strategy → outline → write → optimize → media → publish). Default publishing is DRAFT.

For **campaign** — load `.claude/workflows/seo-workflow.md` and drive the full 7-phase closed loop end-to-end (baseline → plan → write → publish → distribute → measure → optimize loop). Wraps plan/write with a metrics baseline + refresh cycle.

### Actions

- **`audit`** — Full SEO audit (technical + content + backlinks + schema). Target may be a URL, OR a live WordPress post (`wp:<id>` or a WP URL) — fetched read-only via REST then analyzed.
  - skills: `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`; + `wordpress-rest` (when target is a WP post — fetch live content via REST before analysis)
  - WP flow (read-only): preflight `GET /wp-json/` → `GET /wp-json/wp/v2/posts/<id>?context=edit` (or resolve slug from URL) → normalize {title, content, excerpt, Yoast/RankMath meta} → run claude-seo analysis. No writes during audit.
- **`keywords`** — Keyword research with SERP analysis + content brief
  - skills: `seo-content-brief`, `seo-cluster`
- **`ai`** — AI-search optimization (GEO — ChatGPT, Perplexity, Claude citations)
  - skills: `seo-geo`
- **`programmatic`** — Programmatic SEO — template pages at scale
  - skills: `seo-programmatic`
- **`schema`** — JSON-LD schema generation + validation
  - skills: `seo-schema`
- **`plan`** — Article-production PLAN — seed keyword (or existing site) → topic cluster + prioritized, gap-analyzed writing backlog. Stops for human review before any writing. For an existing WordPress site, runs the inventory→audit→cluster→prioritize playbook.
  - agent: `seo-writer`; skills: `seo-writing`, `seo-cluster`, `seo-content-brief`, `seo-plan`; `seo-technical` + `wordpress-rest` (read-only inventory) for existing sites
  - args: `<seed-keyword>` or `wp:site` (existing WP site); flags: `--limit N` (cluster size), `--store local|supabase`
  - output: `plans/marketing/<site>/pipeline.md` (the write plan) + `briefs/` + `inventory.md` (existing sites)
- **`write`** — Run the article pipeline — outline → deep section-by-section writing → on-page optimization + media → internal linking. Draft-default; live publish requires explicit `--publish` + confirmation.
  - agent: `seo-writer`; skills: `seo-writing`, `seo-content-brief`, `seo-content`, `seo-images`, `seo-schema`, `seo-geo`, `wordpress-rest`
  - args: `<content-id|slug>` (single) or `--batch N` (next N backlog rows); flags: `--publish` (live, gated), `--store local|supabase`
  - modes: `write-one` (default, single article), `write-batch` (bounded loop), `full` (Stages 1–6 for a seed)
  - output: `plans/marketing/<site>/articles/<slug>.md` → published (draft) post
- **`campaign`** — Closed-loop SEO campaign per `.claude/workflows/seo-workflow.md` — baseline audit + metrics → plan (hard-stop review) → batch write → publish (draft-default) → distribute → measure (GSC/GA4, 2–4 week bake time) → optimize loop (scale / refresh / kill, loops back to write). Ask user before each new cycle.
  - agents: `seo-writer` + `seo-technical` + `campaign-manager`; skills: full `seo-writing` chain + `seo` orchestrator + `mcp-gsc`/`mcp-ga4` (manual CSV fallback)
  - args: `<seed-keyword>` or `wp:site`; flags: `--batch N`, `--publish` (gated), `--store local|supabase`
  - output: `plans/marketing/<site>/{audit-report.md, baseline-metrics.md, pipeline.md, briefs/, articles/, published-log.md, metrics-report.md, optimize-decisions.md}`

## Output

Results written to `plans/marketing/<target>/seo-<action>-report.md`.
For `plan`/`write`: `plans/marketing/<site>/{pipeline.md, briefs/, articles/}`.

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- WordPress audit: read-only (GET). Credentials via env only (`WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`). No writes during audit.
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`, `.claude/skills/integrations/wordpress-rest/SKILL.md`.

## Examples

```
audit|keywords|ai|programmatic|schema|plan|write <example-target>
audit wp:123                            # audit a live WordPress post by id
audit https://example.com/my-article/   # audit a live WP article by URL
plan "máy lọc nước" --limit 5           # seed keyword → cluster + write backlog (stops for review)
plan wp:example.com                     # existing WP site → inventory + triage + gap plan
write --batch 3                         # write the next 3 backlog articles (draft)
write may-loc-nuoc --publish            # write + publish one article live (after confirmation)
campaign "máy lọc nước"                 # full closed loop: baseline → plan → write → publish → measure → optimize
campaign wp:example.com --batch 3       # existing WP site campaign, 3 articles per write batch
```
