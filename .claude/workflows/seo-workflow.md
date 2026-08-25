# SEO Campaign Workflow (7-phase)

Closed-loop SEO campaign. Wraps the `seo-writing` 6-stage article pipeline with a baseline, a measurement cycle, and a refresh loop — so SEO runs as a *campaign* (plan → produce → measure → optimize), not a one-shot writing batch.

**Trigger:** `/mk:seo campaign <seed-keyword | wp:site>` (also delegated by `/mk:campaign` Phase 5 when the strategy is SEO-led)
**Agents:** `seo-writer` (production, Phases 2–4) · `seo-technical` (Phases 1, 6) · `campaign-manager` (cross-channel, Phase 5)
**Required input:** `plans/marketing-context.md` (hard-fail if absent → `/mk:plan`)
**Output dir:** `plans/marketing/<site>/`
**State:** `pipeline.md` status machine (see `.claude/skills/marketing/seo-writing/references/pipeline-state.md`) — every phase is resumable + idempotent.

---

## Phase 0 — Gate (one-time)

Verify `plans/marketing-context.md` exists; absent → hard-fail, direct to `/mk:plan`.
Resolve `<site>` (from `wp:site` target or context hub), init `plans/marketing/<site>/`.

## Phase 1 — Baseline

Establish the "before" so Phase 6 has something to compare against.
- **Audit:** technical + content + schema (`/mk:seo audit` path — claude-seo sub-skills in parallel). Existing WP site: read-only inventory + triage (playbook Phase 1, `wordpress-rest` GET only).
- **Metrics baseline:** GSC clicks/impressions/avg-position, GA4 organic sessions — `mcp-gsc`/`mcp-ga4`, manual CSV fallback. No data source → mark `[NO BASELINE]`, don't fabricate.
- **On-page snapshot:** `seo-drift baseline` over the tracked URLs — captures title/meta/canonical/robots/schema/H1 as they are now. This is what Phase 6 diffs against; without it a later ranking drop cannot be told apart from someone quietly changing the markup.
*Output:* `audit-report.md`, `inventory.md` (existing sites), `baseline-metrics.md` (aggregated, no PII), `seo-drift/baselines/` (per-URL snapshots).

## Phase 2 — Plan (CHECKPOINT — hard stop)

`seo-writing` Stages 1–2: seed → cluster tree → competitor-gap outlines → prioritized backlog. Improve-before-create: near-miss existing posts rank above net-new in the queue.
*Output:* `pipeline.md` (rows status `new`/`outline_ready`) + `briefs/`.
**Stop for human review.** Writing burns tokens — do not proceed until the user approves the plan.

## Phase 3 — Write (batch)

`seo-writing` Stages 3–5 over approved backlog rows: deep section-by-section write → on-page optimize + media → internal links. Bounded batches (`--batch N`, default 1/run — cost control, same as the n8n source). Truth-only rules enforced (marketing-rules §2, §7).
*Output:* `articles/<slug>.md`, rows → `ready_to_publish`.

## Phase 4 — Publish

`seo-writing` Stage 6. **Draft-default**; live requires `--publish` + explicit confirmation echoing URL + title. Idempotent upsert by slug — re-runs never duplicate. Creds env-only (`WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`).
*Output:* `published-log.md` (URLs, timestamps — PII-redacted), rows → `published`.

## Phase 5 — Distribute (optional)

Amplify + accelerate indexing: submit updated sitemap / request indexing, repurpose to social + email. Skills: `social-content`, `emails`. Skip for pure drip-publishing runs.
*Output:* `promotion-log.md`.

## Phase 6 — Measure

**Wait for bake time first — SEO lags. Minimum 2–4 weeks after publish before judging; note the measurement date.**
Per published article: position, CTR, clicks (GSC), organic conversions (GA4) — vs `baseline-metrics.md` and context-hub targets. MCP wrappers with manual CSV fallback (automation-rules). Redact user-level rows.

**Any article that lost ground → run `seo-drift compare` on its URL before writing a verdict.** Metrics say *that* it fell; drift says *whether the page changed*. A regression (title rewritten, canonical repointed, `noindex` added, schema dropped) is a different problem from ranking decay and takes a different fix — restore the markup, don't rewrite the content. Attributing a markup regression to "decay" sends Phase 7 into a needless rewrite and leaves the actual cause in place. No baseline for that URL → say `[NO BASELINE]` and treat the cause as undetermined.
*Output:* `metrics-report.md` (per-article table + aggregate delta vs baseline; drift verdict where one was run).

## Phase 7 — Optimize (loop)

*Input:* `metrics-report.md` + prior `optimize-decisions.md` (read first — don't re-decide).

Per-article verdicts:
- **Restore** — Phase 6 drift found a markup regression. Put back what changed (title/meta/canonical/robots/schema), re-measure next cycle. Do **not** queue a rewrite; the content was never the problem.
- **Scale** — cluster is winning → queue the next batch of `new` rows (back to Phase 3).
- **Refresh** — decayed or near-miss (pos. 5–15, low CTR): update the brief with findings, set the row back to `outline_ready` → it re-enters Phase 3 through the normal status machine. Title/meta-only fixes may re-run Stage 4+6 alone.
- **Kill** — thin/irrelevant losers: noindex or 301, remove from cluster links.

*Output:* `optimize-decisions.md` (3–5 actions, verdict per article).

**Loop exit — ask user:**
> "Cycle metrics vs baseline: [delta summary]. Continue next cycle (Phase 3 with refreshed backlog)? (y/n)"
- `y` → Phase 3. `n` → campaign complete. Auto-exit if targets met or backlog empty (document reason).

---

**Cadence option (n8n-style drip):** between cycles, `/loop 6h /mk:seo write --batch 1` drips the approved backlog on a schedule; Phase 6–7 then run on demand.

**Conventions:** every phase writes one artifact into the campaign dir; `pipeline.md` is the single source of truth for article state — phases only pick up rows matching their entry status, so any phase re-runs alone without redoing the rest. Sub-references: `.claude/workflows/marketing-rules.md` (content quality), `.claude/workflows/automation-rules.md` (PII, idempotency, MCP fallback), `.claude/skills/marketing/seo-writing/SKILL.md` (stage playbooks), `.claude/skills/marketing/seo-drift/SKILL.md` (Phase 1 snapshot + Phase 6 regression check).
