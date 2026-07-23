import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileClock, Plus, X, CheckCircle, ShieldAlert, ShieldCheck, XCircle, QrCode, Phone, MapPin, Bus, Calendar, Clock, Lock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import Modal from '../components/Modal'

const toneMap = { 'Approved Pass': 'success', 'Pending Warden Permission': 'warning', 'Permission Denied': 'danger' }

export default function Leave() {
  const [userRole, setUserRole] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedPass, setSelectedPass] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)

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

  const isAdminRole = ['Admin', 'Super Admin', 'Chief Warden', 'Warden'].includes(userRole)

  // Full-detail outpasses dataset
  const [requests, setRequests] = useState([
    {
      id: 'OUT-9921',
      studentName: 'Sharan M',
      regNo: '7176211001',
      room: 'B-214',
      dept: 'AIML (Year 2)',
      type: 'Weekend Home Visit',
      destination: 'Coimbatore, Tamil Nadu (Home)',
      reason: 'Family event & weekend home visit',
      outTime: '2026-07-24 05:00 PM',
      inTime: '2026-07-26 08:00 PM',
      travelMode: 'Personal Bike / Bus',
      parentPhone: '9842100000',
      parentConfirmed: true,
      status: 'Pending Warden Permission',
      appliedOn: '2026-07-22',
    },
    {
      id: 'OUT-9804',
      studentName: 'Akash K',
      regNo: '7176211002',
      room: 'A-201',
      dept: 'CSE (Year 2)',
      type: 'Night Outpass',
      destination: 'TNPESU Hackathon Campus',
      reason: 'Participating in 24hr National Hackathon',
      outTime: '2026-07-20 06:00 PM',
      inTime: '2026-07-21 10:00 AM',
      travelMode: 'Train (Express)',
      parentPhone: '9443200000',
      parentConfirmed: true,
      status: 'Approved Pass',
      appliedOn: '2026-07-18',
    },
    {
      id: 'OUT-9781',
      studentName: 'Vignesh M',
      regNo: '7176211003',
      room: 'B-102',
      dept: 'AI&DS (Year 1)',
      type: 'Emergency Outpass',
      destination: 'City Hospital Coimbatore',
      reason: 'Medical checkup and consultation',
      outTime: '2026-07-15 09:00 AM',
      inTime: '2026-07-15 02:00 PM',
      travelMode: 'Taxi / Auto',
      parentPhone: '9894100000',
      parentConfirmed: true,
      status: 'Approved Pass',
      appliedOn: '2026-07-14',
    },
  ])

  // Comprehensive Student Outpass Form
  const [form, setForm] = useState({
    type: 'Night Outpass',
    destination: '',
    reason: '',
    outDate: '',
    outTime: '05:00 PM',
    inDate: '',
    inTime: '08:00 PM',
    travelMode: 'Bus',
    parentPhone: '9842100000',
    parentConfirmed: true,
  })

  function handleStudentSubmit(e) {
    e.preventDefault()
    if (!form.destination || !form.reason || !form.outDate || !form.inDate) return

    const newPass = {
      id: `OUT-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: 'Sharan M (You)',
      regNo: '7176211001',
      room: 'B-214',
      dept: 'AIML (Year 2)',
      type: form.type,
      destination: form.destination,
      reason: form.reason,
      outTime: `${form.outDate} ${form.outTime}`,
      inTime: `${form.inDate} ${form.inTime}`,
      travelMode: form.travelMode,
      parentPhone: form.parentPhone,
      parentConfirmed: form.parentConfirmed,
      status: 'Pending Warden Permission',
      appliedOn: new Date().toISOString().slice(0, 10),
    }

    setRequests([newPass, ...requests])
    setOpen(false)
    setForm({
      type: 'Night Outpass',
      destination: '',
      reason: '',
      outDate: '',
      outTime: '05:00 PM',
      inDate: '',
      inTime: '08:00 PM',
      travelMode: 'Bus',
      parentPhone: '9842100000',
      parentConfirmed: true,
    })
  }

  function handleWardenPermission(id, decision) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision === 'Grant' ? 'Approved Pass' : 'Permission Denied' } : r))
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Access */}
      <GlassCard hover={false} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-primary/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-liquid">
            <FileClock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">
              {isAdminRole ? 'Chief Warden Outpass Decision & Authorization Center' : 'Student Outpass Application Engine'}
            </h2>
            <p className="text-xs text-white/50">
              {isAdminRole
                ? 'As Chief Warden & Head Authority, review student applications, verify parent consent, and grant official gate passes.'
                : 'Submit outpass request for Chief Warden permission. Approved passes issue a digital QR pass.'}
            </p>
          </div>
        </div>
        {!isAdminRole && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-liquid transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Request Official Outpass
          </button>
        )}
      </GlassCard>

      {/* Admin Outpass Permission Authorization Portal */}
      {isAdminRole && (
        <GlassCard hover={false} className="p-5 border-amber-500/40 bg-amber-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-display text-sm font-bold">Chief Warden Outpass Authorization Desk</h3>
            </div>
            <span className="text-xs text-amber-200 font-mono font-semibold">
              Pending Warden Authorization: {requests.filter((r) => r.status === 'Pending Warden Permission').length} Students
            </span>
          </div>
          <p className="text-xs text-white/70">
            Review student destination, departure/arrival schedules, parent phone consent, and grant official warden permission.
          </p>
        </GlassCard>
      )}

      {/* Active Outpass Table */}
      <GlassCard hover={false} className="overflow-x-auto p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-white">Outpass Application Records</h3>
          <span className="text-[11px] text-white/40">Real-time status synced with Security Staff gate loggers.</span>
        </div>

        <table className="w-full min-w-[750px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/45 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Outpass ID</th>
              <th className="pb-3 font-semibold">Student & Dept</th>
              <th className="pb-3 font-semibold">Type & Destination</th>
              <th className="pb-3 font-semibold">Departure & Return</th>
              <th className="pb-3 font-semibold">Parent Consent</th>
              <th className="pb-3 font-semibold">Warden Status</th>
              <th className="pb-3 font-semibold text-right">Action / QR Pass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition">
                <td className="py-3.5 font-mono text-white/60 font-semibold">{r.id}</td>
                <td className="py-3.5">
                  <p className="font-semibold text-white">{r.studentName}</p>
                  <p className="font-mono text-[10px] text-white/40">{r.regNo} · Room {r.room}</p>
                </td>
                <td className="py-3.5">
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">{r.type}</span>
                  <p className="text-white/70 mt-1 truncate max-w-[180px]">{r.destination}</p>
                </td>
                <td className="py-3.5 font-mono text-[11px] text-white/60">
                  <p className="text-emerald-400">OUT: {r.outTime}</p>
                  <p className="text-amber-300">IN: {r.inTime}</p>
                </td>
                <td className="py-3.5">
                  {r.parentConfirmed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                      <CheckCircle className="h-3 w-3" /> Verified ({r.parentPhone})
                    </span>
                  ) : (
                    <span className="text-amber-300 text-[11px]">Unverified</span>
                  )}
                </td>
                <td className="py-3.5">
                  <Badge tone={toneMap[r.status]}>{r.status}</Badge>
                </td>
                <td className="py-3.5 text-right">
                  {isAdminRole && r.status === 'Pending Warden Permission' ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleWardenPermission(r.id, 'Grant')}
                        className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                      >
                        <ShieldCheck className="h-3 w-3" /> Grant Permission
                      </button>
                      <button
                        onClick={() => handleWardenPermission(r.id, 'Deny')}
                        className="flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-rose-300 transition hover:bg-rose-500/30"
                      >
                        <XCircle className="h-3 w-3" /> Deny
                      </button>
                    </div>
                  ) : r.status === 'Approved Pass' ? (
                    <button
                      onClick={() => { setSelectedPass(r); setQrModalOpen(true) }}
                      className="flex items-center gap-1 rounded-lg bg-primary/20 border border-primary/30 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/30 ml-auto"
                    >
                      <QrCode className="h-3.5 w-3.5" /> View Digital Pass
                    </button>
                  ) : (
                    <span className="text-[11px] text-white/40 italic">Denied</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Comprehensive Student Outpass Form Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onSubmit={handleStudentSubmit}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              className="glass w-full max-w-lg space-y-4 rounded-3xl p-6 border border-white/15 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileClock className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-sm font-bold text-white">Full Outpass Permission Application</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="text-white/45 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-white/70">Outpass Category</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
                  >
                    <option value="Night Outpass">Night Outpass</option>
                    <option value="Weekend Home Visit">Weekend Home Visit</option>
                    <option value="Emergency Outpass">Emergency Outpass</option>
                    <option value="Special Permission">Special Academic Leave</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-white/70">Travel Mode</label>
                  <select
                    value={form.travelMode}
                    onChange={(e) => setForm({ ...form, travelMode: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
                  >
                    <option value="Bus">Bus / Public Transit</option>
                    <option value="Train">Train (Railways)</option>
                    <option value="Personal Vehicle">Personal Vehicle / Bike</option>
                    <option value="Flight">Flight</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-white/70">Destination Address & City</label>
                <input
                  required
                  type="text"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="e.g. Door 42, Cross Street, Gandhipuram, Coimbatore"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-white/70">Detailed Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Explain purpose of leaving campus..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-primary"
                />
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-white/70">Out Date & Time</label>
                  <input
                    required
                    type="date"
                    value={form.outDate}
                    onChange={(e) => setForm({ ...form, outDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-primary [color-scheme:dark]"
                  />
                  <input
                    type="text"
                    value={form.outTime}
                    onChange={(e) => setForm({ ...form, outTime: e.target.value })}
                    placeholder="e.g. 05:00 PM"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-white/70">Expected Return Date & Time</label>
                  <input
                    required
                    type="date"
                    value={form.inDate}
                    onChange={(e) => setForm({ ...form, inDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-primary [color-scheme:dark]"
                  />
                  <input
                    type="text"
                    value={form.inTime}
                    onChange={(e) => setForm({ ...form, inTime: e.target.value })}
                    placeholder="e.g. 08:00 PM"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Parent Consent Section */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-2">
                <label className="block text-xs font-semibold text-white/80">Parent / Guardian Verification</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <input
                    type="tel"
                    required
                    value={form.parentPhone}
                    onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                    placeholder="Parent Phone Number"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
                <label className="flex items-center gap-2 text-[11px] text-white/70 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.parentConfirmed}
                    onChange={(e) => setForm({ ...form, parentConfirmed: e.target.checked })}
                    className="rounded border-white/20 bg-white/10 text-primary focus:ring-0"
                  />
                  I confirm parent/guardian verbal consent has been verified by phone.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white shadow-liquid"
                >
                  Submit for Chief Warden Permission
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital QR Outpass Modal */}
      <Modal open={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Digital Gate QR Outpass">
        {selectedPass && (
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-2 shadow-2xl">
              <QrCode className="h-32 w-32 text-slate-900" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-mono text-primary font-bold">{selectedPass.id}</p>
              <p className="text-sm font-bold text-white">{selectedPass.studentName}</p>
              <p className="text-white/60">{selectedPass.regNo} · Room {selectedPass.room}</p>
              <p className="text-emerald-400 font-semibold pt-1">✓ Authorized by Chief Warden</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
