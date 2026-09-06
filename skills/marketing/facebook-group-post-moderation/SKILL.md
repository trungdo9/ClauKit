---
name: facebook-group-post-moderation
description: Đọc và xử lý hàng chờ "Bài viết đang chờ" của Facebook Group TUYỂN DỤNG F&B [CareerFNB] (631265717502650) bằng agent-browser qua profile riêng đã xác thực — xác định loại bài, áp SOP theo loại, luôn xác nhận với người trước khi bấm Phê duyệt/Từ chối. Dùng khi user nói "duyệt bài group", "xử lý hàng chờ bài viết", "kiểm duyệt post". KHÔNG BAO GIỜ tự bấm mà không hỏi xác nhận trước — đây là rào cứng của skill, không phải gợi ý. Khác với [[facebook-group-member-approval]] (duyệt THÀNH VIÊN) — skill này duyệt NỘI DUNG BÀI VIẾT, luồng riêng, SOP riêng.
allowed-tools: Read, Bash, AskUserQuestion, Edit
---

# Group Post Moderation (agent-browser)

> ⚠️ **Ví dụ tham khảo từ một project con** (`careerfnb-ag`), không phải skill tổng quát. Gắn cứng URL/ID của một Facebook Group cụ thể và tham chiếu file `wiki/social/moderator-handbook.md` chỉ tồn tại trong project gốc đó. Dùng file này làm **mẫu để copy/chỉnh lại** cho project khác. Phần dùng chung, tái sử dụng được thật sự là **[[browser-profile-login]]**.

> Duyệt bài viết ≠ duyệt member. Facebook không có Admin Assist tự động cho nội dung bài (chỉ có bộ lọc "Có thể là spam" của Meta, không tuỳ biến được) — mọi tiêu chí trong SOP đều cần đọc hiểu nội dung, xử lý tay 100%. Mọi click phải có người xác nhận trước, không có ngoại lệ.

## Đọc trước khi dùng (nguồn chân lý, không lặp lại nội dung ở đây)

| File | Vai trò |
|---|---|
| `wiki/social/moderator-handbook.md` | **Logic quyết định** — xác định loại bài, quét danh mục cấm, đủ 6 thông tin bắt buộc (tin tuyển dụng), xử lý vi phạm lặp lại |
| `.claude/skills/marketing/browser-profile-login/SKILL.md` | Setup profile riêng + xác minh phiên đăng nhập — dùng skill này cho mọi việc đăng nhập, không lặp lại ở đây |
| `.claude/skills/marketing/facebook-group-member-approval/SKILL.md` | Skill song song, duyệt **member** (khác luồng, khác SOP) |
| `plans/20260904-1421-careerfnb-multisite-content-community-architecture/phase-03-social-community-activation.md` §5.2 | Nguyên văn nội quy Group — nguồn của mọi tiêu chí trong `moderator-handbook.md` |
| `social/group-cong-dong-fnb/config.json` | `content_not_allowed`, `ugc_policy` — chính sách nội dung tổng quát |

## Khi nào dùng skill này

**Implicit:** cần đọc/xử lý hàng chờ bài viết ("Bài viết đang chờ") của Group này.
**Explicit:** "Dùng skill facebook-group-post-moderation để [việc]."

## Setup một lần

Dùng chung profile với duyệt member — xem `[[browser-profile-login]]`. Không cần setup riêng nếu đã làm cho `facebook-group-member-approval`.

## Quy trình mỗi phiên

```bash
PROFILE="$HOME/.agent-browser-fb"
PENDING_POSTS_URL="https://www.facebook.com/groups/631265717502650/pending_posts"

# 0. Xác minh phiên còn sống trước
bash .claude/skills/marketing/browser-profile-login/scripts/check-session.sh \
  agent-browser-fb "$PENDING_POSTS_URL" "Bài viết đang chờ" "Mật khẩu"

# 1. Mở đúng trang (điều hướng qua link "Bài viết đang chờ" trên sidebar Group,
#    KHÔNG đoán URL — URL thật là /pending_posts, không phải /posts_pending hay tương tự)
agent-browser --profile "$PROFILE" open "$PENDING_POSTS_URL"

# 2. Đọc — mỗi bài thường bị cắt ngắn kèm nút "Xem thêm", PHẢI bung hết mới đủ dữ liệu
#    áp SOP (đặc biệt để đếm đủ 6 thông tin bắt buộc của tin tuyển dụng)
agent-browser --profile "$PROFILE" snapshot -i        # tìm @ref các nút "Xem thêm"
agent-browser --profile "$PROFILE" click @eXX          # bung từng bài trước khi đọc
agent-browser --profile "$PROFILE" get text body        # đọc nội dung đầy đủ
```

