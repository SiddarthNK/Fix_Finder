/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0E0E0E",
        card: "#212121",
        "card-tier2": "#262626",
        muted: "#8A8A8A",
        accent: {
          DEFAULT: "#FF6A2B",
          hover: "#FF8250",
          tint: "rgba(255, 106, 43, 0.15)"
        },
        track: "#4A4A4A",
        pill: "#F2F2F2",
        "pill-text": "#1A1A1A"
      },
      fontFamily: {
        sans: ['Outfit', 'Urbanist', 'sans-serif']
      },
      borderRadius: {
        'bento': '36px',
        'inner': '20px'
      }
    },
  },
  plugins: [],
}
