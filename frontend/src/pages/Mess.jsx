import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Utensils, Clock, Star, CheckCircle, ChefHat } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useHostel } from '../hostel/HostelContext'
import { getDisplayName } from '../services/guardianApi'

const meals = ['breakfast', 'lunch', 'snacks', 'dinner']

export default function Mess() {
  const { data, loading, error, replaceKey, append } = useHostel()
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [savedMealChoice, setSavedMealChoice] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (data?.mealPlan) setSelectedPlan(data.mealPlan)
  }, [data?.mealPlan])

  if (loading) return <p className="text-sm text-white/45">Loading live data…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!data || !selectedPlan) return null

  const { todayMenu, mealTimings } = data
  const analytics = data.analytics || { messRatings: [] }
  const feedback = data.messFeedback || []

  async function handleSaveMealPlan(e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      await replaceKey('mealPlan', selectedPlan)
      setSavedMealChoice(true)
      setTimeout(() => setSavedMealChoice(false), 3000)
    } catch (err) {
      setMsg(err.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function submitRating() {
    if (!rating) return
    setBusy(true)
    setMsg('')
    try {
      await append('messFeedback', {
        id: `FB-${Date.now().toString().slice(-5)}`,
        rating,
        by: getDisplayName() || 'student',
        at: new Date().toISOString(),
        day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      })
      const day = new Date().toLocaleDateString('en-US', { weekday: 'short' })
      const ratings = [...(analytics.messRatings || [])]
      const idx = ratings.findIndex((r) => r.day === day)
      if (idx >= 0) ratings[idx] = { ...ratings[idx], rating }
      else ratings.push({ day, rating })
      await replaceKey('analytics', { ...analytics, messRatings: ratings })
      setSent(true)
    } catch (err) {
      setMsg(err.message || 'Rating failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard hover={false} className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">Daily 3-Meal Options</h2>
              <p className="text-xs text-white/50">Saved to your hostel account.</p>
            </div>
          </div>
          {savedMealChoice && (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveMealPlan} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              key: 'breakfast',
              options: [
                ['Regular Non-Veg', 'Regular (Egg/Dosa)'],
                ['Veg Special', 'Veg Special (Idli Sambar)'],
                ['Healthy Diet', 'Healthy Diet (Sprouts & Oats)'],
              ],
            },
            {
              key: 'lunch',
              options: [
                ['Veg Special', 'Veg Special Thali'],
                ['Regular Non-Veg', 'Chicken Gravy Rice'],
                ['Healthy Diet', 'Diet Salad & Brown Rice'],
              ],
            },
            {
              key: 'dinner',
              options: [
                ['Regular Non-Veg', 'Paneer / Chicken Parotta'],
                ['Veg Special', 'Soft Chapati & Dal Fry'],
                ['Healthy Diet', 'Fruit Bowl & Milk'],
              ],
            },
          ].map(({ key, options }) => (
            <div key={key} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">{key}</span>
                <span className="text-[10px] text-white/45">{mealTimings[key]}</span>
              </div>
              <p className="text-xs font-medium text-white/80">{todayMenu[key]}</p>
              <select
                value={selectedPlan[key]}
                onChange={(e) => setSelectedPlan({ ...selectedPlan, [key]: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
              >
                {options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1 sm:col-span-3">
            <span className="text-[11px] text-white/45">{msg || 'Selection is stored server-side.'}</span>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-liquid transition hover:bg-primary/90 disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Confirm 3-Meal Choice'}
            </button>
          </div>
        </form>
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Today&apos;s menu schedule</h2>
          </div>
          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold capitalize text-white/45">{m}</p>
                  <p className="text-sm font-medium text-white">{todayMenu[m]}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-white/45">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {mealTimings[m]}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5">
          <h2 className="mb-2 font-display text-sm font-semibold text-white">This week&apos;s mess rating</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.messRatings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="rating" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {feedback.length > 0 && (
            <p className="mt-2 text-[11px] text-white/45">{feedback.length} feedback entries stored.</p>
          )}
        </GlassCard>
      </div>

      <GlassCard hover={false} className="p-5">
        <h2 className="mb-3 font-display text-sm font-semibold text-white">Rate today&apos;s food</h2>
        {sent ? (
          <p className="flex items-center gap-1 text-sm font-medium text-emerald-400">
            <CheckCircle className="h-4 w-4" /> Feedback recorded in the live store.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/25'}`} />
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!rating || busy}
              onClick={submitRating}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
            >
              Submit Rating
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
