import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone, Wallet,
  MessageSquareWarning, Utensils, Shirt, Search, UserCheck, Siren,
  ClipboardList, Boxes, BarChart3, Settings, LogOut, Building2, ShieldCheck,
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

export default function Sidebar({ open }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useRoleCheck()
  const nav = navForRole(role)

  async function handleLogout() {
    await logoutWarden()
    navigate('/login')
  }

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
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/45">{role || 'Session'}</span>
            </div>
          </div>
        </div>

        <nav className="liquid-glass relative flex-1 space-y-0.5 overflow-y-auto rounded-3xl px-2.5 py-3">
          {nav.map(({ to, label }) => {
            const Icon = ICONS[to] || LayoutDashboard
            const active = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
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

        <div className="liquid-glass relative overflow-hidden rounded-3xl p-2.5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-white/55 transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
