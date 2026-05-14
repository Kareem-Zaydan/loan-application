/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F4E79',
        accent: '#27AE60',
        error: '#E74C3C',
        warning: '#F39C12',
      },
    },
  },
  plugins: [],
};