Với **mỗi** bài, áp đúng thứ tự `moderator-handbook.md` §3:
1. Xác định loại (A. tin tuyển dụng / B. chia sẻ trải nghiệm / C. hỏi đáp / D. khác)
2. Quét danh mục CẤM trước tiên (mục 2 nội quy) — thấy là gỡ ngay, bỏ qua các bước sau
3. Áp nhánh đúng loại (A: đủ 6 thông tin? · B: có lộ thông tin cá nhân người khác chưa che? có cáo buộc mơ hồ cần chuyển admin không? · C: mặc định duyệt · D: đọc kỹ, mặc định duyệt nếu không phạm mục 2)

Ghi vào bộ nhớ làm việc *(không phải file!)*: tên hiển thị (tạm, trong hội thoại) + loại bài + lý do + kết luận.

**🔴 Trước khi bấm bất kỳ nút nào:** trình bày cho người dùng — tác giả (tên hiển thị), loại bài, tiêu chí áp dụng, kết luận đề xuất (DUYỆT/GỠ/CHUYỂN ADMIN XEM) — và **chờ xác nhận rõ ràng**. Case mơ hồ (thiếu 1/6 thông tin nhưng rõ ràng vô ý, review nêu tên nhưng không có sự việc cụ thể...) **luôn hỏi**, không tự quyết theo hướng chặt hơn hay lỏng hơn SOP. Chỉ sau khi có xác nhận mới:

```bash
# Ưu tiên nút có tên tác giả trong nhãn (VD: "Phê duyệt bài viết của Yingg") — rõ ràng hơn @ref số
agent-browser --profile "$PROFILE" click @eXX
```

Sau mỗi click, kiểm tra lại `get text body` để xác nhận bài đã biến mất khỏi hàng chờ và **không có checkpoint/captcha/cảnh báo bảo mật nào xuất hiện**. **Refs đổi sau mỗi thao tác làm DOM đổi** (bung "Xem thêm", click Duyệt/Từ chối) — luôn `snapshot` lại lấy ref mới trước khi bấm tiếp, không tái dùng ref cũ.

## Lần đầu chạy thật trong một phiên hội thoại mới

Chưa có kịch bản chạy thử riêng cho bài viết như member (`browser-automation-workflow.md` §6) — áp dụng tinh thần tương tự: đọc + đề xuất cho **~3-5 bài đầu**, chờ xác nhận, bấm đúng số đó, kiểm tra không cảnh báo, rồi mới xử lý tiếp số lượng lớn hơn trong cùng phiên.

## Xử lý vi phạm lặp lại

`moderator-handbook.md` §4 — lần 1 gỡ + nhắn riêng, lần 2 mute 7 ngày, lần 3 xoá khỏi nhóm, lừa đảo/thu phí xoá ngay không cảnh cáo. **Xoá khỏi nhóm (lần 3) luôn cần xác nhận riêng với admin chính, không tự quyết dù đã đủ điều kiện SOP** — xem rào P1 trong `moderator-handbook.md` §6.

## Không bao giờ làm

- Tự bấm Phê duyệt/Từ chối mà không có xác nhận rõ ràng của người dùng cho **từng** bài.
- Ghi tên tác giả, link profile, hoặc nội dung bài chưa che thông tin cá nhân người khác vào bất kỳ file nào trong repo (RG.4). Chỉ ghi **số đếm theo loại bài + kết luận** vào `wiki/raw/group-membership-YYYY-MM-DD.md` (block riêng cho bài viết) cuối phiên.
- Tự ý báo cáo (Report) bài lên Meta hoặc xoá thành viên khỏi nhóm (vi phạm lần 3) mà chưa hỏi admin chính.
- Tự quyết case "review nêu tên + cáo buộc mơ hồ, không có sự việc cụ thể" — luôn chuyển admin xem, không tự gỡ cũng không tự duyệt (rủi ro pháp lý B2B, xem `phase-03` §5.10).
- Đoán mò `@ref` — luôn `snapshot`/`get text` lại trước khi click, đặc biệt sau khi bung "Xem thêm" (làm DOM đổi y như sau khi click Duyệt/Từ chối).

## Cuối phiên

Cộng phân bố theo loại bài (A/B/C/D) + kết luận (duyệt/gỡ/chuyển admin) trong hội thoại → ghi vào `wiki/raw/group-membership-YYYY-MM-DD.md` (chung file với snapshot member, thêm block riêng) theo mẫu `moderator-handbook.md` §5 — chỉ số đếm, không tên.
