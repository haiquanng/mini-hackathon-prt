import * as THREE from 'three'

/** Architectural illustration from the user's exterior photos; dimensions and layout are artistic, not surveyed. */
export function buildCampusModel(scene: THREE.Scene) {
  const root = new THREE.Group()
  root.name = 'VinUni-inspired exterior miniature'
  scene.add(root)
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  const geometries = new Set<THREE.BufferGeometry>()
  function material(color: string) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .82 }))
    return materials.get(color)!
  }
  function geometry<T extends THREE.BufferGeometry>(value: T) { geometries.add(value); return value }
  const cube = geometry(new THREE.BoxGeometry(1, 1, 1))
  const column = geometry(new THREE.CylinderGeometry(1, 1, 1, 10))
  function mesh(g: THREE.BufferGeometry, color: string, x: number, y: number, z: number, parent: THREE.Object3D = root) {
    const object = new THREE.Mesh(g, material(color))
    object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object
  }
  function box(w: number, h: number, d: number, x: number, y: number, z: number, color: string, parent: THREE.Object3D = root) {
    const object = mesh(cube, color, x, y, z, parent); object.scale.set(w, h, d); return object
  }
  function cylinder(r: number, h: number, x: number, y: number, z: number, color: string, parent: THREE.Object3D = root) {
    const object = mesh(column, color, x, y, z, parent); object.scale.set(r, h, r); return object
  }
  const stone = '#e3ddce', trim = '#f2ecdf', glass = '#486167', roof = '#a8b3a4'
  box(50, .9, 46, 0, -.8, 2, '#243e3b')
  box(49.8, .15, 45.8, 0, -.28, 2, '#5c7a55')
  box(47, .06, 1.5, 0, -.15, -18, '#adbaa1')
  box(1.3, .06, 40, -21, -.15, 2, '#adbaa1')
  box(1.3, .06, 40, 21, -.15, 2, '#adbaa1')
  // Central promenade, lawn courts and geometric plaza echo the exterior reference.
  box(18, .12, 19, 0, -.05, 13, '#c3c4ad')
  box(4, .1, 32, 0, -.04, 6, '#d4cebb')
  for (let x = -7; x <= 7; x += 2) for (let z = 8; z <= 16; z += 2) {
    const tile = box(.58, .04, .58, x, .04, z, '#9ea78e'); tile.rotation.y = Math.PI / 4
  }
  box(15, .06, 1.3, -13, -.1, 5.5, '#d0c7af')
  box(14, .06, 1.3, 14, -.1, 5.5, '#d0c7af')
  box(50, .08, 2, 0, -.15, 24, '#496f79')

  // Shared classical facade, with a cornice and tall window rhythm on every side.
  function block(w: number, d: number, h: number, x: number, y: number, z: number, parent: THREE.Object3D) {
    box(w, h, d, x, y + h / 2, z, stone, parent)
    box(w + .38, .24, d + .38, x, y + h + .1, z, trim, parent)
    box(w - .3, .12, d - .3, x, y + h + .28, z, roof, parent)
    for (let fy = y + .85; fy < y + h - .3; fy += 1.25) {
      for (let fx = -w / 2 + .7; fx < w / 2 - .2; fx += 1.1) {
        box(.42, .82, .045, x + fx, fy, z + d / 2 + .03, glass, parent)
        box(.42, .82, .045, x + fx, fy, z - d / 2 - .03, glass, parent)
      }
      for (let fz = -d / 2 + .7; fz < d / 2 - .2; fz += 1.1) {
        box(.045, .82, .42, x + w / 2 + .03, fy, z + fz, glass, parent)
        box(.045, .82, .42, x - w / 2 - .03, fy, z + fz, glass, parent)
      }
    }
    // Light pilasters break up the long elevations.
    for (let fx = -w / 2 + .15; fx <= w / 2; fx += Math.max(2.2, w / 4)) {
      box(.17, h, .2, x + fx, y + h / 2, z + d / 2 + .08, trim, parent)
    }
  }
  const landmark = new THREE.Group(); landmark.name = 'Central stepped tower'; landmark.position.set(0, 0, -5); root.add(landmark)
  box(17, .4, 12, 0, -.02, 0, '#c9c4b1', landmark)
  block(15, 8, 4.6, 0, .1, 0, landmark)
  block(4.1, 8, 3.6, -6.2, .1, 5.2, landmark)
  block(4.1, 8, 3.6, 6.2, .1, 5.2, landmark)
  box(6.2, .2, 5.2, 0, .3, 5, '#697e60', landmark)
  // Three terraces, then the tall square lantern of the real silhouette.
  block(10.7, 6.2, 2.5, 0, 4.9, -.5, landmark)
  block(7, 4.8, 2.4, 0, 7.7, -.8, landmark)
  block(4.8, 3.9, 1.9, 0, 10.4, -1, landmark)
  box(4, 3.7, 3.4, 0, 14.2, -1, stone, landmark)
  box(4.6, .24, 4, 0, 12.4, -1, trim, landmark)
  box(4.6, .24, 4, 0, 16.15, -1, trim, landmark)
  function arch(w: number, h: number) {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, h - w / 2)
    shape.absarc(0, h - w / 2, w / 2, 0, Math.PI, false); shape.closePath()
    return geometry(new THREE.ExtrudeGeometry(shape, { depth: .035, bevelEnabled: false, curveSegments: 10 }))
  }
  const tallArch = arch(.83, 2.75)
  for (const x of [-.95, .95]) {
    mesh(tallArch, glass, x, 12.8, .73, landmark)
    const rear = mesh(tallArch, glass, x, 12.8, -2.73, landmark); rear.rotation.y = Math.PI
  }
  for (const z of [-1.85, -.15]) {
    const side = mesh(tallArch, glass, 2.03, 12.8, z, landmark); side.rotation.y = Math.PI / 2
    const other = mesh(tallArch, glass, -2.03, 12.8, z, landmark); other.rotation.y = -Math.PI / 2
  }
  for (const x of [-1.8, 1.8]) for (const z of [-2.5, .5]) {
    box(.23, 3.6, .23, x, 14.3, z, trim, landmark)
  }
  cylinder(1.15, .3, 0, 16.45, -1, trim, landmark)
  cylinder(.88, 2.1, 0, 17.6, -1, stone, landmark)
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4
    cylinder(.075, 2.1, Math.cos(angle) * .91, 17.6, -1 + Math.sin(angle) * .91, trim, landmark)
  }
  const spireProfile = [[1.1,0],[1.1,.18],[.75,.3],[.65,.6],[.42,.9],[.29,1.5],[.23,4.3],[.17,5.7],[.07,6.2]].map(([x,y])=>new THREE.Vector2(x,y))
  mesh(geometry(new THREE.LatheGeometry(spireProfile, 16)), '#e9e4d5', 0, 18.8, -1, landmark)
  cylinder(.14, .6, 0, 25.25, -1, '#bd954b', landmark)
  const finial = mesh(geometry(new THREE.OctahedronGeometry(.36)), '#d0ab53', 0, 25.75, -1, landmark); finial.scale.set(.7, 1.6, .7)
  // Corner parapets and tiny rooftop gardens, visible on the reference terraces.
  for (const x of [-6.2, 6.2]) for (const z of [-3.2, 7.8]) {
    box(1.2, .5, .75, x, 4.15, z, trim, landmark)
    box(.8, .35, .5, x, 4.57, z, trim, landmark)
  }
  for (const x of [-4.1, 4.1]) box(1, .18, 4.8, x, 5, -.5, '#71895b', landmark)
  for (let i = 0; i < 5; i++) box(5.8, .12, 1.2 + i * .34, 0, .44 - i * .085, 8.3 + i * .17, '#dfdac9', landmark)

  // White barrel-vault auditorium to one side of the central building.
  const auditorium = new THREE.Group(); auditorium.position.set(-15, 0, -6); root.add(auditorium)
  block(8, 11, 3.2, 0, 0, 0, auditorium)
  const vault = new THREE.Shape(); vault.moveTo(-4.3, 0); vault.quadraticCurveTo(-4.3, 3.8, 0, 4); vault.quadraticCurveTo(4.3, 3.8, 4.3, 0); vault.closePath()
  mesh(geometry(new THREE.ExtrudeGeometry(vault, { depth: 11.3, bevelEnabled: false, curveSegments: 22 })), '#cbd3cf', 0, 3.35, -5.65, auditorium)
  for (let x = -3.4; x <= 3.5; x += 1.14) {
    cylinder(.14, 2.8, x, 1.5, 5.95, trim, auditorium)
    box(.45, .2, .45, x, 2.95, 5.95, trim, auditorium)
  }
  box(8.4, .3, 1.2, 0, 3.1, 5.95, trim, auditorium)
  const east = new THREE.Group(); east.position.set(15, 0, -7); root.add(east)
  block(6.7, 10, 3.6, 0, 0, 0, east)
  block(6.4, 4.1, 2.5, 0, 0, 10, east)
  // A small lawn court and a path to the eastern annex.
  box(6, .06, 4, 15, -.1, 6, '#9eae7c')
  box(1.1, .08, 16, 10.5, -.08, 5, '#d1c7af')

  // Fountain and curved colonnade on the main square.
  cylinder(2.6, .25, 0, .05, 17, '#d6d3c1')
  cylinder(2.3, .12, 0, .24, 17, '#72abb4')
  cylinder(.6, .6, 0, .55, 17, trim)
  cylinder(1.1, .12, 0, .9, 17, '#b7c8bf')
  cylinder(.25, .8, 0, 1.3, 17, trim)
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI * i / 16
    const x = Math.cos(a) * 8.7, z = 17.5 + Math.sin(a) * 5.1
    if (Math.abs(x) < 2.1) continue
    cylinder(.15, 2.15, x, 1.05, z, trim)
    box(.47, .16, .47, x, 2.2, z, trim)
    const beam = box(1.8, .22, .55, x, 2.42, z, stone); beam.rotation.y = -a
  }
  const gate = new THREE.Group(); gate.position.set(0, 0, 22); root.add(gate)
  box(1.1, 3.8, 1.2, -2.1, 1.8, 0, trim, gate); box(1.1, 3.8, 1.2, 2.1, 1.8, 0, trim, gate)
  box(5.5, .65, 1.5, 0, 3.8, 0, trim, gate); box(5.9, .2, 1.7, 0, 4.22, 0, stone, gate)
  const ring = geometry(new THREE.TorusGeometry(1.6, .28, 6, 18, Math.PI))
  mesh(ring, trim, 0, 2.2, 0, gate)

  const crown = geometry(new THREE.IcosahedronGeometry(1, 1))
  function tree(x: number, z: number, size = 1) {
    cylinder(.095, 1.4 * size, x, .6 * size, z, '#7a7658')
    const foliage = mesh(crown, '#416b45', x, 1.65 * size, z); foliage.scale.set(.7 * size, 1.1 * size, .7 * size)
  }
  for (let z = -17; z <= 21; z += 3.2) { tree(-22.3,z,.8); tree(22.3,z,.8) }
  for (let x = -18; x <= 18; x += 3.3) tree(x,-18.5,.85)
  for (let z = 7; z <= 20; z += 2.3) { tree(-10.4,z,.72); tree(10.4,z,.72) }
  for (let i = 0; i < 12; i++) {
    const x = -17 + (i % 3) * 2.5, z = 9 + Math.floor(i / 3) * 3
    tree(x,z,.8); tree(-x,z,.8)
  }
  // Two open lawns, with a circular garden path.
  const gardenWalk = mesh(geometry(new THREE.TorusGeometry(3, .17, 5, 40)), '#c2bca4', -15, -.02, 15)
  gardenWalk.rotation.x = Math.PI / 2
  return () => { scene.remove(root); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()) }
}
