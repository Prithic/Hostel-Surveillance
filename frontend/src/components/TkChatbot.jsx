import { useEffect } from 'react'

/**
 * Mounts the tk-branch chatbot. Runs widget.js in an isolated Function scope
 * so React Strict Mode remounts don't leave a dead launcher.
 */
export default function TkChatbot() {
  useEffect(() => {
    let cancelled = false
    const styleId = 'tk-chatbot-style'
    const mountId = 'tk-chatbot-mount'

    async function mount() {
      document.getElementById(mountId)?.remove()
      window.__nnChatbotBooted = false

      const [css, markup, code] = await Promise.all([
        fetch('/tk-chatbot/widget.css').then((r) => {
          if (!r.ok) throw new Error(`css ${r.status}`)
          return r.text()
        }),
        fetch('/tk-chatbot/markup.html').then((r) => {
          if (!r.ok) throw new Error(`markup ${r.status}`)
          return r.text()
        }),
        fetch('/tk-chatbot/widget.js').then((r) => {
          if (!r.ok) throw new Error(`js ${r.status}`)
          return r.text()
        }),
      ])
      if (cancelled) return

      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = css
        document.head.appendChild(style)
      }

      const mountEl = document.createElement('div')
      mountEl.id = mountId
      mountEl.innerHTML = markup
      document.body.appendChild(mountEl)

      // Isolated scope — avoids global const redeclaration + Strict Mode races
      window.__nnChatbotBooted = false
      // eslint-disable-next-line no-new-func
      new Function(code)()
    }

    mount().catch((err) => console.error('TkChatbot mount failed', err))

    return () => {
      cancelled = true
      document.getElementById(mountId)?.remove()
      window.__nnChatbotBooted = false
    }
  }, [])

  return null
}
