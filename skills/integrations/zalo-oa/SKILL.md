---
name: zalo-oa
description: Zalo Official Account (OA) OpenAPI v4 & Dual-Zalo Integration — Tự động hóa kết nối Zalo OA, OAuth 2.0 PKCE, tự động refresh token 24h, trích xuất hội thoại/tin nhắn, bóc tách SĐT/công ty và đồng bộ trực tiếp vào CRM Data Lake.
---

# Zalo Official Account (OA) OpenAPI v4 & CRM Integration (SKILL)

## 1. Mục Đích & Khả Năng Cốt Lõi
Skill này cung cấp quy trình chuẩn hóa, kiến trúc kỹ thuật và bộ công cụ CLI/Node.js để tích hợp, tự động hóa và đồng bộ dữ liệu hai chiều giữa website **example.com** (Công ty TNHH Enterprise Corp) và nền tảng **Zalo Official Account (OA)** qua **OpenAPI v4** (`https://openapi.zalo.me`).

### 6 Năng Lực Cốt Lõi Của Skill:
1. **Xác Thực OAuth 2.0 PKCE & Tự Động Gia Hạn Token (Token Auto-Rotation)**:
   - Tự động sinh mã `code_verifier` và `code_challenge` theo chuẩn bảo mật PKCE.
   - Tự động quản lý và lưu trữ `access_token` (hạn 25 giờ) và `refresh_token` (hạn 3 tháng) tại `wiki/crm/sync/zalo-tokens.json`.
   - Tự động gọi refresh token sau mỗi 23–24 giờ mà không làm gián đoạn hệ thống hay đòi hỏi đăng nhập lại.
2. **Trích Xuất Danh Sách Hội Thoại Thời Gian Thực (`/v2.0/oa/listrecentchat`)**:
   - Truy xuất danh sách khách hàng vừa nhắn tin/tương tác gần nhất với OA.
   - Lấy tên hiển thị (`from_display_name`), ảnh đại diện (`from_avatar`), User ID (`from_id`), nội dung tin nhắn (`message`), ảnh đính kèm (`url`) và thời gian gửi (`sent_time`).
3. **Đọc Toàn Bộ Lịch Sử Tin Nhắn Với Từng Khách Hàng (`/v2.0/oa/conversation`)**:
   - Đọc luồng hội thoại chi tiết 2 chiều (khách hỏi & kỹ sư Xuyên Việt trả lời).
   - Tự động nhận diện ảnh chụp thực tế sự cố, phiếu yêu cầu kỹ thuật, bản vẽ CAD.
4. **Thuật Toán Tự Động Bóc Tách SĐT & Tên Công Ty (Contact Entity Extraction)**:
   - Tự động phân tích nội dung chat để bóc tách Số điện thoại di động (kể cả định dạng có dấu chấm như `078.58.33.555` hoặc `0903 018 135`), Tên doanh nghiệp/nhà máy (`CÔNG TY CP MÔI TRƯỜNG SOWATO`) và Mã số thuế.
5. **Gửi Tin Nhắn Phản Hồi Trực Tiếp (OA Chat API `/v3.0/oa/message/cs`)**:
   - Gửi tin nhắn tư vấn kỹ thuật, link báo giá sỉ PDF, video test sủi bọt than trực tiếp từ dòng lệnh hoặc kịch bản tự động.
6. **Đồng Bộ Dữ Liệu Vào CRM Data Lake (`wiki/crm/contacts/zalo-customers.json`)**:
   - Tự động hợp nhất danh bạ Zalo vào trung tâm dữ liệu khách hàng của công ty, phục vụ Kỹ sư Kinh doanh gọi điện chăm sóc trong SLA 15 phút.

---

## 2. Cấu Hình & Lưu Trữ Credentials

### A. File Cấu Hình Môi Trường (`.agents/.env`):
```env
# Zalo Official Account Credentials
ZALO_OA_ID=4514286263900160374
ZALO_OA_SERCRET=LLBJ2SVJ8YZ9E1YKDRLe
```

