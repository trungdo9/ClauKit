# Rewards templates

Fill from the organisation's own data. Every figure is cited (source + effective date), derived from own data (say so), or `[NEEDS DATA]`. No names or individual salaries in `plans/hr/` (hr-rules § 3).

## Levelling guide (one family)

```markdown
# Levelling guide: <family> — <date>
Level spine: L1–L<n> | Track: IC / Manager | Crossover level: L<x>
Dimensions: Scope · Complexity · Impact · Autonomy

| Level | Title | Scope | Complexity | Impact | Autonomy |
|---|---|---|---|---|---|
| L1 | <title> | <observable> | <observable> | <observable> | <observable> |
| L2 | ... | | | | |

Adjacent-level test: for each row pair, one sentence that L(n) cannot claim.
Governance: title owner <role> · new-title sign-off <roles> · calibration <cadence> · title audit <cadence>
```

## Range table

```markdown
# Pay structure: <family / zone> — effective <date>
Philosophy: target P<__> for <role group> (source: <survey, date>)

| Grade | Market ref (aged to <date>) | Midpoint | Spread | Min | Max | Midpoint progression | Overlap with next |
|---|---|---|---|---|---|---|---|
| G1 | <value> [src] | | | | | | |

Formulas: min = 2·mid/(2+spread) · max = min·(1+spread) · progression = (mid₍n+1₎−mid₍n₎)/mid₍n₎
Health (aggregate only): # below min __ · # above max __ · compa-ratio by cohort __
```

## Benchmark worksheet

```markdown
# Benchmark: <benchmark job> — <date>
Definition: family · level · scope · reporting line · pay zone · key skills

| Source | Job code | Match grade (exact/close/adjusted) | Adjustment + reason | Sample n | Effective date | Aged value | Weight |
|---|---|---|---|---|---|---|---|

Aging: aged = reported × (1 + movement)^(months/12); movement source: <vendor projection / own data>
Blend: Σ(weight × aged value); weights fixed before results
Position: target P__ → <value>; current internal position (aggregate compa-ratio) __
Reconciliation with internal equity: <same story / different story — why>
Confidence: high / medium / low — <reason>
Recommendation: <adjust range / hold / exception with expiry>
```

## Benefits vendor matrix

| Criterion | Weight | Current | Option B | Option C |
|---|---|---|---|---|
| Total cost (per head, renewal trend) | | | | |
| Coverage / quality | | | | |
| Employee tools and support | | | | |
| Data protection terms | | | | |
| Admin effort / integration | | | | |
| Statutory compliance in <jurisdiction> `[VERIFY]` | | | | |

## Plan-change communication sequence

| Step | Timing | Message | Owner |
|---|---|---|---|
| Advance notice | <date> | What changes, why, what carries over | |
| Legal notice (if any) | `[VERIFY: required period]` | Dedicated message, not bundled | |
| Action needed | <date> | Elections that do not transfer | |
| Go-live | <date> | Access, contact, confirmation | |

## Total rewards statement (template, generated per person in HRIS)

```markdown
# Your total rewards — <period>
Base pay ............................ {base}
Variable pay (target / actual) ....... {target} / {actual}
Equity (granted / vested; method) ... {granted} / {vested}; valued at {method}
Employer-paid benefits .............. {itemised}
Retirement contributions ............ {employer amount}
Statutory employer contributions .... {itemised per jurisdiction}
Time off ............................ {days by type}
Development ......................... {spend / programmes}
Also: flexibility, recognition, wellbeing support
Valuation assumptions: <...>. This statement is informational and is not a contract.
```

## Pay-equity review

```markdown
# Pay-equity review: <scope> — <date>
Set-up: counsel <role> · privilege <yes/no> · access list <roles> · lawful demographic fields <list>
Legitimate factors (fixed in advance): <level, family, pay zone, time in role, documented performance>
Factors needing justification: <prior pay, premiums, counteroffers>
Cohort rule: family × level × pay zone; minimum size <agreed n> → below = qualitative review
Model: pay ~ factors; residual tested by group; base and total cash run separately
Significance threshold: <agreed with analyst>

## Findings (aggregate)
Cohorts analysed __ · cohorts below minimum __ · flagged employees (count) __
Root-cause categories: levelling __ · hiring __ · progression __ · offer discretion __ · ratings __

## Remediation
Tolerance <agreed with counsel + finance> · budget line (separate from merit) __ · date __
Included / excluded-with-reason / second-review counts: __ / __ / __

## Governance
| Check | Owner | Frequency |
|---|---|---|
| Offer vs band and incumbents | | Every offer |
| Model re-run | | Before each merit cycle |
| Levelling consistency audit | | |
| Promotion rate + pay outcome by group | | |
| Leadership / board update | | |

Review with qualified employment counsel (or the relevant authority) before acting.
```

## Recognition program one-pager

```markdown
# Recognition program: <name>
Purpose / values reinforced: <...>
Layers: day-to-day · peer · team · milestone · organisational — owner each
Recognition vs reward: <what is appreciation-only; what carries monetary value; tax `[VERIFY]`>
Criteria per award: <observable behaviour tied to value>
Budget model: <per head / pool> [own data or NEEDS DATA]
Equity audit: distribution by team, role type, location, work pattern — cadence <__>
Metrics: health (active senders, spread) · outcome (engagement items, attrition by team)
```
