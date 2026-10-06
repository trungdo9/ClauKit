# Deal Strategy — Templates

Templates for [deal-strategy](../SKILL.md). Every figure is a placeholder: fill from buyer statements, CRM data, or cited sources — otherwise write `[NEEDS DATA]`. Use roles, not names (`.claude/workflows/automation-rules.md` R4).

## Deal assessment

```markdown
# Deal Assessment: [account-slug]

Stage: [stage] · Value: [amount, currency] · CRM close date: [date] · Assessed: [date]

## MEDDPICC: [X/40] (0–5 per element)

| Element           | Score | Evidence (source + date)                      | Gap / Risk                    |
|-------------------|-------|-----------------------------------------------|-------------------------------|
| Metrics           |       | [buyer-stated outcome + baseline]             |                               |
| Economic Buyer    |       | [role; direct access? when?]                  |                               |
| Decision Criteria |       | [written criteria / eval matrix?]             |                               |
| Decision Process  |       | [steps, roles, dates]                         |                               |
| Paper Process     |       | [legal / procurement / security / DPA status] |                               |
| Identify Pain     |       | [cost of inaction, in buyer's terms]          |                               |
| Champion          |       | [role; power / access / stake; hard ask passed?] |                            |
| Competition       |       | [named alternatives incl. build + do-nothing] |                               |

## Competitive zones
| Criterion | Weight (buyer) | Zone vs [competitor] | Move |
|-----------|----------------|----------------------|------|

## Verdict: [WINNING | BATTLING | LOSING | QUALIFY OUT] — [one-line reason]

## Next actions
| # | Action | Owner | Due | Closes gap in |
|---|--------|-------|-----|---------------|

## Falsification
What would show this verdict is wrong: [observable event, e.g. EB declines meeting by date]
```

## Battlecard

```markdown
# Battlecard: [Competitor]

Positioning: [Winning / Battling / Losing] · Encounter rate: [from CRM, period] · Head-to-head record: [from CRM, period]
Last verified: [date] · Sources: [links]

## Where we win
- [Differentiator]: [why it matters to the buyer]
  - Talk track: "[exact language]"

## Where we battle
- [Shared capability]: [how to create separation — speed, TCO, ecosystem]
  - Talk track: "[exact language]"

## Where we lose
- [Their genuine strength]: [repositioning — shrink its weight, never misstate ours]
  - Talk track: "[exact language]"

## Landmine questions
- "[question that surfaces a requirement where we are strongest]"

## Trap handling
- Buyer says "[competitor claim]" → "[reframe grounded in buyer's criteria]"
```

## Deal prep (before an important meeting)

```markdown
# Deal Prep: [account-slug] — [meeting] — [date]

- Objective: [the one outcome that makes this meeting a success]
- Attendees (roles): [EB / Champion / evaluators]
- What they need to hear: [tied to their stated Metrics and Pain]
- Our ask: [specific next step with date]
- Likely objections:
  1. [objection] → [response]
  2. [objection] → [response]
  3. [objection] → [response]
- MEDDPICC gap this meeting should close: [element]
- Walk-away signal: [what tells us to qualify out]
```

## Loss debrief (blameless)

```markdown
# Loss Debrief: [account-slug] — [date]

- Loss class: [Qualification | Execution | Competition]
- Where it was lost (stage + moment): [...]
- MEDDPICC at time of loss: [score + weakest elements]
- What we controlled vs. did not: [...]
- One behaviour to change next time: [specific, observable]
- Buyer feedback (if obtained): [quote, role, date]
```
