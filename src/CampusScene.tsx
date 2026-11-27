import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { Boba } from './Boba'
import { buildCampusModel } from './campusModel'

type Action = 'in' | 'out' | 'reset' | 'left' | 'right'
export default function CampusScene({ onHello }: { onHello?: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const mascot = useRef<HTMLButtonElement>(null)
  const action = useRef<(value: Action) => void>(() => {})
  const renderNow = useRef(() => {})
  const [failed, setFailed] = useState(false)
  const [lost, setLost] = useState(false)
  useEffect(() => {
    const container = host.current!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }) }
    catch { setFailed(true); return }
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-24, 24, 24, -24, .1, 180)
    const initial = new THREE.Vector3(31, 35, 43)
    const target = new THREE.Vector3(0, 5, 1)
    camera.position.copy(initial); camera.lookAt(target)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setClearColor(0x101624, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false; controls.minZoom = .65; controls.maxZoom = 1.85
    controls.minPolarAngle = .35; controls.maxPolarAngle = 1.2; controls.enableDamping = false
    controls.target.copy(target); controls.update()
    scene.add(new THREE.HemisphereLight(0xe0ebf2, 0x4b5942, 2.7))
    const light = new THREE.DirectionalLight(0xffebc9, 3.4)
    light.position.set(-20, 35, 20); light.castShadow = true; light.shadow.mapSize.set(1024, 1024)
    Object.assign(light.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, far: 110 })
    light.shadow.bias = -.001; scene.add(light)
    const disposeModel = buildCampusModel(scene)
    const grid = new THREE.GridHelper(160, 64, 0x35426e, 0x252f4b)
    grid.position.y = -1.3; (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = .26; scene.add(grid)
    const projector = new THREE.Vector3()
    function position(el: HTMLElement | null | undefined, xyz: readonly number[], w: number, h: number) {
      if (!el) return
      projector.set(xyz[0], xyz[1], xyz[2]).project(camera)
      el.style.left = `${(projector.x * .5 + .5) * w}px`; el.style.top = `${(-projector.y * .5 + .5) * h}px`
    }
    function render() {
      const w = container.clientWidth, h = container.clientHeight
      renderer.render(scene, camera)
      position(mascot.current, [15, .2, 13], w, h)
    }
    renderNow.current = render
    function resize() {
      const w = container.clientWidth, h = container.clientHeight
      const span = w < 700 ? 26 : 27
      camera.left = -span * w / h; camera.right = span * w / h; camera.top = span; camera.bottom = -span
      camera.updateProjectionMatrix(); renderer.setSize(w, h, false); render()
    }
    action.current = value => {
      if (value === 'reset') { camera.position.copy(initial); camera.zoom = 1; controls.target.copy(target) }
      else if (value === 'in' || value === 'out') camera.zoom = THREE.MathUtils.clamp(camera.zoom * (value === 'in' ? 1.18 : 1 / 1.18), .65, 1.85)
      else { camera.position.sub(target).applyAxisAngle(new THREE.Vector3(0, 1, 0), value === 'left' ? -.25 : .25).add(target) }
      camera.updateProjectionMatrix(); controls.update(); render()
    }
    function contextLost(event: Event) { event.preventDefault(); setLost(true) }
    function restored() { setLost(false); render() }
    renderer.domElement.addEventListener('webglcontextlost', contextLost); renderer.domElement.addEventListener('webglcontextrestored', restored)
    controls.addEventListener('change', render)
    const observer = new ResizeObserver(resize); observer.observe(container); resize()
    return () => {
      observer.disconnect(); controls.dispose(); action.current = () => {}; renderNow.current = () => {}
      renderer.domElement.removeEventListener('webglcontextlost', contextLost); renderer.domElement.removeEventListener('webglcontextrestored', restored)
      disposeModel(); grid.geometry.dispose(); (grid.material as THREE.Material).dispose()
      light.shadow.map?.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [])
  useEffect(() => { renderNow.current() }, [onHello, failed, lost])
  return <div className="campus-scene" role="region" aria-label="Mô hình kiến trúc minh hoạ, có thể xoay và thu phóng">
    <div className="scene-canvas" ref={host} />
    {failed || lost ? <div className="scene-fallback"><Boba size={110} /><p>{lost ? 'Cảnh 3D đang tạm dừng.' : 'Thiết bị này chưa mở được cảnh 3D.'}<br />Bạn vẫn tìm và chọn địa điểm bình thường.</p></div> : <div className="scene-markers">
      {onHello && <button ref={mascot} className="map-boba" onClick={onHello} aria-label="Chào Boba"><span className="boba-label">Boba</span><Boba size={80} /><span className="boba-ground" /></button>}
    </div>}
    <div className="map-tools" aria-label="Điều khiển mô hình">
      <button aria-label="Đặt lại góc nhìn" title="Đặt lại góc nhìn" onClick={() => action.current('reset')}><RotateCcw size={20} /></button>
      <div><button aria-label="Phóng to mô hình" onClick={() => action.current('in')}><Plus size={21} /></button><button aria-label="Thu nhỏ mô hình" onClick={() => action.current('out')}><Minus size={21} /></button></div>
      <button aria-label="Xoay mô hình sang trái" title="Xoay sang trái" onClick={() => action.current('left')}>↶</button><button aria-label="Xoay mô hình sang phải" title="Xoay sang phải" onClick={() => action.current('right')}>↷</button>
    </div>
  </div>
}
