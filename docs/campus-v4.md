# VinUni AR Map 0.4 — kiến trúc, URL và ghim ảnh

> Tài liệu lịch sử. Bản 0.5 đã bỏ chấm địa điểm và trình ghim ảnh; xem [luồng ảnh mẫu hiện tại](photo-flow-v5.md).

Ngày 27/11/2026. Giữ nhận diện đỏ/xanh VinUni và kính tối. Thay đổi theo yêu cầu mới của người dùng: URL không có dấu `#`, minh hoạ toà trung tâm theo ảnh, dock gọn hơn và trải nghiệm ảnh mẫu → ghim → bắt đầu tuyến mẫu.

## Các trang

- `/`: khám phá mô hình, xem ghim ảnh đã lưu và mở lại trang sửa ghim.
- `/dia-diem/:id`, `/di-den`, `/vi-tri`, `/anh`, `/hanh-trinh`, `/da-luu`, `/ve-ung-dung`: route riêng bằng BrowserRouter.
- `/anh-mau?to=i109`: bộ ba ảnh mẫu. Điểm đến được giữ khi chọn ảnh.
- `/ghim-anh?mau=campus&to=i109`: đặt ghim bằng chạm hoặc danh sách điểm, xác nhận, sửa/xoá và bắt đầu hành trình.
- Link cũ `/#/...` được chuyển tại bước khởi tạo. Manifest mở `/`; history fallback có ở dev/preview, service worker và cấu hình host đi kèm.

## Cảnh và tương tác

`campusModel.ts` dựng tháp trắng giật cấp, cửa vòm, thân đỉnh bát giác, chóp vàng, hội trường mái vòm, các cánh nhà, cây và quảng trường. Kiến trúc được cách điệu từ ảnh tham chiếu; không phải bản đồ đo đạc. Ánh sáng và camera giữ tháp dễ nhìn trên màn hình điện thoại. Boba đứng ở phía trước bên phải, nhường vùng giữa cho ghim ảnh và nhãn địa điểm.

Dock có ba tab, rộng tối đa 300 px, cao 60 px trên điện thoại / 61 px trên desktop, vẫn giữ vùng chạm khoảng 49–50 px. Pin mô hình bám camera khi xoay/zoom. Renderer chỉ vẽ lại khi có thay đổi, có fallback nếu không có WebGL.

## Dữ liệu mô phỏng

Ảnh mẫu lấy từ ba thumbnail tour có sẵn. Chạm đất dùng raycaster để chọn toạ độ trong mô hình. Kéo xoay và cử chỉ nhiều ngón không được hiểu là ghim. Người dùng có thể gắn lại điểm xuất phát từ danh sách trước khi xác nhận. Tuyến chạy trên đồ thị mock hiện có, không tính đường từ toạ độ trong mô hình như một vị trí địa lý thật.

Chỉ lưu mã ảnh, toạ độ minh hoạ và mã điểm tuyến vào `vinuni-ar-map.mock-photo-pins.v1`. Một ghim cho mỗi ảnh; chọn lại ảnh sẽ mở ghim đã có. Nếu không lưu được localStorage, vẫn dùng trong phiên và có thông báo. Không lưu ảnh người dùng hoặc GPS.

## Giới hạn

Chưa có nhận diện ảnh, AR neo trong thế giới thật hoặc dữ liệu dẫn đường đã khảo sát. Hình khối đủ để mô phỏng trải nghiệm, không dùng làm hướng dẫn đi thực tế. Không deploy hay commit bản này lên repo công khai.
