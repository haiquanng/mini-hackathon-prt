import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Camera, Check, ChevronRight, ImagePlus, Info, LoaderCircle, MapPin, ScanLine } from 'lucide-react'
import { getPlace } from './data'
import { demoPhotos, getDemoPhoto, type DemoPhoto } from './demoPhotos'
import { Boba } from './Boba'

function flowUrl(path: string, to?: string, sample?: string) {
  const params = new URLSearchParams()
  if (sample) params.set('mau', sample)
  if (to) params.set('to', to)
  return path + (params.size ? `?${params}` : '')
}
function usePhotoRequest() {
  const [params] = useSearchParams()
  return { photo: getDemoPhoto(params.get('mau')), to: getPlace(params.get('to'))?.id }
}
function FlowSteps({ current }: { current: number }) {
  return <ol className="mock-steps" aria-label="Các bước định vị">{['Chọn ảnh', 'Định vị', 'Xác nhận'].map((label, index) => <li key={label} className={index + 1 === current ? 'active' : ''} aria-current={index + 1 === current ? 'step' : undefined}><span>{index + 1 < current ? <Check size={13} /> : index + 1}</span>{label}</li>)}</ol>
}
function DemoLabel() { return <span className="demo-badge"><ScanLine size={15} />Mô phỏng định vị</span> }
function MissingPhoto({ to }: { to?: string }) {
  return <div className="narrow-page"><h1 tabIndex={-1}>Chọn một ảnh để bắt đầu</h1><p className="page-intro">Ảnh này không có trong bộ trải nghiệm.</p><Link to={flowUrl('/anh-mau', to)} className="button button-primary">Mở bộ ảnh mẫu<ImagePlus size={18} /></Link></div>
}

export function DemoPhotoGallery() {
  const { to } = usePhotoRequest()
  return <div className="focused-page sample-gallery">
    <Link className="back-link" to={flowUrl('/anh', to)}><ArrowLeft size={17} />Camera AR</Link>
    <div className="gallery-heading"><DemoLabel /><h1 tabIndex={-1}>Thử định vị từ một tấm ảnh</h1><p className="page-intro">Chọn ảnh để thử bước nhận diện, xác nhận rồi dẫn đường.</p></div>
    <FlowSteps current={1} />
    <div className="sample-grid">{demoPhotos.map((photo, index) => <Link className="sample-card" key={photo.id} to={flowUrl('/nhan-dien', to, photo.id)}>
      <div className="sample-image"><img src={photo.image} width={240} height={120} alt={photo.alt} /><span className="sample-number">0{index + 1}</span></div>
      <div className="sample-copy"><span className="sample-scenario">{photo.label}</span><h2>{photo.title}</h2><p>{photo.caption}</p><span className="sample-cta">Thử ảnh này<ArrowRight size={16} /></span></div>
    </Link>)}</div>
    <div className="sample-note"><Info size={18} /><p>Kết quả được dựng sẵn để thử luồng sử dụng. Ảnh tour chỉ minh hoạ, chưa được AI nhận diện.</p></div>
  </div>
}

export function PhotoLocating() {
  const { photo, to } = usePhotoRequest()
  const navigate = useNavigate()
  useEffect(() => {
    if (!photo) return
    // A short UI transition, not a measured inference latency. Cleanup prevents late navigation after cancel/back.
    const timer = window.setTimeout(() => navigate(flowUrl('/xac-nhan-vi-tri', to, photo.id), { replace: true }), 1300)
    return () => window.clearTimeout(timer)
  }, [photo, to, navigate])
  if (!photo) return <MissingPhoto to={to} />
  return <div className="narrow-page recognition-page locating-page">
    <Link className="back-link" to={flowUrl('/anh-mau', to)}><ArrowLeft size={17} />Đổi ảnh</Link><DemoLabel />
    <h1 tabIndex={-1}>Đang tìm vị trí…</h1><FlowSteps current={2} />
    <div className="recognition-scan"><img src={photo.image} width={240} height={120} alt={photo.alt} /><ScanLine size={34} aria-hidden="true" /></div>
    <div className="locating-status" role="status"><LoaderCircle size={19} className="recognition-spinner" /><span>Đang mở kết quả mẫu</span></div>
    <p className="page-intro">Boba sẽ đưa gợi ý để bạn xác nhận.</p><div className="locating-boba"><Boba mood="wait" size={100} /></div>
    <Link className="text-link" to={flowUrl('/vi-tri', to)}>Chọn vị trí bằng tên phòng<ArrowRight size={17} /></Link>
  </div>
}

