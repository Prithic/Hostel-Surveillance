import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { complaints, complaintCategories } from '../data/dummyData'

const tone = { Pending: 'warning', 'In Progress': 'info', Completed: 'success' }

export default function Complaints() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false} className="p-6">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Raise a complaint</h2>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000) }} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/55">Category</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [color-scheme:dark]">
              {complaintCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/55">Description</label>
            <textarea rows={4} placeholder="Describe the issue…" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/55">Attach image</label>
            <div className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 text-sm text-white/45 hover:border-primary hover:text-primary">
              <ImagePlus className="h-4 w-4" /> Click to upload
            </div>
          </div>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Submit complaint
          </button>
          {submitted && <p className="text-center text-xs text-success">Complaint submitted successfully.</p>}
        </form>
      </GlassCard>

      <GlassCard hover={false} className="p-6">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Complaint history</h2>
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="rounded-lg border border-white/10 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium text-white">{c.category}</p>
                <Badge tone={tone[c.status]}>{c.status}</Badge>
              </div>
              <p className="text-sm text-white/55">{c.description}</p>
              <p className="mt-1 text-xs text-white/45">{c.id} · {c.date}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

