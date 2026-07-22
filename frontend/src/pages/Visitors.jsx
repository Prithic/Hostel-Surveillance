import { useState } from 'react'
import { UserCheck, Plus } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { visitors as initialVisitors } from '../data/dummyData'

export default function Visitors() {
  const [visitors, setVisitors] = useState(initialVisitors)
  const [form, setForm] = useState({ name: '', relation: '', phone: '' })

  function register(e) {
    e.preventDefault()
    if (!form.name || !form.relation) return
    const now = new Date()
    setVisitors((v) => [
      { id: `VIS-${550 + v.length + 1}`, ...form, entry: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), exit: '—', date: now.toISOString().slice(0, 10) },
      ...v,
    ])
    setForm({ name: '', relation: '', phone: '' })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="overflow-x-auto p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Visitor log</h2>
        </div>
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Relation</th>
              <th className="pb-3 font-medium">Entry</th>
              <th className="pb-3 font-medium">Exit</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v.id} className="border-b border-white/5 last:border-0">
                <td className="py-3 font-mono text-xs text-white/55">{v.id}</td>
                <td className="py-3 text-white">{v.name}</td>
                <td className="py-3 text-white/55">{v.relation}</td>
                <td className="py-3 text-white/55">{v.entry}</td>
                <td className="py-3 text-white/55">{v.exit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Register a visitor</h2>
        </div>
        <form onSubmit={register} className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Visitor name" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="Relation" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Register entry
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
