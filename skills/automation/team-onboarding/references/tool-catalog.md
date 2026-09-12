# Danh Mục Công Cụ Được Cấp (Team Tool Catalog)

> **Nguyên tắc quản trị:** Mỗi dự án duy trì một danh mục công cụ (Tool Catalog) riêng để kiểm soát chặt chẽ quyền hạn thực thi của nhân viên AI.
> Danh mục dưới đây là bảng công cụ chuẩn được cấp của workspace hiện tại (dùng làm cơ sở tham chiếu mẫu khi triển khai sang các dự án/workspace khác).
> Cần tác vụ chưa có công cụ ⇒ báo người phụ trách, không tự chế script rồi chạy lên production.

**Cột Rủi ro:** 🟢 chỉ đọc · 🟡 ghi file local · 🔴 ghi lên production (cần permission rule + `--dry-run` trước).

---

## 1. Ca trực & báo cáo

| Công cụ | Cú pháp | Rủi ro |
|---|---|---|
| Báo cáo Telegram | `{ echo "..."; } \| python3 ~/projects/script/send_telegram.py --thread 2 -m -` | 🟢 |
| Job xuất bản 19:00 (trọn gói) | `node scripts/daily-seo-drafts-job.js [--dry-run] [--site=example.com] [--limit=N] [--no-notify]` | 🔴 |
| Ca trực SERP & Chiến dịch T2/T5 (trọn gói) | `node scripts/serp-campaign-cycle.js [--dry-run] [--site=tht\|vll\|mtxv] [--start=14daysAgo] [--no-campaign]` — quét SERP theo site, đối chiếu kỳ trước, sinh campaign + action checklist | 🟡 |
| Seed lịch sử baseline SERP theo site (chạy 1 lần) | `node scripts/seed-serp-site-history.js [--dry-run] [--force]` | 🟡 |
| Chạy tay một ca Orca | `python3 ~/orca-install/create_orca_automation.py --run <automation-id>` | 🔴 |
| Liệt kê automation + ID thật | `python3 ~/orca-install/create_orca_automation.py --list` | 🟢 |

---

## 2. CRM & Dữ liệu giá (AMIS · Brevo)

| Công cụ | Cú pháp | Rủi ro |
|---|---|---|
| Đồng bộ 645+ sản phẩm & bảng giá | `node scripts/sync-amis-products.js` → `wiki/crm/products/amis-products.json` | 🟡 |
| Tra cứu AMIS CRM (khách hàng, sản phẩm, đơn hàng, tồn kho) | `node scripts/amis-crm.js --help` rồi dùng đúng cờ, vd `--product-code=HH00001`, `--export=<file>.json` | 🟢/🔴 |
| Đồng bộ danh bạ AMIS → Brevo | `node scripts/sync-amis-to-brevo.js` (mọi contact → List 10 + 11, cộng List 8 **hoặc** 9 theo chức danh) | 🔴 |
| CLI Brevo (tài khoản, list, contact, campaign) | `node scripts/brevo-email.js --help` | 🟢/🔴 |
| Lập báo giá B2B | `node scripts/generate-b2b-quote.js` (đơn giá lấy 100% từ AMIS CRM) | 🟡 |

> 🔒 Giá `null`/`0` ⇒ dùng câu mẫu Hotline `0900.000.000`, **không gán số giả định**.
> 🔒 Không echo full email/SĐT khách hàng ra log. Không resubscribe email `emailBlacklisted`.

---

## 3. Đọc dữ liệu website (chỉ đọc — an toàn)

| Công cụ | Cú pháp | Dùng khi |
|---|---|---|
| `read-post-content.js` | `node scripts/read-post-content.js <id...> [--out=file.json]` | Duyệt nội dung + meta RankMath trước khi publish |
| `read-raw-content.js` | `node scripts/read-raw-content.js <post_id> [--out=file.html]` | Soi HTML thô Gutenberg; **verify sau khi ghi** |
| `check-slug-status.js` | `node scripts/check-slug-status.js [slug...]` | URL không mở được — phân biệt draft / đổi slug / chưa từng có |
| `check-post-revisions.js` | `node scripts/check-post-revisions.js <post_id>` | Nội dung bị ghi đè — xem có khôi phục được không |
| `list-fake-reviews.js` | `node scripts/list-fake-reviews.js [--out=file.json]` | Rà soát review giả |
| `fetch-banned-words-context.js` | `node scripts/fetch-banned-words-context.js` | **Bắt buộc chạy trước** khi định thay cụm từ cấm hàng loạt |

---

## 4. Đồng bộ kho nội dung về local

