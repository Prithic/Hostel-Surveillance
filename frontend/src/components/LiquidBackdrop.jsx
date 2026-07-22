import { useRef } from 'react'

// Ambient, mouse-reactive aurora blobs for the dashboard shell — same dark
// ink backdrop as AnimatedBackground (used on Landing/Login), so every
// screen in the app shares one continuous background.
export default function LiquidBackdrop({ children }) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * 100
    const my = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--lmx', `${mx}%`)
    el.style.setProperty('--lmy', `${my}%`)
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="relative min-h-screen w-full bg-ink">
      <div className="liquid-bg-light">
        <div className="blob-amber" />
      </div>
      <div className="grid-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
