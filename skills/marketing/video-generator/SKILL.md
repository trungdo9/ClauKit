---
name: video-generator
description: AI Short Video Production, TikTok/Reels/Shorts Distribution Strategy, Multi-Angle Cinematic B-Roll, VieNeu TTS & Remotion Automation — Hoạch định chiến lược phân phối và tối ưu thuật toán TikTok/Reels/Shorts (hook 3 giây, trụ nội dung, hashtag, creator, Spark Ads, KPI), đồng thời tự động tạo kịch bản video ngắn (9:16) và video B2B (16:9) đa góc quay (Multi-angle B-Roll), gắn sẵn logo thương hiệu Enterprise Corp ở góc dưới cùng, loại bỏ chi tiết giống AI, tích hợp giọng đọc VieNeu TTS API (Tuấn Huy, Trọng Nghĩa) và xuất video MP4 Full HD chuẩn điện ảnh.
---

<!-- Phần chiến lược phân phối (§2, §8) adapted from https://github.com/msitarzewski/agency-agents@6d58ad4:marketing/marketing-tiktok-strategist.md (MIT) -->


# Video Generator, Multi-Angle B-Roll & Anti-AI Video Automation (SKILL)

## 1. Mục Đích & Tiêu Chuẩn Nâng Cấp 2026
Skill này cung cấp giải pháp tự động hóa sản xuất video ngắn (TikTok, Reels, YouTube Shorts tỉ lệ **9:16** - 1080×1920) và video B2B giới thiệu sản phẩm/dự án (**16:9**) cho hệ sinh thái **example.com** (Công ty TNHH Enterprise Corp).

### 🎯 5 Nâng Cấp Cốt Lõi (Authentic Realism & Anti-AI Standard):
1. **Hệ Thống Đa Góc Quay B-Roll (Multi-Angle B-Roll Switcher)**: Mỗi scene (8–12s) không dùng 1 ảnh tĩnh đơn điệu, mà được chia thành **2–4 góc quay B-Roll thực tế** (Toàn cảnh kho/xưởng $\rightarrow$ Cận cảnh vi mao quản/khối than $\rightarrow$ Thao tác thí nghiệm/đo đạc $\rightarrow$ Xe tải bốc dỡ hàng). Chuyển góc cảnh (cutaway) tự động mỗi **2.5 – 3.5 giây** khớp theo mạch thoại.
2. **Gắn Sẵn Huy Hiệu Logo Enterprise Corp Góc Dưới Cùng (Brand Watermark Badge)**: 
   - Logo chính thức: `https://example.com/wp-content/uploads/2023/06/logo-1-1.png` (cục bộ: `wiki/video-scripts/logo-xuyen-viet.png`).
   - Khối nhận diện glassmorphism sang trọng ở chân video: Logo công ty sắc nét + Chấm xanh trạng thái (Pulsing Mint Dot `#3FBF7F`) + Tên công ty + Hotline `0900.000.000` + Website `example.com`.
3. **Loại Bỏ Hoàn Toàn Chi Tiết "Giống AI" (*Anti-AI Feel Rule*)**:
   - ❌ **Xóa bỏ các hộp thẻ card đặc to tướng che kín 50% giữa màn hình** (thứ làm video giống slide thuyết trình PowerPoint/Canva AI).
   - ✅ **Mở rộng Viewport toàn cảnh 100%**: Giữ khu vực trung tâm màn hình hoàn toàn thoáng đãng để người xem thấy rõ sản phẩm thật, hành động thí nghiệm sủi bọt, tháp khí và công nhân làm việc.
   - ✅ **Cinematic Lower-Third Tech HUD**: Toàn bộ thông số kỹ thuật (Iodine, BET, CTC, ΔP) được đặt trong dải HUD bán trong suốt ở 1/3 dưới màn hình, thiết kế như monitor phòng thí nghiệm/màn hình đo đạc của kỹ sư.
   - ❌ **100% Ảnh Thực Tế — Tuyệt Đối Không Dùng Ảnh AI Ma Mị/3D**: Khai thác trực tiếp từ kho **1.401+ hình ảnh thực tế** tại `wiki/media/image-sitemap.md` và `wiki/media/catalog.json`.
4. **Chiều Sâu Không Gian & Điện Ảnh (*Cinematic Depth*)**:
   - Dynamic Ken Burns (Zoom chậm $1.00 \rightarrow 1.08$ + Pan trôi ngang).
   - Lớp phủ điện ảnh: Dynamic Film Grain (độ hạt phim nhẹ) + Optical Vignette (tối viền góc) + Anamorphic Light Rays (vệt sáng quang học) + Micro-dust particles (hạt bụi không gian).
