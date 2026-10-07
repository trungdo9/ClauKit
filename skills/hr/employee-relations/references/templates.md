# Employee Relations — Templates

Templates for [hr-employee-relations](../SKILL.md). Roles or pseudonyms only (`.claude/workflows/hr-rules.md` § 3). Statutory items carry `[VERIFY: <law>]` with effective date once confirmed (§ 2). Figures without a source → `[NEEDS DATA]` (§ 4).

## Policy (`policy`)

```markdown
# [Policy name] — v[n] — effective [date]

Owner: [role] · Approved by: [role(s)] on [date] · Next review: [date] · Applies in: [countries / entities]
Country addenda: [links or "none"] (baseline + addendum, never one text for all countries)

## Summary (plain language)
[3–5 lines: what this means for you]

## 1. Who this applies to
[employees / contractors / locations / entities]
## 2. The rule
[clear standard; legally load-bearing wording kept precise, with a plain summary above it]
## 3. Definitions
[terms that carry legal weight]
## 4. Exceptions
[what can be excepted · who approves · how it is recorded]
## 5. If the policy is not followed
[proportionate consequence; links to disciplinary policy]
## 6. Related procedures and policies
[procedure doc (how) · related policies — cross-reference, don't duplicate]
## 7. Change history
| Version | Date | Change | Approved by |
```

Rollout checklist: legal review `[VERIFY]` · representative consultation where required `[VERIFY]` · data-protection review (monitoring rules) · manager talking points + FAQ · change summary · acknowledgment tracking with reminders · old version archived and removed from the intranet · consistency check after rollout.

Policy register columns: policy · owner · applies to · version · effective date · last review · next review · acknowledgment rate · status (active / under review / retired).

## Written warning (`discipline`)

```markdown
# [First / Final] Written Warning — Case [case-code]

Employee: [pseudonym in committed copy] · Role: [role] · Jurisdiction: [country]
Meeting held: [date] · Notice of meeting given: [date] · Companion: [offered / attended / declined] `[VERIFY]`

Conduct issue: [specific behaviour, dates, evidence relied on]
Standard breached: [policy, clause]
Employee's response: [summary of what the employee said]
Consideration of response: [why the conclusion was reached]
Comparator check: [how comparable cases were handled — consistent / reason for difference]
Protected-activity check: [none / describe → counsel consulted on date]
Expected change: [specific, observable]
Support offered: [if any]
Warning stays on file until: [per policy]
Consequence of further breach: [next stage]
Right of appeal: to [role], within [policy period], by [method]

*Review with qualified employment counsel (or the relevant authority) before acting.* (final warning, dismissal)
```

## Mediation working agreement (`discipline`)

```markdown
# Working Agreement — [team code] — [date]

Parties: [Employee A], [Employee B] · Facilitator: [HR role] · Manager: [role]
Shared goal: [one sentence]
Agreements:
1. [specific behaviour, owner, timing]
2. ...
Escalation: if not resolved directly within [agreed time], raise with [role]
Follow-up checks: [date 1], [date 2] · Owner: [role]
Screen recorded: no harassment, discrimination, retaliation or safety concern identified (else → investigate)
```

## HR risk register (`risk`)

```markdown
| ID | Risk (specific) | Category | L 1–5 | I 1–5 | Score | Current controls | Owner (role) | Mitigation + target date | Status | Trend | Last reviewed |
|----|-----------------|----------|-------|-------|-------|------------------|--------------|--------------------------|--------|-------|---------------|
| R1 | [e.g. Right-to-work re-checks not tracked for Entity X] | Compliance | | | | | | | open | ↑/→/↓ | |
```

Thresholds (default, calibrate): high → active plan + executive visibility; medium → plan + quarterly review; low → monitor. Escalation trigger list and notification path written below the table.

## Audit findings + corrective action plan (`audit`)

```markdown
# HR Compliance Audit — [scope] — [period]

Scope: [areas, entities, countries] · Sample: [method, size, rationale] · Counsel-directed: yes/no
| # | Finding | Area | Evidence (sample refs) | Exposure | Frequency | Severity | Rating | Corrective action | Owner | Due | Verified closed |
|---|---------|------|------------------------|----------|-----------|----------|--------|-------------------|-------|-----|-----------------|
Executive summary: top findings by rating, not discovery order.
Follow-up verification date: [date]
```

## Payroll control checklist (`payroll`)

```markdown
| Cycle | Country | Cut-off met | Changes approved (maker–checker) | Variance review done | Gross-to-net checked | Ledger reconciled | Remittance = filing | Sign-off (role) |
|-------|---------|-------------|----------------------------------|----------------------|----------------------|-------------------|---------------------|-----------------|

Discrepancy log:
| # | Cycle | Population affected (count) | Root cause (input / config / process / vendor) | Correction date | Employee informed | Same rule checked for others | Prevention |
```

Statutory rate table: | Country | Item | Rate / threshold | Authority | Effective date | Owner | — any cell not yet confirmed reads `[VERIFY: authority]`.

## Accommodation case log (`accommodate`) — category level, no diagnosis

Case log lives in the HR / occupational-health file. `plans/` holds the process plus a periodic count by functional category, suppressed below the minimum group size (`plans/hr-context.md` § 7).

Case-log fields (in the HR / OH file): case code · date received · acknowledged · functional category (e.g. mobility, sensory, schedule) · adjustment requested · options considered · decision · rationale · review date · counsel consulted (if not granted).

Periodic count (in `plans/`):

```markdown
| Period | Functional category | Requests | Granted | Partially granted | Not granted | Median days to decision |
|--------|---------------------|----------|---------|-------------------|-------------|-------------------------|
| [Q] | [category] | [n, or "<min" if below the minimum group size] | | | | |
```

Medical documentation and identities stay in the confidential HR / occupational-health file, never here.

## Immigration tracker (`immigration`) — pseudonymised view

```markdown
| Pseudonym | Country | Permit type | Sponsoring entity | Expiry (month) | Lead time (counsel) | Alert stages | Owner | Status | Next action | Status-affecting change pending? |
|-----------|---------|-------------|-------------------|----------------|---------------------|--------------|-------|--------|-------------|----------------------------------|
```

Monthly review with immigration counsel. Any change to role, pay, location, hours, entity or employment status → counsel before acting.
