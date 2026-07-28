import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Siren, Phone, CheckCircle2, AlertTriangle } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useHostel } from '../hostel/HostelContext'

export default function SOS() {
  const { data, loading, error, triggerSos } = useHostel()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>

  const contacts = data?.emergencyContacts || []
  const recent = data?.sosEvents || []

  async function handleTrigger() {
    setBusy(true)
    setErr('')
    try {
      const res = await triggerSos({
        note: 'Emergency SOS from Trinity console',
        location: 'Hostel campus',
      })
      setResult(res)
    } catch (e) {
      setErr(e.message || 'SOS failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard hover={false} className="flex flex-col items-center gap-5 px-6 py-14 text-center">
        <p className="text-sm text-white/55">
          Triggers a <span className="text-white">critical live incident</span> in GuardianAI (persisted + WebSocket alert). Use only for real emergencies or demos.
        </p>

        <div className="relative flex h-40 w-40 items-center justify-center">
          {result && (
            <>
              <span className="absolute inset-0 rounded-full bg-danger/30 animate-pulseRing" />
              <span className="absolute inset-0 rounded-full bg-danger/30 animate-pulseRing [animation-delay:0.4s]" />
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.92 }}
            disabled={busy}
            onClick={handleTrigger}
            className="relative z-10 flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full bg-danger text-white transition hover:bg-danger/90 disabled:opacity-60"
          >
            <Siren className="h-8 w-8" />
            <span className="text-sm font-semibold">{busy ? 'Sending…' : 'SOS'}</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex max-w-md flex-col items-center gap-1 rounded-2xl bg-success/10 px-4 py-3 text-sm text-success"
            >
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4" /> SOS recorded
              </span>
              <span className="text-xs text-white/60">
                Incident {result.incident?.id} · event {result.event?.id} — see Security
              </span>
            </motion.div>
          ) : (
            <motion.p key="idle" className="text-xs text-white/45">One tap SOS</motion.p>
          )}
        </AnimatePresence>
        {err && (
          <p className="flex items-center gap-2 text-xs text-danger">
            <AlertTriangle className="h-3.5 w-3.5" /> {err}
          </p>
        )}
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">Emergency contacts</h2>
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li key={c.phone} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-sm">
                <div>
                  <p className="text-white">{c.name}</p>
                  <p className="text-xs text-white/45">{c.role}</p>
                </div>
                <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-primary">
                  <Phone className="h-3.5 w-3.5" /> {c.phone}
                </a>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">Recent SOS (live store)</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-white/45">No SOS events yet.</p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {recent.map((e) => (
                <li key={e.id} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70">
                  <p className="font-medium text-white">{e.id}</p>
                  <p>{e.note} · {e.location}</p>
                  <p className="text-white/40">{e.at}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
