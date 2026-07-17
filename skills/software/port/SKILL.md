---
name: port
description: Port and refactor a feature from a public GitHub repo into the local codebase. Use when user wants to copy/adapt an existing implementation (auth flow, payment integration, UI component, algorithm, etc.) from another repo rather than build from scratch. Triggers on `/ck:port` or phrases like "port from", "borrow this feature", "copy from repo X".
category: Planning & Research
status: active
---

# Port & Refactor

## Purpose

Safely extract a feature from an external GitHub repository and integrate it into the current codebase. The goal is **idiomatic adaptation**, not blind copy-paste: matched naming, matched layering, matched dependencies, and zero dead imports.

## When to Use

- User points at a public GitHub repo and asks to "port", "borrow", "lift", "adapt", or "copy" a feature.
- User runs `/ck:port <github-url> [feature]` with or without `--improve` / `--compare`.
- A planning step concluded that a proven open-source implementation is a better starting point than green-field code.

**Do NOT use** when:
- The license of the source repo forbids redistribution. Check `LICENSE` before any copy.
- The feature is one function call deep — just write it.
- The source is private / requires auth. Ask user to share the relevant snippet directly.

## Inputs

| Input | Source | Required |
|---|---|---|
| `repo_url` | `$1` | yes — must be `https://github.com/<owner>/<name>` |
| `feature` | `$2` | optional — free-text hint (e.g. `auth`, `webhook-handler`, `Dropzone component`) |
| `mode` | `--improve` (default) \| `--compare` | optional |

## Workflow

### Phase 1 — Fetch & inspect (always)

1. Validate `repo_url` is a public GitHub URL. If not, stop and ask user.
2. Read `LICENSE` via `gh api repos/<owner>/<name>/contents/LICENSE` or `gh repo view`. Flag GPL / AGPL / non-permissive licenses to user **before** copying anything.
3. List repo tree: `gh api repos/<owner>/<name>/ck:git/trees/HEAD?recursive=1` (or shallow-clone to `/tmp/port-<repo>-<sha>/` if tree is large).
4. Delegate to `scout-external` (or `Explore`) agent: locate the file(s) implementing `feature`. Return paths + a 1-line "what each file does" map.
5. Save inspection report to `plans/<plan-name>/reports/port-<repo>-inspect.md`.

### Phase 2 — Compare with local codebase (always)

6. Detect local conventions: language, framework, lint config, test framework, module structure, naming (camelCase/snake_case), import style (relative/absolute), error-handling pattern. Activate `code-review` skill if available.
7. Diff source vs local on three axes:
   - **Dependencies** — what does source pull in that local doesn't? Note version skew.
   - **Patterns** — class vs function, hooks vs class components, sync vs async, etc.
   - **Boundaries** — does source assume infra (Redis, Postgres, message queue) that local lacks?
8. Write `port-<repo>-compare.md` with: file-level diff plan, dep deltas, refactor checklist, **risk callouts**.

**If `--compare` mode:** stop here. Report to user. Do not modify any local file.

### Phase 3 — Port (only `--improve` mode)

9. Copy the identified files into the local codebase at the **mirrored layer** (e.g. source's `lib/auth/` → local `src/auth/` if that matches convention). Do NOT preserve source paths blindly.
10. Add a single-line provenance comment at the top of each ported file:
    `// Adapted from <repo_url>@<short-sha>:<source-path> (<license>)`
    This is the only comment you write proactively — it's load-bearing for license compliance.
11. Apply mechanical refactors:
    - Rename to match local casing.
    - Rewrite imports to local module aliases.
    - Replace source-specific dep calls with local equivalents (e.g. `axios` → local `fetchClient`).
    - Inline or remove source-specific utility wrappers that local doesn't use.
12. Update `package.json` / `requirements.txt` / equivalent **only** with deps the feature genuinely needs. Do not pull the source's full dep tree.

### Phase 4 — Refactor for fit (only `--improve` mode)

13. Apply structural refactors flagged in Phase 2: error handling style, logging, types, config injection.
14. Delegate to `code-reviewer` agent for a pass focused on: dead code from the port, leaked source-specific assumptions, security issues (esp. unvalidated input paths from source).

### Phase 5 — Verify (always when porting)

15. Run type-check / lint / build commands locally.
16. Instruct user to run `/ck:test` (or run `tester` agent) — port is not "done" until tests pass.
17. Write final report to `plans/<plan-name>/reports/port-<repo>-port.md` covering: files added/modified, deps added, refactors applied, remaining TODOs, license note.

## Output Locations

- Inspection: `plans/<plan-name>/reports/port-<repo>-inspect.md`
- Comparison: `plans/<plan-name>/reports/port-<repo>-compare.md`
- Final port report: `plans/<plan-name>/reports/port-<repo>-port.md`

If no active plan, drop reports into `plans/port-adhoc-YYYYMMDD-HHmm/reports/`.

## Guardrails

- **License first**: never copy a file before reading the source repo's `LICENSE`. Refuse GPL/AGPL ports unless local project is also GPL/AGPL.
- **Provenance**: every ported file gets the `Adapted from ...` header. This is the one comment exception to the "no comments" project rule — it's a legal artifact, not documentation.
- **No drive-by deps**: only add a dependency if the ported code actually calls it after refactor. Strip source's incidental deps.
- **No silent secrets**: if source files reference env vars (`process.env.X`, `os.getenv("X")`), surface them in the final report — do not invent placeholder values.
- **Trust local conventions over source style**: if source uses tabs and local uses spaces, local wins. Same for naming, error patterns, layering.
- **Sacrifice grammar for concision in reports** (per project CLAUDE.md).

## Related

- `/ck:scout` + `scout-external` agent — for locating files in the source repo.
- `code-review` skill + `code-reviewer` agent — Phase 4 validation.
- `/ck:test` — Phase 5 verification.
- `git-manager` agent — commit the port as a discrete commit with `feat: port <feature> from <repo>` message.

## References

- GitHub REST API — repo contents & trees: https://docs.github.com/en/rest/repos/contents
- `gh` CLI manual: https://cli.github.com/manual/
- SPDX license identifiers (for the provenance header): https://spdx.org/licenses/
- Choosealicense.com compatibility matrix: https://choosealicense.com/appendix/
