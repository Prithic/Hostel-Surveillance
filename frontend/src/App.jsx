import { Routes, Route } from 'react-router-dom'
import {
  FileClock, Megaphone, Wallet, Utensils, Shirt, Search, UserCheck,
  ClipboardList, Boxes, Settings as SettingsIcon,
} from 'lucide-react'

import Landing from './pages/Landing'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import RoomDetails from './pages/RoomDetails'
import Attendance from './pages/Attendance'
import Complaints from './pages/Complaints'
import Analytics from './pages/Analytics'
import SOS from './pages/SOS'
import SecurityDashboard from './pages/SecurityDashboard'
import Chatbot from './pages/Chatbot'
import NotFound from './pages/NotFound'
import PagePlaceholder from './components/PagePlaceholder'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room-details" element={<RoomDetails />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/security" element={<SecurityDashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />

        {/* Scaffolded routes — wire these up to dummy data the same way
            RoomDetails/Attendance/Complaints were built, or connect the
            real backend once it's ready. */}
        <Route path="/leave" element={<PagePlaceholder icon={FileClock} title="Leave Management" description="Apply for leave and track approval status here." />} />
        <Route path="/notices" element={<PagePlaceholder icon={Megaphone} title="Hostel Notices" description="Holiday, maintenance and exam notices will appear here." />} />
        <Route path="/fees" element={<PagePlaceholder icon={Wallet} title="Fee Status" description="Payment history and due amounts will appear here." />} />
        <Route path="/mess" element={<PagePlaceholder icon={Utensils} title="Mess Management" description="Daily and weekly menu, timings and food feedback." />} />
        <Route path="/laundry" element={<PagePlaceholder icon={Shirt} title="Laundry Management" description="Book a slot and track your clothes in real time." />} />
        <Route path="/lost-found" element={<PagePlaceholder icon={Search} title="Lost & Found" description="Search and report lost or found items on campus." />} />
        <Route path="/visitors" element={<PagePlaceholder icon={UserCheck} title="Visitor Management" description="Register visitors and view entry/exit history." />} />
        <Route path="/inspection" element={<PagePlaceholder icon={ClipboardList} title="Room Inspection" description="Upcoming inspections and past results." />} />
        <Route path="/inventory" element={<PagePlaceholder icon={Boxes} title="Inventory" description="Room furniture and equipment condition tracking." />} />
        <Route path="/settings" element={<PagePlaceholder icon={SettingsIcon} title="Settings" description="Account, notification and privacy preferences." />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
