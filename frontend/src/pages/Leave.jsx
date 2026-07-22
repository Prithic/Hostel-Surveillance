import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileClock, Plus, X } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { leaveRequests as initialRequests } from '../data/dummyData'

const toneMap = { Approved: 'success', Pending: 'warning', Rejected: 'danger' }

export default function Leave() {
  const [requests, setRequests] = useState(initialRequests)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ reason: '', from: '', to: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.reason || !form.from || !form.to) return
    setRequests((r) => [
      { id: `LV-0${r.length + 20}`, ...form, status: 'Pending', appliedOn: new Date().toISOString().slice(0, 10) },
      ...r,
    ])
    setForm({ reason: '', from: '', to: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <GlassCard hover={false} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileClock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">Leave Management</p>
            <p className="text-xs text-white/45">Apply for leave and track warden approval.</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Apply for leave
        </button>
      </GlassCard>

      <GlassCard hover={false} className="overflow-x-auto p-5">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Reason</th>
              <th className="pb-3 font-medium">Dates</th>
              <th className="pb-3 font-medium">Applied</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-white/5 last:border-0">
                <td className="py-3 font-mono text-xs text-white/55">{r.id}</td>
                <td className="py-3 text-white">{r.reason}</td>
                <td className="py-3 text-white/55">{r.from} → {r.to}</td>
                <td className="py-3 text-white/45">{r.appliedOn}</td>
                <td className="py-3"><Badge tone={toneMap[r.status]}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              className="glass-light w-full max-w-sm space-y-4 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-white">Apply for leave</h2>
                <button type="button" onClick={() => setOpen(false)} className="text-white/45 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Reason" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 [color-scheme:dark]"
                />
                <input
                  required type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 [color-scheme:dark]"
                />
              </div>
              <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
                Submit request
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
