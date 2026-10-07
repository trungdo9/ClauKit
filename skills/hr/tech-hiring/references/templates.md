# Tech hiring templates

Fill per role. Candidate references use pseudonyms (`Candidate B`); names, CVs and contact details stay in
the ATS (hr-rules § 3). Method: [../SKILL.md](../SKILL.md).

## Intake

```markdown
# Tech intake: [role-slug] — [date]

- Hiring manager (role): [e.g. Head of Data]   Technical assessor(s) (role): [...]
- Jurisdiction / location / remote policy: [from plans/hr-context.md]
- Family + primary track: [one, from role-primers.md]
- Bundled asks split out: [tracks moved to other reqs or to nice-to-have]

## Outcomes (6–12 months)
1. [observable outcome]
2. [observable outcome]

## Must-have (2–3, each tied to an outcome)
- [skill] → outcome [n]
## Nice-to-have
- [...]
## Platform / ecosystem specifics
- [exact platform; acceptable transferable backgrounds]

## Level by scope
- Scope: [component | feature/service | system | multi-team domain]
- Level in job architecture: [from hr-rewards]

## Conditions to state in the JD
- On-call: [...]  Crunch/overtime: [...]  Lab/hardware: [...]  Travel: [...]  Clearance: [...]

## Reject reasons (job-related only)
- [...]
## Not a fit if
- [one honest line]
```

## Scorecard

One sheet per interviewer per stage. Anchors written before the first candidate. No overall score until each dimension is scored with evidence.

```markdown
# Scorecard: [role-slug] — [stage] — Candidate [pseudonym]

Interviewer (role): [...]   Date: [...]

| Dimension | 1 — Not shown | 2 — Partial | 3 — Meets level | 4 — Above level | Score | Evidence (quote / observation) |
|---|---|---|---|---|---|---|
| Technical depth (family must-haves) | Terms only | Used with guidance | Owned in production | Shaped others' approach | | |
| Design & trade-offs | No alternatives | Names options | Chooses with costs stated | Anticipates second-order effects | | |
| Production / operational maturity | Happy path only | Aware of failure modes | Handles, measures, recovers | Prevents systemically | | |
| Collaboration & influence | Solo framing | Cooperates | Aligns adjacent roles | Influences without authority | | |
| Communication | Hard to follow | Clear when prompted | Clear and structured | Adapts to audience | | |

Must-pass dimensions for this level: [set in calibration]
Recommendation: [strong yes | yes | no | strong no] — one line, tied to evidence above.
```

## Take-home / exercise brief

```markdown
# Exercise: [role-slug]

- Format: [take-home | live pairing | portfolio walk-through] (candidate may choose where offered)
- Expected time: [cap set and tested by the hiring team] — stop at the cap; partial is fine.
- Task: [synthetic, self-contained problem close to the real job — never real backlog work]
- What we assess: [dimensions from the scorecard]
- AI assistants: [allowed with disclosure | not allowed] — [why]
- Adjustments: tell us what you need (time, format, tooling) — no reason required.
- Paid: [yes, amount per policy | no — alternative format offered]
- Ownership: your work stays yours and is not reused.
- Follow-up: [n]-minute discussion of your submission.
```

## Calibration session

1. Share the rubric and anchors; agree must-pass dimensions for the level.
2. Each interviewer scores the same sample transcript or submission **independently**.
3. Reveal scores; discuss gaps dimension by dimension against the anchors, not against intuition.
4. Write down example strong / adequate / weak answers for each prompt.
5. Repeat until scores converge; re-run when new interviewers join or prompts change.

## Debrief note

```markdown
# Debrief: [role-slug] — Candidate [pseudonym] — [date]

| Stage | Interviewer (role) | Scores per dimension | Key evidence |
|---|---|---|---|

- Independent scores submitted before discussion: [yes/no]
- Must-pass dimensions met: [list]
- Concerns raised and how resolved: [...]
- Decision: [hire at level X | no hire | different req/level — which]
- Rationale against the rubric: [...]
- Decided by (role): [...]   AI used for: [summarising notes only | none]
```
