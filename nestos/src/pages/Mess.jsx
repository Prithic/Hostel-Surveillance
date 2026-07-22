import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Utensils, Clock, Star, CheckCircle, Sparkles, ChefHat } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { todayMenu, mealTimings, analytics } from '../data/dummyData'

const meals = ['breakfast', 'lunch', 'snacks', 'dinner']

export default function Mess() {
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  // Student 3-Meal Choices State
  const [selectedPlan, setSelectedPlan] = useState({
    breakfast: 'Regular Non-Veg',
    lunch: 'Veg Special',
    dinner: 'Regular Non-Veg',
  })
  const [savedMealChoice, setSavedMealChoice] = useState(false)

  function handleSaveMealPlan(e) {
    e.preventDefault()
    setSavedMealChoice(true)
    setTimeout(() => setSavedMealChoice(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* 3-Meal Student Menu Selector Widget */}
      <GlassCard hover={false} className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">Select Your Daily 3-Meal Options</h2>
              <p className="text-xs text-white/50">Customize your daily meal preference for Mess Tokens.</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
            <CheckCircle className="h-3.5 w-3.5" /> Token Active
          </span>
        </div>

        <form onSubmit={handleSaveMealPlan} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Breakfast */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Breakfast</span>
              <span className="text-[10px] text-white/45">{mealTimings.breakfast}</span>
            </div>
            <p className="text-xs text-white/80 font-medium">{todayMenu.breakfast}</p>
            <select
              value={selectedPlan.breakfast}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, breakfast: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
            >
              <option value="Regular Non-Veg">Regular (Egg/Dosa)</option>
              <option value="Veg Special">Veg Special (Idli Sambar)</option>
              <option value="Healthy Diet">Healthy Diet (Sprouts & Oats)</option>
            </select>
          </div>

          {/* Lunch */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Lunch</span>
              <span className="text-[10px] text-white/45">{mealTimings.lunch}</span>
            </div>
            <p className="text-xs text-white/80 font-medium">{todayMenu.lunch}</p>
            <select
              value={selectedPlan.lunch}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, lunch: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
            >
              <option value="Veg Special">Veg Special Thali</option>
              <option value="Regular Non-Veg">Chicken Gravy Rice</option>
              <option value="Healthy Diet">Diet Salad & Brown Rice</option>
            </select>
          </div>

          {/* Dinner */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Dinner</span>
              <span className="text-[10px] text-white/45">{mealTimings.dinner}</span>
            </div>
            <p className="text-xs text-white/80 font-medium">{todayMenu.dinner}</p>
            <select
              value={selectedPlan.dinner}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, dinner: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-primary"
            >
              <option value="Regular Non-Veg">Paneer / Chicken Parotta</option>
              <option value="Veg Special">Soft Chapati & Dal Fry</option>
              <option value="Healthy Diet">Fruit Bowl & Milk</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-between pt-1">
            {savedMealChoice ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> 3-Meal choices saved for today! Digital QR Tokens updated.
              </span>
            ) : (
              <span className="text-[11px] text-white/45">Selection cutoff is 8:00 AM daily.</span>
            )}
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-liquid transition hover:bg-primary/90"
            >
              Confirm 3-Meal Choice
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Today's Full Schedule + Ratings Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-white">Today's menu schedule</h2>
          </div>
          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs capitalize font-semibold text-white/45">{m}</p>
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

      {/* Food Rating Section */}
      <GlassCard hover={false} className="p-5">
        <h2 className="mb-3 font-display text-sm font-semibold text-white">Rate today's food</h2>
        {sent ? (
          <p className="text-sm font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Thanks — your feedback was recorded for Mess Management.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/25'}`} />
                </button>
              ))}
            </div>
            <button
              disabled={!rating}
              onClick={() => setSent(true)}
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
