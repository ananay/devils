import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a9b8',
          400: '#ec7791',
          500: '#df4b6d',
          600: '#cb2d54',
          700: '#aa2145',
          800: '#8e1f3e',
          900: '#722F37',
          950: '#440c1a',
        },
        gold: {
          50: '#fcf9eb',
          100: '#f9f0c9',
          200: '#f3df95',
          300: '#ecc857',
          400: '#e4b02d',
          500: '#D4AF37',
          600: '#b8790f',
          700: '#935710',
          800: '#7a4514',
          900: '#683a17',
          950: '#3c1d09',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config





