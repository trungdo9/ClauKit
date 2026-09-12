---
name: team-onboarding
description: Quy trình tuyển dụng & onboard đội ngũ Agent chuyên môn cho bất kỳ công ty/dự án nào. Hỗ trợ 2 chế độ (1) Khởi tạo không gian Agent cho công ty mới (.claude/agents/<company-slug>/ kèm ONBOARDING.md và SCHEDULE.md), và (2) Tuyển dụng, cấp quyền, nghiệm thu 8/8 và xếp lịch ca trực cho một nhân viên AI cụ thể.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Team Onboarding — Tuyển Dụng & Onboard Đội Ngũ Nhân Viên AI Cho Doanh Nghiệp

> Trong hệ thống này, Agent được đối xử như **nhân viên trực tuyến** của từng doanh nghiệp: có tên riêng, chức danh, ca trực, công cụ được cấp và giới hạn quyền hạn rõ ràng.
> Skill này đóng vai trò **Phòng nhân sự AI (AI HR)**: khởi tạo không gian công ty, phát sổ tay vận hành, cấp công cụ, nghiệm thu 8/8 và xếp lịch ca trực tự động.

---

## 1. Kiến Trúc Phân Cấp Thư Mục & Quy Ước Đặt Tên

### 1.1 Phân cấp giữa Agent Dùng Chung vs Agent Riêng Của Công Ty

Hệ thống phân tách rành mạch giữa 2 nhóm Agent:
* **Agent chuyên môn nền tảng (Dùng chung — Shared)**:
  * Nằm trong `.claude/agents/engineering/` và `.claude/agents/marketing/`.
  * Đóng vai trò chuyên gia phương pháp luận (code-reviewer, debugger, seo-writer, researcher...).
  * Không gắn cứng thương hiệu, không gắn API key hay server cụ thể.
* **Agent ca trực của từng doanh nghiệp (Riêng biệt — Dedicated)**:
  * Nằm trong `.claude/agents/<company-slug>/` và `.agents/agents/<company-slug>/`.
  * Đóng vai trò **Điều phối viên (Orchestrator)** thực thi công việc định kỳ của công ty đó.

### 1.2 Quy tắc đặt tên thư mục công ty (`<company-slug>`)

Mỗi công ty/dự án sở hữu một thư mục riêng:
* **Quy ước:** Chữ thường (`lowercase`), không dấu, dùng gạch nối `-` (`kebab-case`) hoặc viết tắt thương hiệu chuẩn (3–6 ký tự).
* **Ví dụ:**
  * Công ty Enterprise Corp $\rightarrow$ `entcorp` (hoặc `ec`)
  * Thương hiệu Cà Phê Ban Mê $\rightarrow$ `banme` (hoặc `bm-coffee`)
  * Khách hàng Nông Sản Hưng Thịnh $\rightarrow$ `hungthinh` (hoặc `ht-agri`)
  * Doanh nghiệp Logistics ABC $\rightarrow$ `abc-logistics`

Mỗi thư mục công ty bắt buộc chứa 2 file trụ cột:
```text
.claude/agents/<company-slug>/
├── ONBOARDING.md    # Sổ tay nhân viên AI (Văn hóa, brand, nguồn chân lý, luật an toàn)
├── SCHEDULE.md      # Bảng phân ca trực, timeline điều phối, ID automation
├── <agent-1>.md     # Agent ca trực chuyên môn 1 (vd: crm-automation.md)
└── <agent-2>.md     # Agent ca trực chuyên môn 2 (vd: daily-publisher.md)
```

---

## 2. Nguồn Chân Lý Của Skill (References)

| Nội dung | File mẫu / Quy chuẩn |
|---|---|
| Mẫu Sổ tay nhân viên công ty | [`references/company-onboarding-template.md`](references/company-onboarding-template.md) |
| Mẫu Bảng lịch trực công ty | [`references/company-schedule-template.md`](references/company-schedule-template.md) |
| Khung file Agent chuyên môn | [`references/agent-template.md`](references/agent-template.md) |
| Bảng chấm nghiệm thu 8/8 | [`references/acceptance-check.md`](references/acceptance-check.md) |
| Danh mục công cụ & rủi ro | [`references/tool-catalog.md`](references/tool-catalog.md) |
| Mẫu báo cáo thông báo | [`templates/telegram-report-template.md`](../../../../templates/telegram-report-template.md) |

---

## 3. Chế Độ A — Khởi Tạo Đội Ngũ Cho Công Ty Mới (`init-company`)

Kích hoạt khi người dùng yêu cầu: *"Tạo đội ngũ agent cho công ty `<tên>`"*, *"Onboard công ty mới `<company-slug>`"*.

### Quy trình 3 bước khởi tạo công ty:

1. **Thu thập thông tin công ty:**
   * Tên pháp nhân & thương hiệu: vd *Công ty Cổ phần Nông Sản Hưng Thịnh*
   * Mã định danh slug: vd `hungthinh`
   * Nguồn chân lý: CRM, database, bảng giá, brand guidelines
   * Kênh nhận báo cáo: Telegram topic, Slack channel, hoặc Discord webhook

