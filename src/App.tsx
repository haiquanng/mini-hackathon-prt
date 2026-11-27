import { createContext, useContext, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bookmark, BookOpen, Camera, Pause, Play, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, Coffee, Compass, DoorOpen, ExternalLink, Footprints, HelpCircle, ImagePlus, Info, Leaf, Lightbulb, LocateFixed, MapPin, Navigation, Navigation2, RotateCcw, Search, Share, ShieldCheck, Smartphone, Volume2, VolumeX, WifiOff, X, type LucideIcon } from 'lucide-react'
import { findRoute, getPlace, places, searchPlaces, type Place, type Turn } from './data'
import { usePwa } from './usePwa'
import { brand, savedPlacesKey, legacySavedPlacesKey } from './brand'
import { DemoPhotoGallery, PhotoLocating, PhotoConfirmation, LegacyPhotoRedirect } from './PhotoFlow'
import ExploreMap from './ExploreMap'
import BobaCamera from './BobaCamera'
import { Boba, MotionContext } from './Boba'

const PlaceIcons: Record<Place['icon'], LucideIcon> = { room: DoorOpen, book: BookOpen, coffee: Coffee, leaf: Leaf, lightbulb: Lightbulb, door: MapPin }
const turnIcons: Record<Turn, LucideIcon> = { straight: ArrowUp, left: ArrowLeft, right: ArrowRight }
const turnLabels: Record<Turn, string> = { straight: 'Đi thẳng', left: 'Rẽ trái', right: 'Rẽ phải' }
const FavoritesContext = createContext<{ saved: string[]; toggle: (id: string) => void }>({ saved: [], toggle: () => {} })

function readSaved(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(savedPlacesKey) ?? localStorage.getItem(legacySavedPlacesKey) ?? '[]')
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && Boolean(getPlace(id))))] : []
  } catch { return [] }
}

function Brand() {
  return <Link to="/" className="brand" aria-label={`${brand.name}, về Bản đồ`}><span className="brand-mark"><MapPin aria-hidden="true" size={26} strokeWidth={1.8} /></span><span>VinUni <span className="brand-product">AR Map</span><span className="brand-tagline">Khám phá khuôn viên</span></span></Link>
}

function IconButton({ children, label, onClick, className = '', pressed }: { children: ReactNode; label: string; onClick: () => void; className?: string; pressed?: boolean }) {
  return <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} aria-pressed={pressed}>{children}</button>
}

function SaveButton({ place }: { place: Place }) {
  const { saved, toggle } = useContext(FavoritesContext)
  const isSaved = saved.includes(place.id)
  return <IconButton className={isSaved ? 'is-saved' : ''} label={`${isSaved ? 'Bỏ lưu' : 'Lưu'} ${place.name}`} pressed={isSaved} onClick={() => toggle(place.id)}><Bookmark size={20} aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} /></IconButton>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const focused = document.activeElement as HTMLElement | null
    dialog.showModal()
    return () => { dialog.close(); focused?.focus() }
  }, [])
  return <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="dialog-content"><div className="section-heading"><h2 id="dialog-title">{title}</h2><IconButton label="Đóng" onClick={onClose}><X size={22} /></IconButton></div>{children}</div>
  </dialog>
}

function DemoNote({ compact = false }: { compact?: boolean }) {
  return <div className={`demo-note ${compact ? 'compact' : ''}`}><Info size={16} aria-hidden="true" /><span>{compact ? 'Tuyến minh hoạ, chưa dùng để đi thực tế.' : 'Bạn đang thử giao diện. Các tuyến đường là minh hoạ, chưa dùng để đi thực tế.'}</span></div>
}

function BackLink({ to = '/', children = 'Bản đồ' }: { to?: string; children?: ReactNode }) {
  return <Link to={to} className="back-link"><ChevronLeft size={18} aria-hidden="true" />{children}</Link>
}

