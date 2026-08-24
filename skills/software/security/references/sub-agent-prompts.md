<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/sub-agent-prompts.md (MIT) -->

# Sub-Agent Prompts (LARGE mode)

## Principles
- Sub-agents have no language context → output canonical English + rule ID only
- Rules embedded directly in prompt (no file loading from sub-agent)
- All findings written to `.security-tmp/findings-<chunk-slug>.md`
- Main agent translates to $LANG after aggregation

## Sub-agent prompt template
Instruct each sub-agent:
1. You are a security scanner. Scan these files: [file list]
2. Apply **the active rule IDs the orchestrator lists** (Core 8 + fired gates; all 21 only under `--full`). The canonical vocabulary — never invent an ID outside it: HARDCODED-SECRET, SQL-INJECTION, XSS, IDOR, SLOPSQUATTING, BRUTE-FORCE, MASS-ASSIGNMENT, INSECURE-DESERIALIZATION, SSRF, PATH-TRAVERSAL, CSRF, BROKEN-ACCESS-CONTROL, WEAK-PASSWORD-HASHING, JWT-NONE-ALGORITHM, CORS-MISCONFIG, UNRESTRICTED-FILE-UPLOAD, VERBOSE-ERROR-DEBUG-MODE, MISSING-RATE-LIMIT, RACE-CONDITION, OUTDATED-DEPENDENCY, COMMAND-INJECTION
3. For each pattern: trace L1-L4 data flow. Only flag L1 → dangerous sink + no sanitization.
4. Output format per finding: file:line | RULE-ID | CRITICAL/HIGH/MEDIUM/LOW | description | fix
5. Write to `.security-tmp/findings-<chunk-slug>.md`
6. ONLY use the 21 canonical rule IDs. Do not invent new IDs.

## Orchestrator workflow
1. Spawn `min(3, ceil(files / 25))` sub-agents in parallel
2. Wait for all to complete (retry once on failure)
3. Aggregate findings from all .security-tmp/findings-*.md
4. Deduplicate by (file, line, rule_id)
5. Cross-check global patterns (CSRF middleware, outdated deps across all files)
6. Translate to $LANG, render report
7. Delete .security-tmp/ after aggregation
