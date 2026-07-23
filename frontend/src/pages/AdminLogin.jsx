import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import { loginAdminUser } from '../services/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmed = username.trim().toLowerCase()

    if (!trimmed || !trimmed.endsWith('@srishakthi.ac.in')) {
      setError('Please login using your official Sri Shakthi Institute email.')
      return
    }

    if (!password || password.length < 8 || password.length > 32) {
      setError('Incorrect password.')
      return
    }

    setLoading(true)

    try {
      await loginAdminUser(trimmed, password)
      setLoading(false)
      navigate('/security')
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Incorrect password.')
    }
  }

  return (
    <AnimatedBackground>
      <button
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
            <h1 className="font-display text-xl font-bold text-white tracking-tight">Trinity Engine Admin</h1>
            <p className="mt-1 text-xs text-white/60">Admin Portal — Official Sri Shakthi Institute Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Admin Username</label>
              <div className="liquid-input relative rounded-xl">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_hostel@srishakthi.ac.in"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
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
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                />
              ) : (
                <>
                  Sign In to Admin Portal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatedBackground>
  )
}

