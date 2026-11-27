# Sunshine v2 — không gian khám phá và Boba

Ngày: 27/11/2026. Yêu cầu mới của người dùng thay hướng kem/xanh/vàng của v1 bằng hai ảnh tham chiếu: nền tối, mặt kính, lớp UI nổi, không gian khám phá và mascot. Dùng Hallmark để giữ nhịp, tương phản và trạng thái; lựa chọn màu cyan trên nền tối và chất liệu kính là yêu cầu trực tiếp, thay palette Dose cũ.

## Thiết kế đã triển khai

- Màn Khám phá chiếm toàn màn hình, mô hình thu nhỏ tự dựng bằng Three.js. Kéo để xoay, zoom bằng chuột/cử chỉ hoặc nút; các pin là DOM có nhãn truy cập và bám theo phép chiếu camera.
- Desktop: bảng tìm kiếm và danh sách bên trái, cảnh bên phải. Điện thoại: tìm kiếm/lọc phía trên; danh sách chỉ mở khi cần; thẻ điểm đến và ba tab nổi phía dưới.
- Navy, kính tối có nền đủ đậm, đường viền sáng nhẹ, turquoise cho tác vụ chính. Chữ Be Vietnam Pro được đóng gói, không gọi Google Fonts.
- Boba dùng đúng sprite người dùng cung cấp. Idle khi khám phá, vẫy tay khi chào/camera, chạy trái/phải trong hành trình, nhảy khi hoàn thành. Dừng bằng nút đầu trang, theo `prefers-reduced-motion` hoặc khi tab bị ẩn.
- Luồng camera xin quyền sau thao tác; chụp vào canvas cục bộ, không upload. Dừng mọi MediaStreamTrack khi chụp, tắt hoặc rời màn hình; xử lý cả trường hợp người dùng rời khi hộp thoại xin quyền vẫn mở.
- Chọn vị trí thủ công luôn dùng được. Không báo vị trí AI, khoảng cách hoặc độ tin cậy giả.

## Đối chiếu Hound-Around

Đã đọc trực tiếp `frontend/package.json`, `frontend/src/App.jsx`, `frontend/src/index.css`, `frontend/src/screens/Snap.jsx` và `frontend/src/screens/Route.jsx` trong [repo Hound-Around](https://github.com/DxubleBTW/Hound-Around).

Học cách tổ chức chọn điểm đến → ảnh hoặc vị trí thủ công → xác nhận khi chưa chắc → chỉ dẫn. Snap của repo dùng input file có `capture="environment"`; không coi nó là bằng chứng của camera AR hay mô hình 3D. Phần giao diện dark glass/miniature đến từ ảnh tham chiếu của người dùng. Không sao chép source Hound-Around; các component tại đây được viết độc lập.

## Bộ pet

Nguồn do người dùng cung cấp: bộ Boba gồm `pet.json` và `spritesheet.webp`. Bản sao nguyên byte ở `public/pets/boba/`.

Sprite v2: 1536 × 2288 px; lưới 8 cột × 11 hàng; mỗi ô 192 × 208 px. Chỉ đọc metadata như dữ liệu. Component `Boba.tsx` dùng các hàng/duration theo định dạng sprite v2; không làm biến đổi ảnh, không cài pet vào ChatGPT/Codex.

## Giới hạn

Cảnh 3D là mô hình minh hoạ bằng geometry tự tạo. Không lấy, tái dựng hay công khai mặt bằng thật. Pin và đường trong prototype không đại diện cho vị trí địa lý thật. Boba là sprite 2D được đặt trong cảnh/đè trên video, chưa có AR world tracking, occlusion hoặc nhận diện bằng MegaLoc. Đây là minh hoạ tương tác, chưa là sản phẩm dẫn đường ngoài thực địa.

Không gian 3D tách thành chunk tải theo màn hình; renderer chỉ render khi resize/thao tác, không chạy vòng lặp GPU liên tục. Nếu WebGL không hoạt động, danh sách và luồng đi đường vẫn dùng được. PWA cache cả sprite gốc ~2.44 MB; tổng precache khoảng 3.43 MiB theo build, cần lần tải đầu hoàn tất trước khi dùng ngoại tuyến.

Code vẫn nằm tại thư mục prototype đang được dùng trước đó. `AGENTS.md` mới của repo nhóm đã cho phép đặt code tại `vinuni-wayfinder/`; việc để prototype hiện tại ở ngoài không còn là yêu cầu của AGENTS. Chưa di chuyển, commit hoặc deploy bản này vào repo công khai.
