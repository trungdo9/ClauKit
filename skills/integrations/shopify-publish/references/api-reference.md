# Shopify Admin REST & GraphQL API Reference

Tài liệu tham chiếu các điểm cuối API (Endpoints) được sử dụng để xuất bản và quản trị nội dung trên Shopify.

---

## 1. Authentication & Base URL

* **Shopify Store URL:** `https://{shop_url}/admin/api/{version}/` (mặc định API version `2024-01`).
* **Header bắt buộc:**
  ```http
  X-Shopify-Access-Token: {shpat_...}
  Content-Type: application/json
  Accept: application/json
  ```
* **Scopes cần thiết:**
  * `read_content`, `write_content`: Quản lý Blogs, Articles, Pages, Redirects.
  * `read_themes`, `write_themes`, `write_theme_code`: Quản lý Snippets, Layout, Assets.

---

## 2. Blog Articles Endpoints (`blogs/*/articles.json`)

### 2.1 Liệt kê danh sách Blogs
* **Method:** `GET /admin/api/2024-01/blogs.json`
* **Mô tả:** Lấy danh sách blog và ID tương ứng (ví dụ: Blog `news` ID: `88584978510`).

### 2.2 Kiểm tra bài viết tồn tại theo handle
* **Method:** `GET /admin/api/2024-01/blogs/{blog_id}/articles.json?handle={handle}`
* **Sử dụng:** Đảm bảo tính lũy thừa (idempotency); nếu bài viết đã tồn tại thì chuyển sang PUT update, nếu chưa thì POST tạo mới.

### 2.3 Tạo mới bài viết (Create Article)
* **Method:** `POST /admin/api/2024-01/blogs/{blog_id}/articles.json`
* **Payload mẫu:**
  ```json
  {
    "article": {
      "title": "Tiêu đề bài viết",
      "handle": "slug-bai-viet",
      "author": "Tiến Tiên — AAU Academy",
      "tags": "Marketing Chuỗi, pillar:marketing-nha-hang",
      "body_html": "<p>Nội dung HTML...</p>",
      "summary_html": "<p>Tóm tắt bài viết...</p>",
      "published": false,
      "image": {
        "src": "https://images.unsplash.com/photo-..."
      },
      "metafields": [
        {
          "key": "title_tag",
          "value": "SEO Meta Title",
          "type": "string",
          "namespace": "global"
        },
        {
          "key": "description_tag",
          "value": "SEO Meta Description",
          "type": "string",
          "namespace": "global"
        }
      ]
    }
  }
  ```

### 2.4 Cập nhật bài viết (Update Article)
* **Method:** `PUT /admin/api/2024-01/blogs/{blog_id}/articles/{article_id}.json`
* **Payload:** Tương tự như tạo mới, dùng để ghi đè nội dung và cập nhật trạng thái xuất bản (`"published": true/false`).

---

## 3. Shopify Pages Endpoints (`pages.json`)

Dành riêng cho các trang cố định hoặc trang trụ cột Pillar (`/pages/<handle>`) khi khai báo `content_type: page`.

### 3.1 Kiểm tra Page tồn tại
* **Method:** `GET /admin/api/2024-01/pages.json?handle={handle}`

### 3.2 Tạo mới Page
* **Method:** `POST /admin/api/2024-01/pages.json`
* **Payload mẫu:**
  ```json
  {
    "page": {
      "title": "Marketing Nhà Hàng Toàn Diện",
      "handle": "marketing-nha-hang",
      "body_html": "<div>Nội dung trang Pillar...</div>",
      "published": false,
      "metafields": [...]
    }
  }
  ```

### 3.3 Cập nhật Page
* **Method:** `PUT /admin/api/2024-01/pages/{page_id}.json`

---

## 4. Theme Assets Endpoints (`themes/*/assets.json`)

Dành cho việc cập nhật các snippet cấu trúc dữ liệu (`snippets/aau-structured-data.liquid`).

### 4.1 Đọc Asset từ Theme
* **Method:** `GET /admin/api/2024-01/themes/{theme_id}/assets.json?asset[key]={path_to_asset}`

### 4.2 Cập nhật hoặc thêm mới Asset
* **Method:** `PUT /admin/api/2024-01/themes/{theme_id}/assets.json`
* **Payload mẫu:**
  ```json
  {
    "asset": {
      "key": "snippets/aau-structured-data.liquid",
      "value": "{% comment %} Liquid code {% endcomment %}"
    }
  }
  ```
