# Entity file — binding shape, plus one worked example per kind

## The binding shape (verbatim, from `plan.md` § Spine model)

```markdown
---
id: FR-012
kind: FR
project: acme-refund
title: Duyệt đơn hoàn tiền
doc: SRS-001
parents: [EPIC-003]
source: src/order/refund.service.ts:88
confidence: high
---

# FR-012 — Duyệt đơn hoàn tiền

**Actor:** CSKH   **Precondition:** đơn ở TRẢ_HÀNG

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED
```

Filename **is** `FR-012.md` — `basename(file, '.md') === id`, always. Vietnamese body, English keywords (D-4): `Actor:`, `Precondition:`, `Given`/`When`/`Then` are frozen tokens, never translated.

## Worked example, one per kind — all nine

Wave 0 generates every one of these; none is speculative. One coherent story: `PRD-001` (root) → `EPIC-003` + `SRS-001` (both children of the PRD) → `FR-012` (child of the EPIC, rendered into the SRS) → `NFR-004`, `UC-007`, `US-021`, `AC-012.1` (all children of `FR-012`) → `TC-030` (child of the AC). Each ≤ 14 lines.

**PRD**
```markdown
---
id: PRD-001
kind: PRD
project: acme-refund
title: Hoàn tiền đơn hàng
parents: []
source: doc:brainstorm.md p.1
confidence: med
---

# PRD-001 — Hoàn tiền đơn hàng
```

**EPIC** — carries `out_of_scope` (required):
```markdown
---
id: EPIC-003
kind: EPIC
project: acme-refund
title: Duyệt đơn hoàn tiền
doc: PRD-001
parents: [PRD-001]
source: doc:brainstorm.md p.2
confidence: med
out_of_scope: Không xử lý hoàn tiền qua thẻ quốc tế
---

# EPIC-003 — Duyệt đơn hoàn tiền
```

**SRS**
```markdown
---
id: SRS-001
kind: SRS
project: acme-refund
title: Đặc tả hoàn tiền đơn hàng
parents: [PRD-001]
source: doc:brainstorm.md p.3
confidence: med
---

# SRS-001 — Đặc tả hoàn tiền đơn hàng
```

**FR** — carries `touches` (optional, on FR/US only):
```markdown
---
id: FR-012
kind: FR
project: acme-refund
title: Duyệt đơn hoàn tiền
doc: SRS-001
parents: [EPIC-003]
source: src/order/refund.service.ts:88
confidence: high
touches: src/order/refund.service.ts
---

# FR-012 — Duyệt đơn hoàn tiền
```

**NFR**
```markdown
---
id: NFR-004
kind: NFR
project: acme-refund
title: Hoàn tiền phải xử lý trong 5 giây
doc: SRS-001
parents: [EPIC-003]
source: "[UNVERIFIED]"
confidence: low
---

# NFR-004 — Hoàn tiền phải xử lý trong 5 giây
```

**UC**
```markdown
---
id: UC-007
kind: UC
project: acme-refund
title: CSKH duyệt đơn hoàn tiền
doc: SRS-001
parents: [FR-012]
source: doc:brainstorm.md p.4
confidence: med
---

# UC-007 — CSKH duyệt đơn hoàn tiền
```

**US**
```markdown
---
id: US-021
kind: US
project: acme-refund
title: Là CSKH, tôi muốn duyệt hoàn tiền nhanh
doc: SRS-001
parents: [FR-012]
source: doc:brainstorm.md p.5
confidence: med
touches: src/order/refund.service.ts
---

# US-021 — Là CSKH, tôi muốn duyệt hoàn tiền nhanh
```

**AC** — its `\d{3}` (`012`) must equal its parent's:
```markdown
---
id: AC-012.1
kind: AC
project: acme-refund
title: Duyệt hoàn tiền thành công
doc: SRS-001
parents: [FR-012]
source: src/order/refund.service.ts:90
confidence: high
---

# AC-012.1 — Duyệt hoàn tiền thành công
```

**TC**
```markdown
---
id: TC-030
kind: TC
project: acme-refund
title: Test duyệt hoàn tiền qua UI
doc: SRS-001
parents: [AC-012.1]
source: doc:brainstorm.md p.6
confidence: med
---

# TC-030 — Test duyệt hoàn tiền qua UI
```

## How this renders

D-4 is binding on the **composed deliverable**, not on storage. The wave-1 composer reads `FR-012`'s frontmatter + body above and renders it into exactly D-4's block — the same four fields (`Actor`, `Precondition`, `source`, `confidence`) survive verbatim, just re-arranged from YAML keys into the signed document's prose meta-line:

```markdown
## FR-012 — Duyệt đơn hoàn tiền

**Actor:** CSKH   **Precondition:** đơn ở TRẢ_HÀNG

**source:** src/order/refund.service.ts:88   **confidence:** high

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED
```

Storage keeps `source`/`confidence` in frontmatter so the index needs no body parsing; the composer is what moves them into the rendered meta-line.
