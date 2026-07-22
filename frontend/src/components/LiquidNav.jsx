import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Info, Settings, CircleUserRound } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { key: 'home', label: 'Home', icon: Home, path: '/' },
  { key: 'about', label: 'About', icon: Info, path: '/#about' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { key: 'account', label: 'Account', icon: CircleUserRound, path: '/login' },
]

// A slim, pill-shaped glass dock fixed to the right edge of the viewport.
// A single glowing "liquid" blob morphs between icons on hover using a
// shared layoutId, giving the fluid/gel feel the brief asked for.
export default function LiquidNav() {
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <motion.nav
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex"
    >
      <div className="glass flex flex-col items-center gap-2 rounded-full px-2.5 py-4 shadow-glass">
        {items.map(({ key, label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={key}
              aria-label={label}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(path)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
            >
              {(hovered === key || active) && (
                <motion.span
                  layoutId="liquid-blob"
                  className="absolute inset-0 rounded-full bg-white/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" strokeWidth={1.75} />
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink/90 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 peer-hover:opacity-100"
                    style={{ opacity: hovered === key ? 1 : 0 }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
