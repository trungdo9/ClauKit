---
name: close-controls
description: Bookkeeping and controllership — month-end close calendar and checklist, balance-sheet account reconciliations, accruals and journal-entry discipline, flux analysis, internal controls (segregation of duties, approval matrices), and audit readiness, under a named accounting framework (US GAAP, IFRS or local — asked, never assumed). Use for "month-end close", "close the books", "close checklist", "reconcile", "bank reconciliation", "account reconciliation", "accruals", "journal entries", "internal controls", "segregation of duties", "audit prep", "audit readiness", "clean up our books", "chart of accounts". For budget-vs-actual and forecasting use fpa; for tax planning use tax-strategy (return preparation and filing → licensed preparer).
allowed-tools: Read, Write, Glob, Grep
---

# Close & Controls

> If the books are wrong, every decision built on them is wrong. Close on schedule, reconcile every balance-sheet account, and make the audit boring.

## When this skill activates

**Implicit:** "set up our month-end close", "our books are a mess", "reconcile this account", "this balance doesn't tie", "what controls do we need", "we have our first audit", "who should approve payments".
**Explicit:** "Use the close-controls skill to [task]."
**Routed from:** `/mk:finance close`.

## Scope

Covers:
- Close calendar and checklist (pre-close → core close → reconciliations → statements → review).
- Balance-sheet reconciliations with reconciling items and roll-forwards.
- Accruals, recurring and adjusting journal entries, documentation standards.
- Flux analysis (month-over-month and budget-vs-actual on the statements).
- Day-to-day operations that feed the close: AP (three-way match), AR (cash application, aging), payroll entries, cash position, fixed assets, revenue recognition.
- Internal control design: segregation of duties, approval/delegation-of-authority matrices, system access, control testing and remediation.
- Audit readiness and audit coordination.

Does NOT cover:
- Budgeting, variance commentary for leadership, forecasting → [[fpa]].
- Forward-looking models and valuation → [[financial-model]].
- Tax planning positions and provision analysis → [[tax-strategy]]; return preparation and filing → a licensed preparer. Close flags tax liabilities to reconcile; it does not decide positions.
- Payroll, legal or tax filings themselves. This skill prepares and reconciles; a qualified professional files.

## Framework first

**Ask which accounting framework applies — US GAAP, IFRS, or a local GAAP — before giving any recognition or measurement guidance.** Never assume US GAAP. Standard references differ by framework (e.g. revenue: ASC 606 under US GAAP, IFRS 15 under IFRS; leases: ASC 842 vs IFRS 16); name the standard for the framework in use, and if the entity's framework or a specific requirement is unknown, write `[NEEDS DATA]` rather than guess. Small entities on cash-basis books get told so plainly — accrual-basis advice does not apply to them.

## Rules

1. **Record under the applicable framework.** No shortcuts on recognition.
2. **Reconcile every balance-sheet account every month.** An unreconciled balance is an unexplained one.
3. **Segregation of duties.** Whoever initiates a transaction does not approve or record it. Where headcount makes that impossible, name the compensating control (owner review of bank statements, dual approval on payments).
4. **Every manual journal entry has a real description, support and an approver.** "Adjusting entry" is not a description.
5. **Close on a published calendar.** Delays cascade into reporting and decisions.
6. **Materiality sets urgency, not whether you look.** An unexplained small difference still gets traced; its size decides how fast.
7. **No silent prior-period changes.** A correction that affects reported numbers is documented and communicated.
8. **Audit readiness is daily.** Support for any balance should be producible on request.

## Template — month-end close checklist

```markdown
# Month-End Close — [Month Year]
**Framework**: [US GAAP / IFRS / local]  **Deadline**: [Business day N]  **Owner**: [Role]

## Pre-Close (Day 1–2)
- [ ] Bank feeds synced through period end
- [ ] AP invoices received and entered through cut-off
- [ ] Payroll entries posted for all pay periods in month
- [ ] Expense reports reviewed and posted
- [ ] AR invoices issued for all delivered goods/services
- [ ] Intercompany transactions agreed with counterparties

## Core Close (Day 3–5)
- [ ] Recurring entries (depreciation, amortization, rent, insurance)
- [ ] Expense accruals (services received, not billed; commissions)
- [ ] Revenue accruals / deferred revenue adjustments
- [ ] Payroll tax and benefit accruals
- [ ] Credit card transactions recorded
- [ ] FX revaluation (if multi-currency)
- [ ] Intercompany eliminations (if consolidated)

## Reconciliations (Day 3–6)
- [ ] Bank accounts (all)          - [ ] Credit cards (all)
- [ ] AR aging ↔ GL                 - [ ] AP aging ↔ GL
- [ ] Prepaids & deposits (with amortization schedules)
- [ ] Fixed assets (additions, disposals, depreciation)
- [ ] Accrued liabilities (detail support for every balance)
- [ ] Deferred revenue roll-forward
- [ ] Intercompany (nets to zero)
- [ ] Equity roll-forward
- [ ] Payroll tax liabilities ↔ filed returns

## Financial Statements (Day 6–7)
- [ ] Trial balance reviewed for unusual balances
- [ ] Income statement with MoM and BvA flux
- [ ] Balance sheet tied to reconciliations
- [ ] Cash flow statement (method stated)
- [ ] Supporting schedules (debt, equity, deferred revenue)
- [ ] Flux: investigate and document every variance above [threshold amount] or [threshold %]

## Review & Finalize (Day 7–8)
- [ ] Reviewer sign-off on all reconciliations and manual entries
- [ ] Final statement review
- [ ] Period locked in the ledger
- [ ] Package distributed to management
- [ ] Support archived
- [ ] Close retrospective — one process improvement logged
```

