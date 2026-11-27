// Scripted UI scenarios. These thumbnails are not location-recognition evidence.
export const demoPhotos = [
  { id: 'campus', title: 'Kiến trúc khuôn viên', image: '/images/campus.webp', alt: 'Ngoại cảnh VinUni từ virtual tour', scenario: 'match', label: 'Có vị trí gợi ý', caption: 'Xem kết quả và xác nhận nơi bạn đang đứng.', candidates: ['lobby'] },
  { id: 'classroom', title: 'Không gian học tập', image: '/images/classroom.webp', alt: 'Không gian lớp học từ virtual tour VinUni', scenario: 'choices', label: 'Cần bạn xác nhận', caption: 'Chọn giữa các vị trí có thể giống nhau.', candidates: ['study', 'i109', 'startup'] },
  { id: 'aerial', title: 'VinUni từ trên cao', image: '/images/aerial.webp', alt: 'Toàn cảnh VinUni từ virtual tour', scenario: 'unknown', label: 'Chưa nhận ra vị trí', caption: 'Thử ảnh khác hoặc nhập điểm xuất phát.', candidates: [] },
] as const
export type DemoPhoto = typeof demoPhotos[number]
export const getDemoPhoto = (id: string | null | undefined) => demoPhotos.find(photo => photo.id === id)
