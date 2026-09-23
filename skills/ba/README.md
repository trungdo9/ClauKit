# BA Kit — bộ kỹ năng Business Analyst cho ClauKit

Viết tài liệu nghiệp vụ theo chuỗi **PRD → SRS → user story/AC → bàn giao dev**, mọi yêu cầu đều truy vết được. Namespace `/ba:`.

## Cài đặt

```bash
ck init --kit ba          # cài kit BA vào .claude/ của project
ck init --kit engineer    # (tuỳ chọn) cần cho bước cuối: /ck:tickets → /ck:cook
```

Cài xong có **6 command**, **6 skill đã đăng ký** (`ba-context`, `ba-prd`, `ba-spec`, `ba-traceability`, `ba-diagramming`, `ba-deliver` — gọi được bằng tool `Skill`, nằm ở `.claude/skills/ba-*/`), 1 file rules ([.claude/workflows/business-analysis-rules.md](../../workflows/business-analysis-rules.md)) và 1 helper CLI (`.claude/scripts/ba/traceability.cjs`).

## Các command

- `/ba:plan [fast|full] [<project-slug>]` — tạo/cập nhật hub `plans/ba-context.md` (phạm vi, actor, glossary). **Chạy đầu tiên**; mọi command khác dừng nếu thiếu file này.
- `/ba:prd prd|roadmap [<project-slug>]` — PRD + bóc EPIC · roadmap Now/Next/Later.
- `/ba:spec fr|nfr|uc|us|ac|tc|cr|bp|compose [<project-slug>]` — viết từng loại yêu cầu thành entity; `compose` ghép thành `SRS-001.md` để ký.
- `/ba:diagram sequence|flow|state|erd <FR-###|mô tả> [<project-slug>]` — sơ đồ mermaid.
- `/ba:qc gap [<project-slug>]` — soi yêu cầu mồ côi / chưa có nguồn. Exit 0 = đủ điều kiện bàn giao.
- `/ba:deliver scope|uat|acceptance|release-notes|golive|handover|all [<project-slug>] [--force]` — tài liệu bàn giao: phạm vi, UAT, biên bản nghiệm thu, release notes, go-live, vận hành.

Chi tiết 55 năng lực và command nào phụ trách: [capability-map.md](capability-map.md).

## Quy trình chuẩn

```
/ba:plan → /ba:prd prd → /ba:spec fr / us / ac → /ba:spec compose → /ba:qc gap → /ba:deliver uat
      → /ck:tickets plans/ba/<project>/deliverables/SRS-001.md → /ck:cook <ticket> --from-plan
```

## Sample: project "dat-lich" (đặt lịch khám)

**1. Tạo hub**

```
/ba:plan full dat-lich
```
→ `plans/ba-context.md` (mục tiêu, actor: Bệnh nhân / CSKH / Bác sĩ, glossary).

**2. PRD + EPIC**

```
/ba:prd prd dat-lich
```
→ `plans/ba/dat-lich/entities/PRD-001.md`, `EPIC-001.md` (Đặt lịch), `EPIC-002.md` (Nhắc lịch)…

**3. Viết yêu cầu** — mỗi yêu cầu là một file, thân tiếng Việt, khoá tiếng Anh:

```
/ba:spec fr dat-lich
```
→ `plans/ba/dat-lich/entities/FR-001.md`

```markdown
---
id: FR-001
kind: FR
project: dat-lich
title: Xác nhận đặt lịch
doc: SRS-001
parents: [EPIC-001]
source: docs/yeu-cau-khach-hang.pdf p.4
confidence: high
out_of_scope: Không xử lý thanh toán đặt cọc
---

# FR-001 — Xác nhận đặt lịch

**Actor:** Bệnh nhân   **Precondition:** khung giờ đang HOLD

Given khung giờ đang HOLD cho bệnh nhân
When bệnh nhân bấm Xác nhận
Then lịch chuyển sang BOOKED và gửi thông báo trong 3 giây
```

Không có nguồn thì ghi `source: [UNVERIFIED]` + `confidence: low` — kit không cho phép bịa trích dẫn. Tiếp theo `/ba:spec us dat-lich` (user story `US-001`, `parents: [FR-001]`) và `/ba:spec ac dat-lich` (`AC-001.1` Given/When/Then, số AC luôn theo số cha).

**4. Ghép SRS để ký**

```
/ba:spec compose dat-lich
```
→ `plans/ba/dat-lich/deliverables/SRS-001.md` và `PRD-001.md` — **commit vào git** (đây là bản khách ký). Khối FR render đúng mẫu, đủ 5 mục `/ck:cook` cần:

```markdown
## FR-001 — Xác nhận đặt lịch
**Actor:** Bệnh nhân   **Precondition:** khung giờ đang HOLD
**source:** docs/yeu-cau-khach-hang.pdf p.4   **confidence:** high
**Out of scope:** Không xử lý thanh toán đặt cọc
**Constraints:** NFR-001 — Thông báo ≤ 3 giây
**Touches:** [UNKNOWN]
```

Chạy lại `compose` bao nhiêu lần cũng ra cùng byte — **không sửa tay file này**; sửa entity rồi compose lại.

**5. Kiểm tra trước khi bàn giao**

```
/ba:qc gap dat-lich
```
```
✓ no gaps — 12 node(s) reachable
```
Exit 1 kèm danh sách nếu có FR không có cha hoặc `[UNVERIFIED]` — bàn giao dừng ở đây cho tới khi sạch.

**6. Tài liệu nghiệm thu**

```
/ba:deliver uat dat-lich
/ba:deliver acceptance dat-lich
```
→ `deliverables/UAT-001.md` (mỗi TC một dòng, cột kết quả để điền tay, ô ký), `ACCEPTANCE-001.md` (biên bản nghiệm thu). Hai file này **seed một lần** — chạy lại không ghi đè, cần `--force` mới ghi.

**7. Chuyển cho dev** (cần kit `engineer`)

```
/ck:tickets plans/ba/dat-lich/deliverables/SRS-001.md
/ck:cook plans/<YYMMDD-HHmm>-dat-lich/tickets/01-xac-nhan-dat-lich.md --from-plan
```
Ticket mang sẵn AC từ SRS; cook chỉ hỏi đúng một thứ spec không biết: file nào bị đụng (`touchpoints`).

## Quy ước cần nhớ

- **Slug project**: `^[a-z0-9][a-z0-9-]*$` — không dấu, không `/`, không `..`.
- **Entity là nguồn sự thật** (`entities/*.md`, commit); `traceability.derived.json` là index sinh ra, đã git-ignore.
- **Deliverable hai loại**: `derived` (SRS, PRD, scope, release-notes — sinh lại được) và `owned` (UAT, acceptance, go-live, handover, BP — seed một lần, người điền tiếp).
- Helper CLI dùng trực tiếp khi cần: `node .claude/scripts/ba/traceability.cjs index|gap|validate|compose|changelog|deliver plans/ba/<project>` — exit `0` sạch · `1` có finding · `2` lỗi gọi.
- Ngôn ngữ: thân tiếng Việt, khoá tiếng Anh (`FR-###`, `Given/When/Then`, `source:`) để nối thẳng vào BDD/Jira.

Đọc thêm: rules đầy đủ ở [business-analysis-rules.md](../../workflows/business-analysis-rules.md); mô hình spine ở [traceability/SKILL.md](../ba-traceability/SKILL.md).
