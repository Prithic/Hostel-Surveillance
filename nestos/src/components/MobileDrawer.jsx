import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone, Wallet,
  MessageSquareWarning, Utensils, Shirt, Search, UserCheck, Siren,
  ClipboardList, Boxes, BarChart3, Settings, LogOut, Building2, X,
} from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/room-details', label: 'Room Details', icon: DoorOpen },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/leave', label: 'Leave', icon: FileClock },
  { to: '/notices', label: 'Hostel Notices', icon: Megaphone },
  { to: '/fees', label: 'Fee Status', icon: Wallet },
  { to: '/complaints', label: 'Complaint Portal', icon: MessageSquareWarning },
  { to: '/mess', label: 'Mess Management', icon: Utensils },
  { to: '/laundry', label: 'Laundry', icon: Shirt },
  { to: '/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/visitors', label: 'Visitor Management', icon: UserCheck },
  { to: '/sos', label: 'Emergency SOS', icon: Siren },
  { to: '/inspection', label: 'Room Inspection', icon: ClipboardList },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

// Slide-in liquid glass drawer for small screens — mirrors the desktop
// Sidebar but overlays the content with a blurred scrim behind it.
export default function MobileDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/50 md:hidden"
          />
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed left-3 top-3 bottom-3 z-50 w-[82vw] max-w-[280px] md:hidden"
          >
            <div className="liquid-glass flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl liquid-tint-primary text-white">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="font-display text-base font-extrabold text-white">Trinity Engine</span>
                </div>
                <button onClick={onClose} className="rounded-full p-1.5 text-white/55 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-0.5 overflow-y-auto px-1 py-2">
                {nav.map(({ to, label, icon: Icon }) => {
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
                onClick={() => {
                  onClose()
                  localStorage.removeItem('nestos_user')
                  localStorage.removeItem('nestos_jwt_token')
                  navigate('/')
                }}
                className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-white/55 hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