function PlaceRow({ place, index, showSave = true }: { place: Place; index?: number; showSave?: boolean }) {
  const Icon = PlaceIcons[place.icon]
  return <div className="place-row">
    <Link className="place-row-link" to={`/dia-diem/${place.id}`}>
      <span className={`place-symbol tone-${place.category}`}><Icon size={24} strokeWidth={1.65} aria-hidden="true" /></span>
      <span className="place-row-copy"><strong>{place.name}</strong><span>Toà I <span className="meta-divider" /> Tầng trệt</span></span>
      {index !== undefined && <span className="row-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
    </Link>
    {showSave && <SaveButton place={place} />}
    <Link className="icon-button row-direction" to={`/di-den?to=${place.id}`} aria-label={`Dẫn đường tới ${place.name}`}><ArrowUpRight size={21} aria-hidden="true" /></Link>
  </div>
}

function EmptyState({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children?: ReactNode }) {
  return <div className="empty-state">{children ?? <Search size={36} strokeWidth={1.4} aria-hidden="true" />}<h2>{title}</h2><p>{description}</p>{action}</div>
}

function Explore() {
  const [hello, setHello] = useState(false)
  return <><ExploreMap save={place => <SaveButton place={place} />} onHello={() => setHello(true)} />{hello && <Modal title="Chào bạn, mình là Boba!" onClose={() => setHello(false)}><div className="boba-greeting"><Boba mood="wave" size={144} /><p>Mình là bạn đồng hành trên VinUni AR Map.<br />Cùng khám phá khuôn viên nhé!</p></div><Link className="button button-primary full-width" to="/di-den?to=i109">Thử một hành trình<ArrowUpRight size={19} /></Link><p className="helper-text greeting-note">Boba đang dẫn bạn qua tuyến mẫu. Chưa có định vị trực tiếp.</p></Modal>}</>
}

function PlaceDetail() {
  const { id } = useParams()
  const place = getPlace(id)
  if (!place) return <NotFound />
  const Icon = PlaceIcons[place.icon]
  return <div className="focused-page"><BackLink /><div className="detail-layout">
    <section className="place-detail"><div className={`detail-symbol tone-${place.category}`}><Icon size={62} strokeWidth={1.25} aria-hidden="true" /></div><div className="detail-title"><h1 tabIndex={-1}>{place.name}</h1><SaveButton place={place} /></div><p className="page-intro">{place.description}</p><div className="detail-facts"><span><MapPin size={18} />Toà I</span><span><DoorOpen size={18} />Tầng trệt</span></div><Link to={`/di-den?to=${place.id}`} className="button button-primary"><Navigation size={19} />Dẫn đường tới đây</Link></section>
    <aside className="detail-aside"><h2>Trước khi bắt đầu</h2><p>{place.detail}</p><DemoNote /><div className="line-divider" /><h2>Một điểm đến, từng bước nhỏ</h2><p>Chọn điểm xuất phát, xem trước hành trình và đi qua từng chặng trong bản thử.</p><Link className="text-link" to="/ve-ung-dung">Tìm hiểu bản trải nghiệm<ArrowUpRight size={17} /></Link></aside>
  </div></div>
}

function PlanRoute() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const from = getPlace(params.get('from'))?.id ?? ''
  const to = getPlace(params.get('to'))?.id ?? ''
  const selected = getPlace(to)
  const route = from && to ? findRoute(from, to) : null
  function change(key: string, value: string) { const next = new URLSearchParams(params); next.set(key, value); setParams(next, { replace: true }) }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (from && to && route) navigate(`/hanh-trinh?from=${from}&to=${to}`) }
  return <div className="focused-page"><BackLink /><div className="journey-layout">
    <section className="plan-form"><h1 tabIndex={-1}>Mình đi từ đâu?</h1><p className="page-intro">Chọn điểm xuất phát và điểm đến tại VinUni.</p>
      <form onSubmit={submit}>
        <div className="route-inputs"><div className="route-connection" aria-hidden="true"><span /><i /><MapPin size={18} /></div><div className="route-fields"><label htmlFor="origin">Điểm xuất phát</label><div className="select-wrap"><select id="origin" value={from} required onChange={e => change('from', e.target.value)}><option value="" disabled>Chọn nơi bạn đang đứng</option>{places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><ChevronDown size={17} /></div><label htmlFor="destination">Điểm đến</label><div className="select-wrap"><select id="destination" value={to} required onChange={e => change('to', e.target.value)}><option value="" disabled>Bạn muốn tới đâu?</option>{places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><ChevronDown size={17} /></div></div></div>
        <Link className="inline-camera" to={`/vi-tri${to ? `?to=${to}` : ''}`}><LocateFixed size={19} />Chưa biết mình đang ở đâu?<ChevronRight size={17} /></Link>
        {from && to && !route && <p className="error-message" role="alert">Chưa có đường nối hai địa điểm này. Hãy chọn một điểm khác.</p>}
        {from && from === to && <p className="inline-feedback"><CheckCheck size={19} />Bạn đã chọn cùng một địa điểm.</p>}
        <button className="button button-primary full-width" type="submit" disabled={!from || !to || !route}><Footprints size={20} />{from && from === to ? 'Xác nhận đang ở đây' : 'Xem hành trình'}<ArrowRight size={19} /></button>
      </form>
      <DemoNote />
    </section>
    <aside className="journey-preview"><div className="preview-heading"><span className="preview-boba"><Boba mood="wait" size={100} /></span><h2>{selected ? selected.name : 'Một hành trình rõ ràng'}</h2><p>{selected ? 'Toà I, tầng trệt' : 'Không cần đọc sơ đồ phức tạp.'}</p></div>
      {route && route.length > 0 ? <><div className="route-summary"><span><strong>{route.length}</strong> chặng</span><span>Đi bộ</span><span>Tầng trệt</span></div><ol className="mini-itinerary"><li>{getPlace(from)?.name}</li>{route.map(edge => <li key={edge.to}>{getPlace(edge.to)?.name}</li>)}</ol></> : <div className="preview-explanation"><span><Check size={19} />Chỉ một chỉ dẫn mỗi lần</span><span><Check size={19} />Có thể đổi điểm xuất phát</span><span><Check size={19} />Tự xác nhận khi qua từng chặng</span></div>}
      <span className="preview-label">Tuyến mẫu cho bản trải nghiệm</span>
    </aside>
  </div></div>
}

function ChooseLocation() {
  const [params] = useSearchParams()
  const to = getPlace(params.get('to'))?.id ?? ''
  const [query, setQuery] = useState('')
  const [gpsState, setGpsState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [gpsMessage, setGpsMessage] = useState('')
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  function locate() {
    if (!navigator.geolocation) { setGpsMessage('Trình duyệt chưa hỗ trợ vị trí. Bạn vẫn có thể chọn một điểm bên dưới.'); return }
    setGpsState('loading')
    navigator.geolocation.getCurrentPosition(position => {
      if (!alive.current) return
      setGpsState('done')
      setGpsMessage(`Điện thoại báo sai số khoảng ${Math.round(position.coords.accuracy)} m. Chưa thể xác định phòng trong nhà; hãy chọn điểm bạn nhận ra bên dưới.`)
    }, error => {
      if (!alive.current) return
      setGpsState('done')
      setGpsMessage(error.code === 1 ? 'Bạn chưa cấp quyền vị trí. Không sao, hãy chọn điểm bạn nhận ra bên dưới.' : 'Chưa lấy được vị trí điện thoại. Thử lại hoặc chọn một điểm bên dưới.')
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
  }
  return <div className="narrow-page"><BackLink to={`/di-den${to ? `?to=${to}` : ''}`}>Hành trình của bạn</BackLink><h1 tabIndex={-1}>Bắt đầu từ một điểm quen</h1><p className="page-intro">Nhìn biển tên gần bạn, hoặc chọn một cách bên dưới.</p>
    <div className="location-methods"><button className="method-button" onClick={locate} disabled={gpsState === 'loading'} aria-busy={gpsState === 'loading'}><LocateFixed size={25} /><span><strong>{gpsState === 'loading' ? 'Đang lấy vị trí…' : 'Dùng vị trí điện thoại'}</strong><small>Phù hợp khi ở ngoài trời</small></span><ChevronRight size={20} /></button><Link className="method-button" to={`/anh${to ? `?to=${to}` : ''}`}><Camera size={25} /><span><strong>Chụp ảnh xung quanh</strong><small>Thử luồng chụp ảnh trong nhà</small></span><ChevronRight size={20} /></Link></div>
    {gpsMessage && <p className="inline-feedback" role="status"><Info size={20} />{gpsMessage}</p>}
    <section className="location-list"><h2>Hoặc chọn điểm xuất phát</h2><label htmlFor="origin-search" className="visually-hidden">Tìm điểm xuất phát</label><div className="search-box compact-search"><Search size={20} /><input id="origin-search" placeholder="Tìm phòng, sảnh, quầy cà phê…" value={query} onChange={e => setQuery(e.target.value)} /></div>
      {searchPlaces(query).length ? searchPlaces(query).map(place => <Link className="location-option" key={place.id} to={`/di-den?from=${place.id}${to ? `&to=${to}` : ''}`}><MapPin size={19} /><span>{place.name}</span><ChevronRight size={18} /></Link>) : <EmptyState title="Chưa tìm thấy điểm này" description="Thử một mã phòng khác hoặc xoá từ khoá." action={<button className="button button-quiet" onClick={() => setQuery('')}>Xem tất cả</button>} />}
    </section><p className="privacy-note"><ShieldCheck size={16} />Vị trí điện thoại không được lưu hoặc gửi đi.</p>
  </div>
}

function PhotoLocation() {
  const [params] = useSearchParams()
  const to = getPlace(params.get('to'))?.id ?? ''
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview) }, [preview])
  function selectPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Hãy chọn ảnh JPG, PNG hoặc WebP. Nếu ảnh là HEIC, hãy xuất thành JPG trước.'); e.target.value = ''; return }
    if (file.size > 10 * 1024 * 1024) { setError('Ảnh hơi lớn. Chọn ảnh dưới 10 MB để xem thử.'); e.target.value = ''; return }
    setLoading(true)
    setPreview(URL.createObjectURL(file))
    e.target.value = ''
  }
  return <div className="narrow-page"><BackLink to={`/vi-tri${to ? `?to=${to}` : ''}`}>Chọn vị trí</BackLink><h1 tabIndex={-1}>Camera AR</h1><p className="page-intro">Trải nghiệm mascot ngay trên khung hình.</p>
    {!preview && <BobaCamera onCapture={url => { setPreview(url); setLoading(true); setError('') }} />}
    <div className={`camera-preview ${preview ? 'has-image' : ''}`} hidden={!preview}>
      {preview ? <><img src={preview} alt="Ảnh vị trí bạn vừa chọn" onLoad={() => setLoading(false)} onError={() => { setLoading(false); setError('Không đọc được ảnh này. Hãy chọn một ảnh khác.'); setPreview('') }} />{loading && <span role="status" className="image-loading">Đang mở ảnh…</span>}</> : <><div className="camera-reticle"><Camera size={46} strokeWidth={1.2} aria-hidden="true" /></div><p>Đưa biển tên phòng vào khung hình</p></>}
    </div>
    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="visually-hidden" tabIndex={-1} onChange={selectPhoto} aria-label="Chọn ảnh vị trí" />
    {error && <p className="error-message" role="alert">{error}</p>}
    <div className="photo-actions"><button className="button button-quiet" onClick={() => fileRef.current?.click()}><Camera size={20} />{preview ? 'Chọn ảnh khác' : 'Chọn ảnh có sẵn'}</button><Link className="button button-quiet" to={`/anh-mau${to ? `?to=${to}` : ''}`}><ImagePlus size={19} />Dùng ảnh mẫu</Link></div>
    {preview && <button className="text-link" onClick={() => { setPreview(''); setError('') }}>Mở lại camera AR<Camera size={17} /></button>}
    <div className="photo-status" role="status"><Info size={20} /><div><strong>{preview ? 'Ảnh đã chọn, chưa nhận diện vị trí' : 'Bạn đang thử luồng chụp ảnh'}</strong><p>Nhận diện tự động chưa sẵn sàng. Hãy chọn điểm xuất phát để tiếp tục.</p></div></div>
    <Link to={`/vi-tri${to ? `?to=${to}` : ''}`} className="text-link">Chọn vị trí bằng tên phòng<ArrowRight size={18} /></Link><p className="privacy-note"><ShieldCheck size={16} />Camera và ảnh chỉ hiển thị trên thiết bị, không được tải lên. Boba là hiệu ứng trên màn hình, chưa neo vào không gian thật.</p>
  </div>
}

