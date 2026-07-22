import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import GlassCard from '../components/GlassCard'

const API = import.meta.env.VITE_API_URL || ''
const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981']

function ChartCard({ title, children }) {
  return (
    <GlassCard hover={false} className="p-5">
      <h2 className="mb-4 font-display text-sm font-semibold text-white">{title}</h2>
      <div className="h-56"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </GlassCard>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API}/api/analytics`)
        if (!res.ok) throw new Error('Failed to load analytics')
        const json = await res.json()
        setData(json)
        setError('')
      } catch (err) {
        setError('Backend offline — live analytics unavailable')
      }
    }
    fetchAnalytics()
    const timer = setInterval(fetchAnalytics, 3000)
    return () => clearInterval(timer)
  }, [])

  const severityChartData = data ? [
    { name: 'Critical', value: data.incidents_by_severity?.critical || 0 },
    { name: 'High', value: data.incidents_by_severity?.high || 0 },
    { name: 'Medium', value: data.incidents_by_severity?.medium || 0 },
    { name: 'Low', value: data.incidents_by_severity?.low || 0 },
  ] : []

  const typeChartData = data ? Object.entries(data.incidents_by_type || {}).map(([key, count]) => ({
    type: key.replace('_', ' '),
    count: count,
  })) : []

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Security Incidents by Severity">
          <PieChart>
            <Pie data={severityChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {severityChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Live Incident Distribution by Event Type">
          <BarChart data={typeChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} />
            <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  )
}