Day ranges are a starting cadence for a small team, not a benchmark; set the deadline from the business's own reporting needs.

## Template — account reconciliation

```markdown
# Reconciliation — [Account name] ([account reference — internal code, never a bank account number])
**Period**: [Month Year]  **Preparer**: [Role]  **Reviewer**: [Role]  **Prepared/Reviewed**: [Dates]

| Source | Amount |
|---|---|
| GL balance (trial balance) | |
| Supporting detail balance (statement / subledger / schedule) | |
| **Difference** | |

## Reconciling Items
| # | Date | Description | Amount | Status | Resolution date |
|---|---|---|---|---|---|

## Adjusted
GL balance + reconciling items = reconciled balance → equals support → **variance 0**

## Roll-Forward (if applicable)
Beginning + additions − reductions ± adjustments = ending

## Notes
[Methodology changes, items needing management attention]
```

## Operating cadence

- **Daily:** code and route AP for approval; apply cash receipts; record bank activity; maintain cash position.
- **Weekly:** review AP aging and schedule payments; reconcile high-volume accounts; follow up on intercompany items.
- **Monthly:** run the close checklist; reconcile; statements and flux; retrospective.
- **Quarterly:** reporting package; review complex revenue contracts; reserves (bad debt, inventory); control testing; estimated tax figures handed to [[tax-strategy]].
- **Annually:** audit coordination and schedules; year-end statements and disclosures; year-end payroll and information returns as the jurisdiction requires; policy manual and chart-of-accounts review; impairment reviews.

## Internal controls — minimum set

| Area | Control | Small-team compensating control |
|---|---|---|
| Payments | Preparer ≠ approver; dual approval above threshold | Owner approves every payment release in the bank portal |
| Vendor master | Changes to vendor bank details verified out-of-band | Call-back to a known number before any change |
| Journal entries | Manual entries reviewed and approved | Monthly owner review of all manual entries |
| Bank | Reconciliation by someone who cannot move money | Owner reviews statement and reconciliation monthly |
| Access | Ledger roles least-privilege; quarterly access review | Separate admin and posting logins |
| Revenue | Invoices tie to contracts/orders | Monthly contract-to-invoice spot check |

Vendor bank-detail changes are a common fraud path; the out-of-band verification control is not optional.

## Output

`plans/finance/<slug>/close-checklist-<YYYY-MM>.md`, `plans/finance/<slug>/recon-<account>-<YYYY-MM>.md`, `plans/finance/<slug>/controls-matrix.md`.

**Sensitive data — strict:** never write bank account numbers, routing/IBAN numbers, card numbers, tax IDs, employee identifiers or personal financial data into these files. Use internal account codes and roles, not names. Supporting documents stay in the ledger or document store, referenced by ID.

## Before proceeding

1. Which accounting framework (US GAAP / IFRS / local) and which basis (accrual / cash)?
2. Which ledger and what does the chart of accounts look like?
3. How many people touch finance — this decides which controls are feasible and which need compensating controls?
4. Is there an audit, financing or due-diligence deadline driving this?

Read `plans/marketing-context.md` if present (entity, business model) and skip what it answers. It is not required.

## Cross-references

- [[fpa]] — consumes closed actuals for variance and forecast
- [[financial-model]] — historical columns start from closed periods
- [[tax-strategy]] — tax accruals and provision inputs (filings → licensed preparer)
- [[investment-research]] — the financial-DD checklist an outside investor will run against these books

## Provenance

Adapted from `msitarzewski/agency-agents` → `finance/finance-bookkeeper-controller.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice, tool roster and self-scored success metrics (audit-adjustment, exception-rate and AR-aging percentages) removed; US-GAAP-only assumption replaced by an explicit framework question with ASC/IFRS equivalents; US-specific year-end forms generalized; small-team compensating controls table, sensitive-data rule, sibling routing and `plans/finance/` output added.
