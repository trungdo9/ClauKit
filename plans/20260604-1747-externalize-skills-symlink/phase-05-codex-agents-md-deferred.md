# Phase 5 — Codex / `AGENTS.md` — DEFERRED (Outline Only)

**Context:** [plan.md](plan.md) · [research/researcher-02-codex-and-symlink-mechanics.md](research/researcher-02-codex-and-symlink-mechanics.md) · [reports/01-codebase-impact-analysis.md](reports/01-codebase-impact-analysis.md)
**Priority:** DEFERRED | **Confidence:** LOW (no confirmed Codex mechanism) | **Risk:** N/A (not implemented)
**Status:** Deferred — do NOT implement now. Outline of what it WOULD take.

## Why deferred (do NOT build a folder-symlink for Codex)
- Research (researcher-02, Medium-LOW confidence) found NO confirmed public skill-discovery folder for OpenAI Codex CLI; Codex is primarily an API service. Knowledge cutoff predates current Codex.
- The de-facto cross-tool convention is a root `AGENTS.md` file — NOT a skills folder. Codex (and many agents) read `AGENTS.md`, not `.claude/skills/`.
- Therefore a symlink does NOT solve Codex. Sharing "skills" with Codex = generating/maintaining an `AGENTS.md` that summarizes or points to the skills. This is a SEPARATE concern from the symlink task.
- `package.json files:` ALREADY lists `AGENTS.md`, but the file does NOT exist in the repo tree yet (verified) — so even the existing contract is unfulfilled. Building this properly is its own task.

## What it WOULD take (future task outline — NOT this plan)
1. **Confirm mechanism out-of-band:** Read current OpenAI Codex docs — does it read root `AGENTS.md`? A `.codex/` dir? A skills folder? Resolve Unresolved Q1 FIRST. Do not build before confirming.
2. **If `AGENTS.md` is the contract — generator approach (DRY):**
   - Create `scripts/gen-agents-md.js` that walks `./skills/**/SKILL.md`, parses YAML frontmatter (`name`, `description`), and emits a root `AGENTS.md` indexing skills (name + description + relative path). ONE source (`./skills/`) → generated `AGENTS.md`. Keeps the existing `files:` contract real.
   - Optionally wire into a release step (NOT consumer postinstall) so `AGENTS.md` stays current with skills.
3. **If Codex reads a folder:** add `.codex/skills → ../skills` target to `scripts/link-skills.js` (same pattern as Phase 4) + manual verify, mirroring Antigravity's best-effort treatment.
4. **Do NOT** promise Codex sharing in user-facing docs until (1) is confirmed.

## Related Code Files (future, illustrative only)
- **CREATE (future):** `/home/trung/workspace/project/private/ClauKit/scripts/gen-agents-md.js`
- **CREATE (future, generated):** `/home/trung/workspace/project/private/ClauKit/AGENTS.md`
- **MODIFY (future, conditional):** `scripts/link-skills.js` (`.codex/skills` target) — only if Codex proven to read a folder.

## Todo List (deferred — unchecked by design)
- [ ] Confirm Codex skill/instruction mechanism from current docs (Unresolved Q1)
- [ ] Decide: `AGENTS.md` generator vs. folder-symlink vs. neither
- [ ] (If AGENTS.md) build `gen-agents-md.js` from `./skills/`
- [ ] (If folder) add `.codex/skills` to link script + manual verify
- [ ] Update user docs ONLY after mechanism confirmed

## Success Criteria (when eventually picked up)
- Codex mechanism confirmed in writing before any code.
- If `AGENTS.md`: generated file accurately indexes all `./skills/**` skills; `files:` contract fulfilled.
- No false promise of Codex support before verification.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Building wrong mechanism (folder vs AGENTS.md) | HIGH if unconfirmed | MED | Confirm Q1 before any code |
| Stale `AGENTS.md` vs skills | MED | LOW | Generate from `./skills/`, don't hand-maintain |
| Scope creep into this plan | — | — | Explicitly DEFERRED; out of P1–P4 release unit |

## Next Steps / Dependencies
- Independent of P1–P4. Pick up only after Unresolved Q1 resolved.
- If pursued, reuses `./skills/` canonical source (P1) and possibly `link-skills.js` (P2).
