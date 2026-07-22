import { motion } from 'framer-motion'

// Reusable frosted-glass panel with a subtle lift-on-hover.
export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(37,99,235,0.12)' } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
