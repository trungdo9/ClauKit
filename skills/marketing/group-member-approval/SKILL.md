---
name: group-member-approval
description: Đọc và xử lý hàng chờ "Yêu cầu tham gia" của Facebook Group TUYỂN DỤNG F&B [CareerFNB] (631265717502650) bằng agent-browser (Vercel Labs) qua profile Chrome riêng đã xác thực — áp logic SOP, luôn xác nhận với người trước khi bấm Phê duyệt/Từ chối. Dùng khi user nói "duyệt member group", "xử lý hàng chờ tham gia", "chạy phiên duyệt thứ 3/thứ 6", "mở participant_requests". KHÔNG BAO GIỜ tự bấm mà không hỏi xác nhận trước — đây là rào cứng của skill, không phải gợi ý.
allowed-tools: Read, Bash, AskUserQuestion, Edit
---

# Group Member Approval (agent-browser)

> ⚠️ **Ví dụ tham khảo từ một project con** (`careerfnb-ag`), không phải skill tổng quát. Gắn cứng URL/ID của một Facebook Group cụ thể và tham chiếu vài file chỉ tồn tại trong project gốc đó (`social/group-cong-dong-fnb/browser-automation-workflow.md`, `wiki/social/community-guidelines/member-approval-sop.md`, `config.json`, `action-checklist.md`). Dùng file này làm **mẫu để copy/chỉnh lại** cho project khác — không mong đợi các đường dẫn đó tồn tại sẵn trong ClauKit. Phần dùng chung, tái sử dụng được thật sự là **[[browser-profile-login]]**.

> Cổng vào của Group `TUYỂN DỤNG F&B [QUẢN LÝ - KHỐI VĂN PHÒNG - NHÀ HÀNG - CAFE] [CareerFNB]` (9,4K thành viên). Đây là thao tác thật trên tài sản thật — mọi click phải có người xác nhận trước, không có ngoại lệ.

## Đọc trước khi dùng (nguồn chân lý, không lặp lại nội dung ở đây)

| File | Vai trò |
|---|---|
| `.claude/skills/marketing/browser-profile-login/SKILL.md` | **[[browser-profile-login]]** — setup profile riêng + xác minh phiên đăng nhập. Dùng skill này cho MỌI việc liên quan tới đăng nhập/profile, không lặp lại ở đây |
| `social/group-cong-dong-fnb/browser-automation-workflow.md` | Quy trình đầy đủ + 8 rào an toàn S1–S8 + kịch bản chạy thử lần đầu §6 + xử lý sự cố §7 |
| `wiki/social/community-guidelines/member-approval-sop.md` | **Logic quyết định** Duyệt/Từ chối — bước 1-4, đếm phân bố, ngoại lệ |
| `social/group-cong-dong-fnb/config.json` | Trạng thái profile/tool hiện tại (`browser_automation.*`), baseline |
| `plans/campaigns/global-member-gate-automation/action-checklist.md` | Checklist P0→P6, tiêu chí nghiệm thu |

## Khi nào dùng skill này

**Implicit:** cần đọc/xử lý hàng chờ member request của Group này, chạy phiên duyệt định kỳ (T3/T6), hoặc chạy thử lần đầu automation.
**Explicit:** "Dùng skill group-member-approval để [việc]."

## Setup một lần

Dùng skill `[[browser-profile-login]]` — **không lặp lại quy trình ở đây**. Tóm tắt lệnh cho profile của Group này:

```bash
cd .claude/skills/marketing/browser-profile-login/scripts
bash setup-profile.sh agent-browser-fb https://www.facebook.com/ 0.36.0
# → tự tay đăng nhập trong cửa sổ hiện ra

bash check-session.sh agent-browser-fb \
  "https://www.facebook.com/groups/631265717502650/participant_requests" \
  "Yêu cầu tham gia" "Mật khẩu"
```

Profile lưu tại `~/.agent-browser-fb`. Không dùng `--profile Default` / bất kỳ profile Chrome thật nào khác của user — đã xác nhận không hoạt động (Chrome ≥136).

## Quy trình mỗi phiên

