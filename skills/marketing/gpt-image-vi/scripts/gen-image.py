#!/usr/bin/env python3
"""
gen-image.py — sinh ảnh SEO cho spoke aau.vn bằng OpenAI GPT image.

Đặc tả: plans/campaigns/aau-content-care/image-pipeline.md

Ghi file ảnh xuống đĩa local. KHÔNG chạm CMS (Shopify/Botble) —
không vi phạm ràng buộc "scripts/ giai đoạn 1 read-only" của CLAUDE.md.

Dùng:
  python3 scripts/gen-image.py single --prompt-file p.txt --out img.png --preset hero
  python3 scripts/gen-image.py batch  --manifest m.json --concurrency 4
  python3 scripts/gen-image.py batch  --manifest m.json --dry-run
"""
import argparse, base64, json, os, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".claude" / ".env"
API_URL = "https://api.openai.com/v1/images/generations"

# Đo thật 2026-09-06 — xem image-pipeline.md §2.
# gpt-image-1 BỊ LOẠI: tự bịa chữ, không mã hoá đúng dữ liệu.
# `flow` tách khỏi `diagram`: sơ đồ chuỗi ngang render trên khung vuông
# để lại quá nửa khung trống (đo ở lô L0, 2026-09-06).
PRESETS = {
    "hero":    {"model": "gpt-image-2", "size": "1536x1024", "quality": "medium"},
    "og":      {"model": "gpt-image-2", "size": "1536x1024", "quality": "medium"},
    "flow":    {"model": "gpt-image-2", "size": "1536x1024", "quality": "medium"},
    "diagram": {"model": "gpt-image-2", "size": "1024x1024", "quality": "medium"},
}

# image-pipeline.md §4. Nối vào cuối mọi prompt để giữ nhất quán cả lô.
BRAND_SUFFIX = (
    " Flat vector editorial illustration. Palette: terracotta, amber, off-white "
    "background, neutral grey. No drop shadows, no gradients, generous margins. "
    "Vietnamese text must render with correct diacritics. "
    "No watermark, no logo, no extra text beyond the labels specified above."
)

# Ước lượng tokens cho quality=medium (~1.800 tokens) vs high (~5.500-7.000 tokens)
EST_TOKENS = {"medium": 1800, "high": 6000, "low": 1000}


def load_key() -> str:
    """Đọc OPENAI_KEY từ .claude/.env hoặc biến môi trường. Không bao giờ in ra."""
    key = os.environ.get("OPENAI_KEY") or os.environ.get("OPENAI_API_KEY")
    if not key and ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("OPENAI_KEY"):
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
    if not key:
        sys.exit(f"❌ Không tìm thấy OPENAI_KEY (đã tìm ở {ENV_FILE} và biến môi trường)")
    return key


