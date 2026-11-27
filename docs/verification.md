# Kiểm tra VinUni AR Map

> Kết quả bản hiện tại 0.5 nằm cuối tài liệu. Các phần v2–0.4 bên dưới giữ lại để đối chiếu lịch sử; tính năng ghim đã được bỏ ở 0.5.

Ngày 27/11/2026, production build tại `http://localhost:4173`, Chrome headless riêng trên macOS. Không phải benchmark nhận diện vị trí.

- `npm test`: 4 test qua, gồm 49 cặp địa điểm của đồ thị giả lập, tìm kiếm không dấu và các trường hợp tuyến không hợp lệ.
- `npm run build`: TypeScript và Vite qua. Manifest standalone tiếng Việt, service worker, asset offline được sinh. Chunk 3D tách riêng vẫn phát cảnh báo kích thước >500 kB minified (~140 kB gzip); chưa kiểm hiệu năng trên điện thoại cấu hình thấp.
- `npm run verify`: tìm/lọc, kết quả rỗng, lưu qua reload, đủ ba chặng, lùi, reload giữ chặng, tới nơi, ảnh sai định dạng, fallback vị trí và offline.
- `npm run verify:v2`: pin chọn đúng điểm, zoom cập nhật pin, reset, lời chào Boba, sprite động/dừng/reduced motion, camera giả lập mở/chụp/dừng khi rời, camera bị từ chối và fallback.
- 8 màn hình không tràn ngang ở 320/390/768/1440 px. Trang Khám phá còn được kiểm ở 1280 và 1920 px.
- Axe WCAG 2 A/AA và 2.1 AA: 0 violation phát hiện trên 8 màn ở 390 px. Không thay thế kiểm screen reader hoặc điện thoại thật.
- Hai file Boba được đối chiếu nguyên byte với file người dùng cung cấp.

Bằng chứng hiện tại: `artifacts/verification.json`, `artifacts/redesign-verification.json`, `artifacts/v2-*.png`.

`artifacts/layout-review.json` và `artifacts/hallmark-review.txt` là **kết quả v1**, không phải chứng nhận v2. V2 theo style ảnh tham chiếu trực tiếp của người dùng, thay hướng Dose cũ; xem `docs/redesign-v2.md`.

Đã xem trực tiếp ảnh render mobile, desktop, camera, lập tuyến, dẫn đường và hoàn thành. Trong lần rà ảnh đã chỉnh khoảng cách mascot/pin và thứ bậc nút camera. Chưa kiểm cài thực tế lên màn hình chính iPhone/Android, quyền camera/cảm biến trên điện thoại thật, FPS/GPU trên máy yếu, nâng cấp từ một bản PWA cũ đã cài, screen reader thủ công, nhận diện MegaLoc hoặc GPS tại VinUni.

Không có số đo định vị. Mô hình và các tuyến đều được gắn nhãn minh hoạ. Camera dùng thiết bị giả của Chromium khi test; không bật camera cá nhân để kiểm thử.

## Đổi nhận diện thành VinUni AR Map

Bản 0.3.0: build, `verify` và `verify:v2` đều qua sau khi đổi tên và bảng màu. Axe không phát hiện vi phạm trên 8 màn; các viewport đã kiểm không tràn ngang. Đã xem ảnh mobile 390 px và desktop 1440 px.

Kiểm riêng tên tab, nhãn ứng dụng, tên/short_name trong manifest: đều là VinUni AR Map. Địa điểm đã lưu dưới khóa cũ được đọc và ghi sang khóa mới; đường dẫn giới thiệu cũ chuyển sang `/ve-ung-dung`. Sunshine chỉ còn trong dòng credit team của giao diện (và tên kỹ thuật cũ dùng để tương thích dữ liệu/link).

## Bản 0.4 — URL, kiến trúc và ghim ảnh

Ngày 27/11/2026. `npm test` (4 test), `npm run build`, `npm run verify`, `npm run verify:v2` và `npm run verify:campus` đã qua. Bộ kiểm campus mới xác nhận:

