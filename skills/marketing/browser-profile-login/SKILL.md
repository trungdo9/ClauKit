---
name: browser-profile-login
description: Tạo profile Chrome riêng cho agent-browser và duy trì phiên đăng nhập cho bất kỳ site nào cần login (Facebook, Shopify admin, CMS...) khi KHÔNG lái được profile Chrome thật của user (Chrome >=136 chặn cả copy profile lẫn gắn CDP vào profile mặc định). Dùng khi cần agent-browser giữ phiên đăng nhập bền vững, hoặc khi debug lỗi "vẫn ra trang đăng nhập dù URL đúng". Không tự động hoá bước gõ mật khẩu — luôn cần người đăng nhập thủ công một lần.
allowed-tools: Read, Bash
---

# Browser Profile Login (agent-browser)

> Nền tảng dùng chung cho mọi automation cần agent-browser giữ phiên đăng nhập. Task cụ thể (duyệt member Group, đăng bài Fanpage, ...) là skill riêng, gọi vào đây cho phần xác thực.

## Vấn đề đã xác minh (2026-09-06, Chrome 152.0.7977.76 trên Windows)

Cách trực giác là lái thẳng profile Chrome thật của user (đã đăng nhập sẵn) để khỏi phải đăng nhập lại. **Cả hai cách làm điều đó đều bị Chrome >=136 chặn:**

| Cách thử | Kết quả |
|---|---|
| `agent-browser --profile "Default"` (copy profile Chrome thật vào thư mục tạm) | Copy file có thể thành công, nhưng **cookie phiên đăng nhập không giải mã được** ở bản sao — Chrome mã hoá cookie kiểu App-Bound Encryption ràng buộc theo đường dẫn/tiến trình gốc. Trang trả về đúng URL nhưng nội dung là **form đăng nhập** |
| `agent-browser --cdp <port>` gắn vào Chrome thật đang chạy kèm `--remote-debugging-port` | Chrome bản mới **từ chối mở cổng debug** khi dùng `--user-data-dir` mặc định/profile thật — chỉ chấp nhận với `--user-data-dir` riêng biệt |

⚠️ **Bẫy dễ nhầm:** `agent-browser get url` và `get title` trả về **đúng như mong đợi** ngay cả khi phiên không hợp lệ — không đủ để xác nhận đã đăng nhập. Chỉ `snapshot -i` hoặc `get text body` (đọc nội dung DOM thật) mới lộ ra form đăng nhập. Luôn xác minh bằng nội dung, không bằng URL/title.

## Giải pháp: profile riêng, độc lập

Không copy, không phải profile mặc định của user ⇒ không dính cả hai chặn trên. Đổi lại: đăng nhập thủ công một lần cho mỗi site/tài khoản.

```bash
cd .claude/skills/marketing/browser-profile-login/scripts

# Một lần / site / tài khoản — mở cửa sổ thật, TỰ TAY đăng nhập
bash setup-profile.sh <tên-profile> <url-đăng-nhập> [agent-browser-version]
# ví dụ:
bash setup-profile.sh agent-browser-fb https://www.facebook.com/ 0.36.0

# Sau khi đăng nhập xong trong cửa sổ hiện ra — xác minh phiên còn sống
bash check-session.sh <tên-profile> <url> "<chuỗi báo ĐÃ đăng nhập>" "<chuỗi báo CHƯA đăng nhập>"
# ví dụ:
bash check-session.sh agent-browser-fb \
  "https://www.facebook.com/groups/631265717502650/participant_requests" \
  "Yêu cầu tham gia" "Mật khẩu"
```

Profile lưu tại `~/.<tên-profile>` (ví dụ `~/.agent-browser-fb`) — thư mục thật, bền vững qua các lần chạy, không bị xoá giữa các phiên.

## Dùng lại phiên đã đăng nhập

```bash
agent-browser --profile "$HOME/.<tên-profile>" open "<url>"
agent-browser --profile "$HOME/.<tên-profile>" snapshot -i
agent-browser --profile "$HOME/.<tên-profile>" get text body
```

## Khi nào chạy lại `setup-profile.sh`

- `check-session.sh` trả về exit 1 (thấy form đăng nhập).
- Facebook/site yêu cầu xác minh lại (checkpoint) — xử lý thủ công trong cửa sổ `--headed`, không cố vượt qua bằng script.
- Đổi tài khoản đăng nhập cho cùng site → dùng **tên profile khác**, không ghi đè profile cũ (tránh lẫn phiên 2 tài khoản).

## Không bao giờ làm

- Không tự động điền email/mật khẩu/2FA bằng script — luôn để người dùng tự gõ trong cửa sổ `--headed`.
- Không dùng `--profile <tên profile Chrome thật của user>` (Default, Profile 1, ...) — đã xác nhận không hoạt động ở Chrome >=136.
- Không kết luận "đã đăng nhập" chỉ dựa vào `get url`/`get title` — luôn xác minh bằng `check-session.sh` hoặc đọc nội dung trực tiếp.
- Không cố vượt checkpoint/CAPTCHA bằng cách thử lại nhiều lần — dừng, để người xử lý thủ công trong cửa sổ `--headed`.

## Dùng bởi

- `.claude/skills/marketing/group-member-approval/SKILL.md` — duyệt member Facebook Group `TUYỂN DỤNG F&B [CareerFNB]`
