# Editorial Review & Publishing Checklist

**Domain:** Marketing Kit (`/mk:` namespace) & Content Operations (`aau.vn`, `careerfnb.vn`).
**Mã tài liệu:** `WORKFLOW-EDITORIAL-REVIEW`
**Phạm vi áp dụng:** Mọi bài viết chuẩn bị xuất bản (Pillar, Hub, Cluster, Guide, Case study).

Tài liệu này tổng hợp toàn bộ quy chuẩn biên tập cứng, luật kiểm chứng số liệu, khung kiểm toán P&L kênh bán và quy trình xuất bản CMS an toàn.

---

## 1. Khung 16 tiêu chí nghiệm thu bài viết (Quality Gates)

Mọi bài viết trước khi đưa lên CMS hoặc nghiệm thu phải vượt qua 16 tiêu chí bắt buộc:

| # | Tiêu chí | Ngưỡng đạt chuẩn | Cách kiểm tra |
|:-:|---|---|---|
| 1 | **Keyword chính** | Đã đăng ký trong sổ keyword, không xung đột/cannibalize với bài khác | Tra cứu `content-architecture.md` §7 |
| 2 | **Số chữ thân bài** | Đúng loại bài: Pillar (2.200–3.000 từ), Hướng dẫn (1.800–2.400), Định nghĩa (1.400–1.800), Case (1.200–1.600) | Đếm thân bài (không tính frontmatter, TOC, CTA) |
| 3 | **Khối Tóm tắt nhanh (TL;DR)** | 134–167 từ, tự chứa, câu đầu trả lời thẳng keyword chính, không dạo đầu | Đo từ, đọc độc lập phải hiểu trọn vẹn |
| 4 | **Dòng meta đầu bài** | Thời gian đọc + Tên tác giả và chức danh chuyên môn | `⏱️ N phút đọc · Tiến Tiên — AAU Academy` |
| 5 | **Cấu trúc Heading** | Đúng 1 H1 (tiêu đề bài), 8–12 H2, không nhảy cấp (H2 → H4) | Không gắn năm vô cớ vào H2; H2 đặt dạng tra cứu |
| 6 | **ID / Anchor Heading** | Mọi H2 có ID slug rõ ràng (`#s1`, `#s2`...) để mục lục click nhảy chuẩn xác | Kiểm tra thẻ `<h2 id="...">` trên HTML render |
| 7 | **Bảng dữ liệu** | Ít nhất 1 bảng so sánh / định mức / ma trận | Trực quan hoá dữ liệu, không viết văn xuôi lê thê |
| 8 | **Case study thực tế** | Ít nhất 1 case/ví dụ thực tế (ẩn danh thương hiệu nếu chưa có thỏa thuận) | Minh họa bài học vận hành qua tình huống có thật |
| 9 | **Khối 5 sai lầm** | Bắt buộc có khối "5 sai lầm phổ biến" sát thực tế ngành | Giọng điệu cảnh báo sai lầm vận hành thực chiến |
| 10 | **Khối FAQ** | 4–6 câu hỏi; câu hỏi sát từ khóa tìm kiếm; câu trả lời 40–80 từ/câu, tự chứa | Không mồi câu hỏi giả tạo, không lặp nguyên văn thân bài |
| 11 | **Hình ảnh & Alt Text** | Ảnh WebP nén tối ưu (30–60KB), 100% có alt text mô tả đúng ngữ cảnh | Không dùng GPT sinh biểu đồ mang số; không nhồi keyword |
| 12 | **Dẫn nguồn số liệu** | 100% con số có nguồn gốc rõ ràng theo Luật số liệu (§2) | Cấm bịa số; nếu là chuẩn nội bộ phải ghi rõ |
| 13 | **Liên kết nội bộ** | ≥ 3 liên kết nội bộ tự nhiên, tất cả link phải trả về HTTP 200 | Không trỏ link chết, bài cluster phải link lên Pillar mẹ |
| 14 | **Tiêu đề & Meta Description**| Title ≤ 60 ký tự; Meta description 150–160 ký tự chứa keyword + lợi ích | Không đóng cứng năm vô cớ |
| 15 | **Kêu gọi hành động (CTA)** | Đúng 1 CTA chính duy nhất ở cuối bài dẫn tới sản phẩm/khoá học | Không đặt nhiều CTA gây phân tán chuyển đổi |
| 16 | **Schema Structured Data** | `Article` + `FAQPage` + `BreadcrumbList` hợp lệ 100% JSON-LD | Test cấu trúc schema qua validator / JSON parse |

---

## 2. Luật số liệu & Quy trình tra cứu 4 bước (Data Integrity)

Không đưa bất kỳ con số nào vào bài viết khi chưa hoàn tất quy trình xác minh.

### 2.1 Bốn bước tra cứu bắt buộc
1. **Bước 1 — Tra kho tri thức nội bộ:** Tra cứu `wiki/knowledge/INDEX.md` xem đã có hồ sơ chủ đề chưa.
2. **Bước 2 — Đọc hồ sơ đã kiểm chứng:** Nếu đã có hồ sơ `status: VERIFIED`, dùng nguồn đã được kiểm chứng.
3. **Bước 3 — Nghiên cứu nguồn mới (nếu thiếu):** Chạy `python3 scripts/exa-research.py research "<truy vấn>" --topic "<chủ đề>" --save wiki/knowledge/<slug>.md --num 8`. Hồ sơ máy sinh ban đầu mang `status: RAW`.
4. **Bước 4 — Con người kiểm chứng (Human Verification):** Biên tập viên mở từng link đối chiếu, phân loại nguồn và điền bảng "Số liệu đã kiểm chứng" trước khi viết.

