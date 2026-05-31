/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#64748B', // Slate 500
          dark: '#00ADB5',  // Teal from palette
        },
        background: {
          light: '#F8FAFC', // Slate 50
          dark: '#222831',  // Darkest slate
        },
        card: {
          light: '#FFFFFF',
          dark: '#393E46',  // Medium dark slate
        },
        text: {
          light: '#1E293B', // Slate 800 for readability
          dark: '#EEEEEE',  // Off white
        }
      }
    },
  },
  plugins: [],
}
