# Examples — Các Ví Dụ Thực Chiến (F&B Marketing Việt Nam)

> Các tình huống thực tế xuyên suốt: từ tiếp nhận nhu cầu, kiểm tra cổng Gate, lập brief 4 câu hỏi, xây dựng prompt tự nhiên, đến định tuyến công cụ.

---

## ☕ Tình Huống 1: Bài Cẩm Nang "Tối Ưu Tốc Độ Phục Vụ Ca Cao Điểm" (FOH)

- **Nhu cầu:** "Tôi cần một ảnh hero cho bài viết hướng dẫn nhân viên thu ngân và phục vụ tăng tốc độ xử lý order giờ cao điểm trên `aau.vn`."
- **Chạy cổng Gate:** Chưa có ảnh chụp thực tế chất lượng cao về quầy POS hiện đại đạt chuẩn thương hiệu. Chọn phương án sinh ảnh bằng AI.
- **Lập brief 4 câu hỏi:**
  1. *Mục đích:* Stop-scroll Hero (16:9) cho bài viết blog cẩm nang.
  2. *Thông điệp duy nhất:* "Sự nhanh nhẹn, chuyên nghiệp và nụ cười hiếu khách của thu ngân tại quầy thanh toán hiện đại."
  3. *Tỉ lệ:* `16:9` (1536×1024).
  4. *Bản sắc:* Tươi sáng, gỗ sồi sáng, đá terrazzo trắng, đồng phục gọn gàng, đậm chất quán cafe nhiệt đới hiện đại tại TP.HCM.
- **Mô tả Prompt (Anh - Việt kết hợp):**
  ```text
  Wide-angle environmental shot (24mm lens), eye-level perspective. A modern Vietnamese specialty coffee shop in Saigon during a bright, sunny morning rush. Behind a clean light oak wood and white terrazzo counter, a cheerful Vietnamese female cashier (early 20s, wearing neat dark navy polo shirt uniform and canvas apron, hair neatly tied back) is smiling warmly while operating a modern touch-screen POS terminal. On the counter sits a receipt printer, a neatly displayed wooden stand with a Vietnamese QR code payment card, and clear glass jars of roasted coffee beans labeled "CÀ PHÊ VIỆT". In the background, an airy, bright dining space with large floor-to-ceiling glass windows, indoor tropical monstera plants, and comfortable wooden seating. Bright high-key morning daylight pouring in, natural warm atmosphere, deep depth of field, ultra-clean operational environment. Generous negative space on the left third for headline text. No western corporate suits, no dark dim lighting. 16:9.
  ```
- **Định tuyến:** [[gpt-image-vi]] → `scripts/gen-image.py single --preset hero`.

---

## 🍳 Tình Huống 2: Sơ Đồ Quy Trình "Tiếp Nhận & Lưu Kho Nguyên Liệu FIFO" (BOH)

- **Nhu cầu:** "Cần một sơ đồ 4 bước về quy trình nhập kho lạnh cho bếp nhà hàng để minh họa trong cẩm nang kiểm soát hao hụt."
- **Chạy cổng Gate:** Là sơ đồ khái niệm (Class B′), không chứa số liệu %, có chữ tiếng Việt theo thứ tự các bước. Phù hợp sinh bằng AI.
- **Lập brief 4 câu hỏi:**
  1. *Mục đích:* Sơ đồ quy trình ngang (Horizontal Process Flow) minh họa trong thân bài.
  2. *Thông điệp duy nhất:* "4 bước tiếp nhận hàng hóa chuẩn an toàn thực phẩm từ giao nhận đến nhập kho FIFO."
  3. *Tỉ lệ:* `16:9` (preset `flow`).
  4. *Bản sắc:* Đồ họa phẳng (flat vector), bảng màu chuẩn AAU (terracotta, xám slate, trắng), chữ tiếng Việt chuẩn dấu 100%.
- **Mô tả Prompt:**
  ```text
  Horizontal process flow diagram, clean flat vector infographic style, 4 distinct sequential steps arranged horizontally from left to right, connected by clear directional chevron arrows. 
  The 4 rectangular cards with rounded corners have soft shadows and clean icons:
  Step 1 icon shows delivery truck: Box label reads exactly "1. GIAO NHẬN".
  Step 2 icon shows clipboard with checklist: Box label reads exactly "2. KIỂM SOÁT CL".
  Step 3 icon shows digital weighing scale: Box label reads exactly "3. CÂN ĐỊNH LƯỢNG".
  Step 4 icon shows cold storage warehouse: Box label reads exactly "4. NHẬP KHO FIFO".
  Color palette: Warm terracotta accent, slate gray (#334155), pure white background, crisp modern Vietnamese sans-serif typography with 100% accurate diacritics. No numbers inside illustrations, no empty boxes, no misspelling. Horizontal layout. 16:9.
  ```
- **Định tuyến:** [[gpt-image-vi]] → `scripts/gen-image.py single --preset flow`.

---

## 🚫 Tình Huống 3: Yêu Cầu Bị Chặn Ở Cổng Gate (Do-Not-Generate Gate)

- **Nhu cầu:** "Hãy tạo cho tôi ảnh chụp chi nhánh quán cafe Phê La ở 125 Hàng Bông với các nhân viên đang pha chế."
- **Phản hồi chuẩn từ skill:**
  > 🚫 **TỪ CHỐI TẠO ẢNH BẰNG AI.**
  > Lý do: Đây là một cơ sở kinh doanh có thật và thương hiệu cụ thể. AI không thể và không được phép ngụy tạo địa điểm hay nhân sự có thật vì sẽ gây hiểu lầm nghiêm trọng cho khách hàng và vi phạm bản quyền thương hiệu khi chưa có văn bản thỏa thuận.
  > **Giải pháp đề xuất:** Cử nhân sự chụp ảnh thực tế tại điểm bán hoặc sử dụng bộ ảnh tư liệu chính thức được chuỗi cung cấp.

---

## 📊 Tình Huống 4: Yêu Cầu Biểu Đồ Số Liệu (Class C Gate)

- **Nhu cầu:** "Vẽ cho tôi biểu đồ hình tròn thể hiện cơ cấu Prime Cost: Food Cost 32%, Nhân sự 23%, Lợi nhuận gộp 45%."
- **Phản hồi chuẩn từ skill:**
  > 🚫 **KHÔNG DÙNG AI ĐỂ VẼ BIỂU ĐỒ SỐ LIỆU.**
  > Theo Luật 1 của hệ thống, các mô hình AI vẽ hình học và tỉ lệ chỉ ở mức xấp xỉ (hình tròn sẽ không chia đúng 32% hay 23%). Độc giả nhìn vào hình ảnh sẽ thấy sự sai lệch giữa hình vẽ và con số ghi chú.
  > **Giải pháp đề xuất:** Dựng biểu đồ SVG xác thực bằng code HTML/SVG hoặc sử dụng công cụ biểu đồ chuyên dụng.
