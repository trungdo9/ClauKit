# `plans/ba-context.md` template

Literal skeleton written by `/ba:plan`. Copy whole; fill each section from the 8-question
interview (`full`) or from disk (`fast`, every field `confidence: low` + `[UNVERIFIED]`).
`project id` is load-bearing — it names `plans/ba/<slug>/`, the spine's project dir.

```markdown
# BA Context — <project>

**Cập nhật:** <YYYY-MM-DD>   **Project id:** <slug>   **confidence:** high|med|low

## 1. Phạm vi & sản phẩm

<hệ thống/sản phẩm là gì, phục vụ ai — câu hỏi 1>

## 2. Actors & quyền

| Actor | Mô tả | Quyền chính |
|---|---|---|
| | | |

## 3. Ranh giới hệ thống

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| | |

## 4. Nguồn sự thật

| Nguồn | Loại | Đường dẫn | confidence |
|---|---|---|---|
| | | | |

## 5. Ràng buộc phi chức năng

<feeds NFR-### later>

## 6. Từ điển thuật ngữ

| Thuật ngữ VI | EN keyword | Định nghĩa |
|---|---|---|
| | | |

## 7. Phê duyệt & sign-off

<quy trình phê duyệt & ai ký — drives confidence: thresholds and the draft-default gate>

## 8. Tracker & tài liệu

<Jira project key, Confluence space — external ids /ba:sync is idempotent on>

## 9. Câu hỏi chưa giải quyết

<mọi điểm chưa chắc; đánh dấu [UNVERIFIED] nếu không có nguồn>
```
