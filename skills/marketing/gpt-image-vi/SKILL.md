---
name: gpt-image-vi
description: Complete AI Visual & Prompting Engine for Vietnamese & Asian F&B Marketing — combines visual decision gating (real photo vs AI), 4-question strategic briefs, model-agnostic prompt anatomy, Vietnamese culture & F&B localization, 9 cardinal generation laws, 4 localized operational playbooks, and automated CLI batch rendering (OpenAI gpt-image-2) with WebP delivery (≤960px). Use for blog heroes, concept diagrams, process flows, social graphics, or batch asset creation.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# GPT Image VI — AI Visual & Prompting Engine (F&B Vietnam & Asia)

> Sự kết hợp toàn diện giữa **tư duy chiến lược hình ảnh (Image Brief & Gate)** từ `image-prompt` và **cơ chế tạo ảnh chính xác với tiếng Việt đầy đủ dấu (gpt-image-2 Engine & 9 Laws)** từ `gpt-image-vi`. Toàn bộ quy trình được neo chặt vào thực tế vận hành ngành F&B Việt Nam/Châu Á và bối cảnh marketing của Career F&B & AAU Academy (`plans/marketing-context.md`).

---

## 📌 Khi nào kích hoạt skill này

- **Ngầm định (Implicit):** Khi cần hình ảnh/visual cho bài viết blog SEO, cẩm nang vận hành AAU, tin tuyển dụng/hướng nghiệp Career F&B, bài đăng Fanpage/Group Facebook ("làm ảnh cho bài này", "vẽ sơ đồ quy trình", "tạo hero image", "cần prompt ảnh F&B", "sinh ảnh hàng loạt").
- **Tường minh (Explicit):** `"Dùng skill gpt-image-vi để [nhiệm vụ]"` hoặc `"Dùng skill image-prompt để [nhiệm vụ]"`.
- **Mối liên hệ hệ thống:**
  - Kế thừa tư duy gating & prompt anatomy từ [[image-prompt]].
  - Phục vụ trực tiếp cho pipeline viết bài SEO tại [[seo-writing]] và [[writing-pipeline]].
  - Kết nối với [[seo-images]] để chuẩn hóa alt-text, tên file và gắn nhãn schema.
  - Gọi trực tiếp CLI thực thi `scripts/gen-image.py` (sử dụng model OpenAI `gpt-image-2`).

---

## 🚪 BƯỚC 0 — CỔNG ĐÁNH GIÁ (THE GATE): CÓ NÊN DÙNG AI KHÔNG?

AI tạo sinh chỉ là **một công cụ**, không phải lựa chọn mặc định. Trong tiếp thị và tuyển dụng F&B tại Việt Nam, sự chân thật (authenticity) mang lại độ tin cậy vượt trội so với ảnh AI bóng bẩy:

1. **Ưu tiên ảnh chụp thực tế (Real Photography):**
   - Không gian quán thực tế, đội ngũ nhân sự thực tế, món ăn thực tế của thương hiệu.
   - 🚫 **Tuyệt đối không dùng AI để ngụy tạo hình ảnh nhân viên hay cơ sở kinh doanh có thật.** Nếu bài viết giới thiệu một chuỗi nhà hàng hoặc cơ sở cụ thể, hãy dùng ảnh chụp thực tế.
2. **Ảnh chụp màn hình thực tế (Screenshots):**
   - Bảng tính P&L thực tế, giao diện phần mềm POS (iPOS, CukCuk, KiotViet), số liệu kiểm kho thực tế. Rõ ràng, thuyết phục và không thể làm giả.
3. **Nội dung do người dùng tạo (UGC):**
   - Hình ảnh thực tế từ học viên AAU Academy, ảnh chia sẻ trong Group *Cộng đồng F&B Việt Nam (~9.400 thành viên)* — **bắt buộc có sự đồng ý (consent) được lưu lại**.
4. **Biểu đồ số liệu chính xác (Class C):**
   - Bắt buộc dựng bằng SVG hoặc công cụ vẽ biểu đồ xác thực. 🚫 **Cấm dùng AI sinh ảnh để vẽ biểu đồ mang số liệu.**

