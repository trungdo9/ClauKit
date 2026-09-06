#!/usr/bin/env bash
# Tạo/khởi động một profile agent-browser RIÊNG (không phải Chrome profile thật
# của user) và mở URL đăng nhập để người dùng tự tay đăng nhập một lần.
#
# Vì sao cần profile riêng thay vì lái thẳng Chrome thật của user (Default,
# Profile 1, ...): xem references/why-dedicated-profile.md. Tóm tắt — Chrome
# >=136 chặn cả hai cách "mượn" phiên đăng nhập thật:
#   - Copy profile (--profile <tên profile Chrome thật>): cookie mã hoá kiểu
#     App-Bound Encryption, không giải mã được ở bản sao.
#   - Gắn CDP vào Chrome thật đang chạy (--cdp/--remote-debugging-port):
#     Chrome từ chối mở cổng debug trên profile mặc định thật vì bảo mật.
#
# Usage:
#   bash setup-profile.sh <tên-profile> <url-đăng-nhập> [agent-browser-version]
#
# Ví dụ:
#   bash setup-profile.sh agent-browser-fb https://www.facebook.com/ 0.36.0
#   bash setup-profile.sh agent-browser-shopify https://admin.shopify.com/ 0.36.0

set -euo pipefail

PROFILE_NAME="${1:?Thiếu tên profile, ví dụ: agent-browser-fb}"
LOGIN_URL="${2:?Thiếu URL đăng nhập, ví dụ: https://www.facebook.com/}"
AGENT_BROWSER_VERSION="${3:-0.36.0}"

PROFILE_DIR="$HOME/.${PROFILE_NAME}"

echo "== 1/2: Cài agent-browser@${AGENT_BROWSER_VERSION} (bỏ qua nếu đã đúng version) =="
installed_version="$(agent-browser --version 2>/dev/null | awk '{print $2}' || true)"
if [ "$installed_version" != "$AGENT_BROWSER_VERSION" ]; then
  npm install -g "agent-browser@${AGENT_BROWSER_VERSION}"
else
  echo "Đã có agent-browser ${AGENT_BROWSER_VERSION}, bỏ qua cài đặt."
fi

echo "== 2/2: Mở cửa sổ đăng nhập =="
echo "Profile: ${PROFILE_DIR}"
echo "URL:     ${LOGIN_URL}"
echo "Cửa sổ Chrome sẽ hiện ra — TỰ TAY đăng nhập (email/mật khẩu/2FA nếu có)."
agent-browser --profile "$PROFILE_DIR" --headed open "$LOGIN_URL"

echo
echo "Xong. Sau khi đăng nhập xong trong cửa sổ Chrome, xác minh bằng:"
echo "  bash check-session.sh \"$PROFILE_NAME\" \"<url cần kiểm tra>\" \"<chuỗi báo ĐÃ đăng nhập>\" \"<chuỗi báo CHƯA đăng nhập>\""
