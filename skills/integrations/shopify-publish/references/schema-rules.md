# Quy chuẩn Schema & Dữ liệu Cấu trúc (Shopify Schema Rules)

Tài liệu này quy định kiến trúc và các quy tắc bắt buộc về Schema Markup (`Article`, `FAQPage`, `BreadcrumbList`) trên website Shopify, loại bỏ triệt để nguy cơ rò rỉ mã JSON-LD ra giao diện bài viết.

---

## 1. 🔴 QUY TẮC CỐT LÕI: CẤM NHÚNG `<script>` VÀO MARKDOWN

* 🚫 **TUYỆT ĐỐI CẤM** viết thủ công thẻ `<script type="application/ld+json">...</script>` vào file Markdown nội dung.
* **Nguyên nhân gốc rễ:** 
  Khi công cụ biên dịch Markdown sang HTML (`markdown_to_html`), các khối mã nằm ngoài cú pháp Markdown chuẩn sẽ bị bộ phân tích dòng (paragraph parser) bọc vào thẻ `<p style="...">`. Điều này dẫn đến việc mã code JSON-LD thô bị rò rỉ và hiển thị trực tiếp trước mắt người đọc ở chân trang bài viết.
* **Cơ chế hoạt động chuẩn:**
  Hệ thống Theme Shopify (`snippets/aau-structured-data.liquid`) đã được tích hợp mã Liquid thông minh để **tự động quét nội dung HTML của bài viết**, nhận diện khối hỏi đáp FAQ và trích xuất thành Schema `FAQPage` chuẩn vào thẻ `<head>` của trang web.

---

## 2. ĐỊNH DẠNG KHỐI FAQ CHUẨN TRONG MARKDOWN

Để Theme Liquid có thể nhận diện và tự động sinh Schema `FAQPage`, người viết hoặc AI Agent **bắt buộc** soạn thảo khối FAQ theo cấu trúc ngữ nghĩa sau:

```markdown
## <N>. Câu hỏi thường gặp... (FAQ) {#s<N>}

### <Câu hỏi thứ nhất>?
<Đoạn văn bản câu trả lời hoàn chỉnh, súc tích từ 40 đến 80 từ>.

### <Câu hỏi thứ hai>?
<Đoạn văn bản câu trả lời hoàn chỉnh, súc tích từ 40 đến 80 từ>.

### <Câu hỏi thứ ba>?
<Đoạn văn bản câu trả lời hoàn chỉnh, súc tích từ 40 đến 80 từ>.
```

### Các yêu cầu bắt buộc:
1. **Tiêu đề khối H2:** Phải chứa từ khóa `"FAQ"` hoặc cụm từ `"Câu hỏi"` (ví dụ: `## 9. Câu hỏi thường gặp khi chọn mặt bằng kinh doanh F&B (FAQ) {#s9}`).
2. **Tiêu đề câu hỏi H3:** Mỗi câu hỏi là một thẻ `### ...?` kết thúc bằng dấu chấm hỏi (`?`).
3. **Đoạn trả lời (Paragraph):** Nằm ngay dưới tiêu đề H3, độ dài chuẩn từ **40 đến 80 từ**, mang tính tự chứa (self-contained) và trả lời thẳng thắn vào trọng tâm câu hỏi.

---

## 3. CƠ CHẾ BẢO VỆ ĐA TẦNG (TRIPLE-GATE SAFEGUARDS)

Hệ thống triển khai 3 lớp bảo vệ tự động:

### Lớp 1 — Sanitizer tại `publish-shopify.py`
Trước khi chuyển đổi Markdown sang HTML, script tự động loại bỏ triệt để mọi thẻ `<script>` nếu người viết vô tình để sót:
```python
md_text = re.sub(r"<script\b[^>]*>.*?</script>", "", md_text, flags=re.S | re.I)
```

### Lớp 2 — Bộ phân giải Liquid tại `snippets/aau-structured-data.liquid`
Khi quét các tiêu đề `<h3>` và đoạn `<p>`, Liquid tự động bọc lại thẻ trước khi gọi `strip_html` để loại bỏ sạch mọi thuộc tính nội tuyến (`id="..."`, `style="..."`, `class="..."`), đảm bảo dữ liệu JSON-LD sinh ra là chuỗi văn bản sạch 100%:
```liquid
{%- assign aau_raw_q = aau_c | split: '</h3>' | first -%}
{%- assign aau_full_q = '<h3' | append: aau_raw_q | append: '</h3>' -%}
{%- assign aau_q = aau_full_q | strip_html | replace: '&amp;', '&' | replace: '&nbsp;', ' ' | strip -%}
```

### Lớp 3 — Kiểm tra sau xuất bản (Post-publish Verification)
Sau khi đẩy bài viết lên website, luôn thực hiện lệnh kiểm tra qua curl:
```bash
curl -sL https://<domain>/blogs/news/<slug> | grep -C 3 "FAQPage"
```
Đảm bảo:
- Thuộc tính `"name"` của Question không chứa mã HTML (`id=`, `style=`).
- Thuộc tính `"text"` của Answer không chứa mã HTML.
- Thân bài viết trước thẻ CTA không xuất hiện mã `<script>` hay dấu ngoặc JSON `{`.
