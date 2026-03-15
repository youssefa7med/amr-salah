/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFBF0',
          100: '#FFF3D6',
          400: '#D4AF37',
          500: '#B8860B',
          600: '#9B6B0F',
        },
        midnight: '#0A0F1E',
        'dark-bg': '#111827',
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      backdropFilter: {
        'blur-20': 'blur(20px)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
