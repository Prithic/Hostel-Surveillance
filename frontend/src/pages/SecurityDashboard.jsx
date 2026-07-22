import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, ShieldAlert, Users, VideoOff, Activity } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'

const API = import.meta.env.VITE_API_URL || ''
const levelTone = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info' }

export default function SecurityDashboard() {
  const [status, setStatus] = useState({ camera_online: false, fps: 0, person_count: 0, camera_id: '—' })
  const [alerts, setAlerts] = useState([])
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [s, a, i] = await Promise.all([
        fetch(`${API}/api/status`).then((r) => r.json()),
        fetch(`${API}/api/alerts?limit=20`).then((r) => r.json()),
        fetch(`${API}/api/incidents?limit=20`).then((r) => r.json()),
      ])
      setStatus(s)
      setAlerts(a)
      setIncidents(i)
      setError('')
    } catch (e) {
      setError('Backend offline — start: uvicorn backend.main:app --reload --port 8000')
    }
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 2000)
    let ws
    try {
      const wsUrl = (API || `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname}:8000`) + '/ws/alerts'
      ws = new WebSocket(API ? API.replace(/^http/, 'ws') + '/ws/alerts' : `ws://${location.hostname}:8000/ws/alerts`)
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg.type === 'alert' && msg.incident) {
            setAlerts((prev) => [msg.incident, ...prev].slice(0, 20))
          }
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    return () => {
      clearInterval(t)
      ws?.close()
    }
  }, [])

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">{error}</div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Camera} label="Camera" value={status.camera_online ? 'Online' : 'Offline'} tone={status.camera_online ? 'success' : 'danger'} />
        <StatCard icon={Users} label="People tracked" value={String(status.person_count ?? 0)} tone="primary" />
        <StatCard icon={ShieldAlert} label="Open alerts" value={String(alerts.length)} tone="danger" />
        <StatCard icon={Activity} label="Pipeline FPS" value={(status.fps ?? 0).toFixed?.(1) ?? '0'} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Live camera</h2>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-ink">
            {status.camera_online ? (
              <img
                src={`${API}/api/stream`}
                alt="Live CCTV feed"
                className="aspect-video w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <VideoOff className="h-10 w-10 text-danger" />
                <p className="text-sm font-medium text-white/90">{status.camera_id || 'webcam-0'}</p>
                <Badge tone="danger">offline</Badge>
                <p className="text-xs text-white/50">Event-based monitoring — no facial recognition</p>
              </div>
            )}
            {status.camera_online && (
              <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
                <span>{status.camera_id}</span>
                <Badge tone="success">online</Badge>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-ink2">System status</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Health: {error ? 'degraded' : 'ok'}</li>
            <li>FPS: {(status.fps ?? 0).toFixed?.(1) ?? 0}</li>
            <li>People: {status.person_count ?? 0}</li>
            <li>Incidents logged: {incidents.length}</li>
          </ul>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Alert panel</h2>
        <div className="space-y-3">
          {alerts.length === 0 && <p className="text-sm text-slate-400">No alerts yet — walk into a restricted zone to test.</p>}
          {alerts.map((a) => (
            <motion.div
              key={a.id + a.last_seen}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${a.severity === 'high' || a.severity === 'critical' ? 'bg-danger' : a.severity === 'medium' ? 'bg-warning' : 'bg-primary'}`} />
                <div>
                  <p className="text-sm text-ink2">{a.reason}</p>
                  <p className="text-xs text-slate-400">{a.id} · {a.camera_id} · tracks [{(a.track_ids || []).join(', ')}] · {a.timestamp}</p>
                </div>
              </div>
              <Badge tone={levelTone[a.severity] || 'info'}>{a.severity}</Badge>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-ink2">Incident history</h2>
        <div className="space-y-2">
          {incidents.map((i) => (
            <div key={i.id} className="flex justify-between rounded-lg border border-slate-50 px-3 py-2 text-sm">
              <span className="text-ink2">{i.id}: {i.incident_type}</span>
              <span className="text-slate-400">{i.severity}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
