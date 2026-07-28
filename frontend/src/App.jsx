import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from './pages/Landing'
import WardenLogin from './pages/WardenLogin'
import DashboardLayout from './components/DashboardLayout'
import RequireWarden from './components/RequireWarden'
import RequireRole from './components/RequireRole'
import Dashboard from './pages/Dashboard'
import RoomDetails from './pages/RoomDetails'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Notices from './pages/Notices'
import FeeStatus from './pages/FeeStatus'
import Complaints from './pages/Complaints'
import Mess from './pages/Mess'
import Laundry from './pages/Laundry'
import LostFound from './pages/LostFound'
import Visitors from './pages/Visitors'
import SOS from './pages/SOS'
import Inspection from './pages/Inspection'
import Inventory from './pages/Inventory'
import SecurityDashboard from './pages/SecurityDashboard'
import Analytics from './pages/Analytics'
import ConfigPage from './pages/Config'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<WardenLogin />} />
      <Route path="/admin" element={<Navigate to="/login" replace />} />
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />

      <Route
        element={
          <RequireWarden>
            <RequireRole>
              <DashboardLayout />
            </RequireRole>
          </RequireWarden>
        }
      >
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
        <Route path="/security" element={<SecurityDashboard />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
