import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#d9e2ff',
          200: '#b0c4ff',
          300: '#7f9cff',
          400: '#4f75ff',
          500: '#264ee6',
          600: '#1c3bb4',
          700: '#132781',
          800: '#09154f',
          900: '#02051f'
        }
      }
    }
  },
  plugins: [],
};

export default config;
