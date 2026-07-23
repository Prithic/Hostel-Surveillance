import { useState } from 'react'
import { Mail } from 'lucide-react'
import Modal from './Modal'
import { sendForgotPasswordEmail } from '../services/api'

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function reset() {
    setEmail('')
    setError('')
    setMessage('')
    setLoading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    const trimmed = email.trim().toLowerCase()

    if (!trimmed || !trimmed.includes('@') || !trimmed.endsWith('@srishakthi.ac.in')) {
      setError('Please login using your official Sri Shakthi Institute email.')
      return
    }

    setLoading(true)

    try {
      const successMsg = await sendForgotPasswordEmail(trimmed)
      setLoading(false)
      setMessage(successMsg || 'Password reset link has been sent to your registered email.')
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Please login using your official Sri Shakthi Institute email.')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Reset Password">
      {message ? (
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium text-emerald-400">{message}</p>
          <button
            onClick={handleClose}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-white/70">Enter your official Sri Shakthi email</p>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sharanml25@srishakthi.ac.in"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-white/35"
            />
          </div>
          {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </Modal>
  )
}
