#!/usr/bin/env node
/**
 * Generates 12 new marketing/automation commands (Phase 5).
 *
 * 8 marketing commands (dispatcher pattern, like /ck:seo):
 *   /mk:plan, /mk:seo, /mk:content, /mk:email, /mk:ads, /mk:cro,
 *   /mk:research, /mk:growth
 *
 * 4 automation commands (workflow entry points):
 *   /mk:campaign, /mk:leads, /mk:nurture, /mk:video
 *
 * All require plans/marketing-context.md (hard fail if absent).
 *
 * WRITE-ONCE. Four of these have been edited by hand since — `/mk:seo` grew the
 * `plan`, `write` and `campaign` actions (2026-07-23/07-25) and is now 78 lines
 * against this template's 50. A re-run used to silently roll all of that back.
 * See scripts/lib/gen-write.js.
 * Usage: node scripts/generate-marketing-commands.js [--force] [--dry-run]
 */
const path = require("path");
const { parseArgs, writeOnce, report, count } = require("./lib/gen-write");

const COMMANDS_ROOT = path.join(__dirname, "..", ".claude", "commands", "mk");

const { COMMANDS } = require("./lib/marketing-commands");

function template({ desc, hint, actions, activate, output }) {
  const actionList = actions.map(a => `- **\`${a.name}\`** — ${a.what}\n  - skills: ${a.skills.map(s => `\`${s}\``).join(", ")}`).join("\n");

  return `---
description: ${desc}
argument-hint: ${hint}
---

## Pre-flight (HARD FAIL)

**If \`plans/marketing-context.md\` is missing, refuse to run and direct user to \`/mk:plan\`.**

Per .claude/workflows/marketing-rules.md, every \`/mk:\` command requires the marketing context hub. The only exception is \`/mk:plan\` itself.

## Variables

ACTION: $1 (default: ${actions[0]?.name || "default"})
REST: $2..$n (action-specific arguments)

## Workflow

${activate}

### Actions

${actionList}

## Output

${output ? `Results written to \`${output}\`` : "Results written per skill output paths."}

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: \`.claude/workflows/marketing-rules.md\`, \`.claude/workflows/automation-rules.md\`, \`skills/marketing/README.md\`.

## Examples

\`\`\`
${hint.split(" ")[0]} ${actions[0]?.name !== "default" ? actions[0]?.name + " " : ""}<example-target>
\`\`\`
`;
}

const opts = parseArgs();
const tally = {};

for (const [file, data] of Object.entries(COMMANDS)) {
  count(tally, writeOnce(path.join(COMMANDS_ROOT, file), template(data), opts));
}

report(`marketing commands (${Object.keys(COMMANDS).length} declared)`, tally, opts);