### B. File Lưu Trữ Token Tự Động (`wiki/crm/sync/zalo-tokens.json`):
```json
{
  "access_token": "csdTBddsL3kSRzabTlHI...",
  "refresh_token": "pmM-AIA1y4380xeYBOFs...",
  "expires_in": "90000",
  "updatedAt": "2026-08-30T08:50:41.000Z",
  "expiresAt": "2026-08-31T09:50:41.000Z"
}
```

---

## 3. Hướng Dẫn Vận Hành CLI (`./scripts/zalo-oa.js`)

Bộ công cụ [`scripts/zalo-oa.js`](./scripts/zalo-oa.js) được đóng gói khép kín trực tiếp bên trong thư mục skill, hỗ trợ toàn bộ các thao tác qua dòng lệnh:

### A. Xác Thực & Đổi Mã Token (Authentication)
```bash
# 1. Đăng nhập 1-Click tự động (Mở trình duyệt, tự bắt mã Code và đồng bộ CRM)
node scripts/zalo-oa.js --auto-login

# 2. Tạo link cấp quyền thủ công
node scripts/zalo-oa.js --auth-url

# 3. Đổi Authorization Code lấy Token & Tự động kéo khách hàng
node scripts/zalo-oa.js --exchange-code="<URL_CALLBACK_HOẶC_MÃ_CODE>" --sync

# 4. Làm mới Access Token thủ công khi cần
node scripts/zalo-oa.js --refresh-token
```

### B. Truy Vấn Hội Thoại & Khách Hàng (Data Retrieval)
```bash
# 1. Xem danh sách các cuộc hội thoại & tin nhắn mới nhất
node scripts/zalo-oa.js --conversations

# 2. Xem phân trang hội thoại
node scripts/zalo-oa.js --conversations --offset=10 --count=10

# 3. Đọc chi tiết lịch sử tin nhắn với 1 khách hàng theo User ID
node scripts/zalo-oa.js --messages=6660203449612699536
```

### C. Gửi Tin Nhắn CSKH Trực Tiếp
```bash
# Gửi tin nhắn văn bản cho khách hàng
node scripts/zalo-oa.js --send-text --user-id=6660203449612699536 --message="Chào Ms. Phát, Xuyên Việt gửi Anh/Chị báo giá vật liệu lọc công ty Sowato nhé ạ."
```

### D. Đồng Bộ Toàn Bộ Danh Bạ Về CRM Data Lake
```bash
# Quét toàn bộ hội thoại, bóc tách SĐT/Công ty và lưu vào wiki/crm/contacts/zalo-customers.json
node scripts/zalo-oa.js --sync-crm
```

---

## 4. Cấu Trúc Dữ Liệu Khách Hàng Zalo Chuẩn Hóa (`zalo-customers.json`)

Mỗi bản ghi khách hàng sau khi đồng bộ có cấu trúc JSON đầy đủ:

