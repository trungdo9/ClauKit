#!/usr/bin/env python3
"""
gen-image.py — generate SEO images with OpenAI GPT image (gpt-image-2).

Part of the `gpt-image-vi` skill. Writes image files to local disk only;
it never touches a CMS.

Model choice is deliberate: gpt-image-1 was measured to invent text and
mis-encode described data, so only gpt-image-2 is wired up. See SKILL.md.

Usage:
  python3 scripts/gen-image.py single --prompt-file p.txt --out img.png --preset hero
  python3 scripts/gen-image.py batch  --manifest m.json --concurrency 4
  python3 scripts/gen-image.py batch  --manifest m.json --dry-run
"""
import argparse, base64, json, os, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Look for a .env in the usual places, nearest first.
_HERE = Path(__file__).resolve()
ENV_CANDIDATES = [
    Path.cwd() / ".env",
    Path.cwd() / ".claude" / ".env",
    _HERE.parent / ".env",
]
API_URL = "https://api.openai.com/v1/images/generations"

# Measured 2026-09-06 — see SKILL.md.
# gpt-image-1 is disqualified: it invents text and mis-encodes described data.
# `flow` is split from `diagram`: a horizontal chain on a square canvas
# leaves more than half the frame empty (measured in the pilot batch).
PRESETS = {
    "hero":    {"model": "gpt-image-2", "size": "1536x1024", "quality": "high"},
    "og":      {"model": "gpt-image-2", "size": "1536x1024", "quality": "high"},
    "flow":    {"model": "gpt-image-2", "size": "1536x1024", "quality": "high"},
    "diagram": {"model": "gpt-image-2", "size": "1024x1024", "quality": "high"},
}

# Appended to every prompt so a batch stays visually consistent.
BRAND_SUFFIX = (
    " Flat vector editorial illustration. Palette: terracotta, amber, off-white "
    "background, neutral grey. No drop shadows, no gradients, generous margins. "
    "Vietnamese text must render with correct diacritics. "
    "No watermark, no logo, no extra text beyond the labels specified above."
)

# Estimates from measured runs (5,488 / 7,024 output tokens).
EST_TOKENS = {"1536x1024": 5500, "1024x1024": 7000}


def load_key() -> str:
    """Read the API key from the environment or a local .env. Never printed."""
    key = os.environ.get("OPENAI_KEY") or os.environ.get("OPENAI_API_KEY")
    if not key:
        for env_file in ENV_CANDIDATES:
            if not env_file.exists():
                continue
            for line in env_file.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith(("OPENAI_KEY", "OPENAI_API_KEY")):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
            if key:
                break
    if not key:
        looked = ", ".join(str(p) for p in ENV_CANDIDATES)
        sys.exit(f"No OPENAI_KEY found (checked environment and: {looked})")
    return key


def generate(prompt: str, preset: str, key: str, retries: int = 3) -> dict:
    cfg = PRESETS[preset]
    body = json.dumps({
        "model": cfg["model"],
        "prompt": prompt + BRAND_SUFFIX,
        "size": cfg["size"],
        "quality": cfg["quality"],
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
            # Retrying a non-429 4xx is pointless
            if e.code != 429 and 400 <= e.code < 500:
                break
            time.sleep(2 ** attempt * 5)
        except Exception as e:                       # timeout / network error
            last = repr(e)
            time.sleep(2 ** attempt * 5)
    raise RuntimeError(last)


def render(prompt: str, out: Path, preset: str, key: str, force: bool = False) -> dict:
    """Generate one image plus a sidecar .json. Idempotent: skips existing files."""
    out = Path(out)
    if out.exists() and not force:
        return {"status": "skip", "out": str(out)}
    out.parent.mkdir(parents=True, exist_ok=True)

    t0 = time.time()
    data = generate(prompt, preset, key)
    elapsed = round(time.time() - t0, 1)

    b64 = data["data"][0].get("b64_json")
    if not b64:
        raise RuntimeError("API returned no b64_json payload")
    out.write_bytes(base64.b64decode(b64))

    cfg = PRESETS[preset]
    usage = data.get("usage", {})
    sidecar = {
        "prompt": prompt,
        "brand_suffix": BRAND_SUFFIX,
        "preset": preset,
        "model": cfg["model"],
        "size": cfg["size"],
        "quality": cfg["quality"],
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
    }


def cmd_single(a):
    key = load_key()
    prompt = Path(a.prompt_file).read_text(encoding="utf-8").strip() if a.prompt_file else a.prompt
    if not prompt:
        sys.exit("Provide --prompt-file or --prompt")
    r = render(prompt, Path(a.out), a.preset, key, a.force)
    print(json.dumps(r, ensure_ascii=False))


def cmd_batch(a):
    """Manifest: [{"out": "...png", "preset": "hero", "prompt": "..."}]"""
    items = json.loads(Path(a.manifest).read_text(encoding="utf-8"))
    todo = [i for i in items if a.force or not Path(i["out"]).exists()]
    skipped = len(items) - len(todo)

    if a.dry_run:
        tok = sum(EST_TOKENS.get(PRESETS[i.get("preset", "diagram")]["size"], 7000) for i in todo)
        print(f"DRY RUN - total {len(items)} | skip (exists) {skipped} | to generate {len(todo)}")
        print(f"  Estimated output tokens : ~{tok:,}")
        print(f"  Estimated wall clock    : ~{len(todo)*90/60:.0f} min sequential"
              f" | ~{len(todo)*90/60/max(a.concurrency,1):.0f} min at concurrency {a.concurrency}")
        print("  Unit price: read from your provider billing page")
        for i in todo[:10]:
            print(f"    → {i['out']}")
        if len(todo) > 10:
            print(f"    ... and {len(todo)-10} more")
        return

    key = load_key()
    ok = fail = 0
    tokens = 0
    with ThreadPoolExecutor(max_workers=a.concurrency) as ex:
        futs = {ex.submit(render, i["prompt"], Path(i["out"]),
                          i.get("preset", "diagram"), key, a.force): i for i in todo}
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
    print(f"\nDone: {ok} ok | {fail} failed | {skipped} skipped"
          f" | {tokens:,} output tokens")
    if fail:
        sys.exit(1)


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("single", help="generate a single image")
    s.add_argument("--prompt-file")
    s.add_argument("--prompt")
    s.add_argument("--out", required=True)
    s.add_argument("--preset", choices=PRESETS, default="diagram")
    s.add_argument("--force", action="store_true", help="overwrite existing images")
    s.set_defaults(func=cmd_single)

    b = sub.add_parser("batch", help="generate a batch from a manifest")
    b.add_argument("--manifest", required=True)
    b.add_argument("--concurrency", type=int, default=4)
    b.add_argument("--dry-run", action="store_true", help="estimate only, no API calls")
    b.add_argument("--force", action="store_true")
    b.set_defaults(func=cmd_batch)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
