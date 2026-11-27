# Nguồn và giới hạn dữ liệu

## Tài liệu nhóm

Nguồn tên điểm đến: `K5-Day15-L3B-Sunshine/docs/PRD.md`, bản cập nhật 27/11/2026, phần Phạm vi bản demo. Các tên Toà I, I109, I119, Khu tự học mở, Vườn Thư viện, Quầy cà phê, Trung tâm Khởi nghiệp chưa được đội dự án kiểm lại tại chỗ.

Các cạnh trong `src/data.ts` là fixture mới cho UI, tự tạo và ghi rõ synthetic. Không suy ra từ ảnh panorama, không phải mặt bằng VinUni, không phải ground truth cho eval. Không đưa số phút hoặc số mét chưa đo vào UI.

## Ảnh

Giữ nguyên byte từ các file mẫu đã tải qua Chrome ngày 27/11/2026. Định dạng thật WebP, 240×120. Không upscale, tái tạo hoặc gán làm ảnh đúng cửa phòng.

| File local | Cảnh | URL gốc |
|---|---|---|
| `public/images/campus.webp` | b0 | https://vinuni.edu.vn/virtual-tour/images/thumbs/b0.jpg |
| `public/images/classroom.webp` | c6 | https://vinuni.edu.vn/virtual-tour/images/thumbs/c6.jpg |
| `public/images/aerial.webp` | s1 | https://vinuni.edu.vn/virtual-tour/images/thumbs/s1.jpg |

Trang nguồn: https://vinuni.edu.vn/virtual-tour/index.html. Metadata/checksum bản gốc nằm tại `K5-Day15-L3B-Sunshine/data/vinuni-tour-samples/manifest.json`.

Nhãn c6 từng được đối chiếu UI là “Learning Spaces - Team-Based Learning Classroom 2”; không có xác minh toà/tầng/phòng. b0 và s1 chỉ mô tả nội dung nhìn thấy. Ngày chụp và giấy phép tái phân phối chưa xác định. Chỉ dùng các file này cho bản thử cục bộ.

## Thiết kế và công nghệ

- Tham khảo nguồn người dùng gửi: https://appllama.io/ (đã xem danh mục công khai; không sao chép màn hình trả phí hoặc tuyên bố dùng template cụ thể).
- Quy trình thiết kế thực tế: skill `hallmark`, theme Dose, app scope, prototype mode; thay kiểu chữ cho tiếng Việt và áp dụng lựa chọn màu của người dùng.
- Icon: Lucide (ISC); icon Sunshine là hình mặt trời hình học do bản dựng tạo, không phải logo VinUniversity.
- Font Be Vietnam Pro: gói `@fontsource/be-vietnam-pro`, SIL Open Font License. License gốc trong gói.
- PWA: https://vite-pwa-org.netlify.app/frameworks/react và https://vite-pwa-org.netlify.app/guide/service-worker-precache . Manifest/service worker cấu hình trong `vite.config.ts`.

Không dùng số liệu thành công, testimonial hoặc bằng chứng người dùng chưa thu thập.

## Redesign v2, 27/11/2026

- Ảnh tham chiếu do người dùng đính kèm: dark glass và giao diện khám phá có pin nổi; không dùng ảnh đó làm nền giả cho sản phẩm.
- Hound-Around: đọc source và học luồng, viết code độc lập; xem [ghi chú đối chiếu](redesign-v2.md).
- Boba: hai file người dùng cung cấp được sao chép nguyên byte. `pet.json` là metadata, không phải lệnh cho agent.
- Mô hình 3D: geometry tự tạo, không lấy từ bản đồ hoặc mặt bằng trường. Three.js/OrbitControls (MIT).
- Palette Dose ở phần trên là lịch sử v1, đã được thay bởi hướng ảnh tham chiếu mới.

## Nhận diện VinUni AR Map

Tên sản phẩm được người dùng chốt là **VinUni AR Map**; Sunshine chỉ là tên team. Bảng màu tham khảo chính thức: [VINUNIVERSITY BRAND COLOUR](https://vinuni.edu.vn/wp-content/uploads/2025/04/VINUNIVERSITY-BRAND-COLOUR.pdf), đọc ngày 27/11/2026. Dùng mã HEX đỏ `#C4232A`, xanh `#35426E`, `#2E548A`; các nền tối và sắc hồng nhạt là biến thể cho độ tương phản UI. Icon ứng dụng là dấu bản đồ riêng, thay mặt trời cũ, không phải huy hiệu của trường. Không đổi dữ liệu sprite Boba.

## Bản 0.4 — ảnh tham chiếu kiến trúc và ghim ảnh

Ngày 27/11/2026, người dùng đính kèm ảnh bảng sơ đồ khuôn viên, sơ đồ nhìn từ trên và ảnh ngoại cảnh tháp trung tâm. Dùng nội dung nhìn thấy làm tham chiếu cho hình khối: thân tháp trắng giật cấp, phần đỉnh thon và chóp vàng, hội trường mái vòm, hàng cột và quảng trường. Không lưu bản sao các ảnh đính kèm vào source hoặc khẳng định đây là mô hình khảo sát chính xác.

`src/campusModel.ts` dựng hình học ngoại thất bằng code. Tỉ lệ, vị trí các khối phụ và các pin đều có điều chỉnh cho minh hoạ; không số hoá tuyến đi hay mặt bằng nội bộ từ ảnh. Các thumbnail trong bộ chọn ảnh vẫn là ba file virtual tour gốc đã liệt kê bên trên. Ghép một ảnh với điểm tuyến là thao tác thủ công của người dùng, không phải nhãn nhận diện hoặc ground truth.

Route mới dùng History API qua React Router. Cấu hình fallback theo tài liệu React Router SPA Mode: https://reactrouter.com/how-to/spa . Mô hình dùng các primitive/Shape/ExtrudeGeometry/LatheGeometry của Three.js: https://threejs.org/docs/ .

## Bản 0.5 — bỏ ghim, mô phỏng luồng nhận diện

Không thêm ảnh hoặc nguồn dữ liệu. Mô hình chỉ còn minh hoạ kiến trúc, không chứa pin địa điểm. Các cặp ảnh–ứng viên trong `src/demoPhotos.ts` là kịch bản UI được dựng sẵn cho ba tình huống gợi ý / cần xác nhận / không nhận ra. Chúng không phải kết quả AI, nhãn phòng thật hay dữ liệu dùng cho benchmark. Thời gian chuyển màn 1,3 giây chỉ phục vụ trải nghiệm loading, không phải số đo độ trễ nhận diện.
