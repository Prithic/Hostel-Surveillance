import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import GlassCard from '../components/GlassCard'
import { analytics } from '../data/dummyData'

function ChartCard({ title, children }) {
  return (
    <GlassCard hover={false} className="p-5">
      <h2 className="mb-4 font-display text-sm font-semibold text-white">{title}</h2>
      <div className="h-56"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </GlassCard>
  )
}

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Attendance trend">
        <LineChart data={analytics.attendance}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Complaint trends">
        <BarChart data={analytics.complaintsTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Mess ratings (weekly)">
        <LineChart data={analytics.messRatings}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Line type="monotone" dataKey="rating" stroke="#22C55E" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Laundry usage (weekly bookings)">
        <BarChart data={[{d:'Mon',v:22},{d:'Tue',v:18},{d:'Wed',v:26},{d:'Thu',v:20},{d:'Fri',v:30},{d:'Sat',v:34},{d:'Sun',v:16}]}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="d" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} /><Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="v" fill="#2563EB" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  )
}

