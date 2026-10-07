# Org Design & Change — Templates

Templates for [hr-org-change](../SKILL.md). Every figure is a placeholder: fill from the organisation's own data or a cited source, otherwise write `[NEEDS DATA]`. Roles or pseudonyms only, never names (`.claude/workflows/hr-rules.md` § 3). Statutory items carry `[VERIFY: <law>]` (§ 2).

## Options appraisal (`design`)

```markdown
# Org Design: [unit] — [date]

Scope: [unit, countries, headcount band] · Sponsor: [role] · Decision by: [date]

## Design criteria (written before options)
1. [testable statement]
2. ...

## Current state
Layers CEO → front line: [n] · Managers with ≤2 reports: [n] · Spans by role family: [from org data]
Decisions that stall: [decision — where it stalls — evidence]

## Options
| Criterion | Option A: [name] | Option B: [name] | Option C: minimal change |
|-----------|------------------|------------------|--------------------------|
| [criterion 1] | meets / mitigable / fatal | | |
| Transition cost & risk | | | |
| Roles removed or materially changed? | yes/no → hr-employee-relations `exit` | | |

## Recommendation: [option] — [one-line reason]
Not recommended: [option] because [reason]

## Decision rights (one A per row)
| Decision | R | A | C | I |
|----------|---|---|---|---|

## Transition plan
| Step | Owner | Date | Dependency |
|------|-------|------|------------|

*Review with qualified employment counsel (or the relevant authority) before acting.* (if roles change)
```

## Change-impact assessment (`change`)

```markdown
| Stakeholder group (role) | Size band | Process | Systems | Role/skills | Reporting line | Location | Terms | Overall | Stuck ADKAR stage | Support action | Owner |
|--------------------------|-----------|---------|---------|-------------|----------------|----------|-------|---------|-------------------|----------------|-------|
| [group]                  |           | H/M/L   | H/M/L   | H/M/L       | H/M/L          | H/M/L    | H/M/L | H/M/L   | A/D/K/A/R         |                |       |
```

Stakeholder map: influence (H/L) × impact (H/L) → manage closely · keep satisfied · keep informed · monitor. Add per group: what they lose (Bridges "ending"), likely stance, owner.

## Communication matrix (`change`)

```markdown
| # | Audience | Message (headline) | Channel | Sender | Date | Precondition | Feedback route |
|---|----------|--------------------|---------|--------|------|--------------|----------------|
| 1 | Directly affected roles | [personal impact] | 1:1 | Manager + HR | D0 | Managers briefed | 1:1 follow-up |
| 2 | Managers of affected teams | [context + toolkit] | Briefing | Sponsor | D-[n] | Leadership aligned | Manager Q&A log |
| 3 | Wider organisation | [narrative] | All-hands | Sponsor | D0 after #1 | #1 complete | Anonymous Q&A |
```

Announcement skeleton: what is changing · why now · what it means for you · what is not changing · what happens next (dates) · where to ask (named channel).

## Manager toolkit (`change`)

```markdown
# Manager Toolkit: [change] — CONFIDENTIAL until [date]

Key messages (3): ...
What you can say / what you cannot say yet: ...
Likely questions → honest answers:
- "Will there be more changes?" → [only what is decided]
- "Is my job safe?" → [confirm if known; else "I will come back by <date>"]
- "Why weren't we told sooner?" → [constraint, without defensiveness]
Escalate to HR when: [protected-characteristic concern, distress, legal question]
Support resources: [EAP, HR contact]
```

## Stabilisation status report (`change`, `design`, `ma`)

```markdown
# [Change] — Day [30/60/90] Status — [date]

Summary (3 sentences): status · biggest risk · focus to next checkpoint
Adoption: [decision rights used unprompted? tool usage? reversion to old patterns?]
People: voluntary exits since announcement [n, vs own baseline] · pulse result · flagged cases (pseudonyms)
Delivery: [metric vs pre-change baseline]
| Risk | Likelihood H/M/L | Action | Owner | Due |
Next checkpoint targets: 1. ... 2. ... 3. ...
```

## HR project charter + RACI (`transform`)

```markdown
# Project Charter: [initiative]

Sponsor: [role] · Lead: [role] · Version: [n] · Approved: [date]
Objective: [one sentence, business outcome]
In scope: ... · Out of scope: ... (named, to stop creep)
Success criteria (measurable): 1. ... 2. ...
Deliverables & milestones:
| Milestone | Date | Acceptance criterion |
Governance: steering committee [roles, cadence] · working group [roles, cadence] · escalation [path]
Change control: [who approves scope/date/budget changes]
Budget: [amount or NEEDS DATA]

## RACI (one A per deliverable)
| Deliverable | HR | IT | Finance | Legal | Business | Comms |
|-------------|----|----|---------|-------|----------|-------|

## Risk log (reviewed every status cycle)
| Risk | L (1–5) | I (1–5) | Score | Mitigation | Owner | Status |

Go-live readiness: data validated · training complete · support coverage · rollback plan · comms sent
Post-implementation review date: [date] · Lessons-learned owner: [role]
```

## Crisis playbook skeleton (`transform`)

```markdown
# HR Crisis Playbook — [scenario type]

Activation criteria: [what makes this a crisis, not a normal incident]
Crisis team: lead [role] · legal [role] · comms [role] · employee support [role] · security/facilities [role]
Decision authority:
| Decision | Decides | Consulted |
|----------|---------|-----------|
| External statement | | |
| Site closure / remote switch | | |
| Pay/leave flexibility activation | | |
Escalation: HR → exec within [internal target] → board when [trigger]
External contacts (kept outside committed files): counsel · EAP · investigators · PR
First hour: confirm facts · convene · safety check · notification order · what can be said now
Templates: first employee message · manager talking points · update cadence
After-action review: [date, owner] — what worked, what to change, playbook update
```
