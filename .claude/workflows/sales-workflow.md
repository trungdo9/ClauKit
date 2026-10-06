# Sales Workflow (5-phase)

Lead generation → conversion pipeline. Linear.

**Trigger:** `/mk:leads <icp-description>`
**Agents:** `email-specialist`, `crm-specialist`
**Required input:** `plans/marketing-context.md`
**Sales skills:** grouped at `.claude/skills/sales/<name>/SKILL.md` — read by path; also reachable one at a time via `/mk:sales <action>`
**Output dir:** `plans/marketing/<campaign-name>/` (lead CSVs, sequences); per-deal/account sales-skill artifacts go to `plans/sales/<slug>/` and are linked from the campaign dir
**Orchestration:** Typically invoked by `/mk:campaign` (which resolves `<campaign-name>`). When run standalone, Phase 0 prompts for `<campaign-name>`.

---

## Phase 0 — Setup (gate)

Verify `plans/marketing-context.md` exists. If absent → hard-fail, direct to `/mk:plan`.
If `<campaign-name>` not passed by orchestrator → prompt: "Campaign name? (used for output dir)".
Confirm with user before each phase transition.

## Phase 1 — Generate

Cold outreach to ICP. Skills: `outbound` (signals, ICP tiers, multichannel sequence), `cold-email` (copy); agent: `email-specialist`.
*Output:* outreach list (`leads-raw.csv` — PII-redacted per automation-rules.md).

## Phase 2 — Qualify

Lead scoring (ICP fit, intent signals, engagement); sales-accepted leads get discovery + MEDDPICC. Skills: `customer-research`, `discovery`, `deal-strategy`; agent: `market-researcher`.
*Output:* `leads-qualified.csv` (with score, tier).

## Phase 3 — Nurture

Drip sequences by tier. Skills: `email-sequence`, `user-onboarding`, `email-specialist` agent.
*Output:* `nurture-sequences/<tier>.md` (3-7 emails per tier).

## Phase 4 — Convert

Sales handoff + conversion assets. Skills: `signup`, `cro`, `paywalls`; sales-led deals: `sales-engineering` (demo/POC), `proposal`.
*Output:* `conversion-assets/` (case studies, demos, pricing one-pagers).

## Phase 5 — Retain

Customer success + lifecycle. Skills: `customer-research`, `user-onboarding`, `account-expansion` (expansion, QBR); agent: `crm-specialist`. Forecast roll-up: `pipeline-forecast`.
*Output:* `retention-plan.md` (onboarding, expansion, re-engagement).

---

**Idempotency:** Re-running must not duplicate outreach. Key: `campaign-name + step + recipient-id` (no timestamp). (See automation-rules R5.)
**Privacy:** All output CSVs PII-redacted. Full PII only in CRM — never committed to repo. (automation-rules R4)
**Phase-skip:** Confirm with user before skipping any phase (automation-rules R2).