5. **Kịch Bản Kỹ Sư Thực Chiến (Authentic Engineer Voiceover)**:
   - ❌ Không dùng văn phong AI sáo rỗng ("Bạn có biết rằng...", "Hãy cùng tôi khám phá...").
   - ✅ Dùng văn nói kỹ sư hiện trường bộc trực, thực tế ("Nhiều anh em làm xưởng...", "Thực tế kiểm tra tại kho...", "Thả ngay vào cốc nước nóng 80 độ là thấy bọt khí cuồn cuộn...").

> **Thứ tự thực thi bắt buộc:** chốt chiến lược ở **§2** (phân khúc → trụ nội dung → hook → độ dài) **TRƯỚC** khi chạy sản xuất ở §3–§7. Sản xuất một video không rõ phân khúc và không có hook là nguồn lãng phí lớn nhất của kênh.

---

## 2. Chiến Lược Phân Phối & Tối Ưu Thuật Toán (TikTok • Reels • Shorts)

Tầng quyết định **nên quay gì, cho ai, mở đầu ra sao** — chạy trước tầng sản xuất. Chi tiết đầy đủ (thư viện hook, bộ hashtag, khung creator, format quảng cáo, xử lý khủng hoảng bình luận) nằm tại **`references/tiktok-distribution.md`**.

### A. Ba Phân Khúc Mục Tiêu
Bám đúng mô hình đã chốt tại `plans/campaigns/global/social-omnichannel/master-campaign-plan.md` — **không nhắm "Gen Z" chung chung**:

| Phân khúc | Chân dung người xem | Đích chuyển đổi |
|---|---|---|
| **B2B** | Kỹ sư vận hành trạm, phụ trách mua hàng KCN, nhà thầu cơ điện, đại lý | Zalo OA → báo giá PDF có VAT + CO/CQ |
| **B2C** | Hộ gia đình nước giếng khoan nhiễm phèn, khử mùi, bể cá cảnh | Hotline `0900.000.000` / đơn lẻ |
| **C2C** | Cộng đồng thợ nước trao đổi kinh nghiệm & vật tư | Facebook Group → mua vật tư chính hãng |

### B. Tỷ Lệ Trụ Nội Dung — 45 / 25 / 20 / 10
Đã tái cân cho kênh vật tư công nghiệp (khác tỷ lệ brand tiêu dùng phổ thông):

| % | Trụ | Nội dung điển hình |
|---|---|---|
| **45%** | **Kỹ thuật & Chứng minh** | Thí nghiệm Iodine, đối chiếu than thật/giả, giải thích ΔP, EBCT, chọn sai cấp than |
| **25%** | **Hiện trường & Năng lực** | Tổng kho 500 tấn, xe cẩu bốc dỡ, lắp đặt tại nhà máy, chứng thư Quatest 3 |
| **20%** | **Giải đáp cộng đồng** | Trả lời bình luận/câu hỏi thật của thợ nước, phản biện quan niệm sai |
| **10%** | **Chào hàng** | Bảng giá đại lý, chính sách chiết khấu, hàng về cont mới |

Vượt 10% chào hàng là nguyên nhân tụt reach phổ biến nhất. Giữ trần này.

### C. Bốn Quy Tắc Không Thương Lượng

1. **Hook trong 3 giây** — 6 khuôn hook chuẩn hóa tại `references/tiktok-distribution.md` §1. Không mở đầu bằng logo, intro, hay lời chào.
2. **Voiceover là trục, nhạc nền là phụ** — giọng VieNeu TTS (§4) dẫn dắt toàn bộ; âm thanh xu hướng chỉ làm nền ở mức ≤ 20% âm lượng, không bao giờ thay thế VO. Đây là điểm khác biệt so với kênh giải trí thuần.
3. **Phụ đề cháy sẵn (burned-in)** — phần lớn người xem tắt tiếng. Video không phụ đề coi như chưa hoàn thành.
4. **Dọc 9:16 (1080×1920)** — mọi chỉnh sửa canvas theo §5; không upload video ngang lên kênh dọc.

### D. Nhịp Đăng & Cửa Sổ Vàng Đầu Giờ
- Cadence khuyến nghị: **4–5 video/tuần**, rải đều 3 phân khúc theo tỷ lệ ở mục B.
- **Giờ đầu tiên quyết định reach**: chuẩn bị sẵn 3–5 câu hỏi kỹ thuật để trả lời bình luận ngay trong 60 phút đầu — engagement velocity là tín hiệu xếp hạng mạnh.
- Mỗi video kết bằng một **câu hỏi kỹ thuật mở** để mồi bình luận (không phải câu hỏi xã giao).

