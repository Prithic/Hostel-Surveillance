import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileDrawer from './MobileDrawer'
import LiquidBackdrop from './LiquidBackdrop'
import CommandPaletteModal from './CommandPaletteModal'
import FloatingAIAssistant from './FloatingAIAssistant'
import AdminFloatingBar from './AdminFloatingBar'

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
  '/analytics': 'Analytics',
  '/security': 'Security Dashboard',
  '/settings': 'Settings',
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] || 'Trinity Engine'

  useEffect(() => {
    function handleOpenPalette() {
      setCommandPaletteOpen(true)
    }
    window.addEventListener('open-command-palette', handleOpenPalette)
    return () => window.removeEventListener('open-command-palette', handleOpenPalette)
  }, [])

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
          <Topbar onToggleSidebar={handleToggle} title={title} />
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

      <CommandPaletteModal open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <FloatingAIAssistant />
      <AdminFloatingBar />
    </LiquidBackdrop>
  )
}

