# Model-Tier Dispatch Matrix

Single source of truth for choosing the `model` on every Agent dispatch. `orchestration-protocol.md` §Agent Selection and `dynamic-workflow` axis 4 reference this file — no per-command duplication.

## Rule 0 — always specify `model` explicitly

An omitted `model` inherits the session's model — often the most expensive tier — and **silently defeats tiering**. Every dispatch example in `/ck:cook`, `/ck:flow`, `/ck:fix` names a model; a dispatch without one is a review finding.

## The matrix

| Work shape | Tier |
|---|---|
| Plan text contains the complete code → transcription + test | cheapest (haiku) |
| 1–2 files, complete spec; single-file mechanical fix | cheap (haiku) |
| Multi-file integration, pattern matching, debugging | standard (sonnet) |
| Architecture/design; **final whole-branch review** | most capable (opus) |
| Reviewers | scale to diff size/complexity/risk; **mid-tier (sonnet) is the floor** |
| Fix-loop escalation (3rd round) | one tier above the implementer that got stuck |

## Turn count beats token price

Cheapest models often take 2–3× the turns on multi-step work — re-reading files, retrying commands — and cost **more** overall. Mid-tier is the floor for reviewers and for any implementer working from prose rather than from complete code. Tier down only when the work is genuinely mechanical.

## Overload resilience (529 / transient API failure)

A dispatched agent that dies on `529 Overloaded` (or any transient API failure) must not cost a manual model switch and skill re-invocation:

1. **Retry once** with backoff.
2. Still failing → **fall back one tier** (opus→sonnet→haiku) and re-dispatch.
3. **Record the substitution in `STATE.md`** (`env: model fallback <from>→<to> — 529`), so the run's quality context is auditable — never surface a dead end.

**A killed agent must be detectable from the ledger.** A background agent once died leaving *no changes at all* and the work was silently redone. After any dispatch, verify a VCS diff exists before recording the phase complete ("agent reported success" is not evidence — Iron Law row); no diff → `phase <N>: agent died (no diff) — redispatch` in `STATE.md`.

## Interaction with context hygiene

Tiering composes with artifacts-as-files (`scripts/ck/phase-brief.cjs`, `review-package.js`): a cheap-tier agent given a complete brief file outperforms an expensive agent given pasted history. Tier the model to the work shape; keep the dispatch under 2k chars either way.
