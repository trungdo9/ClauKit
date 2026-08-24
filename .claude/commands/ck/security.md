---
description: ⚡⚡ Scoped security audit — OWASP 2025, 21 tiered rules, L1-L4 data flow, TINY/SMALL/LARGE mode.
argument-hint: [scope] [--full|--rules 02,12] [lang=vi|en]
---

## Purpose

Security audit at a **declared** scope — by default the working diff, on request a subtree, a commit range, a PR, or the whole repo — reported to `security-reports/scan-<timestamp>.md`.

Knowledge base: the [`security`](../../skills/software/security/SKILL.md) skill (OWASP 2025, 21 rules, L1–L4 data-flow analysis). Diff checklist: its [references/checklists.md](../../skills/software/security/references/checklists.md). Mindset: the [`security-auditor`](../../agents/engineering/security-auditor.md) agent.

## Variables

SCOPE: `$1` — **defaults to the working diff**, not the repo
RULES: `--full` (all 21) · `--rules <ids>` (explicit, e.g. `--rules 02,12,19`) · default = the tiers below
LANG: `vi` default · `lang=en` / `--en`
REPORT_OUTPUT: `security-reports/scan-<timestamp>.md`

| SCOPE | Scans |
|---|---|
| *(none)* | staged files if any, else uncommitted changes, else `HEAD~1` |
| `staged` · `diff` / `uncommitted` | that set explicitly |
| `commit id <sha>` · `commit within <N>days` | one commit · a window |
| `pr id <N>` | a PR diff (`gh pr diff <N>`, or the host's API with creds from `.claude/.env`) |
| `<path>` | one directory or file subtree |
| `repo` | **the whole repository — only when asked for by name** |

The default is diff-shaped on purpose: a whole-repo scan is the most expensive thing this command can do, so it is opt-in, never a fallback. An unrecognized first arg → treat as a path when it resolves, otherwise **ask**. Empty file set → say so and stop.

## Cost model

| Tier | Trigger | Subagents | Typical burn |
|---|---|---|---|
| **TINY** | ≤5 files in scope | **0** — scan inline, no `Task` | ~8–12K |
| **SMALL** | ≤20 main-language **and** ≤30 total files | 1 `security-auditor` | ~20–30K |
| **LARGE** | above either threshold | `min(3, ceil(files / 25))` | ~25K per agent |

**File count decides the agent count — nothing else does.** A wide commit window (`commit within 30days`) raises the chunking/resume discipline, not the fan-out: three files over thirty days is still TINY. Announce tier + the count that chose it before scanning. LARGE spawns the *computed* number, not a flat 3 — a 40-file scan gets 2 agents, and an agent is never spawned for a chunk that doesn't exist.

## Rule tiers

Full detail per rule lives in the skill's `rules/generic/`; loading all 21 costs ~15K tokens before a single file is read, so the default pass loads 37% of that and earns the rest.

| Tier | Rules | When loaded |
|---|---|---|
| **Core (8)** | `01` HARDCODED-SECRET · `02` SQL-INJECTION · `03` XSS · `04` IDOR · `10` PATH-TRAVERSAL · `12` BROKEN-ACCESS-CONTROL · `14` JWT-NONE-ALGORITHM · `21` COMMAND-INJECTION | **always** — highest exploitability, and each is decidable by tracing one L1 source to one sink |
| **Gated (9)** | `05` SLOPSQUATTING + `20` OUTDATED-DEPENDENCY · `07` MASS-ASSIGNMENT · `08` INSECURE-DESERIALIZATION · `09` SSRF · `11` CSRF · `13` WEAK-PASSWORD-HASHING · `15` CORS-MISCONFIG · `16` UNRESTRICTED-FILE-UPLOAD | only when the scope shows the surface exists (signals below) |
| **Off (4)** | `06` BRUTE-FORCE · `17` VERBOSE-ERROR-DEBUG-MODE · `18` MISSING-RATE-LIMIT · `19` RACE-CONDITION | only under `--full` / `--rules`, or `repo` scope |

**Gate signals** — a filename match (`05` + `20`) plus one `grep -lE` over the resolved list decides all nine, inside the same Step 0 call:

| Rule | Fires when the scope contains |
|---|---|
| `05` + `20` | a dependency manifest or lockfile — `package.json`, `pom.xml`, `build.gradle*`, `requirements*.txt`, `pyproject.toml`, `*.csproj`, `go.mod`, `composer.json` |
| `07` | model binding — `@RequestBody`/`@ModelAttribute` onto an entity, `Object.assign(`, `{...req.body}`, `TryUpdateModel` |
| `08` | `readObject`, `ObjectInputStream`, `pickle.loads`, `yaml.load(`, `BinaryFormatter`, `TypeNameHandling`, `unserialize(` |
| `09` | an outbound client — `RestTemplate`, `WebClient`, `HttpClient`, `fetch(`, `axios`, `requests.get(` |
| `11` | cookie/session auth — `Set-Cookie`, `HttpOnly`, `SameSite`, `express-session`, form login. A pure Bearer-token API is N/A |
| `13` | `password`, `BCrypt`, `PasswordHasher`, `pbkdf2`, `md5`, `sha1`, `hashlib` |
| `15` | `Access-Control-Allow`, `addCorsMappings`, `cors(`, `UseCors`, `AllowAnyOrigin` |
| `16` | `MultipartFile`, `IFormFile`, `multer`, `busboy`, `request.files` |

**Why those four are off by default.** `06` + `18` are gateway concerns — a per-file scan reports "no rate limit here" on every handler and none of it is fixable in the diff; audit the gateway config instead. `17` is a config-level single-file check that the `repo` pass already covers. `19` is not decidable from a static diff, has the highest false-positive rate, and is the largest rule file — reach for it deliberately when the diff touches a known concurrency path.

Dropping a rule from a pass is a **budget decision, not a verdict**: the report must name the tiers that ran and list the skipped IDs, so a reader never mistakes "not scanned" for "clean".

## Why this is a command and not only an agent

LARGE mode spawns parallel scanner sub-agents ([large-review.md](../../skills/software/security/workflows/large-review.md) L3). That needs the `Task` tool, and [`security-auditor`](../../agents/engineering/security-auditor.md) does not have it (`Read, Grep, Glob, Bash, Edit, Write`) — subagents cannot spawn subagents. On the [`/ck:review`](review.md) path, where `security-auditor` runs *as* a delegated subagent, LARGE mode silently degrades to a single-threaded scan. This command runs in main context, so the fan-out is reachable. Same rationale as [`/ck:scout`](scout.md).

## Workflow

### Step 0 — One bash call: scope + gates + tier
Resolve {SCOPE} to a file list, drop what is never worth scanning — tests, `*.min.*`, generated/vendored trees, `node_modules/`, and lockfiles unless the `05`/`20` gate fires. Docs, Markdown, and config leave the **code** rules but stay in scope for `01` HARDCODED-SECRET: a token pasted into a README is still a leaked token. Then run the single `grep -lE` gate probe over what survives, and count. Out of that one call come: the file list, the fired gates, the tier, and the timestamp (`date +%y%m%d-%H%M%S`). Do not re-derive any of it later.

### Step 1 — Load only what the pass needs
- Core rule files, plus the gated ones that fired. Nothing else.
- **Skip** `references/language-detection.md` and the `rules/languages/<lang>/` overlay probe unless that glob actually matches a `.md`. The kit ships the hook documented (`rules/languages/README.md`) and no overlay files, so today the step is a no-op; the majority extension in the Step 0 list is the primary language, which needs no read at all.
- `references/i18n/<LANG>.md` and `references/output-format.md` are **report-time** reads. Do not load them before findings exist.

### Step 2 — Scan
- **TINY** → inline, here. No agent, no `.security-tmp/`.
- **SMALL** → one `security-auditor` subagent per [small-review.md](../../skills/software/security/workflows/small-review.md), handed the resolved file list, the active rule IDs, {LANG}, and the report path. It never re-resolves scope.
- **LARGE** → chunk per [chunking-strategy.md](../../skills/software/security/references/chunking-strategy.md), one `TodoWrite` item per chunk, spawn the computed agent count **in one message** with the prompt from [sub-agent-prompts.md](../../skills/software/security/references/sub-agent-prompts.md) — **active rule IDs only**, canonical English out, one chunk each, writing `.security-tmp/findings-<chunk-slug>.md`. Retry a failed chunk once; a second failure is reported as a failed chunk, never dropped silently. Then aggregate, dedupe by `(file, line, rule_id)`, run the cross-file checks no chunk can see (auth-middleware consistency, dependency rules across manifests), and delete `.security-tmp/`.

### Step 3 — Reason, don't pattern-match
Every finding traces an L1 source to a dangerous sink with no sanitization between them. L3/L4 data reaching the same sink is not a finding. A grep hit with no traced flow does not enter the report. This is the whole reason the scan is worth its tokens — a regex pass would be free and useless.

### Step 4 — Diff-shaped scopes also walk the checklist
For `staged` / `diff` / `commit …` / `pr …`, walk [references/checklists.md](../../skills/software/security/references/checklists.md) item by item over what the diff touches and mark each pass / fail / N/A. Same checklist the Security axis of [`/ck:review`](review.md) runs; this is its arbitrary-scope, full-report version.

### Step 5 — Report
- Per [output-format.md](../../skills/software/security/references/output-format.md) in {LANG}: severity, exact `file:line`, root cause, specific fix.
- **Every CRITICAL and HIGH in full.** MEDIUM/LOW → top 5, then a count of the remainder. PASSED rules → one line of IDs, no prose.
- Header states: tier, agent count, rule IDs run, rule IDs skipped.
- Verdict: any CRITICAL → **FAIL** · else any HIGH → **WARN** · else **PASS**.
- Print it **and** write {REPORT_OUTPUT}. A scan with no saved report did not happen.

## Guardrails

- **Report, don't remediate.** `Edit`/`Write` exist for the report file. Fixing is a separate, user-approved step — `/ck:fix` with the report as input.
- **No regex pre-pass to shave tokens.** The tiers above are this command's budget mechanism; a pattern-matching pre-scanner is not one. The kit shipped a Python pattern pre-scanner under the skill's `scripts/` until 2026-08-21 and retired it — a trial run flagged a plain `/regex/.exec()` as `CRITICAL code injection` (rationale in the [`security`](../../skills/software/security/SKILL.md) skill § Guardrails). Step 3 is the contract.
- **Findings are sensitive.** `security-reports/` enumerates exploitable paths. Never commit one or paste it into a PR body or a ticket unless asked — add `security-reports/` and `.security-tmp/` to the project's `.gitignore` on the first run if they are not there.
- **Only the 21 canonical rule IDs.** A real issue fitting none of them goes under a labelled `Other observations` heading.
- **No PASS claim without the saved report** — the verification gate from the [`code-review`](../../skills/software/code-review/SKILL.md) skill applies to this command's own output.

## Relationship to other commands

- [`/ck:review`](review.md) — three-axis review (Standards · Spec · Security) on a pinned diff; its Security axis is one `security-auditor` on the Core rules, capped short. Reach here when the scope is not a diff, when the file count wants the fan-out, or when the full report needs saving.
- [`/ck:cook`](cook.md) — its Review stage dispatches the same pair; a finished cook run doesn't need this unless the diff changed after it.
- [`/ck:fix`](fix.md) — remediates what this command reports.

**Related skills**: [`security`](../../skills/software/security/SKILL.md) (the engine), [`code-review`](../../skills/software/code-review/SKILL.md) (verification gates), [`debugging`](../../skills/software/debugging/SKILL.md) (root-causing a confirmed exploit path).

## Notes
- Concise grammar, list unresolved questions at end.
