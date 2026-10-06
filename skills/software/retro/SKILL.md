---
name: retro
description: Facilitate team retrospectives — structured backward-looking reflection on completed sprints, features, or incidents to extract lessons and drive continuous improvement.
category: Team Methodology
status: active
---

# Retro

## Purpose

Run structured team retrospectives: surface what worked, what didn't, and convert insights into tracked action items. Distinct from `[[journal]]` (personal reflection) and `[[planning]]` (forward design).

## When to Use

- End of sprint, milestone, or feature completion
- Post-incident analysis (blameless post-mortems)
- Quarterly team-health reviews
- When the same problem recurs across cycles (forces structured introspection)

Activation phrases: *"run a retro on..."*, *"what went well/badly..."*, *"facilitate team reflection"*, *"document lessons from..."*

## Core Formats

Pick one per session — mixing dilutes focus.

| Format | Prompts | Best for |
|---|---|---|
| **Start / Stop / Continue** | What to start, stop, continue doing? | New teams; clear action bias |
| **Glad / Sad / Mad** | Emotions surface root causes | Conflict, low morale |
| **4 L's** | Liked / Learned / Lacked / Longed-for | Mature teams; nuance |
| **5 Whys** | Drill into one specific failure | Post-incident |
| **Sailboat** | Wind (helps), anchors (slows), rocks (risks), island (goal) | Roadmap-style retros |

## Facilitation Workflow

1. **Set the stage** (2 min) — state the time window under review; reaffirm psychological safety; remind: blame the system, not the person.
2. **Gather data** (10 min) — silent writing on sticky notes (one observation per note). Async-friendly variant: shared markdown doc, 24h window.
3. **Generate insights** (10 min) — cluster notes by theme; let patterns emerge.
4. **Decide actions** (10 min) — each action item must have an **owner** + **due date** + **measurable outcome**. No "we should..." without a name.
5. **Close** (3 min) — read action items aloud; capture in markdown report.

Time-box ruthlessly: **30 minutes for weekly retros, 60 minutes for sprint retros**. Long retros lose attention and produce vague actions.

## Output Template

Save to `plans/retros/YYMMDD-<topic>-retro.md`:

```markdown
# Retro · <topic>
**Date**: YYYY-MM-DD · **Period**: <start> → <end> · **Attendees**: ...
## Went well
- ...
## Didn't go well
- ...
## Action items
- [ ] <action> — owner: @name — due: YYYY-MM-DD — measure: <criterion>
## Themes / patterns
- ...
```

## Anti-Patterns

- **Blame-storming**: focus shifts to people, not systems. Fix: facilitator reframes ("what process let this happen?").
- **Action-item graveyard**: items never tracked. Fix: review last retro's actions at the start of the next; archive completed, escalate stale.
- **Silenced voices**: senior people dominate. Fix: silent writing first, then read-around; weight intro/extrovert participation.
- **Ritual without change**: same complaints every cycle. Fix: bias toward small, owned, measurable actions over big-picture rants.

## Future Enhancement

Auto-extract candidate retro topics from `STATE.md` halt rulings (`[[run-state]]`) and `/ck:journal` entries — deferred.

## References

See `references/`:
- `atlassian-retrospectives.md` — Agile-standard facilitation framework
- `agile-retrospective-methods.md` — Methods, examples, timing (2024)
- `aha-continuous-improvement.md` — Continuous improvement loop integration

## Cross-links

`/ck:journal`, `[[planning]]`, `[[team]]`, `[[run-state]]`
