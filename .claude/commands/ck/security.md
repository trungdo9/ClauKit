---
description: ⚡⚡ Security audit — OWASP 2025, 21 rules, L1-L4 data flow, SMALL/LARGE mode.
argument-hint: [uncommitted|staged|diff|"commit within Xdays"|"commit id <sha>"|"pr id <num>"] [--en]
---

Activate the `security` skill ([.claude/skills/software/security/SKILL.md](../../skills/software/security/SKILL.md)).

Use the `security-auditor` subagent to run the scanner workflow on the specified scope.

**Scope:** <scope>$ARGUMENTS</scope>
*(no arg = entire repo; append `--en` or `lang=en` for English output; default: vi)*

**IMPORTANT:** Follow the Scanner Workflow in the `security` skill exactly — Step 0 through Step 5 inclusive.
**IMPORTANT:** Save report to `security-reports/scan-<timestamp>.md` as the skill specifies.
