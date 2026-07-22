import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, User, Pencil, Check, X, ShieldCheck } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { currentUser, notificationPrefs } from '../data/dummyData'

const labels = {
  complaintUpdates: 'Complaint status updates',
  noticeAlerts: 'New notice alerts',
  feeReminders: 'Fee due reminders',
  laundryReady: 'Laundry ready alerts',
  messFeedback: 'Mess feedback prompts',
}

export default function Settings() {
  const [prefs, setPrefs] = useState(notificationPrefs)
  const [profile, setProfile] = useState(currentUser)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentUser)
  const [saved, setSaved] = useState(false)

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  function startEditing() {
    setDraft(profile)
    setEditing(true)
    setSaved(false)
  }

  function cancelEditing() {
    setEditing(false)
  }

  function saveEditing(e) {
    e.preventDefault()
    setProfile(draft)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const initials = profile.name.split(' ').map((n) => n[0]).join('')

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false} className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Profile</h2>
          </div>
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.button
                key="edit"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={startEditing}
                className="flex items-center gap-1.5 rounded-full liquid-tint-primary px-3 py-1.5 text-xs font-medium text-white shadow-liquid"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </motion.button>
            ) : (
              <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <button
                  onClick={cancelEditing}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  form="profile-edit-form"
                  type="submit"
                  className="flex items-center gap-1 rounded-full liquid-tint-success px-3 py-1.5 text-xs font-medium text-white shadow-liquid"
                >
                  <Check className="h-3.5 w-3.5" /> Save
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full liquid-tint-primary text-lg font-semibold text-white shadow-liquid">
            {initials}
          </div>
          <div>
            <p className="font-display text-base font-semibold text-white">{profile.name}</p>
            <p className="text-xs text-white/45">{profile.studentId}</p>
          </div>
        </div>

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-3 flex items-center gap-2 overflow-hidden rounded-2xl bg-success/10 px-3 py-2 text-xs font-medium text-success"
            >
              <Check className="h-3.5 w-3.5" /> Profile updated successfully
            </motion.div>
          )}
        </AnimatePresence>

        {!editing ? (
          <div className="space-y-3">
            {[
              ['Name', profile.name],
              ['Email', profile.email],
              ['Student ID', profile.studentId],
              ['Room', `${profile.room}, ${profile.block}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <form id="profile-edit-form" onSubmit={saveEditing} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-white/45">Name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/45">Email</label>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-white/45">Room</label>
                <input
                  value={draft.room}
                  onChange={(e) => setDraft((d) => ({ ...d, room: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/45">Block</label>
                <input
                  value={draft.block}
                  onChange={(e) => setDraft((d) => ({ ...d, block: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </form>
        )}
      </GlassCard>

      <div className="space-y-6">
        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Notification preferences</h2>
          </div>
          <div className="space-y-1">
            {Object.keys(prefs).map((key) => (
              <label key={key} className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 transition hover:bg-white/5">
                <span className="text-sm text-white">{labels[key]}</span>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${prefs[key] ? 'liquid-tint-primary' : 'bg-white/15'}`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                    style={{ left: prefs[key] ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Account security</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs text-white/45">Password</p>
              <p className="mt-0.5 text-sm font-medium text-white">Last changed — not tracked in this demo</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs text-white/45">Two-factor authentication</p>
              <p className="mt-0.5 text-sm font-medium text-white">Not enabled</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
