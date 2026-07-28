import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, CalendarDays, Plus } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

const typeTone = {
  Holiday: 'success',
  Maintenance: 'warning',
  'Water Shutdown': 'danger',
  'Exam Notice': 'info',
  General: 'neutral',
}

export default function Notices() {
  const { data, loading, error, append } = useHostel()
  const { isAdminRole } = useRoleCheck()
  const [notice, setNotice] = useState({ type: 'General', title: '' })
  const [event, setEvent] = useState({ title: '', date: '' })
  const [msg, setMsg] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const notices = data.notices || []
  const events = data.events || []

  async function addNotice(e) {
    e.preventDefault()
    if (!notice.title.trim()) return
    await append('notices', {
      id: Date.now(),
      type: notice.type,
      title: notice.title.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setNotice({ type: 'General', title: '' })
    setMsg('Notice posted.')
  }

  async function addEvent(e) {
    e.preventDefault()
    if (!event.title.trim() || !event.date) return
    await append('events', {
      id: Date.now(),
      title: event.title.trim(),
      date: event.date,
    })
    setEvent({ title: '', date: '' })
    setMsg('Event added.')
  }

  return (
    <div className="space-y-6">
      {msg && <p className="text-xs text-emerald-400">{msg}</p>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Hostel notices</h2>
          </div>
          <div className="space-y-3">
            {notices.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{n.title}</p>
                  <p className="text-xs text-white/45">{n.date}</p>
                </div>
                <Badge tone={typeTone[n.type] || 'neutral'}>{n.type}</Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Upcoming events</h2>
          </div>
          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="rounded-lg bg-white/5 px-4 py-3">
                <p className="text-sm font-medium text-white">{ev.title}</p>
                <p className="text-xs text-white/45">{ev.date}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {isAdminRole && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold text-white">Post notice</h3>
            </div>
            <form onSubmit={addNotice} className="space-y-3">
              <select
                value={notice.type}
                onChange={(e) => setNotice({ ...notice, type: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                {Object.keys(typeTone).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                placeholder="Notice title"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Publish</button>
            </form>
          </GlassCard>
          <GlassCard hover={false} className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold text-white">Add event</h3>
            </div>
            <form onSubmit={addEvent} className="space-y-3">
              <input
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                placeholder="Event title"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <input
                type="date"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary [color-scheme:dark]"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Add event</button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
