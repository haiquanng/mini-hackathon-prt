import { createContext, useContext, useEffect, useState, type CSSProperties } from 'react'

export const MotionContext = createContext({ paused: false, toggle: () => {} })
export type BobaMood = 'idle' | 'right' | 'left' | 'wave' | 'jump' | 'wait'
const animations: Record<BobaMood, { row: number; durations: number[] }> = {
  idle: { row: 0, durations: [280, 110, 110, 140, 140, 320] },
  right: { row: 1, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  left: { row: 2, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  wave: { row: 3, durations: [140, 140, 140, 280] },
  jump: { row: 4, durations: [140, 140, 140, 140, 280] },
  wait: { row: 6, durations: [150, 150, 150, 150, 150, 260] },
}

/** The original v2 sprite is 8 × 11 cells, each 192 × 208 pixels. */
export function Boba({ mood = 'idle', size = 96, className = '' }: { mood?: BobaMood; size?: number; className?: string }) {
  const { paused } = useContext(MotionContext)
  const [frame, setFrame] = useState(0)
  const { row, durations } = animations[mood]
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setTimeout> | undefined
    let current = 0
    function restart() {
      clearTimeout(timer)
      current = 0
      setFrame(0)
      if (paused || reduced.matches || document.hidden) return
      function tick() {
        timer = setTimeout(() => { current = (current + 1) % durations.length; setFrame(current); tick() }, durations[current])
      }
      tick()
    }
    restart()
    reduced.addEventListener('change', restart)
    document.addEventListener('visibilitychange', restart)
    return () => { clearTimeout(timer); reduced.removeEventListener('change', restart); document.removeEventListener('visibilitychange', restart) }
  }, [durations, paused])
  const height = size * 208 / 192
  return <span aria-hidden="true" data-mood={mood} className={`boba-sprite ${className}`} style={{ width: size, height, backgroundSize: `${size * 8}px ${height * 11}px`, backgroundPosition: `${-Math.min(frame, durations.length - 1) * size}px ${-row * height}px` } as CSSProperties} />
}
