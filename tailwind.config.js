/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulse: {
          pink: '#FF0099',
          purple: '#6A00FF',
          dark: '#0A0A0A',
          darker: '#050505',
          gray: '#1A1A1A',
          'gray-light': '#2A2A2A'
        }
      },
      backgroundImage: {
        'gradient-pulse': 'linear-gradient(to right, #FF0099, #6A00FF)',
        'gradient-dark': 'linear-gradient(to bottom, #0A0A0A, #050505)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}