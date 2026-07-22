import { Wallet, CheckCircle2, CalendarClock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { feeStatus, paymentHistory } from '../data/dummyData'

export default function FeeStatus() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CheckCircle2} label="Paid this year" value={`₹${feeStatus.paid.toLocaleString('en-IN')}`} tone="success" />
        <StatCard icon={Wallet} label="Pending amount" value={`₹${feeStatus.pending.toLocaleString('en-IN')}`} tone={feeStatus.pending ? 'danger' : 'primary'} />
        <StatCard icon={CalendarClock} label="Next due date" value={feeStatus.dueDate} tone="warning" />
      </div>

      <GlassCard hover={false} className="overflow-x-auto p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-white">Payment history</h2>
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
              <th className="pb-3 font-medium">Transaction ID</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Mode</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="py-3 font-mono text-xs text-white/55">{p.id}</td>
                <td className="py-3 text-white/55">{p.date}</td>
                <td className="py-3 text-white">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="py-3 text-white/55">{p.mode}</td>
                <td className="py-3"><Badge tone="success">{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
