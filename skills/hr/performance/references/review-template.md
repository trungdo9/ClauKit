# Review cycle and review template

Used by `/hr:perform review` and `/hr:perform calibrate`. Cycle design → `plans/hr/<slug>/review-cycle.md`;
calibration record → `plans/hr/<slug>/calibration.md`. Individual reviews in `plans/hr/` use pseudonyms;
final named reviews live in the review tool / HRIS (hr-rules § 3).

## 1. Rating scale definitions (publish before anyone drafts)

Example 4-point scale — adapt wording, keep one definition per level:

| Rating | Definition |
|---|---|
| 4 — Exceptional | Consistently exceeds the role's expectations across the period, with specific evidence of impact beyond core scope |
| 3 — Meets expectations | Reliably delivers the role's goals and responsibilities across the period. A strong, respected rating — most people performing well land here |
| 2 — Partially meets | Delivers some goals, with clear, specific gaps that need a development plan |
| 1 — Does not meet | Consistent, significant gaps in core responsibilities; formal support needed (PIP fitness test) |

Rate observed behaviour and results for the role level — not potential, tenure or likeability.

## 2. Manager note (send with the definitions)

```text
Before drafting reviews:
- Read the rating definitions. "Meets expectations" is a strong rating to give and receive.
- Rate the FULL period — pull notes and check-ins from the start and middle, not just recent weeks.
- Support every rating with specific evidence: what happened and the business impact.
- Leave out anything about age, health, leave, family or other personal circumstances.
- Ratings go through calibration — treat yours as a well-supported first draft.
```

## 3. Bias self-check (manager, before submitting)

| Bias | What it looks like | Check |
|---|---|---|
| Recency | Rating driven by the last few weeks | Did I review notes from the whole period? |
| Halo | One strength lifts every area | Is each area rated on its own evidence? |
| Horn | One weak area drags everything down | Am I weighing the whole picture, not one bad project? |
| Similarity | Favouring people who work like me | Would I rate this the same for a very different working style? |
| Leniency / severity | Everyone high, or everyone low | How does my spread compare with last cycle and peers? |
| Central tendency | Everyone "meets" to avoid hard conversations | Does the evidence really put each person in the middle? |
| Visibility | Office presence read as performance | Am I rating outcomes, or how often I see them? |

## 4. Review template

```markdown
# Review — Employee A — [period]

Role: [title]   Level: [ ]   Manager: [role]   Period: [start–end]

## Overall summary
[2–4 sentences covering the whole period: main results, main development area, overall rating rationale.]

## Strengths (2–3, each with evidence)
- [Strength] — [what happened, when] — [impact]

## Development areas (behaviour → impact → action)
- [Observed behaviour, with examples] → [business impact] → [specific suggested action]

## Goals review
| Goal | Status (met / partly / not met) | Outcome | Evidence |
|---|---|---|---|

## Competencies (if used)
| Competency | Rating | Supporting example (required) |
|---|---|---|

## Development plan
| Action | Owner | Support | By when |
|---|---|---|---|

## Next-period goals (3–5, SMART, linked to team key results)
1. [ ] → serves [team KR]

## Employee comments
[ ]

Draft rating: [ ]   Calibrated rating: [ ]
```

## 5. HR screen before calibration (send back if any box ticks)

- [ ] Superlatives or labels without evidence ("rockstar", "great", "difficult")
- [ ] High rating with no goals, outcomes or measurable impact named (possible halo)
- [ ] No development area at all
- [ ] Evidence only from the last weeks of the period
- [ ] Personality judgments or guesses about motive
- [ ] Any mention of age, health, leave, family, pregnancy, religion, nationality
- [ ] Development plan without action, owner or date

Questions back to the manager: "Which two or three outcomes support this rating?" · "What is one
area to grow in, even if minor?" · "How does this compare with similar performance last cycle?"

## 6. Calibration agenda

```text
Attendees: managers of the population + HR facilitator      Time: set so flagged cases get real discussion
Before:
- HR compiles all draft ratings in one view, grouped by manager
- HR flags: unusual manager spreads, unsupported ratings (section 5), big changes from last cycle
- Authorised analyst prepares the group distribution check (section 7) — aggregate only
During:
1. Restate rating definitions (2 min)
2. Flagged cases first
3. Manager states rating + evidence; challenges must cite evidence
4. Facilitator runs bias prompts (section 3) where relevant
5. Quick confirmation round for unflagged cases
6. Review the group distribution check; re-examine evidence where gaps appear
7. HR records final rating + one-line rationale for each change
After:
- Ratings locked; rationale shared with the relevant manager only
- Managers get talking points; they own the delivered rating
```

## 7. Calibration record — aggregate only (`calibration.md`)

```markdown
## Distribution by manager (no names of employees)
| Manager (role/pseudonym) | n | % rated 4 | % rated 3 | % rated 2 | % rated 1 | Changed in calibration |

## Group distribution check (hr-rules § 5)
Groups analysed: [gender, age band, part-time, recent protected leave, remote/office, other where lawful — VERIFY: <country> law]
Minimum cell size for reporting: [N] — smaller cells suppressed
| Group | n | % top rating | Ratio vs highest group | % bottom rating | Flag |
Screen used: [ratio of rates — a ratio below four-fifths is a US rule-of-thumb signal (29 CFR 1607.4(D)); passing it does not prove absence of adverse impact `[VERIFY: jurisdiction]`]
Findings: [where gaps appeared, which cases were re-examined, outcome of re-examination]
Not done: adjusting ratings to hit group quotas.

## Change log
| Case (pseudonym) | Draft | Final | One-line rationale |
```

## 8. 360 / upward feedback design

- Raters: chosen with employee and manager input; peers, direct reports, cross-functional partners.
- Items: behavioural ("gives me feedback that helps me improve"), not traits ("is a good leader").
- Anonymity: minimum respondent count set in policy; comments screened for identifying detail.
- Use: developmental unless stated otherwise before collection; debrief with a coach or HRBP; the
  person sees their results.
- Follow-through: two or three behavioural commitments, revisited at the next cycle.
