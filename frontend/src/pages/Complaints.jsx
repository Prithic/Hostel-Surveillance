import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

const tone = { Pending: 'warning', 'In Progress': 'info', Completed: 'success' }
const STATUSES = ['Pending', 'In Progress', 'Completed']

export default function Complaints() {
  const { data, loading, error, append, patchItem } = useHostel()
  const { isAdminRole } = useRoleCheck()
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading complaints…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const complaints = data.complaints || []
  const categories = data.complaintCategories || []

  async function onSubmit(e) {
    e.preventDefault()
    if (!category || !description.trim()) {
      setMsg('Category and description are required.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const id = `CMP-${Date.now().toString().slice(-4)}`
      await append('complaints', {
        id,
        category,
        description: description.trim(),
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
      })
      setDescription('')
      setMsg(`Saved ${id} to live store.`)
    } catch (err) {
      setMsg(err.message || 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false} className="p-6">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Raise a complaint</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/55">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-primary [color-scheme:dark]"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/55">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary"
            />
          </div>
          <div className="flex h-24 items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 text-sm text-white/35">
            <ImagePlus className="h-4 w-4" /> Image upload not enabled in this build
          </div>
          <button
            disabled={busy}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Submit complaint'}
          </button>
          {msg && <p className="text-center text-xs text-success">{msg}</p>}
        </form>
      </GlassCard>

      <GlassCard hover={false} className="p-6">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Complaint history (live)</h2>
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="rounded-lg border border-white/10 p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{c.category}</p>
                {isAdminRole ? (
                  <select
                    value={c.status}
                    onChange={(e) => patchItem('complaints', c.id, { status: e.target.value })}
                    className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-[11px] text-white outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge tone={tone[c.status] || 'info'}>{c.status}</Badge>
                )}
              </div>
              <p className="text-sm text-white/55">{c.description}</p>
              <p className="mt-1 text-xs text-white/45">
                {c.id} · {c.date}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
