import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, ShieldCheck, CheckCircle2, Users, ShieldAlert, Sparkles } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import LiquidNav from '../components/LiquidNav'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <AnimatedBackground>
      <LiquidNav />

      {/* Top Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-liquid">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white block leading-none">Trinity Engine</span>
            <span className="text-[10px] text-white/50 font-medium">Sri Shakthi Institute ERP</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" /> Admin Portal
          </button>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-liquid transition hover:bg-primary/90"
          >
            Student Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-12 text-center md:py-20">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-widest"
        >
          <Sparkles className="h-3.5 w-3.5" /> AI Powered Smart Hostel Management Platform
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl tracking-tight"
        >
          Trinity Engine
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-2xl text-balance text-base text-white/70 md:text-lg leading-relaxed"
        >
          One intelligent platform to manage every aspect of hostel life—students, attendance, complaints, security, notices, and administration.
        </motion.p>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-liquid transition hover:bg-primary/90"
          >
            Student Login
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {/* Enterprise Metrics Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:grid-cols-4 w-full max-w-3xl"
        >
          <div className="border-r border-white/10 pr-3 last:border-r-0">
            <p className="text-xl font-bold text-white">1,000+</p>
            <p className="text-xs text-white/50">Students Managed</p>
          </div>
          <div className="border-r border-white/10 pr-3 last:border-r-0">
            <p className="text-xl font-bold text-emerald-400">99.9%</p>
            <p className="text-xs text-white/50">Attendance Accuracy</p>
          </div>
          <div className="border-r border-white/10 pr-3 last:border-r-0">
            <p className="text-xl font-bold text-primary">24/7</p>
            <p className="text-xs text-white/50">Security Monitoring</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">Instant</p>
            <p className="text-xs text-white/50">AI Assistance</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-white/40 md:flex-row">
          <span>© 2026 Trinity Engine — AI Powered Smart Hostel Management Platform.</span>
          <div className="flex gap-5">
            <button onClick={() => navigate('/login')} className="hover:text-white/70">Student Portal</button>
            <button onClick={() => navigate('/admin')} className="hover:text-white/70">Admin Portal</button>
            <button onClick={() => navigate('/settings')} className="hover:text-white/70">Settings</button>
          </div>
        </div>
      </footer>
    </AnimatedBackground>
  )
}
