# Workplace Investigation — Plan & Report Templates

Templates for [hr-employee-relations](../SKILL.md) § investigate.

**Pseudonyms only.** `Complainant A`, `Respondent B`, `Witness 1…n`, `Manager C`. Names, employee IDs, contact details and health or other special-category data never appear in a committed file; the pseudonym key lives in the case-management system with restricted access (`.claude/workflows/hr-rules.md` § 3). Statutory steps and deadlines carry `[VERIFY: <law>]` (§ 2). The investigator recommends; a separate decision-maker decides (§ 6).

**Where each piece lives.** `plans/hr/<slug>/investigation-process.md` holds roles, steps and timeline only — no facts, allegations or findings. The filled plan (§ 1), interview notes (§ 2) and report (§ 3) are completed in the case system, never in `plans/`.

## 1. Investigation plan — fill in the case system, never in `plans/`

```markdown
# Investigation Plan — Case [case-code] — CONFIDENTIAL

Jurisdiction: [country / state] · Policy engaged: [policy + version + clause]
Opened: [date] · Investigator: [role, independence confirmed: no reporting line, no prior involvement]
Counsel-directed: yes / no ([role of counsel]) · Decision-maker: [role, separate from investigator]

## Allegations (one issue per row)
| # | Allegation (neutral wording) | Policy provision | Date(s) | Evidence to obtain | Witnesses |
|---|------------------------------|------------------|---------|--------------------|-----------|
| 1 | Respondent B is alleged to have … | [clause] | | [calendar, chat export, logs] | Witness 1, 2 |

## Risk screen
- Safety risk: [none / describe + action]
- Retaliation risk: [assessment] → written non-retaliation reminder sent to all parties on [date]
- Senior-leader involvement / external investigator needed: [yes/no, reason]
- Regulator-reportable or whistleblower-protected: [yes/no] `[VERIFY: applicable law]`

## Interim measures (non-punitive; complainant not disadvantaged)
| Measure | Applies to | Start | Review date |
|---------|------------|-------|-------------|

## Evidence preservation
Hold issued on [systems] on [date] by [role]; chain-of-custody log kept in the case system.

## Interview schedule
| Order | Interviewee | Date | Companion / representative offered `[VERIFY]` | Notes signed / read back |
|-------|-------------|------|-----------------------------------------------|--------------------------|
| 1 | Complainant A | | | |
| 2 | Witness 1 | | | |
| n | Respondent B (all allegations put with detail to answer) | | | |

Internal target to report: [date] · Statutory deadlines: `[VERIFY]`
```

## 2. Interview note header — fill in the case system, never in `plans/`

```markdown
Case [case-code] · Interviewee: [pseudonym] · Date/time · Interviewer: [role] · Note-taker: [role] · Companion: [present / declined / n/a]
Opening given: purpose · process · confidentiality limits (confidential, not secret) · non-retaliation · right to review notes
[Q/A notes — the interviewee's own words where possible; facts, not interpretations]
Read back / signed: [yes, date] · Follow-up items: [...]
```

## 3. Report template — fill in the case system, never in `plans/`

```markdown
# Investigation Report — Case [case-code] — CONFIDENTIAL

Prepared by: [investigator role] · For: [decision-maker role] · Date: [date]
Jurisdiction: [country/state] · Policy: [name, version, clause(s)]

## 1. Summary
[3–5 sentences: what was alleged, scope, outcome per allegation — no recommendation language here]

## 2. Scope and terms of reference
- Allegations investigated: [#1–#n as numbered in the plan]
- Out of scope (and where routed): [e.g. capability concern → hr-performance]

## 3. Process
- Complaint received [date] via [channel]; investigator appointed [date]; independence confirmed
- Interim measures: [list + dates]
- Interviews: Complainant A [date]; Witness 1–n [dates]; Respondent B [date] (allegations put in full; opportunity to respond and name witnesses)
- Companion / representative offered: [yes/no per interview] `[VERIFY]`
- Evidence reviewed: [document types, date ranges, systems] — chain of custody in case system
- Evidence requested but not obtained: [item — reason]
- Deviations from procedure and why: [none / describe]

## 4. Standard of proof
[Standard set by policy and jurisdiction, e.g. balance of probabilities] `[VERIFY]`

## 5. Findings per allegation
### Allegation 1 — [neutral restatement]
- Undisputed facts: ...
- Disputed facts: [A says … / B says …]
- Evidence: [corroboration, documents, timing]
- Credibility assessment: consistency · corroboration · plausibility · motive (demeanour given least weight)
- **Finding of fact:** [what more likely than not happened]
- **Outcome:** Substantiated / Not substantiated / Inconclusive
- **Policy conclusion:** [clause breached / not breached]

[repeat per allegation]

## 6. Retaliation
[Any adverse treatment after the complaint? Evidence? Action taken?]

## 7. Contributing and systemic factors
[Role ambiguity, manager practice, team pattern, policy gap — observations only]

## 8. Recommendations (for the decision-maker)
| # | Recommendation | Linked finding | Type (sanction to consider · support · training · policy fix · team reset) |
|---|----------------|----------------|-----------------------------------------------------------------------------|

## 9. Communication of outcome
- Complainant A: [what may be shared within privacy limits]
- Respondent B: [outcome, reasons, appeal route]
- Retaliation check-ins: [dates, owner]

## 10. Appendices (held in the case system, not committed)
Interview notes · evidence index · chronology · pseudonym key

---
*Investigation findings and any resulting sanction: review with qualified employment counsel (or the relevant authority) before acting.*
```

## 4. Closure checklist

- [ ] Every allegation numbered, investigated and given an outcome
- [ ] Respondent heard on each allegation with enough detail to respond
- [ ] Findings rest on evidence; disputed facts resolved with stated reasons
- [ ] Findings of fact, policy conclusion and recommendation kept separate
- [ ] Investigator did not decide the sanction
- [ ] Retaliation risk assessed; check-ins scheduled
- [ ] Both parties told the outcome within privacy limits; appeal route given
- [ ] Interim measures lifted or confirmed
- [ ] Systemic factors passed to the owner (manager, policy owner, [[hr-org-change]] for structural causes)
- [ ] Committed files hold the process only (roles, steps, timeline); plan, notes, report, key and evidence in the case system
- [ ] Counsel review recorded before any sanction
