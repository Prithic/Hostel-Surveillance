const styles = {
  success: 'bg-success/12 text-success border-success/25',
  danger: 'bg-danger/12 text-danger border-danger/25',
  warning: 'bg-warning/12 text-warning border-warning/25',
  info: 'bg-primary/12 text-primary border-primary/25',
  neutral: 'bg-white/10 text-white/70 border-white/10',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}
