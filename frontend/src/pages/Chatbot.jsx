import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import GlassCard from '../components/GlassCard'

const API = import.meta.env.VITE_API_URL || ''

async function getBotReply(message) {
  try {
    const res = await fetch(`${API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error('chat failed')
    const data = await res.json()
    return data.reply
  } catch {
    return 'Backend is offline. Start the backend server to get live incident data and alerts.'
  }
}

const quickQuestions = [
  'What happened recently?',
  'Show current alerts',
  'Camera status',
  'Incident summary',
  'Any tailgating incidents?',
  'Any restricted zone entries?',
]


export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi — I'm the GuardianAI warden assistant. Ask what happened, latest incident, or current alerts." },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { from: 'student', text: trimmed }])
    setInput('')
    setTyping(true)
    const reply = await getBotReply(trimmed)
    setTyping(false)
    setMessages((m) => [...m, { from: 'bot', text: reply }])
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
      <GlassCard hover={false} className="flex h-[calc(100vh-140px)] flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink2">GuardianAI Assistant</p>
            <p className="text-xs text-slate-400">Incident-aware replies via /api/chat</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${m.from === 'student' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${m.from === 'student' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                {m.from === 'student' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div 
                className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.from === 'student' ? 'rounded-br-sm bg-primary text-white' : 'rounded-bl-sm bg-slate-100 text-ink2'}`}
                dangerouslySetInnerHTML={{ __html: m.text }}
              />
            </motion.div>
          ))}
          {typing && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex gap-2 border-t border-slate-100 p-4"
          onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
        >
          <input
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about incidents or alerts…"
          />
          <button type="submit" className="rounded-xl bg-primary px-3 py-2 text-white">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Quick questions</p>
        <div className="flex flex-col gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="rounded-lg border border-slate-100 px-3 py-2 text-left text-sm text-ink2 hover:bg-slate-50"
            >
              {q}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
