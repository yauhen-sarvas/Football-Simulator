export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-in-out',
        'pulse-goal': 'pulseGoal 0.6s ease-in-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGoal: {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.5)', transform: 'scale(1)' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.3)', transform: 'scale(1.02)' },
          '100%': { backgroundColor: 'rgba(255, 255, 255, 0)', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
