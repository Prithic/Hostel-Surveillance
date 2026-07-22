import { useRef } from 'react'

// A dark aurora-mesh backdrop whose glow blobs drift toward the cursor.
// Pure CSS + one mousemove listener — no canvas, keeps it lightweight.
export default function AnimatedBackground({ children }) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * 100
    const my = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${mx}%`)
    el.style.setProperty('--my', `${my}%`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-ink"
    >
      <div className="aurora-bg" />
      <div className="grid-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
