# 📅 Bảng Lịch Trực & Điều Phối Đội Ngũ Kỹ Sư AI Agent (<Tên Công Ty>)
*<Tên công ty / Doanh nghiệp> — Hệ sinh thái <Tên thương hiệu / Domain>*

> **Tài liệu quản trị:** `.claude/agents/<company-slug>/SCHEDULE.md` — *ai làm gì, lúc nào*  
> **Sổ tay nhân viên:** [`ONBOARDING.md`](ONBOARDING.md) — *làm thế nào* (luật nền mọi agent đọc ở Bước 0)  
> **Tuyển agent mới:** Skill `team-onboarding`  
> **Đồng bộ song song:** `.agents/agents/<company-slug>/SCHEDULE.md`  
> **Cập nhật lần cuối:** <DD/MM/YYYY>  
> **Hạ tầng tự động:** <Orca / Cron / GitHub Actions>

---

## 1. Tổng Quan Các Ca Trực Tự Động Trong Ngày (Agent Roster)

Hệ sinh thái Agent của <Tên Công Ty> được vận hành bởi đội ngũ Kỹ sư chuyên trách với khung giờ độc lập:

```mermaid
timeline
    title Lịch Trực Đội Ngũ Kỹ Sư AI Agent <Tên Công Ty> (Múi giờ ICT - UTC+7)
    <07:00> : <Tên Agent 1> (<Chức danh>): <Mô tả tóm tắt nhiệm vụ>
    <19:00> : <Tên Agent 2> (<Chức danh>): <Mô tả tóm tắt nhiệm vụ>
```

---

## 2. Bảng Phân Ca & Điều Phối Chi Tiết

| Khung giờ (ICT) | Kỹ sư phụ trách | File Agent | Nền tảng điều phối & ID | Phạm vi công việc | Kênh báo cáo |
|---|---|---|---|---|---|
| `<HH:MM>` hàng ngày | `<Tên Agent 1>` | [`.claude/agents/<company-slug>/<name1>.md`](<name1>.md) | Orca ID: `<id-that>` | `<Mô tả phạm vi>` | `<Kênh / Thread ID>` |
| `<HH:MM>` hàng ngày | `<Tên Agent 2>` | [`.claude/agents/<company-slug>/<name2>.md`](<name2>.md) | Orca ID: `<id-that>` | `<Mô tả phạm vi>` | `<Kênh / Thread ID>` |

> 🔒 **Luật an toàn:** Chỉ ghi ID Automation **thật** sau khi đã tạo trên engine tự động. Tuyệt đối không ghi ID phỏng đoán.

---

## 3. Quy Trình Chi Tiết Từng Ca Trực

### Ca 1 — `<HH:MM>`: <Tên Ca Trực> (<Tên Agent 1>)
- **Mục tiêu:** `<1 câu mục tiêu duy nhất>`
- **Đầu vào:** `<File nguồn, API endpoint, hoặc database table>`
- **Đầu ra:** `<File đích hoặc trạng thái cập nhật>`
- **Lệnh thực thi chính:**
  ```bash
  node scripts/<script-chinh>.js --dry-run
  node scripts/<script-chinh>.js
  ```
- **Xử lý sự cố:** Nếu lỗi ở Bước N ⇒ DỪNG ngay và gửi tin nhắn cảnh báo kèm nguyên nhân.

---

### Ca 2 — `<HH:MM>`: <Tên Ca Trực> (<Tên Agent 2>)
- **Mục tiêu:** `<1 câu mục tiêu duy nhất>`
- **Đầu vào:** `<File nguồn>`
- **Đầu ra:** `<File đích>`
- **Lệnh thực thi chính:**
  ```bash
  node scripts/<script-chinh>.js
  ```
- **Xử lý sự cố:** DỪNG và báo cáo.
