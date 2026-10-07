# Offboarding checklist template

Used by `/hr:people offboard`. Save to `plans/hr/<slug>/offboarding-checklist.md`. Pseudonyms only
(`Leaver B`, `Successor 1`); names, IDs, final-pay amounts and exit-interview notes of identifiable
people stay in the HRIS / case system (hr-rules § 3).

**Involuntary separation?** The decision, documentation and legal review happen in
hr-employee-relations (`discipline`, or `exit` for redundancy / non-disciplinary termination) **before**
this checklist starts. This file covers logistics only and ends with: *review with qualified employment
counsel (or the relevant authority) before acting.* (hr-rules § 2).

```markdown
# Offboarding: [role] — [voluntary / involuntary: performance | conduct | redundancy]

- Jurisdiction: [country, state/province]   Work pattern: [on-site / remote / hybrid]
- Notice given: [date]   Last working day: [date]   Notice basis: [contract clause] [VERIFY: <country> law]
- Owners: Manager [role] · HR [role] · IT security [role] · Payroll [role] · Facilities [role]

## 1. Resignation / separation intake
- [ ] Notice acknowledged in writing; last day confirmed against contract and local law
- [ ] Counteroffer decision (voluntary only): reason is pay or other? long-term commitment? equity impact → hr-rewards
- [ ] Team communication agreed (wording, timing, who tells whom)
- [ ] Clients / external stakeholders: who informs them, when
- [ ] Involuntary: legal review complete, documentation in order, logistics ready before the meeting
- [ ] Redundancy: affected people informed before others; others informed the same day

## 2. Knowledge transfer (start on day 1 of notice)
| # | Knowledge item | Type | Risk (H/M/L) | Documented? | Successor | Session dates | Signed off |
|---|---|---|---|---|---|---|---|
| 1 | [undocumented dependency / workaround] | System | H | No | Successor 1 | | [ ] |
| 2 | [in-flight project] | Work | | | | | [ ] |
| 3 | [key stakeholder relationships] | Contacts | | | | | [ ] |
| 4 | [accounts/systems owned] | Ownership | | | | | [ ] |

Rules: highest risk first · short recurring sessions, not a last-day dump · the manager owns the plan ·
ownership of accounts is transferred, credentials are never shared · sign-off = successor performs the task.

## 3. Access and assets
| Item | Action | Timing | Owner | Done |
|---|---|---|---|---|
| Identity provider / SSO | Disable | Voluntary: end of last day · Involuntary: at meeting time | IT security | [ ] |
| Email | Forward / auto-reply per policy; mailbox retained per retention rule | Same | IT | [ ] |
| Privileged / admin accounts | Rotate shared secrets the person knew | Same | IT security | [ ] |
| Code, cloud, finance, customer systems | Remove; transfer ownership | Same | System owners | [ ] |
| Building / physical access | Deactivate | Same | Facilities | [ ] |
| Laptop, phone, tokens, cards | Recover (remote: prepaid return kit) | By last day | IT / Facilities | [ ] |
| Company data on personal devices | Remove per policy | By last day | IT | [ ] |
| Expense cards, approvals, delegations | Cancel / reassign | By last day | Finance | [ ] |
| Distribution lists, shared drives, calendars | Reassign ownership | By last day | Manager | [ ] |

Organisation-wide deprovisioning SLA: [set by security policy].

## 4. Pay, benefits, documents (amounts stay in payroll)
- [ ] Final pay incl. accrued leave, notice pay, any severance — timing [VERIFY: <country> law]
- [ ] Benefits end dates and continuation notices where required (e.g. US COBRA) [VERIFY]
- [ ] Social-insurance / tax deregistration and certificates [VERIFY: <country> authority]
- [ ] Employment certificate / reference letter per policy
- [ ] Work-permit or visa sponsor notifications where applicable → hr-employee-relations `immigration` [VERIFY]
- [ ] Return-of-property and confidentiality reminders (no new terms without legal review)

## 5. Exit interview (voluntary; optional for involuntary)
Run by: [someone other than the direct manager]   Timing: [before / after last day — leaver's choice]
Confidentiality: themes reported in aggregate only; disclosures of harassment or misconduct are
acted on → hr-employee-relations. Say this up front.

Questions
1. What prompted you to start looking, and when?
2. What would have changed your decision?
3. How would you describe day-to-day support from your manager?
4. Did you see a path to grow here? What was missing?
5. How manageable was your workload?
6. Was your pay and recognition a factor? (theme only — no figures recorded)
7. What should we keep doing?
8. What one thing should we change first?
9. Would you consider returning in the future?

Coding (for the quarterly theme report): growth · manager · pay/recognition · workload · role fit ·
culture · personal/relocation · other.

## 6. Team announcement
- Brief and honest; leaver agrees the wording (voluntary)
- Names who covers what during transition and the knowledge-transfer plan
- Avoid over-praising in a way that invites "why didn't we keep them?" questions
- Involuntary: factual, respectful, no reasons beyond what HR/legal approve

## 7. Close-out
- [ ] All section 2–4 items signed off
- [ ] Rehire eligibility recorded in HRIS against pre-written, job-related criteria (hr-rules § 5)
- [ ] Alumni contact consent captured (opt-in) if an alumni programme exists
- [ ] Offboarding feedback logged for process improvement
```

## Quarterly exit-theme report (`plans/hr/<slug>/exit-themes.md`)

| Theme | Count | Share of exits | Segments where it concentrates | Action owner |
|---|---|---|---|---|
| Growth | | | [function / tenure band — min group size] | |
| Manager | | | | |
| Pay / recognition | | | | → hr-rewards |
| Workload | | | | |

Suppress any cell below the agreed minimum group size. Feed actions to hr-culture and
hr-workforce-analytics. No external attrition benchmark without a cited source — `[NEEDS DATA]`.
