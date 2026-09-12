# Checklist Nghiệm Thu Agent (8/8)

Agent mới **chỉ được xếp lịch chạy tự động khi đạt đủ 8/8**. Thiếu bất kỳ mục nào ⇒ trả về sửa, không xếp ca.

---

## Bảng chấm

| # | Tiêu chí | Cách kiểm chứng (chạy thật, không đoán) | Đạt |
|---|---|---|---|
| 1 | **Song song 2 thư mục, nội dung identical** | `diff .claude/agents/<team>/<name>.md .agents/agents/<team>/<name>.md && echo IDENTICAL` | ☐ |
| 2 | **Frontmatter hợp lệ** — có `name`, `description` (tên riêng + khung giờ + phạm vi), `skills:` liệt kê đủ | `head -12 .claude/agents/<team>/<name>.md` | ☐ |
| 3 | **Mọi skill khai báo đều tồn tại và khớp tên** | `grep -m1 "^name:" .claude/skills/*/<skill>/SKILL.md` cho từng skill | ☐ |
| 4 | **Bảng ủy quyền, không chép logic** — có mục "Các Agent & Skill tích hợp", không sao chép nội dung skill khác | Đọc thủ công + đối chiếu skill gốc | ☐ |
| 5 | **Quy trình 3–5 bước, bước 1 là `git pull`** | `grep -n "^### Bước" .claude/agents/<team>/<name>.md` | ☐ |
| 6 | **Checklist có tổng điểm rõ ràng + luật báo số thật** (không hardcode điểm tuyệt đối trong mẫu báo cáo) | `grep -n "Checklist:" .claude/agents/<team>/<name>.md` — mẫu phải là `<X>/<Tổng>` | ☐ |
| 7 | **Báo cáo & Ghi nhật ký đúng chuẩn** — có bước ghi nhật ký ngày cục bộ `logs/agents/YYYY-MM-DD.md` (qua `agent-logger.js`), tên agent đứng đầu, đúng kênh/thread, ống dẫn `echo`, không `\n` trong `-m`; **và** có mục NGOẠI LỆ chạy không người trông | `grep -n "agent-logger\|thread\|NGƯỜI TRÔNG" .claude/agents/<team>/<name>.md` | ☐ |
| 8 | **Mọi đường dẫn tham chiếu tồn tại thật** | Vòng lặp kiểm tra bên dưới, kết quả **0 dòng MISS** | ☐ |

---

## Lệnh kiểm tra mục 8

Trích mọi path được tham chiếu trong file agent rồi kiểm tra tồn tại:

```bash
cd <workspace-root>
grep -oE '(scripts|wiki|plans|templates|\.agents|\.claude)/[A-Za-z0-9_./-]+' \
  .claude/agents/<team>/<name>.md | sort -u | while read -r f; do
    [ -e "$f" ] && echo "OK   $f" || echo "MISS $f"
  done | grep MISS
```

Không in ra gì ⇒ đạt.

---

## Chạy thử có giám sát (bắt buộc trước khi bật lịch)

```bash
# 1. Dry-run toàn bộ ca trực — không được ghi gì lên production
node scripts/<script-chính>.js --dry-run

# 2. Xác nhận báo cáo vào đúng kênh/topic
{ echo "[<Tên> — <Chức danh>] ✅ Test nghiệm thu — $(date +%Y-%m-%d)"
  echo "Kết quả: xong"; } \
| <lệnh-gửi-tin-nhắn-dry-run>
```

Quan sát 3 điểm:
1. Không có credential/PII/secret nào bị in ra stdout.
2. Không có file nào ngoài repo bị chạm vào (`git status` sạch ngoài phạm vi dự kiến).
3. Checklist báo **số thật**, không phải điểm tuyệt đối mặc định.

---

## Sau khi đạt 8/8

1. Đăng ký dòng mới vào `SCHEDULE.md` của dự án — bảng phân ca và mục quy trình.
2. Tạo Automation (Orca / Cron / CI), chạy lấy **ID thật**, ghi ID đó vào `SCHEDULE.md` (không ghi ID phỏng đoán).
3. Soạn file prompt tự động dạng lớp gọi mỏng, ghi rõ *"nếu prompt mâu thuẫn file agent thì FILE AGENT THẮNG"*.
4. `git add` + `git commit` với mô tả rõ ràng. Push do người phụ trách quyết định.

---

## Tái nghiệm thu định kỳ

Chạy lại checklist này khi:
- Script mà agent gọi **đổi cờ CLI hoặc đổi hành vi**.
- Agent báo cáo sai thực tế (đường dẫn file sai, điểm checklist không khớp).
- Sau bất kỳ lần agent vi phạm ranh giới cứng (tự push khi chưa cho phép, sửa file ngoài repo).
