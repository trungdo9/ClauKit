---
name: facebook-group-post-moderation
description: Đọc và xử lý hàng chờ "Bài viết đang chờ" của Facebook Group TUYỂN DỤNG F&B [CareerFNB] (631265717502650) bằng agent-browser qua profile riêng đã xác thực — xác định loại bài, áp SOP theo loại, luôn xác nhận với người trước khi bấm Phê duyệt/Từ chối. Dùng khi user nói "duyệt bài group", "xử lý hàng chờ bài viết", "kiểm duyệt post". KHÔNG BAO GIỜ tự bấm mà không hỏi xác nhận trước — đây là rào cứng của skill, không phải gợi ý. Khác với [[facebook-group-member-approval]] (duyệt THÀNH VIÊN) — skill này duyệt NỘI DUNG BÀI VIẾT, luồng riêng, SOP riêng.
allowed-tools: Read, Bash, AskUserQuestion, Edit
---

# Group Post Moderation (agent-browser)

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

### ⚠️ Khi click `@ref` vào "Xem thêm" không ăn (đã xảy ra thật, không phải giả thuyết)

`snapshot`/`click @ref` cho nút "Xem thêm" **thường xuyên báo "✓ Done" nhưng KHÔNG bung nội dung** — kể cả sau `scrollintoview`, kể cả lấy `@ref` mới ngay trước khi bấm. Đừng lặp lại việc này quá 2 lần rồi đoán mò thêm — chuyển thẳng sang cách chắc ăn:

```bash
# a. Lấy tỉ lệ pixel thật của trang (LÀM 1 LẦN, đầu phiên — tỉ lệ có thể khác máy/lần chạy)
agent-browser --profile "$PROFILE" eval "({w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio})"
# ví dụ trả về {w:1038, h:703, dpr:2.5}

# b. Chụp màn hình (viewport, KHÔNG dùng --full — hay lỗi "Unable to capture screenshot" với trang dài)
agent-browser --profile "$PROFILE" screenshot "$HOME/agent-browser-shots/shot.png"
# Nếu lỗi "connection attempt failed"/os error 10060 → chỉ là timeout tạm thời, chạy lại lệnh y hệt là qua

# c. Đọc ảnh bằng Read tool (có khả năng nhìn ảnh) để xác định toạ độ "Xem thêm" trên ảnh HIỂN THỊ
#    Công cụ xem ảnh thường tự co giãn — nó sẽ cho biết "displayed at WxH, multiply by R để ra ảnh gốc"
#    Toạ độ thật để agent-browser click = (toạ_độ_trên_ảnh_gốc) / dpr
#    VD: ảnh gốc 2595x1758 (=1038*2.5 x 703*2.5, đúng bằng dpr) → điểm ảnh gốc (1804, 881) → click tại (1804/2.5, 881/2.5) = (722, 352)

# d. Bấm bằng chuột, không dùng click @ref
agent-browser --profile "$PROFILE" mouse move 722 352
agent-browser --profile "$PROFILE" mouse down
agent-browser --profile "$PROFILE" mouse up
agent-browser --profile "$PROFILE" wait 1000
agent-browser --profile "$PROFILE" get text body   # kiểm tra đã bung chưa
```

Nếu vùng bài viết bị **kẹt ở trạng thái loading (khung xám skeleton) không tự hết** dù đã cuộn qua lại và chờ — đừng cố cuộn/chờ thêm, chạy `agent-browser --profile "$PROFILE" reload` rồi cuộn lại từ đầu. Việc này đã xảy ra thật và reload luôn giải quyết được.

Với **mỗi** bài, áp đúng thứ tự `moderator-handbook.md` §3:
1. Xác định loại (A. tin tuyển dụng / B. chia sẻ trải nghiệm / C. hỏi đáp / D. khác)
2. Quét danh mục CẤM trước tiên (mục 2 nội quy) — thấy là gỡ ngay, bỏ qua các bước sau
3. Áp nhánh đúng loại (A: đủ 6 thông tin? · B: có lộ thông tin cá nhân người khác chưa che? có cáo buộc mơ hồ cần chuyển admin không? · C: mặc định duyệt · D: đọc kỹ, mặc định duyệt nếu không phạm mục 2)

