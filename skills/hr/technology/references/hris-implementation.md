# HRIS — requirements, selection and implementation templates

Synthetic or pseudonymised test records only (hr-rules § 3). Vendor names never appear; refer to
"Vendor A/B/C". Durations, thresholds and SLAs are the organisation's own decisions.

## Requirements checklist

**Core HR**
- [ ] Person and worker records (employee, contractor, intern) with effective-dated history and audit trail
- [ ] Job catalogue and positions; org units, cost centres, legal entities, locations
- [ ] Manager relationships incl. matrix / dotted line; multiple concurrent jobs
- [ ] Hire, transfer, promotion, leave of absence, termination, rehire workflows with approvals
- [ ] Time-off requests and balances (or integration with the time system)
- [ ] Document storage with access by role and retention rules

**Self-service**
- [ ] Employee: personal data updates, payslips, leave, documents, policy acknowledgements
- [ ] Manager: team view, approvals, org chart, change requests within own reporting line

**Integration and security**
- [ ] Payroll interface (cut-off calendar, retro changes, off-cycle)
- [ ] Benefits eligibility feed; ATS hire handoff; LMS; time system
- [ ] SSO and automated provisioning / deprovisioning to the identity provider
- [ ] Role-based and field-level permissions; access logs; export controls
- [ ] Data residency options; deletion and portability on exit; subprocessor list
- [ ] API availability, rate limits, webhooks/events, sandbox environment

**Reporting**
- [ ] Standard: headcount, movements, turnover, absence, org structure
- [ ] Custom fields and reports; scheduled distribution; export to analytics layer
- [ ] Definitions configurable to match the analytics dictionary

**Multi-country** (per country, `[VERIFY]` with [[hr-global]])
- [ ] Local fields and identifiers, languages, date/number formats
- [ ] Local payroll provider interface or in-country payroll
- [ ] Local retention, works-council or representative access rules

**Vendor and service**
- [ ] Implementation methodology, partner model, named team
- [ ] Support tiers, SLAs, release cadence and change notice
- [ ] Reference customers at similar size, country mix and stack

## Scripted demo scenarios (same for every vendor, on sanitised data)

1. Hire: requisition-approved candidate arrives from the ATS → record created → onboarding tasks → payroll and accounts provisioned.
2. Manager change: worker moves team; approvals, permissions and access update automatically.
3. Compensation change approved with HR and finance visibility; effective-dated; flows to payroll.
4. Leave of absence starts and ends; benefits eligibility and payroll reflect it.
5. Error correction: wrong data fixed; show the audit trail.
6. Termination: offboarding tasks, final-pay inputs, access revocation at effective time.
7. Rehire of a former worker: ID continuity, history preserved.
8. Report: headcount and turnover by function and location, using our definitions.
9. Admin: add a custom field and a new approval step without vendor services.

## Vendor scorecard

| Category | Weight (set before demos, Σ = 100) | Vendor A | Vendor B | Vendor C | Evidence |
|---|---|---|---|---|---|
| Core workflows | | | | | demo script # |
| Payroll / benefits fit | | | | | |
| Integration quality (API, events, connectors) | | | | | sandbox test |
| Reporting and analytics | | | | | |
| Employee and manager experience | | | | | user panel |
| Security, privacy, compliance | | | | | security review |
| Implementation effort and support | | | | | references |
| Total cost of ownership | | | | | TCO sheet |

Score 1–5 with written evidence per cell; a 1 on any must-have disqualifies regardless of total.

**Reference-call questions:** What broke in year 1 that you did not expect? How did support respond
to a severity-1 issue? What did implementation cost vs contract? What would you configure differently?
Would you choose them again?

**TCO lines (contract term):** licences (module × user, minimums) · implementation services ·
integration build and platform fees · data migration · internal staff time · training · support tier ·
renewal uplift clause · exit / data extraction cost.

## Decision memo

```markdown
# Decision: <system> — <date>
Recommendation: Vendor <X>
Scores: <table summary>  ·  Key trade-off: <what we give up and why acceptable>
Risks and mitigations: <top 3>
Conditions before signature: security review · privacy review (DPIA if needed) · legal · final scope/pricing
Internal system owner (role): <role>  ·  Implementation start: <date>
```

## Data mapping spec (per integration)

| Source field | Target field | Transformation | Validation | Edge cases | Owner |
|---|---|---|---|---|---|
| Worker ID | Member ID | direct | unique, not null | rehire keeps ID | |
| Employment status | Eligibility status | value map (Active→…, LOA→…, Terminated→…) | allowed values | LOA eligibility per plan rules `[VERIFY]` | |
| Start date | Coverage start | date format; waiting period per plan `[VERIFY]` | not future > n days | backdated hires | |
| FTE | Full/part-time flag | threshold per plan rules `[VERIFY]` | 0–1 | FTE changes mid-period | |
| Termination date | Coverage end | conditional on status | ≥ start | post-termination notices `[VERIFY: local law]` | |

## Integration register

| Integration | Direction | Pattern (native / platform / API / file) | Trigger (event / batch / on-demand) | Data | System of record | Monitoring tier | Owner |
|---|---|---|---|---|---|---|---|

## Test plan

| Phase | Scope | Exit criterion (set by project) |
|---|---|---|
| Unit | Each integration in isolation, synthetic data | All mapped fields correct |
| Edge cases | Rehire, LOA, part-time/FTE change, cross-entity transfer, name change, mid-period termination, future-dated change, multiple jobs, dependants | All pass or logged with workaround |
| Error conditions | Missing required fields, invalid values, duplicates | Rejected with alert, nothing silent |
| Volume | Full-population batch | Completes inside the processing window |
| Parallel run | Old vs new outputs for agreed number of payroll cycles | Zero unexplained pay or eligibility differences |
| User acceptance | Real users run scripted scenarios | Sign-off by process owners |
| Rollback | Disable and restore prior state | Executed in rehearsal within agreed time |

## Cutover criteria (all must hold)

- [ ] Parallel run passed for the agreed cycles; reconciliation signed by payroll owner
- [ ] Benefits / carrier feeds accepted with no rejected records
- [ ] Provisioning and deprovisioning tested on joiner, mover, leaver scenarios
- [ ] Open transactions migrated and verified; legacy frozen for new entries
- [ ] Rollback rehearsed; decision owner and go/no-go time named
- [ ] Training done; support rota and escalation path for hypercare published

## Run-state monitoring

| Tier | Integrations | Alert target (set by org) | Notified roles |
|---|---|---|---|
| Critical | Payroll, benefits eligibility, deprovisioning | | HR systems owner, payroll, security |
| Important | Provisioning, time data | | HR systems owner, IT |
| Standard | ATS handoff, LMS, reporting extracts | | HR systems owner |

Periodic reconciliation: active-worker count and status compared across HRIS, payroll, benefits, LMS,
identity provider; every variance has an owner and a close date. Runbook per integration: symptoms,
checks, fix steps, escalation contact (role), vendor ticket route.
