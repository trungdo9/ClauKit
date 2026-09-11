# PRD-001 — section shape

Frontmatter is phase 02's entity contract, unchanged (see `../../traceability/references/id-scheme.md`).
Body: Vietnamese prose, English artifact keywords (D-4).

```markdown
# PRD-001 — <tên sản phẩm>

## 1. Vấn đề        (ai đang chịu, chịu thế nào, bằng chứng)
## 2. Người dùng     (Actor + nhu cầu, khớp ba-context § 2)
## 3. Mục tiêu       (kết quả đo được, không phải tính năng)
## 4. Phạm vi        (Trong / Ngoài — bảng hai cột)
## 5. EPIC           (bảng: EPIC-### | tên | giá trị mang lại)
## 6. Giả định & rủi ro
```

§ 7 (roadmap) is appended only by the `roadmap` action — see below. It is not part of the `prd`
action's output.

## Worked `EPIC-001.md`

```markdown
---
id: EPIC-001
kind: EPIC
project: acme-refund
title: Đặt lịch hẹn
doc: PRD-001
parents: [PRD-001]
source: doc:plans/ba-context.md p.1
confidence: med
out_of_scope: Không xử lý thanh toán trực tuyến khi đặt lịch
---

# EPIC-001 — Đặt lịch hẹn

Bệnh nhân chọn bác sĩ, khung giờ trống, và xác nhận đặt lịch qua web, không cần gọi điện.
```

One EPIC file per capability, `doc: PRD-001` and `parents: [PRD-001]` on every one — the PRD is
both the rendering target and the sole parent at wave 0.

## The `roadmap` output shape

Written into `PRD-001.md` § 7, **not** a new entity. A three-column table over EPIC ids that
already exist — `roadmap` orders, it does not invent:

```markdown
## 7. Lộ trình

| Now | Next | Later |
|---|---|---|
| EPIC-001 | EPIC-002 | EPIC-003 |
```

Re-running the `roadmap` action replaces this section in place; it never appends a second `## 7`.
Every id in the table must already exist in `entities/` — an id that doesn't is a bug in the
action, not a legal roadmap.
