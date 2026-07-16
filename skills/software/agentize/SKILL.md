---
name: agentize
description: Convert an existing codebase into a CLI + MCP server so AI agents can invoke its functions as tools — picking what to expose, defining schemas, handling auth and side effects.
category: AI Agent Integration
status: active
---

# Agentize

## Purpose

Take an existing library, service, or codebase and **expose it to AI agents**. The output is two complementary surfaces:

1. A **CLI** — human-runnable, scriptable, the unit AI agents shell out to.
2. An **MCP server** — structured tool surface for Claude / OpenAI / other MCP clients.

Distinct from `[[orchestrate]]` (which delegates to existing agents) and knowledge-doc skills (which capture methodology). This skill is about exposing *executable* capability.

## When to Use

- You have an internal tool you want Claude / Cursor / OpenCode to use directly
- A teammate keeps copy-pasting CLI commands into chat — automate it as MCP
- Open-sourcing a library and want LLM-first ergonomics from day 1
- Existing CLI is verbose; want a smaller surface tuned for agents

Activation phrases: *"make this an MCP server"*, *"expose this to AI agents"*, *"agentize this CLI"*, *"convert this script to MCP"*

## Step-by-Step Conversion

### 1. Inventory capabilities

List every operation a human user does. For each: name, inputs, output shape, side effects, idempotence, auth needs.

### 2. Decide which to expose

Not every function deserves to be a tool. Filter rules:

- **Frequency** — exposed if called often.
- **Determinism** — exposed if idempotent or has clear undo. Irreversible operations (DELETE on prod) get a `--confirm` flag at minimum.
- **Granularity** — prefer 5 mid-grained tools to 50 fine-grained ones. Each tool definition costs tokens — see `[[context-engineering]]`.

### 3. Define schemas

Every MCP tool needs a JSON schema. Be specific:

- Use enums, not free strings, where the set is known.
- Mark required vs optional explicitly.
- Add `description` to every property — the model reads these.
- Reject ambiguous parameter names (`name` → `repo_name` or `file_name`).

### 4. Implement the CLI shell

A single binary with subcommands maps cleanly to MCP tools:

```
my-tool list-projects
my-tool create-project --name X
my-tool deploy --project X --env prod
```

The MCP server then translates each tool call to a subprocess (`my-tool deploy --project X --env prod`) or directly to a Python/Node function.

### 5. Authentication

Three patterns:

- **Tokens in env** — simplest; MCP server reads at startup.
- **OAuth** — for SaaS-style integrations; client browser-auths once.
- **Per-call credentials** — pass in tool args; only for low-stakes shared tools.

### 6. Side effects and confirmation

Destructive tools should expose a **dry-run mode** and require the model to set `confirm: true` explicitly. Don't rely on the model to be careful; design the schema to make caution the default.

## Output Structure

```
my-tool/
├── cli/                 # CLI entrypoint
├── mcp_server/          # MCP server: tool definitions + dispatchers
│   ├── tools/           # one file per tool, schema + handler
│   └── server.ts
├── package.json
└── README.md            # how to install as CLI; how to register as MCP
```

## Anti-Patterns

- **Mirroring every internal function** — the surface gets unwieldy; agents pick the wrong tool. Curate.
- **Stringly-typed parameters** — `mode: string` accepting "dev" or "prod" should be `mode: enum`.
- **Hidden state** — tool that depends on a prior tool's side effect without saying so. Make dependencies explicit in descriptions.
- **No idempotence on "create"** — `create_project` should be safe to retry; otherwise model retries cause duplicates.

## References

See `references/`:
- `mcp-spec.md` — Model Context Protocol specification
- `anthropic-agents-tool-use.md` — tool-use best practices
- `cli-design-guidelines.md` — UX patterns for agent-friendly CLIs

## Cross-links

`[[mcp-manager]]`, `[[context-engineering]]`, `[[orchestrate]]`
