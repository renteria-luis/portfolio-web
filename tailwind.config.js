/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable holding raw RGB channels, so Tailwind can
// still apply opacity modifiers (text-terminal-green/70) *and* the whole
// palette swaps theme by flipping one class on <html>. That is what lets the
// components drop their `dark` prop entirely — see src/index.css for the values.
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

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
        // accents
        'terminal-green':  themed('c-green'),
        'terminal-blue':   themed('c-blue'),
        'terminal-purple': themed('c-purple'),
        'terminal-orange': themed('c-orange'),
        'terminal-red':    themed('c-red'),
        'terminal-yellow': themed('c-yellow'),
        // text ramp: tb brightest -> t3 faintest
        tb: themed('tb'),
        t1: themed('t1'),
        t2: themed('t2'),
        t3: themed('t3'),
        // surfaces
        surface: themed('surface'),
        navbg:   themed('nav'),
        footerbg: themed('footer'),
        line:    themed('line'),
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
        },
      },
    },
  },
  plugins: [],
};
