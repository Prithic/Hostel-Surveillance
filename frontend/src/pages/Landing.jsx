import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ScanFace, MessageSquareWarning, Shirt, Utensils, CalendarCheck, UserCheck,
  Siren, Bot, ShieldCheck, ArrowRight, Building2,
} from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import LiquidNav from '../components/LiquidNav'

const features = [
  { icon: ScanFace, title: 'Face Recognition', desc: 'Contactless entry and attendance, verified in under a second.' },
  { icon: MessageSquareWarning, title: 'Complaint Management', desc: 'Log an issue, track it live, watch it get resolved.' },
  { icon: Shirt, title: 'Laundry', desc: 'Book a slot, follow your clothes from wash to ready.' },
  { icon: Utensils, title: 'Mess', desc: 'Daily menus, timings and one-tap food feedback.' },
  { icon: CalendarCheck, title: 'Attendance', desc: 'Automatic check-in and check-out, no queues.' },
  { icon: UserCheck, title: 'Visitor Management', desc: 'OTP-verified visitor entry with a full history log.' },
  { icon: Siren, title: 'Emergency SOS', desc: 'One tap alerts security, your warden and your parents.' },
  { icon: Bot, title: 'AI Chatbot', desc: 'Ask anything about the hostel, get an answer instantly.' },
  { icon: ShieldCheck, title: 'Security Monitoring', desc: 'Live camera status and anomaly alerts in one view.' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <AnimatedBackground>
      <LiquidNav />

      {/* Nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold">NestOS</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur-md transition hover:bg-white/10"
        >
          Login
        </button>
      </div>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 pb-24 text-center md:pt-24">
        <motion.span
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
        >
          Built for wardens, students and security teams
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl"
        >
          AI Powered Hostel<br className="hidden md:block" /> Management System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 max-w-xl text-balance text-base text-white/60 md:text-lg"
        >
          Smart, secure and automated hostel management — attendance, mess, laundry, security and SOS, all in one calm dashboard.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:bg-primary/90"
          >
            Login
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#about"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/10"
          >
            Learn more
          </a>
        </motion.div>
      </section>

      {/* Feature grid */}
      <section id="about" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-white/55">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-white/40 md:flex-row">
          <span>© 2026 NestOS. Frontend demo — no backend connected.</span>
          <div className="flex gap-5">
            <a href="#about" className="hover:text-white/70">About</a>
            <button onClick={() => navigate('/login')} className="hover:text-white/70">Login</button>
            <button onClick={() => navigate('/settings')} className="hover:text-white/70">Settings</button>
          </div>
        </div>
      </footer>
    </AnimatedBackground>
  )
}
