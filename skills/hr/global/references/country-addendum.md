# Country addendum and entry plan templates

Every statutory value is cited (authority + effective date) or written `[VERIFY: <law>]` — never filled
from memory (hr-rules § 2). Roles, not names (hr-rules § 3). Method: [../SKILL.md](../SKILL.md).

## Country addendum

```markdown
# Country addendum: [cc] — [country] — v[n] — [date]

Applies to: [entity / EOR / workforce segment]   Baseline: [path to global-baseline.md, version]
Conflict rule: local law applies where it gives the employee more; the baseline applies where it gives more unless local law forbids it.
Governing language of employee documents: [language] [VERIFY: local contract-language rule]
Reviewed by: [local counsel — role / firm type] on [date]   Next review: [date or trigger]

| Domain | Baseline says | Local rule (source + effective date) | Addendum text | Owner (role) |
|---|---|---|---|---|
| Contract types / fixed-term limits | | [VERIFY: ...] | | |
| Probation | | [VERIFY: ...] | | |
| Working time / overtime | | [VERIFY: ...] | | |
| Minimum wage / pay frequency | | [VERIFY: ...] | | |
| Social contributions + registration | | [VERIFY: ...] | | |
| Annual leave / public holidays | | [VERIFY: ...] | | |
| Sick / maternity / paternity / parental | | [VERIFY: ...] | | |
| Discipline procedure | | [VERIFY: ...] | | |
| Termination: grounds, notice, severance | | [VERIFY: ...] | | |
| Employee representation / consultation | | [VERIFY: ...] | | |
| Foreign workers | | [VERIFY: ...] | | |
| Income tax withholding | | [VERIFY: ...] | | |
| Employee data protection | | [VERIFY: ...] | | |
| Mandatory internal rules / registration | | [VERIFY: ...] | | |
| Customary (non-statutory) practices | | [practice, not law — state as such] | | |

## Open items
- [VERIFY items still unresolved, owner, due date]

Review with qualified employment counsel in [country] before publishing.
```

## Entry plan

```markdown
# Entry plan: [cc] — [country] — [date]

- Business case owner (role): [...]   Target first start date: [...]
- Expected headcount (planning horizon): [band]   Roles: [...]
- Entry structure: [entity | EOR | contractor] — decision record: [path]   Revisit trigger: [...]

## Phases
| # | Phase | Output | Owner (role) | Depends on | Due |
|---|---|---|---|---|---|
| 1 | Entry structure decided | entry-structure-decision.md | | | |
| 2 | Compliance research + counsel engaged | country-[cc]-addendum.md draft | | 1 | |
| 3 | Local compensation benchmark | pay ranges (hr-rewards) | | 1 | |
| 4 | Contract, addendum, handbook localised | signed-off templates | | 2 | |
| 5 | Payroll, social insurance, tax registration | provider set up, test payroll | | 1, 2 | |
| 6 | Work permits (if foreign staff) | permit timeline per person (role) | | 2 | [VERIFY: lead time] |
| 7 | Manager briefing | cultural + legal briefing held | | 2 | |
| 8 | First hire onboarded | onboarding checklist (hr-people-ops) | | 4, 5 | |
| 9 | Post-entry review | issues log, addendum v2 | | 8 | |

## Cost lines (total cost of employment)
| Line | Source | Amount |
|---|---|---|
| Gross pay (local benchmark) | [hr-rewards] | [NEEDS DATA] |
| Employer statutory contributions | [VERIFY: ...] | |
| Mandatory benefits / insurance | [VERIFY: ...] | |
| EOR fee or entity running cost | [quote] | [NEEDS DATA] |
| Set-up (legal, registration, permits) | [quote] | [NEEDS DATA] |

## Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Worker misclassification | | | | |
| Permanent establishment | | | | |
| Permit delay vs start date | | | | |

Review with qualified employment and tax counsel in [country] before acting.
```

## Monthly controls (any country)

- [ ] New hires: signed contract and complete payroll record before first pay run.
- [ ] Changes (pay, role, location) reflected in payroll, social-insurance and tax records.
- [ ] Permit and residence-card expiry dates reviewed well ahead of expiry [VERIFY: renewal lead time].
- [ ] Leavers: final pay, statutory documents returned, records retained per local retention rule.
- [ ] Policy acknowledgements current.
- [ ] HR, payroll and finance reconcile headcount before payroll close.
- [ ] Law/decree changes since last month logged against the addendum.
