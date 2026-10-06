# Sales Engineering — Templates

Templates for [sales-engineering](../SKILL.md). Every figure is a placeholder — fill from discovery notes, agreed criteria, or cited sources, else `[NEEDS DATA]`. Roles, not names (`.claude/workflows/automation-rules.md` R4).

## Evaluation notes

```markdown
# Evaluation Notes: [account-slug] — updated [date]

## Technical environment
- Stack: [languages, frameworks, infrastructure]
- Integration points: [APIs, databases, middleware, IdP]
- Security requirements: [SSO/SCIM, certifications required, residency, encryption]
- Scale: [users, data volume, throughput]

## Technical decision makers
| Role | Priority | Disposition (Favorable / Neutral / Skeptical) |
|------|----------|-----------------------------------------------|

## Discovery findings
- [requirement] — [why it matters to them]
- [constraint] — [how it shapes the solution]
- [performance requirement] — [threshold]

## Technical competitive landscape
- [Competitor]: [their technical positioning in this deal]
- Differentiators to emphasise: [mapped to buyer priorities]
- Landmines asked / learned: [...]

## Demo / POC strategy
- Primary narrative: [...]
- Aha-moment target: [capability]
- Risk areas: [objections to prepare]
```

## Demo plan

```markdown
# Demo Plan: [account-slug] — [date]

Audience (roles): [...] · Length: [min]

| Buyer pain (their words, source) | Capability shown | Outcome shown first | Proof (cited) |
|----------------------------------|------------------|---------------------|---------------|

- Opening restatement of the problem: "[...]"
- Aha-moment target: [capability] — placed at [point in arc]
- Deep-dive path (if asked "under the hood"): [...]
- Known gaps + honest answer: [...]
- Ask at close: [specific next step + date]
```

## POC plan

```markdown
# Proof of Concept: [account-slug]

## Problem statement
This POC proves [product] can [capability] in [buyer environment] within [timeframe], measured by [criteria].

## Success criteria (agreed in writing with buyer on [date])
| Criterion | Target | Measurement method |
|-----------|--------|--------------------|
| [capability] | [quantified target] | [how measured] |
| [integration] | Pass / Fail | [test scenario] |
| [performance] | [threshold] | [load test / timing] |

## Scope
- In: [features, integrations, workflows]
- Explicitly out: [what is not tested, and why] → phase two candidates

## Timeline (adjust to agreed length)
- Setup and configuration
- Core use case implementation
- Midpoint review with buyer — criteria re-confirmed
- Refinement and edge cases
- Final readout + decision meeting

## Data
Test data source: [buyer-approved test/synthetic data — no production PII unless contractually covered]

## Decision gate
At the readout the buyer makes a GO / NO-GO decision against the criteria above.
Owner (buyer role): [...] · Readout date: [...]
```

## Technical battlecard (FIA)

```markdown
# Technical Battlecard: [Competitor] — last verified [date]

| Fact (source, date) | Impact for buyers like this | Act (talk track / question / demo moment) |
|---------------------|-----------------------------|-------------------------------------------|

## Technical zones
- Winning: [...]
- Battling: [...] → separate on [implementation speed / ops overhead / TCO]
- Losing: [...] → acknowledge + reframe on [buyer's primary driver]

## Landmine questions
- "[...]"
```
