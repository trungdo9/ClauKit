# Port compare — hr-skills → ClauKit `hr` kit

Decisions (user, 2026-10-07): **new `hr` kit `/hr:`** · **consolidate to ~12 domain skills, re-authored** · **keep Vietnam content with not-legal-advice guardrail**.

## Target layout (mirrors ba kit)
- `.claude/kits/hr.json` — auto-discovered by `bin/lib/kit-resolver.js`, no CLI change
- `skills/hr/<dir>/SKILL.md`, frontmatter `name: hr-<dir>`; `references/` for templates; `skills/hr/README.md`
- `.claude/commands/hr/*.md` — entry points, read skills by path
- `.claude/workflows/hr-rules.md` — jurisdiction, no statutory figures from memory, PII, no invented benchmarks, fairness, human-in-loop, read-not-activate, hard-fail pre-flight
- Hub `plans/hr-context.md` (created by `/hr:plan`), outputs `plans/hr/<slug>/`

## Mapping (146 → 13)
| ClauKit skill | Source skills folded |
|---|---|
| `context` (new) | — hub: org, jurisdictions, headcount, HRIS, policies |
| `recruiting` | talent-acquisition group (26) |
| `tech-hiring` | 20 tech-hiring specialists → one skill + per-role reference |
| `people-ops` | onboarding/offboarding/people-ops group (11) |
| `performance` | performance/talent/career group (10) |
| `rewards` | comp/benefits/rewards group (6) |
| `learning` | L&D group (7) |
| `org-change` | OD/design/change group (13) + project-management |
| `workforce-analytics` | workforce planning & analytics group (14) |
| `employee-relations` | compliance/labor relations/risk group (10) |
| `culture` | culture/engagement/wellbeing group (10) |
| `hr-technology` | HR tech/data/AI group (16) |
| `global` | global-hr, global-expansion + vietnam-context (→ references/vietnam.md) |

## Commands (11)
`plan` · `recruit` (recruiting + tech-hiring) · `people` · `perform` · `reward` · `learn` · `org` · `workforce` · `comply` (employee-relations + global) · `culture` · `tech`

## Not ported
Monorepo tooling (CLI, registry, planner, evals, web, discord bot), raw prompt libraries (distilled, not copied), duplicate skills.

## Risks
- Statutory content (Vietnam, immigration, payroll) goes stale → `[VERIFY]` markers, effective-date citations, counsel review line
- Source figures unsourced → strip / `[NEEDS DATA]`
- Kit count 4→5: tests `packagedKits() >= 4` still pass; ba-prefix rule extended to `hr-`
- No deps, no env vars
