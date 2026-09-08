# Chuẩn Frontmatter cho Bài viết & Trang Shopify

Mỗi bài viết Markdown trước khi đẩy lên Shopify bắt buộc phải có khối YAML Frontmatter đầy đủ các trường thông tin chuẩn hóa dưới đây.

---

## 1. Mẫu Frontmatter cho Bài viết Blog (`blogs/news/*`)

```yaml
---
title: "Chọn mặt bằng kinh doanh F&B: 7 tiêu chí vàng cho chuỗi"
meta_title: "Chọn mặt bằng kinh doanh F&B: 7 tiêu chí vàng cho chuỗi"
meta_description: "Chọn mặt bằng kinh doanh F&B cần đánh giá 7 tiêu chí vàng: vị trí, lưu lượng khách, chi phí thuê và hạ tầng BOH. Khám phá checklist thẩm định chuẩn cho chuỗi."
handle: "chon-mat-bang-kinh-doanh-fnb"
tags: "Marketing Chuỗi"
author: "Tiến Tiên"
published_at: 2026-09-08
pillar: "marketing-nha-hang"
sub_pillar: "SP3.1 — Local Store Marketing & Trade Area"
canonical: "https://aau.vn/blogs/news/chon-mat-bang-kinh-doanh-fnb"
featured_image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1280&q=80"
word_count: 2374
reading_time: 11
format: "huong-dan"
status: "DRAFT — chờ duyệt xuất bản"
---
```

---

## 2. Bảng giải thích chi tiết các trường

| Trường | Bắt buộc | Kiểu | Ý nghĩa & Quy tắc |
|---|:---:|:---:|---|
| `title` | ✅ | String | Tiêu đề chính của bài viết ($\le 60\text{ ký tự}$). Không đóng cứng năm bừa bãi. |
| `meta_title` | ✅ | String | Thẻ tiêu đề SEO hiển thị trên SERP (thường trùng với `title`). |
| `meta_description` | ✅ | String | Thẻ mô tả SEO trên Google. **Bắt buộc chính xác từ 150 đến 160 ký tự**. |
| `handle` | ✅ | String | Đường dẫn tĩnh (Slug). Không dấu, viết thường, phân tách bằng dấu gạch ngang `-`. |
| `tags` | ✅ | String/List | Tag chủ đề đứng đầu (`Marketing Chuỗi`, `Vận Hành`,...). Phục vụ hiển thị bài liên quan trên theme. |
| `author` | ✅ | String | Tên tác giả chuẩn E-E-A-T: `Tiến Tiên` hoặc `Tiến Tiên — AAU Academy`. |
| `published_at` | ✅ | Date | Ngày xuất bản định dạng `YYYY-MM-DD`. |
| `pillar` | ✅ | String | Slug của Pillar mẹ liên kết (ví dụ: `marketing-nha-hang`). Tự sinh tag `pillar:<slug>`. |
| `sub_pillar` | ✅ | String | Tên Sub-pillar phân cấp (ví dụ: `SP3.1 — Local Store Marketing & Trade Area`). Tự sinh tag `sub:<slug>`. |
| `canonical` | ✅ | URL | URL chính tắc đầy đủ bắt đầu bằng `https://aau.vn/...`. |
| `featured_image`| ✅ | URL | Link ảnh đại diện (Unsplash hoặc CDN Shopify Files). |
| `reading_time` | ✅ | Number | Thời gian đọc ước tính tính bằng phút. |
| `format` | ✅ | String | Định dạng bài viết: `huong-dan` (1.800–2.400w), `dinh-nghia` (1.400–1.800w), `case` (1.200–1.600w). |
| `status` | ✅ | String | Trạng thái bài viết: `"DRAFT — chờ duyệt xuất bản"` hoặc `"PUBLISHED"`. |

---

## 3. Mẫu Frontmatter cho Trang Pillar (`pages/*`)

Nếu bài viết là trang trụ cột hub (Pillar Page) được chỉ định xuất bản vào Shopify Pages thay vì Blog:

```yaml
---
title: "Marketing Nhà Hàng Toàn Diện: Khung Chiến Lược & Thực Thi"
meta_title: "Marketing Nhà Hàng Toàn Diện: Khung Chiến Lược & Thực Thi"
meta_description: "Cẩm nang marketing nhà hàng toàn diện từ chiến lược Trade Area, LSM, quản trị trải nghiệm khách hàng đến tối ưu P&L điểm bán cho chuỗi F&B."
handle: "marketing-nha-hang"
content_type: page
author: "Tiến Tiên"
published_at: 2026-09-07
canonical: "https://aau.vn/pages/marketing-nha-hang"
status: "PUBLISHED"
---
```
