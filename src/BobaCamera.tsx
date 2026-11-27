import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, X } from 'lucide-react'
import { Boba } from './Boba'

export default function BobaCamera({ onCapture }: { onCapture: (url: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'active' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const request = useRef(0)
  function stop() { request.current++; stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; setReady(false); setStatus('idle') }
  useEffect(() => () => { request.current++; stream.current?.getTracks().forEach(track => track.stop()) }, [])
  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('error'); setMessage('Camera cần HTTPS hoặc localhost. Bạn vẫn có thể chọn ảnh bằng nút bên dưới.'); return }
    const id = ++request.current
    setStatus('pending'); setMessage(''); setReady(false)
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false })
      if (id !== request.current) { media.getTracks().forEach(track => track.stop()); return }
      stream.current = media
      if (video.current) { video.current.srcObject = media; await video.current.play() }
      if (id === request.current) setStatus('active')
    } catch (error) {
      if (id !== request.current) return
      stream.current?.getTracks().forEach(track => track.stop()); stream.current = null
      setStatus('error')
      setMessage(error instanceof DOMException && error.name === 'NotAllowedError' ? 'Bạn chưa cấp quyền camera. Có thể chọn ảnh hoặc nhập tên phòng để tiếp tục.' : 'Chưa mở được camera. Hãy đóng ứng dụng đang dùng camera, hoặc chọn ảnh bên dưới.')
    }
  }
  function capture() {
    if (!video.current || !ready) return
    const canvas = document.createElement('canvas')
    canvas.width = Math.min(video.current.videoWidth, 1280)
    canvas.height = Math.round(canvas.width * video.current.videoHeight / video.current.videoWidth)
    canvas.getContext('2d')!.drawImage(video.current, 0, 0, canvas.width, canvas.height)
    const url = canvas.toDataURL('image/jpeg', .85)
    stop(); onCapture(url)
  }
  return <div className="live-camera-block">
    <div className={`live-viewfinder ${status === 'active' ? 'is-live' : ''}`}>
      <video ref={video} muted playsInline aria-label="Hình ảnh trực tiếp từ camera" onLoadedData={() => setReady(true)} />
      <span className="camera-mode"><span className="live-dot" />{status === 'active' ? 'CAMERA ĐANG MỞ' : 'VINUNI AR MAP · CAMERA'}</span>
      {status === 'active' && <button className="icon-button stop-camera" aria-label="Tắt camera" onClick={stop}><X size={21} /></button>}
      <div className="viewfinder-corners" aria-hidden="true" />
      <div className="camera-boba"><span className="camera-bubble">Mình nhìn quanh một chút nhé?</span><Boba mood={status === 'active' ? 'wave' : 'idle'} size={124} /><span className="camera-ground" /></div>
      <span className="camera-simulation">Mascot mô phỏng · Chưa nhận diện vị trí</span>
    </div>
    {status === 'error' && <p className="inline-feedback" role="alert"><CameraOff size={20} />{message}</p>}
    <div className="live-camera-actions">{status === 'active' ? <><button className="button button-primary" disabled={!ready} onClick={capture}><Camera size={19} />Chụp khung hình</button><button className="button button-quiet" onClick={stop}>Tắt camera</button></> : <button className="button button-primary full-width" disabled={status === 'pending'} onClick={() => void start()} aria-busy={status === 'pending'}><Camera size={19} />{status === 'pending' ? 'Đang xin quyền camera…' : 'Mở camera AR'}</button>}</div>
  </div>
}
