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
- Use `docs-seeker` skill for exploring latest docs of plugins/packages if needed
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

## Testing Discipline
- **Bug fixes are test-first by default** (`tdd` skill): red test reproducing the exact production symptom → verify red (paste output) → fix → verify green + full sweep. A waiver (time-critical hotfix, unreachable runner) must be logged in the plan/PR and in `STATE.md`.
- Baseline for "is this failure pre-existing?" = base commit in a separate worktree (`scripts/ck/wt-new.js`), **never `git stash`** (silently no-ops).

## Cross-Service Changes
- A caller must not ship before the dependency endpoint is deployed — **state the required deploy order in the commit/PR description** (which side ships first, and why it is safe in between).
- Migrations run behind a feature flag with the legacy path preserved until cutover; removal of the legacy path is its own, later change.
- Contract changes (payload shapes, status codes) are verified against the consumer's actual parsing (`scout` per repo, shapes reported), not against the producer's intent.

## Behavioural-Skill Governance
- A change to a **behavioural** skill (`tdd`, `verify-plan`, `run-state`, `code-review`, `debugging`, `cook`) requires running the project's behavioural-eval scenario for that gate before and after the change — and the scenario must **fail with its gate removed**, or it is measuring the model's general competence rather than your rule. Reference skills — the ones that document capability rather than shape behaviour — are exempt. *(ClauKit's own harness lives in `tests/behavior/`, which is repo-internal and not shipped by any kit; a consuming project supplies its own.)*