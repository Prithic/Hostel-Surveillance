import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { getDisplayName, getEmail } from '../services/guardianApi'
import { useHostel } from '../hostel/HostelContext'

export default function Topbar({ onToggleSidebar, title }) {
  const email = getEmail()
  const name = getDisplayName()
  const initial = (name || email || 'T').slice(0, 1).toUpperCase()
  const { data, patchItem } = useHostel()
  const [open, setOpen] = useState(false)

  const notifications = data?.notifications || []
  const unread = notifications.filter((n) => !n.read).length

  async function markRead(id) {
    await patchItem('notifications', id, { read: true })
  }

  return (
    <header className="sticky top-3 z-30 mx-3 mt-3 md:mx-4">
      <div className="liquid-glass flex items-center justify-between gap-3 rounded-3xl px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onToggleSidebar} className="rounded-2xl p-2 text-white/55 transition hover:bg-white/10 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-base font-semibold text-white md:text-lg">{title}</h1>
            <p className="hidden truncate text-xs text-white/45 sm:block">
              Trinity Engine · {name || email || 'session'}
            </p>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative rounded-2xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full liquid-tint-primary text-xs font-semibold text-white shadow-liquid">
            {initial}
          </div>
          {open && (
            <div className="absolute right-0 top-11 z-50 w-80 max-h-80 overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/95 p-3 shadow-xl">
              <p className="mb-2 text-xs font-semibold text-white">In-app notifications</p>
              {notifications.length === 0 ? (
                <p className="text-xs text-white/45">No notifications yet.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 20).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left ${
                        n.read ? 'border-white/5 bg-white/5' : 'border-primary/30 bg-primary/10'
                      }`}
                    >
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-white/55">{n.body}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
