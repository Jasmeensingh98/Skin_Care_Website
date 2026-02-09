export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c45c3e',
        foxtale: {
          coral: '#c45c3e',
          dark: '#2d2d2d',
          cream: '#faf9f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
