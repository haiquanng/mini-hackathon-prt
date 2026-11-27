> Lịch sử thiết kế v1. Hướng hiện tại theo ảnh tham chiếu mới: [Redesign v2](redesign-v2.md).

# Thiết kế prototype Sunshine

Ngày 27/11/2026. Người dùng đã chọn hướng kem, xanh lá, vàng và yêu cầu cứ dựng prototype. Ưu tiên PWA, desktop responsive, bottom tab số lẻ. Phạm vi là bản trải nghiệm tương tác để phản hồi UI/UX, chưa phải hệ thống dẫn đường thật.

## Ý định

Sinh viên mới hoặc khách tìm một phòng trong VinUni. Một luồng ngắn: chọn điểm đến → xác nhận điểm xuất phát → nhận một chỉ dẫn mỗi lần. Không cần đăng nhập, không ép cấp quyền camera/GPS. Giữ phương án nhập/chọn thủ công khi quyền bị từ chối hoặc dữ liệu chưa đủ.

## Các hướng đã cân nhắc

- Web/PWA với React + Vite: phù hợp PRD, một codebase cho mobile và desktop, đóng gói offline cho bản thử. Đây là hướng được chọn theo yêu cầu PWA của người dùng.
- Native/Unity AR: phù hợp khi cần bám vị trí trong không gian; quá sớm khi chưa có dữ liệu định vị. PRD đã hoãn mascot AR.
- Mockup tĩnh: nhanh để chốt màu, nhưng không kiểm được thao tác chụp ảnh, lựa chọn lại hay mất mạng. Prototype này có hành vi chạy được trên fixture.

## Những quyết định của bản dựng

- Hallmark Dose, scope app, prototype mode. Lấy palette và phân cấp bề mặt, không lấy bố cục landing page hoặc đồ trang trí y tế.
- Be Vietnam Pro, ba trọng lượng 400/500/700, đóng gói font theo subset Latin và Vietnamese.
- Kem là nền, xanh đậm đánh dấu thao tác và trạng thái, vàng là nhận diện Sunshine và mũi tên hướng đi.
- Khám phá / Dẫn đường / Đã lưu, ba tab có nhãn rõ. Dẫn đường ở giữa, không mở camera ngay khi chạm.
- Desktop có cột thao tác nhanh; không kéo màn mobile thành một dải quá rộng. Container tối đa 1200px.
- Hành trình chỉ hiện một chỉ dẫn lớn. Người dùng bấm xác nhận từng chặng; không giả vờ theo dõi chuyển động.
- Ảnh chọn từ máy không được gửi đi. UI nêu rõ chưa có nhận diện AI. GPS chỉ báo sai số, không suy ra phòng.
- Vùng bấm tối thiểu 44px, form có nhãn, focus rõ, dialog bẫy focus và đóng bằng Escape, không tắt phóng to trên mobile.
- Cập nhật service worker theo yêu cầu, không tự refresh giữa hành trình. Thanh cập nhật ẩn trong màn hành trình.
- Không dùng tầng/phòng của virtual-tour thumbnail làm vị trí thật. Mọi tuyến minh hoạ có nhãn.

## Các màn hình

Khám phá (search/filter/full/empty), chi tiết địa điểm, lập hành trình, chọn vị trí (GPS loading/denied/error), chọn ảnh (empty/loading/full/invalid), hành trình (active/previous/arrived/exit), đã lưu (empty/full), thông tin, và dialog cài PWA.

Tab, từ khoá, bộ lọc, điểm xuất phát/đến và bước đã xác nhận nằm trong URL hash để Back và reload có nghĩa. Chỉ các bookmark được lưu lâu dài trên thiết bị.

## Ranh giới

Chưa có LLM, MegaLoc, định vị trong nhà, bản đồ thật, lịch sự kiện, QR check-in hoặc giao diện thu thập dữ liệu. Đây là các phần phát triển tiếp, không có kết quả giả trong prototype.
