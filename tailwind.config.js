/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#686F59',
        secondary: '#CED2C5',
        dark: '#414833',
        light: '#89917A',
        thinGray: '#C1C1C1',
        receiptGray: '#EFEFEF',
        cardBg: '#E1E1E1',
      },
      fontFamily: {
        'ovo': ['Ovo', 'serif'], // Custom name for Ovo font
      },
    },
  },
  plugins: [],
};
