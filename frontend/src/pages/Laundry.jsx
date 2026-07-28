import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shirt, QrCode, AlertCircle, CheckCircle, Calculator, PackageCheck, Send } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'
import { getDisplayName } from '../services/guardianApi'

const statusTone = { Booked: 'info', Washing: 'info', Ready: 'success', 'Picked Up': 'neutral' }
const TRACK_FLOW = ['Booked', 'Washing', 'Ready', 'Picked Up']

export default function Laundry() {
  const { data, loading, error, append, patchItem } = useHostel()
  const { isLaundryStaff } = useRoleCheck()
  const [booked, setBooked] = useState(null)
  const [counts, setCounts] = useState({
    shirts: 3,
    trousers: 2,
    jackets: 1,
    towels: 1,
    bedsheets: 1,
  })
  const [missingText, setMissingText] = useState('')
  const [missingBatch, setMissingBatch] = useState('LND-8821')
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const laundrySlots = data.laundrySlots || []
  const laundryTracking = data.laundryTracking || []
  const missingClaims = data.laundryClaims || []
  const totalDresses = Object.values(counts).reduce((a, b) => Number(a) + Number(b), 0)
  const studentLabel = `${getDisplayName() || 'Student'} (${data.currentUser?.room || '—'})`

  function updateCount(key, delta) {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(prev[key] || 0) + delta),
    }))
  }

  async function bookSlot(slot) {
    setBusy(true)
    try {
      setBooked(slot)
      await append('laundryTracking', {
        id: `LDY-${Date.now().toString().slice(-4)}`,
        item: `${totalDresses} clothes @ ${slot}`,
        status: 'Booked',
        qr: `LDY-${slot}`,
        counts: { ...counts },
      })
    } finally {
      setBusy(false)
    }
  }

  async function advanceStatus(item) {
    const idx = TRACK_FLOW.indexOf(item.status)
    const next = TRACK_FLOW[Math.min(idx + 1, TRACK_FLOW.length - 1)]
    if (next === item.status) return
    await patchItem('laundryTracking', item.id, { status: next })
  }

  async function handleClaimMissing(e) {
    e.preventDefault()
    if (!missingText.trim()) return
    setBusy(true)
    try {
      await append('laundryClaims', {
        id: `CLM-${Date.now().toString().slice(-4)}`,
        student: studentLabel,
        item: missingText.trim(),
        batch: missingBatch,
        status: 'Under Verification',
        date: new Date().toISOString().slice(0, 10),
      })
      setMissingText('')
      setClaimSuccess(true)
      setTimeout(() => setClaimSuccess(false), 3000)
    } finally {
      setBusy(false)
    }
  }

  async function handleAdminClaimStatusUpdate(id, newStatus) {
    await patchItem('laundryClaims', id, { status: newStatus })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-primary" />
              <h2 className="font-display text-sm font-semibold text-white">Book Laundry Slot</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              <Calculator className="h-3.5 w-3.5" /> Total: {totalDresses} Items
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium text-white/70">Quantity of clothes:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { key: 'shirts', label: 'Shirts / T-Shirts' },
                { key: 'trousers', label: 'Pants / Jeans' },
                { key: 'jackets', label: 'Jackets / Sweaters' },
                { key: 'towels', label: 'Towels' },
                { key: 'bedsheets', label: 'Bedsheets' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5">
                  <div className="min-w-0 pr-1">
                    <p className="truncate text-[11px] font-medium text-white/80">{item.label}</p>
                    <p className="text-xs font-bold text-primary">{counts[item.key]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => updateCount(item.key, -1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-xs text-white/70 hover:bg-white/15">-</button>
                    <button type="button" onClick={() => updateCount(item.key, 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-xs text-white/70 hover:bg-white/15">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-white/70">Select pickup slot:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {laundrySlots.map((slot) => (
                <motion.button
                  key={slot}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  disabled={busy}
                  onClick={() => bookSlot(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    booked === slot
                      ? 'border-primary bg-primary/20 font-semibold text-white shadow-liquid'
                      : 'border-white/10 text-white/70 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </div>

          {booked && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs text-emerald-300">
              <PackageCheck className="h-4 w-4 shrink-0" />
              <span>
                Slot booked for <strong>{booked}</strong> ({totalDresses} items). Tracking id stored.
              </span>
            </div>
          )}
        </GlassCard>

        <GlassCard hover={false} className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Live Batch Tracking</h2>
          </div>
          <div className="space-y-3">
            {laundryTracking.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-white">{l.item}</p>
                  <p className="font-mono text-[11px] text-white/45">{l.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone[l.status] || 'neutral'}>{l.status}</Badge>
                  {isLaundryStaff && l.status !== 'Picked Up' && (
                    <button
                      type="button"
                      onClick={() => advanceStatus(l)}
                      className="rounded-lg border border-white/15 px-2 py-1 text-[10px] text-white/70 hover:bg-white/10"
                    >
                      Advance
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-400" />
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Missing Item Claims</h2>
            <p className="text-xs text-white/50">Claims persist in the hostel store.</p>
          </div>
        </div>

        <form onSubmit={handleClaimMissing} className="flex flex-col items-center gap-3 sm:flex-row">
          <input
            type="text"
            value={missingText}
            onChange={(e) => setMissingText(e.target.value)}
            placeholder="Describe missing item…"
            className="w-full flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-primary"
          />
          <select
            value={missingBatch}
            onChange={(e) => setMissingBatch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-primary sm:w-auto"
          >
            <option value="LND-8821">Batch LND-8821</option>
            <option value="LND-8802">Batch LND-8802</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30 sm:w-auto"
          >
            <Send className="h-3.5 w-3.5" /> Submit Claim
          </button>
        </form>

        {claimSuccess && (
          <p className="flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" /> Claim saved.
          </p>
        )}

        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-white/80">Active claims:</p>
          <div className="space-y-2">
            {missingClaims.map((claim) => (
              <div key={claim.id} className="flex flex-col justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{claim.item}</span>
                    <span className="font-mono text-[10px] text-white/40">[{claim.batch}]</span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    {claim.student} · {claim.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isLaundryStaff ? (
                    <select
                      value={claim.status}
                      onChange={(e) => handleAdminClaimStatusUpdate(claim.id, e.target.value)}
                      className="rounded-lg border border-amber-500/40 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-amber-300 outline-none focus:border-amber-400"
                    >
                      <option value="Under Verification">Under Verification</option>
                      <option value="In Progress - Laundry Search">In Progress - Laundry Search</option>
                      <option value="Found & Returned">Found & Returned</option>
                      <option value="Reimbursed">Reimbursed</option>
                    </select>
                  ) : (
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                      {claim.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
