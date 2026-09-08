---
name: image-prompt
description: Strategic visual foundation and prompt engineering engine for F&B Marketing (Vietnam & Asia) — visual decision gating (real assets vs AI), 4-question strategic briefs, model-agnostic prompt anatomy, Class A/B/B'/C classification, Vietnamese cultural & operational localization, and tooling routing. Fully aligned with gpt-image-vi and plans/marketing-context.md. Use when the user asks "what image should I use", "help me prompt an image", "create a visual brief for this post", or "generate a hero/diagram for F&B".
allowed-tools: Read, Write, Glob, Grep
---

# Image Prompt — Strategic Visual Router & Prompt Architecture (F&B Vietnam)

> Một prompt không có brief rõ ràng sẽ chỉ tạo ra một bức tranh đẹp nhưng vô dụng. Skill này định hình **bản chất hình ảnh cần tạo**, kiểm tra cổng quyết định thực tế (Gate), chuẩn hóa văn hóa & nghiệp vụ F&B bản địa (Việt Nam & Châu Á), thiết lập cấu trúc prompt mô tả tự nhiên 8 thành phần, và định tuyến chính xác tới pipeline thực thi (ưu tiên [[gpt-image-vi]]).

---

## 📌 Khi nào kích hoạt skill này

- **Ngầm định (Implicit):** Khi người dùng chuẩn bị nội dung cho bài đăng mạng xã hội, bài viết blog cẩm nang, tuyển dụng hoặc cần ý tưởng hình ảnh ("cần ảnh minh họa cho bài này", "nên dùng ảnh gì", "viết giúp tôi prompt ảnh", "lập brief visual").
- **Tường minh (Explicit):** `"Dùng skill image-prompt để [nhiệm vụ]"`.
- **Được gọi từ:**
  - `/mk:content social` — khi bài post cần thiết kế visual (phối hợp `social-content`).
  - [[seo-image-gen]] — tầng lập brief và định tuyến phía trên pipeline SEO asset.
  - [[ad-creative]] — khi xây dựng concept hình ảnh quảng cáo tuyển dụng B2B/B2C.
  - Kênh Fanpage & Group — banner tuyển dụng, meme nghề, tài liệu SOP.

---

## 🎯 Phạm vi & Vai trò

### Những gì skill này giải quyết:
1. **Cổng kiểm tra (The Gate):** Đánh giá xem hình ảnh này có nên sinh bằng AI hay bắt buộc dùng ảnh thật/chụp màn hình/biểu đồ kỹ thuật.
2. **Lập brief hình ảnh 4 câu hỏi (The 4-Question Brief):** Xác định mục đích, thông điệp duy nhất, kích thước và bản sắc nhận diện thương hiệu.
3. **Cấu trúc Prompt mô tả tự nhiên 8 thành phần (Prompt Anatomy):** Chuyển brief thành chỉ dẫn hình ảnh chính xác, loại bỏ từ khóa rác, thiết kế không gian âm (negative space) cho lớp phủ chữ (overlay).
4. **Chuẩn hóa văn hóa F&B Việt Nam & Châu Á:** Đảm bảo con người, kiến trúc, đạo cụ và món ăn phản ánh đúng thực tế vận hành tại Việt Nam (không nhầm lẫn sang bối cảnh phương Tây).
5. **Định tuyến công cụ (Tool Router):** Kết nối trực tiếp tới [[gpt-image-vi]] cho pipeline sinh ảnh tiếng Việt chuẩn dấu, hoặc đề xuất công cụ phù hợp.
6. **Tuân thủ quy chuẩn:** Bản quyền, đạo đức AI, dán nhãn "Made with AI", kiểm tra lỗi chính tả tiếng Việt.

### Những gì KHÔNG thuộc phạm vi này:
- Nén ảnh WebP, đóng gói alt-text và schema hình ảnh cho SEO → xem [[seo-images]].
- Soạn thảo nội dung bài viết hoàn chỉnh → xem [[seo-content]].
- Sinh biểu đồ số liệu chính xác (Class C) → dùng mã SVG hoặc công cụ vẽ biểu đồ xác thực.

---

## 🚪 Bước 0 — Cổng đánh giá: Có nên sinh bằng AI không?

AI không phải là giải pháp mặc định. Trong ngành F&B, **sự chân thật là yếu tố sống còn để xây dựng lòng tin**:

