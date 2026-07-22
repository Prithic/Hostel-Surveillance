/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        surface: '#F4F6FB',
        ink: '#0B1120',
        ink2: '#111827',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.25)',
        glow: '0 0 40px rgba(37,99,235,0.35)',
        liquid: '0 1px 1px rgba(255,255,255,0.6) inset, 0 -1px 1px rgba(255,255,255,0.2) inset, 0 20px 44px -14px rgba(15,23,42,0.16), 0 2px 8px rgba(15,23,42,0.06)',
        liquidDark: '0 1px 1px rgba(255,255,255,0.16) inset, 0 -8px 24px rgba(0,0,0,0.25) inset, 0 24px 60px -18px rgba(0,0,0,0.55)',
        liquidHover: '0 1px 1px rgba(255,255,255,0.7) inset, 0 -1px 1px rgba(255,255,255,0.25) inset, 0 28px 60px -16px rgba(15,23,42,0.22), 0 4px 14px rgba(15,23,42,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: 0.7 },
          '70%': { transform: 'scale(1.6)', opacity: 0 },
          '100%': { opacity: 0 },
        },
        blobMove: {
          '0%,100%': { transform: 'translate(0,0) scale(1)', borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%' },
          '33%': { transform: 'translate(3%,-4%) scale(1.06)', borderRadius: '58% 42% 35% 65% / 55% 60% 40% 45%' },
          '66%': { transform: 'translate(-3%,3%) scale(0.96)', borderRadius: '35% 65% 55% 45% / 40% 55% 45% 60%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sheen: {
          '0%': { transform: 'translateX(-140%) rotate(8deg)' },
          '100%': { transform: 'translateX(140%) rotate(8deg)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.92) translateY(6px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0,0,.2,1) infinite',
        blobMove: 'blobMove 16s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        sheen: 'sheen 1.1s ease',
        popIn: 'popIn 0.3s cubic-bezier(.2,.9,.3,1.2)',
      },
    },
  },
  plugins: [],
}
