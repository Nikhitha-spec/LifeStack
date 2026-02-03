/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peacock: {
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#99cccc',
          300: '#66b2b2',
          400: '#339999',
          500: '#005F5F',
          600: '#005656',
          700: '#004747',
          800: '#003939',
          900: '#002a2a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      fontFamily: {
        clinical: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        black: '900',
      },
      animation: {
        'in': 'fadeIn 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
