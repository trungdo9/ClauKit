---
description: ⚡⚡ Implement payment integration with SePay.vn
argument-hint: [tasks]
---

Think harder. Read the `payment-integration` skill file ([.claude/skills/software/payment-integration/SKILL.md](../../skills/software/payment-integration/SKILL.md)) — section: **SePay Integration** (overview · API · webhooks · SDK · QR codes · best practices).

Plan & implement payment integration with [SePay.vn](https://developer.sepay.vn/vi):
<tasks>$ARGUMENTS</tasks>

## Workflow
- **Scout** — `scout` subagent → find existing payment-related resources, docs, code snippets.
- **Plan** — `/ck:plan fast <detailed-instruction-prompt>` → create implementation plan from scout report.
- **Implementation** — `/ck:cook <plan>` → implement the plan.

## SePay
- **Market:** Vietnam (VND currency)
- **Strengths:** bank transfer automation · VietQR / NAPAS · direct bank account monitoring · local payment methods
- **Reference root:** `references/sepay/*` in payment-integration skill

## Important
- All workflow + methodology → `payment-integration` skill.
