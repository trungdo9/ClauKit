# Workforce Analytics — templates

Roles and pseudonyms only; rates as level-band midpoints, never an identifiable person's pay
(hr-rules § 3). Every figure is the organisation's own, cited, or `[NEEDS DATA]` (hr-rules § 4).

## Workforce plan (`workforce-plan.md`)

```markdown
# Workforce Plan: <slug> — horizon <FY..FY> — v<n> <date>
- Strategy source: <document + version>  ·  Scope: <entities, countries, functions, worker types>
- Owners: HR <role> · Finance <role> · Business <roles>

## Demand (range per year)
| Function | Level | Location | Now | Y1 low–high | Y2 low–high | Net-new role types |

## Supply projection (no action)
| Segment | Now | Exit rate used (source) | Moves in/out | Committed starts | Y1 | Y2 |

## Gaps
| Gap | Type (volume/capability/distribution/timing) | Size | Lead time | Criticality | Risk if open |

## Levers
| Gap | Build | Buy | Borrow | Bot | Owner | Milestone |

## Risk register
| Risk | Likelihood | Impact | Leading indicator | Mitigation | Owner |

## Decisions requested
1. <decision> — by <role>, by <date>

## Assumptions (each with source)
```

## Headcount request

```text
Role / level / location:
Function and budget owner (role):
Type: replacement | approved growth | critical capability gap | speculative
Target start quarter:                Planned rate: band <x> midpoint
Business outcome supported:
Work this role owns:
Impact if not approved (counterfactual):
Alternatives considered (contract, automation, reprioritise, internal move):
Dependencies:                        Expected ramp time:
```

Scoring (1 / 3 / 5): business impact · urgency · risk if delayed · no credible alternative · budget fit.
Outcome: approve · defer to <date> with review criteria · decline.

## Forecast assumption log (`forecast.md`)

| Driver / assumption | Value | Derived from (data, period) | Owner | Last checked | Sensitivity |
|---|---|---|---|---|---|

Accuracy log per period: function · forecast · actual · volume error · timing error · cause.

## Scenario model (`scenarios.md`)

```markdown
| Assumption | Base | Upside | Downside | Disruption |
|---|---|---|---|---|
| Revenue path | | | | |
| Expansion pace | | | | |
| Automation adoption | | | | |
| Talent availability / cost | | | | |

| Function | Now | Base Y1 | Upside Y1 | Downside Y1 | Disruption Y1 |
| Workforce cost vs current | | | | | |

## Triggers
| From → to | Observable signal | Threshold (from own plan) | Checked by | Cadence |

## Pre-planned actions
| Scenario | Action | Reversible? | Activated by (role) | Within | Dependencies |
```

## Model card (`model-card.md`) — any predictive model on people

```markdown
# Model card: <name> v<n>
- Purpose and decision supported:            - Not to be used for: performance rating, pay, discipline, exit
- Population and segments:                    - Target and horizon: <voluntary exit within n months>
- Features (and proxies excluded, why):
- Training window / test window (time-based split):
- Performance: precision in top tier · recall at action threshold · calibration · vs simple baseline
- Fairness: flag rate and error rates by group (where lawful) · adverse-impact result · mitigations
- Action per risk tier:                       - Human reviewer (role):
- Access (roles) · retention/purge rule · employee disclosure [VERIFY: jurisdiction]
- Revalidation date · retirement trigger
- Approvals: HR <role> · privacy <role> · legal <role>
```

## People budget (`people-budget.md`)

```markdown
## Assumptions agreed with finance (date, signatories by role)
| Assumption | Value | Source |
| Merit timing / % | | |
| Attrition by segment | | |
| Backfill delay | | |
| Employer contributions | [VERIFY: <country law, year>] | |

## Role-level plan
| Status (approved / planned-not-approved) | Function | Level | Location | Start month | Rate (band mid) | Multiplier | Annualised | In-year |

## Monthly run-rate  (Jan … Dec, approved vs total)

## Variance narrative
| Driver | Amount | One-time / recurring | Explanation | Action |
```

## Headcount business case

```markdown
1. Value hypothesis: <capacity, risk reduced, cost avoided — with own data>
2. Cost: fully loaded range (low–high) per year, time-phased
3. Counterfactual: cost of not hiring (overtime, contractors, delay, attrition risk)
4. Value ramp: month-by-month contribution assumption
5. Sensitivity: two weakest assumptions, ±
6. Payback period and decision requested
7. Alternatives compared: hire · contract · automate over the same horizon
```

## Schedule design (`schedule-design.md`)

```markdown
| Time block | Forecast volume | Handle time | Required concurrent staff |
FTE = weekly coverage hours ÷ contracted hours per FTE ÷ (1 − shrinkage <from own data>)

Pattern: <fixed / rotating / compressed / 24/7 rotation> · rotation rule for nights/weekends/holidays

Rule check (each [VERIFY: <jurisdiction> working-time law]):
- [ ] Daily / weekly hour limits      - [ ] Rest between shifts      - [ ] Weekly rest day
- [ ] Night-work rules                 - [ ] Overtime threshold + premium
- [ ] Advance notice of schedule / change compensation   - [ ] On-call / standby pay

T&A controls: missed-punch flags · neutral rounding · edit audit trail · approval delegate ·
pre-payroll reconciliation · overtime pre-approval · time-zone rule · biometric/geo data basis
```
