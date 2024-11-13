export default {
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f",
        accent: {
          DEFAULT: "hsl(5deg 68.4% 55.3%)",
          500: "hsl(5deg 58.4% 45.3%)",
        },
        "on-accent": { DEFAULT: "#ffffff", 500: "#ffffff" },
        muted: {
          50: "hsl(0deg 0% 97.9%)",
          100: "hsl(0deg 0% 93.9%)",
          200: "hsl(0deg 0% 63.9%)",
          300: "hsl(0deg 0% 53.9%)",
          400: "hsl(0deg 0% 43.9%)",
          500: "hsl(0deg 0% 33.9%)",
        },
      },
    },
  },
  utopia: {
    // https://github.com/cwsdigital/tailwind-utopia?tab=readme-ov-file#customising-your-scales
    minScreen: "320px",
    minSize: 16,
    minScale: 1.125,
    maxScreen: "960px",
    maxSize: 18,
    maxScale: 1.2,
    textSizes: [],
    spacingSizes: {},
    spacingPairs: {},
    spacingCustomPairs: [],
  },
  plugins: [require("tailwind-utopia")],
};
