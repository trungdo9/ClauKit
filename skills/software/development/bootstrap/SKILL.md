---
name: bootstrap
description: Initialize projects from scratch with modular scaffolds (Next.js, Vite, Svelte, Python, etc.)
category: Build & Deploy
status: active
---

# Bootstrap

## Purpose

Rapidly scaffold complete, production-ready project structures across multiple tech stacks using official and community tools—Next.js (full-stack React), Vite (frontend bundler), degit (git-based templates), and language-specific generators (Python Cookiecutter, Ruby Rails)—with minimal manual setup.

## When to Use

- Starting new projects (Next.js apps, Vite SPAs, full-stack Node/Python/Ruby applications)
- Standardizing project structure across teams via custom templates
- Quickly prototyping ideas from curated starter templates
- Need TypeScript, linting, testing configured automatically
- Bootstrapping monorepos or multi-package workspaces

**Do NOT use when**: Migrating existing projects (bootstrap tools create new projects), setting up single-file utilities, or when custom architecture incompatible with scaffolding templates.

## Workflow

1. **Select scaffold tool based on stack:**
   - `create-next-app` → Full-stack React with App Router, TypeScript, Tailwind, ESLint
   - `npm create vite@latest` → Frontend-only (React, Vue, Svelte, Lit, Solid, etc.)
   - `degit user/repo` → Clone curated templates without Git history
   - `cookiecutter template` → Python project generation (Django, FastAPI, etc.)
   - `rails new` → Ruby on Rails full-stack apps

2. **Run generator with options:**
   - Use interactive prompts or pass flags (`--typescript`, `--tailwind`, `--eslint`)
   - Accept defaults or customize (directory structure, import aliases, linters)
   - Generators install dependencies automatically (npm/pnpm/yarn/bun)

3. **Review generated structure:**
   - Verify all config files (tsconfig.json, package.json, ESLint, Tailwind)
   - Check Git initialization and `.gitignore`
   - Run `npm run dev` to confirm dev server works

4. **Customize for project needs:**
   - Update package.json metadata (name, version, author, license)
   - Add project-specific environment variables (.env.local)
   - Extend generated configs (ESLint rules, TypeScript paths)
   - Add custom scaffolding (GitHub Actions workflows, Docker)

## Key Concepts

### create-next-app
Official Next.js scaffolding tool. Prompts for TypeScript, Tailwind CSS, ESLint, App Router, src/ directory, and custom import aliases. Installs Next.js 16+, React 19, with sensible defaults. Includes `AGENTS.md` guidance for AI coding agents.

### create-vite
Lightweight, frontend-focused scaffolding supporting 18+ templates (React, Vue, Svelte, Solid, Lit, Preact, etc.). TypeScript variants available. No server-side rendering; ideal for SPAs and static site generation frameworks.

### degit
Fast Git repository copying without history. Clones specific branches, tags, commits via syntax like `degit user/repo#v1.0.0 my-project`. Supports `degit.json` for post-clone actions (remove files, add files). Local caching for repeated installs.

### Cookiecutter (Python)
Template engine for Python projects. Prompt-based variable substitution during generation. Popular for Django, FastAPI, ML projects. Templates live in GitHub; `cookiecutter gh:user/repo` generates projects.

### Language-specific Generators
Rails (`rails new`), Django (`django-admin startproject`), Cargo (`cargo new`, Rust), Go (`go mod init`). Each language's ecosystem provides official scaffolding respecting language conventions.

## Example

**Next.js with defaults:**
```bash
npx create-next-app@latest my-app --yes
cd my-app && npm run dev
```

**Next.js with custom options:**
```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --eslint \
  --src-dir \
  --import-alias '@/*'
```

**Vite React:**
```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app && npm install && npm run dev
```

**degit from custom template:**
```bash
degit gh:sveltejs/template my-svelte-app
cd my-svelte-app && npm install && npm run dev
```

**Python FastAPI via Cookiecutter:**
```bash
cookiecutter gh:tiangolo/fastapi-project-template
```

## Common Pitfalls

