import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Sparkles, X, Send, Utensils, Shirt, FileClock, Siren, Wallet, HelpCircle } from 'lucide-react'

const predefinedFAQs = [
  {
    icon: Utensils,
    question: 'What are the mess timings & menu today?',
    answer: '🥣 Breakfast: 7:30 AM - 9:00 AM | Lunch: 12:30 PM - 2:00 PM | Snacks: 5:00 PM - 6:00 PM | Dinner: 7:30 PM - 9:00 PM. Today\'s Special: Paneer Butter Masala & Parotta.',
  },
  {
    icon: Shirt,
    question: 'How do I book a laundry slot?',
    answer: '🧺 Go to the Laundry Portal page -> Select your available slot (e.g. 4:00 PM - 5:00 PM) -> Tap "Confirm Booking". Pickup is from Block B ground floor.',
  },
  {
    icon: FileClock,
    question: 'What is the hostel curfew & leave process?',
    answer: '⏰ Night Curfew is strictly 9:00 PM for all hostel blocks. Outpass & Leave requests must be submitted online at least 6 hours in advance for Warden approval.',
  },
  {
    icon: Siren,
    question: 'What are the emergency contact numbers?',
    answer: '🚨 Warden Office: +91 99400 10001 | Security Main Gate: +91 99500 10001 | Health Center: +91 98400 10000 | Ambulance: 108.',
  },
  {
    icon: Wallet,
    question: 'When is the hostel fee deadline?',
    answer: '💳 Semester hostel fee deadline is the 10th of every month. You can check your pending fee status under the "Fee Status" portal page.',
  },
]

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Trinity Assistant. Ask me anything about hostel rules, mess menus, laundry slots, leave outpasses, or emergency numbers.',
    },
  ])
  const [input, setInput] = useState('')

  function handleSend(textToSend) {
    const query = textToSend || input
    if (!query.trim()) return

    const newMessages = [...messages, { sender: 'user', text: query }]
    setMessages(newMessages)
    if (!textToSend) setInput('')

    // Generate response matching query keywords
    setTimeout(() => {
      let aiResponse = 'I am your Trinity Engine AI assistant. You can check the dashboard or contact your warden for detailed queries.'
      const lower = query.toLowerCase()

      if (lower.includes('mess') || lower.includes('food') || lower.includes('lunch') || lower.includes('dinner')) {
        aiResponse = '🥣 Mess Timings: Breakfast 7:30-9AM, Lunch 12:30-2PM, Snacks 5-6PM, Dinner 7:30-9PM. Food quality ratings are tracked live under Mess Management.'
      } else if (lower.includes('laundry') || lower.includes('wash') || lower.includes('clothes')) {
        aiResponse = '🧺 Laundry slots can be booked under Laundry Management. Each student gets 2 free washes per week.'
      } else if (lower.includes('curfew') || lower.includes('leave') || lower.includes('outpass') || lower.includes('timing')) {
        aiResponse = '⏰ Hostel curfew is 9:00 PM. Leave applications can be applied directly in the Leave Portal for warden e-approval.'
      } else if (lower.includes('emergency') || lower.includes('sos') || lower.includes('number') || lower.includes('phone')) {
        aiResponse = '🚨 Emergency Numbers: Warden: 99400 10001 | Security Gate 1: 99500 10001 | Campus SOS Button is available on the SOS Portal page.'
      } else if (lower.includes('fee') || lower.includes('payment') || lower.includes('dues')) {
        aiResponse = '💳 Hostel fee invoices and online receipts are managed on the Fee Status page.'
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }])
    }, 400)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((v) => !v)}
        className="glass flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-glow border border-white/20"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7 text-white" />}
      </motion.button>

      {/* Floating AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass absolute bottom-18 right-0 w-[90vw] max-w-sm rounded-3xl p-4 shadow-2xl border border-white/15"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Trinity AI Assistant</h3>
                  <p className="text-[10px] text-emerald-400">● Online · Smart Hostel Bot</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 text-white/50 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="mt-3 max-h-72 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      m.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'border border-white/10 bg-white/5 text-white/90'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined FAQ Pills */}
            <div className="mt-3 border-t border-white/10 pt-2 space-y-1">
              <p className="text-[10px] font-medium text-white/40 uppercase">Frequent Questions</p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {predefinedFAQs.map((faq, i) => {
                  const Icon = faq.icon
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(faq.question)}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/80 hover:bg-white/15"
                    >
                      <Icon className="h-3 w-3 text-primary" /> {faq.question.split(' ')[0]} {faq.question.split(' ')[1]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="mt-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Trinity AI..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-liquid"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
