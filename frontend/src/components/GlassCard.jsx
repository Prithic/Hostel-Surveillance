import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Reusable liquid-transparent panel — no blur, no frosted tint, just a
// faint colour wash over the dark backdrop so it shows straight through,
// with a gentle cursor-tracked tilt and a light "shine" sweep on hover.
export default function GlassCard({ children, className = '', hover = true, ...props }) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })

  function handleMouseMove(e) {
    if (!hover || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 4)
    rotateX.set(py * -4)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={hover ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      whileHover={hover ? { y: -4, boxShadow: '0 28px 60px -20px rgba(0,0,0,0.6)' } : {}}
      whileTap={hover ? { scale: 0.99 } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`liquid-glass card-shine relative overflow-hidden rounded-3xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
