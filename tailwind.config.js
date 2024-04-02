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
        dark: '#414833'
      },
      fontFamily: {
        'ovo': ['Ovo', 'serif'], // Custom name for Ovo font
      },
    },
  },
  plugins: [],
};