### E. Ràng Buộc Nội Dung Bắt Buộc (áp cho caption, phụ đề, overlay, VO)

| Ràng buộc | Chi tiết |
|---|---|
| **Giá lấy từ MISA AMIS CRM** | Mọi con số giá tra `wiki/crm/products/amis-products.json`. Sản phẩm giá `null`/`0` → dùng nguyên văn câu liên hệ Hotline B2B, **tuyệt đối không tự gán số** |
| **Từ cấm** | Không dùng "Top 1 Việt Nam", "Số 1 thị trường", "Rẻ nhất quả đất", "Uy tín hàng đầu", "Thần thánh", "Cam kết sạch 100%" — đầy đủ tại `plans/marketing-context.md` §3.2 |
| **Không emoji** | Caption, phụ đề, overlay, CTA đều không dùng emoji. Dùng bullet `•` hoặc icon đồ hoạ trong canvas |
| **Unicode sạch** | `Iodine ≥ 950 mg/g`, `BET ≥ 1.050 m²/g`, `1.200 m³/ngày` — không dùng LaTeX thô |
| **Hotline** | Luôn ghi `0900.000.000` |
| **CTA** | Theo CTA Matrix nhóm A/B/C tại `marketing-context.md` §3.3 |
| **QA** | Kịch bản và caption B2B qua `b2b-sale-manager` duyệt trước khi đăng |

---

## 3. Quy Chuẩn Đa Góc Máy B-Roll & Visual Assets (`wiki/media/`)

### A. Quy Tắc Phân Bổ Góc Quay Cho Mỗi Scene (Pacing 2.5 - 3.5s / Shot)
Mỗi phân cảnh trong kịch bản bắt buộc khai báo tối thiểu 2–3 hình ảnh B-roll đại diện cho các góc máy:
* **Góc 1 (Master / Wide Shot)**: Toàn cảnh hiện trường (Nhà máy, xưởng sơn, tháp xử lý khí, tổng kho hàng trăm tấn).
* **Góc 2 (Medium / Detail Shot)**: Cận cảnh sản phẩm/vật liệu (Khối than tổ ong 100x100x100mm, cấu trúc kênh khí, dải hạt than gáo dừa 3x6 / 6x12 mesh đều tăm tắp, bao bì đóng gói 25kg nguyên seal).
* **Góc 3 (Macro / Action / Proof Shot)**: Thao tác thực tế & chứng minh khoa học (Bọt khí sủi cuồn cuộn trong nước nóng, nước tím I-ốt biến mất trong 10 giây, máy đo lưu lượng gió, chứng thư CO/CQ Form AI & Quatest 3).

### B. Tra Cứu Ảnh Nhanh Từ 10 Cụm Chủ Đề (`image-sitemap.md`):
1. **Than Gáo Dừa & Trà Bắc**: `wiki/media/downloads/than-gao-dua-tra-bac/` (*120 ảnh*).
2. **Than Nhập Khẩu (Ấn Độ, Kalimati, Modi, Indiac)**: `wiki/media/downloads/than-nhap-khau-an-do/` (*117 ảnh*).
3. **Than Tổ Ong & Buồng Sơn, Khí Thải VOCs**: `wiki/media/downloads/vat-lieu-loc-khi-to-ong/` (*181 ảnh*).
4. **Cát Thạch Anh & Sỏi Đa Tầng**: `wiki/media/downloads/cat-soi-thach-anh/` (*133 ảnh*).
5. **Cát Mangan & Vật Liệu Khử Phèn, Sắt MQ7**: `wiki/media/downloads/cat-mangan-khu-phen/` (*97 ảnh*).
6. **Hạt Nhựa Ion Purolite/Indion & Khử Khoáng**: `wiki/media/downloads/hat-nhua-trao-doi-ion/` (*38 ảnh*).
7. **Hóa Chất PAC 30% & Trợ Lắng Keo Tụ PAM**: `wiki/media/downloads/hoa-chat-xu-ly-nuoc/` (*34 ảnh*).
8. **Màng Lọc RO Filmtec/LG, Vỏ Cột Composite, Đèn UV**: `wiki/media/downloads/thiet-bi-phu-kien-loc/` (*45 ảnh*).
9. **Dự Án, Tổng Kho & Xe Bốc Hàng Xuyên Việt**: `wiki/media/downloads/du-an-kho-bai-xuyen-viet/` (*448 ảnh*).

