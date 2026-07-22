import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import {
  CalendarCheck, DoorOpen, MessageSquareWarning, Wallet, Utensils, Shirt,
  FileClock, Siren, Megaphone,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import {
  statSummary, notices, events, complaints, attendanceTrend,
} from '../data/dummyData'

const quickActions = [
  { label: 'Apply Leave', icon: FileClock, path: '/leave', tone: 'bg-primary' },
  { label: 'Raise Complaint', icon: MessageSquareWarning, path: '/complaints', tone: 'bg-warning' },
  { label: 'Book Laundry', icon: Shirt, path: '/laundry', tone: 'bg-primary' },
  { label: 'Emergency SOS', icon: Siren, path: '/sos', tone: 'bg-danger' },
  { label: 'View Menu', icon: Utensils, path: '/mess', tone: 'bg-success' },
]

const complaintTone = { Pending: 'warning', 'In Progress': 'info', Completed: 'success' }

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={CalendarCheck} label="Attendance" value={`${statSummary.attendance}%`} tone="success" />
        <StatCard icon={DoorOpen} label="Room Number" value={statSummary.room} tone="primary" />
        <StatCard icon={MessageSquareWarning} label="Pending Complaints" value={statSummary.pendingComplaints} tone="warning" />
        <StatCard icon={Wallet} label="Fee Status" value={statSummary.feeStatus} tone="success" />
        <StatCard icon={Utensils} label="Today's Menu" value={statSummary.todayMenu} tone="primary" />
        <StatCard icon={Shirt} label="Laundry Status" value={statSummary.laundryStatus} tone="warning" />
      </div>

      {/* Quick actions */}
      <GlassCard className="p-5" hover={false}>
        <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, icon: Icon, path, tone }) => (
            <motion.button
              key={label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 rounded-xl ${tone} px-4 py-2.5 text-sm font-medium text-white shadow-sm`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance graph */}
        <GlassCard className="p-5 lg:col-span-2" hover={false}>
          <h2 className="mb-1 font-display text-sm font-semibold text-ink2">Attendance this week</h2>
          <p className="mb-4 text-xs text-slate-400">Auto-logged via face recognition & QR check-in</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="pct" stroke="#2563EB" strokeWidth={2} fill="url(#att)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Complaint status */}
        <GlassCard className="p-5" hover={false}>
          <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Complaint status</h2>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink2">{c.category}</p>
                  <p className="text-xs text-slate-400">{c.id} · {c.date}</p>
                </div>
                <Badge tone={complaintTone[c.status]}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent notices */}
        <GlassCard className="p-5" hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-ink2">Recent notices</h2>
          </div>
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink2">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.date}</p>
                </div>
                <Badge tone="neutral">{n.type}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming events */}
        <GlassCard className="p-5" hover={false}>
          <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Upcoming events</h2>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-sm text-ink2">{e.title}</p>
                <span className="text-xs font-medium text-slate-500">{e.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