```json
{
  "zaloUserId": "6660203449612699536",
  "displayName": "Nguyễn Uyên Lập Phát",
  "avatar": "https://s240-ava-talk.zadn.vn/0/e/8/e/19/240/b8d6f4c9ebc3a4bebb6cff83778d7880.jpg",
  "phone": "0785833555",
  "companyName": "CÔNG TY CP MÔI TRƯỜNG SOWATO",
  "lastMessage": "Dạ em gửi:\nCÔNG TY CP MÔI TRƯỜNG SOWATO \nĐịa chỉ: 143 Tây Sơn, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam\n078.58.33.555 - Ms. Phát",
  "lastMessageTime": "16:58:09 25/08/2026",
  "timestamp": 1787651889325,
  "channel": "Zalo OA Direct Chat",
  "conversationHistory": [
    {
      "sender": "Nguyễn Uyên Lập Phát",
      "time": "16:56:01 25/08/2026",
      "type": "text",
      "message": "Dạ em bên công ty môi trường Sowato. Em cần mua những vật liệu sau , mình xem qua r cho em xin báo giá với"
    },
    {
      "sender": "Nguyễn Uyên Lập Phát",
      "time": "16:56:38 25/08/2026",
      "type": "photo",
      "message": "https://photo-stal-11.zdn.vn/no/jpg/a4eb260654d28c8cd5c3/2aOboQtyuXq7qLkqDMgHcthd0AkDqzPmG7Pv3Aa8.jpg"
    },
    {
      "sender": "Enterprise Corp",
      "time": "16:57:23 25/08/2026",
      "type": "text",
      "message": "cho e xin sdt mình a"
    },
    {
      "sender": "Nguyễn Uyên Lập Phát",
      "time": "16:58:09 25/08/2026",
      "type": "text",
      "message": "Dạ em gửi:\nCÔNG TY CP MÔI TRƯỜNG SOWATO \nĐịa chỉ: 143 Tây Sơn, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam\n078.58.33.555 - Ms. Phát"
    }
  ]
}
```

---

## 5. Tích Hợp Lập Trình Node.js (Programmatic API Usage)

Module `scripts/zalo-oa.js` có thể được import và sử dụng trực tiếp trong các dịch vụ backend khác:

```javascript
const { 
  getValidAccessToken, 
  getRecentChats, 
  getMessageHistory, 
  sendTextMessage, 
  syncZaloToCrm 
} = require('./scripts/zalo-oa');

async function handleZaloOperations() {
  // 1. Lấy token hợp lệ (tự động refresh nếu cần)
  const token = await getValidAccessToken();

  // 2. Lấy 10 cuộc hội thoại mới nhất
  const chats = await getRecentChats(0, 10);
  console.log(`Tìm thấy ${chats.length} cuộc trò chuyện`);

  // 3. Gửi tin nhắn báo giá tự động
  await sendTextMessage('6660203449612699536', 'Dạ Xuyên Việt đã gửi báo giá qua Zalo cho Anh/Chị!');

  // 4. Chạy đồng bộ toàn bộ về CRM Data Lake
  await syncZaloToCrm();
}
```

---

## 6. Bảng Mã Lỗi & Hướng Xử Lý (Zalo OA Troubleshooting)

| Mã Lỗi | Thông Báo | Nguyên Nhân | Hướng Xử Lý Chuẩn |
|:---:|---|---|---|
| `0` | `Success` | Thành công | Dữ liệu hợp lệ, xử lý bình thường. |
| `-210` | `maximum count is 10` | Tham số `count` truyền vào `listrecentchat` vượt quá 10 | Đặt `count = 10` và phân trang bằng `offset = 0, 10, 20...` |
| `-212` | `App has not registed this api` | Ứng dụng chưa bật quyền truy cập API đó trên Zalo Developer | Bật quyền tương ứng trong **Zalo for Developers $\rightarrow$ Ứng dụng $\rightarrow$ Cài đặt quyền**. |
| `-216` | `access_token is invalid or expired` | Access token hết hạn hoặc sai | Script `getValidAccessToken()` tự động gọi refresh token lấy mã mới. |
| `-240` | `UserInfo API has been shut down` | Gọi API v2 cũ đã bị Zalo đóng (từ 06/2024) | Chuyển sang sử dụng `listrecentchat` và `conversation` OpenAPI mới. |
| `404` | `You are accessing an empty or invalid API` | Endpoint URL không tồn tại | Sử dụng đúng các endpoint chuẩn hóa trong script `scripts/zalo-oa.js`. |
| `invalid redirect uri` | `Redirect URI không hợp lệ` | URL callback chưa được khai báo trong App Zalo Developer | Thêm `http://localhost:8080/callback` vào mục **Official Account Callback URL** trên `developers.zalo.me`. |
