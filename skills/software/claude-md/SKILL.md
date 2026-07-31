---
name: claude-md
description: Use when the user needs to CREATE, VERIFY, ANALYZE, or REFACTOR a CLAUDE.md file (the project-instructions file Claude Code loads every session). Triggers on "/ck:claude-md", "write CLAUDE.md", "audit CLAUDE.md", "verify CLAUDE.md", "CLAUDE.md too long", "slim down CLAUDE.md", "clean up CLAUDE.md", "which section costs tokens", "CLAUDE.md token cost", "optimize CLAUDE.md". Covers structure standard, token budget, verify checklist (broken refs, phantom commands, duplication, staleness), per-section token-cost analysis (ranked optimization plan), and behavior-preserving refactor (extract → reference, directives preserved).
metadata:
  version: "1.0.0"
---

# CLAUDE.md — Create · Verify · Refactor Methodology

Lifecycle methodology for `CLAUDE.md`, the project-instructions file Claude Code injects into **every session**. Distinct from `/ck:docs` (manages `./docs/*` content) — this skill manages the instruction file itself.

## Core Principle

**Every line of CLAUDE.md costs tokens on every turn of every session.** CLAUDE.md is a lean hub of pointers and hard directives — not an encyclopedia. Content lives in `./docs/*` and `.claude/workflows/*`; CLAUDE.md references it.

Three rules, in priority order:
1. **Correct** — every referenced file exists; every documented command actually runs.
2. **Lean** — target ≤ 60 lines / ~600 tokens; hard ceiling 150 lines. Beyond that, extract.
3. **Directive-safe** — `IMPORTANT`/`MUST` rules are load-bearing. Never silently drop or weaken one.

## Structure Standard

