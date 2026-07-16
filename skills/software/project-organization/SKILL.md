---
name: project-organization
description: Organize directory layout, naming, and module boundaries in an existing or growing codebase — monorepo vs polyrepo, src-vs-flat layouts, conventions that scale past 1000 files.
category: Codebase Hygiene
status: active
---

# Project Organization

## Purpose

Decide and apply **how files are arranged** in an existing or growing repo. Distinct from `[[bootstrap]]` (which creates a new project from a template) — this skill handles structure decisions *after* the first commit.

## When to Use

- Repo has grown past ~50 files and "where does this go?" needs answering more than once a week
- Considering monorepo ↔ polyrepo migration
- New contributor onboarding is slow because the layout is unclear
- Modules have crept into each other; coupling needs visible boundaries
- Adopting a new framework that has a layout convention (e.g. Next.js app dir, Django apps)

Activation phrases: *"reorganize this repo"*, *"migrate to monorepo"*, *"suggest a layout for..."*, *"directory structure for..."*

## Boundary with `[[bootstrap]]`

| Concern | `[[bootstrap]]` | `project-organization` |
|---|---|---|
| Creating a new repo | ✅ | ❌ |
| Picking a stack/template | ✅ | ❌ |
| Restructuring existing files | ❌ | ✅ |
| Choosing monorepo vs polyrepo for an existing codebase | ❌ | ✅ |
| Renaming directories to follow a convention | ❌ | ✅ |

## Layout Patterns

### Single-repo, small (`<5k LOC`)

```
project/
├── src/          # production code
├── tests/        # mirror src/ structure
├── docs/
├── scripts/      # local dev/build utilities
└── README.md
```

Keep flat. Resist sub-directories until a domain emerges.

### Single-repo, medium (`5–50k LOC`)

Introduce domain folders inside `src/`. Group **by feature** (auth, billing, search), not by technical kind (controllers, services). Feature-folders scale; layer-folders don't.

### Monorepo (`>50k LOC` or multiple deployable artifacts)

```
repo/
├── apps/           # deployable units (web, api, mobile, cli)
├── packages/       # shared libs (ui, types, config)
├── tools/          # scripts, generators
├── docs/
├── package.json    # workspace root
└── pnpm-workspace.yaml | turbo.json | nx.json
```

Tooling (pnpm/yarn workspaces, Turborepo, Nx) is the multiplier — pick before splitting.

## Naming Conventions

- **Directories**: kebab-case. No spaces. No PascalCase except for component dirs in React conventions.
- **Files**: match language norm (kebab-case for JS/TS, snake_case for Python, PascalCase for React components).
- **Configs at root**: every config a tool *can* read from the root, *should* be at the root. Package-local configs only when truly per-package.
- **Tests adjacent to source** (`foo.ts` + `foo.test.ts`) or **mirror tree** (`tests/foo.test.ts`) — pick one, don't mix.

## Anti-Patterns

- **Premature monorepo**: splitting a 3-file repo into apps/ + packages/ wastes weeks. Wait for at least two genuinely independent deployables.
- **Layer-first inside features**: `auth/controllers/`, `auth/services/` — fine; `controllers/auth/`, `services/auth/` — fights you forever.
- **Config sprawl**: `.eslintrc` in every folder; pick root.
- **Stale README**: layout drifts but the README doesn't. Add a section "Directory map" and update it in the same PR as any rename.

## References

See `references/`:
- `github-repository-best-practices.md` — official GitHub guidance
- `python-project-layout.md` — src/ layout, pyproject.toml
- `monorepo-vs-polyrepo.md` — trade-offs and migration patterns

## Cross-links

`[[bootstrap]]`, `[[code-review]]`