👉 **CHỈ DÙNG ẢNH SINH TỪ AI KHI:**
- Cần minh họa các khái niệm trừu tượng (ma trận Menu Mix, sơ đồ Onboarding 7 ngày, quy trình Figure-8 Walk, luồng bếp một chiều HACCP).
- Tạo ảnh Hero/Featured image chuẩn nhận diện thương hiệu cho bài viết cẩm nang khi không có sẵn tài sản ảnh chụp thực địa đạt chuẩn.
- Cần sơ đồ quy trình có nhãn chữ tiếng Việt chuẩn xác từng dấu câu.

---

## 📋 BƯỚC 1 — LẬP BRIEF HÌNH ẢNH 4 CÂU HỎI (THE 4-QUESTION BRIEF)

Trước khi viết prompt, phải trả lời 4 câu hỏi cốt lõi từ `plans/marketing-context.md`:

1. **Mục đích (Job / Purpose):**
   - *Hero bài viết cẩm nang* (aau.vn), *ảnh minh họa bài đăng tuyển dụng* (careerfnb.vn), *infographic quy trình* (Class B/B′), *ảnh thumbnail/card chia sẻ mạng xã hội* (Fanpage/Group).
2. **Thông điệp duy nhất (The One Thing):**
   - Mỗi hình ảnh chỉ truyền tải **MỘT ý niệm cốt lõi**. (Ví dụ: *"Đầu bếp kiểm soát hao hụt thực phẩm qua khâu cân định lượng sơ chế"* — không nhồi nhét cả quản lý kho, phục vụ bàn và kế toán vào một ảnh).
3. **Định dạng & Tỉ lệ khung hình (Format & Aspect Ratio):**
   - `16:9` (1536×1024): Hero bài viết, OpenGraph (OG) card trên web.
   - `1:1` (1024×1024): Ma trận vuông 2×2, sơ đồ khối cân xứng, bài đăng đa ảnh Facebook.
   - `4:5` (1024×1280): Ảnh dọc đơn lẻ tối ưu hiển thị bảng tin Facebook trên điện thoại.
   - `9:16`: Facebook Story / Reel Cover.
4. **Bản sắc thương hiệu & Bối cảnh bản địa (Brand Look & Local Context):**
   - Màu sắc nhận diện: Tươi sáng, gỗ sồi ấm, inox sáng bóng, điểm nhấn xanh lá tươi mát của nông sản nhiệt đới.
   - Không khí: Chuyên nghiệp, sạch sẽ, chuẩn chỉnh tác phong nghề nghiệp F&B Việt Nam.

> **Đầu ra chuẩn:** `[Mục đích] cho [Vị trí/Kênh, Tỉ lệ], truyền tải [Thông điệp duy nhất], theo [Bản sắc & Bối cảnh Việt Nam].`

---

## 🎨 BƯỚC 2 — CẤU TRÚC PROMPT TỰ NHIÊN 8 THÀNH PHẦN (PROMPT ANATOMY)

Không spam từ khóa sáo rỗng (*"4k, masterpiece, ultra-detailed, photorealistic"*). Các mô hình AI hiện đại lý luận dựa trên **ngôn ngữ tự nhiên chuẩn xác**. Cấu trúc một prompt mạnh gồm 8 thành phần:

