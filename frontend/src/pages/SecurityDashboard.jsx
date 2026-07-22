import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, ShieldAlert, Users, VideoOff, Activity, LogOut } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { logoutAdmin } from '../auth'

const API = import.meta.env.VITE_API_URL || ''
const levelTone = { critical: 'danger', high: 'danger', medium: 'warning', low: 'info' }

export default function SecurityDashboard() {
  const navigate = useNavigate()
  const [status, setStatus] = useState({ camera_online: false, fps: 0, person_count: 0, camera_id: '—' })
  const [alerts, setAlerts] = useState([])
  const [incidents, setIncidents] = useState([])
  const [cfg, setCfg] = useState(null)
  const [error, setError] = useState('')

  function handleAdminLogout() {
    logoutAdmin()
    navigate('/admin-login')
  }

  async function refresh() {
    try {
      const [s, a, i, c] = await Promise.all([
        fetch(`${API}/api/status`).then((r) => r.json()),
        fetch(`${API}/api/alerts?limit=20`).then((r) => r.json()),
        fetch(`${API}/api/incidents?limit=20`).then((r) => r.json()),
        fetch(`${API}/api/config`).then((r) => r.json()).catch(() => null),
      ])
      setStatus(s)
      setAlerts(a)
      setIncidents(i)
      if (c && Object.keys(c).length) setCfg(c)
      setError('')
    } catch (e) {
      setError('Backend offline — start backend: uvicorn backend.main:app --host 127.0.0.1 --port 8000')
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

  async function resolveIncident(id) {
    try {
      await fetch(`${API}/api/incidents/${id}`, { method: 'PATCH' })
      // Optimistically update UI; next poll will confirm
      setIncidents((prev) => prev.map((i) => i.id === id ? { ...i, status: 'resolved' } : i))
    } catch { /* ignore — next refresh will sync */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/45">Signed in as security admin — live AI video feed & alerts enabled.</p>
        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-danger/40 hover:text-danger"
        >
          <LogOut className="h-3.5 w-3.5" /> End admin session
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Camera} label="Camera Feed" value={status.camera_online ? 'Online' : 'Offline'} tone={status.camera_online ? 'success' : 'danger'} />
        <StatCard icon={Users} label="People Tracked" value={String(status.person_count ?? 0)} tone="primary" />
        <StatCard icon={ShieldAlert} label="Active Alerts" value={String(alerts.length)} tone="danger" />
        <StatCard icon={Activity} label="Pipeline FPS" value={(status.fps ?? 0).toFixed?.(1) ?? '0'} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live camera stream */}
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold text-white">Live AI CCTV Stream</h2>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-ink">
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
                <p className="text-xs text-white/50">Event-based surveillance — no facial recognition stored</p>
              </div>
            )}
            {status.camera_online && (
              <div className="flex items-center justify-between px-3 py-2 text-xs text-white/70">
                <span>Camera: {status.camera_id}</span>
                <Badge tone="success">online</Badge>
              </div>
            )}
          </div>
        </GlassCard>

        {/* System metrics */}
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-white">AI Engine Status</h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex justify-between border-b border-white/10 pb-2"><span>Health State:</span> <span className="font-semibold text-white">{error ? 'Degraded' : 'Operational'}</span></li>
            <li className="flex justify-between border-b border-white/10 pb-2"><span>YOLO Detection FPS:</span> <span className="font-semibold text-white">{(status.fps ?? 0).toFixed?.(1) ?? 0}</span></li>
            <li className="flex justify-between border-b border-white/10 pb-2"><span>Current Tracking Count:</span> <span className="font-semibold text-white">{status.person_count ?? 0}</span></li>
            <li className="flex justify-between border-b border-white/10 pb-2"><span>Crowd Threshold:</span> <span className="font-semibold text-white">{cfg ? `${cfg.crowd_threshold} people` : '—'}</span></li>
            <li className="flex justify-between border-b border-white/10 pb-2"><span>Night Hours:</span> <span className="font-semibold text-white">{cfg ? `${cfg.night_start_hour}:00 – ${cfg.night_end_hour}:00` : '—'}</span></li>
            <li className="flex justify-between border-b border-white/10 pb-2"><span>Inference Device:</span> <span className="font-semibold text-white">{cfg?.device ?? '—'}</span></li>
            <li className="flex justify-between pb-1"><span>Total Incidents Logged:</span> <span className="font-semibold text-white">{incidents.length}</span></li>
          </ul>
        </GlassCard>
      </div>

      {/* Alert Feed */}
      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Real-Time Security Alerts (WebSocket)</h2>
        <div className="space-y-3">
          {alerts.length === 0 && <p className="text-sm text-white/50">No active alerts recorded yet.</p>}
          {alerts.map((a) => (
            <motion.div
              key={a.id + (a.last_seen || a.timestamp || '')}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${a.severity === 'high' || a.severity === 'critical' ? 'bg-danger' : a.severity === 'medium' ? 'bg-warning' : 'bg-primary'}`} />
                <div>
                  <p className="text-sm text-white">{a.reason}</p>
                  <p className="text-xs text-white/45">{a.id} · {a.camera_id} · tracks [{(a.track_ids || []).join(', ')}] · {a.timestamp}</p>
                </div>
              </div>
              <Badge tone={levelTone[a.severity] || 'info'}>{a.severity}</Badge>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Incident History Log */}
      <GlassCard hover={false} className="p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Incident History Log</h2>
        <div className="space-y-2">
          {incidents.length === 0 && <p className="text-sm text-white/50">No incidents logged.</p>}
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                inc.status === 'resolved' ? 'border-success/20 bg-success/5' : 'border-white/10'
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-white">{inc.reason}</p>
                <p className="text-xs text-white/40">{inc.id} · {inc.incident_type?.replace(/_/g, ' ')} · {inc.timestamp?.slice(0, 19)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={levelTone[inc.severity] || 'info'}>{inc.severity}</Badge>
                {inc.status === 'resolved'
                  ? <span className="text-xs font-medium text-success">resolved</span>
                  : (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="rounded-lg border border-success/30 px-2 py-1 text-xs text-success/80 transition hover:bg-success/10 hover:text-success"
                    >
                      Resolve
                    </button>
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

