import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone, Wallet,
  MessageSquareWarning, Utensils, Shirt, Search, UserCheck, Siren,
  ClipboardList, Boxes, BarChart3, Settings, LogOut, Building2, ShieldCheck,
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
  { to: '/security', label: 'Security (GuardianAI)', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 272 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="hidden md:block h-screen sticky top-0 shrink-0 overflow-hidden"
    >
      <div className="flex h-full w-[272px] flex-col gap-3 p-3">
        <div className="liquid-glass relative overflow-hidden rounded-3xl px-4 py-4">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.06 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl liquid-tint-primary text-white shadow-liquid"
            >
              <Building2 className="h-4 w-4" />
            </motion.div>
            <div>
              <span className="font-display block text-base font-extrabold leading-none tracking-tight text-white">Trinity Engine</span>
              <span className="text-[10px] font-medium text-white/45 uppercase tracking-wider">Smart Hostel OS</span>
            </div>
          </div>
        </div>

        <nav className="liquid-glass relative flex-1 space-y-0.5 overflow-y-auto rounded-3xl px-2.5 py-3">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className="group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors duration-200"
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-blob"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-2xl liquid-tint-primary shadow-liquid"
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 transition-colors ${active ? 'text-white' : 'text-white/55 group-hover:text-white'}`}
                  strokeWidth={1.75}
                />
                <span className={`relative z-10 transition-colors ${active ? 'font-medium text-white' : 'text-white/55 group-hover:text-white'}`}>
                  {label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className="liquid-glass relative space-y-0.5 overflow-hidden rounded-3xl p-2.5">
          <button
            onClick={() => navigate('/admin-login')}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-xs text-white/45 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Admin access
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('nestos_user')
              localStorage.removeItem('nestos_jwt_token')
              navigate('/')
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/55 transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
