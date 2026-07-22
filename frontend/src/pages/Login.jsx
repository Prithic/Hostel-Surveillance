import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import ForgotPasswordModal from '../components/ForgotPasswordModal'

const DEMO_EMAIL = 'student@gmail.com'
const DEMO_PASSWORD = '123456'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setError('')
      navigate('/dashboard')
    } else {
      setError('Invalid credentials — try the demo login below.')
    }
  }

  return (
    <AnimatedBackground>
      <button
        onClick={() => navigate('/')}
        className="fixed left-6 top-6 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70 backdrop-blur-md transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </button>

      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass w-full max-w-sm rounded-2xl p-8 shadow-glass"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="font-display text-xl font-semibold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-white/50">Sign in to your NestOS account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/60">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 rounded border-white/20 accent-primary" />
                Remember me
              </label>
              <button type="button" onClick={() => setForgotOpen(true)} className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}

            <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-glow transition hover:bg-primary/90">
              Login
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/45">
            Demo login — <span className="font-mono text-white/70">student@gmail.com</span> / <span className="font-mono text-white/70">123456</span>
          </div>
        </motion.div>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AnimatedBackground>
  )
}