function Journey() {
  const [params] = useSearchParams()
  const from = getPlace(params.get('from'))
  const to = getPlace(params.get('to'))
  const route = from && to ? findRoute(from.id, to.id) : null
  const stepParam = Number(params.get('buoc') ?? 0)
  const step = route ? Math.min(Math.max(Number.isFinite(stepParam) ? Math.floor(stepParam) : 0, 0), route.length) : 0
  const navigate = useNavigate()
  const [speaking, setSpeaking] = useState(false)
  const [speechMessage, setSpeechMessage] = useState('')
  const [showExit, setShowExit] = useState(false)
  const speechAvailable = 'speechSynthesis' in window
  useEffect(() => { return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() } }, [])
  useEffect(() => { setSpeaking(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel() }, [step])
  if (!from || !to || !route) return <NotFound title="Chưa có hành trình này" description="Chọn lại điểm xuất phát và điểm đến để bắt đầu." />
  const arrived = step === route.length
  const edge = route[step]
  const Direction = edge ? turnIcons[edge.turn] : Check
  const current = getPlace(step === 0 ? from.id : route[step - 1].to)!
  const progress = route.length ? Math.round((step / route.length) * 100) : 100
  function goStep(next: number) { navigate(`/hanh-trinh?from=${from!.id}&to=${to!.id}&buoc=${next}`, { replace: true }); window.scrollTo({ top: 0, behavior: 'instant' }) }
  function speak() {
    if (!speechAvailable) return
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('vi'))
    if (!voice) { setSpeechMessage('Thiết bị chưa có giọng đọc tiếng Việt. Bạn vẫn có thể theo dõi chỉ dẫn trên màn hình.'); return }
    const utterance = new SpeechSynthesisUtterance(edge?.instruction ?? `Bạn đã tới ${to!.name}.`)
    utterance.lang = 'vi-VN'; utterance.voice = voice
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => { setSpeaking(false); setSpeechMessage('Chưa phát được giọng đọc. Hãy dùng chỉ dẫn trên màn hình.') }
    setSpeechMessage(''); setSpeaking(true); window.speechSynthesis.speak(utterance)
  }
  return <div className="focused-page journey-page"><div className="journey-top"><button className="back-link" onClick={() => setShowExit(true)}><X size={19} />Kết thúc</button><span>Tuyến minh hoạ</span>{speechAvailable && <IconButton label={speaking ? 'Dừng giọng đọc' : 'Đọc chỉ dẫn'} onClick={speak} pressed={speaking}>{speaking ? <VolumeX size={21} /> : <Volume2 size={21} />}</IconButton>}</div>
    <div className="active-journey-layout"><section className="active-direction" aria-live="polite">
      <div className="direction-heading"><h1 tabIndex={-1}>{arrived ? 'Tới nơi rồi!' : to.name}</h1><p>{arrived ? 'Bạn vừa hoàn thành hành trình mẫu.' : `Chặng ${step + 1} trong ${route.length} chặng`}</p></div>
      <div className={`direction-stage ${arrived ? 'arrived' : ''}`}><div className="journey-companion"><Boba mood={arrived ? 'jump' : edge.turn === 'left' ? 'left' : 'right'} size={122} /><span className="companion-arrow"><Direction size={50} strokeWidth={1.5} aria-hidden="true" /></span></div><h2>{arrived ? to.name : turnLabels[edge.turn]}</h2><p>{arrived ? 'Đối chiếu biển tên trước khi vào phòng.' : edge.instruction}</p><span className="direction-location"><MapPin size={15} />{arrived ? 'Toà I, tầng trệt' : `Từ ${current.short}`}</span></div>
      {speechMessage && <p className="inline-feedback" role="status">{speechMessage}</p>}
      <div className="journey-progress"><div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Tiến độ hành trình"><span style={{ transform: `scaleX(${progress / 100})` }} /></div><span>{step}/{route.length} chặng đã xác nhận</span></div>
      {arrived ? <div className="arrival-actions"><Link to="/" className="button button-primary">Về bản đồ<ArrowRight size={19} /></Link><SaveButton place={to} /></div> : <><button className="button button-primary full-width" onClick={() => goStep(step + 1)}>Đã tới {getPlace(edge.to)?.short}<Check size={19} /></button><div className="journey-controls"><button disabled={step === 0} onClick={() => goStep(step - 1)}><ChevronLeft size={18} />Chặng trước</button><Link to={`/vi-tri?to=${to.id}`}><RotateCcw size={16} />Đổi điểm xuất phát</Link></div></>}
      <DemoNote compact />
    </section><aside className="journey-timeline"><div className="section-heading"><h2>Hành trình của bạn</h2><Footprints size={21} /></div><p>Bạn xác nhận sau mỗi chặng.</p><ol className="timeline">{[from, ...route.map(e => getPlace(e.to)!)].map((place, index) => <li key={place.id} className={index < step ? 'complete' : index === step ? 'current' : ''}><span className="timeline-marker">{index < step ? <Check size={15} /> : index === step ? <Navigation2 size={15} /> : index}</span><div><strong>{place.name}</strong><small>{index === step ? arrived ? 'Đã tới nơi' : 'Mốc đã xác nhận' : index === 0 ? 'Điểm xuất phát' : index === route.length ? 'Điểm đến' : 'Điểm đi qua'}</small></div></li>)}</ol><p className="timeline-note">Tuyến mẫu không theo dõi vị trí trực tiếp.</p></aside></div>
    {showExit && <Modal title="Dừng hành trình mẫu?" onClose={() => setShowExit(false)}><p>Bạn có thể bắt đầu lại bất kỳ lúc nào.</p><div className="dialog-actions"><button className="button button-quiet" onClick={() => setShowExit(false)}>Tiếp tục đi</button><Link className="button button-primary" to={`/di-den?from=${from.id}&to=${to.id}`}>Dừng hành trình</Link></div></Modal>}
  </div>
}

