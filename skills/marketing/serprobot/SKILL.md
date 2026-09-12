---
name: serprobot
description: SERP Robot API Integration — Tự động theo dõi thứ hạng từ khóa Google, trích xuất báo cáo SERP hàng ngày/tuần, phát hiện biến động thứ hạng (Rank Tracking) và đối chiếu Silo Pillar qua serprobot.com REST API v1.
---

# SERP Robot Rank Tracking & Reporting (SKILL)

## 1. Mục Đích & Khả Năng
Skill này cung cấp cơ chế tự động kết nối và trích xuất dữ liệu thứ hạng từ **SERP Robot REST API v1** (`https://api.serprobot.com/v1/api.php`) cho website **example.com** (và các dự án liên quan như Vatlieuloc, MoitruongxuyenViet).

### Các năng lực cốt lõi:
1. **Trích xuất báo cáo tự động (Zero-Cost Reports)**: Lấy toàn bộ biến động thứ hạng, vị trí hiện tại, vị trí tốt nhất (Best Position), URL đang rank và search volume mà không tốn credit.
2. **Tổng hợp đa dự án**: Tự động gộp dữ liệu từ cả 2 project trọng điểm:
   - Project ID `4955904`: **example.com** (Lọc nước, than gáo dừa, vật liệu lọc).
   - Project ID `5040040`: **Xử lý khí thải** (Tháp hấp phụ, than tổ ong, lọc khí).
3. **Phân tích sức khỏe SEO & Phân bố thứ hạng**:
   - Thống kê tỷ lệ theo từng bucket: Top 1–3, Top 4–10, Top 11–20, Top 21–50, Top 51–100, Out Top 100.
   - Nhận diện Top Gainers (từ khóa bứt phá) và Top Losers (từ khóa sụt giảm cần tối ưu lại).
4. **Đối chiếu độ phủ từ khóa Silo Pillar**:
   - Tự động so sánh danh sách từ khóa đang track với 597 từ khóa trong `plans/marketing/seo-content/keyword-map.json` để đề xuất bổ sung các từ khóa Cấp 1 / HUB chưa được monitor.
5. **Live SERP Check & Top 100 Search**: Hỗ trợ kiểm tra thứ hạng tức thì (On-demand Rank Check) và cào Top 100 SERP URLs của đối thủ.

---

## 2. Cấu Hình & Credentials
Toàn bộ thông tin xác thực được quản lý tập trung tại **`.agents/.env`**:
```env
SERPROBOT_API_KEY=bb4512408579b75942616fd51d93976a
SERPROBOT_PROJECT_ID=4955904
```

---

## 3. Hướng Dẫn Thực Thi CLI (`scripts/fetch-serprobot.js`)

### A. Lấy Báo Cáo Thứ Hạng Tổng Hợp (Thường Dùng Nhất)
```bash
# Quét toàn bộ từ khóa example.com (gộp cả 2 project lọc nước & khí thải), xuất báo cáo Markdown và JSON
node scripts/fetch-serprobot.js

# Xem biến động thứ hạng trong 30 ngày qua
node scripts/fetch-serprobot.js --start=30daysAgo

# Tải báo cáo cho 1 dự án cụ thể
node scripts/fetch-serprobot.js --project=4955904      # example.com
node scripts/fetch-serprobot.js --project=5040040      # Xử lý khí thải
node scripts/fetch-serprobot.js --project=4962834      # example.net

# Tải và tổng hợp tất cả các dự án trong tài khoản
node scripts/fetch-serprobot.js --all
```

### B. Quản Lý & Tra Cứu Dự Án / Credits
```bash
# Xem danh sách tất cả projects trong tài khoản SERP Robot kèm ID
node scripts/fetch-serprobot.js --projects

# Kiểm tra số credit API còn lại trong tài khoản
node scripts/fetch-serprobot.js --credits

# Xem lịch sử thứ hạng & đối thủ chi tiết của 1 từ khóa cụ thể
node scripts/fetch-serprobot.js --keyword-id=85651446
```

