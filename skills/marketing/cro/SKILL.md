---
name: cro
description: Conversion Rate Optimization — landing pages, signup flows, popups, A/B tests. 25-point framework.
allowed-tools: Read, Write, Glob, Grep
---

# CRO

> Conversion Rate Optimization — landing pages, signup flows, popups, A/B tests. 25-point framework.

---

## When this skill activates

**Implicit:** when the agent/task involves increasing conversions, reducing friction, or improving CTAs.
**Explicit:** "Use the cro skill to [task]."

## Scope

This skill covers:
- Auditing landing pages, signup flows, popups, and email CTAs against the 25-point framework
- Identifying friction points and conversion blockers
- Writing CRO-specific recommendations (headline rewrites, CTA copy, social proof placement, form reduction)
- A/B test hypothesis generation (one variable at a time, per principle 16)

This skill does NOT cover:
- Full SEO audits → use `seo-content`, `seo-schema`
- Analytics instrumentation → use `analytics`
- Ad creative → use `ad-creative`

## Key concepts

Load `.claude/workflows/cro-framework.md` before executing any audit — it contains the 25-point checklist that governs all CRO work.

- **Above-fold value prop** — customer problem, no scroll required (principle 2)
- **Single primary CTA** — one action per page; multiple CTAs split attention and drop conversions
- **Social proof near CTA** — testimonials with faces/names/results placed at decision points (principle 6)
- **Genuine urgency only** — fake timers destroy trust permanently (principle 9)
- **Message match** — ad copy → landing headline must be consistent; broken promises = bounce (principle 5)

## Process

1. Load `plans/marketing-context.md` — pull ICP, brand voice, forbidden words.
2. Load `.claude/workflows/cro-framework.md` — 25-point checklist is the audit baseline.
3. Read the target asset (landing page, email, form, popup).
4. Score against relevant framework principles (note which apply).
5. Output ranked recommendations (highest-impact first).
6. For each recommendation: state the principle, the current copy/state, and the proposed fix.

## Output

When activated, this skill produces:
- `plans/marketing/<campaign>/cro-audit.md` — scored findings + ranked recommendations
- Inline recommendations in the conversation (for quick checks)

## Cross-references

- `.claude/workflows/cro-framework.md` — **required** 25-point framework (load before auditing)
- `plans/marketing-context.md` — required hub (ICP, brand voice)
- `.claude/workflows/marketing-rules.md` — quality gates (copy quality, brand voice, E-E-A-T)
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` and adapted for KitForge. Adaptations: KitForge frontmatter, scoped to marketing kit namespace (`/mk:`), wired to `cro-framework.md` 25-point checklist, references `plans/marketing-context.md`.
