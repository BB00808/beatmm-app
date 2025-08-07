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
        primary: '#007AFF',
        secondary: '#5856D6',
        accent: '#FF3B30',
        dark: {
          100: '#1C1C1E',
          200: '#2C2C2E',
          300: '#3A3A3C',
          400: '#48484A',
          500: '#636366',
        }
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}

