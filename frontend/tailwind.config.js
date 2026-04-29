/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d1ff',
          300: '#9db3ff',
          400: '#7089ff',
          500: '#4a5eff',
          600: '#2e3aff',
          700: '#1f27e6',
          800: '#1b22ba',
          900: '#1b2292',
          950: '#0e1255',
        },
        surface: '#0f1117',
        panel: '#161b27',
        border: '#232a3b',
      },
    },
  },
  plugins: [],
}
