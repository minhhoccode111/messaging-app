/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-sm': 'repeat(auto-fit, minmax(160px, 1fr))',
        'auto-md': 'repeat(auto-fit, minmax(220px, 1fr))',
        'custom': 'max-content 1fr',
      },
      colors: {
        'semi-transparent': '#ffffffef',
        link: '#0ea5e9',
        danger: '#ef4444',
        busy: '#ef4444',
        warn: '#eab308',
        afk: '#eab308',
        success: '#22c55e',
        online: '#22c55e',
      },
      aspectRatio: {
        '2/3': '2 / 3',
        '3/2': '3 / 2',
        '9/16': '9 / 16',
      },
    },
  },
};
