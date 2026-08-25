---
name: seo-drift
description: SEO drift monitoring — baseline a page's SEO-critical elements (title, meta, canonical, robots, headings, schema, OG tags, Core Web Vitals), diff the current state against that baseline, and classify every change CRITICAL/WARNING/INFO. Git for your SEO — catches the regression a redesign or CMS change introduced, before rankings visibly drop.
allowed-tools: Read, Write, Glob, Grep, WebFetch
---

# SEO Drift — Regression Monitoring

> Git for your SEO: capture a baseline of every SEO-critical element on a page, diff it against the current state, and classify what changed by how much traffic it costs.

## When this skill activates

**Implicit:** "did anything break on this page", "SEO regression", "compare SEO before and after", "monitor SEO changes", "deployment check", "why did rankings drop after the redesign/migration", "baseline this page".
**Explicit:** "Use the seo-drift skill to [task]."
**Routed from:** [[seo]] orchestrator for ad-hoc pre/post-deploy checks. Conceptually the on-page cause behind a metrics delta in `.claude/workflows/seo-workflow.md` Phase 6 (Measure) / Phase 7 (Optimize) — that workflow currently reads GSC/GA4 numbers only and has no step that asks "did the markup itself change." Not yet wired in; see Provenance.

## Scope

Covers:
- Baseline capture of on-page SEO elements for one URL.
- Diffing current state vs. the stored baseline; classifying each change CRITICAL / WARNING / INFO.
- History across multiple baselines/comparisons for one URL.
- Pre/post-deploy checks, ongoing monitoring, traffic-drop root-cause triage.

Does NOT cover:
- Ranking/traffic metrics themselves (GSC clicks, GA4 sessions, position) → `seo-workflow.md` Phase 6 Measure. Drift explains *what changed on the page*; Measure explains *what happened to traffic*. Use them together: a WARNING/CRITICAL drift finding is the first thing to check when Measure shows an unexplained drop.
- Fixing a flagged regression → route to the skill named in the finding: [[seo-schema]], [[seo-technical]], [[seo-page]], [[seo-content]].
- Net-new technical/content/schema audits (no prior baseline) → [[seo-technical]], [[seo-content]], [[seo-schema]].
- Keyword ranking movement in the SERP itself → [[seo-plan]] / research-tool tracking, not this skill.

## What a baseline captures

| Element | Field | Where to read it |
|---|---|---|
| Title tag | `title` | `<title>` |
| Meta description | `meta_description` | `<meta name="description">` |
| Canonical URL | `canonical` | `<link rel="canonical">` |
| Robots directives | `meta_robots` | `<meta name="robots">` + `X-Robots-Tag` header |
| H1 headings | `h1` (array) | all `<h1>` in document order |
| H2 headings | `h2` (array) | all `<h2>` in document order |
| H3 headings | `h3` (array) | all `<h3>` in document order |
| JSON-LD schema | `schema` (array) | every `<script type="application/ld+json">` block, parsed |
| Open Graph tags | `open_graph` (dict) | all `<meta property="og:*">` |
| Core Web Vitals | `cwv` (dict) | PageSpeed Insights API / Lighthouse, when available — omit rather than guess if no data source is configured |
| HTTP status code | `status_code` | response status of the fetch |
| HTML content hash | `html_hash` | SHA-256 (or equivalent) over the normalized visible body text |
| Schema content hash | `schema_hash` | SHA-256 over the serialized JSON-LD blocks |

Fetch the page with WebFetch. If CWV data isn't available (no PageSpeed API access configured), store `null` for those fields and skip CWV rules during comparison — never fabricate a score.

## Severity levels

| Level | Meaning | Response time |
|---|---|---|
| **CRITICAL** | SEO-breaking change, likely measurable traffic loss within days | Immediate |
| **WARNING** | Potential impact, needs investigation | Within 1 week |
| **INFO** | Awareness only, may be intentional or even positive | Review at convenience |

## How comparison works

The comparison applies **17 rules across the 3 severity levels above** — one rule per SEO-critical element, each with its own threshold and recommended action. Load `references/comparison-rules.md` for the full rule set. Summary of the CRITICAL tier (the one that needs same-day attention):

| Rule | Trigger |
|---|---|
| Schema/JSON-LD completely removed | Had ≥1 block before, none now |
| Canonical changed or removed | Different value, or had one and now missing |
| Noindex directive added | `meta_robots` now contains "noindex" |
| H1 removed entirely | Had ≥1 H1, now zero |
| H1 text changed >50% | Similarity ratio between old/new first H1 below 0.5 |
| Title tag removed entirely | Had a value, now null/empty |
| HTTP status flipped to error | Was 2xx, now 4xx/5xx |

WARNING and INFO tiers (title/meta text changes, CWV regression >20%, Lighthouse score drop ≥10 pts, OG tags removed, schema content modified, H2 structure changed, general content-hash change) are in the reference file with exact thresholds and actions.

## Procedure

### Baseline
1. Normalize the URL (lowercase scheme/host, strip default ports 80/443, sort query params, drop UTM params, strip trailing slash) — this is the key used to match future comparisons to the right snapshot.
2. Fetch the page with WebFetch.
3. Extract every field in "What a baseline captures" above.
4. Compute the two content hashes.
5. Write the snapshot to `plans/marketing/<site>/seo-drift/baselines/<url-slug>.json`, timestamped. Keep the previous snapshot (rename with its timestamp) rather than overwrite it — that's what makes `history` possible.

