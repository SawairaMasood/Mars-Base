/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#04070D',
          900: '#080D18',
          800: '#101827',
          700: '#142136',
          600: '#1B2C47',
          500: '#284168',
        },
        mars: {
          DEFAULT: '#FF754F',
          dark: '#D94E27',
          light: '#FFA085',
          glow: 'rgba(255, 117, 79, 0.4)',
        },
        hud: {
          cyan: '#50D9EA',
          teal: '#2DD4BF',
          green: '#61D69A',
          amber: '#F1C56B',
          red: '#FF596F',
          text: '#F2F5FA',
          muted: '#8A99AD',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'hud-glow': '0 0 15px rgba(80, 217, 234, 0.25)',
        'mars-glow': '0 0 20px rgba(255, 117, 79, 0.3)',
        'danger-glow': '0 0 20px rgba(255, 89, 111, 0.4)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'radar-spin': 'spin 6s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
