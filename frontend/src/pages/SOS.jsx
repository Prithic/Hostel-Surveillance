import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Siren, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { emergencyContacts } from '../data/dummyData'

export default function SOS() {
  const [triggered, setTriggered] = useState(false)

  function handleTrigger() {
    setTriggered(true)
    // In production this calls the backend to alert security, the warden
    // and the student's registered emergency contacts in parallel.
    setTimeout(() => setTriggered(false), 6000)
  }

  return (
    <div className="space-y-6">
      <GlassCard hover={false} className="flex flex-col items-center gap-5 px-6 py-14 text-center">
        <p className="text-sm text-white/55">Press and hold only in a genuine emergency. This alerts security, your warden and your parents instantly.</p>

        <div className="relative flex h-40 w-40 items-center justify-center">
          {triggered && (
            <>
              <span className="absolute inset-0 rounded-full bg-danger/30 animate-pulseRing" />
              <span className="absolute inset-0 rounded-full bg-danger/30 animate-pulseRing [animation-delay:0.4s]" />
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleTrigger}
            className="relative z-10 flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full bg-danger text-white shadow-[0_0_60px_rgba(239,68,68,0.45)] transition hover:bg-danger/90"
          >
            <Siren className="h-8 w-8" />
            <span className="text-sm font-semibold">SOS</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {triggered ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Alert sent — security and your contacts have been notified
            </motion.div>
          ) : (
            <motion.p key="idle" className="text-xs text-white/45">One tap SOS</motion.p>
          )}
        </AnimatePresence>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {emergencyContacts.map((c) => (
          <GlassCard key={c.name} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{c.name}</p>
              <p className="text-xs text-white/45">{c.role}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/55"><Phone className="h-3 w-3" />{c.phone}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Live location shared on SOS</p>
          <p className="text-xs text-white/45">Block B, Room 204 — Green Valley Hostel Campus</p>
        </div>
      </GlassCard>
    </div>
  )
}