Ghi vào bộ nhớ làm việc *(không phải file!)*: tên hiển thị (tạm, trong hội thoại) + loại bài + lý do + kết luận.

**🔴 Trước khi bấm bất kỳ nút nào:** trình bày cho người dùng — tác giả (tên hiển thị), loại bài, tiêu chí áp dụng, kết luận đề xuất (DUYỆT/GỠ/CHUYỂN ADMIN XEM) — và **chờ xác nhận rõ ràng**. Case mơ hồ (thiếu 1/6 thông tin nhưng rõ ràng vô ý, review nêu tên nhưng không có sự việc cụ thể...) **luôn hỏi**, không tự quyết theo hướng chặt hơn hay lỏng hơn SOP. Chỉ sau khi có xác nhận mới:

```bash
# Nút có tên tác giả trong nhãn dễ nhắm hơn @ref số, VD:
#   button "Phê duyệt bài viết của Yingg"   button "Phê duyệt bài viết của Quân"
# ⚠️ Nhãn chỉ lấy TỪ CUỐI của tên hiển thị, không phải cả tên đầy đủ:
#   "Minh Quân" → nút ghi "...của Quân"    "NT Trang" → "...của Trang"    "Nhật Hạ" → "...của Hạ"
ref="$(agent-browser --profile "$PROFILE" snapshot -i | grep -F 'button "Phê duyệt bài viết của <từ cuối tên>"' | grep -oE 'ref=e[0-9]+' | head -1 | cut -d= -f2)"
agent-browser --profile "$PROFILE" click "@$ref"
```

Sau mỗi click, kiểm tra lại `get text body` để xác nhận bài đã biến mất khỏi hàng chờ và **không có checkpoint/captcha/cảnh báo bảo mật nào xuất hiện**. **Refs đổi sau mỗi thao tác làm DOM đổi** (bung "Xem thêm", click Duyệt/Từ chối) — luôn `snapshot` lại lấy ref mới trước khi bấm tiếp, không tái dùng ref cũ.

### 🔴 Bắt buộc: kiểm tra trùng lặp NGAY sau mỗi lần Duyệt

Đã xảy ra thật 2026-09-06: vừa Duyệt xong 1 bài, bài **y hệt** (cùng tác giả, cùng nội dung) xuất hiện lại trong hàng chờ với mốc "Vừa xong". Sau **mỗi** lần bấm Phê duyệt (không phải cuối phiên):

```bash
agent-browser --profile "$PROFILE" get text body | grep -c "^<Tên tác giả vừa duyệt>$"
```

Kết quả > 0 (hoặc thấy tên đó xuất hiện lại ở đầu danh sách, mốc "Vừa xong") → **DỪNG, báo người dùng ngay**, không tự bấm Duyệt hay Từ chối một mình cho bản trùng — xem `moderator-handbook.md` §6 rào P5. **Tuyệt đối không duyệt cùng một bài hai lần trong một phiên.**

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
- 🔴 **Duyệt cùng một bài (cùng tác giả + nội dung) hai lần trong một phiên** — luôn kiểm tra trùng lặp ngay sau mỗi lần Duyệt (xem mục trên), thấy trùng thì dừng hỏi người, không tự quyết.
- Tin vào alt-text OCR của Facebook cho bài chỉ có ảnh poster (thường bị lỗi ký tự, không đủ tin cậy để áp SOP). Nếu nội dung chính nằm trong ảnh, dùng cách chụp màn hình + đọc bằng Read tool (xem mục "Khi click @ref vào Xem thêm không ăn" — cùng kỹ thuật toạ độ DPR áp dụng để xem trực tiếp ảnh).

## Cuối phiên

Cộng phân bố theo loại bài (A/B/C/D) + kết luận (duyệt/gỡ/chuyển admin) trong hội thoại → ghi vào `wiki/raw/group-membership-YYYY-MM-DD.md` (chung file với snapshot member, thêm block riêng) theo mẫu `moderator-handbook.md` §5 — chỉ số đếm, không tên.