### C. Live Rank Check & Phân Tích Đối Thủ (Tốn 1 Credit/lần)
```bash
# Kiểm tra trực tiếp thứ hạng live của 1 từ khóa trên domain
node scripts/fetch-serprobot.js --rank-check --kw="than hoạt tính gáo dừa" --url="example.com"

# Lấy danh sách Top 100 kết quả Google cho 1 từ khóa
node scripts/fetch-serprobot.js --get-serps --kw="cách chọn than hoạt tính lọc nước"
```

---

## 4. Cấu Trúc File Dữ Liệu & Báo Cáo Đầu Ra

Khi chạy script, hệ thống tự động sinh 2 file tại `plans/marketing/reports/`:
1. **`plans/marketing/reports/serp-report-YYYY-MM-DD.md`**:
   - Bảng phân bố thứ hạng thực tế (Top 3, Top 10, Top 20, Top 50, Top 100, Out).
   - Danh sách Top 35 từ khóa đang giữ thứ hạng cao nhất kèm link URL thực tế.
   - Bảng xếp hạng Top Gainers (tăng trưởng mạnh) & Top Losers (sụt giảm).
   - Danh sách Top 20 từ khóa Cấp 1 / HUB đề xuất bổ sung vào công cụ theo dõi.
2. **`plans/marketing/reports/serp-baseline-YYYY-MM-DD.json`**:
   - Dữ liệu cấu trúc JSON chứa đầy đủ thuộc tính của từng từ khóa phục vụ phân tích tự động hoặc vẽ biểu đồ.

---

## 5. Quy Trình Phân Tích & Ra Quyết Định SEO (Action Framework)

Khi nhận được báo cáo SERP Robot, Agent thực hiện các hành động theo ma trận sau:

| Vị trí Thứ Hạng | Tình Trạng | Hành Động Kỹ Thuật Cần Thực Hiện |
|---|---|---|
| **Top 1 – 3** | Chiếm lĩnh CTR tối đa | Giữ vững vị thế, tối ưu Rich Snippets / Schema FAQPage, cập nhật nội dung định kỳ mỗi 90 ngày. |
| **Top 4 – 10** | Trang 1 Google | Bổ sung 3 – 5 Internal Links chất lượng cao từ các bài viết vệ tinh (Silo Tier 3/4) trỏ về với anchor text biến thể. |
| **Top 11 – 20** | Trang 2 Google | Audit lại Heading H2/H3, bổ sung hình ảnh thực tế từ `wiki/media/`, bổ sung bảng thông số kỹ thuật ASTM/AWWA từ `wiki/knowledge/`. |
| **Top 21 – 50** | Bắt đầu nhận diện | Kiểm tra Search Intent xem bài viết đã đáp ứng đúng nhu cầu B2B chưa, tăng độ sâu bài viết lên >1.500 từ. |
| **Top 51 – 100** | Xếp hạng thấp | Kiểm tra nguy cơ Cannibalization (ăn thịt từ khóa) giữa các bài viết trong site. |
| **Out Top 100** | Chưa xếp hạng | Kiểm tra trạng thái Google Indexing (`node scripts/submit-google-indexing.js <url>`), kiểm tra canonical và thẻ meta. |

---

## 6. Lập Trình Module (API Integration trong Node.js)
Script có thể được import trực tiếp vào các module tự động hóa khác:
```javascript
const {
  listProjects,
  getProject,
  getKeyword,
  getProjectReport,
  getCredit,
  rankCheck,
  getSerps,
  generateSerpReport
} = require('../scripts/fetch-serprobot');

// Ví dụ: Lấy báo cáo và đọc kết quả
async function run() {
  const { summaryJson, mdReportPath } = await generateSerpReport(['4955904', '5040040']);
  console.log('Top 3 count:', summaryJson.rankingDistribution.Top3);
}
```
