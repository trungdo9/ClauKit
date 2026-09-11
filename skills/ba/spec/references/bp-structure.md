# BP — Business Process Definition structure

Eight sections in order, Vietnamese prose + EN keywords.

## `## Tóm tắt (narrative)`

3–6 sentences: what the process achieves and for whom.

## `## Vai trò & tác nhân (roles/actors)`

Table: vai trò | trách nhiệm | hệ thống sử dụng.

## `## Kích hoạt (trigger)`

The event that starts the process, and who or what raises it.

## `## Đầu vào / Đầu ra (inputs/outputs)`

Table: two columns — artifact, source/destination.

## `## Các bước (steps)`

Numbered. Each step names its actor and, where one exists, the `UC-###` or `FR-###` it realises.

## `## Quy tắc nghiệp vụ (business rules)`

**As `FR-###` references only, never as new prose rules.** A rule with no FR to cite means the FR
is missing: run `/ba:spec fr`. A business rule written here instead of cited from an FR creates
a second source of truth for the same fact — the exact defect the spine exists to prevent.

## `## Ngoại lệ (exceptions)`

Each exception names the step it branches from and the outcome.

## `## Sơ đồ`

The `/ba:diagram flow` render inline in a ` ```mermaid ` fence, or the literal `[UNRENDERED]` with
the source beside it. Rules § 4: compiled or labelled, never a third state.

---

**Trigger to revisit (wave 2+), falsifiable:** a real project needs to ask the *index* — not
`grep` — which processes an entity participates in (*"which processes does `FR-014` appear in"*).
Until someone needs that query, the BP kind stays undeclared. Record the trigger here so the next
reader inherits the test rather than the conclusion.
