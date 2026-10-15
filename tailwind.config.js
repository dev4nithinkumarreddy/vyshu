/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#f2f9f5',
          100: '#e1f2e8',
          200: '#c5e4d2',
          300: '#9bcfb3',
          400: '#6bb38f',
          500: '#469671',
          600: '#347859',
          700: '#2a6048',
          800: '#234d3b',
          900: '#1e4032',
        },
        warm: {
          cream: '#fdfbf7',
          amber: '#f59e0b',
          gold: '#d97706',
          sand: '#fef3c7',
        },
        pastel: {
          pink: '#ffd1dc',
          purple: '#e6e6fa',
          blue: '#aec6cf',
          yellow: '#fdfd96',
          sage: '#dbe7e1',
        }
      },
      fontFamily: {
        cursive: ['"Dancing Script"', '"Great Vibes"', 'cursive'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        '3d-soft': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 25px -5px rgba(46, 125, 50, 0.05)',
        '3d-elevated': '0 30px 60px -12px rgba(15, 23, 42, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.2)',
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}