1. **Subject (Chủ thể):** Nhân sự F&B người Việt/Châu Á cụ thể + Thiết bị, đạo cụ thao tác chuẩn nghề.
2. **Composition & Framing (Góc máy & Bố cục):** Góc rộng 24mm/28mm, ngang tầm mắt (eye-level), chiều sâu trường ảnh rõ ràng.
3. **Lighting (Ánh sáng):** Ánh sáng ban ngày tự nhiên nhiệt đới rực rỡ (natural bright daylight), hắt sáng từ cửa kính lớn, phản chiếu trên mặt bàn inox sạch bóng.
4. **Colour & Palette (Màu sắc):** Tone gỗ sồi ấm áp, inox xám bạc công nghiệp, điểm xuyết màu xanh của thảo mộc/rau củ nhiệt đới tươi sạch.
5. **Style & Medium (Phong cách):** Nhiếp ảnh phóng sự tài liệu chân thực (editorial realistic photography) hoặc đồ họa vector phẳng tối giản (clean flat vector).
6. **Mood & Atmosphere (Cảm xúc & Không khí):** Năng động, sạch sẽ, kỷ luật cao, thân thiện và tôn trọng người lao động.
7. **Detail & Focus (Tiêu cự & Chi tiết):** Lấy nét sâu bao quát không gian vận hành, thấy rõ các nhãn dán, đồng phục, thiết bị.
8. **Constraints (Ràng buộc & Không gian âm):** Để trống 1/3 khung hình cho text overlay nếu cần; không có người phương Tây; không sai dấu tiếng Việt; không lò sưởi/tuyết trắng.

---

## 🔴 BƯỚC 3 — 9 ĐỊNH LUẬT BẮT BUỘC KHI TẠO ẢNH (THE 9 CARDINAL LAWS)

### 🔴 LUẬT 1 — PHÂN LOẠI ẢNH TRƯỚC KHI TẠO (CẤM SỐ TRONG ẢNH AI)
Mô hình AI (`gpt-image-2`) vẽ chữ chuẩn xác nhưng **vẽ hình học/tỉ lệ chỉ ở mức tương đối**.

| Phân loại | Chứa số liệu? | Phương pháp thực hiện |
|---|:---:|---|
| **Class A. Hero / Ảnh minh họa bối cảnh** | Không | ✅ Sinh bằng AI (gpt-image-2) |
| **Class B. Sơ đồ khái niệm** (ma trận, tháp cấp bậc, checklist) | Không | ✅ Sinh bằng AI |
| **Class B′. Quy trình vận hành** (các bước nối tiếp, luồng 1 chiều) | Không | ✅ Sinh bằng AI (preset `flow`) |
| **Class C. Biểu đồ số liệu** (cột, tròn, tỉ lệ phần trăm %) | **CÓ** | 🚫 **TUYỆT ĐỐI KHÔNG DÙNG AI.** Bắt buộc dựng SVG xác thực từ số liệu thật |

> 🚫 **Ảnh AI không bao giờ được là nguồn sinh ra số liệu.** Biểu đồ có cột 30% lại cao hơn cột 40% là số liệu bịa đặt, phá hủy hoàn toàn uy tín chuyên môn.

### 🔴 LUẬT 2 — DATA BRIEF PHẢI ĐƯỢC DUYỆT TRƯỚC KHI VẼ
AI tuân thủ tuyệt đối từng chữ trong prompt và **không tự sửa lỗi sai chuyên môn**.
*(Ví dụ: nếu prompt đặt "Món Puzzle" vào góc Bán chạy / Lãi cao thì AI sẽ vẽ y như vậy — trong khi thực tế Menu Engineering quy định Puzzle là Bán chậm / Lãi cao).*
⇒ **Mọi sơ đồ Class B/B′ phải có data brief kiểm duyệt chuyên môn trước khi đưa vào sinh ảnh.**

### 🔴 LUẬT 3 — BẮT BUỘC GÕ ĐẦY ĐỦ DẤU TIẾNG VIỆT (100% FULL DIACRITICS)
AI tái hiện chính xác từng ký tự bạn đưa vào. Prompt gõ thiếu dấu hoặc sai chính tả sẽ tạo ra hình ảnh sai chính tả vĩnh viễn — đây là **lỗi im lặng (silent failure)** cực kỳ nguy hiểm.
- ❌ Sai: `"So do bep mot chieu"`, `"Ton dau ky"`, `"Nhan hang"`
- ✅ Đúng: `"Sơ đồ bếp một chiều"`, `"Tồn đầu kỳ"`, `"Nhận hàng"`, `"Mức độ bán chạy"`

