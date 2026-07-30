import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import { apiPost } from '../services/guardianApi'

export default function WardenChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask about latest incidents, alerts, camera status, zones, crowd, night movement, group entry, loitering, camera health, or a summary. I only answer from live GuardianAI data.',
    },
  ])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(e) {
    e.preventDefault()
    const q = input.trim()
    if (!q || busy) return
    setInput('')
    setError('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setBusy(true)
    try {
      const data = await apiPost('/api/chat', { message: q })
      setMessages((m) => [...m, { role: 'assistant', text: data.reply || 'No reply.' }])
    } catch (err) {
      setError(err.message || 'Chat failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[420px] w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-ink/95 shadow-liquid backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Warden assistant</p>
              <p className="text-[11px] text-white/45">Live store · not a general FAQ</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === 'user' ? 'ml-auto bg-primary/30 text-white' : 'bg-white/10 text-white/85'
                }`}
              >
                {m.text}
              </div>
            ))}
            {error && <p className="text-xs text-danger">{error}</p>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What happened recently?"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-xl bg-primary px-3 py-2 text-white disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-liquid"
        aria-label="Open warden assistant"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  )
}
