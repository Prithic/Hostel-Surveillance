import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import {
  CalendarCheck, DoorOpen, MessageSquareWarning, Wallet, Utensils, Shirt,
  FileClock, Siren, Megaphone, Phone, Search, CheckCircle2, Circle,
  IndianRupee, ArrowUpRight, Download, Sparkles, Edit3, ShieldAlert,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import AdminEditModal from '../components/AdminEditModal'
import { exportToCSV } from '../utils/exportCSV'
import {
  statSummary, notices, events, complaints, attendanceTrend,
  roomInfo, roommates, feeStatus, todayMenu, mealTimings,
  laundryTracking, emergencyContacts, lostAndFoundItems,
} from '../data/dummyData'

const quickActions = [
  { label: 'Apply Leave', icon: FileClock, path: '/leave', tone: 'liquid-tint-primary' },
  { label: 'Raise Complaint', icon: MessageSquareWarning, path: '/complaints', tone: 'liquid-tint-warning' },
  { label: 'Book Laundry', icon: Shirt, path: '/laundry', tone: 'liquid-tint-primary' },
  { label: 'Emergency SOS', icon: Siren, path: '/sos', tone: 'liquid-tint-danger' },
  { label: 'View Menu', icon: Utensils, path: '/mess', tone: 'liquid-tint-success' },
]

const complaintTone = { Pending: 'warning', 'In Progress': 'info', Completed: 'success' }

const laundrySteps = ['Booked', 'Washing', 'Ready', 'Picked Up']

const menuRows = [
  { label: 'Breakfast', value: todayMenu.breakfast, time: mealTimings.breakfast },
  { label: 'Lunch', value: todayMenu.lunch, time: mealTimings.lunch },
  { label: 'Snacks', value: todayMenu.snacks, time: mealTimings.snacks },
  { label: 'Dinner', value: todayMenu.dinner, time: mealTimings.dinner },
]

import { useRoleCheck } from '../hooks/useRoleCheck'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { isAdminRole } = useRoleCheck()
  const [adminEditOpen, setAdminEditOpen] = useState(false)
  const currentLaundryIdx = laundrySteps.indexOf(laundryTracking[0]?.status)
  const feePct = Math.round((feeStatus.paid / (feeStatus.paid + feeStatus.pending || 1)) * 100)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div onClick={() => navigate('/attendance')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={CalendarCheck} label="Attendance" value={`${statSummary.attendance}%`} tone="success" />
        </div>
        <div onClick={() => navigate('/room-details')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={DoorOpen} label="Room Number" value={statSummary.room} tone="primary" />
        </div>
        <div onClick={() => navigate('/complaints')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={MessageSquareWarning} label="Pending Complaints" value={statSummary.pendingComplaints} tone="warning" />
        </div>
        <div onClick={() => navigate('/fees')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={Wallet} label="Fee Status" value={statSummary.feeStatus} tone="success" />
        </div>
        <div onClick={() => navigate('/mess')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={Utensils} label="Today's Menu" value={statSummary.todayMenu} tone="primary" />
        </div>
        <div onClick={() => navigate('/laundry')} className="cursor-pointer transition hover:scale-[1.02]">
          <StatCard icon={Shirt} label="Laundry Status" value={statSummary.laundryStatus} tone="warning" />
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item}>
        <GlassCard className="p-5" hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-sm font-semibold text-white">Quick actions</h2>
            <div className="flex items-center gap-2">
              {isAdminRole && (
                <button
                  onClick={() => setAdminEditOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Admin Master Edit
                </button>
              )}
              <button
                onClick={() =>
                  exportToCSV('trinity_dashboard_summary', [
                    { Metric: 'Attendance', Value: `${statSummary.attendance}%` },
                    { Metric: 'Room', Value: statSummary.room },
                    { Metric: 'Pending Complaints', Value: statSummary.pendingComplaints },
                    { Metric: 'Fee Status', Value: statSummary.feeStatus },
                    { Metric: 'Today Menu', Value: statSummary.todayMenu },
                    { Metric: 'Laundry Status', Value: statSummary.laundryStatus },
                  ])
                }
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5 text-primary" /> Export Summary CSV
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(({ label, icon: Icon, path, tone }) => (
              <motion.button
                key={label}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 rounded-2xl ${tone} px-4 py-2.5 text-sm font-medium text-white shadow-liquid`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance graph */}
        <GlassCard className="p-5 lg:col-span-2" hover={false}>
          <h2 className="mb-1 font-display text-sm font-semibold text-white">Attendance this week</h2>
          <p className="mb-4 text-xs text-white/45">Auto-logged via face recognition & QR check-in</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                <Area type="monotone" dataKey="pct" stroke="#2563EB" strokeWidth={2} fill="url(#att)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Complaint status */}
        <GlassCard className="p-5" hover={false}>
          <h2 className="mb-4 font-display text-sm font-semibold text-white">Complaint status</h2>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-white">{c.category}</p>
                  <p className="text-xs text-white/45">{c.id} · {c.date}</p>
                </div>
                <Badge tone={complaintTone[c.status]}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent notices */}
        <GlassCard className="p-5" hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Recent notices</h2>
          </div>
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white">{n.title}</p>
                  <p className="text-xs text-white/45">{n.date}</p>
                </div>
                <Badge tone="neutral">{n.type}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming events */}
        <GlassCard className="p-5" hover={false}>
          <h2 className="mb-4 font-display text-sm font-semibold text-white">Upcoming events</h2>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
                <p className="text-sm text-white">{e.title}</p>
                <span className="text-xs font-medium text-white/55">{e.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* More widgets */}
      <motion.div variants={item}>
        <h2 className="mb-3 px-1 font-display text-sm font-semibold text-white">More widgets</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Room & roommates */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-white">Room & roommates</h3>
              </div>
              <button onClick={() => navigate('/room-details')} className="text-white/45 hover:text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="text-xs text-white/45">{roomInfo[1].value} · {roomInfo[2].value}</p>
              <p className="text-sm font-medium text-white">{roomInfo[0].value} · {roomInfo[3].value}</p>
            </div>
            <div className="space-y-2">
              {roommates.map((r) => (
                <div key={r.name} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full liquid-tint-primary text-[10px] font-semibold text-white">
                    {r.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white">{r.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Fee overview */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-success" />
                <h3 className="font-display text-sm font-semibold text-white">Fee overview</h3>
              </div>
              <button onClick={() => navigate('/fees')} className="text-white/45 hover:text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 font-display text-2xl font-semibold text-white">
              <IndianRupee className="h-5 w-5" />{feeStatus.paid.toLocaleString('en-IN')}
            </div>
            <p className="mb-3 text-xs text-white/45">of ₹{feeStatus.amount.toLocaleString('en-IN')} paid this year</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feePct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full liquid-tint-success"
              />
            </div>
            <p className="mt-2 text-xs text-white/45">
              {feeStatus.pending > 0 ? `₹${feeStatus.pending.toLocaleString('en-IN')} pending · due ${feeStatus.dueDate}` : `Fully paid · next due ${feeStatus.dueDate}`}
            </p>
          </GlassCard>

          {/* Today's full menu */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-white">Today's full menu</h3>
              </div>
              <button onClick={() => navigate('/mess')} className="text-white/45 hover:text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {menuRows.map((m) => (
                <div key={m.label} className="flex items-start justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white/45">{m.label}</p>
                    <p className="truncate text-xs text-white">{m.value}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-white/45">{m.time.split('–')[0].trim()}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Laundry tracker */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shirt className="h-4 w-4 text-warning" />
                <h3 className="font-display text-sm font-semibold text-white">Laundry tracker</h3>
              </div>
              <button onClick={() => navigate('/laundry')} className="text-white/45 hover:text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            {laundryTracking[0] && (
              <>
                <p className="mb-4 text-xs text-white/45">{laundryTracking[0].item} · {laundryTracking[0].id}</p>
                <div className="space-y-3">
                  {laundrySteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      {i <= currentLaundryIdx
                        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        : <Circle className="h-4 w-4 shrink-0 text-white/35" />}
                      <span className={`text-xs ${i <= currentLaundryIdx ? 'font-medium text-white' : 'text-white/45'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>

          {/* Emergency contacts */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-danger" />
              <h3 className="font-display text-sm font-semibold text-white">Emergency contacts</h3>
            </div>
            <div className="space-y-2.5">
              {emergencyContacts.map((c) => (
                <a
                  key={c.name}
                  href={`tel:${c.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 transition hover:bg-danger/[0.06]"
                >
                  <div>
                    <p className="text-xs font-medium text-white">{c.name}</p>
                    <p className="text-[11px] text-white/45">{c.role}</p>
                  </div>
                  <span className="text-[11px] font-medium text-white/55">{c.phone}</span>
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Lost & found */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-white">Lost & found</h3>
              </div>
              <button onClick={() => navigate('/lost-found')} className="text-white/45 hover:text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {lostAndFoundItems.slice(0, 3).map((it) => (
                <div key={it.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-white">{it.name}</p>
                    <p className="text-[11px] text-white/45">{it.location}</p>
                  </div>
                  <span className="text-[11px] text-white/45">{it.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>

      <AdminEditModal open={adminEditOpen} onClose={() => setAdminEditOpen(false)} />
    </motion.div>
  )
}