- **Ảnh chụp thực tế (Real Photography) — TỐT NHẤT:** Không gian quán thật, đội ngũ nhân viên thật, đĩa thức ăn/ly nước thực tế. AI **không thể và không được phép** ngụy tạo một con người hay địa điểm có thật.
- **Ảnh chụp màn hình thực tế (Screenshots):** Giao diện phần mềm POS (iPOS, CukCuk, KiotViet), bảng tính Prime Cost thực tế, phản hồi/review của khách hàng.
- **Nội dung do người dùng tạo (UGC):** Hình ảnh do học viên AAU Academy hoặc thành viên *Group Cộng đồng F&B (~9.400 thành viên)* chia sẻ (bắt buộc có sự đồng ý bằng văn bản).
- **Biểu đồ số liệu chính xác (Class C):** Doanh thu, tỉ lệ Food Cost %, biến động nhân sự % → Dựng SVG hoặc biểu đồ xác thực. 🚫 Tuyệt đối không để AI vẽ biểu đồ mang số.

👉 **CHỈ DÙNG AI KHI:** Hình ảnh chưa tồn tại trong kho tài nguyên, cần minh họa các khái niệm trừu tượng (ma trận Menu Mix, sơ đồ bếp một chiều, quy trình Figure-8 Walk, cẩm nang onboarding 7 ngày), hoặc cần hero image theo đúng brand guideline mà không có sẵn ảnh chụp.

---

## 📋 Bước 1 — Lập brief hình ảnh 4 câu hỏi (The 4-Question Brief)

Neo chặt vào `plans/marketing-context.md` để trả lời 4 câu hỏi:

1. **Mục đích (Job / Purpose):**
   - Hero cẩm nang vận hành (aau.vn), Visual bài đăng Fanpage/Group (Career F&B), Banner tuyển dụng theo vị trí (60 job categories), hay Sơ đồ quy trình SOP (Class B/B′).
2. **Thông điệp duy nhất (The One Thing):**
   - Mỗi hình ảnh chỉ nói lên **MỘT điều duy nhất**. (Ví dụ: *"Sự chỉn chu, sạch sẽ tuyệt đối của quy trình sơ chế bếp một chiều"*).
3. **Định dạng & Tỉ lệ khung hình (Format & Aspect Ratio):**
   - `16:9` (1536×1024): Hero bài viết blog, OpenGraph card.
   - `4:5` (1024×1280): Ảnh dọc đơn tối ưu bảng tin Facebook trên di động.
   - `1:1` (1024×1024): Sơ đồ ma trận vuông 2×2, bài đăng đa ảnh.
   - `9:16`: Reel Cover, Facebook Story.
4. **Bản sắc thương hiệu & Bối cảnh Việt Nam (Brand Look & Local Context):**
   - Màu sắc: Tươi sáng, gỗ sồi ấm áp, inox xám bạc công nghiệp, điểm nhấn xanh lá thảo mộc.
   - Không gian: Đậm chất F&B hiện đại tại Việt Nam (thoáng đãng, ánh sáng ban ngày tự nhiên, gạch thông gió, nan mây, cây nhiệt đới).

> **Cú pháp tóm tắt:** `[Mục đích] cho [Vị trí, Tỉ lệ], truyền tải [Thông điệp duy nhất], theo [Bản sắc F&B Việt Nam].`

---

## 🎨 Bước 2 — Mô tả chi tiết (Prompt Anatomy 8 thành phần)

Loại bỏ hoàn toàn các từ khóa vô nghĩa như *"4k, masterpiece, trending on artstation"*. Mô hình AI hiện đại hiểu ngữ cảnh mô tả thực tế:

