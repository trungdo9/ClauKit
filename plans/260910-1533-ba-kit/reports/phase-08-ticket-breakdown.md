# Ticket breakdown — plans/ba/demo/deliverables/SRS-001.md · 3 tickets

Source read in full (98 lines). Greenfield product, no codebase — every `Touches:` is `[UNKNOWN]` per task
instruction, overriding the `module/booking, api/appointments` value SRS-001.md:17 literally states for
FR-011 (task instruction takes precedence over copying an invented-stack line).

Scope note: SRS-001.md:8-10 states EPIC-002 (cancel/reschedule) and EPIC-003 (reminder) have no FR in this
batch — correctly out of graph, nothing to cut there. NFR-001 / NFR-003 are cross-cutting quality
constraints (no Actor/GWT of their own) — carried as `**Constraints:**` text on the tickets whose FR block
cites them, not sliced into their own tickets (an NFR ticket would fail the demo-sentence test: "the
response is fast" is not an observable feature on its own).

## Graph
- `01 Bệnh nhân xem khung giờ trống và chọn giữ chỗ (HOLD)` — blocked by: none
- `02 Bệnh nhân xác nhận đặt lịch thành công (BOOKED)` — blocked by: 01
- `03 Hệ thống từ chối xác nhận khi HOLD đã hết hạn` — blocked by: 02

## Numbered list

**01 — Bệnh nhân xem khung giờ trống và chọn giữ chỗ (HOLD)**
- Blocked by: none (frontier)
- Delivers: bệnh nhân mở lịch bác sĩ, thấy đúng khung giờ trống trong 7 ngày (BOOKED/HOLD bị ẩn), chọn một
  khung và hệ thống HOLD khung đó 10 phút.
- AC ids: `AC-008.1`
- Verified by: TC-002 (referenced, not restated)
- FR block: FR-011 (SRS-001.md:12-21), UC-001 (:44-52), US-008 (:77-80)

**02 — Bệnh nhân xác nhận đặt lịch thành công (BOOKED)**
- Blocked by: 01 (cần một khung đang HOLD của chính bệnh nhân để xác nhận)
- Delivers: bệnh nhân đang giữ (HOLD) một khung của mình bấm Xác nhận, lịch hẹn chuyển BOOKED, thông báo
  xác nhận gửi trong 3 giây.
- AC ids: `AC-007.1`
- Verified by: TC-021 (referenced, not restated)
- FR block: FR-012 (SRS-001.md:23-32), UC-004 (:54-61), US-007 (:63-66)

**03 — Hệ thống từ chối xác nhận khi HOLD đã hết hạn**
- Blocked by: 02 (nhánh từ chối được thêm vào cùng hành động Xác nhận mà 02 dựng lên; không thể demo
  nhánh lỗi trước khi có hành động xác nhận)
- Delivers: bệnh nhân bấm Xác nhận trên khung mà HOLD đã quá 10 phút, hệ thống từ chối, hiển thị "Khung giờ
  đã hết hạn giữ chỗ", quay lại bước chọn giờ.
- AC ids: `AC-007.2`
- FR block: FR-012 (same block as 02 — this is FR-012's exception flow)

## Five cutting tests

| Test | 01 | 02 | 03 |
|---|---|---|---|
| Demo sentence | "mở lịch, thấy khung trống, chọn 1 khung, khung đó HOLD 10 phút" — one sentence, no "and then" | "đang HOLD, bấm Xác nhận, thấy BOOKED + thông báo <3s" — pass | "bấm Xác nhận trên HOLD hết hạn, thấy từ chối + quay lại chọn giờ" — pass |
| Layer completeness | conceptually spans data (slot/appointment status), API, service (7-day window filter, HOLD TTL), UI, test (TC-002) — no layer invented since greenfield, all `[UNKNOWN]` | spans API, service (state transition + notification), UI, test (TC-021) | spans service (expiry check branch on the same confirm endpoint), UI (error message + navigation) — no dedicated TC, has its own GWT (AC-007.2) |
| Blast radius | N/A — greenfield, nothing to break; no expand–contract needed | N/A | N/A |
| Frontier | 01 blocked by none → startable now | — | — |
| Chain smell | Chain is linear 01→02→03. **Flagged, not silently passed**: this is the minimum cut that gives every ticket a distinct, legitimately-scoped spine AC id (SRS has exactly 3: AC-008.1, AC-007.1, AC-007.2) — merging 02+03 (both FR-012, happy path + exception) into one ticket is the natural 2-ticket alternative and would still pass demo-sentence/layer tests, but leaves only 2 tickets and puts 2 AC ids in one ticket. The linearity also reflects genuine real sequencing (can't hold before you can view/select; can't confirm before a hold exists; can't demo the reject branch before the confirm action it branches from exists) — not a horizontal-layer artifact. |

## Blockers to slicing
- None — the SRS's own FR/UC/US/AC boundaries map cleanly onto 3 vertical slices; no design gap found.
- Open granularity call for the approval gate: keep 02/03 split (1 AC each, matches spine 1:1) vs. merge
  into a single FR-012 ticket carrying both `AC-007.1` and `AC-007.2` (2 tickets total, still ≥3 fails —
  would need a different 3rd cut elsewhere). Recommend keeping the 3-way split as drafted.

## Full ticket bodies

```markdown
# 01: Bệnh nhân xem khung giờ trống và chọn giữ chỗ (HOLD)

**What to build:** Bệnh nhân đã đăng nhập và đã chọn bác sĩ mở lịch của bác sĩ đó, thấy các khung giờ còn
trống trong 7 ngày tới (khung đã BOOKED hoặc đang HOLD của người khác bị ẩn), chọn một khung và hệ thống
giữ chỗ (HOLD) khung đó cho bệnh nhân trong 10 phút.

**Blocked by:** None (can start immediately).

**Status:** ready

**Out of scope:** Không xử lý thanh toán trực tuyến khi đặt lịch

**Constraints:** NFR-001 — Xác nhận đặt lịch phản hồi dưới 3 giây, NFR-003 — Dữ liệu bệnh nhân được mã hoá
khi lưu trữ

**Touches:** [UNKNOWN]

## Acceptance criteria

- [ ] Given bác sĩ có ít nhất một khung giờ trống trong 7 ngày tới, When bệnh nhân mở lịch của bác sĩ, Then
  mọi khung giờ trống trong 7 ngày được hiển thị, khung đã BOOKED hoặc HOLD bị ẩn (AC-008.1)
- [ ] Given bác sĩ có khung giờ còn trống trong 7 ngày tới, When bệnh nhân chọn một khung giờ, Then hệ
  thống giữ chỗ (HOLD) khung giờ đó trong 10 phút
- [ ] Verified by TC-002
```

```markdown
# 02: Bệnh nhân xác nhận đặt lịch thành công (BOOKED)

**What to build:** Bệnh nhân đang giữ chỗ (HOLD) một khung giờ của chính mình bấm Xác nhận đặt lịch, hệ
thống ghi lịch hẹn ở trạng thái BOOKED và gửi thông báo xác nhận trong vòng 3 giây.

**Blocked by:** `01-benh-nhan-xem-khung-gio-trong-va-chon-giu-cho` — cần một khung đang HOLD của chính
bệnh nhân (tạo ra bởi 01) để có gì mà xác nhận.

**Status:** ready

**Out of scope:** Thanh toán trực tuyến cho lịch hẹn

**Constraints:** NFR-001 — Xác nhận đặt lịch phản hồi dưới 3 giây, NFR-003 — Dữ liệu bệnh nhân được mã hoá
khi lưu trữ

**Touches:** [UNKNOWN]

## Acceptance criteria

- [ ] Given khung giờ đang HOLD cho bệnh nhân, When bệnh nhân bấm Xác nhận đặt lịch, Then lịch hẹn chuyển
  sang BOOKED và thông báo xác nhận được gửi trong 3 giây (AC-007.1)
- [ ] Given khung giờ đang được giữ chỗ cho bệnh nhân, When bệnh nhân bấm Xác nhận đặt lịch, Then hệ thống
  ghi lịch hẹn ở trạng thái BOOKED và gửi thông báo xác nhận
- [ ] Verified by TC-021
```

```markdown
# 03: Hệ thống từ chối xác nhận khi khung giờ đã hết hạn giữ chỗ

**What to build:** Bệnh nhân bấm Xác nhận đặt lịch trên một khung giờ mà thời gian giữ chỗ (HOLD) đã quá
10 phút; hệ thống từ chối, hiển thị thông báo "Khung giờ đã hết hạn giữ chỗ" và đưa bệnh nhân quay lại
bước chọn giờ.

**Blocked by:** `02-benh-nhan-xac-nhan-dat-lich-thanh-cong` — nhánh từ chối được thêm vào cùng hành động
Xác nhận mà 02 dựng lên; không thể demo nhánh lỗi trước khi hành động xác nhận tồn tại.

**Status:** ready

**Out of scope:** Thanh toán trực tuyến cho lịch hẹn

**Constraints:** NFR-001 — Xác nhận đặt lịch phản hồi dưới 3 giây, NFR-003 — Dữ liệu bệnh nhân được mã hoá
khi lưu trữ

**Touches:** [UNKNOWN]

## Acceptance criteria

- [ ] Given khung giờ HOLD đã quá 10 phút, When bệnh nhân bấm Xác nhận đặt lịch, Then hệ thống từ chối,
  hiển thị "Khung giờ đã hết hạn giữ chỗ" và quay về bước chọn giờ (AC-007.2)
```

## Needs from you
- Approval of granularity and edges before anything is written (per `to-tickets` step 4 gate) — in
  particular the 01→02→03 linear chain and the 02/03 split flagged above.
