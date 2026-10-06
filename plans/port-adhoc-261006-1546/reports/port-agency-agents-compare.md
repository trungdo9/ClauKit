# Port compare — agency-agents sales+finance vs ClauKit marketing kit

## Local conventions
- Marketing kit = **grouped skills reached by path** (`skills/<group>/<name>/SKILL.md`, depth 2, never depth 1) + `/mk:*` commands as entry points + few agents (agents cost a description in every session — registry 2026-09-28)
- Unrouted skills get pruned (registry 2026-09-28) → every ported skill needs a command/workflow route
- Skill frontmatter: `name`, `description` (with "Use for…" triggers + sibling disambiguation), `allowed-tools`; body: When this activates / Scope / method / output under `plans/marketing/…`
- Provenance: footer `Adapted from \`owner/repo\` → path (MIT). ClauKit adaptations: …` + `skills/THIRD_PARTY_NOTICES.md`
- Every `/mk:` command hard-fails without `plans/marketing-context.md`
- New install path ⇒ add to `marketing.json` + `both.json`; packaging test checks every relative `.md` link

## Overlap with existing kit
| source | overlaps | call |
|---|---|---|
| outbound-strategist | `cold-email` (copy, sequences), sales-workflow Ph1 | merge signal/ICP-tiering parts into new `outbound` or into `cold-email` refs |
| offer-lead-gen | `marketing-ideas`, `launch`, `/mk:growth` | keep (offer construction is missing locally) |
| pipeline-analyst | `crm-specialist` agent (lead scoring) | keep — forecast/velocity missing locally |
| discovery-coach | `customer-research` (JTBD interviews, not sales calls) | keep |
| sales-coach | pipeline-analyst + deal-strategist (pipeline review dupes) | fold into those two |
| financial-analyst ↔ fpa-analyst | each other (forecast, scenarios) | candidate merge |

## Deps / infra
None. Pure markdown.

## Risks
1. Finance (tax, bookkeeping, investment) is off-mission for a *marketing* kit and the `/mk:` context hard-fail does not fit it
2. Tax/investment content = advice risk → needs "not professional advice / verify jurisdiction & date" guardrails, no invented rates
3. Unsourced stats → strip or relabel
4. Count drift: registry, README, kit description, `docs/codebase-summary.md` all state counts
