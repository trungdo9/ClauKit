# Listening kit

Templates for surveys, stay interviews and action planning. Aggregate data only in `plans/hr/`; no names, no special-category data (hr-rules § 3). Figures cited or `[NEEDS DATA]`.

## Survey design brief

```markdown
# Survey: <name> — <date>
Purpose: <decision(s) this survey will inform>
Type: periodic outcome+driver / pulse / lifecycle (<moment>) / exit
Population: <roles, locations, languages, frontline access>
Anonymous or confidential: <which, and who can see identity — say it plainly to employees>
Minimum reporting group size: <n agreed with legal/works council on <date>>
  - applies to every cut, filter combination and comment view
  - differencing protection: <how overlapping cuts are blocked>
  - comment handling: <redaction before manager view>
Demographic items: <list> — optional, purpose stated, lawful basis <ref>, counsel sign-off <yes/no>
Consultation: works council / employee forum `[VERIFY: <jurisdiction>]` — status <...>
Results date (published at launch): <date>
Owners: survey <role> · analysis <role> · action loop <role>
```

## Item bank (choose few; each must drive a decision)

| Construct | Behaviour-anchored item example |
|---|---|
| Outcome | I would recommend this organisation as a place to work (0–10, eNPS) · I intend to be working here in <period> |
| Manager | My manager gives me feedback that helps me improve · My manager follows up on what we agree |
| Clarity | I know what is expected of me this quarter |
| Growth | In the last <period> I have had a conversation about my development |
| Recognition | When I do good work, someone acknowledges it specifically |
| Workload | My workload allows me to do quality work in normal hours |
| Psychological safety | On my team, people can raise problems without fear of blame |
| Inclusion | I can be myself at work · Decisions about opportunities are fair |
| Leadership trust | Leaders explain the reasons behind decisions that affect me |
| Communication | I get the information I need to do my job |
| Action credibility | I believe action will be taken on the results of this survey |
| Open | What is one thing we should start / stop / keep doing? |

Use licensed validated scales for core constructs where available; keep the same wording across cycles for trend.

## Analysis checklist

- [ ] Participation by segment (low participation is a trust signal)
- [ ] Segment cuts only above the minimum group size
- [ ] Drivers ranked by low score × strength of relationship with the outcome
- [ ] Company average checked against team spread (flat average hiding decline?)
- [ ] Triangulated with exits, absence, mobility, pulse history
- [ ] Comments themed after redaction; AI theming only on de-identified text

## Manager results conversation (team)

```text
1. Thank the team; restate anonymity rules.
2. Share 2 strengths and 2 concerns from the team report — no guessing who said what.
3. Ask: "What is behind this?" — listen, do not defend.
4. Agree 1–3 actions the team can influence; owner + date for each.
5. Name what needs escalation beyond the team.
6. Set the check-in date.
```

## Action plan

| Priority item | What we heard (aggregate) | Action | Owner (role) | Due | How we'll know |
|---|---|---|---|---|---|

Escalated to company level: <items teams cannot fix, owner>

## Close-the-loop message

```text
Subject: What you told us and what happens next
You told us: <2–3 headline findings, honest, including the uncomfortable one>
We are doing: <specific actions, owner, date>
We are not changing <x> right now because <reason>.
Next check: <pulse date>. Questions: <channel>.
```

## Stay interview guide

Run by the manager, or by an HRBP when the manager is the concern. Record themes, not attributions.

1. What part of your work gives you the most energy right now?
2. What drains energy or creates avoidable friction?
3. What keeps you here today?
4. What might make you consider leaving in the next year?
5. Are your skills being used well? Why or why not?
6. What support from your manager would make the biggest difference?
7. What is one change in the next month that would improve your experience?

Close: thank, state what you can and cannot commit to, agree a follow-up date.

## Exit insight

Produced by hr-people-ops (`/hr:people offboard` → `exit-themes.md`); this skill only reads the themes alongside survey and stay-interview data.

## Engagement recovery checkpoints

| Checkpoint | Question | Evidence | Owner |
|---|---|---|---|
| ~30 days | Have managers held team conversations and committed actions? | Action log | HRBPs |
| ~60 days | Are committed fixes visible, or did they slip as attention faded? | Pulse items, action status | EX lead |
| ~90 days | Do employees describe the response as credible? Retention trend? | Pulse, stay-interview themes, exits | Head of People |
