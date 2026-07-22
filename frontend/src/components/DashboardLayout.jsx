import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

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
  '/chatbot': 'AI Chatbot',
  '/security': 'Security Dashboard',
  '/settings': 'Settings',
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const title = titles[location.pathname] || 'NestOS'

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={open} />
      <div className="flex-1 min-w-0">
        <Topbar onToggleSidebar={() => setOpen((v) => !v)} title={title} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
