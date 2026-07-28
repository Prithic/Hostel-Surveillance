import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, ShieldAlert, Activity, Video, RefreshCw } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { alertsWsUrl, apiGet, apiPatch, streamUrl } from '../services/guardianApi'

const levelTone = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info' }

export default function SecurityDashboard() {
  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [liveAlert, setLiveAlert] = useState(null)
  const [wsState, setWsState] = useState('connecting')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [st, inc] = await Promise.all([
        apiGet('/api/status'),
        apiGet('/api/incidents?limit=30'),
      ])
      setStatus(st)
      setIncidents(Array.isArray(inc) ? inc : [])
      setError('')
    } catch (e) {
      setError(e.message || 'Backend unreachable')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    // Status (FPS/people) needs a light poll; incidents primarily via WS.
    const t = setInterval(refresh, 8000)
    return () => clearInterval(t)
  }, [refresh])

  useEffect(() => {
    let ws
    let closed = false
    try {
      ws = new WebSocket(alertsWsUrl())
    } catch {
      setWsState('error')
      return undefined
    }
    ws.onopen = () => { if (!closed) setWsState('live') }
    ws.onclose = () => { if (!closed) setWsState('closed') }
    ws.onerror = () => { if (!closed) setWsState('error') }
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'alert' && msg.incident) {
          setLiveAlert(msg.incident)
          setIncidents((prev) => {
            const rest = prev.filter((i) => i.id !== msg.incident.id)
            return [msg.incident, ...rest]
          })
        }
      } catch {
        /* ignore malformed */
      }
    }
    return () => {
      closed = true
      ws.close()
    }
  }, [])

  async function resolve(id) {
    setBusy(id)
    try {
      await apiPatch(`/api/incidents/${id}`)
      await refresh()
    } catch (e) {
      setError(e.message || 'Resolve failed')
    } finally {
      setBusy(null)
    }
  }

  const openCount = incidents.filter((i) => i.status === 'open').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-white">What needs attention now</p>
          <p className="text-xs text-white/45">
            Live CCTV · no facial recognition · alerts {wsState === 'live' ? 'via WebSocket' : `WS ${wsState}`}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {liveAlert && liveAlert.status === 'open' && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-white">
          <span className="font-semibold text-warning">New alert:</span>{' '}
          [{(liveAlert.severity || '').toUpperCase()}] {liveAlert.reason}
          <span className="text-white/45"> · {liveAlert.id}</span>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
      )}
      {loading && !status && (
        <p className="text-sm text-white/45">Loading live status…</p>
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
              src={streamUrl()}
              alt="GuardianAI live stream"
              className="mx-auto max-h-[420px] w-full rounded-xl object-contain"
            />
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-1 font-display text-sm font-semibold text-white">Incidents</h2>
          <p className="mb-3 text-[11px] text-white/40">What · where/camera · when · severity · action</p>
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
                      {inc.id} · {inc.incident_type} · cam {inc.camera_id} · {String(inc.timestamp || '').slice(0, 19)}
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
