---
name: amis-crm
description: MISA AMIS CRM Open API v2 Integration — Tự động hóa kết nối và đồng bộ dữ liệu với MISA AMIS CRM (Khách hàng, Liên hệ, Hàng hóa, Đơn hàng, Kho & Tồn kho) qua Open API v2.
---

# MISA AMIS CRM Open API v2 Integration (SKILL)

## 1. Mục Đích & Khả Năng Cốt Lõi
Skill này cung cấp quy trình chuẩn hóa và bộ công cụ CLI/Node.js để tích hợp, tự động hóa và đồng bộ dữ liệu hai chiều giữa website **example.com** (Công ty TNHH Enterprise Corp) và hệ thống quản trị quan hệ khách hàng **MISA AMIS CRM** qua **Open API v2** (`https://crmconnect.misa.vn`).

### 6 Năng Lực Tích Hợp Cốt Lõi:
1. **Xác Thực & Tự Động Quản Lý Token (Auth & Token Auto-Refresh)**:
   - Tự động sinh JWT Bearer Token qua API `/api/v2/Account` sử dụng App ID (`client_id`) và Mã bảo mật (`client_secret`).
   - Tự động cache token và refresh khi hết hạn mà không làm gián đoạn các luồng nghiệp vụ.
2. **Quản Lý Khách Hàng Doanh Nghiệp & Dự Án (Customers / Accounts - `/api/v2/Customers`)**:
   - Truy vấn danh sách khách hàng phân trang, tìm kiếm theo `id` hoặc `account_number` (Mã khách hàng).
   - Thêm mới khách hàng doanh nghiệp, đại lý, nhà thầu EPC kèm Mã số thuế, Doanh thu, Quy mô, Hạn mức nợ (`debt_limit`).
   - Cập nhật và xóa khách hàng theo ID.
3. **Quản Lý Người Liên Hệ (Contacts - `/api/v2/Contacts`)**:
   - Quản lý danh bạ kỹ sư môi trường, giám đốc thu mua, chuyên viên vật tư theo từng tổ chức.
   - Hỗ trợ lưu trữ Zalo, Facebook, Email cơ quan, Số di động, Ngày sinh, Tình trạng hôn nhân.
4. **Danh Mục Hàng Hóa & Vật Liệu Lọc (Products - `/api/v2/Products`)**:
   - Đồng bộ danh mục Than Hoạt Tính, Cát thạch anh, Cát Mangan, Hạt nhựa Cation/Anion, Hóa chất PAC lên CRM.
   - Quản lý bảng giá đa tầng: Đơn giá bán chuẩn (`unit_price`), Đơn giá 1 (`unit_price1`), Đơn giá 2 (`unit_price2`), Đơn giá cố định (`unit_price_fixed`), Đơn giá mua (`purchased_price`), Thuế GTGT (`tax`).
5. **Quản Lý Đơn Hàng B2B (Sale Orders - `/api/v2/SaleOrders`)**:
   - Tạo và theo dõi đơn hàng bán sỉ, bảng chiết khấu, giá trị thanh lý, tiền thuế, tình trạng xuất hóa đơn (`is_invoiced`), tình trạng giao hàng (`delivery_status`), tình trạng thanh toán (`pay_status`).
   - Quản lý chi tiết từng dòng hàng hóa (`sale_order_product_mappings`) kèm kho xuất (`stock_name`).
6. **Quản Lý Kho & Sổ Tồn Kho Vật Tư (Stocks & Product Ledger - `/api/v2/Stocks`)**:
   - Truy vấn danh sách kho bãi (Kho Miền Nam, Kho Miền Bắc, Kho Nhà máy Bến Tre/Trà Bắc).
   - Truy vấn tồn kho thực tế, số lượng có thể đặt (`order_quantity`), số lượng đã đặt chưa giao (`delivery_quantity`).
   - Cập nhật số lượng tồn kho theo đơn vị tính chính qua API `/api/v2/Stocks/product_ledger`.

---

## 2. Cấu Hình & Xác Thực API (Credentials)

