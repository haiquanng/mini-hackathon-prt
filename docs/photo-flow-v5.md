# VinUni AR Map 0.5 — luồng định vị từ ảnh mẫu

Ngày 27/11/2026. Mô hình 3D chỉ minh hoạ kiến trúc, không đại diện cho mặt bằng đo đạc. Đã bỏ mọi chấm địa điểm, ghim ảnh, trình đặt/sửa/xoá ghim và liên kết vị trí trên mô hình. Giữ xoay/zoom, Boba và danh sách tìm địa điểm.

Bộ lọc nhóm được thu vào một dropdown bên phải ô tìm kiếm. Dropdown dùng select gốc của trình duyệt, kết hợp với từ khoá và lưu lựa chọn trong query `nhom`. Không còn hàng nút lọc nhanh.

## Luồng sử dụng

1. `/anh-mau?to=i109`: chọn một trong ba ảnh mẫu.
2. `/nhan-dien?mau=campus&to=i109`: trạng thái đang định vị. Chuyển sau 1,3 giây để mô phỏng UI, không phải thời gian xử lý AI đo được. Rời trang huỷ chuyển tiếp đang chờ.
3. `/xac-nhan-vi-tri?mau=campus&to=i109`: xem gợi ý và xác nhận điểm xuất phát.
4. `/di-den?from=lobby&to=i109`: xem tuyến từ vị trí vừa xác nhận, sau đó bắt đầu hành trình.

Ba fixture trong `src/demoPhotos.ts` mô phỏng: một gợi ý cần xác nhận; nhiều ứng viên chưa chọn sẵn; không nhận ra với lựa chọn thử lại hoặc nhập vị trí thủ công. Mọi bước giữ điểm đến hợp lệ. Kết quả và ảnh có nhãn mô phỏng, không phải nhận diện AI hay nhãn phòng thật của ảnh tour.

`/ghim-anh` cũ chuyển về bộ ảnh mẫu. Kho ghim cũ không được đọc/ghi; không tự xoá dữ liệu trình duyệt. Camera/file thật vẫn chỉ xem trước tại máy, không tự gán kết quả của ảnh mẫu.

## Kiểm chứng

`npm run verify:campus` ghi `artifacts/photo-flow-verification.json`: dropdown và tìm kiếm; không còn pin dù đã có dữ liệu ghim cũ; ba tình huống; xác nhận bằng bàn phím; huỷ định vị; giữ điểm đến; URL trực tiếp; offline; Axe và tràn ngang ở 320/390/768/1440 px. Các bộ kiểm tuyến, camera và PWA trước đây vẫn được duy trì.
