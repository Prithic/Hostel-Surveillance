import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, PackageSearch } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useHostel } from '../hostel/HostelContext'

export default function LostFound() {
  const { data, loading, error, append } = useHostel()
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ name: '', location: '' })

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const items = data.lostAndFoundItems || []
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))

  async function report(e) {
    e.preventDefault()
    if (!form.name || !form.location) return
    await append('lostAndFoundItems', {
      id: Date.now(),
      ...form,
      date: new Date().toISOString().slice(0, 10),
    })
    setForm({ name: '', location: '' })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Lost & Found (live)</h2>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items…"
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-white/10 p-4"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <PackageSearch className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-white/45">{item.location} · {item.date}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Report item</h2>
        </div>
        <form onSubmit={report} className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Item name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary"
          />
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Found location"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary"
          />
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90">
            Submit report
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
