# Installation

## Prerequisites

- Node.js 18+
- Skill directory:
  - Project-scope (preferred): `.claude/skills/software/chrome-devtools/`
  - User-scope: `~/.claude/skills/software/chrome-devtools/`
- Linux/WSL: Chrome system libraries (`./install-deps.sh` ships with the skill)

## Install

```bash
# Detect skill location (project-scope preferred)
SKILL_DIR=""
if [ -d ".claude/skills/software/chrome-devtools/scripts" ]; then
  SKILL_DIR=".claude/skills/software/chrome-devtools/scripts"
elif [ -d "$HOME/.claude/skills/software/chrome-devtools/scripts" ]; then
  SKILL_DIR="$HOME/.claude/skills/software/chrome-devtools/scripts"
fi

cd "$SKILL_DIR"
npm install   # puppeteer, sharp, debug, yargs

# Linux/WSL only — install Chrome system libraries
./install-deps.sh
```

## Verify

```bash
node navigate.js --url https://example.com
# Expected output:
# {"success": true, "url": "...", "title": "..."}
```

## Browser Run Modes

The skill auto-detects OS and launches the browser accordingly:

| Platform | Default mode | Notes |
|---|---|---|
| Linux | headless | No window — for servers and CI |
| WSL | headless | Same as Linux |
| CI environments | headless | Detected via env vars |
| macOS | headed | Visible window for debug |
| Windows | headed | Visible window for debug |

Override with `--headless false` to force a visible window, or `--headless true` to force headless.

## Directory Structure

```
.claude/skills/software/chrome-devtools/
├── SKILL.md
├── scripts/
│   ├── navigate.js
│   ├── screenshot.js
│   ├── ...
│   ├── lib/browser.js       # Shared session helpers
│   ├── package.json
│   └── install-deps.sh
└── references/
```

## Output Directories (recommended)

Organize automation artifacts under `.claude/chrome-devtools/`:

```
.claude/chrome-devtools/
├── screenshots/             # Captured images
├── snapshots/               # ARIA YAML snapshots
├── logs/<session-id>/       # Console/network JSON per session
└── tmp/                     # Custom scripts
```
