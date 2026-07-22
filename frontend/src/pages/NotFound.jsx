import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <AnimatedBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-10">
          <Compass className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="font-display text-5xl font-semibold">404</h1>
          <p className="mt-2 text-white/60">This page wandered off campus.</p>
          <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium hover:bg-primary/90">
            Back to home
          </button>
        </motion.div>
      </div>
    </AnimatedBackground>
  )
}
