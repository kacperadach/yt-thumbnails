module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-green": "#08d087",
      },
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      fadeOut: {
        '0%': { opacity: 1, transform: 'translateY(0)' },
        '100%': { opacity: 0, transform: 'translateY(-20px)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.5s ease-out',
      fadeOut: 'fadeOut 0.5s ease-in',
    },
  },
  plugins: [],
};
