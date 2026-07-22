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
        surface: '#F8FAFC',
        ink: '#0B1120',
        ink2: '#111827',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.25)',
        glow: '0 0 40px rgba(37,99,235,0.35)',
      },
      backdropBlur: {
        xs: '2px',
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
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0,0,.2,1) infinite',
      },
    },
  },
  plugins: [],
}
