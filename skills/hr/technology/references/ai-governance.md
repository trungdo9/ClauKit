# AI in HR — governance templates

Not legal advice. Laws named here are pointers, each `[VERIFY: <jurisdiction>]` before use
(hr-rules § 2). AI may draft, summarise and flag; it does not decide hiring, firing, promotion, pay or
discipline (hr-rules § 6).

## Use-case register entry

```markdown
# AI use case: <name> — v<n> <date>
- Purpose (one sentence):
- Class: administrative assistance | decision support | automated decision-making (not permitted for employment outcomes)
- HR decision touched: <none / hiring / promotion / pay / performance / exit / discipline / access to sensitive data>
- Affected people: <candidates / employees / segment>  ·  Countries: <list>
- Inputs (data categories, incl. inferred):          Outputs:
- Prohibited inputs and uses: <rank people, infer protected traits, diagnose health, recommend outcomes…>
- Oversight mode: full review | exception review | audit review (trivial, reversible only)
- Human reviewer (role) and override authority:
- Business owner (role):  ·  Technical owner (role):  ·  Privacy lead (role):
- Regulatory pointers: <e.g. EU AI Act Annex III employment uses [VERIFY]; local AEDT rules [VERIFY]; data-protection law [VERIFY]>
- Notice to affected people: <where, when, text ref>  ·  Contest / human-review route:
- Retention of inputs, outputs, logs:
- Pilot: scope, baseline, success criteria, stop criteria
- Approvals (roles, dates)  ·  Next review date  ·  Re-review triggers: model update · data change · legal change · incident
```

## DPIA / privacy impact — question set

1. **Data inventory** — what is collected, generated and **inferred**? Where stored, for how long?
2. **Purpose and necessity** — what problem? Could it be done with less data or without AI?
3. **Lawful basis** per country — why not consent if consent is claimed (power imbalance in employment) `[VERIFY]`.
4. **Special-category data** — any health, biometric, ethnicity, religion, union, sexual-orientation data, directly or by inference? (Default: exclude — hr-rules § 3.)
5. **Repurposing** — is any input collected for another purpose (survey, performance development)?
6. **Third parties** — vendor, subprocessors, model training on our data (opt-out?), transfers out of country `[VERIFY: transfer mechanism]`.
7. **Access** — who sees outputs at individual level? Manager? HRBP? Leadership dashboards (avoid)?
8. **Rights** — access, correction, objection, explanation, human review: how fulfilled, by whom, in what time `[VERIFY: statutory deadline]`.
9. **Risks** — likelihood × severity for: wrong inference, discrimination, chilling effect, breach, function creep.
10. **Mitigations** — minimisation, pseudonymisation, access limits, retention, human review, testing, notice.
11. **Residual risk and sign-off** — privacy lead, legal; consult employee representatives where required `[VERIFY]`.

## Vendor due-diligence questionnaire

**Model and training** — What data trained the model; how was it labelled; how recent? Has it been
fine-tuned on customer data — ours? Can we opt out of training reuse?
**Fairness** — Independent bias audit: by whom, when, scope; can we read the report? Selection rates
and error rates by group? Mitigations applied? How often re-tested?
**Explainability** — For one specific output, can you show why? What does the reviewer see?
**Change control** — How are model updates disclosed; contractual notice period; can we pin a version?
**Data** — What is retained after processing, where, how long? Residency options? Deletion on exit
and proof? Subprocessor list and change notification? Breach notification commitment?
**Compliance support** — Documentation you provide for our bias audits, DPIAs, notices, record-keeping
under applicable AI and data-protection rules `[VERIFY]`.
**Logs** — What is logged per decision; retention; export to us?
**Agents** (if the product takes actions) — Which actions run without confirmation and how are they
configured? How are failures surfaced (silent vs alert)? Can you demonstrate behaviour at the edge of
configured limits? How is the agent paused and actions reversed?
**Viability** — Funding/ownership stability, support model, exit and transition assistance.

## Bias evaluation plan

```markdown
- Outcome evaluated: <pass-through / ranking / flag>   ·  Population and period:
- Groups analysed (where lawful to process): <…>   ·  Minimum group size: <from hr-context>
- Metrics: selection rate by group · adverse-impact ratio (vs highest-rate group) · false-positive / false-negative rate by group · calibration by group
- Fairness definition chosen and why (signed by legal + DEI):
- Tests: historical sample with known outcomes · synthetic profiles varying one attribute · human-reviewed sample vs tool · atypical inputs (gaps, career change, language, accessibility)
- Proxy review: features correlated with protected traits and decision on each
- Thresholds for escalation and action (set by legal per jurisdiction [VERIFY])
- Result, actions taken, re-test date
```

## Agent autonomy boundary

| Action | May do autonomously | Must hand to human | Never |
|---|---|---|---|
| Send reminders, schedule, share approved FAQ answers | yes (after staged rollout) | | |
| Collect documents, track task status | yes | exceptions | |
| Answer questions involving pay, visa/work authorisation, health, hesitation to start | | yes | |
| Advance, reject or rank candidates; change status, pay or access to sensitive data | | | yes |

Staging: full review of every action → exception review once error rate on a sampled log meets the
agreed bar → periodic sampling for trivial actions only. Kill switch tested before launch: pause
without losing state · notify affected people · correct records · named authority to invoke.

## Employee / candidate notice — required elements

- That an AI tool is used, in which process step, and for what purpose
- What it does **not** decide; who the human decision-maker is (role)
- Data categories used; retention
- How to ask a question, request human review or an alternative process, and contest an outcome
- Contact point (role / channel); where the full privacy notice is
- Plain language; tested for comprehension; translated where the workforce needs it

## GenAI use standard (HR staff)

| | |
|---|---|
| **Permitted** | First drafts from approved sources, variations, summaries of anonymised input, plain-language rewrites, interview-question drafts against a written job-related rubric |
| **Not permitted** | Deciding or recommending an employment outcome; disciplinary letters, investigation findings, individual written feedback sent unedited; inferring protected traits |
| **Data** | Only tools approved by procurement and privacy; anonymise otherwise; never names, IDs, pay of individuals, health, ER or immigration details |
| **Review before sending** | Facts and figures · invented policy or details · tone and audience · legal wording (templates reviewed by legal) · inclusive language and proxy criteria |
| **Accountability** | The person who sends or approves the content owns it |
| **Transparency** | Team norm: say when a draft was AI-assisted |

**Prompt library entry:** role · task · context · format · constraints · example output · owner ·
last tested · "when to use" note. Test on several realistic cases before adding; review on a cadence.

## Adoption measurement (after governance approval)

Funnel per role and use case: aware → first successful use → repeat use in the target workflow →
quality vs baseline (correction rate, rework) → confidence → safe-use adherence. Falling usage
triggers investigation (relevance, data, policy clarity, manager reinforcement), not a mandate.
