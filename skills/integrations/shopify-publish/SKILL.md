---
name: shopify-publish
description: Shopify Content Publisher — connect to a live Shopify store via Admin REST/GraphQL API to publish, update, and manage blog articles & pages. Features zero-dependency Markdown-to-HTML conversion, automated Schema FAQ sanitization (strips raw script tags to prevent code leaks), tag normalization, SEO metafields injection, dry-run safety previews, and idempotent upserts.
license: MIT
---

# Shopify Content Publisher (`shopify-publish`)

Bộ công cụ và quy trình chuẩn hóa dành cho AI Agent và người vận hành để xuất bản, cập nhật và quản trị nội dung bài viết blog & trang tĩnh trên nền tảng **Shopify** (đặc biệt tối ưu cho spoke `aau.vn`).

---

## 1. Khi nào nên dùng (When to Use)

* **Xuất bản bài viết mới:** Đẩy các bài viết Markdown từ `wiki/<tenant>/drafts/` lên Shopify Blog (`/blogs/news/*`) hoặc Shopify Pages (`/pages/*`).
* **Cập nhật bài viết hiện có:** Chỉnh sửa nội dung, tối ưu thẻ tags, SEO metafields hoặc thay thế ảnh đại diện theo cơ chế idempotent (PUT an toàn theo handle).
* **Kiểm tra trước khi đăng (Dry-Run):** Bắt buộc chạy `--dry-run` để xem trước HTML render, cấu trúc thẻ và kiểm tra tính hợp lệ trước khi đẩy lên mạng trực tiếp.
* **Đồng bộ hóa sau xuất bản:** Di chuyển file từ thư mục `drafts/` sang `posts/` và dọn dẹp kho lưu trữ.

🚫 **KHÔNG DÙNG KHI:**
- Xuất bản lên WordPress (dùng skill `wordpress-rest`).
- Xuất bản lên mạng xã hội Facebook Page/Group (dùng skill `social-content` / `scripts/fb-page.py`).

---

## 2. Thông tin xác thực (Credentials)

Công cụ tự động nạp cấu hình từ `.claude/.env`, `.agents/.env`, hoặc biến môi trường hệ thống:

| Biến môi trường | Bắt buộc | Mô tả & Định dạng |
|---|:---:|---|
| `SHOPIFY_URL` | ✅ | Tên miền cửa hàng (ví dụ: `0sd2qs-3p.myshopify.com` hoặc `aau.vn`) |
| `SHOPIFY_ACCESS_TOKEN` | ✅ | Admin API access token (định dạng `shpat_...`) |
| `SHOPIFY_SECRET_` | 🟡 | Tương thích ngược: Nếu lưu token `shpat_` tại đây, script tự động nhận diện |

> 🔒 **Cảnh báo bảo mật:** Tuyệt đối không hardcode token, không in token ra màn hình console log và không commit file chứa credentials vào git.

---

## 3. Ràng buộc an toàn cứng (Mandatory Safety Gates)

1. 🔴 **PREFLIGHT CHECK FIRST:**
   Trước khi thực hiện bất kỳ lệnh ghi nào, bắt buộc kiểm tra kết nối API qua `python3 scripts/publish-shopify.py test`.
2. 🔴 **DRY-RUN FIRST:**
   Luôn chạy `--dry-run` đối với file bài viết để kiểm tra cấu trúc thẻ HTML và payload trước khi đẩy lên máy chủ.
3. 🔴 **DRAFT BY DEFAULT:**
   Mặc định lệnh đẩy bài sẽ tạo bài ở trạng thái Bản nháp (`published: false`). Chỉ sử dụng cờ `--publish` khi chủ dự án đã ra lệnh phê duyệt rõ ràng ("duyệt" hoặc "hãy đăng").
4. 🔴 **IDEMPOTENT (LŨY THỪA):**
   Script luôn kiểm tra `handle` trên Shopify trước khi thao tác: nếu bài viết đã tồn tại thì chuyển sang lệnh cập nhật (`PUT`), nếu chưa có mới tạo mới (`POST`). Không bao giờ tạo bài trùng lặp.
5. 🔴 **LUẬT SCHEMA FAQ BẮT BUỘC (CHỐNG RÒ RỈ MÃ NGUỒN):**
   - **Tuyệt đối CẤM chèn thủ công thẻ `<script type="application/ld+json">` vào file Markdown.**
   - Theme Shopify (`snippets/aau-structured-data.liquid`) đã tự động bóc tách từ H2/H3/P để render Schema `FAQPage` vào `<head>`.
   - Script tích hợp bộ lọc Regex tự động xóa sạch mọi thẻ `<script>` nếu còn sót trong file Markdown.
6. 🔴 **QUY ƯỚC LƯU KHO:**
   - Bài viết chưa đăng **bắt buộc** lưu tại `wiki/<tenant>/drafts/`.
   - Bài viết sau khi xuất bản công khai **bắt buộc** chuyển sang `wiki/<tenant>/posts/` với `status: "PUBLISHED"`. Thư mục `drafts/` phải được dọn sạch.

---

## 4. Hướng dẫn lệnh CLI (Command Reference)

Script engine chính đặt tại `scripts/publish-shopify.py` (hoặc bản đóng gói nội bộ tại `.claude/skills/integrations/shopify-publish/scripts/publish-shopify.py`):

```bash
# 1. Kiểm tra kết nối API
python3 scripts/publish-shopify.py test

# 2. Xem danh sách Blog và lấy Blog ID
python3 scripts/publish-shopify.py list-blogs

# 3. Chạy thử nghiệm xem trước (Dry-run — An toàn tuyệt đối)
python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --dry-run

# 4. Đẩy bài lên Shopify ở chế độ BẢN NHÁP (Draft — Chưa công khai)
python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --draft

# 5. Xuất bản bài viết CÔNG KHAI (Published — Lên sóng)
python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --publish

# 6. Đẩy hàng loạt bài viết từ thư mục
python3 scripts/publish-shopify.py batch --dir wiki/aau.vn/drafts/ --draft
```

---

## 5. Quy trình làm việc chuẩn (Standard Workflow)

```
① Soạn thảo Markdown tại wiki/aau.vn/drafts/<slug>.md
   │ (Tuân thủ content-spec.md: 1.800–2.400w, TL;DR, 5 FAQ dạng H3/P, KHÔNG nhúng script)
   ▼
② Chạy kiểm tra Dry-Run
   python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/<slug>.md --dry-run
   ▼
③ Xin phê duyệt của chủ dự án (Báo cáo tóm tắt thông số bài viết)
   ▼
④ Khi có lệnh "duyệt" / "hãy đăng":
   python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/<slug>.md --publish
   ▼
⑤ Xác thực trang Live qua curl
   curl -sL https://aau.vn/blogs/news/<slug> | grep -C 3 "FAQPage"
   ▼
⑥ Chuyển file lưu kho:
   - Đổi frontmatter sang status: "PUBLISHED"
   - Move file sang wiki/aau.vn/posts/<slug>.md
   - Xóa file nháp khỏi wiki/aau.vn/drafts/
   - Cập nhật nhật ký STATE.md
```

---

## 6. Tài liệu tham chiếu đi kèm (References)

- **Quy tắc Schema & Dữ liệu cấu trúc:** `references/schema-rules.md`
- **Đặc tả YAML Frontmatter:** `references/frontmatter-spec.md`
- **Chi tiết Shopify Admin API:** `references/api-reference.md`