| Công cụ | Cú pháp | Rủi ro |
|---|---|---|
| Sản phẩm mới | `node scripts/sync-products.js [--dry-run]` | 🟡 |
| Bài viết mới (example.com) | `node scripts/sync-posts.js [--dry-run] [--limit=N]` | 🟡 |
| Bài viết example.net | `node scripts/download-<site-slug>-posts.js [--force] [--limit=N]` | 🟡 |
| Bài viết example.org | `node scripts/download-<site-slug>-posts.js [--force] [--limit=N]` | 🟡 |
| Media Lake (1.401+ assets) | `node scripts/sync-media-library.js [--download] [--limit=N]` | 🟡 |

> ⚠️ Các script này **chỉ thêm mới**, không cập nhật item đã tồn tại. **Luôn `--dry-run` trước.**

---

## 5. Ghi lên production (🔴 — cần permission rule + dry-run)

| Công cụ | Cú pháp | Ghi chú an toàn |
|---|---|---|
| Xuất bản bài/trang/sản phẩm | `node scripts/publish-post.js <file.md> --type=post\|page\|product [--site=<slug>] --dry-run` rồi `--publish` | Tự gán canonical, purge LiteSpeed, bắn Instant Indexing |
| Sửa 1 meta RankMath | `node scripts/update-product-meta.js <id> <meta_key> <value> [--type=page]` | Chỉ 3 key `rank_math_*` |
| Đổi trạng thái / chèn HTML / thêm tag | `node scripts/update-post-state.js <action> <post_id> ... [--dry-run]` | Chỉ `post_type='post'`; có verify trước/sau |
| Backfill canonical toàn site | `node scripts/backfill-post-canonical.js [--dry-run] [--limit=N]` | Chỉ set khi meta rỗng |
| Thay cụm từ cấm hàng loạt | `node scripts/bulk-fix-banned-phrases.js [--dry-run]` | **Chỉ 3/8 cụm**; "tốt nhất"/"hàng đầu"/"số 1" cấm tự động |
| Tạo redirect 301 | `node scripts/add-redirection.js <slug-cũ> <url-đích> [--dry-run]` | Sau đó **bắt buộc** `purge-cache.js --all` |
| Xoá cache | `node scripts/purge-cache.js <post_id>` hoặc `--all` | Dùng sau mọi lần ghi không qua WP Admin |
| Chuyển review vào thùng rác | `node scripts/trash-reviews.js <file.json> [--dry-run]` | Trash, **không** xoá vĩnh viễn |
| Gửi yêu cầu lập chỉ mục | `node scripts/submit-google-indexing.js <url...>` | Không truyền URL ⇒ chạy danh sách GSC mặc định |

**Permission rule** cần khai trong `.claude/settings.local.json` (gitignored):
```
Bash(node scripts/<tên-script>.js:*)
```

---

## 6. Nghiên cứu & tri thức

| Công cụ | Cú pháp |
|---|---|
| Nghiên cứu kỹ thuật quốc tế (Exa.ai) | `node scripts/exa-deep-research.js "<truy vấn>" [--save=wiki/knowledge/<file>.md] [--num=5]` |
| Kho tri thức dùng chung | Đọc `wiki/knowledge/` — 22 chuyên đề hóa lý, ASTM, AWWA, QCVN |

---

## 7. Cơ chế nền — không tự viết lại

| Helper | Vai trò |
|---|---|
| `scripts/lib/run-remote-php.js` | Cơ chế DUY NHẤT để chạy PHP trên server: upload temp-PHP qua FTP → gọi HTTPS → xoá + verify đã xoá. Site chỉ có FTP (port 21), **không có SSH/DB port public**. |
| `scripts/lib/ftp-credentials.js` | Đọc credential từ `.agents/.env` lúc chạy. 🚫 Không hard-code secret. |
| `scripts/lib/site-config.js` | `--site=` nhận slug của từng site trong hệ sinh thái (chấp cả dạng tên miền đầy đủ). |
| `scripts/lib/html-utils.js` | Convert HTML → Markdown **giữ nguyên link**, phân loại internal/external. |

> ⚠️ **Bẫy đã gặp thật:** POST chứa tiếng Việt qua `curl` phải tự `URLSearchParams(...).toString()` để encode ASCII trước —
> nếu không, ký tự bị hỏng (`ạ` → `?`). Và sau mỗi lần ghi DB, **phải purge cache** — LiteSpeed có thể vẫn trả bản cũ dù DB đã đúng.

---

## 8. Biến môi trường (`.agents/.env` — đã gitignore)

Nhóm khoá hiện có (chỉ tên, không bao giờ in giá trị):

- **FTP / WordPress theo site:** `SITE_<SLUG>_*` — một nhóm cho mỗi site (host, user, pass, webdir, WP app password, DB prefix, SERP project id)
- **CRM & Email:** `AMIS_APP_ID`, `AMIS_API_KEY`, `BREVO_API_KEY`
- **Khác:** `EXA_API_KEY`, `SERPROBOT_*`, `ZALO_OA_ID`, `ZALO_OA_SERCRET`, `VIENEU_TTS_TOKEN`

🚫 Không echo, không log, không commit giá trị các khoá này — kể cả một phần.
