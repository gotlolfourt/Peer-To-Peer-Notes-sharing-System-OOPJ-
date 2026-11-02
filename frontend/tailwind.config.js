/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0D0C',
          DEFAULT: '#101211', // Deep ink black
          surface: '#151816',
          charcoal: '#191D19', // Warm charcoal
          elevated: '#212621',
        },
        lime: {
          glow: '#E2F988',
          DEFAULT: '#D5F36A', // Primary acid lime accent
          dark: '#B0CE44',
          muted: '#8CA537',
        },
        sage: {
          light: '#C2D1BA',
          DEFAULT: '#A5B89B', // Muted sage
          dark: '#7D9073',
          border: '#343A32', // Subtle olive grey
        },
        ivory: {
          DEFAULT: '#F1EFE5', // Warm ivory text
          muted: '#969B91', // Secondary text
          dim: '#686E64',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 30px -5px rgba(213, 243, 106, 0.25)',
        'glow-lime-lg': '0 0 50px -10px rgba(213, 243, 106, 0.35)',
        'card-dark': '0 12px 32px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(52, 58, 50, 0.5)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-reverse': 'floatRev 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-1.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
