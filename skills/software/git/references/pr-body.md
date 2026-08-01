# pr-body.md — ClauKit default PR description template + fill contract

The default body for `/ck:git pr` step 3. A project may override the template via its CLAUDE.md; the **fill contract** below applies either way. 8 placeholders, **no tracker field** (the branch name, PR title, and the tracker's own PR link carry ticket linkage), **no AI-attribution footer** (uniform rule: commits, PR bodies, and trailers are free of AI references — `development-rules.md` + `includeCoAuthoredBy: false`).

## Template

```markdown
## Problem

{{problem_statement}}

## Approach

{{approach_bullets}}

## Tradeoffs & decisions

{{tradeoffs_bullets}}

## Review focus

{{review_focus_bullets}}

## Plan

- Plan file: [{{plan_path}}]({{plan_path}})

## Testing

- **What was tested**: {{testing_what}}
- **How it was tested**: {{testing_how}}
- **Edge cases**: {{testing_edge_cases}}
```

## Fill contract — every placeholder has ONE upstream source

Each field is **transcribed** from an artifact the pipeline already produced, never composed at PR time. That is what stops the body being plausible prose.

| Placeholder | Source of truth | Rule |
|---|---|---|
| `{{problem_statement}}` | the **CONFIRMED** root cause from `plans/<plan>/reports/plan-verification.md` (verify-plan gate) | never the initial hypothesis — a wrong root cause shipped in 3 merged PRs; the body carries the cause that survived falsification, with its evidence citation |
| `{{approach_bullets}}` | the scope option the user **picked** in the scope-lock A/B table | state which option, and the repos/layers it touches |
| `{{tradeoffs_bullets}}` | the **rejected** option from the same A/B table + why | the gate already produced this content; do not re-derive it |
| `{{review_focus_bullets}}` | `STATE.md` parked/deferred findings + blast-radius areas from review lenses + anything still `[UNVERIFIED]` | where a reviewer's attention is genuinely needed — honest about what was *not* proven |
| `{{plan_path}}` | the plan directory | repo-relative. **The plan must be committed or the link 404s** — verify before writing the body. No plan (hotfix, one-liner) → write `Plan file: none — <reason>`, never an empty link |
| `{{testing_what}}` | `tester` report | the suites/cases actually executed |
| `{{testing_how}}` | verbatim command + result | Iron Law: the command and its output, not "ran the tests" |
| `{{testing_edge_cases}}` | `scenario` skill output (≥1 happy + ≥1 negative + ≥1 recovery) | list them; a skipped class is named with the reason |

## No-placeholder rule

An unfilled `{{...}}` must never reach a PR. A section with genuinely nothing to say is written as an **explicit negative** — `Tradeoffs: none — single viable approach given <constraint>` — because inventing tradeoffs to fill a heading is exactly the padding the evidence gates exist to prevent.
