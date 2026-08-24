# Development Rules

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** You ALWAYS follow these principles: **YANGI (You Aren't Gonna Need It) - KISS (Keep It Simple, Stupid) - DRY (Don't Repeat Yourself)**

## General
- **File Naming**: Use kebab-case for file names with a meaningful name that describes the purpose of the file, doesn't matter if the file name is long, just make sure when LLMs read the file names while using Grep or other tools, they can understand the purpose of the file right away without reading the file content.
- **File Size Management**: Keep individual code files under 200 lines for optimal context management
  - Split large files into smaller, focused components/modules
  - Use composition over inheritance for complex widgets
  - Extract utility functions into separate modules
  - Create dedicated service classes for business logic
- Use `WebSearch` / `WebFetch` (or a connected docs MCP server) for the latest docs of plugins/packages if needed
- Use `gh` bash command to interact with Github features if needed
- Use `psql` bash command to query Postgres database for debugging if needed
- Use `ai-multimodal` skill for describing details of images, videos, documents, etc. if needed
- Use `ai-multimodal` skill for generating and editing images, videos, documents, etc. if needed
- Use `sequential-thinking` skill and `debugging` skills for sequential thinking, analyzing code, debugging, etc. if needed
- **[IMPORTANT]** Follow the codebase structure and code standards in `./docs` during implementation.
- **[IMPORTANT]** Do not just simulate the implementation or mocking them, always implement the real code.

## Code Quality Guidelines
- Read and follow codebase structure and code standards in `./docs`
- Don't be too harsh on code linting, but make sure there are no syntax errors and code are compilable
- Prioritize functionality and readability over strict style enforcement and code formatting
- Use reasonable code quality standards that enhance developer productivity
- Use try catch error handling & cover security standards
- Use `code-reviewer` agent to review code after every implementation

## Pre-commit/Push Rules
- Run linting before commit
- Run tests before push (DO NOT ignore failed tests just to pass the build or github actions)
- Keep commits focused on the actual code changes
- **DO NOT** commit and push any confidential information (such as dotenv files, API keys, database credentials, etc.) to git repository!
- Create clean, professional commit messages without AI references. Use conventional commit format.

## Code Implementation
- Write clean, readable, and maintainable code
- Follow established architectural patterns
- Implement features according to specifications
- Handle edge cases and error scenarios
- **DO NOT** create new enhanced files, update to the existing files directly.
- **No unrequested artifacts** (standing constraint): do not create files the user did not ask for — no backfill SQL, no scratch scripts, no helper docs — in a branch destined for a PR. Need one anyway → name it and ask first. (Scratch belongs in `plans/<plan>/reports/` or the session scratchpad, never the PR branch.)

## Links in Shipped Docs (agents · commands · skills)

- **A markdown link target resolves from the file that contains it, never from the repo root.** A target written as `.claude/skills/software/git/SKILL.md` inside `.claude/commands/ck/ask.md` means *that command's own directory* plus that whole string — dangling in the repo *and* in every install. It only looks correct when a human resolves it from the root by eye, which is why 38 of them accumulated unnoticed.
- **Prose paths in backticks are the other convention: root-relative.** `.claude/workflows/marketing-rules.md` in running text names the installed file directly — no `../`. A bare `skills/…` there is wrong for the same reason as above: an install has no root-level `skills/`.
- **Target relative, display text canonical.** In `.claude/agents/engineering/git-manager.md`: display text stays `.claude/skills/software/git/SKILL.md`, link target becomes `../../skills/software/git/SKILL.md`. The reader sees the installed path; the link actually opens.
- **Count `../` from the installed position, not the repo one.** An install writes **nothing outside `.claude/`** — every kit-manifest path is `.claude/`-prefixed, so the consuming project has no root-level `skills/` to point at (helpers likewise live at `.claude/scripts/ck/`, not root `scripts/ck/`). Agents (`.claude/agents/<group>/`) → `../../skills/…`; commands (`.claude/commands/<ns>/`) → `../../skills/…`; skills (`.claude/skills/<domain>/<name>/`) → `../../../commands/…`.
- In ClauKit itself `.claude/skills` is a **symlink** to `./skills`, so repo and install disagree by construction: **the form cannot be validated by reading the repo** — only by installing. `tests/installer-packaging.test.js` § *"no shipped doc links to a file the install does not have"* does exactly that, across all three kits. Do not narrow its regex back to `^\.\.?/`; that exemption is what hid the 38.

