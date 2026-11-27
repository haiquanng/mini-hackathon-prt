import { lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, BookOpen, Camera, ChevronDown, ChevronRight, Coffee, Compass, DoorOpen, ImagePlus, Layers, Leaf, Lightbulb, List, MapPin, Navigation, Search, SlidersHorizontal, X, type LucideIcon } from 'lucide-react'
import { categories, getPlace, searchPlaces, type Category, type Place } from './data'
import { Boba } from './Boba'

const CampusScene = lazy(() => import('./CampusScene'))
const icons: Record<Place['icon'], LucideIcon> = { room: DoorOpen, book: BookOpen, coffee: Coffee, leaf: Leaf, lightbulb: Lightbulb, door: MapPin }

export default function ExploreMap({ save, onHello }: { save: (place: Place) => ReactNode; onHello: () => void }) {
  const [params, setParams] = useSearchParams()
  const [listOpen, setListOpen] = useState(false)
  const [selected, setSelected] = useState('i109')
  const searchRef = useRef<HTMLInputElement>(null)
  const query = params.get('q') ?? ''
  const category = categories.some(c => c.id === params.get('nhom')) ? params.get('nhom') as Category : 'all'
  const results = searchPlaces(query, category)
  const filtered = Boolean(query || category !== 'all')
  const place = getPlace(selected)!
  const PlaceIcon = icons[place.icon]
  function setFilter(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  function select(id: string) { setSelected(id); setListOpen(false); setParams({}, { replace: true }) }
  return <div className={`map-explorer ${filtered || listOpen ? 'show-results' : ''}`}>
    <div className="scene-region"><Suspense fallback={<div className="scene-loading"><Boba mood="wait" /><span>Đang mở khuôn viên…</span></div>}><CampusScene onHello={onHello} /></Suspense></div>
    <section className="explorer-panel" aria-labelledby="explore-title">
      <div className="explorer-heading"><span className="eyebrow"><span className="live-dot" />VINUNI AR MAP</span><h1 id="explore-title" tabIndex={-1}>Khám phá VinUni</h1><p>Tìm điểm đến. Bắt đầu hành trình của bạn.</p></div>
      <div className="search-toolbar"><form role="search" className="search-box" onSubmit={e => e.preventDefault()}>
        <Search size={21} aria-hidden="true" /><label className="visually-hidden" htmlFor="place-search">Tìm phòng hoặc địa điểm</label>
        <input id="place-search" ref={searchRef} type="search" placeholder="Tìm phòng, cà phê, góc học…" value={query} onChange={e => setFilter('q', e.target.value)} autoComplete="off" />
        {query && <button className="icon-button" type="button" aria-label="Xoá từ khoá" onClick={() => { setFilter('q', ''); searchRef.current?.focus() }}><X size={18} /></button>}
      </form>
      <div className={`category-dropdown ${category !== 'all' ? 'is-filtered' : ''}`} title={`Lọc: ${categories.find(c => c.id === category)?.label}`}>
        <SlidersHorizontal size={19} aria-hidden="true" /><ChevronDown size={13} aria-hidden="true" />
        <select aria-label="Lọc loại địa điểm" value={category} onChange={e => setFilter('nhom', e.target.value === 'all' ? '' : e.target.value)}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div></div>
      <div className="explorer-results">
        <div className="section-heading"><h2>{category !== 'all' ? categories.find(c => c.id === category)?.label : filtered ? 'Địa điểm phù hợp' : 'Điểm đến của bạn'}</h2><span className="result-count" role="status">{results.length} địa điểm</span><button className="mobile-results-close icon-button" aria-label="Đóng danh sách" onClick={() => { setListOpen(false); setParams({}, { replace: true }) }}><X size={18} /></button></div>
        {results.length ? <div className="place-list">{results.map(p => { const Icon = icons[p.icon]; return <div className={`place-row map-result ${selected === p.id ? 'is-selected' : ''}`} key={p.id}><button className="place-row-link" onClick={() => select(p.id)}><span className={`place-symbol tone-${p.category}`}><Icon size={22} strokeWidth={1.5} /></span><span className="place-row-copy"><strong>{p.name}</strong><span>Toà I · Tầng trệt</span></span><ChevronRight size={17} /></button>{save(p)}</div> })}</div> : <div className="empty-state"><Search size={30} /><h2>Chưa thấy nơi bạn tìm</h2><p>Thử mã phòng như I109, hoặc tên ngắn như “cà phê”.</p><button className="button button-quiet" onClick={() => setParams({})}>Xem các địa điểm</button></div>}
        <Link to="/vi-tri" className="locate-shortcut"><Compass size={21} /><span>Chưa biết mình ở đâu?<small>Chọn một điểm bạn nhận ra</small></span><ArrowUpRight size={18} /></Link>
      </div>
      <div className="panel-footnote"><Layers size={15} /><span>Mô hình kiến trúc minh hoạ</span><Link to="/ve-ung-dung" aria-label="Về mô hình minh hoạ">?</Link></div>
    </section>
    <div className="scene-heading"><span><Layers size={16} />Toà trung tâm VinUni</span><small>Minh hoạ theo ảnh · Kéo để xoay</small></div>
    {!filtered && !listOpen && <>
      <button className="mobile-list-toggle glass-pill" onClick={() => setListOpen(true)}><List size={17} />Danh sách</button>
      <Link className="sample-map-action" to={`/anh-mau?to=${place.id}`}><ImagePlus size={17} /><span>Thử ảnh mẫu</span></Link>
      <div className="scene-caption"><span className="live-dot" />MÔ HÌNH MINH HOẠ</div>
      <section className="destination-card" aria-label="Địa điểm đang chọn">
        <div className="destination-top"><div className={`destination-icon tone-${place.category}`}><PlaceIcon size={27} strokeWidth={1.4} /></div><div className="destination-copy"><span>{categories.find(c => c.id === place.category)?.label} <span>·</span> Toà I</span><h2>{place.name}</h2></div>{save(place)}</div>
        <p>{place.description}</p>
        <div className="destination-actions"><Link to={`/di-den?to=${place.id}`} className="button button-primary"><Navigation size={19} />Dẫn đường<ArrowUpRight size={19} /></Link><Link to={`/dia-diem/${place.id}`} className="destination-detail" aria-label={`Chi tiết ${place.name}`}><ArrowDown size={20} /></Link></div>
      </section>
      <Link to={`/anh?to=${place.id}`} className="camera-fab" aria-label="Mở camera AR"><Camera size={23} /><span>AR</span></Link>
    </>}
  </div>
}
