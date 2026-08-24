---
name: security
description: Complete security suite — expert mindset + active code scanner. Covers OWASP 2025, supply chain, L1-L4 data flow analysis, 21 vulnerability rules with a cost-tiered default pass, TINY/SMALL/LARGE scan modes, bilingual output (vi/en). Use when scanning code for security vulnerabilities, doing security audits, or applying security mindset. Triggers on "scan security", "kiểm tra bảo mật", "security audit", "review security".
allowed-tools: Read, Glob, Grep, Bash
---

# Security — Complete Suite

> Think like an attacker. Scan like a machine. Defend like an expert.

Two complementary layers:
- **Strategic layer** → `references/mindset.md`: OWASP 2025, supply chain, threat modeling, risk prioritization, cloud security
- **Tactical layer** → Active scanner: 21 rules (tiered — 8 core, 9 signal-gated, 4 opt-in), L1-L4 data flow, TINY/SMALL/LARGE mode

## Quick Reference

| Use case | Action |
|---|---|
| Security mindset / threat modeling | Load `references/mindset.md` |
| Scan the working diff | [`/ck:security`](../../../commands/ck/security.md) — the default scope |
| Scan entire repo | `/ck:security repo` — explicit by name; main-context orchestration, so LARGE mode gets its parallel fan-out |
| OWASP checklist review | Load `references/checklists.md` |
| Understand data flow analysis | Load `references/data-flow-classification.md` |

## Invocation (Scanner)

| Scope | Command |
|---|---|
| Working diff (**default**) | `/ck:security` — staged, else uncommitted, else `HEAD~1` |
| Entire repo | `/ck:security repo` — never a fallback, only when named |
| Uncommitted changes | `/ck:security uncommitted` (or `diff`) |
| Staged files | `/ck:security staged` |
| Recent commits | `/ck:security commit within Xdays` |
| Specific commit | `/ck:security commit id <sha>` |
| Pull request | `/ck:security pr id <number>` |

**Output language:** append `lang=en` or `--en` (default: `vi`)

Scope + LANG parsing, TINY/SMALL/LARGE routing, the rule tiers, and the LARGE-mode sub-agent fan-out are driven by [`/ck:security`](../../../commands/ck/security.md) — a delegated subagent has no `Task` tool, so only the command path can spawn the parallel scanners.

## Core Principle: Reasoning-First (NOT pattern-match)

Before flagging any issue, classify data sources L1–L4 — see `references/data-flow-classification.md`.

| Level | Source | Trust |
|---|---|---|
| L1 | User input (req.body, $_GET, params…) | NEVER trust |
| L2 | Database / persistent storage | Semi-trust |
| L3 | Internal code / hardcoded config | Trust |
| L4 | System / env vars / framework constants | Trust |

**Only flag when: L1 data → dangerous sink + no sanitization.**

## Scanner Workflow

### Step 0 — Parse args & gather files
Run bash ONCE to detect scope, lang, file list, routing decision. Save to `security-reports/scan-<timestamp>.md`.

### Step 1 — Load i18n
- `lang=vi` → `references/i18n/vi.md`
- `lang=en` → `references/i18n/en.md`

### Step 2 — Detect primary language
The majority extension in the file list is the primary language — infer it from the Step 0 list, no extra read. Load a `rules/languages/<lang>/*.md` overlay **only if that glob matches**; the kit ships the hook (see `rules/languages/README.md`) with no overlay files, so on a current repo this step is a no-op and `references/language-detection.md` never needs opening.

### Step 3 — Route by size

**File count decides how many agents run. Nothing else does.**

| Files in scope | Mode | Agents |
|---|---|---|
| ≤5 | TINY | 0 — scan inline |
| ≤20 main-lang **and** ≤30 total | SMALL | 1 |
| above either | LARGE | `min(3, ceil(files / 25))` |

A >14-day commit span raises the **discipline** — chunk the list, one TodoWrite item per chunk so an interrupted run resumes — but never the agent count: a 30-day window touching 3 files is still TINY. Ordering an old "ANY LARGE condition wins" read the other way would spawn three agents for three files, which is the exact waste the tiers exist to remove.

