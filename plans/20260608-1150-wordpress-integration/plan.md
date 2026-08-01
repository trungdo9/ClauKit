# Plan — WordPress CMS REST API integration (Marketing Kit)

**Created:** 2026-06-08 · **Type:** docs/skills-authoring (no app code) · **Kit:** marketing + both
**Research (source of truth):** `plans/20260608-1150-wordpress-integration/research/wp-rest-api-research.md`

## Goal

Add WordPress REST API client capability to ClauKit marketing kit. Author markdown skills + wire 2 commands. Full content lifecycle: Application-Password auth, create/update posts & pages (draft→publish), media upload, taxonomies, SEO meta (Yoast/RankMath), audit live posts.

## Scope (confirmed)

- NEW top-level `skills/integrations/` folder, 2 skills:
  - `wordpress-rest/` — main CLIENT skill (rich; model on payment-integration: SKILL.md + references/ + scripts/).
  - `mcp-wordpress/` — MCP-server wrapper w/ manual fallback (model on mcp-resend).
- Wire `publish` action into `/mk:content`; WP `audit` target into `/mk:seo`.
- Register `skills/integrations/` in `marketing.json` + `both.json` ONLY (not engineer.json).
- Docs: registry counts, THIRD_PARTY_NOTICES (GPL v2+ attribution), marketing README MCP table, CLAUDE.md note.

## Safety invariants (bake into every phase)

- Creds via env ONLY: `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`. Never hardcode/log.
- Default publish status = **draft**. Live publish = explicit user flag/confirmation (hard gate).
- Idempotency: check-then-create-or-update by slug/id — never duplicate.
- Preflight `GET /wp-json/` before any write.
- Reference `.claude/workflows/automation-rules.md` (§4 PII, §5 idempotency, §6 manual fallback).

## Phases

| # | File | Objective | Status |
|---|---|---|---|
| 1 | `phase-01-scaffold-and-manifest.md` | Create `skills/integrations/` folders + SKILL.md; register path in marketing.json + both.json; verify resolver passes | ✅ |
| 2 | `phase-02-wordpress-rest-skill.md` | Author full `wordpress-rest` client SKILL.md + 7 references/ + 2 scripts/ | ✅ |
| 3 | `phase-03-mcp-wordpress-skill.md` | Author `mcp-wordpress` MCP-wrapper SKILL.md (server option + curl fallback) | ✅ |
| 4 | `phase-04-command-wiring.md` | Edit `/mk:content` (publish action) + `/mk:seo` (WP audit target); reuse content-strategist | ✅ |
| 5 | `phase-05-docs-and-registry.md` | Registry entries + counts + Last Updated; TPN attribution; README; CLAUDE.md | ✅ |

**Cook outcome (2026-06-08):** All 5 phases implemented (`--from-plan`). Validation suite 33/33 pass (`reports/validate-integration.sh`). Code review: 0 Critical / 0 High after fixes (H1 Content-Disposition filename quoting fixed; M1 redaction guidance added; L1/L2 wording fixed; reviewer's M2 registry-table miscount verified false — table sums to 129). Branch `feat/wordpress-integration`, commits `10956a4` (feat) + `2060b25` (review fixes). Resolver clean for marketing + both; engineer.json untouched.

## Dependencies

- P2, P3 depend on P1 (folders + manifest must exist for resolver).
- P4 depends on P2 (skills must exist before commands reference them).
- P5 depends on P1–P4 (counts/paths reflect final state).

## Key decisions (do not re-litigate)

- ADAPT not port: official WP `wp-rest-api` skill is PHP-dev-focused (building endpoints); we author a CONSUMER client. Still attribute source (GPL v2+).
- No Node lib dependency — REST via curl (`Bash`); optional tiny JS helper for base64 auth + multipart media upload.
- SEO meta exposure not guaranteed → runtime discovery + manual fallback.
- Reuse `content-strategist` agent (no new agent) — see Phase 4 rationale.

## Final verification checklist

- [ ] `skills/integrations/wordpress-rest/SKILL.md` + `skills/integrations/mcp-wordpress/SKILL.md` exist with valid frontmatter.
- [ ] `marketing.json` + `both.json` `paths.skills` include `"skills/integrations/"`; engineer.json untouched.
- [ ] Resolver passes — `node bin/ck.js list-kits` runs clean AND `checkKitPathsAvailable(marketing)` returns `[]` (see Phase 1 verify snippet).
- [ ] `/mk:content` lists `publish` action w/ draft-default gate; `/mk:seo` lists WP `audit` target.
- [ ] Registry: skills total 127→129, marketing-context counts updated, Last Updated bumped, new `### Integrations (2)` section.
- [ ] THIRD_PARTY_NOTICES has WordPress agent-skills GPL v2+ entry.
- [ ] marketing README MCP table includes WordPress row.
- [ ] No credentials hardcoded anywhere; all examples use `$WP_*` env vars.

## Unresolved questions

See bottom of each phase + consolidated list at end of `phase-05-docs-and-registry.md`.
