# Automation Rules

**Domain:** Marketing automation (`/mk:campaign`, `/mk:leads`, `/mk:nurture`, `/mk:video`, MCP wrappers) — applies to all automation skills, agents, and commands.

## 1. MCP usage

**Always check MCP skill wrappers before direct API calls.**

If a task needs GA4/GSC/SendGrid/Resend/ReviewWeb data:
1. Check if MCP server is available: `mcp__<service>__*` tools present
2. If yes → use MCP tools directly
3. If no → use the skill's **manual fallback** (CSV export, template gen, paste-back)
4. Never silently fail or skip the data step

**Available MCP wrappers** (in `.claude/skills/automation/mcp-*/SKILL.md` or `.claude/skills/integrations/*/SKILL.md`):
- `mcp-ga4` — Google Analytics 4
- `mcp-gsc` — Google Search Console
- `mcp-sendgrid` — SendGrid email
- `mcp-resend` — Resend email
- `mcp-reviewweb` — ReviewWeb reputation
- `mcp-wordpress` — WordPress REST (env creds: `WP_SITE_URL`/`WP_USER`/`WP_APP_PASSWORD`)

## 2. Workflow chain integrity

**Never skip phases without explicit user override.**

When running `/mk:campaign` (10-phase marketing workflow), `/mk:leads` (5-phase sales), `/mk:nurture` (5-phase crm), `/mk:video` (6-phase video):
- Execute phases in order
- Wait for phase completion before starting next
- If user wants to skip → confirm explicitly: "Skip Phase 4 (Plan)? (y/n)"
- **Exception:** Declared intra-phase parallel tracks (e.g. marketing Phase 1 Tracks A/B, Phase 5 Tracks A/B/C) are allowed — they run concurrently *within* a phase, not across phases. This does not violate the sequential-phase rule.

## 3. Data validation

**Never trust MCP responses blindly — always sanity-check.**

| Check | Why |
|---|---|
| Schema validation | MCP responses can have unexpected shapes (vendor API changes) |
| Numeric sanity | Revenue/order counts must be ≥ 0 · percentages 0-100 |
| Date format | ISO 8601 expected; flag anything else |
| Null/missing fields | Don't assume fields exist; check before reading |

If validation fails:
- Log the issue
- Try fallback (manual mode)
- Surface to user, don't silently use bad data

## 4. Privacy / PII

**Never log PII from CRM/MCP responses.**

When reading leads, customers, or review data:
- Redact: emails, phone numbers, physical addresses, names (use initials)
- Don't write PII to disk unless explicitly required
- Don't echo full PII in summaries
- If user needs PII: ask explicitly, confirm storage, log the disclosure

## 5. Idempotency

**Marketing automations must be re-runnable safely.**

When executing campaigns, lead workflows, nurture sequences:
- Use idempotency keys (`campaign-name + step + recipient-id`) for API calls — **no timestamp** (timestamp changes on re-run → defeats idempotency → duplicate sends)
- Check existing state before creating new resources (don't double-send emails)
- Document re-run behavior in workflow outputs

## 6. Manual fallback (no MCP server)

Every MCP wrapper MUST support manual mode:

| MCP | Manual fallback |
|---|---|
| GA4 | User exports CSV → Read tool → analyze |
| GSC | User exports CSV → Read tool → analyze |
| SendGrid | Generate email template + HTML → user sends manually |
| Resend | Generate React Email component → user runs locally |
| ReviewWeb | User pastes reviews → sentiment analysis |
| WordPress | REST curl path (`WP_SITE_URL`/`WP_USER`/`WP_APP_PASSWORD`) or user pastes via admin UI. Never log credentials. |

**Behavior:** Skill auto-detects MCP availability; if absent, instructs user on manual path.

## 7. Output conventions

Automation outputs go to:
- **Campaign plans:** `plans/marketing/<campaign>/`
- **Lead lists:** `plans/marketing/<campaign>/leads.csv` (PII-redacted)
- **Email sequences:** `plans/marketing/<campaign>/emails/`
- **Video scripts:** `plans/marketing/<campaign>/video/`
- **Audit logs:** `plans/marketing/<campaign>/logs/`

## 8. Anti-patterns (auto-reject)

- ❌ Calling external API without checking MCP wrapper first
- ❌ Logging PII (emails, phones, addresses)
- ❌ Writing raw customer/lead PII into `plans/marketing/` files — redact per rule 4
- ❌ Skipping a workflow phase without user confirmation
- ❌ Using MCP response data without validation
- ❌ Non-idempotent campaigns (re-running sends duplicates)
- ❌ Skipping manual fallback when MCP unavailable
- ❌ Using `timestamp` in an idempotency key

## 9. Cross-references

- `.claude/skills/automation/mcp-*/SKILL.md` — MCP wrapper docs
- `.claude/skills/automation/marketing-orchestrator/SKILL.md` — multi-MCP orchestration
- `.claude/workflows/marketing-workflow.md` — 10-phase marketing pipeline
- `.claude/workflows/sales-workflow.md` — 5-phase lead→customer
- `.claude/workflows/crm-workflow.md` — 5-phase lifecycle
- `.claude/workflows/video-workflow.md` — 6-phase video production
- `.claude/workflows/marketing-rules.md` — content quality rules
- `plans/marketing-context.md` — required context hub
