import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone, Wallet,
  MessageSquareWarning, Utensils, Shirt, Search, UserCheck, Siren,
  ClipboardList, Boxes, BarChart3, Bot, Settings, LogOut, Building2,
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
  { to: '/chatbot', label: 'AI Chatbot', icon: Bot },
  { to: '/security', label: 'Security', icon: Siren },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onNavigate }) {
  const navigate = useNavigate()
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 256 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="hidden md:block h-screen sticky top-0 overflow-hidden border-r border-slate-200 bg-white"
    >
      <div className="flex h-full w-64 flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold text-ink2">NestOS</span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink2'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
