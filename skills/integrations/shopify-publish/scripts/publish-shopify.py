#!/usr/bin/env python3
"""
publish-shopify.py — Công cụ chuẩn hóa và xuất bản bài viết lên Shopify (aau.vn)

TÍNH NĂNG:
  1. Đọc credentials từ .claude/.env hoặc .env (SHOPIFY_URL, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_KEY).
  2. Parse Markdown và YAML Frontmatter (thuần standard library, zero-dependency).
  3. Render Markdown sang HTML ngữ nghĩa tối ưu cho Shopify RTE.
  4. Hỗ trợ tạo mới (POST) và cập nhật (PUT) bài viết qua Shopify Admin REST API.
  5. Đẩy SEO title và meta description vào Shopify Metafields (namespace: global).
  6. Tự động gán tags: pillar, sub_pillar, tags nội dung để phục vụ Theme Injection.
  7. Chế độ --dry-run an toàn: kiểm tra HTML, metadata, tags trước khi đẩy lên live.

HƯỚNG DẪN SỬ DỤNG:
  # 1. Kiểm tra kết nối API và quyền truy cập
  python3 scripts/publish-shopify.py test

  # 2. Liệt kê các Blog trên Shopify (lấy Blog ID)
  python3 scripts/publish-shopify.py list-blogs

  # 3. Chạy thử nghiệm xem trước (Dry-run, không tạo bài thật)
  python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --dry-run

  # 4. Đẩy bài lên Shopify ở chế độ BẢN NHÁP (Draft - an toàn)
  python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --draft

  # 5. Xuất bản bài viết CÔNG KHAI (Published)
  python3 scripts/publish-shopify.py post wiki/aau.vn/drafts/bai-viet.md --publish

  # 6. Đẩy hàng loạt bài viết từ một thư mục
  python3 scripts/publish-shopify.py batch --dir wiki/aau.vn/drafts/ --draft
"""

import os
import sys
import json
import re
import argparse
import unicodedata
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, List

def find_repo_root() -> Path:
    """Tìm gốc repository bằng cách dò ngược lên tìm .git hoặc CLAUDE.md."""
    try:
        cur = Path(__file__).resolve().parent
    except NameError:
        cur = Path.cwd()
    while cur != cur.parent:
        if (cur / ".git").exists() or (cur / "CLAUDE.md").exists() or (cur / "GEMINI.md").exists():
            return cur
        cur = cur.parent
    return Path.cwd()

REPO_ROOT = find_repo_root()
API_VERSION = "2024-01"


# ==============================================================================
# 1. CONFIG & CREDENTIALS LOADER
# ==============================================================================