### 2.2 Xếp hạng độ tin cậy của nguồn
- **Hạng 1 — Nguồn Gốc (Mạnh nhất):** Văn bản pháp luật, cổng thông tin nhà nước, tổng cục thống kê.
- **Hạng 2 — Nguồn Ngành:** Báo cáo hiệp hội F&B, báo ngành có uy tín.
- **Hạng 3 — Nhà cung cấp:** Hãng POS, phần mềm quản lý tự công bố định mức (⚠️ thường phục vụ bán hàng, phải truy về báo cáo gốc phía sau).
- **Hạng 4 — Blog tổng hợp (Cấm dùng làm nguồn):** Bài viết SEO xào nấu lại thông tin.

### 2.3 Ba đường xử lý khi gặp chủ đề thiếu nguồn
1. **Truy ngược:** Tìm tài liệu gốc mà nguồn thứ cấp trích dẫn.
2. **Chuẩn nội bộ AAU:** Dẫn dữ liệu sơ cấp thực tế tư vấn và ghi rõ: *"định mức nội bộ AAU, chưa kiểm chứng độc lập"*.
3. **Chờ dữ liệu:** Ghi `[CHỜ DATA: nguồn]` và viết bài **không dùng** con số giả định đó.

---

## 3. Khung kiểm toán P&L kênh bán & Delivery Economics

Áp dụng cho các bài viết và chiến lược liên quan đến Kênh bán, Delivery, App ẩm thực:

### 3.1 Bóc tách 5 chi phí ẩn của đơn hàng Delivery
Một đơn giao hàng app không chỉ tốn phí hoa hồng chiết khấu, mà phải hạch toán đủ 5 khoản:
1. **Chiết khấu nền tảng (Commission):** Phí theo hợp đồng ký kết (Grab, ShopeeFood...).
2. **Bao bì chuyên dụng (Packaging):** Hộp, muỗng, túi nilong giữ nhiệt, màng bọc thực phẩm.
3. **Phụ phí nhân công ca cao điểm (Labor overhead):** Thời gian nhân viên đóng gói, điều phối tài xế giờ cao điểm.
4. **Tỷ lệ huỷ / hoàn món (Spoilage/cancellation):** Rủi ro tài xế không nhận, khách boom hàng, món bị đổ vỡ.
5. **Chi phí khuyến mại & đấu thầu hiển thị (Promo/Ad burn):** Chi phí chạy mã giảm giá, voucher tài trợ để giữ thứ hạng top tìm kiếm.

### 3.2 Công thức tính Lợi nhuận đóng góp kênh (Contribution Margin)
```
Lợi nhuận đóng góp kênh = Doanh thu kênh − (Giá vốn món/COGS + Chiết khấu app + Bao bì chuyên dụng + Chi phí khuyến mại kênh + Phụ phí nhân công ca)
```

### 3.3 Ba quyết định chiến lược dựa trên P&L
- **Giữ và đẩy mạnh:** Khi lợi nhuận đóng góp dương và năng lực bếp (BOH) vẫn đủ sức đáp ứng, đặc biệt vào các khung giờ thấp điểm tại quán.
- **Thiết kế menu riêng cho delivery (Virtual Menu/Menu Engineering):** Chỉ đưa lên app các món có biên lợi nhuận cao, tốc độ ra món nhanh (<5-7 phút) và giữ chất lượng sau 20–30 phút vận chuyển.
- **Giới hạn ca hoặc rút lui:** Tắt nhận đơn delivery vào giờ cao điểm nếu đơn giao hàng làm nghẽn bếp, khiến khách ăn tại chỗ (nhóm mang lại RevPASH cao hơn) phải chờ lâu và bỏ đi.

---

## 4. Quy trình xuất bản an toàn lên CMS (Shopify / WordPress / Botble)

Để tránh hỏng giao diện, link chết hoặc sai lệch dữ liệu trên môi trường live:

1. **Kiểm tra kết nối:** Chạy `python3 scripts/publish-shopify.py test` xác nhận API token và store ID.
2. **Bắt buộc chạy `--dry-run` trước:**
   ```bash
   python3 scripts/publish-shopify.py post <file>.md --dry-run
   ```
   Kiểm tra: HTML đã strip đúng thẻ `{#anchor}`, thẻ heading có `id="..."`, không rò rỉ cú pháp thô, tags phân loại chuẩn (`tags.first` cho bài liên quan).
3. **Xác nhận quyền & phê duyệt:** Chỉ khi chủ dự án yêu cầu hoặc duyệt nội dung mới chạy cờ `--publish`.
4. **Kiểm thử sau xuất bản (Post-publish Verification):**
   - Mở URL trực tiếp bằng cache buster (`?cb=timestamp`).
   - Kiểm tra mã HTTP 200 cho toàn bộ internal links trong bài.
   - Kiểm tra hiển thị mục lục click nhảy đúng từng anchor.
   - Kiểm tra 3-4 block JSON-LD schema (Article, FAQPage, Breadcrumbs) bằng parser.
   - Sao lưu bản thảo đã publish vào kho lưu trữ `wiki/<tenant>/posts/` (bản sao 1:1 của DB).
   - Ghi nhận nhật ký cập nhật vào `STATE.md` của campaign.
