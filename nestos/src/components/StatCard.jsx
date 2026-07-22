import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

const toneMap = {
  primary: { icon: 'bg-primary/12 text-primary', ring: 'shadow-[0_0_0_1px_rgba(37,99,235,0.15)]' },
  success: { icon: 'bg-success/12 text-success', ring: 'shadow-[0_0_0_1px_rgba(34,197,94,0.15)]' },
  warning: { icon: 'bg-warning/12 text-warning', ring: 'shadow-[0_0_0_1px_rgba(245,158,11,0.15)]' },
  danger: { icon: 'bg-danger/12 text-danger', ring: 'shadow-[0_0_0_1px_rgba(239,68,68,0.15)]' },
}

export default function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  const t = toneMap[tone] || toneMap.primary
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${t.icon} ${t.ring}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white/55">{label}</p>
          <p className="font-display text-xl font-semibold tracking-tight text-white">{value}</p>
        </div>
      </div>
    </GlassCard>
  )
}
