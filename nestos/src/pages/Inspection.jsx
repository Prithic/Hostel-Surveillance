import { ClipboardList, CalendarClock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { inspections } from '../data/dummyData'

const toneMap = { Passed: 'success', Warning: 'warning', Failed: 'danger' }

export default function Inspection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Inspection history</h2>
        </div>
        <div className="space-y-3">
          {inspections.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3">
              <div>
                <p className="text-sm text-white">{i.remarks}</p>
                <p className="text-xs text-white/45">{i.date}</p>
              </div>
              <Badge tone={toneMap[i.result] || 'neutral'}>{i.result}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Next inspection</h2>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <p className="text-sm font-medium text-white">Block B — routine check</p>
          <p className="mt-1 text-xs text-white/45">Scheduled for 2026-07-30</p>
        </div>
        <p className="mt-3 text-xs text-white/45">Keep your room tidy — inspections check bedding, cleanliness and equipment condition.</p>
      </GlassCard>
    </div>
  )
}
