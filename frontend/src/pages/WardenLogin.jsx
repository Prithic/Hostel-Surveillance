import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Navigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import { login } from '../services/guardianApi'
import { isWardenAuthed } from '../auth'

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

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
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
            <p className="mt-1 text-xs text-white/60">Sign in with a real account — passwords are hashed in SQLite</p>
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
                  placeholder="warden email"
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
              {loading ? 'Signing in…' : (
                <>
                  Enter command center <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 space-y-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/55">
            <p className="font-semibold text-white/70">Bootstrap accounts</p>
            <p>Warden: admin@guardian.ai / Warden@2026</p>
            <p>Student: student@hostel.local / Student@2026</p>
            <p>Laundry: laundry@hostel.local / Laundry@2026</p>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  )
}
