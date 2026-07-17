---
description: ⚡⚡ Research technical topics — technology evaluation, best practices, solution design
argument-hint: [topic]
---

**Activate the `research` skill** ([.claude/skills/software/research/SKILL.md](.claude/skills/software/research/SKILL.md)) — single source of truth for research methodology. This command is the trigger.

## Topic
<topic>$ARGUMENTS</topic>

## Workflow

1. **Scope** — clarify key terms, recency requirements, evaluation criteria, depth boundaries.
2. **Gather** — spawn `researcher` agent(s) in parallel (max 5 tool calls each):
   - Use the `WebSearch` tool for web searches.
   - Use `docs-seeker` skill when a GitHub repo URL is found.
3. **Analyze** — identify patterns, best practices, pros/cons, security + performance implications, compatibility.
4. **Report** — save to `./plans/<plan-name>/reports/YYMMDD-<topic>.md` per research skill's report template.

## Use Cases

- **Technology evaluation**: compare libraries/frameworks/tools, assess maturity + adoption + trade-offs.
- **Best practices**: current standards, security considerations, performance patterns.
- **Solution design**: research approaches before planning/implementation.
- **API / integration**: explore external service options, authentication methods, SDKs.

## Important
- Max **5 searches** total — think carefully before each one.
- Concise grammar, sacrifice style for brevity in reports.
- List unresolved questions at the end of the report.
- All methodology rules → `research` skill.

**Related:** `/ck:plan` (turns research into an implementation plan), `/ck:cook` (full lifecycle), `/ck:brainstorm` (exploratory discussion before committing to a direction).