---

## 4. Tích Hợp VieNeu TTS API & Phiên Âm Chuẩn Kỹ Thuật

### A. Credentials & Voice Presets
Cấu hình tại **`.agents/.env`** (`VIENEU_TTS_TOKEN`):
* 🎙️ **`Tuấn Huy`** *(Engine `v4`)*: **Khuyến nghị số 1 cho video kỹ thuật/công nghiệp**. Giọng nam miền Bắc trầm ấm, dứt khoát, phong thái chuyên gia tư vấn dự án lớn.
* 🎙️ **`Trọng Nghĩa`** *(Engine `v3`)*: Giọng nam miền Nam gần gũi, chân thực, cực hợp video review kho bãi, thử nghiệm xưởng thực tế.
* 🎙️ **`Bảo Khánh`** *(Engine `v4`)*: Giọng nam trầm, phong cách phóng sự hồ sơ năng lực doanh nghiệp.

### B. Quy Tắc Phiên Âm Bắt Buộc (Chống Đọc Lỗi):
```javascript
VOCs / VOC       -> "V-O-C"
Iodine           -> "I-o-đin"
CTC              -> "C-T-C"
EBCT             -> "E-B-C-T"
Pa               -> "Pát-xcan"
QCVN 20          -> "quy chuẩn Q-C-V-N hai mươi"
ASTM D4607       -> "tiêu chuẩn A-S-T-M D bốn sáu không bảy"
0900.000.000     -> "không chín không ba, không một tám, một ba năm"
example.com -> "than hoạt tính chấm net"
```

---

## 5. Kiến Trúc Canvas & Remotion Motion Design

### 💎 5-Layer Stack Đạt Chuẩn Điện Ảnh:
* **Layer 1: `<BgMesh />`**: Nền gradient tối radial chuyển động mềm mại (`#16382a` $\rightarrow$ `#080e0b`).
* **Layer 2: Multi-Shot B-Roll Switcher**: Tự động hoán đổi giữa 2–3 hình ảnh góc máy thực tế với Ken Burns pan/zoom nhẹ, có nhãn HUD chỉ báo góc máy (`GÓC 1: HIỆN TRƯỜNG`, `GÓC 2: CẬN CẢNH KẾT CẤU`).
* **Layer 3: `<GradeOverlay />`**: Lớp gradient cinema chuyển tiếp quang học giúp chữ và thông số luôn sắc nét và tương phản cao.
* **Layer 4: UI & Typography**:
  - **Header**: Progress Bar phân đoạn + Badge cảnh báo + Headline giật tít màu vàng hoàng gia `#FFE082` + Tech Stamp (`JetBrains Mono`).
  - **Center Viewport**: Mở rộng 100% để hiển thị video/hình ảnh.
  - **Lower-Third Tech HUD**: Thẻ thông số kỹ thuật bán trong suốt với các chỉ số đo lường (`99% Khử mùi`, `Iodine ≥ 950 mg/g`, `ΔP < 500 Pa`).
  - **Bottom Brand Bar**: Huy hiệu thương hiệu gắn sẵn Logo Enterprise Corp + Hotline + Nút CTA.
* **Layer 5: `<FilmGrainAndVignette />`**: Độ hạt phim nhẹ + viền tối quang học tạo chiều sâu điện ảnh chân thật.

---

## 6. Hướng Dẫn Thực Thi CLI (`scripts/`)

### A. Tạo Video Kịch Bản Đa Góc Máy & Giọng Đọc VieNeu
```bash
# 1. Tạo video ngắn Than Tổ Ong (5 scenes, 15 góc quay B-Roll)
node scripts/generate-video-short.js --topic="than-to-ong" --voice="Tuấn Huy" --engine="v4" --tts

# 2. Tạo video Thí nghiệm Than Gáo Dừa Sôi Sục EXP-01 (4 scenes, 12 góc quay B-Roll)
node scripts/generate-video-short.js --topic="exp-01-than-gao-dua" --voice="Tuấn Huy" --engine="v4" --tts

# 3. Tạo video Than Ấn Độ Kalimati/Modi Bảo Vệ Màng RO
node scripts/generate-video-short.js --topic="than-an-do" --voice="Tuấn Huy" --engine="v4" --tts
```

### B. Render Video MP4 Full HD (1080x1920 @ 30 FPS) Bằng Puppeteer & FFmpeg
```bash
# Render video Than Tổ Ong hoàn chỉnh có multi-angle b-roll + logo + audio
node scripts/render-remotion-video.js

# Render video Thí nghiệm EXP-01 Than Gáo Dừa
node scripts/render-exp-01-video.js
```

