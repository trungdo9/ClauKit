<!-- ba-deliverable: scope · class: derived · nguồn: plans/ba/demo/entities/ -->

# SCOPE-001 — Đặt lịch hẹn khám bệnh trực tuyến

## Tầm nhìn (vision)

## 1. Vấn đề

Bệnh nhân phải gọi điện hoặc đến trực tiếp phòng khám để đặt lịch hẹn, gây quá tải tổng đài vào
giờ cao điểm. Bằng chứng: doc:plans/ba-context.md p.1.

## 2. Người dùng

| Actor | Nhu cầu |
|---|---|
| Bệnh nhân | Đặt lịch hẹn nhanh, không cần gọi điện |
| Lễ tân | Giảm số cuộc gọi phải xử lý thủ công |

## 3. Mục tiêu

Giảm 50% số cuộc gọi đặt lịch qua tổng đài trong 3 tháng đầu.

## 4. Phạm vi

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Đặt lịch hẹn qua web | Thanh toán trực tuyến |
| Hủy/đổi lịch hẹn | Tích hợp bảo hiểm y tế |

## 5. EPIC

| EPIC | Tên | Giá trị mang lại |
|---|---|---|
| EPIC-001 | Đặt lịch hẹn | Bệnh nhân tự đặt lịch không cần gọi điện |
| EPIC-002 | Hủy/đổi lịch hẹn | Bệnh nhân tự quản lý lịch hẹn đã đặt |
| EPIC-003 | Nhắc lịch hẹn | Giảm tỷ lệ bệnh nhân bỏ lỡ lịch hẹn |

## 6. Giả định & rủi ro

Giả định phòng khám có hệ thống lịch làm việc bác sĩ sẵn có. [UNVERIFIED] Rủi ro: bệnh nhân lớn
tuổi có thể không quen thao tác trên web.

## 7. Lộ trình

| Now | Next | Later |
|---|---|---|
| EPIC-001 | EPIC-002 | EPIC-003 |

## Phạm vi (in scope)

| EPIC | Tiêu đề | Ngoài phạm vi |
|---|---|---|
| EPIC-001 | Đặt lịch hẹn | Không xử lý thanh toán trực tuyến khi đặt lịch |
| EPIC-002 | Hủy/đổi lịch hẹn | Không hỗ trợ đổi lịch sang phòng khám khác |
| EPIC-003 | Nhắc lịch hẹn | Không gửi nhắc lịch qua điện thoại tự động (IVR) |

## Ràng buộc (constraints)

| NFR | Tiêu đề |
|---|---|
| NFR-001 | Xác nhận đặt lịch phản hồi dưới 3 giây |
| NFR-003 | Dữ liệu bệnh nhân được mã hoá khi lưu trữ |

## Ngoài phạm vi (exclusions)

- EPIC-001: Không xử lý thanh toán trực tuyến khi đặt lịch
- EPIC-002: Không hỗ trợ đổi lịch sang phòng khám khác
- EPIC-003: Không gửi nhắc lịch qua điện thoại tự động (IVR)
- FR-012: Thanh toán trực tuyến cho lịch hẹn
