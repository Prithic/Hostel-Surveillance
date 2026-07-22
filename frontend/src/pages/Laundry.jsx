import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shirt, QrCode } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { laundrySlots, laundryTracking } from '../data/dummyData'

const statusTone = { Washing: 'info', Ready: 'success', 'Picked Up': 'neutral' }

export default function Laundry() {
  const [booked, setBooked] = useState(null)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false} className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Shirt className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Book a laundry slot</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {laundrySlots.map((slot) => (
            <motion.button
              key={slot}
              whileTap={{ scale: 0.96 }}
              onClick={() => setBooked(slot)}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                booked === slot
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/10 text-white/70 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {slot}
            </motion.button>
          ))}
        </div>
        {booked && (
          <p className="mt-4 text-xs text-success">Slot booked for {booked}. You'll get a reminder before pickup.</p>
        )}
      </GlassCard>

      <GlassCard hover={false} className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <QrCode className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Tracking</h2>
        </div>
        <div className="space-y-3">
          {laundryTracking.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{l.item}</p>
                <p className="font-mono text-xs text-white/45">{l.id}</p>
              </div>
              <Badge tone={statusTone[l.status] || 'neutral'}>{l.status}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
