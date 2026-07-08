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
        background: '#F9F8F6', // Warm Alabaster Cream (#F9F8F6)!
        card: {
          DEFAULT: '#ffffff',  // Crisp white cards on warm cream background!
          hover: '#EFE9E3',    // Soft Stone / Linen hover (#EFE9E3)!
          elevated: '#ffffff',
          stone: '#EFE9E3',
        },
        primary: {
          DEFAULT: '#C9B59C',  // Warm Champagne Gold accent (#C9B59C)!
          light: '#d6c6b0',    // Lighter champagne
          dark: '#b39d82',     // Richer bronze
          glow: 'rgba(201, 181, 156, 0.35)',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.12)',
        },
        info: {
          DEFAULT: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.12)',
        },
        border: '#D9CFC7',     // Refined Taupe / Stone border (#D9CFC7)!
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 25px rgba(201, 181, 156, 0.25)',
        'glow-lg': '0 0 50px rgba(201, 181, 156, 0.35)',
        'glass': '0 10px 30px -5px rgba(28, 25, 23, 0.08), 0 4px 6px -2px rgba(28, 25, 23, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
