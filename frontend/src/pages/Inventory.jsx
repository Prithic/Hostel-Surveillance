import { Boxes } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import Badge from '../components/Badge'
import { inventory } from '../data/dummyData'

export default function Inventory() {
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
            <tr key={item.item} className="border-b border-white/5 last:border-0">
              <td className="py-3 text-white">{item.item}</td>
              <td className="py-3 text-white/55">{item.qty}</td>
              <td className="py-3"><Badge tone={item.condition === 'Good' ? 'success' : 'warning'}>{item.condition}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  )
}
