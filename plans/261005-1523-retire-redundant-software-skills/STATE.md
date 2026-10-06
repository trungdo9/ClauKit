# STATE — retire-redundant-software-skills

- stage0: scope (user) → A retire sequential-thinking, preview, show-off, ck-graphify · B retire plans-kanban, ui-ux-pro-max, context-engineering (model-tiering.md → dynamic-workflow/references) · C merge design/aesthetic → design/frontend-design · + 5 incidental bugs · /ck:design ui-ux-pro-max flag kept, repointed to frontend-design
- baseline: 457 pass / 0 fail / 1 skip (HEAD 15f4873 + staged 4ac2a1d content) — `npm test`
- evidence: 3 Explore overlap reports (design · process · tooling) + orchestrator grep re-check of every retire candidate's inbound routes
- implement: 8 skills git-rm'd (aesthetic assets/refs → frontend-design, model-tiering.md → dynamic-workflow/references) · 31 prose files repointed · incidental fixes (security guardrails, supabase table + 3 scaffolds, 2 coverage artefacts, chrome-devtools path, research description, /ck:design shader, frontend-developer design route)
- installer: retired-files.js +44 RETIRED (full history incl. pre-symlink .claude/skills/) · +19 new / 12 merged STALE · preview + ck-graphify STALE rows dropped
- gate: npm test 457/0/1 (= baseline) · upgrade sim HEAD→tree `--kit both` no --force: 27 refreshed · 44 removed · 0 kept; `--kit ba`: BA prose refreshed
- finding (pre-existing, not fixed): installer rewrites `scripts/ck/` → `.claude/scripts/ck/` inside development-rules.md at install → installed digest never matches a git blob → file can never STALE-refresh; rewrite also yields "not root `.claude/scripts/ck/`"
- docs: dispatched docs-manager (registry, codebase-summary, system-architecture, pdr, guide/SKILLS.md, README counts 124→116)
- docs: done (registry 116/42/207, codebase-summary, system-architecture, pdr, design-guidelines, guide/SKILLS.md, README 124→116) · final gate: npm test 457/0/1 · uncommitted (user did not ask to commit)
