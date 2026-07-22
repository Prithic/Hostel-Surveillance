import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileDrawer from './MobileDrawer'
import LiquidBackdrop from './LiquidBackdrop'

const titles = {
  '/dashboard': 'Dashboard',
  '/room-details': 'Room Details',
  '/attendance': 'Attendance',
  '/leave': 'Leave Management',
  '/notices': 'Hostel Notices',
  '/fees': 'Fee Status',
  '/complaints': 'Complaint Portal',
  '/mess': 'Mess Management',
  '/laundry': 'Laundry Management',
  '/lost-found': 'Lost & Found',
  '/visitors': 'Visitor Management',
  '/sos': 'Emergency SOS',
  '/inspection': 'Room Inspection',
  '/inventory': 'Inventory',
  '/analytics': 'AI Analytics',
  '/chatbot': 'AI Assistant',
  '/security': 'Security Dashboard',
  '/settings': 'Settings',
}

// Pages that are fully backed by live AI pipeline data
const LIVE_ROUTES = new Set(['/security', '/analytics', '/chatbot'])

export default function DashboardLayout() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] || 'GuardianAI'
  const isLive = LIVE_ROUTES.has(location.pathname)

  function handleToggle() {
    setOpen((v) => !v)
    setMobileOpen((v) => !v)
  }

  return (
    <LiquidBackdrop>
      <div className="flex min-h-screen">
        <Sidebar open={open} />
        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar onToggleSidebar={handleToggle} title={title} isLive={isLive} />
          <main className="p-4 pt-5 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </LiquidBackdrop>
  )
}
