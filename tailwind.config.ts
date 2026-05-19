import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': '#0a0c1a',
        'text-primary': '#e8e8f0',
        'accent-gold': '#f5c542',
        'accent-violet': '#7c6df5',
        'accent-teal': '#3dd6ac',
        'accent-red': '#f55c5c',
        'border-pixel': '#2a2d4a',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
