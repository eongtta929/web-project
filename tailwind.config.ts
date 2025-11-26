import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gukbap: {
          ivory: "#FFF8F0",
          cream: "#F5E6D3",
          brown: "#8B6F47",
          darkBrown: "#5C4A2F",
          red: "#D84315",
          lightRed: "#FF6F43",
        },
      },
    },
  },
  plugins: [],
};
export default config;

