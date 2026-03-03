/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        'terminal-green': '#3fb950',
        'terminal-blue': '#79c0ff',
        'terminal-purple': '#d2a8ff',
        'terminal-orange': '#ffa657',
        'terminal-red': '#f78166',
        'terminal-yellow': '#e3b341',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(63, 185, 80, 0)' },
          '50%': { boxShadow: '0 0 20px 2px rgba(63, 185, 80, 0.12)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        }
      },
      boxShadow: {
        'card-dark': '0 0 0 1px rgba(125,167,217,0.08), 0 4px 24px rgba(0,0,0,0.5)',
        'card-hover-dark': '0 0 0 1px rgba(63,185,80,0.2), 0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(63,185,80,0.06)',
        'nav-dark': '0 1px 0 rgba(125,167,217,0.08)',
      }
    },
  },
  plugins: [],
}
