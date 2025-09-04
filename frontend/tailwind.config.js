/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1D44D1',
          white: '#FFFFFF',
          red: '#D32F2F'
        },
        secondary: {
          gray: '#F5F5F5',
          green: '#25D366'
        },
        dark: {
          gray: '#333333'
        },
        light: {
          gray: '#E0E0E0'
        },
        success: {
          green: '#25D366'
        },
        warning: {
          orange: '#FF9800'
        },
        danger: {
          red: '#F44336'
        },
        helpmed: {
          blue: '#1D44D1',
          green: '#25D366',
          white: '#FFFFFF'
        }
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        exo: ['Exo', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        light: '0 2px 10px rgba(0,0,0,0.1)',
        medium: '0 4px 20px rgba(0,0,0,0.15)',
        heavy: '0 8px 30px rgba(0,0,0,0.2)',
        glow: '0 0 20px rgba(211,47,47,0.3)'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '24px'
      }
    }
  },
  plugins: []
}
