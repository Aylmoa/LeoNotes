export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        base: {
          900: '#0f0f13',
          800: '#16161d',
          700: '#1c1c26',
          600: '#23232f',
          500: '#2e2e3a',
          400: '#3d3d4f',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.3), 0 4px 24px rgba(139,92,246,0.12)',
      },
    },
  },
  plugins: [],
}