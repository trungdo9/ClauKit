---
description: Sales execution — deal strategy, discovery, demo/POC, proposals, account expansion, pipeline forecast, outbound, offer design
argument-hint: deal|discovery|demo|proposal|account|pipeline|outbound|offer <deal-account-or-goal>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub (ICP + positioning feed every sales artifact). Exceptions: `/mk:plan`, `/mk:finance`.

## Variables

ACTION: $1 (default: deal)
REST: $2..$n (deal, account, or motion slug + free-text goal)

## Workflow

Read the action's skill file below **before** starting — it is the method, not a suggestion. These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required. For the end-to-end lead pipeline use `/mk:leads` (`.claude/workflows/sales-workflow.md`), which routes to these same skills per phase.

### Actions

- **`deal`** — MEDDPICC qualification, win/battle/lose zones, deal inspection, win plan
  - Read [.claude/skills/sales/deal-strategy/SKILL.md](../../skills/sales/deal-strategy/SKILL.md)
- **`discovery`** — discovery call plan, question design, gap quantification, objection handling, call review
  - Read [.claude/skills/sales/discovery/SKILL.md](../../skills/sales/discovery/SKILL.md)
- **`demo`** — technical discovery, demo script, POC scope + success criteria, battlecard
  - Read [.claude/skills/sales/sales-engineering/SKILL.md](../../skills/sales/sales-engineering/SKILL.md)
- **`proposal`** — RFP response / proposal: win themes, executive summary, compliance matrix
  - Read [.claude/skills/sales/proposal/SKILL.md](../../skills/sales/proposal/SKILL.md)
- **`account`** — land-and-expand plan, stakeholder map, QBR, expansion whitespace
  - Read [.claude/skills/sales/account-expansion/SKILL.md](../../skills/sales/account-expansion/SKILL.md)
- **`pipeline`** — pipeline health, velocity, coverage, forecast call, pipeline-review agenda
  - Read [.claude/skills/sales/pipeline-forecast/SKILL.md](../../skills/sales/pipeline-forecast/SKILL.md)
- **`outbound`** — signal-based prospecting: ICP tiers, signals, multichannel sequence (email copy → `/mk:email cold`)
  - Read [.claude/skills/sales/outbound/SKILL.md](../../skills/sales/outbound/SKILL.md)
- **`offer`** — offer construction (value equation), lead magnets, lead-gen channel plan
  - Read [.claude/skills/sales/offer-design/SKILL.md](../../skills/sales/offer-design/SKILL.md)

## Output

Results written to `plans/sales/<slug>/<artifact>.md` (each skill's § Output names the artifact).

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced: stakeholder/contact names and emails stay in the CRM, never in committed files (see .claude/workflows/automation-rules.md R4).
- No invented win rates, conversion rates or benchmarks — cite or mark `[NEEDS DATA]` (marketing-rules § 2).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/sales-workflow.md`, `.claude/skills/marketing/README.md`.

## Examples

```
/mk:sales deal acme-renewal "score MEDDPICC, we meet the EB next week"
/mk:sales proposal globex-rfp "RFP due Friday, 3 competitors"
/mk:sales outbound mid-market-fintech
```