```bash
PROFILE="$HOME/.agent-browser-fb"
GROUP_URL="https://www.facebook.com/groups/631265717502650/participant_requests"

# 0. Xác minh phiên còn sống trước — đừng giả định (xem browser-profile-login §Bẫy dễ nhầm)
bash .claude/skills/marketing/browser-profile-login/scripts/check-session.sh \
  agent-browser-fb "$GROUP_URL" "Yêu cầu tham gia" "Mật khẩu"

# 1. Mở đúng 1 URL — không lang thang (rào S6)
agent-browser --profile "$PROFILE" open "$GROUP_URL"

# 2. Đọc nội dung thật — snapshot lấy @ref cho nút Phê duyệt/Từ chối của từng request
agent-browser --profile "$PROFILE" snapshot -i
# hoặc đọc text thuần để nắm bối cảnh (tuổi tài khoản, bài đã đăng, câu trả lời Q1/Q2/Q3 nếu có)
agent-browser --profile "$PROFILE" get text body
```

Với **mỗi** request, áp đúng thứ tự `member-approval-sop.md` §3 (Q3 → Q1/Q2 → 3 dấu hiệu đỏ → mặc định DUYỆT khi phân vân). Ghi vào bộ nhớ làm việc *(không phải file!)*: tên hiển thị (tạm, trong hội thoại) + lý do + kết luận.

**🔴 Trước khi bấm bất kỳ nút nào:** trình bày cho người dùng — tên request, dữ liệu áp dụng SOP, kết luận đề xuất (DUYỆT/TỪ CHỐI) — và **chờ xác nhận rõ ràng** (dùng `AskUserQuestion` nếu không chắc, không suy diễn im lặng là đồng ý). Chỉ sau khi có xác nhận mới:

```bash
agent-browser --profile "$PROFILE" click @eXX   # đúng ref của request đã xác nhận, không đoán
```

Sau mỗi click, kiểm tra lại `agent-browser --profile "$PROFILE" get text body` (hoặc `snapshot -i`) để xác nhận request đã biến mất khỏi hàng chờ và **không có checkpoint/captcha/cảnh báo bảo mật nào xuất hiện**.

## Rào an toàn — bắt buộc, không tự nới (chi tiết: `browser-automation-workflow.md` §3)

| # | Rào |
|:-:|---|
| S1 | Trần **50 request/phiên** |
| S2 | Người phải **ngồi cạnh** — không chạy khi vắng người |
| S3 | 🔴 Gặp checkpoint/captcha → **dừng hẳn, không thử lại**, báo người |
| S4 | Không bấm nút có hộp thoại xác nhận khi chưa rõ nội dung |
| S5 | Log mọi quyết định **trước khi bấm** (trong hội thoại, không phải file) |
| S6 | Chỉ đụng đúng URL `/participant_requests` |
| S7 | 🔴 **Không bao giờ** dùng "Từ chối và chặn" — chỉ "Từ chối" |
| S8 | Tỉ lệ từ chối > 30%/phiên → dừng, báo người xem lại logic |

**Lần đầu chạy thật trong một phiên hội thoại mới** (chưa từng bấm gì trong phiên này): bắt buộc theo kịch bản 4 bước §6 (đọc thuần → đề xuất 5 request đầu chưa bấm → bấm đúng 5 có người xem → kiểm tra không cảnh báo) trước khi xử lý số lượng lớn hơn.

## Không bao giờ làm

- Tự bấm Phê duyệt/Từ chối mà không có xác nhận rõ ràng của người dùng cho **từng** request.
- Ghi tên thành viên, link profile, hoặc ảnh chưa che vào bất kỳ file nào trong repo (RG.4). Chỉ ghi **số đếm/phân bố** vào `wiki/raw/group-membership-YYYY-MM-DD.md` cuối phiên.
- Dùng "Từ chối và chặn".
- Vượt trần 50 request/phiên hoặc chạy khi không có người giám sát.
- Cố vượt qua checkpoint/captcha bằng cách thử lại hoặc đổi selector khác.
- Đoán mò `@ref` — luôn `snapshot`/`get text` lại để xác nhận request còn đúng vị trí trước khi click, vì trang có thể đổi thứ tự.

## Cuối phiên

Cộng phân bố đã duyệt/từ chối/bỏ qua trong hội thoại → ghi `wiki/raw/group-membership-YYYY-MM-DD.md` theo mẫu `wiki/templates/group-membership-weekly-snapshot.md` (chỉ số đếm) → tick các `ACT-*` liên quan trong `action-checklist.md`.
