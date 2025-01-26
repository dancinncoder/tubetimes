import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // set the route of using files
  ],
  theme: {
    extend: {
      screens: {
        xs: "570px",
        sm: "750px",
        md: "1090px",
        lg: "1280px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