### Compare
1. Normalize the URL the same way; load the most recent stored baseline for it (or a specific timestamped one if asked).
2. Fetch the current page state the same way as baseline.
3. Run all 17 rules from `references/comparison-rules.md` against baseline-vs-current.
4. Classify every triggered rule by severity, and produce the fix recommendation + cross-referenced skill from each rule.
5. Append the result to `plans/marketing/<site>/seo-drift/drift-log.md` (date, URL, rules triggered, severities) and produce the comparison report.
6. Do not silently re-baseline. If the user accepts a change as intentional, that's a fresh explicit `baseline` call, not an automatic side effect of `compare`.

### History
Read `plans/marketing/<site>/seo-drift/drift-log.md` plus the list of stored baseline snapshots for the URL and summarize: when each baseline was taken, what each comparison found, and any severity trend (getting worse / stable / resolved).

## Cross-skill integration

When drift is detected, hand off to the skill that owns the fix:

| Finding | Route to |
|---|---|
| Schema removed or modified | [[seo-schema]] — full validation |
| Core Web Vitals regressed | [[seo-technical]] — performance audit |
| Title or meta description changed | [[seo-page]] — content/CTR analysis |
| Canonical changed or removed | [[seo-technical]] — indexability check |
| Noindex added | [[seo-technical]] — crawlability audit |
| H1/heading structure changed | [[seo-content]] — E-E-A-T review |
| OG tags removed | [[seo-page]] — social-sharing analysis |
| Status code changed to error | [[seo-technical]] — full diagnostics |

## Error handling

| Scenario | Action |
|---|---|
| URL unreachable | Report the fetch failure. Do not guess state. Suggest the user verify the URL. |
| No baseline exists for URL | Say so; suggest running `baseline` first. |
| CWV fetch fails / no data source | Store `null` for CWV fields; skip CWV rules for that comparison. |
| Page returns 4xx/5xx | Still capture it as a baseline — status code is itself a tracked field. |
| Multiple baselines exist | Use the most recent unless a specific one is requested. |

## Key concepts

- **Drift, precisely** — an unintended (or unreviewed) change to a page's *on-page SEO markup*: title, meta, canonical, robots, headings, schema, OG tags, CWV. This is distinct from **ranking/content decay**, which is a traffic or position decline over time with no markup change at all — that's a Measure-phase (GSC/GA4) concern, not this skill's.
- **Baseline** — a "known good" snapshot to diff against. Worthless without one; always baseline before a deploy/migration/redesign, not after.
- **Severity, not a single pass/fail** — the same underlying change (e.g., title edited) can be a deliberate CTR experiment (WARNING, monitor) or an accidental CMS default kicking in (should have been CRITICAL if it stripped the title, not edited it). Rules key off *what* changed, not just *that* something changed.
- **URL normalization** — without it, `https://x.com/`, `https://x.com?utm_source=a`, and `http://X.COM` all look like different pages and drift comparisons silently fail to match.

## Output

- `plans/marketing/<site>/seo-drift/baselines/<url-slug>.json` — one snapshot per baseline call (previous ones retained, not overwritten).
- `plans/marketing/<site>/seo-drift/drift-log.md` — running comparison history for the site (used to answer `history`).
- Inline: the comparison report for the current run — triggered rules, old/new values, severity, and which skill to route the fix to.

## Cross-references

- `plans/marketing-context.md` — required hub
- [[seo]] — orchestrator; routes ad-hoc drift checks here
- [[seo-schema]], [[seo-technical]], [[seo-page]], [[seo-content]] — fix owners for specific findings (see Cross-skill integration)
- `.claude/workflows/seo-workflow.md` — Phase 6 (Measure) / Phase 7 (Optimize): natural place to run a `compare` before deciding scale/refresh/kill, not currently wired in
- `.claude/workflows/marketing-rules.md` — content quality rules
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `AgriciDaniel/claude-seo`'s `seo-drift` skill (v2.2.4) and adapted for ClauKit. The source implementation runs as Python scripts (`fetch_page.py`, `parse_html.py`, `pagespeed_check.py`, `drift_baseline.py`/`drift_compare.py`/`drift_history.py`) backed by a local SQLite database (`~/.cache/claude-seo/drift/baselines.db`) with its own SSRF-hardened fetch layer. ClauKit doesn't vendor that execution engine (consistent with the other ported seo-* skills in this kit), so the mechanics are reframed as agentic steps — WebFetch for retrieval, file-based JSON snapshots under `plans/marketing/<site>/seo-drift/` in place of the SQLite tables. The 17 comparison rules, their thresholds, and the severity model are preserved from the source (`references/comparison-rules.md`).

**Open gap:** `.claude/workflows/seo-workflow.md`'s Phase 6 (Measure) / Phase 7 (Optimize) loop only reads GSC/GA4 metrics; it has no step that runs this skill's `compare` to check whether the on-page markup itself regressed before deciding scale/refresh/kill. That workflow file was left unmodified by this port — wiring it in is a separate change.
