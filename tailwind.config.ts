import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{ts,tsx}", "./content/**/*.mdx", "./public/**/*.svg"],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-inter), system-ui, sans-serif",
        display: "var(--font-satoshi), system-ui, sans-serif",
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        // Godawari Hacks teal: buttons, links, focus rings, the dark band.
        brand: {
          DEFAULT: "#084750",
          light: "#0a5a63",
          dark: "#063a40",
        },
        // Hairline used for the page grid: section rules and cell dividers.
        "grid-border": colors.neutral[200],
      },
      // Width of the framed content column every section sits in.
      maxWidth: {
        "grid-width": "1080px",
      },
      width: {
        "grid-width": "1080px",
      },
      keyframes: {
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(var(--offset, 2px))" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out forwards",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
