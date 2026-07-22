import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Utensils, Clock, Star } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { todayMenu, mealTimings, analytics } from '../data/dummyData'

const meals = ['breakfast', 'lunch', 'snacks', 'dinner']

export default function Mess() {
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Today's menu</h2>
          </div>
          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs capitalize text-white/45">{m}</p>
                  <p className="text-sm font-medium text-white">{todayMenu[m]}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-white/45">
                  <Clock className="h-3.5 w-3.5" /> {mealTimings[m]}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5">
          <h2 className="mb-2 font-display text-sm font-semibold text-white">This week's mess rating</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.messRatings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="rating" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5">
        <h2 className="mb-3 font-display text-sm font-semibold text-white">Rate today's food</h2>
        {sent ? (
          <p className="text-sm text-success">Thanks — your feedback was recorded.</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-6 w-6 ${n <= rating ? 'fill-warning text-warning' : 'text-white/25'}`} />
                </button>
              ))}
            </div>
            <button
              disabled={!rating}
              onClick={() => setSent(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
