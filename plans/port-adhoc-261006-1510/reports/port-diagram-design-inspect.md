# Port inspect — diagram-design

- Source: local checkout `/home/trung/workspace/project/private/diagram-design-main` (no `.git` → no SHA); upstream `https://github.com/cathrynlavery/diagram-design`, plugin v2.6.59
- License: **MIT**, © 2025 Cathryn Lavery — permissive, compatible (ClauKit MIT)
- Repo: 627 files / 19 MB. Skill payload = `skills/diagram-design/` (~5.4 MB)

## Feature map

| path | what |
|---|---|
| `SKILL.md` (30 KB) | router: style-guide gate, 44 visual types, connector rules, taste gate, import/export |
| `references/` (62 md, 844 KB) | `type-*.md` ×44 layout grammars · style-guide/onboarding/profiles · primitives · animation · import-{drawio,mermaid,excalidraw} · export · output-spec · layout-budget · semantic-patterns · doctor |
| `assets/` (211 html, 4.5 MB) | templates ×5 · icons.html · index.html gallery · examples (light 1.1 MB, dark 1.1 MB, full 1.3 MB, animated 0.6 MB) |
| `scripts/` (5 py, stdlib only) | `{drawio,mermaid,excalidraw}_extract.py` · `export_svg.py` · `self_check.py` |
| repo `scripts/verify-geometry.py` (169 l, stdlib) | connector rule 6 checker — referenced by SKILL.md but lives outside the skill |
| repo `commands/*.md` ×6 | import-{drawio,mermaid,excalidraw}, export-diagram, profile, doctor |
| repo `scripts/*` (~100), docs/, .github, plugin manifests | upstream CI/packaging — not part of the feature |

## External touchpoints
- Profiles: `~/.diagram-design/profiles/<slug>.md` + project marker `<root>/.diagram-design` — outside `.claude/`, survives `ck init` upgrades
- Style-guide working copy edited in place inside skill dir (installer `copyMissing` never rewrites → preserved)
- Google Fonts only external fetch in output HTML
- No env vars, no secrets, no network calls in scripts
