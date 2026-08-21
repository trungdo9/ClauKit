# Marketing Rules

**Domain:** Marketing kit (`/mk:` namespace) — applies to all marketing skills, agents, commands, and workflows.

## 1. Hard-fail: marketing context hub required

**Every `/mk:` command MUST verify the existence of `plans/marketing-context.md` before proceeding.**

If absent:
1. Output a clear error: "❌ Marketing context not found at plans/marketing-context.md"
2. Direct user to run `/mk:plan` to bootstrap the context hub
3. Exit without executing the requested task

**Rationale:** Marketing outputs (copy, campaigns, content) need consistent ICP, positioning, brand voice, and goals. Without the context hub, outputs will be inconsistent and low-quality.

**Exception:** `/mk:plan` itself, which creates the context hub.

## 2. YAGNI / KISS / DRY for content

- **No fluff.** Cut filler ("in today's fast-paced world…"). Every sentence must add value.
- **No hallucinated metrics.** Never invent stats, percentages, or case-study numbers. If a claim needs data, cite the source or mark it `[NEEDS DATA]`.
- **Brand voice first.** Pull tone, terminology, and forbidden words from `marketing-context.md`. If absent → fall back to professional-but-warm default.
- **Reuse templates.** Don't recreate brief/outline templates per task — reference `references/` once and link.

## 3. Quality gates

Every marketing output must pass these checks before delivery:

| Gate | Check |
|---|---|
| **Copy quality** | Headline is concrete + benefit-led · CTAs are action-specific · No jargon |
| **SEO E-E-A-T** | Author credentials present · Sources cited · Date visible · Original data/insight |
| **CRO** | Above-the-fold value prop · Single primary CTA · Social proof near CTA · Friction removed |
| **Brand voice** | Tone matches context.md · Forbidden words avoided · Terminology consistent |

## 4. CRO framework

Default: load `.claude/workflows/cro-framework.md` (25-point Conversion Optimization Framework). Use the 25-point checklist when optimizing landing pages, signup flows, or email CTAs.

## 5. No code steps in marketing workflow

Marketing tasks should NEVER include code-implementation steps. If a marketing task surfaces a code requirement, hand off to `/ck:plan` (engineering) — not solve in marketing workflow.

## 6. Output conventions

- **Content files:** `plans/marketing/<campaign-name>/<asset>.<ext>` (e.g., `plans/marketing/launch-2026q3/blog-post.md`).
- **Audit reports:** `plans/marketing/<audit-name>/<report>.md` with falsifiable findings.
- **Templates:** `.claude/skills/marketing/<skill>/templates/` (referenced, not duplicated).

## 7. Anti-patterns (auto-reject)

- ❌ Generic AI copy without brand voice
- ❌ Vague CTAs ("Learn more", "Click here")
- ❌ Content without target audience callout
- ❌ "Trust us" without proof points
- ❌ Marketing copy that buries the value prop below the fold
- ❌ Pasting external blog verbatim into our content (plagiarism)
- ❌ Writing raw customer/lead PII into `plans/marketing/` content or audit files (redact per automation-rules R4)

## 8. Cross-references

- `.claude/workflows/cro-framework.md` — CRO 25-point framework
- `plans/marketing-context.md` — required context hub
- `.claude/skills/marketing/README.md` — full kit overview
- `docs/marketing-kit/` — kit QA reports + implementation docs
