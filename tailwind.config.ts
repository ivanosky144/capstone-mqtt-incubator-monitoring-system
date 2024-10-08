import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white_purple: '#E6E0FF',
        ultralight_purple: '#ddd7f7',
        light_purple: '#D0C7F8',
        purple: '#988BCD',
        dark_purple: '#4E3A9D'
      }
    },
  },
  plugins: [],  
};
export default config;
