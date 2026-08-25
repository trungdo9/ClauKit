# Battle Card Template

A battle card is a competitor profile compressed to what someone needs mid-conversation. It is generated **from** a completed profile in `plans/marketing/<research>/competitors/<slug>.md` — never researched independently.

Absorbed into [[competitor-profiling]] because ClauKit ships no `sales-enablement` skill (upstream routed battle cards there).

## Rules

1. **No new facts.** Every competitor claim on the card must already appear, sourced, in the profile. If it is not in the profile, it does not go on the card.
2. **No disparagement.** Weaknesses are stated as sourced observations ("their G2 reviews recur on onboarding time"), never as insults or unverifiable claims. A rep will repeat this verbatim to a prospect.
3. **Their strengths stay on the card.** A card that pretends the competitor is bad gets a rep ambushed. Name what they genuinely win on and how to respond honestly.
4. **One page.** If it does not fit on a screen, it will not be read in a live call.
5. **Dated.** Pricing and feature claims go stale fastest; a card older than its profile is a liability.

## Template

```markdown
# Battle Card: [Competitor] vs. [Your Product]

**Generated**: [YYYY-MM-DD] · **From profile**: `[slug].md` (generated [date])

## One-liner
[Competitor] is [what they are] for [who]. We win when [the condition]; we lose when [the condition].

## Their pitch (in their words)
> "[homepage headline + subheadline, verbatim]"

Positioning angle: [inferred angle]
Primary audience: [inferred audience]

## Where they genuinely win
| They are strong at | Our honest response |
|---|---|
| [strength, sourced] | [what we say — concede, then reframe] |

## Where we win
| We are strong at | Proof we can cite |
|---|---|
| [our advantage] | [our own evidence — case study, metric, feature] |

## Their weaknesses (sourced)
- [weakness] — evidence: [source, e.g. recurring G2 complaint theme]
- [weakness] — evidence: [source]

## Pricing comparison
| | Us | [Competitor] |
|---|---|---|
| Entry | | |
| Mid | | |
| Enterprise | | |
| Billing model | | |
| Free tier / trial | | |

Pricing talk track: [how to frame the difference without misquoting their published prices]

## Landmine questions
Questions that surface their weaknesses without attacking them:
1. "[question]" — surfaces [weakness]
2. "[question]" — surfaces [weakness]

## Objection handling
| They say | We say |
|---|---|
| "[Competitor] has [feature] and you don't" | [honest response — roadmap, workaround, or why it does not matter for this ICP] |
| "[Competitor] is cheaper" | [value reframe grounded in the pricing table above] |

## Do not say
- [claims about the competitor we cannot source — list them explicitly so nobody improvises]

## Trigger to refresh
Re-generate when the profile is re-run, or immediately if their pricing page changes.
```

## Cross-references

- `profile-templates.md` — the SWOT and Competitive Implications sections feed this card directly
- [[competitors]] — the public-facing version of the same comparison (different audience, different rules)
