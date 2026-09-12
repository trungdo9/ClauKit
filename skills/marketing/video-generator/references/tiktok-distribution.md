<!-- Adapted from https://github.com/msitarzewski/agency-agents@6d58ad4:marketing/marketing-tiktok-strategist.md (MIT) -->

# Tham Chiếu: Phân Phối & Tối Ưu Thuật Toán TikTok / Reels / Shorts

Tài liệu chi tiết cho §2 của `SKILL.md`. Đọc file này khi cần thư viện hook, bộ hashtag, khung hợp tác creator, format quảng cáo hoặc quy trình xử lý khủng hoảng bình luận.

**Tài liệu này KHÔNG lặp lại:** quy trình sản xuất (xem `SKILL.md` §3–§7) · pipeline 6 phase script→distribute (xem `.claude/workflows/video-workflow.md`) · danh sách ý tưởng video theo chiến dịch (xem `plans/campaigns/global/social-omnichannel/master-campaign-plan.md`).

---

## 1. Thư Viện Hook 3 Giây (Giọng Kỹ Sư Hiện Trường)

Hook quyết định completion rate — chỉ số thuật toán quan trọng nhất. Toàn bộ hook phải giữ đúng văn phong đã chốt tại `SKILL.md` §1.5: bộc trực, hiện trường, không sáo rỗng.

### A. 6 Khuôn Hook Đã Chuẩn Hóa

| Khuôn | Cơ chế | Mẫu áp dụng |
|---|---|---|
| **Phủ định niềm tin sai** | Pattern interrupt bằng mâu thuẫn | "Than gáo dừa Iodine 500 mà đem lọc nước thải công nghiệp — sai hoàn toàn." |
| **Tổn thất bằng số** | Gắn thiệt hại tài chính cụ thể | "Thay nhầm cấp than, một tháng nhà máy đốt thêm 14 triệu tiền vật tư." |
| **Thử nghiệm tức thì** | Hiển thị kết quả vật lý trong 3 giây đầu | "Thả vào cốc nước 80 độ. Bọt khí cuồn cuộn thế này mới là than hoạt hóa thật." |
| **Câu hỏi hiện trường** | Nhắm đúng nỗi đau người vận hành | "Bồn lọc mới thay than 2 tháng đã nghẹt áp. Vấn đề không nằm ở than." |
| **Đối chiếu A/B** | Hai mẫu đặt cạnh nhau | "Bên trái than Trà Bắc, bên phải than Ấn Độ Kalimati. Khác nhau chỗ nào?" |
| **Chứng thư** | Bằng chứng khách quan | "Đây là phiếu Quatest 3 của lô hàng tuần này. Iodine đo được 1.012 mg/g." |

### B. Cấu Trúc 5 Nhịp Cho Video 45–60 Giây

| Nhịp | Thời lượng | Nội dung | Ghi chú thuật toán |
|---|---|---|---|
| Hook | 0 – 3s | 1 trong 6 khuôn trên, kèm B-roll góc Macro/Action | Quyết định lượt bỏ qua |
| Bối cảnh | 3 – 10s | Nêu tình huống thật tại nhà máy/hộ gia đình | Giữ chân bằng sự đồng cảm |
| Chứng minh | 10 – 35s | Thí nghiệm, số đo, chuyển 2–4 góc B-roll (mỗi 2.5–3.5s) | Nhịp cắt giữ attention |
| Kết luận | 35 – 50s | Quy tắc chọn vật tư rút ra được | Giá trị mang đi → tăng lưu/chia sẻ |
| CTA | 50 – 60s | Theo `marketing-context.md` §3.3 (CTA Matrix A/B/C) | Không nhồi CTA vào 10 giây đầu |

### C. Kỹ Thuật Tăng Completion & Rewatch

