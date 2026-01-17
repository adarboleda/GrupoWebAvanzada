/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sobrescribir colores con formato RGB compatible con html2pdf
        blue: {
          50: 'rgb(239, 246, 255)',
          100: 'rgb(219, 234, 254)',
          200: 'rgb(191, 219, 254)',
          300: 'rgb(147, 197, 253)',
          400: 'rgb(96, 165, 250)',
          500: 'rgb(59, 130, 246)',
          600: 'rgb(37, 99, 235)',
          700: 'rgb(29, 78, 216)',
          800: 'rgb(30, 64, 175)',
          900: 'rgb(30, 58, 138)',
        },
        gray: {
          50: 'rgb(249, 250, 251)',
          100: 'rgb(243, 244, 246)',
          200: 'rgb(229, 231, 235)',
          300: 'rgb(209, 213, 219)',
          400: 'rgb(156, 163, 175)',
          500: 'rgb(107, 114, 128)',
          600: 'rgb(75, 85, 99)',
          700: 'rgb(55, 65, 81)',
          800: 'rgb(31, 41, 55)',
          900: 'rgb(17, 24, 39)',
        },
        green: {
          500: 'rgb(34, 197, 94)',
          600: 'rgb(22, 163, 74)',
        },
        red: {
          500: 'rgb(239, 68, 68)',
          700: 'rgb(185, 28, 28)',
        },
        yellow: {
          100: 'rgb(254, 249, 195)',
          200: 'rgb(254, 240, 138)',
        },
      },
    },
  },
  plugins: [],
};
