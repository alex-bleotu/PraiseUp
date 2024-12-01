/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4491c2',
          lightVariant: '#c7d6fc',
          dark: '#8a56ac',
          darkVariant: '#3a2e48',
        },
        secondary: {
          light: '#CCE490',
          dark: '#ffb74d',
        },
        background: {
          light: '#e8e8e8',
          dark: '#1a1a1a',
        },
        paper: {
          light: '#ffffff',
          dark: '#2b2b2b',
          darkLight: '#dcdcdc',
          darkDark: '#383838',
        },
        text: {
          light: '#1a1a1a',
          dark: '#e6e6e6',
          inverted: {
            light: '#f2f2f2',
            dark: '#121212',
          },
          variant: '#9f9f9f',
          onPrimary: '#f2f2f2',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};