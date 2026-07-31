import { useEffect, useState } from 'react'
import GlassCard from '../components/GlassCard'
import { apiGet, apiPut } from '../services/guardianApi'
import { useRoleCheck } from '../hooks/useRoleCheck'

export default function ConfigPage() {
  const { isAdminRole } = useRoleCheck()
  const [data, setData] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const d = await apiGet('/api/config')
        if (!cancelled) {
          setData(d)
          setForm({
            confidence_threshold: d.confidence_threshold,
            crowd_threshold: d.crowd_threshold,
            night_start_hour: d.night_start_hour,
            night_end_hour: d.night_end_hour,
          })
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load config')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function save(e) {
    e.preventDefault()
    if (!isAdminRole) return
    setBusy(true)
    setMsg('')
    try {
      const updated = await apiPut('/api/config', {
        confidence_threshold: Number(form.confidence_threshold),
        crowd_threshold: Number(form.crowd_threshold),
        night_start_hour: Number(form.night_start_hour),
        night_end_hour: Number(form.night_end_hour),
      })
      setData(updated)
      setMsg('Runtime config updated (live — no restart).')
    } catch (err) {
      setMsg(err.message || 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p className="text-sm text-white/45">Loading runtime configuration…</p>
  if (error) return <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-white/45">Pipeline not started — no config available.</p>
  }

  const rows = [
    ['Camera ID', data.camera_id],
    ['Video source', data.source],
    ['Device', data.device],
    ['Model path', data.model_path],
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm font-semibold text-white">Runtime configuration</p>
        <p className="text-xs text-white/45">
          Detection thresholds can be edited live. Video/webcam can be switched from Security (with seek). Model path still needs restart.
        </p>
      </div>

      <GlassCard hover={false} className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b border-white/10 last:border-0">
                <th className="px-5 py-3 font-medium text-white/55">{k}</th>
                <td className="px-5 py-3 font-mono text-xs text-white">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {isAdminRole && form && (
        <GlassCard hover={false} className="p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-white">Editable thresholds</h3>
          <form onSubmit={save} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['confidence_threshold', 'Detection confidence (0–1)'],
              ['crowd_threshold', 'Crowd person threshold'],
              ['night_start_hour', 'Night window start hour'],
              ['night_end_hour', 'Night window end hour'],
            ].map(([key, label]) => (
              <label key={key} className="block text-xs text-white/55">
                {label}
                <input
                  type="number"
                  step={key === 'confidence_threshold' ? '0.05' : '1'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                />
              </label>
            ))}
            <div className="flex items-center gap-3 sm:col-span-2">
              <button
                disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Apply live'}
              </button>
              {msg && <span className="text-xs text-emerald-400">{msg}</span>}
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
