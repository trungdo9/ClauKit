# HR Kit — human resources for ClauKit

HR work from hiring to exit, jurisdiction-aware, with employee data kept out of the repo. Namespace `/hr:`.

## Install

```bash
ck init --kit hr
```

You get **11 commands**, **13 skills** (grouped at `.claude/skills/hr/<name>/`, frontmatter `hr-<name>`. The `/hr:*` commands read them by path; they do not register with the `Skill` tool) and **1 rules file** ([.claude/workflows/hr-rules.md](../../workflows/hr-rules.md)).

## Commands

| Command | Actions | Skill(s) read |
|---|---|---|
| `/hr:plan` | `full` · `fast` | `hr-context` (creates `plans/hr-context.md`, run first) |
| `/hr:recruit` | `intake` · `jd` · `source` · `interview` · `assess` · `offer` · `brand` · `ops` · `exec` · `tech` | `hr-recruiting`, `hr-tech-hiring` |
| `/hr:people` | `onboard` · `offboard` · `lifecycle` · `service` | `hr-people-ops` |
| `/hr:perform` | `goals` · `review` · `pip` · `calibrate` · `succession` · `career` · `coach` | `hr-performance` |
| `/hr:reward` | `structure` · `benchmark` · `benefits` · `recognition` · `equity` | `hr-rewards` |
| `/hr:learn` | `needs` · `program` · `leadership` · `skills` · `evaluate` | `hr-learning` |
| `/hr:org` | `design` · `change` · `ma` · `od` · `transform` | `hr-org-change` |
| `/hr:workforce` | `plan` · `forecast` · `scenario` · `analytics` · `kpi` · `budget` · `schedule` | `hr-workforce-analytics` |
| `/hr:comply` | `policy` · `investigate` · `discipline` · `risk` · `audit` · `labor` · `payroll` · `accommodate` · `immigration` · `exit` · `global` · `country <cc>` | `hr-employee-relations`, `hr-global` |
| `/hr:culture` | `engage` · `survey` · `dei` · `wellbeing` · `comms` · `journey` | `hr-culture` |
| `/hr:tech` | `hris` · `select` · `ai` · `automation` · `chatbot` · `data` | `hr-technology` |

Every command except `/hr:plan` hard-fails without `plans/hr-context.md`. Outputs land in `plans/hr/<slug>/`.

## Rules that shape every output ([hr-rules](../../workflows/hr-rules.md))

1. **Jurisdiction first.** Legal-adjacent output names its country.
2. **No statutory figures from memory.** Cite the law and its effective date, or write `[VERIFY]`. Legal-exposure decisions end with a counsel-review line.
3. **No employee PII in committed files.** Use roles and pseudonyms.
4. **No invented benchmarks.** Cite a source or write `[NEEDS DATA]`.
5. **Fair and job-related selection, rating and pay**, checked for adverse impact.
6. **A human decides.** AI may draft and flag, but it does not hire, fire, promote or set pay.

## Typical flow

```
/hr:plan → /hr:recruit intake <role> → /hr:recruit jd <role> → /hr:recruit interview <role>
        → /hr:recruit offer <role> → /hr:people onboard <cohort>
```

## Provenance

Re-authored from [`tuanductran/hr-skills`](https://github.com/tuanductran/hr-skills) (MIT, © 2026 Tuan Duc Tran). The 146 source skills were consolidated into 12 domain skills; `hr-context` is original. Attribution: `skills/THIRD_PARTY_NOTICES.md` in the ClauKit package.
