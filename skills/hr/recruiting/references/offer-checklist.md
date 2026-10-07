# Offer checklist

Companion to the `hr-recruiting` skill file (action `offer`). The offer plan in `plans/hr/<slug>/`
holds structure, bounds and the close plan; the named candidate's amounts live in the HRIS/ATS only
(hr-rules § 3). Band and benchmark data come from `hr-rewards` with source and date (hr-rules § 4).

## 1. Before drafting

- [ ] Final debrief recorded with evidence; references complete (or explicitly waived, with reason)
- [ ] Band for role/level confirmed; proposed position in band justified (scope, evidence, market)
- [ ] Internal equity: compared against peers in the same role, level and location
- [ ] Above band or non-standard term? → exception approval requested now
- [ ] Budget line confirmed against the approved req
- [ ] Jurisdiction of employment confirmed (contract law, probation, notice, statutory benefits) [VERIFY]
- [ ] Contingencies identified: right-to-work, background check, credential check — lawful and disclosed [VERIFY: jurisdiction]
- [ ] Known candidate context: other processes, deadline, stated priorities beyond pay

## 2. Package components (state every one)

| Component | Spell out |
|---|---|
| Base pay | Amount, period, gross or net, currency, pay frequency |
| Allowances | Each by name, taxable or not [VERIFY: jurisdiction] |
| Variable pay | Target, plan basis, first eligible period, how it pays out |
| Equity (if any) | Instrument, grant size, vesting schedule, valuation basis, what happens on exit |
| Sign-on / relocation | Amount, clawback terms |
| Statutory benefits | Social/health insurance and other mandatory contributions — name them, [VERIFY: authority + effective date] |
| Company benefits | Health cover, leave above statute, learning budget, equipment |
| Working model | Location, hybrid/remote terms, hours |
| Start date and probation | Probation length and terms [VERIFY: jurisdiction] |
| Restrictive terms | Confidentiality, IP, non-solicit, non-compete — standard or not; enforceability is local |
| Review timeline | First pay/performance review date |

## 3. Approval

- [ ] Standard package within pre-approved band → recruiter/TA lead approves
- [ ] Exception → named approver, reason, logged for equity review
- [ ] Approval SLA tracked: requested [date/time] → approved [date/time]
- [ ] Negotiation bounds agreed in advance: max base, sign-on, equity range, start-date flexibility, what is not negotiable

## 4. Verbal offer call (before any letter)

1. Thank them; confirm continued interest and anything new (other offers, timing).
2. Why us: link the role to what they said matters to them.
3. Walk every component in section 2; total package first-year view; gross/net explicit.
4. Ask: "How are you thinking about this decision? What else would you need to know?"
5. Agree the decision date and the written-offer expiry.
6. Recap by email the same day; written offer promptly after.

Senior roles: recruiter plus hiring manager on the call.

## 5. Negotiation prep

| Question | Use |
|---|---|
| "Is there a specific number you need, or are you comparing to another offer?" | Find the real driver |
| "What else beyond pay matters in this decision?" | Non-pay levers: scope, title, start date, flexibility, learning |
| "If we reach X, are you ready to accept?" | Test the close before seeking approval |
| "What's your deadline?" | Prioritise approval speed |

| Usually negotiable (within bounds) | Less negotiable | Not negotiable |
|---|---|---|
| Base within band, sign-on, equity within grant range, start date, hybrid terms, title (with approval) | Scope, reporting line, team, probation terms | Anything needing a policy exception HR cannot grant — say so plainly |

Rules: one considered counter; same flexibility for every candidate in the role; log every exception.
Never ask a candidate to withdraw from another process before ours is complete.

## 6. Competing offer / retention counteroffer

- [ ] Understand what differs (pay, scope, stage, certainty) and the real deadline
- [ ] Decide fast: decision meeting within the candidate's window, or say honestly we cannot move
- [ ] Respond to the driver, not every claimed number
- [ ] Retention counteroffer: ask what it fixes that wasn't fixed before they looked; record the reason code
- [ ] Track counteroffer losses by function/level — a pattern goes to `hr-rewards`

## 7. Written offer

- [ ] Matches the verbal exactly; every component in section 2 present
- [ ] Contingencies and their order stated
- [ ] Expiry date stated
- [ ] Template checked for the jurisdiction [VERIFY]; non-standard terms reviewed — *review with qualified employment counsel (or the relevant authority) before acting.*
- [ ] Sent through the approved system; no personal data in `plans/hr/`

## 8. Accept → start

| When | Touch | Owner |
|---|---|---|
| Acceptance day | Thank-you, next steps, contacts | Recruiter |
| Weekly until start | Short check-in; team or manager note | Hiring manager |
| Pre-boarding | Hand-off to people ops (equipment, documents, day-one plan) | Recruiter → `hr-people-ops` |

Renege signals: slower replies, start-date slips, new questions about pay or scope. Act on them: call,
ask directly, resolve what can be resolved.

## 9. Decline or withdraw

- [ ] Ask for the reason; record a reason code (pay, scope, location, process speed, competing offer, counteroffer, personal, other)
- [ ] Thank them genuinely; ask permission to stay in touch → talent CRM segment
- [ ] Review decline reasons in aggregate each cycle

Withdrawing an offer we extended (check result, business change): *review with qualified employment
counsel (or the relevant authority) before acting.*

## 10. Offer tracker statuses

`drafted` → `approval-pending` → `approved` → `verbal-extended` → `written-extended` → `negotiating` →
`accepted` | `declined` | `expired` | `withdrawn` → `started` | `reneged`

Track per req: days in each status, expiry date, next action and owner.
