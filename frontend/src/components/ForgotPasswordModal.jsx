import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'

// Fully client-side simulation of a "forgot password" flow:
// step 1: email -> "send" a 6-digit code (shown in a toast since there is
// no backend yet — a real backend just needs to email it instead).
// step 2: verify the code.
// step 3: set a new password.
// step 4: success.
export default function ForgotPasswordModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [error, setError] = useState('')

  function reset() {
    setStep(1); setEmail(''); setCode(''); setSentCode(''); setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function sendCode(e) {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    const fake = String(Math.floor(100000 + Math.random() * 900000))
    setSentCode(fake)
    setError('')
    setStep(2)
  }

  function verifyCode(e) {
    e.preventDefault()
    if (code !== sentCode) { setError('Incorrect code, please try again'); return }
    setError('')
    setStep(3)
  }

  function resetPassword(e) {
    e.preventDefault()
    setStep(4)
  }

  return (
    <Modal open={open} onClose={handleClose} title={step < 4 ? 'Reset password' : 'All set'}>
      {step === 1 && (
        <form onSubmit={sendCode} className="space-y-4">
          <p className="text-sm text-slate-500">Enter your account email and we'll send a 6-digit verification code.</p>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Send verification code
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyCode} className="space-y-4">
          <p className="text-sm text-slate-500">
            A code was "sent" to <span className="font-medium text-ink2">{email}</span>.
            Since this is a frontend-only demo, here it is: <span className="font-mono font-semibold text-primary">{sentCode}</span>
          </p>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={code} onChange={(e) => setCode(e.target.value)} maxLength={6}
              placeholder="6-digit code"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Verify code
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword} className="space-y-4">
          <p className="text-sm text-slate-500">Choose a new password for your account.</p>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password" required minLength={6}
              placeholder="New password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Reset password
          </button>
        </form>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" />
          <p className="text-sm text-slate-500">Password updated. You can now sign in with your new password.</p>
          <button onClick={handleClose} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Back to login
          </button>
        </motion.div>
      )}
    </Modal>
  )
}