Canonical section order (ClauKit convention — see this repo's root `CLAUDE.md` as the working example):

```markdown
# CLAUDE.md
<one-line preamble: what this file is>
## Role & Responsibilities      ← 1-3 lines: Claude's job in this repo
## Workflows                    ← pointers to .claude/workflows/*.md
## <Project-specific sections>  ← kits, integrations, domain constraints (pointers, not prose)
## Documentation Management     ← pointer to ./docs structure + registry/source-of-truth file
## IMPORTANT directives         ← hard rules, each on its own line, **bold-prefixed**
```

What belongs in CLAUDE.md: build/test/lint commands, architecture one-liners, hard constraints, pointers to canonical docs. What does NOT: code snippets, API docs, changelogs, generic best practices ("write clean code"), anything derivable from the code itself.

## Operation `init` — create from scratch

1. **Refuse-overwrite gate**: if `CLAUDE.md` exists → stop, suggest `verify` or `refactor` instead.
2. Gather ground truth (read, don't assume): `README.md`, `package.json`/`Makefile`/`pyproject.toml` scripts, `./docs/*` if present, `.claude/` contents, top-level folder layout.
3. Draft per Structure Standard. **Never invent a command** — every build/test/lint line must be copied from a manifest or verified runnable.
4. Every file path written into CLAUDE.md must exist on disk at write time.
5. **Emit the 5 project-specific fill-in blocks** (placeholders the project fills; this template is the ONLY kit file where a vendor name may appear — and then only in a commented-out sample):
   - `## Git & PR` — branch naming, ticket-ID prefix convention, PR target branch, draft-vs-ready policy.
   - `## DB changes` — which DSNs exist (dev/staging/prod), who approves mutations, where migration scripts live (protocol itself: `database` skill safe-writes).
   - `## Verification before claiming done` — the project's own "done" commands (test/typecheck/build) with expected results, verbatim.
   - `## Cross-service` — which services call which; the deploy-order rule instances for THIS project.
   - `## Delivery tail (optional)` — post-PR steps, **shipped commented-out and inert**: one bullet per step, sub-bullets `run:` / `needs:` / `done-when:` / `on-fail:` (markdown sub-bullets, not YAML — `done-when` = command + expected result, same shape as plan exit gates). Commented-out samples for common trackers/VCS hosts live here, never in any skill. Absent/empty ⇒ `/ck:git pr` ends at draft PR + teardown.
6. Output ≤ 60 lines unless the project genuinely demands more (the 5 blocks above count against the budget — keep them terse); report final line + est. token count.

## Operation `verify` — read-only audit

Run every check; emit a report (no file writes). Severity buckets align with the ClauKit review taxonomy (Critical / High / Medium / Low).

| # | Check | Severity if failed |
|---|---|---|
| 1 | Every referenced file/dir path exists on disk | Critical |
| 2 | Every documented command exists in manifest (`package.json` scripts, Makefile, etc.) | Critical |
| 3 | Secrets / credentials / API keys present in file | Critical |
| 4 | Conflicting directives (two rules that cannot both be followed) | High |
| 5 | Stale facts — counts, versions, paths contradicted by current codebase | High |
| 6 | Content duplicated from `./docs/*` or `.claude/workflows/*` (should be a pointer) | Medium |
| 7 | Size budget — >150 lines hard, >60 lines soft | Medium (hard) / Low (soft) |
| 8 | Generic filler with no project-specific information | Low |
| 9 | Section order deviates from Structure Standard | Low |

Report format: table of findings (`#`, severity, evidence with line number, suggested fix) + verdict line: `PASS` (0 Critical + 0 High) or `FAIL`. Concise grammar; unresolved questions at end.

## Operation `analyze` — per-section token-cost profile

Read-only; no file writes. Answers "which section costs what, and what would optimizing buy?" — the planning half of `refactor` (which applies it). Boundary with `verify`: verify judges **correctness** (PASS/FAIL), analyze judges **cost**. `optimize` is an accepted alias: run `analyze`, then offer to continue into `refactor`.

1. **Measure** — split the target by `##` headings (content before the first heading = `(preamble)`); per section count lines, chars, est. tokens at chars÷4. Deterministic snippet:
   ```bash
   awk 'BEGIN{s="(preamble)"} /^## /{s=substr($0,4)} !(s in seen){seen[s]=++n; name[n]=s}
        {ch[s]+=length($0)+1; ln[s]++}
        END{for(i=1;i<=n;i++){s=name[i]; printf "%-42s %4d L %6d ch ~%4d tok\n", s, ln[s], ch[s], int(ch[s]/4)}}' CLAUDE.md
   ```
2. **Classify** each section: `DIRECTIVE` (hard rules — load-bearing) · `POINTER` (reference lines) · `PROSE` (methodology/explanation) · `DUP` (restates `docs/*` or `.claude/workflows/*` — same cross-check as verify #6) · `FILLER` (generic, zero project-specific info).
3. **Recommend** per section, with estimated saving: **KEEP** (directives, pointers) · **EXTRACT** → `.claude/workflows/` or `docs/` + one-line pointer (PROSE >~10 lines) · **DEDUPE** → pointer to the canonical copy (DUP) · **DROP** (FILLER). Never recommend dropping or weakening a directive — flag it to the user instead.
4. **Report**, ranked costliest-first:

   | Section | Lines | ~Tokens | % of file | Class | Recommendation | Est. saving |

   Plus summary: current total vs budget (≤60 L/~600 tok soft · 150 L hard) · projected total after applying all recommendations · reminder that the saving repeats **every turn of every session**.
5. **Hand-off**: apply via `refactor` — its gates (clean git, verify-first, directive inventory 1:1) take over unchanged.

## Operation `refactor` — behavior-preserving slim-down

**Meaning-preservation is non-negotiable** — same instruction set, fewer tokens. Changing what Claude is instructed to do is an edit, not a refactor.

1. **Pre-flight gate (BLOCK if fails)**: `git status` for `CLAUDE.md` must be clean, so the change is revertable in one step. Run `verify` first — fix Criticals before refactoring.
2. **Inventory directives**: list every `IMPORTANT`/`MUST`/hard rule. This list must survive 1:1 (verbatim or consolidated-with-equal-strength). Flag any proposed drop to the user — never decide alone.
3. **Extract**: sections > ~10 lines of methodology/prose → move to `.claude/workflows/<kebab-name>.md` or `./docs/<kebab-name>.md`, leave a one-line pointer.
4. **Dedupe**: content that already exists in `docs/`/workflows → replace with pointer to the canonical copy (keep the canonical, don't duplicate).
5. **Reorder** to Structure Standard; merge redundant directives.
6. **Diff review**: present before/after line + token counts and the directive-inventory checklist to the user before writing.

## Anti-patterns (reject on sight)

- Inlining full workflow pipelines instead of referencing `.claude/workflows/`
- "Kitchen-sink" CLAUDE.md that restates README + docs (double token cost, drift risk)
- Phantom commands (documented `npm run x` that no manifest defines)
- Duplicating the skills/agents/commands catalog instead of pointing to the registry file
- Softening a `MUST` into a `should` during refactor (silent behavior change)

## Hand-offs

- Full `./docs/*` creation/refresh → `/ck:docs [init|update]` (`docs-manager` agent)
- Harness settings / hooks / permissions (`settings.json`) → `update-config` skill
- Repo-wide code refactor → `/ck:refactor`
- CLAUDE.md changes that ADD new policies (not restructure) → plain edit with user approval, not this skill
