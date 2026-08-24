<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/workflows/small-review.md (MIT) -->

# Small Review Workflow (SMALL mode)

Scope: ≤20 main-language files AND ≤30 total files. Commit span does not select the mode — file count does (SKILL.md § Step 3).
One `security-auditor` subagent executes this — or, at TINY size (≤5 files), the orchestrator runs it inline and spawns nothing.

## S1 — Load rules
Load **only the active rules** the orchestrator named — Core 8 plus whichever gates fired (SKILL.md § Step 4; all 21 under `--full`). Loading all 21 unconditionally costs ~15K tokens for rules the scope cannot violate. A `rules/languages/<lang>/*.md` overlay replaces the generic file of the same ID **if the glob matches** — the kit ships none, so normally skip it.

## S2 — Apply rules per file
For each file in scope:
- Skip: binary files, generated files (*.min.js, *.lock unless checking deps), files >5000 lines
- Use Grep to find patterns, Read for context
- Apply L1-L4 data flow analysis — do NOT flag without tracing source
- Map each finding to exactly one rule ID

## S3 — Cross-rule checks
After per-file scan, check globally:
- SLOPSQUATTING: verify package names in dependency files exist on npm/pypi/pkg.go.dev
- OUTDATED-DEPENDENCY: check known CVE databases for listed versions
- BROKEN-ACCESS-CONTROL: check if sensitive endpoints have consistent auth middleware
- CSRF: check if state-changing routes have CSRF token validation

## S4 — Build PASSED list
List rules checked and found clean — IDs only, one line. Separately list the IDs **not run** in this pass; unscanned must never read as clean.

## S5 — Determine verdict
- Any CRITICAL finding → FAIL
- No CRITICAL, any HIGH → WARN
- No CRITICAL, no HIGH → PASS

## S6 — Render report
Follow `references/output-format.md`. Use i18n keys from loaded i18n file.

## S7 — Output & save
Print report to stdout. Write identical content to `security-reports/scan-<timestamp>.md`.

## Performance target
TIER-dependent: TINY (≤5 files, inline) ~8-12K tokens · SMALL (one subagent) ~20-30K. The default rule tier is what keeps it there — all 21 rules cost ~15K before the first file is read.
