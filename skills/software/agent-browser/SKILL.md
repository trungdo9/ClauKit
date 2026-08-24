---
name: agent-browser
description: Token-efficient headless browser automation for AI agents using a snapshot+refs model (~93% less context than traditional tools)
category: Testing & Debug
status: active
---

# Agent Browser — Token-Efficient Browser Automation

## Purpose

Headless browser automation designed for AI agents. Instead of dumping the entire HTML tree into context, it returns compact snapshots with `@ref` handles pointing at interactive elements only. Think of it as Playwright redesigned for AI workflows — full browser automation power without drowning in verbose output.

Excels in long-running autonomous sessions where context preservation matters. Supports video recording for debugging, cloud browser testing via Browserbase, and self-verifying build loops where you need to confirm visual changes actually took effect.

## When to Use

- Long-running AI automation sessions where context budget matters
- Context-constrained workflows (sub-agents, deeply nested tool loops)
- Self-verifying build loops — confirm UI changes actually landed
- Video recording of automation runs for debugging
- Cloud browser execution via Browserbase (CI/CD)
- Multi-tab workflows and frame switching
- Authenticated sessions via saved browser state
- Mocking network requests/responses for deterministic tests
- Device emulation, geolocation overrides, offline mode

**Do NOT use when**: simple HTML scraping (use HTTP client), one-off screenshots (use [`chrome-devtools`](#agent-browser-vs-chrome-devtools)), or you need Puppeteer-level fine-grained control.

## Agent Browser vs `chrome-devtools`

| Use `agent-browser` for | Use `chrome-devtools` for |
|---|---|
| Long autonomous AI sessions | Quick screenshots |
| Context-constrained workflows | Custom Puppeteer scripts |
| Video recording | WebSocket debugging |
| Cloud browsers (Browserbase) | Integration into existing workflows |
| Multi-tab handling | Auth injection |
| Self-verifying build loops | Low-level CDP access |

## Core Capabilities

- **Snapshot + refs model** — captures only interactive elements with `@ref` handles (~280 chars vs Playwright MCP's 8K+)
- Navigate pages and interact with elements via `@ref` handles
- Record video of automation sessions
- Run tests on cloud browsers (Browserbase) for CI/CD
- Multi-tab workflows and frame switching
- Save/load browser state for authenticated sessions
- Mock network requests and responses
- Emulate devices, geolocation, offline mode

## Quick Workflow (4 Steps)

The standard agent loop:

```bash
# 1. Navigate
agent-browser open https://example.com

# 2. Snapshot — get @refs for buttons, inputs, links
agent-browser snapshot -i

# 3. Interact using @refs from the snapshot
agent-browser fill @e2 "user@example.com"
agent-browser click @e1

# 4. Re-snapshot after page changes
agent-browser snapshot -i
```

A snapshot returns something like:

```
@e1 button "Sign In"
@e2 input[email] "Email"
@e3 input[password] "Password"
@e4 link "Forgot password?"
```

Compact, addressable, and the agent never sees raw DOM until it needs to.

## Sample Tasks

- "Test login flow at example.com and verify dashboard loaded"
- "Navigate to pricing page and screenshot the comparison table"
- "Fill the contact form and confirm the success message appears"
- "Record video of checkout flow from cart to confirmation"
- "Run this test suite on Browserbase for CI"

## Activation

Triggered by mentioning browser automation tasks. ClauKit auto-activates this skill for web testing, scraping, and UI verification work.

## Common Patterns

### Authenticated session reuse

```bash
# First run — log in interactively and save state
agent-browser open https://app.example.com/login
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "$PASSWORD"
agent-browser click @e3
agent-browser state save ./auth.json

# Later runs — restore state, skip login
agent-browser state load ./auth.json
agent-browser open https://app.example.com/dashboard
```

### Video recording for debugging

```bash
agent-browser record start ./run.webm
agent-browser open https://example.com/checkout
# ... interactions ...
agent-browser record stop
```

### Network mocking

```bash
agent-browser route "**/api/user" --fixture ./user.json
agent-browser open https://app.example.com
```

### Cloud execution (Browserbase)

```bash
agent-browser --remote browserbase open https://example.com
```

## Common Pitfalls

- **Stale `@ref` handles**: refs invalidate after navigation or major DOM changes. Always re-snapshot after page transitions.
- **Skipping the snapshot step**: trying to `click @e1` before snapshotting won't resolve the ref. The snapshot is the source of truth for the current page state.
- **Treating it like Playwright**: don't reach for CSS selectors and XPaths — the whole point is to work through refs, not DOM queries.
- **Forgetting `-i` flag**: `snapshot -i` filters to interactive elements only. Plain `snapshot` returns a heavier view.
- **Cloud cost surprises**: Browserbase charges per session-minute. Set timeouts and tear down idle sessions.

## Related Skills

- [`test-automation`](../development/test-automation/SKILL.md) — Comprehensive testing with Playwright, Vitest, k6
