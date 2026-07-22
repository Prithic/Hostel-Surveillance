import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { attendanceLog } from '../data/dummyData'

export default function Attendance() {
  return (
    <GlassCard hover={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/45">
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
              <tr key={row.date} className="border-t border-white/10">
                <td className="px-5 py-3 text-white">{row.date}</td>
                <td className="px-5 py-3 text-white/55">{row.checkIn}</td>
                <td className="px-5 py-3 text-white/55">{row.checkOut}</td>
                <td className="px-5 py-3">
                  <Badge tone={row.status === 'Present' ? 'success' : 'danger'}>{row.status}</Badge>
                </td>
                <td className="px-5 py-3 text-white/55">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

