import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { chatbotFAQ, quickQuestions } from '../data/dummyData'

// ---------------------------------------------------------------------------
// This page is intentionally wired for a real backend/LLM.
// Swap `getBotReply()` for a call to your friend's backend, e.g.:
//
//   async function getBotReply(message) {
//     const res = await fetch('/api/chatbot', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message }),
//     })
//     const data = await res.json()
//     return data.reply
//   }
//
// Everything else (message list, input, quick questions) stays the same.
// ---------------------------------------------------------------------------
function getBotReply(message) {
  const key = Object.keys(chatbotFAQ).find((k) => message.toLowerCase().includes(k))
  const reply = key ? chatbotFAQ[key] : "I'm a demo bot right now — once connected to the backend, I'll answer anything about the hostel."
  return new Promise((resolve) => setTimeout(() => resolve(reply), 500))
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your hostel assistant. Ask me about mess timings, laundry, leave, or tap a quick question below." },
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
            <p className="text-sm font-medium text-ink2">Hostel Assistant</p>
            <p className="text-xs text-slate-400">Demo replies — connect your backend to go live</p>
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
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'student' ? 'rounded-br-sm bg-primary text-white' : 'rounded-bl-sm bg-slate-100 text-ink2'}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex items-center gap-2 pl-9 text-xs text-slate-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
              </span>
              typing…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
          className="flex items-center gap-2 border-t border-slate-100 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about mess, laundry, leave, WiFi…"
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </GlassCard>

      <GlassCard hover={false} className="h-fit p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-sm font-semibold text-ink2">Quick questions</h2>
        </div>
        <div className="flex flex-col gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              {q}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
