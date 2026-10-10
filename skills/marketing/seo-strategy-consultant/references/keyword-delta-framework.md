# Khung Đo Lường & Tính Toán Biến Động Từ Khóa (Keyword Delta Framework)

Tài liệu tham chiếu phương pháp luận dành cho Chuyên Viên Tư Vấn Chiến Lược SEO & Marketing.

---

## 1. Công Thức Đo Lường & Quy Ước Kỹ Thuật

### 1.1. SERP Rank Delta (Độ Lệch Thứ Hạng Tìm Kiếm)

$$\Delta Rank = Rank_{kỳ\_trước} - Rank_{kỳ\_này}$$

- **Quy ước dấu:**
  - $\Delta > 0$: **Cải thiện thứ hạng (Tăng bậc)**. Ví dụ: từ #34 lên #9 $\rightarrow \Delta = 34 - 9 = +25$ 🔺.
  - $\Delta < 0$: **Tụt hạng (Giảm bậc)**. Ví dụ: từ #11 tụt xuống #30 $\rightarrow \Delta = 11 - 30 = -19$ 🔻.
  - $\Delta = 0$: **Đi ngang (Không đổi)**.
- **Quy ước vị trí ngoài Top 100 (Out of Range):**
  - Gán giá trị tượng trưng: `101` (để tính toán định lượng).
  - Từ khóa mới vào Top 50 từ vị trí Out: $\Delta = 101 - 50 = +51$ 🔺.
  - Từ khóa rớt khỏi Top 100 từ vị trí #65: $\Delta = 65 - 101 = -36$ 🔻.

### 1.2. Trend Momentum Delta (Độ Lệch Đà Tìm Kiếm Google Trends)

$$\text{Momentum (\%)} = \frac{\bar{X}_{4\text{ tuần gần nhất}} - \bar{X}_{12\text{ tuần trước}}}{\bar{X}_{12\text{ tuần trước}}} \times 100\%$$

- **🚀 BREAKOUT (Bứt phá):** $\text{Momentum} \ge +50\%$. Nhu cầu thị trường bùng nổ đột biến.
- **📈 RISING (Đang tăng):** $+15\% \le \text{Momentum} < +50\%$. Xu hướng tăng trưởng vững chắc.
- **➖ STABLE (Đi ngang):** $-15\% < \text{Momentum} < +15\%$. Nhu cầu cốt lõi ổn định.
- **📉 DECLINING (Suy giảm):** $\text{Momentum} \le -15\%$. Cần đối chiếu tách chu kỳ mùa vụ.
- **❔ UNKNOWN (Thiếu dữ liệu):** Dữ liệu mẫu Google Trends quá mỏng để nội suy (tuyệt đối không bịa số).

---

## 2. Ma Trận Giao Thoa SERP $\times$ Trends (Opportunity-Threat Matrix)

Kết hợp cả 2 nguồn tín hiệu Phía Cung (SERP Robot) và Phía Cầu (Google Trends):

```
                       XU HƯỚNG TÌM KIẾM (GOOGLE TRENDS)
                   TĂNG NHIỆT (Breakout / Rising)      SUY GIẢM / ĐI NGANG
              ┌─────────────────────────────────────┬────────────────────────────────────┐
     TOP 1-10 │  🏆 VỊ THẾ VÀNG (CASH COW)           │  🛡️ PHÒNG NGỰ THỤ ĐỘNG             │
   (Trang 1)  │  • Hành động: Thu hoạch leads, đẩy   │  • Hành động: Duy trì chất lượng,  │
              │    chuyển đổi CRO, Schema Product   │    không hoảng loạn, giữ chân Top  │
THỨ HẠNG      ├─────────────────────────────────────┼────────────────────────────────────┤
SERP          │  ⚡ CƠ HỘI BỨT PHÁ P0 (HIGH PRIORITY)│  ⚠️ VÙNG CHỜ / CẮT GIẢM             │
   TOP 11-100 │  • Hành động: Cập nhật bài cũ gấp,  │  • Hành động: Gom cụm bài viết,     │
   & OUT TOP  │    bơm internal link, đón đầu sóng   │    tối ưu chi phí, tập trung Silo  │
              └─────────────────────────────────────┴────────────────────────────────────┘
```

---

## 3. Các Bẫy Sai Lệch Dữ Liệu Cần Cảnh Báo (Data Traps)

1. **Bẫy thay đổi danh mục giám sát (Monitoring Set Fluctuation Trap):**
   - Khi số lượng từ khóa trong SERP Robot thay đổi (ví dụ từ 1 từ lên 19 từ), số lượng từ khóa Out Top 100 tăng vọt. Đây là do *thay đổi danh mục*, KHÔNG phải hiệu năng SEO bị tụt dốc. Bắt buộc tách bạch từ khóa đối chiếu (có mặt ở cả 2 kỳ).
2. **Bẫy biến động tạm thời (Google Testing / SERP Dance):**
   - Google thường xuyên tráo đổi vị trí trong vòng 24 - 48h để thử nghiệm CTR người dùng. Đừng vội vàng sửa toàn bộ trang đích khi một từ khóa chỉ tụt 1 - 2 bậc trong 1 ngày.
3. **Bẫy phân mảnh URL có dấu / không dấu (Diacritics URL Cannibalization):**
   - WordPress WooCommerce đôi khi sinh ra 2 URL cho cùng một sản phẩm/bài viết (một URL chuẩn ASCII slug, một URL Unicode có dấu hoặc có tham số truy vấn). Cần dùng Canonical chuẩn hóa triệt để.