- **Loop kín:** khung hình cuối trùng khung hình đầu → người xem xem lại không nhận ra đã hết.
- **Trả lời trễ:** đặt câu hỏi ở giây 3, đáp án ở giây 40. Không tiết lộ sớm.
- **Neo thông số:** số đo chỉ hiện trên Lower-Third Tech HUD (`SKILL.md` §5 Layer 4), không đọc rời — người xem phải nhìn màn hình.
- **Mồi bình luận:** kết bằng câu hỏi kỹ thuật mở ("Nhà máy anh em đang chạy EBCT bao nhiêu phút?") để đẩy engagement velocity trong giờ đầu.

---

## 2. Bộ Hashtag Theo Phân Khúc (5–8 thẻ / video)

Công thức: **2 thẻ ngành rộng + 3 thẻ niche + 1 thẻ thương hiệu + 1–2 thẻ xu hướng đang chạy**.

| Phân khúc | Thẻ ngành rộng | Thẻ niche | Thẻ thương hiệu |
|---|---|---|---|
| **B2B** (kỹ sư, mua hàng KCN, nhà thầu) | `#xulynuocthai` `#vatlieuloc` | `#thanhoattinh` `#xulykhithai` `#bonloccongnghiep` | `#moitruongxuyenviet` |
| **B2C** (gia đình, giếng khoan, bể cá) | `#locnuoc` `#meovatgiadinh` | `#nuocgiengkhoan` `#khumui` `#becacanh` | `#moitruongxuyenviet` |
| **C2C** (cộng đồng trao đổi vật tư) | `#hoinghenuoc` `#thonuoc` | `#thanhlyvattu` `#kinhnghiemvanhanh` | `#moitruongxuyenviet` |

**Quy tắc:** không nhồi quá 8 thẻ · không dùng thẻ không liên quan để câu view · thẻ xu hướng chỉ dùng khi nội dung thật sự khớp, không gán ép.

---

## 3. Khung Hợp Tác Creator (Remap Cho Ngành Vật Tư Môi Trường)

Ngành công nghiệp không có creator triệu follower đúng chuyên môn. Ưu tiên **độ đúng nghề hơn độ phủ**.

| Tier | Quy mô | Chân dung phù hợp | Mô hình hợp tác |
|---|---|---|---|
| **Nano** | 1K – 10K | Thợ lắp đặt lọc nước, kỹ thuật viên vận hành trạm | Gửi mẫu vật tư (product seeding) — chi phí thấp nhất, độ tin cậy cao nhất |
| **Micro** | 10K – 100K | Kênh "thợ nước", nhà thầu cơ điện, review thiết bị gia dụng | Nội dung tài trợ theo video, đồng sản xuất tại kho |
| **Mid-tier** | 100K – 1M | Kênh khoa học đời sống, kênh nhà xưởng | Chiến dịch theo mùa (mùa khô nhiễm phèn, mùa mưa nước đục) |
| **Macro** | 1M+ | Kênh giải trí đại chúng | **Không khuyến nghị** — sai tệp, chi phí không hoàn vốn với đơn hàng B2B |

**Đo hiệu quả:** mỗi creator nhận một mã/đường dẫn riêng; quy về số lead Zalo OA thực nhận, không quy về lượt xem. Benchmark tham chiếu của nguồn là ROI 4:1 — coi là mốc so sánh, không phải cam kết.

---

## 4. Quảng Cáo TikTok — Thứ Tự Ưu Tiên Cho B2B Công Nghiệp

| Format | Mô tả | Khuyến nghị MTXV |
|---|---|---|
| **Spark Ads** | Đẩy tiền cho video organic đã có sẵn tương tác tốt | **Ưu tiên 1.** Giữ nguyên bằng chứng xã hội, chi phí thấp, đúng bản chất nội dung kỹ thuật |
| **In-feed Ads** | Video quảng cáo chen trong luồng For You | Ưu tiên 2, dùng khi cần đẩy chiến dịch mới chưa có organic |
| **TopView** | Chiếm màn hình đầu khi mở app | Không dùng — chi phí thương hiệu đại chúng, sai mục tiêu lead B2B |
| **Branded Hashtag Challenge / Branded Effect** | Chiến dịch tương tác quy mô lớn | Không dùng ở giai đoạn hiện tại — ngoài ngân sách, tệp không khớp |