- Running bootstrap in existing directory with content; always create new directory
- Accepting defaults then immediately changing config; review scaffolded setup before starting
- Not committing scaffolded structure to Git before modifications; losing ability to track changes
- Ignoring generated `.gitignore`; sensitive files (`.env`, `node_modules`) end up in repo
- Custom import aliases not reflected in ESLint config; paths work in IDE but fail at build time
- Not updating `package.json` metadata; version mismatches cause confusion in monorepos
- Assuming scaffolded tests work; most generators create placeholder tests requiring implementation

## References

- [create-next-app](https://nextjs.org/docs/app/getting-started/installation) — Official Next.js scaffolding with App Router, TypeScript, Tailwind
- [create-vite](https://vite.dev/guide/) — Frontend scaffolding across 18+ template options
- [degit](https://github.com/rich-harris/degit) — Fast Git-based project copying with template customization
- [Cookiecutter](https://cookiecutter.readthedocs.io/) — Python project generation via templates

---

## Canonical Bootstrap Workflow (project orchestration)

Shared workflow for `/ck:bootstrap` family commands (`/ck:bootstrap`, `/ck:bootstrap auto`, `/ck:bootstrap fast`). Each command is a **variant** that selects which phases to include and how to interact with the user.

### Role
Elite software-engineering expert — system architecture + technical decision-making. Operate by YAGNI / KISS / DRY trinity.

### Shared 10-Phase Pipeline

**Phase 0 — Git Init**
Check Git is initialized; if not, use `git-manager` subagent to init (`main` branch).

**Phase 1 — Research**
Multiple `researcher` subagents in parallel → explore request, validate ideas, identify challenges, find best solutions. Reports ≤150 lines + citations.

**Phase 2 — Tech Stack**
`planner` + `researcher` subagents in parallel → find best-fit stack. Write to `./docs`.

**Phase 3 — Planning**
`planner` subagent → detailed implementation plan following the `planning` skill's progressive disclosure structure (`plans/<YYMMDD-HHmm>-<slug>/plan.md` + per-phase files).

**Phase 4 — Wireframe & Design**
`ui-ux-designer` + `researcher` subagents in parallel → design plan + wireframes. Outputs:
- `./docs/design-guidelines.md`
- `./docs/wireframe/*.html`
- Logo via `ai-multimodal` skill if not provided
- Screenshots via `chrome-devtools` skill → `./docs/wireframes/`
- Predict Google Fonts + sizes (avoid defaulting to Inter/Poppins)

**Phase 5 — Implementation**
Main agent implements plan step by step. `ui-ux-designer` for frontend. `ai-multimodal` for asset generation/analysis. ImageMagick for image edits. Type-check + compile.

**Phase 6 — Testing**
Real tests, no fake data to pass. `tester` subagent runs tests. Failures → `debugger` subagent for root cause → main agent fixes → repeat until pass.

**Phase 7 — Code Review**
`code-reviewer` subagent → critical issues → main agent improves → `tester` re-runs → repeat until pass.

**Phase 8 — Documentation**
`docs-manager` subagent updates canonical doc set (see `docs-manager` agent for the list). `project-manager` subagent creates `./docs/project-roadmap.md`.

**Phase 9 — Onboarding**
Step-by-step user configuration. Ask one question at a time, wait for answer.

**Phase 10 — Final Report**
Summary + getting-started guide + next steps. Ask user about commit/push → `git-manager` subagent.

### Variant Differences

| Variant | User interaction | Approval gates | Speed tier |
|---|---|---|---|
| `/ck:bootstrap` | High — ask questions 1-by-1, wait for tech-stack/plan/design approvals | Multiple (tech stack · plan · design · final commit) | Ultrathink |
| `/ck:bootstrap auto` | Medium — minimal questions, design approval only | Design + final commit | Ultrathink |
| `/ck:bootstrap fast` | Low — parallel research+planning, no design approval | Final commit only (no push) | Think hard |

### Shared Notes
- **Brutal honesty** — if unrealistic / over-engineered / problematic, say so directly.
- **Consider all stakeholders** — end users, devs, ops, business.
- **Sacrifice grammar for concision** in reports. List unresolved questions at end.
- **Auto-activate companion skills** as needed: `tanstack`, `react-specialist`, `deploy`, `project-organization`, etc.