Workflow: `workflows/small-review.md` (TINY runs it inline) or `workflows/large-review.md`.

### Step 4 — Apply the active rules

All 21 IDs below stay canonical — tiering picks which ones a **pass** loads, and loading all of them costs ~15K tokens before a file is read. Default pass: **Core 8** = `01`, `02`, `03`, `04`, `10`, `12`, `14`, `21` · **9 signal-gated** (`05`+`20` dependency manifest · `07` model binding · `08` deserialization sink · `09` outbound client · `11` cookie auth · `13` password hashing · `15` CORS config · `16` upload sink) · **4 opt-in** = `06`, `17`, `18`, `19`. Signals, rationale, and the `--full` / `--rules` overrides live in [`/ck:security`](../../../commands/ck/security.md) § Rule tiers. A report must always name the IDs it skipped — unscanned is not clean.

| # | ID | Severity |
|---|---|---|
| 1 | HARDCODED-SECRET | CRITICAL |
| 2 | SQL-INJECTION | CRITICAL |
| 3 | XSS | HIGH |
| 4 | IDOR | HIGH |
| 5 | SLOPSQUATTING | CRITICAL |
| 6 | BRUTE-FORCE | HIGH |
| 7 | MASS-ASSIGNMENT | CRITICAL |
| 8 | INSECURE-DESERIALIZATION | CRITICAL |
| 9 | SSRF | HIGH |
| 10 | PATH-TRAVERSAL | HIGH |
| 11 | CSRF | HIGH |
| 12 | BROKEN-ACCESS-CONTROL | CRITICAL |
| 13 | WEAK-PASSWORD-HASHING | CRITICAL |
| 14 | JWT-NONE-ALGORITHM | CRITICAL |
| 15 | CORS-MISCONFIG | HIGH |
| 16 | UNRESTRICTED-FILE-UPLOAD | CRITICAL |
| 17 | VERBOSE-ERROR-DEBUG-MODE | HIGH |
| 18 | MISSING-RATE-LIMIT | HIGH |
| 19 | RACE-CONDITION | HIGH |
| 20 | OUTDATED-DEPENDENCY | HIGH |
| 21 | COMMAND-INJECTION | CRITICAL |

For each rule: Read rule file → understand intent → apply with L1-L4 analysis → language overlay overrides generic if same ID.

### Step 5 — Generate report
Follow `references/output-format.md`. Verdict: CRITICAL findings = FAIL, HIGH only = WARN, else PASS.

## References (lazy load)
- `references/mindset.md` — strategic layer: OWASP 2025, supply chain, cloud, risk scoring
- `references/data-flow-classification.md` — L1-L4 trust classification + worked examples
- `references/checklists.md` — OWASP audit checklists
- `references/output-format.md` — report template spec
- `references/language-detection.md` — primary language detection algorithm
- `references/chunking-strategy.md` — LARGE mode file chunking
- `references/sub-agent-prompts.md` — LARGE mode sub-agent instructions
- `references/i18n/vi.md` + `references/i18n/en.md` — localization strings

## Guardrails
- License first: check LICENSE before copying any external code
- Provenance: ported files get `Adapted from <url>@<sha>:<path> (<license>)` header
- No drive-by deps: only add deps the ported code actually needs
- Trust local conventions over source style
- Reports use `security-reports/scan-<timestamp>.md` (not `vbsec-reports/`)
- **No pattern-matching pre-scanner.** A Python pattern pre-scanner shipped under this skill's `scripts/` until 2026-08-21: referenced by no workflow, and a trial run false-positived in its pattern category — `exec() usage CRITICAL` on a plain `/regex/.exec()` call (reproduced before removal). Do not reintroduce one to save tokens. The Core Principle above is the contract: a regex pass that skips L1-L4 tracing is cheap and wrong, and its noise costs more to triage than the scan saved.
