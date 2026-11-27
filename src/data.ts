export type Category = 'all' | 'study' | 'relax' | 'service'
export type Place = {
  id: string
  name: string
  short: string
  category: Exclude<Category, 'all'>
  icon: 'room' | 'book' | 'coffee' | 'leaf' | 'lightbulb' | 'door'
  description: string
  keywords: string[]
  detail: string
}

// Names come from the team's PRD. These are not a verified room directory.
// All route edges below are synthetic UI fixtures, not a VinUni floor plan.
export const places: Place[] = [
  { id: 'i109', name: 'Phòng I109', short: 'I109', category: 'study', icon: 'room', description: 'Một điểm đến cho buổi học mới.', keywords: ['109', 'phòng học', 'lớp học'], detail: 'Tên phòng đọc từ mặt bằng trong PRD của nhóm. Vị trí cửa phòng cần được kiểm tra tại chỗ.' },
  { id: 'study', name: 'Khu tự học mở', short: 'Tự học', category: 'study', icon: 'book', description: 'Tìm một góc để tập trung.', keywords: ['học bài', 'tự học', 'ôn bài'], detail: 'Không gian tự học được ghi nhận trong PRD. Bản trải nghiệm chưa có dữ liệu chỗ trống hay giờ mở cửa.' },
  { id: 'garden', name: 'Vườn Thư viện', short: 'Vườn Thư viện', category: 'relax', icon: 'leaf', description: 'Nghỉ một chút giữa những tiết học.', keywords: ['vườn', 'thư viện', 'library', 'nghỉ'], detail: 'Tên khu vực tham khảo từ mặt bằng trong PRD. Tuyến đường đang là dữ liệu minh hoạ.' },
  { id: 'coffee', name: 'Quầy cà phê', short: 'Cà phê', category: 'relax', icon: 'coffee', description: 'Một điểm hẹn trước giờ lên lớp.', keywords: ['cafe', 'cà phê', 'coffee', 'nước'], detail: 'Điểm tiện ích được ghi nhận trong PRD. Chưa xác minh giờ phục vụ hoặc thực đơn.' },
  { id: 'i119', name: 'Phòng I119', short: 'I119', category: 'service', icon: 'room', description: 'Phòng y tế theo ghi chú của nhóm, cần kiểm lại tại chỗ.', keywords: ['119', 'y tế'], detail: 'Mã phòng đọc từ ảnh mặt bằng của nhóm, cần kiểm lại tại chỗ trước khi dùng dẫn đường thật.' },
  { id: 'startup', name: 'Trung tâm Khởi nghiệp', short: 'Khởi nghiệp', category: 'service', icon: 'lightbulb', description: 'Nơi những ý tưởng bắt đầu.', keywords: ['khởi nghiệp', 'startup', 'trung tâm'], detail: 'Tên khu vực tham khảo PRD của nhóm. Bản trải nghiệm không bao gồm lịch hoạt động hoặc đặt phòng.' },
  { id: 'lobby', name: 'Sảnh Toà I', short: 'Sảnh Toà I', category: 'service', icon: 'door', description: 'Điểm xuất phát của tuyến mẫu.', keywords: ['sảnh', 'cửa', 'lối vào', 'toà i', 'tòa i'], detail: 'Điểm xuất phát giả lập cho bản trải nghiệm. Không phải vị trí GPS hoặc kết quả nhận diện ảnh.' },
]

export const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Tất cả' }, { id: 'study', label: 'Học tập' },
  { id: 'relax', label: 'Thư giãn' }, { id: 'service', label: 'Tiện ích' },
]
export const getPlace = (id: string | null | undefined) => places.find(p => p.id === id)
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim()
export function searchPlaces(query: string, category: Category = 'all') {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return places.filter(p => (category === 'all' || p.category === category) && terms.every(term => normalize([p.name, ...p.keywords].join(' ')).includes(term)))
}

export type Turn = 'straight' | 'left' | 'right'
export type Edge = { from: string; to: string; turn: Turn; instruction: string }
// Explicit instructions in each direction. Reversing an edge cannot reuse left/right.
export const demoEdges: Edge[] = [
  { from: 'lobby', to: 'startup', turn: 'straight', instruction: 'Đi từ sảnh tới Trung tâm Khởi nghiệp.' },
  { from: 'startup', to: 'lobby', turn: 'straight', instruction: 'Quay lại sảnh Toà I.' },
  { from: 'startup', to: 'study', turn: 'right', instruction: 'Rẽ phải về phía khu tự học mở.' },
  { from: 'study', to: 'startup', turn: 'left', instruction: 'Rẽ trái về phía Trung tâm Khởi nghiệp.' },
  { from: 'study', to: 'i109', turn: 'left', instruction: 'Rẽ trái, tìm cửa phòng I109.' },
  { from: 'i109', to: 'study', turn: 'right', instruction: 'Ra khỏi phòng, rẽ phải về khu tự học mở.' },
  { from: 'study', to: 'i119', turn: 'straight', instruction: 'Đi tiếp tới cửa phòng I119.' },
  { from: 'i119', to: 'study', turn: 'straight', instruction: 'Đi ngược hành lang về khu tự học mở.' },
  { from: 'lobby', to: 'coffee', turn: 'left', instruction: 'Rẽ trái từ sảnh tới quầy cà phê.' },
  { from: 'coffee', to: 'lobby', turn: 'right', instruction: 'Rẽ phải để trở về sảnh Toà I.' },
  { from: 'coffee', to: 'garden', turn: 'straight', instruction: 'Đi tiếp về phía Vườn Thư viện.' },
  { from: 'garden', to: 'coffee', turn: 'straight', instruction: 'Quay về phía quầy cà phê.' },
]

export function findRoute(from: string, to: string, edges: Edge[] = demoEdges): Edge[] | null {
  if (!getPlace(from) || !getPlace(to)) return null
  if (from === to) return []
  const queue: { node: string; route: Edge[] }[] = [{ node: from, route: [] }]
  const seen = new Set([from])
  for (let index = 0; index < queue.length; index++) {
    const { node, route } = queue[index]
    for (const edge of edges.filter(e => e.from === node)) {
      if (seen.has(edge.to)) continue
      const next = [...route, edge]
      if (edge.to === to) return next
      seen.add(edge.to)
      queue.push({ node: edge.to, route: next })
    }
  }
  return null
}
