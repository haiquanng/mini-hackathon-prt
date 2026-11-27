# mini-hackathon-prt · VinUni AR Map

Bản trải nghiệm UI/UX tiếng Việt cho VinUni AR Map, ưu tiên điện thoại. React + TypeScript + Vite + Three.js, có mascot Boba, manifest, service worker, icon cài ứng dụng và dữ liệu mẫu chạy ngoại tuyến.

Repo prototype PWA của team Sunshine. Các kết quả định vị và tuyến đường là dữ liệu mô phỏng để thử luồng sử dụng; chưa nối backend nhận diện AI.

**Dùng thử:** https://vinuni-ar.vercel.app · [Bộ ảnh mẫu](https://vinuni-ar.vercel.app/anh-mau)

Vercel project `vinuni-ar` được nối với repo này; push lên `main` sẽ tạo bản production mới. Build dùng Node.js 22, `npm ci`, `npm run build`, thư mục xuất `dist/`. Không cần API key cho bản mock.

## Chạy ngay

Yêu cầu Node.js 22.12 trở lên (đã chạy với Node 22.17.1).

```bash
git clone https://github.com/haiquanng/mini-hackathon-prt.git
cd mini-hackathon-prt
npm ci
npm run dev
```

Dev: http://localhost:5173. Để kiểm tra PWA/offline, chạy bản build:

```bash
npm run build
npm run preview
```

Preview: http://localhost:4173.

Điện thoại cùng mạng có thể mở địa chỉ Network do Vite in ra để xem giao diện. **HTTP qua IP nội bộ không đủ để cài PWA, dùng service worker, camera trực tiếp hoặc GPS.** Để thử đầy đủ trên điện thoại, dùng bản HTTPS trên Vercel hoặc HTTPS nội bộ có chứng chỉ được thiết bị tin cậy.

## Luồng nên thử

1. Khám phá → gõ `ca phe` hoặc `I109`; mở dropdown bên phải ô tìm kiếm để lọc Học tập / Thư giãn / Tiện ích.
2. Lưu một địa điểm → tab Đã lưu → tải lại trang; địa điểm vẫn còn.
3. Dẫn đường → chọn **Sảnh Toà I** → **Phòng I109** → xem và xác nhận ba chặng.
4. Chặng trước / đổi điểm xuất phát / kết thúc hành trình.
5. Chưa biết mình đang ở đâu → vị trí điện thoại; nếu từ chối quyền, chọn vị trí thủ công.
6. Mở Camera AR → cho phép camera để thấy mascot trên video. Chụp khung hình hoặc chọn ảnh từ máy; UI nói rõ **chưa nhận diện vị trí**. Camera tắt khi chụp hoặc rời màn hình.
7. Mở **Thử ảnh mẫu** → chọn ảnh → đang định vị → xem gợi ý → xác nhận nơi đang đứng → dẫn đường. Ba ảnh tương ứng ba tình huống dựng sẵn: một gợi ý, nhiều ứng viên, không nhận ra. Có thể thử ảnh khác hoặc chọn vị trí thủ công; điểm đến được giữ xuyên suốt.
8. Chạm Boba để chào; kéo mô hình 3D để xoay, bấm +/− để zoom. Nút dừng đầu trang và reduced motion dừng animation.
9. Bấm icon điện thoại trên đầu trang để cài nếu trình duyệt cho phép, hoặc xem hướng dẫn Safari/Chrome.
10. Sau lần tải đầy đủ bản preview, bật Offline trong DevTools và reload. Tìm kiếm, đã lưu và tuyến mẫu vẫn hoạt động.

Ba tab trên điện thoại: **Bản đồ – Dẫn đường – Đã lưu**. Desktop giữ dock nổi và mở bảng tìm kiếm bên cạnh không gian 3D. Có safe area, reduced motion, focus bàn phím, nhãn cho icon, native dialog và thông báo trạng thái.

## Thật và minh hoạ

| Phần | Trạng thái |
|---|---|
| Tìm kiếm tiếng Việt không dấu, lọc, lưu trên thiết bị | Hoạt động |
| Tính tuyến, tiến/lùi, đổi điểm xuất phát | Hoạt động **trên đồ thị giả lập** |
| Cài đặt / ngoại tuyến | Manifest + service worker đã tạo; cache/reload offline đã kiểm bằng Chromium |
| Chọn ảnh / camera | Live getUserMedia sau khi bấm; chụp/preview tại máy; dừng camera khi rời; không upload |
| Mô hình 3D | Minh hoạ kiến trúc tháp trung tâm, mái vòm, quảng trường; không có chấm địa điểm hay thao tác ghim vị trí |
| Luồng ảnh mẫu | Ba kịch bản dựng sẵn: gợi ý / nhiều ứng viên / không nhận ra. Xác nhận điểm xuất phát trước khi mở tuyến giả lập |
| Mascot Boba | Sprite gốc của người dùng; chuyển động theo trạng thái và hỗ trợ dừng |
| GPS | Gọi API vị trí khi người dùng bấm; chỉ báo sai số, chưa gán vị trí vào đồ thị |
| Giọng đọc | Chỉ dùng giọng tiếng Việt nếu thiết bị có; nếu không có, báo và dùng chữ |
| Nhận diện ảnh MegaLoc / LLM / backend | Chưa nối |
| Tên địa điểm | Tham khảo PRD nhóm, chưa kiểm lại tại chỗ |
| Đồ thị / hướng rẽ | Hoàn toàn giả lập, **không dùng đi thực tế** |
| Ảnh VinUni | Ba thumbnail gốc 240×120; nhãn cảnh không được dùng làm nhãn phòng |
| Sự kiện, QR điểm danh, chế độ thu thập, AR neo vào thế giới thật | Ngoài phạm vi prototype UI này |