### 🔴 LUẬT 4 — SƠ ĐỒ KHÔNG ĐƯỢC ĐỂ Ô TRỐNG
Một sơ đồ có 5 khối nhưng không có chữ bên trong là sơ đồ vô giá trị. Mọi bước, khối, góc phần tư đều phải có **nhãn chữ thực tế** được đặt trong dấu ngoặc kép.

### 🔴 LUẬT 5 — CHỈ DÙNG `gpt-image-2` (LOẠI BỎ CÁC BẢN CŨ)
Chỉ có `gpt-image-2` mới xử lý typography tiếng Việt sắc nét và tuân thủ chặt chẽ prompt âm (negative prompt).

### 🔴 LUẬT 6 — BỐI CẢNH VẬN HÀNH F&B THỰC TẾ (TRÁNH TROPES VĂN PHÒNG)
Hình ảnh phải thể hiện đúng thực tế ngành F&B theo `plans/marketing-context.md`:
- **Khu vực BOH (Bếp/Kho):** Bàn chế biến inox 304, thớt phân màu HACCP, cân điện tử tiểu ly, luồng bếp một chiều, kệ hàng FIFO, đầu bếp mặc áo bếp thoáng khí, tạp dề canvas, mũ trùm tóc, khẩu trang y tế. Không bao giờ vẽ người mặc vest/công sở đứng nấu ăn hay làm bếp.
- **Khu vực FOH (Sảnh/Bar/Thu ngân):** Quầy POS, máy in bill nhiệt, order tablet, máy pha cà phê chuyên nghiệp, ly cốc sáng bóng, nhân viên phục vụ mặc đồng phục gọn gàng.
- **Thuật ngữ chuyên môn chuẩn xác:** *Prime Cost*, *Food Cost*, *Hao hụt sơ chế (Yield Rate)*, *Bếp một chiều*, *Mise en place*, *Figure-8 Walk*, *LSM*, *Onboarding 7 ngày*.

### 🔴 LUẬT 7 — ÁNH SÁNG BAN NGÀY TƯƠI SÁNG & GÓC RỘNG BẢO QUÁT (24MM/28MM)
Tránh hoàn toàn các ảnh góc quá hẹp (macro đơn điệu) hoặc ánh sáng quán bar tối tăm u ám:
- **Ánh sáng:** `Bright natural daylight`, `airy and clean atmosphere`, ánh nắng sớm chiếu qua cửa kính lớn, phản chiếu sạch sẽ trên bề mặt inox và gỗ sồi sáng.
- **Góc chụp:** Góc rộng môi trường `Wide-angle lens (24mm or 28mm equivalent)`, lấy nét sâu (deep depth of field) thấy rõ chiều sâu vận hành của cửa hàng.
- **Tính trực quan 3 giây:** Người đọc nhìn vào hiểu ngay ý đồ nghiệp vụ trong 3 giây.

### 🔴 LUẬT 8 — THIẾT KẾ KHÔNG GIAN ÂM CHO LỚP PHỦ CHỮ (DESIGN FOR OVERLAY)
Khi tạo ảnh làm bìa (Hero banner), thumbnail hoặc ảnh chạy quảng cáo/social:
- Chủ động yêu cầu vùng không gian âm (negative space) chiếm 1/3 bức ảnh (bên trái, bên phải hoặc góc dưới).
- Vùng không gian âm phải có độ tương phản cao, ít chi tiết rườm rà để khi chèn tiêu đề tiếng Việt trên Canva/Photoshop thì chữ vẫn nổi bật, dễ đọc trên màn hình điện thoại.
- Khai báo rõ trong prompt: *"Deliberate negative space on the left third with minimal detail for text overlay. No text on the left."*

