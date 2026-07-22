import GlassCard from '../components/GlassCard'
import { DoorOpen, Users } from 'lucide-react'
import { roomInfo, roommates } from '../data/dummyData'

export default function RoomDetails() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-6 lg:col-span-2">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <DoorOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">Room B-204</p>
            <p className="text-sm text-white/45">Block B, Green Valley Hostel Campus</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roomInfo.map((d) => (
            <div key={d.label} className="rounded-2xl bg-white/5 px-4 py-3">
              <dt className="text-xs text-white/45">{d.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-white">{d.value}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard hover={false} className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Roommates</h2>
        </div>
        <div className="space-y-3">
          {roommates.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full liquid-tint-primary text-xs font-semibold text-white">
                {r.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{r.name}</p>
                <p className="text-xs text-white/45">{r.course}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