Thông tin kết nối được lưu trữ tại file **`.agents/.env`**:
```env
# MISA AMIS CRM Open API v2 Credentials
AMIS_API_KEY=EvQOISG+xerItZdzzoadgPBiWM3t4U8C+ogqWWsbu4w=
AMIS_CLIENT_ID=PublicAPI
AMIS_BASE_URL=https://crmconnect.misa.vn
```

> [!NOTE]
> - `AMIS_API_KEY`: Mã bảo mật (`client_secret`) do CRM cấp.
> - `AMIS_CLIENT_ID`: Mã ứng dụng đăng ký trên CRM (mặc định là `PublicAPI` hoặc mã riêng do quản trị viên AMIS CRM thiết lập tại **CRM → Thiết lập → Dành cho nhà phát triển → API**).
> - Token sau khi sinh sẽ được lưu tạm tại `.agents/.amis_token_cache.json` và tự động tái sử dụng trong thời gian hiệu lực.

---

## 3. Cấu Trúc Bảng Dữ Liệu Chi Tiết (Data Dictionaries)

### A. Phân Hệ Khách Hàng (`/api/v2/Customers`)
| Trường dữ liệu | Kiểu | Mô tả / Giá trị chuẩn |
| :--- | :--- | :--- |
| `account_name` | String (Req) | Tên công ty / Doanh nghiệp (VD: "Công ty Cổ phần Nước Sạch Miền Đông") |
| `account_number` | String | Mã khách hàng (VD: `KH00012`) |
| `account_short_name` | String | Tên viết tắt |
| `tax_code` | String | Mã số thuế doanh nghiệp |
| `office_tel` | String | Số điện thoại cơ quan |
| `office_email` | String | Email cơ quan |
| `website` | String | Website khách hàng |
| `account_type` | String | Phân loại: "Khách hàng dự án", "Khách hàng đại lý", "Khách hàng lẻ" |
| `business_type` | String | "Doanh nghiệp", "Hộ kinh doanh", "Cá nhân" |
| `industry` | String | Ngành nghề (VD: "Xử lý nước thải & Cấp nước") |
| `annual_revenue` | String | Quy mô doanh thu |
| `lead_source` | String | "Website example.com", "Marketing", "Hội thảo" |
| `debt_limit` | Number | Hạn mức nợ (VNĐ) |
| `number_of_days_owed`| Integer | Số ngày được nợ |
| `billing_address` | String | Địa chỉ xuất hóa đơn |
| `shipping_address`| String | Địa chỉ giao hàng thực tế |
| `owner_name` | String | Tên nhân viên phụ trách trên CRM (VD: "Nguyễn Văn B (NV000002)") |

### B. Phân Hệ Người Liên Hệ (`/api/v2/Contacts`)
| Trường dữ liệu | Kiểu | Mô tả / Giá trị chuẩn |
| :--- | :--- | :--- |
| `contact_name` | String (Req) | Họ và tên (VD: "Nguyễn Văn A") |
| `contact_code` | String | Mã liên hệ (VD: `LH00015`) |
| `salutation` | String | Xưng hô: "Anh", "Chị", "Ông", "Bà" |
| `mobile` | String | Số điện thoại di động |
| `email` | String | Email cá nhân |
| `account_name` | String | Tên hoặc Mã khách hàng chủ quản |
| `title` | String | Chức danh: "Trưởng phòng Kỹ thuật", "Chỉ huy trưởng", "Giám đốc Mua hàng" |
| `department` | String | Phòng ban: "Phòng Dự Án", "Phòng Mua Hàng" |
| `zalo` | String | Số Zalo liên hệ |

