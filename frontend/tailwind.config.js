/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'street-green': '#65FFC5',
        'street-green-light': '#8AFFD2',
        'street-green-dark': '#46DFA7',
        'street-gold': '#65FFC5',
        'street-gold-light': '#8AFFD2',
        'street-blue': '#65FFC5',
        'street-blue-light': '#8AFFD2',
        'street-red': '#FF6B7A',
        'street-orange': '#FFB86B',
        'dark': '#090909',
        'dark-light': '#0C0C0C',
        'dark-lighter': '#121212',
        'dark-card': '#111111',
        'dark-border': '#242424',
        'ice': '#F5F5F5',
        'ice-dim': '#A1A1AA',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        orbitron: ['Space Grotesk', 'sans-serif'],
        oxanium: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glow-green': 'glowGreen 2s ease-in-out infinite alternate',
        'glow-gold': 'glowGold 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite',
        'rotate-glow': 'rotateGlow 4s linear infinite',
        'glitch': 'glitch 3s infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)' },
        },
        glowGreen: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.5), 0 0 10px rgba(0, 191, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 191, 255, 0.5)' },
        },
        glowGold: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0, 255, 136, 0.3)' },
          '50%': { borderColor: 'rgba(0, 255, 136, 0.8)' },
        },
        textShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        rotateGlow: {
          '0%': { transform: 'rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)', filter: 'hue-rotate(360deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [],
}