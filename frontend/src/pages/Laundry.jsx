import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shirt, QrCode, Plus, AlertCircle, CheckCircle, Calculator, PackageCheck, Send, ShieldCheck, Edit3 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { laundrySlots, laundryTracking } from '../data/dummyData'

const statusTone = { Washing: 'info', Ready: 'success', 'Picked Up': 'neutral' }

export default function Laundry() {
  const [userRole, setUserRole] = useState('')
  const [booked, setBooked] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nestos_user')
      if (stored) {
        const u = JSON.parse(stored)
        setUserRole(u.role || 'Student')
      }
    } catch (e) {
      setUserRole('Student')
    }
  }, [])

  const isAdminRole = ['Admin', 'Super Admin', 'Chief Warden', 'Laundry Staff'].includes(userRole)

  // Itemized clothing counts — Innerwear REMOVED per instructions
  const [counts, setCounts] = useState({
    shirts: 3,
    trousers: 2,
    jackets: 1,
    towels: 1,
    bedsheets: 1,
  })

  // Missing items state with Admin claim status manager
  const [missingClaims, setMissingClaims] = useState([
    { id: 'CLM-101', student: 'Sharan M (B-214)', item: '1 Blue Denim Shirt', batch: 'LND-8821', status: 'Under Verification', date: 'Yesterday' },
    { id: 'CLM-098', student: 'Akash K (A-201)', item: '1 Black Towel', batch: 'LND-8802', status: 'Found & Returned', date: '3 days ago' },
    { id: 'CLM-095', student: 'Vignesh M (B-102)', item: '1 Grey Hoodie', batch: 'LND-8790', status: 'In Progress - Laundry Search', date: '4 days ago' },
  ])
  const [missingText, setMissingText] = useState('')
  const [missingBatch, setMissingBatch] = useState('LND-8821')
  const [claimSuccess, setClaimSuccess] = useState(false)

  const totalDresses = Object.values(counts).reduce((a, b) => Number(a) + Number(b), 0)

  function updateCount(key, delta) {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(prev[key] || 0) + delta),
    }))
  }

  function handleClaimMissing(e) {
    e.preventDefault()
    if (!missingText.trim()) return

    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      student: 'Sharan M (B-214)',
      item: missingText.trim(),
      batch: missingBatch,
      status: 'Under Verification',
      date: 'Just now',
    }

    setMissingClaims([newClaim, ...missingClaims])
    setMissingText('')
    setClaimSuccess(true)
    setTimeout(() => setClaimSuccess(false), 3000)
  }

  function handleAdminClaimStatusUpdate(id, newStatus) {
    setMissingClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Grid: Slot Booking + Itemized Clothes Entry */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Slot Booking & Itemized Counter */}
        <GlassCard hover={false} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-primary" />
              <h2 className="font-display text-sm font-semibold text-white">Book Laundry Slot & Count Dresses</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              <Calculator className="h-3.5 w-3.5" /> Total: {totalDresses} Items
            </div>
          </div>

          {/* Itemized Counter — Innerwear Removed */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-xs font-medium text-white/70">Enter Quantity of Clothes to Wash:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { key: 'shirts', label: 'Shirts / T-Shirts' },
                { key: 'trousers', label: 'Pants / Jeans' },
                { key: 'jackets', label: 'Jackets / Sweaters' },
                { key: 'towels', label: 'Towels' },
                { key: 'bedsheets', label: 'Bedsheets' },
              ].map((item) => (
                <div key={item.key} className="rounded-xl border border-white/10 bg-white/5 p-2.5 flex items-center justify-between">
                  <div className="min-w-0 pr-1">
                    <p className="text-[11px] font-medium text-white/80 truncate">{item.label}</p>
                    <p className="text-xs font-bold text-primary">{counts[item.key]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateCount(item.key, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-xs text-white/70 hover:bg-white/15"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCount(item.key, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-xs text-white/70 hover:bg-white/15"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Selection */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-white/70">Select Pickup Time Slot:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {laundrySlots.map((slot) => (
                <motion.button
                  key={slot}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setBooked(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    booked === slot
                      ? 'border-primary bg-primary/20 text-white shadow-liquid font-semibold'
                      : 'border-white/10 text-white/70 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </div>

          {booked && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-300">
              <PackageCheck className="h-4 w-4 shrink-0" />
              <span>Confirmed! Slot booked for <strong>{booked}</strong> ({totalDresses} items total). Pickup code sent to mobile.</span>
            </div>
          )}
        </GlassCard>

        {/* Live Laundry Tracking */}
        <GlassCard hover={false} className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Live Batch Tracking</h2>
          </div>
          <div className="space-y-3">
            {laundryTracking.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-white">{l.item}</p>
                  <p className="font-mono text-[11px] text-white/45">{l.id} · Machine #4</p>
                </div>
                <Badge tone={statusTone[l.status] || 'neutral'}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section: Missing Item Tracker & Admin Claim Manager */}
      <GlassCard hover={false} className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">Report Missing Item / Laundry Claims</h2>
              <p className="text-xs text-white/50">Submit missing item reports. Laundry admins inspect wash batches and update progress.</p>
            </div>
          </div>
        </div>

        {/* Submit Claim Form */}
        <form onSubmit={handleClaimMissing} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={missingText}
            onChange={(e) => setMissingText(e.target.value)}
            placeholder="Describe missing item (e.g. 1 White Linen Shirt...)"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-primary w-full"
          />
          <select
            value={missingBatch}
            onChange={(e) => setMissingBatch(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-primary w-full sm:w-auto"
          >
            <option value="LND-8821">Batch LND-8821 (Yesterday)</option>
            <option value="LND-8802">Batch LND-8802 (3 days ago)</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30 shrink-0 w-full sm:w-auto justify-center"
          >
            <Send className="h-3.5 w-3.5" /> Submit Claim
          </button>
        </form>

        {claimSuccess && (
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Missing item claim registered. Laundry supervisor will inspect the wash batch.
          </p>
        )}

        {/* Claims Table with Admin Status Override */}
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-white/80">Active Missing Item Claims & Inspection Status:</p>
          <div className="space-y-2">
            {missingClaims.map((claim) => (
              <div key={claim.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{claim.item}</span>
                    <span className="font-mono text-[10px] text-white/40">[{claim.batch}]</span>
                  </div>
                  <p className="text-[11px] text-white/50">{claim.student} · Reported {claim.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  {isAdminRole ? (
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
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        claim.status.includes('Found')
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
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