export function PhotoConfirmation() {
  const { photo, to } = usePhotoRequest()
  if (!photo) return <MissingPhoto to={to} />
  return <PhotoResult key={photo.id} photo={photo} to={to} />
}
function PhotoResult({ photo, to }: { photo: DemoPhoto; to?: string }) {
  const [selected, setSelected] = useState<string>(photo.scenario === 'match' ? photo.candidates[0] : '')
  const navigate = useNavigate()
  const unknown = photo.scenario === 'unknown'
  const title = unknown ? 'Chưa xác định được vị trí' : photo.scenario === 'choices' ? 'Bạn đang ở vị trí nào?' : 'Đây có phải nơi bạn đang đứng?'
  function confirm() {
    if (!getPlace(selected)) return
    const params = new URLSearchParams({ from: selected })
    if (to) params.set('to', to)
    navigate(`/di-den?${params}`)
  }
  return <div className="focused-page recognition-page">
    <Link className="back-link" to={flowUrl('/anh-mau', to)}><ArrowLeft size={17} />Bộ ảnh mẫu</Link>
    <DemoLabel /><h1 tabIndex={-1}>{title}</h1><p className="page-intro">{unknown ? 'Thử ảnh có biển tên phòng, hoặc chọn nơi bạn nhận ra.' : photo.scenario === 'choices' ? 'Các không gian có thể giống nhau. Chọn nơi bạn nhận ra.' : 'Đối chiếu tên địa điểm trước khi bắt đầu hành trình.'}</p>
    <FlowSteps current={3} />
    <div className="recognition-layout">
      <figure className="recognition-photo"><img src={photo.image} width={240} height={120} alt={photo.alt} /><figcaption>Ảnh mẫu bạn chọn</figcaption><Boba mood={unknown ? 'wait' : 'wave'} size={72} /></figure>
      <section className="recognition-result" aria-label="Kết quả định vị mô phỏng">
        {unknown ? <><div className="unrecognized-message"><ScanLine size={28} /><h2>Cần thêm một góc nhìn</h2><p>Chưa có vị trí để bắt đầu dẫn đường từ ảnh này.</p></div><Link className="button button-primary full-width" to={flowUrl('/anh-mau', to)}><ImagePlus size={18} />Thử ảnh khác</Link><Link className="button button-quiet full-width" to={flowUrl('/vi-tri', to)}><MapPin size={18} />Chọn điểm xuất phát</Link></> : <>
          <fieldset className="location-candidates"><legend>{photo.scenario === 'match' ? 'Vị trí gợi ý trong bản thử' : 'Các vị trí gợi ý trong bản thử'}</legend>
            {photo.candidates.map(id => { const place = getPlace(id)!; return <label className={`location-candidate ${selected === id ? 'is-selected' : ''}`} key={id}>
              <input type="radio" name="candidate" value={id} checked={selected === id} onChange={() => setSelected(id)} />
              <span className="candidate-icon"><MapPin size={22} /></span><span className="candidate-copy"><strong>{place.name}</strong><small>Toà I, tầng trệt</small></span><span className="candidate-check" aria-hidden="true">{selected === id ? <Check size={16} /> : <ChevronRight size={16} />}</span>
            </label> })}
          </fieldset>
          <button className="button button-primary full-width" disabled={!selected} onClick={confirm}><Check size={18} />Đúng, mình đang ở đây<ArrowRight size={18} /></button>
          <Link className="text-link recognition-manual" to={flowUrl('/vi-tri', to)}>Không phải ở đây? Chọn vị trí khác<ChevronRight size={17} /></Link>
          {photo.scenario === 'choices' && <Link className="text-link recognition-retake" to={flowUrl('/anh-mau', to)}><Camera size={17} />Thử một ảnh khác</Link>}
        </>}
        <p className="recognition-disclaimer"><Info size={15} />Kết quả mô phỏng, chưa có nhận diện AI thật.</p>
      </section>
    </div>
  </div>
}

// Old shared pin-editor links now open the photo flow, never a fictitious map position.
export function LegacyPhotoRedirect() {
  const { to } = usePhotoRequest()
  return <Navigate to={flowUrl('/anh-mau', to)} replace />
}
