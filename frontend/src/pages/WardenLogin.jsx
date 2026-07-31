import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Navigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight, User, Shirt } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import { login, getRole } from '../services/guardianApi'
import { isWardenAuthed } from '../auth'

const QUICK_LOGINS = [
  {
    id: 'warden',
    label: 'Login as Warden',
    email: 'admin@guardian.ai',
    password: 'Warden@2026',
    Icon: ShieldCheck,
    className: 'border-rose-500/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25',
  },
  {
    id: 'student',
    label: 'Login as Student',
    email: 'student@hostel.local',
    password: 'Student@2026',
    Icon: User,
    className: 'border-sky-500/40 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25',
  },
  {
    id: 'laundry',
    label: 'Login as Laundry',
    email: 'laundry@hostel.local',
    password: 'Laundry@2026',
    Icon: Shirt,
    className: 'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25',
  },
]

export default function WardenLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isWardenAuthed()) {
    return <Navigate to="/dashboard" replace />
  }

  async function signIn(nextEmail, nextPassword) {
    setError('')
    setLoading(true)
    setEmail(nextEmail)
    setPassword(nextPassword)
    try {
      await login(nextEmail.trim(), nextPassword)
      navigate(getRole() === 'Warden' ? '/security' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await signIn(email, password)
  }

  return (
    <AnimatedBackground>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="fixed left-6 top-6 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </button>

      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="glass w-full max-w-sm rounded-[2rem] p-8 shadow-glass"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl liquid-tint-danger text-white shadow-liquid">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-white">Trinity Engine</h1>
            <p className="mt-1 text-xs text-white/60">One-click demo login, or sign in manually</p>
          </div>

          <div className="mb-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Quick login</p>
            {QUICK_LOGINS.map(({ id, label, email: e, password: p, Icon, className }) => (
              <button
                key={id}
                type="button"
                disabled={loading}
                onClick={() => signIn(e, p)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition disabled:opacity-60 ${className}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {loading ? 'Signing in…' : label}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-white/35">
            <span className="h-px flex-1 bg-white/10" />
            or manual
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Email</label>
              <div className="liquid-input relative rounded-xl">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email"
                  className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Password</label>
              <div className="liquid-input relative rounded-xl">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs font-medium text-rose-400">{error}</p>}

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl liquid-tint-danger py-2.5 text-sm font-medium text-white shadow-liquid transition disabled:opacity-70"
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  Enter command center <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatedBackground>
  )
}
