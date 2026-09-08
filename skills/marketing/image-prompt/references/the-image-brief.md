# The Image Brief — Hướng Dẫn Lập Brief Hình Ảnh (F&B Việt Nam)

> Trước khi viết bất kỳ câu lệnh prompt nào, bạn phải xác định chính xác hình ảnh này giải quyết vấn đề gì. Một prompt không có brief sẽ tạo ra một hình ảnh lung linh nhưng vô nghĩa.

---

## 🚪 Bước 0: Chạy Cổng Đánh Giá (The Gate) — Có Nên Dùng AI Không?

AI tạo sinh chỉ là một công cụ, không phải sự lựa chọn bắt buộc. Trong lĩnh vực F&B tại Việt Nam, sự chân thật (authenticity) quyết định niềm tin của ứng viên (ICP-A) và chủ nhà hàng/chuỗi (ICP-B):

1. **Ảnh chụp thực tế (Real Photo):**
   - Không gian quán thực tế, đội ngũ nhân viên thực tế, đĩa thức ăn/ly nước thực tế.
   - 🚫 **Tuyệt đối không dùng AI để ngụy tạo hình ảnh của một cơ sở kinh doanh hay con người có thật.** Ví dụ: khi giới thiệu chi nhánh của một chuỗi đối tác, bắt buộc phải dùng ảnh chụp thực địa.
2. **Ảnh chụp màn hình thực tế (Screenshots):**
   - Giao diện bảng tính Prime Cost thực tế, màn hình POS iPOS/CukCuk, báo cáo DSR ngày, tin nhắn review của khách hàng. Rất thuyết phục và trung thực.
3. **Nội dung do người dùng tạo (UGC):**
   - Ảnh chụp bài tập thực hành của học viên AAU Academy, ảnh chia sẻ trong *Group Cộng đồng F&B Việt Nam (~9.400 thành viên)* — bắt buộc có lưu vết đồng ý (consent).
4. **Biểu đồ số liệu chính xác (Class C):**
   - Biểu đồ tròn cơ cấu Food Cost, biểu đồ cột tỉ lệ nhảy việc F&B — **bắt buộc dựng bằng SVG**. 🚫 Cấm dùng AI vẽ biểu đồ mang số.

👉 **KHI NÀO DÙNG AI GENERATION:**
- Minh họa các khái niệm nghiệp vụ trừu tượng: quy trình Figure-8 Walk, ma trận Menu Engineering, luồng bếp một chiều HACCP, lộ trình thăng tiến 4 cấp.
- Ảnh bìa (Hero Image) bài viết cẩm nang theo đúng chuẩn nhận diện thương hiệu khi không có sẵn ảnh chụp đạt chuẩn.
- Sơ đồ quy trình (Class B/B′) cần nhãn chữ tiếng Việt chuẩn xác từng dấu.

---

## 📋 Bước 1: Trả Lời 4 Câu Hỏi Lập Brief

Neo chặt vào `plans/marketing-context.md` để trả lời:

### 1. Mục đích hình ảnh (Job / Purpose)
- **Stop-scroll Hero:** Giữ chân người đọc khi lướt feed Facebook/Group, tạo cảm giác chuyên nghiệp cho bài cẩm nang aau.vn.
- **Sơ đồ vận hành (Explainer / Process Flow):** Minh họa trực quan các bước làm việc (Class B/B′) như quy trình tiếp nhận kho FIFO, checklist mở ca.
- **Visual tuyển dụng:** Thể hiện môi trường làm việc chuẩn chỉnh của một vị trí trong 60 job categories (Barista, Phụ bếp, Cửa hàng trưởng).
- **Background / Overlay Base:** Ảnh nền có không gian âm để chèn chữ tiêu đề trên Canva/Photoshop.
- **OpenGraph Card (OG):** Ảnh hiển thị khi chia sẻ link bài viết lên mạng xã hội.

### 2. Thông điệp duy nhất cần truyền tải (The One Thing)
Một hình ảnh chỉ nên nói lên **MỘT ý niệm cốt lõi**. Nếu muốn nói 5 ý, bức ảnh sẽ trở nên hỗn loạn.
*(Ví dụ: "Sự tập trung và tỉ mỉ của đầu bếp khi cân định lượng nguyên liệu trên cân điện tử inox" — không nhồi nhét thêm khách ăn, phục vụ bàn, thu ngân).*

### 3. Định dạng & Tỉ lệ khung hình (Format & Aspect Ratio)
- `16:9` (1536×1024): Hero bài viết blog, OpenGraph card.
- `4:5` (1024×1280): Ảnh dọc đơn lẻ trên bảng tin Facebook mobile.
- `1:1` (1024×1024): Sơ đồ ma trận 2×2, bài đăng đa ảnh.
- `9:16`: Facebook Story, Reels Cover.

### 4. Bản sắc nhận diện & Bối cảnh bản địa (Brand Look & Local Context)
- Màu sắc: Tone ấm của gỗ sồi kết hợp inox xám bạc sáng bóng, điểm nhấn xanh lá cây thảo mộc/rau củ nhiệt đới.
- Nhân vật: 100% người Việt Nam/Châu Á, trang phục bảo hộ/tác phong chuẩn chỉnh theo khí hậu nhiệt đới gió mùa.
- Không gian: Nhà hàng, quán cafe đương đại tại Việt Nam (thoáng đãng, nhiều ánh sáng tự nhiên, sạch bóng đạt chuẩn 5S).

---

## 📤 Đầu Ra Của Bước Brief

Đúc kết thành một câu brief cô đọng trước khi viết prompt:

> *"[Mục đích] cho [Vị trí/Kênh, Tỉ lệ], truyền tải [Thông điệp duy nhất], theo [Bản sắc F&B Việt Nam]."*

Từ brief này, chuyển sang `prompt-anatomy.md` để xây dựng câu lệnh chi tiết và chuyển tới `choosing-the-tool.md` (hoặc [[gpt-image-vi]]) để thực thi.
