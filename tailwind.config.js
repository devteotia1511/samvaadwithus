/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFE8E8',
          100: '#FFCACA',
          200: '#FF9D9D',
          300: '#FF7070',
          400: '#FF4242',
          500: '#D30000',  // Main brand red
          600: '#B50000',
          700: '#8F0000',
          800: '#6D0000',
          900: '#4B0000',
        },
        dark: {
          50: '#737373',
          100: '#595959',
          200: '#404040',
          300: '#2E2E2E',
          400: '#1C1C1C',
          500: '#0D0D0D',  // Main dark background
          600: '#0A0A0A',
          700: '#070707',
          800: '#050505',
          900: '#030303',
        },
        accent: {
          50: '#FFF1E8',
          100: '#FFE1CA',
          200: '#FFC49D',
          300: '#FFA270',
          400: '#FF8042',
          500: '#FF5E14',
          600: '#DB4600',
          700: '#B73A00',
          800: '#8F2D00',
          900: '#671F00',
        },
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'curtain-left': 'curtainLeft 1.5s ease-out forwards',
        'curtain-right': 'curtainRight 1.5s ease-out forwards',
        'spotlight': 'spotlight 8s infinite',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.8s ease-out forwards',
      },
      keyframes: {
        curtainLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        curtainRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        spotlight: {
          '0%, 100%': { opacity: 0.7, transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.2)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};