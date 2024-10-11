import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neutral_whtie:"#fafafa",
        neutral_100:"#120E11",
        neutral_200:"#cccbcb",
        neutral_300:"#b5b3b3",
        neutral_400:"#9f9c9c",
        neutral_500:"#898384",
        neutral_600:"#726c6c",
        neutral_700:"#5a5555",
        neutral_800:"#433e3f",
        neutral_900:"#2b2829",
        neutral_1000:"#151314",
        base_black:"#0a0a0b",
        primary:{
          0:"#4F1787"
        }
      },
    },
  },
  plugins: [],
};
export default config;