function Saved() {
  const { saved } = useContext(FavoritesContext)
  return <div className="narrow-page"><h1 tabIndex={-1}>Những nơi muốn quay lại</h1><p className="page-intro">Góc học quen, điểm hẹn, và những nơi của bạn.</p>{saved.length ? <div className="saved-list">{saved.map(id => <PlaceRow key={id} place={getPlace(id)!} />)}</div> : <EmptyState title="Góc quen của bạn ở đây" description="Chạm biểu tượng lưu bên cạnh một địa điểm để lần sau tìm nhanh hơn." action={<Link className="button button-primary" to="/">Mở bản đồ<ArrowRight size={18} /></Link>}><Bookmark size={42} strokeWidth={1.3} /></EmptyState>}<p className="privacy-note"><ShieldCheck size={17} />Lưu trên thiết bị này. Không cần đăng nhập.</p></div>
}

function About() {
  return <div className="narrow-page about-page"><BackLink /><h1 tabIndex={-1}>Về VinUni AR Map</h1><p className="page-intro">Khám phá khuôn viên, tìm phòng và trải nghiệm dẫn đường tại VinUni. Phát triển bởi team Sunshine.</p><section><h2>Boba và khuôn viên thu nhỏ</h2><p>Mô hình 3D minh hoạ kiến trúc toà trung tâm theo ảnh tham chiếu. Bố trí và tỉ lệ là minh hoạ kiến trúc; mô hình không biểu thị vị trí hoặc tuyến đi thực tế. Boba dùng sprite 2D do bạn cung cấp, đổi động tác theo trạng thái giao diện. Chưa có AR neo vào không gian thật hoặc định vị liên tục.</p></section><section><h2>Bạn có thể thử gì?</h2><p>Tìm và lưu địa điểm, thử luồng chọn ảnh mẫu, xem kết quả định vị mô phỏng và xác nhận vị trí, chọn điểm xuất phát, đi qua từng chặng, chọn ảnh từ camera và mở lại bản thử khi mất mạng sau khi ứng dụng đã được tải đầy đủ.</p></section><section><h2>Đâu là dữ liệu minh hoạ?</h2><p>Tên phòng tham khảo PRD của nhóm và chưa được kiểm lại tại chỗ. Mọi đoạn đường, hướng rẽ và kết nối trong bản thử đều là dữ liệu giả lập. Chưa có định vị trong nhà, nhận diện ảnh tự động hoặc theo dõi hành trình trực tiếp.</p></section><section><h2>Ảnh đến từ đâu?</h2><p>Ba ảnh mẫu độ phân giải thấp được lưu từ virtual tour VinUni. Ảnh chỉ minh hoạ khuôn viên, không dùng làm ảnh xác nhận cho một phòng cụ thể.</p><a href="https://vinuni.edu.vn/virtual-tour/index.html" target="_blank" rel="noreferrer" className="text-link">Xem nguồn ảnh<ExternalLink size={16} /></a></section><section><h2>Dữ liệu của bạn</h2><p>Ảnh và vị trí điện thoại không được tải lên hoặc lưu lại. Chỉ danh sách địa điểm yêu thích được lưu trên thiết bị. Luồng ảnh mẫu dùng kết quả dựng sẵn, không lưu ghim trên mô hình.</p></section></div>
}