def load_env() -> Dict[str, str]:
    """Đọc biến môi trường từ hệ thống và các file .env."""
    env_vars = {}
    env_files = [
        REPO_ROOT / ".claude" / ".env",
        REPO_ROOT / ".agents" / ".env",
        REPO_ROOT / ".env"
    ]
    
    for fpath in env_files:
        if fpath.exists():
            with open(fpath, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in env_vars:
                            env_vars[k] = v

    # Ưu tiên biến môi trường của hệ điều hành nếu có
    for k in ["SHOPIFY_URL", "SHOPIFY_ACCESS_TOKEN", "SHOPIFY_API_KEY", "SHOPIFY_SECRET_", "SHOPIFY_SECRET"]:
        if k in os.environ:
            env_vars[k] = os.environ[k]

    return env_vars


def get_shopify_client(env_vars: Dict[str, str]):
    """Chuẩn bị cấu hình kết nối Shopify."""
    shop_url = env_vars.get("SHOPIFY_URL", "")
    if not shop_url:
        raise ValueError("Thiếu SHOPIFY_URL trong file .env (ví dụ: 0sd2qs-3p.myshopify.com)")
    
    # Chuẩn hóa domain
    shop_url = shop_url.replace("https://", "").replace("http://", "").strip("/")
    
    # Token xác thực
    token = env_vars.get("SHOPIFY_ACCESS_TOKEN", "")
    if not token:
        # Fallback thử kiểm tra nếu SHOPIFY_SECRET_ có dạng shpat_
        secret = env_vars.get("SHOPIFY_SECRET_", "") or env_vars.get("SHOPIFY_SECRET", "")
        if secret.startswith("shpat_"):
            token = secret
        elif env_vars.get("SHOPIFY_API_KEY") and secret:
            token = None # Sẽ báo lỗi hướng dẫn lấy shpat_
            
    return shop_url, token


def api_request(shop_url: str, token: str, endpoint: str, method: str = "GET", data: Optional[Dict] = None) -> Dict:
    """Thực thi REST API call tới Shopify Admin API."""
    if not token:
        raise PermissionError(
            "Chưa có SHOPIFY_ACCESS_TOKEN (dạng 'shpat_...').\n"
            "Để lấy token này:\n"
            "  1. Đăng nhập Shopify Admin -> Settings -> Apps and sales channels -> Develop apps.\n"
            "  2. Mở App đã tạo -> Configure Admin API scopes: chọn 'write_content', 'read_content'.\n"
            "  3. Bấm 'Install app' -> Copy Admin API access token ('shpat_...').\n"
            "  4. Thêm vào .claude/.env: SHOPIFY_ACCESS_TOKEN=shpat_..."
        )

    url = f"https://{shop_url}/admin/api/{API_VERSION}/{endpoint.lstrip('/')}"
    headers = {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            resp_body = resp.read().decode("utf-8")
            return json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Shopify API Lỗi {e.code}: {err_msg}")
    except Exception as e:
        raise RuntimeError(f"Lỗi kết nối tới Shopify: {str(e)}")


# ==============================================================================
# 2. MARKDOWN TO HTML CONVERTER (ZERO-DEPENDENCY)
# ==============================================================================

def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Tách YAML frontmatter và nội dung Markdown thân bài."""
    meta = {}
    body = content

    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            raw_yaml = parts[1]
            body = parts[2].strip()
            current_key = None
            for raw_line in raw_yaml.splitlines():
                line = raw_line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith("- ") and current_key:
                    item = line[2:].strip().strip('"').strip("'")
                    if not isinstance(meta.get(current_key), list):
                        meta[current_key] = []
                    meta[current_key].append(item)
                elif ":" in line:
                    k, v = line.split(":", 1)
                    k = k.strip()
                    v = v.strip()
                    current_key = k
                    if not v:
                        meta[k] = []
                    elif v.startswith("[") and v.endswith("]"):
                        items = [item.strip().strip('"').strip("'") for item in v[1:-1].split(",") if item.strip()]
                        meta[k] = items
                    else:
                        meta[k] = v.strip('"').strip("'")

    return meta, body


def markdown_to_html(md_text: str) -> str:
    """
    Chuyển đổi Markdown sang HTML tương thích cao với Shopify Rich Text Editor.
    Hỗ trợ Headings, Tables, Lists, Blockquotes, Bold, Italic, Links, Images.
    """
    # FIX 2026-09-08: comment HTML <!-- ... --> là GHI CHÚ CỦA NGƯỜI VIẾT,
    # không bao giờ là nội dung. Trước đây converter không nhận ra nên bọc
    # chúng vào <p> -> lọt nguyên khối JSON-LD, đường ═══ và ghi chú nội bộ
    # (ACT-B7, [CHỜ DATA: ...]) ra trang công khai. Gỡ sạch trước khi convert.
    md_text = re.sub(r"<!--.*?-->", "", md_text, flags=re.S)

    # FIX 2026-09-08: CẤM TUYỆT ĐỐI <script> lọt vào thân bài viết.
    # Toàn bộ Schema Article, FAQPage, BreadcrumbList do Theme Liquid
    # (snippets/aau-structured-data.liquid) tự sinh trong <head>.
    # Nếu trong markdown có chứa thẻ <script> (như <script type="application/ld+json">),
    # converter cũ bọc từng dòng vào <p>, làm rò rỉ mã JSON thô ra giao diện.
    # Lọc sạch toàn bộ khối <script>...</script> trước khi convert:
    md_text = re.sub(r"<script\b[^>]*>.*?</script>", "", md_text, flags=re.S | re.I)

    lines = md_text.splitlines()
    html_lines = []
    in_table = False
    table_rows = []
    in_list = False
    list_type = None

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            in_table = False
            return ""
        html = ['<div class="table-responsive"><table class="aau-table" style="width:100%; border-collapse:collapse; margin:20px 0;">']
        # Header
        if len(table_rows) >= 1:
            html.append("<thead><tr>")
            for cell in table_rows[0]:
                html.append(f'<th style="border:1px solid #cbd5e1; padding:10px 12px; background:#f1f5f9; text-align:left; font-weight:600;">{inline_format(cell)}</th>')
            html.append("</tr></thead>")
        # Body
        if len(table_rows) > 1:
            html.append("<tbody>")
            for r in table_rows[1:]:
                html.append("<tr>")
                for cell in r:
                    html.append(f'<td style="border:1px solid #cbd5e1; padding:10px 12px;">{inline_format(cell)}</td>')
                html.append("</tr>")
            html.append("</tbody>")
        html.append("</table></div>")
        table_rows = []
        in_table = False
        return "\n".join(html)

    def inline_format(text: str) -> str:
        # Images: ![alt](url)
        text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" style="max-width:100%; height:auto; border-radius:6px; margin:16px 0;" />', text)
        # Links: [text](url)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" style="color:#0284c7; text-decoration:underline;">\1</a>', text)
        # Bold: **text**
        text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
        # Italic: *text* or _text_
        text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', text)
        # Inline code: `text`
        text = re.sub(r'`([^`]+)`', r'<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.9em;">\1</code>', text)
        return text

    def heading_parts(text: str):
        """
        FIX 2026-09-07: cú pháp `## Tiêu đề {#anchor}` trước đây bị nhả thẳng ra
        text (lỗi "{#s1}" hiện trên trang). Nay: bóc {#anchor} thành id=,
        và nếu heading không khai anchor thì TỰ SINH id từ chính tiêu đề
        (bỏ dấu tiếng Việt) để mục lục luôn nhảy được.
        """
        m = re.search(r'\s*\{#([A-Za-z0-9_-]+)\}\s*$', text)
        if m:
            return text[:m.start()].strip(), m.group(1)
        slug = unicodedata.normalize("NFD", text)
        slug = "".join(c for c in slug if unicodedata.category(c) != "Mn")
        slug = slug.replace("đ", "d").replace("Đ", "D").lower()
        slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")[:60]
        return text.strip(), (slug or None)

    def h(level: int, text: str, style: str) -> str:
        body, anchor = heading_parts(text)
        idattr = f' id="{anchor}"' if anchor else ""
        return f'<h{level}{idattr} style="{style}">{inline_format(body)}</h{level}>'

    i = 0
    while i < len(lines):
        raw_line = lines[i]
        line = raw_line.strip()

        # Xử lý Table (| cell | cell |)
        if line.startswith("|") and line.endswith("|"):
            parts = [c.strip() for c in line.strip("|").split("|")]
            # Bỏ qua separator row (|---|---|)
            if all(re.match(r'^:?-+:?$', c) for c in parts if c):
                i += 1
                continue
            in_table = True
            table_rows.append(parts)
            i += 1
            continue
        elif in_table:
            html_lines.append(flush_table())

        # Dòng trống
        if not line:
            if in_list:
                html_lines.append(f"</{list_type}>")
                in_list = False
                list_type = None
            i += 1
            continue

        # Headings
        if line.startswith("# "):
            html_lines.append(h(1, line[2:], "color:#0f172a; margin-top:28px; margin-bottom:16px;"))
        elif line.startswith("## "):
            html_lines.append(h(2, line[3:], "color:#0f172a; margin-top:28px; margin-bottom:14px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;"))
        elif line.startswith("### "):
            html_lines.append(h(3, line[4:], "color:#1e293b; margin-top:22px; margin-bottom:10px;"))
        elif line.startswith("#### "):
            html_lines.append(h(4, line[5:], "color:#334155; margin-top:18px; margin-bottom:8px;"))

        # Đường kẻ ngang --- / ***
        elif re.fullmatch(r'(-{3,}|\*{3,})', line):
            html_lines.append('<hr style="border:0; border-top:1px solid #e2e8f0; margin:28px 0;">')

        # Blockquote (> ...) — GỘP các dòng liền nhau thành MỘT khối
        # FIX 2026-09-08: bản cũ tạo 1 <blockquote> cho MỖI dòng, và dòng ">" rỗng
        # bị đẩy xuống nhánh paragraph -> hiện dấu ">" lạc trên trang. Ngoài ra
        # "> ### Tiêu đề" in nguyên "###" vì không xử lý markdown bên trong.
        elif line == ">" or line.startswith("> "):
            q_lines = []
            while i < len(lines):
                cur = lines[i].strip()
                if cur == ">":
                    q_lines.append("")
                elif cur.startswith("> "):
                    q_lines.append(cur[2:])
                else:
                    break
                i += 1
            i -= 1  # bù cho i += 1 ở cuối vòng lặp ngoài

            parts = []
            for q in q_lines:
                if not q:
                    continue
                if q.startswith("#### "):   parts.append(f'<strong style="display:block; margin-bottom:8px; font-size:1.05em;">{inline_format(q[5:])}</strong>')
                elif q.startswith("### "):  parts.append(f'<strong style="display:block; margin-bottom:8px; font-size:1.15em;">{inline_format(q[4:])}</strong>')
                elif q.startswith("## "):   parts.append(f'<strong style="display:block; margin-bottom:8px; font-size:1.25em;">{inline_format(q[3:])}</strong>')
                elif re.match(r'^[-*]\s+', q): parts.append(f'<div style="margin:4px 0 4px 14px;">• {inline_format(re.sub(chr(94)+"[-*]"+chr(92)+"s+","",q,count=1))}</div>')
                else:                       parts.append(f'<p style="margin:0 0 10px;">{inline_format(q)}</p>')
            if parts:
                html_lines.append(
                    '<blockquote style="border-left:4px solid #0284c7; background:#f8fafc; '
                    'padding:14px 18px; margin:20px 0; border-radius:0 6px 6px 0; color:#334155;">'
                    + "".join(parts) + '</blockquote>'
                )

        # Unordered list (- ... or * ...)
        elif re.match(r'^[-*]\s+', line):
            item_text = re.sub(r'^[-*]\s+', '', line)
            if not in_list or list_type != "ul":
                if in_list: html_lines.append(f"</{list_type}>")
                html_lines.append('<ul style="padding-left:24px; margin:16px 0; color:#334155;">')
                in_list = True
                list_type = "ul"
            html_lines.append(f'<li style="margin-bottom:6px;">{inline_format(item_text)}</li>')

        # Ordered list (1. ...)
        elif re.match(r'^\d+\.\s+', line):
            item_text = re.sub(r'^\d+\.\s+', '', line)
            if not in_list or list_type != "ol":
                if in_list: html_lines.append(f"</{list_type}>")
                html_lines.append('<ol style="padding-left:24px; margin:16px 0; color:#334155;">')
                in_list = True
                list_type = "ol"
            html_lines.append(f'<li style="margin-bottom:6px;">{inline_format(item_text)}</li>')

        # Raw HTML div / box
        elif line.startswith("<div") or line.startswith("</div"):
            html_lines.append(raw_line)

        # Paragraph
        else:
            if in_list:
                html_lines.append(f"</{list_type}>")
                in_list = False
                list_type = None
            html_lines.append(f'<p style="color:#334155; line-height:1.75; margin-bottom:16px;">{inline_format(line)}</p>')

        i += 1

    if in_table:
        html_lines.append(flush_table())
    if in_list:
        html_lines.append(f"</{list_type}>")

    return "\n".join(html_lines)


# ==============================================================================
# 3. SHOPIFY PUBLISHING ENGINE
# ==============================================================================

def get_or_detect_blog_id(shop_url: str, token: str, requested_id: Optional[int] = None) -> int:
    """Lấy Blog ID. Mặc định ưu tiên blog có handle 'news' hoặc blog đầu tiên."""
    if requested_id:
        return requested_id

    res = api_request(shop_url, token, "blogs.json")
    blogs = res.get("blogs", [])
    if not blogs:
        raise RuntimeError("Không tìm thấy Blog nào trên store Shopify!")

    # Tìm blog 'news'
    for b in blogs:
        if b.get("handle") == "news":
            return b["id"]

    # Fallback blog đầu tiên
    return blogs[0]["id"]


def prepare_article_payload(filepath: Path, publish: bool = False) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Đọc file Markdown và xây dựng Payload chuẩn cho Shopify Article API."""
    with open(filepath, "r", encoding="utf-8") as f:
        raw_content = f.read()

    meta, body_md = parse_frontmatter(raw_content)
    body_html = markdown_to_html(body_md)

    handle = meta.get("handle") or filepath.stem
    title = meta.get("title") or handle.replace("-", " ").title()
    description = meta.get("description", "")
    author = meta.get("author", "Tiến Tiên — AAU Academy")
    pillar = meta.get("pillar", "")
    sub_pillar = meta.get("sub_pillar", "")

    # Xây dựng danh sách Tags
    # THỨ TỰ QUAN TRỌNG (sửa 2026-09-08): theme lấy `article.tags.first` làm
    # category để chọn "Bài viết liên quan" (sections/aau-article-detail.liquid:5).
    # Nên tag CHỦ ĐỀ phải đứng ĐẦU; tag kỹ thuật pillar:/sub: xuống sau.
    # Trước đây pillar: đứng đầu -> tags.first không khớp bài nào -> khối liên quan
    # rơi về fallback "Bài viết mới nhất" với 3 bài không liên quan.
    tag_list = []
    if "tags" in meta:
        raw_tags = meta["tags"]
        if isinstance(raw_tags, list):
            tag_list.extend([str(x).strip() for x in raw_tags if str(x).strip()])
        elif isinstance(raw_tags, str):
            tag_list.extend([x.strip() for x in raw_tags.split(",") if x.strip()])
    if pillar:
        _pil = re.sub(r"[^\w.-]+", "-", pillar.lower().strip()).strip("-")
        tag_list.append(f"pillar:{_pil}")
    if sub_pillar:
        _sub = re.sub(r"[^\w.-]+", "-", sub_pillar.lower().strip()).strip("-")
        tag_list.append(f"sub:{_sub}")

    tags_str = ", ".join(list(dict.fromkeys(tag_list)))

    # Shopify Article Payload
    article_data = {
        "title": title,
        "handle": handle,
        "author": author,
        "body_html": body_html,
        "tags": tags_str,
        "published": publish
    }

    # Featured image nếu có
    if meta.get("featured_image"):
        article_data["image"] = {"src": meta["featured_image"]}

    # Summary HTML (dùng description)
    if description:
        article_data["summary_html"] = f"<p>{description}</p>"

    # SEO Metafields
    metafields = []
    if title:
        metafields.append({
            "key": "title_tag",
            "value": title,
            "type": "string",
            "namespace": "global"
        })
    if description:
        metafields.append({
            "key": "description_tag",
            "value": description,
            "type": "string",
            "namespace": "global"
        })

    if metafields:
        article_data["metafields"] = metafields

    summary_info = {
        "title": title,
        "handle": handle,
        "author": author,
        "tags": tags_str,
        "description": description,
        "body_length_chars": len(body_html),
        "published": publish
    }

    return {"article": article_data}, summary_info


def prepare_page_payload(filepath: Path, publish: bool = False) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Payload cho Shopify PAGE (/pages/<handle>) — thêm 2026-09-07.

    Vì sao cần: content-architecture.md §5 quy định 5 trang pillar phải là
    Shopify **Page**, KHÔNG phải blog article. Bản script trước chỉ có
    blogs/*/articles.json nên sẽ đẩy pillar lên /blogs/news/ — sai loại URL,
    phá ánh xạ pillar<->collection và phá Theme Injection (§6).

    Kích hoạt bằng frontmatter: content_type: page
    Khác Article: Page KHÔNG có `tags` và KHÔNG có featured `image`.
    """
    with open(filepath, "r", encoding="utf-8") as f:
        raw_content = f.read()

    meta, body_md = parse_frontmatter(raw_content)
    body_html = markdown_to_html(body_md)

    handle = meta.get("handle") or filepath.stem
    title = meta.get("title") or handle.replace("-", " ").title()
    description = meta.get("description", "")
    author = meta.get("author", "Tiến Tiên — AAU Academy")

    page_data = {
        "title": title,
        "handle": handle,
        "author": author,
        "body_html": body_html,
        "published": publish,
    }
    if meta.get("template_suffix"):
        page_data["template_suffix"] = meta["template_suffix"]

    metafields = []
    if title:
        metafields.append({"key": "title_tag", "value": title,
                           "type": "string", "namespace": "global"})
    if description:
        metafields.append({"key": "description_tag", "value": description,
                           "type": "string", "namespace": "global"})
    if metafields:
        page_data["metafields"] = metafields

    summary_info = {
        "title": title, "handle": handle, "author": author,
        "tags": "(Page không hỗ trợ tags)", "description": description,
        "body_length_chars": len(body_html), "published": publish,
        "content_type": "page",
    }
    return {"page": page_data}, summary_info


def publish_page(filepath: Path, publish: bool = False, dry_run: bool = False) -> Dict:
    """Đẩy 1 file Markdown lên Shopify dưới dạng PAGE (/pages/<handle>)."""
    env = load_env()
    shop_url, token = get_shopify_client(env)
    payload, summary = prepare_page_payload(filepath, publish=publish)
    handle = summary["handle"]

    print("\n=======================================================")
    print(f"📄 File: {filepath.name}")
    print(f"📌 Tiêu đề: {summary['title']}")
    print(f"🔗 Handle: {handle}   →  /pages/{handle}")
    print("📦 Loại: Shopify PAGE (content_type: page)")
    print(f"✍️ Tác giả: {summary['author']}")
    print(f"📝 Trạng thái: {'CÔNG KHAI (Published)' if publish else 'BẢN NHÁP (Draft)'}")
    print("=======================================================")

    if dry_run:
        print("🔍 [DRY-RUN] Đã parse HTML và chuẩn bị payload PAGE. Không ghi lên Shopify.")
        return {"status": "dry_run", "summary": summary}

    # Page API không có filter ?handle= đáng tin -> lấy danh sách rồi đối chiếu
    existing = api_request(shop_url, token, "pages.json?limit=250").get("pages", [])
    match = [pg for pg in existing if pg.get("handle") == handle]

    if match:
        pid = match[0]["id"]
        print(f"🔄 Page đã tồn tại (ID: {pid}) -> Cập nhật (PUT)...")
        res = api_request(shop_url, token, f"pages/{pid}.json", method="PUT", data=payload)
        action = "updated"
    else:
        print("✨ Tạo mới Page trên Shopify (POST)...")
        res = api_request(shop_url, token, "pages.json", method="POST", data=payload)
        action = "created"

    pg = res.get("page", {})
    live_url = f"https://aau.vn/pages/{pg.get('handle', handle)}"
    print(f"✅ THÀNH CÔNG ({action.upper()})! URL: {live_url}")
    return {"status": "success", "action": action, "url": live_url, "page_id": pg.get("id")}


def publish_file(filepath: Path, blog_id: Optional[int] = None, publish: bool = False, dry_run: bool = False) -> Dict:
    """Đẩy một file Markdown lên Shopify."""
    env = load_env()
    shop_url, token = get_shopify_client(env)

    # ROUTE 2026-09-07: content_type: page  ->  Shopify Page, không phải blog article
    with open(filepath, "r", encoding="utf-8") as _f:
        _meta, _ = parse_frontmatter(_f.read())
    if str(_meta.get("content_type", "")).strip().lower() == "page":
        return publish_page(filepath, publish=publish, dry_run=dry_run)

    payload, summary = prepare_article_payload(filepath, publish=publish)
    handle = summary["handle"]

    print(f"\n=======================================================")
    print(f"📄 File: {filepath.name}")
    print(f"📌 Tiêu đề: {summary['title']}")
    print(f"🔗 Handle: {summary['handle']}")
    print(f"🏷️ Tags: {summary['tags']}")
    print(f"✍️ Tác giả: {summary['author']}")
    print(f"📝 Trạng thái: {'CÔNG KHAI (Published)' if publish else 'BẢN NHÁP (Draft)'}")
    print(f"=======================================================")

    if dry_run:
        print("🔍 [DRY-RUN] Đã parse HTML và chuẩn bị payload thành công. Không ghi lên Shopify.")
        return {"status": "dry_run", "summary": summary}

    # Lấy Blog ID
    target_blog_id = get_or_detect_blog_id(shop_url, token, blog_id)
    print(f"🎯 Target Blog ID: {target_blog_id}")

    # Kiểm tra xem bài viết đã tồn tại với handle này chưa
    existing_res = api_request(shop_url, token, f"blogs/{target_blog_id}/articles.json?handle={handle}")
    existing_articles = existing_res.get("articles", [])

    if existing_articles:
        # CẬP NHẬT (PUT)
        art_id = existing_articles[0]["id"]
        print(f"🔄 Bài viết đã tồn tại (ID: {art_id}) -> Cập nhật nội dung (PUT)...")
        res = api_request(shop_url, token, f"blogs/{target_blog_id}/articles/{art_id}.json", method="PUT", data=payload)
        action = "updated"
    else:
        # TẠO MỚI (POST)
        print(f"✨ Tạo mới bài viết trên Shopify (POST)...")
        res = api_request(shop_url, token, f"blogs/{target_blog_id}/articles.json", method="POST", data=payload)
        action = "created"

    article = res.get("article", {})
    live_url = f"https://aau.vn/blogs/news/{article.get('handle', handle)}"
    print(f"✅ THÀNH CÔNG ({action.upper()})! URL bài viết: {live_url}")
    return {"status": "success", "action": action, "url": live_url, "article_id": article.get("id")}


# ==============================================================================
# 4. CLI INTERFACE
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(description="Shopify Article Publisher cho aau.vn")
    subparsers = parser.add_subparsers(dest="command", help="Lệnh thực thi")

    # Command: test
    subparsers.add_parser("test", help="Kiểm tra kết nối và token Shopify")

    # Command: list-blogs
    subparsers.add_parser("list-blogs", help="Liệt kê danh sách Blog trên Store")

    # Command: post
    post_p = subparsers.add_parser("post", help="Publish một bài viết Markdown")
    post_p.add_argument("file", help="Đường dẫn file .md cần publish")
    post_p.add_argument("--blog-id", type=int, help="ID của Blog trên Shopify (mặc định tự nhận diện blog 'news')")
    post_group = post_p.add_mutually_exclusive_group()
    post_group.add_argument("--draft", action="store_true", help="Lưu dưới dạng Bản nháp (mặc định)")
    post_group.add_argument("--publish", action="store_true", help="Xuất bản trực tiếp công khai")
    post_p.add_argument("--dry-run", action="store_true", help="Chạy thử nghiệm không ghi dữ liệu")

    # Command: batch
    batch_p = subparsers.add_parser("batch", help="Publish hàng loạt bài viết từ thư mục")
    batch_p.add_argument("--dir", required=True, help="Thư mục chứa các file .md")
    batch_p.add_argument("--blog-id", type=int, help="ID của Blog trên Shopify")
    batch_group = batch_p.add_mutually_exclusive_group()
    batch_group.add_argument("--draft", action="store_true", help="Lưu bản nháp (mặc định)")
    batch_group.add_argument("--publish", action="store_true", help="Xuất bản công khai")
    batch_p.add_argument("--dry-run", action="store_true", help="Chạy thử nghiệm")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    try:
        env = load_env()
        shop_url, token = get_shopify_client(env)

        if args.command == "test":
            print(f"Đang kiểm tra kết nối tới: https://{shop_url}")
            res = api_request(shop_url, token, "shop.json")
            shop = res.get("shop", {})
            print(f"✅ KẾT NỐI THÀNH CÔNG!")
            print(f"  - Tên Store: {shop.get('name')}")
            print(f"  - Email Admin: {shop.get('email')}")
            print(f"  - Domain: {shop.get('domain')}")
            print(f"  - Tiền tệ: {shop.get('currency')}")

        elif args.command == "list-blogs":
            res = api_request(shop_url, token, "blogs.json")
            blogs = res.get("blogs", [])
            print(f"Danh sách Blog trên store ({len(blogs)} blog):")
            for b in blogs:
                print(f"  - ID: {b['id']} | Title: '{b['title']}' | Handle: '{b['handle']}'")

        elif args.command == "post":
            fpath = Path(args.file)
            if not fpath.exists():
                print(f"❌ Lỗi: File '{args.file}' không tồn tại!")
                sys.exit(1)
            is_publish = bool(args.publish)
            publish_file(fpath, blog_id=args.blog_id, publish=is_publish, dry_run=args.dry_run)

        elif args.command == "batch":
            target_dir = Path(args.dir)
            if not target_dir.exists():
                print(f"❌ Lỗi: Thư mục '{args.dir}' không tồn tại!")
                sys.exit(1)
            files = sorted(list(target_dir.glob("*.md")))
            # Bỏ qua file README.md
            files = [f for f in files if f.name.lower() != "readme.md"]
            print(f"Tìm thấy {len(files)} bài viết cần xử lý trong '{args.dir}'...")
            is_publish = bool(args.publish)

            for f in files:
                publish_file(f, blog_id=args.blog_id, publish=is_publish, dry_run=args.dry_run)

    except Exception as e:
        print(f"\n❌ [ERROR]: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
