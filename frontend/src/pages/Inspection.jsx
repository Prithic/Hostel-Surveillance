import { useState } from 'react'
import { ClipboardList, CalendarClock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

const toneMap = { Passed: 'success', Warning: 'warning', Failed: 'danger' }

export default function Inspection() {
  const { data, loading, error, append, replaceKey } = useHostel()
  const { isAdminRole } = useRoleCheck()
  const [next, setNext] = useState(null)
  const [log, setLog] = useState({ date: '', result: 'Passed', remarks: '' })
  const [msg, setMsg] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const inspections = data.inspections || []
  const nextInspection = next || data.nextInspection || { date: '', block: '', notes: '' }

  async function saveNext(e) {
    e.preventDefault()
    await replaceKey('nextInspection', nextInspection)
    setMsg('Next inspection saved.')
  }

  async function addLog(e) {
    e.preventDefault()
    if (!log.date || !log.remarks.trim()) return
    await append('inspections', {
      id: Date.now(),
      date: log.date,
      result: log.result,
      remarks: log.remarks.trim(),
    })
    setLog({ date: '', result: 'Passed', remarks: '' })
    setMsg('Inspection logged.')
  }

  return (
    <div className="space-y-6">
      {msg && <p className="text-xs text-emerald-400">{msg}</p>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard hover={false} className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Inspection history</h2>
          </div>
          <div className="space-y-3">
            {inspections.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm text-white">{i.remarks}</p>
                  <p className="text-xs text-white/45">{i.date}</p>
                </div>
                <Badge tone={toneMap[i.result] || 'neutral'}>{i.result}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="h-fit space-y-3 p-5">
          <div className="mb-1 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Next inspection</h2>
          </div>
          {isAdminRole ? (
            <form onSubmit={saveNext} className="space-y-2">
              <input
                type="date"
                value={nextInspection.date || ''}
                onChange={(e) => setNext({ ...nextInspection, date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />
              <input
                value={nextInspection.block || ''}
                onChange={(e) => setNext({ ...nextInspection, block: e.target.value })}
                placeholder="Block"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
              <textarea
                value={nextInspection.notes || ''}
                onChange={(e) => setNext({ ...nextInspection, notes: e.target.value })}
                placeholder="Notes"
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
              <button className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">Save schedule</button>
            </form>
          ) : (
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-sm font-medium text-white">{nextInspection.block || 'TBD'}</p>
              <p className="mt-1 text-xs text-white/45">Scheduled for {nextInspection.date || '—'}</p>
              <p className="mt-2 text-xs text-white/45">{nextInspection.notes}</p>
            </div>
          )}
        </GlassCard>
      </div>

      {isAdminRole && (
        <GlassCard hover={false} className="p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-white">Log inspection result</h3>
          <form onSubmit={addLog} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              type="date"
              value={log.date}
              onChange={(e) => setLog({ ...log, date: e.target.value })}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
            />
            <select
              value={log.result}
              onChange={(e) => setLog({ ...log, result: e.target.value })}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option>Passed</option>
              <option>Warning</option>
              <option>Failed</option>
            </select>
            <input
              value={log.remarks}
              onChange={(e) => setLog({ ...log, remarks: e.target.value })}
              placeholder="Remarks"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-1"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Add log</button>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
