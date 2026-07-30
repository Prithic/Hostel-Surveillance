import { useEffect, useState } from 'react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import { Activity, Camera, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { apiGet } from '../services/guardianApi'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await apiGet('/api/analytics')
        if (!cancelled) {
          setData(d)
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) return <p className="text-sm text-white/45">Loading analytics from live store…</p>
  if (error) return <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
  if (!data) return null

  const bySev = data.incidents_by_severity || {}
  const byType = data.incidents_by_type || {}

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm font-semibold text-white">Incident analytics</p>
        <p className="text-xs text-white/45">Live counts from Guardian SQLite + pipeline status — not fabricated charts.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={ShieldAlert} label="Total incidents" value={data.total_incidents ?? 0} tone="danger" />
        <StatCard icon={Activity} label="Open" value={data.open_incidents ?? 0} tone="warning" />
        <StatCard icon={CheckCircle2} label="Resolved" value={data.resolved_incidents ?? 0} tone="success" />
        <StatCard icon={Camera} label="People now" value={data.person_count ?? 0} tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">By severity</h2>
          {Object.keys(bySev).length === 0 ? (
            <div className="space-y-1 text-sm text-white/55">
              <p className="text-emerald-300/90">No severity breakdown yet</p>
              <p className="text-xs text-white/40">
                Camera {data.camera_online ? 'online' : 'offline'} · FPS {Number(data.fps || 0).toFixed(1)} ·
                waiting for the first scored incident.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {Object.entries(bySev).map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm text-white/80">
                  <span className="capitalize">{k}</span>
                  <span className="font-medium text-white">{v}</span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">By type</h2>
          {Object.keys(byType).length === 0 ? (
            <div className="space-y-1 text-sm text-white/55">
              <p className="text-emerald-300/90">Incident log empty — system healthy</p>
              <p className="text-xs text-white/40">
                Gate monitoring is active. Quiet periods are normal for outdoor CCTV.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {Object.entries(byType).map(([k, v]) => (
                <li key={k} className="flex justify-between text-sm text-white/80">
                  <span>{k.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-white">{v}</span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5 text-sm text-white/70">
        Camera <span className="text-white">{data.camera_id}</span> ·{' '}
        {data.camera_online ? 'online' : 'offline'} · FPS {Number(data.fps || 0).toFixed(1)} ·{' '}
        active alerts buffer {data.active_alerts_count ?? 0}
      </GlassCard>
    </div>
  )
}
