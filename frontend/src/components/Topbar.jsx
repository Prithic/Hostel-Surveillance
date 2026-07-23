import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, CheckCircle2, Shirt, Megaphone, MessageSquareWarning, Search, Settings, LogOut, ChevronDown, FileClock } from 'lucide-react'
import { currentUser } from '../data/dummyData'

import NotificationCenterModal from './NotificationCenterModal'

const alerts = [
  { icon: CheckCircle2, tone: 'text-success', text: 'Leave request approved', time: '2h ago' },
  { icon: Shirt, tone: 'text-primary', text: 'Laundry is ready for pickup', time: '5h ago' },
  { icon: MessageSquareWarning, tone: 'text-warning', text: 'Complaint CMP-098 resolved', time: '1d ago' },
  { icon: Megaphone, tone: 'text-danger', text: 'New notice: Water shutdown tomorrow', time: '1d ago' },
]

export default function Topbar({ onToggleSidebar, title }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const initials = currentUser.name.split(' ').map((n) => n[0]).join('')

  return (
    <header className="sticky top-3 z-30 mx-3 mt-3 md:mx-4">
      <div className="liquid-glass flex items-center justify-between gap-3 rounded-3xl px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onToggleSidebar} className="rounded-2xl p-2 text-white/55 transition hover:bg-white/10 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-base font-semibold text-white md:text-lg">{title}</h1>
            <p className="hidden text-xs text-white/45 sm:block">Welcome back, {currentUser.name.split(' ')[0]} · Room {currentUser.room}</p>
          </div>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="hidden flex-1 max-w-xs items-center justify-between gap-2 rounded-2xl liquid-input px-3.5 py-2 text-left lg:flex transition hover:bg-white/15"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm text-white/50">Search students, complaints, rooms...</span>
          </div>
          <kbd className="shrink-0 rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70">
            Ctrl K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          {/* Prominent Outpass Quick Button */}
          <button
            onClick={() => navigate('/leave')}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-liquid transition hover:opacity-95 shrink-0"
          >
            <FileClock className="h-4 w-4 animate-pulse text-amber-300" />
            {['Admin', 'Super Admin', 'Chief Warden', 'Warden'].includes(currentUser?.role) ? 'Warden Outpass Desk' : 'Request Outpass'}
          </button>
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(true); setProfileOpen(false) }}
              className="relative rounded-2xl p-2.5 text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger shadow-[0_0_0_2px_rgba(255,255,255,0.9)] animate-pulse" />
            </button>
            <NotificationCenterModal open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          <div className="relative">
            <button
              onClick={() => { setProfileOpen((v) => !v); setOpen(false) }}
              className="flex items-center gap-1.5 rounded-2xl py-1 pl-1 pr-2 transition hover:bg-white/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full liquid-tint-primary text-xs font-semibold text-white shadow-liquid">
                {initials}
              </div>
              <ChevronDown className={`hidden h-3.5 w-3.5 text-white/45 transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="liquid-glass absolute right-0 mt-2 w-56 rounded-3xl p-2"
                >
                  <div className="border-b border-white/10 px-3 py-2.5">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-white/45">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings') }}
                    className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <Settings className="h-4 w-4" strokeWidth={1.75} /> Profile & settings
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/') }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/55 transition hover:bg-danger/10 hover:text-danger"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
