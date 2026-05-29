import type { Config } from 'tailwindcss';

// Мобильный-первый дизайн. Тёмно-синяя «премиальная» палитра + тёплый акцент.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a', // основной тёмный
        accent: '#c9a36a', // тёплое золото (ощущение «дороже»)
        soft: '#f5f3ee', // тёплый светлый фон
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
