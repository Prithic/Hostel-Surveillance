import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, PackageSearch } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { lostAndFoundItems as initialItems } from '../data/dummyData'

export default function LostFound() {
  const [items, setItems] = useState(initialItems)
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ name: '', location: '' })

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))

  function report(e) {
    e.preventDefault()
    if (!form.name || !form.location) return
    setItems((i) => [{ id: i.length + 1, ...form, date: new Date().toISOString().slice(0, 10) }, ...i])
    setForm({ name: '', location: '' })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Lost & Found</h2>
        </div>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items…"
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PackageSearch className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-white/45">{item.location} · {item.date}</p>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-white/45">No items match "{query}".</p>
          )}
        </div>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Report an item</h2>
        </div>
        <form onSubmit={report} className="space-y-3">
          <input
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Item name" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <input
            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location found" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Submit report
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
