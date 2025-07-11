// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone:          '#F3F0E7',
        midnight:      '#171717',
        'desert-rose': '#E1A6A6',
        'sparrow-gray':'#4F5B4E',
        background:    'var(--background)',
        foreground:    'var(--foreground)',
      },
      fontFamily: {
        sans:   ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        serif:  ['var(--font-serif)', ...defaultTheme.fontFamily.serif],
        display:['sancreek', 'cursive'],
      },
    },
  },
  plugins: [],
};
