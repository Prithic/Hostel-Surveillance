import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ensureWardenSession, isWardenAuthed } from '../auth'

export default function RequireWarden({ children }) {
  const [state, setState] = useState(isWardenAuthed() ? 'checking' : 'no')

  useEffect(() => {
    let cancelled = false
    if (!isWardenAuthed()) {
      setState('no')
      return
    }
    ;(async () => {
      const ok = await ensureWardenSession()
      if (!cancelled) setState(ok ? 'yes' : 'no')
    })()
    return () => { cancelled = true }
  }, [])

  if (state === 'no') return <Navigate to="/login" replace />
  if (state === 'checking') {
    return (
      <p className="p-8 text-sm text-white/55">Checking warden session…</p>
    )
  }
  return children
}