### 🔴 LUẬT 9 — CHUẨN HÓA BẢN SẮC VĂN HÓA VIỆT NAM & CHÂU Á (LOCALIZATION & ETHICS)
AI thường mặc định văn hóa phương Tây (Caucasian, kiến trúc gạch nung châu Âu, lò sưởi mùa đông, bánh mì baguette treo khắp tiệm). Bắt buộc chỉ định rõ bản sắc văn hóa Việt Nam:
1. **Con người & Nhân chủng học:**
   - 100% nhân vật chính diện là **người Việt Nam / Đông Á đương đại** (contemporary Vietnamese/East Asian individuals): tóc đen/nâu sẫm, mắt đen, phong thái nhanh nhẹn, tự nhiên, nụ cười hiếu khách Á Đông.
   - Trang phục phù hợp khí hậu nhiệt đới gió mùa: áo ngắn tay hoặc dài tay vải mỏng thoáng khí, tạp dề bảo hộ; không vẽ áo khoác len, khăn choàng cổ hay âu phục mùa đông dày cộm trong bếp.
2. **Kiến trúc & Không gian:**
   - Phong cách F&B đương đại Việt Nam: Kết hợp hiện đại với nét bản địa (gạch hoa thông gió, nan mây mộc mạc, gỗ sồi sáng màu, cây nhiệt đới như chuối cảnh, monstera, bàng Singapore).
   - Biển hiệu, bảng phân khu, checklist in **tiếng Việt có dấu**: `"KHO LẠNH"`, `"SƠ CHẾ RAU CỦ"`, `"QUẦY PHA CHẾ"`, `"MENU ĐỒ UỐNG"`.
   - Có bảng mã VietQR thanh toán đặt trang nhã tại quầy thu ngân — nét đặc trưng của F&B Việt Nam.
3. **Đạo đức, Bản quyền & Minh bạch:**
   - 🚫 Không ngụy tạo hình ảnh của người nổi tiếng hay cá nhân có thật.
   - 🚫 Không tùy tiện đưa logo nhãn hiệu lớn (Highlands, Phê La, Jollibee...) vào ảnh khi chưa có thỏa thuận văn bản.
   - Tuân thủ dán nhãn minh bạch "Made with AI" khi đăng tải lên mạng xã hội theo quy định nền tảng.

---

## 🍽️ BƯỚC 4 — F&B PROMPT PLAYBOOK (4 KỊCH BẢN THỰC CHIẾN TẠI VIỆT NAM)

### Kịch bản 1: FOH Service & Order (Quầy Thu Ngân & Sảnh Phục Vụ Hiện Đại)
- **Mục đích:** Bài viết về dịch vụ khách hàng, tối ưu tốc độ order tại quầy, quy trình tiếp đón LAST.
- **Prompt mẫu (Chuẩn English Prompt + Vietnamese Text):**
```text
Wide-angle environmental shot (24mm lens), eye-level perspective. A modern Vietnamese specialty coffee shop in Saigon during bright sunny morning. Behind a clean light oak wood and white terrazzo counter, a cheerful Vietnamese female cashier (early 20s, wearing neat dark navy polo shirt uniform and canvas apron, hair neatly tied back) is smiling warmly while operating a modern touch-screen POS terminal. On the counter sits a receipt printer, a neatly displayed wooden stand with a Vietnamese QR code payment card, and clear glass jars of roasted coffee beans labeled "CÀ PHÊ VIỆT". In the background, an airy, bright dining space with large floor-to-ceiling glass windows, indoor tropical monstera plants, and comfortable wooden seating. Bright high-key morning daylight pouring in, natural warm atmosphere, deep depth of field, ultra-clean operational environment. No western corporate suits, no dark dim lighting. 16:9.
```