### C. Phân Hệ Hàng Hóa & Vật Liệu (`/api/v2/Products`)
| Trường dữ liệu | Kiểu | Mô tả / Giá trị chuẩn |
| :--- | :--- | :--- |
| `product_code` | String (Req) | Mã hàng hóa (VD: `THT-GD-01`, `THT-TB-650`, `CAT-TQ-01`) |
| `product_name` | String (Req) | Tên vật tư (VD: "Than hoạt tính gáo dừa Trà Bắc TB1") |
| `product_category` | String | Loại hàng: "Than Hoạt Tính", "Cát Sỏi Lọc", "Hạt Nhựa", "Hóa Chất" |
| `usage_unit` | String | Đơn vị tính chính: "Kg", "Bao 25kg", "Bao 500kg", "Tấn", "Khối (m3)" |
| `unit_price` | String / Num | Đơn giá bán lẻ/niêm yết (VNĐ) |
| `unit_price1` | String / Num | Đơn giá sỉ Đại Lý Cấp 1 |
| `unit_price2` | String / Num | Đơn giá Dự Án Nhà Thầu EPC |
| `unit_price_fixed` | String / Num | Đơn giá cố định |
| `purchased_price` | String / Num | Giá vốn / Giá mua đầu vào |
| `tax` | String | Thuế suất GTGT (VD: "8%", "10%", "KCT") |
| `inactive` | Boolean | `false`: Đang kinh doanh; `true`: Ngừng theo dõi |

### D. Phân Hệ Đơn Hàng (`/api/v2/SaleOrders`)
| Trường dữ liệu | Kiểu | Mô tả / Giá trị chuẩn |
| :--- | :--- | :--- |
| `sale_order_no` | String (Req) | Số đơn hàng (VD: `DH26-0801`) |
| `account_name` | String | Mã hoặc Tên khách hàng |
| `contact_name` | String | Mã hoặc Tên người liên hệ |
| `sale_order_date` | String (ISO) | Ngày đặt hàng |
| `deadline_date` | String (ISO) | Hạn giao hàng |
| `delivery_status`| String | "Chưa giao hàng", "Đang giao hàng", "Đã giao hàng" |
| `pay_status` | String | "Chưa thanh toán", "Thanh toán một phần", "Đã thanh toán" |
| `total_summary` | String / Num | Tổng tiền đơn hàng |
| `sale_order_product_mappings` | Array | Mảng chi tiết hàng hóa |
| ↳ `product_code` | String | Mã hàng hóa |
| ↳ `stock_name` | String | Kho xuất hàng (VD: "Kho Bình Dương", "Kho Hà Nội") |
| ↳ `amount` | Number | Số lượng |
| ↳ `price` | String | Đơn giá |
| ↳ `total` | Number | Thành tiền sau chiết khấu và thuế |

---

## 4. Hướng Dẫn Thực Thi CLI (`./scripts/amis-crm.js`)

Bộ công cụ [`scripts/amis-crm.js`](./scripts/amis-crm.js) được đóng gói khép kín bên trong thư mục skill, cung cấp đầy đủ các lệnh vận hành:

### A. Kiểm Tra Xác Thực & Chẩn Đoán (Diagnostics)
```bash
# 1. Kiểm tra kết nối và tính hợp lệ của token
node scripts/amis-crm.js --auth
```

### B. Quản Lý Khách Hàng (Customers)
```bash
# 1. Xem danh sách khách hàng (phân trang)
node scripts/amis-crm.js --customers --page=0 --pageSize=10

# 2. Tìm khách hàng theo ID hoặc Mã Khách Hàng
node scripts/amis-crm.js --customer-id=1024
node scripts/amis-crm.js --customer-code=KH00012

# 3. Tạo nhanh 1 khách hàng B2B mới từ CLI
node scripts/amis-crm.js --add-customer \
  --name="Công ty TNHH Bia Sài Gòn Miền Trung" \
  --phone="02838123456" \
  --email="procurement@biasaigon.com" \
  --tax-code="0301234567" \
  --type="Khách hàng dự án" \
  --address="KCN Sóng Thần 2, Dĩ An, Bình Dương"

# 4. Thêm / Cập nhật khách hàng hàng loạt qua file JSON
node scripts/amis-crm.js --create-customers=data/new_customers.json
node scripts/amis-crm.js --update-customers=data/update_customers.json
```

