# Brainstorm — Eval design + hillclimbing cho ClauKit

Nguồn: https://claude.dev/blog/automating-eval-design-and-hillclimbing/ · Ngày: 2026-10-01 · Trạng thái: chờ user xác nhận A' trước khi handoff planner

## 1. Problem statement

- ClauKit claim nhiều gate/routing nhưng `tests/behavior/README.md` tự kết luận "No gate is currently credited" — 4/6 scenario không phân biệt (model làm sẵn), verdict ablation lật OK→FAIL trên 3 run.
- Blog cung cấp khung: production-sampled tasks · headroom · low variance · grader checkable-claims · hillclimb cheap+attributable surface · train/test split · transcript hygiene.
- Câu hỏi user: áp vào ClauKit có phải cải tiến tích cực không?

## 2. Evidence đã kiểm

| Fact | Nguồn |
|---|---|
| Harness 12 scenario, runner 396 dòng, `--negative` 3 run, GATE_PATTERN ablation | `tests/behavior/` |
| `claude plugin eval` có sẵn: init interview, ablation with-without, runs=3, max-cost, HTML report, judge haiku | `claude plugin eval --help`, CLI 2.1.286 |
| `/claude-api build-eval` + `hillclimb` đã ship | blog (chưa tự chạy kiểm) |
| `/ck:find` đọc registry 93KB (~23k token) mỗi lần | `docs/clauKit-registry.md` |
| **Usage thật, 61 transcript local:** `/ck:fix` 10 · `/ck:tickets` 4 · `/ck:git` 2 · còn lại 1 · **`/ck:find` 0** | `~/.claude/projects/*/*.jsonl` |
| scope-lock fail vì session không load `cook/SKILL.md` — lỗi routing ngầm, không phải lỗi gate | README behavior §scope-lock |

## 3. Evaluated approaches

| | Approach | Verdict |
|---|---|---|
| A | Hillclimb `/ck:find` | ❌ hạ cấp — 0 lần dùng thật; tối ưu thứ không ai gọi |
| **A'** | **Hillclimb router ngầm**: task thật → skill/gate nào được Read trước Edit đầu tiên. Surface = `skill-activation.md` (+ `development-rules.md`), luôn load mọi run | ✅ chọn — chạy trên *mọi* task, lỗi đã đo (scope-lock), grader programmatic từ tool-sequence |
| B | Migrate harness → `claude plugin eval` | ⏸ hoãn — ablation whole-plugin ≠ per-gate; chưa plugin parity |
| C | Ship skill `/ck:eval` cho user | ❌ duplicate claude-api + plugin eval (DRY) |
| D | Harness hygiene: CI/noise floor, headroom rule, prompt lấy từ transcript | ✅ kèm A' — nhỏ, sửa đúng chỗ verdict lật |

## 4. Đánh giá khách quan: có tích cực không?

**Có — có điều kiện. Là cải tiến về độ tin cậy/quy trình, không phải feature user thấy.**

Tích cực:
- Blog formalize đúng bài học ClauKit tự trả giá (headroom = "rule chỉ đo được khi chống default của model"; variance = verdict coin-flip). Văn hoá eval đã có → chi phí adopt thấp.
- Biến claim không kiểm chứng thành con số; cho phép đo chi phí token của file luôn-load.
- A' nhắm đúng lỗi đã đo: gate tồn tại nhưng không được load.

Tiêu cực / giới hạn:
- **Cost thật** — mỗi case = session `claude -p`; memory ghi org spend limit 429 đã giết run giữa chừng. Cần `--max-cost`/budget cứng.
- **Model drift** — mỗi model mới đổi baseline; climb prose trên 1 model = khắc "failure fingerprint" của model đó (blog cảnh báo). Phải re-run khi đổi model.
- **Dataset nhỏ** — 61 transcript, ~22 lệnh /ck:; nếu <40 case sạch thì split train/test vô nghĩa → chỉ đo, không climb.
- **Không cứu được 4 gate không phân biệt** — đó là giới hạn phương pháp, không phải thiếu tooling.
- Opportunity cost vs plugin parity roadmap.

Điều kiện để đáng làm: time-box; baseline trước; headroom <90% mới climb; held-out test giữ kín.

## 5. Recommended solution (A' + D)

1. Mine transcripts → 40–80 prompt thật (scrub PII, git-ignored), gán expected skill/gate set; bỏ case 2 người gán khác nhau.
2. Grader: `tool-sequence.cjs` — first `SKILL.md` Read ∈ expected set, trước Edit/Write đầu tiên. Cap turns, deny Edit → rẻ.
3. Baseline 3 run/case, báo CI + noise floor. Headroom check.
4. Hillclimb: 1 thay đổi/vòng trên `skill-activation.md`; train↑ test phẳng → revert; cấm dán text case vào surface.
5. Metric phụ: token của file luôn-load (giảm mà acc giữ = thắng).
6. D: Wilson CI cho số lần ablation; rule "ablated pass ≥ X% → non-discriminating, không credit".

## 6. Risks

| Risk | Mitigation |
|---|---|
| Answer leakage (case từ "Triggers on" text) | case registry-derived chỉ ở train |
| Overfit vào cụm từ case | transcript hygiene + held-out test |
| Ground truth mơ hồ (fix vs debug) | expected = set; drop case bất đồng |
| PII khách hàng trong transcript | local-only, gitignore, scrub |
| Spend limit 429 | budget cứng, ERROR class đã có |

## 7. Success metrics

- Baseline đo được, CI hẹp hơn noise floor.
- Held-out test: routing acc tăng > noise floor; scope-lock-shaped prompt load `cook` ≥ 2/3 → 3/3.
- Token file luôn-load không tăng.
- Dừng sạch nếu baseline ≥ 90% (kết quả trung thực, không phải thất bại).

## 8. Next steps

- User xác nhận A' (thay A) → handoff `planner` với report này.
- Touch: `tests/behavior/` (tool-sequence, runner, new dataset dir), `.claude/workflows/skill-activation.md`, `development-rules.md` § Behavioural-Skill Governance.

## Unresolved questions

- Transcript local có bị prune (cleanupPeriodDays)? 61 file có đại diện usage thật của team không, hay chỉ máy này?
- Có user ClauKit khác ngoài máy này để lấy mẫu không?
- Budget token chấp nhận được mỗi vòng climb?
- Có script grader trong `claude plugin eval` không (chưa kiểm) — quyết định B sau này.
