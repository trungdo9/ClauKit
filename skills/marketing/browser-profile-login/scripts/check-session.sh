#!/usr/bin/env bash
# Xác minh phiên đăng nhập của một profile agent-browser riêng còn hợp lệ
# hay không — bằng NỘI DUNG TRANG, không bằng URL/title.
#
# ⚠️ BÀI HỌC 2026-09-06 (xác minh trên facebook.com, Chrome 152): `get url` và
# `get title` trả về ĐÚNG như mong đợi (URL không đổi, title đúng) NGAY CẢ KHI
# phiên đăng nhập không hợp lệ — Facebook giữ nguyên URL nhưng render form
# đăng nhập. Chỉ `snapshot`/`get text` (đọc nội dung DOM thật) mới lộ ra điều
# này. Script này luôn kiểm tra bằng nội dung.
#
# Usage:
#   bash check-session.sh <tên-profile> <url> <chuỗi-báo-ĐÃ-đăng-nhập> <chuỗi-báo-CHƯA-đăng-nhập>
#
# Ví dụ (Facebook Group participant_requests):
#   bash check-session.sh agent-browser-fb \
#     "https://www.facebook.com/groups/631265717502650/participant_requests" \
#     "Yêu cầu tham gia" \
#     "Mật khẩu"
#
# Exit 0 = phiên hợp lệ (thấy chuỗi ĐÃ đăng nhập)
# Exit 1 = phiên KHÔNG hợp lệ (thấy chuỗi CHƯA đăng nhập / form đăng nhập)
# Exit 2 = không khớp mẫu nào — cần kiểm tra thủ công

set -euo pipefail

PROFILE_NAME="${1:?Thiếu tên profile}"
URL="${2:?Thiếu URL cần kiểm tra}"
LOGGED_IN_MARKER="${3:?Thiếu chuỗi báo ĐÃ đăng nhập, ví dụ: 'Yêu cầu tham gia'}"
LOGGED_OUT_MARKER="${4:?Thiếu chuỗi báo CHƯA đăng nhập, ví dụ: 'Mật khẩu'}"

PROFILE_DIR="$HOME/.${PROFILE_NAME}"

agent-browser --profile "$PROFILE_DIR" open "$URL" >/dev/null
sleep 1.5

page_text="$(agent-browser get text body 2>/dev/null || true)"

if echo "$page_text" | grep -qi "$LOGGED_OUT_MARKER"; then
  echo "❌ CHƯA ĐĂNG NHẬP (thấy: \"$LOGGED_OUT_MARKER\")."
  echo "   Chạy lại: bash setup-profile.sh \"$PROFILE_NAME\" \"$URL\""
  exit 1
fi

if echo "$page_text" | grep -qi "$LOGGED_IN_MARKER"; then
  echo "✅ Phiên hợp lệ (thấy: \"$LOGGED_IN_MARKER\")."
  exit 0
fi

echo "⚠️ Không khớp mẫu nào đã biết — kiểm tra thủ công:"
echo "   agent-browser --profile \"$PROFILE_DIR\" snapshot -i"
exit 2
