# HR Rules

**Domain:** HR kit (`/hr:` namespace) — applies to all HR skills, commands, and outputs.

## 1. Jurisdiction first

Employment law is local. Any output that touches contracts, leave, pay, working time, discipline,
termination, immigration, data protection or benefits names the **country** (and state/province where
it matters) it applies to. The default comes from `plans/hr-context.md` § Jurisdictions; a request that
spans countries not listed there ⇒ ask, never assume. Multi-country policy = a global baseline plus a
per-country addendum, never one text pretending to fit all.

## 2. Not legal, tax or immigration advice — and no statutory figures from memory

HR outputs prepare a decision; they do not make the legal call. Rates, caps, thresholds, notice periods,
statutory leave days, contribution percentages and filing deadlines change by decree and by year:

- cite the authority and its effective date, or write `[VERIFY: <authority/law>]` in place of the figure;
- never present a number recalled from training as current;
- terminations, disciplinary sanctions, investigation findings, accommodation denials, layoffs/RIF,
  worker classification and visa decisions end with: *review with qualified employment counsel (or the
  relevant authority) before acting.*

## 3. Employee data stays out of committed files

Names, employee IDs, contact details, salaries of identifiable people, health/disability data, family
data, investigation details and performance ratings of named people **never** land in `plans/hr/` or
any committed file. Use roles or pseudonyms (`Employee A`, `Senior Engineer #2`); keep the mapping in
the HRIS. Special-category data (health, ethnicity, religion, union membership, sexual orientation) is
never written to committed files and never inferred; collection outside the repo only on a
counsel-confirmed lawful basis, voluntary, reported in aggregate above the minimum group size set in
`plans/hr-context.md` § 7.

A pseudonym beside a unique role, small team or date range is identifying — per-person rows stay in the
HRIS; `plans/` gets role family/band and counts.

Per-person drafts (PIP, review, interview debrief) may sit in `plans/hr/<slug>/` only as pseudonymised
**working drafts**; the final copy moves to the HRIS and the draft is removed from `plans/`.

## 4. No invented benchmarks

Salary ranges, market percentiles, turnover/attrition norms, engagement benchmarks, time-to-fill,
cost-per-hire and training ROI figures are cited (source + date) or marked `[NEEDS DATA]`. A range
derived from the user's own data says so. "Industry average is X%" without a source does not ship.

## 5. Fair, job-related, inclusive

Selection, rating and pay decisions rest on job-related criteria written down **before** candidates or
employees are assessed. Structured interviews and scorecards over unstructured impressions. No question
or criterion that proxies a protected characteristic (age, pregnancy/family plans, religion, nationality
beyond right-to-work, disability, marital status). Gender-neutral, plain-language job ads. Any
selection, rating or pay outcome over a group gets an adverse-impact / pay-equity check before it is
final.

## 6. People decisions keep a human in the loop

AI may draft, summarise, structure and flag. It does not decide hiring, firing, promotion, pay or
discipline. AI used to screen, rank or score candidates or employees is treated as high-risk (e.g. EU
AI Act Annex III lists employment uses): document the purpose, the data, the human reviewer and the
bias test; tell candidates/employees where local law requires it.

## 7. Say "Read the skill file", never "Activate the skill"

Skills under `.claude/skills/hr/` sit at group depth and are **not registered**; `Skill(skill:
"hr-recruiting")` returns `Unknown skill` — the `/hr:*` commands are the entry points. See the root
`CLAUDE.md`. Canonical form, target counted from `.claude/workflows/`:

**Read the `hr-context` skill file** ([.claude/skills/hr/context/SKILL.md](../skills/hr/context/SKILL.md))

## 8. Hard-fail pre-flight

Every `/hr:` command verifies `plans/hr-context.md` before doing anything; absent ⇒ emit exactly:

```
❌ HR context not found at plans/hr-context.md
```

Direct to `/hr:plan`, exit. **The single exception is `/hr:plan`, which creates the hub — so `/hr:plan`
carries no pre-flight block at all.**

## 9. Output location

`plans/hr/<slug>/<artifact>.md`, `<slug>` matching `^[a-z0-9][a-z0-9-]*$` (a slash, `..` or whitespace ⇒
refuse — the slug becomes a path). Each skill's § Output names its artifacts. Prose in the user's
language; frontmatter keys and artifact ids in English.
