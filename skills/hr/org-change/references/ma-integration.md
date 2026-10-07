# M&A — Due Diligence & Integration Checklists

Checklists for [hr-org-change](../SKILL.md) § ma. Pseudonyms in every committed file; names, salaries and personal data stay in the deal room or HRIS (`.claude/workflows/hr-rules.md` § 3). Anything statutory per country carries `[VERIFY: <law>]` (§ 2); country detail lives with [[hr-global]].

## 1. HR due-diligence request list

| Area | Request | Why it matters |
|---|---|---|
| Workforce | Headcount by entity, country, function, employment type (permanent, fixed-term, part-time, contractor, agency) | Cost base, transfer scope, classification exposure |
| Pay | Pay structure, variable plans, off-cycle increases, compression or outliers (aggregated) | Harmonisation cost, equity gaps |
| Equity | Plans, unvested awards, acceleration and change-of-control terms | Retention economics, deal cost |
| Contracts | Template contracts, executive agreements, notice terms, non-compete / non-solicit, IP assignment | Liability, enforceability per country `[VERIFY]` |
| Change of control | Severance or bonus triggers on sale | Deal cost |
| Benefits | Plan documents, cost, insured vs self-funded, pension type and funding status, deferred compensation | Unfunded liabilities, harmonisation |
| Leave balances | Accrued, payable-on-exit balances | Balance-sheet liability `[VERIFY: local payout rules]` |
| Claims | Open and threatened employment claims, settlements, regulator inquiries | Price adjustor, indemnity |
| Compliance | Recent audits, wage-and-hour / working-time posture, right-to-work records, data-protection incidents | Hidden liability |
| Classification | Contractor population and engagement terms | Misclassification exposure `[VERIFY]` |
| Immigration | Staff whose work authorisation is tied to the current employer | Transfer may need new filings `[VERIFY]` |
| Representation | Unions, works councils, collective agreements, consultation history | Integration timeline, consultation duties |
| HR operations | HRIS, payroll providers, cut-over constraints | Day-1 continuity |
| Culture | Decision style, pace, risk tolerance, how performance is managed (interviews, not values statements) | Integration friction |
| Key people | Roles carrying critical knowledge, client relationships, leadership | Retention plan |

## 2. Finding log

```markdown
| # | Area | Finding (no names) | Class | Est. exposure (source) | Recommendation | Owner | Status |
|---|------|--------------------|-------|------------------------|----------------|-------|--------|
| 1 | Claims | [summary] | Deal-breaker / Price-adjustor / Integration | [amount or NEEDS DATA] | [indemnity, escrow, condition, plan item] | [role] | open |
```

Exposure figures come from the data room or counsel, with source; never estimated from memory.

## 3. Key-talent risk grid (role family + counts)

Per-person rows (who, why critical, flight signal) stay in the HRIS / deal clean room — a pseudonym beside "sole owner of [system]" identifies the person (hr-rules § 3). `plans/` gets role family, band and counts.

```markdown
| Role family | Band | Critical people (n) | Criticality type (knowledge / clients / leadership) | Flight risk H / M / L (n) | Mitigation | Owner | Review date |
|-------------|------|---------------------|-----------------------------------------------------|---------------------------|------------|-------|-------------|
| Engineering | Lead | [n] | Knowledge (single-owner systems) | [h] / [m] / [l] | Milestone retention agreements; role clarity by D-[n] | [role] | |
```

Retention mechanisms are structured around integration milestones; amounts set with [[hr-rewards]] and approved per hr-context approvers.

## 4. Day-1 readiness checklist

- [ ] Payroll runs on schedule for every transferred employee (provider, bank files, cut-off confirmed per country)
- [ ] Benefits continue without gap; insurer/provider notified `[VERIFY: notice requirements]`
- [ ] Interim reporting lines published for every team
- [ ] Combined-function leaders named, or a date given for the announcement
- [ ] HR contact and integration mailbox live; FAQ published
- [ ] Day-1 message per country, reviewed by local legal and delivered by local leaders
- [ ] Employee-representative bodies informed where required, before any change is implemented `[VERIFY]`
- [ ] System access, badges, email continuity
- [ ] Key-talent conversations held or scheduled
- [ ] Manager toolkit distributed, with Q&A escalation path
- [ ] Decision log opened (pending / made, owner, date, communicated?)

## 5. 100-day plan

```markdown
| Workstream | Pre-close | D1–30 Stabilise | D31–90 Integrate | D91–100 Review | Owner | Country constraint |
|------------|-----------|-----------------|------------------|----------------|-------|--------------------|
| Governance (IMO HR workstream) | HR lead named; decision log | Weekly cadence | | Close-out, hand to BAU | | |
| Communication | Day-1 drafts | Day-1 + W2–4 follow-ups | Mid-point update | Retrospective message | | Local review |
| Org structure | Overlap map | Interim lines | Combined structure (after consultation where required) | Stabilisation check | | `[VERIFY]` consultation |
| Retention | Agreements signed | Leader outreach | Milestone check | Retention review vs baseline | | |
| Pay & benefits | Comparison | No change unless agreed | Harmonisation plan (hr-rewards) | Communicate timeline | | Representative approval `[VERIFY]` |
| Policies & terms | Gap list | Interim policy statement | Harmonise (baseline + addenda) | | | |
| HR systems & payroll | Cut-over plan | Continuity | Phased migration, parallel run | | | |
| Culture | Two-culture assessment | Cross-team forums | 3–5 dimension decisions acted on | Pulse | | |
| Role changes / exits | — | — | Only after legal sequence → hr-employee-relations `exit` | | | Counsel |
```

Rule: the most consultation-heavy jurisdiction sets the pace for any action that touches terms or roles there.

## 6. Integration health dashboard

| Indicator | Type | Source | Baseline | Current |
|---|---|---|---|---|
| Acquired-org voluntary attrition | Leading | HRIS | Pre-deal [own data] | |
| Key-talent retention (count retained / listed) | Leading | Grid above + HRIS list | All listed people at close | |
| Integration-confidence pulse | Leading | Pulse | First pulse | |
| Decisions made vs planned | Leading | Decision log | Plan | |
| Engagement | Lagging | Survey ([[hr-culture]]) | Pre-deal | |
| Synergy vs deal thesis (people items) | Lagging | Finance | Thesis | |

Any role removal arising from integration → [[hr-employee-relations]] `exit` (`/hr:comply exit`). *Review with qualified employment counsel (or the relevant authority) before acting.*
