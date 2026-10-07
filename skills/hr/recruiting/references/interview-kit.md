# Structured interview kit

Companion to the `hr-recruiting` skill file (actions `interview`, `assess`). Built from the intake brief;
competencies are fixed before the first interview (hr-rules § 5). Candidates appear as pseudonyms
(Candidate A) in anything under `plans/hr/` (hr-rules § 3).

## 1. Competency card (one per competency, 4–6 per role)

```markdown
### [Competency] — owner: [interviewer role]
- Definition for this role: [one line, observable — not "smart", "good communicator"]
- Traces to: [task / outcome from intake brief]
- 4 = [what exceptional evidence looks like at this level]
- 3 = [solid, consistent evidence]
- 2 = [some evidence, notable gaps]
- 1 = [little or no evidence]
```

## 2. Panel plan

| Interviewer (role) | Primary competency | Format | Length |
|---|---|---|---|
| Hiring manager | [...] | Behavioural + situational | [...] |
| Peer / cross-functional | [...] | Behavioural | [...] |
| [Specialist] | [...] | Work sample review / case | [...] |
| All | Common opener: "[same question for everyone]" | — | 5 min |

Check: each competency owned once; none untested; total candidate time proportionate to the role.

## 3. Question set (per competency)

```markdown
### [Competency]
Behavioural (STAR): "Tell me about a time you [situation relevant to the competency].
What was the situation, what did you do, and what happened?"
Situational: "Imagine [realistic scenario from this role]. How would you approach it?"
Probes (use as needed, same for all candidates):
- "What was your specific part, versus the team's?"
- "What information did you use to decide?"
- "How did you handle [the stakeholder who lost out / the setback]?"
- "Looking back, what would you do differently?"
Strong answers show: [specific situation · own actions · reasoning · result · reflection]
Weak answers show: [vague or hypothetical · "we" only · no reasoning · no result · blame]
```

Worked example — *prioritisation and trade-offs* (product role):
- Behavioural: "Tell me about a time two roadmap items both had strong backing and you could ship only one first."
- Situational: "Engineering says a critical fix delays your launch two weeks; sales needs that launch for a renewal. What do you do?"
- Strong: names the decision process and the inputs used, how the deprioritised stakeholder was told, a measurable outcome, a genuine lesson.
- Weak: "I trust my gut", no specific case even after probing, decision framed around avoiding conflict, no outcome.

## 4. Questions never asked (hr-rules § 5)

Age or graduation year · pregnancy, family plans, childcare · marital or partner status · religion or
holidays observed · ethnicity, national origin, nationality (ask everyone the same right-to-work question
only) · disability, health, medical history (ask only whether essential functions can be done with or
without adjustment, where lawful) · sexual orientation, gender identity · union membership · political
views · financial status, debts · salary history or criminal record where restricted [VERIFY: jurisdiction].

Also out: brain-teasers and trivia unrelated to the job; "culture fit" questions not tied to a named
competency; leading questions ("You're comfortable with long hours, right?").

If a candidate volunteers protected information: do not follow up, do not record it, do not let it
affect the score.

## 5. Scorecard

```text
Req: [slug]   Candidate: [pseudonym]   Interviewer: [role]   Date: [YYYY-MM-DD]
Competency: [assigned competency]

EVIDENCE (what the candidate said or did — write this first):
-
-
STRENGTHS (tied to evidence):
CONCERNS (tied to a specific gap, not a feeling):

RATING (after evidence; before any panel discussion):
[ ] 4 exceptional  [ ] 3 solid  [ ] 2 gaps  [ ] 1 little/no evidence
Recommendation for this competency: [advance / hold / no]
Completed within [n] hours of the interview: [yes/no]
```

## 6. Scorecard QA (HR, before the debrief)

- [ ] Evidence field has specifics (quotes, actions, results), not impressions
- [ ] Rating consistent with the written evidence
- [ ] Concerns name a specific gap ("did not say how the deprioritised team was told")
- [ ] Stays within the assigned competency
- [ ] No reference to a banned topic, appearance, accent, age cues or "fit"
- [ ] Submitted before any discussion with other panellists

Flagged → returned for specifics before the debrief. Cannot be recalled → treated as low-confidence input,
not discarded silently; banned-topic content → struck and noted.

## 7. Debrief agenda

1. Confirm every scorecard was submitted independently before the meeting.
2. Go competency by competency: owner gives rating + evidence; others add only direct observations.
3. Split ratings: "What did the candidate say or do that supports a 4 versus a 2?" Unresolved → record
   the split; do not average it away.
4. Review must-haves one by one; check disqualifiers.
5. Decision: hire / no hire / hold, against the criteria — not against other candidates' charisma.
6. Record the decision and the evidence that drove it; name the owner of candidate communication.
7. Before outcomes across the req are final: stage pass rates by group, aggregated where lawful
   (adverse-impact check, hr-rules § 5).

## 8. Reference check

**Before:** candidate consent; list of who will be called (on-list; off-list only for senior roles and
with the candidate's knowledge); what former employers may disclose locally [VERIFY: jurisdiction].

**Opening:** who you are, the role, how long; "the goal is to set [candidate] up well if they join."
Confirm relationship, capacity, overlap period.

**Core questions (same for every reference):**
1. "How would you describe their performance in that role?"
2. "What were their most significant contributions?"
3. "Where did you give them the most development feedback?"
4. "Tell me about a time their work fell short. What happened and what did they do?"
5. Role-specific: "[competency probe from the kit, e.g. how they managed an under-performer]"
6. "Would you hire / work with them again?" → "Without hesitation, or with reservations?" → "What drives that?"
7. "Anything that would help us support them in this role?"

**Reading signals:** measured vs enthusiastic tone; hedges ("very smart, just sometimes…") — always
follow up; pauses; topics avoided; no examples available. Look for patterns across references; one
lukewarm call alone is not a verdict. Uniformly glowing with no development area = probe harder.

**Summary matrix (no names, no quotes that identify the reference):**

| Theme | Ref 1 (manager) | Ref 2 (peer) | Ref 3 (report) | Consistent? |
|---|---|---|---|---|
| [competency] | [evidence] | [evidence] | [evidence] | [Y/N] |
| Rehire answer | [...] | [...] | [...] | |
| Development areas | [...] | [...] | [...] | |
| Onboarding support suggested | [...] | | | |

Material concern (ethics, misrepresentation) → pause, discuss with the hiring manager on the evidence,
consider a focused follow-up conversation with the candidate. Rescinding a conditional offer on
reference or background findings: *review with qualified employment counsel (or the relevant authority) before acting.*
