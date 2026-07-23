import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Plus, Megaphone, X, Check, ShieldAlert, Sparkles } from 'lucide-react'
import Modal from './Modal'
import { useRoleCheck } from '../hooks/useRoleCheck'

export default function AdminFloatingBar() {
  const { isAdminRole } = useRoleCheck()
  const [tickerNotice, setTickerNotice] = useState('🚨 ALERT: Routine Electrical Inspection in Block B tomorrow 10:00 AM - 1:00 PM. Power backup active.')
  const [showTicker, setShowTicker] = useState(true)

  // Add Member Modal state
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [noticeModalOpen, setNoticeModalOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // New Member Form
  const [member, setMember] = useState({
    name: '',
    email: '',
    role: 'Student',
    department: 'AIML',
    hostelBlock: 'Block A',
    roomNumber: 'A-101',
  })

  // Urgent Notice Form
  const [noticeInput, setNoticeInput] = useState('')

  // HARD GUARD: If user is a Student, render 0 admin controls
  if (!isAdminRole) {
    return (
      <AnimatePresence>
        {showTicker && tickerNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-600 via-primary to-amber-600 px-4 py-1.5 text-xs text-white shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce text-amber-200" />
              <div className="font-semibold truncate tracking-wide">{tickerNotice}</div>
            </div>
            <button onClick={() => setShowTicker(false)} className="rounded p-0.5 hover:bg-white/20 text-white/80">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  function handleAddMember(e) {
    e.preventDefault()
    if (!member.name || !member.email) return

    setSuccessMsg(`Member ${member.name} (${member.role}) added successfully! Total records updated.`)
    setTimeout(() => {
      setSuccessMsg('')
      setMemberModalOpen(false)
      setMember({ name: '', email: '', role: 'Student', department: 'AIML', hostelBlock: 'Block A', roomNumber: 'A-101' })
    }, 1500)
  }

  function handleBroadcastNotice(e) {
    e.preventDefault()
    if (!noticeInput.trim()) return

    setTickerNotice(`📢 ${noticeInput.trim()}`)
    setShowTicker(true)
    setNoticeModalOpen(false)
    setNoticeInput('')
  }

  return (
    <>
      {/* Top Urgent Notice Ticker Banner */}
      <AnimatePresence>
        {showTicker && tickerNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-600 via-primary to-amber-600 px-4 py-1.5 text-xs text-white shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce text-amber-200" />
              <div className="font-semibold truncate tracking-wide">{tickerNotice}</div>
            </div>
            <button onClick={() => setShowTicker(false)} className="rounded p-0.5 hover:bg-white/20 text-white/80">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Control Bar — Only Visible to Admins */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 shadow-2xl border border-white/20"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 pr-2 border-r border-white/15">
            <Shield className="h-4 w-4 text-amber-400" /> Admin Controls
          </div>

          <button
            onClick={() => setMemberModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary/30 border border-primary/40 px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary/50"
          >
            <Plus className="h-3.5 w-3.5 text-primary" /> Add Member
          </button>

          <button
            onClick={() => setNoticeModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/30"
          >
            <Megaphone className="h-3.5 w-3.5" /> Broadcast Notice
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Master Search
          </button>
        </motion.div>
      </div>

      {/* Add Member Modal */}
      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add Campus Member (Calculate Total)">
        {successMsg ? (
          <div className="py-6 text-center text-xs text-emerald-400 space-y-2">
            <Check className="h-8 w-8 mx-auto text-emerald-400" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleAddMember} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block text-white/70">Full Name</label>
              <input
                type="text"
                required
                value={member.name}
                onChange={(e) => setMember({ ...member, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-white/70">Official Email</label>
              <input
                type="email"
                required
                value={member.email}
                onChange={(e) => setMember({ ...member, email: e.target.value })}
                placeholder="ramesh@srishakthi.ac.in"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-white/70">Assign Role</label>
                <select
                  value={member.role}
                  onChange={(e) => setMember({ ...member, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-primary"
                >
                  <option value="Student">Student</option>
                  <option value="Warden">Warden</option>
                  <option value="Security Staff">Security Staff</option>
                  <option value="Chief Warden">Chief Warden</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-white/70">Hostel Block</label>
                <input
                  type="text"
                  value={member.hostelBlock}
                  onChange={(e) => setMember({ ...member, hostelBlock: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-primary px-5 py-2 font-semibold text-white">
                Add & Recalculate Totals
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Broadcast Notice Modal */}
      <Modal open={noticeModalOpen} onClose={() => setNoticeModalOpen(false)} title="Broadcast Urgent Campus Ticker">
        <form onSubmit={handleBroadcastNotice} className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block text-white/70">Ticker Notice Message</label>
            <textarea
              rows={3}
              required
              value={noticeInput}
              onChange={(e) => setNoticeInput(e.target.value)}
              placeholder="e.g. Water shutdown in Block A between 2 PM - 4 PM..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNoticeModalOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-amber-500 font-semibold text-white">
              Broadcast Live Ticker
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
