import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone, Wallet,
  MessageSquareWarning, Utensils, Shirt, Search, UserCheck, Siren,
  ClipboardList, Boxes, BarChart3, Settings, LogOut, Building2, X, ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { logoutWarden } from '../auth'
import { useRoleCheck } from '../hooks/useRoleCheck'
import { navForRole } from '../navAccess'

const ICONS = {
  '/dashboard': LayoutDashboard,
  '/room-details': DoorOpen,
  '/attendance': CalendarCheck,
  '/leave': FileClock,
  '/notices': Megaphone,
  '/fees': Wallet,
  '/complaints': MessageSquareWarning,
  '/mess': Utensils,
  '/laundry': Shirt,
  '/lost-found': Search,
  '/visitors': UserCheck,
  '/sos': Siren,
  '/inspection': ClipboardList,
  '/inventory': Boxes,
  '/analytics': BarChart3,
  '/security': ShieldCheck,
  '/config': SlidersHorizontal,
  '/settings': Settings,
}

export default function MobileDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useRoleCheck()
  const nav = navForRole(role)

  async function handleLogout() {
    await logoutWarden()
    onClose()
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/50 md:hidden"
          />
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-3 left-3 top-3 z-50 w-[82vw] max-w-[280px] md:hidden"
          >
            <div className="liquid-glass flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl liquid-tint-primary text-white">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display block text-base font-extrabold text-white">Trinity Engine</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/45">{role || 'Session'}</span>
                  </div>
                </div>
                <button type="button" onClick={onClose} className="rounded-full p-1.5 text-white/55 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-0.5 overflow-y-auto px-1 py-2">
                {nav.map(({ to, label }) => {
                  const Icon = ICONS[to] || LayoutDashboard
                  const active = location.pathname === to
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                        active ? 'liquid-tint-primary font-medium text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      {label}
                    </NavLink>
                  )
                })}
              </nav>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/55 hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
