# Entity bodies — one worked example per kind

Vietnamese prose, English keywords (D-4). Each body ≤ 12 lines. Frontmatter shape is
`../../traceability/references/entity-template.md`'s job; this file is the body only — what goes
*under* the `# <ID> — <title>` heading.

## FR — `**Actor:**`, `**Precondition:**`, then Given/When/Then

```markdown
# FR-012 — Duyệt đơn hoàn tiền

**Actor:** CSKH   **Precondition:** đơn ở TRẢ_HÀNG

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED
```

## NFR — one measurable sentence, no labels

```markdown
# NFR-004 — Hoàn tiền phải xử lý trong 5 giây

Hệ thống phải xác nhận hoàn tiền trong vòng 5 giây kể từ khi CSKH bấm Duyệt hoàn, đo tại API
gateway. [UNVERIFIED] cho tới khi có SLA chính thức.
```

## UC — `**Precondition:**`, then the actor's flow

An anti-pattern in the `ba-spec` skill file: a UC with no `Precondition:`.

```markdown
# UC-007 — CSKH duyệt đơn hoàn tiền

**Precondition:** Đơn ở trạng thái TRẢ_HÀNG, CSKH đã đăng nhập.

1. CSKH mở đơn cần duyệt.
2. CSKH kiểm tra thông tin hoàn tiền.
3. CSKH bấm Duyệt hoàn.
4. Hệ thống ghi trạng thái REFUND_APPROVED.
```

## US — `Là <actor>, tôi muốn <X>, để <Y>`

```markdown
# US-021 — Là CSKH, tôi muốn duyệt hoàn tiền nhanh

Là CSKH, tôi muốn duyệt đơn hoàn tiền chỉ trong một thao tác, để không phải chuyển màn hình
nhiều lần khi xử lý hàng loạt đơn.
```

## AC — Given/When/Then, pass/fail only

```markdown
# AC-012.1 — Duyệt hoàn tiền thành công

Given đơn có trạng thái TRẢ_HÀNG
When CSKH bấm Duyệt hoàn
Then hệ thống ghi REFUND_APPROVED và hiển thị thông báo thành công
```

## TC — `Bước / Dữ liệu / Kết quả mong đợi`

Re-uses the AC it exercises; never restates it in different words (anti-pattern in the `spec`
skill file).

```markdown
# TC-030 — Test duyệt hoàn tiền qua UI

**Bước:** Mở đơn REFUND-9001 ở trạng thái TRẢ_HÀNG, bấm Duyệt hoàn.
**Dữ liệu:** đơn REFUND-9001, CSKH test1.
**Kết quả mong đợi:** đơn chuyển sang REFUND_APPROVED, banner "Đã duyệt hoàn tiền" hiển thị.
```
