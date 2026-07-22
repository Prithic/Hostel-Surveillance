import GlassCard from './GlassCard'

export default function StatCard({ icon: Icon, label, value, tone = 'primary' }) {
  const toneMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  }
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="font-display text-xl font-semibold text-ink2">{value}</p>
        </div>
      </div>
    </GlassCard>
  )
}
