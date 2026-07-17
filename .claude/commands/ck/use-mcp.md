---
description: Utilize tools of Model Context Protocol (MCP) servers
argument-hint: [task]
---
Execute MCP operations natively — modern Claude Code defers MCP tool schemas (loaded on demand), so no context-preservation detour is needed for discovery.

## Execution Steps

1. **Call MCP tools directly** for: $ARGUMENTS
   - Discover the connected servers' relevant tools and call the minimal set that accomplishes the task.

2. **Isolate verbose results**: when the task returns large payloads (bulk pagination, batch screenshots, long resource dumps), wrap the MCP calls in a `general-purpose` subagent and return only a concise summary + artifact paths to keep the main context clean.

3. **No suitable tool** → report which servers/tools were checked, then move on.

## Important Notes

- **DO NOT** create ANY new scripts or modify MCP configs.
- Server needs auth → direct the user to `/mcp` (interactive session) to authorize.