- Link `/#/di-den?to=i109` đổi thành `/di-den?to=i109`; reload trực tiếp, query đích đến, Back và Forward hoạt động.
- Ba ảnh mẫu, chọn ảnh giữ điểm đến, kéo chỉ xoay / chạm mới đặt ghim, xác nhận ghim và bắt đầu tuyến từ điểm đã chọn.
- Ghim lưu qua reload; mở từ mô hình; sửa/xoá không giữ vị trí cũ. Boba vẫn chạm được khi có ghim.
- Bộ ảnh, trình ghim, màn ảnh không hợp lệ không tràn ngang ở 320/390/768/1440 px. Dock luôn ba tab, không lớn hơn 301×62 px trong phép kiểm.
- Manifest mở `/`; reload URL ghim khi offline vẫn có ảnh, mô hình, ghim đã lưu và đi được tuyến mock.
- Khi tắt WebGL, chọn điểm từ danh sách, xác nhận ghim và bắt đầu tuyến vẫn hoạt động.
- Axe: 0 violation trên 8 màn trước đây và 4 màn/trạng thái mới được kiểm; không có pageerror trong các luồng.

Đã xem ảnh render cuối ở mobile 390 px và desktop 1440 px, gồm ghim trên mô hình và trang xác nhận. Lần kiểm tương tác phát hiện nhãn Boba che nút cà phê; đã chuyển mascot ra phía trước bên phải, rút gọn nhãn và chạy lại kiểm cảnh/camera/campus thành công.

Bằng chứng mới: `artifacts/campus-verification.json`, `artifacts/campus-final-mobile.png`, `artifacts/campus-final-desktop.png`, `artifacts/campus-pin-desktop.png`, `artifacts/campus-pin-confirmed-mobile.png`. Hai report kiểm trước cũng đã được cập nhật với BrowserRouter. Build hiện precache khoảng 3.42 MiB; chunk Three.js khoảng 597 kB minified / 153 kB gzip vẫn có cảnh báo kích thước. Chưa kiểm FPS hoặc cài đặt trên điện thoại thật.

## Bản 0.5 — dropdown và luồng ảnh mẫu

Ngày 27/11/2026. `npm test` (4 test), `npm run build`, `npm run verify`, `npm run verify:v2` và `npm run verify:campus` đã qua. Không có lỗi JavaScript trong các luồng đã kiểm. Build vẫn có cảnh báo chunk Three.js lớn: khoảng 592 kB minified / 151 kB gzip; precache khoảng 3,41 MiB.

- Không còn chấm địa điểm, ghim ảnh hoặc hàng chip lọc, kể cả khi trình duyệt chứa dữ liệu ghim cũ. Dropdown nằm bên phải search, lọc kết hợp từ khoá và giữ trạng thái khi reload.
- Ảnh → đang định vị → gợi ý mô phỏng → xác nhận → tuyến đúng điểm xuất phát và điểm đến. Nhiều ứng viên yêu cầu chọn rõ ràng; không nhận ra cho thử lại hoặc nhập thủ công. Kiểm được thao tác radio bằng bàn phím.
- Huỷ đang định vị không chuyển trang muộn. Link ghim cũ chuyển về bộ ảnh mẫu, giữ điểm đến; link hash cũ, reload trực tiếp và Back/Forward vẫn hoạt động.
- Luồng mẫu, ảnh, reload kết quả và tuyến hoạt động ngoại tuyến sau khi đã tải đủ PWA.
- Sáu trang/trạng thái khám phá, bộ ảnh, ba kết quả và ảnh không hợp lệ: Axe WCAG 2 A/AA, 2.1 AA phát hiện 0 violation. Không tràn ngang ở 320/390/768/1440 px; ba tab được giữ.
- Bộ kiểm v2 cũng qua trên tám màn cũ: Boba, zoom/reset, reduced motion, camera giả lập mở/chụp/dừng, từ chối quyền và fallback không có WebGL. Axe không phát hiện vi phạm ở tám màn này.

Đã xem ảnh render 320/390 px và desktop 1440 px, gồm trang khám phá, bộ ảnh và kết quả nhiều ứng viên/không nhận ra. Bằng chứng: `artifacts/photo-flow-verification.json`, `artifacts/verification.json`, `artifacts/redesign-verification.json`, `artifacts/flow-*.png`. Đây là kiểm UI và dữ liệu dựng sẵn, không đo độ chính xác hoặc độ trễ AI; chưa kiểm trên điện thoại thật.
