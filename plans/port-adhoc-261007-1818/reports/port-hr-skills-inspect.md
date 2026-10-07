# Port inspect — tuanductran/hr-skills

Source: https://github.com/tuanductran/hr-skills (local copy `../hr-skills-main`, no .git → no SHA; package `hr-skills-monorepo` 1.4.0) · **MIT © 2026 Tuan Duc Tran** → compatible with ClauKit MIT.

## Shape
- 146 skills `skills/hr-*/SKILL.md` (~900KB) + 680 companion files: `prompts/` 330 · `content/` 178 · `examples/` 172 (~7.7MB total)
- Root `SKILL.md` router (44KB) → 12 domain groups
- Bun/Turborepo monorepo: CLI, registry, planner, web app, discord bot — **none ported** (ClauKit installer + registry replace them)

## Quality
- SKILL.md = "Supported tasks" + "Key prompts" lists — fill-in-the-blank prompt libraries, little method
- `prompts/*.md` = templated `[insert verb]` prompt strings, some mislabeled (recognition-events file opens with sourcing text)
- `content/` + `examples/` hold the actual method (staged workflows, checklists, adaptation notes) → main input for re-authoring
- Heavy overlap: recruiting / talent-acquisition / recruitment-operations; workforce-planning / strategic-workforce-planning / workforce-forecasting / scenario-planning; ai-* (7)
- Typos ("useed"); no cited sources for figures
- 20 "tech hiring" skills (backend, game-dev, iot, blockchain…) = recruiter primers on tech roles

## Domain groups (source router)
| Group | n |
|---|---|
| Talent acquisition & recruiting | 26 |
| Onboarding, offboarding & people ops | 11 |
| Performance, talent & career | 10 |
| Compensation, benefits & rewards | 6 |
| Learning & development | 7 |
| Org development, design & change | 13 |
| Workforce planning & analytics | 14 |
| HR technology, data & AI | 16 |
| Compliance, labor relations & risk | 10 |
| Culture, engagement, experience, wellbeing | 10 |
| Project mgmt & global/local | 4 |
| Software-engineering & tech hiring | 20 |
