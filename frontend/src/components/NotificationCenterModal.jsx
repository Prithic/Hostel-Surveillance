import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bell, X, Check, CheckCheck, Trash2, MessageSquareWarning, Wallet,
  Megaphone, Siren, Utensils, Shirt, ChevronRight, Filter,
} from 'lucide-react'

const initialNotifications = [
  {
    id: 1,
    type: 'complaint',
    title: 'Complaint Update: CMP-098',
    message: 'Maintenance team assigned to inspect water leakage in Block B 2nd floor.',
    time: '10 mins ago',
    unread: true,
    category: 'Maintenance',
    path: '/complaints',
    icon: MessageSquareWarning,
    color: 'text-amber-400',
  },
  {
    id: 2,
    type: 'fee',
    title: 'Semester Fee Reminder',
    message: 'Semester 4 hostel fee invoice #INV-882 is generated. Due date: 10th of this month.',
    time: '1 hour ago',
    unread: true,
    category: 'Finance',
    path: '/fees',
    icon: Wallet,
    color: 'text-emerald-400',
  },
  {
    id: 3,
    type: 'notice',
    title: 'Hostel Night Outpass Rules',
    message: 'All students are reminded to submit leave outpasses at least 6 hours in advance.',
    time: '3 hours ago',
    unread: true,
    category: 'Notice',
    path: '/notices',
    icon: Megaphone,
    color: 'text-primary',
  },
  {
    id: 4,
    type: 'sos',
    title: 'Campus Health Inspection Notice',
    message: 'Routine room hygiene inspection for Hostel Block A scheduled tomorrow at 10 AM.',
    time: 'Yesterday',
    unread: false,
    category: 'Alert',
    path: '/sos',
    icon: Siren,
    color: 'text-rose-400',
  },
  {
    id: 5,
    type: 'mess',
    title: 'Special Dinner Menu Update',
    message: 'Paneer Butter Masala & Parotta scheduled for tonight dinner at Central Mess.',
    time: '2 days ago',
    unread: false,
    category: 'Mess',
    path: '/mess',
    icon: Utensils,
    color: 'text-emerald-400',
  },
]

export default function NotificationCenterModal({ open, onClose }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => n.unread).length

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread
    if (filter === 'alerts') return n.category === 'Alert' || n.category === 'Maintenance'
    return true
  })

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  function deleteNotification(id, e) {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function handleNavigate(path, id) {
    markRead(id)
    onClose()
    navigate(path)
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
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass fixed top-16 right-4 z-50 w-full max-w-sm overflow-hidden rounded-3xl p-4 shadow-2xl border border-white/15 md:right-8"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Notifications</h2>
                  <p className="text-[10px] text-white/50">{unreadCount} unread alerts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70 hover:bg-white/15"
                  >
                    <CheckCheck className="h-3 w-3 text-emerald-400" /> Read all
                  </button>
                )}
                <button onClick={onClose} className="rounded-full p-1 text-white/40 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-3 flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Filter className="h-3 w-3 text-white/40 ml-1" />
              {['all', 'unread', 'alerts'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize transition ${
                    filter === f ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">No notifications in this filter</div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(item.path, item.id)}
                      className={`group relative flex items-start gap-3 rounded-2xl p-3 cursor-pointer transition border ${
                        item.unread
                          ? 'bg-white/10 border-white/15 text-white'
                          : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/60 line-clamp-2 leading-relaxed">{item.message}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/40">
                          <span>{item.time}</span>
                          <span className="flex items-center gap-0.5 text-primary group-hover:underline font-medium">
                            View <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => deleteNotification(item.id, e)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 border-t border-white/10 pt-2 text-center text-[10px] text-white/40">
              Click any notification to navigate directly to its module.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