def generate(prompt: str, preset: str, key: str, quality: str = None, retries: int = 3) -> dict:
    cfg = PRESETS[preset]
    actual_quality = quality or cfg.get("quality", "medium")
    body = json.dumps({
        "model": cfg["model"],
        "prompt": prompt + BRAND_SUFFIX,
        "size": cfg["size"],
        "quality": actual_quality,
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        API_URL, data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    last = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            detail = e.read().decode()[:300]
            last = f"HTTP {e.code}: {detail}"
            # 4xx không phải 429 thì retry vô nghĩa
            if e.code != 429 and 400 <= e.code < 500:
                break
            time.sleep(2 ** attempt * 5)
        except Exception as e:                       # timeout, lỗi mạng
            last = repr(e)
            time.sleep(2 ** attempt * 5)
    raise RuntimeError(last)


def optimize_image(image_path: Path, max_width: int = 960) -> dict:
    """Tự động resize ảnh về <= max_width (mặc định 960px) và tạo bản .webp siêu nhẹ cho SEO blog."""
    import shutil, subprocess
    convert_bin = shutil.which("convert")
    res = {"resized": False, "webp": None}
    if not convert_bin or not image_path.exists():
        return res

    webp_path = image_path.with_suffix(".webp")
    try:
        # 1. Tạo bản .webp chuẩn Google SEO (chất lượng 82, nén cực cao ~10-30KB)
        subprocess.run(
            [convert_bin, str(image_path), "-resize", f"{max_width}x>", "-quality", "82", str(webp_path)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        # 2. Resize file PNG gốc về <= max_width để hiển thị chuẩn trong content container
        subprocess.run(
            [convert_bin, str(image_path), "-resize", f"{max_width}x>", str(image_path)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        res["resized"] = True
        res["webp"] = str(webp_path)
    except Exception as e:
        print(f"⚠️ Không thể tối ưu ảnh bằng convert: {e}", file=sys.stderr)
    return res


def render(prompt: str, out: Path, preset: str, key: str, force: bool = False,
           quality: str = None, max_width: int = 960) -> dict:
    """Sinh 1 ảnh + sidecar .json. Tự động resize <= max_width và sinh .webp."""
    out = Path(out)
    if out.exists() and not force:
        return {"status": "skip", "out": str(out)}
    out.parent.mkdir(parents=True, exist_ok=True)

    t0 = time.time()
    data = generate(prompt, preset, key, quality=quality)
    elapsed = round(time.time() - t0, 1)

    b64 = data["data"][0].get("b64_json")
    if not b64:
        raise RuntimeError("API không trả về b64_json")
    out.write_bytes(base64.b64decode(b64))

    # Tối ưu kích thước & xuất file webp
    opt = optimize_image(out, max_width=max_width)

    cfg = PRESETS[preset]
    actual_quality = quality or cfg.get("quality", "medium")
    usage = data.get("usage", {})
    webp_p = Path(opt["webp"]) if opt.get("webp") else None
    sidecar = {
        "prompt": prompt,
        "brand_suffix": BRAND_SUFFIX,
        "preset": preset,
        "model": cfg["model"],
        "size": cfg["size"],
        "quality": actual_quality,
        "optimized": {
            "max_width": max_width,
            "png_bytes": out.stat().st_size,
            "webp_path": str(webp_p) if webp_p else None,
            "webp_bytes": webp_p.stat().st_size if webp_p and webp_p.exists() else None
        },
        "usage": usage,
        "elapsed_sec": elapsed,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "bytes": out.stat().st_size,
    }
    out.with_suffix(".json").write_text(
        json.dumps(sidecar, ensure_ascii=False, indent=2), encoding="utf-8")
    return {
        "status": "ok", "out": str(out), "elapsed": elapsed,
        "tokens": usage.get("output_tokens", 0),
        "webp": opt.get("webp")
    }


def cmd_single(a):
    prompt = Path(a.prompt_file).read_text(encoding="utf-8").strip() if a.prompt_file else a.prompt
    if not prompt:
        sys.exit("❌ Cần --prompt-file hoặc --prompt")
    cfg = PRESETS[a.preset]
    actual_quality = a.quality or cfg.get("quality", "medium")
    if a.dry_run:
        tok = EST_TOKENS.get(actual_quality, 1800)
        print("DRY RUN — Kiểm thử cấu hình sinh 1 ảnh:")
        print(f"  File xuất        : {a.out}")
        print(f"  Preset           : {a.preset} (Model: {cfg['model']}, Size: {cfg['size']}, Quality: {actual_quality})")
        print(f"  Kích thước tối ưu: <= {a.max_width}px chiều ngang (xuất song song .webp)")
        print(f"  Ước tính tokens  : ~{tok:,} tokens")
        print(f"  Prompt hoàn chỉnh:\n  \"{prompt + BRAND_SUFFIX}\"")
        return
    key = load_key()
    r = render(prompt, Path(a.out), a.preset, key, a.force, quality=a.quality, max_width=a.max_width)
    print(json.dumps(r, ensure_ascii=False))


def cmd_batch(a):
    """Manifest: [{"out": "...png", "preset": "hero", "prompt": "..."}]"""
    items = json.loads(Path(a.manifest).read_text(encoding="utf-8"))
    todo = [i for i in items if a.force or not Path(i["out"]).exists()]
    skipped = len(items) - len(todo)

    actual_quality = a.quality or "medium"
    if a.dry_run:
        tok = sum(EST_TOKENS.get(actual_quality, 1800) for _ in todo)
        print(f"DRY RUN — tổng {len(items)} · bỏ qua (đã có) {skipped} · sẽ sinh {len(todo)}")
        print(f"  Chất lượng (Quality)   : {actual_quality}")
        print(f"  Kích thước tối ưu      : <= {a.max_width}px (tự động xuất song song .webp)")
        print(f"  Ước tính output tokens : ~{tok:,}")
        print(f"  Ước tính thời gian     : ~{len(todo)*40/60:.0f} phút tuần tự"
              f" · ~{len(todo)*40/60/max(a.concurrency,1):.0f} phút với {a.concurrency} luồng")
        print("  Đơn giá USD: [CHỜ DATA: bảng giá OpenAI trên tài khoản]")
        for i in todo[:10]:
            print(f"    → {i['out']}")
        if len(todo) > 10:
            print(f"    … và {len(todo)-10} ảnh nữa")
        return

    key = load_key()
    ok = fail = 0
    tokens = 0
    with ThreadPoolExecutor(max_workers=a.concurrency) as ex:
        futs = {ex.submit(render, i["prompt"], Path(i["out"]),
                          i.get("preset", "diagram"), key, a.force,
                          quality=a.quality, max_width=a.max_width): i for i in todo}
        for n, f in enumerate(as_completed(futs), 1):
            item = futs[f]
            try:
                r = f.result()
                ok += 1
                tokens += r.get("tokens", 0)
                print(f"[{n}/{len(todo)}] ✅ {r['out']} ({r.get('elapsed')}s)")
            except Exception as e:
                fail += 1
                print(f"[{n}/{len(todo)}] ❌ {item['out']} — {e}", file=sys.stderr)
    print(f"\nXong: {ok} thành công · {fail} lỗi · {skipped} bỏ qua"
          f" · {tokens:,} output tokens")
    if fail:
        sys.exit(1)


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("single", help="sinh 1 ảnh")
    s.add_argument("--prompt-file")
    s.add_argument("--prompt")
    s.add_argument("--out", required=True)
    s.add_argument("--preset", choices=PRESETS, default="diagram")
    s.add_argument("--quality", choices=["low", "medium", "high"], default=None, help="mức chất lượng (mặc định medium)")
    s.add_argument("--max-width", type=int, default=960, help="kích thước chiều ngang tối đa (px), mặc định 960")
    s.add_argument("--dry-run", action="store_true", help="ước tính và kiểm tra prompt, không gọi API")
    s.add_argument("--force", action="store_true", help="ghi đè ảnh đã có")
    s.set_defaults(func=cmd_single)

    b = sub.add_parser("batch", help="sinh theo lô từ manifest")
    b.add_argument("--manifest", required=True)
    b.add_argument("--quality", choices=["low", "medium", "high"], default=None, help="mức chất lượng (mặc định medium)")
    b.add_argument("--max-width", type=int, default=960, help="kích thước chiều ngang tối đa (px), mặc định 960")
    b.add_argument("--concurrency", type=int, default=4)
    b.add_argument("--dry-run", action="store_true", help="ước tính, không gọi API")
    b.add_argument("--force", action="store_true")
    b.set_defaults(func=cmd_batch)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
