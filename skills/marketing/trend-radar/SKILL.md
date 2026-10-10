---
name: trend-radar
description: Phát hiện xu hướng tìm kiếm của người dùng Internet theo thời gian thực bằng Google Trends (thư viện `trendspyg`), đo đà quan tâm của danh mục từ khóa hạt giống, đối chiếu độ phủ nội dung để tìm khoảng trống, và chuyển kết luận thành chiến dịch nội dung kèm action checklist. Dùng khi cần trả lời "thị trường đang tìm gì", "nhu cầu nào đang tăng/giảm", "nên viết bài gì tiếp theo".
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Trend Radar — Radar Xu Hướng Tìm Kiếm Thị Trường

> Trả lời đúng một câu hỏi: **người dùng Internet đang tìm gì liên quan tới sản phẩm/dịch vụ của công ty, và nhu cầu đó đang tăng hay giảm?**
> Đây là nguồn tín hiệu **phía cầu (demand-side)**, bổ sung — không thay thế — cho thứ hạng SERP (skill [`serprobot`](../serprobot/SKILL.md)) vốn là tín hiệu phía cung.

---

## 1. Nền tảng kỹ thuật

| Thành phần | Đường dẫn | Vai trò |
|---|---|---|
| Thư viện nguồn | [`trendspyg`](https://github.com/flack0x/trendspyg) (PyPI, MIT) | Client Google Trends: RSS, Explore, autocomplete |
| Môi trường Python | `.venv-trends/` (gitignore) | Cô lập khỏi Python hệ thống (Ubuntu chặn cài gói toàn cục theo PEP 668) |
| Cầu nối Python ⟷ Node | `scripts/lib/trendspyg-bridge.py` | 4 chế độ `check` · `rss` · `suggest` · `interest`; luôn trả **một** object JSON ra stdout |
| Bộ phân tích | `scripts/lib/trend-analyzer.js` | Đà tăng trưởng, điểm liên quan ngành, độ phủ nội dung, đối chiếu kỳ trước |
| Bộ dựng chiến dịch | `scripts/lib/trend-campaign-builder.js` | Sinh `trend-report.md`, `master-campaign-plan.md`, `action-checklist.md` |
| Điều phối 1 lệnh | `scripts/trend-radar-cycle.js` | Ca trực trọn gói, có `--dry-run` |
| Cấu hình hạt giống | `plans/marketing/seo-content/trend-radar-seeds.json` | **Do người biên tập giữ** — đổi phạm vi quét chỉ sửa ở đây |

Cài đặt lần đầu (chỉ cần một lần trên mỗi máy):

```bash
python3 -m venv .venv-trends
.venv-trends/bin/pip install trendspyg
node scripts/trend-radar-cycle.js --dry-run --no-explore   # xác nhận cầu nối chạy
```

---

## 2. Lệnh thực thi

```bash
node scripts/trend-radar-cycle.js --dry-run     # LUÔN chạy trước — không ghi file, KHÔNG gọi Explore
node scripts/trend-radar-cycle.js               # chạy thật (lô xoay vòng mặc định 9 từ khóa)
node scripts/trend-radar-cycle.js --site=site-b|site-c|BRAND
node scripts/trend-radar-cycle.js --limit=3     # thu hẹp lô, tiết kiệm hạn mức API
node scripts/trend-radar-cycle.js --no-campaign # chỉ đo, không lập kế hoạch
node scripts/trend-radar-cycle.js --no-explore  # chỉ quét RSS, không tốn phiên Explore
```

Tra cứu lẻ (gỡ lỗi, không sinh file):

```bash
.venv-trends/bin/python scripts/lib/trendspyg-bridge.py --mode=check
.venv-trends/bin/python scripts/lib/trendspyg-bridge.py --mode=rss --geo=VN
.venv-trends/bin/python scripts/lib/trendspyg-bridge.py --mode=suggest --keywords="than hoạt tính|cát mangan"
```

---

## 3. Đầu ra chuẩn của một chu kỳ

| File | Nội dung |
|---|---|
| `plans/marketing/reports/trends/trend-report-<YYYY-MM-DD>.md` | Báo cáo đo lường 5 mục, gồm mục **Giới hạn của phép đo** |
| `plans/marketing/reports/trends/trend-baseline-<YYYY-MM-DD>.json` | Baseline máy đọc, dùng đối chiếu ở chu kỳ sau |
| `plans/campaigns/global/trend-radar/sprints/<YYYY>/<YYYY-MM-DD>-trend-sprint/master-campaign-plan.md` | Kế hoạch chiến dịch |
| `…/action-checklist.md` | Task ID `TRD-<site-b\|site-c\|BRAND\|ALL>-<MMDD>-NN` |

Script kết thúc bằng khối `---SUMMARY-JSON---` — **mọi con số trong báo cáo Telegram phải lấy từ khối này**, không gõ tay.

---

## 4. Bốn module chiến dịch

| Module | Nhóm tín hiệu | Vì sao ưu tiên như vậy |
|:---:|---|---|
| **T1** | Đang tăng + **chưa có bài phủ** | Khoảng trống đắt giá nhất: nhu cầu đã có, đối thủ chưa chắc có bài |
| **T2** | Đang tăng + đã có bài | Chi phí thấp nhất trên mỗi bậc thứ hạng thu được — chỉ cần làm mới |
| **T3** | Suy giảm | Phải tách **mùa vụ** khỏi **suy giảm thị trường thật** trước khi cắt đầu tư |
| **T4** | Sự kiện thời sự liên quan ngành (RSS) | Cửa sổ 24h, ưu tiên Social — không ép thành bài website nếu lệch Search Intent |

---

## 5. Cách đọc số (bắt buộc hiểu trước khi ra quyết định)

- **Chỉ số Google Trends là tương đối 0 – 100 trong cửa sổ đã chọn**, KHÔNG phải volume tuyệt đối. Muốn volume tuyệt đối ⇒ đối chiếu SERP Robot / Google Search Console.
- **Đà (`momentumPct`)** = trung bình 4 tuần gần nhất so với 12 tuần liền trước. Phân loại: `BREAKOUT` ≥ +50% · `RISING` ≥ +15% · `STABLE` · `DECLINING` ≤ −15%. Ngưỡng chỉnh tại khối `momentum` của file hạt giống.
- **Điểm tuần chưa đóng (`isPartial`) bị loại** khỏi mọi phép trung bình — nếu không, tuần đang chạy dở luôn kéo đà xuống giả tạo.
- **Đà tăng ≠ ý định mua.** Từ khóa thông tin có thể tăng mạnh mà không sinh đơn. Đối chiếu chéo với nhu cầu thật trên MISA AMIS CRM trước khi cam kết ngân sách.
- Từ khóa B2B quá ngách có thể không đủ dữ liệu để Google trả chuỗi — khi đó báo cáo ghi rõ *thiếu dữ liệu*, **tuyệt đối không nội suy**.

---

## 6. ⚠️ Giới hạn tần suất Google Trends (nguyên nhân hỏng ca trực phổ biến nhất)

- Nhánh **Explore** (`interest`) mở một phiên trình duyệt cho **mỗi từ khóa**. Khoảng **8 – 10 phiên mới trong ~15 phút** là Google trả **429**, thời gian hồi phục từ ~35 phút tới lâu hơn.
- Vì vậy ca trực đo theo **lô xoay vòng** (mặc định 9 từ khóa/ca, con trỏ lưu tại `scripts/data/trend-rotation-state.json`) — trọn danh mục 18 hạt giống được phủ sau đúng 2 ca, tức 1 tuần.
- Mỗi lần gọi cách nhau `exploreDelaySeconds` (mặc định **120 giây**) để 9 phiên trải ra ~16 phút thay vì dồn cục. 🚫 **Không hạ xuống dưới 90 giây.**
- Khi gặp 429, bridge **dừng ngay** các từ khóa còn lại (không đốt thêm phiên) và script **KHÔNG đẩy con trỏ xoay vòng** — để lô đó được đo lại ở ca sau thay vì bị bỏ quên vĩnh viễn.
- 🚫 **KHÔNG** nâng `--limit` lên toàn bộ danh mục trong ca chạy tự động. 🚫 **KHÔNG** chạy lại nhiều lần liên tiếp để "thử vận may" — càng chạy càng kéo dài thời gian bị chặn.
- Nhánh **RSS** không có giới hạn này, an toàn để poll liên tục.
- **`--dry-run` cố tình KHÔNG gọi nhánh Explore.** Nó chỉ tiền kiểm: bridge còn sống, cấu hình đọc được, lô xoay vòng hợp lệ, đường dẫn ghi đúng. Nếu dry-run cũng đo thật thì quy trình «dry-run rồi chạy thật» sẽ tiêu **gấp đôi** hạn mức phiên và cầm chắc dính 429 — đã gặp ngày 2026-09-12. Muốn kiểm thật một từ khóa lẻ thì gọi thẳng bridge với `--mode=interest`.

---

## 7. Bẫy đã gặp thật (đừng lặp lại)

1. **`cache=True` làm hỏng toàn bộ nhánh Explore.** README của `trendspyg` ghi `cache=True` nhưng bản 1.8.0 ném `InvalidParameterError` — Explore chỉ có cache trên đĩa. Phải dùng `cache="disk"` (kèm `cookies="disk"` để tái dùng phiên khách quen, giảm 429). Đã gặp ngày 2026-09-12: cả 6/6 từ khóa fail im lặng, báo cáo vẫn sinh ra nhưng rỗng số liệu.
2. **Dòng RSS Google Trends VN chủ yếu là thể thao và giải trí.** `0/10 chạm ngưỡng liên quan ngành` là kết quả **bình thường**, không phải lỗi. Giá trị của nhánh RSS chỉ xuất hiện vào ngày có sự cố môi trường thật (xả thải, cá chết, ô nhiễm nguồn nước).
3. **Không suy ra "nhu cầu sụp đổ" từ một chu kỳ.** Một điểm dữ liệu không phải xu hướng — cần tối thiểu 2 baseline để phát biểu về biến động.

---

## 8. Ranh giới của skill này

- 🚫 Không viết bài, không xuất bản, không sửa nội dung website. Chỉ **đo → kết luận → lập kế hoạch**.
- 🚫 Không đề xuất đơn giá; giá 100% lấy từ MISA AMIS CRM.
- 🚫 Không chép lại tiêu chuẩn SEO/GEO — ủy quyền cho `seo-plan`, `seo-cluster`, `seo-content`, `seo-drift`.
- ✅ Mỗi từ khóa chỉ thuộc **một** website theo tệp Search Intent khai trong file hạt giống (Anti-Cannibalization).
