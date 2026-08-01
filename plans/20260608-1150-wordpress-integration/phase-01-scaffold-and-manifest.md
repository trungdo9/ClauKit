# Phase 1 — Scaffold `skills/integrations/` + Manifest Registration

## Context links
- Research: `plans/20260608-1150-wordpress-integration/research/wp-rest-api-research.md` (§ClauKit wiring)
- Resolver: `bin/lib/kit-resolver.js` — `getKitPaths` / `checkKitPathsAvailable` (lines 84–101)
- Manifests: `.claude/kits/marketing.json`, `.claude/kits/both.json`

## Overview
- Priority: P0 (blocks all later phases). Status: ☐ not started.
- Create new top-level `skills/integrations/` with 2 skill folders + stub SKILL.md each (filled in P2/P3). Register glob path in marketing + both manifests. Verify resolver path-check passes.

## Key insights
- Skills register **by directory glob** in `paths.skills` (not per-file). One `"skills/integrations/"` entry covers both sub-skills.
- `checkKitPathsAvailable()` does `fs.existsSync(path.join(PACKAGE_ROOT, p))` — path must exist on disk or resolver flags it missing. So folders must exist BEFORE manifest edit is meaningful (but order within phase is fine).
- engineer.json MUST stay untouched (integrations are marketing-only).

## Requirements
- Functional: 2 skill dirs exist; both contain a valid-frontmatter SKILL.md (stub acceptable, filled later); manifests list the path.
- Non-functional: resolver runs clean; no engineer.json change.

## Files to create
| Path | Action | Note |
|---|---|---|
| `skills/integrations/wordpress-rest/SKILL.md` | create | stub w/ valid frontmatter (full content P2) |
| `skills/integrations/wordpress-rest/references/.gitkeep` | create | placeholder (refs added P2) |
| `skills/integrations/wordpress-rest/scripts/.gitkeep` | create | placeholder (scripts added P2) |
| `skills/integrations/mcp-wordpress/SKILL.md` | create | stub w/ valid frontmatter (full content P3) |

## Files to modify
| Path | Action | Change |
|---|---|---|
| `.claude/kits/marketing.json` | modify | add `"skills/integrations/"` to `paths.skills`; bump description skill count + add "1 integration domain" |
| `.claude/kits/both.json` | modify | add `"skills/integrations/"` to `paths.skills` |

## Implementation steps
1. Create dirs: `skills/integrations/wordpress-rest/{references,scripts}` and `skills/integrations/mcp-wordpress`.
2. Write stub `wordpress-rest/SKILL.md` frontmatter (final body authored in P2):
   ```yaml
   ---
   name: wordpress-rest
   description: WordPress REST API client — connect to a live WP site to publish/update posts & pages (draft→publish), upload media, manage categories/tags, write Yoast/RankMath SEO meta, and audit existing content. Use when pushing generated marketing content to WordPress or auditing live WP articles. Auth via Application Passwords (env vars only). Consumer/client skill (not for building WP plugin endpoints).
   license: MIT
   ---
   ```
   (Note: our authored adaptation is MIT-licensed original work; source attribution for the GPL v2+ WP repo lives in THIRD_PARTY_NOTICES — Phase 5. We do not copy GPL text.)
3. Write stub `mcp-wordpress/SKILL.md` frontmatter (final body P3):
   ```yaml
   ---
   name: mcp-wordpress
   description: WordPress MCP wrapper. Activate for WordPress content ops via an MCP server when available; else falls back to the wordpress-rest curl path. Manages posts, pages, media, taxonomies, SEO meta.
   allowed-tools: Read, Bash, Write
   ---
   ```
4. Add `.gitkeep` to references/ and scripts/ so empty dirs persist in git.
5. Edit `marketing.json` `paths.skills` array → append `"skills/integrations/"`:
   ```json
   "skills": [
     "skills/marketing/",
     "skills/automation/",
     "skills/integrations/"
   ]
   ```
   Also update `description` count text (e.g. "48 skills" → reflect +2 and note "2 integration skills"). Keep it accurate vs registry — see Phase 5 final counts.
6. Edit `both.json` `paths.skills` array → append `"skills/integrations/"` (after `"skills/automation/"`).
7. Do NOT edit `engineer.json`. Do NOT touch `skills-lock.json` (inert).

## Todo list
- [ ] mkdir `skills/integrations/wordpress-rest/references`
- [ ] mkdir `skills/integrations/wordpress-rest/scripts`
- [ ] mkdir `skills/integrations/mcp-wordpress`
- [ ] write `wordpress-rest/SKILL.md` stub
- [ ] write `mcp-wordpress/SKILL.md` stub
- [ ] add `.gitkeep` × 2
- [ ] edit `marketing.json` paths.skills + description
- [ ] edit `both.json` paths.skills
- [ ] run resolver verification

## Success criteria
- Both SKILL.md files exist + parse (valid YAML frontmatter, `name` matches folder).
- `marketing.json` + `both.json` include `"skills/integrations/"`; valid JSON (no trailing comma).
- Resolver path-check returns no missing paths for marketing + both.

## Verification (run from repo root)
```bash
# JSON validity
node -e "require('./.claude/kits/marketing.json'); require('./.claude/kits/both.json'); console.log('json ok')"
# Path existence per resolver logic
node -e "const r=require('./bin/lib/kit-resolver.js'); for(const k of ['marketing','both']){const m=r.resolveKit(k); console.log(k, r.checkKitPathsAvailable(m))}"
# Expect: marketing []   both []   (empty arrays = all paths exist)
node bin/ck.js list-kits   # should print kit list clean, no errors
```
(If `resolveKit`/`list-kits` differ at impl time, fall back to: confirm `fs.existsSync('skills/integrations/')` true + manifest contains the string.)

## Risk assessment
- Risk: trailing-comma / malformed JSON breaks resolver for ALL kits. Mitigation: run `node -e require` check immediately after edit.
- Risk: empty dirs dropped by git → `.gitkeep` mitigates.
- Risk: description count drift vs registry. Mitigation: finalize counts in Phase 5, reconcile description text then.

## Security considerations
- Stub SKILL.md must already state env-var-only auth in description (no secrets). No creds in scaffold.

## Next steps / dependencies
- Unblocks P2 (wordpress-rest body), P3 (mcp-wordpress body).

## Unresolved
- Confirm exact current `marketing.json` description skill count to bump (Phase 5 reconciles to registry final = 129 total skills).
