# Live-Vault MCP (Optional Escalation)

Interact with a **running** Obsidian instance — read the active file, live search, trigger commands — instead of editing files statically.

**Default is static file editing.** Use this path only when live interaction is genuinely needed (e.g. "what note do I have open?", triggering an in-app command). ClauKit ships **no client code** — this file is a thin pointer only.

## Plugin requirement

- Community plugin: **Local REST API**.
- **Require version ≥ 4.1.3** (safety rule 4):
  - v4.0 (May 2026) shipped a built-in MCP server.
  - v4.1.3 patched a path-traversal CVE — **GHSA-62gx-5q78-wrvx**. Versions < 4.1.3 are **BLOCKED**: verify the installed version before any live-vault operation and refuse the MCP path if it's older.

## Setup steps

1. Obsidian → Community plugins → install & enable **Local REST API**.
2. Copy the API key from the plugin's settings tab.
3. Endpoint: HTTPS `https://127.0.0.1:27124/` (self-signed cert), MCP served at path `/mcp/`. A plain-HTTP variant exists on port 27123 — avoid it.
4. Register with Claude:

   ```bash
   claude mcp add --transport http obsidian https://127.0.0.1:27124/mcp/ --header "Authorization: Bearer <api-key>"
   ```

   The endpoint uses a self-signed cert; if the client rejects it, either import the plugin's cert (offered in its settings tab) or use the plugin's HTTP-insecure toggle only for `127.0.0.1`. Never disable TLS verification globally.

5. Route all usage through `/ck:use-mcp`.

## Safety

- **Localhost only** — the endpoint binds to 127.0.0.1 with a self-signed cert. NEVER expose the port publicly (no reverse proxy, no tunnel).
- **API key is a secret** — keep it in env/keychain; never commit it, never echo it into logs.
- **Version gate every use** — plugin ≥ 4.1.3, checked before each session's first call.

## Boundary & fallback

If the plugin is absent, disabled, or older than 4.1.3 → fall back to static file editing (the rest of this skill). Static editing covers all authoring, frontmatter, and rename/move work; the MCP path adds only live-instance awareness.
