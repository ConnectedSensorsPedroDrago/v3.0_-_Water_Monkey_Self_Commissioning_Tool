/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'add-device': './public/addDevice.svg'
      },
    },
    colors: {
      "dark-grey": "#333333",
      "purple": "#91298C",
      "light-purple": "#91298c47",
      "grey": "#8E8E8E",
      "green": "#00935B",
      "red": "#870000",
      "yellow": "#E8D12A",
      "blue": "#565382",
      "white": "#FFFFFF",
      "blue-hard": "#292561",
      "light-yellow": "#e8d12a24"
    },
  },
  
  fontFamily: {
    sans: ['var(--font-firasans)'],
  },
  plugins: [],
}
