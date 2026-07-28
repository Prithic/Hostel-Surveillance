import { Boxes } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

const CONDITIONS = ['Good', 'Needs Repair', 'Damaged', 'Missing']

export default function Inventory() {
  const { data, loading, error, patchItem } = useHostel()
  const { isAdminRole } = useRoleCheck()

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const inventory = data.inventory || []

  return (
    <GlassCard hover={false} className="overflow-x-auto p-5">
      <div className="mb-4 flex items-center gap-2">
        <Boxes className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-semibold text-white">Room inventory</h2>
      </div>
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
            <th className="pb-3 font-medium">Item</th>
            <th className="pb-3 font-medium">Quantity</th>
            <th className="pb-3 font-medium">Condition</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id || item.item} className="border-b border-white/5 last:border-0">
              <td className="py-3 text-white">{item.item}</td>
              <td className="py-3 text-white/55">
                {isAdminRole ? (
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => patchItem('inventory', item.id, { qty: Number(e.target.value) })}
                    className="w-16 rounded border border-white/15 bg-white/5 px-2 py-1 text-sm text-white"
                  />
                ) : (
                  item.qty
                )}
              </td>
              <td className="py-3">
                {isAdminRole ? (
                  <select
                    value={item.condition}
                    onChange={(e) => patchItem('inventory', item.id, { condition: e.target.value })}
                    className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-xs text-white"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge tone={item.condition === 'Good' ? 'success' : 'warning'}>{item.condition}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  )
}