2. **Khởi tạo cấu trúc thư mục song song:**
   ```bash
   mkdir -p .claude/agents/<company-slug> .agents/agents/<company-slug>
   ```

3. **Sinh 2 file quản trị nền tảng:**
   * Copy [`references/company-onboarding-template.md`](references/company-onboarding-template.md) vào `.claude/agents/<company-slug>/ONBOARDING.md`, thay thế các biến thông tin của công ty.
   * Copy [`references/company-schedule-template.md`](references/company-schedule-template.md) vào `.claude/agents/<company-slug>/SCHEDULE.md`.
   * Đồng bộ sang `.agents/agents/<company-slug>/` và xác nhận `diff` sạch 100%:
     ```bash
     cp -r .claude/agents/<company-slug>/* .agents/agents/<company-slug>/
     diff -rq .claude/agents/<company-slug> .agents/agents/<company-slug>
     ```

---

## 4. Chế Độ B — Tuyển Dụng & Ra Ca Cho Agent Chuyên Môn (`hire-agent`)

Kích hoạt khi:
* *"Tạo agent mới cho ca trực <giờ> của công ty `<company-slug>`"*
* *"Chuẩn hoá lại agent `<tên>` cho đúng format"*
* *"Nghiệm thu agent `<tên>` trước khi xếp lịch tự động"*

### Quy trình 5 bước tuyển dụng:

#### Bước 1 — Phỏng vấn vị trí
Chốt đủ 6 thông tin với người phụ trách:
1. Tên riêng + chức danh: vd *Vũ — Kỹ Sư CRM & Tự Động Hóa*
2. Trách nhiệm duy nhất (1 câu): vd *Đồng bộ AMIS CRM sang Brevo mỗi sáng*
3. Khung giờ ca trực: vd *07:00 ICT hàng ngày*
4. Đầu vào / Đầu ra: vd `amis-products.json` $\rightarrow$ Brevo Lists
5. Tổng điểm checklist: vd 10 tiêu chí (CRM) hoặc 30 tiêu chí (SEO)
6. Công cụ được cấp trong danh mục: vd `sync-amis-products.js`

Kiểm tra chống trùng vai: đọc `.claude/agents/<company-slug>/SCHEDULE.md`. Trùng ⇒ **mở rộng agent cũ**, không tạo mới.

#### Bước 2 — Soạn hợp đồng (Sinh file agent)
Lấy khung từ [`references/agent-template.md`](references/agent-template.md), điền đủ 7 khối:
1. Frontmatter (`name`, `description`, `skills:`)
2. Danh tính + Nhiệm vụ duy nhất
3. Bảng **Các Agent & Skill tích hợp** — ủy quyền, không chép lại logic
4. Quy tắc gửi báo cáo (đúng kênh, đúng topic/thread, ống dẫn `echo`)
5. Quy trình thực thi 3–5 bước, **bước 1 luôn là `git pull`**
6. Bảng checklist thẩm định với tổng điểm rõ ràng + luật báo số thật
7. Khối NGOẠI LỆ chạy không người trông + Giới hạn cứng

#### Bước 3 — Cấp công cụ
* Đối chiếu [`references/tool-catalog.md`](references/tool-catalog.md) hoặc danh mục script đã được kiểm định của công ty.
* Script ghi production bắt buộc có cờ `--dry-run` và permission rule trong `.claude/settings.local.json`.
* Xác minh 100% đường dẫn tham chiếu trong file agent tồn tại thật:
  ```bash
  grep -oE '(scripts|wiki|plans|templates|\.agents|\.claude)/[A-Za-z0-9_./-]+' \
    .claude/agents/<company-slug>/<name>.md | sort -u | while read -r f; do
      [ -e "$f" ] && echo "OK   $f" || echo "MISS $f"
    done | grep MISS
  ```

#### Bước 4 — Nghiệm thu (Checklist 8/8)
Chấm theo [`references/acceptance-check.md`](references/acceptance-check.md). **Chưa đủ 8/8 ⇒ không xếp ca tự động.**
Bắt buộc:
```bash
diff .claude/agents/<company-slug>/<name>.md .agents/agents/<company-slug>/<name>.md && echo IDENTICAL
```
Chạy thử `--dry-run` có người giám sát trước khi kích hoạt.

#### Bước 5 — Xếp lịch & Công bố
1. Đồng bộ file sang `.agents/agents/<company-slug>/<name>.md`.
2. Đăng ký vào `.claude/agents/<company-slug>/SCHEDULE.md` (khung giờ, file agent, ID automation, kênh báo cáo).
3. Tạo Automation Engine (Orca/Cron) và **lưu lại ID thật** vào tài liệu.
4. `git add`, `git commit` và `git push`.

---

## 5. Giới Hạn Cứng Của Skill Này

- Tuyệt đối không tự tạo automation **enabled** khi chưa đạt đủ nghiệm thu 8/8.
- Không ghi ID automation, đường dẫn, hay tên script phỏng đoán vào tài liệu khi chưa xác minh tồn tại thật.
- Không sinh agent có quyền `git push` tự động trong ca chạy đêm/không người trông.
- Khi chuẩn hoá agent cũ: **không xóa bỏ các quy định an toàn đang có**, chỉ tối ưu hóa theo đúng thực tế code.
