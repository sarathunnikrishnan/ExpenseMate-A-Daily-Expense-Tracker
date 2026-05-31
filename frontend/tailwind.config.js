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
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'blob': 'blob 10s infinite alternate cubic-bezier(0.45, 0, 0.55, 1)',
        'float': 'float 6s ease-in-out infinite',
        'zoom-in': 'zoomIn 20s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' },
          '33%': { transform: 'translate(40px, -60px) scale(1.2) rotate(10deg)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.8) rotate(-10deg)', borderRadius: '50% 60% 40% 60% / 40% 60% 50% 60%' },
          '100%': { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
    },
  },
  plugins: [],
}
