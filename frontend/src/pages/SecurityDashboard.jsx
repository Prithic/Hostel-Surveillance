import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, ShieldAlert, Activity, Video, LogOut, RefreshCw } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { logoutAdmin } from '../auth'

const GUARDIAN_API = import.meta.env.VITE_GUARDIAN_API_URL || ''
const GUARDIAN_EMAIL = import.meta.env.VITE_GUARDIAN_ADMIN_EMAIL || 'admin@guardian.ai'
const GUARDIAN_PASSWORD = import.meta.env.VITE_GUARDIAN_ADMIN_PASSWORD || 'Warden@2026'

async function guardianLogin() {
  const res = await fetch(`${GUARDIAN_API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: GUARDIAN_EMAIL, password: GUARDIAN_PASSWORD }),
  })
  if (!res.ok) throw new Error('Guardian auth failed')
  const data = await res.json()
  sessionStorage.setItem('guardian_token', data.token)
  return data.token
}

function authHeaders() {
  const token = sessionStorage.getItem('guardian_token') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function guardianGet(path) {
  let res = await fetch(`${GUARDIAN_API}${path}`, { credentials: 'include', headers: authHeaders() })
  if (res.status === 401) {
    await guardianLogin()
    res = await fetch(`${GUARDIAN_API}${path}`, { credentials: 'include', headers: authHeaders() })
  }
  if (!res.ok) throw new Error(`api ${res.status}`)
  return res.json()
}

async function guardianPatch(path) {
  let res = await fetch(`${GUARDIAN_API}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  })
  if (res.status === 401) {
    await guardianLogin()
    res = await fetch(`${GUARDIAN_API}${path}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    })
  }
  if (!res.ok) throw new Error(`api ${res.status}`)
  return res.json()
}

const levelTone = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info' }

export default function SecurityDashboard() {
  const navigate = useNavigate()
  const streamSrc = `${GUARDIAN_API}/api/stream`
  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)

  async function refresh() {
    try {
      const [st, inc] = await Promise.all([
        guardianGet('/api/status'),
        guardianGet('/api/incidents?limit=20'),
      ])
      setStatus(st)
      setIncidents(Array.isArray(inc) ? inc : [])
      setError('')
    } catch (e) {
      setError(e.message || 'Backend unreachable')
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await guardianLogin()
        if (!cancelled) await refresh()
      } catch (e) {
        if (!cancelled) setError('Start GuardianAI: uvicorn backend.main:app --port 8000')
      }
    })()
    const t = setInterval(() => { if (!cancelled) refresh() }, 4000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  async function resolve(id) {
    setBusy(id)
    try {
      await guardianPatch(`/api/incidents/${id}`)
      await refresh()
    } catch {
      setError('Resolve failed')
    } finally {
      setBusy(null)
    }
  }

  function handleAdminLogout() {
    sessionStorage.removeItem('guardian_token')
    logoutAdmin()
    navigate('/admin-login')
  }

  const openCount = incidents.filter((i) => i.status === 'open').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-white">GuardianAI Command Center</p>
          <p className="text-xs text-white/45">Live CCTV intelligence — no facial recognition.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-danger/40 hover:text-danger"
          >
            <LogOut className="h-3.5 w-3.5" /> End admin session
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={Camera}
          label="Camera"
          value={status?.camera_online ? 'Online' : 'Offline'}
          tone={status?.camera_online ? 'success' : 'danger'}
        />
        <StatCard icon={Activity} label="FPS" value={status ? Number(status.fps || 0).toFixed(1) : '—'} tone="primary" />
        <StatCard icon={Video} label="People" value={status?.person_count ?? '—'} tone="warning" />
        <StatCard icon={ShieldAlert} label="Open incidents" value={openCount} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <GlassCard hover={false} className="overflow-hidden p-0 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <h2 className="font-display text-sm font-semibold text-white">Annotated CCTV feed</h2>
            <Badge tone={status?.camera_online ? 'success' : 'danger'}>
              {status?.camera_online ? 'LIVE' : 'DOWN'}
            </Badge>
          </div>
          <div className="bg-ink p-3">
            <img
              src={streamSrc}
              alt="GuardianAI live stream"
              className="mx-auto max-h-[420px] w-full rounded-xl object-contain"
            />
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">Incidents</h2>
          <div className="max-h-[420px] space-y-2 overflow-y-auto">
            {incidents.length === 0 && (
              <p className="text-sm text-white/45">No incidents yet — pipeline is watching.</p>
            )}
            {incidents.map((inc) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white">{inc.reason}</p>
                    <p className="mt-0.5 text-[11px] text-white/40">
                      {inc.id} · {inc.incident_type} · {String(inc.timestamp || '').slice(0, 19)}
                    </p>
                  </div>
                  <Badge tone={levelTone[(inc.severity || '').toLowerCase()] || 'info'}>
                    {(inc.severity || '').toUpperCase()}
                  </Badge>
                </div>
                {inc.status === 'open' && (
                  <button
                    type="button"
                    disabled={busy === inc.id}
                    onClick={() => resolve(inc.id)}
                    className="mt-2 rounded-lg bg-primary/20 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/30 disabled:opacity-50"
                  >
                    {busy === inc.id ? 'Resolving…' : 'Resolve'}
                  </button>
                )}
                {inc.status === 'resolved' && (
                  <p className="mt-1 text-[11px] text-success">Resolved</p>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
