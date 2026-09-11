# Phase 04 — `/ba:plan` command + `ba-context` hub

**Depends on:** phase 03 (tree scaffolding).

**Blocks:** 08.

**Interfaces**
- Consumes: `.claude/workflows/business-analysis-rules.md` § 6 (hard-fail pre-flight, and its `/ba:plan` exception) — phase 01.
- Produces:
  - `.claude/commands/ba/plan.md` — the only command in wave 0. YAML frontmatter `description` + `argument-hint`.
  - `.claude/skills/ba/ba-context/SKILL.md` → `.claude/skills/ba/ba-context/SKILL.md` — the hub methodology.
  - `.claude/skills/ba/ba-context/references/context-template.md` — the literal `plans/ba-context.md` skeleton.
  - Runtime artifact in the USER's project: `plans/ba-context.md`. Every wave 1–4 `/ba:` command hard-fails without it.

---

## Task 4.1 — CREATE `skills/ba/ba-context/SKILL.md`

The BA analogue of `product-marketing` (marketing's hub skill). Frontmatter `name: ba-context`, `description`, `license: MIT`.

Body:
- **What the hub is** — the project-level facts every BA artifact must agree on, written once. Without it, an SRS written on Monday and a test pack written on Friday disagree about who the actors are.
- **The 8 interview questions** (`full` mode), one at a time, each with why it is asked and what a good answer looks like:
  1. Hệ thống/sản phẩm là gì, phục vụ ai? (scope + primary users)
  2. Các **Actor** và quyền của họ? (drives every `**Actor:**` field)
  3. Ranh giới hệ thống — cái gì trong, cái gì ngoài? (stops scope creep in the SRS)
  4. Nguồn sự thật hiện có? (docs, code repos, tickets — this becomes the legal `source:` set for rule 1)
  5. Ràng buộc phi chức năng đã biết? (feeds `NFR-###`)
  6. Từ điển thuật ngữ / glossary — VI term ↔ EN keyword (D-4's seam; without it the same concept gets two names)
  7. Quy trình phê duyệt & ai ký? (drives `confidence:` thresholds and the draft-default gate)
  8. Tracker & không gian tài liệu? (Jira project key, Confluence space — the external ids `/ba:sync` will be idempotent on in wave 4)
- **`fast` mode** — skip the interview, scaffold from what is on disk: `README`, `docs/`, `package.json`, existing `plans/`. Every scaffolded field is written with `confidence: low` and `[UNVERIFIED]` until a human confirms it. **This is rule 1 applied to the hub itself** — the hub is not exempt from the kit's own sourcing rule.
- **Update semantics** — re-running `/ba:plan` on an existing hub **merges**: never silently overwrite a human-edited field; report what changed. (Precedent: `settings-merge.js` and `wireGitignore` — "add what is missing, never touch what the user wrote, and say what changed".)
- **Reading order** — `references/context-template.md`.
- Link out, counted from `.claude/skills/ba/ba-context/`: `../../../workflows/business-analysis-rules.md`, `../traceability/SKILL.md`.

## Task 4.2 — CREATE `skills/ba/ba-context/references/context-template.md`

The literal skeleton written to `plans/ba-context.md`. Fenced as markdown so it can be copied whole. Sections, with a one-line instruction under each heading:

```
# BA Context — <project>

**Cập nhật:** <YYYY-MM-DD>   **Project id:** <slug>   **confidence:** high|med|low

## 1. Phạm vi & sản phẩm
## 2. Actors & quyền            (table: Actor | Mô tả | Quyền chính)
## 3. Ranh giới hệ thống         (table: Trong phạm vi | Ngoài phạm vi)
## 4. Nguồn sự thật              (table: Nguồn | Loại | Đường dẫn | confidence)
## 5. Ràng buộc phi chức năng    (feeds NFR-###)
## 6. Từ điển thuật ngữ          (table: Thuật ngữ VI | EN keyword | Định nghĩa)
## 7. Phê duyệt & sign-off
## 8. Tracker & tài liệu         (Jira project key, Confluence space)
## 9. Câu hỏi chưa giải quyết
```

`project id: <slug>` is load-bearing — it names `plans/ba/<slug>/`, which is the spine's project dir.

## Task 4.3 — CREATE `.claude/commands/ba/plan.md`

Shape copied from `.claude/commands/mk/seo.md` / `.claude/commands/mk/plan.md`, **with the pre-flight defect corrected** (see plan.md § Unresolved Q6: `mk/plan.md` carries a HARD FAIL block whose own text excepts `/mk:plan`).

```markdown
---
description: BA context — bootstrap or update plans/ba-context.md (scope, actors, glossary, sources)
argument-hint: [fast|full] [<project-slug>]
---

## Pre-flight

**None.** This command CREATES the BA context hub, so it is the one `/ba:` command that does not
require it. Every other `/ba:` command hard-fails without `plans/ba-context.md` — see
.claude/workflows/business-analysis-rules.md § 6.

## Variables

ACTION: $1 (default: full)
PROJECT: $2 (default: derived from the repo directory name, kebab-cased)

## Workflow

Read the `ba-context` skill file ([.claude/skills/ba/ba-context/SKILL.md](../../skills/ba/ba-context/SKILL.md)) —
the hub for BA project context.

Before writing any requirement id anywhere, read the `traceability` skill file
([.claude/skills/ba/traceability/SKILL.md](../../skills/ba/traceability/SKILL.md)).

### Actions
- **`full`** (default) — 8-question interview, one question at a time. …
- **`fast`** — scaffold from README/docs/ on disk. Every scaffolded field ships `confidence: low`
  and `[UNVERIFIED]` until confirmed.

## Output
`plans/ba-context.md` · and `plans/ba/<project-slug>/` created empty, ready for wave-1 generators.

## Notes
- Vietnamese prose, English artifact keywords — see .claude/workflows/business-analysis-rules.md § 7.
- Re-running merges; a human-edited field is never silently overwritten.
- Concise grammar. List unresolved questions at end.
- Cross-references: `.claude/workflows/business-analysis-rules.md`, `.claude/skills/ba/README.md`.

## Examples
```

Hard requirements on this file:
- `description:` **≤ 110 bytes** (kit-hygiene budget; the current 39 commands average 93B).
- The two skill references use **"Read the … skill file"** with a relative target counted from `.claude/commands/ba/` → `../../skills/ba/…`. Never "Activate".
- **No `-o html`.** `/mk:plan` supports it by delegating to `.claude/skills/software/planning/references/html-output.md`, which the `ba` kit does not ship — supporting it here would force a `requires.shared` entry for a wave-0 nicety. Rendering is `/ba:export`'s job in wave 4. Say so in one line under `## Output` so it is a recorded decision, not an omission.
- No backticked path to any file the `ba` kit does not install.

---

## Exit gate

**Exit gate:** `for L in $(grep -ohE '\]\(([^)]+\.md)\)' .claude/commands/ba/plan.md | sed -E 's/^\]\(//; s/\)$//'); do test -e ".claude/commands/ba/$L" && echo "OK $L" || echo "BROKEN $L"; done` → every line starts `OK`, zero `BROKEN`. Detail in Gate 1–3 below.

### Gate 1 — every link resolves from the installed position (simulated without an install)

```bash
cd <repo>
for L in $(grep -ohE '\]\(([^)]+\.md)\)' .claude/commands/ba/plan.md | sed -E 's/^\]\(//; s/\)$//'); do
  test -e ".claude/commands/ba/$L" && echo "OK  $L" || echo "BROKEN $L"
done
```
→ every line starts `OK`. **This tree has no `.claude/skills` symlink** (phase 01 task 1.1), so the check resolves against real files — the same shape an install produces.

### Gate 2 — every `ba` skill is reachable from a shipped `ba` entry point (§ 8 "every new skill reachable by a path a `/ba:` command names")

```bash
for S in $(cd .claude/skills/ba && ls -d */ | tr -d /); do
  grep -qr "skills/ba/$S/SKILL.md" .claude/commands/ba/ .claude/workflows/business-analysis-rules.md \
    && echo "REACHABLE $S" || echo "ORPHAN $S"
done
```
→ `REACHABLE ba-context`, `REACHABLE traceability`. Zero `ORPHAN` lines.

### Gate 3 — description budget
```bash
awk '/^description:/{print length($0)-13}' .claude/commands/ba/plan.md
```
→ a number **≤ 110**.
