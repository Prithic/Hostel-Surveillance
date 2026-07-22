import GlassCard from '../components/GlassCard'
import { DoorOpen, Users, Phone, Building2 } from 'lucide-react'
import { currentUser } from '../data/dummyData'

const details = [
  { label: 'Room Number', value: 'B-204' },
  { label: 'Hostel Block', value: 'Block B' },
  { label: 'Floor', value: '2nd Floor' },
  { label: 'Room Type', value: 'Twin Sharing' },
  { label: 'Warden Name', value: 'Mrs. Kavita Rao' },
  { label: 'Caretaker', value: 'Mr. Suresh Nair' },
  { label: 'Contact Number', value: '+91 98765 43210' },
]

const roommates = [
  { name: 'Rohit Sharma', course: 'B.Tech CSE, 2nd Year' },
  { name: currentUser.name, course: 'B.Tech CSE, 2nd Year' },
]

export default function RoomDetails() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard hover={false} className="p-6 lg:col-span-2">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DoorOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink2">Room B-204</p>
            <p className="text-sm text-slate-400">Block B, Green Valley Hostel Campus</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map((d) => (
            <div key={d.label} className="rounded-lg bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-400">{d.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink2">{d.value}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard hover={false} className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-ink2">Roommates</h2>
        </div>
        <div className="space-y-3">
          {roommates.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {r.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-ink2">{r.name}</p>
                <p className="text-xs text-slate-400">{r.course}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
