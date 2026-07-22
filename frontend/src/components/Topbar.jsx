import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Bell, CheckCircle2, Shirt, Megaphone, MessageSquareWarning } from 'lucide-react'
import { currentUser } from '../data/dummyData'

const alerts = [
  { icon: CheckCircle2, tone: 'text-success', text: 'Leave request approved', time: '2h ago' },
  { icon: Shirt, tone: 'text-primary', text: 'Laundry is ready for pickup', time: '5h ago' },
  { icon: MessageSquareWarning, tone: 'text-warning', text: 'Complaint CMP-098 resolved', time: '1d ago' },
  { icon: Megaphone, tone: 'text-danger', text: 'New notice: Water shutdown tomorrow', time: '1d ago' },
]

export default function Topbar({ onToggleSidebar, title }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-base font-semibold text-ink2 md:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setOpen((v) => !v)} className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-glass"
              >
                <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Recent alerts</p>
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                    <a.icon className={`mt-0.5 h-4 w-4 ${a.tone}`} />
                    <div>
                      <p className="text-sm text-ink2">{a.text}</p>
                      <p className="text-xs text-slate-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {currentUser.name.split(' ').map((n) => n[0]).join('')}
        </div>
      </div>
    </header>
  )
}
