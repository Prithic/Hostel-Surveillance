import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, LayoutDashboard, DoorOpen, CalendarCheck, FileClock, Megaphone,
  Wallet, MessageSquareWarning, Utensils, Shirt, UserCheck, Siren, ShieldCheck,
  User, ArrowRight, CornerDownLeft, Sparkles, X,
} from 'lucide-react'

const commandItems = [
  // Navigation Actions
  { category: 'Quick Navigation', label: 'Go to Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Room Details & Allocation', path: '/room-details', icon: DoorOpen, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Attendance & Entry Logs', path: '/attendance', icon: CalendarCheck, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Complaint Portal', path: '/complaints', icon: MessageSquareWarning, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Laundry Booking & Status', path: '/laundry', icon: Shirt, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Leave Requests & Approvals', path: '/leave', icon: FileClock, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Hostel Notices & Announcements', path: '/notices', icon: Megaphone, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Fee Status & Invoices', path: '/fees', icon: Wallet, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Visitor Management Logs', path: '/visitors', icon: UserCheck, badge: 'Page' },
  { category: 'Quick Navigation', label: 'Emergency SOS Portal', path: '/sos', icon: Siren, badge: 'Alert' },
  { category: 'Quick Navigation', label: 'Admin Portal Sign In', path: '/admin', icon: ShieldCheck, badge: 'Admin' },

  // Students Dataset
  { category: 'Students', label: 'Sharan M — AIML (Year 2)', path: '/room-details', icon: User, subtitle: 'sharanml25@srishakthi.ac.in · Room B-214', badge: 'Active' },
  { category: 'Students', label: 'Akash K — CSE (Year 2)', path: '/room-details', icon: User, subtitle: 'akash23@srishakthi.ac.in · Room A-201', badge: 'Active' },
  { category: 'Students', label: 'Vignesh M — AI&DS (Year 1)', path: '/room-details', icon: User, subtitle: 'vignesh24@srishakthi.ac.in · Room B-102', badge: 'Active' },
  { category: 'Students', label: 'Sanjay R — ECE (Year 4)', path: '/room-details', icon: User, subtitle: 'sanjay22@srishakthi.ac.in · Room C-405', badge: 'Active' },
  { category: 'Students', label: 'Meena S — EEE (Year 1)', path: '/room-details', icon: User, subtitle: 'meena24@srishakthi.ac.in · Room D-108', badge: 'Active' },

  // Rooms Dataset
  { category: 'Rooms', label: 'Room B-214 (Hostel Block B)', path: '/room-details', icon: DoorOpen, subtitle: 'Occupancy: 2/2 · Maintenance: Good', badge: 'Occupied' },
  { category: 'Rooms', label: 'Room A-201 (Hostel Block A)', path: '/room-details', icon: DoorOpen, subtitle: 'Occupancy: 2/2 · Maintenance: Good', badge: 'Occupied' },
  { category: 'Rooms', label: 'Room C-405 (Hostel Block C)', path: '/room-details', icon: DoorOpen, subtitle: 'Occupancy: 1/2 · Maintenance: Cleaning Scheduled', badge: 'Vacant 1' },

  // Active Complaints
  { category: 'Complaints', label: 'CMP-098: Water leakage in Block B 2nd floor', path: '/complaints', icon: MessageSquareWarning, subtitle: 'Assigned to Maintenance · Priority High', badge: 'In Progress' },
  { category: 'Complaints', label: 'CMP-104: Wi-Fi speed drop in Block A', path: '/complaints', icon: MessageSquareWarning, subtitle: 'Assigned to IT Admin · Priority Medium', badge: 'Pending' },
  { category: 'Complaints', label: 'CMP-112: Air Conditioner noise in Room C-405', path: '/complaints', icon: MessageSquareWarning, subtitle: 'Resolved by Maintenance Team', badge: 'Resolved' },
]

export default function CommandPaletteModal({ open, onClose }) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
        else window.dispatchEvent(new CustomEvent('open-command-palette'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const filtered = commandItems.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase()))
  )

  function handleSelect(item) {
    onClose()
    setSearch('')
    navigate(item.path)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.2 }}
              className="glass pointer-events-auto w-full max-w-2xl overflow-hidden rounded-3xl p-4 shadow-2xl border border-white/15"
            >
              {/* Search Bar Input */}
              <div className="relative flex items-center border-b border-white/10 pb-3">
                <Search className="absolute left-3.5 h-5 w-5 text-primary" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setSelectedIndex(0)
                  }}
                  placeholder="Search students, complaints, visitors, rooms, actions..."
                  className="w-full bg-transparent pl-11 pr-10 text-base text-white placeholder:text-white/40 outline-none"
                />
                <button onClick={onClose} className="absolute right-3 rounded-full p-1 text-white/40 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results List */}
              <div className="mt-3 max-h-96 overflow-y-auto space-y-1.5 pr-1">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-sm text-white/45">
                    No results found for "<span className="text-white">{search}</span>"
                  </div>
                ) : (
                  filtered.map((item, idx) => {
                    const Icon = item.icon
                    const isSelected = idx === selectedIndex
                    return (
                      <button
                        key={`${item.category}-${item.label}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition ${
                          isSelected ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white truncate">{item.label}</span>
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                                {item.category}
                              </span>
                            </div>
                            {item.subtitle && <p className="text-xs text-white/45 truncate mt-0.5">{item.subtitle}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {item.badge && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/60">
                              {item.badge}
                            </span>
                          )}
                          <CornerDownLeft className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Modal Footer Hints */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/45">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↑</kbd> <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> Select</span>
                  <span className="flex items-center gap-1"><kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">ESC</kbd> Close</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Sparkles className="h-3 w-3" /> Trinity Command Bar
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
