import { motion } from 'framer-motion'
import { Megaphone, CalendarDays } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { notices, events } from '../data/dummyData'

const typeTone = {
  Holiday: 'success', Maintenance: 'warning', 'Water Shutdown': 'danger', 'Exam Notice': 'info',
}

export default function Notices() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Hostel notices</h2>
        </div>
        <div className="space-y-3">
          {notices.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{n.title}</p>
                <p className="text-xs text-white/45">{n.date}</p>
              </div>
              <Badge tone={typeTone[n.type] || 'neutral'}>{n.type}</Badge>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Upcoming events</h2>
        </div>
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="rounded-lg bg-white/5 px-4 py-3">
              <p className="text-sm font-medium text-white">{e.title}</p>
              <p className="text-xs text-white/45">{e.date}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