**Quy tắc chạy:** mỗi chiến dịch tối thiểu 3 biến thể hook khác nhau trên cùng phần thân video → chỉ thay 3 giây đầu để cô lập biến số. Phần vận hành đặt giá thầu, tệp đối tượng, đo lường chuyển đổi thuộc `mk:ads` — không xử lý trong skill này.

---

## 5. Tái Sử Dụng Đa Nền Tảng

Một master video 9:16 phân phối sang các kênh khác. Ma trận tái sử dụng tổng thể đã định nghĩa tại **CLAUDE.md §4 (Omnichannel Content Repurposing Matrix)** — không lặp lại ở đây. Chỉ ghi phần điều chỉnh kỹ thuật riêng của từng nền tảng:

| Nền tảng | Điều chỉnh bắt buộc |
|---|---|
| **YouTube Shorts** | Giữ 9:16. Chừa an toàn 160px đáy (thanh tiêu đề Shorts đè lên) → đẩy Brand Bar lên trên vùng này |
| **Facebook Reels** | Giữ 9:16. Caption phải tự đứng độc lập vì nhiều người xem tắt tiếng → phụ đề cháy sẵn (burned-in) là bắt buộc |
| **LinkedIn** | Chuyển sang 1:1 hoặc 16:9, cắt bỏ hook giật, mở đầu bằng luận điểm kỹ thuật |
| **Zalo OA** | Cắt còn ≤ 30s, chèn trực tiếp hotline `0900.000.000`. Caption **không dùng Markdown thô** (`**`) — Zalo không render |

---

## 6. Xử Lý Bình Luận Tiêu Cực & Khủng Hoảng

Video kỹ thuật luôn kéo theo tranh luận chuyên môn. Đây là cơ hội chứng minh năng lực, không phải mối đe dọa.

| Loại bình luận | Cách xử lý |
|---|---|
| **Phản biện kỹ thuật đúng** | Công nhận công khai, bổ sung số liệu/tiêu chuẩn. Ghim bình luận đó lên đầu |
| **Phản biện kỹ thuật sai** | Trả lời bằng tiêu chuẩn dẫn nguồn (ASTM D4607, QCVN), không hạ thấp người bình luận |
| **So sánh giá với đối thủ** | Không hạ giá đối thủ. Chuyển hướng sang chi phí trên m³ nước xử lý. **Mọi con số giá phải tra AMIS CRM** trước khi trả lời |
| **Nghi ngờ hàng giả/kém chất lượng** | Đưa chứng thư Quatest 3 và CO/CQ của đúng lô hàng. Mời kiểm tra trực tiếp tại kho |
| **Tấn công cá nhân / spam** | Ẩn, không đôi co |

**Quy tắc bắt buộc:** mọi phản hồi có nội dung kỹ thuật hoặc giá bán trên kênh công khai phải qua QA của `b2b-sale-manager` trước khi đăng, đúng cơ chế đã áp dụng cho Zalo OA và Fanpage.

---

## 7. Nhật Ký Học Hỏi (Cập Nhật Định Kỳ)

Lưu tại `wiki/video-scripts/tiktok-performance-log.md`, cập nhật theo tháng:

- **Hook nào giữ chân tốt nhất** — xếp hạng 6 khuôn hook theo completion rate thực đo.
- **Thay đổi thuật toán** — ghi ngày phát hiện và biểu hiện (đột ngột tụt/tăng reach trên cùng dạng nội dung).
- **Chủ đề tạo lead thật** — chỉ đếm lead Zalo OA/hotline, không đếm lượt xem.
- **Creator đã hợp tác** — kết quả thực, có tái ký hay không, lý do.
