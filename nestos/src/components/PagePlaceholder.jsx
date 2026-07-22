import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

// Consistent "coming soon" surface for pages scaffolded in routing but not
// yet fully designed. Keeps every sidebar link functional out of the box.
export default function PagePlaceholder({ icon: Icon, title, description }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <GlassCard className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        <p className="max-w-sm text-sm text-white/55">{description}</p>
      </GlassCard>
    </motion.div>
  )
}

