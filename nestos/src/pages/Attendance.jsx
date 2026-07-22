import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Calculator, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { exportToCSV } from '../utils/exportCSV'
import { attendanceLog } from '../data/dummyData'

const initialStudentsAttendance = [
  { id: 1, name: 'Sharan M', regNo: '7176211001', dept: 'AIML', block: 'B-214', status: 'Present', time: '08:15 AM' },
  { id: 2, name: 'Akash K', regNo: '7176211002', dept: 'CSE', block: 'A-201', status: 'Present', time: '08:22 AM' },
  { id: 3, name: 'Vignesh M', regNo: '7176211003', dept: 'AI&DS', block: 'B-102', status: 'Late Entry', time: '09:05 AM' },
  { id: 4, name: 'Sanjay R', regNo: '7176211004', dept: 'ECE', block: 'C-405', status: 'Absent', time: '-' },
  { id: 5, name: 'Hari Prasad', regNo: '7176211005', dept: 'IT', block: 'B-110', status: 'Present', time: '08:10 AM' },
  { id: 6, name: 'Meena S', regNo: '7176211006', dept: 'EEE', block: 'D-108', status: 'Present', time: '08:30 AM' },
  { id: 7, name: 'Priya Dharshini', regNo: '7176211007', dept: 'Mechanical', block: 'D-215', status: 'Leave', time: '-' },
  { id: 8, name: 'Nithya S', regNo: '7176211008', dept: 'AI&DS', block: 'D-112', status: 'Present', time: '08:18 AM' },
]

export default function Attendance() {
  const [userRole, setUserRole] = useState('')
  const [students, setStudents] = useState(initialStudentsAttendance)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nestos_user')
      if (stored) {
        const u = JSON.parse(stored)
        setUserRole(u.role || 'Student')
      }
    } catch (e) {
      setUserRole('Student')
    }
  }, [])

  const isAdminRole = ['Admin', 'Super Admin', 'Chief Warden', 'Warden'].includes(userRole)

  const totalCount = students.length
  const presentCount = students.filter((s) => s.status === 'Present' || s.status === 'Late Entry').length
  const absentCount = students.filter((s) => s.status === 'Absent').length
  const leaveCount = students.filter((s) => s.status === 'Leave').length

  const calculatedPercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : '0.0'

  function toggleStatus(id, newStatus) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, time: newStatus === 'Present' ? '08:30 AM' : '-' } : s))
    )
  }

  return (
    <div className="space-y-6">
      {/* Attendance Summary & Calculator Banner */}
      <GlassCard hover={false} className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white">Daily Attendance Calculator & Analytics</h2>
              <p className="text-xs text-white/50">Auto-calculated percentage based on present, absent, and leave counts.</p>
            </div>
          </div>

          <button
            onClick={() => exportToCSV('trinity_attendance_report', students)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5 text-primary" /> Export CSV Report
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/45 font-medium">Overall Attendance</p>
            <p className="text-xl font-extrabold text-emerald-400">{calculatedPercentage}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/45 font-medium">Present Students</p>
            <p className="text-xl font-bold text-white">{presentCount} / {totalCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/45 font-medium">Absent Count</p>
            <p className="text-xl font-bold text-rose-400">{absentCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] text-white/45 font-medium">Approved Leave</p>
            <p className="text-xl font-bold text-amber-300">{leaveCount}</p>
          </div>
        </div>
      </GlassCard>

      {/* Interactive Roll Call Table */}
      <GlassCard hover={false} className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-white">Interactive Block Roll Call & Attendance Correction</h3>
          </div>
          <span className="text-[11px] text-white/40">Click status buttons to adjust counts in real-time.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 uppercase tracking-wide text-white/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Register No</th>
                <th className="px-4 py-3 font-semibold">Dept & Room</th>
                <th className="px-4 py-3 font-semibold">Check In</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                {isAdminRole && <th className="px-4 py-3 font-semibold text-right">Warden Quick Toggle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {students.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-white/60">{row.regNo}</td>
                  <td className="px-4 py-3 text-white/70">{row.dept} ({row.block})</td>
                  <td className="px-4 py-3 font-mono text-white/50">{row.time}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row.status === 'Present'
                          ? 'success'
                          : row.status === 'Absent'
                          ? 'danger'
                          : row.status === 'Leave'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  {isAdminRole && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => toggleStatus(row.id, 'Present')}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition ${
                            row.status === 'Present' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/15'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => toggleStatus(row.id, 'Absent')}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition ${
                            row.status === 'Absent' ? 'bg-rose-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/15'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => toggleStatus(row.id, 'Leave')}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition ${
                            row.status === 'Leave' ? 'bg-amber-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/15'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Historical Personal Attendance Table */}
      <GlassCard hover={false} className="p-5 space-y-4">
        <h3 className="font-display text-sm font-semibold text-white">Your Personal Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 uppercase tracking-wide text-white/45">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Check In</th>
                <th className="px-4 py-3 font-medium">Check Out</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {attendanceLog.map((row) => (
                <tr key={row.date} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{row.date}</td>
                  <td className="px-4 py-3 text-white/55">{row.checkIn}</td>
                  <td className="px-4 py-3 text-white/55">{row.checkOut}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.status === 'Present' ? 'success' : 'danger'}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/55">{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
