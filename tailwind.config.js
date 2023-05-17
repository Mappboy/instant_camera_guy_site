module.exports = {
    content: ['./src/**/*.{html,webc,liquid,njk}'],
    theme: {},
    variants: {},
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/container-queries'),
        ],
  };
  