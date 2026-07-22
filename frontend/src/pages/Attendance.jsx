import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { attendanceLog } from '../data/dummyData'

export default function Attendance() {
  return (
    <GlassCard hover={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Check In</th>
              <th className="px-5 py-3 font-medium">Check Out</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Method</th>
            </tr>
          </thead>
          <tbody>
            {attendanceLog.map((row) => (
              <tr key={row.date} className="border-t border-slate-100">
                <td className="px-5 py-3 text-ink2">{row.date}</td>
                <td className="px-5 py-3 text-slate-500">{row.checkIn}</td>
                <td className="px-5 py-3 text-slate-500">{row.checkOut}</td>
                <td className="px-5 py-3">
                  <Badge tone={row.status === 'Present' ? 'success' : 'danger'}>{row.status}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-500">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
