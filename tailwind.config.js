// /** @type {import('tailwindcss').Config} */
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx}",
    "*/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    // "!./node_modules",
  ],
  theme: {
    extend: {},
    screens: {
      phone: { min: "280px", max: "767px" },
      // => @media (min-width: 640px and max-width: 767px) { ... }
      ...defaultTheme.screens,
    },
  },
  plugins: [require("flowbite/plugin")],
};
