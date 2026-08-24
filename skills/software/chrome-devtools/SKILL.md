---
name: chrome-devtools
description: Puppeteer-based browser automation via single-purpose CLI scripts with persistent sessions and structured JSON output
category: Testing & Debug
status: active
---

# Chrome DevTools — Puppeteer Automation Toolkit

## Purpose

Browser automation through Puppeteer CLI scripts with **persistent sessions**. Every script outputs structured JSON for easy parsing. Navigate URLs, screenshot with auto-compression, click elements, fill forms, execute JavaScript in page context, monitor console/network, and measure Core Web Vitals.

The skill emphasizes **persistent browser sessions**: the browser keeps running across script executions, preserving state (logged-in sessions, cookies). Scripts disconnect but leave the browser alive for the next script — making multi-step workflows efficient.

## When to Use

- Quick screenshots and visual verification
- Custom Puppeteer automation scripts
- WebSocket debugging
- Integrating into existing developer workflows
- Auth injection and session reuse
- Low-level CDP (Chrome DevTools Protocol) access
- Console/network/performance debugging
- Web scraping with full JS execution

**Do NOT use when**: running long autonomous AI sessions (use [`agent-browser`](../agent-browser/SKILL.md)), or for unit/E2E framework testing (use [`test-automation`](../development/test-automation/SKILL.md)).

## When to Use vs `agent-browser`

| Use `chrome-devtools` for | Use [`agent-browser`](../agent-browser/SKILL.md) for |
|---|---|
| Quick screenshots | Long autonomous AI sessions |
| Custom Puppeteer scripts | Context-constrained workflows |
| WebSocket debugging | Video recording |
| Existing workflow integration | Cloud browsers (Browserbase) |
| Auth injection | Multi-tab handling |
| Low-level CDP access | Self-verifying build loops |

## Prerequisites

- Node.js 18+
- Skill directory (project-scope `.claude/skills/chrome-devtools/` or user-scope `~/.claude/skills/chrome-devtools/`)
- Linux/WSL: Chrome system libraries (skill includes `install-deps.sh`)

See [references/installation.md](references/installation.md) for full setup.

## Quick Start

```bash
# Install
cd .claude/skills/chrome-devtools/scripts && npm install
./install-deps.sh   # Linux/WSL only

# Verify
node navigate.js --url https://example.com
# {"success": true, "url": "...", "title": "..."}
```

## The 4-Step Workflow

```bash
# 1. Navigate
node navigate.js --url https://example.com/login

# 2. Discover elements (when structure unknown)
node aria-snapshot.js

# 3. Interact (browser stays alive between calls)
node fill.js --selector "#email" --value "user@example.com"
node click.js --selector "button[type=submit]"

# 4. Verify and close
node screenshot.js --output ./result.png
node navigate.js --url about:blank --close true
```

## Available Scripts

All scripts live in `scripts/` and output JSON.

| Script | Purpose |
|---|---|
| `navigate.js` | Navigate to URLs |
| `screenshot.js` | Capture screenshots (auto-compresses if >5MB) |
| `click.js` | Click elements |
| `fill.js` | Fill form fields |
| `evaluate.js` | Execute JavaScript in page context |
| `snapshot.js` | Extract interactive elements (JSON) |
| `aria-snapshot.js` | Get ARIA accessibility tree (YAML with refs) |
| `select-ref.js` | Interact with elements by ref from ARIA snapshot |
| `console.js` | Monitor console messages/errors |
| `network.js` | Track HTTP requests/responses |
| `performance.js` | Measure Core Web Vitals |
| `ws-debug.js` | Debug WebSocket connections (basic) |
| `ws-full-debug.js` | Debug WebSocket with full events/frames |

Detailed usage: [references/scripts-reference.md](references/scripts-reference.md)

## Session Persistence

Browser state persists across script runs via `.browser-session.json` (WebSocket endpoint).

- **No flag** → keep browser running (default)
- `--close true` → close browser and remove session file

This is the key feature for multi-step workflows: login once, then run many follow-up scripts that reuse the authenticated state.

## Browser Run Modes

Auto-detected from OS:

- **Linux, WSL, CI** → headless
- **macOS, Windows** → headed (visible window for debug)

Override with `--headless false` to force visible.

## Common Options (all scripts)

- `--headless false` — show browser window
- `--close true` — close browser entirely (default: keep alive)
- `--timeout 30000` — timeout in ms
- `--wait-until networkidle2` — wait strategy (`load`, `domcontentloaded`, `networkidle0`, `networkidle2`)

## Examples

See [references/examples.md](references/examples.md) for full workflows:
- Automated login flow
- Debug unknown page structure (ARIA discovery)
- Capture error logs (console + network)
- Performance audit (Core Web Vitals)
- Web scraping
- Testing local HTML files

## Custom Scripts

For complex automation, write custom scripts in `.claude/chrome-devtools/tmp/` using the `lib/browser.js` helpers (`getBrowser`, `getPage`, `disconnectBrowser`, `outputJSON`). See [references/custom-scripts.md](references/custom-scripts.md).

## Troubleshooting

Common issues and fixes: [references/troubleshooting.md](references/troubleshooting.md)

Quick reference:

| Error | Fix |
|---|---|
| `Cannot find package 'puppeteer'` | `npm install` in scripts dir |
| `libnss3.so` missing | `./install-deps.sh` |
| Element not found | Use `aria-snapshot.js` first |
| Script hangs | `--timeout 60000` or `--wait-until load` |
| Stale session | Delete `.browser-session.json` |

## Best Practices

1. **Use session persistence** — keep browser alive for multi-step workflows
2. **Close when done** — `--close true` on the final script
3. **Discover elements first** — `aria-snapshot.js` beats guessing selectors
4. **Organize outputs** — timestamped session directories under `.claude/chrome-devtools/`
5. **Never `file://`** — always serve local HTML through a server (CORS, ES modules, fetch all break otherwise)
6. **Test incrementally** — execute → verify JSON → continue

## Related Skills

- [`agent-browser`](../agent-browser/SKILL.md) — Token-efficient alternative for long AI sessions
- [`test-automation`](../development/test-automation/SKILL.md) — Playwright/Vitest/k6, the single testing toolkit
- [`frontend-design`](../design/frontend-design/SKILL.md) — Screenshot implementations for design comparison

## Core Principle

Incremental, focused scripts. Structured JSON output. Persistent sessions. ARIA-first discovery. One script, one task — repeat until done.
