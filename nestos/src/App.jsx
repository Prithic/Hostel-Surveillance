import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import DashboardLayout from './components/DashboardLayout'
import RequireAdmin from './components/RequireAdmin'
import Dashboard from './pages/Dashboard'
import RoomDetails from './pages/RoomDetails'
import Attendance from './pages/Attendance'
import Complaints from './pages/Complaints'
import Analytics from './pages/Analytics'
import SOS from './pages/SOS'
import SecurityDashboard from './pages/SecurityDashboard'
import Leave from './pages/Leave'
import Notices from './pages/Notices'
import FeeStatus from './pages/FeeStatus'
import Mess from './pages/Mess'
import Laundry from './pages/Laundry'
import LostFound from './pages/LostFound'
import Visitors from './pages/Visitors'
import Inspection from './pages/Inspection'
import Inventory from './pages/Inventory'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room-details" element={<RoomDetails />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/fees" element={<FeeStatus />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/mess" element={<Mess />} />
        <Route path="/laundry" element={<Laundry />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin-only — requires a separate sign-in at /admin-login */}
        <Route path="/security" element={<RequireAdmin><SecurityDashboard /></RequireAdmin>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
