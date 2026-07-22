import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import { loginAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from '../auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (loginAdmin(email, password)) {
      setError('')
      navigate('/security')
    } else {
      setError('Invalid admin credentials.')
    }
  }

  function handleDemoAccess() {
    setLoading(true)
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
    setTimeout(() => {
      loginAdmin(ADMIN_EMAIL, ADMIN_PASSWORD)
      setLoading(false)
      navigate('/security')
    }, 450)
  }

  return (
    <AnimatedBackground>
      <button
        onClick={() => navigate('/login')}
        className="fixed left-6 top-6 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" /> Student login
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
            <h1 className="font-display text-xl font-semibold text-white">Restricted access</h1>
            <p className="mt-1 text-sm text-white/50">Security Dashboard — admin sign-in only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="liquid-input relative rounded-xl">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none"
              />
            </div>

            <div className="liquid-input relative rounded-xl">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 outline-none"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}

            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="flex w-full items-center justify-center gap-2 rounded-xl liquid-tint-danger py-2.5 text-sm font-medium text-white shadow-liquid transition">
              Sign in as admin <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide text-white/30">
            <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDemoAccess}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:opacity-70"
          >
            <KeyRound className="h-4 w-4 text-danger" />
            Continue with demo admin access
          </motion.button>
        </motion.div>
      </div>
    </AnimatedBackground>
  )
}
