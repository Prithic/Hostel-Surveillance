import { useState } from 'react'
import { Wallet, CheckCircle2, CalendarClock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { useHostel } from '../hostel/HostelContext'
import { useRoleCheck } from '../hooks/useRoleCheck'

export default function FeeStatus() {
  const { data, loading, error, append, replaceKey } = useHostel()
  const { isAdminRole } = useRoleCheck()
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('UPI')
  const [msg, setMsg] = useState('')

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data) return null

  const feeStatus = data.feeStatus || { paid: 0, pending: 0, dueDate: '—', amount: 0 }
  const paymentHistory = data.paymentHistory || []

  async function recordPayment(e) {
    e.preventDefault()
    const pay = Number(amount)
    if (!pay || pay <= 0) return
    const id = `PMT-${Date.now().toString().slice(-4)}`
    const date = new Date().toISOString().slice(0, 10)
    await append('paymentHistory', { id, date, amount: pay, status: 'Paid', mode })
    const pending = Math.max(0, Number(feeStatus.pending || 0) - pay)
    const paid = Number(feeStatus.paid || 0) + pay
    await replaceKey('feeStatus', { ...feeStatus, paid, pending })
    setAmount('')
    setMsg(`Recorded ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CheckCircle2} label="Paid this year" value={`₹${feeStatus.paid.toLocaleString('en-IN')}`} tone="success" />
        <StatCard icon={Wallet} label="Pending amount" value={`₹${feeStatus.pending.toLocaleString('en-IN')}`} tone={feeStatus.pending ? 'danger' : 'primary'} />
        <StatCard icon={CalendarClock} label="Next due date" value={feeStatus.dueDate} tone="warning" />
      </div>

      {isAdminRole && (
        <GlassCard hover={false} className="p-5">
          <h2 className="mb-3 font-display text-sm font-semibold text-white">Record a payment</h2>
          <form onSubmit={recordPayment} className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-white/55">
              Amount (₹)
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-36 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-white/55">
              Mode
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 block rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Cash</option>
                <option>Net Banking</option>
              </select>
            </label>
            <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Save payment</button>
            {msg && <span className="text-xs text-emerald-400">{msg}</span>}
          </form>
        </GlassCard>
      )}

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
                <td className="py-3">
                  <Badge tone="success">{p.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
