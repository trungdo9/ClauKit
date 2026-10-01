# Phase 03 — Dataset: mine, scrub, label, split

**Goal**: `tests/behavior/routing/data/cases.jsonl` — ≥ 40 transcript-sourced, scrubbed, double-labelled cases with a frozen train/test split. **Local only.**

Pool measured 2026-10-01: 62 transcript files across 25 project dirs, 3,147 non-meta string user messages (most are follow-ups), 32 slash-command invocations. Several project dirs are client work (`<client>-*`) ⇒ PII is expected, not hypothetical.

## **Interfaces**

**Consumes**: `routing-guard.cjs` `shingles` (dedupe), registry `docs/clauKit-registry.md`, `.claude/commands/ck/*.md` (phase 01 `commandAliases`).
**Produces**:
- `data/candidates.jsonl` row: `{ id: sha1(text).slice(0,10), projectHash: sha1(dir).slice(0,8), sourceCmd: "ck:fix"|null, text }`
- `data/cases.jsonl` row: `{ id, prompt, expected: string[], labels: { a: string[], b: string[] }, source: "transcript"|"transcript-cmd"|"registry", split: "train"|"test" }`
- `scrub-pii.cjs` export `scrub(text, terms: string[]) → string`
- `split-cases.cjs` export `split(cases, { seed = 1729, testFrac = 0.3 }) → cases` (pure, deterministic)

## Tasks

1. `.gitignore`: add `/tests/behavior/routing/data/` (with a one-line comment: client prompts, never commit). Verify before writing any data.
2. `tests/behavior/routing/mine-prompts.cjs` (~120 lines): walk `~/.claude/projects/*/*.jsonl`; skip dirs matching `^-tmp`; take `type:"user"`, `isMeta` falsy, string `message.content`. Slash commands: extract `<command-name>` + `<command-args>`, keep args as `text`, set `sourceCmd`; drop if args < 6 words. Plain prompts: drop if starting with `<`, < 6 words, or > 1,500 chars. Dedupe by normalised text. Write `data/candidates.jsonl`; print counts only.
3. `tests/behavior/routing/scrub-pii.cjs` (~90 lines): replace emails → `<EMAIL>`, URLs → `<URL>`, IPv4 → `<IP>`, secrets (`sk-…`, `ghp_…`, `AKIA…`, `xox[bp]-…`, 32+ hex/base64 runs) → `<SECRET>`, ticket keys `[A-Z]{2,6}-\d+` → `PROJ-123`, absolute home paths → `~/project/…`, every term in `data/scrub-terms.local.txt` (case-insensitive, one per line: client/product/person names, written by the user) → `<CLIENT>`. Unit tests in `tests/behavior-routing.test.js` with synthetic strings only.
4. **Select** 60–90 candidates by hand from the scrubbed pool: task-shaped (asks for work), diverse across gates (aim ≥ 8 each for `cook`-scope, `tdd`/fix, `verify-plan`, `run-state`, plus planning/brainstorm/git/review/docs), not a pure follow-up. **Human review**: the user reads the selected list once for residual PII and either approves or adds terms to `scrub-terms.local.txt` and re-runs task 3.
5. **Label** — two independent labellers, neither sees the other:
   - A: implementing session, with `skill-activation.md` rule-5 table + registry one-liners.
   - B: a fresh subagent given only the prompt and the list of skill dir names + `ck:` commands with their one-line descriptions (no rule-5 table, no A labels).
   - Each emits 1–3 tokens (skill dir name or `ck:<cmd>`) a correct session would Read/invoke first. Keep iff `a ∩ b ≠ ∅`; `expected = a ∪ b`. Drop disagreements; record the drop count.
6. Optional registry-derived synthetic cases (paraphrase a skill's "Triggers on" into a user-style request): `source:"registry"`, train only, ≤ 20 % of train.
7. `tests/behavior/routing/split-cases.cjs` (~60 lines): mulberry32(1729), stratify by `expected[0]`, 30 % test, force `registry` → train. Freeze: write `split` into `cases.jsonl`; never re-split after phase 05 starts. Unit-test determinism (same input → same split) in `tests/behavior-routing.test.js`.
8. Record in `plans/261001-1521-eval-hillclimb-routing/reports/dataset-summary.md` (committed): counts per source/split/gate, drop count, agreement rate. **No prompt text.**

Decision point: transcript-sourced cases < 40 ⇒ phases 04–05 still run (measure-only); phase 06 is skipped and recorded as such.

**Exit gate:** `git check-ignore tests/behavior/routing/data/cases.jsonl` → prints the path (exit 0) · `node -e 'const r=require("fs").readFileSync("tests/behavior/routing/data/cases.jsonl","utf8").trim().split("\n").map(JSON.parse);const t=r.filter(c=>c.source!=="registry");console.log(t.length>=40&&r.every(c=>c.expected.length&&c.split), t.length)'` → `true <n≥40>` (or `false` ⇒ measure-only, recorded) · `git status --porcelain tests/behavior/routing/data` → empty · `node --test tests/behavior-routing.test.js` → 0 fail.