Không có tài khoản, analytics, API key hoặc dịch vụ ngoài. Danh sách địa điểm yêu thích được giữ ở `localStorage`; URL chứa mã ảnh mẫu, lựa chọn tuyến và chặng đã xác nhận. Dữ liệu ghim của bản cũ không còn được đọc hoặc ghi. Ảnh từ camera/file người dùng và toạ độ GPS không được gửi hay lưu. Service worker cache file tĩnh của ứng dụng, không cache dữ liệu API.

## Kiểm tra

```bash
npm test
npm run build
# Để npm run preview chạy ở một terminal khác:
npm run verify
npm run verify:v2
npm run verify:campus
```

`verify` dùng Playwright điều khiển Chrome headless riêng, không dùng phiên Chrome cá nhân. Mặc định đường dẫn Chrome trên macOS; hệ điều hành khác đặt `CHROME_PATH` thành đường dẫn Chrome/Chromium. Có thể đặt `PROTOTYPE_URL` nếu preview dùng cổng khác.

Bằng chứng ở `artifacts/verification.json`, `artifacts/redesign-verification.json`, `artifacts/photo-flow-verification.json` và ảnh trong `artifacts/`. Các test kiểm đường đi liên tục cho mọi cặp địa điểm, mã phòng lạ, đồ thị rời, hướng đi ngược, tìm không dấu, lưu qua reload, từ chối quyền vị trí, file ảnh sai định dạng, ba kết quả ảnh mẫu và tải lại PWA ngoại tuyến. Axe kiểm tự động không thay thế kiểm thử trên iPhone/Android thật.

Nhận diện hiện tại: **VinUni AR Map**, đỏ #C4232A và xanh #35426E / #2E548A theo bảng màu công khai của VinUni, kính tối và mascot Boba. Sunshine là tên team, chỉ xuất hiện trong phần giới thiệu. Chi tiết: [Bản 0.5 — luồng ảnh mẫu](docs/photo-flow-v5.md), [Thiết kế v2](docs/redesign-v2.md), [nguồn dữ liệu và ảnh](docs/sources.md), [kết quả kiểm tra](docs/verification.md). Tài liệu 0.4 và ảnh trong `artifacts/v1/` là lịch sử các bản trước.

## URL riêng và cấu hình host

Dùng BrowserRouter: `/di-den?to=i109`, `/dia-diem/i109`, `/anh-mau`, `/nhan-dien?mau=campus`, `/xac-nhan-vi-tri?mau=campus`. Mỗi màn có route riêng, mở trực tiếp/reload/back/forward được; link cũ `/#/...` tự chuyển sang đường dẫn mới. `/ghim-anh` cũ chuyển về bộ ảnh mẫu và giữ điểm đến. Vẫn là SPA, không phải một file HTML riêng cho từng màn.

Vite dev/preview đã có fallback. Khi deploy `dist/`, host phải trả `index.html` cho các route ứng dụng: có sẵn `vercel.json` cho Vercel và `public/_redirects` (được copy vào dist) cho host hỗ trợ cú pháp Netlify. Host khác cần cấu hình history fallback tương đương, giữ nguyên các file tĩnh/API. Service worker có `navigateFallback` cho truy cập ngoại tuyến sau lần tải đầu.

## Nối dữ liệu thật sau prototype

1. Thay `src/data.ts` bằng danh mục địa điểm và đồ thị đã đi kiểm; giữ bước xác nhận nguồn và hướng đi ngược riêng biệt.
2. Tách adapter API cho `/places`, `/route`, `/locate`; chỉ hiển thị kết quả được backend trả về, có ngưỡng từ chối và lựa chọn lại.
3. Nối camera/upload và `PhotoFlow` vào backend nhận diện, thay fixture bằng response thật; bổ sung timeout, lỗi mạng và đồng ý lưu ảnh riêng. Giữ bước xác nhận và fallback thủ công.
4. Kiểm lại vị trí và toàn bộ tuyến trên Toà I bằng điện thoại thật trước khi bỏ nhãn minh hoạ.
5. Thay ảnh preview bằng ảnh đủ độ phân giải và xác nhận quyền sử dụng trước khi phát hành rộng.

Không lấy benchmark của repo nộp bài làm dữ liệu đặc biệt cho UI; không sửa chuẩn đạt hoặc ghi một kết quả định vị chưa đo.