### Kịch bản 2: BOH Prep & Kitchen (Bếp Nóng & Sơ Chế Một Chiều Chuẩn HACCP)
- **Mục đích:** Bài viết về kiểm soát Food Cost, quy trình sơ chế giảm hao hụt (Yield Rate), tiêu chuẩn ATTP.
- **Prompt mẫu:**
```text
Wide-angle operational shot (28mm lens). Inside a professional, immaculate commercial restaurant kitchen in Vietnam adhering to standard one-way food safety flow. A focused Vietnamese male chef (late 20s, wearing a breathable short-sleeved white chef coat, black apron, hairnet, and a clean hygiene mouth mask) is carefully weighing prepped ingredients on a stainless steel digital scale on a polished 304 stainless steel worktable. Beside the scale are color-coded cutting boards (green for vegetables, red for raw meat) and stainless steel GN containers holding precisely prepped fresh lemongrass, red bird's-eye chilies, and herbs. On the stainless steel wall above hangs an aluminum order ticket rail with neat Vietnamese order slips reading "BÀN 04 - BÒ LÚC LẮC". High-key natural lighting reflecting off clean stainless steel surfaces, spotlessly clean floor with drainage trench. Professional culinary realism, deep depth of field. 16:9.
```

### Kịch bản 3: Management & Figure-8 Walk (Quản Lý Điểm Bán & SOP Audit)
- **Mục đích:** Bài viết hướng nghiệp Cửa hàng trưởng, quy trình tuần tra Figure-8, kiểm soát 5 khối rò rỉ.
- **Prompt mẫu:**
```text
Wide eye-level perspective (28mm lens). Inside a spacious, contemporary Vietnamese casual dining restaurant before opening hour. A confident Vietnamese store manager (female, early 30s, smart casual business attire with a dark bistro apron) is holding a digital tablet displaying an inspection form titled "CHECKLIST CA MỞ CỬA". She stands in the center aisle performing a Figure-8 floor audit, observing the perfectly aligned light-wood dining tables and clean rattan-accented chairs. Morning daylight streams through expansive windows illuminating the spotless terrazzo floor. In the blurred background, a service staff member is polishing glassware at the beverage station. Airy atmosphere, professional management vibe, high operational clarity, generous negative space on the right side for editorial text overlay. 16:9.
```

### Kịch bản 4: Sơ đồ Khái niệm & Quy trình Tiếng Việt (Class B / B′ Diagram)
- **Mục đích:** Minh họa quy trình tiếp nhận & lưu kho hàng hóa 4 bước (Bếp trung tâm/Nhà hàng).
- **Prompt mẫu:**
```text
Horizontal process flow diagram, clean flat vector infographic style, 4 distinct sequential steps arranged horizontally from left to right, connected by clear directional chevron arrows. 
The 4 rectangular cards with rounded corners have soft shadows and clean icons:
Step 1 icon shows delivery truck: Box label reads exactly "1. GIAO NHẬN".
Step 2 icon shows clipboard with checklist: Box label reads exactly "2. KIỂM SOÁT CL".
Step 3 icon shows digital weighing scale: Box label reads exactly "3. CÂN ĐỊNH LƯỢNG".
Step 4 icon shows cold storage warehouse: Box label reads exactly "4. NHẬP KHO FIFO".
Color palette: Warm terracotta accent, slate gray (#334155), pure white background, crisp modern Vietnamese sans-serif typography with 100% accurate diacritics. No numbers inside illustrations, no empty boxes, no misspelling. Horizontal layout. 16:9.
```

---

## ⚡ BƯỚC 5 — THỰC THI QUA CLI SCRIPT & TỐI ƯU HÓA WEB

Sinh ảnh trực tiếp bằng công cụ nội bộ đã được cấu hình sẵn trong repo:

```bash
# 1. Sinh 1 ảnh đơn lẻ (Mặc định chất lượng medium, tự động tối ưu WebP ≤ 960px)
python3 scripts/gen-image.py single \
  --prompt "..." \
  --out wiki/aau.vn/images/<slug>/hero.png \
  --preset hero

# 2. Sinh sơ đồ quy trình ngang (preset flow)
python3 scripts/gen-image.py single \
  --prompt "..." \
  --out wiki/aau.vn/images/<slug>/quy-trinh-01.png \
  --preset flow \
  --quality medium \
  --max-width 960

# 3. Sinh hàng loạt theo manifest (LUÔN CHẠY --dry-run TRƯỚC)
python3 scripts/gen-image.py batch --manifest wiki/aau.vn/images/<campaign>-manifest.json --dry-run
python3 scripts/gen-image.py batch --manifest wiki/aau.vn/images/<campaign>-manifest.json --concurrency 4
```

