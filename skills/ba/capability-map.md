# BA capability map — 55 capabilities, 12 commands

| # | Capability | Plain gloss | Command + action | Owner | Wave |
|---:|---|---|---|:--:|:--:|
| 1 | Sơ đồ quan hệ thực thể (Mermaid) | vẽ sơ đồ dữ liệu — bảng nào nối bảng nào | `/ba:diagram erd` | ba | W0 |
| 2 | Sơ đồ quan hệ thực thể (D2/dbdiagram) | như trên, định dạng khác | `/ba:diagram erd` (notation deferred) | ba | W1 |
| 3 | Nghiên cứu thị trường / đối thủ | tìm hiểu xem có nên làm không | `/ck:research` | **ck** | — |
| 4 | Thiết kế màn hình / wireframe | phác hoạ giao diện | `/ck:design` | **ck** | — |
| 5 | Khởi tạo hub ngữ cảnh BA | tạo file gốc để mọi lệnh `/ba:` đọc trước khi chạy | `/ba:plan` | ba | W0 |
| 6 | Cập nhật hub ngữ cảnh BA | làm mới thông tin dự án khi có thay đổi | `/ba:plan update` | ba | W0 |
| 7 | Quản lý bảng thuật ngữ (glossary) | thống nhất cách gọi tên giữa các bên | `/ba:plan glossary` | ba | W1 |
| 8 | Quản lý danh sách người liên quan (stakeholder) | ai quyết, ai duyệt, ai chỉ cần biết | `/ba:plan stakeholders` | ba | W1 |
| 9 | Soạn PRD (Product Requirements Document) | tài liệu mô tả sản phẩm cần làm gì và vì sao | `/ba:prd prd` | ba | W0 |
| 10 | Định nghĩa persona người dùng | vẽ chân dung người sẽ dùng sản phẩm | `/ba:prd persona` | ba | W1 |
| 11 | Định nghĩa mục tiêu & chỉ số thành công | đo bằng gì để biết sản phẩm thành công | `/ba:prd goals` | ba | W1 |
| 12 | Xác định phạm vi trong/ngoài | cái gì làm đợt này, cái gì để sau | `/ba:prd scope` | ba | W2 |
| 13 | Ghi nhận rủi ro & giả định | những điều chưa chắc, có thể sai | `/ba:prd risks` | ba | W3 |
| 14 | Lộ trình sản phẩm trong PRD | thứ tự làm theo thời gian | `/ba:prd roadmap` | ba | W0 |
| 15 | Duyệt & ký nhận PRD | chốt bản PRD trước khi triển khai | `/ba:prd signoff` | ba | W4 |
| 16 | Soạn FR (Functional Requirement) | hệ thống phải làm được gì (FR = yêu cầu chức năng) | `/ba:spec fr` | ba | W0 |
| 17 | Soạn NFR (Non-Functional Requirement) | hệ thống phải nhanh/an toàn/ổn định cỡ nào (NFR = yêu cầu phi chức năng) | `/ba:spec nfr` | ba | W1 |
| 18 | Soạn UC (Use Case) | kịch bản người dùng làm gì (UC = tình huống sử dụng) | `/ba:spec uc` | ba | W1 |
| 19 | Soạn US (User Story) | mô tả nhu cầu theo góc nhìn người dùng (US = câu chuyện người dùng) | `/ba:spec us` | ba | W1 |
| 20 | Soạn AC (Acceptance Criteria, Given/When/Then) | làm sao biết là xong (AC = tiêu chí nghiệm thu) | `/ba:spec ac` | ba | W0 |
| 21 | Soạn TC (test case) từ AC | kịch bản kiểm thử suy ra từ tiêu chí nghiệm thu | `/ba:spec tc` | ba | W2 |
| 22 | Lắp ráp SRS (Software Requirements Specification) | đặc tả chi tiết cho dev (SRS = đặc tả yêu cầu phần mềm) | `/ba:spec srs` | ba | W2 |
| 23 | Ghi nhận quy tắc nghiệp vụ (business rules) | những ràng buộc bắt buộc phải tuân theo | `/ba:spec rules` | ba | W3 |
| 24 | Xây từ điển dữ liệu (data dictionary) | định nghĩa từng trường dữ liệu dùng chung | `/ba:spec data` | ba | W3 |
| 25 | Ánh xạ phụ thuộc giữa các FR | FR nào phải xong trước FR nào (FR = yêu cầu chức năng) | `/ba:spec deps` | ba | W4 |
| 26 | Kiểm tra nhất quán chéo giữa các FR | phát hiện FR mâu thuẫn nhau (FR = yêu cầu chức năng) | `/ba:spec consistency` | ba | W4 |
| 27 | Sơ đồ luồng nghiệp vụ (flow) | các bước xử lý nối tiếp nhau | `/ba:diagram flow` | ba | W0 |
| 28 | Sơ đồ tuần tự (sequence) | ai gọi ai, theo thứ tự thời gian | `/ba:diagram sequence` | ba | W0 |
| 29 | Sơ đồ trạng thái (state) | một thực thể chuyển từ trạng thái này sang trạng thái khác | `/ba:diagram state` | ba | W0 |
| 30 | Sơ đồ bối cảnh hệ thống (context) | hệ thống này nối với những hệ thống/người nào bên ngoài | `/ba:diagram context` | ba | W3 |
| 31 | Sơ đồ luồng dữ liệu (DFD) | dữ liệu di chuyển qua các bước xử lý ra sao | `/ba:diagram dfd` | ba | W4 |
| 32 | Bản đồ hành trình người dùng (journey map) | trải nghiệm người dùng từ đầu đến cuối | `/ba:diagram journey` | ba | W4 |
| 33 | Sơ đồ lớp (class) | các đối tượng dữ liệu và quan hệ giữa chúng | `/ba:diagram class` | ba | W4 |
| 34 | Kiểm tra khoảng trống truy vết | requirement nào chưa có nguồn hoặc chưa có tài liệu con | `/ba:qc gap` | ba | W0 |
| 35 | Phát hiện entity mồ côi (orphan) | entity không gắn với tài liệu cha nào | `/ba:qc orphan` | ba | W1 |
| 36 | Checklist ký nhận trước bàn giao | danh sách kiểm tra trước khi coi là "xong" | `/ba:qc signoff` | ba | W2 |
| 37 | Kiểm toán độ tin cậy (confidence) | đếm xem có bao nhiêu entity đang ở mức "low"/`[UNVERIFIED]` | `/ba:qc confidence` | ba | W3 |
| 38 | Báo cáo độ phủ FR→TC | mỗi yêu cầu chức năng có test case chưa (FR = yêu cầu chức năng, TC = test case) | `/ba:qc coverage` | ba | W4 |
| 39 | Phát hiện ID trùng lặp | hai entity vô tình dùng chung một mã số | `/ba:qc duplicates` | ba | W4 |
| 40 | Quét mã nguồn cũ để phát hiện entity | tìm requirement ẩn trong code đã viết sẵn (brownfield) | `/ba:reverse scan` | ba | W2 |
| 41 | Suy ngược FR từ code hiện có | đọc code, đoán ra hệ thống đang làm được gì (FR = yêu cầu chức năng) | `/ba:reverse fr` | ba | W3 |
| 42 | Suy ngược AC từ test hiện có | đọc test có sẵn, đoán ra tiêu chí nghiệm thu (AC = tiêu chí nghiệm thu) | `/ba:reverse ac` | ba | W4 |
| 43 | Suy ngược EPIC từ bản đồ module | gom nhóm tính năng lớn từ cấu trúc thư mục/module (EPIC = nhóm tính năng lớn) | `/ba:reverse epic` | ba | W4 |
| 44 | Nạp OpenAPI/contract có sẵn | đọc tài liệu API đã có để không soạn lại từ đầu | `/ba:api import` | ba | W3 |
| 45 | Ánh xạ endpoint API sang FR | mỗi API tương ứng với yêu cầu chức năng nào (FR = yêu cầu chức năng) | `/ba:api map` | ba | W4 |
| 46 | Tài liệu hoá schema request/response | dữ liệu gửi lên và trả về của mỗi API | `/ba:api schema` | ba | W4 |
| 47 | Ma trận phân quyền theo API | vai trò nào được gọi API nào | `/ba:api auth` | ba | W4 |
| 48 | Xuất PRD ra tài liệu | file PRD dạng doc/pdf để gửi ngoài | `/ba:export prd` | ba | W1 |
| 49 | Xuất SRS ra tài liệu | file SRS dạng doc/pdf để gửi dev (SRS = đặc tả yêu cầu phần mềm) | `/ba:export srs` | ba | W2 |
| 50 | Xuất bản nháp PRD/SRS lên Jira | đăng nháp tài liệu lên Jira, chưa publish | `/ba:export jira` | ba | W4 |
| 51 | Xuất báo cáo truy vết | bảng requirement → thiết kế → test, dùng để kiểm toán | `/ba:export traceability` | ba | W4 |
| 52 | Gói bàn giao cho dev | đóng gói toàn bộ entity đã duyệt để chuyển giao | `/ba:export handoff` | ba | W0 |
| 53 | Đồng bộ FR/AC thành ticket cho dev | biến yêu cầu đã duyệt thành việc dev có thể nhận (FR = yêu cầu chức năng, AC = tiêu chí nghiệm thu) | `/ck:tickets --jira` | **ck** | — |
| 54 | Tổng quan trạng thái entity (QC dashboard) | nhìn nhanh việc nào xong, việc nào chưa | `/ck:plan` (bảng kanban, dùng skill `plans-kanban`) | **ck** | — |
| 55 | Sinh sơ đồ tri thức từ tài liệu (knowledge graph) | biến văn bản thành sơ đồ khái niệm liên kết | `/ck:scout` (dùng skill `gkg`) | **ck** | — |

## Deliberately not in this kit

| Cut capability | Replaced by |
|---|---|
| `/delegate` | /ck:team |
| `/brainstorm` | /ck:brainstorm |
| `/ask` | /ck:ask |
| `/prototype-next` | /ck:cook handoff |
