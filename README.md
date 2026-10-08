# KitForge

*Opinionated skills, agents and gated commands for Claude Code — 139 skills · 28 agents · 77 commands · 5 installable kits.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/trungdo9/ClauKit)](https://github.com/trungdo9/ClauKit/releases)

KitForge installs a curated `.claude/` into your project: commands as the entry points, skills as the method they read, agents for delegated work, and hooks that block destructive git and shell operations. Runs in Claude Code; exports to Codex and Antigravity via `ck convert`.

> The project is **KitForge**; the repo, the npm package (`@trungdo9/ClauKit`) and the CLI (`ck`, `claukit`) keep their original names.

## Install

Requires [Claude Code](https://code.claude.com), Git and Node.js ≥ 18.

```bash
npm install -g https://github.com/trungdo9/ClauKit.git   # not yet on npm
# or run once without installing: npx github:trungdo9/ClauKit init

cd /path/to/your-project
ck init                  # engineer kit (default)
ck init --kit <name>     # marketing · both · ba · hr — see Kits
claude                   # then try /ck:find <task>
```

`ck init` writes only under `.claude/`, merges hook entries into an existing `.claude/settings.json`, adds the kit's workflows to your `CLAUDE.md` (creating a stub if there is none), and adds ignore rules for regenerable plan artifacts to `.gitignore`. Re-run to update; `--force` overwrites changed files.

## Kits

| Kit | Namespace | Ships | Start with | Reference |
|---|---|---|---|---|
| `engineer` (default) | `/ck:` | 42 skills · 28 commands · 16 agents | `/ck:plan` → `/ck:cook` | [docs/](./docs/) |
| `marketing` | `/mk:` | 59 marketing + 8 sales + 2 finance + 9 automation/integration skills · 14 commands · 12 agents | `/mk:plan` (writes `plans/marketing-context.md`) | [MARKETING.md](./MARKETING.md) |
| `both` | `/ck:` + `/mk:` | engineer + marketing | — | — |
| `ba` | `/ba:` | 6 skills · 6 commands · traceability spine | `/ba:plan` (writes `plans/ba-context.md`) | [skills/ba/README.md](./skills/ba/README.md) |
| `hr` | `/hr:` | 13 skills · 11 commands · `hr-rules.md` | `/hr:plan` (writes `plans/hr-context.md`) | [skills/hr/README.md](./skills/hr/README.md) |

Marketing, BA and HR commands hard-fail until their context hub exists — run the kit's `plan` command first. `ck init --kit list` shows versions and descriptions.

## Engineer workflow

```
/ck:plan  →  /clear  →  /ck:cook  →  /ck:test  →  /ck:review  →  /ck:git cm | pr
```

| Need | Command |
|---|---|
| Don't know which tool | `/ck:find <task>` |
| Ask about the codebase · find files | `/ck:ask` · `/ck:scout` |
| Research · brainstorm options | `/ck:research` · `/ck:brainstorm` |
| Plan · verify a plan's claims | `/ck:plan [fast\|hard\|two]` · `/ck:plan verify <path>` |
| Implement a plan / spec | `/ck:cook` (resumes from `plans/<plan>/STATE.md`) |
| Debug · fix | `/ck:debug` · `/ck:fix [ci\|logs\|test\|tdd\|types\|ui]` |
| Large refactor · port from GitHub | `/ck:refactor` · `/ck:port <url>` |
| Parallel work | `/ck:team` (sessions) · `/ck:flow` (gated fan-out) |
| Docs · CLAUDE.md | `/ck:docs` · `/ck:claude-md` |
| Workspace health | `/ck:health` |

The full catalogue of skills, agents and commands is [docs/clauKit-registry.md](./docs/clauKit-registry.md).

## Safety

- **Gated commands** — `/ck:cook` and `/ck:refactor` check a clean tree, green tests and a non-`main` branch before they start.
- **Hooks** (fail open, wired in `settings.json`):
  - `guard-destructive` — blocks `reset --hard`, `clean -fdx`, `stash -u`, unguarded `DELETE`/`TRUNCATE`.
  - `branch-guard` — refuses to move HEAD while another live session shares the tree.
  - `protected-branch-guard` — refuses `push`/`merge` to `main`, `master`, `staging`, `uat`, `prod`.
- **Durable runs** — `plans/<plan>/STATE.md` lets an interrupted run resume by re-checking git and gates.

## CLI

```bash
ck init [--kit <name|list|file.json>] [--force]
ck update                              # check for a newer version
ck convert antigravity|codex [--out <dir>] [--force]
ck help
```

## Documentation

[Project overview](./docs/project-overview-pdr.md) · [Codebase summary](./docs/codebase-summary.md) · [System architecture](./docs/system-architecture.md) · [Code standards](./docs/code-standards.md) · [Roadmap](./docs/project-roadmap.md) · [Deployment](./docs/deployment-guide.md) · [Registry](./docs/clauKit-registry.md)

## License

MIT — see [LICENSE](./LICENSE). Third-party attributions: [skills/THIRD_PARTY_NOTICES.md](./skills/THIRD_PARTY_NOTICES.md).

Issues: https://github.com/trungdo9/ClauKit/issues