### Bảng Preset & Tự động nén WebP

| Preset | Kích thước Render | Xuất bản Web thực tế | Ứng dụng tối ưu |
|---|---|---|---|
| `hero` | 1536×1024 (16:9) | **≤ 960px WebP (~30–75KB)** | Ảnh bìa bài viết, Featured Image, OpenGraph |
| `og` | 1536×1024 (16:9) | **≤ 960px WebP (~30–75KB)** | Ảnh chia sẻ link Facebook/Zalo |
| `flow` | 1536×1024 (16:9) | **≤ 960px WebP (~10–75KB)** | Sơ đồ quy trình ngang, luồng vận hành |
| `diagram` | 1024×1024 (1:1) | **≤ 960px WebP (~10–30KB)** | Ma trận 2×2, tháp năng lực 4 cấp, checklist |

### Benchmark Chi phí & Tốc độ (`quality: medium` khuyến nghị)
- **Token tiêu thụ:** 1.372 – 1.756 tokens (tiết kiệm **75% – 80%** so với `high`).
- **Thời gian sinh:** 40 – 43 giây/ảnh (nhanh hơn 2,4 lần).
- **Dung lượng WebP:** **11 – 75 KB** (nhẹ hơn 98% so với file PNG thô 1.5MB, tải cực nhanh trên mobile).
- **Độ chuẩn xác tiếng Việt:** **100% rõ nét, chuẩn dấu**.
- **Tính Idempotent:** Bỏ qua các file ảnh đã tồn tại. Muốn sinh lại một ảnh cụ thể: xoá file đó rồi chạy lại (không dùng `--force` trên toàn batch).
- **Sidecar `.json`:** Mỗi ảnh sinh ra luôn có 1 file `.json` đi kèm ghi nhận prompt, model, tokens, thời gian và dung lượng để đối soát ngân sách.

---

## 🏷️ BƯỚC 6 — ALT TEXT CHUẨN SEO & TRUY CẬP CHO TỪNG CLASS

| Phân loại | Quy tắc viết Alt Text tiếng Việt | Ví dụ chuẩn |
|---|---|---|
| **Class A (Hero/Bối cảnh)** | Mô tả bối cảnh hoạt động, con người và nghiệp vụ cụ thể | `alt="Nhân viên thu ngân Career F&B thao tác máy POS tại quầy cafe phong cách nhiệt đới hiện đại ở TP.HCM"` |
| **Class B / B′ (Sơ đồ)** | Mô tả cấu trúc sơ đồ và liệt kê đầy đủ tên các bước/khối | `alt="Sơ đồ quy trình tiếp nhận nguyên liệu 4 bước: 1. Giao nhận, 2. Kiểm soát CL, 3. Cân định lượng, 4. Nhập kho FIFO"` |
| **Class C (Biểu đồ SVG)** | Nêu bật **kết luận & số liệu thực tế** có trích dẫn nguồn | `alt="Biểu đồ cơ cấu Prime Cost chuẩn AAU: Food cost chiếm 30%, Chi phí nhân sự COL chiếm 22%, Lợi nhuận gộp 48%"` |

🚫 Không nhồi nhét từ khóa (keyword stuffing). 🚫 Không để trống. 🚫 Không ghi chung chung *"hình ảnh minh họa"*.

---

## 🧭 NGOÀI PHẠM VI (OUT OF SCOPE)

- Soạn thảo nội dung bài viết hoàn chỉnh → Sử dụng [[seo-content]] hoặc [[seo-writing]].
- Quy chuẩn tên file, gắn nhãn schema JSON-LD, sitemap ảnh → Sử dụng [[seo-images]].
- Biểu đồ số liệu chính xác (Class C) → Dựng mã nguồn SVG xác thực, không dùng AI.
- Đăng tải trực tiếp bài viết lên CMS → Dùng `scripts/publish-shopify.py` hoặc skill tương ứng.
