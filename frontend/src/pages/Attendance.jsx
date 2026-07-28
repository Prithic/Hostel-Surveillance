import { useState } from 'react'
import { CalendarCheck, Calculator, Download } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { exportToCSV } from '../utils/exportCSV'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

export default function Attendance() {
  const { data, loading, error, patchItem } = useHostel()
  const { isAdminRole } = useRoleCheck()
  const [busyId, setBusyId] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const students = data.attendanceRoster || []
  const attendanceLog = data.attendanceLog || []

  const totalCount = students.length
  const presentCount = students.filter((s) => s.status === 'Present' || s.status === 'Late Entry').length
  const absentCount = students.filter((s) => s.status === 'Absent').length
  const leaveCount = students.filter((s) => s.status === 'Leave').length
  const calculatedPercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : '0.0'

  async function toggleStatus(id, newStatus) {
    if (!isAdminRole) return
    setBusyId(id)
    try {
      const time =
        newStatus === 'Present' || newStatus === 'Late Entry'
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '-'
      await patchItem('attendanceRoster', id, { status: newStatus, time })
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard hover={false} className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white">Daily Attendance Calculator & Analytics</h2>
              <p className="text-xs text-white/50">Live roster persisted in Guardian store.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToCSV('trinity_attendance_report', students)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5 text-primary" /> Export CSV Report
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-medium text-white/45">Overall Attendance</p>
            <p className="text-xl font-extrabold text-emerald-400">{calculatedPercentage}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-medium text-white/45">Present Students</p>
            <p className="text-xl font-bold text-white">{presentCount} / {totalCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-medium text-white/45">Absent Count</p>
            <p className="text-xl font-bold text-rose-400">{absentCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-medium text-white/45">Approved Leave</p>
            <p className="text-xl font-bold text-amber-300">{leaveCount}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-white">Block Roll Call</h3>
          </div>
          <span className="text-[11px] text-white/40">
            {isAdminRole ? 'Toggles save to the database.' : 'Read-only for student accounts.'}
          </span>
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
                {isAdminRole && <th className="px-4 py-3 text-right font-semibold">Warden Toggle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {students.map((row) => (
                <tr key={row.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-white/60">{row.regNo}</td>
                  <td className="px-4 py-3 text-white/70">
                    {row.dept} ({row.block})
                  </td>
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
                        {['Present', 'Absent', 'Leave'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => toggleStatus(row.id, status)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition ${
                              row.status === status
                                ? status === 'Present'
                                  ? 'bg-emerald-500 text-white'
                                  : status === 'Absent'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-amber-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/15'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="space-y-4 p-5">
        <h3 className="font-display text-sm font-semibold text-white">Personal Attendance History</h3>
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