---

## 7. Cấu Trúc File Thành Phẩm (`wiki/video-scripts/`)
* 🎬 `short-video-than-to-ong.mp4`: Video dọc 9:16 Full HD hoàn chỉnh xuất xưởng.
* 🎙️ `voiceover-than-to-ong.mp3`: File âm thanh giọng đọc VieNeu TTS chất lượng cao.
* 🌐 `short-video-than-to-ong.html`: Trình chiếu tương tác Storyboard đa góc máy trên trình duyệt.
* 🖼️ `logo-xuyen-viet.png`: File logo chính thức của Công ty Enterprise Corp.
* 📁 `images/` & `images-exp01/`: Thư mục chứa các góc máy B-Roll chụp thực tế.
* 📊 `tiktok-performance-log.md`: Nhật ký đo hiệu quả theo tháng (xem §8 và `references/tiktok-distribution.md` §7).

---

## 8. Đo Lường Hiệu Quả

### A. Chỉ Số Nội Bộ (thứ tự ưu tiên thật)
Xếp theo mức độ gần doanh thu, **không xếp theo lượt xem**:

| # | Chỉ số | Cách đo |
|---|---|---|
| 1 | **Lead thật** | Số hội thoại Zalo OA + cuộc gọi hotline quy được về video (mã/đường dẫn riêng theo chiến dịch) |
| 2 | **Tỷ lệ xem hết (completion rate)** | Tín hiệu xếp hạng mạnh nhất; dùng để chấm điểm 6 khuôn hook |
| 3 | **Lưu & chia sẻ** | Đại diện cho giá trị kỹ thuật thực; quan trọng hơn lượt thích với tệp B2B |
| 4 | **Bình luận kỹ thuật** | Số câu hỏi chuyên môn — chứng tỏ đã chạm đúng người vận hành |
| 5 | **Lượt xem** | Chỉ số hư danh, chỉ dùng để so sánh tương đối giữa các hook |

### B. Benchmark Tham Chiếu (nguồn ngoài, không phải cam kết)
Số liệu TikTok toàn cầu ngành tiêu dùng, dùng làm mốc so sánh khi kênh chưa có dữ liệu nền của chính mình:

- Tỷ lệ tương tác: **8%+** được coi là tốt (trung bình ngành ~**5.96%**).
- Tỷ lệ xem hết nội dung thương hiệu: **70%+**.
- ROI hợp tác creator: **4:1**.

**Cảnh báo:** đây là benchmark kênh tiêu dùng phương Tây. Kênh vật tư công nghiệp B2B tiếng Việt có tệp hẹp hơn nhiều — lượt xem thấp hơn nhưng giá trị mỗi lead cao hơn. **Không lấy các số này làm KPI cam kết**; sau 8–12 tuần hãy thay bằng đường nền đo thực của chính kênh.

### C. Vòng Lặp Tối Ưu
Mỗi tháng: đọc `wiki/video-scripts/tiktok-performance-log.md` → xếp hạng 6 khuôn hook theo completion rate thực đo → tăng tỷ trọng 2 khuôn tốt nhất, loại khuôn kém nhất → ghi lại thay đổi thuật toán quan sát được.

---

## 9. Quan Hệ Với Các Tài Nguyên Khác (Không Trùng Lặp)

| Thuộc về | Tài nguyên | Không xử lý trong skill này |
|---|---|---|
| Pipeline 6 phase script → voiceover → visuals → edit → render → distribute | `.claude/workflows/video-workflow.md` (`/mk:video`, agent `video-producer`) | Điều phối phase |
| Thư viện component Remotion, palette, typography | `remotion-motion-graphics/SKILL.md` + `references/` | Code component |
| Lịch nội dung, ý tưởng video theo chiến dịch, mục tiêu kênh | `plans/campaigns/global/social-omnichannel/` | Đăng gì vào ngày nào |
| Ma trận tái sử dụng 1 pillar → đa kênh | `CLAUDE.md` §4 | Định nghĩa lại ma trận |
| Đặt giá thầu, tệp đối tượng, đo chuyển đổi quảng cáo | `mk:ads` + `ads/SKILL.md` | Vận hành ad account |
| Giọng thương hiệu, từ cấm, CTA Matrix | `plans/marketing-context.md` §3 | Định nghĩa lại giọng |
| Đơn giá sản phẩm | `wiki/crm/products/amis-products.json` (MISA AMIS CRM) | Tự sinh giá |