1. **Subject (Chủ thể):** Con người cụ thể (người Việt Nam/Đông Á, độ tuổi, vai trò nghiệp vụ F&B, trang phục bảo hộ đúng quy chuẩn) + Thiết bị/đạo cụ chuyên dụng.
2. **Composition & Framing (Góc máy & Bố cục):** Góc rộng 24mm/28mm bao quát môi trường, ngang tầm mắt (eye-level), độ sâu trường ảnh sâu (deep depth of field).
3. **Lighting (Ánh sáng):** Ánh sáng ban ngày tự nhiên nhiệt đới rực rỡ (`Bright high-key natural daylight`), nắng sớm chiếu qua cửa kính, phản chiếu trên mặt bàn inox sạch bóng. Không dùng ánh sáng quán bar tối tăm u ám.
4. **Colour & Palette (Màu sắc):** Tone gỗ sồi ấm, inox sáng sạch, điểm xuyết màu xanh rau củ tươi hoặc màu đất nung mộc mạc.
5. **Style & Medium (Phong cách):** Nhiếp ảnh phóng sự tài liệu chân thực (editorial realistic photography) hoặc đồ họa vector phẳng hiện đại (clean flat vector).
6. **Mood & Atmosphere (Không khí & Cảm xúc):** Chuyên nghiệp, sạch sẽ, chuẩn mực, hiếu khách, tràn đầy năng lượng tích cực.
7. **Detail & Focus (Tiêu cự & Chi tiết):** Lấy nét sâu, thể hiện rõ các chi tiết vận hành (cân tiểu ly điện tử, khay inox GN, bảng order, mã QR, đồng phục).
8. **Constraints & Negative Space (Ràng buộc & Không gian âm):**
   - Dành sẵn 1/3 không gian có độ tương phản cao, ít chi tiết để chèn tiêu đề chữ tiếng Việt sau này.
   - 🚫 Không có nhân vật phương Tây (Caucasian) trong bối cảnh phục vụ/bếp Việt Nam; không có lò sưởi phương Tây, không có tuyết rơi mùa đông.

---

## 🧭 Bước 3 — Định tuyến công cụ (Tool Router)

Dựa trên yêu cầu cốt lõi của hình ảnh:

| Yêu cầu cốt lõi | Công cụ chỉ định | Lý do & Quy chuẩn |
|---|---|---|
| **Cần chữ tiếng Việt chuẩn dấu (Hero, Sơ đồ quy trình)** | ✅ **`gpt-image-vi`** (`scripts/gen-image.py` với `gpt-image-2`) | Công cụ duy nhất trong hệ thống kết xuất chữ tiếng Việt chuẩn 100% dấu, tự động tối ưu WebP ≤ 960px. |
| **Biểu đồ số liệu có % hoặc cột/tròn** | 🚫 **Mã nguồn SVG xác thực** | Tránh sai lệch tỉ lệ đồ họa, đảm bảo trung thực số liệu theo Luật 1. |
| **Ảnh chụp thực địa không gian/con người thật** | 📸 **Ảnh chụp thực tế (Real Photo)** | Giữ vững niềm tin thương hiệu, cấm ngụy tạo cơ sở thật. |
| **Hình ảnh vector / Logo thuần túy** | 🎨 **Recraft / SVG** | Giữ nguyên độ sắc nét vector ở mọi độ phân giải. |
| **Video ngắn minh họa (Reels/TikTok)** | 🎬 **Veo / Remotion** | Chuyển tiếp tới pipeline video marketing. |

---

## ⚖️ Các nguyên tắc xuyên suốt (Bắt buộc tuân thủ)

1. **Minh bạch AI (Disclosure):** Bật chế độ nhãn "Made with AI" khi đăng tải lên Facebook/Meta theo quy định nền tảng.
2. **Không dùng chân dung người thật, không vi phạm sở hữu trí tuệ:** Không sao chép khuôn mặt người nổi tiếng. Không tùy tiện đưa logo các chuỗi lớn (Jollibee, Highlands, Phê La...) vào ảnh khi chưa có văn bản đồng thuận.
3. **Kiểm tra chính tả tiếng Việt trước khi xuất bản:** Rà soát từng dấu hỏi, ngã, sắc, huyền trên ảnh sinh ra. Gõ sai dấu trong prompt là lỗi nghiêm trọng.
4. **Tối ưu hiển thị di động & Không gian phủ chữ:** Đảm bảo ảnh rõ ràng, dễ đọc trên màn hình điện thoại 6 inch; chừa chỗ trống cho text overlay.

---

## 🔗 Tài liệu tham khảo đi kèm

- `references/the-image-brief.md` — Chi tiết quy trình lập brief và kiểm tra cổng Gate.
- `references/prompt-anatomy.md` — Giải phẫu cấu trúc prompt và cách chuyển đổi từ yếu sang mạnh.
- `references/choosing-the-tool.md` — Cây quyết định chọn công cụ.
- `references/examples.md` — Các ví dụ thực tế end-to-end về F&B Việt Nam.
