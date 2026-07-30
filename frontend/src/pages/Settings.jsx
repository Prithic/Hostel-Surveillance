import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, ShieldCheck } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useHostel } from '../hostel/HostelContext'
import { getDisplayName, getEmail, getRole, me } from '../services/guardianApi'

const labels = {
  complaintUpdates: 'Complaint status updates',
  noticeAlerts: 'New notice alerts',
  feeReminders: 'Fee due reminders',
  laundryReady: 'Laundry ready alerts',
  messFeedback: 'Mess feedback prompts',
}

export default function Settings() {
  const { data, loading, error, replaceKey } = useHostel()
  const [prefs, setPrefs] = useState(null)
  const [session, setSession] = useState({
    name: getDisplayName(),
    email: getEmail(),
    role: getRole(),
    room: '',
    student_id: '',
  })

  useEffect(() => {
    me()
      .then((u) => {
        setSession({
          name: u?.name || getDisplayName(),
          email: u?.email || getEmail(),
          role: u?.role || getRole(),
          room: u?.room || '',
          student_id: u?.student_id || '',
        })
      })
      .catch(() => {})
  }, [])

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const notificationPrefs = data.notificationPrefs
  const livePrefs = prefs || notificationPrefs
  const initials = (session.name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  function toggle(key) {
    setPrefs((p) => {
      const base = p || notificationPrefs
      const next = { ...base, [key]: !base[key] }
      replaceKey('notificationPrefs', next)
      return next
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false} className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-white">Profile</h2>
        </div>
        <p className="mb-4 text-[11px] text-white/40">
          Identity comes from your login account (not shared hostel seed). Change password below if needed.
        </p>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full liquid-tint-primary text-lg font-semibold text-white shadow-liquid">
            {initials}
          </div>
          <div>
            <p className="font-display text-base font-semibold text-white">{session.name || '—'}</p>
            <p className="text-xs text-white/45">{session.role || '—'}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            ['Name', session.name],
            ['Email', session.email],
            ['Role', session.role],
            ['Student ID', session.student_id || '—'],
            ['Room', session.room || '—'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs text-white/45">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-white">{value || '—'}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Notification preferences</h2>
          </div>
          <p className="mb-3 text-[11px] text-white/40">
            Controls in-app bell channels. External SMS/WhatsApp/email are not connected in this build.
          </p>
          <div className="space-y-1">
            {Object.keys(livePrefs).map((key) => (
              <label key={key} className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 transition hover:bg-white/5">
                <span className="text-sm text-white">{labels[key] || key}</span>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${livePrefs[key] ? 'liquid-tint-primary' : 'bg-white/15'}`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                    style={{ left: livePrefs[key] ? 'calc(100% - 22px)' : '2px' }}
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
          <PasswordForm />
        </GlassCard>
      </div>
    </div>
  )
}

function PasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const { apiPost } = await import('../services/guardianApi')
      await apiPost('/api/auth/password', { current_password: current, new_password: next })
      setMsg('Password updated.')
      setCurrent('')
      setNext('')
    } catch (err) {
      setMsg(err.message || 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        placeholder="Current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-primary"
        required
      />
      <input
        type="password"
        placeholder="New password (min 8)"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-primary"
        minLength={8}
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {busy ? 'Saving…' : 'Change password'}
      </button>
      {msg && <p className="text-xs text-white/55">{msg}</p>}
    </form>
  )
}
