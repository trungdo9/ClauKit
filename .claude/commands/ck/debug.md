---
description: ⚡⚡ Debugging technical issues and providing solutions.
argument-hint: [issues]
---

**Reported Issues:**
$ARGUMENTS

Use the `debugger` subagent to find root cause(s), then analyze and explain reports to the user.

The `debugger` agent reads the `debugging` skill file ([.claude/skills/software/debugging/SKILL.md](../../skills/software/debugging/SKILL.md)) — single source of truth for the 4-technique methodology (Systematic Debugging · Root Cause Tracing · Defense-in-Depth · Verification).

## Important
- **DO NOT** implement the fix automatically — investigate + report only.
- Concise grammar in outputs.
