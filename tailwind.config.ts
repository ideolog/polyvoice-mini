import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        card: "#181818",
        cardSoft: "#0F0F0F",
        dark: "#111111",
      },
      borderRadius: {
        xxl: "20px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
