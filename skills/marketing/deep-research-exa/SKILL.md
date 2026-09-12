---
name: deep-research-exa
description: Deep Research & Knowledge Extraction qua Exa.ai API — Tìm kiếm neural search, trích xuất tài liệu học thuật (ASTM, EPA, AWWA, ScienceDirect) và làm giàu kho tri thức wiki/knowledge/.
---

# Deep Research qua Exa.ai API (SKILL)

## Mục Đích
Sử dụng công nghệ Neural Search của Exa.ai để thu thập các nghiên cứu khoa học, tiêu chuẩn kiểm định quốc tế và thông số kỹ thuật chuyên sâu ngành than hoạt tính và vật liệu lọc nước, nạp vào `wiki/knowledge/` để phục vụ viết bài SEO/GEO đạt chuẩn E-E-A-T cao nhất.

## Khi Nào Sử Dụng
- Khi cần tìm kiếm số liệu kiểm nghiệm chính xác (ASTM D4607, AWWA B604, BET surface area, VOC adsorption kinetics).
- Khi mở rộng cụm chủ đề mới trong `wiki/knowledge/` hoặc viết bài phân tích sản phẩm chuyên sâu (>1.500 từ).
- Khi cần đối chiếu cơ chế lọc nước/khí thải công nghiệp từ các nguồn khoa học quốc tế uy tín (US EPA, ScienceDirect, WQA, v.v.).

## Lệnh Thực Thi CLI
```bash
# Nghiên cứu 1 chủ đề và xuất ra màn hình
node scripts/exa-deep-research.js "ASTM D4607 activated carbon iodine number test procedure"

# Nghiên cứu và lưu trực tiếp vào file tri thức
node scripts/exa-deep-research.js "granular activated carbon EBCT empty bed contact time design drinking water" --save=wiki/knowledge/cam-nang-van-hanh-va-xu-ly-su-co-than-hoat-tinh.md

# Giới hạn nguồn từ các domain uy tín
node scripts/exa-deep-research.js "activated carbon VOC adsorption isotherm Langmuir Freundlich" --domains=sciencedirect.com,epa.gov,wqa.org --num=5
```

## Các Domain Ưu Tiên Nghiên Cứu
- `sciencedirect.com` (Báo cáo khoa học vật liệu bề mặt & hấp phụ)
- `epa.gov` (Tiêu chuẩn nước uống và xử lý khí thải của Cơ quan Bảo vệ Môi trường Hoa Kỳ)
- `wqa.org` (Hiệp hội Chất lượng Nước Hoa Kỳ)
- `astm.org` (Tiêu chuẩn kiểm nghiệm vật liệu quốc tế)
- `awwa.org` (Hiệp hội Công trình Nước Hoa Kỳ)

## Cấu Trúc File Tri Thức Đầu Ra (`wiki/knowledge/<topic>.md`)
Mọi dữ liệu trích xuất từ Exa.ai cần được chuẩn hóa theo cấu trúc:
1. **Khái niệm & Bản chất cơ chế**: Nguyên lý hóa lý cốt lõi.
2. **Thông số kỹ thuật định lượng có đơn vị**: Khối lượng, diện tích bề mặt ($m^2/g$), chỉ số hấp phụ ($mg/g$), độ sụt áp ($kPa$).
3. **Công thức toán học/thủy lực**: $EBCT$, $q_e = \frac{(C_0 - C_e)V}{m}$, đẳng nhiệt Langmuir/Freundlich.
4. **Ứng dụng thiết kế B2B**: Cách ứng dụng số liệu vào thực tế công trình của Enterprise Corp.
