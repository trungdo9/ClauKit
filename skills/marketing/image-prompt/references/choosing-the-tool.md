# Choosing the Tool — Cây Quyết Định Công Cụ Tạo Hình Ảnh (F&B Marketing)

> Định tuyến nhu cầu hình ảnh đến đúng công cụ thực thi tối ưu nhất trong hệ sinh thái Career F&B & AAU Academy.

---

## 🌳 Cây Quyết Định Theo Nhu Cầu Cốt Lõi (Dominant Requirement)

| Nhu cầu hình ảnh | Công cụ chỉ định | Lý do & Ưu thế vượt trội |
|---|---|---|
| **Cần chữ tiếng Việt chuẩn dấu (Hero, Infographic, Quy trình SOP)** | ⭐ **`gpt-image-vi`** (`scripts/gen-image.py` dùng `gpt-image-2`) | **Pipeline nội bộ số 1**: Vẽ chữ tiếng Việt chính xác 100% dấu, tự động nén WebP ≤ 960px (chỉ 11–75KB), tiết kiệm 80% token ở mode `medium`, tích hợp sẵn sidecar `.json` để kiểm soát chi phí. |
| **Biểu đồ số liệu chính xác (Class C: % Cost, Doanh thu, Cột/Tròn)** | 🚫 **Mã nguồn SVG xác thực** | Tránh sai lệch tỉ lệ đồ họa do AI sinh ra. Đảm bảo tính minh bạch dữ liệu theo Luật 1. |
| **Không gian quán thật, đội ngũ nhân sự thật, món ăn thực đơn** | 📸 **Ảnh chụp thực tế (Real Photo)** | Xây dựng uy tín và lòng tin thương hiệu tuyệt đối. Tuyệt đối không dùng AI giả mạo cơ sở hay nhân viên có thật. |
| **Báo cáo DSR, Màn hình POS, Bảng tính P&L thực tế** | 💻 **Ảnh chụp màn hình (Screenshot)** | Bằng chứng thực tế trực quan và thuyết phục nhất cho các bài cẩm nang vận hành. |
| **Ảnh chia sẻ từ học viên / cộng đồng F&B (~9.400 mems)** | 👥 **UGC có cấp phép (Consent)** | Khai thác tài sản cộng đồng chân thực, minh bạch. |
| **Icon, Huy hiệu, Minh họa vector tối giản** | 🎨 **Recraft / SVG** | Đảm bảo độ sắc nét vector tuyệt đối ở mọi kích thước hiển thị. |
| **Video ngắn minh họa, motion graphics (Reels/Shorts/TikTok)** | 🎬 **Veo / Remotion / Video Producer** | Chuyển tiếp tới pipeline sản xuất video ngắn. |

---

## ⚙️ Quy Trình Thực Thi Tại Repo Này

Trong toàn bộ workspace này, khi bạn cần sinh ảnh có chữ tiếng Việt chuẩn dấu và tối ưu web tự động:
👉 **Chuyển thẳng sang skill [[gpt-image-vi]] và gọi CLI `scripts/gen-image.py`**:

```bash
# Sinh 1 ảnh với preset chuẩn (hero, flow, diagram, og)
python3 scripts/gen-image.py single \
  --prompt "..." \
  --out wiki/aau.vn/images/<slug>/hero.png \
  --preset hero
```

- Không cần phỏng đoán hay chuyển qua các công cụ trung gian bên ngoài.
- `scripts/gen-image.py` tự động xử lý API OpenAI, kết xuất định dạng 1536×1024 hoặc 1024×1024, tự động resize và nén sang định dạng WebP hiện đại đạt chuẩn Core Web Vitals của Google.
