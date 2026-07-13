/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Engineering Notebook / Technical SaaS Design Tokens
        surface: '#FAFAF7',
        background: '#FAFAF7',
        grid: '#E4E2D8',
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#FAFAF7',
        },
        muted: '#F5F5F0',
        border: '#E4E2D8',
        
        brand: {
          DEFAULT: '#2E7D8C', // Primary Accent
          secondary: '#39A0B0', // Secondary Accent
          warm: '#C9762E', // Warm Accent
        },
        accent: {
          DEFAULT: '#2E7D8C',
          secondary: '#39A0B0',
          warm: '#C9762E',
        },
        'text-primary': '#16233D',
        'text-secondary': '#4A5568',
        'text-muted': '#8A93A6',
        
        success: '#2E7D8C',
        danger: '#C9762E',
        warning: '#C9762E',
        info: '#39A0B0',
        
        primary: {
          DEFAULT: '#2E7D8C',
          secondary: '#39A0B0',
          warm: '#C9762E',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 0 rgba(22,35,61,0.03)',
        'elevation-1': '0 1px 3px rgba(22,35,61,0.05), 0 1px 2px rgba(22,35,61,0.03)',
        'elevation-2': '0 4px 12px rgba(22,35,61,0.06), 0 1px 2px rgba(22,35,61,0.04)',
        'elevation-3': '0 12px 28px rgba(22,35,61,0.08), 0 2px 4px rgba(22,35,61,0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',  // 12px
        '2xl': '0.875rem', // 14px
        '3xl': '1rem',     // 16px
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-up': 'fadeUp 0.35s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