## Testing Discipline
- **Bug fixes are test-first by default** (`tdd` skill): red test reproducing the exact production symptom → verify red (paste output) → fix → verify green + full sweep. A waiver (time-critical hotfix, unreachable runner) must be logged in the plan/PR and in `STATE.md`.
- Baseline for "is this failure pre-existing?" = the suite run on the untouched tree **before the first edit**, recorded in `STATE.md`. Already dirty ⇒ park your own WIP on a scratch branch by explicit paths (untracked included, never `-A`/`-am`), check out the base, and **verify `git status --porcelain` is empty before running** — the `tdd` skill § Baseline has the 4 steps. Foreign dirty files ⇒ do not park, stop. **Never `git stash`** (silently no-ops).

## Cross-Service Changes
- A caller must not ship before the dependency endpoint is deployed — **state the required deploy order in the commit/PR description** (which side ships first, and why it is safe in between).
- Migrations run behind a feature flag with the legacy path preserved until cutover; removal of the legacy path is its own, later change.
- Contract changes (payload shapes, status codes) are verified against the consumer's actual parsing (`scout` per repo, shapes reported), not against the producer's intent.

## Behavioural-Skill Governance
- A change to a **behavioural** skill (`tdd`, `verify-plan`, `run-state`, `code-review`, `debugging`, `cook`) requires running the project's behavioural-eval scenario for that gate before and after the change. Reference skills — the ones that document capability rather than shape behaviour — are exempt. *(ClauKit's own harness lives in `tests/behavior/`, which is repo-internal and not shipped by any kit; a consuming project supplies its own.)*
- **A green scenario is not evidence by itself.** It counts as evidence about your rule only under a control: the behaviour vanishes in *every* ablated run (`--negative`), or removing one claimed-load-bearing line flips a failing case and reproduces (`--positive`). Both are causal; the one-line version isolates more tightly, because full ablation differs by a directory plus dozens of lines.
- **Where neither control is reachable, record that and ship — do not block, and do not call the gate demonstrated.** A rule the current model already follows unprompted is not a wrong rule; it is an invisible one, and the two are easy to confuse in the direction that gets working rules deleted.
- **A rule that names an intent instead of a mechanism can be obeyed and still not happen.** `fan-out-concurrency` failed twice — the second time against a deliberately imperative rewrite with an explicit self-check — because every dispatch carried `run_in_background: false`, which blocks the orchestrator regardless of wording. Naming the field made it pass, and removing that one line flips it back. Before rewriting a rule for emphasis, check whether the behaviour has a mechanism the text has not mentioned.
- **Chasing invisibility with harder fixtures does not work, and that is measured, not assumed.** `tdd-red-first` lost its behaviour in 5 of 13 ablated runs across two fixtures — the second built specifically to make test-first expensive (symptom two hops from cause, nothing naming a function or a value, a one-character fix against a test that must be invented). The investigation got two to three times deeper and the model still went red-first unprompted. That conclusion cost four live runs; do not re-buy it.

| scenario | what running it proves today |
|---|---|
| `verify-plan-fires` · `scope-lock` · `fan-out-concurrency` | **load-bearing** — positive-controlled, so a regression here is a real regression |
| `tdd-red-first` · `iron-law` · `resume-from-ledger` | **regression-only** — green means the kit still works, not that the rule caused it |
| `guard-tier-b` | little: the hook itself is covered by 24 cases in `tests/guard-destructive.test.js`, and the scenario showed the model never reaches for the broad stage the hook guards |