### C. Quản Lý Liên Hệ (Contacts)
```bash
# 1. Xem danh sách liên hệ
node scripts/amis-crm.js --contacts --page=0 --pageSize=20

# 2. Tạo người liên hệ mới gắn với Khách hàng
node scripts/amis-crm.js --add-contact \
  --name="Lê Hoàng Nam" \
  --phone="0912345678" \
  --email="nam.lh@biasaigon.com" \
  --account="KH00012" \
  --title="Trưởng phòng Quản lý Môi trường"

# 3. Tra cứu liên hệ theo mã
node scripts/amis-crm.js --contact-code=LH00015
```

### D. Quản Lý Hàng Hóa & Giá Bán (Products)
```bash
# 1. Xem danh sách vật liệu lọc & giá niêm yết
node scripts/amis-crm.js --products --pageSize=50 --export=wiki/crm/products-catalog.json

# 2. Tra cứu vật tư theo mã
node scripts/amis-crm.js --product-code=THT-GD-01
```

### E. Quản Lý Đơn Hàng (Sale Orders)
```bash
# 1. Xem danh sách đơn hàng gần nhất
node scripts/amis-crm.js --orders --page=0 --pageSize=10

# 2. Tra cứu đơn hàng theo số đơn
node scripts/amis-crm.js --order-code=DH26-0801

# 3. Tạo đơn hàng B2B từ file JSON
node scripts/amis-crm.js --create-orders=data/order_payload.json
```

### F. Quản Lý Kho & Tồn Kho (Stocks & Product Ledger)
```bash
# 1. Lấy danh sách tất cả các kho
node scripts/amis-crm.js --stocks

# 2. Kiểm tra tồn kho khả dụng của các mặt hàng
node scripts/amis-crm.js --stock-ledger --pageSize=50

# 3. Cập nhật số lượng tồn kho sau khi nhập hàng
node scripts/amis-crm.js --set-inventory --product-code="THT-GD-01" --stock-code="KHO-HCM" --qty=15000
```

---

## 5. Tích Hợp Lập Trình (Node.js API Usage)

Có thể import module `AmisAPI` trực tiếp trong bất kỳ script Node.js nào:

```javascript
const { AmisAPI } = require('./scripts/amis-crm');

async function processWebLead(leadData) {
  // 1. Tạo Khách Hàng Doanh Nghiệp
  const customerResult = await AmisAPI.createCustomers([{
    account_name: leadData.companyName,
    office_tel: leadData.phone,
    office_email: leadData.email,
    tax_code: leadData.taxCode,
    account_type: 'Khách hàng dự án',
    lead_source: 'Website example.com',
    description: `Nhu cầu: ${leadData.demand} - Lưu lượng: ${leadData.flowRate}`
  }]);

  console.log('Customer created:', customerResult);

  // 2. Tạo Liên Hệ Đại Diện
  const contactResult = await AmisAPI.createContacts([{
    contact_name: leadData.contactPerson,
    mobile: leadData.phone,
    email: leadData.email,
    account_name: leadData.companyName,
    title: leadData.jobTitle || 'Đại diện mua hàng'
  }]);

  console.log('Contact created:', contactResult);
}
```

---

## 6. Xử Lý Lỗi & Quy Chuẩn Phản Hồi AMIS CRM

MISA AMIS CRM sử dụng HTTP 200 kèm thuộc tính `code` và `results` trong response body để biểu thị chi tiết kết quả:

| Code | Ý Nghĩa | Hướng Xử Lý |
| :--- | :--- | :--- |
| `200` | Thành công | Dữ liệu hợp lệ, ID bản ghi trả về tại `results[i].data`. |
| `400` | Dữ liệu không hợp lệ | Kiểm tra mảng `validate_infos` để xem trường bị lỗi (`field_name`, `error_message`). Thường do trùng mã hoặc thiếu trường bắt buộc. |
| `401` | Unauthorized | Token hết hạn hoặc `client_id` không khớp. Script sẽ tự động refresh token một lần. |
| `2002` | Sai ClientId / ClientSecret | Kiểm tra lại `AMIS_API_KEY` và `AMIS_CLIENT_ID` trong `.agents/.env`. |
| `500` | Lỗi máy chủ MISA | Thử lại sau ít phút hoặc kiểm tra tình trạng dịch vụ MISA. |
