/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-teal": "#1a6c76"
      },
      animation: {
        "progress-shrink": "progress-shrink linear",
        "fade-in": "fadeIn 0.3s ease-in",
      },
      keyframes: {
        "fadeIn": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "progress-shrink": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    }
  },
  plugins: [],
}