function NotFound({ title = 'Chưa tìm thấy trang này', description = 'Quay lại Bản đồ để chọn một địa điểm trong bản thử.' }: { title?: string; description?: string }) {
  return <div className="narrow-page"><EmptyState title={title} description={description} action={<Link className="button button-primary" to="/">Về bản đồ</Link>} /></div>
}

function RouteFocus() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0); document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }) }, [pathname])
  return null
}

export default function App() {
  const [saved, setSaved] = useState(readSaved)
  const [motionPaused, setMotionPaused] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [installOpen, setInstallOpen] = useState(false)
  const pwa = usePwa()
  const { pathname } = useLocation()
  const isJourney = pathname === '/hanh-trinh'
  const isNavigation = ['/di-den', '/vi-tri', '/anh', '/anh-mau', '/nhan-dien', '/xac-nhan-vi-tri', '/ghim-anh', '/hanh-trinh'].includes(pathname)
  useEffect(() => {
    try { localStorage.setItem(savedPlacesKey, JSON.stringify(saved)); setStorageError(false) } catch { setStorageError(true) }
  }, [saved])
  useEffect(() => { setInstallOpen(false) }, [pathname])
  function toggle(id: string) { if (getPlace(id)) setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]) }
  const nav = <><NavLink to="/" end className={!isNavigation && pathname !== '/da-luu' ? 'nav-item active' : 'nav-item'}><Compass size={21} /><span>Bản đồ</span></NavLink><Link to="/di-den" className={`nav-item nav-primary ${isNavigation ? 'active' : ''}`} aria-current={isNavigation ? 'page' : undefined}><span className="nav-direction-icon"><Navigation size={21} /></span><span>Dẫn đường</span></Link><NavLink to="/da-luu" className="nav-item"><Bookmark size={21} /><span>Đã lưu{saved.length > 0 && <span className="saved-count">{saved.length}</span>}</span></NavLink></>
  return <MotionContext.Provider value={{ paused: motionPaused, toggle: () => setMotionPaused(p => !p) }}><FavoritesContext.Provider value={{ saved, toggle }}>
    <a href="#main-content" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus() }}>Đến nội dung chính</a>
    <header className="site-header"><div className="header-inner"><Brand /><nav className="desktop-nav" aria-label="Điều hướng chính">{nav}</nav><div className="header-actions"><span className="campus-label"><MapPin size={16} /><span>VinUniversity</span></span><IconButton label={motionPaused ? 'Bật chuyển động Boba' : 'Dừng chuyển động Boba'} onClick={() => setMotionPaused(p => !p)} pressed={motionPaused}>{motionPaused ? <Play size={18} /> : <Pause size={18} />}</IconButton><IconButton label={pwa.installed ? 'Ứng dụng đã được cài' : 'Cài VinUni AR Map'} onClick={() => setInstallOpen(true)}><Smartphone size={21} /></IconButton><Link className="icon-button help-link" to="/ve-ung-dung" aria-label="Thông tin bản trải nghiệm"><HelpCircle size={21} /></Link></div></div></header>
    <div className="app-statusbar"><div><span><MapPin size={14} aria-hidden="true" />Bản trải nghiệm · mô phỏng</span><span className="statusbar-detail">Toà I, tầng trệt</span><span className="statusbar-right">{!pwa.online ? <><WifiOff size={14} />Đang ngoại tuyến</> : 'Đi cùng Boba'}</span></div></div>
    {(!pwa.online || pwa.error || storageError) && <div className="system-message" role="status">{!pwa.online ? 'Bạn đang ngoại tuyến. Tìm kiếm và tuyến mẫu vẫn dùng được; tour của trường cần mạng.' : pwa.error || (storageError ? 'Chưa thể lưu lâu dài trên thiết bị này. Danh sách chỉ được giữ trong phiên hiện tại.' : '')}</div>}
    {pwa.needRefresh[0] && !isJourney && <div className="update-banner" role="status"><span>VinUni AR Map có phiên bản mới.</span><button onClick={() => void pwa.updateServiceWorker(true)}>Cập nhật ngay</button><IconButton label="Để lần sau" onClick={() => pwa.needRefresh[1](false)}><X size={18} /></IconButton></div>}
    <main id="main-content" tabIndex={-1} className={`app-main ${isJourney ? 'in-journey' : ''} ${pathname === '/' ? 'map-main' : ''}`}><Routes><Route path="/" element={<Explore />} /><Route path="/dia-diem/:id" element={<PlaceDetail />} /><Route path="/di-den" element={<PlanRoute />} /><Route path="/vi-tri" element={<ChooseLocation />} /><Route path="/anh" element={<PhotoLocation />} /><Route path="/anh-mau" element={<DemoPhotoGallery />} /><Route path="/nhan-dien" element={<PhotoLocating />} /><Route path="/xac-nhan-vi-tri" element={<PhotoConfirmation />} /><Route path="/ghim-anh" element={<LegacyPhotoRedirect />} /><Route path="/hanh-trinh" element={<Journey />} /><Route path="/da-luu" element={<Saved />} /><Route path="/ve-ung-dung" element={<About />} /><Route path="/ve-sunshine" element={<Navigate to="/ve-ung-dung" replace />} /><Route path="*" element={<NotFound />} /></Routes><RouteFocus /></main>
    {!isJourney && <nav className="bottom-nav" aria-label="Điều hướng trên điện thoại">{nav}</nav>}
    {installOpen && <Modal title={pwa.installed ? 'Đã cài VinUni AR Map' : 'Cài VinUni AR Map'} onClose={() => setInstallOpen(false)}><div className="install-hero"><span className="install-logo"><MapPin size={42} strokeWidth={1.6} /></span><p>Mở nhanh từ màn hình chính,<br />tiếp tục khám phá khi mất mạng.</p></div>{pwa.installed ? <p className="inline-feedback"><CheckCheck size={22} />Ứng dụng đang ở chế độ đã cài.</p> : pwa.prompt ? <button className="button button-primary full-width" onClick={() => void pwa.install()} disabled={pwa.installing} aria-busy={pwa.installing}><ArrowDownToLine size={20} />{pwa.installing ? 'Đang mở trình cài…' : 'Cài VinUni AR Map'}</button> : <><p>Cài từ menu trình duyệt:</p><ol className="install-steps"><li><Share size={19} /><span><strong>iPhone / iPad</strong>Mở trong Safari, chọn Chia sẻ, rồi “Thêm vào Màn hình chính”.</span></li><li><Smartphone size={19} /><span><strong>Android / máy tính</strong>Mở menu Chrome, chọn “Cài đặt ứng dụng” hoặc “Thêm vào Màn hình chính” nếu có.</span></li></ol><p className="helper-text">Cài đặt cần HTTPS hoặc localhost. Nếu chưa thấy tuỳ chọn, bạn vẫn dùng được ngay trên web.</p></>}<p className="privacy-note"><ShieldCheck size={16} />Không cần tài khoản để bắt đầu.</p></Modal>}
  </FavoritesContext.Provider></MotionContext.Provider>
}
