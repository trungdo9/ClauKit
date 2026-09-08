# Prompt Anatomy — Giải Phẫu Cấu Trúc Câu Lệnh (F&B Việt Nam)

> Nguyên tắc mô tả hình ảnh tự nhiên, chuyển dịch tư duy từ việc "niệm chú từ khóa rác" sang "đạo diễn một khung hình vận hành chuyên nghiệp".

---

## 🚫 Mô Tả Cụ Thể, Không Niệm Chú (Describe, Do Not Incant)

Các mô hình AI tạo sinh hiện đại (`gpt-image-2`, Nano Banana, Flux) lý luận dựa trên **ngôn ngữ tự nhiên và ngữ cảnh chi tiết**.
Hãy loại bỏ hoàn toàn các từ khóa rác của năm 2023 (*"4k, masterpiece, trending on artstation, ultra-detailed, photorealistic"*). Những từ này không giúp hình ảnh chuẩn xác hơn mà chỉ làm loãng ngữ cảnh.

> **Quy tắc vàng:** Một prompt yếu chỉ gọi tên sự vật chung chung. Một prompt mạnh đóng vai trò đạo diễn toàn bộ khung hình, ánh sáng, góc máy và tác phong nhân vật.

---

## 🧩 8 Thành Phần Của Một Prompt Chuẩn (The 8 Components)

1. **Subject (Chủ thể):**
   - Nhân sự: Người Việt Nam/Đông Nam Á đương đại, độ tuổi, vai trò chuyên môn (Barista, Phụ bếp, Cửa hàng trưởng, Đầu bếp trưởng). Trang phục bảo hộ chuẩn F&B (áo bếp ngắn tay thoáng khí, tạp dề canvas, mũ trùm tóc, khẩu trang vệ sinh).
   - Thiết bị & Đạo cụ: Bàn inox 304, cân điện tử tiểu ly, máy pha cà phê espresso, thớt phân màu HACCP, khay GN inox, mã QR thanh toán.
2. **Composition & Framing (Góc máy & Bố cục):**
   - Góc rộng môi trường `Wide-angle lens (24mm or 28mm equivalent)`, ngang tầm mắt (`eye-level`), bố cục 1/3, thấy rõ chiều sâu không gian vận hành.
3. **Lighting (Ánh sáng):**
   - Ánh sáng ban ngày tự nhiên nhiệt đới rực rỡ (`Bright high-key natural daylight`), ánh nắng sớm qua khung cửa kính lớn, phản chiếu trên mặt kim loại inox sạch bóng. Không dùng ánh sáng quán bar tối tăm u ám.
4. **Colour & Palette (Màu sắc):**
   - Màu gỗ sồi sáng ấm áp, bề mặt đá terrazzo trắng, inox xám bạc công nghiệp, điểm xuyết màu xanh tươi mát của thảo mộc/rau củ nhiệt đới.
5. **Style & Medium (Phong cách):**
   - Nhiếp ảnh phóng sự tài liệu chân thực (`editorial realistic photography`) hoặc đồ họa vector phẳng tối giản (`clean flat vector infographic`).
6. **Mood & Atmosphere (Cảm xúc & Không khí):**
   - Chuyên nghiệp, sạch sẽ, chuẩn mực 5S, kỷ luật cao, thân thiện, tràn đầy năng lượng làm việc tích cực.
7. **Detail & Focus (Tiêu cự & Chi tiết):**
   - Chiều sâu trường ảnh sâu (`deep depth of field`), nhìn rõ các khu vực làm việc phía sau, sắc nét từng chi tiết dụng cụ và trang phục.
8. **Constraints & Negative Space (Ràng buộc & Không gian âm):**
   - Thiết kế khoảng trống chủ đích ở 1/3 khung hình cho lớp phủ chữ tiếng Việt.
   - Ràng buộc phủ định: Không vẽ người phương Tây trong bối cảnh phục vụ Việt Nam; không có lò sưởi mùa đông; không có tuyết; không sai chính tả tiếng Việt; không vẽ biểu đồ số liệu bịa đặt.

---

## 🔲 Thiết Kế Không Gian Âm Cho Chữ Phủ (Design For Overlay)

Nếu hình ảnh được dùng làm ảnh bìa bài viết, banner quảng cáo hoặc ảnh thumbnail Facebook mà bạn dự định chèn chữ/tiêu đề sau này:

- Phải chỉ định rõ trong prompt vị trí chừa trống: *"Deliberate negative space on the left third with minimal detail, even lighting and high contrast for Vietnamese text overlay. No text in that area."*
- Giúp bạn dễ dàng chèn chữ tiếng Việt bằng Canva hoặc Photoshop mà không bị rối mắt trên màn hình điện thoại di động.

---

## 🔄 So Sánh Prompt Yếu vs Prompt Mạnh (Weak → Strong)

### Ví dụ 1: Quầy Barista & Không Gian Cafe
- ❌ **Prompt Yếu:**
  `"Cool coffee shop in Vietnam, barista making coffee, 4k, masterpiece, ultra detailed, photorealistic"`
- ✅ **Prompt Mạnh:**
  `"Wide-angle shot (24mm lens), eye-level perspective. Inside an airy, contemporary specialty coffee shop in Saigon on a bright sunny morning. A focused Vietnamese male barista (early 20s, neat navy polo uniform, brown canvas apron, hair neatly styled) is carefully pouring steamed milk latte art into a ceramic cup on a white marble and light oak counter. On the counter sits a clean dual-boiler espresso machine, a receipt printer, and a Vietnamese QR code payment card. High-key natural morning daylight pouring through floor-to-ceiling glass windows, showing indoor tropical plants and clean wooden tables in the background. Editorial realism, deep depth of field, generous negative space on the right third for headline text. 16:9."`

### Ví dụ 2: Bếp Trưởng Kiểm Soát Định Lượng (Food Cost)
- ❌ **Prompt Yếu:**
  `"Chef cooking in restaurant kitchen, food cost concept, high quality, 8k"`
- ✅ **Prompt Mạnh:**
  `"Wide-angle operational shot (28mm lens). Inside a spotless commercial restaurant kitchen in Vietnam adhering to one-way HACCP flow. A professional Vietnamese chef (30s, short-sleeved white chef coat, black apron, hairnet, transparent hygiene mouth mask) is meticulously weighing sliced beef on a stainless steel digital scale on an immaculate 304 stainless steel prep table. Beside him are green and red cutting boards and stainless steel GN pans filled with prepped fresh lemongrass and chilies. Above, an aluminum ticket rail holds clean Vietnamese order tickets. Bright natural daylight reflecting off stainless steel surfaces, high operational clarity, deep depth of field. 16:9."`
