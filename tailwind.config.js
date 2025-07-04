/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        libraryPrimary: '#4A90E2',
        librarySecondary: '#F4A261',
        libraryAccent: '#2A9D8F',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        libraryTheme: {
          primary: '#4A90E2',
          secondary: '#F4A261',
          accent: '#2A9D8F',
          neutral: '#2B2D42',
          'base-100': '#F8FAFC',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
      'light',
      'dark',
    ],
  },
};