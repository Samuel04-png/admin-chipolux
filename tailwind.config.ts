import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#fbf6ea",
        cream: "#f4ead8",
        sand: "#e3d3b7",
        champagne: "#c8a45d",
        copper: "#a66a43",
        ink: "#082b49",
        leaf: "#214d43",
        wine: "#8f1831",
        mist: "#edf0e7",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Manrope"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(8, 43, 73, 0.14)",
        card: "0 18px 45px rgba(8, 43, 73, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
