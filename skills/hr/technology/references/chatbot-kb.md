# HR chatbot, knowledge base and automation templates

Synthetic test data only (hr-rules § 3). Volumes, thresholds and review cadences are the
organisation's own; no deflection or savings figures without a baseline (hr-rules § 4).

## Chatbot scope statement

```markdown
# HR assistant: <name> — release <n>
- Channel: <chat platform / portal>   ·  Audience: <employees / managers / countries>
- In scope (intents): <list — one domain first>
- Out of scope (route to human): <list>
- Answer sources: approved KB articles <space/IDs>; authenticated HRIS lookups <fields, least privilege>
- Never: approve, deny, rule on eligibility disputes, give legal/medical advice, discuss individual ER cases
- Identifies itself as an AI assistant: <opening line>
- Owner (role): <role>  ·  Content owner(s): <roles>  ·  Escalation queue(s): <team/role>
```

## Intent spec (one row per intent)

| Intent | Example phrasings (≥10 collected from logs) | Answer source | Variation conditions (country, worker type, tenure) | Required clarifying question | Escalation condition | Test status |
|---|---|---|---|---|---|---|

## Escalation matrix

| Trigger | Bot behaviour | Route to (role) | Context passed |
|---|---|---|---|
| Harassment, discrimination, retaliation, whistleblowing | Acknowledge, give confidential reporting route, stop automated handling | ER / designated contact | Summary, no speculation |
| Self-harm, crisis, threat to safety | Give emergency and support contacts immediately `[VERIFY: local services]` | Designated responder | Minimal, per protocol |
| Health, disability, accommodation | No advice; offer confidential contact | HR case owner | Request only, no health detail logged |
| Pay dispute, final pay, deductions | Explain process only | Payroll / HR | Period, query type |
| Immigration, work authorisation | No advice | Mobility / HR | Query type |
| Termination, discipline, legal questions | No advice | HRBP / ER | Query type |
| Explicit request for a human; repeated rephrasing; low confidence | Hand off without making the user repeat themselves | Tier-1 HR | Full transcript |

Fallback line shape: "I can't answer that reliably. Here is who can: <route>, typically responding in
<the organisation's service level>."

## Test and run checklist

- [ ] Each intent tested with many phrasings, typos, mixed languages
- [ ] Multi-topic messages, follow-ups that depend on earlier turns
- [ ] Sensitive-topic triggers route correctly every time
- [ ] Adversarial prompts (requests for other people's data, prompt injection via pasted text)
- [ ] Country / worker-type variations return the right policy version
- [ ] User acceptance with a sample of real employees; frustration points logged
- [ ] Launch comms say what it does, what it doesn't, how to reach a human
- [ ] Weekly transcript review in the first month; sampled review after
- [ ] Metrics: resolution with quality sample · wrong-answer rate · escalation rate · unresolved queries · satisfaction

## Knowledge-base article template

```markdown
# <Task, phrased as the employee would: "Request parental leave">
Applies to: <countries / entities / worker types>   ·  Policy source: <link, version>
Owner (role): <role>   ·  Last reviewed: <date>   ·  Next review: <date>

## In short (2–3 sentences)
## Steps
1. …
## Eligibility and exceptions   (statutory items marked [VERIFY: <law>])
## Who to contact
## Related articles
```

KB governance: categories follow employee tasks, not HR departments · one canonical article per
topic (duplicates redirected) · owner and review date mandatory · search-gap and ticket-theme review
sets the backlog · stale articles flagged automatically and retired on a cycle.

**Tacit-knowledge capture session:** ask the expert to walk through the most recent real case end to
end; probe "what do you check that isn't written down?", "what goes wrong?", "who do you call?";
record, draft the SOP, have the expert correct it, assign an owner.

## Automation triage sheet

| Process | Volume / month | Rules-based? | Stable? | Documented? | Error cost | Data quality of inputs | Decision (automate / redesign first / keep human) | Tool tier |
|---|---|---|---|---|---|---|---|---|

## Workflow spec (per automation)

```markdown
- Trigger: <event / schedule>
- Preconditions and data fields read (each passed quality check: yes/no)
- Rules: <if … then …>
- Exceptions → queue <role> with reason code: <list of reason codes>
- Notifications: <who, when, channel>
- Audit record: what, when, trigger, outcome, rule version
- Manual fallback and rollback: <steps, owner>
- Baseline metrics (before): cycle time · error rate · volume · HR effort  ·  Review after <period>
- Role impact decided and communicated: <yes / owner>
```
